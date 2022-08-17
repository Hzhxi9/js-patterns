/**
 * 享元模式:
 *
 *     作用: 用于性能优化
 *     核心: 运用共享技术来有效支持大量细粒度的对象
 *     要求: 将对象的属性划分为 内部状态 与 外部状态(状态在这里通常是指属性)
 *     目标: 尽量减少共享对象的数量
 *     如何划分内外状态:
 *          - 内部状态存储在对象内部
 *          - 内部状态可以被一些对象共享
 *          - 内部状态独立于具体的场景, 通常不会被改变
 *          - 外部状态取决于具体的场景, 并根据场景而改变, 外部状态不能被共享
 * 
 *     根据划分, 便可以把所有内部状态相同的对象都指定为同一个共享的对象, 而外部状态可以从对象身上剥离出来, 并存储在外部
 *     剥离外部状态的对象成为共享对象, 外部状态在必要时被传入共享对象来组装成一个完整的对象

 *     虽然组装外部状态称为一个完整对象的过程需要花费一定的时间, 但却可以大大减少系统中对象的数量 
 *     享元模式是一种时间换空间的优化模式
 *     
 *          
 */

/**
 * 🌰
 * 有个内衣工厂, 目前有产品 50 种男式内衣, 50 种女式内衣
 * 工厂决定生产一些塑料模特来穿上他们的内衣排出广告照片
 * 正常情况下需要 50 名男模特和 50 名女模特
 */

/**
 * 不使用享元模式:
 *   一共会产生 100 个对象, 如果将来要生产 10000 中内衣, 那么程序可能就会因为存在如此多的对象提前崩溃
 **/
var Model = function (sex, underwear) {
  this.sex = sex;
  this.underwear = underwear;
};

Model.prototype.takePhoto = function () {
  console.log(`sex=${this.sex} underwear=${this.underwear}`);
};

for (var i = 0; i <= 50; i++) {
  var maleModel = new Model('male', 'underwear' + i);
  maleModel.takePhoto();
}

for (var j = 0; j <= 50; j++) {
  var femaleModel = new Model('female', 'underwear' + j);
  femaleModel.takePhoto();
}

/**
 * 优化版本: 男模特和女模特各自有一个就够了, 他们可以分别穿上不同的内衣来拍照
 *
 * 性别是内部状态, 内衣是外部状态
 * 区分两种状态可以大大减少系统中对象的数量
 *
 * 内部状态有多少种组合, 系统中就最多存在几种对象
 *
 * 使用享元模式的关键是 区分内部状态和外部状态
 *
 * 内部状态: 可以被对象共享的属性
 *          如同不管什么样式的衣服, 都可以按照性别不同, 穿在同一个模特身上
 *          模特的性别就可以作为内部状态存储在共享对象的内部
 *
 * 外部状态: 取决于具体的场景, 并根据场景而变化
 *          就像例子中每件衣服都是不同的, 他们不能被一些对象共享
 *          因此只能被划分为外部状态
 *
 * 存在问题:
 *   - 通过构造函数显示 new 出了男女两个 model 的对象, 在其他系统中也许并不是一开始就需要所有的共享对象
 *   - 给 model 对象手动设置了 underwear 外部状态, 在更复杂的系统中, 会因为外部状态可能相当复杂, 造成跟共享对象的联系变得困难
 *
 * 解决方式:
 *   - 通过一个对象工厂来解决第一个问题, 只有当某种共享对象被真正需要时候, 他才从工厂中被创建出来
 *   - 第二个问题可以用一个管理器来记录对象相关的外部状态, 使这些外部状态通过某个钩子和共享对象联系起来
 */
var Model = function (sex) {
  this.sex = sex;
};
Model.prototype.takePhoto = function () {
  console.log(`sex=${this.sex} underwear=${this.underwear}`);
};

/**分别创建一个男模特和一个女模特 */
var maleModal = new Model('male'),
  female = new Model('female');

/**给男模特穿上所有的服装 */
for (var i = 0; i <= 50; i++) {
  maleModal.underwear = 'underwear' + i;
  maleModal.takePhoto();
}

/**给女模特穿上所有的服装 */
for (var j = 0; j <= 50; j++) {
  femaleModal.underwear = 'underwear' + j;
  femaleModal.takePhoto();
}

/**🌰 :文件上传 */

/**
 * 对象爆炸问题: 文件上传支持同时选择 2000 个文件, 每个文件对应着一个上传对象, 代表选择 2000个文件, 就要同时 new 2000个 upload 对象
 *
 * 原理: 当用户选择了文件之后, 插件和 Flash 都会通知调用 Window 下的一个全局 Javascript 函数
 *      它的名字是 startUpload, 用户选择的文件列表会被组合成一个数组 files 塞进该函数的参数列表中
 **/
var id = 0;

/**uploadType 区分控件还是flash */
window.startUpload = function (uploadType, files) {
  for (var i = 0, file; (file = files[i++]); ) {
    /**用户选择完文件, 会遍历 files 数组来创建对应的 upload 对象 */
    var uploadObj = new Upload(uploadType, file.fileName, file.fileSize);
    /**给 upload 对象设置一个唯一的 id */
    uploadObj.init(id++);
  }
};

/**
 *
 * @param {*} uploadType 插件类型
 * @param {*} fileName 文件名
 * @param {*} fileSize 文件大小
 */
var Upload = function (uploadType, fileName, fileSize) {
  this.uploadType = uploadType;
  this.fileName = fileName;
  this.fileSize = fileSize;
  this.dom = null;
};

Upload.prototype.init = function (id) {
  var that = this;
  this.id = id;
  this.dom = document.createElement('div');
  this.dom.innerHTML = `
    <span>文件名称: ${this.fileName} 文件大小: ${this.fileSize}</span>
    <button class="delBtn">删除</button>
  `;
  this.dom.querySelector('.delBtn').onclick = function () {
    that.delFile();
  };
  document.body.appendChild(this.dom);
};

/**
 * 当被删除文件小于 300Kb 时, 该文件将被直接删除
 * 否则会弹出一个提示框, 提醒用户是否确认要删除该文件
 */
Upload.prototype.delFile = function () {
  if (this.fileSize < 3000) return this.dom.parentNode.removeChild(this.dom);
  if (window.confirm('确定要删除该(' + this.fileName + ')文件吗')) return this.dom.parentNode.removeChild(this.dom);
};

const files1 = [
  { fileName: '1.txt', fileSize: 1000 },
  { fileName: '2.txt', fileSize: 2000 },
  { fileName: '3.txt', fileSize: 1000 },
];
startUpload('plugin', files1);
startUpload('flash', files1);

/**
 * 🌰 : 享元模式重构
 *
 *  - 确认插件类型 uploadType 是内部状态
 *      upload 对象必须依赖 uploadType 属性才能工作, 因为插件上传、Flash上传、表单上传的实际工作原理有很大区别
 *      它们各自调用的接口也是完全不一样的, 必须在对象创建之初就明确它是什么类型的插件, 才能在程序运行过程中, 让它们分别调用各自的 start、pause、cancel、del 等方法
 *
 *  - 一旦明确了 uploadType, 无论我们使用什么方式上传, 这个上传对象都是可以被任何文件共享的,
 *    而 fileName 和 fileSize 是根据场景而变化的, 每个文件的 fileName 和 fileSize 都不一样,
 *    所以没办法被共享, 只能被划分为外部状态
 */

/**剥离外部状态 */
var Upload = function (uploadType) {
  this.uploadType = uploadType;
};

Upload.prototype.delFile = function (id) {
  /**
   * 删除文件前, 需要读取文件的实际大小
   * 文件大小被储存在外部管理器 uploadManager 中内
   * 通过 UploadManager.setExternalState 方法给共享对象设置正确的 fileSize
   */
  UploadManager.setExternalState(id, this);

  if (this.fileSize < 3000) return this.dom.parentNode.removeChild(this.dom);

  if (window.confirm('确定要删除该(' + this.fileName + ')文件吗')) return this.dom.parentNode.removeChild(this.dom);
};

/**工厂进行对象实例化 */
var UploadFactory = (function () {
  var createdFlyWeightObjs = {};
  return {
    create: function (uploadType) {
      /**如果内部状态对应的共享对象以及被创建过, 那么直接返回这个对象 */
      if (createdFlyWeightObjs[uploadType]) return createdFlyWeightObjs[uploadType];
      /**否则创建一个新的对象 */
      return (createdFlyWeightObjs[uploadType] = new Upload(uploadType));
    },
  };
})();

/**
 * 管理器封装外部状态
 *   负责向 UploadFactory 提交创建对象的请求, 并用一个 uploadDatabase 对象保存所有 upload 对象的外部状态
 *   以便于共享对象设置外部状态
 */
var UploadManager = (function () {
  var uploadDatabase = {};

  return {
    add: function (id, uploadType, fileName, fileSize) {
      var flyWeightObj = UploadFactory.create(uploadType);

      var dom = document.createElement('div');

      dom.innerHTML = `
        <span>文件名称: ${fileName} 文件大小: ${fileSize}</span>
        <button class="delBtn">删除</button>
      `;

      dom.querySelector('.delBtn').onclick = function () {
        flyWeightObj.delFile(id);
      };

      document.body.appendChild(dom);

      uploadDatabase[id] = { fileName, fileSize, dom };

      return flyWeightObj;
    },
    setExternalState: function (id, flyWeightObj) {
      var uploadData = uploadDatabase[id];
      for (var key in uploadData) {
        flyWeightObj[key] = uploadData[key];
      }
    },
  };
})();

/**触发上传动作的 startUpload */
var id = 0;
window.startUpload = function (uploadType, files) {
  for (var i = 0, file; (file = files[i++]); ) {
    var uploadObj = UploadManager.add(++id, uploadType, file.fileName, file.fileSize);
  }
};

/**测试上传 */
const files2 = [
  { fileName: '1.txt', fileSize: 1000 },
  { fileName: '2.txt', fileSize: 2000 },
  { fileName: '3.txt', fileSize: 1000 },
];
startUpload('plugin', files2);
startUpload('flash', files2);

/**享元模式重构后, 对象数量为 2, 同时上传 2000 个文件, 创建的 upload 对象数量依旧为 2 */

/**没有内部状态的享元 */
/**🌰 : 不需要考虑极速上传(控件) 和普通上传(flash) 之间的切换, 这意味着在之前的代码中作为内部状态的 uploadType 属性是可以删除的 */
var UploadFactory = (function () {
  var uploadObj;
  return {
    /**对象没有内部状态的时候, 生产共享对象的工厂实际上变成了一个单例工厂 */
    create: function () {
      return uploadObj ? uploadObj : (uploadObj = new Upload());
    },
  };
})();

/**没有外部状态的享元 */
/**
 * 🌰 : 对象池
 *
 *    - 概念: 对象池维护一个装载空闲对象的池子, 如果需要对象的时候, 不是直接 new, 而是转从对象池中获取
 *           如果对象池中没有空闲对象, 则创建一个新的对象, 当获取出的对象完成它的指责之后, 在进入池子等待被下次获取
 *
 *    - 应用场景: HTTP 连接池和数据库连接池都是其代表应用, 在 Web 前端开发中, 使用最多的场景就是跟 DOM 有关的操作
 *
 *    - 实现: 对象池实现 Tooltip
 */

/**获取小气泡节点的工厂 */
var toolTipFactory = (function () {
  /**私有属性: 作为对象池数组 */
  var toolTipPool = [];

  return {
    /**获取一个 div 节点 */
    create: function () {
      if (toolTipPool.length === 0) {
        /**如果对象池为空, 创建一个 dom */
        var div = document.createElement('div');
        document.body.appendChild(div);
        return div;
      } else {
        /**如果对象池不为空, 则从池子中取出一个 dom */
        return toolTipPool.shift();
      }
    },
    /**回收一个 div 节点 */
    recover: function (tooltipDom) {
      /**对象池回收 dom */
      return toolTipPool.push(tooltipDom);
    },
  };
})();

/**第一次搜索, 需要创建两个小气泡节点 */
var ary = []; /**为了方便回收, 用一个数组记录它们 */

for (var i = 0, str; (str = ['A', 'B'][i++]); ) {
  var tooltip = toolTipFactory.create();
  tooltip.innerHTML = str;
  ary.push(tooltip);
}

/**需要开始重新绘制 */
for (var i = 0, tooltip; (tooltip = ary[i++]); ) {
  /**需要把这两个节点回收进对象池 */
  toolTipFactory.remove(tooltip);
}

/**再创建 6 个小气泡 */
for (var i = 0, str; (str = ['A', 'B', 'C', 'D', 'E', 'F'][i++]); ) {
  /**上次创建好的节点被共享给了下一次的操作 */
  var tooltip = toolTipFactory.create();
  /**
   * 虽然 innerHTML 的值给了 A、B、C 等也可以看成节点的外部状态
   * 但这里并没有主动分离内部状态和外部状态的过程
   */
  tooltip.innerHTML = str;
}

/**🌰 : 通用对象池实现 */
var ObjectPoolFactory = function (createObjFn) {
  var objectPool = [];
  return {
    create: function () {
      var obj = objectPool.length === 0 ? createObjFn.apply(this, arguments) : objectPool.shift();
      return obj;
    },
    recover: function (obj) {
      objectPool.push(obj);
    },
  };
};
/**测试: 创建一个装载一些 iframe 的对象池 */
var iframeFactory = ObjectPoolFactory(function () {
  var iframe = document.createElement('iframe');
  document.body.appendChild(iframe);

  iframe.onload = function () {
    /**防止 iframe 重复加载 */
    iframe.onload = null;
    /**iframe 加载完成之后回收节点 */
    iframeFactory.recover();
  };
  return iframe;
});
var iframe1 = iframeFactory.create();
iframe1.src = 'http://www.baidu.com';

var iframe2 = iframeFactory.create();
iframe2.src = 'http://www.qq.com';


setTimeout(() => {
  var iframe3 = iframeFactory.create();
  iframe3.src = 'http://www.163.com';
}, 3000)