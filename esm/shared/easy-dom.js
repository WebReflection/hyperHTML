// these are tiny helpers to simplify most common operations needed here
export const create = (node, type) => doc(node).createElement(type);
export const doc = node => node.ownerDocument || node;
export const fragment = node => doc(node).createDocumentFragment();
export const text = (node, text) => doc(node).createTextNode(text);
