var fs = require('fs'),
    gulp = require('gulp'), 
    sass = require('gulp-ruby-sass') ,
    notify = require("gulp-notify") ,
    bower = require('gulp-bower'),
    sass = require('gulp-ruby-sass'),
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    vfs = require('vinyl-fs'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    aliasify = require('aliasify'),
    pathmodify = require('pathmodify'),
    closure = require('gulp-closure-compiler-service');

var config = {
  sassPath: './resources/scss',
  bowerDir: './bower_components' ,
  nodeDir: './node_modules' ,
  flaticonDir: './resources/flaticon' ,
  cssDistDir: "./dist/css",
  jsDistDir: "./dist",
  jsBundleName: "sparqlblocks.js"
};

gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(config.bowerDir)) 
});

// for FontAwesome, currently not used
// gulp.task('icons', function() { 
//     return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*') 
//         .pipe(gulp.dest('./public/fonts')); 
// });

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
  return sass(config.sassPath + '/style.scss', {
                 style: 'compressed',
                 loadPath: [
                   config.sassPath ,
                  config.nodeDir
                 ]
              }) .on("error", notify.onError(function (error) {
                return "Error: " + error.message;
              })).pipe(gulp.dest(config.cssDistDir)); 
});

gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/index.js',
    debug: true
  });

  return b.plugin(pathmodify, {mods: [
    pathmodify.mod.dir('../closure-library', '../google-closure-library')
  ]})
    .bundle()
    .pipe(source('sparqlblocks.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});

// Rerun the task when a file changes
 gulp.task('watch', function() {
   gulp.watch(config.sassPath + '/**/*.scss', ['css']); 
  gulp.watch(config.flaticonDir + '/**/*.*', ['flaticon']); 
});

  gulp.task('default', ['icons', 'css', 'javascript']);
