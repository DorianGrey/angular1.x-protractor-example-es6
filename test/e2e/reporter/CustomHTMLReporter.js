import path from 'path';
import del from 'del';
import {readFileSync, createWriteStream, openSync, writeSync, closeSync} from 'fs';
import _ from 'lodash';
import mkdirp from 'mkdirp';

import handlebars from 'handlebars';
import uuid from 'node-uuid';

// Helper functions for interacting with a spec or suite.
function elapsed(start, end) {
  return (end - start) / 1000;
}

function isFailed(obj) {
  return obj.status === 'failed';
}

function isSkipped(obj) {
  return obj.status === 'pending';
}

function isDisabled(obj) {
  return obj.status === 'disabled';
}

function writeScreenshot(data, filename) {
  let stream = createWriteStream(filename);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}

function escapeInvalidHtmlChars(str) {
  return _.escape(str).replace(/(?:\r\n|\r|\n)/g, '<br />');
}

function createQualifiedSuiteName(suite, isFilename) {
  let fullName = suite.description;
  for (let parent = suite._parent; parent; parent = parent._parent) {
    fullName = parent.description + ' > ' + fullName;
  }

  // Either remove or escape invalid HTML characters
  if (isFilename) {
    let fileName = '',
      rFileChars = /[\w\.]/,
      chr;
    while (fullName.length) {
      chr = fullName[0];
      fullName = fullName.substr(1);
      if (rFileChars.test(chr)) {
        fileName += chr;
      }
    }
    return fileName;
  } else {
    return escapeInvalidHtmlChars(fullName);
  }
}

function toFixedPercentage(num, dec) {
  let d = Math.pow(10, dec);
  return (Math.round(num * d) / d).toFixed(dec);
}

export class CustomHTMLReporter {

  constructor(browserCapabilities, options) {
    // We'll use this promise to chain the `browser.takeScreenshot()` accesses.
    // This is required since after `jasmineDone`, we'll have to somehow `wait` for the last screenshot to be taken before the report is written.
    // The easiest way to do so is to use a WebDriverJs promise, since these are scheduled within its flow, i.e. it will prevent the process from stopping before
    // it is either resolved or the default timeout occurs.
    this.writeReportPromise = protractor.promise.when({});

    options = options || {};
    this.started = this.finished = false;

    this.reportOptions = {};
    this.reportOptions.browserName = browserCapabilities.get('browserName') || uuid.v4(); // If non specified, use a UUID here.
    // Options regarding the report's save path and name.
    this.reportOptions.savePath = options.savePath || path.join(__dirname, '..', 'reports', this.reportOptions.browserName, '/');
    this.reportOptions.fileName = options.fileName || 'htmlReport';
    // Options regarding screenshots.
    this.reportOptions.screenshots = options.screenshots || {};
    this.reportOptions.screenshots.path = this.reportOptions.screenshots.path || path.join(this.reportOptions.savePath, 'screenshots', '/');
    this.reportOptions.screenshots.take = _.isUndefined(this.reportOptions.screenshots.take) ? true : !!this.reportOptions.screenshots.take;
    this.reportOptions.screenshots.onFailureOnly = !!this.reportOptions.screenshots.onFailureOnly;

    // You might add further options regarding consolidation of tests - however, in most cases, they are not that essentially required.

    // Load compiled templates.
    this.compilers = {
      browserInfo: handlebars.compile(readFileSync(path.join(__dirname, 'templates/browserInfo.hbs')).toString()),
      suiteInfo: handlebars.compile(readFileSync(path.join(__dirname, './templates/suite.hbs')).toString()),
      report: handlebars.compile(readFileSync(path.join(__dirname, './templates/report.hbs')).toString())
    };

    // Initiate the managing stuff.
    this.managed = {
      suites: [],
      __suitesMap: {},
      __specsMap: {},
      currentSuite: null,
      browserCapabilities: browserCapabilities,
      totalSpecsExecuted: 0,
      totalSpecsDefined: 0,
      // When using `fit`, jasmine never calls suiteStarted / suiteDone, so a faked replacement is required.
      fakeFocusedSuite: {
        id: 'focused',
        description: 'focused specs',
        fullName: 'focused specs'
      }
    };
  }

  compileBrowserInfoHeader() {
    if (!this.managed.browserCapabilities) {
      // Cannot do something useful without capabilities...
      return;
    }
    this.managed.browserCapabilities = this.managed.browserCapabilities.caps_ || this.managed.browserCapabilities; // The caps_ variant is used sometimes.
    // A capability entry might consist of an object, however, we want strict string(key) -> string(value).
    let caps = _.map(this.managed.browserCapabilities, function (value, key) {
      if (_.isObject(value)) {
        value = JSON.stringify(value);
      }
      return {
        value: value,
        key: key
      }
    });

    // See test/e2e/reporter/templates/browserInfo.hbs.
    return this.compilers.browserInfo({caps: caps});
  }

  compileSuiteInfo(suite) {
    let data = {
      suiteName: createQualifiedSuiteName(suite),
      suiteElapsed: elapsed(suite._startTime, suite._endTime),
      testCnt: suite._specs.length,
      skipped: suite._skipped,
      failed: suite._failures
    };

    data.specs = _.map(suite._specs, (spec) => {
      var num_tests = spec.failedExpectations.length + spec.passedExpectations.length;
      var percentage = (spec.passedExpectations.length * 100) / num_tests;
      return {
        screenshot: spec.screenshot ? `screenshots/${spec.screenshot}` : false,
        successQuota: toFixedPercentage(percentage, 2),
        successQuotaNatural: Math.round(percentage),
        description: escapeInvalidHtmlChars(spec.description),
        elapsed: elapsed(spec._startTime, spec._endTime),
        failedExpectations: spec.failedExpectations,
        passedExpectations: spec.passedExpectations,
        isNonEmptySpecResult: spec.failedExpectations.length > 0 || spec.passedExpectations.length > 0
      };
    });

    return this.compilers.suiteInfo(data);
  }

  getNestedOutput(suite) {
    let output = this.compileSuiteInfo(suite);
    suite._suites.forEach((subSuite) => {
      output += this.getNestedOutput(subSuite);
    });

    return output;
  }

  getSuite(suite) {
    this.managed.__suitesMap[suite.id] = _.extend(this.managed.__suitesMap[suite.id] || {}, suite);
    return this.managed.__suitesMap[suite.id];
  }

  getSpec(spec) {
    this.managed.__specsMap[spec.id] = _.extend(this.managed.__specsMap[spec.id] || {}, spec);
    return this.managed.__specsMap[spec.id];
  }

  // Functions implemented to fulfill the jasmine2 reporter API.
  jasmineStarted(summary) {
    del.sync(this.reportOptions.savePath);
    this.managed.totalSpecsDefined = summary && summary.totalSpecsDefined || NaN;
    this.managed.startTime = new Date();
  }

  suiteStarted(suite) {
    suite = this.getSuite(suite);
    suite._startTime = new Date();
    suite._specs = []; // All specs having this spec as a parent
    suite._suites = []; // All suites having this suite as a parent
    suite._failures = 0;
    suite._skipped = 0;
    suite._disabled = 0;
    suite._parent = this.managed.currentSuite;
    if (!this.managed.currentSuite) {
      this.managed.suites.push(suite);
    } else {
      this.managed.currentSuite._suites.push(suite);
    }
    this.managed.currentSuite = suite;
  }

  specStarted(spec) {
    if (!this.managed.currentSuite) {
      // A focused spec (fit) was called - runs without a suite, i.e. `suiteStarted` was never called.
      this.suiteStarted(this.managed.fakeFocusedSuite);
    }
    spec = this.getSpec(spec);
    spec._startTime = new Date();
    spec._suite = this.managed.currentSuite;
    this.managed.currentSuite._specs.push(spec);
  }

  specDone(spec) {
    spec = this.getSpec(spec);
    spec._endTime = new Date();
    isSkipped(spec) && spec._suite._skipped++;
    isDisabled(spec) && spec._suite._disabled++;
    isFailed(spec) && spec._suite._failures++;
    this.managed.totalSpecsExecuted++;

    if (
      this.reportOptions.screenshots.take && // If screenshots should be taken ...
      (!this.reportOptions.screenshots.onFailureOnly // ... and it should always be taken ...
      || (this.reportOptions.screenshots.onFailureOnly && isFailed(spec))) // ... or on failures only and the spec contains a failure
    ) {
      let screenStep = browser.takeScreenshot().then((pngImage) => {
        let screenshotId = `${uuid.v1()}.png`,
          screenshotPath = path.join(this.reportOptions.screenshots.path, screenshotId);

        spec.screenshot = screenshotId;
        mkdirp.sync(path.dirname(screenshotPath));
        writeScreenshot(pngImage, screenshotPath);
      });

      this.writeReportPromise = this.writeReportPromise.then(screenStep);
    }
  }

  suiteDone(suite) {
    suite = this.getSuite(suite);
    if (_.isUndefined(suite._parent)) { // `null` is ok, since it's marked as "have seen this already"
      this.suiteStarted(suite);
    }
    suite._endTime = new Date();
    this.managed.currentSuite = suite._parent;
  }

  jasmineDone() {
    if (this.managed.currentSuite) {
      // A focused spec (fit) was called - runs without a suite, i.e. `suiteStarted` was never called.
      this.suiteDone(this.managed.fakeFocusedSuite);
    }

    this.writeReportPromise.then(() => {
      let output = this.compileBrowserInfoHeader();
      this.managed.suites.forEach((suite) => {
        output += this.getNestedOutput(suite);
      });

      if (output) {
        this.writeFile(this.reportOptions.fileName, output);
      }

      this.finished = true;
      this.managed.endTime = new Date();
    });
  }

  // EO jasmine2 reporter API

  // Write result file helper
  writeFile(filename, text) {
    let reportOpts = {
      styleContent: readFileSync(path.join(__dirname, 'report.css')),
      dataContent: text
    };

    if (filename.substr(-5) !== '.html') {
      filename += '.html';
    }

    let targetPath = this.reportOptions.savePath,
      content = this.compilers.report(reportOpts);
    mkdirp.sync(targetPath); // make sure the path exists

    let filePath = path.join(targetPath, filename),
      htmlFile = openSync(filePath, 'w');
    writeSync(htmlFile, content, 0);
    closeSync(htmlFile);
  }

}