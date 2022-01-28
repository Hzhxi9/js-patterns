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
// 准备好声明变量, 使用链分配是比较好的做法, 不会产生任何意料之外的全局变量
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

所以, 在严格模式下时, 你必须采取不同的形式。

例如, 你正在开发一个 JavaScript 库, 你可以将你的代码包裹在一个即时函数中, 然后从全局作用域中, 传递一个引用指向 this 作为你即时函数的参数。

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

### For 循环

在 for 循环中, 你可以循环取得数组或是数组类似对象的值, 譬如 arguments 和 HTMLCollection 对象。

```js
// 次佳的循环
for (var i = 0; i < arguments.length; i++) {
  // do something
}
```

这种形式的循环的不足在于每次循环的时候数组的长度都要去获取下。

这会降低你的代码, 尤其当 array 不是数组, 而是一个 HTMLCollection 对象的时候。

HTMLCollection 指的是 DOM 方法返回的对象

```
document.getElementsByName()
document.getElementsByClassName()
document.getElementsByTagName()
```

还有其他一些 HTMLCollections, 这些是在 DOM 标准之前引进并且现在还在使用的。

```
document.images: 页面上所有的图片元素
document.links: 所有 a 标签元素
document.forms: 所有表单
document.forms[0].elements: 页面上第一个表单中的所有域
```

集合的麻烦在于它们实时查询基本文档(HTML 页面)

这意味着每次你访问任何集合的长度, 你要实时查询 DOM, 而 DOM 操作一般都是比较昂贵的。

这就是为什么循环获取值时, 缓存数组(或集合)的长度是比较好的形式

```js
// 这样, 在这个循环过程中, 你只检索了一次长度值。
for (var i = 0, max = array.length; i < max; i++) {
  // do something
}
```

如果明确想要修改循环中的集合的时候(例如, 添加更多的 DOM 元素), 你可能更喜欢长度更新而不是常量。

我们可以把变量从循环中提取出来

```js
function looper() {
  var i = 0,
    max,
    array = [];
  for (i = 0, max = array.length; i < max; i++) {
    // do something
  }
}
```

这种形式具有一致性的好处, 因为你坚持了单一 var 形式

不足在于当重构代码的时候, 复制和粘贴整个循环有点困难。

例如, 你从一个函数复制了一个循环到另一个函数, 你不得不去确定你能够把 i 和 max 引入新的函数(如果在这里没有用的话, 很有可能你要从原函数中把它们删掉)。

还有两种变化的形式

- 少了一个变量(max)
- 向下数到 0, 通常更快, 因为和 0 做比较要比和数组长度或是其他不是 0 的东西作比较更有效率

```js
// 第一种变化
var i, arr = []
for(i = arr.length; i--){
    // do something
}

// 第二种变化
var arr = [], i = arr.length
while(i--){
    // do something
}
```

### for-in 循环

for-in 循环应该用在非数组对象的遍历上, 使用 for-in 进行循环也被称为枚举

有个很重要的 hasOwnProperty 方法, 当遍历对象属性可以过滤掉从原型链上下来的属性

```js
// 对象
var man = { hands: 2, legs: 2, heads: 1 };

// 一个方法添加给所有对象
if (typeof Object.prototype.clone === 'undefined') {
  Object.prototype.clone = function () {};
}
```

在这个例子中, 我们有一个使用对象字面量定义的名叫 man 的对象。在 man 定义完成后的某个地方, 在对象原型上增加了一个很有用的名叫 clone()的方法。

此原型链是实时的, 这就意味着所有的对象自动可以访问新的方法。

为了避免枚举 man 的时候出现 clone()方法, 你需要应用 hasOwnProperty()方法过滤原型属性。

如果不做过滤, 会导致 clone()函数显示出来, 在大多数情况下这是不希望出现的。

```js
// 不做过滤
for (var key in man) {
  console.log(key, ':', man[key]);
}
// hands: 2
// legs: 2
// heads: 1
// clone: function()

// 过滤
for (var key in man) {
  if (man.hasOwnProperty(key)) console.log(key, ':', man[key]);
}
// hands: 2
// legs: 2
// heads: 1

// 另一种过滤
for (var key in man) {
  if (Object.prototype.hasOwnProperty.call(man, key)) {
    console.log(key, ':', man[key]);
  }
}

// 其好处在于在man对象重新定义hasOwnProperty情况下避免命名冲突。
// 也避免了长属性查找对象的所有方法, 你可以使用局部变量“缓存”它。
var key,
  hasOwn = Object.property.hasOwnProperty;
for (key in man) {
  if (hasOwn.call(man, key)) {
    console.log(key, ':', man[key]);
  }
}
```

严格来说, 不使用 hasOwnProperty()并不是一个错误。

根据任务以及你对代码的自信程度, 你可以跳过它以提高些许的循环速度。

但是当你对当前对象内容（和其原型链）不确定的时候, 添加 hasOwnProperty()更加保险些。

### 扩展内置原型

增加内置的构造函数原型(如 Object(), 或者 Function())挺诱人的, 但是这严重降低了可维护性, 这会使代码变得难以预测。

另外, 属性添加到原型中, 可能会导致不使用 hasOwnProperty 属性时在循环中显示出来, 这会造成混乱。

### 避免隐式类型转换

JavaScript 的变量在比较的时候会隐式类型转换, 为避免引起混乱的隐含类型转换, 在比较值和表达式类型的时候始终使用 === 和 !== 操作符

### 避免 eval()

此方法接受任意的字符串, 并当作 JavaScript 代码来使用

当有问题的代码是事先知道的(不是运行时确定的), 没有理由使用 eval()

如果代码是在运行时动态生成的, 有一个更好的方式不使用 eval 而达到同样的目标

例如, 用方括号表示法来访问动态属性会更好更简单

```js
// bad
var property = "name";
console.log(eval("obj." + property));

// better
var property = "name"；
console.log(obj[property])
```

使用 eval 会带来安全隐患, 因为被执行的代码(例如从网络来)可能已被篡改

比如当处理 Ajax 请求得到的 JSON 代码的时候, 最好使用 JavaScript 内置方法来解析 JSON 代码, 以确保安全和有效

如浏览器不支持 JSON.parse, 可以使用来自 JSON.org 的库

同样重要的是要记住, 给 setInterval()、setTimeout() 和 Function()构造函数传递字符串, 大部分情况下与使用 eval()是类似的, 因此要避免

```js
// bad
setTimeout('func()', 1000);
setTimeout('func(1, 2, 3)', 1000);

// better
setTimeout(func, 1000);
setTimeout(function () {
  func(1, 2, 3);
}, 1000);
```

使用 new Function() 构造函数就类似于 eval() 就类似于 eval(), 应小心接近

如果必须要要使用 eval(), 可以考虑使用 new Function() 代替

有个潜在的好处, 在 new Function()中做代码评估是在局部函数作用域中运行的, 所以代码中任何通过 var 定义的变量都不会自动变成全局变量

另一种方法来阻止自动全局变量是封装 eval()调用到一个即时函数中

```js
console.log(typeof un); // undefined
console.log(typeof deux); // undefined
console.log(typeof trois); // undefined

// 使用 eval 执行函数字符串
var jsString = 'var un = 1; console.log(un);';
eval(jsString); // 1

// 使用 new Function 执行函数字符串
jsString = 'var deux = 2; console.log(deux);';
new Function(jsString)(); // 2

// 使用封装 eval 执行函数字符串
jsString = 'var trois = 3; console.log(trois);';
(function () {
  eval(jsString);
})(); // 3

console.log(typeof un); // number
console.log(typeof deux); // undefined
console.log(typeof trois); // undefined
```

另一点 eval() 和 Function 构造函数不同的是

eval() 可以干扰作用域链, 而 Function()更安分守己

不管你在那里执行 Function(), 它只看到 局部作用域, 所以其能很好的避免本地变量污染

在下面这个例子中, eval()可以访问和修改它外部作用域中的变量

```js
(function () {
  var local = 1;
  eval('local = 3; console.log(local);'); // 3
  console.log(local); // 3
})();

// 使用Function和new Function是相同的
(function () {
  var local = 1;
  Function('console.log(typeof local);')(); // undefined
})();
```

### parseInt() 下的数值转换

使用 parseInt() 可以从字符串中获取数值, 该方法接受另一个基数参数, 这经常会被省略, 但是这不应该

当字符串以 "0" 开头的时候就有可能会出问题

```js
var month = '06',
  year = '09';

mouth = parseInt(month, 10);
year = parseInt(year, 10);
```

如果忽略了基数参数, 如 parseInt(year)返回的值将会是 0

因为"09"被当作 8 进制(好比执行 parseInt(year, 8)), 而 09 在 8 进制中不是有效数字

```js
+'08'; // 8
Number('08'); // 8
```

这些通常快于 parseInt(), 因为 parseInt()方法, 顾名思意, 不是简单地解析与转换。

但是, 如果你想输入例如"08 hello", parseInt()将返回数字, 而其它以 NaN 告终。
