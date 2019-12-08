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