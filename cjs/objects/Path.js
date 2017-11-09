'use strict';
const {
  COMMENT_NODE,
  DOCUMENT_FRAGMENT_NODE,
  ELEMENT_NODE
} = require('../shared/constants.js');

const prepend = (path, parent, node) => {
  path.unshift(
    'childNodes',
    path.indexOf.call(parent.childNodes, node)
  );
};

const createPath = node => {
  const path = [];
  let parentNode;
  switch (node.nodeType) {
    case ELEMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE:
      parentNode = node;
      break;
    case COMMENT_NODE:
      parentNode = node.parentNode;
      prepend(path, parentNode, node);
      break;
    default:
      parentNode = node.ownerElement;
      path.unshift('attributes', node.name);
      break;
  }
  for (
    node = parentNode;
    (parentNode = parentNode.parentNode);
    node = parentNode
  ) {
    prepend(path, parentNode, node);
  }
  return path;
};

Object.defineProperty(exports, '__esModule', {value: true}).default = {
  create: (type, node, name) => ({type, name, path: createPath(node)}),
  find: (node, path) => {
    const length = path.length;
    for (let i = 0; i < length; i++) {
      let key = path[i++];
      node = key === 'attributes' ?
        node.ownerDocument.createAttribute(path[i]) :
        node[key][path[i]];
    }
    return node;
  }
}
