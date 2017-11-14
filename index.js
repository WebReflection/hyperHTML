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

function Component() {}

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

// Node.CONSTANTS (not every engine has Node)
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

var WeakMap = global.WeakMap || function WeakMap() {
  return {
    delete: function _delete(obj) {
      delete obj[UID];
    },
    get: function get(obj) {
      return obj[UID];
    },
    has: function has(obj) {
      return UID in obj;
    },
    set: function set(obj, value) {
      Object.defineProperty(obj, UID, {
        configurable: true,
        value: value
      });
    }
  };
};

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

// TODO: which browser needs these partial polyfills here?
var isArray = Array.isArray || function (toString) {
  return function (arr) {
    return toString.call(arr) === '[object Array]';
  };
}({}.toString);

var trim = UID.trim || function () {
  return this.replace(/^\s+|\s+$/g, '');
};

function Aura(node, childNodes) {
  this.node = node;
  this.childNodes = childNodes;
  childNodes.become = become;
  return majinbuu.aura(this, childNodes);
}

Aura.MAX_LIST_SIZE = 999;

Aura.prototype.splice = function splice(start, end) {
  var values = new Map();
  var ph = this.node;
  var cn = this.childNodes;
  var target = asNode(cn[start + (end || 0)] || ph);
  var result = cn.splice.apply(cn, arguments);
  var pn = ph.parentNode;
  var i = 0;
  var tmp = void 0;
  var reLength = result.length;
  while (i < reLength) {
    tmp = result[i++];
    if (cn.indexOf(tmp) < 0) {
      pn.removeChild(get(values, tmp));
    }
  }
  i = 2;
  var arLength = arguments.length;
  while (i < arLength) {
    if (arLength - i === 1) {
      tmp = get(values, arguments[i++]);
    } else {
      tmp = fragment(pn);
      while (i < arLength) {
        tmp.appendChild(get(values, arguments[i++]));
      }
    }
    pn.insertBefore(tmp, target);
  }
  return result;
};

var asNode = function asNode(node) {
  return node instanceof Component ? node.render() : node;
};
var get = function get(map, node) {
  return map.get(node) || set(map, node);
};
var set = function set(map, node) {
  var value = asNode(node);
  map.set(node, value);
  return value;
};

function become(value) {
  var i = 0,
      length = this.length;
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

var transformers = {};
var transformersKeys = [];
var hasOwnProperty = transformers.hasOwnProperty;

var length = 0;

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
var hasImportNode = 'importNode' in document;

// appends an array of nodes
// to a generic node/fragment
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

var createFragment = function createFragment(node, html) {
  return (OWNER_SVG_ELEMENT in node ? SVGFragment : HTMLFragment)(node, html.replace(no, comments));
};

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
var importNode = hasImportNode ? function (doc$$1, node) {
  return doc$$1.importNode(node, true);
} : function (doc$$1, node) {
  return cloneNode(node);
};

var slice = [].slice;

// lazy evaluated
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

var prepend = function prepend(path, parent, node) {
  path.unshift('childNodes', path.indexOf.call(parent.childNodes, node));
};

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

var Path = {
  create: function create(type, node, name) {
    return { type: type, name: name, node: node, path: createPath(node) };
  },
  find: function find(node, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      node = node[path[i++]][path[i]];
    }
    return node;
  }
};

var NUMBER = 'number';
var OBJECT = 'object';
var STRING = 'string';

var Promise = global.Promise;
var components = new WeakSet();

function Cache() {}
Cache.prototype = Object.create(null);

var asHTML = function asHTML(html) {
  return { html: html };
};

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
          paths.push(Path.create('any', child));
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

var isNode_ish = function isNode_ish(value) {
  return 'ELEMENT_NODE' in value;
};
var isPromise_ish = function isPromise_ish(value) {
  return value != null && 'then' in value;
};
var isSpecial = function isSpecial(node, name) {
  return !(OWNER_SVG_ELEMENT in node) && name in node;
};

var optimist = function optimist(aura$$1, value) {
  var length = aura$$1.length;
  if (value.length !== length) {
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

var setTextContent = function setTextContent(node) {
  var oldValue = void 0;
  return function (newValue) {
    if (oldValue !== newValue) node.textContent = oldValue = newValue;
  };
};

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

var bewitched = new WeakMap();
var templates = new Map();

function render(template) {
  var wicked = bewitched.get(this);
  if (wicked && wicked.template === unique(template)) {
    update.apply(wicked.updates, arguments);
  } else {
    upgrade.apply(this, arguments);
  }
  return this;
}

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

function update() {
  var length = arguments.length;
  for (var i = 1; i < length; i++) {
    this[i - 1](arguments[i]);
  }
}

function createTemplate(template) {
  var paths = [];
  var fragment = createFragment(this, template.join(UIDC));
  Updates.find(fragment, paths, template.slice());
  var info = { fragment: fragment, paths: paths };
  templates.set(template, info);
  return info;
}

var wires = new WeakMap();

var wire = function wire(obj, type) {
  return obj == null ? content(type || 'html') : weakly(obj, type || 'html');
};

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

var bind = function bind(context) {
  return render.bind(context);
};
var define = Transformer.define;

hyper.bind = bind;
hyper.define = define;
hyper.hyper = hyper;
hyper.wire = wire;
hyper.Component = Component;

Object.defineProperty(hyper, 'MAX_LIST_SIZE', {
  get: function get() {
    return Aura.MAX_LIST_SIZE;
  },
  set: function set(value) {
    Aura.MAX_LIST_SIZE = value;
  }
});

setup(content);

function hyper(HTML) {
  return arguments.length < 2 ? HTML == null ? content('html') : typeof HTML === 'string' ? wire(null, HTML) : 'raw' in HTML ? content('html')(HTML) : 'nodeType' in HTML ? render.bind(HTML) : weakly(HTML, 'html') : ('raw' in HTML ? content('html') : wire).apply(null, arguments);
}








return hyper;

}(window));
