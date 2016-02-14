'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var del = require('del');
var mainBowerFiles = require('main-bower-files');
var electronServer = require('electron-connect').server;
var packager = require('electron-packager');
var merge = require('merge2');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var packageJson = require('./package.json');
var optimist = require('optimist');
var childProcess = require('child_process');

var rootDir     = '.';
var srcDir      = 'src';      // source directory
var distDir     = 'dist';     // directory for serve:dist task
var releaseDir  = 'release';  // directory for application packages
var bowerComponentsDir = 'bower_components';

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

// Inject *.css(compiled and depedent) files into *.html
gulp.task('inject:css', ['copy:bower:css', 'sass:compile'], function() {
  return gulp.src(__dirname + '/index.html')
    .pipe($.inject(gulp.src([srcDir + '/styles/**/*.css']), {
      relative: true,
      addPrefix: ''
    }))
    .pipe(gulp.dest(__dirname))
  ;
});

//Copy bower css
gulp.task('copy:bower:css', function() {
  return gulp.src(mainBowerFiles())
    .pipe($.if('**/*.css', $.minifyCss()))
    .pipe($.concat('vendor.css'))
    .pipe(gulp.dest(srcDir + '/styles'))
  ;
});

// Copy fonts file. You don't need to copy *.ttf nor *.svg nor *.otf.
gulp.task('copy:fonts', function () {
  return gulp.src('bower_components/**/fonts/*.woff')
    .pipe($.flatten())
    .pipe(gulp.dest(srcDir + '/fonts'))
  ;
});

// Delete generated directories.
gulp.task('clean', function (done) {
  del([releaseDir, bowerComponentsDir], function () {
    done();
  });
});

gulp.task('sass:compile', function() {
  return gulp.src('sass/**/*.scss')
    .pipe($.sass())
    .pipe($.concat('main.css'))
    .pipe($.minifyCss())
    .pipe(gulp.dest('src/styles/'));
});

gulp.task('serve', ['bower:install', 'inject:css', 'run:electron'], function () {
  gulp.watch(['bower.json'], ['copy:bower:css']);
  gulp.watch(['sass/**/*.scss', srcDir + '/styles/**/*.css'], ['sass:compile']);
});

gulp.task('bower:install', function(done){
  childProcess.exec('./node_modules/.bin/bower install', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
});

gulp.task('run:electron', function(done){
  childProcess.spawn(
    process.platform !== 'win32'
      ? './node_modules/.bin/electron'
      : '.\\node_modules\\.bin\\electron.cmd'
    , [rootDir, '--debug']);
  done();
});
