// 重点是export和import的几种写法

/*
1，概述
css有指令@import，支持模块化引入。

ES6和其它方式的区别？
ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。
而commonJS和AMD模块，都是在运行时确定这些东西。

let { stat, exists, readFile } = require('fs'); 是整体加载fs模块，生成一个对象，然后再从这三个对象上读取这三个方法

import { stat, exists, readFile } from 'fs';   是编译时加载（或静态加载）。表示从fs模块中只加载这三个方法，其他不加载。 由于只加载部分，ES6的import加载无法引用模块本身，因为他并不是对象。
*/

/*
2, 严格模式（static）
ES6默认使用严格模式。（严格模式有哪些要点，自己看）
在ES6模块中，顶层的this指向的是undefined。不要在顶层代码使用this
*/

/*
3，export命令
export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。
每个js文件就是一个模块，模块内部的变量，外部无法获取，要想外部能读取内部的变量，必须用export关键字输出该变量。
export输出变量有两种方式，单个输出和对象形式批量输出。
export var name = "kk"

export命令规定的是对外接口，必须与模块内部的变量建立一一对应关系。因此常量是不能直接输出的，有三种方式。（看例子）

export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。CommonJS方法得到的值的缓存，取不到动态更新的值。

export命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，下一节的import命令也是如此。
*/

/*
4，import命令
使用export命令定义了模块的对外接口后。其他的JS文件，可以通过import命令加载模块的输出变量。

import {name1, name2} from "file.js"
name1和name2必须和export中输出的名称一致

import {name1 as newName} from "file.js"
将name1重命名为newName

import命令输入的变量都是只读的，因为它本质上都是输入接口。

from后面接的是 绝对路径或者相对路径，如果是模块名，就要自己做一下配置。文件的.js后缀可以省略。

由于import是在编译阶段执行的，是静态执行。因此有以下特性：
① 有提升效果(看例子)
② 不能使用表达式和运算，这些只有在运行时才能得到结果的用法

import可以执行所加载的模块
import "lodash"
import "lodash"
重复多次时，只会执行一次

从一个module中输入多个变量时，会合并为一句（看例子）

CommonJS的require和ES6的import命令能同时用在一个模块里，但是不要那么做。因为import在静态解析阶段执行，它是一个模块之中最早执行的。
*/

/*
5，模块的整体加载
对于一个模块中输出的所有变量，可以用*一次性都输入进新的模块（看例子)
魔铠整体加载所在的那个对象，不允许运行时改变（看例子）
*/

/* 
6， export default命令
export default 用于为模块指定默认的输出（看例子）

不使用export default 的方式输出时，import后面需要加花括号{}；使用export default 的方式输出时，import后面不需要加花括号{}。因为一个模块只有一个export default

export default相当于输出一个名为default的变量。因此后面不能跟变量声明语句。

export default 指定对外的接口为default

用了export default后，输入整个模块
import _ from "lodash"

同时输入默认方法和其它接口
import _, {each, forEach} from 

export 输出类
export default class {...}
*/

/* 
7, export 与 import的复合写法
先输入后输出同一个模块，只是相当于对外转发了同一个模块的内容
export { foo, bar } from "my_module"  相当于
import { foo, bar } from "my_module"
export { foo, bar }
*/

/* 
8, 模块的继承: 模块之间也可以继承（看例子）
*/

/* 
9, 跨模块常量
const声明的常量只对当前文件有效。如果想设置跨模块的常量，常量被多个模块引用。可以用
// constant.js中
export const A = 1;
export const B = 3;
// text.js中
import * as constants from "./constants.js"
console.log(constatns.A)  //1
console.log(constants.B)  //3
*/

/* 
10，import()方法
import 和 export只能在代码的顶层，而不能在代码块之中。因此import就不能像require一样进行条件加载。新提案中，import()方法可以进行动态加载。

import (param) 中的param 和 import命令的参数类型相同，指定所要加载的模块的位置。

import()函数返回一个promise对象。它可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。

import()是运行时执行，什么时候运行到这一句，就会加载指定的模块。

import()类似于 Node 的require方法，区别主要是前者是异步加载，后者是同步加载。
*/

/* 
import() 适用的场合。
① 按需加载 （结合事件一起）
② 条件加载 （结合if条件）
③ 动态模块路径 :  import(param) param参数是函数f()。根据函数f()的返回结果，加载不同的模块。
*/

/* 
import() 使用时注意的点
import()方法加载模块成功后，会将模块作为一个对象，传给promise。promise的then方法可以获取模块输出接口组成的对象。
可以用解构赋值获取输出接口。
想同时加载多个模块时，可以采用Promise.all方法
import() 也可用在async函数中。
*/