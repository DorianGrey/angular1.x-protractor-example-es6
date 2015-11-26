var defaultTimeout = 60000,
  argv = require('yargs').argv,
  _ = require('lodash/array');

var addReporters = function (caps) {
  var SpecReporter = require('jasmine-spec-reporter'), // Improved CLI reporter
    reporters = require('jasmine-reporters'), // We'll use the junitXML-Reporter here.
    CustomHTMLReporter = require('../reporter/CustomHTMLReporter').CustomHTMLReporter,
    path = require('path');

  var htmlReporter = new CustomHTMLReporter(caps);

  var junitReporter = new reporters.JUnitXmlReporter({
    savePath: path.join(__dirname, '../reports/', caps.get('browserName').replace(/\s+/g, '-'), '/')
  });

  jasmine.getEnv().addReporter(new SpecReporter());
  jasmine.getEnv().addReporter(junitReporter);
  jasmine.getEnv().addReporter(htmlReporter);
};

var generator = function () {
  var options = {
    // Set jasmine2 to be used as testing framework.
    framework: 'jasmine2',
    getPageTimeout: defaultTimeout,
    allScriptsTimeout: defaultTimeout,
    defaultTimeoutInterval: defaultTimeout,
    // Just to get a more colored highlighting in the spec results.
    jasmineNodeOpts: {
      showColors: true
    },
    // This function is called by protractor once it loaded itself. Any further steps to be performed before executing the tests has to be placed here.
    onPrepare: () => {
      require('babel-core/register');
      // This is a ... hack. Yes. But currently, this is the ONLY option to intercept the default 'Passed.' result and add your own message.
      require('jasmine2-custom-message');
      var baseExpectationResult = jasmine.Spec.prototype.addExpectationResult;
      jasmine.Spec.prototype.addExpectationResult = function (passed, data, isError) {
        var lastAdded;
        baseExpectationResult.call(this, passed, data, isError);
        if (passed) {
          lastAdded = _.last(this.result.passedExpectations);
        }
        if (lastAdded && (!lastAdded.message || lastAdded.message === 'Passed.')) {
          return lastAdded.message = data.message;
        }
      };
      // EO hack.

      return browser.getCapabilities().then(function (caps) {
        global.browserCapabilities = caps;
        addReporters(caps);
      });
    }
  };

  if (argv.remote) {
    options.seleniumAddress = argv.remote + '/wd/hub';
  }

  return options;
};

module.exports = generator();
