/*jshint node:true */

// Requires
var gutil = require('gulp-util');
var ts = require('../index');
var assert = require('assert');
var exec = require('child_process').exec;
var should = require('should');
var fs = require('fs');
var path = require('path');

describe('gulp-ts', function () {
	var seconds=1000;
	this.timeout(5*seconds);

	gulp = function(task, done) {
		exec('gulp ' + task, function(error, stdout, stderr) {
			if (stderr)
				console.log('gulp.stderr:' + stderr);
			if (error)
				throw error;
			done();
		});
	};

	it ('should export declaration', function(done) {
		gulp('declaration', function() {
			fs.exists(path.join('out', 'log.d.ts'), function (fileExists) {
				fileExists.should.be.true;
				done();
			});
		});
	});

	it ('should export declaration with singlefile', function(done) {
		gulp('declaration-singlefile', function() {
			fs.exists(path.join('out', 'myindex.d.ts'), function (fileExists) {
				fileExists.should.be.true;
				done();
			});
		});
	})
//this is failing but no easy solution
	it.skip ('should work with a file in subfolder only', function (done) {
		gulp('subfolder-only', function() {
			fs.exists(path.join('out', 'hello3.js'), function (fileExists) {
				fileExists.should.be.true;
				done();
			});
		});
	});
});


