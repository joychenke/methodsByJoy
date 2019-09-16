/* 
1，浏览器加载
传统通过script标签写内嵌的脚本，或者通过script的src属性，加载外部脚本
<script type="application/javascript">
// module code
</script>
<script type="application/javascript" src=".../module.js"></script>
默认情况下，脚本是同步加载。遇到script标签后，停下，执行完了之后，再继续向下加载。

脚本异步加载
script标签加上的defer和 async属性。渲染引擎遇到这一行命令后，就会开始下载外部脚本。但不会等他下载和执行，而是会直接执行后面的命令。
defer：“渲染完就执行”。渲染完是指页面DOM和其它脚本渲染完。有多个defer时，会顺序执行。
async: "下载完就执行"。下载完是指当前的脚本下载完。有多个async时，不能保证加载顺序。
*/

/* 
加载规则
ES6模块也能用script标签的方式加载(看例子)
ES6模块也能用在内嵌网页中
对于外部的模块脚本有5点需要注意的地方（详情看文档）
利用顶层this为undefined这个特点，可以判断当前的模块是否是ES6模块。
*/

/* 
2，ES6模块和CommonJS模块的差异
① commonjs输出的是值的拷贝，es6模块输出的是值的引用
② commonjs模块是运行时加载，es6模块是编译时输出接口
因为第一条，所以在require了模块之后，不能获取到模块的变更，除非写成一个函数（看文档中的例子）
ES6 模块不会缓存运行结果，而是动态地去被加载的模块取值，并且变量总是绑定其所在的模块
由于 ES6 输入的模块变量，只是一个“符号连接”，所以这个变量是只读的，对它进行重新赋值会报错。
export通过接口，输出的是同一个值，不同脚本加载这个接口得到的是同样的实例。（原因还是因为es6输出的是接口）
*/

/* 
3, node加载
Node的import目前只支持加载本地模块，不支持加载远程模块

如果模块名不含路径，那么import命令回去node_modules目录找，比如  
import "baz"
import Router from "vue-router"

如果模块名包含路径，那么会按照路径去寻找这个名字的脚本文件

如果脚本文件省略了后缀名 比如import './foo' ，会依次做下列尝试：
./foo.mjs、./foo.js、./foo.json、./foo.node  =》  ./foo/package.json的main字段指定的脚本  =》./foo/index.mjs、./foo/index.js、./foo/index.json、./foo/index.node  以上三层，都没找到时，会抛出错误。

Node 的import命令是异步加载
*/

/* 
内部变量
ES6中顶层的this指向undefined，CommonJS中指向的是当前模块。以下变量都是不存在的
arguments , require , module , exports , __filename , __dirname
*/

/* 
ES6模块加载CommonJS模块
CommonJS 模块的输出都定义在module.exports属性上面。
CommonJS和ES6的两种等效写法（看例子）
*/

/* 
CommonJS模块加载ES6模块
CommonJS 模块加载 ES6 模块，不能使用require命令，而要使用import()函数 （详情看文档）
*/

/* 
4，循环加载
循环加载指的是 a循环依赖b，b循环依赖a

CommonJS模块加载原理：
require命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。无论加载多少次，都只会在第一次加载时运行一次。以后再加载，都只会返回第一次运行的结果，除非手动清除系统缓存

CommonJS模块的循环加载：
CommonJS 模块遇到循环加载时，返回的是当前已经执行的部分的值，而不是代码全部执行后的值（看文档例子代码）

ES6模块的循环加载：
解决ES6不能直接循环加载的问题。可以将变量写成函数解决。这是利用里函数具有提升作用。（看懂ES6循环加载那几个例子）
*/

/* 
5，ES6模块的转码
Babel：浏览器还不支持ES6，用Babel可以将ES6转成 ES5 的写法。
还有其他两个方法，也可以用来转码。
ES6 module transpiler
SystemJS   使用方法： ①载入system.js ②System.import()方法加载模块文件，它返回一个 Promise 对象
*/
CommonJS
ES6