var gulp = require('gulp'),
	peg = require('gulp-peg'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	babel = require('gulp-babel'),
	del = require('del');

var pegmatch = './src/**/*.peg',
	specmatch = './spec/**/*.js'
	clientdest = './lib/',
	serverdest = './';

var plugin = require('./src/plugin');

gulp.task('compile', ['compile-npm', 'compile-dev', 'compile-pro', 'compile-test']);

gulp.task('compile-dev', function() {
	gulp.src(pegmatch).pipe(peg({
			exportVar: 'prim',
			plugins: [plugin]
		}))
		.pipe(gulp.dest(clientdest));
});

gulp.task('compile-pro', function() {
	gulp.src(pegmatch).pipe(peg({
			exportVar: 'prim',
			plugins: [plugin]
		}))
		.pipe(uglify())
		.pipe(rename({
			basename: 'prim.min'
		}))
		.pipe(gulp.dest(clientdest));
});

gulp.task('compile-test', function() {
	gulp.src(specmatch).pipe(babel())
		.pipe(gulp.dest(clientdest));
});

gulp.task('compile-npm', function() {
	gulp.src(pegmatch).pipe(peg({
			plugins: [plugin]
		}))
		.pipe(gulp.dest(serverdest));
});

gulp.task('clean', function() {
	del(clientdest + '*');
	del(serverdest + 'prim.js');
});

gulp.task('watch', function() {
	gulp.watch(match, ['compile']);
});
