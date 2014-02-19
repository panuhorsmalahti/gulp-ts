gulp-ts
=========

TypeScript compiler plugin for Gulp.

Usage:
```javascript
var ts = require('gulp-ts');

// ...
gulp.src('test.ts')
 .pipe(ts());
```
Supports the following options.
```javascript
 .pipe(ts({
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
  target : 'ES3', // or 'ES5'

  // Concatenate and emit output to single file.
  out : '', // output file name

  // Redirect output structure to the directory.
  outDir : '',

  // Specifies the location where debugger should locate TypeScript files instead of source locations.
  sourceRoot : '',

  // Specifies the location where debugger should locate map files instead of generated locations.
  mapRoot : '' 
}));
```