'use strict';
const unique = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('@ungap/template-literal'));

// these are tiny helpers to simplify most common operations needed here
const text = (node, text) => node.ownerDocument.createTextNode(text);
exports.text = text;

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
