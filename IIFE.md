## 立即调用的函数表达式

### 什么是自执行

在 JavaScript 里, 任何 function 在执行的时候都会创建一个执行上下文

因为为 function 声明的变量和 function 有可能只在该 function 内部, 这个上下文在调用 function 的时候, 提供了一种简单的方式来创建自由变量或私有子 function

```js
// 由于该function里返回了另外一个function, 其中这个function可以访问自由变量 i
// 所以说, 这个内部的 function 实际上有权限可以调用内部的对象

function makeCounter() {
  // 只能在 makeCounter 内部访问 i
  var i = 0;

  return function () {
    console.log(++i);
  };
}

// 注意: counter和counter2是不同的实例, 分别有自己范围内的i。
var counter = makeCounter();
counter(); // 1
counter(); // 2

var counter2 = makeCounter();
counter2(); // 1
counter2(); // 2

console.log(i); // 引用错误：i没有defined（因为i是存在于makeCounter内部）
```

### 问题核心

当你声明类似 `function foo(){}` 或者 `var foo = function() {}` 函数的时候, 通过在后面加个括号就可以实现自执行, 例如 foo()

```js
// 因为想下面第一个声明的function可以在后面加一个括弧()就可以自己执行了, 比如foo(),
// 因为foo仅仅是function() { /* code */ }这个表达式的一个引用

var foo = function () {};

function(){ /* code */ }(); // SyntaxError: Unexpected token (
```

第 2 个代码报错是因为在解析器解析全局的 function 或者 function 内部 function 关键字的时候, 默认是认为 function 声明, 而不是 function 表达式

如果你不告诉编译器, 它会默认声明成一个缺少名字的 function, 并且抛出一个语法错误信息, 因为 function 声明需要一个名字

### 函数、括号、语法错误

有趣的是, 即使你为上面的错误代码加上一个名字, 它也会提示语法错误, 只不过喝上面的原因不一样

在一个表达式后面加上括号(), 该表达式会立即执行, 但是在一个语句后面加上括号(), 是完全不一样的意思, 他只是一个分组操作符

```js
// 下面这个function在语法上是没问题的, 但是依然只是一个语句
// 加上括号()以后依然会报错, 因为分组操作符需要包含表达式

function foo() { /** code */ }(); // SyntaxError: Unexpected token )

// 但是如果你在括弧()里传入一个表达式, 将不会有异常抛出
// foo函数依然不会执行
function foo() { /** code */ }(1);

// 因为它完全等价于下面这个代码, 一个function声明后面, 又声明了一个毫无关系的表达式：
function foo() { /** code */ }

(1);
```
