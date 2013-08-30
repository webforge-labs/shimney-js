## shimney configuration

```javascript
requirejs.config({

  "packages": {
    name: '{{shim.name}}',
    location: '/js/npm_modules/shimney-{{shim.name}}' // adjust path to a web url to your npm_modules repository
  }

});
```

[Shimney ](https://github.com/webforge-labs/shimney-js) is a set of shim packages from webforge. This package is maintained from webforge and {{shim.author}} is not responsible for this.
