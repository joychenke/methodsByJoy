/**
 * arguments的用法
 */
function sum(a, b){
  this.a = 5;
  return a * b;
}
let obj = {a: 12, b: 3}
let obj1 = {a: 1, b: 2}
let value = sum.apply(obj1, Object.values(obj))
console.log(value)
console.log(obj1)