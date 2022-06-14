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
 *
 * - 一些注意的地方
 *    - 组合模式不是父子关系
 *      组合模式是一种 HAS-A(聚合) 的关系, 而不是 IS-A
 *      组合对象包含一组叶对象, 但 Leaf 并不是 Composite 的子类
 *      组合对象把请求委托给它所包含的所有叶对象, 他们能够合作的关键是拥有相同的接口
 *
 *    - 对叶对象操作的一致性
 *      对一组叶对象的操作必须具有一致性
 *      比如公司要给全体员工发放元旦的过节费 100 块, 这个场景可以运用组合模式
 *      但如果公司给今天过生日的员工发送一封生日祝福的邮件, 组合模式在这里就没有用武之地, 除非先把今天过生日的员工挑选出来
 *      只要用一致的方式对待列表中的每个叶对象的时候, 才适合使用组合模式
 *
 *    - 双向映射关系
 *      发放过节费的通知步骤是从公司到各个部门, 再到各个小组, 最后到每个员工的邮箱里
 *      这本身是一个组合模式的好例子, 但要考虑的一种情况是, 也许某些员工属于多个组织架构
 *      比如某位架构师既隶属开发组, 又隶属于架构组, 对象之间的关系并非严格意义上的层次结构
 *      在这种情况下, 是不适合使用组合模式
 *
 *      这种复合情况下, 我们必须给父节点和子节点建立双向映射关系, 一个简单的方法是给小组和员工对象都增加集合来保存对方的引用
 *      但是这种相互间的引用相当复杂, 而且对象之间产生了过多的耦合性, 修改或者删除一个对象都变得困难, 此时我们可以引入中介者模式来管理这些对象
 *
 *    - 用职责链模式提高组合模式的性能
 *      在组合模式中, 如果树的结构比较复杂, 节点的数量很多, 在遍历树的过程中, 性能方面也许表现得不够理想
 *      有时候我们确实可以借助一些技巧, 在实际操作中避免遍历整棵树, 有一种现成的方案是借助职责链模式
 *
 *      职责链模式一般需要我们手动去设置链条, 但在组合模式中, 父对象和子对象之间实际上形成了天然的职责链
 *      让请求顺着链条从父对象往子对象传递, 或者是反过来从子对象往父对象传递
 *      直到遇到可以处理该请求的对象为止, 这也是职责链模式的经典运用场景之一
 * 
 * - 何时使用组合模式
 *   - 表示对象的部分-整体层次结构
 *     组合模式可以方便地构造一棵树来表示对象的部分一整体结构, 特别是我们在开发期间不确定这棵树到底存在多少层次的时候
 *     在树的结构最终完成之后, 只需要通过请求树的最顶层对象, 便能对整棵树做统一的操作
 *     在组合模式中增加和删除树的节点非常方便, 并且符合开放-封闭原则
 *    
 *   - 客户希望统一对待树中的所有对象
 *     组合模式使客户可以忽略组合对象和叶对象的区别, 客户在面对这棵树的时候
 *     不用关心当前正在处理的对象是组合对象还是叶对象, 也就不用写一堆 if/else 语句来分别处理它们
 *     组合对象和叶对象会各自做自己正确的事情
 */

/**
 * 🌰 : 更强大的宏命令
 * - 打开空调
 * - 打开电视 & 音响
 * - 关门、开电脑、登陆QQ
 *
 * 从例子可以看到, 基本对象可以被组合成更复杂的组合对象, 组合对象又可以被组合, 这样不断被递归下去, 这棵树的结构可以支持任意多的复杂度
 * 在树最终被构造完成之后, 让整棵树最终运转起来的步骤非常简单, 只需要调用最上层对象的 execute 方法
 * 每当对最上层的对象进行一次请求时, 实际上是对整棵树进行深度优先搜索, 而创建组合对象的程序员并不关心这些内在的细节, 往这棵树里面添加一些新的节点对象是非常容易的事情
 *
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

/**
 * 🌰 : 引用父对象
 *    组合对象保存了它下面的子节点的引用, 这是组合模式的特点, 此时树结构是从上到下
 *    但有时候我们需要在子节点上保持对父节点的引用
 *    比如在组合模式中使用职责链时, 有可能需要让请求从子节点往父节点上冒泡传递
 *    还有当我们删除某个文件的时候, 实际是从这个文件所在的上层文件夹中删除该文件
 *
 *    需求: 扫描整个文件夹之前, 可以先移除某个具体的文件
 */
var Folder = function (name) {
  this.name = name;
  /**增加 parent 属性 */
  this.parent = null;
  this.files = [];
};

Folder.prototype.add = function (file) {
  /**设置父对象 */
  file.parent = this;
  this.files.push(file);
};

Folder.prototype.scan = function () {
  console.log('开始扫描文件夹:' + this.name);
  for (var i = 0, file, files = this.files; (file = files[i++]); ) {
    file.scan();
  }
};

Folder.prototype.remove = function () {
  /**
   * 根节点或者树外的游离节点
   * 判断 this.parent
   * 如果 this.parent => null, 那么这个文件夹要么是树的根节点, 要么是还没有添加到树的游离节点
   *     这时候没有节点需要从树中移除, 直接 return, 不做任何操作
   * 如果 this.parent 不为 null, 则说明该文件夹有父节点, 此时遍历父节点中保存的子节点列表, 删除想要删除的子节点
   */
  if (!this.parent) return;
  for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
    var file = files[l];
    if (file === this) files.splice(l, 1);
  }
};

var File = function (name) {
  this.name = name;
  this.parent = null;
};

File.prototype.add = function () {
  throw new Error('不能添加在文件下面');
};

File.prototype.scan = function () {
  console.log('开始扫面文件:' + this.name);
};

File.prototype.render = function () {
  if (!this.parent) return;
  for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
    var file = files[l];
    if (file === this) files.splice(l, 1);
  }
};

/**测试用例 */
var folder = new Folder('学习资料');
var folder1 = new Folder('JavaScript');
var file1 = new File('深入浅出VueJs');

folder1.add(new File('JavaScript 设计模式与开发实践'));
folder.add(folder1);
folder.add(file1);

folder1.remove();
folder.scan()
