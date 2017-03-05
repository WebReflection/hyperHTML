# hyperHTML [![Build Status](https://travis-ci.org/WebReflection/hyperHTML.svg?branch=master)](https://travis-ci.org/WebReflection/hyperHTML)

A Fast & Light Virtual DOM Alternative
- - -

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

## Features

  * Zero dependencies and fits in less than a kilobyte (minzipped)
  * Uses directly native DOM instead of inventing new syntax/APIs, DOM diffing, or virtual DOM
  * Designed for [template literals](http://www.ecma-international.org/ecma-262/6.0/#sec-template-literals), a templating feature built in to JS
  * Compatible with vanilla DOM elements and vanilla JS data structures <sup><sub>(actually, this is just a 100% vanilla JS utility, that's why is most likely the fastest and also the smaller. I fell like I'm writing Assembly these days ...)</sub></sup>
  * Compatible 1:1 with Babel transpiled output, hence compatible with every browser you can think of


### ... wait, WAT?
[ES6 Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals) come with a special feature that is not commonly used: prefixed transformers.

Using such feature to map a template string to a generic DOM node, makes it possible to automatically target and update only the differences between two template invokes and with **no `innerHTML` involved**.

Following [an example](https://webreflection.github.io/hyperHTML/test/article.html):
```js
function update(render, state) {
  return render `
  <article data-magic=${state.magic}>
    <h3>${state.title}</h3>
    List of ${state.paragraphs.length} paragraphs:
    <ul>${
      state.paragraphs
        .map(p => `<li>${p.title}</li>`)
        .join('')
    }</ul>
  </article>
  `;
}

update(
  hyperHTML.bind(articleElement),
  {
    title: 'True story',
    paragraphs: [
      {title: 'touching'},
      {title: 'incredible'},
      {title: 'doge'}
    ]
  }
);
```

Since most of the time templates are 70% static text and 30% or less dynamic, `hyperHTML` passes through the resulting string only once, finds all attributes and content that is dynamic, and maps it 1:1 to the node to make updates as cheap as possible for both node attributes and node content.

## Usage
You have a `hyperHTML` function that is suitable for parsing template literals but it needs a DOM node context to operate.

If you want to render many times the same template for a specific node, bind it once and boost up performance for free.
No new nodes, or innerHTML, will be ever used in such case: safe listeners, faster DOM.

### F.A.Q. and Caveats

  * _how can I differentiate between textContent only and HTML or DOM nodes?_
    If there's any space or char around the value, that'd always be a textContent.
    Other cases accept DOM nodes as well as html, but it's obviously slightly slower.
    As summary: ```render`<p>This is: ${'text'}</p>`;``` for text,
    and ```render`<p>${'html' || node}</p>`;``` for everything else.

  * _can I use different renders for a single node?_
    Sure thing. However, the best performance gain is reached with nodes that always use the same template string.
    If you have a very unpredictable conditional template, you might want to create two different nodes and apply `hyperHTML` with the same template for both of them, swapping them when necessary.
    In every other case, the new template will create new content and map it once per change.


## Compatibility
If your string literals are transpiled, this project should be compatible with every single browser, old or new.

If you don't transpile string literals, check the [test page](https://webreflection.github.io/hyperHTML/test/) and wait 'till it's green.

- - -
(C) 2017 Andrea Giammarchi - MIT Style License
