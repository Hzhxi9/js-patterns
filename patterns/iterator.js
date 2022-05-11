/**
 * 迭代器模式:
 *     提供一种方法顺序访问一个聚合对象中的各个元素, 而又不需要暴露该对象的内部表示
 *     迭代器模式可以把迭代的过程从业务逻辑中分离出来, 在使用迭代模式之后, 即使不关心对象的内部构造, 也可以按照顺序访问其中的每个元素
 */

/**🌰 : JQuery 中的迭代器 */
$.each([1, 2, 3], function (i, n) {
  console.log('当前下标:' + i);
  console.log('当前元素:' + n);
});

/**🌰 : 实现 each 函数 */
var each = function (ary, callback) {
  for (var i = 0, l = ary.length; i < l; i++) {
    callback.call(ary[i], i, ary[i]);
  }
};
each([1, 2, 3], (i, n) => {
  console.log([i, n]);
});

/**
 * 内部迭代器 & 外部迭代器
 *   - 内部迭代器: 👆 each 函数属于内部迭代器, each 函数的内部已经定义好了迭代规则, 它完全接手了整个迭代过程, 外部只需要一次初始调用
 *                由于内部迭代器的迭代规则已经被提前规定, 👆 each 函数无法同时迭代两个数组
 * 
 *   - 外部迭代器: 必须显示地请求迭代下一个元素, 外部迭代器增加了一些调用的复杂度, 但相对也增强了迭代器的灵活性, 可以手动控制迭代的过程或者顺序
 */

/**🌰 : 内部迭代器: 判断两个数组里元素的值是否完全相等 */
var compare = function (ary1, ary2) {
  if (ary1.length !== ary2.length) throw new Error('ary1 和 ary2 不相等');
  each(ary1, function (i, n) {
    if (n !== ary2[i]) throw new Error('ary1 和 ary2 不相等');
  });
  console.log('ary1 和 ary2 相等');
};
compare([1, 2, 3], [1, 2, 4]);

/**🌰 : 外部迭代器实现  */
var Iterator = function (obj) {
  var current = 0;
  var next = function () {
    current += 1;
  };
  var isDone = function () {
    return current >= obj.length;
  };
  var getCurrItem = function () {
    return obj[current];
  };
  return { next, isDone, getCurrItem, length: obj.length };
};

/**🌰 : 外部迭代器: 判断两个数组里元素的值是否完全相等 */
var compare = function (iterator1, iterator2) {
  if (iterator1.length !== iterator2.length) console.log('iterator1 和 iterator2 不相等');
  while (!iterator1.isDone() && !iterator2.isDone()) {
    if (iterator1.getCurrItem() !== iterator2.getCurrItem()) throw new Error('iterator1 和 iterator2 不相等');
    iterator1.next();
    iterator2.next();
  }
  console.log('iterator1 和 iterator2 相等');
};
var iterator1 = Iterator([1, 2, 3]);
var iterator2 = Iterator([1, 2, 3]);
console.log(compare(iterator1, iterator2));

/**
 * 🌰 : 迭代类数组对象和字面量对象
 * PS: 只要被迭代的聚合对象拥有 length 属性而已可以用下标访问, 就可以被迭代
 *     - for in 语句可以用来迭代普通字面量对象的属性
 *     - JQuery 中提供了 $.each 函数来封装各种迭代行为
 */
$.each = function (obj, callback) {
  var value,
    i = 0,
    length = obj.length,
    isArray = Array.isArray(obj);

  if (isArray) {
    /**迭代类数组 */
    for (; i < length; i++) {
      value = callback.call(obj[i], i, obj[i]);
      /**回调函数返回 false, 提前终止循环 */
      if (value === false) break;
    }
  } else {
    /**迭代对象 */
    for (i in obj) {
      value = callback.call(obj[i], i, obj[i]);
      if (value === false) break;
    }
  }
  return obj;
};

/**🌰 : 实现倒序迭代器 */
var reverseEach = function (ary, callback) {
  for (var l = array.length - 1; l >= 0; i--) callback.call(ary[l], l, ary[l]);
};
reverseEach([1, 2, 3], function (i, n) {
  console.log(n); // 3, 2, 1
});

/**🌰 : 中止迭代器 */
var each = function (ary, callback) {
  for (var i = 0, l = array.length; i < l; i++) {
    /**回调函数返回 false, 提前终止循环 */
    if (callback(i, ary[i]) === false) break;
  }
};
each([1, 2, 3, 4, 5], function (i, n) {
  if (n > 3) return false;
  console.log(n); // 1, 2, 3
});

/**🌰 : 迭代器模式的应用举例 (根据不同的浏览器获取相应的上传组件对象) */

/**@description IE 上传控件 */
var getActiveUploadObj = function () {
  try {
    return new ActiveXObject('TXFTNActiveX.FTNUpload');
  } catch (error) {
    return false;
  }
};

/**@description Flash 上传控件 */
var getFlashUploadObj = function () {
  /**supportFlash 函数未提供 */
  if (supportFlash()) {
    var str = `<object type="application/x-shockwave-flash" />`;
    return $(str).appendTo($('body'));
  } else {
    return false;
  }
};

/**@description 浏览器原生表单上传 */
var getFormUploadObj = function () {
  var str = `<input name="file" type="file" class="ui-file" />`;
  return $(str).appendTo($('body'));
};

/**
 * 如果该函数里面的 upload 对象是可用的, 则让函数返回该对象, 反之返回 false, 提示迭代继续往后面迭代
 * 
 * 迭代器实现:
 *  1. 提供一个可以被迭代的方法, 使得 getActiveUploadObj、getFlashUploadObj、getFormUploadObj 依照优先级被迭代循环
 *  2. 如果正在被迭代的函数返回一个对象, 则表示找到了正确的 upload 对象, 反之返回 false, 则让迭代继续工作
 */
var iteratorUploadObj = function () {
  for (var i = 0, fn; (fn = arguments.length[i++]); ) {
    var uploadObj = fn();
    if (uploadObj !== false) return uploadObj;
  }
};

var uploadObj = iteratorUploadObj(getActiveUploadObj, getFlashUploadObj, getFormUploadObj);
