# hyper(html) Changelog

### v2.10.5
  * various fixes and changes after [changes applied to ECMAScript 2015](https://github.com/tc39/ecma262/pull/890)

### v2.8.0
  * updated [domdiff](https://github.com/WebReflection/domdiff#domdiff) engine to boost performance with segments and lists

### v2.7.2
  * fixed #218 which was a variant of #200

### v2.7.0
  * the `Component.for(obj)` is now created first time via `new Component(obj)` - #216

### v2.6.0
  * declarative hyper.Component via `Component.for(context, uid?)` - #202
  * hyperHTML TypeScript information - #201

### v2.5.12
  * fixed #200: textarea/style with initial undefined value

### v2.5.11
  * fixed #198: connected/disconnected events for nested components

### v2.5.10
  * more rigid / explicit RegExp to avoid glitches with self-closing tags

### v2.5.8
  * improved `VOID_ELEMENTS` regular expression (aligned with the _viperHTML_ one)

### v2.5.7
  * fixed `no.js` patch when wrong count of args is passed

### v2.5.6
  * added `no.js` file for environments without the ability to use modern JS or based on other languages such Dart.

### v2.5.5
  * build runs on macOS too
  * added umd.js file

### v2.5.2
  * fixed weird SVG case (see #172)

### v2.5.1
  * improved self-closing reliability recycling and sharing attributes RegExp

### v2.5.0
  * updated `domdiff` library to the latest version
  * implemented self-closing tags (and after various tests)

### v2.4.3
  * ensure attributes values are updated when different from previous one
  * avoid the usage of the word `global` in the whole code

### v2.4.2
  * fix scripts with actual content too.

### v2.4.1
  * fix a bug with scripts that don't trigger network requests in both Firefox and Safari (see bug #152)

### v2.4.0
  * created a `Wire` class to handle via `domdiff` multiple wired nodes.
  * brought back multi nodes per wire, a feature lost since **v2.0**
  * simplified `Component` handling too, making it compatible again with multi wired content.
  * fixed some check to make IE9+ tests green again

### v2.3.0
  * dropped the `engine` already. Too complex, no real benefits, refactored the whole internal logic to use [domdiff](https://github.com/WebReflection/domdiff) instead. Deprecated [hyperhtml-majinbuu](https://github.com/WebReflection/hyperhtml-majinbuu) and solved diffing "_forever_".

### v2.2.0
  * the whole `hyperHTML.engine` has been refactored to use [dom-splicer](https://github.com/WebReflection/dom-splicer) as an effort to make engine development easier

### v2.1.3
  * the MutationObserver is installed only once and only if there are components that have _on(dis)?connect_ handlers.

### v2.1.2
  * using a new folders convention with `esm/index.js` as main module and `cjs/index.js` as transformed artifact. This plays very well with bundlers when you `import {hyper} from 'hyperhtml/esm'` or `const {hyper} = require('hyperhtml/cjs');`

### v2.1.1
  * fast changes where prepending or appending same lists; now dropping upfront or removing at the end are part of the fast path too.

### v2.1.0

  * created a simple default merge engine focused on performance
  * remove majinbuu as core dependency, created [hyperhtml-majinbuu](https://github.com/WebReflection/hyperhtml-majinbuu) project to swap it back via `hyperHTML.engine = require('hyperhtml-majinbuu')` or as ESM
  * reduced final bundle size down to 4.1K via brotli

## v2.0.0

Refactoring following ticket #140
