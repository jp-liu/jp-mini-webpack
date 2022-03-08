// 1.打包出来的代码
// 1.1 需要隔绝作用域,避免污染,创建函数作用域
function mainAssets(require, module, exports) {
  console.log('main')
  const { foo } = require('./foo.js')
  foo()
}

function fooAssets(require, module, exports) {
  console.log('foo')
  function foo() {
    console.log('foo')
  }

  module.exports = {
    foo
  }
}

// 2.隔绝作用域,如何引入模块呢?
// 2.1 创建映射,拿到对应的函数,执行得到导出结果
// 2.2 通过实现 `require` 方法,引入
// 2.3 和 `node` 一样,通过将 `js` 文件包装一层,作为一个函数
function require(filePath) {
  // 创建模块对象
  const module = { exports: {} }

  const map = {
    './main.js': mainAssets,
    './foo.js': fooAssets
  }

  // 获取对应方法
  const fn = map[filePath]

  fn(require, module, module.exports)

  return module.exports
}

require('./main.js')
