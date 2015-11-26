
var defaultTimeout = 60000,
  argv = require('yargs').argv;

var addReporters = function(browserName) {
  var SpecReporter = require('jasmine-spec-reporter'), // Improved CLI reporter
    reporters = require('jasmine-reporters'), // We'll use the junitXML-Reporter here.
    path = require('path');
  var junitReporter = new reporters.JUnitXmlReporter({
    savePath: path.join(__dirname, '../reports/', browserName, '/')
  });

  jasmine.getEnv().addReporter(new SpecReporter());
  jasmine.getEnv().addReporter(junitReporter);
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
      // E.g., we might add a better structured command line reporter.
      require('babel-core/register');

      return browser.getCapabilities().then(function (caps) {
        global.browserCapabilities = caps;
        addReporters(caps.get('browserName'));
      });
    }
  };

  if (argv.remote) {
    options.seleniumAddress = argv.remote + '/wd/hub';
  }

  return options;
};

module.exports = generator();
