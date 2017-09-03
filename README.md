# hyper(HTML)

[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC) [![Build Status](https://travis-ci.org/WebReflection/hyperHTML.svg?branch=master)](https://travis-ci.org/WebReflection/hyperHTML) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/hyperHTML/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/hyperHTML?branch=master) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/WebReflection/donate)


<img alt="hyperHTML logo" src="https://webreflection.github.io/hyperHTML/logo/hyperhtml.svg" width="116" height="81">

A **Fast & Light Virtual DOM Alternative** available for [NodeJS](https://viperhtml.js.org/viper.html) and [NativeScript](https://viperhtml.js.org/native.html) too.
- - -

## Basic Example
The easiest way to describe `hyperHTML` is through [an example](https://webreflection.github.io/hyperHTML/test/tick.html).
```js
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
  hyperHTML(document.getElementById('root'))
);
```

## Features

  * Zero dependencies, no polyfills needed, and it fits in less than **5KB** (minzipped)
  * Uses directly native DOM instead of inventing new syntax/APIs, DOM diffing, or virtual DOM
  * Designed for [template literals](http://www.ecma-international.org/ecma-262/6.0/#sec-template-literals), a templating feature built in to JS
  * Compatible with vanilla DOM elements and vanilla JS data structures
  * Also compatible with Babel transpiled output, hence suitable for every browser you can think of

## Compatibility

IE9+ , iOS8+ , Android 4+ and every modern Mobile or Desktop Browser.
You can verify directly through the following links:

  * [100% code coverage](https://webreflection.github.io/hyperHTML/test/) for browsers natively compatible with string literals
  * [100% code coverage](https://webreflection.github.io/hyperHTML/test/ie/) for IE9+ and browsers that need transpiled code
  * [coverage without experimental adopt feature](https://webreflection.github.io/hyperHTML/test/ie/?noadopt)

## Documentation

A proper documentation full of examples can be found in [viperhtml.js.org](https://viperhtml.js.org/).


#### hyper or lit ?

You can read more on this [hyperHTML vs lit-html](https://gist.github.com/WebReflection/fadcc419f5ccaae92bc167d8ff5c611b) comparison.
