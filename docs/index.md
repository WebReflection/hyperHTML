# Getting Started with `hyperHTML`

To describe it in a sentence, `hyperHTML` is a just-in-time ([JIT](https://en.wikipedia.org/wiki/Just-in-time_compilation)) template literals compiler that maps 1:1 interpolations to DOM nodes or attributes.

Its strategy consists in creating a generic HTML content once, through an `innerHTML`_-like_ operation,
and map only parts of the resulting DOM tree to a collection of callbacks that will pass along interpolated values.

Even if it all sounds complex, the algorithm behind `hyperHTML` fits into less than 2KB minified and gzipped,
it's absolutely cross browser, it delivers extreme performance even on mobile, and its usage is the opposite of complex.

To complete this quick introduction, unless you are targeting also old browsers,
`hyperHTML` doesn't necessarily need transpilers, compilers, or even source maps;
it's entirely based on the [ECMAScript 2015](http://www.ecma-international.org/ecma-262/6.0/) Standard
and it has zero dependencies.


### About Template Literals

[Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)
are a modern and standard JavaScript way to create strings through back-ticks (`` ` ``) with the following peculiarities:

  * these can be *multi-line* without needing special escaping
  * these can have interpolated `${placeholders}` containing *any* JavaScript content
  * these can be tagged through a `callback` used as prefix
  * these are always statically unique, even if defined in different places, and even if tagged

```js
const tlBasic = `basic
template literal`;

const tlInt = `Interpolating 1 + 2 = ${1 + 2}`;

const tag = (statics, ...values) => console.log(statics, values);

tag`look mom, ${Math.random() < .5 ? '()' : 'no'} brackets`;

// ["look mom, ", " brackets"]  |      ["no"]
//    list of statics parts     |  dynamic values
```

Being tags callbacks, it is also possible to bind them to a specific context, like a DOM node,
and this is the basic concept that gives `hyperHTML` super powers.


## How To Define `hyperHTML` Templates

There are two basic but fundamental rules to remember:

  1. **attributes**, as well as eventual **callbacks**, must be defined inside single or double quoted attributes
  2. if there's any char different from `>` and `<` surrounding the interpolation, that content will be text, instead of HTML

Both text content and attributes are automatically sanitized by native DOM functionalities, making templates automatically more secure.

The following template summarizes above cases:
```js
const update = (render) => render`
  ${'this is text'}
  <p>${'this is <strong>html</strong>'}</p>${
    'this is also html <hr>'
  }<p>
    ${'but this is text'}
  </p>
  <a
    href="${'this is attribute'}"
    onclick="${anyCallbackYouWant}"
  > ${'this is text'} </a>
  <input
    type="checkbox"
    disabled="${false}"
    checked="${true}"> do you get it?
`;
```

The resulting layout would look like the following one:
```html
  this is text
  <p>this is <strong>html</strong></p>this is also html <hr><p>
    but this is text
  </p>
  <a
    href="this is attribute"
  > this is text </a>
  <input
    type="checkbox"
    checked> do you get it?
```

If you would like to have an overview of real-world templates and their applications,
you can check the [header](https://github.com/WebReflection/hypermvc/blob/master/js/views/header.js),
[main](https://github.com/WebReflection/hypermvc/blob/master/js/views/main.js),
or [footer](https://github.com/WebReflection/hypermvc/blob/master/js/views/footer.js) parts
of the [app](https://github.com/WebReflection/hypermvc/blob/master/js/app.js) that renders
the [TodoMVC version of hyperHTML](https://webreflection.github.io/hypermvc/).


### Remember: you cannot do partial attributes

In case you are wondering how to partially update a node attribute, remember the following:

```js
// THIS IS BROKEN, IT WON'T WORK
const update = (render, extra) => render`
  <li class="special thing ${extra}"></li>
`;

// while THIS IS THE CORRECT WAY 🎉
const update = (render, extra) => render`
  <li class="${'special thing ' + extra}"></li>
`;
```

This simplifies both the discovery of an interpolated attribute at compilation time,
and it will also grant best performance changing complex attributes at once instead of _N_ partial times.


### Rendering Multiple Nodes
If the interpolation returns an array of fragments, or _wires_,
`hyperTHML` will figure out which one needs to be placed in the document,
replaced, removed, or be completely untouched, if it was already there.

```js
const update = (render, listOfItems) => render`
  <u>${listOfItems.map(item => hyperHTML.wire(item)`
    <li> ${item.name} </li>
  `)}</ul>
`;

```

If you have a generic DOM node as target, and its content is created through fragments or wires,
you can also pass through `hyperHTML` logic simply sneaking in the array of fragments.

```js
const render = hyperHTML.bind(document.body);

const update = (render) => render`${[
  // previously defined as wire or nodes
  header, main, footer
]}`;

update(render);
```

## What is a `.wire()` ?

There are basically two ways to define a _rendered_ with `hyperHTML`:

  1. bind directly a specific node like in `const footer = hyperHTML.bind($('footer'));`
  2. use a new wire or weakly map any object with it: `const article = hyperHTML.wire();`

When the `bind` is known and directly related to a DOM node, `hyperHTML` will take care of **its content**.
```js
// in a page similar to:
// <body><div id="cart"></div></body>

const cart = hyperHTML.bind(document.querySelector('#cart'));

// the render will populate the cart node
const updateCart = (render, info) =>render`
  <ul class="${info.class}">${
    // however, the list of items is dynamic
    // and here items define their own content
    // same item object, same wire applied
    // new item, new wire
    menu.items.map(item => hyperHTML.wire(item))`
    <li> ${item.name} </li>`
  }</ul>
`;

updateCart(cart, {class: '', items: [
  {name: 't-shirt'},
  {name: 'pants'}
]});
```

A wire can be craeted at any time, and its content will be discovered as soon as its used to render a specific template.

```js
// empty wire
const wire = hyperHTML.wire();

// now it will populate itself with the template content
// if such content contains only one node, that'd be used
// instead of a fragment. If there are multiple nodes
// the fragment will bridge all nodes each render
wire`
  <div>I will be the wire node</div>
`;

// if used with a different template
// previous content and references will be trashed
wire`
  <div>I will be the new wire node</div>
  <div>so am I, we're now a fragment!</div>
`;

```

If performance is a concern, always use one wire per template.

If objects are passed around and rendered in different places, consider creating per each of them
one wire per each place, since `hyperHTML.wire(sameObject)` applied to different templates,
will trash every time the previous wire.

Wires are fast anyway, but if constantly trashed these lose most of their performance boost.


### Remember: to see content you need a live node
Wires are cool because abstract away a lot of troubles,
but these are also created off the document,
meaning if these are never attached to a live node,
these will never be visualized.

```js
// this will do pretty much nothing
// visually speaking

const render = hyperHTML.wire();

const update = (render) => render`
  <div>
    Where am I? Can anyone see me?
  </div>
`;

update(render);
```





