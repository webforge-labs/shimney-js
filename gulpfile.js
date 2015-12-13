var gulp = require('gulp');
var amdWrap = require('gulp-wrap-amd');
var rename = require('gulp-rename');

gulp.task('superagent', function() {
  var execSync = require('child_process').execSync;
  var path = require('path');
  var modulePath = path.dirname(require.resolve('superagent'));

  execSync('browserify --standalone superagent --outfile '+__dirname+'/shimneys/superagent/main.js .', {'cwd': modulePath});
});

gulp.task('amplify', function() {
   return gulp.src(['resources/amplify/amplify.js'])
     .pipe(amdWrap({
        deps: ['jquery'],
        params: ['jQuery'],
        exports: 'amplify'
      }))
     .pipe(rename('main.js'))
     .pipe(gulp.dest('shimneys/amplify'))
});
