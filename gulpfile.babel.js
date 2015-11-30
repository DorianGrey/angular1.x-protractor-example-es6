'use strict';

import gulp from 'gulp';
import gulpUtil from 'gulp-util';

// Tasks for e2e-testing with protractor
import {protractor, webdriver_update} from './test/e2e/helper/gulp-protractor-plugin';

// Config builder helper
import {protractorCfgBuilder} from './test/e2e/configs/builder';

// Get parsed command line arguments.
import {argv} from 'yargs';

let Xvfb = null;
try {
  Xvfb = require('xvfb');
} catch (error) {
  gulpUtil.log(`[${gulpUtil.colors.red("✖")}] Xvfb not found, headless mode will not be available.`);
}

// Check if headless mode is available, was selected, and we're not aiming a remote target.
let useHeadlessMode = Xvfb && argv.headless && !argv.remote;

let runWithHeadless = function (execFunc, done) {
  let xvfb = new Xvfb();
  xvfb.start(function (err) {
    if (err) {
      throw err;
    }
    execFunc().on('end', function () {
      gulpUtil.log('Stream ended, shutting down Xvfb...');
      xvfb.stop(function (err) {
        if (err) {
          throw err;
        }
        done();
      });
    });
  });
};

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
  webdriverUpdate(cb);
});

// Define task for each supported browser - here: Firefox and Chrome.
// It is required to just reference the config files here, since the protractor task is executed in a different process
let supportedBrowsers = ['firefox', 'chrome', 'ie9', 'ie10', 'ie11', 'safari'],
  executionFunction = function (browserName) {
    let cfg = protractorCfgBuilder(browserName, argv);

    return gulp.src('test/e2e/specs/**/*.spec.js')
      .pipe(protractor(cfg))
      .on('error', (e) => {
        throw e;
      });
  };

supportedBrowsers.forEach((browserName) => {
  gulp.task(`e2e:${browserName}`, ['webdriver:update'], function (done) {
    if (useHeadlessMode) {
      runWithHeadless(executionFunction.bind(null, browserName), done);
    } else {
      executionFunction(browserName).on('done', done);
    }
  });
});

// Tasks for the dev-mode itself.
import gulpSass from 'gulp-sass';
import sourceMaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';

import browserSync from 'browser-sync';
const reload = browserSync.reload;

gulp.task('sass:dev', function () {
  gulp.src('./app/stylesheets/*.sass')
    .pipe(sourceMaps.init())
    .pipe(gulpSass().on('error', gulpSass.logError))
    .pipe(concat("app.css"))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./app/css'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function () {
  gulp.src('./app/stylesheets/*.sass')
    .pipe(sourceMaps.init())
    .pipe(gulpSass().on('error', gulpSass.logError))
    .pipe(concat("app.css"))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./app/css'));
});

gulp.task('serve', ['sass'], (cb) => {
  browserSync({
    open: false,
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
  gulp.watch('./app/stylesheets/**/*.sass', ['sass:dev']);
});

// Things related to generating a PDF.
import {inlineImage} from './gulp/inlineImage';
import {toPDF} from './gulp/pdf';
import rename from 'gulp-rename';

gulp.task('pdf:all', () => {
  gulp.src('./test/e2e/reports/**/*.html', {base: '.'})
    .pipe(inlineImage())
    .pipe(toPDF())
    .pipe(rename({extname: '.pdf'}))
    .pipe(gulp.dest('.'));
});

// The default task.
gulp.task('default', ['serve']);