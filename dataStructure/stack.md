## 栈
栈的核心是 FILO
实现一个栈类
```
function Stack() {
  this.items = []
}

Stack.prototype.push = function(item) {
  this.items.push(item)
}

Stack.prototype.pop = function() {
  return this.items.pop()
}

Stack.prototype.size = function() {
  return this.items.length
}

Stack.prototype.isEmpty = function() {
  return this.items.length === 0
}

Stack.prototype.clear = function() {
  this.items = []
}
```