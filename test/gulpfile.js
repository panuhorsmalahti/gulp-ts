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

gulp.task('glob-single-folder', function(){
      //NOTE: this pattern will cause tsc to /not/ preserve the directory structure in the output as it contains only a single folder.
      gulp.src(['subfolder/*.ts'])
        .pipe(ts({
            module: 'commonjs',
            removeComments: true
        }))
        .pipe(gulp.dest('out'));;
});

gulp.task('glob-multiple-folders', function(){
      //NOTE: this pattern will cause tsc to preserve the directory structure in the output as it contains multiple folders.
      gulp.src(['./**/*.ts'])
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
