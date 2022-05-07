/**
 * 单例模式: 保证一个类仅有一个实例, 并提供一个访问它的全局访问点
 *    - 应用场景： 线程池、全局缓存、浏览器中的 window 对象、登陆弹窗
 *    - 原理：用一个变量来标志当前是否已经是否已经为某个类创建过对象, 如果是则在下次获取该类的实例, 直接返回之前创建创建的对象
 */

/**
 * 🌰 : 不透明单例模式
 *  通过 Singleton.getInstance 获取 Singleton 唯一实例
 *  缺点:增加这个类的不透明性, Singleton 类的使用者必须知道这是一个单例类
 */
var Singleton = function (name) {
  this.name = name;
};
Singleton.instance = null;

Singleton.prototype.getName = function () {
  console.log(this.name);
};

Singleton.getInstance = function (name) {
  if (!this.instance) this.instance = new Singleton(name);
  return this.instance;
};

var a = Singleton.getInstance('sven1');
var b = Singleton.getInstance('sven2');
console.log(a === b); // true

var Singleton = function (name) {
  this.name = name;
};
Singleton.prototype.getName = function () {
  console.log(this.name);
};
Singleton.getInstance = (function () {
  var instance = null;
  return function (name) {
    if (!instance) instance = new Singleton(name);
    return instance;
  };
})();

var a = Singleton.getInstance('sven1');
var b = Singleton.getInstance('sven2');
console.log(a === b); // true

/**
 * 🌰 : 透明单例模式, 用户从这个类创建对象的时候, 可以像使用其他任何普通类一样
 * 需求: 使用 CreateDiv 单例类负责在页面创建唯一的 div 节点
 *
 * 缺点: 为了把 instance 封装起来, 使用了自执行的匿名函数和闭包, 并且让这个匿名函数返回真正的 Singleton 的构造方法, 增加了一些程序的复杂度
 */
var CreateDiv = (function () {
  var instance;

  /**
   * 负责了两件事
   * 1. 创建对象和执行初始化 init 方法
   * 2. 保证只有一个对象
   * 违背了"单一指责原则"
   * @param {*} html
   * @returns
   */
  var CreateDiv = function (html) {
    if (instance) return instance;
    this.html = html;
    this.init();
    return (instance = this);
  };

  CreateDiv.prototype.init = function () {
    var div = document.createElement('div');
    div.innerHTML = this.html;
    document.body.appendChild(div);
  };

  return createDiv;
})();

var a = new CreateDiv('a');
var b = new CreateDiv('b');
console.log(a === b);

/**
 * 🌰 : 用代理实现单例模式
 *
 */
var CreateDiv = function (html) {
  this.html = html;
  this.init();
};

CreateDiv.prototype.init = function () {
  var div = document.createElement('div');
  div.innerHTML = this.html;
  document.body.appendChild(div);
};

/**
 * 负责管理单例的逻辑移动到代理类中, CreateDiv 就变成了普通类
 */
var ProxySingletonCreateDiv = (function () {
  var instance;
  return function (html) {
    if (!instance) instance = new CreateDiv(html);
    return instance;
  };
})();

var a = new CreateDiv('a');
var b = new CreateDiv('b');
console.log(a === b);

/**全局变量的管理, 减少命名空间污染 */

/**1. 使用命名空间: 适当使用命名空间, 并不会杜绝全局变量, 但可以减少全局变量的数量 */
var namespace = {
  a: function () {
    console.log('a');
  },
  b: function () {
    console.log('b');
  },
};

/**动态创建命名空间 */
var app = {};
app.namespace = function (name) {
  var parts = name.split('.');
  var current = app;
  for (var i in parts) {
    if (!current[parts[i]]) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
};

app.namespace('event');
app.namespace('dom.style');

console.dir(app);

/**
 * 等价于:
 * var app = {
 *   event: {},
 *   dom: { style: {} },
 * }
 */

/**2. 使用闭包封装私有变量: 这种方法把一些变量封装在闭包内部, 只暴露一些接口跟外界通信 */
var user = (function () {
  /**约定下划线定义私有变量 _name & _age */
  var _name = 'sven',
    _age = 18;
  return {
    getUserInfo: function () {
      return _name + '-' + _age;
    },
  };
})();

/**
 * 惰性单例: 在需要的时候才创建对象实例
 * 需求: WebQQ 登陆弹窗
 **/

/**
 * 第一种解决方法:
 *      页面加载完成的时候就创建好这个 div 弹窗
 *      一开始是隐藏状态, 用户点击登陆按钮, 才开始显示
 * 存在问题:
 *      不需求登陆操作, 一开始就创建登陆弹窗会浪费一些 DOM 节点
 **/
var loginLayer = (function () {
  var div = document.createElement('div');
  div.innerHTML = '登陆弹窗';
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
})();

document.getElementById('login-btn').onclick = function () {
  loginLayer.style.display = 'block';
};

/**
 * 改动: 用户点击登陆按钮才开始创建弹窗
 * 缺点: 达到了惰性效果, 失去了单例的意义, 频繁创建和删除节点不合理也没有必要
 */
var createLoginLayer = function () {
  var div = document.createElement('div');
  div.innerHTML = '登陆弹窗';
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
};
document.getElementById('login-btn').onclick = function () {
  var loginLayer = createLoginLayer();
  loginLayer.style.display = 'block';
};

/**
 * 改动: 用一个变量来判断是否已经创建好弹窗
 * 缺点:
 *      - 违反单一指责原则, 创建对象和管理单例的逻辑都放在 createLoginLayer 对象内部
 *      - 没有复用性, 比如创建唯一的 iframe 节点需要重写一份
 */
var createLoginLayer = (function () {
  var div;
  return function () {
    if (!div) {
      div = document.createElement('div');
      div.innerHTML = '登陆弹窗';
      div.style.display = 'none';
      document.body.appendChild(div);
    }
    return div;
  };
})();
document.getElementById('login-btn').onclick = function () {
  var loginLayer = createLoginLayer();
  loginLayer.style.display = 'block';
};

/**
 * 改动；通用的惰性单例, 抽象管理单例的逻辑
 * 1. 这些逻辑被封装在 getSingle 函数内部, 创建对象的方法 fn 被当成参数动态传入 getSingle 函数
 * 2. 传入 创建登陆弹窗的方法, 再让 getSingle 返回一个新函数, 并且用变量 result 报错 fn 的计算结果 ( result 变量在闭包中永远不会被销毁 )
 */
var getSingle = function (fn) {
  var result;
  return function () {
    return result || (result = fn.apply(this, arguments));
  };
};

/**创建登陆弹窗 */
var createLoginLayer = function () {
  var div = document.createElement('div');
  div.innerHTML = '登陆弹窗';
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
};
var createSingleLoginLayer = getSingle(createLoginLayer);

document.getElementById('login-btn').onclick = function () {
  var loginLayer = createSingleLoginLayer();
  loginLayer.style.display = 'block';
};

/**创建唯一的 iframe */
var createSingleIframe = getSingle(function () {
  var iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  return iframe;
});
document.getElementById('login-btn').onclick = function () {
  var loginLayer = createSingleIframe();
  loginLayer.src = 'https: //www.baidu.com';
};

/**
 * 🌰 : 给第一次渲染列表绑定一次 click 事件
 * render 函数 & bindEvent 函数执行了三次, 但 div 节点只被绑定了一次
 */

/** 1. 借助 JQuery 选择给节点绑定 one 事件 */
var bindEvent = function () {
  $('div').one('click', function () {
    console.log('click');
  });
};
var render = function () {
  console.log('render list');
  bindEvent();
};
render();
render();
render();

/**2. 使用 getSingle 函数 */
var bindEvent = getSingle(function () {
  document.getElementById('div').addEventListener = function () {
    console.log('click');
  };
  return true;
});
var render = function () {
  console.log('render list');
  bindEvent();
};
render();
render();
render();
