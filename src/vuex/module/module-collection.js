import { forEach } from '../util'
import Module from './module'

export default class ModuleCollection {
  constructor(options) {
    // 注册模块 递归注册 根模块
    this.register([], options)
  }

  // 和ast解析一样
  register(path, rootModule) {
    let newModule = new Module(rootModule)
    rootModule.rawModule = newModule // 在当前要注册的模块上 做了一个映射

    if (0 == path.length) {
      this.root = newModule
    } else {
      let parent = path.slice(0, -1).reduce((memo, current) => {
        return memo.getChild(current)
      }, this.root)

      parent.addChild(path[path.length - 1], newModule)
    }

    if (rootModule.modules) {
      // 有modules说明有子模块
      forEach(rootModule.modules, (module, moduleName) => {
        this.register([...path, moduleName], module)
      })
    }
  }

  getNamespace(path) {
    let root = this.root
    console.log(root)
    return path.reduce((namespace, key) => {
      root = root.getChild(key)
      return `${namespace}${root.namespaced ? (key + '/') : ''}`
    }, '')
  }
}
