/**call 和 apply 的区别 */

/**
 * apply
 * 1. 接收两个参数, 第一个参数指定了函数体内 this 对象的指向, 第二个参数为一个带下标的集合, 可以是数组, 也可以是类数组
 */
var func1 = function (a, b, c) {
  console.log([a, b, c]); // [1, 2, 3]
};
func1.apply(null, [1, 2, 3]);

/**
 * call
 * 1. 传入的参数不定, 第一个参数也是代表函数体内的 this 的指向, 从第二个参数开始往后, 每个参数被依次传入函数
 */
var func2 = function (a, b, c) {
  console.log([a, b, c]); // [1, 2, 3]
};
func2.call(null, 1, 2, 3);

/**
 * 当使用 call 或者 apply 的时候, 传入的第一个参数为 null， 函数体内的 this 会指向默认的宿主对象, 在浏览器中则是 window
 * 但如果是严格模式下, 函数体内的 this 还是为 null
 */
var func3 = function (a, b, c) {
  console.log(this === window); // true
};
func3.apply(null, [1, 2, 3])

/**
 * 有时候使用 call 或者 apply 的目的不在于指定 this 指向, 而是另有用途
 * 比如借用其他对象的方法, 可以传入 null 来代替某个具体的对象
 */
Math.max.apply(null, [1, 2, 3, 4, 5]) // 15

/**call 和 apply 的用途 */

/**1. 改变 this 的指向 */