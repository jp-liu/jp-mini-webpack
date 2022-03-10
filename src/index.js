const Compiler = require('./compiler/index.js')
const { createContext } = require('./context/context.js')

/**
 * @description 打包启动器
 * @param config 打包配置信息
 * @returns { Compiler } 编译者
 */
function jpMiniWebpack(config) {
  const context = createContext(config)
  return new Compiler(context)
}

module.exports = jpMiniWebpack
