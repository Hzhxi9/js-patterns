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
