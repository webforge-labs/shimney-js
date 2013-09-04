# shimney

Shim packages for popular libraries installable with nodes package manager: npm, designed for use in requirejs AMD projects.

So what's comming down the shimney tonight? It's a lot of nice packages!

## the idea

shimney tries to solve the frontend packaging problem for the most popular javascript libraries. But instead of using an own package manager and some non used format for frontend libraries, it cherishes shim repositories for popular libraries on npm.  
Our main goal is to provide EASY to use packages for one scenario:

  - your package loader is requirejs
  - you want all your modules loaded and written in amd
  - your mainly developing for client side applications (browser environment)

## how to use it

You can find all packages for shimney if you [search npm](https://npmjs.org/search?q=shimney-) for `shimney-`. Every package avaible is prefixed with `shimney-`. 

If you haven't got a `package.json` for npm create one with: 
```
npm init
```

cd to the directory where your `package.json` resides. You can install your desired Package with npm: 

```
npm install shimney-<yourPackage> --save
```

this updates your `package.json` with the dependency to shimney and pulls the package from npm.

Configure your requirejs to include the node module as an [requirejs package](http://requirejs.org/docs/api.html#packages).

```javascript
requirejs.config({

  "packages": [
    {
      name: '<yourPackage>',
      location: 'web/path/to/node_modules/shimney-<yourPackage>'
    }
  ]

});
```

Notice: You can pick any named as an alias for your requirejs config. But its recommended to use the package name without the `shimney-` part.

And you're ready to use your installed shimney package with requirejs:

```javascript
define(['<yourPackage>'], function(myPackageAlias) {
  
});
```

for example with knockout:

```
npm install shimney-knockout --save
```

```javascript
requirejs.config({

  "packages": [
    {
      name: 'knockout',
      location: '/js/modules/shimney-knockout'
    }
  ]

});

define(['knockout'], function(ko) {
  
  var observableItem = ko.observable();

});
```

Notice: in this example /js/modules is rewrited to the node_modules/ directory in the project root (next to the package.json). You can use apache's `/alias` for this.

## FAQ

### requirejs? npm? amd? gruntjs? what is all this?

  - [about requirejs and AMD](http://requirejs.org)
  - [about npm](https://npmjs.org) and [node](http://nodejs.org)
  - [about grunt](http://gruntjs.com/)

### the library I'm searching is not on npm shimney

please file a issue on this repository

### the library I'm searching for is on npm shimney but I need another version

please file a issue on this repository

### phew this requirejs config thingy is really difficult

we will try to release a gruntplugin for that as soon as we can.

### do I need to install this repository / module?

no. This repository is only used to build the handcrafted shimneys for npm.

### what is a webforge?

We are a small company developing for clients and open source projects in php an javascript. [ps-webforge.com](http://www.ps-webforge.com)

## Licence

MIT (but consider the licenses from every single shimney package)
