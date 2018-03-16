/*! (c) Andrea Giammarchi (ISC) */

import Component, {setup} from './classes/Component.js';
import Intent from './objects/Intent.js';
import wire, {content, weakly} from './hyper/wire.js';
import render from './hyper/render.js';
import diff from './shared/domdiff.js';

// all functions are self bound to the right context
// you can do the following
// const {bind, wire} = hyperHTML;
// and use them right away: bind(node)`hello!`;
const adopt = context => function () {
  render.adopt = true;
  return render.apply(context, arguments);
};
const bind = context => function () {
  render.adopt = false;
  return render.apply(context, arguments);
};
const define = Intent.define;

hyper.Component = Component;
hyper.adopt = adopt;
hyper.bind = bind;
hyper.define = define;
hyper.diff = diff;
hyper.hyper = hyper;
hyper.wire = wire;

// the wire content is the lazy defined
// html or svg property of each hyper.Component
setup(content);

// everything is exported directly or through the
// hyperHTML callback, when used as top level script
export {Component, adopt, bind, define, diff, hyper, wire};

// by default, hyperHTML is a smart function
// that "magically" understands what's the best
// thing to do with passed arguments
export default function hyper(HTML) {
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
