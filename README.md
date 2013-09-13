# sandbox.js

## Usage

````javascript
    var sandbox = require("./sandbox"),
      whitelist = ["console"],
      context = {require: sandbox.secureRequire(require, whitelist)},
      goodFun = function() { require("console").log("Hello World!"); },
      badFun = function() { require("http"); };

    sandbox.runInSandbox(goodFun, context); // => Hello World!

    sandbox.runInSandbox(badFun, context); // => Error: 'http' is not whitelisted
````

## Running the Tests

````Shell
    nodeunit test
````

This requires nodeunit to be installed as a global package (`npm install
-g nodeunit`).
