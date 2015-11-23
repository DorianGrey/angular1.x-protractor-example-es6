/**
 * Based on https://github.com/mllrsohn/gulp-protractor, which wasn't updated to work with Protractor 3.x yet.
 * Has been adopted to more properly fit ES6.
 */
import through from 'through';
import path from 'path';
import child_process from 'child_process';
import {PluginError} from 'gulp-util';

let winExt = /^win/.test(process.platform) ? ".cmd" : "";

export let getProtractorDir = (() => {
  let protractorDir = null;
  return function () {
    if (protractorDir) {
      return protractorDir;
    }
    let result = require.resolve("protractor");
    if (result) {
      // result is now something like
      // c:\\Source\\gulp-protractor\\node_modules\\protractor\\lib\\protractor.js
      protractorDir = path.resolve(path.join(path.dirname(result), "..", "..", ".bin"));
      return protractorDir;
    }
    throw new Error("No protractor installation found.");
  }
})();

export let protractor = function (options) {
  let files = [],
    child, args;

  options = options || {};
  args = options.args || [];

  return through(
    function (file) {
      files.push(file.path);
    },
    function () {
      let stream = this;
      // Enable debug mode
      options.debug && args.push('debug');
      // Attach Files, if any
      if (files.length) {
        args.push('--specs');
        args.push(files.join(','));
      }
      // Pass in the config file
      options.configFile && args.unshift(options.configFile);

      child = child_process.spawn(path.resolve(getProtractorDir() + '/protractor' + winExt), args, {
        stdio: 'inherit',
        env: process.env
      }).on('exit', (code) => {
        child && child.kill();
        if (stream) {
          if (code) {
            stream.emit('error', new PluginError('gulp-protractor', 'protractor exited with code ' + code));
          } else {
            stream.emit('end');
          }
        }
      });
    });
};

export let webdriver_update = function (opts, cb) {
  var callback = (cb ? cb : opts);
  var options = (cb ? opts : null);
  var args = ["update", "--standalone"];
  if (options) {
    if (options.browsers) {
      options.browsers.forEach(function (element) {
        args.push("--" + element);
      });
    }
  }
  child_process.spawn(path.resolve(getProtractorDir() + '/webdriver-manager' + winExt), args, {
    stdio: 'inherit'
  }).once('close', callback);
};

export let webdriver_standalone = function (cb) {
  child_process.spawn(path.resolve(getProtractorDir() + '/webdriver-manager' + winExt), ['start'], {
    stdio: 'inherit'
  }).once('close', cb);
};
