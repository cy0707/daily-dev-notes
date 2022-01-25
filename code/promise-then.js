// 第一步三种状态
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";


// resolve函数
function customResolve(value) {
  if (value instanceof CustomPromise) {
    // 此时上一个promise状态还未知, 当上一个状态更改时候
    // 直接影响到下一个promise对象的结果
    // 上一个reject,那么直接reject,即便当前promise我们采用resolve方法。
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

CustomPromise.prototype.then = function (onFulfilled, onRejected) {
  const that = this
  const newCustomPromise = new CustomPromise(function(resolve, reject) {
    // 1. then方法onRejected onRejected执行时间点，是等CustomPromise的状态更改
    // 才会执行，所以把这个回调加入CustomPromise状态更改回调函数中
    // 2. 此时的newCustomPromise状态更改，需要使用resolve,reject更改
    // 3. 而这个resolve, reject需要等onRejected onRejected执行后，
      function handleThenResult (success) {
        try {
          const result = success ? onFulfilled(that.value) :onRejected(that.errorVal)
          if (result === newCustomPromise) throw new Error('自己等自己，等下辈子吧')
          if (result instanceof CustomPromise) {
            result.then(resolve, reject)
            // 返回异步函数
          } else {
            success ? resolve(result) : reject(result)
          }
        } catch (error) {
          reject(error)
        }
      }
      if (that.status === RESOLVED) {
        handleThenResult(true)
    } else if (that.status === REJECTED) {
        handleThenResult(false)
      // 返回一个新的promise的话
      // const errorResult = onRejected(that.errorVal)
      // if (errorResult === newCustomPromise) throw new Error('自己等自己，等下辈子吧')
      // if (errorResult instanceof CustomPromise) {
      //   errorResult.then(resolve, reject)
      // } else {
      //   reject(errorResult)
      // }
    } else {
      that.onFulfilledCallbackList.push(handleThenResult.bind(that, true));
      that.onRejectedCallbackList.push(handleThenResult.bind(that, false));
    }
  })
  return newCustomPromise
}


// const p1 = new CustomPromise(function(resolve, reject) {
//   console.log('初始化promise')
//   setTimeout(() => {
//     resolve('最初的promise')
//   }, 3000)
// })

// p1.then(function(val) {
//   console.log(val, '执行成功')
// }, function (error) {
//   console.log(error, '执行失败')
// })

const p2 = new CustomPromise(function(resolve, reject) {
  console.log('初始化promise')
  setTimeout(() => {
    resolve('最初的promise')
  }, 3000)
})

p2.then(function(val) {
  return new CustomPromise((resolve, reject) => {
    setTimeout(() => {
      console.log('resolve', val)
      resolve('------')
    })
  }, 1000)
}, function() {

}).then((val) => {
  console.log('等待异步的结果', val)
})