const Compiler = require('./compiler/index.js')

function jpMiniWebpack(config) {
  return new Compiler(config)
}

module.exports = jpMiniWebpack
