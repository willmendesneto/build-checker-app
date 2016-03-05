'use strict';

var Q = require('q');
var fs = require('fs');
var gulp = require('gulp');
var childProcess = require('child_process');
var jetpack = require('fs-jetpack');
var utils = require('../utils');
var appdmg = require('appdmg');

var projectDir;
var releasesDir;
var tmpDir;
var buildDir;
var finalAppDir;
var manifest;

var init = function () {
    utils.createFolderFromRelease();
    projectDir = jetpack;

    tmpDir = projectDir.dir('./tmp', { empty: true });
    buildDir = projectDir.dir('./build', { empty: true });
    releasesDir = projectDir.dir('./releases');
    manifest = projectDir.read('./package.json', 'json');
    finalAppDir = tmpDir.cwd(manifest.productName + '.app');

    return Q();
};

var copyBuildContentForTmpFolder = function () {
  return gulp.src('./build/**').pipe(gulp.dest('./tmp'));
};

var copyBuiltApp = function () {
    return projectDir.copyAsync('./build', finalAppDir.path('BuildCheckerApp-darwin-x64/Contents/Resources/app'));
};

var finalize = function () {
    // Prepare main Info.plist
    var info = projectDir.read('resources/osx/Info.plist');
    info = utils.replace(info, {
        productName: manifest.productName,
        identifier: manifest.identifier,
        version: manifest.version
    });
    finalAppDir.write('BuildCheckerApp-darwin-x64/Contents/Info.plist', info);

    // Prepare Info.plist of Helper app
    info = projectDir.read('resources/osx/helper_app/Info.plist');
    info = utils.replace(info, {
        productName: manifest.productName,
        identifier: manifest.identifier
    });
    finalAppDir.write('BuildCheckerApp-darwin-x64/Contents/Frameworks/Electron Helper.app/BuildCheckerApp-darwin-x64/Contents/Info.plist', info);

    // Copy icon
    projectDir.copy('resources/osx/icon.icns', finalAppDir.path('BuildCheckerApp-darwin-x64/Contents/Resources/icon.icns'));

    return Q();
};

var packToDmgFile = function () {
    var deferred = Q.defer();
    var dmgName = manifest.name + '_' + manifest.version + '.dmg';

    // Prepare appdmg config
    var dmgManifest = projectDir.read('resources/osx/appdmg.json');
    dmgManifest = utils.replace(dmgManifest, {
        productName: manifest.productName,
        appPath: finalAppDir.path(),
        dmgIcon: projectDir.path('resources/osx/dmg-icon.icns'),
        dmgBackground: projectDir.path('resources/osx/dmg-background.png')
    });

    fs.writeFileSync('./tmp/appdmg.json', dmgManifest, 'utf8');
    fs.writeFileSync('./build/appdmg.json', dmgManifest, 'utf8');

    // Delete DMG file with this name if already exists
    releasesDir.remove(dmgName);

    utils.log('Packaging to DMG file...');

    var readyDmgPath = releasesDir.path(dmgName);
    appdmg({
        source: tmpDir.path('appdmg.json'),
        target: readyDmgPath
    })
    .on('error', function (err) {
        console.error(err);
    })
    .on('finish', function () {
        utils.log('DMG file ready!', readyDmgPath);
        deferred.resolve();
    });

    return deferred.promise;
};

var cleanClutter = function () {
    return tmpDir.removeAsync('.');
};

module.exports = function () {
    return init()
    .then(copyBuildContentForTmpFolder)
    .then(copyBuiltApp)
    .then(finalize)
    .then(packToDmgFile)
    .then(cleanClutter);
};
