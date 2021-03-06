/**
 * 策略模式:
 *   - 定义: 定义一系列的算法, 把他们一个个封装起来, 并且使他们可以相互替换
 *   - 目的: 将算法的使用与算法的实践实现分离开
 *   - 详细解释: 定义一系列的算法, 把他们各自封装成策略类, 算法被封装在策略类内部的方法里
 *              在客户对 Context 发起请求的时候, Context 总是把请求委托给这些策略对象中间的某一个进行计算
 *   - 优点
 *     - 利用组合、委托、多态等技术和思想, 可以有效地避免多重条件选择语句
 *     - 提供了对外开放-封闭原则的完美支持, 将算法封装在独立的 strategy 中, 使得它们易于切换, 易于理解, 易于切换
 *     - 复用在系统的其他地方, 从而避免许多重复的复制粘贴工作
 *     - 利用组合和委托来让 Context 拥有执行算法的能力, 这也是继承的一种更轻便的替代方案
 *  
 *   - 缺点
 *     - 会在程序中增加许多策略类或者策略对象
 *     - 必须了解所有的 strategy, 必须了解各个 strategy 之间的不同点, 才能选择合适的 strategy (违背最少知识原则)
 * */

/**
 * 需求: 计算奖金
 * 绩效为 S 的人年终奖有 4 倍工资, 绩效为 A 的人年终奖有 3 倍工资, 绩效为 B 的人年终奖有 2 倍工资
 */

/**
 * 第一版
 *    - 函数庞大, 包含了很多 if-else 语句, 这些语句需要覆盖所有的覆盖分支
 *    - calcBonus 函数缺乏弹性, 如果增加一种新的绩效等级 C 或者想把绩效 S 的奖金系数改为 5,
 *      那我们必须深入 calcBonus 函数的内部实现, 这是违背开放-封闭原则
 *    - 算法的复用性差
 *
 * @param {string} level 绩效等级
 * @param {number} salary 工资数额
 */
var calcBonus = function (level, salary) {
  if (level === 'S') return salary * 4;
  if (level === 'A') return salary * 3;
  if (level === 'B') return salary * 2;
};

calcBonus('B', 2000);
calcBonus('S', 2000);

/**
 * 第二版: 使用组合函数重构代码
 *     - calcBonus 函数有可能越来越庞大, 而且在系统变化的时候缺乏弹性
 */
var performanceS = salary => salary * 4;
var performanceA = salary => salary * 3;
var performanceB = salary => salary * 2;

var calcBonus = function (level, salary) {
  if (level === 'S') return performanceS(salary);
  if (level === 'A') return performanceA(salary);
  if (level === 'B') return performanceB(salary);
};

/**
 * 第三版: 使用策略模式 (模仿传统面向对象语言中的实现)
 *     算法的使用方式是不变的, 都是根据某个算法去的计算后的奖金数额
 *     算法的实现是各异和变化的, 每种绩效对应着不同的计算规则
 *
 * 一个基于策略模式的程序至少由两部组成
 *     - 第一部分是一组策略类, 策略类封装了具体的算法, 并负责具体的计算过程
 *     - 第二部分是环境类Context, Context 接受客户的请求, 随后把请求委托给某一个策略类(Context 中维持对某个策略对象的引用)
 */
var performanceS = function () {};
performanceS.prototype.calculate = function (salary) {
  return salary * 4;
};

var performanceA = function () {};
performanceA.prototype.calculate = function (salary) {
  return salary * 3;
};
var performanceB = function () {};
performanceB.prototype.calculate = function (salary) {
  return salary * 2;
};

var Bonus = function () {
  this.salary = null; /**原始工资 */
  this.strategy = null; /**绩效等级对应的策略对象 */
};

Bonus.prototype.setSalary = function (salary) {
  this.salary = salary; /**设置员工原始工资 */
};

Bonus.prototype.setStrategy = function (strategy) {
  this.strategy = strategy; /**设置员工绩效等级对应的策略对象 */
};

/**取得奖金数额 */
Bonus.prototype.getBonus = function () {
  if (!this.strategy) {
    throw new Error('未设置 strategy 属性');
  }
  /**把计算奖金的操作委托给队员的策略对象 */
  return this.strategy.calculate(this.salary);
};

var bonus = new Bonus();

bonus.setSalary(1000);
bonus.setStrategy(new performanceS()); // 设置策略对象

console.log(bonus.getBonus());

/**
 * 第四版: Javascript 版本的策略模式
 */

var strategies = {
  S: function (salary) {
    return salary * 4;
  },
  A: function (salary) {
    return salary * 3;
  },
  B: function (salary) {
    return salary * 2;
  },
};

var calculateBonus = function (level, salary) {
  return strategies[level](salary);
};

console.log(calculateBonus('S', 2000));
console.log(calculateBonus('A', 2000));

/**
 * 多态在策略模式中的体现
 * - 所有跟计算奖金有关的逻辑不再放在 Context 中, 而是分布在各个策略对象中
 * - Context 并没有计算奖金的能力, 而是把这个职责委托给某个策略对象
 * - 每个策略对象负责的算法一杯各自封装在对象内部
 * - 当我们对这些策略对象发出计算奖金的请求时, 他们会返回各自不同的计算结果, 这正是对象多态性的体现, 也是他们可以相互替换的目的
 * - 替换 Context 中当前保存的策略对象, 便能执行不同的算法来得到我们想要的结果
 */

/**
 * 🌰 : 策略模式实现缓动动画: 一个小球按照不同的算法进行运动
 *    1. 记录一些有用的信息
 *       - 动画开始时, 小球所在的原始位置
 *       - 小球移动的目标位置
 *       - 动画开始时的准确时间点
 *       - 小球运动持续的时间
 *   2. 用 setInterval 创建一个定时器, 定时器每隔 19ms 循环一次
 *      在定时器的每一帧里, 会把动画已消耗的时间、小球原始位置、小球目标位置和动画持续的总时间等信息传入缓动算法
 *      该算法会通过这几个参数, 计算出小球当前应该所在的位置
 *   3. 最后更新该 div 对应的 CSS 属性, 小球就能顺利的动起来
 */

/**缓动算法 */
var tween = {
  /**
   *
   * @param {*} t 动画已消耗的时间
   * @param {*} b 小球原始位置
   * @param {*} c 小球目标位置
   * @param {*} d 动画持续总时间
   * @returns 动画元素应该所处的当前位置
   */
  linear: function (t, b, c, d) {
    return (c * t) / d + b;
  },
  easeIn: function (t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  strongEaseIn: function (t, b, c, d) {
    return c * (t /= d) * t ** 4 + b;
  },
  strongEaseOut: function (t, b, c, d) {
    return c * ((t = t / d - 1) * t ** 4 + 1) + b;
  },
  sineaseIn: function (t, b, c, d) {
    return c * (t /= d) * t ** 2 + b;
  },
  sineaseOut: function (t, b, c, d) {
    return c * ((t = t / d - 1) * t ** 2 + 1) + b;
  },
};

/**
 * <div style="position: absolute; background: blue;" id="div">div</div>
 */

/**
 * @param {HTMLDivElement} dom 即将运动起来的 dom 节点
 */
var Animate = function (dom) {
  this.dom = dom; /**进行运动的节点 */
  this.startTime = 0; /**动画开始时间 */
  this.startPos = 0; /**动画开始时, dom 节点的位置, 即 dom 的初始位置 */
  this.endPos = 0; /**动画结束时,  dom 节点的位置, 即 dom 的目标位置 */
  this.propertyName = null; /**dom 节点需要被改变的 css 属性名 */
  this.easing = null; /**缓动算法 */
  this.duration = null; /**动画持续时间 */
};

/**
 * 负责启动这个动画
 * @param {*} propertyName 需要被改变的 css 属性名, 比如 left、 top, 分别表示左右移动和上下移动
 * @param {*} endPos 小球运动的目标位置
 * @param {*} duration 动画持续时间
 * @param {*} easing 缓动算法
 */
Animate.prototype.start = function (propertyName, endPos, duration, easing) {
  this.startTime = +new Date(); // 动画启动时间
  this.startPos = this.dom.getBoundingClientRect()[propertyName]; // dom 节点初始位置
  this.propertyName = propertyName; // dom 节点需要被改变的 CSS 属性名
  this.endPos = endPos; // dom 节点目标位置
  this.duration = duration; // 动画持续时间
  this.easing = tween[easing]; // 缓动算法

  var _this = this;
  /**启动定时器, 开始执行动画 */
  var timeId = setInterval(function () {
    /**如果动画结束, 清除定时器 */
    if (_this.step() === false) {
      clearInterval(timeId);
    }
  }, 19);
};

/**
 * 小球运动的每一帧要做的事情, 负责计算小球的当前位置和调用更新 CSS 属性值的方法 update
 */
Animate.prototype.step = function () {
  var t = +new Date(); // 取得当前时间
  /**
   * 如果当前时间大于动画开始时间加上动画持续时间之和, 说明动画已经结束, 此时要修正小球的位置
   * 因为这一帧开始之后, 小球的位置已经接近了目标位置, 但很有可能不完全等于目标位置
   * 此时我们要主动修正小球当前位置位最终目标位置
   */
  if (t >= this.startTime + this.duration) {
    this.update(this.endPos); // 更新小球的 css 的属性值
    return false; // 返回false, 可以通知 start 清除定时器
  }
  var time = t - this.startTime,
    b = this.startPos,
    c = this.endPos - this.startPos,
    d = this.duration;
  var pos = this.easing(time, b, c, d); // 小球当前位置
  this.update(pos); // 更新小球的 css 的属性值
};

/**
 * 负责更新小球 CSS 属性值
 * @param {*} pos
 */
Animate.prototype.update = function (pos) {
  this.dom.style[this.propertyName] = pos + 'px';
};

/**测试用例 */
var div = document.getElementById('div');
var animate = new Animate(div);
animate.start('left', 500, 1000, 'strongEaseIn');

/**
 * 更广义的算法： 封装一系列的业务规则
 * 🌰 : 表单校验
 *   - 用户名不能为空
 *   - 密码长度不能少于 6 位
 *   - 手机号码必须符合格式
 */

/**
 * <form action="http: //www.xxx.com/register" id="registerForm" method="post">
 *    用户名: <input type="text" name="username" />
 *    密 码: <input type="text" name="password" />
 *    手机号码: <input type="text" name="phoneNumber" />
 *    <button>提交</button>
 * </form>
 */

/**
 * @description 第一个版本
 *
 * 存在问题
 *  - 函数庞大, 包含了很多 if-else 语句, 需要覆盖所有的校验规则
 *  - 缺乏弹性
 *  - 算法复用性差
 * */
var register = document.getElementById('registerForm');

register.onsubmit = function () {
  if (register.username.value) {
    alert('用户名不能为空');
    return false;
  }
  if (register.password.value.length < 6) {
    alert('密码长度不能小于 6 位');
    return false;
  }
  if (!/^1[3|5|8][0-9]{9}$/.test(register.phoneNumber.value)) {
    alert('手机号码格式不正确');
    return false;
  }
};

/**
 * @description 策略模式重构表单验证
 */

/**策略对象 */
var strategies = {
  /**不为空 */
  isNonEmpty: function (value, errorMessage) {
    if (!value) return errorMessage;
  },
  /**限制最小长度 */
  menLength: function (value, length, errorMessage) {
    if (value.length < length) return errorMessage;
  },
  /**手机号码格式 */
  isMobile: function (value, errorMessage) {
    if (!/^1[3|5|8][0-9]{9}$/.test(value)) return errorMessage;
  },
};

/**Validator 类作为 Context, 负责接收用户的请求并委托给 strategy 对象 */
var Validator = function () {
  /**保存校验规则 */
  this.cache = [];
};

/**
 *
 * @param {*} dom 参与校验的 input 输入框
 * @param {*} rule 字符串包含: => : 前面表示客户挑选的 strategies 对象, : 后面表示校验过程中所必需的一些参数 | 不包含: => 不需要额外的参数信息
 * @param {*} errorMessage 当检验未通过是返回的错误信息
 */
Validator.prototype.add = function (dom, rule, errorMessage) {
  var ary = rule.split(':'); // 把 strategy 和参数分开
  /**把校验的步骤用空函数包装起来, 并且放入 cache */
  this.cache.push(function () {
    var strategy = ary.shift(); // 用户挑选的 strategy
    ary.unshift(dom.value); // 把 input 的 value 添加到参数列表
    ary.push(errorMessage); // 把 errorMessage 添加到参数列表
    return strategies[strategy].apply(dom, ary);
  });
};

Validator.prototype.start = function () {
  for (var i = 0, validatorFunc; (validatorFunc = this.cache[i++]); ) {
    var msg = validatorFunc(); // 开始校验, 并取得校验返回后的信息
    if (msg) return msg;
  }
};

/**使用 Validator 类 */
var validatorFunc = function () {
  var validator = new Validator(); /**创建一个 validator 对象 */
  /**添加一些校验规则 */
  validator.add(register.username, 'isNonEmpty', '用户名不能为空');
  validator.add(register.password, 'menLength:6', '密码长度不能小于6位');
  validator.add(register.phoneNumber, 'isMobile', '手机号码格式不正确');

  /**获得校验结果 */
  var errorMessage = validator.start();
  /**返回校验结果 */
  return errorMessage;
};

var register = document.getElementById('registerForm');

register.onsubmit = function () {
  var errorMessage = validatorFunc();
  /**如果 errorMessage 有确切的返回值, 说明未通过校验 */
  if (errorMessage) {
    alert(errorMessage);
    /**阻止表单提交 */
    return false;
  }
};

/**🌰 : 给某个文本输入框添加多种校验规则 */

/**
 * <form action="http: //www.xxx.com/register" id="registerForm" method="post">
 *    用户名: <input type="text" name="username" />
 *    密 码: <input type="text" name="password" />
 *    手机号码: <input type="text" name="phoneNumber" />
 *    <button>提交</button>
 * </form>
 */

/**策略对象 */
var strategies = {
  /**不为空 */
  isNonEmpty: function (value, errorMessage) {
    if (!value) return errorMessage;
  },
  /**限制最小长度 */
  menLength: function (value, length, errorMessage) {
    if (value.length < length) return errorMessage;
  },
  /**手机号码格式 */
  isMobile: function (value, errorMessage) {
    if (!/^1[3|5|8][0-9]{9}$/.test(value)) return errorMessage;
  },
};

/**Validator 类 */
var Validator = function () {
  /**保存校验规则 */
  this.cache = [];
};

Validator.prototype.add = function (dom, rules) {
  var _this = this;
  for (var i = 0, rule; (rule = rules[i++]); ) {
    (function (rule) {
      var strategyArr = rule.split(':');
      var errorMessage = rule.errorMessage;

      _this.cache.push(function () {
        var strategy = strategyArr.shift();
        strategyArr.unshift(dom.value);
        strategyArr.push(errorMessage);
        return strategies[strategy].apply(dom, strategyArr);
      });
    })(rule);
  }
};

Validator.prototype.start = function () {
  for (var i = 0, validatorFunc; (validatorFunc = this.cache[i++]); ) {
    var errorMessage = validatorFunc();
    if (errorMessage) return errorMessage;
  }
};

/**客户调用代码 */
var register = document.getElementById('registerForm');

var validatorFunc = function () {
  var validator = new Validator();

  validator.add(register.username, [
    { strategy: 'isNonEmpty', errorMessage: '用户名不能为空' },
    { strategy: 'menLength:10', errorMessage: '用户名长度不能小于10位' },
  ]);
  validator.add(register.password, [{ strategy: 'menLength:6', errorMessage: '用户名长度不能小于6位' }]);
  validator.add(register.phoneNumber, [{ strategy: 'isMobile', errorMessage: '手机号码格式不正确' }]);

  var errorMessage = validator.start();
  return errorMessage;
};

register.onsubmit = function () {
  var errorMessage = validatorFunc();
  if (errorMessage) {
    alert(errorMessage);
    return false;
  }
};
