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

console.log(i); // 引用错误：i没有defined（因为i是存在于makeCounter内部）。
```
