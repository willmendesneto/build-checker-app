'use strict';

var argv = require('yargs').argv;
var os = require('os');
var mkdirp = require('mkdirp');
var $ = require('gulp-load-plugins')();
var gulpColors = $.util.colors;

module.exports.os = function () {
    switch (os.platform()) {
        case 'darwin':
            return 'osx';
        case 'linux':
            return 'linux';
        case 'win32':
            return 'windows';
    }
    return 'unsupported';
};

module.exports.replace = function (str, patterns) {
    Object.keys(patterns).forEach(function (pattern) {
        var matcher = new RegExp('{{' + pattern + '}}', 'g');
        str = str.replace(matcher, patterns[pattern]);
    });
    return str;
};

module.exports.getEnvName = function () {
    return argv.env || 'development';
};

module.exports.createFolderFromRelease = function() {
  ['./tmp', './releases'].forEach(function(folder) {
    mkdirp.sync(folder);
  });
};


/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
module.exports.log = function(msg) {
    gulpColors.enabled = true;
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log(gulpColors.blue(msg[item]));
            }
        }
    } else {
        $.util.log(gulpColors.blue(msg));
    }
}

/**
 * Show OS level notification using node-notifier
 */
module.exports.notify = function(options) {
    var notifier = require('node-notifier');
    var notifyOptions = {
        sound: 'Bottle',
        contentImage: path.join(__dirname, 'gulp.png'),
        icon: path.join(__dirname, 'gulp.png')
    };
    _.assign(notifyOptions, options);
    notifier.notify(notifyOptions);
}
