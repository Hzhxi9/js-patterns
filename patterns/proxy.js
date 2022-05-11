/**
 * 代理模式
 *   - 定义: 为一个对象提供一个代用品或占位符, 以便控制对它的控制
 *   - 关键: 当客户不方便直接访问一个对象或者不满足需要的时候, 提供一个替身对象来控制对这个对象的访问, 客户实际上访问的是替身对象
 *          替身对象对请求做出一些处理之后, 再把请求转交给本体对象
 *
 * 保护代理 & 虚拟代理
 *    - 保护代理: 代理 B 可以帮助 A 过滤掉一些请求, 比如送花的人年龄太大或者没有宝马, 这种请求就可以直接在代理 B 处被拒绝掉
 *               A 和 B 一个充当白脸, 一个充当黑脸, 白脸 A 继续保持良好的女生形象, 不希望直接拒绝任何人, 于是找来 B 来控制对 A 的访问
 *               (用于控制不同权限的对象对目标对象的访问)
 *
 *    - 虚拟代理: new Flower 可能是一个代价昂贵的操作, 将 new Flower 的操作交给代理 B 去执行, 代理 B 会等 A 心情好的时候再执行 new Flower
 *               虚拟代理把一些开销很大的对象, 延迟到真正需要它的时候才去创建
 *
 * 意义:
 *     - 面向对象设计原则: 单一职责原则
 *         就一个类(通常也包括对象和函数等)而言, 应该仅有一个引起它变化的原因
 *         如果一个对象承担了多项职责, 就意味着这个对象将变得巨大, 引起它变化的原因可能会有多个
 *         面向对象设计鼓励将行为分布到细粒度的对象之中, 如果一个对象承担的职责过多, 等于把这些职责耦合到了一起, 这种耦合会导致脆弱和低内聚的设计
 *         当变化发生时, 设计可能会遭到意外的破坏
 *
 *     - 职责: 引起变化的原因
 *         我们在处理其中一个职责时, 有可能因为其强耦合性影响另外一个职责的实现
 *
 *     - 在面向对象设计中, 大多数情况下, 若违反其他任何原则, 同时将违反"开放-封闭"原则
 *
 *     - 因为我们需要的只是给 img 节点设置 src, 预加载图片只是一个锦上添花的功能
 *       所以我们把这个操作放在代理对象上, 代理负责预加载图片, 操作完成之后, 把请求重新交给本体 previewImage
 *
 *  代理 & 本体 接口的一致性
 *      如果我们不在需要预加载, 可以选择直接请求本体, 其中关键就是本体和代理对象都对外提供了 setSrc 方法
 *      在客户看来, 代理对象和本体是一致的, 代理接手请求的过程对于用户来说是透明的, 用户并不清楚代理和本体的区别
 *
 *      - 用户可以放心的请求代理, 他只关心是否能够得到想要的结果
 *      - 在任何使用本体的地方都可以替换成使用代理
 *
 *  其他代理:
 *    1. 防火墙代理: 控制网络资源的访问, 保护主机不让坏人接近
 *    2. 远程代理: 为一个对象在不同的地址空间提供局部代表, 在 Java 中, 远程代理可以是另一个虚拟机中的对象
 *    3. 保护代理: 用于对象应该有不同的访问权限的情况
 *    4. 智能引用代理: 取代了简单的指针, 他在访问对象时执行一些附加操作, 比如计算一个对象被引用的次数
 *    5. 写时复制代理: 通常用于复制一个庞大对象的情况, 写时复制代理延迟了复制的过程, 当对象被真正修改时, 才对它进行复制操作
 *                   写时复制代理是虚拟代理的一种变体, DLL(操作系统中的动态链接库)是其典型运用场景
 */

/**🌰 : 小明送花 */

/**1. 不用代理模式 */
var Flower = function () {};

var xiaoming = {
  sendFlower: function (target) {
    var flower = new Flower();
    target.receiveFlower(flower);
  },
};

var A = {
  receiveFlower: function (flower) {
    console.log('收到花' + flower);
  },
};

xiaoming.sendFlower(A);

/**2. 使用代理模式 */
var Flower = function () {};

var xiaoming = {
  sendFlower: function (target) {
    var flower = new Flower();
    target.receiveFlower(flower);
  },
};

/**代理B */
var B = {
  receiveFlower: function (flower) {
    A.receiveFlower(flower);
  },
};

var A = {
  receiveFlower: function (flower) {
    console.log('收到花' + flower);
  },
};

xiaoming.sendFlower(B);

/**
 * 🌰 : 小明送花: 代理监听目标
 */
var Flower = function () {};

var xiaoming = {
  sendFlower: function (target) {
    var flower = new Flower();
    target.receiveFlower(flower);
  },
};

var B = {
  receiveFlower: function (target) {
    /**监听 A 的好心情 */
    A.listenGoodMood(function () {
      target.receiveFlower(flower);
    });
  },
};

var A = {
  receiveFlower: function (flower) {
    console.log('收到花' + flower);
  },
  /**假设 10 秒后 A 的心情变好 */
  listenGoodMood: function (fn) {
    setTimeout(() => {
      fn();
    }, 10 * 1000);
  },
};

xiaoming.sendFlower(B);

/**
 * 🌰 : 虚拟代理实现图片预加载
 *    - 使用场景: 如果直接给某个 img 标签节点设置 src 属性, 由于图片过大或者网络不佳, 图片的位置往往有段时间会是一片白色
 *    - 解决方案: 先用一张 loading 图片占位, 然后用异步加载图片, 等图片加载好了再把它填充到 img 节点里
 **/

/**1. 创建一个普通的本体对象, 负责往页面中创建一个 img 标签 */
var previewImage = (function () {
  var image = document.createElement('img');
  document.body.appendChild(image);
  return {
    /**
     * 提供一个对外的 setSrc 接口
     * 外界调用这个接口, 可以给 img 标签设置 src 属性
     **/
    setSrc: function (src) {
      image.src = src;
    },
  };
})();

var proxyImage = (function () {
  var img = new Image();
  img.onload = function () {
    previewImage.setSrc(this.src);
  };
  return {
    setSrc: function (src) {
      /**图片被真正加载好之前, 页面出现占位图 */
      previewImage.setSrc('loading.gif');
      img.src = src;
    },
  };
})();

proxyImage('xxx.png');

/**
 * 🌰 : 虚拟代理合并 HTTP 请求
 *   文件同步功能: 选中一个 checkbox 的时候, 他对应的文件就会被同步到另外一台备用服务器上面
 */

/**
 * <body>
 *      <input type="checkbox" id="1" />
 *      <input type="checkbox" id="2" />
 *      <input type="checkbox" id="3" />
 *      <input type="checkbox" id="4" />
 *      <input type="checkbox" id="5" />
 *      <input type="checkbox" id="6" />
 *      <input type="checkbox" id="7" />
 *      <input type="checkbox" id="8" />
 * </body>
 */

var syncHronousFiles = function (id) {
  console.log('开始同步文件, id 为:' + id);
};

var checkboxes = document.getElementsByName('input');

for (var i = 0, c; (c = checkboxes[i++]); ) {
  c.onclick = function () {
    /**@warning 一秒点击多次, 频繁网络请求, 会给服务器代理相当大的开销  */
    if (this.checked) syncHronousFiles(this.id);
  };
}

/**
 * 解决方案
 *   通过一个代理函数 proxySyncHronousFiles 来收集一段时间之内的请求, 最后一次性发送给服务器
 *   比如等待 2 秒之后才把这 2 秒之内需要同步的文件 ID 打包发给 服务器
 **/
var proxySyncHronousFiles = (function () {
  var cache = [] /**保存一段时间内需要同步的 ID */,
    timer /**定时器 */;
  return function (id) {
    cache.push(id);
    /**保证不会覆盖已经启动的定时器 */
    if (timer) return;

    timer = setTimeout(function () {
      syncHronousFiles(cache.join(',')); /**2 秒后向本体发送需要同步的 ID 集合 */
      clearTimeout(timer); /**清空定时器 */
      timer = null;
      cache.length = 0; /**清空 ID 集合 */
    }, 2000);
  };
})();

var checkboxes = document.getElementsByName('input');

for (var i = 0, c; (c = checkboxes[i++]); ) {
  c.onclick = function () {
    if (this.checked) proxySyncHronousFiles(this.id);
  };
}

/**
 * 🌰 : 虚拟代理在惰性加载中的应用(miniConsole.js)
 *
 * 需求: 希望有必要的时候才开始加载它, 比如当用户按下 F12 来主动唤出控制台的时候
 *
 * 实现:
 *      - 在 miniConsole 加载之前, 为了能够让用户正常地使用里面的 API, 我们会使用一个占位的 miniConsole 的代理对象给用户提前使用
 *        这个对象提供给用户的接口, 跟实际 miniConsole 是一样的
 *
 *      - 在 miniConsole 加载之前, 我们可以把打印 log 的请求都包裹在一个函数里面, 这个包装了请求的函数就先相当于其他语言中命令模式中的 Command 对象
 *        随后这些函数将全部被放到缓存队列中, 这些逻辑都是在 miniConsole 代理对象中完成实现
 *
 *      - 开始加载真正的 miniConsole, 在加载完成之后将遍历 miniConsole 代理对象中的缓存函数队列, 同时依次执行它们
 */

/**未加载真正的 miniConsole 之前的代码 */
var cache = [];
var miniConsole = {
  log: function () {
    var args = arguments;
    cache.push(function () {
      return miniConsole.log.apply(miniConsole, args);
    });
  },
};

miniConsole.log(1);

/**按下 F12, 开始加载真正的 miniConsole */
var handler = function (ev) {
  if (ev.keyCode === 113) {
    var script = document.createElement('script');
    script.onload = function () {
      for (var i = 0, fn; (fn = cache[i++]); ) fn();
    };
    script.src = 'miniConsole.js';
    document.getElementsByTagName('head')[0].appendChild(script);
  }
};

document.body.addEventListener('keydown', handler, false);

/**miniConsole.js */
miniConsole = {
  log: function () {
    console.log(Array.prototype.join.call(arguments));
  },
};

/**
 * @fixme 保证 F12 被重复按下的时候, miniConsole 只被加载一次
 * 将 miniConsole 处理成一个标准的虚拟代理对象
 */
var miniConsole = (function () {
  var cache = [];
  var handler = function (ev) {
    if (ev.keyCode === 113) {
      var script = document.createElement('script');
      script.onload = function () {
        for (var i = 0, fn; (fn = cache[i++]); ) fn();
      };
      script.src = 'miniConsole.js';
      document.getElementsByTagName('head')[0].appendChild(script);
      document.body.removeEventListener('keydown', handler); // 只被加载一次 miniConsole
    }
  };

  document.body.addEventListener('keydown', handler, false);

  return {
    log: function () {
      var args = arguments;
      cache.push(function () {
        return miniConsole.log.apply(miniConsole, args);
      });
    },
  };
})();

miniConsole.log(1); // 开始打印 log

/**miniConsole.js */
miniConsole = {
  log: function () {
    console.log(Array.prototype.join.call(arguments));
  },
};

/**@description 缓存代理: 可以为一些开销大的运算结果提供暂时的存储, 在下次运算的时候, 如果传进来的参数跟之前一致, 则可以直接返回前面存储的运算结果 */

/**🌰 : 计算乘积 */
var mult = function () {
  var a = 1;
  for (var i = 0, l = arguments.length; i < l; i++) {
    a *= arguments[i];
  }
  return a;
};

var proxy_mult = (function () {
  var cache = {};
  return function () {
    var args = Array.prototype.join.call(arguments, ',');
    if (args in cache) return cache[args];
    return (cache[args] = mult.apply(this, arguments));
  };
})();

proxy_mult(1, 2, 3, 4); // 24
proxy_mult(1, 2, 3, 4); // 24

/**
 * 🌰 : ajax 异步请求数据
 * @description 请求数据是个异步的操作, 无法直接把计算结果放到代理对象的缓存中, 而是要通过回调的方式
 **/

/**
 * 🌰 : 用高阶函数动态创建代理
 */

/**计算乘积 */
var mult = function () {
  var a = 1;
  for (var i = 0, l = arguments.length; i < l; i++) a *= arguments[i];
  return a;
};

/**计算加法 */
var plus = function () {
  var a = 0;
  for (var i = 0, l = arguments.length; i < l; i++) a += arguments[i];
  return a;
};

/**创建缓存代理工厂 */
var createProxyFactory = function (fn) {
  var cache = {};
  return function () {
    var args = Array.prototype.join.call(arguments);
    if (args in cache) return cache[args];
    return (cache[args] = fn.apply(this, arguments));
  };
};

var proxy_mult = createProxyFactory(mult),
  proxy_plus = createProxyFactory(plus);

console.log(proxy_plus(1, 2, 3, 4)); // 10
console.log(proxy_plus(1, 2, 3, 4)); // 10
