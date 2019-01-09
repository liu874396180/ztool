
# 工具库 ztool

`ztool`积累了一些通用的工具方法，包括对需要对 DOM 元素操作的一些方法

<div class="z-doc-titles"></div>

## httpAjax

对`axios`(优秀的 ajax 库)的二次封装，并统一了`get`、`post`、`put`、`delete`、`patch`请求方式的传参方式

ztool.httpAjax()返回一个 Promise 对象,当`noCallback === false`时,默认对响应结果的处理：

只有 `result.data.code === 0` 时才会进入`then((re)=>{})`回调，其他情况都会进入`catch((re)=>{})`回调,并且`then((re)=>{})`和`catch((re)=>{})`回调中的参数`re`其实是`result.data`

```js
import { httpAjax } from "ztool";
/**
 *
 * @param {string} method //get || post || put    .....
 * @param {string} url //接口url
 * @param {object} query //接口参数，key，value 对应
 * @param {object} config //axios的config参数，更多请看https://github.com/axios/axios
 * @param {boolean} noCallback //默认false，因为httpAjax方法默认会有对特殊请求结果的统一处理，noCallback=true时，就是不需要默认的统一处理
 */
//例：
httpAjax("get", "/webapi/v1.0/config/center/deleteServiceInfo", { id: "41" })
	.then((re) => {})
	.then((re) => {})
	.catch((re) => {})
	.finally(() => {});
httpAjax("post", "/webapi/v1.0/config/center/updateConfigProperty", { id: "41", name: "我们的故事" });
```
<div class="z-doc-titles"></div>

## isUrl

判断是否 url

```jsx
import { isUrl } from "ztool";
/**
 *
 * @param {string} url //
 */
isUrl("https://github.com/axios/axios"); // true
```
<div class="z-doc-titles"></div>

## parseQueryString

获取 url 问号后面的参数，并转成对象

```jsx
import { parseQueryString } from "ztool";
/**
 *
 * @param {string} url //
 */
parseQueryString("http://my.com/select?id=100&selected=1"); //{id:100,selected:1}
parseQueryString("?id=100&selected=1"); //{id:100,selected:1}
```
<div class="z-doc-titles"></div>

## filterQuery

只取一个对象中的某些属性

```jsx
import { filterQuery } from "ztool";
/**
 *
 * @param {array}  //
 * @param {object}  //
 */
filterQuery(["name", "selected"], { name: "萧雨", selected: false, id: "85", woch: "犹豫" }); //得到新对象： {name:"萧雨",selected:false}
```
<div class="z-doc-titles"></div>

## BuildScroll

`BuildScroll` 是一个构造方法，是对<a href="http://iscrolljs.com/#intro" target="_blank">漂亮滚动条插件 ISroll</a>的 `new IScroll(el,opt)` 的二次封装,并且解决嵌套滚动条的问题，且对 options 有一些默认值

```jsx
import { BuildScroll,listenDivSizeChange } from "ztool";
/**
 *
 * @param {HTMLElement} el //需要生成滚动条的盒子
 * @param {object} opttions //IScroll的配置，更多请看http://iscrolljs.com/#intro
 */
//scroollInstance有三个属性:
//scroollInstance.scroll：其实是new IScroll(el,opt)的实例，
//scroollInstance.refresh:更新滚动条的方法，
//scroollInstance.nextScrollToTop：布尔值,默认false，下次调用refresh()时是否滚动条回到顶部
const scroollInstance = new BuildScroll(el, opt);

// 结合ztool.listenDivSizeChange达到自动更新滚动条的效果
class My extends React.PureComponent {
	componentDidMount() {
		this.scroollInstance = new BuildScroll(this.bodyEl, { scrollbars: "custom" });
		listenDivSizeChange(this.bodyEl, this.scroollInstance.refresh);
		listenDivSizeChange(this._contentEl, this.scroollInstance.refresh);
	}
	render() {
		return (
			<section ref={(el) => (this.bodyEl = el)}>
				<div ref={(el) => (this._contentEl = el)} style={{ position: "relative" }}>
					<div>{this.props.children}</div>
				</div>
			</section>
		);
	}
}
```
<div class="z-doc-titles"></div>

## listenDivSizeChange

监听盒子（div）尺寸变化 ,只对 section，div 等块状元素有效，对 textarea 无效

```jsx
import { listenDivSizeChange } from "ztool";
/**
 *
 * @param {HTMLElement} el //需要生成滚动条的盒子
 * @param {function} callback //回调函数
 */
listenDivSizeChange(document.querySelector("#id"), ()=>{
    //盒子高度/宽度变化了
}));
```
<div class="z-doc-titles"></div>

## scrollDisableWheel

用于解决外层使用了`ztool.BuildScroll`创建了滚动条，内部存在如：`textarea`出现滚动条时滚轮对`textarea`无效问题

```jsx
import { scrollDisableWheel } from "ztool";
/**
 *
 * @param {HTMLElement} el //textarea等
 */
scrollDisableWheel(document.querySelector("#textarea"));
```
<div class="z-doc-titles"></div>

## GenNonDuplicateID

用于随机产生不重复 id

```jsx
import { GenNonDuplicateID } from "ztool";
/**
 *
 * @param {number} randomLength //时间戳之前的随机个数，默认8
 */
GenNonDuplicateID(8);
```
<div class="z-doc-titles"></div>

## EetoString

科学计数法转字符串,(数字位数过大，浏览器会以科学计数法方式显示，我们想要显示完整的数字就转成字符串来显示)

```jsx
import { EetoString } from "ztool";
/**
 *
 * @param {number} num //数字
 */
EetoString(6.5e8); //"650000000"
EetoString(6.5e-7); //"0.65000000"
```
<div class="z-doc-titles"></div>

## loadFileList

动态加载 .js、.css 的方法，支持多个文件同时加载，支持多个文件按顺序加载

如果是"http" | "https" 开头,但没有.js|.css后缀的路径只支持加载js

```js
import { loadFileList } from "ztool";
/**
 *
 * @param {array} files //js、css路径的数组，
 * @param {boolean} isSequence //是否按files数组的顺序加载，默认false
 */
//例：
loadFileList([
		"./static/introJs/introjs.min.css",
		"./static/introJs/themes/introjs-flattener.css",
		"./static/introJs/intro.min.js",
	])
	.then(() => {
		//所有文件加载完的回调
	});
```
<div class="z-doc-titles"></div>

## dataTypeTest

检测数据类型，返回对应数据类型的名称

```js
import { dataTypeTest } from "ztool";

dataTypeTest(54); // number
dataTypeTest("you"); // string
dataTypeTest({ name: "bun" }); // object
dataTypeTest([54, "47"]); // array
dataTypeTest(true); // boolean
dataTypeTest(new Date("2018-08-07")); // date
dataTypeTest(null); // null
dataTypeTest(undefined); // undefined
dataTypeTest(function() {}); // function
dataTypeTest(new Symbol()); // symbol
dataTypeTest(new Set()); // set
dataTypeTest(new Map()); // map
```
<div class="z-doc-titles"></div>

## deepCopy

深度复制对象或数组

```js
import { deepCopy } from "ztool";

const newArray = deepCopy([{ name: "1", children: [{ name: "1-1" }] }]);
const newObj = deepCopy({ name: "1", children: [{ name: "1-1" }] });
```
<div class="z-doc-titles"></div>

## arrayFilterBy

根据条件过滤数组，只能过滤两种情况：一、数组里面全是对象，二、数组里面全是字符串或者其他类型的

```js
import { arrayFilterBy } from "ztool";
/**
 *
 * @param {array} array //原数组
 * @param {} property //过滤条件
 */
//用法一如：
var arr = [{ name: "水果", value: 1 }, { name: "蔬菜", value: 2 }];
arrayFilterBy(arr, { value: 2 }); //得到[{name:"蔬菜",value:2}]
//用法二如：
var arr = [1, 2, 3, 2, 4, 3, 5, 3];
arrayFilterBy(arr, 3); //得到 [3,3,3]
//用法三如：
var arr = [{ name: "水果", value: 1 }, { name: "蔬菜", value: 2 }, { name: "草莓", value: 4 }];
arrayFilterBy(arr, [{ value: 2 }, { value: 4 }]); //得到[{name:"蔬菜",value:2},{name:"草莓",value:4}]
//用法四如：
var arr = [1, 2, 3, 2, 4, 3, 5, 3];
arrayFilterBy(arr, [3, 2]); //得到 [3,3,3,2,2]
```

<div class="z-doc-titles"></div>

## on

事件绑定，同 `element.addEventListener(event,handle,false)`;

```js
import { on } from "ztool";
/**
 *
 * @param {HTMLElement} el //绑定事件的DOM
 * @param {string} event //事件名，如"click"
 * @param {function} handler //事件回调
 */
//例：
on(document.querySelector("#id"), "click", (e) => {
	//回调
});
```

<div class="z-doc-titles"></div>

## off

移除事件，同 `element.removeEventListener(event,handle,false)`，参数同`on`

<div class="z-doc-titles"></div>

## once

绑定一次性事件，参数同`on`

<div class="z-doc-titles"></div>

## hasClass

检测某个 DOM 元素是否存在某个样式类名,返回`boolean`值

```js
import { hasClass } from "ztool";
/**
 *
 * @param {HTMLElement} el //绑定事件的DOM
 * @param {string} clasName //样式类名
 */
//例：
const hasFLoat = hasClass(document.querySelector("#id"), "z-float");
console.log(hasFLoat);
```

<div class="z-doc-titles"></div>

## addClass

给某个 DOM 元素添加样式类名

```js
import { addClass } from "ztool";
/**
 *
 * @param {HTMLElement} el //绑定事件的DOM
 * @param {string} clasName //样式类名
 */
//例：
addClass(document.querySelector("#id"), "z-float z-font-size-20");
```

<div class="z-doc-titles"></div>

## removeClass

给某个 DOM 元素移除样式类名

```js
import { removeClass } from "ztool";
/**
 *
 * @param {HTMLElement} el //绑定事件的DOM
 * @param {string} clasName //样式类名
 */
//例：
removeClass(document.querySelector("#id"), "z-font-size-20");
```
<div class="z-doc-titles"></div>

## getStyle

获取某个元素的某个样式

```js
import { getStyle } from "ztool";
/**
 *
 * @param {HTMLElement} el //绑定事件的DOM
 * @param {string} styleName //样式名
 */
//例：
const height = getStyle(document.querySelector("#id"), "height"); // 100px
```

<div class="z-doc-titles"></div>

## setStyle

给某个元素设置 style

```js
import { setStyle } from "ztool";
/**
 *
 * @param {HTMLElement} el //绑定事件的DOM
 * @param {string} styleName //样式名
 */
//例：
setStyle(document.querySelector("#id"), "height", "500px");
```

<div class="z-doc-titles"></div>

## removeItemFromTree

用于移除json数组中一项数据(不会造成原json的变异)，返回新的json数组

```js
import { removeItemFromTree } from "ztool";
/**
 *
 * @param {object} obj 以对象方式传参：
 * { 
 *   tree:array (json数组), 
 *   sourceItem:object (要移除的数据，匹配keyObj的id属性),
 *   keyObj:{id:"id",children:"children"
 * }
 */
//例：
const tree=[{id:2,name:"苹果"},{id:5,name:"蔬菜",children:[{id:9,name:"豆芽"}]}]
//移除{id:9}的那一条数据
const newTree removeItemFromTree({
	tree:tree,
	sourceItem:{id:9}
});
// 返回 [{id:2,name:"苹果"},{id:5,name:"蔬菜",children:[]}]
```
<div class="z-doc-titles"></div>

## replaceItemFromTree

用于替换json数组中一项数据(不会造成原json的变异)，返回新的json数组

```js
import { replaceItemFromTree } from "ztool";
/**
 *
 * @param {object} obj 以对象方式传参：
 * { 
 *   tree:array (json数组), 
 *   sourceItem:object (要被替换的数据，匹配keyObj的id属性),
 *   item: object (新数据)
 *   keyObj:{id:"id",children:"children"
 * }
 */
//例：
const tree=[{id:2,name:"苹果"},{id:5,name:"蔬菜",children:[{id:9,name:"豆芽"}]}]
//替换{id:9}的那一条数据
const newTree= replaceItemFromTree({
	tree:tree,
	sourceItem:{id:9},
	item:{id:18,name:"莴笋"}
});
//返回 [{id:2,name:"苹果"},{id:5,name:"蔬菜",children:[{id:18,name:"莴笋"}]}]
```

<div class="z-doc-titles"></div>

## pushItemToTree

在json数组中一项数据的children末端新增一条子数据(不会造成原json的变异)，返回新的json数组

```js
import { pushItemToTree } from "ztool";
/**
 *
 * @param {object} obj 以对象方式传参：
 * { 
 *   tree:array (json数组), 
 *   sourceItem:object (要被新增子数据的数据，匹配keyObj的id属性),
 *   item: object (新数据)
 *   keyObj:{id:"id",children:"children"
 * }
 */
//例：
const tree=[{id:2,name:"苹果"},{id:5,name:"蔬菜",children:[{id:9,name:"豆芽"}]}]
//在{id:5}的那一条数据新增
const newTree= pushItemToTree({
	tree:tree,
	sourceItem:{id:5},
	item:{id:18,name:"莴笋"}
});
//返回 [{id:2,name:"苹果"},{id:5,name:"蔬菜",children:[{id:9,name:"豆芽"},{id:18,name:"莴笋"}]}]
```
<div class="z-doc-titles"></div>

## unshiftItemToTree

在json数组中一项数据的children头端新增一条子数据(不会造成原json的变异)，返回新的json数组

```js
import { unshiftItemToTree } from "ztool";
/**
 *
 * @param {object} obj 以对象方式传参：
 * { 
 *   tree:array (json数组), 
 *   sourceItem:object (要被新增子数据的数据，匹配keyObj的id属性),
 *   item: object (新数据)
 *   keyObj:{id:"id",children:"children"
 * }
 */
//例：
const tree=[{id:2,name:"苹果"},{id:5,name:"蔬菜",children:[{id:9,name:"豆芽"}]}]
//在{id:5}的那一条数据新增
const newTree= unshiftItemToTree({
	tree:tree,
	sourceItem:{id:5},
	item:{id:18,name:"莴笋"}
});
//返回 [{id:2,name:"苹果"},{id:5,name:"蔬菜",children:[{id:18,name:"莴笋"},{id:9,name:"豆芽"}]}]
```
<div class="z-doc-titles"></div>

## insertBeforeItemFromTree

用于将一项item数据插入在json数组中某项sourceItem数据之前

```js
import { insertBeforeItemFromTree } from "ztool";
/**
 *
 * @param {object} obj 以对象方式传参：
 * { 
 *   tree:array (json数组), 
 *   sourceItem:object (匹配keyObj的id属性),
 *   item: object (新数据)
 *   keyObj:{id:"id",children:"children"
 * }
 */
//例：
const tree=[{id:2,name:"苹果"},{id:5,name:"蔬菜",children:[{id:9,name:"豆芽"}]}]
//在{id:5}的那一条数据之前插入
const newTree= insertBeforeItemFromTree({
	tree:tree,
	sourceItem:{id:5},
	item:{id:18,name:"莴笋"}
});
//返回 [{id:2,name:"苹果"},{id:18,name:"莴笋"},{id:5,name:"蔬菜",children:[{id:9,name:"豆芽"}]}]
```
<div class="z-doc-titles"></div>

## insertAfterItemFromTree

用于将一项item数据插入在json数组中某项sourceItem数据之后

```js
import { insertAfterItemFromTree } from "ztool";
/**
 *
 * @param {object} obj 以对象方式传参：
 * { 
 *   tree:array (json数组), 
 *   sourceItem:object (匹配keyObj的id属性),
 *   item: object (新数据)
 *   keyObj:{id:"id",children:"children"
 * }
 */
//例：
const tree=[{id:2,name:"苹果"},{id:5,name:"蔬菜",children:[{id:9,name:"豆芽"}]}]
//在{id:5}的那一条数据之后插入
const newTree= insertBeforeItemFromTree({
	tree:tree,
	sourceItem:{id:5},
	item:{id:18,name:"莴笋"}
});
//返回 [{id:2,name:"苹果"},{id:5,name:"蔬菜",children:[{id:9,name:"豆芽"}]},{id:18,name:"莴笋"}]
```
