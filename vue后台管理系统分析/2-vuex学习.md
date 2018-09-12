# vuex学习<br/>
[vuex官网](https://vuex.vuejs.org/zh/)

## vuex概念：
1. vuex是什么？设计思想又是什么？<br/>
    + 专门为vue应用程序开发的状态管理模式。
    + 把组件的共享状态抽出来，以全局单例模式管理。
    + ![](./vuex-1.png 'vuex设计图')
2. vuex和单纯全局对象的不同点：<br/>
    1. vuex状态存储是响应式
    2. 不能直接改变store中状态，改变的store需要commit mutation
## State
1. 将状态从根组件“注入”到每个子组件的方法？子组件如何访问store实例？
    + main.js（加载组件和初始化）中，创建Vue实例的时候，写上store选项。
    + 子组件通过this.$store访问
2. 当一个组件需要获取多个状态时，如何生成计算属性比较好？
    + mapState辅助函数可以帮助生成计算属性
    + mapState里可以传对象，也可以传数组。当映射的计算属性的名称和state的子节点名称相同，传数组
## Getters
1. Getters什么时候用？Getter定义在哪里？啥时候会被重新计算
    + 需要从store的state中派生出一些对象时。
    + getters定义在store实例中。
    + getter的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算
2. Getters如何访问？
    + 通过属性访问。Getter会暴露为store.getters对象。通过属性的方式进行访问。
        1. 在js文件中，可以通过store.getters来访问
        2. 在vue组件中，出现在computed属性中，用this.$store.getters访问
        3. getter在通过属性访问时是作为Vue响应式系统的一部分缓存其中的
    + 通过方法访问。通过getter返回一个函数，实现给getter传参。
        1. <pre>getters: {
                getTodoById: (state) => (id) => {
                    return state.todos.find(todo => todo.id === id)
                }
            }
            store.getters.getTodoById(2)//获取id是2的todo { id: 2, text: '...', done: false }</pre>
        2. getters通过方法访问时，每次都会进行调用，而不会缓存
3. mapGetters是什么？
    + mapGetters辅助函数仅仅将store中的getter映射到局部计算属性  

## Muatation
1. Mutation用来干什么？mutation由什么构成？在哪里进行状态更改？第一个参数是什么？
    + mutation：更改store中状态（state)的唯一方法。
    + mutation有一个type（事件类型）和handler（回调函数）。
    + mutation在handler里进行状态更改，mutation的第一个参数是state。
2. 如何调用mutation中的handler？
    + 不能直接调用mutation handler，需要以响应的type调用store commit方法。如：
    `store.commit('increment')`
3. 什么是载荷（Payload)？载荷的写法？
    + 向store.commit传入的额外参数,即store.commit()的第二个参数。
    + 载荷通常是对象，包含多个字符。如
    + <pre>mutations:{
        increment(state,payload){
            state.count += payload.amount;
        }
        }
        store.commit('increment',{
            amount:10
        })</pre>
4. 如何用对象风格提交mutation？
    + <pre>mutations:{
        increment(state,payload){
            state.count += payload.amount;
        }
        }
        store.commit({//整个对象作为载荷提交给mutation
            type:'increment'
            amount:10
        })</pre>
5. mutation要遵守的Vue响应规则
    1. 提前在你的 store 中初始化好所有所需属性
    2. 当需要在对象上添加新属性时,用Vue.set()
6. 使用常量替代Mutation事件类型
    + 集成模板里就是这样写做的。modules下的js文件，mutation下定义的事件类型都是大写。比如“SET_SIZE”
7. 为什么Mutation必须是同步函数？
    + 因为当 mutation 触发的时候，回调函数还没有被调用，devtools 不知道什么时候回调函数实际上被调用——实质上任何在回调函数中进行的状态的改变都是不可追踪的。

## Action
1. Action是什么？和Mutation区别？
    + Action用来提交Mutation。
    + Action