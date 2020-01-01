# debounce用法

## 使用场景

debounce用于防抖。见过的使用场景有两个：

1. 当浏览器resize时，resize的回调函数里用防抖，仅计算某个时间后，浏览器的变化
2. 一个在线搜索的multi select下拉框，数据源是全公司的用户，从里面找若干人。输入时，使用防抖，间隔几十毫秒，再去向后台请求，查找用户数据

## 安装：

`npm install debounce`

## 使用

### 引入  

`import { debounce } from "debounce"`

### 在回调中使用

```js
handleClick() {
    /* window.onresize = () => {
        console.log(window.innerWidth)
      } */
    window.onresize = debounce(() => {
        console.log(window.innerWidth)
    }, 3000, true)
    console.log("after")
}
```

当不用debounce时，只要是resize了浏览器，则一定会打印出 window.innerWidth。这就造成一种情况。resize时，控制台疯狂打印。要是这个回调不是简单的打印消息，而是发起请求，请求要爆炸。

当用了debounce后，resize了浏览器，也会在3000毫秒之后，再反应，将执行打印的任务。

从上面看的出来：

1. debounce是作为回调函数使用
2. 只要是回调函数被**触发了**，debounce的第一个参数（是个函数）,**就会执行**，只不过，执行是在若干时间之后（这个时间，就是第二个参数）

## debounce的参数

### func

去抖之后的回调函数

### wait

非必填，默认值是0 。是func等待的时间。

等待时间：上一个func执行后，等待了wait时间后，如果事件被触发了，回调func才会继续触发。

加了wait后，resize包含两种场景：

场景一：func执行了之后。resize事件仍在继续，那么func将一直不会继续触发。

场景二：func执行了之后。继续resize，然后停止，再resize，此时func将继续第二次触发。

### immediate

布尔值，不传时，就当是false处理。

false时，按照wait上面的场景一二执行，在resize停止之后触发func。打印出来的是结束时候的width

true时，在resize开始新的一轮时触发。打印出来的是开始时候的width

返回值：

一个新的debounce。有clear和flush两个属性（都是函数）。

clear用来清空当前在队列中的，未来执行的函数。

flush用来马上触发等待中，未执行的函数。

## 参考文档

[lodash中debounce使用](https://lodash.com/docs/4.17.15#debounce)

[npm中debounce使用](https://www.npmjs.com/package/debounce)