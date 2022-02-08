const text1 = 'my name is ben, hhhhhh, xxxx is ben, just ben,...Ben'
const reg1 = /ben/
const reg2 = /ben/g
const reg3 = /ben/gi

console.log('返回单个结果-----', text1.match(reg1))
console.log('返回多个结果-----', text1.match(reg2))
console.log('不区分大小写-----', text1.match(reg3))

const text2 = 'sale1.xls sale2.xls sales.xls'
const reg21 = /ale./g
console.log('.匹配任意一个单个字符', text2.match(reg21))

// 文本也是上述text2, 我们只想匹配ale+数字的.xls的文件，该如果操作呢
// 因为点. 匹配任意一个字符，会把非数字的文件全部找出来，并不符合我们需求
const reg22 = /ale[0123456789]/g
console.log('匹配一组字符', text2.match(reg22))

const reg23 = /ale[^0-9]/g
console.log('集合取反', text2.match(reg23))

const text3 = 'hhhh---asale--xsale'
const reg31 = /--[a-z]sale/g
console.log('中横线在集合外，不表示元字符', text3.match(reg31))

// 配对的转义字符匹配, 匹配array[index]
const text4 = 'array[0]hhhharray[1]'
const reg41 = /array\[[0-9]\]/g
console.log('配对的转义字符匹配', text4.match(reg41))

// 重复匹配，匹配邮箱
const text5 = 'b@qq.com ben@qq.com bfront@qq.com 2323@qq.com 323bxx@qq.com'
const reg51 = /\w@\w\.\w/ // \w只能匹配单个字符，而邮箱的字符是不确定呢，那该怎么写呢
const reg52 = /\w+@\w+\.\w+/g
console.log('重复匹配+', text5.match(reg52))

// .2323@qq.com这个是一个不合法的邮箱，需要排除,
// b1.e2.n@qq.com bf.ront@qq.com这些邮箱，没有覆盖到
// reg52正则就不合适了，我们得调整一下
const text6 = 'b@qq.com b1.e2.n@qq.com bf.ront@qq.com .2323@qq.com 323bxx@qq.com'
const reg61 = /\w[\.\w]*@\w+\.\w+/g
console.log('重复匹配*', text6.match(reg61))

// 过度匹配, 要求：匹配div然后替换div的内容
const text7 = '<div>hello</div><div>kkk</div>'
const reg71 = /<div>.*<\/div>/g
console.log('过度匹配', text7.match(reg71)) // 过度匹配 [ '<div>hello</div><div>kkk</div>' ]
// 我们的本意是匹配出两组数据[<div>hello</div>， <div>kkk</div>] 但是结果把全部最开始div标签
// 和最末尾的</div> 标签当上整个匹配了。跟我们的需求不符合
const reg72 = /<div>.*?<\/div>/g
console.log('懒惰匹配', text7.match(reg72))

// 单词匹配
const text8 = 'the caption wore his cap and cape, from a bcap'
// const text8 = 'from a bcap'
const reg81 = /\bcap/g
const reg82 = /cap\b/g
const reg83 = /\bcap\b/g
console.log('单词匹配开头', text8.match(reg81), '单词匹配结尾', text8.match(reg82) , '单词匹配开头和结尾', text8.match(reg83))

const text9 = 'the - wore his cap and cape, from a bcap'
const reg91 = /\B-\B/g
console.log('不匹配单词边界', text9.match(reg91)) // [ '-' ]

// 子表达式, 需求：找出plus+plus+这样，不是单个plus+
const text10 = 'plus+ aaa plus+ asdaksd plus+plus+'
const reg101 = /plus\+plus\+/g // 我们可以这样写，但是如果是十个，一百个呢？
const reg102 = /(plus\+){2,}/g
console.log('子表达式', text10.match(reg102))

// 回溯引用
const text11 = 'this is a book of of text, words here are are'
const reg111 = /[ ]+(\w+)[ ]+\1/g
console.log('回溯引用', text11.match(reg111))

// 向前向后查找
// 例如： http://a.b.com https://c.b.com 我们只需要域名，不需要http协议
const text12 = 'http://a.b.com https://c.b.com'
const reg121 = /https?(?=:)/g
const reg122 = /.+?(?=:)/g
const reg123 = /(?<=:\/\/)(\w\.)+\w/g
console.log('向前查找', text12.match(reg121), text12.match(reg122))
console.log('向后查找', text12.match(reg123))