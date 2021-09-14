# 几个核心概念
  * Schema
  * Type
  * Query
  * Mutation
  * Subscribe
  * Resolver

## Schema（模式）

就如我们上文所讲，Schema就是GraphQL的骨架，它定义了服务器的 API，让客户端知道服务器可以执行哪些操作。
那么我么上文的TODO应用的schem是如何定义呢：

```js

//一个graphql服务，可以没有mutation subscription 但是必须有query

// 骨架， graphql服务的入口
schema {
  query: Query
  // 可以没有mutation subscription
  mutation: Mutation
  subscription: Subscription
}

type Query {
  ListById(id: ID!): List
  UserById(id: ID!): User
}

type List {
  id: ID!
  name: String!
  todos: [TODO]
  owner: User!
}

type User {
  id: ID!
  name: String!
  lists: [List]
}

type TODO {
  id: ID!
  text: String!
  list: [List]
}

```

## Type

结合图表，以及上面的定义，我们不难发现，GraphQL就是一个类型语言。Type在GraphQL占有非常高的位置，GraphQL schema 中的最基本的组件是对象类型，而对象类型又是由其他类型组成。

**类型的分类**

1. Scalars(标量)--等同js中的简单类型
2. Objects(对象)--等同js中的对象
3. Interfaces(接口)--ts,java中接口
4. Unions(联合)--ts的unions类型
5. Enums(枚举型)--js的枚举
6. Input Objects(输入对象)--js对象
7. Lists(列表型)--数组
8. Non-Null(非空型)--ts的非空验证数据

下面是GraphQL内置Scalars(标量)的5种

* Int：有符号 32 位整数。
* Float：有符号双精度浮点值。
* String：UTF‐8 字符序列。
* Boolean：true 或者 false。
* ID：ID 标量类型表示一个唯一标识符，通常用以重新获取对象或者作为缓存中的键。ID 类型使用和 String 一样的方式序列化；然而将其定义为 ID 意味着并不需要人类可读型。

```js
// 1. 定义了一个类型，这个类型是一个对象类型
type Character {
  // 2. 类型名称为Character
  // 3. Character类型包含两个字段name和appearsIn
  // 4. 操作Character类型的话，只能查询或者修改name和appearsIn这两个字段
  name: String! // 5. String 内置的标量String类型
  appearsIn: [Episode!]! // 6. appearsIn字段值，是一个包含另一个名为Episode对象类型数组
}

type Starship {
  id: ID!
  name: String!
  // 1. 参数必须是具名参数，不能匿名
  // 2. 参数名为unit
  // 3.如果不传递的话，默认为METER
  length(unit: LengthUnit = METER): Float
  user(id: ID!): User!
}
```

如果想对这些字段有更详细的了解，戳下面官网文档链接


## 参考文档

[Schema和类型](https://graphql.cn/learn/schema/#type-system)
[GraphQL学习指南](https://www.jd.com/hhyx/784c2ce68cb39ef7.html)