/**
 * @description 初始化插件机制
 * @param { object } context 当前实例上下文
 */
function initPlugins(context) {
  const plugins = context.plugins
  plugins.forEach(plugin => {
    plugin.apply(context)
  })
}

module.exports = initPlugins
