# new关键字理解

## 看一个例子

```js
function Test1 () {
  this.today = "Monday"
}

const todayInfo1 = new Test1();
// 这个输出多少？
console.log(todayInfo1.today);

function Test2 () {
  this.today = "Monday"
  return {}
}

const todayInfo2 = new Test2();
// 这个输出多少？
console.log(todayInfo2.today);

function Test3 () {
  this.today = "Monday"
  return 'hello'
}
const todayInfo3 = new Test3();
// 这个输出多少？
console.log(todayInfo3.today);
```

大家可以把上述代码，拷贝到控制台，看看输出的是什么呢？为什么`todayInfo1.today`，`todayInfo2.today`，`todayInfo3.today`不一致呢。
这个就需要了解，使用`new`关键字调用函数，做了什么。

## 使用new关键字调用函数，到底做了什么？

我们看一下MDN的定义

> new 关键字会进行如下的操作：

1. 创建一个空的简单JavaScript对象（即{}）；
2. 为步骤1新创建的对象添加属性__proto__，将该属性链接至构造函数的原型对象
3. 将步骤1新创建的对象作为this的上下文 ；
4. 如果该函数没有返回对象，则返回this。

根据以上定义，我们在函数`test1`, `test2`, `test2`采用`new`关键字调用时，有以下几个疑问

* `context`即上下文指的是什么？
* `this`又是什么？
* 函数调用之后，返回值是什么？

在函数调用的时候，`context`和`this`指的什么，[点击context和this的关系](./context.md)
[this指的是什么呢？](./this.md)


```js
// 定义了一个函数名称为Test1的函数
function Test1 () {
  this.today = "Monday"
}
// 采用new调用这个函数，那么这个函数被称为构造函数（构造器）
// 如何理解构造函数---会构造当前函数的this对象
const todayInfo1 = new Test1();
```

当我们采用new关键字调用一个函数，我们首先需要拆分`new`和函数拆分来看

1. 当我们`new Test1()`调用函数的时候，new关键字会创建一个空对象，例如这样： `let emptyObj = {}`
2. 然后将空对象的原型连接到Test函数的原型`emptyObj.prototype = Test.prototype`
3. `Test1`函数调用的时候，会生成的一个执行环境即执行上下文（context），
执行环境变量对象会关联到执行上下文，我们把这个变量简单称为`contextObj`，这个`contextObj`变量
暂时还未绑定。
4. 然后把`contextObj`的`this`对象绑定到new关键字声明空对象`emptyObj`。那么函数`Test1`函数的`this`
指向的就是`emptyObj`对象
5. 然后`this.today = "Monday"` 赋值语句就等同于`emptyObj.today = "Monday"`
6. Test1函数的没有返回值，那么就返回emptyObj这个对象，Test2函数返回是一个空对象
所以会直接返回那个空对象，emptyObj这个对象就不会被返回，所以todayInfo2.today输出undefined
Test3函数返回是一个字符串，根据定义，只要函数返回不是对象，那么就返回emptyObj即函数的this对象，

### 在class中this

1. 我们知道使用class关键字定义一个类的时候，会有一个constructor的默认方法
2. 采用new命令生成对象实例的时候，会自动调用constructor方法
3. constructor即等同于ES5的构造函数，即new关键字后面的那个函数。
4. constructor()方法默认返回实例对象（即this）, 但是也可以返回别的对象（情况等同上面）
5. ES6的class的只是ES5创建`类`的语法糖

```js
class Test {
  constructor () {
    this.a = 'hello'
    return {}
  }
}

class Test1 {
  constructor () {
    this.a = 'hello'
    return '11'
  }
}

const test1 = new Test()
console.log(test1.a) // undefined
const test2 = new Test1()
console.log(test2.a) // hello
```

## 手动实现一个new 调用函数的功能

```js
function newFun (fun) {
  const emptyObj = {}
  emptyObj.prototype = fun.prototype
  const res = fun.call(emptyObj)
  return typeof res === 'object' ? res : emptyObj
}
```

> 最后，以上是本人从书中，教程，以及各位大佬分享的博文中，学习感悟总结得出，如果错误，还请各位小伙伴指正！