/*jshint node:true */

// Requires
var map = require('map-stream');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

'use strict';


var tsPlugin = function (options) {
    return map(function (file, cb) {
      // Null values and streams are skipped
      if (file.isNull()) {
        return cb(null, file);
      } else if(file.isStream()) {
        return cb(new PluginError('gulp-ts', 'Streaming not supported'));
      }

      var source = file.contents.toString('utf8');
      

    });
};


module.exports = tsPlugin;
