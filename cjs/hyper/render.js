'use strict';
const {Map, WeakMap} = require('../shared/poorlyfills.js');
const {G, UIDC, VOID_ELEMENTS} = require('../shared/constants.js');
const Updates = (m => m.__esModule ? m.default : m)(require('../objects/Updates.js'));
const {
  createFragment,
  importNode,
  unique
} = require('../shared/utils.js');

const {selfClosing} = require('../shared/re.js');

// a weak collection of contexts that
// are already known to hyperHTML
const bewitched = new WeakMap;

// all unique template literals
// if the WeakMap is the global one, use it
// otherwise uses a Map because polyfilled WeakMaps
// cannot set any property to frozen objects (templates)
const templates = WeakMap === G.WeakMap ? new WeakMap : new Map;

// better known as hyper.bind(node), the render is
// the main tag function in charge of fully upgrading
// or simply updating, contexts used as hyperHTML targets.
// The `this` context is either a regular DOM node or a fragment.
function render(template) {
  const wicked = bewitched.get(this);
  if (wicked && wicked.template === unique(template)) {
    update.apply(wicked.updates, arguments);
  } else {
    upgrade.apply(this, arguments);
  }
  return this;
}

// an upgrade is in charge of collecting template info,
// parse it once, if unknown, to map all interpolations
// as single DOM callbacks, relate such template
// to the current context, and render it after cleaning the context up
function upgrade(template) {
  template = unique(template);
  const info =  templates.get(template) ||
                createTemplate.call(this, template);
  const fragment = importNode(this.ownerDocument, info.fragment);
  const updates = Updates.create(fragment, info.paths);
  bewitched.set(this, {template, updates});
  update.apply(updates, arguments);
  this.textContent = '';
  this.appendChild(fragment);
}

// an update simply loops over all mapped DOM operations
function update() {
  const length = arguments.length;
  for (let i = 1; i < length; i++) {
    this[i - 1](arguments[i]);
  }
}

// a template can be used to create a document fragment
// aware of all interpolations and with a list
// of paths used to find once those nodes that need updates,
// no matter if these are attributes, text nodes, or regular one
function createTemplate(template) {
  const paths = [];
  const html = template.join(UIDC).replace(SC_RE, SC_PLACE);
  const fragment = createFragment(this, html);
  Updates.find(fragment, paths, template.slice());
  const info = {fragment, paths};
  templates.set(template, info);
  return info;
}

// some node could be special though, like a custom element
// with a self closing tag, which should work through these changes.
const SC_RE = selfClosing;
const SC_PLACE = ($0, $1, $2) => {
  return VOID_ELEMENTS.test($1) ? $0 : ('<' + $1 + $2 + '></' + $1 + '>');
};

Object.defineProperty(exports, '__esModule', {value: true}).default = render;
