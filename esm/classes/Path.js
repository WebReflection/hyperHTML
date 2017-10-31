import {
  ATTRIBUTE_NODE,
  COMMENT_NODE,
  DOCUMENT_FRAGMENT_NODE,
  ELEMENT_NODE
} from '../shared/constants.js';

import {children} from '../shared/utils.js';

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
      path.unshift(
        'childNodes',
        path.indexOf.call(parentNode.childNodes, node)
      );
      break;
    case ATTRIBUTE_NODE:
    default: // jsdom here does not provide a nodeType 2 ...
      parentNode = node.ownerElement;
      path.unshift('attributes', node.name);
      break;
  }
  for (
    node = parentNode;
    (parentNode = parentNode.parentNode);
    node = parentNode
  ) {
    path.unshift('children', path.indexOf.call(children(parentNode), node));
  }
  return path;
};

export default function Path(type, node, name) {
  return {type, name, path: createPath(node)};
}