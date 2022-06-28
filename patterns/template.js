/**
 * 模板方法: 只需使用继承就可以实现的非常简单的模式
 *
 * 由两部分结构组成, 第一部分是抽象父类, 第二部分是具体的实现子类
 * 通常在抽象父类中封装了子类的算法框架, 包括实现了一些公共方法以及封装子类中所有方法的执行顺序
 * 子类通过继承这个抽象类, 也继承了整个算法结构, 并且可以选择重写父类的方法
 *
 * 假如我们有一些平行的子类, 各个子类之间有一些相同的行为, 也有一些不同的行为
 * 如果相同和不相同的行为都混合在各个子类的实现中, 说明这些相同的行为会在各个子类中重复出现
 * 但实际上相同的行为可以被搬移到另外一个单一的地方, 模版方法模式就是为解决这个问题而产生的
 *
 * 在模板方法中, 子类实现中的相同的部分被上移到父类中, 而将不同的部分留在子类来实现
 *
 * 使用场景:
 * 1. 往大的方面来讲, 模板方法模式常被架构师用于搭建项目的框架, 架构师定好了框架的骨架, 程序员继承框架的结构后, 负责往里面填空
 *
 *    - 在 Web 开发中能找到很多模板方法模式实现的场景: 比如我们构建一系列的 UI 组件
 *
 *      - 初始化一个 div 容器
 *      - 通过 Ajax 请求拉取相应的数据
 *      - 把数据渲染到相应的 div 容器里面, 完成组件的构造
 *      - 通知用户组件渲染完毕
 *
 *      任何组件的构建都遵循上面的 4 步, 其中第一步、第四步是相同的, 第二步不同的地方只是请求 Ajax 的远程地址, 第三步不同的地方是渲染数据的方式
 *      于是我们可以把这四步抽象到父类的模板方法里, 父类还可以顺便提供第一步和第四步的具体实现
 *      当子类继承这个父类之后, 会重写模板方法里的第二步和第三步
 */

/**🌰 : Coffee or Tea */

/**
 * 1. 先泡一杯咖啡
 *
 *    - 把水煮沸
 *    - 用沸水冲泡咖啡
 *    - 把咖啡倒进杯子
 *    - 加糖和牛奶
 */
var Coffee = function () {};

Coffee.prototype.boilWater = function () {
  console.log('把水煮沸');
};

Coffee.prototype.brewCoffeeGriends = function () {
  console.log('用沸水冲泡咖啡');
};

Coffee.prototype.pourInCup = function () {
  console.log('把咖啡倒进杯子');
};

Coffee.prototype.addSugarAndMilk = function () {
  console.log('加糖和牛奶');
};

Coffee.prototype.init = function () {
  this.boilWater();
  this.brewCoffeeGriends();
  this.pourInCup();
  this.addSugarAndMilk();
};

var coffee = new Coffee();
coffee.init();

/**
 * 2. 泡一壶茶
 *    - 把水煮沸
 *    - 用沸水浸泡茶叶
 *    - 把茶水倒进杯子
 *    - 加柠檬
 */
var Tea = function () {};

Tea.prototype.boilWater = function () {
  console.log('把水煮沸');
};

Tea.prototype.steepTeaBag = function () {
  console.log('用沸水浸泡茶叶');
};

Tea.prototype.pourInCup = function () {
  console.log('把茶水倒进杯子');
};

Tea.prototype.addLemon = function () {
  console.log('加柠檬');
};

Tea.prototype.init = function () {
  this.boilWater();
  this.steepTeaBag();
  this.pourInCup();
  this.addLemon();
};

var tea = new Tea();
tea.init();

/**
 * 3. 分离出共同点
 *    - 原料不同, 可以抽象为"饮料"
 *    - 泡的方式不同, 可以抽象为"泡"
 *    - 加入的调料不同, 可以抽象为"调料"
 *
 * 步骤抽象为:
 *    - 把水煮沸
 *    - 用沸水冲泡饮料
 *    - 把饮料倒进杯子
 *    - 加调料
 */

/**抽象父类 */
var Beverage = function () {};
Beverage.prototype.boilWater = function () {
  console.log('把水煮沸');
};
Beverage.prototype.brew = function () {}; /**空方法, 应该由子类重写 */
Beverage.prototype.pourInCup = function () {}; /**空方法, 应该由子类重写 */
Beverage.prototype.addCondiments = function () {}; /**空方法, 应该由子类重写 */

/**
 * @description 模板方法
 * 该方法中封装了子类的算法框架, 他作为一个算法的模板, 指导子类以何种顺序去执行哪些方法
 */
Beverage.prototype.init = function () {
  this.boilWater();
  this.brew();
  this.pourInCup();
  this.addCondiments();
};

/**创建 Coffee / Tea 子类 */
var Coffee = function () {};
Coffee.prototype = new Beverage();

/**重写父类方法 */
Coffee.prototype.brew = function () {
  console.log('用沸水冲泡咖啡');
};
Coffee.prototype.pourInCup = function () {
  console.log('把咖啡倒进杯子');
};
Coffee.prototype.addCondiments = function () {
  console.log('加糖和牛奶');
};

var coffee = new Coffee();
coffee.init();

/**
 * 🌰 : Javascript 没有抽象类的缺点和解决方案
 *
 * 抽象类的作用:
 * 1. 隐藏对象的具体类型, 由于 Javascript 是一门类型模糊的语言, 所以隐藏对象的类型在 Javascript 中并不重要
 * 2. 当我们在 Javascript 中使用原型继承来模拟传统的类式继承时, 并没有编译器帮助我们进行任何类型检查,
 *    我们也没有办法保证子类会重写父类中的抽象方法
 *
 * 解决方案:
 * 1. 用鸭子类型来模拟接口检查, 以确保确实重写了父类的方法
 *    但是模拟接口检查会带来不必要的复杂性, 而且要求程序员主动进行这些接口检查这就要求我们在业务代码中添加一些跟业务逻辑无关的代码
 * 2. 让父类方法直接抛出一个异常, 如果因为粗心忘记重写父类方法, 至少在程序运行时得到一个错误
 *    - 实现简单, 付出的额外代价少, 缺点是得到的错误信息时间太靠后
 *
 * 一个有三次得到错误信息
 * 1. 编写代码的时候, 通过编译器的检查来得到错误信息
 * 2. 创建对象的时候用鸭子类型来进行接口检查
 * 3. 程序运行过程中知道那里发生错误
 */
Beverage.prototype.brew = function () {
  throw new Error('子类必须重写 brew 方法');
}; /**空方法, 应该由子类重写 */
Beverage.prototype.pourInCup = function () {
  throw new Error('子类必须重写 pourInCup 方法');
}; /**空方法, 应该由子类重写 */
Beverage.prototype.addCondiments = function () {
  throw new Error('子类必须重写 addCondiments 方法');
}; /**空方法, 应该由子类重写 */

/**
 * 🌰 : 钩子方法
 *
 * 既然 Beverage 作为父类, 已经规定好了冲泡顺序, 那么有什么办法可以让子类不受这歌约束
 *
 * 钩子方法(hook) 可以用来解决这个问题, 放置钩子是隔离变化的一种常见手段
 * 我们在父类中容易变化的地方放置钩子, 钩子可以有一个默认的实现, 究竟要不要放置钩子这由子类自行决定
 * 钩子犯法的返回结果决定了模板方法后面部分的执行步骤, 也就是程序接下来的走向
 */
var Beverage = function () {};

Beverage.prototype.boilWater = function () {
  console.log('把水煮沸');
};

Beverage.prototype.brew = function () {
  throw new Error('子类必须重写 brew 方法');
};

Beverage.prototype.pourInCup = function () {
  throw new Error('子类必须重写 pourInCup 方法');
};

Beverage.prototype.addCondiments = function () {
  throw new Error('子类必须重写 addCondiments 方法');
};

Beverage.prototype.customerWantsCondiments = function () {
  return true; /**默认需要调料 */
};

Beverage.prototype.init = function () {
  this.boilWater();
  this.brew();
  this.pourInCup();
  /**如果挂钩返回了 true, 则需要调料 */
  if (this.customerWantsCondiments()) this.addCondiments();
};

var CoffeeWithHook = function () {};

CoffeeWithHook.prototype = new Beverage();

CoffeeWithHook.prototype.brew = function () {
  console.log('用沸水冲泡咖啡');
};

CoffeeWithHook.prototype.pourInCup = function () {
  console.log('把咖啡倒进杯子');
};

CoffeeWithHook.prototype.addCondiments = function () {
  console.log('加糖和牛奶');
};

CoffeeWithHook.prototype.customerWantsCondiments = function () {
  return window.confirm('请问需要调料吗?');
};

var coffeeWithHook = new CoffeeWithHook();

coffeeWithHook.init();

/**
 * 🌰 :好莱坞原则
 *
 * 允许底层组件将自己挂钩到高层组件中, 而高层组件会决定什么时候, 以何种方式去使用这些底层组件, 高层组件对待底层组件的方式
 * 跟演艺公司对待新人演员一样, 都是 "别调用我们, 我们会调用你"
 *
 * 模板方法模式是好莱坞原则的一个典型使用场景, 它们与好莱坞原则的联系非常明显
 * 当我们用模板方法编写一个程序时, 就意味着子类放弃了对自己的控制权, 而是改为父类通知子类, 哪些方法应用在什么时候被调用
 * 作为子类, 只负责提供一些设计上的细节
 *
 * 好莱坞原则应用场景:
 *    - 发布-订阅模式
 *
 *      在发布订阅模式中, 发布者会把消息推送给订阅者, 这取代了原先不断去 fetch 消息的形式
 *      例如假设我们乘坐出租车去一个不了解的地方, 除了每过五秒就问司机"是否到达目的地"之外
 *      还可以在车上等待车达到目的地, 司机通知你
 *      这也相当于好莱坞原则提到的 "别调用我们, 我们会调用你"
 *
 *    - 回调函数
 *
 *      在 ajax 异步请求中, 由于不知道请求返回的具体时间, 而通过轮询去判断是否返回数据, 这显然是不理智的行为
 *      所以我们通常会把接下来的操作放在回调函数中, 传入发起 ajax 异步请求的函数
 *      当数据返回之后, 这个回调函数才被执行, 这也是好莱坞原则的一种体现
 *      把需要执行的操作封装在回调函数里, 然后把主动权交给另外一个函数
 *      至于回调函数什么时候被执行, 则是另外一个函数控制
 */

/**
 * 🌰 : 继承: 通过对象与对象之间的委托来实现的
 *
 * 模板方法模式是基于继承的一种设计模式, 父类封装了子类的算法框架和方法执行顺序, 子类继承父类之后, 父类通知子类执行这些方法
 * 好莱坞原则很好诠释了这张设计技巧, 即高层组件调用底层组件
 *
 *
 **/

/**好莱坞原则指导下继承一样的效果 */
var Beverage = function (param) {
  var boilWater = function () {
    console.log('把水煮沸');
  };
  var brew =
    param.brew ||
    function () {
      throw new Error('必须传递 brew 方法');
    };

  var pourInCup =
    param.pourInCup ||
    function () {
      throw new Error('必须传递 pourInCup 方法');
    };

  var addCondiments =
    param.addCondiments ||
    function () {
      throw new Error('必须传递 addCondiments 方法');
    };

  var F = function () {};

  F.prototype.init = function () {
    boilWater();
    brew();
    pourInCup();
    addCondiments();
  };

  return F;
};

var Coffee = Beverage({
  brew: function () {
    console.log('用沸水冲泡咖啡');
  },
  pourInCup: function () {
    console.log('把咖啡倒进杯子里');
  },
  addCondiments: function () {
    console.log('加糖和牛奶');
  },
});

var coffee = new Coffee();

coffee.init();
