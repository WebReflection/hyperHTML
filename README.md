# hyperHTML

[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC) [![Build Status](https://travis-ci.org/WebReflection/hyperHTML.svg?branch=master)](https://travis-ci.org/WebReflection/hyperHTML) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/hyperHTML/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/hyperHTML?branch=master) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/WebReflection/donate)


<img alt="hyperHTML logo" src="https://webreflection.github.io/hyperHTML/logo/hyperhtml.svg" width="116" height="81">

A Fast & Light Virtual DOM Alternative - [release post](https://medium.com/@WebReflection/hyperhtml-a-virtual-dom-alternative-279db455ee0e#.lc65pz9vd),
now [available for both client, server](https://github.com/WebReflection/viperHTML)
and also [simplified for Custom Elements](https://github.com/WebReflection/hyperHTML-Element).
- - -

## hyperHTML V1

Thanks to all developers involved in this release.
There has been quite some effort to remove painful parts of the API
and bring in some missing feature.

**Breaking changes**

  * semantics based on spaces around interpolations have been removed
  * this means text content will always be set as `textContent`

**New features**

  * attributes don't need quotes anymore
  * explicit HTML intent as `${['array']}` or as `${{html}}`
  * explicit text intent as `${{text}}`
  * explicit _any_ intent as `${{any}}`, resolved as text or other kind of values (Array, Promise, DOM node)
  * `placeholder` with any kind of content for promises
  * new `hyperHTML.define(transformer, callback)` to extend functionalities through your own code
  * compatibility brought down to IE9+ now [100% code covered](https://webreflection.github.io/hyperHTML/test/ie/)
  * experimental `adopt` method a part, everything else has been tested on [UC Browser](https://webreflection.github.io/hyperHTML/test/ie/?noadopt) too
  * most basic functionalities compatible down to Android 2 and every other old mobile browser

#### New semantics examples

```js
// implicit and explicit declarative intents
function html(render) {
  return render`
    <!-- text by default for strings -->
    <p>Hello ${'World'}</p>
    <!-- text as explicit intent -->
    <p>Hello ${{text: 'World'}}</p>
    <!-- attributes without quotes -->
    <select onchange=${callback}>
      <!-- arrays as intent for HTML, Promises or DOM nodes -->
      ${['a', 'b'].map(v => `<option value="${v}">${v}</option>`)}
    </select>
    <!-- html as explicit intent -->
    <p>Hello ${{html: '<strong>World</strong>'}}</p>
    <!-- any as explicit intent -->
    <p>Hello ${{any: fetch('thing').then(b => b.text())}}</p>
  `;
}


// transformers
hyperHTML.define('encode', encodeURIComponent);
var entry = 'a b c d';
render`
  The function <code>encodeURIComponent</code>
  transform text ${entry} as ${{encode: entry}}
`;


// placeholders
render`
 <div class="login">
  ${{
    text: fetch('credentials').then(b => b.text()),
    placeholder: 'Loading credentials ...'
  }}
 </div>
`;
```

- - -

## Basic Example
The easiest way to describe `hyperHTML` is through [an example](https://webreflection.github.io/hyperHTML/test/tick.html).
```js
// this is React's first tick example
// https://facebook.github.io/react/docs/state-and-lifecycle.html
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is ${new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}
setInterval(tick, 1000);

// this is hyperHTML
function tick(render) {
  render`
    <div>
      <h1>Hello, world!</h1>
      <h2>It is ${new Date().toLocaleTimeString()}.</h2>
    </div>
  `;
}
setInterval(tick, 1000,
  hyperHTML.bind(document.getElementById('root'))
);
```

## Features

  * Zero dependencies and it fits in **less than 4KB** (minzipped)
  * Uses directly native DOM instead of inventing new syntax/APIs, DOM diffing, or virtual DOM
  * Designed for [template literals](http://www.ecma-international.org/ecma-262/6.0/#sec-template-literals), a templating feature built in to JS
  * Compatible with vanilla DOM elements and vanilla JS data structures
  * Also compatible with Babel transpiled output, hence suitable for every browser you can think of

## Usage
You have a `hyperHTML` function that is suitable for parsing template literals but it needs a DOM node context to operate.

If you want to render many times the same template for a specific node, bind it once and boost up performance for free.
No new nodes, or innerHTML, will be ever used in such case: safe listeners, faster DOM.

You can also check the [TodoMVC repository](https://github.com/WebReflection/hypermvc/tree/master/js) or its [live demo](https://webreflection.github.io/hypermvc/index.html).


### Wait ... there is a wire ➰ in the code!
The helper `hyperHTML.wire([obj[, type]])` is the solution to a common use case:
using `hyperHTML` to _define not the content_ of a node, _but the node_ itself, or a list of nodes.

In this case binding a `DocumentFragment` would work but it will also lose its content as soon as it's appended.
Using `hyperHTML.wire(obj)` will grant that render will always work as expected, without ever losing knowledge of its initial content.

It wires render updates to whatever content is holding.

```js
// hyperHTML.wire() returns a new wire
const render = hyperHTML.wire();
// which can be used multiple times
const update = () => render`
  <div>Hello Wired!</div>
`;

update() === update(); // true
update(); // <div>Hello Wired!</div>

// it is possible to reference a wire
const point = {x: 1, y: 2};
// simply passing a generic object
hyperHTML.wire(point)`
  <span style="${`
    position: absolute;
    left: ${point.x}px;
    top: ${point.y}px;
  `}">O</span>
`;

// the used render will be always the same
hyperHTML.wire(point) === hyperHTML.wire(point);
// true
```
It is also possible to define a generic template, and in such case the update won't be the single node, but an Array of nodes.

Following example illustrates a common usecase for `wire`:

```js

const root = document.getElementById('root');

// We want to get a li element, without caring about any root
const Item = (item) => hyperHTML.wire(item)`
  <li>Lib: ${item.name}, size: ${item.value}</li>
`

const UnorderedList = ({ root, items }) => root`
  <ul>${
    items.map(Item)
  }</ul>
`

const OrderedList = ({ root, items }) => root`
  <ol>${
    items.map(Item)
  }</ol>
`

UnorderedList({
  root: hyperHTML.bind(root.appendChild(document.createElement('div'))),
  items: [
    { name: 'hyperHTML', value: '5KB' },
    { name: 'document-register-element polyfill', value: '12KB' },
    { name: 'app', value: '20KB' }
  ]
})

OrderedList({
  root: hyperHTML.bind(root.appendChild(document.createElement('div'))),
  items: [
    { name: 'hyperHTML', value: '5KB' },
    { name: 'vue', value: '25KB' },
    { name: 'others', value: '...' }
  ]
})

```

We can see that `Item` is used to render `li` element, without root or its parent element.

#### New in 0.11

An object can have multiple wires associated with it using different `:ids` as type.

```js
// item used to render an option
hyperHTML.wire(obj, ':option')`
  <option value="${obj.value}"> ${obj.choice} </option>`;


// same item used to render an li
hyperHTML.wire(obj, ':li')`
  <li> ${obj.content} </li>`;
```

It is still possible to specify a type using `svg:id` or `html:id`.



### FAQs

  * _will input lose focus?_ Nope, as [you can test](https://webreflection.github.io/hyperHTML/test/form.html), only what needs to be updated will be updated.

  * _are events stringified?_ Nope, even if visually set as `<a onclick=${help.click}>` events are treated differently from other attributes. That `help.click` will be indeed directly assigned as `a.addEventListener('click', help.click)` so don't worry 😉

  * _how can I differentiate between textContent only and HTML or DOM nodes?_
    Text will always be injected as `textContent` but if you want to be sure 100% text will be forced as text,
    you can explicitly declare the intent. ```render`<p>This is: ${'text'} and so ${{text: 'is this'}}</p>`;```
    HTML can be explicitly declared as ```${{html: '<b>content</b>'}}``` or as an Array of strings.

  * _can I use different renders for a single node?_
    Sure thing. However, the best performance gain is reached with nodes that always use the same template string.
    If you have a very unpredictable conditional template, you might want to create two different nodes and apply `hyperHTML` with the same template for both of them, swapping them when necessary.
    In every other case, the new template will create new content and map it once per change.

  * _is this project just the same as [yo-yo](https://github.com/maxogden/yo-yo) or [bel](https://github.com/shama/bel) ?_
    First of all, I didn't even know those projects were existing when I've written `hyperHTML`, and while the goal is quite similar, the implementation is very different.
    For instance, `hyperHTML` performance seems to be superior than [yo-yo-perf](https://github.com/shama/yo-yo-perf).
    You can directly test [hyperHTML DBMonster](https://webreflection.github.io/hyperHTML/test/dbmonster.html) benchmark and see it goes _N_ times faster than `yo-yo` version on both Desktop and Mobile browsers 🎉.


### ... wait, WAT?
[ES6 Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals) come with a special feature that is not commonly used: prefixed transformers.

Using such feature to map a template string to a generic DOM node, makes it possible to automatically target and update only the differences between two template invokes and with **no `innerHTML` involved**.

Following [an example](https://webreflection.github.io/hyperHTML/test/article.html):
```js
function update(render, state) {
  render`
  <article data-magic=${state.magic}>
    <h3> ${state.title} </h3>
    List of ${state.paragraphs.length} paragraphs:
    <ul>
    ${
      // if you want to create wired node instead
      // .map(p => hyperHTML.wire(p)`<li>${p.title}</li>`)
      // otherwise it will be just injected as array of strings
      state.paragraphs
        .map(p => `<li>${p.title}</li>`)
    }
    </ul>
  </article>
  `;
}

update(
  hyperHTML.bind(articleElement),
  {
    title: 'True story',
    magic: true,
    paragraphs: [
      {title: 'touching'},
      {title: 'incredible'},
      {title: 'doge'}
    ]
  }
);
```

Since most of the time templates are 70% static text and 30% or less dynamic, `hyperHTML` passes through the resulting string only once, finds all attributes and content that is dynamic, and maps it 1:1 to the node to make updates as cheap as possible for both node attributes and node content.


### Caveats

Following a list of `hyperHTML` caveats.

#### Attributes resolved offline might show warnings
Attributes like image `src` or `srcset` might involve failing network requests or some overly-scary console error even if nothing would be really compromised.

This is caused by the fact `hyperHTML` uses a place holder for all attributes but some browser might try to load such string even if not a valid URL.

Eventually, this console warning would happen only once per container or wire, but you can always augment network sensible attributes in two steps.

```js
const srcset = ["foo.png 200w"];

// use this update
function withSrcset(srcset, alt) {
  var img = toImage(alt);
  img.srcset = srcset.join(" ");
  return img;
}

// instead of just this one
function toImage(alt) {
  return hyperHTML.wire()
  `<img
      role="button"
      alt="${alt}"
      width="195" height="80"/>`;
}
```

## Compatibility

  * [100% code coverage](https://webreflection.github.io/hyperHTML/test/) for browsers natively compatible with string literals
  * [100% code coverage](https://webreflection.github.io/hyperHTML/test/ie/) for IE9 or browsers that need transpiled code
  * [coverage without adopt node](https://webreflection.github.io/hyperHTML/test/ie/?noadopt) for browsers that have issues with current adopt logic (will be eventually fixed)
