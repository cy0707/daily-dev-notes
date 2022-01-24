// 第一步三种状态
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

// resolve函数
function customResolve(value) {
  if (value instanceof CustomPromise) {
    // 此时上一个promise状态还未知, 当上一个状态更改时候iu
    if (value.status === RESOLVED) {
      value.onFulfilledCallbackList.push(customResolve.bind(this));
    } else if (value.status === REJECTED) {
      value.onRejectedCallbackList.push(customReject.bind(this));
    } else {
      value.onFulfilledCallbackList.push(customResolve.bind(this));
      value.onRejectedCallbackList.push(customReject.bind(this));
    }
    return;
  }
  if (this.status === PENDING) {
    this.status = RESOLVED;
    this.value = value;
    if (this.onFulfilledCallbackList.length) {
      this.onFulfilledCallbackList.forEach((item) => {
        item(value)
      });
    }
  }
}

// reject函数
function customReject(error) {
  if (error instanceof CustomPromise) {
    // 此时上一个promise状态还未知, 当上一个状态更改时候iu
    if (error.status === RESOLVED) {
      error.onFulfilledCallbackList.push(customResolve.bind(this));
    } else if (error.status === REJECTED) {
      error.onRejectedCallbackList.push(customReject.bind(this));
    } else {
      error.onFulfilledCallbackList.push(customResolve.bind(this));
      error.onRejectedCallbackList.push(customReject.bind(this));
    }
    return;
  }

  if (this.status === PENDING) {
    this.status = REJECTED;
    this.errorVal = error;
    if (this.onRejectedCallbackList.length) {
      this.onRejectedCallbackList.forEach((item) => {
        item(error)
      });
    }
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
  this.onFulfilledCallbackList = [];
  this.onRejectedCallbackList = [];
  // 方法的调用

  try {
    fn(customResolve.bind(this), customReject.bind(this));
  } catch (error) {
    // 如果有错误，就直接执行 reject
    customReject.bind(this, error);
  }
}

let promise1 = new CustomPromise(function (resolve, reject) {
  console.log("promise1开始");
  setTimeout(() => {
    reject("p1状态变更");
  }, 1000);
});

let promise2 = new CustomPromise(function (resolve, reject) {
  console.log("promise2开始");
  resolve(promise1);
});

setTimeout(() => {
  console.log("============================");
  console.log(promise1, "最后结果p1");
  console.log(promise2, "最后结果p2");
}, 2000);
