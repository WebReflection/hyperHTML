var hyperHTML = function (cache, modules) {
  function require(i) {
    return cache[i] || get(i);
  }
  function get(i) {
    var exports = {},
        module = { exports: exports };
    modules[i].call(exports, window, require, module, exports);
    return cache[i] = module.exports;
  }
  require.E = function (exports) {
    return Object.defineProperty(exports, '__esModule', { value: true });
  };
  require.I = function (m) {
    return m.__esModule ? m.default : m;
  };
  return require.I(require(0));
}([], [function (global, require, module, exports) {
  // main.js
  'use strict';

  var Component = require.I(require(1));

  var _require = require(1),
      setup = _require.setup;

  var Transformer = require.I(require(2));
  var wire = require.I(require(3));

  var _require2 = require(3),
      content = _require2.content,
      weakly = _require2.weakly;

  var render = require.I(require(9));

  var bind = hyper.bind = function (context) {
    return render.bind(context);
  };
  var define = hyper.define = Transformer.define;

  hyper.hyper = hyper;
  hyper.wire = wire;
  hyper.Component = Component;

  setup(content);

  exports.Component = Component;
  exports.bind = bind;
  exports.define = define;
  exports.hyper = hyper;
  exports.wire = wire;

  function hyper(HTML) {
    return arguments.length < 2 ? HTML == null ? content('html') : typeof HTML === 'string' ? wire(null, HTML) : 'raw' in HTML ? content('html')(HTML) : 'nodeType' in HTML ? bind(HTML) : weakly(HTML, 'html') : ('raw' in HTML ? content('html') : wire).apply(null, arguments);
  }
  require.E(exports).default = hyper;
}, function (global, require, module, exports) {
  // classes/Component.js
  'use strict';

  function Component() {}
  require.E(exports).default = Component;

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
  exports.setup = setup;

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
}, function (global, require, module, exports) {
  // objects/Transformer.js
  'use strict';

  var transformers = {};
  var transformersKeys = [];
  var hasOwnProperty = transformers.hasOwnProperty;

  var length = 0;

  require.E(exports).default = {
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
}, function (global, require, module, exports) {
  // hyper/wire.js
  'use strict';

  var _require3 = require(4),
      ELEMENT_NODE = _require3.ELEMENT_NODE,
      SVG_NAMESPACE = _require3.SVG_NAMESPACE;

  var _require4 = require(5),
      WeakMap = _require4.WeakMap,
      trim = _require4.trim;

  var _require5 = require(6),
      fragment = _require5.fragment;

  var _require6 = require(7),
      append = _require6.append,
      slice = _require6.slice,
      unique = _require6.unique;

  var render = require.I(require(9));

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

  exports.content = content;
  exports.weakly = weakly;
  require.E(exports).default = wire;
}, function (global, require, module, exports) {
  // shared/constants.js
  'use strict';
  // Node.CONSTANTS (not every engine has Node)

  var ELEMENT_NODE = 1;
  exports.ELEMENT_NODE = ELEMENT_NODE;
  var ATTRIBUTE_NODE = 2;
  exports.ATTRIBUTE_NODE = ATTRIBUTE_NODE;
  var TEXT_NODE = 3;
  exports.TEXT_NODE = TEXT_NODE;
  var COMMENT_NODE = 8;
  exports.COMMENT_NODE = COMMENT_NODE;
  var DOCUMENT_FRAGMENT_NODE = 11;
  exports.DOCUMENT_FRAGMENT_NODE = DOCUMENT_FRAGMENT_NODE;

  // SVG related constants
  var OWNER_SVG_ELEMENT = 'ownerSVGElement';
  exports.OWNER_SVG_ELEMENT = OWNER_SVG_ELEMENT;
  var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  exports.SVG_NAMESPACE = SVG_NAMESPACE;

  // Custom Elements / MutationObserver constants
  var CONNECTED = 'connected';
  exports.CONNECTED = CONNECTED;
  var DISCONNECTED = 'dis' + CONNECTED;
  exports.DISCONNECTED = DISCONNECTED;

  // hyperHTML related constants
  var SHOULD_USE_ATTRIBUTE = /^style$/i;
  exports.SHOULD_USE_ATTRIBUTE = SHOULD_USE_ATTRIBUTE;
  var SHOULD_USE_TEXT_CONTENT = /^style|textarea$/i;
  exports.SHOULD_USE_TEXT_CONTENT = SHOULD_USE_TEXT_CONTENT;
  var EXPANDO = '_hyper: ';
  exports.EXPANDO = EXPANDO;
  var UID = EXPANDO + (Math.random() * new Date() | 0) + ';';
  exports.UID = UID;
  var UIDC = '<!--' + UID + '-->';
  exports.UIDC = UIDC;
}, function (global, require, module, exports) {
  // shared/poorlyfills.js
  'use strict';

  var _require7 = require(4),
      UID = _require7.UID;

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
  exports.Event = Event;

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
  exports.Map = Map;

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
  exports.WeakMap = WeakMap;

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
  exports.WeakSet = WeakSet;

  // TODO: which browser needs these partial polyfills here?
  var isArray = Array.isArray || function (toString) {
    return function (arr) {
      return toString.call(arr) === '[object Array]';
    };
  }({}.toString);
  exports.isArray = isArray;

  var trim = UID.trim || function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
  exports.trim = trim;
}, function (global, require, module, exports) {
  // shared/easy-dom.js
  'use strict';

  var create = function create(node, type) {
    return doc(node).createElement(type);
  };
  exports.create = create;
  var doc = function doc(node) {
    return node.ownerDocument || node;
  };
  exports.doc = doc;
  var fragment = function fragment(node) {
    return doc(node).createDocumentFragment();
  };
  exports.fragment = fragment;
  var text = function text(node, _text) {
    return doc(node).createTextNode(_text);
  };
  exports.text = text;
}, function (global, require, module, exports) {
  // shared/utils.js
  'use strict';

  var _require8 = require(4),
      OWNER_SVG_ELEMENT = _require8.OWNER_SVG_ELEMENT,
      SVG_NAMESPACE = _require8.SVG_NAMESPACE,
      UID = _require8.UID,
      UIDC = _require8.UIDC;

  var _require9 = require(8),
      hasAppend = _require9.hasAppend,
      hasContent = _require9.hasContent,
      hasDoomedCloneNode = _require9.hasDoomedCloneNode,
      hasImportNode = _require9.hasImportNode;

  var _require10 = require(6),
      create = _require10.create,
      doc = _require10.doc,
      fragment = _require10.fragment;

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
  exports.append = append;

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
  exports.createFragment = createFragment;

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
  var importNode = hasImportNode ? function (doc, node) {
    return doc.importNode(node, true);
  } : function (doc, node) {
    return cloneNode(node);
  };
  exports.importNode = importNode;

  var slice = [].slice;
  exports.slice = slice;

  // lazy evaluated
  var unique = function unique(template) {
    return _TL(template);
  };
  exports.unique = unique;
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
}, function (global, require, module, exports) {
  // shared/features-detection.js
  'use strict';

  var _require11 = require(6),
      create = _require11.create,
      fragment = _require11.fragment,
      text = _require11.text;

  var testFragment = fragment(document);

  // DOM4 node.append(...many)
  var hasAppend = 'append' in testFragment;
  exports.hasAppend = hasAppend;

  // detect old browsers without HTMLTemplateElement content support
  var hasContent = 'content' in create(document, 'template');
  exports.hasContent = hasContent;

  // If attributes order is shuffled, threat the browser differently
  // Usually this is a well known IE/Edge only issue but some older FF does the same.
  var p = create(document, 'p');
  p.innerHTML = '<i data-i="" class=""></i>';
  var hasDoomedAttributes = /class/i.test(p.firstChild.attributes[0].name);
  exports.hasDoomedAttributes = hasDoomedAttributes;

  // IE 11 has problems with cloning templates: it "forgets" empty childNodes
  testFragment.appendChild(text(testFragment, 'g'));
  testFragment.appendChild(text(testFragment, ''));
  var hasDoomedCloneNode = testFragment.cloneNode(true).childNodes.length === 1;
  exports.hasDoomedCloneNode = hasDoomedCloneNode;

  // old browsers need to fallback to cloneNode
  // Custom Elements V0 and V1 will work polyfilled
  var hasImportNode = 'importNode' in document;
  exports.hasImportNode = hasImportNode;
}, function (global, require, module, exports) {
  // hyper/render.js
  'use strict';

  var _require12 = require(5),
      Map = _require12.Map,
      WeakMap = _require12.WeakMap;

  var _require13 = require(4),
      UIDC = _require13.UIDC;

  var Updates = require.I(require(10));

  var _require14 = require(7),
      createFragment = _require14.createFragment,
      importNode = _require14.importNode,
      unique = _require14.unique;

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

  require.E(exports).default = render;
}, function (global, require, module, exports) {
  // objects/Updates.js
  'use strict';

  var majinbuu = require.I(require(11));

  // TODO is .render() needed at all?
  //      cannot majinbuu handle hybrid lists?

  var _require15 = require(4),
      CONNECTED = _require15.CONNECTED,
      DISCONNECTED = _require15.DISCONNECTED,
      COMMENT_NODE = _require15.COMMENT_NODE,
      DOCUMENT_FRAGMENT_NODE = _require15.DOCUMENT_FRAGMENT_NODE,
      ELEMENT_NODE = _require15.ELEMENT_NODE,
      TEXT_NODE = _require15.TEXT_NODE,
      OWNER_SVG_ELEMENT = _require15.OWNER_SVG_ELEMENT,
      SHOULD_USE_ATTRIBUTE = _require15.SHOULD_USE_ATTRIBUTE,
      SHOULD_USE_TEXT_CONTENT = _require15.SHOULD_USE_TEXT_CONTENT,
      UID = _require15.UID,
      UIDC = _require15.UIDC;

  var Aura = require.I(require(12));
  var Component = require.I(require(1));
  var Path = require.I(require(13));
  var Transformer = require.I(require(2));

  var _require16 = require(6),
      text = _require16.text;

  var _require17 = require(5),
      Event = _require17.Event,
      WeakSet = _require17.WeakSet,
      isArray = _require17.isArray,
      trim = _require17.trim;

  var _require18 = require(7),
      createFragment = _require18.createFragment,
      slice = _require18.slice;

  var Promise = global.Promise;
  var components = new WeakSet();

  function Cache() {}
  Cache.prototype = Object.create(null);

  var asHTML = function asHTML(html) {
    return { html: html };
  };

  var create = function create(root, paths) {
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
          updates.push(setAttribute(node, info.name));
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
          findAttributes(child, paths, parts);
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

  var findAttributes = function findAttributes(node, paths, parts) {
    var cache = new Cache();
    var attributes = node.attributes;
    var array = slice.call(attributes);
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
        node.removeAttributeNode(attribute);
      }
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

  var optimist = function optimist(aura, value) {
    var length = aura.length;
    if (value.length !== length) {
      majinbuu(aura, value, Aura.MAX_LIST_SIZE);
    } else {
      for (var i = 0; i < length--; i++) {
        if (aura[length] !== value[length] || aura[i] !== value[i]) {
          majinbuu(aura, value, Aura.MAX_LIST_SIZE);
          return;
        }
      }
    }
  };

  var setAnyContent = function setAnyContent(node, childNodes) {
    var aura = new Aura(node, childNodes);
    var oldValue = void 0;
    var anyContent = function anyContent(value) {
      switch (typeof value) {
        case 'string':
        case 'number':
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
              aura.splice(0, length, text(node, value));
            } else {
              node.parentNode.insertBefore(childNodes[0] = text(node, value), node);
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
                  anyContent({ html: value });
                  break;
                case 'object':
                  if (isArray(value[0])) {
                    value = value.concat.apply([], value);
                  }
                  if (isPromise_ish(value[0])) {
                    Promise.all(value).then(anyContent);
                    break;
                  } else {
                    for (var i = 0, _length = value.length; i < _length; i++) {
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
            optimist(aura, value.nodeType === DOCUMENT_FRAGMENT_NODE ? slice.call(value.childNodes) : [value]);
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
            var fragment = createFragment(node, [].concat(value.html).join(''));
            childNodes.push.apply(childNodes, fragment.childNodes);
            node.parentNode.insertBefore(fragment, node);
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

  var setAttribute = function setAttribute(node, name) {
    var isData = name === 'data';
    var oldValue = void 0;
    if (!isData && /^on/.test(name)) {
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
    } else if (isData || isSpecial(node, name) && !SHOULD_USE_ATTRIBUTE.test(name)) {
      return function (newValue) {
        if (oldValue !== newValue) {
          oldValue = newValue;
          if (node[name] !== newValue) {
            node[name] = newValue;
          }
        }
      };
    } else {
      var noOwner = true;
      var attribute = node.ownerDocument.createAttribute(name);
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

  require.E(exports).default = { create: create, find: find };
}, function (global, require, module, exports) {
  // ../node_modules/majinbuu/cjs/main.js
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
      };
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

  require.E(exports).default = majinbuu;
  exports.aura = aura;
  exports.majinbuu = majinbuu;
}, function (global, require, module, exports) {
  // classes/Aura.js
  'use strict';

  var majinbuu = require.I(require(11));

  function Aura(node, childNodes) {
    this.node = node;
    this.childNodes = childNodes;
    childNodes.become = become;
    return majinbuu.aura(this, childNodes);
  }

  Aura.MAX_LIST_SIZE = 999;

  Aura.prototype.splice = function splice(start, end) {
    var ph = this.node;
    var cn = this.childNodes;
    var target = cn[start + (end || 0)] || ph;
    var result = cn.splice.apply(cn, arguments);
    var pn = ph.parentNode;
    var doc = pn.ownerDocument;
    for (var tmp, i = 0, length = result.length; i < length; i++) {
      tmp = result[i];
      if (cn.indexOf(tmp) < 0) {
        pn.removeChild(tmp);
      }
    }
    for (var _tmp, _i = 2, _length2 = arguments.length; _i < _length2; pn.insertBefore(_tmp, target)) {
      if (_length2 - _i === 1) {
        _tmp = arguments[_i++];
      } else {
        _tmp = doc.createDocumentFragment();
        while (_i < _length2) {
          _tmp.appendChild(arguments[_i++]);
        }
      }
    }
    return result;
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

  require.E(exports).default = Aura;
}, function (global, require, module, exports) {
  // objects/Path.js
  'use strict';

  var _require19 = require(4),
      COMMENT_NODE = _require19.COMMENT_NODE,
      DOCUMENT_FRAGMENT_NODE = _require19.DOCUMENT_FRAGMENT_NODE,
      ELEMENT_NODE = _require19.ELEMENT_NODE;

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

  require.E(exports).default = {
    create: function create(type, node, name) {
      return { type: type, name: name, path: createPath(node) };
    },
    find: function find(node, path) {
      var length = path.length;
      for (var i = 0; i < length; i++) {
        node = node[path[i++]][path[i]];
      }
      return node;
    }
  };
}]);
