let f = function (){
  this.a = 1
  this.b = 2
}

let o = new f()

// 在f的原型（对象）上定义属性
f.prototype.b = 3
f.prototype.c = 4

console.log(o.a) //1
console.log(o.b) //2
console.log(o.c) //4
console.log(o.d) // 在o以及其原型链上并没有找到d属性

// 继承方法
// 创建一个原型对象Obj，在此原型对象上创建一个对象实例
let Obj = {
  a: 4,
  des:"from Obj",
  fn: function(){
    return this.a + 1
  }
}

console.log(Obj.fn())// 5 ; this指向的是Obj

let p = Object.create(Obj) // 创建一个继承对象Obj的新对象p；换种说法: 创建一个原型对象是Obj的新对象p
console.log("p的a是：",p.a)
p.a = 30
console.log(p.fn()) // 31; this指向的新对象p
console.log(p.des)

console.log("=====分界线=====")

function doSomething(){

}
console.log(doSomething.prototype)

var doSomething = function(){}
console.log(doSomething.prototype)

// add a property onto the prototype
doSomething.prototype.foo = "bar"
var doSthInstance = new doSomething()
doSthInstance.prop = "some value"
console.log(doSthInstance)

console.log("=====分界线=====")
/* 
  let obj = {a: 1}
 用字面量语法定义一个对象时，原型链是
 obj => Object.prototype => null
*/

/* 
  let list = ["name", "age"]
  数组都继承于Array.prototype。定义一个数组后，原型链是：
  a ==> Array.prototype ==> Object.prototype ==> null
*/

/* 
  function f(){
    return 2
  }
  函数都继承于Function.prototype.定义一个函数后，原型链是：
  f ==> Function.prototype ==> Object.prototype ==> null

*/
console.log("=====分界线=====")
// 使用构造函数创建对象
function Graph(){
  this.vertices = []
  this.edges = []
}
Graph.prototype = {
  addVertex: function(v){
    this.vertices.push(v)
  }
}
var g = new Graph()

// 使用Object.create创建对象
let pObj = {name: "joy"}
let pObjNew = Object.create(pObj)
console.log(pObjNew.name) // joy
pObjNew.sex = "female"
let pObjNew2 = Object.create(pObjNew)
console.log(pObjNew2.name) //joy
console.log(pObjNew2.sex) //female

// 使用class关键字
class Polygon{
  constructor(height, width){
    this.height = height
    this.width = width
  }
}
class Square extends Polygon{
  constructor(sideLength){
    super(sideLength, sideLength)
  }
  get area(){
    return this.height * this.width
  }
  set sideLength(newLength){
    this.height = newLength
    this.width = newLength
  }
}
var square = new Square(2)
console.log(square)

// tip : 补充一下，new操作符创建对象时，程序会经历以下步骤：
/* 1.创建一个新对象
2.将构造函数的作用域赋给新对象（因此this就指向了这个新对象）
3.执行构造函数中的代码（为这个新对象添加属性）
4.返回新对象 */