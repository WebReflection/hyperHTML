import {ELEMENT_NODE, SVG_NAMESPACE} from '../shared/constants.js';
import {WeakMap, trim} from '../shared/poorlyfills.js';
import {fragment} from '../shared/easy-dom.js';
import {append, slice, unique} from '../shared/utils.js';
import render from './render.js';

const wires = new WeakMap;

const wire = (obj, type) => obj == null ?
  content(type || 'html') :
  weakly(obj, type || 'html');

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

const wireContent = node => {
  const childNodes = node.childNodes;
  const length = childNodes.length;
  const wire = [];
  for (let i = 0; i < length; i++) {
    let child = childNodes[i];
    if (
      child.nodeType === ELEMENT_NODE ||
      trim.call(child.textContent).length !== 0
    ) {
      wire.push(child);
    }
  }
  return wire.length === 1 ? wire[0] : wire;
};

export {content, weakly};
export default wire;
