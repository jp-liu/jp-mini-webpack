const path = require('path')

module.exports = {
  entry: './example/index.js',
  output: {
    fileName: 'bundle.js',
    path: path.resolve(__dirname, './example/dist')
  }
}
