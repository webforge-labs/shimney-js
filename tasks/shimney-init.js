
/*
* webforge-js-shimney
* http://www.ps-webforge.com/
*
* Copyright (c) 2013 Philipp Scheit
* Licensed under the MIT license.
*/

var npm = require('npm');

module.exports = function(grunt) {
  'use strict';

  var that = this, _ = grunt.util._;

  this.createShimneyConfigFromNPM = function(npmPackage) {

    var copyKeys = {
      'author':true,
      'description':true,
      'homepage':true,
      'keywords':true,
      'licenses': true,
      'license':true,
      'bugs':true,
      'repository':true
    };

    var packageJSON = {};
    _(npmPackage).forEach(function (value, key) {
      if (copyKeys[key] !== undefined && value !== '') {
        packageJSON[key] = value;
      }
    });

    var config = {
      name: npmPackage.name,
      version: npmPackage.versions.pop(),

      packageJSON: packageJSON
    };

    return config;
  };

  grunt.registerTask('shimney-init', 'Create a new cherished shim configuration file from npm.', function (npmPackageName) {
    var shim = { name: npmPackageName, configFile: 'shimneys/'+npmPackageName+'.json' };

    if (!this.flags.override && grunt.file.exists(shim.configFile)) {
      grunt.fatal('the '+shim.configFile+' is already written. Will not override it.');
    }

    var done = this.async();
    var npmConfig = {};
    var npmError = function (err) {
      grunt.log.error('npm error: '+err);
      done(false);
    };

    npm.load(npmConfig, function (err) {
      if (err) return npmError(err);

      npm.commands.view([npmPackageName], true, function (err, data) {
        if (err) return npmError(err);

        var npmPackage = _.values(data)[0];

        var shimConfig = that.createShimneyConfigFromNPM(npmPackage);

        grunt.file.write(shim.configFile, JSON.stringify(shimConfig, null, 2));
        grunt.log.ok('Written to file '+shim.configFile);

        done(true);
      });
    });
  });
};