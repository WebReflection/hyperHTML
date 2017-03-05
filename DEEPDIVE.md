# hyperHTML Developer DeepDive

Being extremely lightweight and simple, there's not much to learn about `hyperHTML`, but there's surely more to discuss about patterns floating around it.

This document aim is to provide as many details as possible per each operation that's possible via `hyperHTML`.


## How can the template be unique

One thing I have recently discovered about template literals, and I wish I knew it before, is that these are as static as any other string.

This means that not only ``(`a` === `a`)`` is true, but also  ``((a=>a)`a${1}b` === (a=>a)`a${2}b`)``.

This is the first bit to understand: each template string is unique and if the target node has been using this template before, it won't actually parse it again at all and it will simply use the rest of the arguments passed along to update nested bits already known.


#### How are known nodes discovered

The very first time a new template is used against a node, its full content is injected into such node using a special `<!--_hyperHTML-965678965456-->` random comment instead of real values.

Such comment is used to discover both attributes, text nodes, and whole fragments or HTML content, the very first time only.

```js
// simulation of initial fake injection
function fakeContent(statics, ...values) {
  const content = statics.join('<!--_hyperHTML-965678965456-->');
  this.innerHTML = content;
}

const render = fakeContent.bind(document.body);

// inject fakeContent to the target
render`a ${'b'} c`;

// check its content
console.log(
  document.body.childNodes
);
// [text, comment, text]
```

As basic example, it would be now possible to drop that `comment` with a text node that will update its content when `values[0]` is passed on, and once all nodes have been mapped 1:1 to the amount of extra arguments passed along to update each sub-value, real data is used and real data will be used from that very moment on to populate nodes and attributes.





## How does the parsing work

Fully based on template literals, `hyperHTML` 