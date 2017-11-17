'use strict';
const Component = (m => m.__esModule ? m.default : m)(require('./Component.js'));
const {fragment} = require('../shared/easy-dom.js');
const {Map} = require('../shared/poorlyfills.js');

// this class has one purpose:
// provide a splice method shared
// between all instances
function Aura(node, childNodes) {
  this.node = node;
  this.childNodes = childNodes;
}

Aura.prototype.empty = function empty(value) {
  const node = this.node;
  const childNodes = this.childNodes;
  const pn = node.parentNode;
  let length = childNodes.length;
  if (length) {
    const remove = childNodes.splice(0, length);
    while (length--) pn.removeChild(asNode(remove[length]));
  }
  if (value) {
    childNodes.push(value);
    pn.insertBefore(asNode(value), node);
  }
};

Aura.prototype.become = function become(virtual) {
  const node = this.node;
  const live = this.childNodes;
  const pn = node.parentNode;
  const vlength = virtual.length;
  let llength = live.length;
  let l = 0;
  let v = 0;
  while (l < llength && v < vlength) {
    const lv = live[l];
    const vv = virtual[v];
    const status = lv === vv ? 0 : (live.indexOf(vv) < 0 ? 1 : -1);
    if (status < 0) {
      live.splice(l, 1);
      pn.removeChild(asNode(lv));
      llength--;
    } else if (0 < status) {
      live.splice(l++, 0, vv);
      pn.insertBefore(asNode(vv), l < llength ? asNode(live[l]) : node);
      llength++;
      v++;
    } else {
      l++;
      v++;
    }
  }
  if (l < llength) {
    const remove = live.splice(l, llength - l);
    l = remove.length;
    while (l--) pn.removeChild(asNode(remove[l]));
  }
  if (v < vlength) {
    const append = virtual.slice(v);
    l = 0;
    llength = append.length;
    if (llength === 1) {
      pn.insertBefore(asNode(append[l]), node);
    } else {
      const tmp = fragment(pn);
      while (l < llength)
        tmp.appendChild(asNode(append[l++]));
      pn.insertBefore(tmp, node);
    }
    live.push.apply(live, append);
  }
};

// an item could be an hyperHTML.Component and, in such case,
// it should be rendered as node
const asNode = node => node instanceof Component ? node.render() : node;

/* TODO: benchmark this is needed at all
// instead of checking instanceof each time and render potentially twice
// use a map to retrieve nodes from a generic item
const get = (map, node) => map.get(node) || set(map, node);
const set = (map, node) => {
  const value = asNode(node);
  map.set(node, value);
  return value;
};
*/

Object.defineProperty(exports, '__esModule', {value: true}).default = Aura;
