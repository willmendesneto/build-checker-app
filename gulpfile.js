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

var srcDir      = 'src';      // source directory
var serveDir    = '.serve';   // directory for serve task
var distDir     = 'dist';     // directory for serve:dist task
var releaseDir  = 'release';  // directory for application packages

// Compile *.scss files with sourcemaps
gulp.task('compile:styles', function () {
  return gulp.src([srcDir + '/styles/**/*.scss'])
    .pipe($.sourcemaps.init())
    .pipe($.sass())
    .pipe($.concat('main.css'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(serveDir + '/styles'))
    ;
});

// Inject *.css(compiled and depedent) files into *.html
gulp.task('inject:css', ['compile:styles'], function() {
  return gulp.src(srcDir + '/**/*.html')
    .pipe($.inject(gulp.src(mainBowerFiles().concat([serveDir + '/styles/**/*.css'])), {
      relative: true,
      ignorePath: ['../../.serve', '..'],
      addPrefix: '..'
    }))
    .pipe(gulp.dest(serveDir))
  ;
});

//Copy bower css
gulp.task('copy:bower:css', function() {
  return gulp.src(mainBowerFiles())
    .pipe($.if('**/*.css', $.minifyCss()))
    .pipe(gulp.dest(serveDir + '/styles'))
  ;
});

// Copy assets
gulp.task('misc', function () {
  return gulp.src(srcDir + '/assets/**/*')
    .pipe(gulp.dest(serveDir + '/assets'))
    .pipe(gulp.dest(distDir + '/assets'))
  ;
});

// Incremental compile ES6, JSX files with sourcemaps
gulp.task('compile:scripts:watch', function (done) {
  gulp.src('src/**/*.{js,jsx}')
    .pipe($.watch('src/**/*.{js,jsx}', {verbose: true}))
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel({"plugins": ["add-module-exports"]}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(serveDir))
  ;
  done();
});

// Compile scripts for distribution
gulp.task('compile:scripts', function () {
  return gulp.src('src/**/*.{js,jsx}')
    .pipe($.babel({"plugins": ["add-module-exports"]}))
    .pipe($.uglify())
    .pipe(gulp.dest(distDir))
  ;
});

// Copy fonts file. You don't need to copy *.ttf nor *.svg nor *.otf.
gulp.task('copy:data', function () {
  return gulp.src('src/data/*.json')
    .pipe(gulp.dest(serveDir + '/data'))
  ;
});

gulp.task('copy:styles:dist', function () {
  return gulp.src('.serve/styles/*.css')
    .pipe($.if('**/*.css', $.minifyCss()))
    .pipe(gulp.dest(distDir + '/styles'))
  ;
});

gulp.task('copy:data:dist', function () {
  return gulp.src('src/data/*.json')
    .pipe(gulp.dest(distDir + '/data'))
  ;
});

// Make HTML and concats CSS files.
gulp.task('html', ['inject:css', 'copy:styles:dist', 'copy:bower:css'], function () {
  return gulp.src(serveDir + '/renderer/**/*.html')
    .pipe($.inject(gulp.src([serveDir + '/styles/**/*.css']), {
      relative: true,
      ignorePath: ['../../', '../'],
      addPrefix: '..'
    }))
    .pipe($.if('**/*.css', $.minifyCss()))
    .pipe(gulp.dest(serveDir))
    .pipe(gulp.dest(distDir + '/renderer'))
  ;
});

// Copy fonts file. You don't need to copy *.ttf nor *.svg nor *.otf.
gulp.task('copy:fonts', function () {
  return gulp.src('bower_components/**/fonts/*.woff')
    .pipe($.flatten())
    .pipe(gulp.dest(distDir + '/fonts'))
  ;
});


// Minify dependent modules.
gulp.task('bundle:dependencies', function () {
  var streams = [], dependencies = [];
  streams.push(
    gulp.src('node_modules')
    .pipe($.if('**/*.js', $.uglify()))
    .pipe(gulp.dest(distDir + '/node_modules'))
  );

  return merge(streams);
});

// Write a package.json for distribution
gulp.task('packageJson', ['bundle:dependencies'], function (done) {
  var json = _.cloneDeep(packageJson);
  json.main = 'app.js';
  fs.writeFile(distDir + '/package.json', JSON.stringify(json), function (err) {
    done();
  });
});

// Package for each platforms
gulp.task('package', ['win32', 'darwin', 'linux'].map(function (platform) {
  var taskName = 'package:' + platform;
  gulp.task(taskName, ['build'], function (done) {
    packager({
      dir: distDir,
      name: packageJson.appName,
      arch: 'x64',
      platform: platform,
      out: releaseDir + '/' + platform,
      version: '0.28.1'
    }, function (err) {
      done();
    });
  });
  return taskName;
}));

// Delete generated directories.
gulp.task('clean', function (done) {
  del([serveDir, distDir, releaseDir], function () {
    done();
  });
});

gulp.task('serve', ['inject:css', 'compile:scripts:watch', 'copy:data', 'compile:styles', 'misc'], function () {
  var electron = electronServer.create();
  electron.start();
  gulp.watch(['bower.json', srcDir + '/renderer/index.html'], ['inject:css']);
  gulp.watch([serveDir + '/app.js', serveDir + '/browser/**/*.js'], electron.restart);
  gulp.watch([serveDir + '/styles/**/*.css', serveDir + '/renderer/**/*.html', serveDir + '/renderer/**/*.js'], electron.reload);
});

gulp.task('build', ['html', 'copy:data:dist', 'compile:scripts', 'packageJson', 'copy:fonts', 'misc'], function(done){
  var filename = distDir + '/renderer/index.html';
  var data = fs.readFileSync(filename, 'utf8');
  var htmlVariable = '__ESCAPED_SOURCE_END_CLEAN_CSS__';
  data = data.replace(new RegExp(htmlVariable, 'g'), '');
  fs.writeFileSync(filename, data, 'utf8');

  filename = distDir + '/app.js';
  data = fs.readFileSync(filename, 'utf8');
  data = data.replace(new RegExp('../package.json', 'g'), './package.json');
  fs.writeFileSync(filename, data, 'utf8');

  done();
});

gulp.task('serve:dist', ['build'], function () {
  electronServer.create({path: distDir}).start();
});

gulp.task('boilerplate', function () {
  var outDir = optimist.argv.o || optimist.argv.out;
  if (!outDir) {
    console.log('usage: gulp boilerplate -o {outdir}');
    return;
  }
  var configStream = gulp.src(['bower.json', 'package.json', 'gulpfile.js', '.gitignore']).pipe(gulp.dest(outDir));
  var srcStream = gulp.src(['src/**/*']).pipe(gulp.dest(outDir + '/src'));
  return merge([configStream, srcStream]);
});

gulp.task('default', ['build']);
