j;
/**
 * 策略模式:
 *   - 定义: 定义一系列的算法, 把他们一个个封装起来, 并且使他们可以相互替换
 *   - 目的: 将算法的使用与算法的实践实现分离开
 *   - 详细解释: 定义一系列的算法, 把他们各自封装成策略类, 算法被封装在策略类内部的方法里
 *              在客户对 Context 发起请求的时候, Context 总是把请求委托给这些策略对象中间的某一个进行计算
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