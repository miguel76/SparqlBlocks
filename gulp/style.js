var gulp = require('gulp'), 
    sass = require('gulp-ruby-sass') 
    notify = require("gulp-notify") 
    bower = require('gulp-bower'),
    sass = require('gulp-ruby-sass');

var config = {
  sassPath: './resources/scss',
  bowerDir: './bower_components' ,
  flaticonDir: './resources/flaticon' ,
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
              .pipe(gulp.dest('./dist/css/fonts'));
});

gulp.task('flaticon', function() { 
    return gulp.src(config.flaticonDir + '/**.*') 
              .pipe(gulp.dest('./dist/css/fonts')); 
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
              })).pipe(gulp.dest('./dist/css')); 
});

// Rerun the task when a file changes
 gulp.task('watch-style', function() {
   gulp.watch(config.sassPath + '/**/*.scss', ['css']); 
  gulp.watch(config.flaticonDir + '/**/*.*', ['flaticon']); 
});

  gulp.task('default', ['bower', 'icons', 'css']);
