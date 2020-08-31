### 哈希表

哈希表算是一种特殊的字典。它在实际的键值和存入的哈希值之间存在一层映射。如下例子:

![]('../assets/hash_table.jpg')

上图中通过哈希函数将键值转换成哈希值, 然后再将哈希值指向具体的值。接着我们来构造 HashTable 类, 代码如下:

```js
function HashTable() {
  this.items = {}
}

// 哈希算法
function keyToHash(key) {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash += key.charCodeAt(i)
  }
  hash = hash % 37 // 为了避免 hash 的值过大
  return hash
}

HashTable.prototype.put = function(key, value) {
  const hash = keyToHash(key)
  this.items[hash] = value
}

HashTable.prototype.get = function(key) {
  return this.items[keyToHash(key)]
}

HashTable.prototype.remove = function(key) {
  delete(this.items[keyToHash(key)])
}
```

跑如下测试用例:

```js
var test = new HashTable()
test.put('ab', 'ab@gmail.com')
test.put('cd', 'cd@gmail.com')
test.put('ef', 'ef@gmail.com')

test.get('cd') // "cd@gmail.com"
test.remove('cd')
test.get('cd') // undefined
```

但是这样子实现的哈希表有一个问题, 比如进行如下调用就会产生冲突:

```js
test.put('ab', 'ab@gmail.com')
test.put('ba', 'ba@gmail.com') // ab 和 ba 的哈希值相同, 后者会把前者覆盖
```

接着我们来尝试解决该问题

#### 链表法

顾名思义, 这个方法就是在每个哈希值上引人链表。如下图所示:

![]('../assets/list.jpg')

```js
function HashTable() {
  this.items = {}
}

function keyToHash(key) {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash += key.charCodeAt(i)
  }
  hash = hash % 37
  return hash
}

// 存入链表的值
function Node(key, value) {
  this.key = key
  this.value = value
}

// 添加接口
HashTable.prototype.put = function(key, value) {
  const hash = keyToHash(key)
  if (!this.items[hash]) {
    this.items[hash] = new LinkedList() // 这里将之前实现的链表拿来使用
  }
  let linkList = this.items[hash].getHead()
  let ifAppend = true
  while (linkList) {                        // 以下为 append 逻辑
    if (linkList.element.key === key) {     // key 值重复逻辑
      linkList.element = new Node(key, value)
      ifAppend = false
      break
    }
    linkList = linkList.next
  }
  if (ifAppend) {
    this.items[hash].append(new Node(key, value))
  }
}

HashTable.prototype.has = function (hash) {
  if (this.items.hasOwnProperty(hash)) {
    return true
  }
  return false
}

// 获取接口
HashTable.prototype.get = function(key) {
  const hash = keyToHash(key)
  if (this.has(hash)) {
    let current = this.items[hash].getHead()
    while (current) {
      if (current.element.key === key) {
        return current.element.value
      }
      current = current.next
    }
  }
  return undefined
}

// 移除接口
HashTable.prototype.remove = function(key) {
  const hash = keyToHash(key)
  if (this.has(hash)) {
    let current = this.items[hash].getHead()
    while (current) {
      if (current.element.key === key) {
        this.items[hash].remove(current.element)
        return true
      }
      current = current.next
    }
    return false
  }
  return false
}
```

接着来测试下完成的哈希表, 测试用例如下:

```js
var test = new HashTable()
test.put('ab', 'ab@gmail.com')
test.put('ba', 'ba~@gmail.com')
test.put('ba', 'ba@gmail.com') // 验证重复字段
test.put('cd', 'cd@gmail.com')

test.get('ab') // ab@gmail.com
test.get('ba') // ba@gmail.com
test.get('cd') // cd@gmail.com

test.remove('ba')
test.get('ba') // undefined
```

#### 线性探查法

思想: 如果当前所要存储的 hash 值已存在于存储空间, 则判断存储空间里是否已存储 hash + 1, 若无则存储 hash + 1, 若有则判断存储空间里是否已存储 hash + 2, 依次类推。参考图如下:

![]('../assets/hash.jpg')

接着进入代码实现环节, 同样是修改 put、get、remove 方法:

```js
function HashTable() {
  this.items = {}
}

// 哈希算法
function keyToHash(key) {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash += key.charCodeAt(i)
  }
  hash = hash % 37 // 为了避免 hash 的值过大
  return hash
}

// 后面会用之锁定
function Node(key, value) {
  this.key = key
  this.value = value
}

HashTable.prototype.put = function(key, value) {
  let hash = keyToHash(key)
  while (this.items[hash]) {             // 当 this.items[index] 不存在时终止
    if (this.items[hash].key === key) {  // 对已存在的 key 值进行覆盖
      break
    }
    hash++
  }
  this.items[hash] = new Node(key, value)
}

HashTable.prototype.has = function(hash) {
  if (this.items.hasOwnProperty(hash)) {
    return true
  }
  return false
}

HashTable.prototype.get = function(key) {
  let hash = keyToHash(key)
  if (this.items[hash]) {
    while (this.items[hash].key !== key) { // 找到存储的 index
      hash++
    }
    return this.items[hash].value
  }
  return undefined
}

HashTable.prototype.remove = function(key) {
  let hash = keyToHash(key)
  if (this.has(hash)) {
    while (this.items[hash].key !== key) { // 找到存储的 index
      hash++
    }
    this.items[hash] = undefined
    return true
  }
  return false
}
```

接着跑如下测试用例:

```js
var test = new HashTable()
test.put('ab', 'ab@gmail.com')
test.put('ba', 'ba@gmail.com')
test.put('ab', 'ab@gmail.com')

test.get('ab') // 'ab@gmail.com'

test.remove('ab')
test.get('ab') // undefined
```

#### 更好的哈希函数

另外在本文实现的哈希函数中, 性能不是特别好（因为容易产生相同的哈希值）, 给出一段更好的散列函数的实现, 数学知识的原理暂时不深究了

```js
// 哈希算法
function keyToHash(key) {
  let hash = 5381    // 取一个素数
  for (let i = 0; i < key.length; i++) {
    hash = hash * 33 + key.charCodeAt(i)
  }
  hash = hash % 1013 // 除以另外一个素数
  return hash
}
```
