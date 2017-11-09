import Component, {setup} from './classes/Component.js';
import Transformer from './objects/Transformer.js';
import wire, {content, weakly} from './hyper/wire.js';
import render from './hyper/render.js';

const bind = (hyper.bind = context => render.bind(context));
const define = (hyper.define = Transformer.define);

hyper.hyper = hyper;
hyper.wire = wire;
hyper.Component = Component;

setup(content);

export {Component, bind, define, hyper, wire};

export default function hyper(HTML) {
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
