gulp-ts
=========

deprecated!
==========

Switch to e.g. [gulp-typescript](https://www.npmjs.com/package/gulp-typescript).

TypeScript compiler plugin for Gulp. Not actively maintained.

First install gulp-ts
```shell
npm install --save-dev gulp-ts
```


Usage:
```javascript
var gulp = requre('gulp');
var ts = require('gulp-ts');

// ...
gulp.task('typescript', function() {
  gulp.src('source.ts')
    .pipe(ts())
    .pipe(gulp.dest('out'));
});
```
Supports the following options.
```javascript
 .pipe(ts({
  // explicit path to tsc executable file; taken if not falsy
  exePath: '',

  // forces usage of tsc executable file from system PATH
  globalExe: false,

  // Generates corresponding .map file.
  sourceMap : false,

  // Generates corresponding .d.ts file.
  declaration : false,

  // Do not emit comments to output.
  removeComments : false,

  // Warn on expressions and declarations with an implied 'any' type.
  noImplicitAny : false,

  // Skip resolution and preprocessing.
  noResolve : false,

  // Specify module code generation: 'commonjs' or 'amd'  
  module : 'amd',

  // Specify ECMAScript target version: 'ES3' (default), or 'ES5'
  target : 'ES3',

  // Concatenate and emit output to single file.
  out : '', // output file name

  // Specifies the location where debugger should locate TypeScript files instead of source locations.
  sourceRoot : '',

  // Specifies the location where debugger should locate map files instead of generated locations.
  mapRoot : ''
}));
```
