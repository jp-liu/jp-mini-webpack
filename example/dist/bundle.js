;(function (modules) {
  function require(id) {
    // 创建模块对象
    const module = { exports: {} }

    const [fn, mapping] = modules[id]

    // 创建内层函数调用方法
    function localRequire(filePath) {
      const id = mapping[filePath]
      return require(id)
    }

    // 执行内层函数
    fn(localRequire, module, module.exports)

    return module.exports
  }

  require('0')
})({
  0: [
    function (require, module, exports) {
      'use strict'

      var _foo = require('./foo.js')

      var _foo2 = _interopRequireDefault(_foo)

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj }
      }

      ;(0, _foo2.default)()
    },
    { './foo.js': 1 }
  ],

  1: [
    function (require, module, exports) {
      'use strict'

      Object.defineProperty(exports, '__esModule', {
        value: true
      })

      exports.default = function () {
        console.log(123)
      }

      var _bar = require('./bar.js')

      var _bar2 = _interopRequireDefault(_bar)

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj }
      }

      ;(0, _bar2.default)()
    },
    { './bar.js': 2 }
  ],

  2: [
    function (require, module, exports) {
      'use strict'

      Object.defineProperty(exports, '__esModule', {
        value: true
      })

      exports.default = function () {
        console.log(456)
      }
    },
    {}
  ]
})
