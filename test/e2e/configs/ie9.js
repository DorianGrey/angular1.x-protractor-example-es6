/**
 * Although it possible to write protractor tests the ES6 way using Babel, we have to write this config file in the old ES5-way, even when used with a recent Node version (>= 4).
 * One of only a few exceptions is the => syntax for anonymous functions.
 */
var baseConfig = require('./baseConfig'),
  _ = require('lodash/object');

var specificConfig = {
  capabilities: {
    // The browser's name, obviously.
    browserName: 'internet explorer',
    version: '9',
    // Only essentially required for Internet Explorer, ignored otherwise.
    ignoreProtectedModeSettings: true
  }
};

module.exports.config = _.merge(baseConfig, specificConfig);
