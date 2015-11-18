/**
 * Although it possible to write protractor tests the ES6 way using Babel, we have to write this config file in the old ES5-way, even when used with a recent Node version (>= 4).
 * One of only a few exceptions is the => syntax for anonymous functions.
 */

var defaultTimeout = 60000;
module.exports = {
  // Protractor expects an object called 'config' to be exported from this file.
  config: {
    capabilities: {
      // The browser's name, obviously.
      browserName: 'chrome',
      // Only essentially required for Internet Explorer, ignored otherwise.
      ignoreProtectedModeSettings: true,
      chromeOptions: {
        args: ['--lang=en-GB'],
        prefs: {
          intl: {
            "accept_languages": "en-GB,en"
          }
        }
      }
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
    }
  }
};