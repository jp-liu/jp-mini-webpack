const { resolve } = require('path')
const rootPath = require('process').cwd()
const rootResolve = resolve.bind(null, rootPath)

/**
 * @description 创建打包上下文,存储对应信息
 * @param {} config 提供的配置信息
 * @returns context
 */
function createContext(config) {
  const context = Object.assign({ config }, config)
  return {
    ...context,
    rootPath,
    hooks: null,
    currentEntry: '',
    entryPath: handleEntry(config.entry),
    outputPath: handleOutput(config.output),
    templatePath: resolve(__dirname, '../template/bundle.ejs'),
    handleEntry,
    handleOutput
  }
}

/**
 * @description 获取打包入口信息
 * @param { string | { [key:string]: string } | () => string } entry 打包入口,可能存在多入口
 * @returns { string | string[] }
 */
function handleEntry(entry) {
  let entryInfo
  const type = typeof entry
  switch (type) {
    case 'string':
      entryInfo = rootResolve(entry)
      break
    case 'object':
      entryInfo = Object.keys(entry).map(chunk => rootResolve(entry[chunk]))
      break
    case 'function':
      entryInfo = rootResolve(entry())
      break
    default:
      throw new TypeError('入口仅支持对应字符串对象和函数类型')
  }
  return entryInfo
}

/**
 * @description 处理出口文件
 * @param { { path: string, fileName: string } } output 打包文件出口
 * @returns { string }
 */
function handleOutput(output) {
  // TODO:1 多入口对应多出口

  // TODO:2 处理文件名的形式比如哈希,[chunk]这种形式
  return resolve(output.path, output.fileName)
}

exports.createContext = createContext
exports.handleOutput = handleOutput
