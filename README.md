# prim

## Pure Recursive Interface Markup

Natural, fat free, and extensible interface markup for the web.

Prim is a new templating language that implements only the most intuitive and natural concepts of interface structure, allowing for developers to efficiently create platform-agnostic user interfaces. It leaves out specific rules like `img tags are self closing` to achieve maximum performance and transparency. The simple, unopinionated design of Prim allows for a healthy balance between recyclability and output certainty.

Prim is great for creating web applications. The parser returns a plain HTML string that can be treated as a reusable atomic DOM node. It plays well with client-side MVC frameworks such as AngularJS and Backbone, and servers like Express (Node.js).

Prim may be implemented in the future as an interface language for software beyond web applications.

## Browser

In your HTML, link to your Prim library:
```html
<script src='/js/prim.js'></script>
```

Now you can convert Prim to HTML:
```js
prim.parse('div(class="article") { p { "Lorem ipsum dolor sit amet" } }');
// "<div class="article"><p>Lorem ipsum dolor sit amet</p></div>"
```

## Server

Coming soon.
