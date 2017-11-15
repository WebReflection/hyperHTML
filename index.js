var hyperHTML = (function (global) {
'use strict';

/*! Copyright (c) 2017, Andrea Giammarchi, @WebReflection */

// grid operations
var DELETE = 'del';
var INSERT = 'ins';
var SUBSTITUTE = 'sub';

// typed Array
var TypedArray = global.Int32Array || Array;

var majinbuu = function majinbuu(from, to, MAX_SIZE) {

  var fromLength = from.length;
  var toLength = to.length;
  var TOO_MANY = (MAX_SIZE || Infinity) < Math.sqrt((fromLength || 1) * (toLength || 1));

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
  performOperations(from, getOperations(from, to, levenstein(from, to)));
};

// given an object that would like to intercept
// all splice operations performed through a list,
// wraps the list.splice method to delegate such object
// and it puts back original splice right before every invocation.
// Note: do not use the same list in two different aura
var aura = function aura(splicer, list) {
  var splice = list.splice;
  function $splice() {
    list.splice = splice;
    var result = splicer.splice.apply(splicer, arguments);
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
var levenstein = function levenstein(from, to) {
  var fromLength = from.length + 1;
  var toLength = to.length + 1;
  var size = fromLength * toLength;
  var grid = new TypedArray(size);
  var x = 0;
  var y = 0;
  var X = 0;
  var Y = 0;
  var crow = 0;
  var prow = 0;
  var del = void 0,
      ins = void 0,
      sub = void 0;
  grid[0] = 0;
  while (++x < toLength) {
    grid[x] = x;
  }while (++y < fromLength) {
    X = x = 0;
    prow = crow;
    crow = y * toLength;
    grid[crow + x] = y;
    while (++x < toLength) {
      del = grid[prow + x] + 1;
      ins = grid[crow + X] + 1;
      sub = grid[prow + X] + (from[Y] == to[X] ? 0 : 1);
      grid[crow + x] = del < ins ? del < sub ? del : sub : ins < sub ? ins : sub;
      ++X;
    }
    Y = y;
  }
  return grid;
};

// add operations (in reversed order)
var addOperation = function addOperation(list, type, x, y, count, items) {
  list.unshift({ type: type, x: x, y: y, count: count, items: items });
};

// walk the Levenshtein grid bottom -> up
var getOperations = function getOperations(Y, X, grid) {
  var list = [];
  var YL = Y.length + 1;
  var XL = X.length + 1;
  var y = YL - 1;
  var x = XL - 1;
  var cell = void 0,
      top = void 0,
      left = void 0,
      diagonal = void 0,
      crow = void 0,
      prow = void 0;
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
    } else if (left <= top && left <= cell) {
      x--;
      addOperation(list, INSERT, x, y, 0, [X[x]]);
    } else {
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
var performOperations = function performOperations(target, operations) {
  var length = operations.length;
  var diff = 0;
  var i = 1;
  var curr = void 0,
      prev = void 0,
      op = void 0;
  if (length) {
    op = prev = operations[0];
    while (i < length) {
      curr = operations[i++];
      if (prev.type === curr.type && curr.x - prev.x <= 1 && curr.y - prev.y <= 1) {
        op.count += curr.count;
        op.items = op.items.concat(curr.items);
      } else {
        target.splice.apply(target, [op.y + diff, op.count].concat(op.items));
        diff += op.type === INSERT ? op.items.length : op.type === DELETE ? -op.count : 0;
        op = curr;
      }
      prev = curr;
    }
    target.splice.apply(target, [op.y + diff, op.count].concat(op.items));
  }
};

majinbuu.aura = aura;

// hyperHTML.Component is a very basic class
// able to create Custom Elements like components
// including the ability to listen to connect/disconnect
// events via onconnect/ondisconnect attributes
function Component() {}

// components will lazily define html or svg properties
// as soon as these are invoked within the .render() method
// Such render() method is not provided by the base class
// but it must be available through the Component extend.
function setup(content) {
  Object.defineProperties(Component.prototype, {
    handleEvent: {
      value: function value(e) {
        var ct = e.currentTarget;
        this['getAttribute' in ct && ct.getAttribute('data-call') || 'on' + e.type](e);
      }
    },
    html: lazyGetter('html', content),
    svg: lazyGetter('svg', content),
    state: lazyGetter('state', function () {
      return this.defaultState;
    }),
    defaultState: {
      get: function get() {
        return {};
      }
    },
    setState: {
      value: function value(state) {
        var target = this.state;
        var source = typeof state === 'function' ? state.call(this, target) : state;
        for (var key in source) {
          target[key] = source[key];
        }this.render();
      }
    }
  });
}

// instead of a secret key I could've used a WeakMap
// However, attaching a property directly will result
// into better performance with thousands of components
// hanging around, and less memory pressure caused by the WeakMap
var lazyGetter = function lazyGetter(type, fn) {
  var secret = '_' + type + '$';
  return {
    get: function get() {
      return this[secret] || (this[type] = fn.call(this, type));
    },
    set: function set(value) {
      Object.defineProperty(this, secret, { configurable: true, value: value });
    }
  };
};

// these are tiny helpers to simplify most common operations needed here
var create = function create(node, type) {
  return doc(node).createElement(type);
};
var doc = function doc(node) {
  return node.ownerDocument || node;
};
var fragment = function fragment(node) {
  return doc(node).createDocumentFragment();
};
var text = function text(node, _text) {
  return doc(node).createTextNode(_text);
};

// Node.CONSTANTS (not every engine has a global Node defined)
var ELEMENT_NODE = 1;

var TEXT_NODE = 3;
var COMMENT_NODE = 8;
var DOCUMENT_FRAGMENT_NODE = 11;

// SVG related constants
var OWNER_SVG_ELEMENT = 'ownerSVGElement';
var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

// Custom Elements / MutationObserver constants
var CONNECTED = 'connected';
var DISCONNECTED = 'dis' + CONNECTED;

// hyperHTML related constants
var EXPANDO = '_hyper: ';
var SHOULD_USE_TEXT_CONTENT = /^style|textarea$/i;
var UID = EXPANDO + (Math.random() * new Date() | 0) + ';';
var UIDC = '<!--' + UID + '-->';

// same as https://github.com/developit/preact/blob/33fc697ac11762a1cb6e71e9847670d047af7ce5/src/constants.js
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

// you know that kind of basics you need to cover
// your use case only but you don't want to bloat the library?
// There's even a package in here:
// https://www.npmjs.com/package/poorlyfills

// used to dispatch simple events
var Event = global.Event;
try {
  new Event('Event');
} catch (o_O) {
  Event = function Event(type) {
    var e = document.createEvent('Event');
    e.initEvent(type, false, false);
    return e;
  };
}
// used to store template literals
var Map = global.Map || function Map() {
  var keys = [],
      values = [];
  return {
    get: function get(obj) {
      return values[keys.indexOf(obj)];
    },
    set: function set(obj, value) {
      values[keys.push(obj) - 1] = value;
    }
  };
};

// used to store wired content
var WeakMap = global.WeakMap || function WeakMap() {
  return {
    get: function get(obj) {
      return obj[UID];
    },
    set: function set(obj, value) {
      Object.defineProperty(obj, UID, {
        configurable: true,
        value: value
      });
    }
  };
};

// used to store hyper.Components
var WeakSet = global.WeakSet || function WeakSet() {
  var wm = new WeakMap();
  return {
    add: function add(obj) {
      wm.set(obj, true);
    },
    has: function has(obj) {
      return wm.get(obj) === true;
    }
  };
};

// used to be sure IE9 or older Androids work as expected
var isArray = Array.isArray || function (toString) {
  return function (arr) {
    return toString.call(arr) === '[object Array]';
  };
}({}.toString);

var trim = UID.trim || function () {
  return this.replace(/^\s+|\s+$/g, '');
};

// this class has one purpose:
// provide a splice method shared
// between all instances
function Aura(node, childNodes) {
  this.node = node;
  this.childNodes = childNodes;
  return majinbuu.aura(this, childNodes);
}

// majinbuu is fast but exponentially inefficient
// if you are handling thousands of items (which you shouldn't)
// calculating their diff might be too expensive.
// Let's use raw DOM when list of items is 1K+
Aura.MAX_LIST_SIZE = 999;

// the splice is in charge of removing or adding nodes
Aura.prototype.splice = function splice(start, end) {
  var values = new Map();
  var ph = this.node;
  var cn = this.childNodes;
  var target = get(values, cn[start + (end || 0)] || ph);
  var result = cn.splice.apply(cn, arguments);
  var pn = ph.parentNode;
  var reLength = result.length;
  for (var i = 0; i < reLength; i++) {
    var tmp = result[i];
    if (cn.indexOf(tmp) < 0) {
      pn.removeChild(get(values, tmp));
    }
  }
  var arLength = arguments.length;
  if (3 === arLength) {
    pn.insertBefore(get(values, arguments[2]), target);
  } else if (2 < arLength) {
    var _tmp = fragment(pn);
    for (var _i = 2; _i < arLength; _i++) {
      _tmp.appendChild(get(values, arguments[_i]));
    }
    pn.insertBefore(_tmp, target);
  }
  return result;
};

// an item could be an hyperHTML.Component and, in such case,
// it should be rendered as node
var asNode = function asNode(node) {
  return node instanceof Component ? node.render() : node;
};

// instead of checking instanceof each time and render potentially twice
// use a map to retrieve nodes from a generic item
var get = function get(map, node) {
  return map.get(node) || set(map, node);
};
var set = function set(map, node) {
  var value = asNode(node);
  map.set(node, value);
  return value;
};

var transformers = {};
var transformersKeys = [];
var hasOwnProperty = transformers.hasOwnProperty;

var length = 0;

// hyperHTML.define('intent', (object, update) => {...})
// can be used to define a third parts update mechanism
// when every other known mechanism failed.
// hyper.define('user', info => info.name);
// hyper(node)`<p>${{user}}</p>`;
var Transformer = {
  define: function define(transformer, callback) {
    if (!(transformer in transformers)) {
      length = transformersKeys.push(transformer);
    }
    transformers[transformer] = callback;
  },
  invoke: function invoke(object, callback) {
    for (var i = 0; i < length; i++) {
      var key = transformersKeys[i];
      if (hasOwnProperty.call(object, key)) {
        return transformers[key](object[key], callback);
      }
    }
  }
};

var testFragment = fragment(document);

// DOM4 node.append(...many)
var hasAppend = 'append' in testFragment;

// detect old browsers without HTMLTemplateElement content support
var hasContent = 'content' in create(document, 'template');

// IE 11 has problems with cloning templates: it "forgets" empty childNodes
testFragment.appendChild(text(testFragment, 'g'));
testFragment.appendChild(text(testFragment, ''));
var hasDoomedCloneNode = testFragment.cloneNode(true).childNodes.length === 1;

// old browsers need to fallback to cloneNode
// Custom Elements V0 and V1 will work polyfilled
// but native implementations need importNode instead
// (specially Chromium and its old V0 implementation)
var hasImportNode = 'importNode' in document;

// appends an array of nodes
// to a generic node/fragment
// When available, uses append passing all arguments at once
// hoping that's somehow faster, even if append has more checks on type
var append = hasAppend ? function (node, childNodes) {
  node.append.apply(node, childNodes);
} : function (node, childNodes) {
  var length = childNodes.length;
  for (var i = 0; i < length; i++) {
    node.appendChild(childNodes[i]);
  }
};

// remove comments parts from attributes to avoid issues
// with either old browsers or SVG elements
// export const cleanAttributes = html => html.replace(no, comments);
var attrName = '[^\\S]+[^ \\f\\n\\r\\t\\/>"\'=]+';
var no = new RegExp('(<[a-z]+[a-z0-9:_-]*)((?:' + attrName + '(?:=(?:\'.*?\'|".*?"|<.+?>|\\S+))?)+)([^\\S]*/?>)', 'gi');
var findAttributes = new RegExp('(' + attrName + '=)([\'"]?)' + UIDC + '\\2', 'gi');
var comments = function comments($0, $1, $2, $3) {
  return $1 + $2.replace(findAttributes, replaceAttributes) + $3;
};
var replaceAttributes = function replaceAttributes($0, $1, $2) {
  return $1 + ($2 || '"') + UID + ($2 || '"');
};

// given a node and a generic HTML content,
// create either an SVG or an HTML fragment
// where such content will be injected
var createFragment = function createFragment(node, html) {
  return (OWNER_SVG_ELEMENT in node ? SVGFragment : HTMLFragment)(node, html.replace(no, comments));
};

// IE/Edge shenanigans proof cloneNode
// it goes through all nodes manually
// instead of relying the engine to suddenly
// merge nodes together
var cloneNode = hasDoomedCloneNode ? function (node) {
  var clone = node.cloneNode();
  var childNodes = node.childNodes || [];
  var length = childNodes.length;
  for (var i = 0; i < length; i++) {
    clone.appendChild(cloneNode(childNodes[i]));
  }
  return clone;
} : function (node) {
  return node.cloneNode(true);
};

// used to import html into fragments
var importNode = hasImportNode ? function (doc$$1, node) {
  return doc$$1.importNode(node, true);
} : function (doc$$1, node) {
  return cloneNode(node);
};

// just recycling a one-off array to use slice
// in every needed place
var slice = [].slice;

// lazy evaluated, returns the unique identity
// of a template literal, as tempalte literal itself.
// By default, ES2015 template literals are unique
// tag`a${1}z` === tag`a${2}z`
// even if interpolated values are different
// the template chunks are in a frozen Array
// that is identical each time you use the same
// literal to represent same static content
// around its own interpolations.
var unique = function unique(template) {
  return _TL(template);
};

// TL returns a unique version of the template
// it needs lazy feature detection
// (cannot trust literals with transpiled code)
var _TL = function TL(template) {
  if (
  // TypeScript template literals are not standard
  template.propertyIsEnumerable('raw') ||
  // Firefox < 55 has not standard implementation neither
  /Firefox\/(\d+)/.test((global.navigator || {}).userAgent) && parseFloat(RegExp.$1) < 55) {
    // in these cases, address templates once
    var templateObjects = {};
    // but always return the same template
    _TL = function TL(template) {
      var key = '_' + template.join(UID);
      return templateObjects[key] || (templateObjects[key] = template);
    };
  } else {
    // make TL an identity like function
    _TL = function TL(template) {
      return template;
    };
  }
  return _TL(template);
};

// create document fragments via native template
// with a fallback for browsers that won't be able
// to deal with some injected element such <td> or others
var HTMLFragment = hasContent ? function (node, html) {
  var container = create(node, 'template');
  container.innerHTML = html;
  return container.content;
} : function (node, html) {
  var container = create(node, 'template');
  var content = fragment(node);
  if (/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(html)) {
    var selector = RegExp.$1;
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
var SVGFragment = hasContent ? function (node, html) {
  var content = fragment(node);
  var container = doc(node).createElementNS(SVG_NAMESPACE, 'svg');
  container.innerHTML = html;
  append(content, slice.call(container.childNodes));
  return content;
} : function (node, html) {
  var content = fragment(node);
  var container = create(node, 'div');
  container.innerHTML = '<svg xmlns="' + SVG_NAMESPACE + '">' + html + '</svg>';
  append(content, slice.call(container.firstChild.childNodes));
  return content;
};

// every template literal interpolation indicates
// a precise target in the DOM the template is representing.
// `<p id=${'attribute'}>some ${'content'}</p>`
// hyperHTML finds only once per template literal,
// hence once per entire application life-cycle,
// all nodes that are related to interpolations.
// These nodes are stored as indexes used to retrieve,
// once per upgrade, nodes that will change on each future update.
// A path example is [2, 0, 1] representing the operation:
// node.childNodes[2].childNodes[0].childNodes[1]
// Attributes are addressed via their owner node and their name.
var createPath = function createPath(node) {
  var path = [];
  var parentNode = void 0;
  switch (node.nodeType) {
    case ELEMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE:
      parentNode = node;
      break;
    case COMMENT_NODE:
      parentNode = node.parentNode;
      prepend(path, parentNode, node);
      break;
    default:
      parentNode = node.ownerElement;
      break;
  }
  for (node = parentNode; parentNode = parentNode.parentNode; node = parentNode) {
    prepend(path, parentNode, node);
  }
  return path;
};

var prepend = function prepend(path, parent, node) {
  path.unshift(path.indexOf.call(parent.childNodes, node));
};

var Path = {
  create: function create(type, node, name) {
    return { type: type, name: name, node: node, path: createPath(node) };
  },
  find: function find(node, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      node = node.childNodes[path[i]];
    }
    return node;
  }
};

// if you want to use Promises as interpolation value
// be sure your browser supports them or provide a polyfill
// before including/importing hyperHTML
var Promise = global.Promise;

// primitives are useful interpolations values
// and will result in very fast operations
// for either attributes or nodes content updates
var NUMBER = 'number';
var OBJECT = 'object';
var STRING = 'string';

// hyper.Component have a connected/disconnected
// mechanism provided by MutationObserver
// This weak set is used to recognize components
// as DOM node that needs to trigger connected/disconnected events
var components = new WeakSet();

// a basic dictionary used to filter already cached attributes
// while looking for special hyperHTML values.
function Cache() {}
Cache.prototype = Object.create(null);

// returns an intent to explicitly inject content as html
var asHTML = function asHTML(html) {
  return { html: html };
};

// updates are created once per context upgrade
// within the main render function (../hyper/render.js)
// These are an Array of callbacks to invoke passing
// each interpolation value.
// Updates can be related to any kind of content,
// attributes, or special text-only cases such <style>
// elements or <textarea>
var create$1 = function create$$1(root, paths) {
  var updates = [];
  var length = paths.length;
  for (var i = 0; i < length; i++) {
    var info = paths[i];
    var node = Path.find(root, info.path);
    switch (info.type) {
      case 'any':
        updates.push(setAnyContent(node, []));
        break;
      case 'attr':
        updates.push(setAttribute(node, info.name, info.node));
        break;
      case 'text':
        updates.push(setTextContent(node));
        break;
    }
  }
  return updates;
};

// when hyper.Component related DOM nodes
// are appended or removed from the live tree
// these might listen to connected/disconnected events
// This utility is in charge of finding all components
// involved in the DOM update/change and dispatch
// related information to them
var dispatchAll = function dispatchAll(nodes, type) {
  var isConnected = type === CONNECTED;
  var length = nodes.length;
  for (var event, i = 0; i < length; i++) {
    var node = nodes[i];
    if (node.nodeType === ELEMENT_NODE) {
      event = dispatchTarget(node, isConnected, type, event);
    }
  }
};

// the way it's done is via the components weak set
// and recursively looking for nested components too
var dispatchTarget = function dispatchTarget(node, isConnected, type, event) {
  if (components.has(node)) {
    if (!event) event = new Event(type);
    node.dispatchEvent(event);
  } else {
    var children = node.children;
    var length = children.length;
    for (var i = 0; i < length; i++) {
      event = dispatchTarget(children[i], isConnected, type, event);
    }
  }
  return event;
};

// finding all paths is a one-off operation performed
// when a new template literal is used.
// The goal is to map all target nodes that will be
// used to update content/attributes every time
// the same template literal is used to create content.
// The result is a list of paths related to the template
// with all the necessary info to create updates as
// list of callbacks that target directly affected nodes.
var find = function find(node, paths, parts) {
  var childNodes = node.childNodes;
  var length = childNodes.length;
  for (var i = 0; i < length; i++) {
    var child = childNodes[i];
    switch (child.nodeType) {
      case ELEMENT_NODE:
        findAttributes$1(child, paths, parts);
        find(child, paths, parts);
        break;
      case COMMENT_NODE:
        if (child.textContent === UID) {
          parts.shift();
          paths.push(
          // basicHTML or other non standard engines
          // might end up having comments in nodes
          // where they shouldn't, hence this check.
          SHOULD_USE_TEXT_CONTENT.test(node.nodeName) ? Path.create('text', node) : Path.create('any', child));
        }
        break;
      case TEXT_NODE:
        if (SHOULD_USE_TEXT_CONTENT.test(node.nodeName) && trim.call(child.textContent) === UIDC) {
          parts.shift();
          paths.push(Path.create('text', node));
        }
        break;
    }
  }
};

// attributes are searched via unique hyperHTML id value.
// Despite HTML being case insensitive, hyperHTML is able
// to recognize attributes by name in a caseSensitive way.
// This plays well with Custom Elements definitions
// and also with XML-like environments, without trusting
// the resulting DOM but the template literal as the source of truth.
// IE/Edge has a funny bug with attributes and these might be duplicated.
// This is why there is a cache in charge of being sure no duplicated
// attributes are ever considered in future updates.
var findAttributes$1 = function findAttributes(node, paths, parts) {
  var cache = new Cache();
  var attributes = node.attributes;
  var array = slice.call(attributes);
  var remove = [];
  var length = array.length;
  for (var i = 0; i < length; i++) {
    var attribute = array[i];
    if (attribute.value === UID) {
      var name = attribute.name;
      if (!(name in cache)) {
        var realName = parts.shift().replace(/^(?:|[\S\s]*?\s)(\S+?)=['"]?$/, '$1');
        cache[name] = attributes[realName] || attributes[realName.toLowerCase()];
        paths.push(Path.create('attr', cache[name], realName));
      }
      remove.push(attribute);
    }
  }
  for (var _i = 0; _i < remove.length; _i++) {
    node.removeAttributeNode(remove[_i]);
  }
};

// when a Promise is used as interpolation value
// its result must be parsed once resolved.
// This callback is in charge of understanding what to do
// with a returned value once the promise is resolved.
var invokeAtDistance = function invokeAtDistance(value, callback) {
  callback(value.placeholder);
  if ('text' in value) {
    Promise.resolve(value.text).then(String).then(callback);
  } else if ('any' in value) {
    Promise.resolve(value.any).then(callback);
  } else if ('html' in value) {
    Promise.resolve(value.html).then(asHTML).then(callback);
  } else {
    Promise.resolve(Transformer.invoke(value, callback)).then(callback);
  }
};

// quick and dirty ways to check a value type without abusing instanceof
var isNode_ish = function isNode_ish(value) {
  return 'ELEMENT_NODE' in value;
};
var isPromise_ish = function isPromise_ish(value) {
  return value != null && 'then' in value;
};

// special attributes are usually available through their owner class
// 'value' in input
// 'src' in img
// and so on. These attributes don't act properly via get/setAttribute
// so in these case their value is set, or retrieved, right away
// input.value = ...
// img.src = ...
var isSpecial = function isSpecial(node, name) {
  return !(OWNER_SVG_ELEMENT in node) && name in node;
};

// whenever a list of nodes/components is updated
// there might be updates or not.
// If the new list has different length, there's surely
// some DOM operation to perform.
// Otherwise operations should be performed **only**
// if the content od the two lists is different from before.
// Majinbuu is the project in charge of computing these differences.
// It uses the Levenshtein distance algorithm to produce the least amount
// of splice operations an Array needs to become like another Array.
var optimist = function optimist(aura$$1, value) {
  var length = aura$$1.length;
  if (value.length !== length) {
    // TODO: there's room for improvements for common cases
    // where a single node has been appended or prepended
    // and the whole Levenshtein distance computation
    // would be overkill
    majinbuu(aura$$1, value, Aura.MAX_LIST_SIZE);
  } else {
    for (var i = 0; i < length--; i++) {
      if (aura$$1[length] !== value[length] || aura$$1[i] !== value[i]) {
        majinbuu(aura$$1, value, Aura.MAX_LIST_SIZE);
        return;
      }
    }
  }
};

// in a hyper(node)`<div>${content}</div>` case
// everything could happen:
//  * it's a JS primitive, stored as text
//  * it's null or undefined, the node should be cleaned
//  * it's a component, update the content by rendering it
//  * it's a promise, update the content once resolved
//  * it's an explicit intent, perform the desired operation
//  * it's an Array, resolve all values if Promises and/or
//    update the node with the resulting list of content
var setAnyContent = function setAnyContent(node, childNodes) {
  var aura$$1 = new Aura(node, childNodes);
  var oldValue = void 0;
  var anyContent = function anyContent(value) {
    switch (typeof value) {
      case STRING:
      case NUMBER:
      case 'boolean':
        var length = childNodes.length;
        if (length === 1 && childNodes[0].nodeType === TEXT_NODE) {
          if (oldValue !== value) {
            oldValue = value;
            childNodes[0].textContent = value;
          }
        } else {
          oldValue = value;
          if (length) {
            aura$$1.splice(0, length, text(node, value));
          } else {
            node.parentNode.insertBefore(childNodes[0] = text(node, value), node);
          }
        }
        break;
      case OBJECT:
      case 'undefined':
        if (value == null) {
          oldValue = value;
          anyContent('');
          break;
        }
      default:
        oldValue = value;
        if (isArray(value)) {
          if (value.length === 0) {
            aura$$1.splice(0);
          } else {
            switch (typeof value[0]) {
              case STRING:
              case NUMBER:
              case 'boolean':
                anyContent({ html: value });
                break;
              case OBJECT:
                if (isArray(value[0])) {
                  value = value.concat.apply([], value);
                }
                if (isPromise_ish(value[0])) {
                  Promise.all(value).then(anyContent);
                  break;
                }
              default:
                optimist(aura$$1, value);
                break;
            }
          }
        } else if (value instanceof Component) {
          optimist(aura$$1, [value]);
        } else if (isNode_ish(value)) {
          optimist(aura$$1, value.nodeType === DOCUMENT_FRAGMENT_NODE ? slice.call(value.childNodes) : [value]);
        } else if (isPromise_ish(value)) {
          value.then(anyContent);
        } else if ('placeholder' in value) {
          invokeAtDistance(value, anyContent);
        } else if ('text' in value) {
          anyContent(String(value.text));
        } else if ('any' in value) {
          anyContent(value.any);
        } else if ('html' in value) {
          aura$$1.splice(0);
          var fragment$$1 = createFragment(node, [].concat(value.html).join(''));
          childNodes.push.apply(childNodes, fragment$$1.childNodes);
          node.parentNode.insertBefore(fragment$$1, node);
        } else if ('length' in value) {
          anyContent(slice.call(value));
        } else {
          anyContent(Transformer.invoke(value, anyContent));
        }
        break;
    }
  };
  return anyContent;
};

// there are four kind of attributes, and related behavior:
//  * events, with a name starting with `on`, to add/remove event listeners
//  * special, with a name present in their inherited prototype, accessed directly
//  * regular, accessed through get/setAttribute standard DOM methods
//  * style, the only regular attribute that also accepts an object as value
//    so that you can style=${{width: 120}}. In this case, the behavior has been
//    fully inspired by Preact library and its simplicity.
var setAttribute = function setAttribute(node, name, original) {
  var isStyle = name === 'style';
  var isData = !isStyle && name === 'data';
  var oldValue = void 0;
  if (!isStyle && !isData && /^on/.test(name)) {
    var type = name.slice(2);
    if (type === CONNECTED || type === DISCONNECTED) {
      components.add(node);
    } else if (name.toLowerCase() in node) {
      type = type.toLowerCase();
    }
    return function (newValue) {
      if (oldValue !== newValue) {
        if (oldValue) node.removeEventListener(type, oldValue, false);
        oldValue = newValue;
        if (newValue) node.addEventListener(type, newValue, false);
      }
    };
  } else if (isData || !isStyle && isSpecial(node, name)) {
    return function (newValue) {
      if (oldValue !== newValue) {
        oldValue = newValue;
        if (node[name] !== newValue) {
          node[name] = newValue;
          if (newValue == null) {
            node.removeAttribute(name);
          }
        }
      }
    };
  } else if (isStyle) {
    var oldType = void 0;
    return function (newValue) {
      switch (typeof newValue) {
        case OBJECT:
          if (newValue) {
            var style = node.style;
            if (oldType === OBJECT) {
              for (var key in oldValue) {
                if (!(key in newValue)) {
                  style[key] = '';
                }
              }
            } else {
              style.cssText = '';
            }
            for (var _key in newValue) {
              var value = newValue[_key];
              style[_key] = typeof value === NUMBER && !IS_NON_DIMENSIONAL.test(_key) ? value + 'px' : value;
            }
            oldType = OBJECT;
            oldValue = newValue;
            break;
          }
        default:
          if (oldValue != newValue) {
            oldType = STRING;
            oldValue = newValue;
            node.style.cssText = newValue || '';
          }
          break;
      }
    };
  } else {
    var noOwner = true;
    var attribute = original.cloneNode(true);
    return function (newValue) {
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
    };
  }
};

// style or textareas don't accept HTML as content
// it's pointless to transform or analyze anything
// different from text there but it's worth checking
// for possible defined intents.
var setTextContent = function setTextContent(node) {
  var oldValue = void 0;
  var textContent = function textContent(value) {
    if (oldValue !== value) {
      oldValue = value;
      if (typeof value === 'object' && value) {
        if (isPromise_ish(value)) {
          value.then(textContent);
        } else if ('placeholder' in value) {
          invokeAtDistance(value, textContent);
        } else if ('text' in value) {
          textContent(String(value.text));
        } else if ('any' in value) {
          textContent(value.any);
        } else if ('html' in value) {
          textContent([].concat(value.html).join(''));
        } else if ('length' in value) {
          textContent(slice.call(value).join(''));
        } else {
          textContent(Transformer.invoke(value, textContent));
        }
      } else {
        node.textContent = value == null ? '' : value;
      }
    }
  };
  return textContent;
};

// hyper.Components might need connected/disconnected notifications
// The MutationObserver is the best way to implement that
// but there is a fallback to deprecated DOMNodeInserted/Removed
// so that even older browsers/engines can help components life-cycle
try {
  new MutationObserver(function (records) {
    var length = records.length;
    for (var i = 0; i < length; i++) {
      var record = records[i];
      dispatchAll(record.removedNodes, DISCONNECTED);
      dispatchAll(record.addedNodes, CONNECTED);
    }
  }).observe(document, { subtree: true, childList: true });
} catch (o_O) {
  document.addEventListener('DOMNodeRemoved', function (event) {
    dispatchAll([event.target], DISCONNECTED);
  }, false);
  document.addEventListener('DOMNodeInserted', function (event) {
    dispatchAll([event.target], CONNECTED);
  }, false);
}

var Updates = { create: create$1, find: find };

// a weak collection of contexts that
// are already known to hyperHTML
var bewitched = new WeakMap();

// the collection of all template literals
// since these are unique and immutable
// for the whole application life-cycle
var templates = new Map();

// better known as hyper.bind(node), the render is
// the main tag function in charge of fully upgrading
// or simply updating, contexts used as hyperHTML targets.
// The `this` context is either a regular DOM node or a fragment.
function render(template) {
  var wicked = bewitched.get(this);
  if (wicked && wicked.template === unique(template)) {
    update.apply(wicked.updates, arguments);
  } else {
    upgrade.apply(this, arguments);
  }
  return this;
}

// an upgrade is in charge of collecting template info,
// parse it once, if unknown, to map all interpolations
// as single DOM callbacks, relate such template
// to the current context, and render it after cleaning the context up
function upgrade(template) {
  template = unique(template);
  var info = templates.get(template) || createTemplate.call(this, template);
  var fragment = importNode(this.ownerDocument, info.fragment);
  var updates = Updates.create(fragment, info.paths);
  bewitched.set(this, { template: template, updates: updates });
  update.apply(updates, arguments);
  this.textContent = '';
  this.appendChild(fragment);
}

// an update simply loops over all mapped DOM operations
function update() {
  var length = arguments.length;
  for (var i = 1; i < length; i++) {
    this[i - 1](arguments[i]);
  }
}

// a template can be used to create a document fragment
// aware of all interpolations and with a list
// of paths used to find once those nodes that need updates,
// no matter if these are attributes, text nodes, or regular one
function createTemplate(template) {
  var paths = [];
  var fragment = createFragment(this, template.join(UIDC));
  Updates.find(fragment, paths, template.slice());
  var info = { fragment: fragment, paths: paths };
  templates.set(template, info);
  return info;
}

// all wires used per each context
var wires = new WeakMap();

// A wire is a callback used as tag function
// to lazily relate a generic object to a template literal.
// hyper.wire(user)`<div id=user>${user.name}</div>`; => the div#user
// This provides the ability to have a unique DOM structure
// related to a unique JS object through a reusable template literal.
// A wire can specify a type, as svg or html, and also an id
// via html:id or :id convention. Such :id allows same JS objects
// to be associated to different DOM structures accordingly with
// the used template literal without losing previously rendered parts.
var wire = function wire(obj, type) {
  return obj == null ? content(type || 'html') : weakly(obj, type || 'html');
};

// A wire content is a virtual reference to one or more nodes.
// It's represented by either a DOM node, or an Array.
// In both cases, the wire content role is to simply update
// all nodes through the list of related callbacks.
// In few words, a wire content is like an invisible parent node
// in charge of updating its content like a bound element would do.
var content = function content(type) {
  var wire = void 0,
      container = void 0,
      content = void 0,
      template = void 0,
      updates = void 0;
  return function (statics) {
    statics = unique(statics);
    var setup = template !== statics;
    if (setup) {
      template = statics;
      content = fragment(document);
      container = type === 'svg' ? document.createElementNS(SVG_NAMESPACE, 'svg') : content;
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

// wires are weakly created through objects.
// Each object can have multiple wires associated
// and this is thanks to the type + :id feature.
var weakly = function weakly(obj, type) {
  var i = type.indexOf(':');
  var wire = wires.get(obj);
  var id = type;
  if (-1 < i) {
    id = type.slice(i + 1);
    type = type.slice(0, i) || 'html';
  }
  if (!wire) wires.set(obj, wire = {});
  return wire[id] || (wire[id] = content(type));
};

// a document fragment loses its nodes as soon
// as it's appended into another node.
// This would easily lose wired content
// so that on a second render call, the parent
// node wouldn't know which node was there
// associated to the interpolation.
// To prevent hyperHTML to forget about wired nodes,
// these are either returned as Array or, if there's ony one entry,
// as single referenced node that won't disappear from the fragment.
// The initial fragment, at this point, would be used as unique reference.
var wireContent = function wireContent(node) {
  var childNodes = node.childNodes;
  var length = childNodes.length;
  var wire = [];
  for (var i = 0; i < length; i++) {
    var child = childNodes[i];
    if (child.nodeType === ELEMENT_NODE || trim.call(child.textContent).length !== 0) {
      wire.push(child);
    }
  }
  return wire.length === 1 ? wire[0] : wire;
};

// all functions are self bound to the right context
// you can do the following
// const {bind, wire} = hyperHTML;
// and use them right away: bind(node)`hello!`;
var bind = function bind(context) {
  return render.bind(context);
};
var define = Transformer.define;

hyper.bind = bind;
hyper.define = define;
hyper.hyper = hyper;
hyper.wire = wire;
hyper.Component = Component;

// if needed, you can increase or decrease
// the maximum amount of nodes per list
// to compute via majinbuu algorithm
Object.defineProperty(hyper, 'MAX_LIST_SIZE', {
  get: function get() {
    return Aura.MAX_LIST_SIZE;
  },
  set: function set(value) {
    Aura.MAX_LIST_SIZE = value;
  }
});

// the wire content is the lazy defined
// html or svg property of each hyper.Component
setup(content);

// by default, hyperHTML is a smart function
// that "magically" understands what's the best
// thing to do with passed arguments
function hyper(HTML) {
  return arguments.length < 2 ? HTML == null ? content('html') : typeof HTML === 'string' ? wire(null, HTML) : 'raw' in HTML ? content('html')(HTML) : 'nodeType' in HTML ? render.bind(HTML) : weakly(HTML, 'html') : ('raw' in HTML ? content('html') : wire).apply(null, arguments);
}








return hyper;

}(window));
