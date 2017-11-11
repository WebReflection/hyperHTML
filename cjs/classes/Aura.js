'use strict';
const majinbuu = (m => m.__esModule ? m.default : m)(require('majinbuu'));
const Component = (m => m.__esModule ? m.default : m)(require('./Component.js'));
const {fragment} = require('../shared/easy-dom.js');
const {Map} = require('../shared/poorlyfills.js');

function Aura(node, childNodes) {
  this.node = node;
  this.childNodes = childNodes;
  childNodes.become = become;
  return majinbuu.aura(this, childNodes);
}

Aura.MAX_LIST_SIZE = 999;

Aura.prototype.splice = function splice(start, end) {
  const values = new Map;
  const ph = this.node;
  const cn = this.childNodes;
  const target = asNode(cn[start + (end || 0)] || ph);
  const result = cn.splice.apply(cn, arguments);
  const pn = ph.parentNode;
  let i = 0;
  let tmp;
  const reLength = result.length;
  while (i < reLength) {
    tmp = result[i++];
    if (cn.indexOf(tmp) < 0) {
      pn.removeChild(get(values, tmp));
    }
  }
  i = 2;
  const arLength = arguments.length;
  while (i < arLength) {
    if ((arLength - i) === 1) {
      tmp = get(values, arguments[i++]);
    } else {
      tmp = fragment(pn);
      while (i < arLength) {
        tmp.appendChild(get(values, arguments[i++]));
      }
    }
    pn.insertBefore(tmp, target);
  }
  return result;
};

const asNode = node => node instanceof Component ? node.render() : node;
const get = (map, node) => map.get(node) || set(map, node);
const set = (map, node) => {
  const value = asNode(node);
  map.set(node, value);
  return value;
};

function become(value) {
  let i = 0, length = this.length;
  if (value.length !== length) {
    majinbuu(this, value, Aura.MAX_LIST_SIZE);
  } else {
    for (; i < length--; i++) {
      if (this[length] !== value[length] || this[i] !== value[i]) {
        majinbuu(this, value, Aura.MAX_LIST_SIZE);
        return;
      }
    }
  }
}

Object.defineProperty(exports, '__esModule', {value: true}).default = Aura;
