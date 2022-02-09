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

/**
 * 2. 延续局部变量的寿命
 *    img 对象经常用于进行数据上报
 *    但是一些低版本浏览器的实现存在 bug, 调用 report 函数进行数据上报会丢失 30% 左右的数据, 也就是说 report 函数并不是每条都成功发起了 HTTP 请求
 *    丢失数据的原因是 img 是 report 函数中的局部变量, 当 report 函数调用结束后, img 局部变量随即销毁
 *    而此时好没来得及发出 HTTP 请求, 那么此次请求就会丢失掉
 */

/**丢失代码 */
var report1 = function (src) {
  var img = new Image();
  img.src = src;
};
report1('xxx');

/**使用闭包 */
var report2 = (function () {
  var imgs = [];
  return function (src) {
    var img = new Image();
    imgs.push(src);
    img.src = src;
  };
})();

/**
 * 闭包和面向对象设计
 *
 * 过程与数据的结合是形容面向对象中的对象时经常使用的表达
 * 对象以方法的形态包含过程, 而闭包则是在过程中以环境的形式包含了数据
 **/
var extent1 = function () {
  var value = 0;
  return {
    call: function () {
      value++;
      console.log(value);
    },
  };
};
var extent1 = extent1();
extent1.call(); // 1
extent1.call(); // 2
extent1.call(); // 3

/**面向对象写法 */
var extent2 = {
  value: 0,
  call: function () {
    this.value++;
    console.log(thos.value);
  },
};
extent2.call(); // 1
extent2.call(); // 2
extent2.call(); // 3

/**构造函数写法 */
var Extent3 = function () {
  this.value = 0;
};
Extent3.prototype.call = function () {
  this.value++;
  console.log(this.value);
};
var extent3 = new Extent3();
extent3.call(); // 1
extent3.call(); // 2
extent3.call(); // 3

/**
 * 用闭包实现命令模式
 *
 * 命令模式
 * 意图: 把请求封装为对象, 从而分离请求的发起者和请求的接收者(执行者)之间的耦合关系
 *       在命令被执行之前, 可以预先往命令对象中植入命令的接收者
 *
 * 但在 JavaScript 中, 函数作为一等公民, 本身就可以四处传递, 用函数对象而不是普通对象来封装请求显得更加简单和自然
 * 如果需要往函数对象中预先植入命令的接收者, 那么闭包可以完成这个工作
 *
 * 在面向对象版本的命令模式中, 预先植入的命令接收者被当成对象的属性保存起来
 * 在闭包版本的命令模式中, 命令模式接收者会被封闭的闭包形成的环境中
 **/

var Tv = {
  open: function () {
    console.log('open the tv');
  },
  close: function () {
    console.log('close the tv');
  },
};

/**面向对象编写命令模式 */
var OpenTvCommand = function (receiver) {
  this.receiver = receiver;
};

OpenTvCommand.prototype.execute = function () {
  this.receiver.open(); // 执行命令, 打开电视机
};

OpenTvCommand.prototype.undo = function () {
  this.receiver.close(); // 撤销命令, 关闭电视机
};

/**闭包版本 */
var createCommand = function (receiver) {
  var execute = function () {
    return receiver.open(); // 执行命令, 打开电视机
  };
  var undo = function () {
    return receiver.close(); // 撤销命令, 关闭电视机
  };
  return { execute, undo };
};

var setCommand = function (command) {
  document.getElementById('execute').onclick = function () {
    command.execute(); // 输出: 打开电视机
  };
  document.getElementById('undo').onclick = function () {
    command.undo(); // 输出: 关闭电视机
  };
};

/**面向对象 */
setCommand(new OpenTvCommand(Tv));

/**闭包 */
setCommand(createCommand(Tv));

/**
 * 闭包和内存管理
 * 
 * 局部变量应该在函数退出的时候就接触引用, 但如果局部变量被封闭在闭包形成的环境中, 那么这个局部就能一直生存下去(闭包会使一些数据无法被及时销毁)
 * 
 * 使用闭包的一部分原因是我们选择主动把一些变量封闭在闭包中, 因为可能在以后还需要使用这些变量,把这些变量放在闭包中和放在全局作用域, 对内存方面的影响是一致的, 这里并不能说成是内存泄露
 * 如果在将来需要回收这些变量, 可以手动把这些变量设为 null
 * 
 * 闭包跟内存泄露的有关系地方
 * 使用闭包的同时比较容易形成循环引用, 如果闭包的作用域链中保存着一些 DOM 节点, 这时候就有可能造成内存泄露
 * 
 * 原因: 并非闭包和 JavaScript 的问题, 在 IE 浏览器中, 由于 BOM 和 DOM 中的对象是使用 C++ 以 COM 对象的方式实现的, 而 COM 对象的垃圾收集机制采用的引用计数策略。
 *      在基于引用计数策略的垃圾回收机制中, 如果两个对象之间形成了循环引用, 那么这两个对象都无法被回收, 但循环引用造成的内存泄露在本质上也不是闭包造成的 
 * 
 * 解决循环引用造成的内存泄露: 只需要把循环引用中的变量设置为 nuLl 即可。  
 *                         将变量设置为 null 意味着切断变量与它此前引用的值之间的连接, 当垃圾回收机制执行时, 就会删除这些值并回收它们占有的内存
 **/
