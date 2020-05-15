# Vue中关于`v-for`中`ref`获取问题

## 场景描述--大图预览和缩略图左右联动实现

在页面A中，获取到图片列表，`[img1, img2, img3 ...]`, 此时点击任意一个图片，需要展示一个弹窗。
弹窗是这样展示的，左边固定一个图片缩略图列表菜单，右边是图片列表大图从上向下排列。
点击弹窗左边菜单，右边对应的大图处于可视区域的顶端。在页面滑动时，左边固定的对应菜单处于选中状态
总的来说就是一个，大图预览和图片缩略图的相互联动效果。

## 实现思路

* 左边联动右边：点击左边缩略图菜单，获取对应索引，然后根据索引，获取对应大图`refs['bigImage-index']`dom元素
让对应的dom，滚动到可视区域中。利用`scrollIntoView()`

* 右边联动左边：滑动大图容器，监听滚动事件，判断滚动的scrollTop的距离，处于哪一个图片列表的索引中，然后在左边菜单
对应选中。

## 伪代码实现

```html
<!-- 缩略图 -->
<div class="thumbnail">
    <div v-for="(item, index) in imgList"
        @click="handleClickThumbnail(index)"
        :key="item">
        <img :src="item" alt="">
    </div>
</div>
<!-- 大图列表 -->
<div>
    <!-- v-for循环大图，加上ref -->
    <img
        v-for="(item, index) in imgList"
        :ref="'bigImage-' + index"
        :src="item"
        alt="">
</div>
```

```js
mounted () {
    // 保存每个图片的滚动范围 起始点--offsetTop, 结束点 offsetTop + offsetHeight
    this.scrollTopList = []
    this.imgList.forEach((item, index) => {
        // z注意点------这个ref是在v-for中动态生成时,它返回的是一个数组,
        // 必须通过 `this.$refs[refName].files[0]`才可以获取到对应的元素
        this.scrollTopList({
            top: this.$refs['bigImage-' + index][0].offsetTop,
            bottom: this.$refs['bigImage-' + index][0].offsetTop
            + this.$refs['bigImage-' + index][0].offsetHeight
        })
    })
    this.handleImgContentScroll()
}

handleImgContentScroll () {
    // 获取滚动元素---按照自己项目来
    // thumbnailIndex----代表当前图片菜单处于选中索引
    const scrollElm = this.$refs['content']
    scrollElm.addEventListener('scroll', throttle((e) => {
        for (let i = 0; i < this.scrollTopList.length; i++) {
            if (this.scrollTopList[i].top <= scrollElm.scrollTop  &&
                scrollElm.scrollTop <= this.scrollTopList[i].bottom) {
                if (this.thumbnailIndex === i) {
                    return
                } else {
                    this.thumbnailIndex = i
                    return
                }
            }
        }
    }, 100), false)
}
```

## 出现问题--问题描述

功能能很好的实现，可问题就出现在第一次，打开这个弹窗的时，滑动页面时候，左边对应的菜单，无任何变化。
没有任何选中效果，第二次的就能正常工作，最后发现`scrollTopList`获取图片的`offsetHeight`和`offsetTop`全是`0`


