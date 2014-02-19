// Simple Gulpfile
var gulp = require('gulp');
var gutil = require('gulp-util');

// Gulp plugins
var ts = require('../index');

gulp.task('default', function(){
      gulp.src('hello.ts')
        .pipe(ts({
            module: 'commonjs',
            removeComments: true
        }));
});
