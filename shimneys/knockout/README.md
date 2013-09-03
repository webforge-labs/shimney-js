**Knockout** is a JavaScript [MVVM](http://en.wikipedia.org/wiki/Model_View_ViewModel) (a modern variant of MVC) library that makes it easier to create rich, desktop-like user interfaces with JavaScript and HTML. It uses *observers* to make your UI automatically stay in sync with an underlying data model, along with a powerful and extensible set of *declarative bindings* to enable productive development.

##Getting started

**Totally new to Knockout?** The most fun place to start is the [online interactive tutorials](http://learn.knockoutjs.com/).

For more details, see

 * Documentation on [the project's website](http://knockoutjs.com/documentation/introduction.html)
 * Online examples at [http://knockoutjs.com/examples/](http://knockoutjs.com/examples/)

## shimney configuration

```javascript
requirejs.config({

  "packages": [{
    name: 'knockout',
    location: '/js/node_modules/shimney-knockout' // adjust path to a web url to your npm_modules repository
  }]

});
```

[Shimney](https://github.com/webforge-labs/shimney-js) is a package repository from webforge. This package is maintained from webforge and the knockout team is not responsible for this.

##License

MIT license - [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)
