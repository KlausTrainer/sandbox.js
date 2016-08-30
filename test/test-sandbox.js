exports.testRunInSandbox = function (test) {
  var sandbox = require('../sandbox')
  var whitelist = [
    'console',
    './node_modules/http',
    'a',
    'b'
  ]
  var context = {require: require}

  var aBarInASandbox = function () {
    sandbox.runInSandbox(
      function () { require('a').bar() },
      context,
      whitelist
    )
  }

  test.doesNotThrow(function () {
    sandbox.runInSandbox(
      function () { require('console') },
      context,
      whitelist
    )
  })

  test.throws(
    function () {
      sandbox.runInSandbox(
        function () { require('http') },
        context,
        whitelist
      )
    },
    function (err) {
      if (err instanceof Error && err.message === "'http' is not whitelisted") {
        return true
      } else {
        return false
      }
    }
  )

  test.throws(
    function () {
      sandbox.runInSandbox(
        function () { require('http') },
        context,
        []
      )
    },
    function (err) {
      if (err instanceof Error && err.message === "'http' is not whitelisted") {
        return true
      } else {
        return false
      }
    }
  )

  test.equal(
    'function',
    sandbox.runInSandbox(
      function () { return typeof require },
      context
    )
  )

  test.throws(
    function () {
      sandbox.runInSandbox(
        function () { require('http') },
        context
      )
    },
    function (err) {
      if (err instanceof Error && err.message === "'http' is not whitelisted") {
        return true
      } else {
        return false
      }
    }
  )

  test.equal(
    42,
    sandbox.runInSandbox(function () { return 42 })
  )

  test.throws(
    function () {
      sandbox.runInSandbox(function () { return require('http') })
    },
    function (err) {
      if (err.message === 'require is not defined') {
        return true
      } else {
        return false
      }
    }
  )

  test.equal(
    42,
    sandbox.runInSandbox(
      function () { return require('./node_modules/http').getTheAnswer() },
      context,
      whitelist
    )
  )

  test.equal(
    42,
    sandbox.runInSandbox(
      function () { return require('a').foo() },
      context,
      whitelist
    )
  )

  test.throws(
    aBarInASandbox,
    function (err) {
      if (err instanceof Error && err.message === "'c' is not whitelisted") {
        return true
      } else {
        return false
      }
    }
  )

  whitelist.push('c')

  test.throws(
    aBarInASandbox,
    function (err) {
      if (err instanceof Error && err.message === 'boooooyaaaaah!') {
        return true
      } else {
        return false
      }
    }
  )

  whitelist.pop()

  test.throws(
    aBarInASandbox,
    function (err) {
      if (err instanceof Error && err.message === "'c' is not whitelisted") {
        return true
      } else {
        return false
      }
    }
  )

  test.throws(
    function () {
      sandbox.runInSandbox(function () {
        return process.env // could be any of http://nodejs.org/api/globals.html
      })
    },
    function (err) {
      if (err.message === 'process is not defined') {
        return true
      } else {
        return false
      }
    }
  )

  // assert that we are in strict mode
  test.throws(
    function () {
      sandbox.runInSandbox(function () {
        foo = 42 // eslint-disable-line
      })
    },
    function (err) {
      if (err.message === 'foo is not defined') {
        return true
      } else {
        return false
      }
    }
  )

  test.done()
}
