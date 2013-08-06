# sandbox.js

## Usage

````javascript
    var sandbox = require("./sandbox"),
      whiteList = ["console"],
      context = {require: sandbox.secureRequire(require, whiteList)},
      goodFun = function() { require("console").log("Hello World!"); },
      badFun = function() { require("http"); };

    sandbox.runInSandbox(goodFun, context); // => Hello World!

    sandbox.runInSandbox(badFun, context); // => Error: 'http' is not whitelisted
````
