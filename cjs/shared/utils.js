'use strict';
const {attrName, attrSeeker} = require('./re.js');

const {
  G,
  ELEMENT_NODE,
  OWNER_SVG_ELEMENT,
  SVG_NAMESPACE,
  UID,
  UIDC
} = require('./constants.js');

const {
  hasAppend,
  hasContent,
  hasDoomedCloneNode,
  hasImportNode
} = require('./features-detection.js');

const {create, doc, fragment} = require('./easy-dom.js');

const {Map, WeakMap} = require('./poorlyfills.js');

// appends an array of nodes
// to a generic node/fragment
// When available, uses append passing all arguments at once
// hoping that's somehow faster, even if append has more checks on type
const append = hasAppend ?
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

const findAttributes = new RegExp('(' + attrName + '=)([\'"]?)' + UIDC + '\\2', 'gi');
const comments = ($0, $1, $2, $3) =>
  '<' + $1 + $2.replace(findAttributes, replaceAttributes) + $3;
const replaceAttributes = ($0, $1, $2) => $1 + ($2 || '"') + UID + ($2 || '"');

// given a node and a generic HTML content,
// create either an SVG or an HTML fragment
// where such content will be injected
const createFragment = (node, html) =>
  (OWNER_SVG_ELEMENT in node ?
    SVGFragment :
    HTMLFragment
  )(node, html.replace(attrSeeker, comments));
exports.createFragment = createFragment;

// IE/Edge shenanigans proof cloneNode
// it goes through all nodes manually
// instead of relying the engine to suddenly
// merge nodes together
const cloneNode = hasDoomedCloneNode ?
  node => {
    const clone = node.cloneNode();
    const childNodes = node.childNodes ||
                      // this is an excess of caution
                      // but some node, in IE, might not
                      // have childNodes property.
                      // The following fallback ensure working code
                      // in older IE without compromising performance
                      // or any other browser/engine involved.
                      /* istanbul ignore next */
                      [];
    const length = childNodes.length;
    for (let i = 0; i < length; i++) {
      clone.appendChild(cloneNode(childNodes[i]));
    }
    return clone;
  } :
  // the following ignore is due code-coverage
  // combination of not having document.importNode
  // but having a working node.cloneNode.
  // This shenario is common on older Android/WebKit browsers
  // but basicHTML here tests just two major cases:
  // with document.importNode or with broken cloneNode.
  /* istanbul ignore next */
  node => node.cloneNode(true);

// IE and Edge do not support children in SVG nodes
/* istanbul ignore next */
const getChildren = node => {
  const children = [];
  const childNodes = node.childNodes;
  const length = childNodes.length;
  for (let i = 0; i < length; i++) {
    if (childNodes[i].nodeType === ELEMENT_NODE)
      children.push(childNodes[i]);
  }
  return children;
};
exports.getChildren = getChildren;

// used to import html into fragments
const importNode = hasImportNode ?
  (doc, node) => doc.importNode(node, true) :
  (doc, node) => cloneNode(node)
exports.importNode = importNode

// just recycling a one-off array to use slice
// in every needed place
const slice = [].slice;
exports.slice = slice;

// lazy evaluated, returns the unique identity
// of a template literal, as tempalte literal itself.
// By default, ES2015 template literals are unique
// tag`a${1}z` === tag`a${2}z`
// even if interpolated values are different
// the template chunks are in a frozen Array
// that is identical each time you use the same
// literal to represent same static content
// around its own interpolations.
const unique = template => TL(template);
exports.unique = unique;

// TL returns a unique version of the template
// it needs lazy feature detection
// (cannot trust literals with transpiled code)
let TL = t => {
  if (
    // TypeScript template literals are not standard
    t.propertyIsEnumerable('raw') ||
    (
        // Firefox < 55 has not standard implementation neither
        /Firefox\/(\d+)/.test((G.navigator || {}).userAgent) &&
          parseFloat(RegExp.$1) < 55
        )
  ) {
    const T = {};
    TL = t => {
      const k = '^' + t.join('^');
      return T[k] || (T[k] = t);
    };
  } else {
    // make TL an identity like function
    TL = t => t;
  }
  return TL(t);
};

// used to store templates objects
// since neither Map nor WeakMap are safe
const TemplateMap = () => {
  try {
    const wm = new WeakMap;
    const o_O = Object.freeze([]);
    wm.set(o_O, true);
    if (!wm.get(o_O))
      throw o_O;
    return wm;
  } catch(o_O) {
    // inevitable legacy code leaks due
    // https://github.com/tc39/ecma262/pull/890
    return new Map;
  }
};
exports.TemplateMap = TemplateMap;

// create document fragments via native template
// with a fallback for browsers that won't be able
// to deal with some injected element such <td> or others
const HTMLFragment = hasContent ?
  (node, html) => {
    const container = create(node, 'template');
    container.innerHTML = html;
    return container.content;
  } :
  (node, html) => {
    const container = create(node, 'template');
    const content = fragment(node);
    if (/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(html)) {
      const selector = RegExp.$1;
      container.innerHTML = '<table>' + html + '</table>';
      append(content, slice.call(container.querySelectorAll(selector)));
    } else {
      container.innerHTML = html;
      append(content, slice.call(container.childNodes));
    }
    return content;
  };

// creates SVG fragment with a fallback for IE that needs SVG
// within the HTML content
const SVGFragment = hasContent ?
  (node, html) => {
    const content = fragment(node);
    const container = doc(node).createElementNS(SVG_NAMESPACE, 'svg');
    container.innerHTML = html;
    append(content, slice.call(container.childNodes));
    return content;
  } :
  (node, html) => {
    const content = fragment(node);
    const container = create(node, 'div');
    container.innerHTML = '<svg xmlns="' + SVG_NAMESPACE + '">' + html + '</svg>';
    append(content, slice.call(container.firstChild.childNodes));
    return content;
  };
