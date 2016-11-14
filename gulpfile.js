var gulp = require('gulp');
var browser = require('browser-sync');
var runSequence = require('run-sequence');
var rename = require("gulp-rename");
var reload = browser.reload;

gulp.task('serve', function() {
    browser({
        port: process.env.PORT || 4500,
        open: false,
        ghostMode: false,
        server: {
            baseDir: '/'
        }
    });
});

gulp.task('watch', function() {
	gulp.watch('src/*.js', ['copy']);
	gulp.watch('*.js', reload);
});

gulp.task('copy', function() {
    gulp.src('src/easynumber.js')
      .pipe(rename('index.js'))
      .pipe(gulp.dest('.'));
});

gulp.task('default', function () {
	runSequence('watch', 'serve');
});