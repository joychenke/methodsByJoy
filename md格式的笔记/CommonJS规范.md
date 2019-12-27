1. Node应用由什么构成？采用什么规范？

   由模块构成，采用的是CommonJS规范。

2. CommonJS中，module变量是什么？ module.exports属性呢？

   module代表当前模块，是个对象。 module.exports是对外的接口。

3. 加载模块是什么意思？

   加载模块的 module.exports属性

4. CommonJS模块的特点？

   + 所有代码都运行在模块作用域，不会污染全局作用域。

   + 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓     存结果。要想让模块再次运行，必须清除缓存。
   + 模块加载的顺序，按照其在代码中出现的顺序。

5. module对象有哪些属性？

   id, filename , 

   loaded 模块是否加载完成

    parent 调用该模块的模块

    children 该模块要用到的其他模块

   exports

6. 模块内部的exports变量指向什么？

   指向module.exports 。不用修改module.exports的指向。

7. require命令的基本用法是什么？

   读入并执行一个JavaScript文件，然后返回该模块的exports对象。

8. require加载文件时，加载路径参数有哪些？

   + 参数字符串以“/”开头
   + 参数字符串以“./”开头
   + 参数字符串不以“./“或”/“开头，则表示加载的是一个默认提供的核心模块（位于Node的系统安装目录中），或者一个位于各级node_modules目录的已安装模块（全局安装或局部安装）
   + 不以“./“或”/“开头，而且是一个路径
   + 如果指定的模块文件没有发现，Node会尝试为文件名添加.js、.json、.node后，再去搜索
   + 想得到require命令加载的确切文件名，使用require.resolve( )方法

9. CommonJS中目录的加载规则是什么？

   require发现参数字符串指向的是目录  ==》 在目录中找package.json 文件  ==》 package.json 中国main字段指定的入口文件。

   如果没找到package.json文件，或者没有找到main字段，则加载当前目录下的index.js文件或index.node

10. 模块缓存是什么意思？

    第一次加载某个模块时，Node会缓存该模块。以后再加载该模块，就直接从缓存取出该模块的module.exports属性

11. 如何删除模块缓存？

    缓存的模块在require.cache（对象）中，

12. NODE_PATH是什么？

    NODE_PATH是环境变量，它是一组以冒号分隔的绝对路径。在其他位置找不到指定模块时，Node会去这些路径查找。

13. require.main的作用？

    require方法有一个main属性，可以用来判断模块是直接执行，还是被调用执行。

    立即执行的时候，指向的是模块本身。 

    ```javascript
    require.main === module
    // true
    ```

    不是立即执行时，上面表达式是 `false`

14. 模块加载机制？

    输入的是被输出的值的拷贝。一旦输出一个值，模块内部的变化就影响不到这个值。

15. require的内部处理流程？

    检查 =》 创建Module实例 ==》 保存缓存 =》 加载指定模块  =》删除模块 =》 返回模块的module.exports

16. require函数及其辅助方法

    一共5个

    require(): 加载外部模块
      require.resolve()：将模块名解析到一个绝对路径
      require.main：指向主模块
      require.cache：指向所有缓存的模块
      require.extensions：根据文件的后缀名，调用不同的执行函数