#!/usr/bin/env node

// 1.引入`mini-webpack`函数
const miniWebpack = require('../src/index.js')

// 2.引入配置文件
const config = require('../jp-mini-webpack.config.js')

// 3.获取解析器
const compilier = miniWebpack(config)

// 4.开始打包
compilier.run()
