var gulp = require('gulp'), 
    sass = require('gulp-ruby-sass') 
    notify = require("gulp-notify") 
    bower = require('gulp-bower');

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

// gulp.task('octicons', function() { 
//     return gulp.src(config.bowerDir + '/primer/fonts/**.*') 
//         .pipe(gulp.dest('./public/fonts')); 
// });

gulp.task('flaticon', function() { 
    return gulp.src(flaticonDir + '/**.*') 
              .pipe(gulp.dest('./dist/fonts')); 
});

gulp.task('icons', ['flaticon']);

gulp.task('css', function() { 
  return gulp.src(config.sassPath + '/style.scss')
              .pipe(sass({
                 style: 'compressed',
                 loadPath: [
                   config.sassPath ,
                  config.bowerDir
//                 config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
//                 config.bowerDir + '/fontawesome/scss',
                 ]
              }) .on("error", notify.onError(function (error) {
                return "Error: " + error.message;
              }))) .pipe(gulp.dest('./dist/css')); 
});

// Rerun the task when a file changes
 gulp.task('watch', function() {
     gulp.watch(config.sassPath + '/**/*.scss', ['css']); 
});

  gulp.task('default', ['bower', 'icons', 'css']);
