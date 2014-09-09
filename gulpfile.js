var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default', function () {
     return gulp.src('test/specs/*.js', { read: false })
        .pipe(mocha({ reporter: 'nyan' }));
});