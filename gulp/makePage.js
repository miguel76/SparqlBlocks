var gulp = require('gulp'),
    xslt = require('gulp-xslt');

gulp.task('makePage', function() {
  process.chdir('./src/page/');
  gulp.src('index.html')
      .pipe(xslt('mainPage.xslt'))
      .pipe(gulp.dest('../../dist/'));
});

gulp.task('makePage-bundleAll', function() {
  process.chdir('./src/page/');
  gulp.src('index.html')
      .pipe(xslt('mainPage.xslt', { bundledLibs: 'false'}))
      .pipe(gulp.dest('../../dist/'));
});
