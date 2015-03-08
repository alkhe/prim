const generator = 'peg';

var gulp = require('gulp'),
	jison = require('gulp-jison'),
	peg = require('gulp-peg'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	babel = require('gulp-babel'),
	del = require('del');

var pegmatch = './src/peg/*.peg',
	jisonmatch = './src/jison/*.jison',
	pegspecmatch = './spec/peg/*.js',
	jisonspecmatch = './spec/jison/*.js',
	clientdest = './lib/',
	serverdest = './';

var plugin = require('./src/peg/plugin');

gulp.task('compile', ['compile-npm', 'compile-dev', 'compile-pro', 'compile-test']);

gulp.task('compile-dev', function() {
	if (generator == 'jison') {
		gulp.src(jisonmatch).pipe(jison({
				moduleType: 'js',
				type: 'lalr',
				moduleName: 'prim'
			}))
			.pipe(gulp.dest(clientdest));
	}
	else {
		gulp.src(pegmatch).pipe(peg({
				exportVar: 'prim',
				plugins: [plugin]
			}))
			.pipe(gulp.dest(clientdest));
	}
});

gulp.task('compile-pro', function() {
	if (generator == 'jison') {
		gulp.src(jisonmatch).pipe(jison({
				moduleType: 'js',
				type: 'lr0',
				moduleName: 'prim'
			}))
			.pipe(uglify())
			.pipe(rename({
				basename: 'prim.min'
			}))
			.pipe(gulp.dest(clientdest));
	}
	else {
		gulp.src(pegmatch).pipe(peg({
				exportVar: 'prim',
				plugins: [plugin]
			}))
			.pipe(uglify())
			.pipe(rename({
				basename: 'prim.min'
			}))
			.pipe(gulp.dest(clientdest));
	}
});

gulp.task('compile-test', function() {
	if (generator == 'jison') {
		gulp.src(jisonspecmatch).pipe(babel())
			.pipe(gulp.dest(clientdest));
	}
	else {
		gulp.src(pegspecmatch).pipe(babel())
			.pipe(gulp.dest(clientdest));
	}
});

gulp.task('compile-npm', function() {
	if (generator == 'jison') {
		gulp.src(jisonmatch).pipe(jison({
				moduleType: 'commonjs',
				parserType: 'lalr'
			}))
			.pipe(gulp.dest(serverdest));
	}
	else {
		gulp.src(pegmatch).pipe(peg({
				plugins: [plugin]
			}))
			.pipe(gulp.dest(serverdest));
	}
});

gulp.task('clean', function() {
	del(clientdest + '*');
	del(serverdest + 'prim.js');
});

gulp.task('watch', function() {
	gulp.watch(match, ['compile']);
});
