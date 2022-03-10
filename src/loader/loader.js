/**
 * @description 加载loader
 * @param { string } filePath 文件路径
 * @param { string } source 文件内容
 */
function loader(context, filePath, source) {
  let content = source
  const rules = context.module.rules
  rules.forEach(rule => {
    const { test, use } = rule
    if (test.test(filePath)) {
      if (Array.isArray(use)) {
        content = use.reduceRight((s, loader) => loader(s), content)
      } else {
        content = use(content)
      }
    }
  })
  return content
}

module.exports = loader
