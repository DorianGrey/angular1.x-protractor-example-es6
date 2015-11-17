'use strict';

import gulp from 'gulp';
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