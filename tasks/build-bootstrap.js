
/*
* webforge-js-shimney
* http://www.ps-webforge.com/
*
* Copyright (c) 2013 Philipp Scheit
* Licensed under the MIT license.
*/
module.exports = function(grunt) {
  'use strict';

  grunt.registerTask('build-bootstrap', 'Creates a version from shimney-bootstrap', function () {
    var done = this.async();
    var fs = require('fs-extra');
    var exec = require('child_process').exec;
    var cp = require('glob-copy');
 
    fs.mkdirsSync('build/bootstrap/js');
    fs.copySync('node_modules/bootstrap/package.json', 'build/bootstrap/package.json');

    fs.copy('node_modules/bootstrap/js/', 'build/bootstrap/js', function (err) {
      if (err) {
        grunt.log.error(err);
        done();
      } else {

        exec('node node_modules/bootstrap-amd/bootstrap-amd.js build/bootstrap', {  }, function(error, stdout, stderr) {
          if (error) {
            grunt.log.error(stdout);
            grunt.log.error(stderr);
            grunt.log.error('error while converting to amd');
          } else {
            grunt.log.ok('converted bootstrap to AMD');
          }

          // fix popover dependency on tooltip
          var popover = fs.readFileSync('build/bootstrap/popover.js').toString();
          popover = popover.replace(/(define\(\[.*?)\s*\]/, "$1, './tooltip' ]");
          fs.writeFileSync('build/bootstrap/popover.js', popover);

          // copy to shimney
          fs.emptyDirSync('shimneys/twitter-bootstrap/amd');
          cp.sync('build/bootstrap/*.js', 'shimneys/twitter-bootstrap/amd');

          grunt.log.ok('patched and copied files to shimney');

          // sync version
          var targetVersion = fs.readJsonSync('build/bootstrap/package.json').version;

          var pkg = fs.readJsonSync('shimneys/twitter-bootstrap.json');
          pkg.version = targetVersion;

          fs.writeJsonSync('shimneys/twitter-bootstrap.json', pkg);

          grunt.log.ok('dumped version in shimney/twitter-bootstrap.json to '+targetVersion)

          done();
        });
      }
    });
  });
};
