/**
 * 高阶函数
 *
 * 1. 高阶函数是至少满足下列条件之一的函数
 *    - 函数可以作为参数被传递
 *    - 函数可以作为返回值输出
 */

/**
 * 函数作为参数被传递
 *  1. 应用场景
 *      - 回调函数
 */

/**
 * 回调函数
 *
 * 在 ajax 异步请求的应用中, 使用最频繁
 * 当想在 ajax 请求返回之后做一些操作, 但又不知道请求返回的时间, 最常见的方案就是把 callback 函数当成参数传入发起 ajax 请求的方法中, 待请求完成之后执行 callback 函数
 */
var getUserInfo = function (userId, callback) {
  $.ajax('https://xxx.com/getUserInfo?id=' + userId, function (data) {
    if (typeof callback === 'function') callback(data);
  });
};

getUserInfo(1, function (data) {
  console.log(data);
});

/**
 * 当一个函数不适合执行一些请求时, 我们也可以把这些请求封装成一个函数
 * 并把它作为参数传递给另外一个函数, 委托给另外一个函数来执行
 */

/**🌰 创建 100 个 div 节点, 然后把这些节点隐藏 */

/**直接版 */
var appendDiv = function () {
  for (var i = 0; i < 100; i++) {
    var div = document.createElement('div');
    div.innerHTML = i;
    document.body.appendChild(div);
    div.style.display = 'none';
  }
};
appendDiv();

/**回调函数版本 */
var appendDiv1 = function (callback) {
  for (var i = 0; i < 100; i++) {
    var div = document.createElement('div');
    div.innerHTML = i;
    document.body.appendChild(div);
    if (typeof callback === 'function') callback(div);
  }
};

appendDiv1(function (node) {
  node.style.display = 'none';
});

/**
 * 函数作为返回值输出
 * 让函数继续返回一个可执行的函数, 意味着运算过程是可延续的
 **/

/**判断类型 */
var isType = function (type) {
  return function (obj) {
    return Object.prototype.toString.call(obj) === `[Object ${type}]`;
  };
};

var isString = isType('String');
var isArray = isType('Array');
var isNumber = isType('Number');

console.log(isArray([1, 2, 3])); // true

/**批量注册 isType 函数 */
var Type = {};
for (var i = 0, type; (type = ['String', 'Array', 'Number'][i++]); ) {
  (function (type) {
    Type['is' + type] = function (obj) {
      return Object.prototype.toString.call(obj) === `[Object ${type}]`;
    };
  })(type);
}

/**单例模式 */

/**既把函数当作参数传递, 又让函数执行后返回了另外一个函数 */
var getScript = function (fn) {
  var ret;
  return function () {
    return ret || (ret = fn.apply(this, arguments));
  };
};

var script1 = getScript(function () {
  return document.createElement('script');
});

var script2 = getScript(function () {
  return document.createElement('script');
});
console.log(script2 === script1); // true

/**
 * 高阶函数实现 AOP
 *
 * AOP(面向切面编程)的主要作用
 *      把一些跟核心业务逻辑无关的功能抽离出来,
 *      这些跟业务逻辑无关的功能包括日志统计、安全控制、异常处理等
 *      把这些功能抽离出来之后, 再通过"动态织入"的方式掺入业务逻辑模块中
 *
 * 好处
 *      1. 保持业务逻辑模块的纯净和高内聚性
 *      2. 很方便的复用日志统计等功能模块
 *
 * 实现
 *      把一个函数"动态织入"到另外一个函数之中,
 *      可通过扩展 Function.prototype 实现
 */
Function.prototype.before = function (beforeFn) {
  var _self = this; // 保存原函数的引用
  return function () {
    // 返回包含了原函数和新函数的 "代理" 函数
    beforeFn.apply(this, arguments); // 执行新函数, 修正 this
    return _self.apply(this, arguments); // 执行原函数
  };
};
Function.prototype.after = function (afterFn) {
  var _self = this;
  return function () {
    var ret = _self.apply(this, arguments);
    afterFn.apply(this, arguments);
    return ret;
  };
};

var func1 = function () {
  console.log(2);
};
func1 = func1
  .before(function () {
    console.log(1);
  })
  .after(function () {
    console.log(3);
  }); // 1 => 2 => 3

/**
 * currying
 *
 * 又称部分求值, 一个 currying 的函数首先会接受一些参数, 接受参数该函数并不会立即求值, 而是继续返回另外一个函数
 * 刚才传入的参数在函数形成的闭包中被保存起来
 * 待到函数被真正需要求值的时候, 之前传入的所有参数都会被一次性用于求值
 **/

/**
 * 🌰 计算每月开销, 在每天结束之前, 记录今天花销
 */
var monthlyCost = 0;
var cost = function (money) {
  monthlyCost += money;
};
cost(100); /**第一天开销 */
cost(200); /**第二天开销 */
cost(300); /**第三天开销 */

/**
 * 但我们并不关心每天的开销, 只想知道月底的开销, 也就是只需要月底计算一次
 * 保存好当天的开销, 直到 30 天后求值计算
 */
var cost1 = (function () {
  var args = [];
  return function () {
    if (arguments.length === 0) {
      var money = 0;
      for (var i = 0, len = arguments.length; i < len; i++) {
        money += args[i];
      }
      return money;
    } else {
      [].push.apply(args, arguments);
    }
  };
})();
cost1(100); // 未求值
cost1(200); // 未求值
cost1(300); // 未求值

console.log(cost1()); // 600

/**
 * 通用的 currying 函数
 * 接受一个参数, 即将要被 currying 的函数
 */
var currying = function (fn) {
  var args = [];
  return function () {
    if (arguments.length === 0) {
      /**不带参数, 才利用前面保存的所有参数进行数值计算 */
      return fn.apply(this, arguments);
    } else {
      /**明确带上了参数, 不进行求值, 而是保存参数, 返回一个函数 */
      [].push.apply(args, arguments);
      return arguments.callee;
    }
  };
};

var cost2 = (function () {
  var money = 0;
  return function () {
    for (var i = 0, len = arguments.length; i < len; i++) money += arguments[i];
    return money;
  };
})();

var cost2 = currying(cost2);

cost2(100); // 未求值
cost2(200); // 未求值
cost2(300); // 未求值

console.log(cost2()); // 600

/**
 * uncurrying: 把泛化 this 的过程提取出来
 *
 * 当我们调用对象的某个方法时, 其实不用关心该对象原本是否被设计为拥有这个方法, 一个对象也未必只能使用它自身的方法
 */

/**让对象去借用一个原本不属于他的方法 */
var obj1 = { name: 'sven1' };
var obj2 = {
  getName: function () {
    return this.name;
  },
};
console.log(obj2.getName.call(obj1)); // sven1

/**
 * 让类数组对象去借用 Array.prototype 的方法
 *
 * Array.prototype 上的方法原本只能用来操作 array 对象, 但用 call 和 apply 可以把任意对象当作 this 传入某个方法
 * 这样一来, 方法中用到 this 的地方就不再局限于原来规定的对象
 **/
(function () {
  Array.prototype.push.call(arguments, 4); // arguments 借用 Array.prototype.push 方法
  console.log(arguments); // [1, 2, 3, 4]
})(1, 2, 3);

/**uncurrying 实现方式 */
Function.prototype.uncurrying = function () {
  var self = this;
  return function () {
    var obj = Array.prototype.shift.call(arguments);
    return self.apply(obj, arguments);
  };
};

/**uncrrying 使用 */

/**
 * 先把 Array.prototype.push.call 转化为通用的 push 方法
 * 作用就跟 Array.prototype.push 一样, 同样不仅仅局限于只能操作 array 对象
 **/
var push = Array.prototype.push.uncurrying();
(function () {
  push(arguments, 4);
  console.log(arguments); // [1, 2, 3, 4]
})(1, 2, 3);

/**
 * 一次性把 Array.prototype 上的方法 复制到 array 对象上
 */
for (var i = 0, fn, ary = ['push', 'shift', 'forEach']; (fn = ary[i++]); ) {
  Array[fn] = Array.prototype[fn].uncurrying();
}

var obj = { length: 3, 0: 1, 1: 2, 2: 3 };

Array.push(obj, 4); // obj.length => 4
var first = Array.shift(obj); // 1 

Array.forEach(obj, function (i, n){
    console.log(n); // 0, 1, 2
})

