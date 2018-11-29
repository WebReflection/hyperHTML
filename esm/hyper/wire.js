import WeakMap from '@ungap/weakmap';
import trim from '@ungap/trim';

import {ELEMENT_NODE, SVG_NAMESPACE} from '../shared/constants.js';
import {fragment} from '../shared/easy-dom.js';
import {append, slice, unique} from '../shared/utils.js';
import Wire from '../classes/Wire.js';
import render from './render.js';

// all wires used per each context
const wires = new WeakMap;

// A wire is a callback used as tag a function
// to lazily relate a generic object to a template literal.
// hyper.wire(user)`<div id=user>${user.name}</div>`; => the div#user
// This provides the ability to have a unique DOM structure
// related to a unique JS object through a reusable template literal.
// A wire can specify a type, as svg or html, and also an id
// via the html:id or :id convention. Such :id allows same JS objects
// to be associated to different DOM structures accordingly with
// the used template literal without losing previously rendered parts.
const wire = (obj, type) => obj == null ?
  content(type || 'html') :
  weakly(obj, type || 'html');

// A wire content is a virtual reference to one or more nodes.
// It's represented by either a DOM node, or an Array.
// In both cases, the wire content role is to simply update
// all nodes through the list of related callbacks.
// In few words, a wire content is like an invisible parent node
// in charge of updating its content like a bound element would do.
const content = type => {
  let wire, container, content, template, updates;
  return function (statics) {
    statics = unique(statics);
    let setup = template !== statics;
    if (setup) {
      template = statics;
      content = fragment(document);
      container = type === 'svg' ?
        document.createElementNS(SVG_NAMESPACE, 'svg') :
        content;
      updates = render.bind(container);
    }
    updates.apply(null, arguments);
    if (setup) {
      if (type === 'svg') {
        append(content, slice.call(container.childNodes));
      }
      wire = wireContent(content);
    }
    return wire;
  };
};

// wires are weakly created through objects.
// Each object can have multiple wires associated
// thanks to the type + :id feature.
const weakly = (obj, type) => {
  const i = type.indexOf(':');
  let wire = wires.get(obj);
  let id = type;
  if (-1 < i) {
    id = type.slice(i + 1);
    type = type.slice(0, i) || 'html';
  }
  if (!wire) wires.set(obj, wire = {});
  return wire[id] || (wire[id] = content(type));
};

// A document fragment loses its nodes as soon
// as it's appended into another node.
// Consequently, this would easily lose wired content
// on a second render call, because (by then) the fragment would empty and could
// no longer be used as a means of appending the sub-nodes it once contained that
// were ultimately associated with the original interpolation.
// To prevent hyperHTML from forgetting about a fragment's sub-nodes,
// fragments are instead returned as Array of nodes or, if there's only one entry,
// as single referenced node which, unlike framents, will persist wire content
// throughout multiple renderings.
// The initial fragment, at this point, would be used as unique reference to this
// array of node or single referenced node.
const wireContent = node => {
  const childNodes = node.childNodes;
  const length = childNodes.length;
  const wireNodes = [];
  for (let i = 0; i < length; i++) {
    let child = childNodes[i];
    if (
      child.nodeType === ELEMENT_NODE ||
      trim.call(child.textContent).length !== 0
    ) {
      wireNodes.push(child);
    }
  }
  return wireNodes.length === 1 ? wireNodes[0] : new Wire(wireNodes);
};

export { content, weakly };
export default wire;
