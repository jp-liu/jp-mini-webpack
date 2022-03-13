#!/usr/bin/env node

// 1.引入`mini-webpack`函数
const miniWebpack = require('../src/index.js')

// 2.引入配置文件,判断用户是否传递
const rootPath = process.cwd()
const defaultConfig = require('../jp-mini-webpack.config.js')
const customConfig = require(`${rootPath}/jp-mini-webpack.config.js`)
const config = customConfig || defaultConfig

// 3.获取解析器
const compiler = miniWebpack(config)

// 4.开始打包
compiler.run()
