'use strict';
/*! (c) Andrea Giammarchi (ISC) */
const diff = (m => /* c8 ignore start */ m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m /* c8 ignore stop */)(require('domdiff'));
const Component = (m => /* c8 ignore start */ m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m /* c8 ignore stop */)(require('./classes/Component.js'));
const {setup} = require('./classes/Component.js');
const Intent = (m => /* c8 ignore start */ m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m /* c8 ignore stop */)(require('./objects/Intent.js'));
const {observe, Tagger} = require('./objects/Updates.js');
const wire = (m => /* c8 ignore start */ m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m /* c8 ignore stop */)(require('./hyper/wire.js'));
const {content, weakly} = require('./hyper/wire.js');
const render = (m => /* c8 ignore start */ m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m /* c8 ignore stop */)(require('./hyper/render.js'));

// all functions are self bound to the right context
// you can do the following
// const {bind, wire} = hyperHTML;
// and use them right away: bind(node)`hello!`;
const bind = context => render.bind(context);
const define = Intent.define;
const tagger = Tagger.prototype;

hyper.Component = Component;
hyper.bind = bind;
hyper.define = define;
hyper.diff = diff;
hyper.hyper = hyper;
hyper.observe = observe;
hyper.tagger = tagger;
hyper.wire = wire;

// the wire content is the lazy defined
// html or svg property of each hyper.Component
setup(content);

// everything is exported directly or through the
// hyperHTML callback, when used as top level script
exports.Component = Component;
exports.bind = bind;
exports.define = define;
exports.diff = diff;
exports.hyper = hyper;
exports.observe = observe;
exports.tagger = tagger;
exports.wire = wire;

// by default, hyperHTML is a smart function
// that "magically" understands what's the best
// thing to do with passed arguments
function hyper(HTML) {
  return arguments.length < 2 ?
    (HTML == null ?
      content('html') :
      (typeof HTML === 'string' ?
        hyper.wire(null, HTML) :
        ('raw' in HTML ?
          content('html')(HTML) :
          ('nodeType' in HTML ?
            hyper.bind(HTML) :
            weakly(HTML, 'html')
          )
        )
      )) :
    ('raw' in HTML ?
      content('html') : hyper.wire
    ).apply(null, arguments);
}
Object.defineProperty(exports, '__esModule', {value: true}).default = hyper
