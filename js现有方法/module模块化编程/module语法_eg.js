// 单个输出
export var name = "kk"
export var height = "170cm"
// 在模块的尾部批量输出
export {name, height}
// 用as关键字给输出模块重命名
export {
  v1 as strV1
}// 将v1重命名为v1

/* 常量正常输出的三种方式 */
/* 
①  export var m = 1;
②  
var m = 1
export {m}
③
var m = 1
export {m as n}
*/

/* 
import有提升效果
foo()
import {foo} from "myModule"
这样不会报错，因为import命令这一行被提升到了整个模块的头部，首先执行了
*/

/* 
从一个module中输入多次时，会合并为一个import语句
import {foo} from "my_module"
import {bar} fomr "my_module"
等价于
import { foo, bar } from "my_module"
*/

/*
用import指令输入整个模块
cirlce.js中有两个变量 function area 和 function circumstance
引入整个模块的写法：
import * as circle from "./circle.js"
使用引入的变量：
console.log("面积是：", circle.area(4))
// 下面两行不允许
circle.foo = "hello"
circle.area = function(){ }
*/

/* 
export default使用：
// export-default.js中输出
export default function(){
  console.log("foo")
}
// import 为默认输出的内容命名
import customeName from "./export-default"
*/

/* 
模块继承的例子:
circlePlus.js模块继承了 circle.js 模块。main.js中输入了circlePlus.js模块。
*/
// circlePlus.js模块中:
export * from "circle" // 输出circle模块中的非default方法
export var e = 2.718  // 输出自定义变量e
export default function(x){
  return Math.exp(x)
}
// main.js模块中：
import * as math from "circlePlus"  // 输入circlePlus中的非default方法，重命名为math
import exp from "circlePlus" // 将circlePlus中的 default方法输入为exp
console.log(exp(math.e))  // exp(x)的值是Math.exp(x), math.e是在circlePlus.js中的常量e  最后的结果就是  Math.exp(e)
