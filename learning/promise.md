# Promise

## 定义

简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果的对象。

有以下几个特点：
1. 有三个状态，分别为进行中（pending）已成功 （resolved）已失败（rejected），只有异步操作的结果，决定了当前处于哪一种状态
2. 状态更改只有以下两种状态的变化，一旦状态改变，就不会再发生。即一个promise只能是以上两种状态一种，不可能是同时拥有两种变化。
  * 从pending到resolved--(使用reslove方法，进行状态变更)
  * 从pending到rejected---(使用reject方法，进行状态变更)
```js
Promise {<pending>}
__proto__: Promise
[[PromiseStatus]]: "resolved"
[[PromiseValue]]: undefined
```
3. 一旦创建promise就会立即执行，无法中途取消。

分析一下下面这两个promise
```js
// promise是立即执行的
const p1 = new Promise(function (resolve, reject) {
  // 异步事件，推入事件队列，过3s后，输出
  setTimeout(() => {
    // 第四步执行：p1执行promise
    console.log('p1执行promise')
    reject(new Error('fail'))
  }, 3000)
})

// 第一步输出：Promise {<pending>} "p1此时的状态"
console.log(p1, 'p1此时的状态')

const p2 = new Promise(function (resolve, reject) {
  // 异步事件，推入事件队列，过1s后，输出
  setTimeout(() => {
    // 第三步执行：p2执行promise
    console.log('p2执行promise')
    // 第五步：等p1这个promise状态更改后的状态，传递给p2这个
    // resolve方法
    resolve(p1)
  }, 1000)
})

// 第二步输出：Promise {<pending>} "p2此时的状态"
console.log(p2, 'p2此时的状态')

p2
  .then(result => console.log(result, 'p2的then'))
  // 第六步：接受到p1的promise的rejected,
  .catch(error => console.log(error, 'p2的catch'))
// Error: fail

// 输出的顺序：
// Promise {<pending>} "p1此时的状态"
// Promise {<pending>} "p2此时的状态"
// undefined
// p2执行promise
// p1执行promise
// Uncaught (in promise) Error: fail
//     at <anonymous>:4:12 "p2的catch"
```

## 根据上述定义，自己实现一个promise

```js
// 第一步三种状态
const PENDING = "pending"
const RESOLVED = "resolved"
const REJECTED = "rejected"

// fu--promise的状态变更函数
function customPromise (fn) {
  // PromiseStatus
  this.status = PENDING
  // PromiseValue
  this.value = undefined
}
```


### 参考文档

如果相对Promise更加详情了解，可点击下面这些文档

[Promise 对象](https://es6.ruanyifeng.com/#docs/promise)