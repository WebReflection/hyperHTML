/* AUTOMATICALLY IMPORTED, DO NOT MODIFY */
/*! (c) 2017 Andrea Giammarchi (ISC) */

/**
 * This code is a revisited port of the snabbdom vDOM diffing logic,
 * the same that fuels as fork Vue.js or other libraries.
 * @credits https://github.com/snabbdom/snabbdom
 */

const identity = O => O;

const remove = (parentNode, before, after) => {
  const range = parentNode.ownerDocument.createRange();
  range.setStartBefore(before);
  range.setEndAfter(after);
  range.deleteContents();
};

const domdiff = (
  parentNode,     // where changes happen
  currentNodes,   // Array of current items/nodes
  futureNodes,    // Array of future items/nodes
  getNode,        // optional way to retrieve a node from an item
  beforeNode      // optional item/node to use as insertBefore delimiter
) => {
  const get = getNode || identity;
  const before = beforeNode == null ? null : get(beforeNode, 0);
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
        get(currentStartNode, 1),
        get(currentEndNode, -0).nextSibling
      );
      currentStartNode = currentNodes[++currentStart];
      futureEndNode = futureNodes[--futureEnd];
    }
    else if (currentEndNode == futureStartNode) {
      parentNode.insertBefore(
        get(currentEndNode, 1),
        get(currentStartNode, 0)
      );
      currentEndNode = currentNodes[--currentEnd];
      futureStartNode = futureNodes[++futureStart];
    }
    else {
      let index = currentNodes.indexOf(futureStartNode);
      if (index < 0) {
        parentNode.insertBefore(
          get(futureStartNode, 1),
          get(currentStartNode, 0)
        );
        futureStartNode = futureNodes[++futureStart];
      }
      else {
        let i = index;
        let f = futureStart;
        while (
          i <= currentEnd &&
          f <= futureEnd &&
          currentNodes[i] === futureNodes[f]
        ) {
          i++;
          f++;
        }
        if (1 < (i - index)) {
          if (--index === currentStart) {
            parentNode.removeChild(get(currentStartNode, -1));
          } else {
            remove(
              parentNode,
              get(currentStartNode, -1),
              get(currentNodes[index], -1)
            );
          }
          currentStart = i;
          futureStart = f;
          currentStartNode = currentNodes[i];
          futureStartNode = futureNodes[f];
        } else {
          const el = currentNodes[index];
          currentNodes[index] = null;
          parentNode.insertBefore(get(el, 1), get(currentStartNode, 0));
          futureStartNode = futureNodes[++futureStart];
        }
      }
    }
  }
  if (currentStart <= currentEnd || futureStart <= futureEnd) {
    if (currentStart > currentEnd) {
      const pin = futureNodes[futureEnd + 1];
      const place = pin == null ? before : get(pin, 0);
      if (futureStart === futureEnd) {
        parentNode.insertBefore(get(futureNodes[futureStart], 1), place);
      }
      else {
        const fragment = parentNode.ownerDocument.createDocumentFragment();
        while (futureStart <= futureEnd) {
          fragment.appendChild(get(futureNodes[futureStart++], 1));
        }
        parentNode.insertBefore(fragment, place);
      }
    }
    else {
      if (currentNodes[currentStart] == null) currentStart++;
      if (currentStart === currentEnd) {
        parentNode.removeChild(get(currentNodes[currentStart], -1));
      }
      else {
        remove(
          parentNode,
          get(currentNodes[currentStart], -1),
          get(currentNodes[currentEnd], -1)
        );
      }
    }
  }
  return futureNodes;
};

export default domdiff;
