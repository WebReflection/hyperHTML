# hyper(html) Changelog

### v2.1.2
  * using a new folders convention with `esm/index.js` as main module and `cjs/index.js` as transformed artifact. This plays very well with packagers too when you `import {hyper} from 'hyperhtml/esm'` or `const {hyper} = require('hyperhtml/cjs');`

### v2.1.1
  * fast changes where prepending or appending same lists; now dropping upfront or removing at the end are part of the fast path too.

### v2.1.0

  * created a simple default merge engine focused on performance
  * remove majinbuu as core dependency, created [hyperhtml-majinbuu](https://github.com/WebReflection/hyperhtml-majinbuu) project to swap it back via `hyperHTML.engine = require('hyperhtml-majinbuu')` or as ESM
  * reduced final bundle size down to 4.1K via brotli

## v2.0.0

Refactoring following ticket #140
