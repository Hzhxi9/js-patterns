/**
 * this
 *  - JavaScript 的 this 总是 指向一个对象, 而具体指向哪个对象是在运行时基于函数的执行环境动态绑定的, 而非函数被声明时的环境
 *  - this的最终指向的是那个调用它的对象
 *  - 严格模式下, 默认 this 不再是 window, 而是 undefined
 */

/**
 * this 指向(除去不常用的 with 和 eval)
 * 1. 作为对象的方法调用
 * 2. 作为普通函数调用
 * 3. 构造器调用
 * 4. Function.prototype.call 或 Function.prototype.apply 调用
 *
 * 总结:
 * 1. 如果一个函数中有 this, 但是他没有被上一级的对象所调用, 那么 this 指向就是 window
 * 2. 如果一个函数中有 this, 这个函数有被上一级的对象所调用, 那么 this 指向上一级的对象
 * 3. 如果一个函数中有 this, 这个函数是被最外层的对象所调用, this 指向的也只是它上一级的对象
 */
var o1 = {
  a: 10,
  b: {
    a: 12,
    fn: function () {
      console.log(this.a);
    },
  },
};
o1.b.fn(); // 如果一个函数中有 this, 这个函数是被最外层的对象所调用, this 指向的也只是它上一级的对象 => 12

var o2 = {
  a: 10,
  b: {
    fn: function () {
      console.log(this.a);
    },
  },
};
o2.b.fn(); // 尽管对象b中没有属性a，这个this指向的也是对象b，因为this只会指向它的上一级对象，不管这个对象中有没有this要的东西 => undefined

var o3 = {
  a: 10,
  b: {
    a: 12,
    fn: function () {
      console.log(this.a);
      console.log(this);
    },
  },
};
var j = o3.b.fn;
j(); // this 永远指向的是最后调用它的对象,也就是看它执行的时候是谁调用。虽然函数 fn 是被对象 b 所引用, 但是在将 fn 赋值给变量 j 的时候并没有执行, 所以最终指向的是 window  => undefined, window

/**构造函数 this */
function Fn() {
  this.user = 'user1';
}
var f = new Fn();
/**
 * 关键字 new 改变了 this 的指向, 将 this 指向对象 f
 * 因为用了new关键字就是创建一个对象实例
 * 这里用变量 f 创建了一个 Fn 的实例(相当于复制了一份 Fn 到对象 f 里面), 此时仅仅只是创建, 并没有执行, 而调用这个函数 Fn 的是对象 f, 那么 thi s指向的自然是对象 f, 那么为什么对象 f 中会有 user?
 * 因为已经复制了一份 Fn 函数到对象 f 中
 */
console.log(f.user); // user1

/**
 * 当 this 碰到 return
 * 如果返回值是一个对象, 那么 this 指向的就是那个对象,
 * 如果返回值不是一个对象, 那么 this 还是指向函数的实例
 */
function Fn1() {
  this.user = 'user2';
  return {};
}
var f2 = new Fn1();
console.log(f2.user, '==当 this 碰到 return ==');

function Fn2() {
  this.user = 'user2';
  return 1;
}
var f3 = new Fn2();
console.log(f3.user, '==当 this 碰到 return 222==');

function Fn3() {
  this.user = 'user2';
  return void 0;
}
var f4 = new Fn3();
console.log(f4.user, '==当 this 碰到 return 333==');

/**
 * 虽然 null 也是对象, 但是这里 this 还是指向 函数的实例
 */
function Fn4() {
  this.user = 'user2';
  return void null;
}
var f5 = new Fn4();
console.log(f5.user, '==当 this 碰到 return 444==');

/**
 * 1. 作为对象的方法调用
 *    当函数作为对象的方法被调用时, this 指向该对象
 **/
var obj1 = {
  a: 1,
  getA: function () {
    console.log(this === obj1); // true
    console.log(this.a); // 1
  },
};
obj1.getA();

/**
 * 2. 作为普通函数调用
 *    - 当函数不作为对象的属性被调用时, 也就是我们常说的普通函数方式, 此时的 this 总是指向全局对象
 *    - 在浏览器中, 这个全局对象是 window 对象
 *    - 在nodejs中, 这个全局对象是 global 对象
 */
global.name = 'name';

var getName = function () {
  return this.name;
};
console.log(getName()); // name

var obj2 = {
  name: 'name1',
  getName2: function () {
    return this.name;
  },
};
var getName2 = obj2.getName2;
console.log(getName2()); // name
console.log(obj2.getName2()); // name1

/**
 * 在 div 节点的事件函数内部, 有一个局部的 callback 方法
 * callback 被作为普通函数调用时, 内部的 this 指向 window, 但我们要让它指向该 div 节点
 */

// window.id = 'window';
// document.getElementById('root').onclick = function () {
//     console.log(this.id) // root
//     var callback = function () {
//         console.log(this.id); // window
//     }
//     callback()
// };

/**解决方案 */
// document.getElementById('root').onclick = function () {
//   console.log(this.id); // root
//   const that = this; // 保存 this 的引用
//   var callback = function () {
//     console.log(that.id); // root
//   };
//   callback();
// };

/**
 * 3. 构造器调用
 *    - JavaScript 没有类, 但是可以从构造器中创建对象, 同时也提供了 new 运算符, 使得构造器更像一个类
 *    - 构造器跟普通函数一模一样, 他们的区别在于被调用的方式
 *    - 当用 new 运算符调用函数时, 该函数总会返回一个对象, 通常情况下, 构造器里的 this 就指向返回的这个对象
 */
var class1 = function () {
  this.name = 'sven';
};
var c = new class1();
console.log(c.name); // sven

/**如果构造器显式返回一个 object 类型的对象, 那此次运算结果最终返回这个对象 */
var class2 = function () {
  this.name = 'sven1';
  return {
    name: 'sven2',
  };
};
var c2 = new class2();
console.log(c2.name); // sven2

/**构造器不显式地返回任何数据, 或者是返回一个非对象类型的数据, 就不会造成上述问题 */
var class3 = function () {
  this.name = 'sven3';
  return 'sven4';
};
var c3 = new class3();
console.log(c3.name); // sven3

/**
 * 4. Function.prototype.call & Function.prototype.apply
 *
 * 可以动态地改变传入函数的 this
 **/
var obj4 = {
  name: 'sven5',
  getName4: function () {
    return this.name;
  },
};
var obj44 = {
  name: 'anne',
};
console.log(obj4.getName4()); // sven5
console.log(obj4.getName4.call(obj44)); // anne

/**
 * 丢失的 this
 */

/**
 * 这段代码抛出异常
 * 这是因为许多引擎的 document.getElementById 方法的内部实现中需要用到 this
 * 这个 this 本来期望指向 document, 当 getElementById 方法作为 document 对象的属性被调用时候, 方法内部的 this 指向 document 的
 *
 * 当用 getId 来引用 document.getElementById 之后, 在调用 getId, 此时就指向了 window
 */
// var getId = document.getElementById;
// getId('root');

/**修正代码 */
document.getElementById = (function (func) {
  return function () {
    return func.apply(document, arguments);
  };
})(document.getElementById);
var getId = document.getElementById;
getId('root');


