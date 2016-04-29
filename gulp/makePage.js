var gulp = require('gulp'),
    extender = require('gulp-html-extend');

gulp.task('makePage', function() {
    return gulp.src('./src/page/index.html')
                .pipe(extender({annotations:true,verbose:false})) // default options
                .pipe(gulp.dest('./dist/'));
});
