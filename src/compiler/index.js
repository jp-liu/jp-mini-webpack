function Compiler(config) {
  this.config = config
}

Compiler.prototype.run = function () {
  console.log('open build')
}

module.exports = Compiler
