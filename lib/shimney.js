var sprintf = require('sprintf').sprintf;
var npm = require('npm');
var path = require('path');

module.exports = function (grunt) {

  var _ = grunt.util._, that = this;

  this.loadShim = function (name) {
    var shim = grunt.file.readJSON(sprintf('shimneys/%s.json', name));

    shim.dir = sprintf('shimneys/%s/', name);
    shim.id = sprintf('shimney-%s', shim.name);

    return shim;
  };

  this.loadShims = function() {
    var shims = [];
    _(grunt.file.expand(['shimneys/*.json'])).forEach(function (file) {
      shims.push(that.loadShim(path.basename(file, '.json')));
    });

    return shims;
  };

  this.createPackageJSON = function (shim) {
    // copy everything from config which should be metadata from the package.json
    var pkg = {
      name: shim.id,
      version: shim.version
    };

    _.merge(pkg, shim.packageJSON);

    pkg.description = sprintf('Shimney package: %s.%s', shim.name, pkg.description ? ' '+pkg.description : '');
    pkg.keywords = _.merge(['shimney-package'], pkg.keywords || []);

    return pkg;
  };

  this.prePublish = function (shim, done) {
    if (!grunt.file.isDir(shim.dir)) {
      grunt.file.mkDir(shim.dir);
    }

    grunt.file.write(shim.dir+'package.json', JSON.stringify(that.createPackageJSON(shim), null, 2));
  };

  this.npmInit = function (done, npmConfig, callback) {
    if (_.isFunction(npmConfig)) {
      callback = npmConfig;
      npmConfig = {};
    }

    var npmError = function (err) {
      grunt.log.error('npm error: '+err+' code: '+err.code);
      done(false);
    };

    npmConfig = _.merge({
      silent: true
    }, npmConfig || {});

    npm.load(npmConfig, function (err) {
      if (err) return npmError(err);

      callback(npmError);
    });
  };

  this.publish = function (shim, done) {
    this.npmInit(done, function(npmError) {
      npm.commands.publish([shim.dir], function (err) {
        if (err) return npmError(err);

        grunt.log.ok(sprintf('published shimney: %s to npm registry with version %s', shim.name, shim.version));
        done(true);
      });
    });
  };

  this.getRemoteVersion = function(shim, done, callback) {
    this.npmInit(done, {silent: true}, function(npmError) {
      npm.commands.view([shim.id, 'version'], true, function (err, message) {
        if (err) npmError(err);

        for (var remoteVersion in message) break;

        return callback(remoteVersion);
      });
    });
  };

  this.verifyAll = function(done) {
    var shims = this.loadShims();
    for (var i = 0; i < shims.length; i++) {
      that.verify(shims[i], done);
    }
  };

  this.verify = function(shim, done) {
    this.getRemoteVersion(shim, done, function(remoteVersion) {
      if (remoteVersion !== shim.version) {
        grunt.log.error(sprintf('%s: remote version (%s) differs from local (%s)', shim.name, remoteVersion, shim.version));
      } else {
        grunt.log.ok(sprintf('verified remote version from %s as: %s', shim.name, remoteVersion));
      }
    });
  };
};