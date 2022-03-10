class BundleName {
  constructor(config) {
    this.config = config
  }

  apply(ctx) {
    ctx.hooks.emit.tap('changeBundleName', () => {
      ctx.output.fileName = this.config.fileName
    })
  }
}

module.exports = BundleName
