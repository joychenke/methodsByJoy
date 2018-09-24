1. 编程式router.push的声明式是什么样的？使用时有哪些注意的地方？
    + 声明式 <router-link :to="...">
    + 用法：router.push(location,onComplete? ,onAbort)  loaction是一个字符串（路径）或（描述地址的）对象。
        * router.push('home') //字符串路径
        * router.push({path: 'home'}) //对象
        * router.push({name:'user',params:{userId:123}})
        * router.push({path:'register',params:{userId:123}}) //对象中用了path，params将会失效

2. 编程式router.replace的声明式是什么样的？router.replace和router.push区别？
    + <router-link :to="..." replace>
    + router.replace不会向history中添加新纪录，而是替换