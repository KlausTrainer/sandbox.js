exports.runInSandbox = function(src, ctx) {
  var vm = require('vm'),
    sandbox = Object.freeze(vm.createContext(ctx || {})),
    script = vm.createScript('(function() {"use strict"; return ('
                             + src + ')()}())');
  return script.runInContext(sandbox);
};

exports.secureRequire = function(insecureRequire, whiteList) {
  var yCombinator = function(f) {
    return (function (x) {
      return f(function (y) { return (x(x))(y);});
    })(function (x) {
      return f(function (y) { return (x(x))(y);});
    });
  };

  return yCombinator(
    function(secureRequire) {
      return function(moduleName) {
        if (whiteList.indexOf(moduleName) == -1) {
          throw new Error("'" + moduleName + "' is not whitelisted");
        } else {
          var requiredModule = insecureRequire(moduleName);
          requiredModule.require = secureRequire;
          return requiredModule;
        }
      };
    }
  );
};
