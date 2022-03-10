const fs = require('fs')
const path = require('path')
const { cwd } = require('process')
const rootPath = path.join(__dirname, '../../')

const parser = require('@babel/parser')
const { transformFromAst } = require('@babel/core')
const traverse = require('@babel/traverse').default

const ejs = require('ejs')
const loader = require('../loader/loader.js')
const initPlugins = require('../plugins/plugins')
const { SyncHook } = require('tapable')

let id = 0
const hooks = {
  fileName: new SyncHook(['context', 'source', 'target'])
}

function Compiler(config) {
  this.config = config
  this.config.hooks = hooks
  this.entry = config.entry
  this.output = config.output
}

Compiler.prototype.run = function () {
  initPlugins(this.config)
  // 1.从入口开始创建依赖图谱
  const graph = createGraph.call(this, this.entry)

  // 2.根据模板打包创建对应代码
  build.call(this, graph)
}

/**
 * @description 根据模板打包成为对应的代码
 * @param { { filePath: any; code: any; deps: any[]; mapping: {} }[] } graph 依赖图谱
 */
function build(graph) {
  // 1.读取模板
  const template = fs.readFileSync(
    path.resolve(__dirname, '../template/bundle.ejs'),
    {
      encoding: 'utf-8'
    }
  )

  // 2.处理图谱
  const data = graph.map(assets => {
    const { id, code, mapping } = assets
    return {
      id,
      code,
      mapping
    }
  })

  // 3.通过模板生成对应代码
  const code = ejs.render(template, { data })

  // 4.生成代码
  const context = this
  hooks.fileName.call(context)
  const bundlePath = path.resolve(
    cwd(),
    context.output.path,
    context.output.fileName
  )
  fs.writeFileSync(bundlePath, code)
}

/**
 * @description 从入口出发,根据图谱编译对应的文件
 * @param { string } entry 模块入口路径
 * @returns 文件解析对应信息组成的数组
 */
function createGraph(entry) {
  // 1.从入口文件处理
  const mainAssets = createAssets.call(this, entry)

  // 2.根据依赖图谱进行广度优先处理
  const queue = [mainAssets]
  for (const assets of queue) {
    assets.deps.forEach(relativePath => {
      const childPath = path.resolve(rootPath, './example/', relativePath)
      const childAssets = createAssets.call(this, childPath)
      assets.mapping[relativePath] = childAssets.id
      // 2.1 加入队列,等待下次执行
      queue.push(childAssets)
    })
  }

  return queue
}

/**
 * @description 解析指定文件,获取内容和依赖图谱
 * @returns 静态资源信息和图谱
 */
function createAssets(filePath) {
  // 1.处理路径,并读取文件内容
  const entryPath = path.resolve(rootPath, filePath)
  let source = fs.readFileSync(entryPath, { encoding: 'utf-8' })

  // 1.1 对文件内容进行预处理和提供非`js`文件处理方法
  source = loader.call(this, filePath, source)

  // 2.解析代码 parse => ast
  const ast = parser.parse(source, {
    sourceType: 'module'
  })

  const deps = []
  // 2.1 添加语法访问者,针对对应类型进行访问,获取语法具体信息
  traverse(ast, {
    // 2.1.1 访问 import 语法内容,收集依赖
    ImportDeclaration({ node }) {
      deps.push(node.source.value)
    }
  })

  // 3.加工代码,转换 transform => ast
  const { code } = transformFromAst(ast, null, {
    presets: ['env']
  })

  // 4.生成代码,还有依赖图谱
  return {
    id: id++,
    code,
    deps,
    mapping: {}
  }
}

module.exports = Compiler
