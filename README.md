# JavaScript 设计模式

## 书写可维护的代码

### 什么叫可维护代码

1. 可读性
2. 一致性
3. 可预测性
4. 看上去就像是同一个人写的
5. 已记录

### 最小全局变量

javascript 通过函数管理作用域

1. 在函数内部声明的变量只在这个函数内部, 函数外部不可用

2. 全局变量就是在任何函数外面声明的或是未声明直接简单使用的

每个 JavaScript 环境有一个全局对象, 当你在任意的函数外部使用 this 的时候可以访问到

你创建的每一个全部变量都成了这个全局对象的属性

在浏览器中, 该全局对象有个附加属性叫做 Window, 此 window(通常)指向该全局对象本身

```js
/**如何在浏览器环境中创建和访问全局变量 */

global = 'hello'; // 不推荐写法
console.log(global); // hello
console.log(window.global); // hello
console.log(window['global']); // hello
console.log(this.global); // hello
```

### 全局变量的问题

你的 JavaScript 应用程序和 web 页面上的所有代码都会共享这些全局变量, 他们会共同存在同一个全局命名空间, 所以当程序的两个不同部分定义同名但不同作用的全局变量的时候, 命名冲突在所难免。

web 页面包含不是该页面开发者所写的代码也是比较常见的, 比如:

- 第三方 JavaScript 库
- 广告方的脚本代码
- 第三方用户追踪和分析脚本代码
- 不同类型的小组件、标志和按钮

JavaScript 的两个特性, 会不自觉创建出全局变量

- 不需要声明就可以使用变量
- JavaScript 有隐含的全局概念, 意味着你不声明的任何变量都会成为一个全局对象属性

```js
// 不推荐写法: 隐式全局变量
function sum(x, y) {
  result = x + y;
  return result;
}
```

result 没有声明, 代码照样运作正常, 但在调用函数后, 你最后的结果就多一个全局命名空间

```js
// 修复方案: 始终使用var声明变量
function sum(x, y) {
  var result = x + y;
  return result;
}
```

另一种创建隐式全局变量的反例就是使用任务链进行部分 var 声明

```js
// 反例: a 是局部变量, b 是全局变量
function foo() {
  // 原因: 这个从右到左的赋值
  // 首先是赋值表达式 b = 0, 此情况下b 是未声明的。
  // 这个表达式的返回值是0
  // 然后这个0就分配给了通过 var 定义的这个局部变量 a
  var a = (b = 0); // 等同与 var a = (b = 0);
}
```

```js
// 准备好声明变量，使用链分配是比较好的做法，不会产生任何意料之外的全局变量
function foo() {
  var a, b;
  a = b = 0; // 两个均为局部变量
}
```

### 忘记 var 的副作用

#### 隐式全局变量和明确定义全局变量有着微小的差异, 通过 delete 操作符让变量未定义的能力

- 通过 var 创建的全局变量(任何函数之外的程序中创建)是不能被删除的
- 没有通过 var 创建的隐式全局变量(无视是否在函数中创建)是能被删除的

这表明, 隐式全局变量并不是真正的全局变量, 它只是全局对象的属性, 属性就能通过 delete 操作符删除, 而变量就不行。

```js
// 定义三个全局变量
var global_var = 1;
global_no_var = 2;

(function () {
  global_form_func = 3;
})();

// 尝试删除
delete global_var; // false
delete global_no_var; // true
delete global_form_func; // true

// 测试是否删除
typeof global_var; // number
typeof global_no_var; // undefined
typeof global_form_func; // undefined
```

### 访问全局对象

在浏览器中, 全局对象可以通过 window 属性在代码的任何位置访问

但是在其他环境下, 这个方便的属性不一定叫 window, 可能有也可能没有(node 环境下 全局变量叫 global)

如果需要在没有硬编码的 window 标识符下访问全局对象, 可以在任何层级的函数作用域下使用

```js
var global = (function () {
  return this;
})();
```

这种方法可以随时获取全局对象, 因为其在函数中被当做函数调用了(不是通过 new 构造), this 总是指向全局对象

但是这个不适用于 ECMAScript 5 严格模式

所以，在严格模式下时，你必须采取不同的形式。

例如，你正在开发一个 JavaScript 库，你可以将你的代码包裹在一个即时函数中，然后从全局作用域中，传递一个引用指向 this 作为你即时函数的参数。

### 单 var 形式

在函数顶部使用单 var 语句是比较有用的一种形式, 其好处在于:

- 提供了一个单一的地方去寻找功能所需要的所有局部变量
- 防止变量在定义之前使用的逻辑出错
- 少代码(类型、传值单线完成)

```js
// 单 var 形式
function func() {
  var a = 1,
    b = 2,
    sum = a + b,
    obj = {},
    i,
    j;
}
```

可以用一个 var 语句声明多个变量, 并以逗号分隔

像这种初始化变量同时初始化值的做法是很好的, 这样可以防止逻辑错误(所有未初始化但声明的变量的初始值是 undefined)和增加代码的可读性

也可以在声明的时候做一些世纪的工作, 例如前面代码中的 sum = a + b 这个情况

另外一个例子使用 DOM 引用的时候, 就可以使用单一 var 把 DOM 引用一起指定为局部变量

```js
function updateElement() {
  var el = document.getElementById('root'),
    style = el.style;
}
```

### 预解析： var 散步问题

JavaScript 中, 可以在函数的任何位置声明多个 var 语句, 并且它们就好像是在函数顶部声明一样发挥作用, 这种行为称为 hoisting

当你使用了一个变量,然后不久在函数中又重新声明的话,就可能产生逻辑错误。

对于 JavaScript, 只要你的变量是在同一个作用域中(同一函数), 它都被当做是声明的, 即使是它在 var 声明前使用的时候。

```js
name = 'global'; // 全局变量
function func() {
  console.log(name); // undefined
  var name = 'local';
  console.log(name); // local
}

func();
```

在这个例子中,你可能会以为第一个 alert 弹出的是"global",第二个弹出"local"。

这种期许是可以理解的, 因为在第一个 alert 的时候,name 未声明, 此时函数肯定很自然而然地看全局变量 name

但是实际上并不是这么工作的, 第一个 alert 会弹出"undefined"是因为 name 被当做了函数的局部变量(尽管是之后声明的), 所有的变量声明当被悬置到函数的顶部了。

因此, 为了避免这种混乱, 最好是预先声明你想使用的全部变量。

```js
// 等同于
name = 'global';
function func() {
  var name;
  console.log(name); // undefined
  name = 'local';
  console.log(name); // local
}
func();
```

#### 提升深层的东西

代码处理分两个阶段

1. 第一阶段: 函数声明以及正常格式的参数创建: 这是一个解析和进入上下文的阶段
2. 第二阶段: 代码执行: 函数表达式和不合格的标识符(声明的变量)被创建
