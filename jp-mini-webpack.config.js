const path = require('path')

const jsonLoader = require('./loader/json-loader.js')
const chainJsonLoader = require('./loader/chain-json-loader.js')

const BundleNamePlugin = require('./plugins/bundle-name-plugin.js')

module.exports = {
  entry: './example/index.js',
  output: {
    fileName: 'bundle.js',
    path: path.resolve(__dirname, './example/dist')
  },
  module: {
    rules: [{ test: /\.json$/, use: [jsonLoader, chainJsonLoader] }]
  },
  plugins: [
    new BundleNamePlugin({
      fileName: 'jpliu6.js'
    })
  ]
}
