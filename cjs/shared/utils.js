'use strict';
const {ELEMENT_NODE, SVG_NAMESPACE, UID, UIDC} = require('./constants.js');
const {hasAppend, hasChildren, hasContent} = require('./features-detection.js');
const {create, doc, fragment} = require('./easy-dom.js');

const slice = [].slice;

// appends an array of nodes
// to a generic node/fragment
const append = hasAppend ?
  (node, childNodes) => {
    node.append(...childNodes);
  } :
  (node, childNodes) => {
    const length = childNodes.length;
    for (let i = 0; i < length; i++) {
      node.appendChild(childNodes[i]);
    }
  };
exports.append = append;

// given a node/fragment, returns its children
const children = hasChildren ?
  node => node.children :
  node => {
    const children = [];
    const childNodes = node.childNodes;
    const length = childNodes.length;
    for (let j = 0, i = 0; i < length; i++) {
      const child = childNodes[i];
      if (child.nodeType === ELEMENT_NODE) {
        children[j++] = child;
      }
    }
    return children;
  };
exports.children = children;

// remove comments parts from attributes to avoid issues
// with either old browsers or SVG elements
const cleanAttributes = html => html.replace(no, comments);
exports.cleanAttributes = cleanAttributes;
const attrName = '[^\\S]+[^ \\f\\n\\r\\t\\/>"\'=]+';
const no = new RegExp(
  '(<[a-z]+[a-z0-9:_-]*)((?:' +
    attrName +
  '(?:=(?:\'.*?\'|".*?"|<.+?>|\\S+))?)+)([^\\S]*/?>)',
  'gi'
);
const findAttributes = new RegExp('(' + attrName + '=)([\'"]?)' + UIDC + '\\2', 'gi');
const comments = ($0, $1, $2, $3) =>
  $1 + $2.replace(findAttributes, replaceAttributes) + $3;
const replaceAttributes = ($0, $1, $2) => $1 + ($2 || '"') + UID + ($2 || '"');

// given a node/fragment and a path
// returns the target path, if any
const node = hasChildren ?
  (parentNode, path) => {
    const length = path.length;
    for (let i = 0; i < length; i++) {
      parentNode = parentNode[path[i++]][path[i]];
    }
    return parentNode;
  } :
  (parentNode, path) => {
    const length = path.length;
    for (let i = 0; i < length; i++) {
      let name = path[i++];
      parentNode = name === 'children' ?
        children(parentNode)[path[i]] :
        parentNode[name][path[i]];
    }
    return parentNode;
  };
exports.node = node;

// lazy evaluated
const unique = template => TL(template);
exports.unique = unique;
// TL returns a unique version of the template
// it needs lazy feature detection
// (cannot trust literals with transpiled code)
let TL = template => {
  if (
    // TypeScript template literals are not standard
    template.propertyIsEnumerable('raw') ||
    (
      // Firefox < 55 has not standard implementation neither
      /Firefox\/(\d+)/.test((global.navigator || {}).userAgent) &&
      parseFloat(RegExp.$1) < 55
    )
  ) {
    // in these cases, address templates once
    const templateObjects = {};
    // but always return the same template
    TL = template => {
      const key = '_' + template.join(UID);
      return templateObjects[key] || (
        templateObjects[key] = template
      );
    };
  }
  else {
    // make TL an identity like function
    TL = template => template;
  }
  return TL(template);
};

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
exports.HTMLFragment = HTMLFragment;

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
exports.SVGFragment = SVGFragment;
