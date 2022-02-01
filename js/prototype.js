/**
 * 原型模式
 *
 * 1. 概念
 *    用于创建对象的一种模式
 *
 * 2. 创建对象的方法
 *    - 先指定它的类型, 然后通过类来创建这个对象
 *    - 原型模式不再关心对象的具体类型, 而是找到一个对象, 然后通过克隆来创建一个一模一样的对象
 *
 * 3. 实现的关键, 语言是否提供了克隆的方法
 *    - ECMAScript 5提供了 Object.create 方法用来克隆对象
 *
 * 4. 目的: 提供了一种便捷的方式去创建某个类型的对象, 克隆只是创建这个对象的过程和手段
 *
 * 5. 各类创建对象的缺点
 *    - 依赖倒置原则提醒我们创建对象的时候要避免依赖具体类型
 *    - 用 new XXX 创建对象的方式显得很僵硬
 *    - 工厂方法模式和抽象工厂模式可以解决这个问题, 但会带来跟产品类平行的工厂类层次, 也会增加很多额外的代码
 *    - 原型模式通过克隆对象, 就不用在关心对象的具体类型名字
 *
 */
var Plane = function () {
  this.blood = 100;
  this.attackLevel = 1;
  this.defenseLevel = 1;
};

var plane = new Plane();
plane.blood = 500;
4;
plane.attackLevel = 10;
plane.defenseLevel = 7;

var clonePlane = Object.create(plane);
console.log(clonePlane.blood); // 500
console.log(clonePlane.attackLevel); // 10
console.log(clonePlane.defenseLevel); // 7

/**不支持 Object.create 方法的浏览器 */
Object.create =
  Object.create ||
  function (obj) {
    var F = function () {};
    F.prototype = obj;
    return new F();
  };

/**
 *  原型编程范型的基本规则
 *    - 所有的数据都是对象
 *    - 要得到一个对象, 不是通过实例化类, 而是找到一个对象作为原型并克隆它
 *    - 对象会记住它的原型
 *    - 如果对象无法响应某个请求, 他会把这个请求委托给它自己的原型
 *
 * JavaScript 中的原型继承
 *    1. 所有的数据都是对象
 *    2. JavaScript 的根对象是 Object.prototype 对象
 *    3. Object.prototype 对象是一个空对象
 **/

/**1. 所有的数据都是对象 */
var obj1 = new Object();
var obj2 = {};
/**Object.getPrototypeOf 来查看这两个对象的原型 */
console.log(Object.getPrototypeOf(obj1) === Object.prototype); // true
console.log(Object.getPrototypeOf(obj2) === Object.prototype); // true

/**2. 要得到一个对象, 不是通过实例化类, 而是找到一个对象作为原型并克隆它 */
function Person(name) {
  this.name = name;
}
Person.prototype.getName = function () {
  return this.name;
};

/**
 * 1. Person 并不是类, 而是函数构造器
 * 2. JavaScript 的函数既可以作为普通函数被调用, 也可以作为构造器被调用
 * 3. 当使用 new 运算符来调用函数, 此时的函数就是一个构造函数
 * 4. 用 new 运算符来创建对象的过程, 实际上也只是先克隆 Object.prototype 对象, 在进行一些其他额外的操作的过程
 */
var n = new Person('sven');

console.log(n.name); // sven
console.log(n.getName()); // sven
console.log(Object.getPrototypeOf(n) === Person.prototype); // true

/**new 的是实现原理 */
var objectFactory = function () {
  /**从 Object。prototype 上克隆一个空对象 */
  var obj = new Object(),
    /**取得外部传入的构造器, 此例是 Person */
    Constructor = [].shift.call(arguments);
  /**指向正确的原型 */
  obj.__proto__ = Constructor.prototype;
  /**借用外部传入的构造器给 obj 设置属性 */
  var ret = Constructor.apply(obj, arguments);
  /**确保构造器总是返回一个对象 */
  return typeof ret === 'object' ? ret : obj;
};

var n1 = objectFactory(Person, 'sven');

console.log(n1.name);
console.log(n1.getName());
console.log(Object.getPrototypeOf(n1) === Person.prototype);

/**
 * 3. 对象会记住它的原型
 *
 * 请求可以在一个链条中依次往后传递, 那么每个节点都必须知道它的下一个节点
 *
 * 对象的原型: 是对象的构造器有原型
 *
 * " 对象把请求委托给它自己的原型 ": 对象把请求委托给它的构造器的原型
 *
 * 对象如何把请求顺利地转交给它的构造器原型？
 *
 * JavaScript 给对象提供了一个 __proto__  的隐藏属性, 某个对象的 __proto__属性默认会指向它的构造器的原型对象, 即 Constructor.prototype
 *
 * __proto__ 就是对象跟 "对象构造器的原型" 联系起来的纽带
 **/

var o1 = new Object();
console.log(o1.__proto__ === Object.prototype); // true

/**
 * 4. 如果对象无法响应某个请求, 它会把这个请求委托给它的构造器原型
 *
 * 当一个对象无法响应某个请求时, 他会顺着原型链把请求传递下去, 直到遇到一个可以处理该请求的对象为止
 *
 * JavaScript中, 每个对象最初都是从 Object.prototype 对象克隆而来的
 * 但对象构造器的原型并不仅限于 Object.prototype 上, 而是可以动态指向其他对象、
 *
 * 当对象 a 需要借用对象 b 的能力时, 可以有选择地把 对象a 的构造器的原型指向对象 b, 从而达到继承的效果
 */
var obj = { name: 'name' };
var A = function () {};

A.prototype = obj;
var a = new A();
console.log(a.name) // name

/**
 * 1. 尝试遍历对象 a 中的所有属性, 但没有找到 name 这个属性
 * 2. 查找 name 属性的这个请求被委托给对象 a 的构造器的原型, 它被 a.__proto__记录着并且指向 A.prototype, 而 A.prototype 被设置为对象 obj
 * 3. 在对象 obj 中找到 name 属性, 并且返回它的值
 */


/**
 * 当期望得到一个类 继承来自另外一个类时
 * 
 * 1. 尝试遍历对象 a 中的所有属性, 但没有找到 name 这个属性
 * 2. 查找 name 属性的请求被委托给对象 b 的构造器的原型, 它被 b.__proto__ 记录着并指向 B.prototype, 而B.prototype 被设置为一个通过 new A() 创建出来的对象
 * 3. 在该对象中依然没有找到该 name 属性时, 于是请求被继续委托给这个对象构造器的原型 A.prototype 
 * 4. 在 A.prototype 中找到了 name 属性, 于是请求被继续委托给这个对象构造器的原型
 */
var B = function () {}
B.prototype = new A();

var b = new B();
console.log(b.name); // name


/**
 * 原型链不是无限长的, 最终传递到 Object.prototype(null) 结束
 */