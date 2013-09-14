# sandbox.js

## Usage

````javascript
    var sandbox = require("./sandbox"),
      whitelist = ["console"],
      context = {require: require},
      theAnswerFun = function() { return 42; },
      consoleFun = function() { require("console").log("Hello World!"); },
      httpFun = function() { return require("http").STATUS_CODES['200']; };

    sandbox.runInSandbox(theAnswerFun); // => 42

    sandbox.runInSandbox(consoleFun); // => ReferenceError: require is not defined
    sandbox.runInSandbox(consoleFun, context); // => Hello World!
    sandbox.runInSandbox(consoleFun, context, whitelist); // => Hello World!

    sandbox.runInSandbox(httpFun, context); // => 'OK'
    sandbox.runInSandbox(httpFun, context, whitelist); // => Error: 'http' is not whitelisted
````

## Running the Tests

````Shell
    nodeunit test
````

This requires nodeunit to be installed as a global package (`npm install
-g nodeunit`).
