function Compile(elm) {// 
  this.vm = elm;
  this.el = document.querySelector(elm.el);
  this.fragment = null;
  this.init();
}
Compile.prototype = {
  init () {
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
  nodeToFragment (el) {
    var fragment = document.createDocumentFragment();
    var child = el.firstChild;
    while (child) {//将DOM元素移入fragment
      fragment.appendChild(child);
      child = el.firstChild;
    }
    return fragment;
  },
  //对所有子节点进行判断，1.初始化视图数据,2.绑定更新函数的订阅器
  compileElement (el) {
    var childNodes = el.childNodes;
    // tip : slice将类数组转化为数组
    [...childNodes].forEach( (node) => {
      var reg = /\{\{(.*)\}\}/;//匹配" {{}} "
      var text = node.textContent;
      /*      补充判断：     */
      if (this.isElementNode(node)) {//元素节点判断
        this.compile(node);
      } else if (this.isTextNode(node) && reg.test(text)) {//文本节点判断 ，判断" {{}} "
        this.compileText(node, reg.exec(text)[1]);
      }

      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node);//// 继续递归遍历子节点
      }
    });
  },
  //初始化视图updateText和生成订阅器:
  compileText (node, exp) {
    var initText = this.vm[exp];   //代理访问self_vue.data.name1 -> self_vue.name1
    this.updateText(node, initText);//将初始化的数据初始化到视图中
    new Watcher(this.vm, exp, (value) => {//{}，name, // 绑生成订阅器并定更新函数
      this.updateText(node, value);
    })
  },
  updateText (node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value;
  },
  compile (node) {
    var nodeAttrs = node.attributes;
    Array.prototype.forEach.call(nodeAttrs, (attr) => {
      var attrName = attr.name;
      if (this.isDirective(attrName)) {//查到" v- "
        var exp = attr.value;
        var dir = attrName.substring(2);//" v-on/v-model "
        if (this.isEventDirective(dir)) { // 事件指令
          this.compileEvent(node, this.vm, exp, dir);
        } else {
          // tip : dir是model ； exp是title
          this.compileModel(node, this.vm, exp);
        }
        node.removeAttribute(attrName);
      }
    })
  },
  // tip : 解析出v-on后面绑定的事件名eventType和自定义事件的事件名cb，给节点node绑定eventType事件，事件的回调用方法cb
  compileEvent(node, vm, exp, dir) {//代码片段<><>，{data:;vm:;el:;},v-on="add",on:
    // tip : on:click => eventType = click  
    var eventType = dir.split(':')[1];
    var cb = vm.methods && vm.methods[exp];
    // tip : 在node上添加事件evetType，事件的回调是cb的拷贝函数，拷贝函数里的this是当前的Vue实例对象vm
    if (eventType && cb) {
      node.addEventListener(eventType, cb.bind(vm));
    }
  },
  // tip : 两个操作：1，将v-model元素的value更新为this[exp]，并将exp初始化未watcher，每次exp的值改变，更新v-model元素的value    2，给v-model的元素绑定input事件，每次输入框内容改变的时候，同步更新 this[exp]。由于第1步中，this[exp]已经初始化未watcher，所以会触发observer.js中set函数，this[exp]对应的watcher的回调函数modelUpdater将会执行
  compileModel (node, vm, exp) {//代码片段<><>，{data:;vm:;el:;},v-on="addCounts",model:
    var val = this.vm[exp];
    this.modelUpdater(node, val);
    new Watcher(this.vm, exp, (value) => {
      console.log("watcher触发了~~")
      this.modelUpdater(node, value);
    });

    node.addEventListener('input', (e) => {
      var newValue = e.target.value;
      if (val === newValue) {
        return;
      }
      console.log("我在input~~")
      this.vm[exp] = newValue;
      console.log("input修改完毕~~")
      val = newValue;
    })
  },
  modelUpdater(node, value) {
    console.log("node.value 改了~~")
    node.value = typeof value == 'undefined' ? '' : value;
  },
  isTextNode(node) {
    return node.nodeType == 3;//文本节点
  },
  isElementNode(node) {
    return node.nodeType == 1;//元素节点<p></p>
  },
  isDirective(attr) {//查找自定义属性为：v- 的属性
    return attr.indexOf('v-') == 0;
  },
  isEventDirective(dir) { // 事件指令
    return dir.indexOf('on:') === 0
  }
};