exports.runInSandbox = function(src, ctx) {
  var vm = require('vm'),
    sandbox = Object.freeze(vm.createContext(ctx || {})),
    script = vm.createScript('(function() {"use strict"; return ('
                             + src + ')()}())');
  return script.runInContext(sandbox);
};

exports.secureRequire = function(insecureRequire, whitelist) {
  var yCombinator = function(f) {
    return (function(x) {
      return f(function(y) { return (x(x))(y);});
    })(function(x) {
      return f(function(y) { return (x(x))(y);});
    });
  };

  return yCombinator(
    function(secureRequire) {
      var module = insecureRequire("module");
      module.prototype = {
        require: secureRequire,
        load: module.prototype.load,
        _compile: module.prototype._compile
      };

      return function(moduleName) {
        if (whitelist.indexOf(moduleName) == -1) {
          throw new Error("'" + moduleName + "' is not whitelisted");
        } else {
          return insecureRequire(moduleName);
        }
      };
    }
  );
};
