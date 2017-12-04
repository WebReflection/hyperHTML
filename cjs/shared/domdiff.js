'use strict';
/* AUTOMATICALLY IMPORTED, DO NOT MODIFY */
/*! (c) 2017 Andrea Giammarchi (ISC) */

/**
 * This code is a revisited port of the snabbdom vDOM diffing logic,
 * the same that fuels as fork Vue.js or other libraries.
 * @credits https://github.com/snabbdom/snabbdom
 */

const identity = O => O;

const domdiff = (
  parentNode,     // where changes happen
  currentNodes,   // Array of current items/nodes
  futureNodes,    // Array of future items/nodes
  getNode,        // optional way to retrieve a node from an item
  beforeNode      // optional item/node to use as insertBefore delimiter
) => {
  const get = getNode || identity;
  const before = beforeNode == null ? null : get(beforeNode);
  let currentStart = 0, futureStart = 0;
  let currentEnd = currentNodes.length - 1;
  let currentStartNode = currentNodes[0];
  let currentEndNode = currentNodes[currentEnd];
  let futureEnd = futureNodes.length - 1;
  let futureStartNode = futureNodes[0];
  let futureEndNode = futureNodes[futureEnd];
  while (currentStart <= currentEnd && futureStart <= futureEnd) {
    if (currentStartNode == null) {
      currentStartNode = currentNodes[++currentStart];
    }
    else if (currentEndNode == null) {
      currentEndNode = currentNodes[--currentEnd];
    }
    else if (futureStartNode == null) {
      futureStartNode = futureNodes[++futureStart];
    }
    else if (futureEndNode == null) {
      futureEndNode = futureNodes[--futureEnd];
    }
    else if (currentStartNode == futureStartNode) {
      currentStartNode = currentNodes[++currentStart];
      futureStartNode = futureNodes[++futureStart];
    }
    else if (currentEndNode == futureEndNode) {
      currentEndNode = currentNodes[--currentEnd];
      futureEndNode = futureNodes[--futureEnd];
    }
    else if (currentStartNode == futureEndNode) {
      parentNode.insertBefore(
        get(currentStartNode),
        get(currentEndNode).nextSibling || before
      );
      currentStartNode = currentNodes[++currentStart];
      futureEndNode = futureNodes[--futureEnd];
    }
    else if (currentEndNode == futureStartNode) {
      parentNode.insertBefore(
        get(currentEndNode),
        get(currentStartNode)
      );
      currentEndNode = currentNodes[--currentEnd];
      futureStartNode = futureNodes[++futureStart];
    }
    else {
      let index = currentNodes.indexOf(futureStartNode);
      if (index < 0) {
        parentNode.insertBefore(
          get(futureStartNode),
          get(currentStartNode)
        );
        futureStartNode = futureNodes[++futureStart];
      }
      else {
        let el = currentNodes[index];
        currentNodes[index] = null;
        parentNode.insertBefore(
          get(el),
          get(currentStartNode)
        );
        futureStartNode = futureNodes[++futureStart];
      }
    }
  }
  if (currentStart > currentEnd) {
    const pin = futureNodes[futureEnd + 1];
    const place = pin != null ? get(pin) : before;
    while (futureStart <= futureEnd) {
      const ch = futureNodes[futureStart++];
      // ignore until I am sure the else could never happen.
      // it might be a vDOM thing 'cause it never happens here.
      /* istanbul ignore else */
      if (ch != null) parentNode.insertBefore(get(ch), place);
    }
  }
  // ignore until I am sure the else could never happen.
  // it might be a vDOM thing 'cause it never happens here.
  /* istanbul ignore else */
  else if (futureStart > futureEnd) {
    while (currentStart <= currentEnd) {
      const ch = currentNodes[currentStart++];
      if (ch != null) parentNode.removeChild(get(ch));
    }
  }
  return futureNodes;
};

Object.defineProperty(exports, '__esModule', {value: true}).default = domdiff;
