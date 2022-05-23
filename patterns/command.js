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
 *      命令队列:
 *
 *        队列在动画中的运用场景：
 *
 *          比如之前的小球运动程序中有可能遇到另外一个问题, 有些用户反馈, 这个程序只适合于 APM 小于 20 的人群, 大部分用户都有快速连续点击按钮的习惯
 *          当用户第二次点击 button 的时候, 此时小球的前一个动画可能尚未结束, 于是前一个动画骤然结束, 开始第二个动画的运动过程
 *          这不是用户期望的, 用户希望两个动画会排队进行
 *
 *           把请求封装城命令对象, 对象的生命周期几乎是永久的, 除非我们主动去回收
 *           也就是说, 命令对象的生命周期跟初始请求发生的时间无关, command 对象的 execute 方法可以在程序运动的任何时刻执行
 *           即使点击按钮的请求早已发生, 但我们的命令对象仍然有生命
 *
 *           所以我们可以把 div 的这些运动过程都封装城命令对象, 再把它们压进一个队列堆栈,
 *           当动画执行完, 也就是当前 command 对象的职责完成之后, 会主动通知队列, 此时取出正在队列中等待的第一个命令对象, 并且执行它
 *
 *        动画结束后如何通知队列:
 *
 *            - 通常可以使用回调函数来通知队列
 *            - 可以选择发布订阅模式 (在一个动画结束后发布一个消息, 订阅者接收到这个消息之后, 便开始执行队列里的下一个动画)
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

/**
 * 🌰 :撤销命令
 * 需求: 让页面上的小球移动到水平方向的某个位置, 现在页面中有一个 input 文本框和 button 按钮
 *      文本框中可输入一些数字, 让球移动水平方向的某个方向
 *      小球在用户点击按钮后立刻开始移动
 */

/**
 * <body>
 *    <div id="ball" style="position: absolute; background: #000; width: 50px; height: 50px"></div>
 *
 *    输入小球移动后的位置: <input id="pos"/>
 *    <button id="move-btn">开始移动</button>
 *    <button id="cancel-btn">cancel</button> <!-- 增加撤销按钮 -->
 * </body>
 */

var ball = document.getElementById('ball');
var pos = document.getElementById('pos');
var btn = document.getElementById('move-btn');
var cancelBtn = document.getElementById('cancel-btn');

btn.onclick = function () {
  var animate = new Animation(ball);
  animate.start('left', pos.value, 1000, 'strongEaseOut');
};

/**
 * 现在需要增加一个方法还原到开始移动之前的位置 (使用命令模式)
 *
 * 原理:
 *    撤销命令一般是给命令对象增加一个名为 unexecute or undo 的方法,
 *    在该方法里执行 execute 的方向操作
 *    在 command.execute 方法让小球开始真正运动之前, 我们需要先记录小球的当前位置,
 *    在 unexecute 或者 undo 操作中, 再让小球回到刚刚记录下的位置
 *
 * 在命令模式中小球的原始位置移动前已经作为 command 对象的属性被保存起来,
 * 所以只需要提供一个 undo 方法, 并且在 undo 方法中让小球回到刚刚记录的原始位置就可以了
 **/
var MoveCommand = function (receiver, pos) {
  this.receiver = receiver;
  this.pos = pos;
  this.oldPos = null;
};

MoveCommand.prototype.execute = function () {
  this.receiver.start('left', pos.value, 1000, 'strongEaseOut');
  /**记录小球开始运动前的位置 */
  this.oldPos = this.receiver.dom.getBoundingClientRect()[this.receiver.propertyName];
};

MoveCommand.prototype.unexecute = function () {
  /**回到小球移动前记录的位置 */
  this.receiver.start('left', this.oldPos, 1000, 'strongEaseOut');
};

var moveCommand;
btn.onclick = function () {
  var animate = new Animation(ball);
  moveCommand = new MoveCommand(animate, pos.value);
  moveCommand.execute();
};

cancelBtn.onclick = function () {
  moveCommand.unexecute();
};

/**
 * 🌰 : 撤消和重做
 * 撤消一系列操作: 比如在一个围棋程序中, 现在已经下了 10 步棋, 我们需要一次性悔棋到第五步
 *              在这之前我们可以把所有执行过的下棋命令都存储在一个历史列表中, 然后倒序循环来依次执行这些命令的 undo 操作,
 *              直到循环执行到第5个命令为止
 * 重做: 先清除画布, 然后把刚才执行过的命令全部重新执行一遍, 这一点同样可以利用一个历史列表堆栈办到,
 *      记录命令日志, 然后重复执行它们
 *
 * 需求: 实现播放录像功能
 */

/**
 * <body>
 *    <button id="replay">播放录像</button>
 * </body>
 */
var Ryu = {
  attack: function () {
    console.log('开始攻击');
  },
  defense: function () {
    console.log('防御');
  },
  jump: function () {
    console.log('跳跃');
  },
  crouch: function () {
    console.log('蹲下');
  },
};
var makeCommand = function (receiver, state) {
  return function () {
    /**创建命令 */
    receiver[state]();
  };
};
var commends = {
  119: 'jump', // W
  115: 'crouch', // S
  97: 'defense', // A
  100: 'attack', // D
};

var commandStack = []; // 保存命令的堆栈

document.onkeypress = function (ev) {
  var keyCode = event.keyCode,
    command = makeCommand(Ryu, command[keyCode]);

  if (command) {
    command(); // 执行命令
    commandStack.push(command); // 将刚刚执行过的命令保存进堆栈
  }
};

/**点击播放录像 */
document.getElementById('replay').onclick = function () {
  var command;
  while ((command = commandStack.shift())) {
    /**从堆栈里依次取出命令并执行 */
    command();
  }
};

/**
 * 🌰 : 宏命令
 *
 *    定义: 一组命令的集合, 通过执行宏命令的方式, 可以一次执行一批命令
 *
 *    需求: 按一个特别的按钮, 它就会帮我们关上房间门, 顺便打开电脑并登陆 QQ
 * 
 *    扩展: 还可以为宏命令添加撤销功能, 跟 macroCommand.execute 类似, 当调用 macroCommand.undo 方法时, 
 *         宏命令里包含的所有子命令对象要依次执行各自的 undo 方法
 */

/**1. 创建好各种 Command 对象 */
var closeDoorCommand = {
  execute: function () {
    console.log('关上门');
  },
};

var openPCCommand = {
  execute: function () {
    console.log('打开电脑');
  },
};

var openQQCommand = {
  execute: function () {
    console.log('打开 QQ');
  },
};

/**
 * 2. 定义宏命令 MacroCommand
 *  MacroCommand.add 表示把子命令添加进宏命令对象,
 *  当调用宏命令对象的 execute 方法时, 会迭代这一组子命令对象, 并且依次执行它们的 execute 方法
 */
var MacroCommand = function () {
  return {
    commends: [],
    add: function (commend) {
      this.commends.push(commend);
    },
    execute: function () {
      for (var i = 0, commend; (commend = this.commends[i++]); ) {
        commend.execute();
      }
    },
  };
};
var macroCommand = new MacroCommand();

macroCommand.add(closeDoorCommand);
macroCommand.add(openPCCommand);
macroCommand.add(openQQCommand);

macroCommand.execute();
