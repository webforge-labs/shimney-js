
/*
* webforge-js-shimney
* http://www.ps-webforge.com/
*
* Copyright (c) 2013 Philipp Scheit
* Licensed under the MIT license.
*/

var Shimney = require('../lib/shimney');

module.exports = function(grunt) {
  'use strict';

  grunt.registerTask('shimney', 'Manage cherished shim repositories.', function (todo, name) {
    var shimney = new Shimney(grunt);
    var done = this.async();

    var shim = shimney.loadShim(name);

    grunt.verbose.writeln('loaded shim package:');
    grunt.verbose.writeflags(shim);

    if (todo === 'publish') {
      shimney.prePublish(shim, done);
      shimney.publish(shim, done);
    }
  });
};