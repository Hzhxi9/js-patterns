/**
 * 原型链
 * 1. 实例有 __proto__ 并指向 构造函数的 prototype
 * 2. 构造函数有 __proto__ 并指向 Function.prototype、prototype 
 * 3. 构造函数的 prototype 有 constructor 并指向 构造函数, 也有 __proto__ 并指向 Object.prototype
 * 4. Object.prototype 有 __proto__ 并指向 null
 * 
 * 
 * 概念
 * 1. 每个对象都可以有一个原型 __proto__, 这个原型还可以有自己的原型, 以此类推, 形成一个原型链
 * 2. 查找特定属性的时候, 先去这个对象里去找, 如果没有的话再去它的原型对象里面去找, 如果还是没有的话再去原型对象的原型对象里去找,
 *    这个操作被委托在整个原型链上, 就是原型链
 * 
 * 原型指针
 * 1. prototype
 *    - 函数独有, 它是从一个函数指向一个对象, 含义是函数的原型对象, 也就是这个函数(其实所有函数都可以作为构造函数)所创建的实例的原型对象
 *    - 这个属性是一个指针, 指向一个对象, 这个对象的用途就是包含所有实例共享的属性和方法(我们把这个对象叫做原型对象)
 * 
 * 2. __proto__
 *    - 原型链查询实际用到的, 他总是指向prototype(指向构造函数的原型对象)
 * 
 * 3. constructor 
 *    - 每个函数都有一个原型对象, 该原型对象有一个 constructor 属性, 指向创建对象的函数本身
 *    - 所有的实例对象都可以访问 constructor 属性, constructor 属性是创建实例对象的函数的引用, 我们可以使用 constructor 属性验证实例的原型类型
 *   
 * 总结
 * 1. Foo 构造函数 __proto__ 指向 他的构造函数的原型对象, 它的构造函数是Function, 也就是 Foo.__proto__ 指向 Function.prototype
 * 2. 实例(new Foo) 指向 Foo.prototype，它的构造函数就是 Foo(), 即 a.__proto = Foo.prototype
 * 3. Function.prototype 它的 __proto__ 指向 Object.prototype(null)
 * 4. 原型链条的指向就是 函数 -> 构造函数 -> Function.prototype -> Object.prototype -> null
 * 5. __proto__ 是原型链查询中实际用到的, 它总是指向 prototype 
 * 6. prototype 是函数独有的, 在定义构造函数时自动创建的, 总是被 __proto__ 所指。
 * 7. 所有对象都有 __proto__ 属性, 函数这个特殊对象除了具有 __proto__ 属性, 还有特有的原型属性 prototype
 * 8. prototype 对象默认有两个属性, constructor 属性 和 __proto__ 属性
 * 9. prototype 属性可以给函数和对象添加共享(继承)的方法、属性, 而 __proto__ 是查找某函数或对象的原型链方式
 * 10。这个属性包含了一个指针, 指回原构造函数
 * 
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