module.exports = function jsonLoader(source) {
  const temp = JSON.parse(source)
  temp.height = 1.72

  return JSON.stringify(temp)
}
