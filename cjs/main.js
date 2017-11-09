'use strict';
const Component = (m => m.__esModule ? m.default : m)(require('./classes/Component.js'));
const Transformer = (m => m.__esModule ? m.default : m)(require('./objects/Transformer.js'));
const wire = (m => m.__esModule ? m.default : m)(require('./hyper/wire.js'));
const {content, weakly} = require('./hyper/wire.js');
const render = (m => m.__esModule ? m.default : m)(require('./hyper/render.js'));

const bind = (hyper.bind = context => render.bind(context));
const define = (hyper.define = Transformer.define);

// it couldn't be more!
hyper.hyper = hyper;
hyper.wire = wire;

exports.Component = Component;
exports.bind = bind;
exports.define = define;
exports.hyper = hyper;
exports.wire = wire;

function hyper(HTML) {
  return arguments.length < 2 ?
    (HTML == null ?
      content('html') :
      (typeof HTML === 'string' ?
        wire(null, HTML) :
        ('raw' in HTML ?
          content('html')(HTML) :
          ('nodeType' in HTML ?
            bind(HTML) :
            weakly(HTML, 'html')
          )
        )
      )) :
    ('raw' in HTML ?
      content('html') : wire
    ).apply(null, arguments);
}
Object.defineProperty(exports, '__esModule', {value: true}).default = hyper
