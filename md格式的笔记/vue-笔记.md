## mixin混入

组件和混入对象有同名选项时，会进行【选项合并】

选项合并： 

1.  数据对象（data中的内容），会进行合并，如果发生冲突，以当前组件数据为准。

2. 同名的钩子函数（如created）都将合并为数组，都会被调用。混入对象的钩子将在自身钩子之前被调用。

3. 值为对象的选项（如methods或者components等）将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。 

   [^1]: Vue.extend() 也使用同样的策略进行合并

全局混入：

​		它会影响每个单独创建的 Vue 实例

## 自定义指令

自定义指令的写法：全局和局部注册

```javascript
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

```JavaScript
// 局部注册时，使用组件的directive选项
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```

## 渲染函数和JSX

渲染函数

## 使用插件

package.json中波浪线~和插入符号^的区别？

波浪线会更新到第2个数字的最新版。比如 "element-ui": "~2.2.0"  ，会将element更新到2.2.x的最新版，但是不会更新到2.3.x.所以只会更新到 2.2.2

插入符号会更新到第1个数组的最新版。比如  "element-ui": "^2.2.0",则会将element更新到 2.x.x的最新版，但是不会更新到3.x.x。所以会更新到2.11.0

通过Vue.use( 插件名 )

项目中两种使用组件的方法(插件名)：

```javascript
// router 的引入： 在router.js中做Vue.use()； 在main.js中引入； 在new Vue（）时作为对象参数的属性
import Router from "vue-router";
Vue.use(Router);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

// element 的引入
import ElementUI from "element-ui";
Vue.use(ElementUI);
```

## 过滤器

可以用在： 双花括号插值和 v-bind 表达式

参数： 第一个参数是前一个表达式的结果，自己传入的参数，分别跟在后

```JavaScript
// 一个过滤器，自身带2个参数，一个固定值，一个表达式
{{ message | filterFunc("arg1", arg2)}}
```

注意：过滤器可写成链式的，链式的接收一个参数（官网这么写的）



