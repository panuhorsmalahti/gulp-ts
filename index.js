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

var through = require('through');
var shell = require('shelljs');

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

        // Using path.relative doesn't seem safe, but we need the relative path
        // to the 'base', e.g. if we have 'a.ts' and 'b/b.ts' from src, the relative
        // property tells the path from cwd to path.
        file.relativePath = path.relative(file.cwd, file.path)

        // Add file to the list of source files
        files.push(file);
    };

    // Compile all files defined in the files Array
    compileFiles = function() {
            // Construct a compile command to be used with the shell TypeScript compiler
        var compileCmd = '',
            // Files are compiled in this sub-directory
            compiledir = 'compiledir',
            // Path to the TypeScript binary
            tscPath = path.join(__dirname, 'node_modules/typescript/bin/tsc'),
            // ES6 plz
            that = this,
            // The number of files read and pushed as File objects
            filesRead = 0;

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
            compileCmd += ' --out ' + path.join(__dirname, compiledir, options.out);
        } else {
            // Compile all files to output directory. After compilation they're read to
            // memory and the directory is destroyed. The reason for this 'hack' is that the
            // TypeScript compiler doesn't easily support in-memory compilation.
            // The use of --outDir for other means doesn't seem necessary.
            compileCmd += ' --outDir ' + path.join(__dirname, compiledir);
        }

        // Source root
        if (options.sourceRoot) {
            compileCmd += ' --sourceRoot' + options.sourceRoot;
        }

        // Map root
        if (options.mapRoot) {
            compileCmd += ' --mapRoot' + options.mapRoot;
        }


        // Add source file full paths to the compile command
        files.forEach(function (file) {
            compileCmd += ' ' + file.path;
        });

        // Remove compiledir if it already exists
        rmdir(path.join(__dirname, compiledir), function (err) {
            // Remove failed
            if (err) {
                throw err;
            }

            // Compile
            console.log("TypeScript compiling...");

            // shell.exec returns { code: , output: }
            // silent is set to true to prevent console output
            shell.exec('node ' + tscPath + compileCmd, { silent: true }, function (code, output) {
                if (code) {
                    return that.emit('error', new PluginError('gulp-ts',
                        'Error during compilation!\n\n' + output));
                }

                var readSourceFile = function (relativePath, cwd, base) {
                    // Read from compiledir and replace .ts -> .js
                    var sourceFileToRead = path.join(__dirname, compiledir, relativePath.replace(".ts", ".js"));
                    fs.readFile(sourceFileToRead, function (err, data) {
                        // Read failed
                        if (err) {
                            throw err;
                        }

                        that.push(new File({
                            cwd: cwd,
                            base: base,
                            path: path.join(base, relativePath.replace(".ts", ".js")),
                            contents: data
                        }));

                        // Increase counter
                        filesRead++;

                        // Last file has been read, and the directory can be cleaned out
                        // This assumes that the task is used with at least one file
                        if (options.out || filesRead === files.length) {
                            rmdir(path.join(__dirname, compiledir), function (err) {
                                if (err) {
                                    throw err;
                                }
                                console.log("TypeScript compiling complete.");
                                // Return buffers
                                that.emit('end');
                            });
                        }
                    });
                };

                // Read output files
                if (options.out) {
                    readSourceFile(options.out, '/', '/');
                } else {
                    files.forEach(function (file) {
                        //NOTE: tsc flattens the directory structure in the output, so we only want the filename:
                        relativePath = path.basename(file.relativePath);
                        readSourceFile(relativePath, file.cwd, file.base);
                    });
                }
            });
        });
    };

    // bufferFiles is executed once per each file, compileFiles is called once at the end
    return through(bufferFiles, compileFiles);
};

module.exports = tsPlugin;
