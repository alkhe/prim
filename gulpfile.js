var gulp = require('gulp'),
	peg = require('gulp-peg'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename');

var match = './src/**/*.peg',
	clientdest = './lib/',
	serverdest = './';

gulp.task('compile', ['compile-npm', 'compile-dev', 'compile-pro']);

gulp.task('compile-dev', function() {
	gulp.src(match).pipe(peg({
			exportVar: 'prim'
		}))
		.pipe(gulp.dest(clientdest));
});

gulp.task('compile-pro', function() {
	gulp.src(match).pipe(peg({
			exportVar: 'prim'
		}))
		.pipe(uglify())
		.pipe(rename({
			basename: 'prim.min'
		}))
		.pipe(gulp.dest(clientdest));
});

gulp.task('compile-npm', function() {
	gulp.src(match).pipe(peg())
		.pipe(gulp.dest(serverdest));
});

gulp.task('watch', function() {
	gulp.watch(match, ['compile']);
});
