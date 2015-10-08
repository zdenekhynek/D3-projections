var gulp = require('gulp');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var rev = require('gulp-rev');
var inject = require('gulp-inject');
var connect = require('gulp-connect');

var browserify = require('browserify');
var babelify = require('babelify');
var del = require('del');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var resolve = require('resolve');
var series = require('stream-series');
var argv = require('yargs').argv;

var production = true;

gulp.task('default', ['clean', 'inject', 'webserver'], function() {});

gulp.task('webserver', function() {
  connect.server( {
    livereload: true,
    root: 'public'
  });
});

gulp.task('watch', function(){
    gulp.watch(['app/scripts/**/*.js',"app/index.html"], function(event) {
      gulp.run('clean');
      gulp.run('inject');
    });
});
gulp.task('reload',function() {
  connect.reload();
});

gulp.task('clean', function(cb) {
  return del(['./public'], cb);
});

gulp.task('inject', ['vendor', 'scripts'], function() {
  var vendor = gulp.src('./public/scripts/vendor*.js', {read: false});
  var scripts = gulp.src('./public/scripts/scripts*.js', {read: false});

  gulp.src('./app/index.html')
    .pipe(inject(series(vendor, scripts), {ignorePath: '/public/'}))
    .pipe(gulp.dest('./public'))
    .pipe(connect.reload());

  //copy data folder
  gulp.src('./app/data/*').pipe(gulp.dest('./public/data'));
  gulp.src('./app/imgs/*').pipe(gulp.dest('./public/imgs'));
  gulp.src('./app/css/*/**').pipe(gulp.dest('./public/css'));

});

gulp.task('vendor', function() {
  var b = browserify({debug: !production});

  getNPMPackageIds().forEach(function(id) {
    b.require(resolve.sync(id), {expose: id});
  });

  return bundle('vendor.js', b);
});

gulp.task('scripts', function() {
  var b = browserify({debug: !production})
    .require('./app/scripts/app.js', {entry: true})
    .transform(babelify);

  getNPMPackageIds().forEach(function(id) {
    b.external(id);
  });

  return bundle('scripts.js', b);
});

function bundle(name, b) {
  return b.bundle().pipe(source(name))
    .pipe(gulpif(production, streamify(uglify())))
    .pipe(rename(name.substring(0, name.lastIndexOf('.js')) + '.min.js'))
    .pipe(buffer())
    .pipe(rev())
    .pipe(gulp.dest('./public/scripts'));
}

function getNPMPackageIds() {
  // read package.json and get dependencies' package ids
  var packageManifest = {};
  try {
    packageManifest = require('./package.json');
  } catch (e) {
    // does not have a package.json manifest
  }
  return Object.keys(packageManifest.dependencies) || [];
}