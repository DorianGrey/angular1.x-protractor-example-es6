/**
 * Although it possible to write protractor tests the ES6 way using Babel, we have to write this config file in the old ES5-way, even when used with a recent Node version (>= 4).
 *
 */

var defaultTimeout = 60000;
module.exports = {
  // Protractor expects an object called 'config' to be exported from this file.
  config: {
    capabilities: {
      // The browser's name, obviously.
      browserName: 'firefox',
      // Only essentially required for Internet Explorer, ignored otherwise.
      ignoreProtectedModeSettings: true
    },
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

      // To write test cases the ES6 way using Babel, we have to call the register hook here.
      // If you want to use CoffeeScript for the tests, you only have to make sure it is properly installed - manually calling this hook is NOT required in that case.
      require("babel-core/register");
    }
  }
};