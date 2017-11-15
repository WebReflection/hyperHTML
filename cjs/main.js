'use strict';
const Aura = (m => m.__esModule ? m.default : m)(require('./classes/Aura.js'));
const Component = (m => m.__esModule ? m.default : m)(require('./classes/Component.js'));
const {setup} = require('./classes/Component.js');
const Transformer = (m => m.__esModule ? m.default : m)(require('./objects/Transformer.js'));
const wire = (m => m.__esModule ? m.default : m)(require('./hyper/wire.js'));
const {content, weakly} = require('./hyper/wire.js');
const render = (m => m.__esModule ? m.default : m)(require('./hyper/render.js'));

// all functions are self bound to the right context
// you can do the following
// const {bind, wire} = hyperHTML;
// and use them right away: bind(node)`hello!`;
const bind = context => render.bind(context);
const define = Transformer.define;

hyper.bind = bind;
hyper.define = define;
hyper.hyper = hyper;
hyper.wire = wire;
hyper.Component = Component;

// if needed, you can increase or decrease
// the maximum amount of nodes per list
// to compute via majinbuu algorithm
Object.defineProperty(hyper, 'MAX_LIST_SIZE', {
  get() { return Aura.MAX_LIST_SIZE; },
  set(value) {
    Aura.MAX_LIST_SIZE = value;
  }
});

// the wire content is the lazy defined
// html or svg property of each hyper.Component
setup(content);

// everything is exported directly or through the
// hyperHTML callback, when used as top level script
exports.Component = Component;
exports.bind = bind;
exports.define = define;
exports.hyper = hyper;
exports.wire = wire;

// by default, hyperHTML is a smart function
// that "magically" understands what's the best
// thing to do with passed arguments
function hyper(HTML) {
  return arguments.length < 2 ?
    (HTML == null ?
      content('html') :
      (typeof HTML === 'string' ?
        wire(null, HTML) :
        ('raw' in HTML ?
          content('html')(HTML) :
          ('nodeType' in HTML ?
            render.bind(HTML) :
            weakly(HTML, 'html')
          )
        )
      )) :
    ('raw' in HTML ?
      content('html') : wire
    ).apply(null, arguments);
}
Object.defineProperty(exports, '__esModule', {value: true}).default = hyper
