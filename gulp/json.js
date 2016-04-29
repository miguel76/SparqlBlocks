var gulp = require('gulp'),
    rename = require('gulp-rename'),
    remoteSrc = require('gulp-remote-src');

var jsonDistDir = './dist/json/';

  gulp.task('prefixJson', function() {
    return remoteSrc(['all.file.json'], {
        base: 'http://prefix.cc/popular/'
  }).pipe(rename("prefix.cc.json")).pipe(gulp.dest(jsonDistDir));
});

gulp.task('json', ['prefixJson']);
