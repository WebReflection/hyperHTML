# hyperHTML

[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC) [![Build Status](https://travis-ci.org/WebReflection/hyperHTML.svg?branch=master)](https://travis-ci.org/WebReflection/hyperHTML) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/hyperHTML/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/hyperHTML?branch=master) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/WebReflection/donate)


<img alt="hyperHTML logo" src="https://webreflection.github.io/hyperHTML/logo/hyperhtml.svg" width="116" height="81">

A Fast & Light Virtual DOM Alternative - [release post](https://medium.com/@WebReflection/hyperhtml-a-virtual-dom-alternative-279db455ee0e#.lc65pz9vd),
now [available for both client, server](https://github.com/WebReflection/viperHTML)
and also [simplified for Custom Elements](https://github.com/WebReflection/hyperHTML-Element).
- - -
**New Experimental .adopt(node) API**

Since version _0.12_ you can `hyperHTML.adopt(node)` instead of `hyperHTML.bind(node)` in case you have already rendered
a node on the server via [viperHTML](https://github.com/WebReflection/viperHTML) and you are sharing the same template.

Adopting a node will not trash the node content, it will map it to the existent one.
- - -
Don't miss the [viperHTML](https://github.com/WebReflection/viperHTML) version of **Hacker News**

Live: https://viperhtml-164315.appspot.com/

Repo: https://github.com/WebReflection/viper-news
- - -

## How To Define _hyperHTML_ Templates
There are two basic but fundamental rules to remember:

  1. **attributes**, as well as eventual **callbacks**, must be defined inside single or double quoted attributes
  2. if there's any char different from `>` and `<` surrounding the interpolation, that content will be text, instead of HTML

Please read the [Getting Started](https://github.com/WebReflection/hyperHTML/blob/master/GETTING_STARTED.md#how-to-define-hyperhtml-templates) for more examples.


## Basic Example
The easiest way to describe `hyperHTML` is through [an example](https://webreflection.github.io/hyperHTML/test/tick.html).
```js
// this is React's first tick example
// https://facebook.github.io/react/docs/state-and-lifecycle.html
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
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

## Compatibility

  * every modern browser (Chrome, Edge, Firefox, Safari)
  * IE9 to IE11 on both Mobile and Desktop
  * every other Mobile or Desktop browser compatible with Babel transpilation


## Features

  * Zero dependencies and it fits in **less than 3KB** (minzipped)
  * Uses directly native DOM instead of inventing new syntax/APIs, DOM diffing, or virtual DOM
  * Designed for [template literals](http://www.ecma-international.org/ecma-262/6.0/#sec-template-literals), a templating feature built in to JS
  * Compatible with vanilla DOM elements and vanilla JS data structures `*`
  * Also compatible with Babel transpiled output, hence suitable for every browser you can think of

`*` <sup><sub> actually, this is just a 100% vanilla JS utility, that's why is most likely the fastest and also the smallest. I also feel like I'm writing Assembly these days ... anyway ...</sub></sup>


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

  * _are events stringified?_ Nope, even if visually set as `<a onclick="${help.click}">` events are treated differently form other attributes. That `help.click` will be indeed directly assigned as `a.onclick = help.click` so don't worry 😉

  * _how can I differentiate between textContent only and HTML or DOM nodes?_
    If there's any space or char around the value, that'd be a textContent.
    Otherwise it can be strings, used as html, or DOM nodes.
    As summary: ```render`<p>This is: ${'text'}</p>`;``` for text, and ```render`<p>${'html' || node || array}</p>`;``` for other cases.
    An array will result into html, if its content has strings, or a document fragment, if it contains nodes.
    I've thought a pinch of extra handy magic would've been nice there 😉.

  * _can I use different renders for a single node?_
    Sure thing. However, the best performance gain is reached with nodes that always use the same template string.
    If you have a very unpredictable conditional template, you might want to create two different nodes and apply `hyperHTML` with the same template for both of them, swapping them when necessary.
    In every other case, the new template will create new content and map it once per change.

  * _is this project just the same as [yo-yo](https://github.com/maxogden/yo-yo) or [bel](https://github.com/shama/bel) ?_
    First of all, I didn't even know those projects were existing when I've written `hyperHTML`, and while the goal is quite similar, the implementation is very different.
    For instance, `hyperHTML` performance seems to be superior than [yo-yo-perf](https://github.com/shama/yo-yo-perf).
    You can directly test [hyperHTML DBMonster](https://webreflection.github.io/hyperHTML/test/dbmonster.html) benchmark and see it goes _N_ times faster than `yo-yo` version on both Desktop and Mobile browsers 🎉.


For all other deeper dirty details, please check the [DeepDive](https://github.com/WebReflection/hyperHTML/blob/master/DEEPDIVE.md) page.


### ... wait, WAT?
[ES6 Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals) come with a special feature that is not commonly used: prefixed transformers.

Using such feature to map a template string to a generic DOM node, makes it possible to automatically target and update only the differences between two template invokes and with **no `innerHTML` involved**.

Following [an example](https://webreflection.github.io/hyperHTML/test/article.html):
```js
function update(render, state) {
  render`
  <article data-magic="${state.magic}">
    <h3> ${state.title} </h3>
    List of ${state.paragraphs.length} paragraphs:
    <ul>${
      // if you want to create wired node instead
      // .map(p => hyperHTML.wire(p)`<li>${p.title}</li>`)
      // otherwise it will be just injected as array of strings
      // without any special power, simply generated via literals
      state.paragraphs
        .map(p => `<li>${p.title}</li>`)
    }</ul>
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

#### Quotes are mandatory for dynamic attributes
To achieve best performance at setup time, a special `<!-- comment -->` is used the first time as template values.

This makes it possible to quickly walk through the DOM tree and setup behaviors, but it's also the value looked for within attributes.

Unfortunately, if you have html such `<div attr=<!-- comment --> class="any"></div>` the result is broken, while using single or double quotes will grant a successful operation. This is the biggest, and so far only, real caveat.

In summary, always write `<p attr="${'OK'}"></p>` instead of `<p attr=${'OK'}></p>`, or the layout will break, even if the attribute is a number or a boolean.

In this way you'll also ensure whatever value you'll pass later on won't ever break the layout. It's a bit annoying, yet a win.


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
If your string literals are transpiled, this project should be compatible with every single browser, old or new.

If you don't transpile string literals, check the [test page](https://webreflection.github.io/hyperHTML/test/) and wait 'till it's green.
