// 第一步三种状态
const PENDING = "pending"
const RESOLVED = "resolved"
const REJECTED = "rejected"

// resolve函数
function customResolve(value) {
  if (this.status === PENDING) {
    this.status = RESOLVED
    this.value = value
  }
  // 直接借鉴参考文档方法
  while (this.onFulfilledCallbackList.length) {
    this.onFulfilledCallbackList.shift()(value)
  }
}

// reject函数
function customReject (error) {
  if (this.status === PENDING) {
    this.status = REJECTED
    this.errorVal = error
  }
  // 直接借鉴参考文档方法
  while (this.onFulfilledCallbackList.length) {
    this.onRejectedCallbackList.shift()(error)
  }
}


// ES5的方式
function CustomPromise (fn) {
  // PromiseStatus
  this.status = PENDING
  // PromiseValue
  this.value = undefined
  // promise error
  this.errorVal = undefined
  // 这个来存储then方法执行函数, 等待promise状态变更时候,遍历这里面待执行的函数
  this.onFulfilledCallbackList = []
  this.onRejectedCallbackList = []
  // 方法的调用
  try {
    fn(customResolve.bind(this), customReject.bind(this))
  } catch (error) {
    // 如果有错误，就直接执行 reject
    customReject.bind(this, error)
  }
}

function handleThenResultFun (thenResolveResult, resolve, reject) {
  if (thenResolveResult instanceof CustomPromise) {
    thenResolveResult.then(resolve, reject)
  } else {
    resolve(thenResolveResult)
  }
}


CustomPromise.prototype.then = function (onFulfilled, onRejected) {
  const that = this
  const customPromise2 = new CustomPromise(function (resolve, reject) {
    if (that.status === RESOLVED) {
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

// test
new CustomPromise((resolve) => {
  setTimeout(() => {
    // resolve1
    resolve(1);
  }, 500);
})
  // then1
  .then((res) => {
    console.log(res, "then1");
    return new CustomPromise(function (resolve, reject) {
      setTimeout(() => {
        resolve("then1的promise");
      }, 2000)
    });
  })
  // then2
  .then((res) => {
    console.log(res, "then2");
  });
