# hyper(html) Changelog

### v.2.23
  * monkey patched rollup generated code to export once the same module shared within sub-modules

### v2.22
  * using latest domtagger

### v2.21
  * refactored out all dependencies

### v2.20
  * re-tested every single supported browser nd fixed few outstanding issues with the 2.19 release

### v2.19
  * refactored out most of the code
  * finally managed to have coveralls show coverage stats
  * attributes can have spaces around as per DOM standard - [#244](https://github.com/WebReflection/hyperHTML/issues/224)
  * fixed SVG (non-critical) errors when interpolations are used for numerically expected values
  * fixed minor issues with Edge attributes
  * changed the unique id so if any of your logic was trusting `_hyper: ....;` comments you need to update your logic - [#300](https://github.com/WebReflection/hyperHTML/issues/300)

### v2.16.8
  * improved MutationObserver and fallback so that double `dis/connected` events won't happen again
  * exposed `observe` utility for 3rd parts so that it is possible to observe any node, not only those defined via template literals. Once observed, a node can have `connected` and `disconnected` listeners that will be triggered automatically.

### v2.16
  * modified `Wire` class to better handle "_same target_" case, making the `haunted.html` demo work same way as if it was bound to the node, through `valueOf()` invoke which would result in just exactly the same node if the wired content produced a node instead of a fragment. While regular users won't be affected, this is an implementation detail that changes a lot for libraries integrating `hyperHTML.wire` in their logic, making wires as fast as `bind` in most component related use cases.

### v2.15
  * added [invokable slots](https://github.com/WebReflection/hyperHTML/pull/282#issuecomment-433614081) to let developers explore patterns through callbacks that will receive a unique live node for weak references while rendered.

### v2.14
  * updated [domdiff](https://github.com/WebReflection/domdiff#domdiff) to match [petit-dom](https://github.com/yelouafi/petit-dom) performance
    * up to 3X performance on huge lists
    * improved reliability over random changes
    * unfortunately there's a +0.6K overall size increase due amount of extra logic involved

### v2.13.2
  * added support for custom CSS properties as object keys.

### v2.13.1
  * worked around [TypeScript transpilation bug with Template Literals](https://twitter.com/WebReflection/status/1038115439539363840).

### v2.13
  * added the ability to define custom attributes via `hyperHTML.define("hyper-attribute", callback)`, so that `<p hyper-attribute=${anyValue}/>` would invoke `callback(target, anyValue)` where `p` would be the target.

### v2.12
  * added `hyper.Component#dispatch(type, detail)` method to simplify events dispatching between lightweight components, bubbling a cancelable Custom Event with a `.component` property that points at the dispatcher, while the `event.currentTarget` will be the first node found within the component render.

### v2.11
  * updated [domdiff](https://github.com/WebReflection/domdiff#domdiff) to v1.0

### v2.10.12
  * patched missing `.children` in SVG node in IE / Edge https://github.com/WebReflection/hyperHTML/issues/244

### v2.10.10
  * updated [domdiff](https://github.com/WebReflection/domdiff#domdiff) to solve issue #243 (breaking with some sorted list)

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
