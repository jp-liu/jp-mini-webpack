module.exports = function jsonLoader(source) {
  console.log(source)

  return `export default ${source}`
}
