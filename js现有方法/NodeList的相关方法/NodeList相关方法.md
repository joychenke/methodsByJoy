## firstChild用法

Node.firstChild只读属性，返回树中节点的第一个子节点，如果没有子节点，则返回null。

```html
<ul id="ul"><li>123</li>
<!-- or -->
<ul id="ul">
  <li>123</li>    
</ul>
```

```javascript
let ulDom = document.querySelector("#ul")
let firstChild = ulDom.firstChild
```

第一种结构时，firstChild打印出来是  <li>123</li>

第二种结构时，firstChild打印出来是 #text

原因是： Gecko内核的浏览器会在源代码中标签内部有空白符的地方插入一个文本结点到文档中。

