// these are tiny helpers to simplify most common operations needed here
export const doc = node => node.ownerDocument || node;
export const fragment = node => doc(node).createDocumentFragment();
export const text = (node, text) => doc(node).createTextNode(text);

// appends an array of nodes
// to a generic node/fragment
// When available, uses append passing all arguments at once
// hoping that's somehow faster, even if append has more checks on type
// istanbul ignore next
export const append = 'append' in fragment(document) ?
  (node, childNodes) => {
    node.append.apply(node, childNodes);
  } :
  (node, childNodes) => {
    const length = childNodes.length;
    for (let i = 0; i < length; i++) {
      node.appendChild(childNodes[i]);
    }
  };

// just recycling a one-off array to use slice
// in every needed place
export const slice = [].slice;
