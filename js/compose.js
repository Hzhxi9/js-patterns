/**
 * @description 组合模式
 *
 * - 用途:
 *   组合模式将对象组合成树形结构, 以表示"部分-整体"的层次结构
 *
 * - 好处
 *   - 用来表示树形结构
 *     通过宏命令的例子, 我们可以直观的找到组合模式的优点:
 *     提供了一个遍历树形结构的方案, 通过调用组合对象的 execute 方法, 程序会递归调用组合对象下面的叶对象的 execute 方法,
 *     所以我们的万能遥控器只需要一次操作, 便能依次完成关门、打开电脑、登陆QQ 这几件事
 *     组合模式可以非常方便地描述对象部分-整体层级结构
 *
 *   - 通过对象的多态性表现, 使得用户对单个对象和组合对象的使用具有一致性
 *     利用对象的多态性表现, 可以使客户端忽略组合对象和单个对象的不同
 *     在组合模式中, 客户将统一地使用组合结构中的所有对象, 而不需要关心它究竟是组合对象还是单个对象
 *
 * - 请求在树中传递的过程
 *   请求从树的最顶端的对象往下传递,
 *    - 如果当前处理请求的对象是叶对象(普通子命令), 叶对象自身会对请求作出相应的处理 (子节点是叶对象,叶对象自身会处理这个请求)
 *    - 如果当前处理请求的对象是组合对象(宏命令), 组合对象则会遍历它属下的子节点, 将请求继续传递给这些子节点 (子节点是组合对象,请求会继续往下传递)
 *
 *   叶对象下面不会再有其他子节点, 一个叶对象就是树的这条枝叶的尽头, 组合对象下面可能还会有子节点
 *   请求从上到下沿着树进行传递, 直到树的尽头, 作为客户, 只需要关心树最顶层的组合对象, 客户只需要请求这个组合对象, 请求便会沿着树往下传递, 依次到达所有的叶对象
 */

/**
 * 🌰 : 更强大的宏命令
 * - 打开空调
 * - 打开电视&音响
 * - 关门、开电脑、登陆QQ
 *
 * 从例子可以看到, 基本对象可以被组合成更复杂的组合对象, 组合对象又可以被组合, 这样不断被递归下去, 这棵树的结构可以支持任意多的复杂度
 * 在树最终被构造完成之后, 让整棵树最终运转起来的步骤非常简单, 只需要调用最上层对象的 execute 方法
 * 每当对最上层的对象进行一次请求时, 实际上是对整棵树进行深度优先搜索, 而创建组合对象的程序员并不关心这些内在的细节, 往这棵树里面添加一些新的节点对象是非常容易的事情
 */

/**
 * <button id="button">按我</button>
 */
var MacroCommand = function () {
  return {
    commandsList: [],
    add: function (command) {
      this.commandsList.push(command);
    },
    execute: function () {
      for (let i = 0, command; (command = this.commandsList[i++]); ) {
        command.execute();
      }
    },
  };
};
var openAcCommand = {
  execute() {
    console.log('打开空调');
  },
};

/**用一个宏命令来组合打开电视和音响的命令 */
var openTvCommand = {
  execute() {
    console.log('打开电视');
  },
};
var openSoundCommand = {
  execute() {
    console.log('打开音响');
  },
};
var macroCommand1 = MacroCommand();
macroCommand1.add(openTvCommand);
macroCommand1.add(openSoundCommand);

/**关门、开电脑、登陆QQ的命令 */
var closeDoorCommand = {
  execute() {
    console.log('关门');
  },
};
var openPcCommand = {
  execute() {
    console.log('开电脑');
  },
};
var openQQCommand = {
  execute() {
    console.log('登陆QQ');
  },
};
var macroCommand2 = MacroCommand();
macroCommand2.add(closeDoorCommand);
macroCommand2.add(openPcCommand);
macroCommand2.add(openQQCommand);

/**现在把所有命令组合成一个超级命令 */
var macroCommand = MacroCommand();
macroCommand.add(macroCommand1);
macroCommand.add(macroCommand2);
macroCommand.add(openAcCommand);

/**给遥控器绑定超级命令 */
var setCommand = (function (command) {
  document.getElementById('button').onclick = function () {
    command.execute();
  };
})(macroCommand);

/**
 * 🌰 : 透明性带来的安全问题
 *
 *   - 组合模式的透明性使得发起请求的客户不用去顾虑树中组合对象和叶对象的区别, 但他们在本质上是有区别的
 *     - 组合对象可以拥有子节点, 叶对象下面就没有子节点
 *     - 解决方案: 给叶对象也增加 add 方法, 并且在调用这个方法时, 抛出一个异常来提醒客户
 */
var MacroCommand = function () {
  return {
    commandsList: [],
    add: function (command) {
      this.commandsList.push(command);
    },
    execute: function () {
      for (var i = 0, command; (command = this.commandsList[i++]); ) {
        command.execute();
      }
    },
  };
};

var openTvCommand = {
  execute() {
    console.log('打开电视');
  },
  add() {
    throw new Error('叶对象不能添加子节点');
  },
};

var macroCommand = MacroCommand();
macroCommand.add(openTvCommand);
openTvCommand.add(macroCommand); // Error: 叶对象不能添加子节点

/**
 * 🌰 : 扫描文件夹
 *   - 文件夹里既可以包含文件、又可以包含其他文件夹, 最终可能组合成一棵树
 *   - 好处:
 *     - 复制文件的时候, 不需要考虑这批文件的类型, 组合模式让 ctrl + v、ctrl + c 成为一个统一的操作
 *     - 用杀毒软件扫描该文件夹时候, 不用关心里面有多少文件和文件夹, 组合模式使得我们只需要操作最外层的文件夹进行扫描
 */

/**文件夹 */
var Folder = function (name) {
  this.name = name;
  this.files = [];
};
Folder.prototype.add = function (file) {
  this.files.push(file);
};
Folder.prototype.scan = function () {
  console.log('开始扫描文件夹' + this.name);
  for (let i = 0, file, files = this.files; (file = files[i++]); ) {
    file.scan();
  }
};

/**文件 */
var File = function (name) {
  this.name = name;
};
File.prototype.add = function () {
  throw new Error('文件下面不能添加文件');
};
File.prototype.scan = function () {
  console.log('开始扫描文件', this.name);
};

/**创建一些文件夹和文件, 并且组合成一棵树 */
var folder = new Folder('学习资料');
var folder1 = new Folder('Javascript');
var folder2 = new Folder('JQuery');

var file1 = new File('红宝书');
var file2 = new File('精通JQuery');
var file3 = new File('重构与模式');

folder1.add(file1);
folder2.add(file2);

folder.add(folder1);
folder.add(folder2);
folder.add(file3);

/**将移动硬盘里的文件和文件夹都复制到这棵树中 */
var folder3 = new Folder('NodeJs');
var file4 = new File('深入浅出NodeJs');
var file5 = new File(' Javascript语言精髓与编程实践');
folder3.add(file4);

/**将这些文件添加到原有的树中 */
folder.add(folder3);
folder.add(file5);

/**扫描文件夹 */
folder.scan();
