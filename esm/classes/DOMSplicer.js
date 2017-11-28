/* AUTOMATICALLY IMPORTED, DO NOT MODIFY */
/*! (c) Andrea Giammarchi (ISC) */

import { isArray } from "../shared/poorlyfills.js";
const { min, max } = Math;
const arraySplice = [].splice;

const fragment = (target, item, list, i, length) => {
  const f = target.ownerDocument.createDocumentFragment();
  while (i < length) f.appendChild(item(list[i++]));
  return f;
};

const identity = thing => thing;

const remove = (target, item, list, i, length) => {
  while (i < length--) {
    target.removeChild(item(list[length]));
  }
};

// not using a class to avoid Babel bloat
function DOMSplicer(options) {
  const { before, target } = options;
  const item = options.item || identity;
  const childNodes = options.childNodes || (before ? [] : target.childNodes);
  this.item = item;
  this.target = target ? item(target) : null;
  this.before = before ? item(before) : null;
  this.childNodes = childNodes;
  this.applySplice = isArray(childNodes);
  this.placeHolder = (
    this.target || this.before
  ).ownerDocument.createComment('');
}

DOMSplicer.prototype.splice = function splice(start, deleteCount) {
  const aLength = arguments.length;
  if (aLength < 1) return;
  const item = this.item;
  const before = this.before;
  const target = this.target || before.parentNode;
  const childNodes = this.childNodes;
  const placeHolder = this.placeHolder;
  const len = childNodes.length;
  const index = start < 0 ?
    max((len + start), 0) :
    min(start, len);
  const count = aLength < 2 ?
    (len - index) :
    min(max(deleteCount, 0), len - index);
  target.insertBefore(
    placeHolder,
    index < len ? item(childNodes[index]) : before
  );
  let copy = childNodes;
  let added = 1;
  if (this.applySplice) {
    added = 0;
    copy = copy.slice();
    arraySplice.apply(childNodes, arguments);
  }
  if (count) remove(target, item, copy, added + index, added + index + count);
  if (aLength > 2) {
    target.insertBefore(
      aLength > 3 ?
        fragment(target, item, arguments, 2, aLength) :
        item(arguments[2]),
      placeHolder
    );
  }
  target.removeChild(placeHolder);
};

export default DOMSplicer;
