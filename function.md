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

  而这实际上就是说, 函数表达式同样也不能出现在 Statement 语句或 Block（块）中（因为 Block（块）就是由 Statement 语句构成的）。
