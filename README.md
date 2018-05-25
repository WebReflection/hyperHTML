# hyper(HTML)

<img alt="hyperHTML logo" src="https://webreflection.github.io/hyperHTML/logo/hyperhtml.svg" width="116" height="81">

A **Fast & Light Virtual DOM Alternative** available for [NodeJS](https://viperhtml.js.org/viper.html) and [NativeScript](https://viperhtml.js.org/native.html) too.

- - -

[![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/WebReflection/donate) [![Backers on Open Collective](https://opencollective.com/hyperhtml/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/hyperhtml/sponsors/badge.svg)](#sponsors)

[![Coverage Status](https://coveralls.io/repos/github/WebReflection/hyperHTML/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/hyperHTML?branch=master)
[![Build Status](https://travis-ci.org/WebReflection/hyperHTML.svg?branch=master)](https://travis-ci.org/WebReflection/hyperHTML)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)
[![Greenkeeper badge](https://badges.greenkeeper.io/WebReflection/hyperHTML.svg)](https://greenkeeper.io/) ![Blazing Fast](https://img.shields.io/badge/speed-blazing%20🔥-brightgreen.svg)

- - -

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/hyperhtml#sponsor)]

<a href="https://opencollective.com/hyperhtml/sponsor/0/website" target="_blank"><img src="https://opencollective.com/hyperhtml/sponsor/0/avatar.svg"></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/hyperhtml#backer)]

<a href="https://opencollective.com/hyperhtml#backers" target="_blank"><img src="https://opencollective.com/hyperhtml/backers.svg?width=890"></a>

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/WebReflection/hyperHTML/graphs/contributors"><img src="https://opencollective.com/hyperhtml/contributors.svg?width=890" /></a>

- - -

### Seamlessly Isomorphic
No matter if you use ESM or CommonJS, you can use [hypermorphic](https://github.com/WebReflection/hypermorphic#hypermorphic-)
to load same features on both client and server.

```js
// ESM example (assuming bundlers/ESM loaders in place)
import {bind, wire} from 'hypermorphic';

// CommonJS example
const {bind, wire} = require('hypermorphic');
```

- - -

### V2.5 Highlights
  * `<self-closing />` tags for both custom elements and any other as well 🎉

### V2 Highlights

Following most important changes in version 2:

  * fully rewritten, and [consumable](https://unpkg.com/hyperhtml@latest/esm/index.js), as [ES2015 Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
  * [usable via CDN](https://unpkg.com/hyperhtml@latest/min.js) as bundled global `hyperHTML` variable
  * restructured in modules, utilities, helpers, and commented all over for simplified contribution
  * **removed** `.escape` and `.adopt`, either useless or unstable. `hyperHTML.adopt` will be implemented as module a part
  * **added** support for objects as `style` attribute, fully compatible with [Preact](https://github.com/developit/preact) implementation
  * **improved** performance in numerous ways
  * **custom elements** V0 and V1 are now fully, and properly, supported through `document.importNode` and/or regular `cloneNode` tested against common polyfills
  * back to 4.6K thanks to **rollup** and its ability to merge all the things together like it was already in V1

## Documentation

A proper documentation full of examples can be found in [viperhtml.js.org](https://viperhtml.js.org/).

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

  * Zero dependencies, no polyfills needed, and it fits in about **4.6KB** (minified + brotli)
  * Uses directly native DOM, no virtual DOM involved
  * Designed for [template literals](http://www.ecma-international.org/ecma-262/6.0/#sec-template-literals), a templating feature built in to JS
  * Compatible with plain DOM elements and plain JS data structures
  * Also compatible with Babel transpiled output, hence suitable for every browser you can think of

## Compatibility

IE9+ , iOS8+ , Android 4+ and every modern Mobile or Desktop Browser.
You can verify directly through the following links:

  * [100% code coverage](https://webreflection.github.io/hyperHTML/test/) for browsers natively compatible with string literals
  * [100% code coverage](https://webreflection.github.io/hyperHTML/test/ie/) for IE9+ and browsers that need transpiled code

## HTML Syntax Highlight

If you are using Visual Studio Code you can install `literally-html` to highlight all literals handled by `hyperHTML` and others.

![literally-html example](https://viperhtml.js.org/hyperhtml/documentation/img/literally-html.png)

## Questions ?

Please ask anything you'd like to know in [StackOverflow](https://stackoverflow.com) using the tag [`hyperhtml`](https://stackoverflow.com/questions/tagged/hyperhtml) so that others can benefit from answers and examples.

#### hyper or lit ?

You can read more on this [hyperHTML vs lit-html](https://gist.github.com/WebReflection/fadcc419f5ccaae92bc167d8ff5c611b) comparison.

#### installation?

```js
npm install hyperhtml
```
If your bundler does not work with the following:
```js
// ES6
import hyperHTML from 'hyperhtml';

// CJS
const hyperHTML = require('hyperhtml');
```
You can try any of these other options.
```js
import hyperHTML from 'hyperhtml/esm';
// or
import {hyper, wire, bind, Component} from 'hyperhtml/esm';
// or
import hyperHTML from 'https://unpkg.com/hyperhtml?module';


const hyperHTML = require('hyperhtml/cjs').default;
// or
const {hyper, wire, bind, Component} = require('hyperhtml/cjs');
```

In alternative, there is a pre-bundled `require("hyperhtml/umd")` or via unpkg as [UMD module](https://unpkg.com/hyperhtml@latest/umd.js).
