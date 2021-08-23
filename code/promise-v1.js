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
}

// reject函数
function customReject (error) {
  if (this.status === PENDING) {
    this.status = REJECTED
    this.errorVal = error
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
  // 方法的调用
  try {
    fn(customResolve.bind(this), customReject.bind(this))
  } catch (error) {
    // 如果有错误，就直接执行 reject
    customReject.bind(this, error)
  }
}

let promise1 = new CustomPromise(function (resolve, reject) {
  resolve('调用resolve')
  reject('调用reject')
})

console.log(promise1, '查看promise1此时状态')