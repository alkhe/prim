var gulp = require('gulp'),
	peg = require('gulp-peg');

var match = 'src/**/*.peg',
	dest = 'lib/';

gulp.task('compile', function() {
	gulp.src(match)
		.pipe(peg({
			exportVar: 'prim'
		}))
		.pipe(gulp.dest(dest));
});

gulp.task('watch', function() {
	gulp.watch(match, ['compile']);
});
