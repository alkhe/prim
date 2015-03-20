var parsegen = 'peg';

var gulp = require('gulp'),
	jison = require('gulp-jison'),
	peg = require('gulp-peg'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	babel = require('gulp-babel'),
	del = require('del'),
	b = require('browserify'),
	transform = require('vinyl-transform');

var pegmatch = './src/peg/*.peg',
	jisonmatch = './src/jison/*.jison',

	specmatch = './spec/*.js',

	commondest = './lib/',
	serverdest = './',
	clientdest = './dist/',

	indexmatch = './prim.js';

var browserified = function(name) {
	return transform(function(filename) {
		return b({
			entries: filename,
			standalone: name
		}).bundle();
	});
};

gulp.task('compile', ['compile-common', 'compile-dev', 'compile-pro', 'compile-test']);

gulp.task('compile-common', [parsegen == 'jison' ? 'compile-jison' : 'compile-peg']);

gulp.task('compile-jison', function() {
	gulp.src(jisonmatch).pipe(jison({
			moduleType: 'commonjs',
			type: 'lalr',
			moduleName: 'prim'
		}))
		.pipe(gulp.dest(commondest));
});

gulp.task('compile-peg', function() {
	gulp.src(pegmatch).pipe(peg())
		.pipe(gulp.dest(commondest));
});

gulp.task('compile-dev', function() {
	gulp.src(indexmatch)
		.pipe(browserified('prim'))
		.pipe(gulp.dest(clientdest));
});

gulp.task('compile-pro', function() {
	gulp.src(indexmatch)
		.pipe(browserified('prim'))
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

gulp.task('compile-distinct', function() {

	gulp.src(jisonmatch).pipe(jison({
			moduleType: 'commonjs',
			type: 'lalr',
			moduleName: 'prim'
		}))
		.pipe(gulp.dest(commondest));

	gulp.src(indexmatch)
		.pipe(browserified('primjison'))
		.pipe(uglify())
		.pipe(rename({
			basename: 'prim.jison'
		}))
		.pipe(gulp.dest(clientdest));

	gulp.src(pegmatch).pipe(peg())
		.pipe(gulp.dest(commondest));

	gulp.src(indexmatch)
		.pipe(browserified('primpeg'))
		.pipe(uglify())
		.pipe(rename({
			basename: 'prim.peg'
		}))
		.pipe(gulp.dest(clientdest));

	del(commondest + '*');
});

gulp.task('clean', function() {
	del(clientdest + '*');
	del(commondest + '*');
});

gulp.task('watch', function() {
	gulp.watch(match, ['compile']);
});
