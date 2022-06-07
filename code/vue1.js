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