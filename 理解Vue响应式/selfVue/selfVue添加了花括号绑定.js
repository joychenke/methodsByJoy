/**
 * SelfVue将observer.js和watcher.js联系起来
 * @param {Object} options Vue框架初始化时的选项
 */
function SelfVue(options) {
  console.log(options)
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
