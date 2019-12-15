# observer.js

```javascript

// tip : Observe是构造函数，有walk和defineReactive方法
function Observe(data) {
  this.data = data;
  this.walk(data);
}
Observe.prototype = {
  // tip : 给data对象的每个属性执行一次defineReactive方法
  walk: function (data) {
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
    });
  },
  // tip : 给data的每个属性添加get和set属性，并且在get时进行 dep.addSub(watcher) 添加订阅者，在set时，进行dep.notify()，通知订阅者进行更新
  defineReactive: function (data, key, val) {
    console.log(key);
    observers(val); //递归所有子属性
    var dep = new Dep();

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function () {
        if (Dep.target) {
          dep.addSub(Dep.target); //在这里添加一个订阅者
        }
        return val;
      },
      set: function (newVal) {
        if (val === newVal) {
          return;
        }
        val = newVal;
        dep.notify(); //如果数据变化，通知所有订阅者
      }
    })
    console.log(dep);
  }
}

function observers(data) {
  if (!data || typeof data != 'object') {
    return;
  }
  return new Observe(data);
}


/**Dep:创建一个可以容纳订阅者的消息订阅器
 * **/
// Dep加一个target属性
function Dep() {
  this.subs = [];
  this.target = null;
}
Dep.prototype = {
  addSub: function (sub) { //添加订阅者
    this.subs.push(sub);
  },
  notify: function () { //通知订阅者
    this.subs.forEach(function (sub) {
      sub.update();
    })
  }
}


```

# watcher.js

```javascript
/* 
订阅者Watcher

Watcher在初始化的时候要将自己添加进订阅者Dep中，如何做到：
已经知道监听器Observer是在get函数执行了添加订阅者Wather的操作的，

所以我们只要在订阅者Watcher初始化的时候触发对应的get函数，去执行添加订阅者操作即可，

那要如何触发get的函数:

只要获取对应的属性值就可以触发了，核心原因就是因为我们使用了Object.defineProperty()进行数据监听。

注意：

我们只要在订阅者Watcher初始化的时候才需要添加订阅者，所以需要做一个判断操作，

因此可以在订阅器上做一下手脚：在Dep.target上缓存下订阅者，添加成功后再将其去掉就可以了。
*/
// tip : 在【观察者模式.html】中说过 “订阅者：只是一个函数”，函数在这里是cb。Watcher两大重要部分，一是初始化，二是更新。初始化重要的是target的理解。更新就是执行方法cb。Watcher有三个传参，可以理解下：根据vm（this）和exp（属性），指定要进行cb操作的属性。
function Watcher(vm, exp, cb) {  
  this.vm = vm;
  this.exp = exp;
  this.cb = cb;
  this.value = this.get(); //将自己添加到订阅器的操作
}
Watcher.prototype = {
  // tip : 当前订阅者进行更新
  update: function () {
    this.run();
  },
  // tip : 旧值新值不等的时候，更新watcher里的value，并执行回调函数cb
  run: function () {
    var value = this.vm.data[this.exp];
    var oldVal = this.value;
    if (value != oldVal) {
      this.value = value;
      this.cb.call(this.vm, value, oldVal);
    }
  },
  get: function () {
    Dep.target = this; //缓存自己
    var value = this.vm.data[this.exp]; //强制执行监听器observer里的Object.defineProperty()里的get函数
    Dep.target = null; //释放自己
    return value;
  }
}
```

# compile.js

```javascript
/* 
可以先建一个fragment片段，将需要解析的DOM节点存入fragment片段里再进行处理
*/
// tip : elm->{el:;data:;vm:}, el->"#name", data -> {name: } vm -> 父组件的this对象
function Compile(elm) {
  // tip : this.vm  就是vue实例
  this.vm = elm; 
  this.el = document.querySelector(elm.el);
  this.fragment = null;
  this.init();
}
// tip : 里面的this都是Compile实例
// process: 创建代码片段  =》处理元素之间的 {{}}指令  =》将处理后的结果绑定到元素上
Compile.prototype = {
  init() {
    if (this.el) {
      //将需要解析的DOM节点存入fragment片段里再进行处理
      // tip : this.fragment存的是需要解析的h1标签中的内容
      this.fragment = this.nodeToFragment(this.el);
      //接下来遍历各个节点，对含有指定的节点特殊处理，先处理指令“{{}}”:
      this.compileElement(this.fragment);
      // tip : compileElement方法处理后，this.fragment被改变了，存的是解析后的内容，即花括号{{}}内容替换为具体数值的内容
      //绑定到el上
      // tip : 把 最终计算的值，挂载到el节点上
      this.el.appendChild(this.fragment);
    } else {
      console.log('DOM元素不存在');
    }
  },
  //创建文档片段
  nodeToFragment(el) {
    // tip : fragment是一个指向 DocumentFragment（文档片段）对象的引用
    // tip : 文档片段的使用场景是： 创建文档片段 =》元素附加到文档片段 =》文档片段附加到DOM树   这样使用是为了更好的性能
    // tip : 珂珂的理解，文档片段相当于一个暂存的容器
    var fragment = document.createDocumentFragment();
    var child = el.firstChild;
    while (child) {//将DOM元素移入fragment
      fragment.appendChild(child);
      child = el.firstChild;
    }
    return fragment;/*  */
  },
  //对所有子节点进行判断，1.初始化视图数据,2.绑定更新函数的订阅器
  compileElement (el) {
    var childNodes = el.childNodes;
    // tip : childNodes是类数组, 将类数组转化成真正的数组
    [...childNodes].forEach((node) => {
      // tip : .*  任意一个字符，任意多次
      var reg = /\{\{(.*)\}\}/;//匹配" {{}} "
      var text = node.textContent;
      // tip : 
      if (this.isTextNode(node) && reg.test(text)) {//判断" {{}} "
        let dataPro = reg.exec(text)[1]
        // tip : node 是花括号内容 {{name}}, {{yourName}},compileText就是处理花括号内容
        this.compileText(node, dataPro);
      }
      if (node.childNodes && node.childNodes.length) {
        console.log(node);
        this.compileElement(node);//// 继续递归遍历子节点
      }
    });
  },
  //初始化视图updateText和生成订阅器:
  // tip : node是需要替换的双花括号，exp是变量名，
  compileText(node, exp) {
    // tip : 开始的时候 node => "初始化的name" exp => "name"
    // tip : initText 是exp(即name属性)初始时候的值
    // tip : 实际是this.vm.data[exp],因为写了proxy方法，可以直接用this.vm[exp]替代
    var initText = this.vm[exp];   //代理访问self_vue.data.name1 -> self_vue.name1
    this.updateText(node, initText);//将初始化的数据初始化到视图中
    // tip : 初始化完成后，将 exp属性和它的回调cb，加入到订阅者中
    new Watcher(this.vm, exp, (value) => {//{}，name, // 生成订阅器并绑定更新函数
      this.updateText(node, value);
    })
  },
  updateText(node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value;
  },
  isTextNode(node) {
    return node.nodeType == 3;//文本节点
  }
};
```

# selfvue.js

```javascript
/**
 * SelfVue将observer.js和watcher.js联系起来
 * @param {Object} options Vue框架初始化时的选项
 */
function SelfVue(options) {
  this.data = options.data;
  this.el = options.el;
  this.vm = this;

  Object.keys(this.data).forEach((key) => {
    this.proxyKeys(key);//绑定代理属性
  });
  // tip : 给data对象的属性，全部包上set和get方法（此时并没有执行）
  observers(this.data);
  // tip : 初始化视图和生成订阅器
  // tip : 创建Compile实例的时候，代码 var value = this.vm.data[this.exp]; 触发了this.exp属性的get方法，此时Dep.target不是null， addSub 方法执行
  new Compile(this)
  return this;
}

// tip : 绑定代理属性的意思是, 给SelfVue的实例对象（也就是this）的属性key添加get和set方法修饰。访问this[key]时，实际返回的是this.data[key];写入this[key]时，实际写入的是this.data[key]
SelfVue.prototype = {
  proxyKeys(key) {
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get() {
        return this.data[key];
      },
      set(newVal) {
        this.data[key] = newVal;
      }
    })
  }
}

```

# 使用的例子：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>双向绑定的例子</title>
</head>
<body>
  <h1 id="name">
    <span>我的名字是: </span>
    {{name}}
    <br/>
    <span>你的名字是：</span>
    {{yourName}}
  </h1>
  <script src="../监听器Observer和订阅者Watcher功能/observer.js"></script>
  <script src="../监听器Observer和订阅者Watcher功能/watcher.js"></script>
  <script src="../指令解析器compile/大括号双向数据绑定.js"></script>
  <script src="../selfVue/selfVue添加了花括号绑定.js"></script>
  <script>
    // tip : 构造函数SelfVue传一个对象。对象包含两个元素：需要初始化的data和根目录的id
    let self_vue = new SelfVue({
      data: {name: "小可爱", yourName: "小宝宝"},
      el: "#name"
    })

    setTimeout(() => {
      // tip : 修改后的代码
      self_vue.name = "小喵喵"
      self_vue.yourName = "小波波"
    }, 3000);
  </script>
</body>
</html>
```

