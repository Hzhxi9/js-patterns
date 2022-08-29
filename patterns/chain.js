/**
 * @description 职责链模式
 *
 *    定义: 使多个对象都有机会处理请求, 从而避免请求的发送者和接受者之间的耦合关系, 将这些对象连城一条链, 并沿着这条链传递该请求
 *         直到有一个对象处理他为止
 *         一系列可能会处理请求的对象被连接成一条链, 请求在这些对象之间依次传递, 直到遇到一个可以处理它的对象, 我们把这些对象称为链中的节点
 *
 *    优点: 请求发送者只需要知道链中的第一个节点, 从而弱化了发送者和一组接收者之间的强联系
 *
 */

/**
 * 🌰 : 实际开发中的职责链模式
 *
 *  假如我们负责一个售卖手机的电商网站, 经过分别交纳 500 元定金和 200 元定金预定后(订单已经在此时生成), 现在已经到了正式购买的阶段
 *
 *  公司针对支付过定金的用户有一定的优惠政策, 在正式购买后,
 *      - 已经支付过 500 元定金的用户会收到 100 元的商场优惠券
 *      - 已经支付过 200 元定金的用户会收到 50 元的商场优惠券
 *      - 没有支付过 定金 的用户只能进入普通购买模式, 也就是没有优惠券, 且在库存有限的情况下不一定保证能买到
 *
 *  接口提供字段:
 *      orderType: 订单类型(定金用户｜普通用户), code: 1 => 500 元定金用户, 2 => 200 元定金用户, 3 => 普通购买用户
 *      pay: 用户是否已经支付定金, 值为 true 或者 false, 虽然用户已经下过了 500 元定金的订单, 但他如果没有支付定金, 只能降级为普通购买用户
 *      stock: 当前用于普通购买的手机库存数量, 已经支付过 500 元定金和 200 元定金的用户不受此限制
 **/
var order = function (orderType, pay, stock) {
  /**500 元定金模式 */
  if (orderType === 1) {
    /**已支付过定金 */
    if (pay === true) {
      console.log('500 元定金预购, 得到 100 元优惠券');
    } else {
      /**未支付过定金, 降级为普通购买模式 */
      if (stock > 0) {
        /**用于普通购买模式且有库存 */
        console.log('普通购买, 无优惠券');
      } else {
        /**没有库存 */
        console.log('手机库存不足');
      }
    }
  } else if (orderType === 2) {
    /**200 元定金模式 */
    if (pay === true) {
      console.log('200 元定金预购, 得到 50 元优惠券');
    } else {
      if (stock > 0) {
        console.log('普通购买, 无优惠券');
      } else {
        console.log('手机库存不足');
      }
    }
  } else if (orderType === 3) {
    /**普通购买模式 */
    if (stock > 0) {
      console.log('普通购买, 无优惠券');
    } else {
      console.log('手机库存不足');
    }
  }
};
order(1, true, 500);

/**
 * 🌰 : 职责链模式重构
 *
 * 1. 先把 500, 200, 普通购买分成 3 个函数
 * 2. 把三个字段传递给 500 函数, 不符合处理条件, 则把这个请求传递给后面的 200 函数, 如果依然不能处理, 则继续传递给普通购买函数
 *
 * 缺点:
 *    请求在链条传递中的顺序非常僵硬, 传递请求的代码被耦合在了业务函数中
 *    这依然违背了开放封闭原则, 如果我们想要增加 300 元订单或者去掉 200 元订单, 意味着就必须改动这些业务函数代码
 */
var order500 = function (orderType, pay, stock) {
  if (orderType === 1 && pay) {
    console.log('500 元定金预购, 得到 100 元优惠券');
  } else {
    /**传递给 200 函数 */
    order200(orderType, pay, stock);
  }
};

var order200 = function (orderType, pay, stock) {
  if (orderType === 2 && pay) {
    console.log('200 元定金预购, 得到 50 元优惠券');
  } else {
    /**传递给 普通订单函数 */
    order200(orderType, pay, stock);
  }
};

var orderNormal = function (orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买, 无优惠券');
  } else {
    console.log('手机库存不足');
  }
};

/**
 * 🌰 : 灵活可拆分的职责链节点
 *
 * 目标: 让链中的各个节点可以灵活拆分和重组
 */

/**
 * 1. 分别改写表示三种购买模式的节点函数,
 *    约定如果某个节点不能处理请求,
 *    则返回一个特定的字符串 "nextSuccessor" 来表示该请求需要继续往后传递
 **/
var order500 = function (orderType, pay, stock) {
  if (orderType === 1 && pay) {
    console.log('500 元定金预购, 得到 100 元优惠券');
  } else {
    /**不知道下一个节点是谁, 反正把请求后传 */
    return 'nextSuccessor';
  }
};

var order200 = function (orderType, pay, stock) {
  if (orderType === 2 && pay) {
    console.log('200 元定金预购, 得到 50 元优惠券');
  } else {
    /**不知道下一个节点是谁, 反正把请求后传 */
    return 'nextSuccessor';
  }
};

var orderNormal = function (orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买, 无优惠券');
  } else {
    console.log('手机库存不足');
  }
};

/**
 * 2. 需要把函数包装进职责链节点
 * 我们定义一个构造函数 Chain, 在 new Chain 的时候传递参数即为被包装的函数
 * 同时它还拥有一个实例属性 this.successor, 表示在链中的下一个节点
 * 
 * 自由灵活增加、移除和修改链中的节点顺序
 *
 * Chain 的 prototype 中还有两个函数:
 * Chain.prototype.setNextSuccessor: 指定在链中的下一个节点
 * Chain.prototype.passRequest: 传递请求给某个节点
 */
var Chain = function (fn) {
  this.fn = fn;
  this.successor = null;
};

Chain.prototype.setNextSuccessor = function (successor) {
  return (this.successor = successor);
};

Chain.prototype.passRequest = function () {
  var ret = this.fn.apply(this, arguments);
  if (ret === 'nextSuccessor') {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments);
  }
  return ret;
};

/**把三个订单函数包装成职责链的节点 */
var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal = new Chain(orderNormal);

/**指定节点在职责链中的顺序 */
chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);

/**把请求传递给第一个节点 */
chainOrder500.passRequest(1, true, 500);
chainOrder500.passRequest(2, true, 500);
chainOrder500.passRequest(3, true, 500);
chainOrder500.passRequest(1, false, 0);

/**增加支持 300 元定金购买, 在链中增加一个节点即可 */
var order300 = function(orderType, pay, stock){
    //
}
var chainOrder300 = new Chain(order300);
chainOrder500.setNextSuccessor(chainOrder300);
chainOrder300.setNextSuccessor(chainOrder200);
