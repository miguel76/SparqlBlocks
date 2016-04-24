var fs = require('fs'),
    gulp = require('gulp'), 
    notify = require("gulp-notify") ,
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    vfs = require('vinyl-fs'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    pathmodify = require('pathmodify'),
    closure = require('gulp-closure-compiler-service'),
    exposify = require('exposify');

require('./blockly.js');
require('./json.js');

var config = {
  nodeDir: './node_modules' ,
  jsDistDir: "./dist",
  jsBundleName: "sparqlblocks.js"
};

gulp.task('browserify', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    // entries: './src/index.js',
    entries: './src/editorSetup.js',
    debug: true
  });

  exposify.config = { jquery: '$', underscore: '_' };

  // browserify()
  //   .require(require.resolve('./main'), { entry: true })
  //   .transform(exposify)
  //   .bundle({ debug: true })
  //   .on('end', function () {
  //     console.log('all done, open index.html')
  //   })
  //   .pipe(fs.createWriteStream(path.join(__dirname, 'bundle.js'), 'utf8'))

  return b.transform(exposify)
        .bundle()
        .pipe(source('sparqlblocks.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('makeJs', ['buildBlockly', 'browserify', 'json']);
