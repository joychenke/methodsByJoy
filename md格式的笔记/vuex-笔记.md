## 概念：

vuex：为vue.js开发的 状态管理模式。采用集中式存储，管理应用的所有组件的状态。并以相应的规则保证状态以可预测的方式发生变化。



解决的问题：

1，兄弟组件间的状态的传递

2，通过事件来变更和同步状态的多份拷贝



Vuex和全局的对象有什么不同？

1，Vuex的状态存储是响应式的。如果strore的状态改变了，相应的组件也会更新

2，不能直接改变stroe的状态。store的状态只能唯一的改为显示的提交mutation



Store是容器，存储应用中的状态（state）

store中必须的是状态state，和mutations。 state中存放的是状态，mutations中存放的是，commit时的方法。

通过提交commit的方式而不是直接更改store.state.count。这样做的好处是可以更明确地追踪到状态的变化。



## 核心要点

1， store中的状态是响应式的，因此，仅需要在computed属性中返回需要使用的状态即可。

2， 触发变化，也仅仅是在组件的methods中提交mutation

## State

一个项目中只有一个Store实例

根实例中注册store选项  ===》子组件能通过this.$store访问Store实例。



### mapState

mapState ：mapState是Vuex自带的辅助函数，用来帮助生成计算属性。

state中的状态，通过计算属性获取。当要获取多个状态时，写在一个computed里比较繁琐。这就是为什么会有mapState。

mapState中可以传对象（将Store中的state命名为另一个名字），有三种写法：

```JavaScript
computed: mapState(
{
    // 箭头函数
    count: state => state.count
    // 缩写
    countAlias: "count"
    //使用当前组件的变量localCount
    countPlusLocalState(state){
        return state.count + this.localCount
    }
})
```



当映射的计算属性名称和state名称相同时，可以给mapState传一个字符串数组

```
computed: mapState([
	// 映射this.count 为store.state.count
	"count"
])
```



对象展开运算符：将本地的计算属性和mapState返回的对象混合使用。



## Getter

### 定义：

getter是定义在Store中的属性。它是从Store的state中派生出的状态，可以理解为Store自己的私有属性。

### 接收的参数：

第一个参数是state，第二个参数是其他getters

### Getter的访问：

getter作为属性访问时，也是响应式系统的一部分。有两种访问方式：

```javascript
// 通过属性的方法，访问getters中的doneTodosCount状态
this.$store.getters.doneTodosCount
// 通过方法访问，访问getters中的getTodoById状态
// 在getter中定义getTodoById为一个函数，在组件中，通过this.store.getters.getTodoById(参数)获取
 getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
 this.$store.getters.getTodoById(2)
 
```

### mapGetters辅助函数:

和mapState的作用和用法都类似，

作用：将getter中的属性映射到组件中的计算属性

用法：传参是对象和数组（结合扩展运算符）均可。

## Mutation

### mutation理解

更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。

珂珂的理解：mutation对象中定义了不同函数。

函数名：事件类型（type)

参数：有两种方式（type,payload） 或者({type, payload})。两种情况下，mutations中定义的函数一样。

```javascript
// type直接作为第一个参数传时： 第一个参数是state；第二个参数，是自己传入的参数（通常是一个对象）
this.$store.commit("increment", {amount: 10})
// 只传一个对象，但是对象中必有type属性
this.$store.commit({ type: "increment", amount: 10})
```

函数体：对state进行的操作

### 遵守的Vue响应规则

1，在store中初始化好所有属性

2，当需要在对象上添加新属性时，有两种方法

​     和Vue一样，Vuex也无法无法探测新增属性（组件中使用的是Vue.set( target, prop/index, value)或者this.$set(  target, prop/index, value ) )

```JavaScript
// 用Vue.set方法，往响应式对象中，添加一个属性。并确保这个新属性是响应式的
Vue.set(obj, "newProp", 123)
// 用新对象替换老对象,结合扩展运算符使用
state.obj = {...state.obj, newProp: 123}
```



### 使用常量替代Mutation事件类型

另外开一个文件，存放mutation的事件名。然后在store.js中引入这个名字直接使用

### Mutation中必须是同步函数

devtools中调试的时候，有mutation之前和之后的状态。

由于任何在回调函数中进行的状态的改变都是不可追踪的。所以mutation中必须是同步函数

### 组件中提交mutation

两种方式

```javascript
// 在组件中使用
this.$store.commit('xxx')
// 使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用（需要在根节点注入 store） 详情看官网讲解和例子
```

## Action

### Action的理解：

提交的是mutation，可以包含异步操作。

珂珂的理解：actions对象中定义了不同函数。

函数名：自己定义。

参数： 和store 实例具有相同方法和属性的 context 对象。（可结合解构赋值，取其中需要的参数）

函数体：可以有异步操作

### 分发Action：

Action通过 store.dispatch 方法触发。

store.dispatch( ) 的参数和commit的参数类似。既可以是两个参数（载荷方式），也可以是一个参数（对象方式）。看下面例子：

```javascript
// 载荷方式
store.dispatch("incrementAsync", {amount: 10})
// 对象方式
store.dispatch({type: "incrementAsync", amount: 10})
```

### 组件中分发Action

两种方法：

直接分发

```
this.$store.dispatch("increment")
```

使用mapActions，将 组件的methods映射为 store.dispatch 

```javascript
// 具体用法参考官方文档
methods: {
	...mapActions([
        "increment",
        "incrementBy",        
    ]),
    ...mapActions({
        add: "increment"
    })
}
```

### 组合Action

对store.diapatch的几点理解【文档写得很清楚】：

1， 被触发的 action 处理函数返回的 Promise

2，store.disaptch仍旧返回Promise

3，action中可以嵌套别的action的dispatch

4， 一个 store.dispatch 在不同模块中可以触发多个 action 函数。在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行



## Module

### 备注：

时间有限，这一块内容，自己下去看

### 项目结构

1. 应用层级的状态应该集中到单个 store 对象中。
2. 提交 **mutation** 是更改状态的唯一方法，并且这个过程是同步的。
3. 异步逻辑都应该封装到 **action** 里面。

其他内容，结合官网提供的例子进行学习。