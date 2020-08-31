## 链表
链表对应生活中的例子: 火车(一节带动一节, 必要时可以拆卸或添加一节车厢)

链表通过指针连接, 如果需要插入或删除只需改变相应指针指向的目标就行。这也是链表相比较于数组最大的优点, 不用移动元素就能很轻松地添加删除元素。如果有大量的数据要插入或删除可以考虑使用链表这种数据结构。

链表实现
```
var LinkedList = function() {
  const Node = function(element) {
    this.element = element
    this.next = null
  }

  let head = null
  let current
  let length = 0

  // 在链表末尾加入元素
  this.append = function(element) {
    const node = new Node(element)
    if (head === null) {       // 插入第一个链表
      head = node
    } else {
      current = head
      while (current.next) {     // 找到最后一个节点
        current = current.next
      }
      current.next = node
    }
    length++
  }

  // 移除指定位置元素
  this.removeAt = function(position) {
    if (position > -1 && position < length) {
      let previous
      let index = 0
      if (position === 0) {         // 如果是第一个链表的话, 特殊对待
        head = head.next
      } else {
        current = head
        while (index < position) {  // 循环找到当前要删除元素的位置
          previous = current
          current = current.next
          index++
        }
        previous.next = current.next
      }
      length--
    }
  }

  // 在指定位置加入元素
  this.insert = function(position, element) {
    const node = new Node(element)
    let index = 0
    let current, previous
    if (position > -1 && position < length + 1) {
      if (position === 0) { // 在链表最前插入元素
        current = head
        head = node
        head.next = current
      } else {
        current = head
        while (index < position) { // 同 removeAt 逻辑, 找到目标位置
          previous = current
          current = current.next
          index++
        }
        previous.next = node       // 在目标位置插入相应元素
        node.next = current
      }
      length++
    }
  }

  // 链表中是否含有某个元素, 如果有的话返回相应位置, 无的话返回 -1
  this.indexOf = function(element) {
    let index = 0
    current = head
    while (index < length) {
      if (current.element === element) {
        return index
      }
      current = current.next
      index++
    }
    return -1
  }

  // 移除某元素
  this.remove = function(element) {
    const position = this.indexOf(element)
    this.removeAt(position)
  }

  // 获取大小
  this.size = function() {
    return length
  }

  // 获取最开头的链表
  this.getHead = function() {
    return head
  }

  // 是否为空
  this.isEmpty = function() {
    return length === 0
  }

  // 打印链表元素
  this.log = function() {
    current = head
    let str = current.element
    while (current.next) {
      current = current.next
      str = str + ' ' + current.element
    }
    return str
  }
}

// 测试用例
var linkedList = new LinkedList()
linkedList.append(5)
linkedList.append(10)
linkedList.append(15)
linkedList.append(20)
linkedList.log()         // '5 10 15 20'
linkedList.removeAt(1)
linkedList.log()         // '5 15 20'
linkedList.insert(1, 10)
linkedList.log()
```

## 双向链表
单向链表如果错过了某次查询就得重头开始重新查找, 双向链表进行了升级, 除了可以向后查找, 同时也支持向前查找
```
var DbLinkedList = function() {
  const Node = function(element) {
    this.element = element
    this.next = null
    this.prev = null
  }

  let head = null
  let tail = null
  let current, previous
  let length = 0

  // 指定任意位置插入元素
  this.insert = function(position, element) {
    let index = 0
    const node = new Node(element)
    if (position > -1 && position < length + 1) {
      if (position === 0) {             // ① 在开头插入元素
        if (head === null) {  // 链表内元素为空
          head = node
          tail = node
        } else {              // 链表内存在元素
          current = head
          head = node
          head.next = current
          current.prev = head
        }
      } else if (position === length) { // ② 在末尾插入元素
        current = tail
        tail = node
        current.next = tail
        tail.prev = current
      } else {                          // ③ 在链表中插入元素
        current = head
        while (index < position) { // 找到需插入节点的位置
          previous = current
          current = current.next
          index++
        }
        previous.next = node
        node.next = current

        current.prev = node
        node.prev = previous
      }
      length++
    }
  }

  // 删除指定位置的元素
  this.removeAt = function(position) {
    let index = 0
    if (position > -1 && position < length) {
      if (position === 0) {                  // 删除链表最开头的元素
        if (length === 1) {
          head = null
          tail = null
        } else {
          current = head
          head = current.next
          head.prev = current.prev
        }
      } else if (position === length - 1) {  // 删除链表最末尾的元素
        current = tail
        tail = current.prev
        tail.next = current.next
      } else {                               // 删除链表中的元素
        current = head
        while (index < position) {
          previous = current
          current = current.next
          index++
        }
        previous.next = current.next
        current.next.prev = previous
      }
      length--
    }
  }

  this.log = function() {
    current = head
    let str = current.element
    while (current.next) {
      current = current.next
      str = str + ' ' + current.element
    }
    return str
  }
}

var dbLinkedList = new DbLinkedList()
dbLinkedList.insert(0, 5)
dbLinkedList.insert(1, 10)
dbLinkedList.insert(2, 15)
dbLinkedList.insert(3, 20)
dbLinkedList.insert(4, 25)
dbLinkedList.log()         // "5 10 15 20 25"
dbLinkedList.removeAt(4)
dbLinkedList.removeAt(0)
dbLinkedList.removeAt(1)
dbLinkedList.log()         // "10 20"
```