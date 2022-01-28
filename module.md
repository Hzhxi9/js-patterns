## 全面解析 Module 模式

### 简介

基本特征

1. 模块化, 可重用
2. 封装了变量和 function, 和全局的 namaspace 不接触, 松耦合
3. 只暴露可用 public 的方法, 其它私有方法全部隐藏

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

每次用的时候都要 new 一下, 也就是说每个实例在内存里都是一份 copy, 如果你不需要传参数或者没有一些特殊苛刻的要求的话, 我们可以在最后一个}后面加上一个括号, 来达到自执行的目的, 这样该实例在内存中只会存在一份 copy

### 匿名闭包

函数内部的代码一直存在于闭包内, 在整个运行周期内, 该闭包都保证了内部的代码处于私有状态

注意, 匿名函数后面的括号, 是 JavaScript 语言要求的, 因为如果不声明, JavaScript 解释器默认是声明一个 function 函数, 有括号就是创建一个函数表达式, 也就是自执行, 用的时候不用就不用 new 了

```js
(function () {
  // 所有的变量和function都在这里声明, 并且作用域也只能在这个匿名闭包里
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
  // 这里, 我们的代码就可以使用全局的jQuery对象了, YAHOO也是一样
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

上面的例子声明了一个全局变量 blogModule, 并且带有两个可访问属性, blogModule.privateAddTopic 和 blogModule.Name, 除此之外, 其他代码都在匿名函数的闭包里保持着私有状态

同时根据上面传入全局变量的例子, 我们也可以很方便地传入其他的全局变量

### 扩展

Module 模式的一个限制就是把所有代码都要写在一个文件, 但是在一些大型项目里, 将一个功能分离成多个文件是非常重要的, 因为可以多人合作易于开发

再回头看看上面全局参数导入例子, 我能否把 blogModule 自身传进去

我们先把 blogModule 传进去, 添加一个函数属性,然后再返回

```js
var blogModule = (function (my) {
  my.AddPhoto = function () {
    // 添加内部代码
  };
  return my;
})(blogModule);
```

同时尽管 var 不是必须的, 但为了确保一致, 我们再次使用了它, 代码执行以后, blogModule 下的 AddPhoto 就可以使用了, 同时匿名函数内部的代码也依然保证了私密性和内部状态

### 松耦合扩展

上面的代码尽管可以执行, 但是必须先声明 blogModule, 然后在执行上面的扩展代码, 也就是步骤不能乱, 如何解决这个问题呢？

```js
var blogModule = (function (my) {
  // 添加一些功能
  return my;
})(blogModule || {});
```

通过这样的代码, 每个单独分离的文件都保证这个结构, 那么我们就可以实现任意顺序的加载, 所以这个时候的 var 就是必须要声明, 因为不声明, 其他文件读取不到

### 克隆与继承

```js
var blogModule = (function (old) {
  var my = {},
    key;

  for (key in old) {
    if (old.hasOwnProperty(key)) {
      my[key] = old[key];
    }
  }

  var oldAddPhotoMethod = old.AddPhoto;

  my.AddPhoto = function () {
    // 克隆之后, 进行了重写, 当然也可以继续调用 oldAddPhotoMethod
  };

  return my;
})(blogModule);
```

这种方式灵活是灵活, 但是也需要花费灵活的代价, 其实该对象的属性对象或者 function 根本没有被复制, 只是对同一个对象多了一种引用而已

所以如果老对象去改变它, 那克隆以后的对象所拥有的属性或 function 函数也很被改变

解决这个问题, 我们就要用递归, 但递归对 function 函数的赋值也不好用, 所以我们在递归的时候 eval 相应的 function

### 跨文件共享私有对象

如果一个 module 分割到多个文件的话, 每个文件需要保证一样的结构, 也就是说每个文件匿名函数里的私有对象都不能交叉访问

如果我们非要使用

```js
var blogModule = (function (my) {
  var _private = (my._private = my._private || {}),
    _seal = (my._seal =
      my._seal ||
      function () {
        delete my._private;
        delete my._seal;
        delete my._unseal;
      }),
    _unseal = (my._unseal =
      my._unseal ||
      function () {
        my._private = __private;
        my._seal = _seal;
        my._unseal = _unseal;
      });

  return my;
})(blogModule || {});
```

任何文件都对它们的局部变量\_private 设置属性, 并且设置对其他的文件也立即生效。

一旦这个模块加载结束, 应用会调用 blogModule.\_seal()"上锁", 这也会阻止外部接入内部的\_private

如果这个模块需要再次增生, 应用的生命周期内, 任何文件都可以调用\_unseal()"开锁", 然后在加载新文件

加载后再次调用\_seal()上锁

### 子模块

子模块也具有一般模块所有的高级使用方式，也就是说你可以对任意子模块再次使用上面的一些应用方法

```js
blogModule.CommentSubModule = (function () {
  var my = {};

  // ...

  return my;
})();
```

### 总结

一般来说如果要设计系统, 可能会用到松耦合扩展、私有状态喝子模块这样的方式

modules 模式效率高, 代码少, 加载速度快

使用松耦合扩展允许并行加载, 这更可以提升下载速度, 不过初始化时间可能要慢一些
