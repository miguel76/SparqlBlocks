var fs = require('fs'),
    gulp = require('gulp'), 
    sass = require('gulp-ruby-sass') 
    notify = require("gulp-notify") 
    bower = require('gulp-bower'),
    sass = require('gulp-ruby-sass'),
    browserify = require('browserify'),
    uglify = require('gulp-uglify');

var config = {
  sassPath: './resources/scss',
  bowerDir: './bower_components' ,
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
    return gulp.src(config.bowerDir + '/octicons/octicons/@(*.eot|*.svg|*.ttf|*.woff)')
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
                  config.bowerDir
                 ]
              }) .on("error", notify.onError(function (error) {
                return "Error: " + error.message;
              })).pipe(gulp.dest(config.cssDistDir)); 
});

gulp.task('browserify', function() {
	var bundler = browserify({
      entries: ["./src/index.js"],
      standalone: "SparqlBlocks",
      debug: true });

	return bundler.bundle()
                // .pipe(uglify())
                var writeFileAtomicSync = require('write-file-atomic').sync
                .pipe(fs.createWriteStream(config.jsDistDir + '/' + config.jsBundleName));

		// // .transform({global:true}, shim)
		// .bundle()
		// .pipe(exorcist(config.bundleDir + '/' + config.bundleName + '.js.map'))
		// .pipe(source(config.bundleName + '.js'))
		// .pipe(gulp.dest(config.bundleDir))
		// .pipe(rename(config.bundleName + '.min.js'))
		// .pipe(buffer())
		// .pipe(sourcemaps.init({
		// 	loadMaps: true,
		// 	debug:true,
		// }))
		// .pipe(uglify({
		// 	compress: {
		// 		//disable the compressions. Otherwise, breakpoints in minified files don't work (sourcemaped lines get offset w.r.t. original)
		// 		//minified files does increase from 457 to 459 kb, but can live with that
	  //           negate_iife: false,
	  //           sequences: false
	  //       }
		// }))
		// .pipe(sourcemaps.write('./'))
		// .pipe(gulp.dest(config.bundleDir));
});


// Rerun the task when a file changes
 gulp.task('watch', function() {
   gulp.watch(config.sassPath + '/**/*.scss', ['css']); 
  gulp.watch(config.flaticonDir + '/**/*.*', ['flaticon']); 
});

  gulp.task('default', ['bower', 'icons', 'css', 'browserify']);
