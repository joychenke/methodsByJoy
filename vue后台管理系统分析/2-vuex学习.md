##vuex学习<br/>
[vuex官网](https://vuex.vuejs.org/zh/)

###问题：
1. vuex是什么？设计思想又是什么？<br/>
    + 专门为vue应用程序开发的状态管理模式。
    + 把组件的共享状态抽出来，以全局单例模式管理。
    + ![](./vuex-1.png 'vuex设计图')
2. vuex和单纯全局对象的不同点：<br/>
    1. vuex状态存储是响应式
    2. 不能直接改变store中状态，改变的store需要commit mutation
3. 将状态从根组件“注入”到每个子组件的方法？子组件如何访问store实例？
    + main.js（加载组件和初始化）中，创建Vue实例的时候，写上store选项。
    + 子组件通过this.$store访问
4. 当一个组件需要获取多个状态时，如何生成计算属性比较好？
    + mapState辅助函数可以帮助生成计算属性
    + mapState里可以传对象，也可以传数组。当映射的计算属性的名称和state的子节点名称相同，传数组
5. Getters什么时候用？Getter定义在哪里？
    + 需要从store的state中派生出一些对象时，。
    + getters定义在store实例中。
6. Getters如何访问？
    + 通过属性访问。Getter会暴露为store.getters对象。通过属性的方式进行访问。
    + 通过方法访问。通过getter返回一个函数，实现getter传参。
