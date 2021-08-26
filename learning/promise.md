# Promise

## 定义

简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果的对象。

有以下几个特点：

1. 有三个状态，分别为进行中（pending）已成功 （resolved）已失败（rejected），只有异步操作的结果，决定了当前处于哪一种状态
2. 状态更改只有以下两种状态的变化，一旦状态改变，就不会再发生。即一个 promise 只能是以上两种状态一种，不可能是同时拥有两种变化。

- 从 pending 到 resolved--(使用 reslove 方法，进行状态变更)
- 从 pending 到 rejected---(使用 reject 方法，进行状态变更)

```js
Promise {<pending>}
__proto__: Promise
[[PromiseStatus]]: "resolved"
[[PromiseValue]]: undefined
```

3. 一旦创建 promise 就会立即执行，无法中途取消。

分析一下下面这两个 promise

```js
// promise是立即执行的
const p1 = new Promise(function (resolve, reject) {
  // 异步事件，推入事件队列，过3s后，输出
  setTimeout(() => {
    // 第四步执行：p1执行promise
    console.log("p1执行promise");
    reject(new Error("fail"));
  }, 3000);
});

// 第一步输出：Promise {<pending>} "p1此时的状态"
console.log(p1, "p1此时的状态");

const p2 = new Promise(function (resolve, reject) {
  // 异步事件，推入事件队列，过1s后，输出
  setTimeout(() => {
    // 第三步执行：p2执行promise
    console.log("p2执行promise");
    // 第五步：等p1这个promise状态更改后的状态，传递给p2这个
    // resolve方法
    resolve(p1);
  }, 1000);
});

// 第二步输出：Promise {<pending>} "p2此时的状态"
console.log(p2, "p2此时的状态");

p2.then((result) => console.log(result, "p2的then"))
  // 第六步：接受到p1的promise的rejected,
  .catch((error) => console.log(error, "p2的catch"));
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

> 根据上述定义，自己实现一个带 resolve，reject 方法最基础的 promise

```js
// 第一步三种状态
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

// resolve函数
function customResolve(value) {
  if (this.status === PENDING) {
    this.status = RESOLVED;
    this.value = value;
  }
}

// reject函数
function customReject(error) {
  if (this.status === PENDING) {
    this.status = REJECTED;
    this.errorVal = error;
  }
}

// ES5的方式
function CustomPromise(fn) {
  // PromiseStatus
  this.status = PENDING;
  // PromiseValue
  this.value = undefined;
  // promise error
  this.errorVal = undefined;
  // 方法的调用
  try {
    fn(customResolve.bind(this), customReject.bind(this));
  } catch (error) {
    // 如果有错误，就直接执行 reject
    customReject.bind(this, error);
  }
}

let promise1 = new CustomPromise(function (resolve, reject) {
  resolve("调用resolve");
  reject("调用reject");
});

console.log(promise1, "查看promise1此时状态");
// CustomPromise {status: "resolved",
// value: "调用resolve", errorVal: undefined} "查看promise1此时状态"
```

[完整代码详见 V1](./code/promise-v1.js)

## Promise 的 then 方法

- then 方法是定义在原型对象 Promise.prototype 上
- then 方法的第一个参数是 resolved 状态的回调函数，第二个参数是 rejected 状态的回调函数，它们都是可选的
- then 方法返回的是一个新的 Promise 实例（注意，不是原来那个 Promise 实例）
- then 方法，采用链式写法

> 完善上面的 promise，增加 then 方法

```js
CustomPromise.prototype.then = function (onFulfilled, onRejected) {
  if (this.status === RESOLVED) {
    onFulfilled(this.value);
  } else if (this.status === REJECTED) {
    onRejected(this.errorVal);
  } else {
    console.log("此时前一个promise状态还是pending状态,按道理不会执行这里");
    // 此时前一个promise处于pending状态，而我们的then方法是等
    // 前一个promise的状态更改才执行resolved, rejected方法
    // 那么前一个promise状态为pending的时候, 此时then方法该做如何处理呢?
    // 或者什么情况下,前一个promise处于pending状态,就执行then方法呢?
  }
};

// 例如下面这种情况
let promise2 = new CustomPromise(function (resolve, reject) {
  setTimeout(() => {
    resolve(`
      promise处于pending状态,过3秒之后,才进行状态改变,
      如果此时掉用then方法的话(按照现在的写法), 因为setTimeout是一个异步,
      那么then方法就没法等待前一个promise的状态更改后,再执行
    `);
  }, 3000);
});

promise2.then(
  (value) => {
    console.log("promise状态更改了RESOLVED", value);
  },
  (error) => {
    console.log("promise状态更改了REJECTED", error);
  }
);
// 我们看见此时控制台输出的内容:
// 此时前一个promise状态还是pending状态,按道理不会执行这里
```

那么此时应该如何处理呢, 我们能确定的一点的是,then 里面的方法需要等待
前一个 promise 的状态变更才能执行, 就需要执行 then 的方法存储到一个待执行 then 方法数组中(自己取的名字,好理解),
等前一个 promise 状态变更, 再执行待执行 then 方法数组方法, 这个就是发布订阅模式吧

```js
// 改造Promise构造函数,增加onFulfilledCallbackList onRejectedCallbackList
function CustomPromise(fn) {
  //...
  // 这个来存储then方法执行函数, 等待promise状态变更时候,遍历这里面待执行的函数
  this.onFulfilledCallbackList = [];
  this.onRejectedCallbackList = [];
  // ...
}

// 此时then方法,需要调整
CustomPromise.prototype.then = function (onFulfilled, onRejected) {
  if (this.status === RESOLVED) {
    onFulfilled(this.value);
  } else if (this.status === REJECTED) {
    onRejected(this.errorVal);
  } else {
    // 在前一个promise处于pending状态的时候, 需要把待执行then的回调方法
    // 放入到onFulfilledList onRejectedList的待执行then方法数组中
    this.onFulfilledCallbackList.push(onFulfilled);
    this.onRejectedCallbackList.push(onRejected);
  }
};

// 同时改造resolve函数
function customResolve(value) {
  if (this.status === PENDING) {
    this.status = RESOLVED;
    this.value = value;
  }
  // 直接借鉴参考文档方法
  while (this.onFulfilledCallbackList.length) {
    this.onFulfilledCallbackList.shift()(value);
  }
}

// 同时改造reject函数
function customReject(error) {
  if (this.status === PENDING) {
    this.status = REJECTED;
    this.errorVal = error;
  }
  // 直接借鉴参考文档方法
  while (this.onFulfilledCallbackList.length) {
    this.onRejectedCallbackList.shift()(error);
  }
}

// 此时我们采用改造后Promise, 在第一个promise加入异步
// 然后多次调用then方法
let promise3 = new CustomPromise(function (resolve, reject) {
  setTimeout(() => {
    resolve("我是setTimeout之后的resolve");
  }, 3000);
});

promise3.then(
  (value) => {
    console.log("then 第一次 resolve", value);
  },
  (error) => {
    console.log("then 第二次 reject", error);
  }
);

promise3.then(
  (value) => {
    console.log("then 第二次 resolve", value);
  },
  (error) => {
    console.log("then 第二次 reject", error);
  }
);

// 按照我们的预期,等第一个promise状态更改之后,才执行then方法
// then 第一次 resolve 我是setTimeout之后的resolve
// then 第二次 resolve 我是setTimeout之后的resolve
```

[完整代码详见 v2](./code/promise-v2.js)

> 我们得继续完善 then 方法, 此时 then 方法还没有满足链式调用以及返回新的 promise

看下面这个例子，看看我们 then 如何链式调用实现

```js
new Promise((resolve) => {
  setTimeout(() => {
    // resolve1
    resolve(1);
  }, 500);
})
  // then1
  .then((res) => {
    console.log(res, "then1");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("then1的promise");
      }, 2000)
    });
  })
  // then2
  .then((res) => {
    console.log(res, "then2");
  });

// 依次输出的
// Promise {<pending>}
// VM133:9 1 "then1"
// VM133:16 then1的promise then2
```

```js
function handleThenResultFun (thenResolveResult, resolve, reject) {
  // 返回一个新的promise状态更改后，才会执行
  if (thenResolveResult instanceof CustomPromise) {
    // thenResolveResult状态更改后，才能改变then方法返回的Promise状态
    // 即then的Promise的结果===>依赖then里面方法体的promise状态,
    // 就直接采用采用方法体里面promise的then方法，方法体里面promise状态更改之后
    // 才变更then方法返回的promise状态，即参数为promise的resolve,reject的状态变更
    thenResolveResult.then(resolve, reject)
  // then reslove一个普通值, 那么直接执行promise2的resolve,更改promise的状态
  } else {
    resolve(thenResolveResult)
  }
}

// 此时then方法,需要调整
CustomPromise.prototype.then = function (onFulfilled, onRejected) {
  const that = this
  // 1. 返回一个新的promise
  const customPromise2 = new CustomPromise(function (resolve, reject) {
    // 这里判断是上一个promise1的状态，那么需要注意this的指代
    if (that.status === RESOLVED) {
      //前一个promise的更改为reslove状态，执行then回调方法
      // 这里返回可以是一个普通值，或者一个另一个promise
      const thenResolveResult = onFulfilled(that.value);
      handleThenResultFun(thenResolveResult, resolve, reject)
    } else if (that.status === REJECTED) {
      const thenResolveResult = onRejected(that.errorVal);
      handleThenResultFun(thenResolveResult, resolve, reject)
    } else {
      that.onFulfilledCallbackList.push(function () {
        const thenResolveResult = onFulfilled(that.value);
        handleThenResultFun(thenResolveResult, resolve, reject)
      })
      that.onRejectedCallbackList.push(function () {
        const thenResolveResult = onRejected(that.errorVal);
        handleThenResultFun(thenResolveResult, resolve, reject)
      })
    }
  });

  return customPromise2;
};
```

[完整代码详见 v3](./code/promise-v2.js)

### 参考文档

[Promise 对象](https://es6.ruanyifeng.com/#docs/promise)
[从一道让我失眠的 Promise 面试题开始，深入分析 Promise 实现细节](https://juejin.cn/post/6945319439772434469)
[剖析 Promise 内部结构，一步一步实现一个完整的、能通过所有 Test case 的 Promise 类](https://github.com/xieranmaya/blog/issues/3)
