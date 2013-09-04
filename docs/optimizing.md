# Optimizing shimneys in your project

If you want to run the r.js optimizer from requirejs you might get some trouble. Here are some tipps that will help:

  - use the `appDir` configuration with the main scripts directory (or one above your scripts directory, if you want to build/copy html or assets as well)
  - make the `baseUrl` relative to the `appDir`. If appDir is your scripts directory set it to `./`
  - use the `dir` output configuration only in a directory that is not below the `appdDir`
  - all module identifiers should be relative to the `baseUrl` (as in your app, because you pointed `baseUrl` to your scripts directory)
  - you will get into trouble if your `node_modules` (where the shimneys are) are lying underneath your `appDir`. To make it worse: if you use `removeCombined: true` r.js will delete the included files from the shimney packages (!!). I don't know why r.js would do something like this.
  - My solution right now is: my `DocumentRoot` is `www/`, my scripts directory is: `www/js`, the `node_modules/` directory is next to `www/`. I reference the shimneys in the packages config location like this: `../../node_modules/shimney-<name>`. That will fail for using requirejs in the browser because it cannot go below `DocumentRoot` to find the `node_modules` directory. So I added `alias /node_modules /abs/path/to/my/root/node_modules` to the apache-config.

## future ideas

I'm investigating why r.js behaviour is like this.  

Maybe it would help to put the node_modules into the `appDir` as well. But that has a huge drawback: r.js is copying EVERYTHING in the node_modules directory to your `dir` target.  

Another idea might be to write a small script that runs through the npm packages, filters all shimneys (and maybe other amd packages) and makes them avaible to the webroot scripts directory in `vendor`. This is similar to what composer is doing to create a autoload configuration. In this step it would be possible to write the requirejs programatically and copy some assets from shimneys as well (think about the twitter-bootstrap shimney). The drawback here is, that it would always require to do a shimney-export after an update or an install of packages through npm. 