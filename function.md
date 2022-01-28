## 揭秘命名函数表达式

### 函数表达式和函数声明

创建函数的最常用的两个方法

- 函数表达式

  function 函数名称(可选)(参数：可选){ 函数体 }

- 函数声明

  function 函数名称(参数：可选){ 函数体 }

所以可以看出, 如果不声明函数名称, 他肯定是表达式, 可如果声明了函数名称的话, 如何判断是函数声明还是函数表达式呢

ECMAScript 是通过上下文来区分的

如果 function foo(){} 是作为赋值表达式的一部分的话, 那它就是一个函数表达式

如果 function foo(){} 被包含在一个函数体内, 或者位于程序的最顶部的话, 那它就是一个函数声明

```js
function foo() {} // 声明, 因为是程序的一部分

var bar = function foo() {}; // 表达式, 是赋值表达式的一部分

new (function Bar() {})(); // 表达式, 因为是 new 表达式

(function () {
  function bar() {}
})(); // 声明, 是函数体的一部分
```

还有一种函数表达式不太常见, 就是被括号括住的(function foo(){})

它是表达式的原因是因为()是一个分组操作符, 它的内部只能包含表达式

```js
function foo() {} // 函数声明
(function bar() {}); // 表达式: 包含在分组操作符内

try{
    (var x = 5);
}catch(error){
    // SyntaxError
}
```

在使用 eval 对 JSON 进行执行的时候, JSON 字符串通常被包含在一个圆括号里面: `eval('(' + json + ')')`

这样做的原因是因为分组操作符, 也就是这对括号, 会让解析器强制将 JSON 的花括号解析成表达式而不是代码块

```js
try {
    {"x": 5}; //  "{" 和 "}" 做解析成代码块
}catch(error){
    // SyntaxError
}

({ "x": 5 }); // 分组操作符强制将"{" 和 "}"作为对象字面量来解析
```

表达式和声明存在的差别

- 函数声明会在任何表达式被解析和求值之前先被解析和求值, 即使声明在代码的最后一行, 它也会在同作用域内第一个表达式之前被解析/求值

```js
console.log(fn());

function fn() {
  return 'hello';
}
```

- 函数声明在条件语句内虽然可以用, 但是没有被标准化, 也就是说不同环境下可能有不同的执行结果, 也就是说不同的环境可能有不同的执行结果, 所以这样情况下, 最好使用函数表达式

```js
// bad: 有的浏览器会返回first的这个function, 而有的浏览器返回的却是第二个
if (true) {
  function foo() {
    return 'first';
  }
} else {
  function foo() {
    return 'second';
  }
}
foo();

// better: 用函数表达式
var foo;
if (true) {
  foo = function () {
    return 'first';
  };
} else {
  foo = function () {
    return 'second';
  };
}
foo();
```

#### 函数声明的实际规则

函数声明只能出现在程序或者函数体内

- 从句法上讲, 它们不能出现在 Block(块)({...})中, 例如 if、while 或者 for 语句中

  因为 Block 中能包含 Statement 语句, 而不能包含函数声明这样的源代码

- 仔细看一看规则也会发现, 唯一可能让表达式出现在 Block 块中情形, 就是让它作为表达式语句的一部分

  但是规范明确规定了表达式语句不能以关键字 function 开头

  而这实际上就是说, 函数表达式同样也不能出现在 Statement 语句或 Block（块）中（因为 Block（块）就是由 Statement 语句构成的）

### 命名函数表达式

在 web 开发有关常用的模式是基于对某种特性的测试来伪装函数定义, 从而达到性能优化的目的

但由于这种方式都是在同一作用域内, 所以基本上一定要用函数表达式

```js
var contains = (function () {
  var docEl = document.documentElement;

  if (typeof docEl.compareDocumentPosition != 'undefined') {
    return function (el, b) {
      return (el.compareDocumentPosition(b) & 16) !== 0;
    };
  } else if (typeof docEl.contains != 'undefined') {
    return function (el, b) {
      return el !== b && el.contains(b);
    };
  }

  return function (el, b) {
    if (el === b) return false;
    while (el != b && (b = b.parentNode) != null);
    return el === b;
  };
})();
```

命名函数表达式, 理所当然, 它得有名字, 前面的例子`var bar = function foo(){};`就是一个有效的命名函数表达式

有一点需要注意: 这个名字只在新定义的函数作用域内有效, 因为规范规定了标示符不能在外围的作用域内有效

```js
var fn = function foo() {
  return typeof foo; // foo 是在内部作用域内有效
};
typeof foo; // foo 在外部是不可见的
fo(); // function
```

### JScript 的 Bug

1. 函数表达式的标识符泄露到外部作用域

```js
var f = function g() {};
typeof g; // function
```

命名函数表达式的标示符在外部作用域是无效的, 但 JScript 明显是违反了这一规范, 上面例子中的标示符 g 被解析成函数对象

2. 将命名函数表达式同时当作函数声明和函数表达式

```js
typeof g; // function
var f = function g() {};
```

特性环境下, 函数声明会优先于任何表达式被解析, 上面的例子展示的是 JScript 实际上是把命名函数表达式当成函数声明了, 因为它在实际声明之前就解析了 g

3. 命名函数表达式会创建两个截然不同的函数对象

```js
var f = function g() {};
f === g; // false

f.expando = 'foo';
console.log(g.expando); // undefined
```

修改了任何一个对象, 另外一个没有什么改变, 通过例子可以发现, 创建 2 个不同的对象, 也就是说如果你想修改 f 的属性中保存某个信息, 然后使用不了引用相同对象的 g 的同名属性

4. 仅仅顺序解析函数声明而忽略条件语句块

```js
var f = function g() {
  return 1;
};
if (false) {
  f = function g() {
    return 2;
  };
}
g(); //2
```

- g 被当作函数声明解析, 由于 JScript 中的函数声明不受条件代码块约束,
  所以在这个很恶的 if 分支中, g 被当作另一个函数` function g(){ return 2 }`, 也就是又被声明了一次。
- 有"常规的"表达式被求值, 而此时 f 被赋予了另一个新创建的对象的引用。由于在对表达式求值的时候, 永远不会进入这个可恶 if 分支,
  因此 f 就会继续引用第一个函数`function g(){ return 1 }`。

#### 不同的对象和 arguments.callee 相比较

```js
var f = function g() {
  return [arguments.callee === f, arguments.callee === g];
};
// 不同的对象和arguments.callee相比较
f(); // [true, false]
g(); // [false, true]
```

5. 不包含声明的赋值语句中使用命名函数表达式

```js
(function () {
  f = function () {};
})();
```

原本是想创建一个全局属性 f(注意不要和一般的匿名函数混淆了, 里面用的是带名字的生命)

- 它把表达式当作函数声明来解析, 所以左边的 f 被声明为局部变量了(和一般的匿名函数里的声明一样)
- 在函数执行的时候, f 已经是定义过的了, 右边的 function f(){}则直接就赋值给局部变量 f 了

结论: f 根本就不是全局属性

#### 预防的问题

1. 防范标识符泄露带到外部作用域
2. 应该永远不引用被用作函数名称的标识符
3. 关键就在于始终要通过 f 或者 arguments.callee 来引用函数, 如果你使用了命名函数表达式，那么应该只在调试的时候利用那个名字
4. 一定要把命名函数表达式声明期间错误创建的函数清理干净
