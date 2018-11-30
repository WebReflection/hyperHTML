'use strict';
const unique = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('@ungap/template-literal'));

// these are tiny helpers to simplify most common operations needed here
const doc = node => node.ownerDocument || node;
exports.doc = doc;
const fragment = node => doc(node).createDocumentFragment();
exports.fragment = fragment;
const text = (node, text) => doc(node).createTextNode(text);
exports.text = text;

// appends an array of nodes
// to a generic node/fragment
// When available, uses append passing all arguments at once
// hoping that's somehow faster, even if append has more checks on type
// istanbul ignore next
const append = 'append' in fragment(document) ?
  (node, childNodes) => {
    node.append.apply(node, childNodes);
  } :
  (node, childNodes) => {
    const length = childNodes.length;
    for (let i = 0; i < length; i++) {
      node.appendChild(childNodes[i]);
    }
  };
exports.append = append;

// normalizes the template once for all arguments cases
const reArguments = function (template) {
  const args = [unique(template)];
  for (let i = 1, length = arguments.length; i < length; i++)
    args[i] = arguments[i];
  return args;
}
exports.reArguments = reArguments

// just recycling a one-off array to use slice
// in every needed place
const slice = [].slice;
exports.slice = slice;
