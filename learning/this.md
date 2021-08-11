# this关键字

## this定义

我们看一下MDN的定义

1. 函数的 this 关键字，在严格模式和非严格模式之间也会有一些差别。
3. this 不能在执行期间被赋值，并且在每次函数被调用时 this 的值也可能会不同
2. this的绑定跟函数的声明位置没有关系，取决于函数的调用方式（绝大多数情况下）
4. ES6的箭头函数中的this, 并不取决函数的调用方式

## this是如何绑定的

我们从this出现位置，分为以下三部分进行理解

### 在全局执行环境中（在任何函数体外部）

> this 都指向全局对象

```js
// 在浏览器中全局对象window就是this
console.log(this === window)

var a = 11
console.log(window.a) // 11
console.log(this.a) // 11
```
我们可以看出`window`是和`this`相等的, 那就验证了，this指的就是全局对象window,
无论在严格模式还是非严格模式下，都是这样的。

### 函数内部this

由于this的绑定跟函数的声明位置没有关系，取决于函数的调用方式（绝大多数情况下），在函数体内的this指的是什么，
就和函数调用方式存在极大的关系，根据函数的调用方法，我们可以分为以下几种

1. 作为独立函数调用
2. 作为对象方法调用
3. 使用call, apply进行调用
4. 使用bind进行调用


**如何理解，箭头函数中的this**

我们看一下阮一峰老师《ECMAScript 6 入门》中对箭头函数列出的注意点：

* 箭头函数没有自己的this对象，所以当然也就不能用call()、apply()、bind()这些方法去改变this的指向
* 箭头函数内部的this就是定义时上层作用域中的this (上层作用域的this, 这个有时固定，而有时候是不固定)
* 不可以当作构造函数，也就是说，不可以对箭头函数使用new命令，否则会抛出一个错误。
* 不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
* 不可以使用yield命令，因此箭头函数不能用作 Generator 函数。


我们看这样的一个例子，可以清晰的表明，箭头函数和普通函数中this的区别，箭头函数的this是如何固定的

```js
const cat = {
  lives: 9,
  jumps: () => {
    this.lives--;
  },
  add: function () {
    this.lives--
  }
}
cat.jumps();
console.log(cat.lives) // 9
cat.add();
console.log(cat.lives) // 8
```

从这个例子中，我们可以得出以下结论：

定义了一个cat变量，jumps属性，引用一个箭头函数，通过上面，我们值得箭头函数的没有自己的this, 取决于外层作用域。
且this是固定的，这个固定的意思，箭头函数定义的，外层this是那个，那么箭头函数的this就是那个，此时引用的箭头函数，
就等同于在全局作用域window定义的，那箭头函数的this就是window对象而window.lives--不会更改cat的lives属性

add属性引用的普通函数，普通函数this, 跟函数的调用相关，我们采用cat.add()使用，add函数this就绑定到cat上
所以会更改cat.lives的值。


我们可以通过下面这个里面来进一步表明，箭头函数this是取决定义时的外层作用域的this。

```js
// ES6
function foo() {
  setTimeout(() => {
    console.log('id:', this.id);
  }, 100);
}

// ES5
function foo() {
  var _this = this;

  setTimeout(function () {=
    // 访问的是foo函数的this对象，即外层代码块this对象 
    // 而外层的函数foo的this对象，是跟foo函数调用有关
    console.log('id:', _this.id);
  }, 100);
}

foo() // id: undefined

// 如果我们声明一个变量a， id属性值11，并且把foo属性指向foo函数
let a = {id: 11, foo: foo};
// 采用对象方法调用函数，根据上面规律可得，此时foo函数的this执行a对象，那么打印的就是a.id的值即11
// 当然，结果就是跟我们相信的一致，确实输出的是11
a.foo(); // id: 11
```
通过上面的例子，我们可以看出箭头函数this, 确实取决于箭头函数定义的foo函数this, 而我们的foo函数this,
则是不固定的，因为它是一个普通函数，普通函数的this, 取决于它的调用方式。

那么总结来说：箭头函数的this, 在它定义的时候，就确定好了（指向它的外层作用域this）---这个体现它的确定点
但外层this值就可能存在多种情况了

如果想对箭头函数有更详细的了解，请看[阮一峰老师《ECMAScript 6 入门》](https://es6.ruanyifeng.com/#docs/function)

### 在class中this，以及使用new关键字调用函数中this


