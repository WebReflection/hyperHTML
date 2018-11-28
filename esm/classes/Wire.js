import { append, doc, fragment } from '../shared/utils.js';

export default function Wire(childNodes) {
  this.childNodes = childNodes;
  this.length = childNodes.length;
  this.first = childNodes[0];
  this.last = childNodes[this.length - 1];
  this._ = null;
}

// when a wire is inserted, all its nodes will follow
Wire.prototype.valueOf = function valueOf(different) {
  const noFragment = this._ == null;
  if (noFragment)
    this._ = fragment(this.first);
  /* istanbul ignore else */
  if (noFragment || different)
    append(this._, this.childNodes);
  return this._;
};

// when a wire is removed, all its nodes must be removed as well
Wire.prototype.remove = function remove() {
  this._ = null;
  const first = this.first;
  const last = this.last;
  if (this.length === 2) {
    last.parentNode.removeChild(last);
  } else {
    const range = doc(first).createRange();
    range.setStartBefore(this.childNodes[1]);
    range.setEndAfter(last);
    range.deleteContents();
  }
  return first;
};
