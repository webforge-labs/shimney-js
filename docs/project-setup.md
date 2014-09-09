# Project Setup

I have fiddled a lot around the perfect project-build-setup with grunt and other tasks, and here is what I came up with.

## Requirements

I had several requirements to my project setup, these are some of them:

  - everything what you want to code in js is an amd module
  - every third party module is an amd module
  - everything will be loaded with requirejs
  - it is easy to load with requirejs in an dev mode where files can be changed on the fly. Meaning that now grunt watch task is copying files (and delaying the development process)
  - it is easy to combine all your amd modules into layers compiled with r.js (the compiler from requirejs)
  - the requirejs-config files for the build mode and the dev mode look like the same

## Directory locations

I assume that:

  - the root directory is the directory where the `Gruntfile.js` and the `package.json` reside
  - you're own modules are in `src/js` (called srcDir)
  - the modules that are third party libraries are in `src/js/lib` (called libDir)
  - other modules are installed with shimney
  - you're public directory is www/ in the root of your project
  - you have (in your apache config) an alias /root pointing to the root directory of your project (only needed in dev mode)

## Grunt

If you have one clumpsy Gruntfile.js its really difficult to setup everything. So I split it up into several files. The reside in `etc/grunt` in this example. Create your Gruntfile like this:

Gruntfile.js
```js
/*global module:false, process:true */
module.exports = function(grunt) {
  
  require('load-grunt-config')(grunt, {
    configPath: require('path').join(process.cwd(), 'etc', 'grunt'),
    init: true,
    loadGruntTasks: {
      pattern: ['grunt-*'],
    },
    data: {
      beautify: !!grunt.option('no-uglify'),
      version: grunt.option('build-version') || (new Date()).getTime(),
      libDir: 'src/js/lib',
      srcDir: 'src/js',
      buildDir: grunt.option('dir') || "www/assets/js"
    },
  });

  grunt.registerTask('build-dev', ['jshint', 'hogan', 'sweepout', 'copy:jslibs', 'merge-configs:dev', 'uglify:requirejswithconfig', 'cssmin', 'copy:img', 'copy:fonts']);
  grunt.registerTask('build', ['jshint', 'hogan', 'sweepout', 'copy:jslibs', 'copy:jsbuild', 'merge-configs:build', 'uglify:requirejswithconfig', 'requirejs', 'cssmin', 'copy:img', 'copy:fonts']);

  grunt.task.registerTask('test', ['jshint']);
};
```

I will not explain every detail. Hopefully someday, we have a yeoman generator for all of this. But here are some infos how this works:

## Dev mode

To activate the dev mode (amd modules can be edited "on the fly") just run:
```
grunt build-dev
```

This does the following: 
  - It compiles your javascript templates
  - it sweepouts the shimney packages (third party modules) to `src/js/lib`
  - the config-dev file is merged with the main config file (both are in `src/js`) and the baseUrl for requirejs is set to: `/root/src/js` to load files on the fly (with the apache alias)
  - it combines the requirejs-library with the config, so that you only have to load `/assets/js/load-require.js` in html
  - it minifies the css (standard)
  - it copies some files to www/assets

###  How it works

requirejs is loaded (including the merged config.js files) with:
```html
<script type="text/javascript" src="/assets/js/load-require.js"></script>
```
that's the only script you'll need in your html-files to load EVERYTHING.

You can then require some modules and start working on it:
```js
require(['bootstrap/tooltip', 'jquery'], function(bsTooltip, $) {
  // add the bootstrap widget to all elements with the class tooltip
  $('.tooltip').tooltip();
});
```

If you want to load a third party module with requirejs. Just put it into `src/js/lib` e.g. `src/js/lib/amplify-1.0.0.js` and reference it in the config.js:

config.js
```js
  paths: {
    "amplify": "lib/amplify-1.0.0.js"
  }
```

you can then load the desired module like the others:

````js
require(['amplify'], function(Amplify) {
   // do something with Amplify here
});
```

Shimney modules should be sweepedout to `src/js/lib` as well, so that they can be loaded, too.

## recommendations

Ignore the `www/assets` folder in .gitignore and always create all files in it with `grunt build-dev` or `grunt build`.
Try to define all paths in the config.js. If they differ in dev mode, change only in the `config-dev.js`.
For `grunt build` copy EVERYTHING into the `www/assets/js` folder and then run r.js with this folder as baseUrl.

