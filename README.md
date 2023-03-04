# `lvuetools`

> 这是一个vue3自定义指令的工具库，只需要简单的操作就可以完成你想要做的事儿

## 使用方法

### *注意：参数具有严格的顺序要求，如果您想传入后续参数，那么请尽量传入前置参数，否则可能会发生意料之外的错误*

### v-style-change：在style发生变化的时候做点什么！

传入一个函数，第一个参数为object，里面会包含被绑定元素的位置属性。类型为：StyleChangeType,如果被绑定元素的style发生改变，则会触发传入的函数,您还可以自定义防抖函数的wait，默认为300ms

使用wait：写法如下

`v-style-change:800`

这样您就将防抖间隔时间修改为了800ms

### v-appearance：

可以在组件加载完成后开始开场动画

完整参数传入如下

```js
v-appearance="{
      way: 'fromTo',
      name: 'customize',
      update: true,
      from: { y: 500 },
      to: { y: 0 },
    }"
```

customize为自定义动画名称name，请保证其唯一性，否则可能会发生意料之外的错误

700为防抖函数的wait，如果开启了update更新，则此参数可能会对您有用，您可以自己决定wait，默认为300ms

fromTo为动画方式，详情可以参考gsap的from和fromTo

update为开启被绑定元素更新时再次重新进行开场，会采用之前传入的wait作为防抖的wait

### v-etoolscharts 图表！集成了Echarts

完整参数传入如下

```js
v-etoolscharts:dark:svg="options"
```

dark为主题名称，可以参考echarts，可选light

svg为渲染方式，可选canvas

### v-wh 在被绑定元素宽高改变时做点什么！

完整传入参数如下

```js
v-wh:300="tt"
```

300为防抖函数wait

tt为传入的函数，函数接收第一个参数为改变宽高附带的信息，类型为`ResizeObserverEntry[]`

