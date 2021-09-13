# 几个核心概念
  * Schema
  * Type
  * Query
  * Mutation
  * Subscribe
  * Resolver

### schema（模式）

它定义了服务器的 API，让客户端知道服务器可以执行哪些操作。是graphql服务的入口和骨架。
可以说没有schema，那么就没法创建一个graphql服务。必须有了schema才能执行下一步。
例如上图那个TODO应用的例子，schema就代表整个图表（或者树），所有里面的节点，枝叶都是
包含在其中的。

那么TODO应用的schem是如何定义呢：

```graphql

# 一个graphql服务，可以没有mutation subscription 但是必须有query

schema {
  query: Query
  # mutation: Mutation
  # subscription: Subscription
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

### Type

1. Scalars/标量 （等同js中的简单类型）
2. Objects/对象 （等同js中的对象）
3. Interfaces/接口 （ts,java中接口）
4. Unions/联合 （ts的unions类型）
5. Enums/枚举型 （js的枚举）
6. Input Objects/输入对象 （js对象）
7. Lists/列表型 （数组）
8. Non-Null/非空型 （ts的非空验证数据）

下面是graphql内置的5种标量

* Int：有符号 32 位整数。
* Float：有符号双精度浮点值。
* String：UTF‐8 字符序列。
* Boolean：true 或者 false。
*  ID：ID 标量类型表示一个唯一标识符，通常用以重新获取对象或者作为缓存中的键。
ID 类型使用和 String 一样的方式序列化；然而将其定义为 ID 意味着并不需要人类可读型。

graphql中的每个字段，都有所属的类型。这里也能表面graphql是一个类型语言

## 看一个例子

## 如何在项目中运用

## 优点缺点以及优化的api的使用不做介绍

## 参考文档

[运行一个 Express GraphQL 服务器](https://graphql.cn/graphql-js/running-an-express-graphql-server/)
[GraphQL 客户端](https://graphql.cn/graphql-js/graphql-clients/)