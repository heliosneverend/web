### 在 React 中写 class 时候为什么在写构造函数时需要写 super(props)
```
    class CheckBox extends React.Component {
        constructor(props) {
            super(props);
            this.state = {isOn: false}
        }
    }
```
`我们为什么要调用 super？能不能不调用？如果调用的时候不传入props呢？还可以传入其他参数么？`

在 JS 中 super 引用的是父类构造函数, 在 React 引用的就是 React.Component
需要注意的是在调用父类构造函数之前无法使用 this ,这不是 React的限制 而是 JS 的限制
```
 class CheckBox extends React.Component {
        constructor(props) {
            //不可以使用 this
            super(props);
            //可以使用
            this.state = {isOn: false}
        }
    }
```

JS 为什么要对 this 的使用进行限制 如有下面的继承
```
class Person {
    constructor(name) {
        this.name = name;
    }
}
class PolitePerson extends Person {
    constructor(name) {
    this.greetColleagues(); // 不能这么干，下面会讲原因
    super(name);
  }
  greetColleagues() {
    alert('Good morning folks!');
  }
}
```
JavaScript 允许在调用 super 之前使用 this，一个月之后，我们需要修改 greetColleagues 方法，方法中使用了 name 属性：
```
greetColleagues() {
  alert('Good morning folks!');
  alert('My name is ' + this.name + ', nice to meet you!');
}
```
不过我们可能已经忘了 this.greetColleagues(); 是在调用 super 之前调用的；因此，this.name 还没有赋值。这样的代码，很难定位 bug。
为了避免这样的错误，JavaScript 强制开发者在构造函数中先调用 super，才能使用this。这一限制，也被应用到了 React 组件：
```
constructor(props) {
  super(props);
  this.state = { isOn: true };
}
```
### 为什么要传入 props 呢？
你可能以为必须给 super 传入 props，否则 React.Component 就没法初始化 this.props：
```
// Inside React
class Component {
  constructor(props) {
    this.props = props;
    // ...
  }
}
```
如果漏传了 props，直接调用了 super()，你仍然可以在 render 和其他方法中访问 this.props
因为React 会在构造函数被调用之后，会把 props 赋值给刚刚创建的实例对象：
```
// Inside React
const instance = new YourComponent(props);
instance.props = props;
```
那么在使用 React 时，可以用 super() 代替 super(props) 了么？
别这么干，因为会带来其他问题。 虽然 React 会在构造函数运行之后，为 this.props 赋值，但在 super() 调用之后与构造函数结束之前， this.props 仍然是没法用的。
```
// Inside React
class Component {
  constructor(props) {
    this.props = props;
    // ...
  }
}

// Inside your code
class Button extends React.Component {
  constructor(props) {
    super(); // 没有传入 props
    console.log(props); // {}
    console.log(this.props); //  undefined
  }
  // ...
}
```
所以强烈建议始终使用 super(props)
```
class Button extends React.Component {
  constructor(props) {
    super(props); //  We passed props
    console.log(props); //  {}
    console.log(this.props); //  {}
  }
  // ...
}
```
