var defaultTimeout = 60000;

// Protractor expects an object called 'config' to be exported from this file.
module.exports = {
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
    SpecReporter = require('jasmine-spec-reporter');
    jasmine.getEnv().addReporter(new SpecReporter());
  }
};
