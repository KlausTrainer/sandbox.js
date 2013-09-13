exports.testSecureRequire = function(test) {
  var sandbox = require("../sandbox"),
    whitelist = ["console"],
    context = {require: sandbox.secureRequire(require, whitelist)};

  test.doesNotThrow(function() {
    sandbox.runInSandbox(function() { require("console") }, context);
  });

  test.throws(
    function() {
      sandbox.runInSandbox(function() { require("http") }, context);
    },
    function(err) {
      if (err instanceof Error && err == "Error: 'http' is not whitelisted") {
        return true;
      } else {
        return false;
      }
    }
  );

  test.done();
};
