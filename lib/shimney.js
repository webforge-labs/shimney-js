var sprintf = require('sprintf').sprintf;
var npm = require('npm');

module.exports = function (grunt) {

  var _ = grunt.util._, that = this;

  this.loadShim = function (name) {
    var shim = grunt.file.readJSON(sprintf('shimneys/%s.json', name));

    shim.dir = sprintf('shimneys/%s/', name);

    return shim;
  };

  this.createPackageJSON = function (shim) {
    // copy everything from config which should be metadata from the package.json
    var pkg = {
      name: sprintf('shimney-%s', shim.name),
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

  this.publish = function (shim, done) {
    var npmConfig = {};

    var npmError = function (err) {
      grunt.log.error('npm error: '+err+' code: '+err.code);
      done(false);
    };

    npm.load(npmConfig, function (err) {
      if (err) return npmError(err);

      npm.commands.publish([shim.dir], function (err) {
        if (err) return npmError(err);

        grunt.log.ok(sprintf('published shimney: %s to npm registry with version %s', shim.name, shim.version));
        done(true);
      });
    });
  };
};