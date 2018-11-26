'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var log = require('gulplog');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var rsync = require('gulp-rsync');
const template = require('gulp-template');
var gulpif = require('gulp-if');
var argv = require('minimist')(process.argv.slice(2));
var connect = require('gulp-connect');
var replace = require('gulp-replace');
var merge = require('merge-stream');
var path = require('path');

gulp.task('js', function(){
  return browserify({
    entries: './src/index.js',
    debug: true
  })
  .bundle()
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe(gulpif(!argv.deploy, sourcemaps.init({loadMaps: true})))
  .pipe(gulpif(argv.deploy, babel({
    presets: ['env'],
    compact: false,
    plugins: ['transform-remove-strict-mode']
  })))
  .pipe(gulpif(!argv.deploy, sourcemaps.write('./')))
  .pipe(gulp.dest('./dist'))
  .pipe(connect.reload());
});

gulp.task('css', function(){
  return merge(
    gulp.src([require.resolve("font-awesome/css/font-awesome.min.css")])
    .pipe(replace("url('../fonts/", "url('./fa/")),
    gulp.src([
      require.resolve("bootstrap/dist/css/bootstrap.min.css"),
      require.resolve("nvd3/build/nv.d3.min.css"),
      './src/index.css'
  ]))
  .pipe(concat('app.css'))
  .pipe(gulp.dest('./dist'))
  .pipe(connect.reload());
});

gulp.task('html', ['views'], function(){
  return gulp.src('./src/*.html')
  .pipe(gulp.dest('./dist'))
  .pipe(connect.reload());
});

gulp.task('views', function(){
  return gulp.src('./src/components/*.html')
  .pipe(gulp.dest('./dist/c'))
  .pipe(connect.reload());
});

gulp.task('res', ['res.fontawesome'], function(){
  return gulp.src(['./res/**'])
  .pipe(gulp.dest('./dist/res'));
});

gulp.task('res.fontawesome', function(){
  return gulp.src([path.dirname(require.resolve("font-awesome/package.json")) + '/fonts/**'])
  .pipe(gulp.dest('./dist/fa'))
});

gulp.task('local', ['js', 'css', 'html'], function(){
  connect.server({
    root: './dist',
    livereload: true,
    port: 3000
  });
  gulp.watch(['./src/**/*.js'], ['js']);
  gulp.watch(['./src/**/*.css'], ['css']);
  gulp.watch(['./src/**/*.html'], ['html']);
});

gulp.task('default', ['res', 'local']);
