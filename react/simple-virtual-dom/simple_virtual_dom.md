## 算法实现
1 用 JS 对象模拟 DOM 树
2 比较两颗 DOM 树的差异
3 把差异应用到真正的 DOM 树上
### JS 模拟一棵树
```
<ul id='list'>
  <li class='item'>Item 1</li>
  <li class='item'>Item 2</li>
  <li class='item'>Item 3</li>
</ul>

```
上面的 HTML 如果用 JS 模拟写法应该如下
```
var element = {
    tagName: 'ul', //节点标签
    props: { //DOM 的属性 用对象存储键值对
        id: 'list',
    },
    children: [ //该节点的子节点
        {tagName: 'li', props: {class: 'item'}, children: ["Item 1"]},
        {tagName: 'li', props: {class: 'item'}, children: ["Item 1"]},
        {tagName: 'li', props: {class: 'item'}, children: ["Item 1"]},
    ]
}
```
现在 lu 只是一个 JS 对象表示的 DOM 结构, 页面上没有这个结构, 我们可以根据这个 ul 构建真正的<ul>
```
Element.prototype.render = function() {
    var el = document.createElement(this.tagName)
    var props = this.props
    for (var propName in props) {
        var propValue = props[propName]
        el.setAttribute(propName, propValue)
    }

    var children = this.children || []
    children.forEach(function(child) {
        // 如果子节点也是虚拟DOM，递归构建DOM节点 否则构建文本节点
        var childEl = (child instanceof Element) ? child.render() : document.createTextNode(child)
        el.appendChild(childEl)
    })
    return el
}
```
render 方法根据 tagName 构建了真正的 DOM 节点, 然后设置这个节点的属性, 最后递归的把自己的子节点也构建起来 
```
var ulRoot = ul.render()
document.body.appendChild(uRoot)
```
上面的ulRoot是真正的DOM节点，把它塞入文档中，这样body里面就有了真正的<ul>的DOM结构
```
<ul id='list'>
  <li class='item'>Item 1</li>
  <li class='item'>Item 2</li>
  <li class='item'>Item 3</li>
</ul>
```
### 比较两颗虚拟 DOM 树的差异
两棵树进行同层比较 就可以吧时间复杂度由 O(n3)变为 O(n)
#### 深度优先记录差异
在深度优先遍历的时候 对每一个节点把他和新树进行比较 如果有差异的话就放到一个对象中
```
function diff (oldTree, newTree) {
    var index = 0 //当前节点标志
    var patches = {}
    dfsWalk(oldTree, newTree, index, patches)
    return patches
}

function dfsWalk(oldNode, newNode, index, patches) {
    patches[index] = [...] //对比oldNode和newNode的不同，记录下来
    diffChildren(oldNode.children, newNode.children, index, patches)
}

function diffChildren(oldChildren, newChildren, index, patches) {
    var leftNode = null
    var currentNodeIndex = index
    oldChildren.forEach(function(child, i) {
        var newChild = newChildren[i]
        currentNodeIndex = (leftNode && leftNode.count) ? currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1
        dfsWalk(child, newChild, currentNodeIndex, patches) //深度优先遍历子节点
        leftNode = child
    });
}
```

#### 差异类型
1 替换原来的节点 例如 div 换成 section
2 移动 删除 新增 子节点 上面的 div 子节点 p 和 ul 互换
3 修改了节点的属性
4 修改了节点的文本
我们定义了几种差异类型
```
var REPLACE = 0
var REORDER = 1
var PROPS = 2
var TEXT = 3
```
节点替换
```
patches[0] = [{
  type: REPALCE,
  node: newNode // el('section', props, children)
}]
```

修改了节点属性
```
patches[0] = [{
  type: REPALCE,
  node: newNode // el('section', props, children)
}, {
  type: PROPS,
  props: {
    id: "container"
  }
}]
```

修改了文本
```
patches[2] = [{
  type: TEXT,
  content: "Virtual DOM2"
}]
```