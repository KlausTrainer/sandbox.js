exports.testSecureRequire = function(test) {
  var sandbox = require("../sandbox"),
    whitelist = [
      "console",
      "./node_modules/http",
      "a",
      "b"
    ],
    context = {require: sandbox.secureRequire(require, whitelist)};

  test.doesNotThrow(function() {
    sandbox.runInSandbox(function() { require("console"); }, context);
  });

  test.throws(
    function() {
      sandbox.runInSandbox(function() { require("http"); }, context);
    },
    function(err) {
      if (err instanceof Error && err == "Error: 'http' is not whitelisted") {
        return true;
      } else {
        return false;
      }
    }
  );

  test.equal(
    42,
    sandbox.runInSandbox(
      function() {
        return require("./node_modules/http").getTheAnswer();
      },
      context
    )
  );

  test.equal(
    42,
    sandbox.runInSandbox(
      function() {
        return require("a").foo();
      },
      context
    )
  );

  test.throws(
    function() {
      sandbox.runInSandbox(
        function() {
          require("a").bar();
        },
        context
      );
    },
    function(err) {
      if (err instanceof Error && err == "Error: 'c' is not whitelisted") {
        return true;
      } else {
        return false;
      }
    }
  );

  test.done();
};
