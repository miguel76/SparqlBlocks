require('./gulp/style');
require('./gulp/javascript');

var gulp = require('gulp');
gulp.task('default', ['makeJs', 'makeStyle']);
// gulp.task('serve', ['makeCss', 'makeMainPage', 'browserifyForDebug', 'watch', 'connect']);


// Rerun tasks when file change
 gulp.task('watch', ['watch-style']);
