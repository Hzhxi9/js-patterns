/**
 * 发布-订阅模式(观察者模式)
 *    定义:
 *     -  它定义对象间的一种一对多的依赖关系, 当一个对象的状态发生改变时, 所有依赖于它的对象都将得到通知
 *     -  在 Javascript 中我们一般用事件模型来替代传统的发布-订阅模式
 *
 *    作用:
 *     - 可以广泛应用于异步编程中, 这是替代传递回调函数的方案
 *       比如我们可以订阅 ajax 请求的 error、success 等事件
 *       或者如果想在动画的每一帧完成之后做一些事情, 那我们可以订阅一个事件, 然后在动画的每一帧完成之后发布这个事件
 *       (在异步编程中使用发布订阅模式, 我们就无需过多关注对象在异步运行期间的内部状态, 而只需要订阅感兴趣的事件发生点)
 *
 *     - 发布-订阅模式可以取代对象之间硬编码的通知机制, 一个对象不用显示调用另外一个对象的某个接口
 *       发布-订阅模式让两个对象松耦合地联系在一起, 虽然不清楚彼此的细节, 但这也不影响它们之间的相互通信
 *       当有新的订阅者出现时, 发布者的代码不需要任何的修改
 *       同样发布者需要改变, 也不会影响到之前的订阅者( 只要之前约定的事件名没有变化, 就可以自由的改变它们 )
 */

/**
 * 🌰 : DOM 事件 (在 DOM 节点上绑定事件)
 *
 * 需要监听用户点击 document.body 的动作, 我们可以订阅 document.body 上的 click 事件
 * 当 body 节点被惦记时, body 节点便会向订阅者发布这个消息
 *
 * 我们可以随意增加或者删除订阅者, 增加任何订阅者都不会影响发布者代码的编写
 *
 * @warn 手动触发事件: IE 下使用 fireEvent, 标准浏览器下用 dispatchEvent 实现
 **/
document.addEventListener(
  'click',
  function () {
    console.log('clicked');
  },
  false
);

document.body.click(); // 模拟用户点击

/**
 * 🌰 : 自定义事件
 *
 *  实现步骤:
 *      - 指定谁充当发布者
 *      - 给发布者添加一个缓存列表, 用于存放回调函数以便于通知订阅者
 *      - 最后发布消息的时候, 发布者会遍历这个缓存列表, 依次通知里面存放的订阅者回调函数
 *      - 还可以往回调函数里填入一些参数, 订阅者可以接收这些参数, 在进行各自的处理
 */

var salesOffices = {}; // 定义售楼处

salesOffices.clientList = []; // 缓存列表, 存放订阅者的回调函数

// 增加订阅者
salesOffices.listen = function (fn) {
  this.clientList.push(fn); // 订阅消息存放添加到缓存列表里
};

// 发布消息
salesOffices.trigger = function () {
  for (var i = 0, fn; (fn = this.clientList[i++]); ) {
    fn.apply(this, arguments); // arguments: 发布消息时带上的参数
  }
};

/**
 * 测试用例
 * 存在问题: 所有订阅者都会收到消息
 */

/**用户一订阅消息 */
salesOffices.listen(function (price, square) {
  console.log(`价格=${price}`);
  console.log(`平方数=${square}`);
});
/**用户二订阅消息 */
salesOffices.listen(function (price, square) {
  console.log(`价格=${price}`);
  console.log(`平方数=${square}`);
});

salesOffices.trigger(20000, 88);
salesOffices.trigger(30000, 110);

/**修改 */
var salesOffices = {}; // 定义售楼处

salesOffices.clientList = []; // 缓存列表, 存放订阅者的回调函数

// 增加订阅者
salesOffices.listen = function (key, fn) {
  /**如果还没有订阅此类消息, 给该类消息创建一个缓存列表 */
  if (!this.salesOffices[key]) this.salesOffices[key] = [];
  /**订阅消息存放添加到缓存列表里 */
  this.clientList[key].push(fn);
};

// 发布消息
salesOffices.trigger = function () {
  var key = Array.prototype.shift.call(arguments), // 取出消息类型
    fns = this.clientList[key]; // 取出该消息对应的回调函数

  if (!fns || fns.length === 0) return false; // 没有该消息类型, 则返回

  for (var i = 0, fn; (fn = fns[i]); ) {
    fn.apply(this, arguments); // arguments: 发布消息时带上的参数
  }
};

/**用户一订阅消息 */
/**订阅 square:88 的消息  */
salesOffices.listen('square:88', function (price, square) {
  console.log(`价格=${price}`);
  console.log(`平方数=${square}`);
});
/**订阅 square:110 的消息  */
salesOffices.listen('square:110', function (price, square) {
  console.log(`价格=${price}`);
  console.log(`平方数=${square}`);
});
/**发布 square:88 的消息 */
salesOffices.trigger('square:88', 20000, 88);
/**发布 square:110 的消息 */
salesOffices.trigger('square:110', 30000, 110);

/**
 * 🌰 : 通用的发布订阅实现
 */
var event = {
  clientList: {},
  listen: function (key, fn) {
    if (!this.clientList[key]) this.clientList[key] = [];
    this.clientList[key].push(fn); // 订阅消息添加到缓存列表里
  },
  trigger: function () {
    var key = Array.prototype.shift.call(arguments),
      fns = this.clientList[key];

    if (!fns || fns.length === 0) return false; // 如果没有绑定对应的消息

    for (var i = 0, fn; (fn = fns[i]); ) fn.apply(this, arguments); // arguments 是 trigger 时带上的参数
  },
};

/** installEvent: 给所有对象都动态添加发布订阅功能 */
var installEvent = function (obj) {
  for (var i in obj) obj[i] = event[i];
};

var salesOffices = {}; // 定义售楼处
/**给 salesOffices 动态添加 发布订阅 */
installEvent(salesOffices)