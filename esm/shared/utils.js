import unique from '@ungap/template-literal';

// these are tiny helpers to simplify most common operations needed here
export const text = (node, text) => node.ownerDocument.createTextNode(text);

// normalizes the template once for all arguments cases
export const reArguments = function (template) {
  const args = [unique(template)];
  for (let i = 1, length = arguments.length; i < length; i++)
    args[i] = arguments[i];
  return args;
}

// just recycling a one-off array to use slice
// in every needed place
export const slice = [].slice;
