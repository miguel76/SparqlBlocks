var fs = require('fs'),
    gulp = require('gulp'),
    notify = require("gulp-notify"),
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    vfs = require('vinyl-fs'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    pathmodify = require('pathmodify'),
    exposify = require('exposify');

require('./blockly.js');
require('./json.js');

var config = {
  nodeDir: './node_modules',
  jsDistDir: "./dist",
  jsBundleName: "sparqlblocks.js"
};

exposify.config = { jquery: '$', underscore: '_' };

var browserifyEditorSetup = browserify({
  entries: './src/editorSetup.js',
  debug: true
});

var processJs = function(pipe) {
  return pipe.transform('brfs')
      .bundle()
      .pipe(source('sparqlblocks.min.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .on('error', gutil.log)
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist/js/'));
}

gulp.task('processJs', function () {
  return processJs(browserifyEditorSetup);
});

gulp.task('processJs-extlibs', function () {
  return processJs(browserifyEditorSetup.transform('exposify'));
});

gulp.task('makeJs', ['buildBlockly', 'processJs-extlibs']);
gulp.task('makeJs-bundleAll', ['buildBlockly', 'processJs']);
