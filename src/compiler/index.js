const fs = require('fs')
const { resolve, join } = require('path')

const parser = require('@babel/parser')
const { transformFromAst } = require('@babel/core')
const traverse = require('@babel/traverse').default

const ejs = require('ejs')
const loader = require('../loader/loader.js')
const initPlugins = require('../plugins/plugins')
const { SyncHook, AsyncSeriesHook } = require('tapable')

let id = 0
class Compiler {
  constructor(context) {
    this.ctx = context
    this.entry = context.entryPath
    this.output = context.outputPath
    this.hooks = context.hooks = {
      environment: new SyncHook(['context']),
      afterEnvironment: new SyncHook(['context']),
      entryOption: new SyncHook(['context', 'entry']),
      afterPlugins: new SyncHook(['compiler']),
      initialize: new SyncHook(),
      beforeRun: new AsyncSeriesHook(['compiler']),
      run: new AsyncSeriesHook(['compiler']),
      afterRun: new SyncHook(['compiler']),
      emit: new AsyncSeriesHook(['compilation']), // compilation 是编译当前文件相关信息,暂时用 ctx 代替
      afterEmit: new AsyncSeriesHook(['compilation']),
      assetEmitted: new AsyncSeriesHook(['file', 'info'])
    }

    initPlugins(context)

    this.hooks.environment.call(this.ctx)
    this.hooks.afterEnvironment.call(this.ctx)
    // 插件可能会操作入口,或者确定执行哈希,[name],所以操作之后回调一下,然后完成插件设置
    this.hooks.entryOption.call(this.ctx, this.ctx.currentEntry)
    this.hooks.afterPlugins.call(this)
    this.hooks.emit.tapAsync('get output path', () => {
      this.ctx.outputPath = this.ctx.handleOutput(this.ctx.output)
    })
    this.hooks.initialize.call()
  }

  /**
   * @description 开始执行打包
   */
  run() {
    this.hooks.beforeRun.callAsync(this, err => {
      if (err) throw err
    })
    this.hooks.run.callAsync(this, err => {
      if (err) throw err
    })

    if (Array.isArray(this.entry)) {
      // TODO 多入口
    } else {
      this.ctx.currentEntry = this.entry
      // 1.从入口开始创建依赖图谱
      const graph = this.createGraph(this.entry)

      // 2.根据模板打包创建对应代码
      this.build(graph)
    }
    this.hooks.afterRun.call(this)
  }

  /**
   * @description 从入口出发,根据图谱编译对应的文件
   * @param { string } entry 当前模块入口路径
   * @returns 文件解析对应信息组成的数组
   */
  createGraph(entry) {
    // 1.从入口文件处理
    const mainAssets = this.createAssets(entry)

    // 2.根据依赖图谱进行广度优先处理
    const queue = [mainAssets]
    for (const assets of queue) {
      // 2.1 依赖的的路径应该是从当前文件开始,进行相对路径查询
      const assetsPath = assets.filePath
      assets.deps.forEach(relativePath => {
        console.log(join(assetsPath, relativePath))
        const childPath = resolve(this.ctx.rootPath, './example/', relativePath)

        const childAssets = this.createAssets(childPath)
        assets.mapping[relativePath] = childAssets.id
        // 2.2 加入队列,等待下次执行
        queue.push(childAssets)
      })
    }

    return queue
  }

  /**
   * @description 解析指定文件,获取内容和依赖图谱
   * @returns 静态资源信息和图谱
   */
  createAssets(filePath) {
    // 1.处理路径,并读取文件内容
    const entryPath = resolve(this.ctx.rootPath, filePath)
    let source = fs.readFileSync(entryPath, { encoding: 'utf-8' })

    // 1.1 对文件内容进行预处理和提供非`js`文件处理方法
    source = loader(this.ctx, filePath, source)

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
      filePath,
      mapping: {}
    }
  }

  /**
   * @description 根据模板打包成为对应的代码
   * @param { { filePath: any; code: any; deps: any[]; mapping: {} }[] } graph 依赖图谱
   */
  build(graph) {
    // 1.读取模板
    const template = fs.readFileSync(this.ctx.templatePath, {
      encoding: 'utf-8'
    })

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
    this.hooks.emit.callAsync(this.ctx, err => {
      if (err) {
        throw err
      }
    })

    fs.writeFileSync(this.ctx.outputPath, code)

    this.hooks.afterEmit.callAsync(this.ctx, err => {
      if (err) throw err
    })
    this.hooks.assetEmitted.callAsync(
      code,
      {
        content: Buffer.from(code),
        source: code,
        outputPath: this.output
      },
      err => {
        if (err) throw err
      }
    )
  }
}

module.exports = Compiler
