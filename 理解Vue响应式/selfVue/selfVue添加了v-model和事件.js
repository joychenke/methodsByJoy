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