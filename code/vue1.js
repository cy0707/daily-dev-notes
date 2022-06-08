// v1版本
function defineReactive(data, key, val) {
  const dep = []; // 依赖者列表
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
        console.log(`得到key为${key}的值为${val}`)
        // 收集依赖
        dep.push(window.target)
        return val
    },
    set: function (newVal) {
        if (val === newVal) return
        console.log(`设置key为${key}，的新值为${newVal}`)
        // 通知依赖
        for (let index = 0; index < dep.length; index++) {
            const curDep = dep[i]
            curDep(newVal, val)
        }
        val = newVal
    }
  });
}


// dep类
class Dep {
  constructor () {
    this.subs = []
  }
  addSub (sub) {
    this.subs.push(sub)
  }
  removeSub (sub) {
    const index = this.subs.indexOf(sub)
    if (index === -1) return
    return this.subs.splice(index, 1)
  }
  append () {
    if (window.target) {
      this.subs.push(window.target)
    }
  }
  notify () {
    const subs = this.subs.slice()
    for (let index = 0; index < subs.length; index++) {
      // 假设每一个依赖都有一个update方法
      subs[index].update()
    }
  }
}

// v2
function defineReactive(data, key, val) {
  const dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
        console.log(`得到key为${key}的值为${val}`)
        // 收集依赖
        dep.append()
        return val
    },
    set: function (newVal) {
        if (val === newVal) return
        console.log(`设置key为${key}，的新值为${newVal}`)
        // 通知依赖
        dep.notify()
        val = newVal
    }
  });
}