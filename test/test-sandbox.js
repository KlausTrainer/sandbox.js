exports.testSecureRequire = function(test) {
  var sandbox = require("../sandbox"),
    whitelist = [
      "console",
      "./node_modules/http",
      "a",
      "b"
    ],
    context = {require: require};

  var aBarInASandbox = function() {
    sandbox.runInSandbox(
      function() { require("a").bar(); },
      context,
      whitelist
    );
  };

  test.doesNotThrow(function() {
    sandbox.runInSandbox(
      function() { require("console"); },
      context,
      whitelist
    );
  });

  test.throws(
    function() {
      sandbox.runInSandbox(
        function() { require("http"); },
        context,
        whitelist
      );
    },
    function(err) {
      if (err instanceof Error && err == "Error: 'http' is not whitelisted") {
        return true;
      } else {
        return false;
      }
    }
  );

  test.throws(
    function() {
      sandbox.runInSandbox(
        function() { require("http"); },
        context,
        []
      );
    },
    function(err) {
      if (err instanceof Error && err == "Error: 'http' is not whitelisted") {
        return true;
      } else {
        return false;
      }
    }
  );

  test.throws(
    function() {
      sandbox.runInSandbox(
        function() { require("http"); },
        context,
        null
      );
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
      function() { return require("./node_modules/http").getTheAnswer(); },
      context,
      whitelist
    )
  );

  test.equal(
    42,
    sandbox.runInSandbox(
      function() { return require("a").foo(); },
      context,
      whitelist
    )
  );

  test.throws(
    aBarInASandbox,
    function(err) {
      if (err instanceof Error && err == "Error: 'c' is not whitelisted") {
        return true;
      } else {
        return false;
      }
    }
  );

  whitelist.push("c");

  test.throws(
    aBarInASandbox,
    function(err) {
      if (err instanceof Error && err == "Error: boooooyaaaaah!") {
        return true;
      } else {
        return false;
      }
    }
  );

  whitelist.pop();

  test.throws(
    aBarInASandbox,
    function(err) {
      if (err instanceof Error && err == "Error: 'c' is not whitelisted") {
        return true;
      } else {
        return false;
      }
    }
  );

  test.throws(
    function() {
      sandbox.runInSandbox(function() {
        return process.env; // could be any of http://nodejs.org/api/globals.html
      });
    },
    function(err) {
      if(err == "ReferenceError: process is not defined") {
        return true;
      } else {
        return false;
      }
    }
  );


  test.done();
};
