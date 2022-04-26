/**
 * 多态
 *
 * 1. 概念
 *    同一操作作用于不同的对象上, 可以产生不同的解释和不同的执行结果
 *    也就是给不同的对象发生同一消息的时候, 这些对象会根据这个消息分别给出不同的反馈
 *
 * 2. 思想
 *    "做什么"和"谁去做以及怎么样去做"分离开来, 
 *    "不变的事物"和"可能改变的事物"分离开来
 *
 * 3. 原则
 *    相对于修改代码, 增加代码就能完成同样的功能, 就会更优雅和安全
 *
 * 4. 实现
 *    - 先要消除类型之间的耦合关系
 *
 * 5. 根本好处
 *    - 不必再向对象询问 "你是什么类型" 而后根据得到的答案调用对象的某个行为
 *      只管调用该行为, 其他一切多态机制都会为你安排妥当
 *    - 通过把过程化的条件分支语句转化为对象的多态性, 从而消除这些条件分支语句
 *
 * 6. 面向对象设计的优点
 *    - 每个对象应该做什么,已经成为了该对象的一个方法, 被安装在对象的内部,每个对象负责他们自己的行为
 *    - 将行为分布在各个对象中, 并让这些对象各自负责自己的行为
 */

/**
 * 关于多态的代码 
 * 
 * 无法令人满意: 后续需要新增, 需要改动 makeSound 函数, 会使 makeSound 函数越来越庞大
 **/
var makeSound = function (animal) {
  if (animal instanceof Duck) {
    console.log('嘎嘎嘎');
  } else if (animal instanceof Chicken) {
    console.log('咯咯咯');
  }
};

var Duck = function () {};
var Chicken = function () {};

makeSound(new Duck()); /**嘎嘎嘎 */
makeSound(new Chicken()); /**咯咯咯 */

/**修改后的代码 */
var makeSound = function (animal) {
  /**1. 分离不变的东西 */
  animal.sound();
};

/**2. 封装可变的部分 */
var Duck = function () {};
Duck.prototype.sound = function () {
  console.log('嘎嘎嘎');
};

/**3. 增加代码, 不需要改动以前 makeSound 里面的代码 */
var Chicken = function () {};
Chicken.prototype.sound = function () {
  console.log('咯咯咯');
};

makeSound(new Duck());
makeSound(new Chicken());

/**
 * 类型检查和多态
 *
 * 1. 关系:
 *    由于在代码编译时要进行严格的类型检查, 所以不能给变量赋予不同类型的值
 *
 * 2. 解决方案
 *      - 静态类型的面向对象语言通常被设计为可以向上转型: 当给一个类变量赋值的时候, 这个变量的类型既可以使用这个类本身, 也可以使用这个类的超类
 *      - 也就是说, 当 Duck 对象和 Chicken 对象的类型都被隐藏在超类型 Animal 身后, Duck 对象和 Chicken 对象就能被交换使用
 *
 * 使用继承得到多态效果
 *
 * 1. 继承
 *    - 实现继承
 *    - 接口继承
 *
 * 2. 实现继承
 *    - 先创建一个抽象类
 *    - 让 Duck 和 Chicken 都继承 Animal 抽象类
 *    - 让 AnimalSound 类的 makeSound 方法接受 Animal 类型的参数
 *
 * JavaScript 的多态
 *     - JavaScript 的变量类型在运行期是可变的
 *     - 一个JavaScript 对象, 既可以表示 Duck 类型, 也可以表示 Chicken 类型
 *     - JavaScript 对象的多态性是与生俱来的
 */

/**
 * 地图例子
 *
 * 1. 有两家可选的地图 API 接入应用: Google Map && Baidu Map
 * 2. 目前使用 Google Map, 提供 show 方法, 负责在 页面上展示地图
 **/
var GoogleMap = {
  show: function () {
    console.log('开始渲染谷歌地图');
  },
};
// var renderMap = function () {
//   GoogleMap.show();
// };
// renderMap();

/**
 * 3. 换成 Baidu Map
 */
var BaiduMap = {
  show: function () {
    console.log('开始渲染百度地图');
  },
};

var renderMap = function (type) {
  /**
   * 为了让 renderMap 保持一定弹性
   * 使用 条件语句 支持 谷歌和百度地图
   */
  if (type === 'google') {
    GoogleMap.show();
  } else if (type === 'baidu') {
    BaseMap.show();
  }
};
renderMap('google');
renderMap('baidu');

/**上面的代码存在缺点: 弹性脆弱, 需要增加新的地图, 就需要改动 renderMap 函数, 继续堆砌条件语句 */


/**修改代码 */
var renderMap = function (map) {
  /**抽象程序中相同的部分: 显示某个地图 */
  if (map.show instanceof Function) {
    map.show();
  }
};

/**
 * 当我们向谷歌地图对象 和 百度地图对象 分别发出 "展示地图" 的消息时,
 * 会分别调用它们的 show 方法, 就会产生各自不同的执行结果
 */
renderMap(GoogleMap);
renderMap(BaiduMap);


/**
 * 设计模式与多态
 * 
 * 1. 命令模式
 *      - 请求被封装在一些命令对象中, 这使得命令的调用者和命令的接收者可以完全解耦出来
 *      - 当调用命令的 executor 方法时, 不同的命令会做不同的事情, 从而会产生不同的执行结果
 *      - 做这些事情的过程是早已被封装在命令对象内部的, 作为调用命令的客户, 根本不必去关心命令的具体过程
 * 
 * 2. 组合模式
 *      - 多态性使得客户可以完全忽略组合对象和叶节点对象之间的区别
 *      - 对组合对象和叶节点对象发出同一个消息的时候, 它们会各自做自己应该做的事情
 *      - 组合对象把消息继续转发给下面的叶节点对象, 叶节点对象则会对这些消息作出真实的反馈
 * 
 * 3. 策略模式
 *      - Context 并没有执行算法的能力, 而是把这个职责委托给了某个策略对象
 *      - 每个策略对象负责的算法已被各自封装在对象内部
 *      - 当我们对这些策略对象发出 "计算" 的消息时, 它们会返回各自不同的计算结果
 * 
 * 4. 函数
 *      - 函数本身也是对象, 函数用来封装行为并且能够被四处传递
 *      - 当我们对一些函数发出调用的消息, 这些函数会返回不同的执行结果, 这是 "多态性" 的一种体现
 */