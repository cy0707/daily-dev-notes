# 读《深入浅出 Vue.js》之 Object 的变化侦测笔记（一）

作者通过了以下几个步骤进行阐述：

1. **如果监听一个对象 Object 的变化？**

- Object.defineProperty
- ES6 的 proxy

2. **vue2 采用 Object.defineProperty 来监听对象的变化。**

3. **通过例子，简单的演示了 Object.defineProperty 是如何监听对象的变化。**（[可看 MDN 文档对 Object.defineProperty 详细解释](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)）

```javascript
function defineReactive(data, key, val) {
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
        console.log(`得到key为${key}的值为${val}`)
        return val
    },
    set: function (newVal) {
        if (val === newVal) return
        console.log(`设置key为${key}，的新值为${newVal}`)
        val = newVal
    }
  });
}
let a = {}
defineReactive(a, 'key1', 1);
console.log(a.key1) // 在获取key1的时候，触发getter函数
a.key1 = 2 // 设置key1的时候，触发setter函数
// 这样的话，key1属性的变化，都在我们的监控范围之内。
```
4. **如何收集依赖？**

    * 何为依赖？：还是上述例子，例如【某个功能】，需要随着a对象的key1改变而改变，那么【某个功能】就是依赖于【a对象key1属性】。那么所有依赖对象a变化而变化的事务，都被称之为a的【依赖者】
    * vue中的依赖者具体是什么？：一般是模板中使用`{{a.key1}}`或者组件中使用a.key1的地方。
    * 在那个时候收集合适呢？看上述例子，我肯可以得出，在获取key1的时候，触发的getter函数，适合收集依赖，而在更改key1值，触发的setter函数，适合通知这些依赖者，我发生了改变，你们赶紧调整哈。
    * 总的来说：就是在getter中收集依赖，在setter中通知依赖，触发相应的更新

5. **收集的依赖放在哪里？**

    * 依赖者不止一个，一个对象的key值，可能有多个依赖，那么依赖者，应该是一个数组
    * 假设依赖者是一个函数，保存在window.target上（暂时假设，后面详述，先跟着作者思路来）
    * 此时，我们改造以下defineReactive方式（[具体代码详情见V1](../code/vue1.js))

6. **window.target这个依赖具体指的是什么？**

    就是说当对象a的key1变化，到底要通知谁，其实上面也有简单的概述，在这里我们深入探讨一下。
    我们换个方向来思考问题，我们在vue中，会在那些地方使用到对象a的属性key1。
    * 模板
    * 用户写的watch/computed/methods等等
    * vuex

    由于用的地方很多（即依赖者），方式也是各种各样，这个时候就需要抽象一个类，来处理这些情况，
    这个类就是Vue中的watcher。getter收集的是watcher, 然后在setter中通知的也是watcher。
    然后由watcher来通知其他地方。此时watcher就类似一个中介的角色。
