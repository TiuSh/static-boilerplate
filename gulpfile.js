var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var webpackStream = require('webpack-stream');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('build', ['build:js', 'build:style']);

gulp.task('build:js', function() {
  return gulp
    .src('./src/*.js')
    .pipe(webpackStream({
      output: {
        filename: 'main.js',
      },
      plugins: [
        new webpackStream.webpack.optimize.UglifyJsPlugin(),
      ],
      devtool: 'source-map',
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build:style', function() {
  return gulp
    .src('./src/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .pipe(reload({ stream: true }));
});

gulp.task('dev', ['build'], function() {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });

  gulp.watch('./src/*.scss', ['build:style']);
  gulp.watch('./src/*.js', ['build:js']);

  gulp.watch('./dist/*.js', reload);
  gulp.watch('./index.html', reload);
});

gulp.task('default', ['build'])
