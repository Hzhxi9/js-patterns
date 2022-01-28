## 全面解析 Module 模式

### 简介

基本特征

1. 模块化, 可重用
2. 封装了变量和 function，和全局的 namaspace 不接触，松耦合
3. 只暴露可用 public 的方法，其它私有方法全部隐藏

### 基本用法

简单实现

```js
var Calculator = function (eq) {
  //这里可以声明私有成员

  var eqCtl = document.getElementById(eq);

  return {
    // 暴露公开的成员
    add: function (x, y) {
      var val = x + y;
      eqCtl.innerHTML = val;
    },
  };
};

// 调用
var calculator = new Calculator('eq');
calculator.add(2, 2);
```

每次用的时候都要 new 一下，也就是说每个实例在内存里都是一份 copy，如果你不需要传参数或者没有一些特殊苛刻的要求的话，我们可以在最后一个}后面加上一个括号，来达到自执行的目的，这样该实例在内存中只会存在一份 copy

### 匿名闭包

函数内部的代码一直存在于闭包内, 在整个运行周期内, 该闭包都保证了内部的代码处于私有状态

注意, 匿名函数后面的括号, 是 JavaScript 语言要求的, 因为如果不声明, JavaScript 解释器默认是声明一个 function 函数, 有括号就是创建一个函数表达式, 也就是自执行, 用的时候不用就不用 new 了

```js
(function () {
  // 所有的变量和function都在这里声明，并且作用域也只能在这个匿名闭包里
  // 但是这里的代码依然可以访问外部全局的对象
})();
```

### 引用全局变量

JavaScript 有一个特性叫隐式全局变量, 不管一个变量有没有用过, JavaScript 解释器反向遍历作用域来查找整个变量的 var 声明,

如果没有找到 var, 解释器则假定该变量是全局变量

如果改变变量用于了赋值操作的话, 之前如果不存在的话, 解释器则会自动创建它, 这就是说匿名闭包里使用或创建全局变量非常容易

不过比困难的是, 代码比较难管理, 尤其是阅读代码的人很难区分哪些变量是全局还是局部的

好在匿名函数里我们可以将全局变量当成一个参数传入到匿名函数里去使用, 相对于隐式全局变量, 它又清晰又快

```js
(function ($, YAHOO) {
  // 这里，我们的代码就可以使用全局的jQuery对象了，YAHOO也是一样
})(jQuery, YAHOO);
```

有时候想声明全局变量, 可以通过匿名函数的返回值来返回这个全局变量, 这也就是一个基本的 Module 模块

```js
var blogModule = (function () {
  var my = {},
    privateName = '博客';

  function privateAddTopic(data) {
    // 内部代码
  }

  my.Name = privateName;
  my.AddTopic = function (data) {
    privateAddTopic(data);
  };

  return my;
})();
```

上面的例子声明了一个全局变量 blogModule, 并且带有两个可访问属性, blogModule.privateAddTopic 和 blogModule.Name, 除此之外， 其他代码都在匿名函数的闭包里保持着私有状态

同时根据上面传入全局变量的例子, 我们也可以很方便地传入其他的全局变量
