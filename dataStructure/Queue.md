## 队列
队列的核心是 FIFO
实现一个简单的队列
```
function Queue() {
  this.items = []
}

Queue.prototype.push = function(item) {
  this.items.push(item)
}

Queue.prototype.shift = function() {
  return this.items.shift()
}

Queue.prototype.isEmpty = function() {
  return this.items.length === 0
}

Queue.prototype.size = function() {
  return this.items.length
}

Queue.prototype.clear = function() {
  this.items = []
}

```