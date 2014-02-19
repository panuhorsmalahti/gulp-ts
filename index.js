/*jshint node:true */

// Requires
var map = require('map-stream');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var through = require('through');

'use strict';


var tsPlugin = function (options) {
    var tscPath = 'node_modules/typescript/bin/tsc',
        bufferFiles,
        compileFiles;

    // Collect all files to an array
    var files = [];
    bufferFiles = function (file) {
      // Null values and streams are skipped
      if (file.isNull()) {
        return cb(null, file);
      } else if(file.isStream()) {
        return cb(new PluginError('gulp-ts', 'Streaming not supported'));
      }

      // Add file to the list of source files
      files.push(file.path);
    };

    compileFiles = function () {
      var compileCmd = files.join(' ');

      console.log("Compiling " + compileCmd);

      // Basic options
      if (options.sourceMap) {
        compileCmd += " --sourcemap";
      }
      if (options.declaration) {
        compileCmd += " --declaration";
      }
      if (options.removeComments) {
        compileCmd += "--removeComments";
      }
      if (options.noImplicitAny) {
        compileCmd += "--noImplicitAny";
      }
      if (options.noResolve) {
        compileCmd += "--noResolve";
      }

      // Module
      cmd += ' --module ' + (options.module || 'amd').toLowerCase();

      // Target ES3/ES5
      cmd += ' --target ' + (options.target || 'ES3').toUpperCase();

      // Output file
      if (options.out) {
        cmd += ' --out ' + options.out;
      }

      // Output directory
      if (options.outDir) {
        if (options.out) {
          console.log("Warning: Don't use out with outDir!");
        }
        cmd += ' --outDir ' + options.outDir;
      }

      // Source root
      if (options.sourceRoot) {
        cmd += ' --sourceRoot' + options.sourceRoot;
      }
      
      // Map root
      if (options.mapRoot) {
        cmd += ' --mapRoot' + options.mapRoot;
      }
    };


    return through(bufferFiles, compileFiles)
};


module.exports = tsPlugin;
