/**辅助类 Node 用于创建保存在链表中的 node */
class Node {
  constructor(item) {
    /**数据域: 用于保存数据 */
    this.item = item;
    /**指针域: 用于指向下一个节点*/
    this.next = null;
  }
}

/**用于创建一个链表 */
class Linked {
  constructor() {
    /**保存链表的长度, 用于遍历 */
    this.size = 0;
    /**链表的开端, 用于存放线性链路 */
    this.head = null;
  }

  /**节点查找方法传入 index 类似于数组下标用于标记查找 */
  getNode(index) {
    /**边界判断 */
    if (index < 0 || index >= this.size) throw new Error('out range');

    /**获取第一个节点, 从第一个节点进行遍历 */
    let current = this.head;
    /**依次将当前节点指向下一个节点，直到获取最后一个节点 */
    for (let i = 0; i < index; i++) current = current.next;

    return current;
  }

  /**新增 node 方法 */
  add(item) {
    /**创建 */
    const node = new Node(item);
    if (this.head === null) {
      /**链表为空时, 将新的 head 指向新创建的 node */
      this.head = node;
    } else {
      /**不为空的时候则需要将最末端的 node 的 next(指针域) 指向新创建的 node */
      /**查找需要创建的节点的上一个节点 */
      const prevNode = this.getNode(this.size - 1);
      /**将末端节点的 next 指向新创建的 node */
      prevNode.next = node;
    }
    /**新增成功 size + 1 */
    this.size++;
  }

  /**
   * 追加插入
   * @param {number} position 插入位置下标
   * @param {any} item 需要保存到节点的元素
   */
  insert(position, item) {
    /**下标值越位判断 */
    if(position < 0 || position > this.size) throw new Error('position out range')
    /**创建新节点 */
    const node = new Node(item)

    if(position === 0){
      /**
       * 头部追加
       * 插入下标为 0, 则直接将 head 指向新创建的节点
       */
      node.next = this.header;
      this.head = node
    } else {
      /**中间追加 */
      /**获取追加节点的上一个节点 */
      const prevNode = this.getNode(position - 1);
      /**将插入下标的指向域指向插入下标的上一个节点的指向指向域(下一个节点) */
      node.next = prevNode.next;
      /**将插入下标的上一个节点的指向域，指向当前节点 */
      prevNode.next = node
    }
    /**长度加一 */
    this.size++
  }
}
