var hyperHTML = (function (global) {
'use strict';

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

var intents = {};
var keys = [];
var hasOwnProperty = intents.hasOwnProperty;

var length = 0;

var Intent = {

  // hyperHTML.define('intent', (object, update) => {...})
  // can be used to define a third parts update mechanism
  // when every other known mechanism failed.
  // hyper.define('user', info => info.name);
  // hyper(node)`<p>${{user}}</p>`;
  define: function define(intent, callback) {
    if (!(intent in intents)) {
      length = keys.push(intent);
    }
    intents[intent] = callback;
  },

  // this method is used internally as last resort
  // to retrieve a value out of an object
  invoke: function invoke(object, callback) {
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (hasOwnProperty.call(object, key)) {
        return intents[key](object[key], callback);
      }
    }
  }
};

var global = document.defaultView;

// Node.CONSTANTS
// 'cause some engine has no global Node defined
// (i.e. Node, NativeScript, basicHTML ... )
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
  var childNodes = node.childNodes ||
  // this is an excess of caution
  // but some node, in IE, might not
  // have childNodes property.
  // The following fallback ensure working code
  // in older IE without compromising performance
  // or any other browser/engine involved.
  /* istanbul ignore next */
  [];
  var length = childNodes.length;
  for (var i = 0; i < length; i++) {
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
function (node) {
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

function Wire(childNodes) {
  this.childNodes = childNodes;
  this.length = childNodes.length;
  this.first = childNodes[0];
  this.last = childNodes[this.length - 1];
}

// when a wire is inserted, all its nodes will follow
Wire.prototype.insert = function insert() {
  var df = fragment(this.first);
  append(df, this.childNodes);
  return df;
};

// when a wire is removed, all its nodes must be removed as well
Wire.prototype.remove = function remove() {
  var first = this.first;
  var last = this.last;
  if (this.length === 2) {
    last.parentNode.removeChild(last);
  } else {
    var range = doc(first).createRange();
    range.setStartBefore(this.childNodes[1]);
    range.setEndAfter(last);
    range.deleteContents();
  }
  return first;
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

// from https://github.com/developit/preact/blob/33fc697ac11762a1cb6e71e9847670d047af7ce5/src/constants.js
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

// style is handled as both string and object
// even if the target is an SVG element (consistency)
var Style = (function (node, original, isSVG) {
  if (isSVG) {
    var style = original.cloneNode(true);
    style.value = '';
    node.setAttributeNode(style);
    return update$1(style, isSVG);
  }
  return update$1(node.style, isSVG);
});

// the update takes care or changing/replacing
// only properties that are different or
// in case of string, the whole node
var update$1 = function update(style, isSVG) {
  var oldType = void 0,
      oldValue = void 0;
  return function (newValue) {
    switch (typeof newValue) {
      case 'object':
        if (newValue) {
          if (oldType === 'object') {
            if (!isSVG) {
              if (oldValue !== newValue) {
                for (var key in oldValue) {
                  if (!(key in newValue)) {
                    style[key] = '';
                  }
                }
              }
            }
          } else {
            if (isSVG) style.value = '';else style.cssText = '';
          }
          var info = isSVG ? {} : style;
          for (var _key in newValue) {
            var value = newValue[_key];
            info[_key] = typeof value === 'number' && !IS_NON_DIMENSIONAL.test(_key) ? value + 'px' : value;
          }
          oldType = 'object';
          if (isSVG) style.value = toStyle(oldValue = info);else oldValue = newValue;
          break;
        }
      default:
        if (oldValue != newValue) {
          oldType = 'string';
          oldValue = newValue;
          if (isSVG) style.value = newValue || '';else style.cssText = newValue || '';
        }
        break;
    }
  };
};

var hyphen = /([^A-Z])([A-Z]+)/g;
var ized = function ized($0, $1, $2) {
  return $1 + '-' + $2.toLowerCase();
};
var toStyle = function toStyle(object) {
  var css = [];
  for (var key in object) {
    css.push(key.replace(hyphen, ized), ':', object[key], ';');
  }
  return css.join('');
};

/* AUTOMATICALLY IMPORTED, DO NOT MODIFY */
/*! (c) 2017 Andrea Giammarchi (ISC) */

/**
 * This code is a revisited port of the snabbdom vDOM diffing logic,
 * the same that fuels as fork Vue.js or other libraries.
 * @credits https://github.com/snabbdom/snabbdom
 */

var identity = function identity(O) {
  return O;
};

var domdiff = function domdiff(parentNode, // where changes happen
currentNodes, // Array of current items/nodes
futureNodes, // Array of future items/nodes
getNode, // optional way to retrieve a node from an item
beforeNode // optional item/node to use as insertBefore delimiter
) {
  var get = getNode || identity;
  var before = beforeNode == null ? null : get(beforeNode, 0);
  var currentStart = 0,
      futureStart = 0;
  var currentEnd = currentNodes.length - 1;
  var currentStartNode = currentNodes[0];
  var currentEndNode = currentNodes[currentEnd];
  var futureEnd = futureNodes.length - 1;
  var futureStartNode = futureNodes[0];
  var futureEndNode = futureNodes[futureEnd];
  while (currentStart <= currentEnd && futureStart <= futureEnd) {
    if (currentStartNode == null) {
      currentStartNode = currentNodes[++currentStart];
    } else if (currentEndNode == null) {
      currentEndNode = currentNodes[--currentEnd];
    } else if (futureStartNode == null) {
      futureStartNode = futureNodes[++futureStart];
    } else if (futureEndNode == null) {
      futureEndNode = futureNodes[--futureEnd];
    } else if (currentStartNode == futureStartNode) {
      currentStartNode = currentNodes[++currentStart];
      futureStartNode = futureNodes[++futureStart];
    } else if (currentEndNode == futureEndNode) {
      currentEndNode = currentNodes[--currentEnd];
      futureEndNode = futureNodes[--futureEnd];
    } else if (currentStartNode == futureEndNode) {
      parentNode.insertBefore(get(currentStartNode, 1), get(currentEndNode, -0).nextSibling);
      currentStartNode = currentNodes[++currentStart];
      futureEndNode = futureNodes[--futureEnd];
    } else if (currentEndNode == futureStartNode) {
      parentNode.insertBefore(get(currentEndNode, 1), get(currentStartNode, 0));
      currentEndNode = currentNodes[--currentEnd];
      futureStartNode = futureNodes[++futureStart];
    } else {
      var index = currentNodes.indexOf(futureStartNode);
      if (index < 0) {
        parentNode.insertBefore(get(futureStartNode, 1), get(currentStartNode, 0));
        futureStartNode = futureNodes[++futureStart];
      } else {
        var el = currentNodes[index];
        currentNodes[index] = null;
        parentNode.insertBefore(get(el, 1), get(currentStartNode, 0));
        futureStartNode = futureNodes[++futureStart];
      }
    }
  }
  if (currentStart > currentEnd) {
    var pin = futureNodes[futureEnd + 1];
    var place = pin != null ? get(pin, 0) : before;
    while (futureStart <= futureEnd) {
      var ch = futureNodes[futureStart++];
      // ignore until I am sure the else could never happen.
      // it might be a vDOM thing 'cause it never happens here.
      /* istanbul ignore else */
      if (ch != null) parentNode.insertBefore(get(ch, 1), place);
    }
  }
  // ignore until I am sure the else could never happen.
  // it might be a vDOM thing 'cause it never happens here.
  /* istanbul ignore else */
  else if (futureStart > futureEnd) {
      while (currentStart <= currentEnd) {
        var _ch = currentNodes[currentStart++];
        if (_ch != null) parentNode.removeChild(get(_ch, -1));
      }
    }
  return futureNodes;
};

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

// returns nodes from wires and components
var asNode = function asNode(item, i) {
  return 'ELEMENT_NODE' in item ? item : item.constructor === Wire ?
  // in the Wire case, the content can be
  // removed, post-pended, inserted, or pre-pended and
  // all these cases are handled by domdiff already
  /* istanbul ignore next */
  1 / i < 0 ? i ? item.remove() : item.last : i ? item.insert() : item.first : asNode(item.render(), i);
};

// returns true if domdiff can handle the value
var canDiff = function canDiff(value) {
  return 'ELEMENT_NODE' in value || value instanceof Wire || value instanceof Component;
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
        // the following ignore is actually covered by browsers
        // only basicHTML ends up on previous COMMENT_NODE case
        // instead of TEXT_NODE because it knows nothing about
        // special style or textarea behavior
        /* istanbul ignore if */
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
      // the following ignore is covered by IE
      // and the IE9 double viewBox test
      /* istanbul ignore else */
      if (!(name in cache)) {
        var realName = parts.shift().replace(/^(?:|[\S\s]*?\s)(\S+?)=['"]?$/, '$1');
        cache[name] = attributes[realName] ||
        // the following ignore is covered by browsers
        // while basicHTML is already case-sensitive
        /* istanbul ignore next */
        attributes[realName.toLowerCase()];
        paths.push(Path.create('attr', cache[name], realName));
      }
      remove.push(attribute);
    }
  }
  var len = remove.length;
  for (var _i = 0; _i < len; _i++) {
    node.removeAttributeNode(remove[_i]);
  }

  // This is a very specific Firefox/Safari issue
  // but since it should be a not so common pattern,
  // it's probably worth patching regardless.
  // Basically, scripts created through strings are death.
  // You need to create fresh new scripts instead.
  // TODO: is there any other node that needs such nonsense ?
  var nodeName = node.nodeName;
  if (/^script$/i.test(nodeName)) {
    var script = create(node, nodeName);
    for (var _i2 = 0; _i2 < attributes.length; _i2++) {
      script.setAttributeNode(attributes[_i2].cloneNode(true));
    }
    script.textContent = node.textContent;
    node.parentNode.replaceChild(script, node);
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
    Promise.resolve(Intent.invoke(value, callback)).then(callback);
  }
};

// quick and dirty way to check for Promise/ish values
var isPromise_ish = function isPromise_ish(value) {
  return value != null && 'then' in value;
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
  var fastPath = false;
  var oldValue = void 0;
  var anyContent = function anyContent(value) {
    switch (typeof value) {
      case 'string':
      case 'number':
      case 'boolean':
        if (fastPath) {
          if (oldValue !== value) {
            oldValue = value;
            childNodes[0].textContent = value;
          }
        } else {
          fastPath = true;
          oldValue = value;
          childNodes = domdiff(node.parentNode, childNodes, [text(node, value)], asNode, node);
        }
        break;
      case 'object':
      case 'undefined':
        if (value == null) {
          fastPath = false;
          childNodes = domdiff(node.parentNode, childNodes, [], asNode, node);
          break;
        }
      default:
        fastPath = false;
        oldValue = value;
        if (isArray(value)) {
          if (value.length === 0) {
            if (childNodes.length) {
              childNodes = domdiff(node.parentNode, childNodes, [], asNode, node);
            }
          } else {
            switch (typeof value[0]) {
              case 'string':
              case 'number':
              case 'boolean':
                anyContent({ html: value });
                break;
              case 'object':
                if (isArray(value[0])) {
                  value = value.concat.apply([], value);
                }
                if (isPromise_ish(value[0])) {
                  Promise.all(value).then(anyContent);
                  break;
                }
              default:
                childNodes = domdiff(node.parentNode, childNodes, value, asNode, node);
                break;
            }
          }
        } else if (canDiff(value)) {
          childNodes = domdiff(node.parentNode, childNodes, value.nodeType === DOCUMENT_FRAGMENT_NODE ? slice.call(value.childNodes) : [value], asNode, node);
        } else if (isPromise_ish(value)) {
          value.then(anyContent);
        } else if ('placeholder' in value) {
          invokeAtDistance(value, anyContent);
        } else if ('text' in value) {
          anyContent(String(value.text));
        } else if ('any' in value) {
          anyContent(value.any);
        } else if ('html' in value) {
          childNodes = domdiff(node.parentNode, childNodes, slice.call(createFragment(node, [].concat(value.html).join('')).childNodes), asNode, node);
        } else if ('length' in value) {
          anyContent(slice.call(value));
        } else {
          anyContent(Intent.invoke(value, anyContent));
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
  var isSVG = OWNER_SVG_ELEMENT in node;
  var oldValue = void 0;
  // if the attribute is the style one
  // handle it differently from others
  if (name === 'style') {
    return Style(node, original, isSVG);
  }
  // the name is an event one,
  // add/remove event listeners accordingly
  else if (/^on/.test(name)) {
      var type = name.slice(2);
      if (type === CONNECTED || type === DISCONNECTED) {
        if (notObserving) {
          notObserving = false;
          observe();
        }
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
    }
    // the attribute is special ('value' in input)
    // and it's not SVG *or* the name is exactly data,
    // in this case assign the value directly
    else if (name === 'data' || !isSVG && name in node) {
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
      }
      // in every other case, use the attribute node as it is
      // update only the value, set it as node only when/if needed
      else {
          var owner = false;
          var attribute = original.cloneNode(true);
          return function (newValue) {
            if (oldValue !== newValue) {
              oldValue = newValue;
              if (attribute.value !== newValue) {
                if (newValue == null) {
                  if (owner) {
                    owner = false;
                    node.removeAttributeNode(attribute);
                  }
                } else {
                  attribute.value = newValue;
                  if (!owner) {
                    owner = true;
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
          textContent(Intent.invoke(value, textContent));
        }
      } else {
        node.textContent = value == null ? '' : value;
      }
    }
  };
  return textContent;
};

var Updates = { create: create$1, find: find };

// hyper.Components might need connected/disconnected notifications
// used by components and their onconnect/ondisconnect callbacks.
// When one of these callbacks is encountered,
// the document starts being observed.
var notObserving = true;
function observe() {

  // when hyper.Component related DOM nodes
  // are appended or removed from the live tree
  // these might listen to connected/disconnected events
  // This utility is in charge of finding all components
  // involved in the DOM update/change and dispatch
  // related information to them
  var dispatchAll = function dispatchAll(nodes, type) {
    var event = new Event(type);
    var length = nodes.length;
    for (var i = 0; i < length; i++) {
      var node = nodes[i];
      if (node.nodeType === ELEMENT_NODE) {
        dispatchTarget(node, event);
      }
    }
  };

  // the way it's done is via the components weak set
  // and recursively looking for nested components too
  var dispatchTarget = function dispatchTarget(node, event) {
    if (components.has(node)) {
      node.dispatchEvent(event);
    } else {
      var children = node.children;
      var length = children.length;
      for (var i = 0; i < length; i++) {
        dispatchTarget(children[i], event);
      }
    }
  };

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
}

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
  var wireNodes = [];
  for (var i = 0; i < length; i++) {
    var child = childNodes[i];
    if (child.nodeType === ELEMENT_NODE || trim.call(child.textContent).length !== 0) {
      wireNodes.push(child);
    }
  }
  return wireNodes.length === 1 ? wireNodes[0] : new Wire(wireNodes);
};

/*! (c) Andrea Giammarchi (ISC) */

// all functions are self bound to the right context
// you can do the following
// const {bind, wire} = hyperHTML;
// and use them right away: bind(node)`hello!`;
var bind = function bind(context) {
  return render.bind(context);
};
var define = Intent.define;

hyper.Component = Component;
hyper.bind = bind;
hyper.define = define;
hyper.diff = domdiff;
hyper.hyper = hyper;
hyper.wire = wire;

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
