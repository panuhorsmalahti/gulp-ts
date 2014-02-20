/*jslint node:true */
/*jslint nomen: true */

// Requires

// Native
var fs = require('fs');
var path = require('path');

// Gulp
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;

var map = require('map-stream');
var through = require('through');
var shell = require('shelljs');

var es = require('event-stream');

// rm -rf for Node.js
var rmdir = require('rimraf');

"use strict";


var tsPlugin = function(options) {
    var bufferFiles,
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
            // Construct a compile command to be used with the shell TypeScript compiler
        var compileCmd = ' ' + files.join(' '),
            // Files are compiled in this sub-directory
            compiledir = 'compiledir',
            // Path to the TypeScript binary
            tscPath = path.join(__dirname, 'node_modules/typescript/bin/tsc'),
            // The result of the compilation shell execution
            compileSuccess,
            // ES6 plz
            that = this;

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

        // Not supported yet.
        // Output file
        /* if (options.out) {
            compileCmd += ' --out ' + options.out;
        } */

        // Compile all files to output directory. After compilation they're read to
        // memory and the directory is destroyed. The reason for this 'hack' is that the
        // TypeScript compiler doesn't easily support in-memory compilation.
        // The use of --outDir for other means doesn't seem necessary.
        compileCmd += ' --outDir ' + path.join(__dirname, compiledir);

        // Source root
        if (options.sourceRoot) {
            compileCmd += ' --sourceRoot' + options.sourceRoot;
        }

        // Map root
        if (options.mapRoot) {
            compileCmd += ' --mapRoot' + options.mapRoot;
        }

        // Remove compiledir if it already exists
        rmdir(path.join(__dirname, compiledir), function (err) {
            // Remove failed
            if (err) {
                throw err;
            }

            // Compile
            console.log("Compiling..");

            // shell.exec returns { code: , output: }
            compileSuccess = shell.exec('node ' + tscPath + compileCmd).code;
            console.log("success " + JSON.stringify(compileSuccess) + " " + compileCmd);

            // Read output files
            files.forEach(function (file) {
                
            });

            // Remove the resulting files
            rmdir(path.join(__dirname, compiledir), function (err) {
                if (err) {
                    throw err;
                }

                // Return buffers
                that.emit('data', null);
                that.emit('end');
            });
        });
    };


    // bufferFiles is executed once per each file, compileFiles is called once at the end
    return through(bufferFiles, compileFiles);
};


module.exports = tsPlugin;