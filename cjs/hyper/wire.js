'use strict';
const {ELEMENT_NODE, SVG_NAMESPACE} = require('../shared/constants.js');
const {WeakMap, trim} = require('../shared/poorlyfills.js');
const {fragment} = require('../shared/easy-dom.js');
const {append, slice, unique} = require('../shared/utils.js');
const render = (m => m.__esModule ? m.default : m)(require('./render.js'));

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

exports.content = content;
exports.weakly = weakly;
Object.defineProperty(exports, '__esModule', {value: true}).default = wire;
