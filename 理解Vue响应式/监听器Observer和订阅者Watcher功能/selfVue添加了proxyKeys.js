function SelfVue(data,el,exp){
  let self = this
  this.data = data;

  Object.keys(data).forEach((key) => {
    console.log(this);
      this.proxyKeys(key);//绑定代理属性
  });
  
  observers(data);
  el.innerHTML = this.data[exp];//初始化模板数据的值
  new Watcher(this,exp,function(value){
      el.innerHTML = value;
  });
  return this;
}

// tip : 绑定代理属性的意思是, 给SelfVue的实例对象（也就是this）的属性key添加get和set方法修饰。访问this[key]时，实际返回的是this.data[key];写入this[key]时，实际写入的是this.data[key]
SelfVue.prototype = {
  proxyKeys(key){
      Object.defineProperty(this,key,{
          enumerable:false,
          configurable:true,
          get(){
              return this.data[key];
          },
          set(newVal){
            this.data[key] = newVal;
          }
      })
  }
}

//这下我们就可以直接通过self_Vue.name = '重新赋值了'的形式来进行改变模板数据。