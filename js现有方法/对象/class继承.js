// 子类的属性和方法中必须有super关键字
class Point {
  constructor(x,y){
    this.x = x
    this.y = y
  }
  toString(){
    return `(${this.x},${this.y})`
  }
  /* 静态方法 */
  static hello(){
    console.log("hello world!")
  }
}

// 子类实例的构建，基于父类实例
// super 方法调用父类的实例。使用了super后，才能用this
class ColorPoint extends Point {
  constructor(x,y,color) {
    super(x,y) // super作为方法，用在子类的构造,必须在this之前先调用
    this.color = color
  }
  toString(){
    //  super作为对象（对象调用方法），指向的是父类的原型对象即Point.prototype
    console.log(Point.prototype.toString === super.toString) // true
    return `color: ${this.color}, ${super.toString()}`     
  }
}

let cp = new ColorPoint(25,8, "green")
//cp instanceof Point  // true
//cp instanceof ColorPoint  // true
// ColorPoint继承Point，也会继承Point的静态方法
//ColorPoint.hello() // hello方法
console.log(cp.toString())

/* 
Object.getPrototypeOf() 方法用来用子类获取父类
*/

/* 
super方法可作为方法也可作为对象
方法：子类的构造函数中，先执行super，调用父类的构造函数，再使用this，给子类加子类属性
对象：在普通方法中，指向的是父类的原型对象；在静态方法中，指向的是父类
注意： super作为对象时指向父类的原型对象，因此只能访问原型对象上的方法和属性，而不能使用实例的方法和属性（constructor中的内容）

在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的子类实例
在子类中进行赋值和super属性调用时，表现形式不同。赋值时，super就是子类的this，调用时，是父类的原型对象

如果super作为对象，super在静态方法之中指向父类，在普通方法之中指向父类的原型对象。。

子类的静态方法中通过super调用父类的方法时，方法内部的this指向当前的子类，而不是子类的实例。

对象总是继承其他对象的，所以可以在任意一个对象中，使用super关键字
*/

/* 
类的prototype和__prototype__
子类的__proto__属性，表示构造函数的继承，指向的是父类
子类的prototype属性的__proto__属性，表示方法得继承，总是指向父类的prototype属性
*/

/* 
两条继承链如何理解：
作为一个对象，子类（B）的原型（__proto__属性）是父类（A）；作为一个构造函数，子类（B）的原型对象（prototype属性）是父类的原型对象（prototype属性）的实例

函数都有prototype属性，除了Function.prototype函数
*/

/* 
子类实例的__proto__属性的__proto__属性属性，指向父类实例的__proto__属性。子类原型的原型是父类的原型。
*/
let p1 = new Point(2,3)
let p2 = new ColorPoint(2,3,"red")
console.log(p2.__proto__ === p1.__proto__) // false
console.log(p2.__proto__.__proto__ === p1.__proto__) // true

/* 
原生构造函数的继承：  
原生构造函数 Boolean()，Number, Strng(), Array(), Date(), Function(), Regexp(), Error(), Object()

ES5是先新建子类的实例对象this，再将父类的属性添加到子类上。由于父类的内部属性无法获取，导致无法继承原生的构造函数。

ES6 是先新建父类的实例对象this，然后再用子类的构造函数修饰this，使得父类的所有行为都可以继承。

extends关键字不仅可以用来继承类，还可以用来继承原生的构造函数。因此可以在原生数据结构的基础上，定义自己的数据结构。
*/

class ExtendableError extends Error{
  constructor(message){
    super();
    this.message = message
    this.stack = (new Error()).stack
    this.name = this.constructor.name
  }
}

class MyError extends ExtendableError{
  constructor(m){
    super(m)
  }
}

var myerror = new MyError("11");

/* 
一旦发现Object方法不是通过new Object()这种形式调用，ES6 规定Object构造函数会忽略参数。

class NewObj extends Object{
  constructor(){
    super(..argument) // 通过super方法调用Object，super中的参数被忽略
  }
}
var o = new NewObj({attr: true})
o.attr === true  // false 应该是undefined
*/

/* 
Mixin模式的实现
将多个对象合成为一个类，代码功能待实现
*/