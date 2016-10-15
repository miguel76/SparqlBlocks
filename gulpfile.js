require('./gulp/style');
require('./gulp/javascript');
require('./gulp/makePage');

var gulp = require('gulp');
gulp.task('default', ['makeJs', 'makeStyle', 'makePage']);
gulp.task('bundleAll', ['makeJs-bundleAll', 'makeStyle', 'makePage-bundleAll']);
// gulp.task('serve', ['makeCss', 'makeMainPage', 'browserifyForDebug', 'watch', 'connect']);

// Rerun tasks when file change
 gulp.task('watch', ['watch-style']);
