// Simple Gulpfile
var gulp = require('gulp');
var gutil = require('gulp-util');
var shell = require('shelljs');

// Gulp plugins
var ts = require('../index');
var mocha = require('gulp-mocha');

gulp.task('clean', function() {
    shell.rm('-rf', 'out');
});

gulp.task('default', ['clean'], function(){
      gulp.src(['hello.ts', 'subfolder/hello3.ts'])
        .pipe(ts({
            module: 'commonjs',
            removeComments: true
        }))
        .pipe(gulp.dest('out'));;
});

gulp.task('singlefile', ['clean'], function(){
      gulp.src(['subfolder/hello4.ts', 'subfolder/hello3.ts', 'hello.ts', 'subfolder/hello2.ts'])
        .pipe(ts({
            module: 'commonjs',
            removeComments: false,
            out: 'singlefile.js'
        }))
        .pipe(gulp.dest('out'));;
});

gulp.task('debug', ['clean'], function(){
    gulp.src(['hello.ts', 'subfolder/hello3.ts'])
        .pipe(ts({
            module: 'commonjs',
            removeComments: true,
            verbose: true,
            debug: true,
        }))
        .pipe(gulp.dest('out'));;
});

gulp.task('declaration', ['clean'], function(){
    return gulp.src(['log.ts'])
        .pipe(ts({
            module: 'commonjs',
            removeComments: true,
            verbose: true,
            debug: true,
            declaration: true
        }))
        .pipe(gulp.dest('out'));
});

gulp.task('declaration-singlefile', ['clean'], function(){
      return gulp.src(['log.ts', 'subfolder/hello4.ts'])
        .pipe(ts({
            module: 'commonjs',
            removeComments: true,
            verbose: true,
            debug: true,
            declaration: true,
            out: 'myindex.js'
        }))
        .pipe(gulp.dest('out'));
});

gulp.task('subfolder-only', ['clean'], function(){
      gulp.src(['subfolder/hello3.ts'])
        .pipe(ts({
            module: 'commonjs'
        }))
        .pipe(gulp.dest('out'));;
});

gulp.task('test', function() {
    return gulp.src('test.js')
        .pipe(
            mocha({ reporter: 'nyan' })
        );
});
