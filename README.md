# prim

## Pure Recursive Interface Markup

Natural and extensible interface markup for the web.

Prim is a new templating language that implements only the most intuitive and natural concepts of interface structure, allowing for developers to efficiently create platform-agnostic user interfaces.

Bearing a simple syntax and leaving out specific rules like `img tags are self-closing`, Prim achieves maximum performance and readability. The simple, unopinionated design of Prim allows for a healthy balance between recyclability and output transparency.

Prim is great for creating web applications. The parser returns a plain HTML string that can be treated as a reusable atomic DOM node. It plays well with client-side MVC frameworks such as AngularJS and Backbone, and servers like Express (Node.js).

Prim may be implemented in the future as an interface language for software beyond web applications.

## Install

To use as a module on your server:
```sh
npm install --save primjs
```

To use the client runtime, [download the latest build from git HEAD](https://github.com/edge/prim/tree/master/lib).

## Browser

In your HTML, link to your Prim runtime:
```html
<script src="/js/prim.js"></script>
```

Now you can convert Prim to HTML:
```js
prim.parse('div(class="article") { p | Lorem ipsum dolor sit amet | }');
// '<div class="article"><p>Lorem ipsum dolor sit amet</p></div>'
```

You can also define a Prim template in your head:
```html
<script id='primbody' type='text/x-prim'>
	div(class='container-fluid') {
		br/
		div(class='panel panel-default') {
			div(class='panel-heading') | Prim |
			div(class='panel-body') | Natural, fat free, and extensible interface markup for the web. |
			div(class='panel-footer') {
				a(href='https://github.com/edge/prim') | Get it now |
			}
		}
	}
</script>
```

And grab the text to use as a template:
```js
body.append(prim.parse($('#primbody').text()));
```

Congratulations! You've made your first page in Prim.
![test.html](http://i.imgur.com/pEEuYKE.png)

## Server

```sh
npm install --save primjs
```

```js
var prim = require('primjs');

prim.parse('div(class="article") { p | Lorem ipsum dolor sit amet | }');
// '<div class="article"><p>Lorem ipsum dolor sit amet</p></div>'
```


## Test

```sh
npm install -g testem
npm test
```

## Documentation

**Prim is whitespace-agnostic.**

### Basic

**identifier**
creates an HTML element with `identifier` as tag name
```jade
div
```
```html
<div></div>
```

**identifier/**
creates a self closing HTML element with `identifier` as tag name
```jade
img/
```
```html
<img />
```

**identifier(attributes...)**
creates an HTML element with `identifier` as tag name and `attributes` as attributes
```jade
div(ng-app='myApp')
```
```html
<div ng-app='myapp'></div>
```

**identifier { nodes... }**
creates an HTML element with `identifier` as tag name and `nodes` as child elements
```jade
div {
	span
	hr/
}
```
```html
<div><span><span><hr /></div>
```

**#{ code }**
creates a virtual HTML element with the return value of `code` as contents
```jade
#{ Math.log(Math.E) }
```
```html
1
```

**#{ code }**
**object**
creates a virtual HTML element with the return value of `code` as contents, using second `object` as context
```js
prim.parse(template, { user: 'Steve', id: '306' });
```
```jade
#{ user } ':' #{ id }
```
```html
Steve:306
```

**"string"**
creates a virtual HTML element with `string` as contents
```jade
"Hello"
```
```html
Hello
```

**identifier | content |**
creates an HTML element with `identifier` as tag name and `content` as raw text
```jade
div | Hello |
```
```html
<div>Hello</div>
```

### Multiplex

**Self-closing element with attributes**
```jade
input(type='text' placeholder='Username')/
```
```html
<input type='text' placeholder='Username' />
```

**Mixed elements and strings**
```js
prim.parse(template, { user: 'My Username' });
```
```jade
div {
	'Welcome back, '
	div(id='name' class='username') { #{ user } }
	button | Log Out |
}
```
```html
<div>Welcome back, <div id='name' class='username'>My Username</div><button>Log Out</button></div>
```

## Todo

- Implement end-of-markup short hand `% = EOM`
- Generate README docs directly from code
- Explore flexibility from delegating explicit strings
