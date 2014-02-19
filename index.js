/*jslint node:true */

// Requires
var map = require('map-stream');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var through = require('through');
var shell = require('shelljs');
var path = require('path');

"use strict";


var tsPlugin = function(options) {
    var tscPath = path.join(__dirname, 'node_modules/typescript/bin/tsc'),
        bufferFiles,
        compileFiles,
        files = [];

    // Default options
    if (!options) {
        options = {};
    }


    // Collect all files to an array
    bufferFiles = function(file) {
        // Null values and streams are skipped
        if (file.isNull()) {
            return;
        } else if (file.isStream()) {
            return this.emit('error', new PluginError('gulp-ts',  'Streaming not supported'));
        }

        // Add file to the list of source files
        files.push(file.path);
    };

    // Compile all files defined in the files Array
    compileFiles = function() {
        var compileCmd = ' ' + files.join(' ');

        // Basic options
        if (options.sourceMap) {
            compileCmd += ' --sourcemap';
        }
        if (options.declaration) {
            compileCmd += ' --declaration';
        }
        if (options.removeComments) {
            compileCmd += ' --removeComments';
        }
        if (options.noImplicitAny) {
            compileCmd += ' --noImplicitAny';
        }
        if (options.noResolve) {
            compileCmd += ' --noResolve';
        }

        // Module
        compileCmd += ' --module ' + (options.module || 'amd').toLowerCase();

        // Target ES3/ES5
        compileCmd += ' --target ' + (options.target || 'ES3').toUpperCase();

        // Output file
        if (options.out) {
            compileCmd += ' --out ' + options.out;
        }

        // Output directory
        if (options.outDir) {
            if (options.out) {
                console.log('Warning: Don\'t use out with outDir!');
            }
            compileCmd += ' --outDir ' + options.outDir;
        }

        // Source root
        if (options.sourceRoot) {
            compileCmd += ' --sourceRoot' + options.sourceRoot;
        }

        // Map root
        if (options.mapRoot) {
            compileCmd += ' --mapRoot' + options.mapRoot;
        }

        var compileSuccess = shell.exec('node ' + tscPath + compileCmd)
    };


    return through(bufferFiles, compileFiles);
};


module.exports = tsPlugin;