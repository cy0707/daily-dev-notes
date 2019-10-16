# 基于uni-app的微信小程序、H5迁移到支付宝小程序问题集合

## 项目背景简介

项目最开始是基于mp-vue搭建微信小程序，由于需求需要，要做H5版本的。所以采用了
uni-app把微信小程序重构了, 使它能成为H5、微信小程序二合一的版本、后面又因为需求的变更，要把H5版本的修改为支付宝小程序，这篇文章主要讲的就是，我在迁移到支付宝小程序遇到各种问题和解决方法，希望对大家有所帮助。

## 标签问题

* `<img>`标签在支付宝图片渲染不出来

```html
<img />
<!-- 更换成下面这种 -->
<image />
```

* `<span>`标签的点击事件不生效

```html
<span @click="test"></span>
<!-- 更换成下面这种, 点击事件才生效 -->
<text @click="test"></text>
```

## 字体图标问题（iconfont)

在H5中，只用复制iconfont的代码即可，例如
```html
<link rel="stylesheet" href="//at.alicdn.com/t/font_111111_rbodvzht4g8.css">
```

在微信小程序中，只需要把从iconfont官网下载下来的代码，中iconfont.css的文件拷贝到项目中，然后在项目中引用即可。

但是在支付宝小程序中，当我按照微信小程序的方式配置，在调试模式下，是能正常展示的，但是在预览模式下却不能展示。此时需要把下载下来的源码中字体图标文件，对应的拷贝到项目中，才能正常展示。

## 小程序不支持DELETE、PUT

具体的解决方法是，前端把DELETE、PUT请求更换成POST请求，在请求头加入`X-HTTP-Method-Override`, 服务端根据Header：`X-HTTP-Method-Override`，转换请求方法，具体可以参考下面文章

[HTTP中间层不支持PUT/DELETE等特定METHOD时的处理](https://blog.csdn.net/youbl/article/details/84647791)



## 需要注意的点--调试模式和预览模式

**支付宝小程序的调试模式和预览模式有较大的差异，有时候在调试模式下，感觉各种功能都特别完美，但是预览模式会让你崩溃**

这里最主要的影响是，生命周期函数的问题，在微信小程序中和H5中的，onLoad事件中，执行页面渲染的时候，页面显示的很正常，但是到支付宝的某些页面，特别是该页面并没有请求后端接口，只是根据地址栏参数不同，页面展示的状态不同，就大部分会出现这个问题。下面我用代码详细描述这个现象


这个页面是订单支付页面，当支付完成后，会跳转到订单结果展示页面，并携带状态参数

```js
this.$router.push({
    path: '/packageSecondary/orderResult/index', 
    query: {
        status: 'success'
    }
})
```

订单结果页

```html
<div class="result">
    <div class="icon-container">
        <icon
            v-if="status === 'success'"
            type="right"
            color="#02C2C9"
            font-size="72"
        />
        <icon
            v-else
            type="failure"
            color="#ff6f37"
            font-size="72"
        />
    </div>
    <div class="text">{{ status ? '支付成功', '支付失败'}}</div>
</div>
```

该页面的onLoad事件代码

```js
onLoad(opt) {
    this.status = opt.status
}
```

在支付宝小程序中，当我们第一次跳转到这个页面的时候，会正常展示，但是第二次跳转到这个页面的时候，就是一片白板，或者undefined等等问题（**这些会发生在预览模式下，调试模式下不会出现这个问题**）

对于这个问题，应该没有触发视图的更新，但是具体的原因还是没能得知，有知道的兄弟可以告知一下。对于以上问题，我一般有两个解决方法。

```typescript
// 方法一： 采用计算属性
{
    get orderPayInfo () {
        let result = {
            title: '订单支付成功',
            subTitle: '您的订单已支付, 请耐心等待发货',
        }
        if (this.status === 'fail'){
            result = {
                title: '订单支付失败',
                subTitle: '您的订单还未支付, 快去支付吧',
            }
        }
        return result
    }
}

onLoad(opt) {
    this.status = opt.status
}

// 方法二： 采用mounted钩子函数
onLoad(options) {
    // 获取参数
    this.status = opt.status
}

mounted () {
    // 在mounted重新
    this.orderPayInfo = this.status === 'success' ? {
        title: '订单支付成功',
        subTitle: '您的订单已支付, 请耐心等待发货',
    } : {
        title: '订单支付失败',
        subTitle: '您的订单还未支付, 快去支付吧',
    }
}
```

## 授权逻辑

这个是开发小程序最开始的一步，有点同学经常会在技术群里，会问到授权弹窗出现两次、怎么判断用户已经授权成功等等问题，下面我把我的代码分享一下吧

**授权弹窗出现两次，这个官方有解释**

正常获取会员基础信息需要弹窗两次进行授权确认：一次是 my.getAuthCode 获取用户授权码的授权框， 另一次是 my.getOpenUserInfo 中获取用户基础信息的授权框。my.getAuthCode 使用静默授权方法（令 scopes 为 auth_base）即可实现只出现一个授权弹框。


```html
<button
    v-if="!userAuthorized"
    class="btn"
    :loading="showAuthLoading"
    open-type="getAuthorize" 
    scope="userInfo" 
    @getAuthorize="handleGetAuthorize" 
    @error="onAuthError"
>
    支付宝授权登录
</button>
```

```js
// 判断用户是否已经授权过该小程序
checkUserAuthorized () {
    return new Promise((resolve, reject) => {
        uni.getSetting({
            success(res?) {
                const auth = res.authSetting['userInfo']
                auth ? resolve(true) : reject(false)
            },
            fail() {
                reject(false)
            }
        })
    })
}

// 获取授权code--进行登录
handleGetUserCode () {
    return new Promise((resolve) => {
        my.getAuthCode({
            scopes: ['auth_base'],
            success: (res) => {
                resolve(res.authCode)
            }
        })
    })
}

// 看你们项目需求，是否需要传递用户头像、昵称给后端
async handleGetAuthorize () {
    // 获取用户的授权code
    let code:any = ''
    await this.handleGetUserCode().then((data) => {
        code = data
    })
    // 获取用户头像和昵称
    my.getOpenUserInfo({
        success: (res) => {
            // 项目逻辑
        }
    })
}

onLoad () {
    // 判断用户是否已授权该小程序
    this.userAuthorized = await this.checkUserAuthorized().catch(() => false)
    if (this.userAuthorized) {
        this.handleGetAuthorize()
    } else {
        // 自行处理
    }
}
```