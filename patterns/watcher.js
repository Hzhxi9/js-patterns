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
 *
 *    必须先订阅再发布吗:
 *     - 先前我们了解到的发布订阅模式, 都是订阅者必须先订阅一个消息, 随后才能接收到发布者发布的消息
 *       如果顺序反过来, 发布者先发布一条消息, 而此时没有订阅者, 则这条消息会消息
 *
 *     - 在某些情况我们需要把这条消息保存下来, 等有对象订阅它的时候, 在重新把消息发布给订阅者
 *       (如同 QQ 中的离线消息, 离线消息会被保存在服务器中, 接收人下次登陆上线之后, 可以重新收到消息)
 *
 *     - 如何使发布订阅对象拥有先发布后订阅的能力
 *       建立存放离线事件的堆栈, 当事件发布的时候, 如果此时没有订阅者来订阅这个事件, 我们暂时把发布事件的动作包裹在一个函数里,
 *       这些包装函数存入堆栈中, 等到终于有对象来订阅此事件的时候, 我们将遍历堆栈并且依次执行这些包装函数, 也就是重新发布里面的事件 (离线事件的生命周期只有一次)
 *
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

/**🌰 : 通用的发布订阅实现 */
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
installEvent(salesOffices);

/**🌰 : 取消订阅事件 */
event.remove = function (key, fn) {
  var fns = this.clientList[key];
  /**如果 key 对应的消息没有被人订阅, 则直接返回 */
  if (!fns) return;

  if (!fn) {
    /**如果没有传入具体的回调函数, 表示需要取消的 key 对应消息的所有订阅 */
    fns && (fns.length = 0);
  } else {
    /**反向遍历订阅的回调函数列表 */
    for (var l = fns.length - 1; l >= 0; l--) {
      var _fn = fns[l];
      /**删除订阅者的回调函数 */
      if (fn === _fn) fns.splice(l, 1);
    }
  }
};

var salesOffices = {}; // 定义售楼处

/**给 salesOffices 动态添加 发布订阅 */
installEvent(salesOffices);

/**用户一订阅消息 */
salesOffices.listen(
  'square:88',
  (fn1 = function (price) {
    console.log('价格：', price);
  })
);
/**用户二订阅消息 */
salesOffices.listen(
  'square:88',
  (fn2 = function (price) {
    console.log('价格：', price);
  })
);
/**删除用户一的订阅 */
salesOffices.remove('square:88', fn1);
salesOffices.trigger('square:88', 20000);

/**
 * 🌰 : 登陆使用发布订阅模式
 *
 * 对用户信息感兴趣的义务模块将自行订阅登陆成功的消息事件, 等登陆成功时, 登陆模块只需要发布登陆成功的消息,
 * 而业务方接受到消息之后, 就会开始进行各自的业务处理
 */

/**登陆成功 */
$.ajax('xxx.com', function (data) {
  /**发布登陆成功消息 */
  login.trigger('loginSuccess', data);
});
/**各个模块监听登陆成功的消息 */

/**header 模块 */
var header = (function () {
  login.listen('loginSuccess', function (data) {
    header.setAvatar(data.avatar);
  });
  return {
    setAvatar: function (data) {
      console.log('设置用户头像', data);
    },
  };
})();
/**nav 模块 */
var nav = (function () {
  login.listen('loginSuccess', function (data) {
    nav.setAvatar(data.avatar);
  });
  return {
    setAvatar: function (data) {
      console.log('设置nav头像', data);
    },
  };
})();
/**后续增加模块 */
var address = (function () {
  login.listen('loginSuccess', function (data) {
    address.refresh();
  });
  return {
    register: function (data) {
      console.log('刷新收货地址', data);
    },
  };
})();

/**
 * 🌰 : 全局的发布订阅模式
 *
 * - 上述代码存在问题
 *
 *    - 我们给每个发布者对象都添加了 listen 和 trigger 方法, 以及缓存列表 clientList, 这其实是一种资源浪费
 *    - 用户和 salesOffices 还是存在一定的耦合度, 至少需要知道 salesOffices 才能顺利订阅到事件
 *
 * - 但其实我们只要把订阅的请求交给中介, 而其他发布者都只需要将消息发布委托给中介, 这样我们不关心消息来自哪个发布者, 只要在意能不能收到消息 (发布者和订阅者都必须知道这个中介)
 */
var Event = (function () {
  var clientList = [],
    listen,
    trigger,
    remove;

  listen = function (key, fn) {
    if (!clientList[key]) clientList[key] = [];
    clientList[key].push(fn);
  };

  trigger = function () {
    var key = Array.prototype.shift.call(arguments),
      fns = clientList[key];

    if (!fns || fns.length === 0) return false;

    for (var i = 0, fn; (fn = fns[i++]); ) {
      fn.apply(this, arguments);
    }
  };

  remove = function (key, fn) {
    var fns = clientList[key];
    if (!fns) return;

    if (!fn) {
      fns && (fns.length = 0);
    } else {
      for (var l = fns.length - 1; l >= 0; l--) {
        var _fn = fns[l];
        if (_fn === fn) fns.splice(l, 1);
      }
    }
  };

  return { listen, trigger, remove };
})();

Event.listen('square:99', function (data) {
  console.log('价格:', data);
});

Event.trigger('square:99', 20000);

/**
 * 🌰 : 模块间通信
 *
 * 现在有两个按钮, a 模块里面有个按钮, 每次点击按钮之后, b 模块会显示按钮的点击次数
 */

/**
 * <!--a 模块 -->
 * <button id="count">点击</button>
 * <!--b 模块 -->
 * <div id="show"></div>
 */
var a = (function () {
  var count = 0;
  var button = document.getElementById('count');
  button.onclick = function () {
    Event.trigger('add', count++);
  };
})();

var b = (function () {
  var div = document.getElementById('show');
  Event.listen('add', function (data) {
    div.innerHTML = data;
  });
})();

/**
 * 🌰 : 解决全局事件的命名冲突 (给 Event 对象提供创建命名空间的功能)
 */
var Event = (function () {
  var global = this,
    Event,
    _default = 'default';

  Event = (function () {
    var _listen,
      _trigger,
      _remove,
      _slice = Array.prototype.slice,
      _shift = Array.prototype.shift,
      _unshift = Array.prototype.unshift,
      namespaceCache = {},
      _create,
      find,
      each = function (ary, fn) {
        var ret;
        for (var i = 0, len = ary.length; i < len; i++) {
          var n = ary[i];
          ret = fn.call(n, i);
        }
        return ret;
      };

    _listen = function (key, fn, cache) {
      if (!cache[key]) cache[key] = [];
      cache[key].push(fn);
    };

    _remove = function (key, cache, fn) {
      if (cache[key]) {
        if (fn) {
          for (var i = cache[key].length; i >= 0; i--) {
            if (cache[key][i] === fn) cache[key].splice(i, i);
          }
        } else {
          cache[key] = [];
        }
      }
    };

    _trigger = function () {
      var cache = _shift.call(arguments),
        key = _shift.call(arguments),
        args = arguments,
        _self = this,
        stack = cache[key];

      if (!stack || !stack.length) return;

      return each(stack, function () {
        return this.apply(_self, args);
      });
    };

    _create = function (namespace = _default) {
      var cache = {},
        offlineStack = []; // 离线事件的生命周期只有一次

      ret = {
        listen: function (key, fn, last) {
          _listen(key, fn, cache);
          if (offlineStack === null) return;
          if (last === 'last') {
            offlineStack.length && offlineStack.pop();
          } else {
            each(offlineStack, function () {
              this();
            });
          }
          offlineStack = null;
        },

        one: function (key, fn, last) {
          _remove(key, cache);
          this.listen(key, fn, last);
        },

        remove: function (key, fn) {
          _remove(key, fn);
        },

        trigger: function () {
          var fn,
            args,
            _self = this;

          _unshift.call(arguments, cache);

          args = arguments;

          fn = function () {
            return _trigger.apply(_self, args);
          };

          if (offlineStack) return offlineStack.push(fn);

          return fn();
        },
      };

      return namespace ? (namespaceCache[namespace] ? namespaceCache[namespace] : (namespaceCache[namespace] = ret)) : ret;
    };

    return {
      create: _create,
      one: function (key, fn, last) {
        var event = this.create();
        event.one(key, fn, last);
      },
      remove: function (key, fn) {
        var event = this.create();
        event.remove(key, fn, last);
      },
      listen: function (key, fn, last) {
        var event = this.create();
        event.listen(key, fn, last);
      },
      trigger: function () {
        var event = this.create();
        event.trigger.apply(this, arguments);
      },
    };
  })();

  return Event;
})();

/**先发布后订阅 */
Event.trigger('click', 1);

Event.listen('click', function (a) {
  console.log(a);
});

/**使用命名空间 */
Event.create('namespace1').listen('click', function (a) {
  console.log(a);
});
Event.create('namespace1').trigger('click', 1);

Event.create('namespace2').listen('click', function (a) {
  console.log(a);
});
Event.create('namespace2').trigger('click', 2);
