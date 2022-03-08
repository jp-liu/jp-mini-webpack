/**
 * 通过`bundle-1`得知,我们需要通过函数隔绝作用域,
 * 也需要实现`require`作为引入器和启动方法,
 * 所以我们通过`IIFE`自调用函数来传递`map`并启用执行对应内容
 */
;(function (modules) {
  function require(filePath) {
    // 创建模块对象
    const module = { exports: {} }

    // 获取对应方法
    const fn = modules[filePath]

    fn(require, module, module.exports)

    return module.exports
  }

  require('./main.js')
})(
  // 传递映射图
  {
    './main.js': function (require, module, exports) {
      console.log('main')
      const { foo } = require('./foo.js')
      foo()
    },
    './foo.js': function (require, module, exports) {
      console.log('foo')
      function foo() {
        console.log('foo')
      }
      module.exports = {
        foo
      }
    }
  }
)
