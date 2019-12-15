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