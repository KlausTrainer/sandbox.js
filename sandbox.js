'use strict'

exports.runInSandbox = function (src, ctx, whitelist) {
  const vm = require('vm')
  const script = new vm.Script(
    '(function() {"use strict"; return (' + src + ')()}())')

  if (ctx && ctx.require) {
    const insecureRequire = ctx.require
    const module = require('module')
    const oldModulePrototype = module.prototype

    const secureRequire = function (moduleName) {
      if ((whitelist || []).indexOf(moduleName) === -1) {
        module.prototype = oldModulePrototype
        throw new Error("'" + moduleName + "' is not whitelisted")
      } else {
        const requiredModule = insecureRequire(moduleName)
        module.prototype = oldModulePrototype
        return requiredModule
      }
    }

    const newCtx = Object.freeze(
      Object.assign({}, ctx, {require: secureRequire}))

    module.prototype = {
      require: secureRequire,
      load: module.prototype.load,
      _compile: module.prototype._compile
    }

    module._cache = {}

    return script.runInContext(vm.createContext(newCtx))
  }

  return script.runInContext(vm.createContext(Object.freeze(ctx || {})))
}
