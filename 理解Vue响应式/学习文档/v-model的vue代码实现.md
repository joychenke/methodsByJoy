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
function Compile(elm) {// 
  this.vm = elm;
  this.el = document.querySelector(elm.el);
  this.fragment = null;
  this.init();
}
Compile.prototype = {
  init: function () {
    if (this.el) {
      //将需要解析的DOM节点存入fragment片段里再进行处理
      this.fragment = this.nodeToFragment(this.el);

      //接下来遍历各个节点，对含有指定的节点特殊处理，先处理指令“{{}}”:
      this.compileElement(this.fragment);

      //绑定到el上
      this.el.appendChild(this.fragment);
    } else {
      console.log('DOM元素不存在');
    }
  },
  //创建代码片段
  nodeToFragment: function (el) {
    var fragment = document.createDocumentFragment();
    var child = el.firstChild;
    while (child) {//将DOM元素移入fragment
      fragment.appendChild(child);
      child = el.firstChild;
    }
    return fragment;
  },
  //对所有子节点进行判断，1.初始化视图数据,2.绑定更新函数的订阅器
  compileElement: function (el) {
    var childNodes = el.childNodes;
    var self = this;
    [].slice.call(childNodes).forEach(function (node) {
      var reg = /\{\{(.*)\}\}/;//匹配" {{}} "
      var text = node.textContent;
      /*      补充判断：     */
      if (self.isElementNode(node)) {//元素节点判断
        self.compile(node);
      } else if (self.isTextNode(node) && reg.test(text)) {//文本节点判断 ，判断" {{}} "
        self.compileText(node, reg.exec(text)[1]);
      }

      if (node.childNodes && node.childNodes.length) {
        self.compileElement(node);//// 继续递归遍历子节点
      }
    });
  },
  //初始化视图updateText和生成订阅器:
  compileText: function (node, exp) {
    var self = this;
    var initText = this.vm[exp];   //代理访问self_vue.data.name1 -> self_vue.name1
    this.updateText(node, initText);//将初始化的数据初始化到视图中
    new Watcher(this.vm, exp, function (value) {//{}，name, // 生成订阅器并绑定更新函数
      self.updateText(node, value);
    })
  },
  updateText: function (node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value;
  },
  compile: function (node) {
    var nodeAttrs = node.attributes;
    var self = this;
    Array.prototype.forEach.call(nodeAttrs, function (attr) {
      var attrName = attr.name;
      if (self.isDirective(attrName)) {//查到" v- "
        var exp = attr.value;
        var dir = attrName.substring(2);//" v-on/v-model "

        if (self.isEventDirective(dir)) { // 事件指令
          self.compileEvent(node, self.vm, exp, dir);
        } else {
          self.compileModel(node, self.vm, exp, dir);
        }
        node.removeAttribute(attrName);
      }
    })
  },
  compileEvent: function (node, vm, exp, dir) {//代码片段<><>，{data:;vm:;el:;},v-on="add",on:
    var eventType = dir.split(':')[1];//on
    var cb = vm.methods && vm.methods[exp];

    if (eventType && cb) {
      node.addEventListener(eventType, cb.bind(vm), false);
    }
  },
  compileModel: function (node, vm, exp, dir) {//代码片段<><>，{data:;vm:;el:;},v-on="addCounts",model:
    var self = this;
    var val = this.vm[exp];
    this.modelUpdater(node, val);
    new Watcher(this.vm, exp, function (value) {
      self.modelUpdater(node, value);
    });

    node.addEventListener('input', function (e) {
      var newValue = e.target.value;
      if (val === newValue) {
        return;
      }
      self.vm[exp] = newValue;
      val = newValue;
    })
  },
  modelUpdater: function (node, value) {
    node.value = typeof value == 'undefined' ? '' : value;
  },
  isTextNode: function (node) {
    return node.nodeType == 3;//文本节点
  },
  isElementNode: function (node) {
    return node.nodeType == 1;//元素节点<p></p>
  },
  isDirective: function (attr) {//查找自定义属性为：v- 的属性
    return attr.indexOf('v-') == 0;
  },
  isEventDirective: function (dir) { // 事件指令
    return dir.indexOf('on:') === 0
  }
};
```

# selfVue.js

```javascript
function SelfVue(options) {
  var self = this;
  this.data = options.data;
  this.el = options.el;
  this.methods = options.methods;

  this.vm = this; //second

  Object.keys(this.data).forEach(function (key) {
    self.proxyKeys(key);//绑定代理属性
  });

  //监听数据：
  observers(this.data);

  //初始化视图updateText和生成订阅器
  new Compile(this);
  options.mounted.call(this);

  return this;
}

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
	<title>绑定v-model和事件的实例</title>
</head>

<body>
	<div id="app">
		<h2>{{name1}}</h2>
		<h2>{{name2}}</h2>
		<input type="text" v-model="title">
		<h3>{{title}}</h3>
		<button v-on:click="clickMe">v-on事件</button>
		<h3>{{event}}</h3>
	</div>
	<script src="../监听器Observer和订阅者Watcher功能/observer.js"></script>
	<script src="../监听器Observer和订阅者Watcher功能/watcher.js"></script>
	<script src="../指令解析器compile/v-model和事件指令.js"></script>
	<script src="../selfVue/selfVue添加了v-model和事件.js"></script>
	<script>
		var self_vue = new SelfVue({
			el: "#app",
			data: {
				name1: '我是name1',
				name2: '我是name2',
				event: 'event',
				title: 'title初始值'
			},
			methods: {
				clickMe: function () {
          this.event = '事件重新赋值'
          this.name2 = "我刚刚点击了event按钮"
				}
			},
			mounted: function () {
				this.name1 = "name1 在mounted之后的值"
			}
		});
	</script>
</body>

</html>

```

