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

  require(0)
})({
  0: [
    function (require, module, exports) {
      'use strict'

      var _foo = require('./foo.js')

      var _foo2 = _interopRequireDefault(_foo)

      var _user = require('./user.json')

      var _user2 = _interopRequireDefault(_user)

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj }
      }

      console.log(_user2.default)
      ;(0, _foo2.default)()
    },
    { './foo.js': 1, './user.json': 2 }
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
    { './bar.js': 3 }
  ],

  2: [
    function (require, module, exports) {
      'use strict'

      Object.defineProperty(exports, '__esModule', {
        value: true
      })
      exports.default = {
        name: 'jpliu6',
        age: 15,
        job: 'xdm',
        height: 1.72
      }
    },
    {}
  ],

  3: [
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
