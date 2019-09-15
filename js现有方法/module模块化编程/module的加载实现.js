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
如果模块名包含路径，那么会取;
*/