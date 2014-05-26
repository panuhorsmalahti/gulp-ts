/*jslint node:true */
/*jslint nomen: true */

// Requires

// Native
var fs = require('fs');
var path = require('path');

// Gulp
var gutil = require('gulp-util');
var log = gutil.log;
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
        files = [],
        // Files are compiled in this sub-directory
        compiledir = 'compiledir',
        thisdir = __dirname;

    // Default options
    if (!options) {
        options = {};
    }
    if (options.debug)
        options.verbose = true;

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
            compileCmd += ' --out ' + path.join(thisdir, compiledir, options.out);
        } else {
            // Compile all files to output directory. After compilation they're read to
            // memory and the directory is destroyed. The reason for this 'hack' is that the
            // TypeScript compiler doesn't easily support in-memory compilation.
            // The use of --outDir for other means doesn't seem necessary.
            compileCmd += ' --outDir ' + path.join(thisdir, compiledir);
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
        rmdir(path.join(thisdir, compiledir), function (err) {
            // Remove failed
            if (err) {
                throw err;
            }

            // Compile
            log('Compiling...');
            if (options.verbose) {
                log(' compile cmd:', compileCmd)
            }

            // shell.exec returns { code: , output: }
            // silent is set to true to prevent console output
            shell.exec('node ' + tscPath + compileCmd, { silent: true }, function (code, output) {
                if (options.debug) {
                    log(' tsc output: [', output, ']')
                }
                if (code) {
                    return that.emit('error', new PluginError('gulp-ts',
                        'Error during compilation!\n\n' + output));
                }

                var readSourceFile = function (relativePath, cwd, base) {
                    // Read from compiledir and replace .ts -> .js
                    var theFile = path.join(thisdir, compiledir, relativePath.replace('.ts', '.js'));
                    log(theFile + ' exists:', fs.existsSync(theFile));
                    fs.readFile(path.join(thisdir, compiledir, relativePath.replace('.ts', '.js')), function (err, data) {
                        // Read failed
                        if (err) {
                            throw err;
                        }

                        // Bug: Gulp flattens the output directory
                        that.push(new File({
                            cwd: cwd,
                            base: base,
                            path: path.join(cwd, relativePath.replace('.ts', '.js')),
                            contents: data
                        }));

                        // Increase counter
                        filesRead++;

                        // Last file has been read, and the directory can be cleaned out
                        // This assumes that the task is used with at least one file
                        if (options.out || filesRead === files.length) {
                            if (!options.debug) {
                                rmdir(path.join(thisdir, compiledir), function (err) {
                                    if (err) {
                                        throw err;
                                    }
                                    // Return buffers
                                    that.emit('end');
                                    log('Compiling complete.');
                                });
                            } else {
                                log('In debug mode, so compiledir was left for inspection.')
                                that.emit('end');
                            }
                        }
                    });
                };

                // Read output files
                handleDeclaration.apply(that);

                if (options.out) {
                    readSourceFile(options.out, '/', '/');
                } else {
                    files.forEach(function (file) {
                        readSourceFile(file.relativePath, file.cwd, file.base);
                    });
                }
            });
        });
    };

    /* Handles buffering the declaration file if necessary */
    handleDeclaration = function () {
        that = this;
        if (!options.declaration)
            return;
        // The declaration is the same as the out file specified with --out or it seems it is the name of the root source file
        var srcPath; // relative path to file generated from tsc
        var cwd = process.cwd();
        
        if (options.out) {
            srcPath = options.out.replace('.js', '.d.ts');
        } else {
            srcPath = files[0].path.replace('.ts', '.d.ts');
        }
        srcPath = path.relative(cwd, srcPath);
        // read in the generated file:
        var data = fs.readFileSync(path.join(thisdir, compiledir, srcPath));
        // buffer it:
        var fileConfig = {
            base: path.dirname(srcPath),
            path: srcPath,
            contents: data
        };
        that.push(new File(fileConfig));
    }



    // bufferFiles is executed once per each file, compileFiles is called once at the end
    return through(bufferFiles, compileFiles);
};

module.exports = tsPlugin;

