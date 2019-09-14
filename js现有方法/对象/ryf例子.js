class CustomHTMLElement{
  constructor(element){
    this.element = element
  }
  get html(){
    return this.element.innerHTML
  }
  set html(value){
    this.element.innerHTML = value
  }
}

var descriptor = Object.getOwnPropertyDescriptor(
  CustomHTMLElement.prototype, "html"
)

"get" in descriptor
"set" in descriptor



const MyClass = class Me{
  getClassName(){
    return Me.name
  }
}

let inst = new MyClass()
inst.getClassName()

let person = new class{
  constructor(name){
    this.name = name
  }
  sayName(){
    console.log(this.name)
  }
}("张三")

// 不能独立使用，必须经过继承后才能使用的类
class Shape {
  constructor(length, width){
    console.log(new.target)
    if(new.target === Shape){
      throw new Error("本类不能被实例化")
    }
    this.length = length
    this.width = width
  }
}
class Rec extends Shape{
  constructor(length, width){
    super(length, width)
  }
}

// let x = new Shape()
let y = new Rec(3,4)