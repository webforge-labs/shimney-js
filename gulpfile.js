var gulp = require('gulp');

gulp.task('superagent', function() {
  var execSync = require('child_process').execSync;
  var path = require('path');
  var modulePath = path.dirname(require.resolve('superagent'));

  execSync('browserify --standalone superagent --outfile '+__dirname+'/shimneys/superagent/main.js .', {'cwd': modulePath});
});