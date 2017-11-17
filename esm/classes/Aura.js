import Component from './Component.js';
import {fragment} from '../shared/easy-dom.js';
import {Map} from '../shared/poorlyfills.js';

// this class has one purpose:
// provide a splice method shared
// between all instances
function Aura(node, childNodes) {
  this.node = node;
  this.childNodes = childNodes;
}

Aura.prototype.become = function become(virtual) {
  const live = this.childNodes;
  const llength = live.length;
  const vlength = virtual.length;
  const info = [];
  let l = 0;
  let v = 0;
  while (l < llength && v < vlength) {
    const lv = live[l];
    const vv = virtual[v];
    const status = lv === vv ? 0 : (live.indexOf(vv) < 0 ? 1 : -1);
    if (status < 0) {
      addOperation(info, 'delete', l++, 1, []);
    } else if (0 < status) {
      addOperation(info, 'insert', l, 0, [virtual[v++]]);
    } else {
      l++;
      v++;
    }
  }
  while (l < llength) {
    addOperation(info, 'delete', l++, 1, []);
  }
  while (v < vlength) {
    addOperation(info, 'insert', l, 0, [virtual[v++]]);
  }
  performOperations(this, info);
};

const addOperation = (list, type, i, count, items) => {
  list.push({type, i, count, items});
};

const performOperations = (target, operations) => {
  const length = operations.length;
  let diff = 0;
  let i = 1;
  let curr, prev, op;
  if (length) {
    op = (prev = operations[0]);
    while (i < length) {
      curr = operations[i++];
      if (prev.type === curr.type && (curr.i - prev.i) <= 1) {
        op.count += curr.count;
        op.items = op.items.concat(curr.items);
      } else {
        target.splice.apply(target, [op.i + diff, op.count].concat(op.items));
        diff += op.type === 'insert' ? op.items.length : -op.count;
        op = curr;
      }
      prev = curr;
    }
    target.splice.apply(target, [op.i + diff, op.count].concat(op.items));
  }
};

// the splice is in charge of removing or adding nodes
Aura.prototype.splice = function splice(start, end) {
  const values = new Map;
  const ph = this.node;
  const cn = this.childNodes;
  const target = get(values, cn[start + (end || 0)] || ph);
  const pn = ph.parentNode;
  const result = cn.splice.apply(cn, arguments);
  const reLength = result.length;
  for (let i = 0; i < reLength; i++) {
    pn.removeChild(get(values, result[i]));
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
