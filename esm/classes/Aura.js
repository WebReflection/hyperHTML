import majinbuu from 'https://unpkg.com/majinbuu@latest/esm/main.js';
import Component from './Component.js';
import {fragment} from '../shared/easy-dom.js';
import {Map} from '../shared/poorlyfills.js';

// this class has one purpose:
// provide a splice method shared
// between all instances
function Aura(node, childNodes) {
  this.node = node;
  this.childNodes = childNodes;
  return majinbuu.aura(this, childNodes);
}

// majinbuu is fast but exponentially inefficient
// if you are handling thousands of items (which you shouldn't)
// calculating their diff might be too expensive.
// Let's use raw DOM when list of items is 1K+
Aura.MAX_LIST_SIZE = 999;

// the splice is in charge of removing or adding nodes
Aura.prototype.splice = function splice(start, end) {
  const values = new Map;
  const ph = this.node;
  const cn = this.childNodes;
  const target = get(values, cn[start + (end || 0)] || ph);
  const result = cn.splice.apply(cn, arguments);
  const pn = ph.parentNode;
  const reLength = result.length;
  for (let i = 0; i < reLength; i++) {
    const tmp = result[i];
    if (cn.indexOf(tmp) < 0) {
      pn.removeChild(get(values, tmp));
    }
  }
  const arLength = arguments.length;
  if (3 === arLength) {
    pn.insertBefore(get(values, arguments[2]), target);
  } else if (2 < arLength) {
    const tmp = fragment(pn);
    for (let i = 2; i < arLength; i++) {
      tmp.appendChild(get(values, arguments[i]));
    }
    pn.insertBefore(tmp, target);
  }
  return result;
};

// an item could be an hyperHTML.Component and, in such case,
// it should be rendered as node
const asNode = node => node instanceof Component ? node.render() : node;

// instead of checking instanceof each time and render potentially twice
// use a map to retrieve nodes from a generic item
const get = (map, node) => map.get(node) || set(map, node);
const set = (map, node) => {
  const value = asNode(node);
  map.set(node, value);
  return value;
};

export default Aura;
