# sandbox.js

[![Build Status](https://travis-ci.org/KlausTrainer/sandbox.js.svg?branch=main)](https://travis-ci.org/KlausTrainer/sandbox.js)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This is a module that allows for executing functions within a sandbox in
Node.js.  It provides a `runInSandbox` function that takes a function as
argument, as well as an optional context and an optional module whitelist.  If
the context contains a `require` property and a whitelist is specified, the
`require` property will be replaced by a "secure" require function before the
specified function is executed in the sandbox.  The "secure" require function
is a wrapper around the default require function provided by Node.js, and does
nothing more than either loading a module or throwing an error, based on the
whitelist.  If no whitelist is specified, we default to an empty whitelist.

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
    sandbox.runInSandbox(consoleFun, context); // => Error: 'console' is not whitelisted
    sandbox.runInSandbox(consoleFun, context, whitelist); // => Hello World!

    sandbox.runInSandbox(httpFun, context); // => 'OK'
    sandbox.runInSandbox(httpFun, context, whitelist); // => Error: 'http' is not whitelisted
````
