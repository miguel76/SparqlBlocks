var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    notify = require("gulp-notify");

var config = {
  sassPath: './resources/scss',
  nodeDir: './node_modules',
  flaticonDir: './resources/flaticon',
  cssDistDir: './dist/css'
};

gulp.task('octicons', function() {
    return gulp.src(config.nodeDir + '/octicons/octicons/@(*.eot|*.svg|*.ttf|*.woff)')
              .pipe(gulp.dest(config.cssDistDir + '/fonts'));
});

gulp.task('flaticon', function() {
    return gulp.src(config.flaticonDir + '/**.*')
              .pipe(gulp.dest(config.cssDistDir + '/fonts'));
});

gulp.task('icons', ['flaticon', 'octicons']);

gulp.task('css', function() {
  return sass(config.sassPath + '/style.scss',
              {
                style: 'compressed',
                loadPath: [
                  config.sassPath,
                  config.nodeDir
                ]
              }).on(
                "error", notify.onError(function (error) {
                return "Error: " + error.message;
              })).pipe(gulp.dest(config.cssDistDir));
});


// Rerun the task when a file changes
gulp.task('watch-style', function() {
  gulp.watch(config.sassPath + '/**/*.scss', ['css']);
  gulp.watch(config.flaticonDir + '/**/*.*', ['flaticon']);
});

gulp.task('makeStyle', ['icons', 'css']);
