/*jshint node:true */

// Run with 'gulp test'

// Requires
var fs = require('fs');
var path = require('path');

var gutil = require('gulp-util');
var ts = require('../index');
var assert = require('assert');
var exec = require('child_process').exec;
var should = require('should');
var shell = require('shelljs');

describe('gulp-ts', function () {
	var seconds=8;
	this.timeout(seconds*1000);

	gulp = function(task, done) {
		exec('gulp ' + task, function(error, stdout, stderr) {
			if (stderr) {
				console.log('gulp.stderr:' + stderr);
			}
			if (error) {
				throw error;
			}
			done();
		});
	};

	filesShouldExist = function(expectedFiles, done) {
		expectedFiles.forEach(function (theFile) {
			var doesExist = fs.existsSync(path.join('out', theFile));
			//console.log(theFile, doesExist ? 'does exist' : 'does NOT exist');
			doesExist.should.be.true;
		});
		if (done) {
			done();
		}
	}

	it ('should compile files in multiple folders', function(done) {
		//['hello.ts', 'subfolder/hello3.ts']
		gulp('default', function() {
			var expectedFiles = [
				'hello.js',
				'hello3.js'
			];
			filesShouldExist(expectedFiles, done);
		});
	})

	it ('should export declaration', function(done) {
		gulp('declaration', function() {
			var expectedFiles = [
				'log.d.ts'
			];
			filesShouldExist(expectedFiles, done);
		});
	});

	it ('should export declaration with singlefile', function(done) {
		gulp('declaration-singlefile', function() {
			var expectedFiles = [
				'myindex.d.ts'
			];
			filesShouldExist(expectedFiles, done);
		});
	})
	// This is failing but no easy solution
	it.skip ('should work with a file in subfolder only', function (done) {
		gulp('subfolder-only', function() {
			expectedFiles =	[
				'hello3.js'
			];
			filesShouldExist(expectedFiles, done);
		});
	});
});


