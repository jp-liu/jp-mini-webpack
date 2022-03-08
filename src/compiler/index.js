const fs = require('fs')
const path = require('path')
const rootPath = path.join(__dirname, '../../')

const parser = require('@babel/parser')
// const { transformFromAst } = require('@babel/core')
const traverse = require('@babel/traverse').default

function Compiler(config) {
  this.config = config
  this.entry = config.entry
  this.output = config.output
}

Compiler.prototype.run = function () {
  // 1.从入口文件处理
  const mainAssets = createAssets(this.entry)

  // 2.根据依赖图谱进行广度优先处理
  const queue = [mainAssets]
  for (const assets of queue) {
    assets.deps.forEach(relativePath => {
      const childPath = path.resolve(rootPath, './example/', relativePath)
      const childAssets = createAssets(childPath)
      // 2.1 加入队列,等待下次执行
      queue.push(childAssets)
    })
  }

  console.log(queue)
  return queue
}

/**
 * @description 解析指定文件,获取内容和依赖图谱
 * @returns 静态资源信息和图谱
 */
function createAssets(filePath) {
  const entryPath = path.resolve(filePath)
  const source = fs.readFileSync(entryPath, { encoding: 'utf-8' })

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
  console.log(deps, '---------------------')

  // 3.加工代码,转换 transform => ast
  // 4.生成代码,还有依赖图谱
  return {
    source,
    deps
  }
}

module.exports = Compiler
