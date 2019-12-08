
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
    observers(val); //递归所有子属性
    var dep = new Dep();

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function () {
        if (Dep.target) {
          dep.addSub(Dep.target); //在这里添加一个订阅者
        }
        console.log('属性' + key + '执行get');
        return val;
      },
      set: function (newVal) {
        if (val === newVal) {
          return;
        }
        val = newVal;
        dep.notify(); //如果数据变化，通知所有订阅者
        console.log('属性：' + key + '以及被监听，现在值为：' + newVal.toString());
      }
    })
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

