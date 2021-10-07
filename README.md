# hyper(HTML)

### 📣 Community Announcement

Please ask questions in the [dedicated discussions repository](https://github.com/WebReflection/discussions), to help the community around this project grow ♥

- - -

<img alt="hyperHTML logo" src="https://webreflection.github.io/hyperHTML/logo/hyperhtml.svg" width="116" height="81">

A **Fast & Light Virtual DOM Alternative**.

- - -

[![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/WebReflection/donate) [![Backers on Open Collective](https://opencollective.com/hyperhtml/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/hyperhtml/sponsors/badge.svg)](#sponsors) ![WebReflection status](https://offline.report/status/webreflection.svg)

[![Coverage Status](https://coveralls.io/repos/github/WebReflection/hyperHTML/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/hyperHTML?branch=master)
[![Build Status](https://travis-ci.org/WebReflection/hyperHTML.svg?branch=master)](https://travis-ci.org/WebReflection/hyperHTML)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)
[![Greenkeeper badge](https://badges.greenkeeper.io/WebReflection/hyperHTML.svg)](https://greenkeeper.io/) ![Blazing Fast](https://img.shields.io/badge/speed-blazing%20🔥-brightgreen.svg)

- - -

Following an overview of projects related, or inspired by, _hyperHTML_. For a deep comparison of current libraries, feel free to [check this gist out](https://gist.github.com/WebReflection/761052d6dae7c8207d2fcba7cdede295).


## <em>µ</em>html

The latest, smallest, iteration of all best concept from this library since 2017, have been packaged in _~2.5K_. If it's extreme minimalism and great _DX_ that you are after, check [uhtml](https://github.com/WebReflection/uhtml#readme) out.


## hypersimple

If you've just started with template literals based projects and you like components, or you'd like to understand what's _hyperHTML_ capable of, give [hypersimple](https://github.com/WebReflection/hypersimple#readme) a try 🎉


## lighterhtml 💡

This little brother is "_showing off_" these days, claiming better performance and unprecedented ease of use.

[GitHub Repository](https://github.com/WebReflection/lighterhtml)


## Neverland 🌈🦄

If you like React hooks concept, don't miss this little wrap that adds 0._something_ overhead to the already lightweight hyperHTML, bringing in very similar concepts.

[Blog Post](https://medium.com/@WebReflection/neverland-the-hyperhtmls-hook-a0c3e11324bb)

[GitHub Repository](https://github.com/WebReflection/neverland)

## Haunted 🦇 🎃

If you also like React hooks mechanism and you'd like to combine these via hyperHTML or [HyperHTMLElement](https://github.com/WebReflection/hyperHTML-Element), try [haunted](https://github.com/matthewp/haunted#haunted--) out!


## Bundlers

You can require or import _hyperHTML_ with any bundler and in different ways.

If requiring or importing from `"hyperhtml"` doesn't work, try requiring from `"hyperhtml/cjs"` for CommonJS friendly bundlers (WebPack), or `"hyperhtml/esm"` for ESM compatible bundlers (Rollup).

See [HELPERS.md](./HELPERS.md) for a list of additional tools which can be helpful for building hyperHTML based web applications.

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

### 2.34 Highlights

  * the new `?boolean=${value}` syntax from [µhtml](https://github.com/WebReflection/uhtml#readme) has landed in *hyperHTML* too. Feel free to [rea this long discussion](https://github.com/WebReflection/discussions/discussions/13) to better understand *why* this syntax is necessary.

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
  
#### Weakmap error on ie < 11

'@ungap/weakmap': object is not extensible

Babel freezes the template literals by spec but that causes problems with the weakmap polyfill. To fix this error add the fix explained on [ungap/weakmap](https://github.com/ungap/weakmap#transpiled-code-and-frozen-objects-in-legacy-browsers)

## HTML Syntax Highlight

If you are using Visual Studio Code you can install `literally-html` to highlight all literals handled by `hyperHTML` and others.

![literally-html example](https://viperhtml.js.org/hyperhtml/documentation/img/literally-html.png)

## Prettier Templates

If you'd like to make your templates prettier than usual, don't miss this plugin: https://github.com/sgtpep/prettier-plugin-html-template-literals

## Questions ?

Please ask anything you'd like to know in [StackOverflow](https://stackoverflow.com) using the tag [`hyperhtml`](https://stackoverflow.com/questions/tagged/hyperhtml) so that others can benefit from answers and examples.

#### hyper or lit ?

You can read more on this [hyperHTML vs lit-html](https://medium.com/@WebReflection/lit-html-vs-hyperhtml-vs-lighterhtml-c084abfe1285) comparison.

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
