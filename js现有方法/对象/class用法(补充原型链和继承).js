// 实例的属性除非this定义的，否则都在class上
class Point{
  constructor(x,y){
    this.x = x
    this.y = y
  }
  toString(){
    return `(${this.x},${this.y})`
  }
}
let point = new Point(3,4)
point.toString()
//point 有x和y属性，但是没有toString方法，toString方法是point的原型的方法，定义在point.__proto__上
point.hasOwnProperty("x")  // true
point.hasOwnProperty("toString")  // false
point.__proto__.hasOwnProperty("toString") // true

// 取值函数 getter和 存值函数 setter
/* 
  可以在类的内部使用set和get，对某个属性设置存值函数和取值函数。
  存值函数和取值函数是设置在属性的 Descriptor 对象上的。与ES5一致。
*/

// 类的属性名可以用表达式
/* 
[methodName](){

}
*/

// class表达式
/* 
立即执行的class
let person = new class{

}()
*/

// 注意点：
/* 
1,严格模式：ES6 实际上把整个语言升级到了严格模式
2，类不存在变量提升。子类一定要定义在父类后面
let Foo = class {}
class Bar extends Foo{

}
3,name属性：总是返回紧跟在class关键字后面的类名
class Point{}
Point.name

4,Generator方法
某个方法之前加星号（*）,表示该方法是geneator函数
(这部分代码没看懂，后续再继续看)

5，this的指向
类的方法中如果包含this，则默认指向类实例
如果将方法单独提取出来，this指向的是undefined。此时，两种解决方法：
  ① 构造函数中绑定this（函数的bind方法）
  ② 用箭头函数（箭头函数）
  ③  使用Proxy，获取方法的时候，自动绑定this
  */

// 2.静态方法
/* 
静态方法： 类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

如果静态方法包含this关键字，这个this指的是类，而不是实例。

静态方法可以和非静态方法重名。

静态方法可以继承，并且可以在super对象上调用（静态方法中super对象指向的是父类）
*/

/* 
3，实例属性的新写法
实例的属性除了定义咋constructor（）方法里，也可以写在类的最顶层
*/


/* 
4, 静态属性
静态属性有两种定义方法: 
老写法 是在类的外面定义  Foo.prop = 1
新写法 新提案是在实例属性前加static  static prop = 2
*/

/* 
5，私有方法和私有属性
只能在类的内部访问的方法和属性，外部不能访问
  方法① 在命名上加以区别
  方法②  将私有方法移出到模块外
  方法③  利用Symbol值的唯一性，将私有方法的名字命名为一个Symbol值。

私有属性的提案：
在属性和方法前面加#，表示私有
*/

/* 
6， new.target属性
一般用在构造函数中，返回new命令作用于的那个构造函数。用来确定构造函数是怎么调用的。
利用此特性，可以写出不能独立使用、必须继承后才能使用的类
*/