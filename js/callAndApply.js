/**call 和 apply 的区别 */

/**
 * apply
 * 1. 接收两个参数, 第一个参数指定了函数体内 this 对象的指向, 第二个参数为一个带下标的集合, 可以是数组, 也可以是类数组
 */
var func1 = function (a, b, c) {
  console.log([a, b, c]); // [1, 2, 3]
};
func1.apply(null, [1, 2, 3]);

/**
 * call
 * 1. 传入的参数不定, 第一个参数也是代表函数体内的 this 的指向, 从第二个参数开始往后, 每个参数被依次传入函数
 */
var func2 = function (a, b, c) {
  console.log([a, b, c]); // [1, 2, 3]
};
func2.call(null, 1, 2, 3);

/**
 * 当使用 call 或者 apply 的时候, 传入的第一个参数为 null， 函数体内的 this 会指向默认的宿主对象, 在浏览器中则是 window
 * 但如果是严格模式下, 函数体内的 this 还是为 null
 */
var func3 = function (a, b, c) {
  console.log(this === global); // true
};
func3.apply(null, [1, 2, 3]);

/**
 * 有时候使用 call 或者 apply 的目的不在于指定 this 指向, 而是另有用途
 * 比如借用其他对象的方法, 可以传入 null 来代替某个具体的对象
 */
Math.max.apply(null, [1, 2, 3, 4, 5]); // 15

/**call 和 apply 的用途 */

/**
 * 1. 改变 this 的指向
 * 改变函数内部的 this 指向
 **/
var obj1 = { name: 'sven' };
var obj2 = { name: 'anne' };
global.name = 'window';

var getName = function () {
  return this.name;
};

console.log(getName()); // window
console.log(getName.call(obj1)); // sven
console.log(getName.call(obj2)); // anne

/**
 * 有一个 div 节点的 onclick 事件中的 this 本来是指向这个 div 的, 事件函数内部有个 func 函数, 在事件内部调用 func 函数, func 函数体内的 this 指向 window
 */
// document.getElementById('root').onclick = function () {
//   console.log(this.id); // root
//   var func = function () {
//     console.log(this.id);
//   };
//   func(); // undefined
//   // 修正 this 的指向
//   func.call(this); // root
// };

/**
 * 2. Function.prototype.bind
 *
 */

/**
 * 模拟 Function.prototype.bind
 * 1. 先把 func 函数的引用保存起来, 然后返回一个新的函数
 * 2. 当我们执行 func 函数时, 实际上先执行的是这个刚刚返回的新函数
 * 3. 在新函数内部, that.apply(context, arguments)才是执行原来的 func 函数, 并且指定 context 对象为 func 函数体内的 this
 * */
Function.prototype.bind = function (context) {
  var that = this; /**保存原函数 */
  /**返回一个新函数 */
  return function () {
    /** 执行新的函数的时候, 会把之前传入的 context 当作新函数体内的 this */
    return that.apply(context, arguments);
  };
};

var obj3 = { name: 'Sven' };
var func = function () {
  console.log(this.name);
}.bind(obj3);

func();

/**复杂版, 可以往 func 函数中预先填入一些参数 */
Function.prototype.bind = function () {
  var that = this /**保存原函数 */,
    context = [].shift.call(arguments) /**需要绑定的 this 上下文 */,
    args = [].slice.call(arguments); /**剩余的参数转成数组 */
  /**返回一个函数 */
  return function () {
    /**
     * 执行新的函数的时候, 会把之前传入的 context 当作新函数体内的 this
     * 并且组合两次分别传入的参数, 作为新函数的参数
     */
    return that.apply(context, [].concat.call(args, [].slice.call(arguments)));
  };
};

var obj4 = { name: 'foo' };

var func1 = function (a, b, c, d) {
  console.log(this.name); // foo
  console.log(a, b, c, d); // 1, 2, 3, 4
}.bind(obj4, 1, 2);

func1(3, 4);

/**3. 借用其他对象的方法函数 */

/**借用构造函数, 实现类似一些继承的效果 */
var A = function (name) {
  this.name = name;
};
var B = function () {
  A.apply(this, arguments);
};

B.prototype.getName = function () {
  return this.name;
};

var b = new B('super');
console.log(b.getName());

/**
 * 借用数组方法操作类数组
 *  - Array.prototype.push 往类数组中添加新元素 
 *  - Array.prototype.slice 把 arguments 转换成真正的数组
 *  - Array.prototype.shift 截去 arguments 列表中的头一个元素
 **/
(function () {
  Array.prototype.push.call(arguments, 3);
  console.log(arguments)
})(1, 2);



