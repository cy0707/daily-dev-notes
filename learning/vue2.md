# 读《深入浅出 Vue.js》之 Object 的变化侦测笔记（二）

## 重点解释什么是 Watcher

先从 watcher 的使用方式，来初步了解 watcher

```javascript
vm.$watcher("a.b.c", function (newVal, oldVal) {
  // do something
});
```

即当`a.b.c`属性更改的时候，通知这个 watcher 做出相应的更改。
根据前文我们可以了解，只需要把这个 watcher 添加到`a.b.c`的
依赖中，当`a.b.c`属性更改的时候，就会通知这个 watcher，那么
这个 watcher 就负责通知其他需要更改的地方了。

## 那么这个 Watcher 改怎么写呢

1. 首先 Watcher 是一个中介，是一个类
2. 获取对象属性的时候，触发对象属性的 getter, 触发 getter 的同时
   就把这个 wacther 类，加入到依赖中。
3. 对象收集的依赖是 window.tagert 对象，那么 window.target 就等同于当前的 watcher 对象。
4. 设置对象属性，通知 watcher 类，watcher 类通过 callback 回调，通知改修改的地方。

```javascript
class Watcher {
    // vm代表当前vue的实例
    // getSourceDataKeyVal 获取对象属性的时候方法
    // cb监听的源数据更改的回调函数
    constructor (vm, getSourceDataKeyVal, cb) {
        this.vm = vm
        this.cb = cb
        // 获取对象属性的方法
        // 例如监听是vue组件data中 a { b: { c: 1}} -> 对应vue的this.a.b.c
        this.getter = getSourceDataKeyVal
        // watcher传入新老值，给相应cb
        this.val = this.get()
    }

    get () {
        window.tagert = this
        // 更改this对象，同时传递参数this.vm
        let val = this.getter.call(this.vm, this.vm)
        window.tagert = undefined
        return val
    }
    // 当对象发生变化时，在收集依赖的Dep类，会调用依赖的update方法
    update () {
        const oldVal = this.val
        // 这里会出现重复收集的问题
        this.val = this.get()
        this.cb(this.vm, newVal, oldVal)
    }
}

function getSourceDataKeyVal (expression) {
    const reg = /^\w.$/;
    if (!reg.test(expression)) {
        return
    }
    const keyList = expression.split('.')
    return function (obj) {
        for (let index = 0; index < keyList.length; index++) {
            if (!obj) return
            obj = obj[keyList[index]]
        }
        return obj
    }
}
```
