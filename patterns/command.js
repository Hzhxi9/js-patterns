/**
 * @description 命令模式
 *
 *     定义: 一个执行某些特定事情的命令
 *
 *     应用场景:
 *
 *        - 有时候需要向某些对象发送请求, 但是并不知道请求的接收者是谁, 也不知道被请求的操作是什么
 *          此时希望用一种松耦合的方式来设计程序, 使得请求发送者和请求接收者能够消除彼此之间的耦合关系
 *
 *        - 相对于过程化的请求调用, command 对象拥有更长的生命周期
 *          对象的生命周期是跟初始请求无关的, 因为这个请求已经被封装在 command 对象的方法中, 成为这个对象的行为
 *          我们可以在程序运行的任意时刻取调用这个方法
 *
 *        - 命令模式还支持撤销、排队等操作
 *
 *      由来: 回调函数的一个面向对象的替代品
 *
 *
 */

/**
 *  🌰 : 菜单程序 (使用传统面向对象语言实现)
 *      界面有数十个按钮, 我们不清楚按钮未来将用来做什么
 *
 *      此时运用命令模式的理由: 点击了按钮之后, 必须向某些复杂具体行为的对象发送请求, 这些对象就是请求的接收者
 *                          但是目前不知道接收者是什么对象, 也不知道接收者会做什么
 *                          此时我们需要借助命令对象的帮助， 以便解开按钮和负责具体行为对象之间的耦合
 *
 *      实现思路:
 *          命令模式将过程式的请求调用封装在 command 对象的 execute 方法里, 通过封装方法调用, 我们可以把运算块包装成形
 *          command 对象可以被四处传递, 所以在调用命令的时候, 客户不需要关心事件是如何进行
 */

/** 1、按钮绘制 */

/**
 * <body>
 *    <button id="btn1">按钮1</button>
 *    <button id="btn2">按钮2</button>
 *    <button id="btn3">按钮3</button>
 * </body>
 * <script>
 *      var btn1 = document.getElementById('btn1')
 *      var btn2 = document.getElementById('btn2')
 *      var btn3 = document.getElementById('btn3')
 * </script>
 */

/**
 * 2、定义 setCommand 函数
 *      setCommand 函数负责往按钮上面安装命令
 *      点击按钮会执行某个 command 命令, 执行命令的动作被约定为调用 command 对象的 execute 方法
 **/
var setCommand = function (btn, command) {
  btn.onclick = function () {
    command.execute();
  };
};

/**3. 点击按钮之后的具体行为 */
var MenuBar = {
  refresh: function () {
    console.log('刷新菜单目录');
  },
};

var SubMenu = {
  add: function () {
    console.log('添加子菜单');
  },
  del: function () {
    console.log('删除子菜单');
  },
};

/**4、 在让按钮变得有用之前, 先把命令封装在命令类中 */
var RefreshMenuBarCommand = function (receiver) {
  this.receiver = receiver;
};
RefreshMenuBarCommand.prototype.execute = function () {
  this.receiver.refresh();
};

var AddSubMenuCommand = function (receiver) {
  this.receiver = receiver;
};
AddSubMenuCommand.prototype.execute = function () {
  this.receiver.add();
};

var DeleteMenuCommand = function (receiver) {
  this.receiver = receiver;
};
DeleteMenuCommand.prototype.execute = function () {
  console.log('删除成功');
};

/**5. 把命令接收者传入到 command 对象中, 并且把 command 对象安装到 button 上面 */
var refreshMenuBarCommand = new RefreshMenuBar(MenuBar);
var addSubMenuCommand = new AddSubMenuCommand(SubMenu);
var delSubMenuCommand = new DeleteMenuCommand(SubMenu);

setCommand(btn1, refreshMenuBarCommand);
setCommand(btn2, addSubMenuCommand);
setCommand(btn3, delSubMenuCommand);

/**
 * 🌰 : 菜单程序 (使用闭包函数实现)
 *
 *   接收者呗封闭在闭包产生的环境中, 执行命令的操作可以更加简单, 仅仅执行回调函数即可
 */

var setCommand = function (btn, func) {
  button.onclick = function () {
    func();
  };
};

var MenuBar = {
  refresh: function () {
    console.log('刷新菜单目录');
  },
};

var RefreshMenuBarCommand = function (receiver) {
  return function () {
    receiver.refresh();
  };
};

var refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);

setCommand(btn1, refreshMenuBarCommand);

/**
 * @fixme 为了更明确地表达当前正在使用命令模式, 或者除了执行命令之外, 将来有可能提供撤销命令等操作
 *        最好将执行函数改为调用 execute 方法
 */
var RefreshMenuBarCommand = function (receiver) {
  return {
    execute: function () {
      receiver.refresh();
    },
  };
};

var setCommand = function (btn, command) {
  btn.onclick = function () {
    command.execute();
  };
};

var refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);
setCommand(btn1, refreshMenuBarCommand);
