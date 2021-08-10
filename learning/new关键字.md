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
```

大家可以把上述代码，拷贝到控制台，看看输出的是什么呢？为什么`todayInfo1.today`和`todayInfo2.today`不一致呢。
这个就需要了解，使用`new`关键字调用函数，做了什么。

## 使用new关键字调用函数，到底做了什么？

我们看一下MDN的定义

> new 关键字会进行如下的操作：

1. 创建一个空的简单JavaScript对象（即{}）；
2. 为步骤1新创建的对象添加属性__proto__，将该属性链接至构造函数的原型对象；
3. 将步骤1新创建的对象作为this的上下文 ；
4. 如果该函数没有返回对象，则返回this。

根据以上定义，我们来解析上述函数`test1`, `test2`采用`new`关键字调用，返回的值是什么。

```js
// 定义了一个函数名称为Test1的函数
function Test1 () {
  this.today = "Monday"
}
// 采用new调用这个函数，那么这个函数被称为构造函数（构造器）
// 如何理解构造函数，即构造函数调用的结果是构造了一个对象（个人理解）
const todayInfo1 = new Test1();

// 1. new Test1() ---调用的时候，创建了一个空对象
// 2. 将第一步创建对象，作为这个函数Test1所创建作用域，即函数Test1（this）上下文
// 3. Test1函数，没有返回任何值，那么就返回第一步创建的对象，赋值给todayInfo1
// 4. 那么todayInfo1则拥有了today属性

```


## 手动实现一个new 调用函数的功能