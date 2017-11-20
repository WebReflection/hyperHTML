'use strict';
const majinbuu = (m => m.__esModule ? m.default : m)(require('majinbuu'));

const {slice, splice} = require('../shared/utils.js');

Object.defineProperty(exports, '__esModule', {value: true}).default = {
  MAX_LIST_SIZE: 1000,
  update(
    utils,
    parentNode,
    commentNode,
    liveNodes,
    liveStart,
    liveEnd,
    liveLength,
    virtualNodes,
    virtualStart,
    virtualEnd,
    virtualLength
  ) {
    if ((
      ((liveEnd - liveStart) + (virtualEnd - virtualStart)) / 2
    ) < this.MAX_LIST_SIZE) {
      majinbuu(
        majinbuu.aura(
          new Splicer(
            utils,
            parentNode,
            commentNode,
            liveNodes,
            liveStart
          ),
          slice.call(liveNodes, liveStart, liveEnd)
        ),
        slice.call(virtualNodes, virtualStart, virtualEnd),
        this.MAX_LIST_SIZE
      );
    } else {
      utils.engine.update(
        utils,
        parentNode,
        commentNode,
        liveNodes,
        liveStart,
        liveEnd,
        liveLength,
        virtualNodes,
        virtualStart,
        virtualEnd,
        virtualLength
      );
    }
  }
};

function Splicer(utils, parentNode, node, childNodes, index) {
  this.utils = utils;
  this.parentNode = parentNode;
  this.node = node;
  this.childNodes = childNodes;
  this.index = index;
}

Splicer.prototype.splice = function (start, end) {
  const getNode = this.utils.getNode;
  const changes = [this.index + start, end || 0];
  const length = arguments.length;
  for (let i = 2; i < length; i++) {
    changes.push(arguments[i]);
  }
  const ph = this.node;
  const pn = this.parentNode;
  const cn = this.childNodes;
  const index = changes[0] + changes[1];
  const target = index < cn.length ? getNode(cn[index]) : ph;
  const result = splice.apply(cn, changes);
  const reLength = result.length;
  for (let i = 0; i < reLength; i++) {
    const tmp = result[i];
    if (cn.indexOf(tmp) < 0) {
      pn.removeChild(getNode(tmp));
    }
  }
  if (2 < length) {
    this.utils.insert(pn, slice.call(changes, 2), target);
  }
};