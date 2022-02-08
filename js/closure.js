/**闭包 */

/**
 * 1. 变量的作用域: 变量的有效范围
 *    - 当在函数中声明一个变量的时候, 如果该变量前面没有带上关键字 var, 这个变量就好变成 全局变量
 *    - 用 var 关键字在函数中声明变量的时候, 这个时候变量即是局部变量, 只有在函数内部才能访问到这个变量, 函数外部访问不到
 *
 * 2. 函数可以创建函数作用域
 *    - 此时在函数里面可以看到外面的变量, 而在函数外面则无法看到函数里面的变量
 *    - 这是因为当在函数中搜索一个变量的时候, 如果该函数内没有声明这个变量, 那么此次搜索的过程会随着代码执行环境创建的作用域链往外层逐层搜索, 一直搜索到全局对象位置
 *    - 变量的搜索是从内到外的
 **/
var func1 = function () {
  var a = 1;
  console.log(a); // 1
};
func1();
// console.log(a); // a is not defined

var a1 = 1;
var func2 = function () {
  var b = 2;
  var func3 = function () {
    var c = 3;
    console.log(b); // 2
    console.log(a1); // 1
  };
  func3();
  //   console.log(c); // c is not defined
};
func2();

/**
 * 变量的生命周期
 *  - 全局变量: 永久, 除非主动销毁
 *  - 局部变量: 退出函数时, 这些局部变量即随着函数的调用结束而被销毁
 */

/**
 * 当退出函数后, 局部变量 a 并没有消失
 * 因为当执行 var f3 = func3() 时, f3 会返回一个匿名函数的引用, 它可以访问到 func() 被调用时产生的环境, 而局部变量一直处于这个环境里
 * 既然局部变量所在的环境还能被外界访问到, 这个局部变量就不被销毁
 */
var func3 = function () {
  var a = 1;
  return function () {
    a++;
    console.log(a, 'a');
  };
};
var f3 = func3();
f3();
f3();
f3();
f3();

/**
 * 页面有5个 div 节点, 通过循环给每个 div 绑定点击事件, 按照索引顺序, 点击 div 节点输入索引
 */
// var nodes = document.getElementsByTagName('div');
// for (var i = 0, len = nodes.length; i < len; i++) {
//   nodes[i].onclick = function () {
//     console.log(i);
//   };
// }

/**
 * 结果: 全是5
 * 原因: 因为 div 节点的 onclick 事件是被异步触发的, 当事件被触发, 循环早已结束, 此时 i 的值已经为 5
 * 解决办法: 使用闭包把每次循环的 i 封闭起来, 当在事件函数中顺着作用域链中从内到外查找变量 i 时, 会先找到被封闭在闭包环境中的 i
 **/
// for (var i = 0, lens = nodes.length; i < lens; i++) {
//   (function (i) {
//     nodes[i].onclick = function () {
//       console.log(i);
//     };
//   })(i); // 依次输入 0, 1, 2, 3, 4, 5(索引)
// }

/**再举个🌰 */
var Type = {};
for (var i = 0, type; (type = ['String', 'Array', 'Number'][i++]); ) {
  (function (type) {
    Type['is' + type] = function (obj) {
      return Object.prototype.toString.call(obj) === `[object ${type}]`;
    };
  })(type);
}
console.log(Type.isArray([]));
console.log(Type.isString('str'));

/**闭包的更多作用 */

/**
 * 1. 封装变量
 *    可以帮助一些不需要暴露在全局的变量封装成私有变量
 */

/**mult 函数接受一些 number 类型的参数, 并返回这些参数的乘积 */
var mult = function () {
  var a = 1;
  for (var i = 0, lens = arguments.length; i < lens; i++) a = a * arguments[i];
  return a;
};

/**
 * 那些相同的参数存进缓存
 * 加入缓存机制提高这个函数的性能
 **/
var cache = {};
var mult1 = function () {
  var args = Array.prototype.join.call(arguments, ',');
  if (cache[args]) return cache[args];

  var a = 1;
  for (var i = 0, lens = arguments.length; i < lens; i++) a = a * arguments[i];
  return (cache[args] = a);
};

console.log(mult1(1, 2, 3));
console.log(mult1(1, 2, 3));

/**
 * 👆代码中 cache 这个变量仅仅在 mult 函数中使用, 与其让 cache 变量跟 mult 函数一起平行暴露在全局作用域下, 不如把它封闭在函数内部里
 *    1. 减少页面的全局变量
 *    2. 避免这个变量在其他地方被不小心修改而引发错误
 */
var mult2 = (function () {
  var cache = {};
  return function () {
    var args = Array.prototype.join.call(arguments, ',');
    if (cache[args]) return cache[args];

    var a = 1;
    for (var i = 0, lens = arguments.length; i < lens; i++) a = a * arguments[i];
    return (cache[args] = a);
  };
})();

/**
 * 提炼函数
 *   将一个大函数内的能够独立出来一些代码块封装在独立出来的小函数里面
 *    - 提高复用性
 *    - 有良好的命名, 能起到注释的作用
 *
 *   如果这小小函数不需要在程序的其他地方使用, 最好将他们用闭包封装起来
 */
var mult3 = (function () {
  var cache = {};
  var calc = function () {
    var a = 1;
    for (var i = 0, len = arguments.length; i < len; i++) a = a * arguments[i];
    return a;
  };
  return function () {
    var args = Array.prototype.join.call(arguments, ',');
    if (cache[args]) return cache[args];
    return (cache[args] = calc.apply(null, arguments));
  };
})();
