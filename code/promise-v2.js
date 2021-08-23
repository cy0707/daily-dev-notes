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
  fn(customResolve.bind(this), customReject.bind(this))
}

// 此时then方法,需要调整
CustomPromise.prototype.then = function (onFulfilled, onRejected) {
  if (this.status === RESOLVED) {
    onFulfilled(this.value)
  } else if (this.status === REJECTED) {
    onRejected(this.errorVal)
  } else {
    // 在前一个promise处于pending状态的时候, 需要把待执行then的回调方法
    // 放入到onFulfilledList onRejectedList的待执行then方法数组中
    this.onFulfilledCallbackList.push(onFulfilled)
    this.onRejectedCallbackList.push(onRejected)
  }
}

let promise3 = new CustomPromise(function (resolve, reject) {
  setTimeout(()=> {
    resolve('我是setTimeout之后的resolve')
  }, 3000)
})

promise3.then((value) => {
  console.log('then 第一次 resolve', value)
}, (error) => {
    console.log('then 第二次 reject', error)
})

promise3.then((value) => {
  console.log('then 第二次 resolve', value)
}, (error) => {
    console.log('then 第二次 reject', error)
})

