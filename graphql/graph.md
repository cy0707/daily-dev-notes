## 定义

<!-- https://github.com/GraphQLCollege/fullstack-graphql/blob/master/manuscript/chapter-0.md -->


GraphQL 是一种用于设计和查询数据的领域特定类型语言（Domain Specific Language即DSL）--即一种用于 API 的查询语言

定义太笼统，拆分一下其定义：

1.  是一个语言（即一种规范）
即只定义了这种查询语言语法如何、具体的语句如何执行等，允许任何人用任何编程语言实现 GraphQL。
JavaScript 中有一个官方实现叫做 graphql-js的包，GraphQL和的graphql-js关系, 就像 EcmaScript 与 JavaScript 的关系。
2. 类型类似于ts, 每一个字段，都要其特定的类型，它还使用类型来静态检查错误。
3. 领域特定--> 特定领域是数据。
领域特定语言 （html, css这些只能单一作用浏览器）
通用语言（js 即可以开发前端，又可以用于服务端）
4. 可以设计数据（？），同时也可以查询数据，例如：在server对数据建模，客户端用graphql编写查询来获取特定的数据。





## 和http的关系

通常，graphql的服务是通过http协议层进行对外公开的，但是并不表示graphlql只能通过http才能对外公开其服务，其他协议也是可以的。
看一个例子：

![通过http发送graphql查询语句](./http.png)


## graphql中graph代表什么

graph + query + language => 图表查询语言

<!-- https://www.apollographql.com/blog/backend/auth/access-control-in-graphql/?_ga=2.38655781.781049328.1624427882-594116982.1624427882 -->

![graph](./graph.png)

上图是一个简单的todo应用的grahql的schema

从图形的角度考虑架构, 类型是图形的节点(list todo)，字段是边(例如：id name text)，标量类型没有字段(ID Sting等等)，因此它们构成了图形的叶节点。
GraphQL 查询只是以特定方式遍历图的指令，从而生成一棵树。遍历树时，您将从根开始，但是图没有根，因此没有逻辑起点！
这就是为什么每个 GraphQL 模式都需要有一个根查询类型：它是图的入口点。根查询类型的字段是指向 GraphQL 服务器支持的实际查询的链接。

GraphQL 查询只是关于如何遍历图的一组指令。即
1. 用户可以遍历哪些边（即从一个字段查询其关联下一个或者多个字段）
2. 用户可以访问哪些节点 （即获取到需要的数据）

<!-- https://juejin.cn/post/6844903795407716366 -->
## 几个核心概念
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

# 一个graphql服务，可以没有mutation subscription
# 但是必须有query

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