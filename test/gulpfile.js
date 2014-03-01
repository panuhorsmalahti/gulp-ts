// Simple Gulpfile
var gulp = require('gulp');
var gutil = require('gulp-util');

// Gulp plugins
var ts = require('../index');

gulp.task('default', function(){
      gulp.src(['hello.ts', 'subfolder/hello3.ts'])
        .pipe(ts({
            module: 'commonjs',
            removeComments: true
        }))
        .pipe(gulp.dest('out'));;
});

gulp.task('singlefile', function(){
      gulp.src(['subfolder/hello4.ts', 'subfolder/hello3.ts', 'hello.ts', 'subfolder/hello2.ts'])
        .pipe(ts({
            module: 'commonjs',
            removeComments: false,
            out: 'singlefile.js'
        }))
        .pipe(gulp.dest('out'));;
});
