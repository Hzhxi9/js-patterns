/**
 * 1. 树结构的术语
 *      - 节点的度(Degree): 节点的子树个数
 *      - 树的度(Degree): 树的所有节点中最大的度树(树的度通常为节点的个数 N-1 )    
 *      - 叶节点(Leaf): 度为 0 的节点(也称为叶子节点)
 *      - 父节点(Parent): 有子树的节点是其子树的根节点的父节点
 *      - 子节点(Child): 若 A 节点是 B 节点的父节点, 则称 B 节点是 A 节点的子节点(子节点也称为孩子节点)
 *      - 兄弟节点(Sibling): 具有同一父节点的各节点彼此是兄弟节点
 *      - 路径: 从节点 n1 到 nk 的路径为一个节点序列 n1, n2, ..., nk, ni 是 ni + 1 的父节点
 *      - 路径长度: 路径所包含边的个数为路径的长度
 *      - 节点的层次(Level): 规定根节点在 1 层, 其他任意节点的层数是父节点层数的层数加 1
 *      - 树的深度(Depth): 树中所有节点中的最大层次是这棵树的深度
 * 
 * 2. 二叉树
 *      定义: 
 *          - 树中的每个节点最多只能有两个子节点
 *          - 二叉树可以为空, 也就是没有节点
 *          - 若不为空, 则他是由根节点和称其为左子树(Left Tree)和右子树(Right Tree)的两个不相交的二叉树组成
 *      特性:
 *          - 一棵二叉树第 i 层的最大节点数为: 2^(i-1), i >= 1
 *          - 深度为 k 的二叉树有最大节点总数为: 2^k - 1, k >= 1
 *          - 对任何非空二叉树 T, 若 n0 表示叶子节点(度为 0 的节点)的个数、 n2 是度为 2 的非叶节点个数, 那么两者满足关系 n0 = n2 + n1
 *      特殊二叉树:
 *          - 完美二叉树(Perfect Binary Tree), 也称为满二叉树(Full Binary Tree)
 *              - 在二叉树中, 除了最下一层的叶节点外, 每层节点都有 2 个子节点, 就构成了满二叉树
 *          - 完全二叉树(Complete Binary Tree)
 *              - 除二叉树最后一层外, 其他各层的节点数都达到最大个数.
 *              - 且最后一层从左向右的叶节点连续存在, 只缺右侧若干节点.
 *              - 完美二叉树是特殊的完全二叉树
 * 
 * 3. 二叉树常见存储方式
 *      - 数组
 *          - 完全二叉树：从上至下,从左到右顺序存储
 *          - 非完全二叉树：要转换成完全二叉树才可以按照上面的方案存储, 而且会造成很大的空间浪费
 *      - 链表
 *          - 二叉树最常见的方式还是使用链表存储
 *          - 每个节点封装成一个 Node, Node 中包含存储的数据, 左节点的引用, 右节点的引用
 * 
 * 4. 二叉搜索树(二叉排序树, 二叉查找树)
 *      - 可以为空, 不为空的时候, 需要满足
 *          - 非空左子树的所有键值小于其根节点的键值
 *          - 非空右子树的所有键值大于其根节点的键值
 *          - 左右子树本身也都是二叉搜索树
 *      - 特点
 *          - 相对较小的值总是保存在左节点上，相对较大的值总是保存在右节点上
 *          - 查找效率非常高，这也是二叉搜索树中，搜索的来源
 */

/**
 * 保存每一个节点的类
 * @param value 节点对应的值
 * @param left 指向左边的子树
 * @param right 指向右边的子树
 */
class TreeNode {
    constructor(value) {
        this.value = value
    }
}

/**作为树, 只需要保存根节点即可，因为其他节点都可以通过根节点找到 */
class BSTree{
    root = null

    /**插入操作: 向树中插入一个新的数据 */
    insert(value) {
        /**根据传入 value 创建 TreeNode 节点 */
        const node = new TreeNode(value)
        /**判断当前是否有根节点 */
        if(this.root) this.insertNode(this.root, node) 
        else this.root = node
    }

    /**遍历操作: 通过先序遍历方式遍历所有节点 */
    preOrderTraverse(){
        this.preOrderTraverseNode(this.root);
    }
    /**遍历操作: 通过中序遍历方式遍历所有节点 */
    inOrderTraverse(){
        this.inOrderTraverseNode(this.root)
    }
    /**遍历操作: 通过后序遍历方式遍历所有节点 */
    postOrderTraverse(){
        this.postOrderTraverseNode(this.root)
    }
    /**
     * 层序遍历: 层序遍历一个树
     * 从上向向下逐层遍历
     * 层序遍历通常会借助队列来完成
     **/
    levelOrderTraverse(){
        /**没有根节点, 不需要遍历 */
        if(!this.root) return
        /**创建队列结构 */
        const queue = []
        /**第一个节点是根节点 */
        queue.push(this.root)
        /**遍历队列中所有节点(依次出队) */
        while(queue.length){
            /**访问节点过程 */
            const curNode = queue.shift()
            /**将左子节点放入队列 */
            if(curNode.left) queue.push(curNode.left)
            /**将右子节点放入队列 */
            if(curNode.right) queue.push(curNode.right)
        }
    }

    /**获取树中的最大值 */
    getMaxValue(){
        let curNode = this.root
        while(curNode && curNode.right) curNode = curNode.right
        return curNode?.value ?? null
    }
    /**获取树中的最小值 */
    getMinValue(){
        let curNode = this.root
        while(curNode && curNode.left) curNode = curNode.left
        return curNode?.value ?? null
    }

    /**在树中查找一个数据，如果节点存在，则返回 true；如果不存在，则返回 false */
    search(value){
        let curNode = this.root
        while(curNode){
            if(curNode.value === value) return true
            if(curNode.value < value) curNode = curNode.right
            else curNode = curNode.left
        }
        return false
    }

    /**
     * 删除某个数据
     * 删除存在的四种情况:
     * 1. 要删除的的节点是叶子结点（没有子节点）
     * 2. 要删除的的节点只有一个左子节点
     * 3. 要删除的的节点只有一个右子节点
     * 4. 要删除的的节点有两个节点
     * @param {*} value 
     */
    remove(value){
        /**获取要删除的节点 currNode 和其父节点 parent */
        let curNode = this.root, parent = null
        while(curNode){
            /**找到了节点 */
            if(curNode.value === value) break;
            parent = curNode
            if(curNode.value < value) curNode = curNode.right
            else curNode = curNode.left
        }
        /**没有找到要删除的节点返回 false */
        if(!curNode) return false
        /**如果要删除的的节点是叶子结点 */
        if(curNode.left === null && curNode.right === null) {
            /**删除节点是根节点 */
            if(curNode === this.root) this.root = null
            /**删除节点在父节点左边 */
            else if(parent?.left === curNode) parent.left = null
            /**删除节点在父节点右边 */
            else parent.right = null
        }
        /**如果要删除的的节点只有一个左子节点 */
        else if(curNode.right === null) {
            if(curNode === this.root) this.root = curNode.left
            /**删除节点在父节点的左边 */
            else if(parent?.left === curNode) parent.left = curNode.left
            /**删除节点在父节点的右边 */
            else parent.right = curNode.left
        }
        /**如果要删除的的节点只有一个右子节点 */
        else if(curNode.left === null) {
            if(curNode === this.root) this.root = curNode.right
            /**删除节点在父节点的左边 */
            else if(parent?.left === curNode) parent.left = curNode.right
            /**删除节点在父节点的右边 */
            else parent.right = curNode.right
        }
        /**如果要删除的的节点有两个子节点 */
        else {
            const successor = this.getSuccessor(curNode)
            if(curNode === this.root) this.root = successor
            else if(parent?.left === curNode) parent.left = successor
            else parent.right = successor
        }
        return true
    }
    
    insertNode(node, newNode) {
        if(newNode.value < node.value){
            /**左边查找空白位置 */
            if(node.left === null) node.left = newNode
            else this.insertNode(node.left, newNode)
        } else {
            /**右边查找空白位置 */
            if(node.right === null) node.right = newNode
            else this.insertNode(node.right, newNode)
        }
    }
    /**获取后继节点 */
    getSuccessor(node) {
        /**获取右子树 */
        let curNode = node.right, successor = null
        while(curNode){
            successor = curNode
            curNode = curNode.left
        }
        /**匹配到后继节点 */
        if(successor !== node.right) {
            node.right.left = successor?.right ?? null
            successor.right = node.right
        }
        /**将删除节点的 left 赋值给后继节点的 left */
        successor.left = node.left
        return successor
    }

    /**
     * 优先访问根节点 => 之后访问左子树 => 最后访问右子树
     * @param {*} node 
     */
    preOrderTraverseNode(node){
        if(node) {
            console.log(node.value)
            this.preOrderTraverseNode(node.left)
            this.preOrderTraverseNode(node.right)
        }
    }
    /**
     * 优先访问左子树 => 之后访问根节点 => 最后访问右子树
     * @param {*} node 
     */
    inOrderTraverseNode(node){
        if(node){
            this.inOrderTraverseNode(node.left)
            console.log(node.value)
            this.inOrderTraverseNode(node.right)
        }
    }
    /**
     * 优先访问左子树 => 之后访问右子树 => 最后访问根节点
     * @param {*} node 
     */
    postOrderTraverseNode(node){
        if(node){
            this.postOrderTraverseNode(node.left)
            this.postOrderTraverseNode(node.right)
            console.log(node.value)
        }
    }
}