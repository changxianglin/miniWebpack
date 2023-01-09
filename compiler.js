const fs = require('fs')
const path = require('path')

class Compiler {
  constructor(options) {
    this.options = options || {}

    this.modules = new Set()
  }

  run(callback) {
    const entryChunk = this.build(path.join(process.cwd(), this.options.entry))
  }

  build(modulePath) {
    let originCode = fs.readFileSync(modulePath)
    originCode = this.dealWithLoader(modulePath, originCode.toString())
    return this.dealDependencies(originCode, modulePath)
  }

  dealWithLoader(modulePath, originCode) {
    [...this.options.modules.rules].reverse().forEach(item => {
      if(item.test(modulePath)) {
        const loaders = [...item.use].reverse()
        loaders.forEach(loader => originCode = loader(originCode))
      }
    })
    return originCode
  }
}

module.exports = Compiler