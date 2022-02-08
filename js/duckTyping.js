/**
 * 面向对象的 JavaScript
 *
 * 1. JavaScript 是没有提供传统面向对象语言中的类似继承, 而是通过原型委托的方式来实现对象与对象之间的继承
 *
 * 2. 编程语言按照数据类型大体分为两类:
 *    - 静态类型语言: 编译时便已确定变量的类型
 *       - 优点:
 *          1. 编译时就能发现类型不匹配的错误, 编译器可以帮助我们提前避免程序在运行期间有可能发生的一些错误
 *          2. 如果在程序中明确地规定了数据类型, 编译器可以针对这些信息对程序进行一些优化工作, 提高程序执行速度
 *
 *       - 缺点:
 *          1. 迫使程序依照强契约来编写程序, 为每个变量规定了数据类型, 但是本质只是辅助我们开发时代码的可靠性强一些, 而不是编写程序的目的
 *          2. 类型的声明会增加更多的代码, 这些细节会分散业务逻辑的思考
 *
 *    - 动态类型语言: 要到程序运行的时候, 待变量被赋予某个值之后, 才会具有某种类型
 *       - 优点:
 *          1. 编写的代码数量更少, 简洁性高
 *
 *       - 缺点:
 *          1. 无法保证变量的类型
 *
 * 3. 鸭子类型: "如果它走起来像鸭子, 叫起来像鸭子, 那么它就是鸭子"
 *    - 可以不必借助超类型的帮助, 实现"面向接口编程, 而不是面向实现编程"
 *
 */

var duck = {
  dunk_sing: function () {
    console.log('嘎嘎嘎');
  },
};

var chicken = {
  dunk_sing: function () {
    console.log('嘎嘎嘎');
  },
};


var choir = [];

var join_choir = function (animate) {
    if(animate && typeof animate.dunk_sing === 'function'){
        choir.push(animate)
        console.log('加入合唱团')
    }
}

join_choir(duck)
join_choir(chicken)