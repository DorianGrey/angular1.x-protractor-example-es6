'use strict';

import gulp from 'gulp';

// Tasks for e2e-testing with protractor
import {protractor, webdriver_update} from 'gulp-protractor';

/** 1st task definition: Updating webdriver.
 * This should be performed regularly to ensure to have the most recent supported version of the selenium-standalone stuff available.
 * To ease this up, we will define a particular task for it and add it as a dependency to the runner itself.
 */
// A list of drivers to load in case they are not present yet.
let drivers = ['chrome'];
// Load driver for Internet Explorer iff executed on windows.
/^win/.test(process.platform) && drivers.push('ie');
// Bind this created list to the update function itself.
let webdriverUpdate = webdriver_update.bind(null, {browsers: drivers});
// Define the task itself.
gulp.task('webdriver:update', (cb) => {
  webdriver_update(cb);
});

// Define an example task which uses Firefox for executing the test.
// This uses the Firefox config file located at test/e2e/configs/firefox.js .
// It is required to just reference the file here, since the protractor task is executed in a different process.
let firefoxConfig = "test/e2e/configs/firefox.js";

gulp.task('e2e:firefox', ['webdriver:update'], () => {
  gulp.src('test/e2e/specs/**/*.spec.js')
    .pipe(protractor({
      configFile: firefoxConfig,
      args: [
        '--baseUrl',
        'http://localhost:3333'
      ]
    }))
    .on('error', (e) => {
      throw e;
    })
});

// Tasks for the dev-mode itself.
import browserSync from 'browser-sync';
const reload = browserSync.reload;

gulp.task('serve', (cb) => {
  browserSync({
    notify: false,
    logPrefix: 'BS',
    // Allow scroll syncing across breakpoints
    //scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['app'],
    port: 3333
  });

  gulp.watch("app/**/*.html", reload);
  gulp.watch("app/**/*.js", reload);
});

gulp.task('default', ['serve']);