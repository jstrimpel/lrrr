var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('ci', function () {
     return gulp.src('test/specs/add/index.js', { read: false })
        .pipe(mocha({ reporter: 'spec' }));
});