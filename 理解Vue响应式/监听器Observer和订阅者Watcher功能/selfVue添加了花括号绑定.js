function SelfVue(options) {
  console.log(options)
  this.data = options.data;
  this.el = options.el;
  this.vm = this;

  Object.keys(this.data).forEach((key) => {
    this.proxyKeys(key);//绑定代理属性
  });
  observers(this.data);
  // tip : 初始化视图和生成订阅器
  console.log(this)
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
