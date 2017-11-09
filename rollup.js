var hyperHTML = (function (exports) {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

// Node.CONSTANTS (not every engine has Node)
const ELEMENT_NODE = 1;
var ELEMENT_NODE_1 = ELEMENT_NODE;
const ATTRIBUTE_NODE = 2;
var ATTRIBUTE_NODE_1 = ATTRIBUTE_NODE;
const TEXT_NODE = 3;
var TEXT_NODE_1 = TEXT_NODE;
const COMMENT_NODE = 8;
var COMMENT_NODE_1 = COMMENT_NODE;
const DOCUMENT_FRAGMENT_NODE = 11;
var DOCUMENT_FRAGMENT_NODE_1 = DOCUMENT_FRAGMENT_NODE;

// SVG related constants
const OWNER_SVG_ELEMENT = 'ownerSVGElement';
var OWNER_SVG_ELEMENT_1 = OWNER_SVG_ELEMENT;
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
var SVG_NAMESPACE_1 = SVG_NAMESPACE;

// Custom Elements / MutationObserver constants
const CONNECTED = 'connected';
var CONNECTED_1 = CONNECTED;
const DISCONNECTED = 'dis' + CONNECTED;
var DISCONNECTED_1 = DISCONNECTED;

// hyperHTML related constants
const SHOULD_USE_ATTRIBUTE = /^style$/i;
var SHOULD_USE_ATTRIBUTE_1 = SHOULD_USE_ATTRIBUTE;
const SHOULD_USE_TEXT_CONTENT = /^style|textarea$/i;
var SHOULD_USE_TEXT_CONTENT_1 = SHOULD_USE_TEXT_CONTENT;
const EXPANDO = '_hyper: ';
var EXPANDO_1 = EXPANDO;
const UID = EXPANDO + ((Math.random() * new Date) | 0) + ';';
var UID_1 = UID;
const UIDC = '<!--' + UID + '-->';
var UIDC_1 = UIDC;

var constants = {
	ELEMENT_NODE: ELEMENT_NODE_1,
	ATTRIBUTE_NODE: ATTRIBUTE_NODE_1,
	TEXT_NODE: TEXT_NODE_1,
	COMMENT_NODE: COMMENT_NODE_1,
	DOCUMENT_FRAGMENT_NODE: DOCUMENT_FRAGMENT_NODE_1,
	OWNER_SVG_ELEMENT: OWNER_SVG_ELEMENT_1,
	SVG_NAMESPACE: SVG_NAMESPACE_1,
	CONNECTED: CONNECTED_1,
	DISCONNECTED: DISCONNECTED_1,
	SHOULD_USE_ATTRIBUTE: SHOULD_USE_ATTRIBUTE_1,
	SHOULD_USE_TEXT_CONTENT: SHOULD_USE_TEXT_CONTENT_1,
	EXPANDO: EXPANDO_1,
	UID: UID_1,
	UIDC: UIDC_1
};

const {UID: UID$1} = constants;

let Event = commonjsGlobal.Event;
try {
  new Event('Event');
} catch(o_O) {
  Event = function (type) {
    const e = document.createEvent('Event');
    e.initEvent(type, false, false);
    return e;
  };
}
var Event_1 = Event;

const Map = commonjsGlobal.Map || function Map() {
  const keys = [], values = [];
  return {
    get(obj) {
      return values[keys.indexOf(obj)];
    },
    set(obj, value) {
      values[keys.push(obj) - 1] = value;
    }
  };
};
var Map_1 = Map;

const WeakMap = commonjsGlobal.WeakMap || function WeakMap() {
  return {
    delete(obj) { delete obj[UID$1]; },
    get(obj) { return obj[UID$1]; },
    has(obj) { return UID$1 in obj; },
    set(obj, value) {
      Object.defineProperty(obj, UID$1, {
        configurable: true,
        value
      });
    }
  };
};
var WeakMap_1 = WeakMap;

const WeakSet = commonjsGlobal.WeakSet || function WeakSet() {
  const wm = new WeakMap;
  return {
    add(obj) { wm.set(obj, true); },
    has(obj) { return wm.get(obj) === true; }
  };
};
var WeakSet_1 = WeakSet;

// TODO: which browser needs these partial polyfills here?
const isArray = Array.isArray || (toString =>
  arr => toString.call(arr) === '[object Array]'
)({}.toString);
var isArray_1 = isArray;

const trim = UID$1.trim || function () {
  return this.replace(/^\s+|\s+$/g, '');
};
var trim_1 = trim;

var poorlyfills = {
	Event: Event_1,
	Map: Map_1,
	WeakMap: WeakMap_1,
	WeakSet: WeakSet_1,
	isArray: isArray_1,
	trim: trim_1
};

const create = (node, type) => doc(node).createElement(type);
var create_1 = create;
const doc = node => node.ownerDocument || node;
var doc_1 = doc;
const fragment = node => doc(node).createDocumentFragment();
var fragment_1 = fragment;
const text = (node, text) => doc(node).createTextNode(text);
var text_1 = text;

var easyDom = {
	create: create_1,
	doc: doc_1,
	fragment: fragment_1,
	text: text_1
};

const {create: create$1, fragment: fragment$1, text: text$1} = easyDom;

const testFragment = fragment$1(document);

// DOM4 node.append(...many)
const hasAppend = 'append' in testFragment;
var hasAppend_1 = hasAppend;

// detect old browsers without HTMLTemplateElement content support
const hasContent = 'content' in create$1(document, 'template');
var hasContent_1 = hasContent;

// If attributes order is shuffled, threat the browser differently
// Usually this is a well known IE/Edge only issue but some older FF does the same.
const p = create$1(document, 'p');
p.innerHTML = '<i data-i="" class=""></i>';
const hasDoomedAttributes = /class/i.test(p.firstChild.attributes[0].name);
var hasDoomedAttributes_1 = hasDoomedAttributes;

// IE 11 has problems with cloning templates: it "forgets" empty childNodes
testFragment.appendChild(text$1(testFragment, 'g'));
testFragment.appendChild(text$1(testFragment, ''));
const hasDoomedCloneNode = testFragment.cloneNode(true).childNodes.length === 1;
var hasDoomedCloneNode_1 = hasDoomedCloneNode;

// old browsers need to fallback to cloneNode
// Custom Elements V0 and V1 will work polyfilled
const hasImportNode = 'importNode' in document;
var hasImportNode_1 = hasImportNode;

var featuresDetection = {
	hasAppend: hasAppend_1,
	hasContent: hasContent_1,
	hasDoomedAttributes: hasDoomedAttributes_1,
	hasDoomedCloneNode: hasDoomedCloneNode_1,
	hasImportNode: hasImportNode_1
};

var utils = createCommonjsModule(function (module, exports) {
const {
  OWNER_SVG_ELEMENT,
  SVG_NAMESPACE,
  UID,
  UIDC
} = constants;
const {hasAppend, hasContent, hasDoomedCloneNode, hasImportNode} = featuresDetection;
const {create, doc, fragment} = easyDom;

// appends an array of nodes
// to a generic node/fragment
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

// remove comments parts from attributes to avoid issues
// with either old browsers or SVG elements
// export const cleanAttributes = html => html.replace(no, comments);
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


const cloneNode = hasDoomedCloneNode ?
  node => {
    const clone = node.cloneNode();
    const childNodes = node.childNodes || [];
    const length = childNodes.length;
    for (let i = 0; i < length; i++) {
      clone.appendChild(cloneNode(childNodes[i]));
    }
    return clone;
  } :
  node => node.cloneNode(true);
exports.cloneNode = cloneNode;

const createFragment = (node, html) =>
  (OWNER_SVG_ELEMENT in node ?
    SVGFragment :
    HTMLFragment
  )(node, html.replace(no, comments));
exports.createFragment = createFragment;

const importNode = hasImportNode ?
  (doc, node) => doc.importNode(node, true) :
  (doc, node) => cloneNode(node);
exports.importNode = importNode;

const slice = [].slice;
exports.slice = slice;

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
      /Firefox\/(\d+)/.test((commonjsGlobal.navigator || {}).userAgent) &&
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
});

var utils_1 = utils.append;
var utils_2 = utils.cloneNode;
var utils_3 = utils.createFragment;
var utils_4 = utils.importNode;
var utils_5 = utils.slice;
var utils_6 = utils.unique;
var utils_7 = utils.HTMLFragment;
var utils_8 = utils.SVGFragment;

/*! Copyright (c) 2017, Andrea Giammarchi, @WebReflection */

// grid operations
const DELETE = 'del';
const INSERT = 'ins';
const SUBSTITUTE = 'sub';

// typed Array
const TypedArray = global.Int32Array || Array;

const majinbuu = (from, to, MAX_SIZE) => {

  const fromLength = from.length;
  const toLength = to.length;
  const TOO_MANY = (MAX_SIZE || Infinity) < Math.sqrt((fromLength || 1) * (toLength || 1));

  if (fromLength < 1 || TOO_MANY) {
    if (toLength || TOO_MANY) {
      from.splice.apply(from, [0, fromLength].concat(to));
    }
    return;
  }
  if (toLength < 1) {
    from.splice(0);
    return;
  }
  performOperations(
    from,
    getOperations(from, to, levenstein(from, to))
  );
}; 

// given an object that would like to intercept
// all splice operations performed through a list,
// wraps the list.splice method to delegate such object
// and it puts back original splice right before every invocation.
// Note: do not use the same list in two different aura
const aura = (splicer, list) => {
  const splice = list.splice;
  function $splice() {
    list.splice = splice;
    const result = splicer.splice.apply(splicer, arguments);
    list.splice = $splice;
    return result;
  }
  list.splice = $splice;
  return list;
};

// Helpers - - - - - - - - - - - - - - - - - - - - - -

// originally readapted from:
// http://webreflection.blogspot.co.uk/2009/02/levenshtein-algorithm-revisited-25.html
// then rewritten in C for Emscripten (see levenstein.c)
// then "screw you ASM" due no much gain but very bloated code
const levenstein = (from, to) => {
  const fromLength = from.length + 1;
  const toLength = to.length + 1;
  const size = fromLength * toLength;
  const grid = new TypedArray(size);
  let x = 0;
  let y = 0;
  let X = 0;
  let Y = 0;
  let crow = 0;
  let prow = 0;
  let del, ins, sub;
  grid[0] = 0;
  while (++x < toLength) grid[x] = x;
  while (++y < fromLength) {
    X = x = 0;
    prow = crow;
    crow = y * toLength;
    grid[crow + x] = y;
    while (++x < toLength) {
      del = grid[prow + x] + 1;
      ins = grid[crow + X] + 1;
      sub = grid[prow + X] + (from[Y] == to[X] ? 0 : 1);
      grid[crow + x] = del < ins ?
                        (del < sub ?
                          del : sub) :
                        (ins < sub ?
                          ins : sub);
      ++X;
    }
    Y = y;
  }
  return grid;
};

// add operations (in reversed order)
const addOperation = (list, type, x, y, count, items) => {
  list.unshift({type, x, y, count, items});
};

// walk the Levenshtein grid bottom -> up
const getOperations = (Y, X, grid) => {
  const list = [];
  const YL = Y.length + 1;
  const XL = X.length + 1;
  let y = YL - 1;
  let x = XL - 1;
  let cell,
      top, left, diagonal,
      crow, prow;
  while (x && y) {
    crow = y * XL + x;
    prow = crow - XL;
    cell = grid[crow];
    top = grid[prow];
    left = grid[crow - 1];
    diagonal = grid[prow - 1];
    if (diagonal <= left && diagonal <= top && diagonal <= cell) {
      x--;
      y--;
      if (diagonal < cell) {
        addOperation(list, SUBSTITUTE, x, y, 1, [X[x]]);
      }
    }
    else if (left <= top && left <= cell) {
      x--;
      addOperation(list, INSERT, x, y, 0, [X[x]]);
    }
    else {
      y--;
      addOperation(list, DELETE, x, y, 1, []);
    }
  }
  while (x--) {
    addOperation(list, INSERT, x, y, 0, [X[x]]);
  }
  while (y--) {
    addOperation(list, DELETE, x, y, 1, []);
  }
  return list;
};

/* grouped operations */
const performOperations = (target, operations) => {
  const length = operations.length;
  let diff = 0;
  let i = 1;
  let curr, prev, op;
  if (length) {
    op = (prev = operations[0]);
    while (i < length) {
      curr = operations[i++];
      if (prev.type === curr.type && (curr.x - prev.x) <= 1 && (curr.y - prev.y) <= 1) {
        op.count += curr.count;
        op.items = op.items.concat(curr.items);
      } else {
        target.splice.apply(target, [op.y + diff, op.count].concat(op.items));
        diff += op.type === INSERT ?
          op.items.length : (op.type === DELETE ?
            -op.count : 0);
        op = curr;
      }
      prev = curr;
    }
    target.splice.apply(target, [op.y + diff, op.count].concat(op.items));
  }
};

majinbuu.aura = aura;




var main$2 = Object.freeze({
	default: majinbuu,
	aura: aura,
	majinbuu: majinbuu
});

var require$$0$1 = ( main$2 && majinbuu ) || main$2;

var Aura_1 = createCommonjsModule(function (module, exports) {
const majinbuu = (m => m.__esModule ? m.default : m)(require$$0$1);

// used as class but it returns a modified childNodes
// it's not worth to use Babel class transpilation
// for an utility facade with a context for convenience
function Aura(node, childNodes) {
  this.node = node;
  this.childNodes = childNodes;
  childNodes.become = become;
  return majinbuu.aura(this, childNodes);
}

// reflected through hyperHTML.MAX_LIST_SIZE
Aura.MAX_LIST_SIZE = 999;

// wraps childNodes splice to pass through the Aura
Aura.prototype.splice = function splice() {
  const ph = this.node;
  const cn = this.childNodes;
  const target = cn[arguments[0] + (arguments[1] || 0)] || ph;
  const result = cn.splice.apply(cn, arguments);
  const pn = ph.parentNode;
  const doc = pn.ownerDocument;
  for (let tmp, i = 0, length = result.length; i < length; i++) {
    tmp = result[i];
    // TODO: this is not optimal (but necessary)
    if (cn.indexOf(tmp) < 0) {
      pn.removeChild(tmp);
    }
  }
  for (let tmp, i = 2, length = arguments.length; i < length; pn.insertBefore(tmp, target)) {
    if ((length - i) === 1) {
      tmp = arguments[i++];
    } else {
      tmp = doc.createDocumentFragment();
      while (i < length) {
        tmp.appendChild(arguments[i++]);
      }
    }
  }
  return result;
};

function become(value) {
  let i = 0, length = this.length;
  if (value.length !== length) {
    majinbuu(this, value, Aura.MAX_LIST_SIZE);
  } else {
    for (; i < length--; i++) {
      if (this[length] !== value[length] || this[i] !== value[i]) {
        majinbuu(this, value, Aura.MAX_LIST_SIZE);
        return;
      }
    }
  }
}

Object.defineProperty(exports, '__esModule', {value: true}).default = Aura;
});

unwrapExports(Aura_1);

var Path = createCommonjsModule(function (module, exports) {
const {
  ATTRIBUTE_NODE,
  COMMENT_NODE,
  DOCUMENT_FRAGMENT_NODE,
  ELEMENT_NODE
} = constants;

// always use childNodes
// as it turned out retrieving them
// is just as fast as retrieving children
// if not faster (it also makes sense)
// https://jsperf.com/child-ren-nodes/1
const prepend = (path, parent, node) => {
  path.unshift(
    'childNodes',
    path.indexOf.call(parent.childNodes, node)
  );
};

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
      prepend(path, parentNode, node);
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
    prepend(path, parentNode, node);
  }
  return path;
};

Object.defineProperty(exports, '__esModule', {value: true}).default = {
  create: (type, node, name) => ({type, name, path: createPath(node)}),
  find: (node, path) => {
    const length = path.length;
    for (let i = 0; i < length; i++) {
      let key = path[i++];
      node = key === 'attributes' ?
        node.ownerDocument.createAttribute(path[i]) :
        node[key][path[i]];
    }
    return node;
  }
};
});

unwrapExports(Path);

var Transformer = createCommonjsModule(function (module, exports) {
const transformers = {};
const transformersKeys = [];
const hasOwnProperty = transformers.hasOwnProperty;

let length = 0;

Object.defineProperty(exports, '__esModule', {value: true}).default = {
  define: (transformer, callback) => {
    if (!(transformer in transformers)) {
      length = transformersKeys.push(transformer);
    }
    transformers[transformer] = callback;
  },
  invoke: (object, callback) => {
    for (let i = 0; i < length; i++) {
      let key = transformersKeys[i];
      if (hasOwnProperty.call(object, key)) {
        return transformers[key](object[key], callback);
      }
    }
  }
};
});

unwrapExports(Transformer);

var Updates = createCommonjsModule(function (module, exports) {
const majinbuu = (m => m.__esModule ? m.default : m)(require$$0$1);

const {
  CONNECTED, DISCONNECTED, COMMENT_NODE, DOCUMENT_FRAGMENT_NODE, ELEMENT_NODE, TEXT_NODE, OWNER_SVG_ELEMENT, SHOULD_USE_ATTRIBUTE, SHOULD_USE_TEXT_CONTENT, UID, UIDC
} = constants;

const Aura = (m => m.__esModule ? m.default : m)(Aura_1);
const Component = (m => m.__esModule ? m.default : m)(Component_1);
const Path$$1 = (m => m.__esModule ? m.default : m)(Path);
const Transformer$$1 = (m => m.__esModule ? m.default : m)(Transformer);
const {text} = easyDom;
const {isArray, trim, WeakSet} = poorlyfills;
const {createFragment} = utils;

const Promise = commonjsGlobal.Promise;
const components = new WeakSet;
const slice = [].slice;

const create = (root, paths) => {
  const updates = [];
  const length = paths.length;
  for (let i = 0; i < length; i++) {
    const info = paths[i];
    const node = Path$$1.find(root, info.path);
    switch (info.type) {
      case 'any':
        updates.push(setAnyContent(node, []));
        break;
      case 'attr':
        updates.push(setAttribute(node, info.name));
        break;
      case 'text':
        updates.push(setTextContent(node));
        break;
    }
  }
  return updates;
};

const find = (node, paths, parts) => {
  const childNodes = node.childNodes;
  const length = childNodes.length;
  for (let i = 0; i < length; i++) {
    let child = childNodes[i];
    switch (child.nodeType) {
      case ELEMENT_NODE:
        findAttributes(child, paths, parts);
        find(child, paths, parts);
        break;
      case COMMENT_NODE:
        if (child.textContent === UID) {
          parts.shift();
          paths.push(Path$$1.create('any', child));
        }
        break;
      case TEXT_NODE:
        if (
          SHOULD_USE_TEXT_CONTENT.test(node.nodeName) &&
          trim.call(child.textContent) === UIDC
        ) {
          parts.shift();
          paths.push(Path$$1.create('text', node));
        }
        break;
    }
  }
};

function Cache() {}
Cache.prototype = Object.create(null);

const findAttributes = (node, paths, parts) => {
  const cache = new Cache;
  const attributes = node.attributes;
  const array = slice.call(attributes);
  const length = array.length;
  for (let i = 0; i < length; i++) {
    const attribute = array[i];
    if (attribute.value === UID) {
      const name = attribute.name;
      if (!(name in cache)) {
        const realName = parts.shift().replace(/^(?:|[\S\s]*?\s)(\S+?)=['"]?$/, '$1');
        cache[name] = attributes[realName] ||
                      attributes[realName.toLowerCase()];
        paths.push(Path$$1.create('attr', cache[name], realName));
      }
      node.removeAttributeNode(attribute);
    }
  }
};

const setAnyContent = (node, childNodes) => {
  const aura = new Aura(node, childNodes);
  let oldValue;
  const anyContent = value => {
    switch (typeof value) {
      case 'string':
      case 'number':
      case 'boolean':
        let length = childNodes.length;
        if (
          length === 1 &&
          childNodes[0].nodeType === TEXT_NODE
        ) {
          if (oldValue !== value) {
            oldValue = value;
            childNodes[0].textContent = value;
          }
        } else {
          oldValue = value;
          if (length) {
            aura.splice(0, length, text(node, value));
          } else {
            node.parentNode.insertBefore(
              (childNodes[0] = text(node, value)),
              node
            );
          }
        }
        break;
      case 'object':
      case 'undefined':
        if (value == null) {
          oldValue = value;
          anyContent('');
          break;
        } else if (value instanceof Component) {
          value = value.render();
        }
      default:
        oldValue = value;
        if (isArray(value)) {
          if (value.length === 0) {
            aura.splice(0);
          } else {
            switch (typeof value[0]) {
              case 'string':
              case 'number':
              case 'boolean':
                anyContent({html: value});
                break;
              case 'object':
                if (isArray(value[0])) {
                  value = value.concat.apply([], value);
                }
                if (isPromise_ish(value[0])) {
                  Promise.all(value).then(anyContent);
                  break;
                } else {
                  for (let i = 0, length = value.length; i < length; i++) {
                    if (value[i] instanceof Component) {
                      value[i] = value[i].render();
                    }
                  }
                }
              default:
                optimist(aura, value);
                break;
            }
          }
        } else if (isNode_ish(value)) {
          optimist(
            aura,
            value.nodeType === DOCUMENT_FRAGMENT_NODE ?
              slice.call(value.childNodes) :
              [value]
          );
        } else if (isPromise_ish(value)) {
          value.then(anyContent);
        } else if ('placeholder' in value) {
          invokeAtDistance(value, anyContent);
        } else if ('text' in value) {
          anyContent(String(value.text));
        } else if ('any' in value) {
          anyContent(value.any);
        } else if ('html' in value) {
          aura.splice(0);
          const fragment = createFragment(node, [].concat(value.html).join(''));
          childNodes.push.apply(childNodes, fragment.childNodes);
          node.parentNode.insertBefore(fragment, node);
        } else if ('length' in value) {
          anyContent(slice.call(value));
        } else {
          anyContent(Transformer$$1.invoke(value, anyContent));
        }
        break;
    }
  };
  return anyContent;
};

const asHTML = html => ({html});

const isNode_ish = value => 'ELEMENT_NODE' in value;
const isPromise_ish = value => value != null && 'then' in value;

const invokeAtDistance = (value, callback) => {
  callback(value.placeholder);
  if ('text' in value) {
    Promise.resolve(value.text).then(String).then(callback);
  } else if ('any' in value) {
    Promise.resolve(value.any).then(callback);
  } else if ('html' in value) {
    Promise.resolve(value.html).then(asHTML).then(callback);
  } else {
    Promise.resolve(Transformer$$1.invoke(value, callback)).then(callback);
  }
};

const isSpecialAttribute = (node, name) =>
                            !(OWNER_SVG_ELEMENT in node) && name in node;
const setAttribute = (attribute, name) => {
  const node = attribute.ownerElement;
  const isData = name === 'data';
  const isEvent = !isData && /^on/.test(name);
  const isSpecial = isData ||
                    (isSpecialAttribute(node, name) &&
                    !SHOULD_USE_ATTRIBUTE.test(name));
  let noOwner = isSpecial || isEvent;
  let oldValue, type;
  if (isEvent) {
    type = name.slice(2);
    if (type === CONNECTED || type === DISCONNECTED) {
      components.add(node);
    }
    else if (name.toLowerCase() in node) {
      type = type.toLowerCase();
    }
  }
  if (!noOwner) node.setAttributeNode(attribute);
  return isEvent ?
    newValue => {
      if (oldValue !== newValue) {
        if (oldValue) node.removeEventListener(type, oldValue, false);
        oldValue = newValue;
        if (newValue) node.addEventListener(type, newValue, false);
      }
    } :
    (isSpecial ?
      newValue => {
        if (oldValue !== newValue) {
          oldValue = newValue;
          if (node[name] !== newValue) {
            node[name] = newValue;
          }
        }
      } :
      newValue => {
        if (oldValue !== newValue) {
          oldValue = newValue;
          if (attribute.value !== newValue) {
            if (newValue == null) {
              if (!noOwner) {
                noOwner = true;
                node.removeAttributeNode(attribute);
              }
            } else {
              attribute.value = newValue;
              if (noOwner) {
                noOwner = false;
                node.setAttributeNode(attribute);
              }
            }
          }
        }
      });
};

const optimist = (aura, value) => {
  let length = aura.length;
  if (value.length !== length) {
    majinbuu(aura, value, Aura.MAX_LIST_SIZE);
  } else {
    for (let i = 0; i < length--; i++) {
      if (aura[length] !== value[length] || aura[i] !== value[i]) {
        majinbuu(aura, value, Aura.MAX_LIST_SIZE);
        return;
      }
    }
  }
};

const setTextContent = node => {
  let oldValue;
  return newValue => {
    if (oldValue !== newValue)
      node.textContent = (oldValue = newValue);
  };
};

Object.defineProperty(exports, '__esModule', {value: true}).default = {create, find};
});

unwrapExports(Updates);

var render_1 = createCommonjsModule(function (module, exports) {
const {UIDC} = constants;
const {Map, WeakMap} = poorlyfills;
const Updates$$1 = (m => m.__esModule ? m.default : m)(Updates);
const {
  createFragment,
  importNode,
  unique
} = utils;

const bewitched = new WeakMap;
const templates = new Map;

function render(template) {
  const wicked = bewitched.get(this);
  if (wicked && wicked.template === unique(template)) {
    update.apply(wicked.updates, arguments);
  } else {
    upgrade.apply(this, arguments);
  }
  return this;
}

function upgrade(template) {
  template = unique(template);
  const info =  templates.get(template) ||
                createTemplate.call(this, template);
  const fragment = importNode(this.ownerDocument, info.fragment);
  const updates = Updates$$1.create(fragment, info.paths);
  bewitched.set(this, {template, updates});
  update.apply(updates, arguments);
  this.textContent = '';
  this.appendChild(fragment);
}

function update() {
  const length = arguments.length;
  for (let i = 1; i < length; i++) {
    this[i - 1](arguments[i]);
  }
}

function createTemplate(template) {
  const paths = [];
  const fragment = createFragment(this, template.join(UIDC));
  Updates$$1.find(fragment, paths, template.slice());
  const info = {fragment, paths};
  templates.set(template, info);
  return info;
}

Object.defineProperty(exports, '__esModule', {value: true}).default = render;
});

unwrapExports(render_1);

var wire_1 = createCommonjsModule(function (module, exports) {
const {ELEMENT_NODE, SVG_NAMESPACE} = constants;
const {WeakMap, trim} = poorlyfills;
const {fragment} = easyDom;
const {append, slice, unique} = utils;
const render = (m => m.__esModule ? m.default : m)(render_1);

const wires = new WeakMap;

const wire = (obj, type) => obj == null ?
  content(type || 'html') :
  weakly(obj, type || 'html');

const content = type => {
  let wire, container, content, template, updates;
  return function (statics) {
    statics = unique(statics);
    let setup = template !== statics;
    if (setup) {
      template = statics;
      content = fragment(document);
      container = type === 'svg' ?
        document.createElementNS(SVG_NAMESPACE, 'svg') :
        content;
      updates = render.bind(container);
    }
    updates.apply(null, arguments);
    if (setup) {
      if (type === 'svg') {
        append(content, slice.call(container.childNodes));
      }
      wire = wireContent(content);
    }
    return wire;
  };
};

const weakly = (obj, type) => {
  const i = type.indexOf(':');
  let wire = wires.get(obj);
  let id = type;
  if (-1 < i) {
    id = type.slice(i + 1);
    type = type.slice(0, i) || 'html';
  }
  if (!wire) wires.set(obj, wire = {});
  return wire[id] || (wire[id] = content(type));
};

const wireContent = node => {
  const childNodes = node.childNodes;
  const length = childNodes.length;
  const wire = [];
  for (let i = 0; i < length; i++) {
    let child = childNodes[i];
    if (
      child.nodeType === ELEMENT_NODE ||
      trim.call(child.textContent).length !== 0
    ) {
      wire.push(child);
    }
  }
  return wire.length === 1 ? wire[0] : wire;
};

exports.content = content;
exports.weakly = weakly;
Object.defineProperty(exports, '__esModule', {value: true}).default = wire;
});

unwrapExports(wire_1);
var wire_2 = wire_1.content;
var wire_3 = wire_1.weakly;

var Component_1 = createCommonjsModule(function (module, exports) {
const {content} = wire_1;

const lazyGetter = (type, fn) => {
  const secret = '_' + type + '$';
  return {
    get() {
      return this[secret] || (this[type] = fn.call(this, type));
    },
    set(value) {
      Object.defineProperty(this, secret, {configurable: true, value});
    }
  };
};

// no need for a transpiled class here
// Component needs lazy prototype accessors.
// Using modern syntax to define it won't be enough
function Component() {}
Object.defineProperties(
  Component.prototype,
  {
    // same as HyperHTMLElement handleEvent
    handleEvent: {value(e) {
      // both IE < 11 and JSDOM lack dataset
      const ct = e.currentTarget;
      this[
        ('getAttribute' in ct && ct.getAttribute('data-call')) ||
        ('on' + e.type)
      ](e);
    }},
    // returns its own HTML wire or create it once on comp.render()
    html: lazyGetter('html', content),
    // returns its own SVG wire or create it once on comp.render()
    svg: lazyGetter('svg', content),
    // same as HyperHTMLElement state
    state: lazyGetter('state', function () { return this.defaultState; }),
    // same as HyperHTMLElement get defaultState
    defaultState: {get() { return {}; }},
    // same as HyperHTMLElement setState
    setState: {value(state) {
      const target = this.state;
      const source = typeof state === 'function' ? state.call(this, target) : state;
      for (const key in source) target[key] = source[key];
      this.render();
    }}
    // the render must be defined when extending hyper.Component
    // the render **must** return either comp.html or comp.svg wire
    // render() { return this.html`<p>that's it</p>`; }
  }
);

Object.defineProperty(exports, '__esModule', {value: true}).default = Component;
});

unwrapExports(Component_1);

var main = createCommonjsModule(function (module, exports) {
const Component = (m => m.__esModule ? m.default : m)(Component_1);
const Transformer$$1 = (m => m.__esModule ? m.default : m)(Transformer);
const wire = (m => m.__esModule ? m.default : m)(wire_1);
const {content, weakly} = wire_1;
const render = (m => m.__esModule ? m.default : m)(render_1);

const bind = (hyper.bind = context => render.bind(context));
const define = (hyper.define = Transformer$$1.define);

// it couldn't be more!
hyper.hyper = hyper;
hyper.wire = wire;

exports.Component = Component;
exports.bind = bind;
exports.define = define;
exports.hyper = hyper;
exports.wire = wire;

function hyper(HTML) {
  return arguments.length < 2 ?
    (HTML == null ?
      content('html') :
      (typeof HTML === 'string' ?
        wire(null, HTML) :
        ('raw' in HTML ?
          content('html')(HTML) :
          ('nodeType' in HTML ?
            bind(HTML) :
            weakly(HTML, 'html')
          )
        )
      )) :
    ('raw' in HTML ?
      content('html') : wire
    ).apply(null, arguments);
}
Object.defineProperty(exports, '__esModule', {value: true}).default = hyper;
});

var main$1 = unwrapExports(main);
var main_1 = main.Component;
var main_2 = main.bind;
var main_3 = main.define;
var main_4 = main.hyper;
var main_5 = main.wire;

exports['default'] = main$1;
exports.Component = main_1;
exports.bind = main_2;
exports.define = main_3;
exports.hyper = main_4;
exports.wire = main_5;

return exports;

}({}));
