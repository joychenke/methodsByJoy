// 浏览器使用 type="module",加载ES6模块
/*<script type="module" src="module.js"></script>
// 用上面的方式加载ES6的模块，相当于加上了defer属性

// 内嵌网页中
<script type="module">
 
  import utils from "./utils.js"
</script>

*//* 

// CommonJS 和 ES6的两种等效写法
module.exports = {
  foo: "hello",
}
bar: "world"
等效于
export default {
  foo: "hello",
  bar: "world"
}
用import命令加载上面的模块时，实际上输入的是这样的对象

{ default: module.exports}

一共有三种写法，可以拿到 CommonJS 模块的module.exports
*/
CommonJS
ES6
