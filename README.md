# `lvuetools`

> 这是一个vue3自定义指令的工具库，只需要简单的操作就可以完成你想要做的事儿

## 使用方法

### V-style-change：在style发生变化的时候做点什么！

传入一个函数，第一个参数为object，里面会包含被绑定元素的位置属性。类型为：StyleChangeType,如果被绑定元素的style发生改变，则会触发传入的函数,您还可以自定义防抖函数的wait，默认为300ms

使用wait：写法如下

`v-style-change:wait.800`

这样您就将防抖间隔时间修改为了800ms

### v-appearance：开场！

传入一个对象，类型为`gsap.TweenVars`，默认使用from方法，如果您想使用fromTo，那么您可以像下面这样使用它：

`v-appearance:fromTo={from:{},to:{}}`

两者的类型都为`gsap.TweenVars`

如果您想被绑定元素发生更新的时候再次调用您传入的参数重新进行开场的话呢，您可以这样做：

`v-appearance:from.update`或者`v-appearance:fromTo.update`**请注意！这时必须指定您想使用from还是fromTo**



