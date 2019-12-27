# APP.vue

App.vue和项目的关系？

通过观察发现，用官方提供的模板App.vue中的内容，会直接渲染到页面上。App.vue中的 `router-view`标签渲染的是路由表的第一层路由。看例子：

```javascript
export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/About.vue")
    },
    ...// 其他路由项
    ]
    })
```

如上，App.vue中的router-view处默认渲染的是About.vue组件

# watch监听

什么时候监听开始呢？

1. watch是Vue实例的对象属性。watch里面，键是表达式，值是对应的回调函数（`Function`）， 方法名（`string`），包含选项的对象（`Object`）或者数组（`Array`）

2. 官网里写的类型是： `{ [key: string]: string | Function | Object | Array}`

3. 官网里写的例子是：

   ```javascript
   // 普通函数时，第一个参数是新值，第二个参数是旧值
   a: function(val, oldVal){
    // 监听到变化后，进行的操作   
   }
   // 监听到变化时的方法名
   b: "methodName"
   // 监听对象的property改变时调用，无论嵌套多深
   c: {
       hanldler: function(val, oldVal){
           // 监听到变化时，执行的操作
       },
       deep: true
   }
   // 监听开始之后，立即被调用(写)
   // 什么时候监听开始呢？ 目前来看，这种写法，会在页面加载时就执行。相当于在mounted里调用过this.getOptions()，并且用普通函数监听了d.这种写法常用于简化代码
   d: {
       handler: function(val, oldVal){
           this.getOptions();
       },
       immediate: true
   }
   // 值是对象时，对象的元素，可以是字符串（方法名）， 函数， 或者对象
   e: [
       "handler1",
       function handle2(val, oldVal){ },
       {
           handler: function handle3(){},
           ...
       }
   ]
   // 也可以watch对象的某个属性
   // 例如，tableDatas对象的datas属性
   “tableDatas.datas”： funtion(val, oldVal){
       // 监听到变化后进行的操作
    }
   ```

   

4. watch可以直接监听对象或者数组的变化吗？

   不行的，因为watch监听对象（包括数组）类型变量时，监听的是对象的地址。只要对象的地址不变，都不会触发更新

5. watch中回调函数能够写成箭头函数的形式吗？

   不可以。因为箭头函数绑定了父级作用域的上下文，`this`将不会按照期望指向Vue实例。

# props属性

谈到组件 `prop`时，都是指父组件向子组件传值

### 单向数据流

父组件中的值变化时，子组件prop中的变量会同步刷新。

子组件不能直接更改prop中的变量的值

子组件希望改变prop的情况：

1. prop用来传递一个数据，子组件作为本地的prop数据使用

   ```javascript
   props: ['initialCounter'],
   data: function () {
     return {
       counter: this.initialCounter
     }
   }
   ```

   

2. prop用来传递一个数据，子组件中利用prop的数据，computed一个新数据

   ```javascript
   props: ['size'],
   computed: {
     normalizedSize: function () {
       return this.size.trim().toLowerCase()
     }
   }
   ```

### 静态prop

仅支持字符串和布尔值。字符串直接传。布尔值，传了就是true，没传就是false

```
<basicText title="blogTitle"></basicText>
```

### 动态prop

+ 定义数组接收  ` props: ['title', 'likes', 'isPublished', 'commentIds', 'author'] `

+ 定义对象接收 

  提供一个带有验证需求的对象，对象的每个元素就是需要接收的变量

  每个变量有以下几个属性：`type` `required` `default` `validator`

  注意：prop中的值会在组件实例创建之前进行验证。所有实例的属性（`data`，`computed`等）在`default`或`validator`函数中不可用。

  `type`：类型检查

  原生的构造函数有 `String`，`Number`，`Boolean`， `Array`， `Object`， `Date`，`Function`， `Symbol`   也可以用自己定义的构造函数

  `default`： 默认值。要注意的是对象和数组的默认值要用工厂函数获取。

  ```javascript
  // 默认值是对象    { message:"hello"}
  tip: {
      type: Object,
      default: () => {
          return { message:"hello"}
      }
  }
  ```

  `validator`：自定义验证函数。`validator`是个验证函数，函数的参数是接收的参数的值，函数的返回值是true或false。返回true时，表示验证通过。否则不通过

  ```json
  propF: {
  	validator: (value) => {
          return ["success", "error", "info"].includes(value)
      }
  }
  ```

### 非Prop特性

父组件向子组件，传递任意特性。子组件会把这个特性添加到组件的根元素。

父组件，在标签上用表达式传表达式 `class="div-wrapper"`

```javascript
<computed-com :value="fieldValue" class="div-wrapper"
                  @changeVal="handleChangeVal"></computed-com>
```

```html
<div class="div-wrapper">
    // 子组件的内容
</div>
```

加一个表达式，或者字符串，或者一个变量，都是可以的。

但是在子组件中，如果是等式，接收的还是等式，等号左右两边都是字符串。如果是表达式，接收的还是表达式。

```html
// 父组件,border无论是不是变量，子组件中接收到的都是固定的border
<table-com border></table-com>
// 子组件中，
<div border>
    
</div>
```

```
// 父组件，等号的左右两边无论是什么，子组件接收到的都是固定的等式
<table-com border="false"></table-com>
<table-com border=false></table-com>

<div border="false">
    
</div>

// 用这种方式传，就会接收不到
```

非prop特性的替换/合并规则是：

+ 非class和style样式【例如 type=“date”】，会替换掉子组件内部的相同属性
+ class和style特性，会合并。比如子组件的根节点有 `class="form-control"`，父组件中再传一个 ` class="date-picker-theme-dark" `, 此时子组件的根元素有 `form-control`和 `date-picker-theme-dark`两个  `class`

### 禁用特性继承

不希望组件的根元素继承特性时，可以在组件的选项中设置： ` inheritAttrs : false`。同时 为false时，并不会影响 `class`和 `style`的绑定。

 ` inheritAttrs : false`适合和  `$attrs`属性一起使用。

beforeEach是路由实例的方法。回调函数包含 to, from， next 三个参数。有两种写法。

方法一：写在单独的permission.js文件中

```javascript
// 引入router实例
import router from "./router";
// 实例上定义方法
router.beforeEach((to, from , next) => {
  console.log("beforeEach")
  next()
})

// 在main.js中,执行permission
import "@/permission" 
```

方法二：写在router.js中

```javascript
// 定义路由实例
const router =  new Router({

})
router.beforeEach((to, from , next) => {
  console.log("beforeEach")
  next()
})
```

# 插槽

新的2.6.0的vue.js中，具名插槽和作用域插槽，都用`v-slot`指令。

## 插槽内容

子组件： 用 `slot`标签占位一个插槽。等待渲染来自父组件的内容。（可以类比路由出口router-view组件）

父组件：在自定义标签之间的内容，都会被渲染到子组件的slot标签处，如下：

```html
<COM>this is a text ...</COM>
```

父组件COM标签之间的内容，会被渲染到COM组件slot所占的位置。

## 编译作用域

父模板里的**所有**内容，都在父级作用域中编译；子模板里的**所有**内容都在子级作用域中编译。

## 后备内容

子组件的slot标签中，写的内容就是**后备内容**。当父组件，不在子组件标签中填写传入的插槽内容时，后备内容就会在slot标签处渲染。

## 具名插槽

子组件中有多个插槽时，利用slot标签的name属性。

```html
<slot name="header"></slot>
```

关于具名插槽的tips：

1. 当组件中需要多个插槽时,给slot标签加上name

2. 如果有多组slot标签，有一个没有name，那么，其实它的name是default

3. 父组件向子组件的多个插槽提供内容时，结合template标签，用v-slot:name的方式，指定内容要填充的插槽。

   ```html
   <base-layout>
       <template v-slot:header>
           <h1>
               我是插槽过来的内容！
           </h1>
       </template>
   </base-layout>
   ```

   

4. 任何没有包裹在template标签的内容，都会被填充到name为default的插槽中

### *作用域插槽（插槽对外传参）

子组件在插槽中直接通过 `:`的方式绑定变量，比如 `:year`。父组件中直接在插槽名字的后面接收，接收的形式时对象。看例子：

```javascript
// 子组件插槽，传值：
<slot name="three" :userName="loginUsr.name" :year="year">slot three 默认的内容</slot>
// userName和year都叫插槽prop
```

```html
// 父组件在往插槽写入内容时，接收：
<template v-slot:three="param">
      完整数据是{{param}}
</template>
// 完整数据是{ "userName": "chenke", "year": 2019 }
```

### *独占默认插槽的缩写语法

上面的例子是，提供的内容给具名插槽时。当 `只给`默认插槽提供内容时，可以使用缩写的方式。缩写主要体现在父组件中：

1. 子组件的标签`base-component`中直接使用属性`v-slot`
2. 使用`v-slot:default="param"`或者省掉`default`，直接`v-slot="param"`就完成了接收值

看例子：

```javascript
// 子组件默认插槽，传值:
<slot :age="loginUsr.age" city="wuhan">slot two 默认的内容</slot>
```

```html
// 父组件，往插槽中写入内容时，接收：
<base-component v-slot:default="param">
   默认插槽传给父组件的内容是{{param}}
</base-component>
// 默认插槽传给父组件的内容是{ "age": 30, "city": "wuhan" }
```

tips：

只要有多个插槽，父组件在给插槽传内容时，一定用完整的 `template`加 `v-slot:slotName="psramObj"`的语法

### *解构插槽Prop

对作用域插槽的传参赋值：

1， 和独占默认插槽一起使用：

```html
<base-component v-slot="{age, city}">
   默认插槽传给父组件的内容是{{age}}, {{city}}
</base-component>
//  默认插槽传给父组件的内容是30, wuhan
```

2，和具名插槽一起使用：

```html
<base-component>
    <template v-slot:three="{userName, year}">
    parm1: {{userName}}, param2: {{year}}
    </template>
</base-component>
// parm1: chenke, param2: 2019
```

## 动态插槽名

在父组件中，将动态指令参数绑定到 `v-slot`。看例子：

```html
<el-radio-group v-model="radio">
    <el-radio label="one">slot one</el-radio>
    <el-radio label="two">slot two</el-radio>
    <el-radio label="three">slot three</el-radio>
</el-radio-group>
<base-component>
    <template v-slot:[radio]="param">
        slot param is {{param}}
    </template>
</base-component>
```

## 具名插槽缩写

当 `v-slot`后面跟了名字时（比如  `v-slot:header`），可以用#代替 `v-slot`

比如，`v-slot:one="param"`缩写为 `#one="param"` `v-slot:[radio]="param"`缩写为 `#[radio]="param"`

```html
<base-component>
    <template #[radio]="param">
        slot param is {{param}}
    </template>
</base-component>
```

## 其他例子

插槽prop允许我们将**插槽转换为可复用的模板**，这些模板可基于输入的prop渲染出不同的内容。这在设计封装数据逻辑，同时允许**父级组件自定义子组件部分布局**的组件时，是最有用的。

珂珂解释下就是：

1. 子组件加了插槽prop后，这部分内容就是可复用模板了（此处可复用模板的意思是：没有复杂的处理逻辑，只有一对绑定了若干插槽prop的slot标签）
2. 父组件通过插槽，往插槽里插入不同内容，实现了对子组件布局的部分控制

代码例子：

```html
// 子组件
<ul>
    <li v-for="todo in filteredTodos" :key="todo.id">
    	<slot name="todo" :todo="todo">{{todo.text}}</slot>
    </li>
</ul>
```



```html
// 父组件
<todo-list :todos="todos">
	<template v-slot:todo="{todo}">
    	<span v-if="todo.isComplete">√</span>
        {{todo.text}}
    </template>
</todo-list>
```

以上的好处是，能在上游对下游布局做控制。**下游只用关心业务逻辑，不用处理数据的差异化显示了**。

## 废弃的 `slot`

在**父级组件**上，定义template标签，标签中定义slot属性，可以将内容从父级传给具名插槽

```html
<base-component>
    <template slot="three">
        slot param is sth
    </template>
</base-component>
```

简写的方式，直接将slot属性，写在标签上，如 ``<p slot="one">``：

```html
<base-component>
    <template slot="three">
        slot param is sth
    </template>
    <p slot="one">one 传的第一段内容</p>
    我也是传给默认插槽的内容
    <p>two 传的第二段内容</p>
</base-component>
```

默认插槽捕获所有未被匹配的内容

## 废弃的 `slot-scope`

`slot-scope`在elementUI的table组件中非常常用，经常出现在定义自定义列时。

1. `slot-scope`作为属性，写在template标签里，用来接收子组件通过插槽传出来的prop

   ```html
   <base-component>
       <template slot="three" slot-scope="param">
           slot param is {{param}}
       </template>    
   </base-component>
   ```

2. `slot-scope`也可直接用于非 `<template>`元素（包括组件）

   ```html
   <base-component>
       <h1 slot="three" slot-scope="param">
           slot param is {{param}}
       </h1>
   </base-component>
   // 此时 slot param is {{param}}会渲染成h1
   ```

`slot-scope`的参数也可用解构赋值进行参数取值

总结一下：

1. 在父组件中，`slot`用来**匹配插槽的name属性**， `slot-scope`用来**获取子组件插槽prop组成的的对象**
2. 这两个属性，就子组件没影响。在子组件中定义插槽时还是一对`slot`标签，插槽prop也还是在 `slot`标签中绑定属性。

# eventemitter2的使用

结合eventEmitter2从零开始创建一个事件监听工具。本文分享两种用法。

##  结合class模块化使用

准备：

1. 安装`eventEmitter2`，`npm install --save eventemitter2`

2. 添加模块 `event_confg.js`，用于创建`eventEmitter2`实例和事件名

   [^插件说明]: `eventemitter2`插件安装后，得到的是一个对象。这个对象有 `EventEmitter2`构造函数，它可以创建`eventemitter2`实例。

3. 添加模块 `event_manager.js`，用于给实例绑定和清空事件

### 创建 `event_config.js`文件：

```javascript
var EventEmitter2 = require('eventemitter2').EventEmitter2;
// 定义eventemitter2实例和事件名
const eventConfig = {}

eventConfig.emitter = new EventEmitter2()

eventConfig.config = {
  "CHECK_CHANGES": "checkChanges"
}
export default eventConfig
```

### 配置`event_manager.js`文件：

此模块输出的是一个类，它需要传入一个`eventemitter2`实例，然后在此基础上封装添加事件和移除事件的方法。

```javascript
export default class {
	constructor(evtInst){
        this.evtInst = evtInst
        this.listeners = {}
    }
    addListener(evtName, callback){
        this.evtInst.on(evtName, callback)
        if(!this.listeners[evtName]){
            this.listeners[evtName] = [callback]
        }else{
            this.listeners[evtName].push(callback)
        }
    }
    removeListeners(){
        Object.keys(this.listeners).forEach(evtName => {
            this.listeners[evtName].forEach((callback, index) => {
                this.evtInst.off(evtName,callback)
 				// index && this.evtInst.off(evtName, callback) 只移除第一个
            })
        })
    }
}
```

[^移除事件]: 移除监听removeListeners方法中，如果只移除eventName下的某个callback，则没没有移除的部分，还会继续触发。比如上面被注释掉的那段移除代码。

### 组件中使用`eventEmitter2`

**过程：绑定事件  =》 触发事件  =》 移除事件**

在需要做监听的组件绑定事件，如本例子中的switch：

```javascript
import EventManager from "@/utils/event_manager.js"
import eventConfig from "@/utils/event_config.js"
...
// 初始化event_manager实例
this.evtManagerInst = new EventManager(eventConfig.emitter)
// 用实例的addListener方法绑定事件
this.evtManagerInst.addListener(eventConfig.config.CHECK_CHANGES, obj => {
    this.value = Object.is(NaN,parseInt(obj.value))
})
this.evtManagerInst.addListener(eventConfig.config.CHECK_CHANGES, obj => {
    console.log("第二个事件也触发了！",obj)
})
```

[^绑定事件的补充]: 同一个事件名，可以绑定多次，绑定不同的事件处理函数。事件的回调会顺序执行。

在需要触发事件的组件中，触发事件：

```javascript
// 传给接收事件组件的参数
let obj = {value: val, type: "", msg: ""}
// 触发事件
eventConfig.emitter.emit(eventConfig.config.CHECK_CHANGES, obj)
// 事件触发后的处理
this.$message({type: obj.type, message: obj.msg})
```

在绑定事件的组件中移除事件：

```javascript
// beforeRouteLeave或者beforeDetory都行
  beforeRouteLeave(to, from, next){
    this.evtManagerInst.removeListeners()
    next()
  }
// 用beforeRouteLeave方法时，要调用next方法，执行下一步

// 或者
beforeDestroy(){
    this.evtManagerInst.removeListeners()
}
```

[^注意]: 用 `eventemitter2`时注意，一定要在`beforeDestroy`或者 `beforeRouteLeave（记得调用next方法）`时，移除监听，否则，监听会一直累加。

## 结合Vue的插件开发

Vue的插件用来为Vue添加全局的功能。如全局方法、属性、指令、全局混入、实例方法等。

+ 使用install创建插件
+ 使用全局的Vue.use方法，使用插件

下面看具体的实现：

### 创建 `emitter.js`插件

创建一个插件，插件用来添加全局的属性 `$emit_inst`和 `$emit_name`。他们分别存储的是`eventemitter2事件实例`和`eventemitter2事件名`。

```javascript
var EventEmitter2 = require('eventemitter2').EventEmitter2;

// 事件名，实例
const emitter = {}

// 创建实例，定义事件名
emitter.install = function(Vue){
  Vue.prototype.$emit_inst = new EventEmitter2()
  Vue.prototype.$emit_name = {
    "CHECK_TYPE_TWO": "checkTypeTwo",
    "ANOTHER_EVENT": "anotherEvt" // 注册的第二个事件
  }
}
export default emitter
```

### 使用 `emitter.js`插件

在main.js中, new Vue()之前：

```javascript
import emitter from "./emitter"
Vue.use(emitter)
```

仍然可以写一个相同的event.manager.js来封装绑定事件和移除事件的方法。但是用了这个文件后，事件的绑定和移除都得用这个。下面讨论下，不用event.manager.js，直接绑定和移除事件的方法。

### 组件中使用`eventEmitter2`

**过程：绑定事件  =》 触发事件  =》 移除事件**

在需要做监听的组件绑定事件

```javascript
this.$emit_inst.on(this.$emit_name.CHECK_TYPE_TWO, obj => {
    this.value1 = Object.is(NaN,parseInt(obj.value))
    obj.type = this.value1 ? "success" : "warning"
    obj.msg = this.value1 ? "字符" : "数字"
    console.log("CHECK_TYPE_TWO第一次触发")
})
this.$emit_inst.on(this.$emit_name.CHECK_TYPE_TWO, obj => {
    console.log("CHECK_TYPE_TWO第二次触发")
})
```

在需要触发事件的组件中，触发事件：

```javascript
// 传给接收事件组件的参数，一般都是传对象
let obj = {value: val, type: "", msg: ""}
// 触发事件
this.$emit_inst.emit(this.$emit_name.CHECK_TYPE_TWO, obj)
// 事件触发后的处理
this.$message({type: obj.type, message: obj.msg})
```

[^触发事件说明]: 这里用的是eventemitter2实例上的emit方法，传事件名和给事件回调的参数

在绑定事件的组件中移除事件：

```javascript
// beforeRouteLeave或者beforeDetory都行
  beforeRouteLeave(to, from, next){
    this.$emit_inst.removeAllListeners(this.$emit_name.CHECK_TYPE_TWO)
    next()
  }
// 用beforeRouteLeave方法时，要调用next方法，执行下一步

// 或者
beforeDestroy(){
    this.$emit_inst.removeAllListeners(this.$emit_name.CHECK_TYPE_TWO)
}
```

[^注意]: 直接在eventemitter2实例上移除绑定事件时，用removeAllListeners更方便，因为，这个方法只用传事件名eventName而不用传eventName上绑定的事件

# 前端权限问题：

## 接口权限

接口没通过token的话返回的是401（这里拓展一下，400的意思是，当前传给后台的参数和后台接的参数不匹配。）。

登录完成后，会将token存到cookie中，每次请求时，都将token发出去。token拦截用axios.interceptors.request.use来实现。具体看看axios文档如何实现。

## 按钮权限

和后台约定权限码，根据后端返回的按钮权限列表，控制页面按钮。更好的是使用自定义的权限指令，如 `v-auth`，控制按钮的显示和操作权限。

自定义指令这一块，自己下去写小例子。

## 菜单权限

从后端获取菜单权限列表，动态生成菜单。方法有两种：

1. 从后台获取路由表，用它和本地路由表拼接，生成要渲染出的完整路由

2. 在本地写上全部路由表，从后台获取有访问权限的路由表，用它和路由表里的meta选项做对比，拼接出导航栏能渲染出的全部路由。

   ```javascript
   {
       name: "xxx",
       path: "xxx",
       meta: {
           role: [xxx, xxx, xxx], // 有资格的角色列表
           MenuIcon: "xxx"， // 菜单图标
           MenuTitle: "xxx" //菜单名
       }
   }
   ```

   

3. 对于想直接通过输入地址访问的路由，可以给路由实例加上beforeEach全局守卫，然后判断当前role是否在meta的role里。如果不在，用next函数做处理。


# 计算属性和侦听器

对于任何的复杂逻辑，都应该用计算属性。

## computed

```javascript
computed: {
    reversedMsg: function(){
        return this.message.split("").reverse().join("")
    }
}
```

以上匿名函数是 this.reversedMsg属性的`getter`函数

this.reversedMsg依赖于this.message。当this.message改变时，this.reversedMsg也会同时改变。

## computed和methods方法

```html
<p>Reversed message: "{{ reversedMessage() }}"</p>
```

可以用定义函数的方法实现同样的效果。但是相比较computed，有以下缺点：

1. 计算属性是基于他们的响应式依赖进行缓存的。
2. 相关响应式依赖发生改变时，才会重新对计算属性重新求值
3. 只要message不变，多次访问reverMsg，会立即返回之前的计算结果，而不必再次执行函数
4. 而每当触发重新渲染时，总会再次执行函数

## computed和watch

相同：都是有些数据需要随着其他数据变动而变动时使用。

computed中的属性，适合依赖是多个，有**单一返回值**的情况。

watch适合，依赖是单个，在依赖变化时，要执行methods的方法，或者改变data中变量值的情况。

## computed的setter

默认只有getter，提供setter后，在当前组件中，改变了computed的值时，就会触发setter。看例子。

```javascript
computed: {
    optionList: {
      get: function() {
        console.log("运行computed的get");
        if (!this.value) {
          return [];
        }
        return this.value.split(",");
      },
      set: function(value){
        console.log("运行computed的set");
        this.$emit("input", value.join("-")) // 触发父组件，对value做更新
      }
    }
  },
  props: {
    value: { type: String, required: true }
  },
  methods: {
   	handleClick() {
      console.log("手动修改了计算属性的值");
      this.optionList = this.getRandomList();
    },
    getRandomList() {
      let num = parseInt(Math.random() * 10000);
      let arr = String(num).split("");
      return Array.from(new Set(arr));
    }
  }
```

只有getter，直接修改computed属性会报错。有了setter之后，就不会。

setter相当于给用户提供了一个修改computed属性的机会，并且，setter里面的逻辑可看成是修改之后的回调。并且，如果set时候，改变了get依赖的属性，get会再执行一次。执行的顺序就是： 手动修改computed属性  => 触发set函数 =>父组件修改 => 触发get函数

比如执行了handleClick之后，会依次打印：

```html
手动修改了计算属性的值
运行computed的set
父组件中，改变value
运行computed的get
```

总结：

当computed属性visible定义了set和get方法时，如下：

```javascript
visible: {
      get() {
        return this.value === this.fieldName;
      },
      // set只对手动时生效
      set(value) {
        this.$emit("input", value ? this.fieldName : "");
      }
    }
```

set和get的触发条件是：

1. set方法只在手动改变visible时触发
2. get方法只在visible依赖的值改变时触发（本例是fieldName和value）
3. 看起来set触发有时会引起get触发。实际原因是set时，函数体中用$emit触发了父组件对visible依赖的值的更新
4. 有的时候，set看起来不是手动的，可能是组件中隐含了visible的手动更新，从而触发了set方法。注意关注 `v-model`里的内容，因为v-model隐含了`input`等更新事件。**【因为这个原因，在用到set和get的组件，组件内部不要用v-model，用:value代替，如element-ui的popover组件】**

## 侦听器

使用场景：当需要在数据变化时，执行异步或者开销较大的操作时，用侦听器最合适。

# Vue响应式

## 如何追踪变化

Vue将会遍历data选项中对象的所有属性，并使用Object.defineProperty把属性全部转化为getter和setter。

组件实例对应一个watcher实例。它会在组件渲染过程中，把“接触”过的数据属性记录为依赖。依赖的setter触发时，会更新watcher，从而重新渲染组件。





## 检测变化的注意事项

无法检测到对象属性的添加或删除。

为已有对象添加单个属性： `this.$set(this.someObject, "b", 2)`

为已有对象添加多个属性：`Object.assign({}, this.someObject, {a:1, b:2})`

无法检测到数组变更的两种操作：

1. 利用索引设置数组像
2. 直接修改数组长度 

会触发视图更新的几种数组方法：

`push()  pop()  shift()  unshift()  splice()  sort()  reverse()`

解决问题一：

1. 用this.$set  `this.$set(this.items, indexOfItem, newValue)`
2. splice方法  `this.items.splice(this.items, indexOfItem, newValue)`

解决问题二：

`this.item.splice(newLength)`

## 声明响应式属性

 Vue 不允许动态添加根级响应式属性，所以你必须在初始化实例前声明所有根级响应式属性，哪怕只是一个空值

## 异步更新队列

Vue 在更新 DOM 时是异步执行的。

`this.$nextTick( )`

# 响应式系统

三个问题：

1、Vue 是怎么知道数据改变的？

​	属性的数据改变时，会触发此属性的set的方法

2、Vue 在数据改变时，怎么知道通知哪些视图更新？

​	 通知那些存在 依赖收集器（subs）中的 视图 （Watcher）

3、Vue 在数据改变时，视图怎么知道什么时候更新？

​	当对象的属性变化时，会触发set函数，然后会通知视图，视图开始更新。

​	Object

## Object.defineProperty

给对象的属性加get和set方法。分别在获取对象和给对象赋值时候使用。

## 依赖收集

data中对象的每个属性（比如a）都有一个数组subs，存储依赖当前组件的Watcher

当页面使用了属性a（属性a的get被触发），页面的watcher就会被存放到subs中

## 依赖更新

依赖更新，就是，通知所有的依赖进行更新



