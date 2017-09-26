var hyperHTML = (function (globalDocument, majinbuu) {'use strict';

  /*! (c) 2017 Andrea Giammarchi @WebReflection, (ISC) */

  // ---------------------------------------------
  // hyperHTML Public API
  // ---------------------------------------------

  // The document must be swap-able at runtime.
  // Needed by both basicHTML and nativeHTML
  hyper.document = globalDocument;

  // friendly destructuring
  hyper.hyper = hyper;

  function hyper(HTML) {
    return arguments.length < 2 ?
      (HTML == null ?
        wireContent('html') :
        (typeof HTML === 'string' ?
          wire(null, HTML) :
          ('raw' in HTML ?
            wireContent('html')(HTML) :
            ('nodeType' in HTML ?
              bind(HTML) :
              wireWeakly(HTML, 'html')
            )
          )
        )) :
      ('raw' in HTML ?
        wireContent('html') : wire
      ).apply(null, arguments);
  }

  // hyper.adopt(el) 🐣
  // import an already live DOM structure
  // described as TL
  hyper.adopt = function adopt(node) {
    return function () {
      notAdopting = false;
      render.apply(node, arguments);
      notAdopting = true;
      return node;
    };
  };

  // hyper.bind(el) ⚡️
  // render TL inside a DOM node used as context
  hyper.bind = bind;
  function bind(context) { return render.bind(context); }

  // hyper.define('transformer', callback) 🌀
  hyper.define = function define(transformer, callback) {
    if (!(transformer in transformers)) {
      transformersKeys.push(transformer);
    }
    transformers[transformer] = callback;
    // TODO: else throw ? console.warn ? who cares ?
  };

  // hyper.escape('<html>') => '&lt;text&gt;' 🏃
  hyper.escape = function escape(html) {
    return html.replace(/[&<>'"]/g, fnEscape);
  };

  // hyper.wire(obj, 'type:ID') ➰
  // relate a renderer to a generic object
  hyper.wire = wire;
  function wire(obj, type) {
    return arguments.length < 1 ?
      wireContent('html') :
      (obj == null ?
        wireContent(type || 'html') :
        wireWeakly(obj, type || 'html')
      );
  }

  // hyper.Component([initialState]) 🍻
  // An overly-simplified Component class.
  // For full Custom Elements support
  // see HyperHTMLElement instead.
  hyper.Component = Component;
  function Component() {}
  Object.defineProperties(
    Component.prototype,
    {
      // same as HyperHTMLElement handleEvent
      handleEvent: {value: function (e) {
        // both IE < 11 and JSDOM lack dataset
        var ct = e.currentTarget;
        this[
          ('getAttribute' in ct && ct.getAttribute('data-call')) ||
          ('on' + e.type)
        ](e);
      }},
      // returns its own HTML wire or create it once on comp.render()
      html: lazyGetter('html', wireContent),
      // returns its own SVG wire or create it once on comp.render()
      svg: lazyGetter('svg', wireContent),
      // same as HyperHTMLElement state
      state: lazyGetter('state', function () { return this.defaultState; }),
      // same as HyperHTMLElement get defaultState
      defaultState: {get: function () { return {}; }},
      // same as HyperHTMLElement setState
      setState: {value: function (state) {
        var target = this.state;
        var source = typeof state === 'function' ? state.call(this, target) : state;
        for (var key in source) target[key] = source[key];
        this.render();
      }}
      // the render must be defined when extending hyper.Component
      // the render **must** return either comp.html or comp.svg wire
      // render() { return this.html`<p>that's it</p>`; }
    }
  );

  // - - - - - - - - - - - - - - - - - - - - - - -

  // ---------------------------------------------
  // Constants
  // ---------------------------------------------

  // Node.CONSTANTS
  // without assuming Node is globally available
  // since this project is used on the backend too
  var ELEMENT_NODE = 1;
  var ATTRIBUTE_NODE = 2;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  var DOCUMENT_FRAGMENT_NODE = 11;

  // SVG related
  var OWNER_SVG_ELEMENT = 'ownerSVGElement';
  var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

  var SHOULD_USE_ATTRIBUTE = /^style$/i;
  var EXPANDO = '_hyper: ';
  var UID = EXPANDO + ((Math.random() * new Date) | 0) + ';';
  var UIDC = '<!--' + UID + '-->';

  // ---------------------------------------------
  // DOM Manipulation
  // ---------------------------------------------

  function Aura(node, childNodes) {
    this.node = node;
    this.childNodes = childNodes;
    return majinbuu.aura(this, childNodes);
  }

  Aura.prototype.splice = function splice(start) {
    for (var
      tmp,
      ph = this.node,
      cn = this.childNodes,
      target = cn[start + (arguments[1] || 0)] || ph,
      result = cn.splice.apply(cn, arguments),
      pn = ph.parentNode,
      i = 0,
      length = result.length;
      i < length; i++
    ) {
      tmp = result[i];
      // TODO: this is not optimal (but necessary)
      if (cn.indexOf(tmp) < 0) {
        pn.removeChild(tmp);
      }
    }
    i = 2;
    length = arguments.length;
    if (i < length) {
      if ((length - i) === 1) {
        tmp = arguments[i];
      } else {
        tmp = createDocumentFragment(pn.ownerDocument);
        while (i < length) {
          tmp.appendChild(arguments[i++]);
        }
      }
      pn.insertBefore(tmp, target);
    }
    return result;
  };

  // ---------------------------------------------
  // hyperHTML Operations
  // ---------------------------------------------

  // entry point for all TL => DOM operations
  function render(template) {
    var hyper = hypers.get(this);
    if (
      !hyper ||
      hyper.template !== TL(template)
    ) {
      hyper = upgrade.apply(this, arguments);
      hypers.set(this, hyper);
    }
    update.apply(hyper.updates, arguments);
    return this;
  }

  // `<div class="${'attr'}"></div>`
  // `<div onclick="${function () {... }}"></div>`
  // `<div onclick="${{handleEvent(){ ... }}}"></div>`
  // `<div contenteditable="${true}"></div>`
  function setAttribute(attribute, removeAttributes, name) {
    var
      node = attribute.ownerElement,
      isData = name === 'data',
      isEvent = !isData && /^on/.test(name),
      isSpecial = isData ||
                  (isSpecialAttribute(node, name) &&
                  !SHOULD_USE_ATTRIBUTE.test(name)),
      type = isEvent ? name.slice(2) : '',
      noOwner = isSpecial || isEvent,
      wontUpgrade = isSpecial && (isData || name in node),
      oldValue
    ;
    if (isEvent || wontUpgrade) {
      removeAttributes.push(node, name);
      if (isEvent) {
        if (type === CONNECTED || type === DISCONNECTED) {
          components.add(node);
        }
        else if (name.toLowerCase() in node) {
          type = type.toLowerCase();
        }
      }
    }
    return isEvent ?
      function eventAttr(newValue) {
        if (oldValue !== newValue) {
          if (oldValue) node.removeEventListener(type, oldValue, false);
          oldValue = newValue;
          if (newValue) node.addEventListener(type, newValue, false);
        }
      } :
      (isSpecial ?
        function specialAttr(newValue) {
          if (wontUpgrade) {
            if (oldValue !== newValue) {
              oldValue = newValue;
              // WebKit moves the cursor if input.value
              // is set again, even if same value
              if (node[name] !== newValue) {
                // let the browser handle the case
                // input.value = null;
                // input.value; // ''
                if (newValue == null) {
                  // reflect the null intent,
                  // do not pass undefined!
                  node[name] = null;
                  node.removeAttribute(name);
                } else {
                  node[name] = newValue;
                }
              }
            }
          } else {
            wontUpgrade = name in node;
            if (wontUpgrade) {
              specialAttr(newValue);
            } else {
              attribute.value = newValue;
              node[name] = newValue;
            }
          }
        } :
        function normalAttr(newValue) {
          if (oldValue !== newValue) {
            oldValue = newValue;
            // avoid triggering again attributeChangeCallback
            // if the value was identical
            if (attribute.value !== newValue) {
              if (newValue == null) {
                if (!noOwner) {
                  // TODO: should attribute.value = null here?
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
        }
      );
  }

  // `<style>${'text'}</style>`
  function setTextContent(node) {
    var oldValue;
    return function (value) {
      if (value !== oldValue) {
        oldValue = value;
        node.textContent = value;
      }
    };
  }

  // `<p>${'any'}</p>`
  // `<li>a</li>${'virtual'}<li>c</li>`
  function setAnyContent(node, childNodes, aura) {
    var oldValue;
    return function anyContent(value) {
      switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
          var length = childNodes.length;
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
              aura.splice(0, length, createText(node, value));
            } else {
              childNodes[0] = node.parentNode.insertBefore(
                createText(node, value),
                node
              );
            }
          }
          break;
        case 'function':
          anyContent(value(node.parentNode, childNodes, 0));
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
            var length = value.length;
            if (length === 0) {
              aura.splice(0);
            } else {
              switch (typeof value[0]) {
                case 'string':
                case 'number':
                case 'boolean':
                  anyContent({html: value});
                  break;
                case 'function':
                  var parentNode = node.parentNode;
                  for (var i = 0; i < length; i++) {
                    value[i] = value[i](parentNode, childNodes, i);
                  }
                  anyContent(value.concat.apply([], value));
                  break;
                case 'object':
                  if (isArray(value[0])) {
                    value = value.concat.apply([], value);
                  }
                  if (isPromise_ish(value[0])) {
                    Promise.all(value).then(anyContent);
                    break;
                  } else {
                    for (var i = 0, length = value.length; i < length; i++) {
                      if (value[i] instanceof Component) {
                        value[i] = value[i].render();
                      }
                    }
                  }
                default:
                  majinbuu(aura, value, hyper.MAX_LIST_SIZE);
                  break;
              }
            }
          } else if (isNode_ish(value)) {
            majinbuu(
              aura,
              value.nodeType === DOCUMENT_FRAGMENT_NODE ?
                slice.call(value.childNodes) :
                [value],
              hyper.MAX_LIST_SIZE
            );
          } else if (isPromise_ish(value)) {
            value.then(anyContent);
          } else if ('placeholder' in value) {
            invokeAtDistance(anyContent, value);
          } else if ('text' in value) {
            anyContent(String(value.text));
          } else if ('any' in value) {
            anyContent(value.any);
          } else if ('html' in value) {
            var html = [].concat(value.html).join('');
            aura.splice(0);
            var fragment = createFragment(node, html);
            childNodes.push.apply(childNodes, fragment.childNodes);
            node.parentNode.insertBefore(fragment, node);
          } else if ('length' in value) {
            anyContent(slice.call(value));
          } else {
            anyContent(invokeTransformer(value));
          }
          break;
      }
    };
  }

  // ---------------------------------------------
  // DOM Traversing
  // ---------------------------------------------

  // look for attributes that contains the comment text
  function attributesSeeker(node, paths, parts) {
    for (var
      name, attrs,
      attribute,
      value = UID,
      attributes = node.attributes,
      i = 0, length = attributes.length;
      i < length; i++
    ) {
      attribute = attributes[i];
      if (attribute.value === value) {
        name = parts.shift().replace(/^(?:|[\S\s]*?\s)(\S+?)=['"]?$/, '$1');
        attrs = node.attributes;
        paths.push(
          Path(
            'attr',
            // fallback is needed in both jsdom
            // and in not-so-standard browsers/engines
            attrs[name] || attrs[name.toLowerCase()],
            name
          )
        );
      }
    }
  }

  // walk the fragment tree in search of comments
  function hyperSeeker(node, paths, parts) {
    for (var
      child,
      childNodes = node.childNodes,
      length = childNodes.length,
      i = 0; i < length; i++
    ) {
      child = childNodes[i];
      switch (child.nodeType) {
        case ELEMENT_NODE:
          attributesSeeker(child, paths, parts);
          hyperSeeker(child, paths, parts);
          break;
        case COMMENT_NODE:
          if (child.textContent === UID) {
            parts.shift();
            paths.push(Path('any', child));
          }
          break;
        case TEXT_NODE:
          if (
            SHOULD_USE_ATTRIBUTE.test(node.nodeName) &&
            trim.call(child.textContent) === UIDC
          ) {
            parts.shift();
            paths.push(Path('text', node));
          }
          break;
      }
    }
  }

  // ---------------------------------------------
  // Features detection / ugly UA sniffs
  // ---------------------------------------------
  var featureFragment = createDocumentFragment(globalDocument);

  // Firefox < 55 has non standard template literals.
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1108941
  // TODO: is there any better way to feature detect this ?
  var FF = typeof navigator === 'object' &&
            /Firefox\/(\d+)/.test(navigator.userAgent) &&
            parseFloat(RegExp.$1) < 55;

  // If attributes order is shuffled, threat the browser differently
  // Usually this is a well known IE only limitation but some older FF does the same.
  var IE =  (function () {
              var p  = globalDocument.createElement('p');
              p.innerHTML = '<i data-i="" class=""></i>';
              return /class/i.test(p.firstChild.attributes[0].name);
            }());


  // beside IE, old WebKit browsers don't have `children` in DocumentFragment
  var WK = !('children' in featureFragment);

  // both Firefox < 55 and TypeScript have issues with template literals
  // this lazy defined callback should spot issues right away
  // and in the best case scenario become a no-op
  var TL = function (template) {
    if (template.propertyIsEnumerable('raw') || FF) TL = unique;
    else TL = function (t) { return t; };
    return TL(template);
  };

  // ---------------------------------------------
  // Helpers
  // ---------------------------------------------

  // used to convert childNodes to Array
  var slice = [].slice;

  // used to sanitize html
  var oEscape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  };
  function fnEscape(m) {
    return oEscape[m];
  }

  // return content as html
  function asHTML(html) {
    return {html: html};
  }

  // return a single node or an Array or nodes
  function createContent(node) {
    for (var
      child,
      content = [],
      childNodes = node.childNodes,
      i = 0,
      length = childNodes.length;
      i < length; i++
    ) {
      child = childNodes[i];
      if (
        child.nodeType === ELEMENT_NODE ||
        trim.call(child.textContent).length !== 0
      ) {
        content.push(child);
      }
    }
    return content.length === 1 ? content[0] : content;
  }

  // just a minifier friendly indirection
  function createDocumentFragment(document) {
    return document.createDocumentFragment();
  }

  // given a node, inject some html and return
  // the resulting template document fragment
  function createFragment(node, html) {
    return (
      OWNER_SVG_ELEMENT in node ?
        createSVGFragment :
        createHTMLFragment
    )(node, html.replace(no, comments));
  }

  // create fragment for HTML
  function createHTMLFragment(node, html) {
    var fragment;
    var document = node.ownerDocument;
    var container = document.createElement('template');
    var hasContent = 'content' in container;
    var needsTableWrap = false;
    if (!hasContent) {
      // DO NOT MOVE THE FOLLOWING LINE ELSEWHERE
      fragment = createDocumentFragment(document);
      // (a jsdom + nodejs tests coverage gotcha)

      // el.innerHTML = '<td></td>'; is not possible
      // if the content is a partial internal table content
      // it needs to be wrapped around once injected.
      // HTMLTemplateElement does not suffer this issue.
      needsTableWrap = /^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(html);
    }
    if (needsTableWrap) {
      // secure the RegExp.$1 result ASAP to avoid issues
      // in case a non-browser DOM library uses RegExp internally
      // when HTML content is injected (basicHTML / jsdom / others...)
      var selector = RegExp.$1;
      container.innerHTML = '<table>' + html + '</table>';
      appendNodes(fragment, slice.call(container.querySelectorAll(selector)));
    } else {
      container.innerHTML = html;
      if (hasContent) {
        fragment = container.content;
      } else {
        appendNodes(fragment, slice.call(container.childNodes));
      }
    }
    return fragment;
  }

  // create a fragment for SVG
  function createSVGFragment(node, html) {
    var document = node.ownerDocument;
    var fragment = createDocumentFragment(document);
    if (IE || WK) {
      var container = document.createElement('div');
      container.innerHTML = '<svg xmlns="' + SVG_NAMESPACE + '">' + html + '</svg>';
      appendNodes(fragment, slice.call(container.firstChild.childNodes));
    } else {
      var container = document.createElementNS(SVG_NAMESPACE, 'svg');
      container.innerHTML = html;
      appendNodes(fragment, slice.call(container.childNodes));
    }
    return fragment;
  }

  // given a node, it does what is says
  function createText(node, text) {
    return node.ownerDocument.createTextNode(text);
  }

  // dispatch same event through a list of nodes
  function dispatchAll(nodes, type) {
    for (var
      e, node,
      i = 0, length = nodes.length;
      i < length; i++
    ) {
      node = nodes[i];
      if (components.has(node)) {
        node.dispatchEvent(e || (e = new $Event(type)));
      }
    }
  }

  // returns current customElements reference
  // compatible with basicHTML too
  function getCEClass(node) {
    var doc = hyper.document;
    var ce = doc.customElements || doc.defaultView.customElements;
    return ce && ce.get(node.nodeName.toLowerCase());
  }

  // verify that an attribute has
  // a special meaning for the node
  function isSpecialAttribute(node, name) {
    var notSVG = !(OWNER_SVG_ELEMENT in node);
    if (notSVG && /-/.test(node.nodeName)) {
      var Class = getCEClass(node);
      if (Class) node = Class.prototype;
    }
    return notSVG && name in node;
  }

  // use a placeholder and resolve with the right callback
  function invokeAtDistance(callback, value) {
    callback(value.placeholder);
    if ('text' in value) {
      Promise.resolve(value.text).then(String).then(callback);
    } else if ('any' in value) {
      Promise.resolve(value.any).then(callback);
    } else if ('html' in value) {
      Promise.resolve(value.html).then(asHTML).then(callback);
    } else {
      Promise.resolve(invokeTransformer(value)).then(callback);
    }
  }

  // last attempt to transform content
  function invokeTransformer(object) {
    for (var key, i = 0, length = transformersKeys.length; i < length; i++) {
      key = transformersKeys[i];
      if (object.hasOwnProperty(key)) {
        return transformers[key](object[key]);
      }
    }
  }

  // quick and dirty Node check
  function isNode_ish(value) {
    return 'ELEMENT_NODE' in value;
  }

  // quick and dirty Promise check
  function isPromise_ish(value) {
    return value != null && 'then' in value;
  }

  // return a descriptor that lazily initialize a property
  // unless it hasn't be previously set directly
  function lazyGetter(type, fn) {
    var secret = '_' + type + '$';
    return {
      get: function () {
        return this[secret] || (this[type] = fn.call(this, type));
      },
      set: function (value) {
        defineProperty(this, secret, {configurable: true, value: value});
      }
    };
  }

  // remove a list of [node, attribute]
  function removeAttributeList(list) {
    for (var i = 0, length = list.length; i < length; i++) {
      list[i++].removeAttribute(list[i]);
    }
  }

  // specify the content to update
  function setContent(info, target, removeAttributes, childNodes) {
    var update;
    switch (info.type) {
      case 'any':
        // TODO: don't pass the target, it shouldn't be needed
        update = setAnyContent(target, childNodes, new Aura(target, childNodes));
        break;
      case 'attr':
        update = setAttribute(target, removeAttributes, info.name);
        break;
      case 'text':
        update = setTextContent(target);
        break;
    }
    return update;
  }

  // used for common path creation.
  function Path(type, node, name) {
    return {type: type, path: createPath(node), name: name};
  }

  // ---------------------------------------------
  // Hybrid Shims
  // ---------------------------------------------

  var CONNECTED = 'connected';
  var DISCONNECTED = 'dis' + CONNECTED;
  var $Event;

  try {
    new Event(CONNECTED);
    $Event = Event;
  } catch(o_O) {
    $Event = function (type) {
      var e = hyper.document.createEvent('Event');
      e.initEvent(type, false, false);
      return e;
    };
  }

  try {
    (new MutationObserver(function (records) {
      for (var record, i = 0, length = records.length; i < length; i++) {
        record = records[i];
        dispatchAll(record.removedNodes, DISCONNECTED);
        dispatchAll(record.addedNodes, CONNECTED);
      }
    })).observe(globalDocument, {subtree: true, childList: true});
  } catch(o_O) {
    globalDocument.addEventListener('DOMNodeInserted', function (e) {
      dispatchAll([e.target], CONNECTED);
    }, false);
    globalDocument.addEventListener('DOMNodeRemoved', function (e) {
      dispatchAll([e.target], DISCONNECTED);
    }, false);
  }

  // WeakMap with partial EXPANDO fallback
  var $WeakMap = typeof WeakMap === typeof $WeakMap ?
      function () {
        return {
          get: function (obj) { return obj[EXPANDO]; },
          set: function (obj, value) {
            Object.defineProperty(obj, EXPANDO, {
              configurable: true,
              value: value
            });
          }
        };
      } :
      WeakMap;

  var $WeakSet = typeof WeakSet === typeof $WeakSet ?
      function () {
        var wm = new $WeakMap;
        return {
          add: function (obj) { wm.set(obj, true); },
          has: function (obj) { return wm.get(obj) === true; }
        };
      } :
      WeakSet;

  // Map with partial double Array fallback
  var $Map = typeof Map === typeof $Map ?
      function () {
        var k = [], v = [];
        return {
          get: function (obj) {
            return v[k.indexOf(obj)];
          },
          // being used with unique template literals
          // there is never a case when a value is overwritten
          // no need to check upfront for the indexOf
          set: function (obj, value) {
            v[k.push(obj) - 1] = value;
          }
        };
      } :
      Map;

  // TODO: which browser needs these partial polyfills here?

  // BB7 and webOS need this
  var isArray = Array.isArray ||
                (function () {
                  var toString = {}.toString;
                  // I once had an engine returning [array Array]
                  // and I've got scared since!
                  var s = toString.call([]);
                  return function (a) {
                    return toString.call(a) === s;
                  };
                }());

  // older WebKit need this
  var trim = EXPANDO.trim ||
              function () { return this.replace(/^\s+|\s+$/g, ''); };

  // ---------------------------------------------
  // Shared variables
  // ---------------------------------------------

  // recycled defineProperty shortcut
  var defineProperty = Object.defineProperty;

  // transformers registry
  var transformers = {};
  var transformersKeys = [];

  // normalize Firefox issue with template literals
  var templateObjects = {}, unique;
  function unique(template) {
    var key = '_' + template.join(UIDC);
    return templateObjects[key] ||
          (templateObjects[key] = template);
  }

  // use native .append(...childNodes) where available
  var appendNodes = 'append' in featureFragment ?
      function (node, childNodes) {
        node.append.apply(node, childNodes);
      } :
      function appendNodes(node, childNodes) {
        for (var
          i = 0,
          length = childNodes.length;
          i < length; i++
        ) {
          node.appendChild(childNodes[i]);
        }
      };

  // returns children or retrieve them in IE/Edge
  var getChildren = WK || IE ?
      function (node) {
        for (var
          child,
          children = [],
          childNodes = node.childNodes,
          j = 0, i = 0, length = childNodes.length;
          i < length; i++
        ) {
          child = childNodes[i];
          if (child.nodeType === ELEMENT_NODE)
            children[j++] = child;
        }
        return children;
      } :
      function (node) { return node.children; };

  // return the correct node walking through a path
  // fixes IE/Edge issues with attributes and children (fixes old WebKit too)
  var getNode = IE || WK ?
      function (parentNode, path) {
        for (var name, i = 0, length = path.length; i < length; i++) {
          name = path[i++];
          switch (name) {
            case 'children':
              parentNode = getChildren(parentNode)[path[i]];
              break;
            default:
              parentNode = parentNode[name][path[i]];
              break;
          }
        }
        return parentNode;
      } :
      function (parentNode, path) {
        for (var i = 0, length = path.length; i < length; i++) {
          parentNode = parentNode[path[i++]][path[i]];
        }
        return parentNode;
      };

  // sanitizes interpolations as comments
  var no = /(<[a-z]+[a-z0-9:_-]*)((?:[^\S]+[a-z0-9:_-]+(?:=(?:'.*?'|".*?"|<.+?>|\S+))?)+)([^\S]*\/?>)/gi;
  var findAttributes = new RegExp('([^\\S][a-z]+[a-z0-9:_-]*=)([\'"]?)' + UIDC + '\\2', 'gi');
  var comments = function ($0, $1, $2, $3) {
    return $1 + $2.replace(findAttributes, replaceAttributes) + $3;
  };

  var replaceAttributes = function ($0, $1, $2) {
    return $1 + ($2 || '"') + UID + ($2 || '"');
  };

  // list of components with connected/disconnected
  var components = new $WeakSet;

  // [element] = {template, updates};
  var hypers = new $WeakMap;

  // [element] = {template, updates};
  var wires = new $WeakMap;

  // [template] = {fragment, paths};
  var templates = new $Map;

  // internal signal to switch adoption
  var notAdopting = true;

  // IE 11 has problems with cloning templates too
  // it "forgets" empty childNodes
  var cloneNode = (function () {
    featureFragment.appendChild(createText(featureFragment, 'g'));
    featureFragment.appendChild(createText(featureFragment, ''));
    return featureFragment.cloneNode(true).childNodes.length === 1 ?
      function (node) {
        for (var
          clone = node.cloneNode(),
          childNodes = node.childNodes || [],
          i = 0, length = childNodes.length;
          i < length; i++
        ) {
          clone.appendChild(cloneNode(childNodes[i]));
        }
        return clone;
      } :
      function (fragment) {
        return fragment.cloneNode(true);
      };
  }());

  // ---------------------------------------------
  // Adopting Nodes
  // ---------------------------------------------

  // IE/Edge gotcha with comment nodes
  var nextElementSibling = IE ?
    function (node) {
      while (node = node.nextSibling) {
        if (node.nodeType === ELEMENT_NODE) return node;
      }
      return undefined;
    } :
    function (node) { return node.nextElementSibling; };

  var previousElementSibling = IE ?
    function (node) {
      while (node = node.previousSibling) {
       if (node.nodeType === ELEMENT_NODE) return node;
      }
      return undefined;
    } :
    function (node) { return node.previousElementSibling; };

  // remove all text nodes from a virtual space
  function removePreviousText(parentNode, node) {
    var previousSibling = node.previousSibling;
    if (previousSibling && previousSibling.nodeType === TEXT_NODE) {
      parentNode.removeChild(previousSibling);
      removePreviousText(parentNode, node);
    }
  }

  // avoid errors on obsolete platforms
  function insertBefore(parentNode, target, after) {
    if (after) {
      parentNode.insertBefore(target, after);
    } else {
      parentNode.appendChild(target);
    }
  }

  // given an info, tries to find out the best option
  // to replace or update the content
  function discoverNode(parentNode, virtual, info, childNodes) {
    for (var
      target = parentNode,
      document = parentNode.ownerDocument,
      path = info.path,
      virtualNode = getNode(virtual, path),
      i = 0,
      length = path.length;
      i < length; i++
    ) {
      switch (path[i++]) {
        case 'attributes':
          var name = virtualNode.name;
          if (!parentNode.hasAttribute(name)) {
            parentNode.setAttribute(name, '');
          }
          target = parentNode.attributes[name];
          break;
        case 'childNodes':
          var children = getChildren(parentNode);
          var virtualChildren = getChildren(virtualNode.parentNode);
          target = previousElementSibling(virtualNode);
          var before = target ? (path.indexOf.call(virtualChildren, target) + 1) : -1;
          target = nextElementSibling(virtualNode);
          var after = target ? path.indexOf.call(virtualChildren, target) : -1;
          target = document.createComment(UID);
          switch (true) {
            // `${'virtual'}` is actually resolved as `${'any'}`
            // case before < 0 && after < 0: before = 0;

            // `</a>${'virtual'}`
            case after < 0:
              after = children.length;
              break;
            // `${'virtual'}<b>`
            case before < 0:
              before = 0;
            // `</a>${'virtual'}<b>`
            default:
              after = -(virtualChildren.length - after);
              break;
          }
          childNodes.push.apply(
            childNodes,
            slice.call(children, before, after)
          );
          if (childNodes.length) {
            insertBefore(
              parentNode,
              target,
              nextElementSibling(childNodes[childNodes.length - 1])
            );
          } else {
            insertBefore(
              parentNode,
              target,
              slice.call(children, after)[0]
            );
          }
          if (childNodes.length === 0) {
            removePreviousText(parentNode, target);
          }
          break;
        default:
          // if the node is not there, create it
          target = getChildren(parentNode)[path[i]] ||
                    parentNode.appendChild(
                      parentNode.ownerDocument.createElement(
                        getNode(virtual, path.slice(0, i + 1)).nodeName
                      )
                    );
          parentNode = target;
          break;
      }
    }
    return target;
  }

  // like createUpdates but for nodes with already a content
  function discoverUpdates(fragment, paths) {
    for (var
      info, childNodes,
      updates = [],
      removeAttributes = [],
      i = 0, length = paths.length;
      i < length; i++
    ) {
      childNodes = [];
      info = paths[i];
      updates[i] = setContent(
        info,
        discoverNode(this, fragment, info, childNodes),
        removeAttributes,
        childNodes
      );
    }
    removeAttributeList(removeAttributes);
    return updates;
  }

  // ---------------------------------------------
  // Template related utilities
  // ---------------------------------------------

  // given a unique template object
  // create, parse, and store retrieved info
  function createTemplate(template) {
    var paths = [];
    var fragment = createFragment(this, template.join(UIDC));
    var info = {fragment: fragment, paths: paths};
    hyperSeeker(fragment, paths, template.slice());
    templates.set(template, info);
    return info;
  }

  // given a generic node, returns a path capable
  // of retrieving such path back again.
  // TODO: worth passing the index when available ?
  function createPath(node) {
    var path = [];
    var parentNode;
    switch(node.nodeType) {
      case ELEMENT_NODE:
      case DOCUMENT_FRAGMENT_NODE:
        parentNode = node;
        break;
      case COMMENT_NODE:
        parentNode = node.parentNode;
        path.unshift(
          'childNodes',
          path.indexOf.call(parentNode.childNodes, node)
        );
        break;
      case ATTRIBUTE_NODE:
      default: // jsdom here does not provide a nodeType 2 ...
        parentNode = node.ownerElement;
        path.unshift('attributes', node.name);
        break;
    }
    for (
      node = parentNode;
      parentNode = parentNode.parentNode;
      node = parentNode
    ) {
      path.unshift('children', path.indexOf.call(getChildren(parentNode), node));
    }
    return path;
  }

  // given a root node and a list of paths
  // creates an array of updates to invoke
  // whenever the next interpolation happens
  function createUpdates(fragment, paths) {
    for (var
      info,
      updates = [],
      removeAttributes = [],
      i = 0, length = paths.length;
      i < length; i++
    ) {
      info = paths[i];
      updates[i] = setContent(
        info,
        getNode(fragment, info.path),
        removeAttributes,
        []
      );
    }
    removeAttributeList(removeAttributes);
    return updates;
  }

  // invokes each update function passing interpolated value
  function update() {
    for (var i = 1, length = arguments.length; i < length; i++) {
      this[i - 1](arguments[i]);
    }
  }

  // create a template, if unknown
  // upgrade a node to use such template for future updates
  function upgrade(template) {
    template = TL(template);
    var updates;
    var info =  templates.get(template) ||
                createTemplate.call(this, template);
    if (notAdopting) {
      var fragment = cloneNode(info.fragment);
      updates = createUpdates.call(this, fragment, info.paths);
      this.textContent = '';
      this.appendChild(fragment);
    } else {
      updates = discoverUpdates.call(this, info.fragment, info.paths);
    }
    return {template: template, updates: updates};
  }

  // ---------------------------------------------
  // Wires
  // ---------------------------------------------

  // create a new wire for generic DOM content
  function wireContent(type) {
    var adopter, content, container, fragment, render, setup, template;

    function before(document) {
      fragment = createDocumentFragment(document);
      container = type === 'svg' ?
        document.createElementNS(SVG_NAMESPACE, 'svg') :
        fragment;
      render = bind(container);
    }

    function after() {
      if (setup) {
        setup = false;
        if (type === 'svg') {
          appendNodes(fragment, slice.call(container.childNodes));
        }
        content = createContent(fragment);
      }
      return content;
    }

    return type === 'adopt' ?
      function adopt(statics) {
        var args = arguments;
        statics = TL(statics);
        if (template !== statics) {
          setup = true;
          template = statics;
          adopter = function (parentNode, children, i) {
            if (setup) {
              if (i < children.length) {
                container = children[i];
                fragment = {
                  ownerDocument: container.ownerDocument,
                  childNodes: [container],
                  children: [container]
                };
                render = hyper.adopt(fragment);
              } else {
                if (OWNER_SVG_ELEMENT in parentNode) type = 'svg';
                before(parentNode.ownerDocument);
              }
            }
            render.apply(null, args);
            return after();
          };
        }
        return adopter;
      } :
      function update(statics) {
        statics = TL(statics);
        if (template !== statics) {
          setup = true;
          template = statics;
          before(hyper.document);
        }
        render.apply(null, arguments);
        return after();
      };
  }

  // setup a weak reference if needed and return a wire by ID
  function wireWeakly(obj, type) {
    var wire = wires.get(obj);
    var i = type.indexOf(':');
    var id = type;
    if (-1 < i) {
      id = type.slice(i + 1);
      type = type.slice(0, i) || 'html';
    }
    if (!wire) {
      wire = {};
      wires.set(obj, wire);
    }
    return wire[id] || (wire[id] = wireContent(type));
  }

  // avoid processing too many nodes
  // this is about the algorithm used
  // to calculate the least amount of DOM
  // changes needed to show the a new list
  // where there was another one.
  // There is a limit, in terms of performance,
  // on how big can the optimal computation be,
  // so if you change this value be sure your
  // target hardware is good enough.
  hyper.MAX_LIST_SIZE = 1000;

  // ---------------------------------------------
  // ⚡️ ️️The End ➰
  // ---------------------------------------------
  return hyper;

}(document, function () {'use strict';

  /*! Copyright (c) 2017, Andrea Giammarchi, @WebReflection */

  // grid operations
  var
    DELETE = 'del',
    INSERT = 'ins',
    SUBSTITUTE = 'sub',
    TypedArray = /^u/.test(typeof Int32Array) ? Array : Int32Array
  ;

  // readapted from:
  // http://webreflection.blogspot.co.uk/2009/02/levenshtein-algorithm-revisited-25.html
  function majinbuu(from, to, MAX_SIZE) {
    var
      fromLength = from.length,
      toLength = to.length,
      TOO_MANY = (MAX_SIZE || Infinity) < Math.sqrt(fromLength * toLength)
    ;
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
  }

  // given an object that would like to intercept
  // all splice operations performed through a list,
  // wraps the list.splice method to delegate such object
  // and it puts back original splice right before
  // every invocation.
  // Note: do not use the same list in two different aura
  majinbuu.aura = function aura(splicer, list) {
    var splice = list.splice;
    list.splice = function hodor() {
      list.splice = splice;
      var result = splicer.splice.apply(splicer, arguments);
      list.splice = hodor;
      return result;
    };
    return list;
  };

  return majinbuu;

  // Helpers - - - - - - - - - - - - - - - - - - - - - -

  // originally readapted from:
  // http://webreflection.blogspot.co.uk/2009/02/levenshtein-algorithm-revisited-25.html
  // then rewritten in C for Emscripten (see levenstein.c)
  // then "screw you ASM" due no much gain but very bloated code
  function levenstein(from, to) {
    var fromLength = from.length + 1;
    var toLength = to.length + 1;
    var size = fromLength * toLength;
    var x = 0;
    var y = 0;
    var X = 0;
    var Y = 0;
    var crow = 0;
    var prow = 0;
    var del, ins, sub;
    var grid = new TypedArray(size);
    grid[0] = 0;
    while (++x < toLength) grid[x] = x;
    while (++y < fromLength) {
      X = x = 0;
      crow = y * toLength;
      prow = Y * toLength;
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
      };
      ++Y;
    }
    return grid;
  }

  // add operations (in reversed order)
  function addOperation(list, type, x, y, count, items) {
    list.unshift({
      type: type,
      x: x,
      y: y,
      count: count,
      items: items
    });
  }

  // walk the Levenshtein grid bottom -> up
  function getOperations(Y, X, grid) {
    var
      list = [],
      YL = Y.length + 1,
      XL = X.length + 1,
      y = YL - 1,
      x = XL - 1,
      cell, top, left, diagonal,
      crow, prow
    ;
    while (x && y) {
      crow = y * XL;
      prow = (y - 1) * XL;
      cell = grid[crow + x];
      top = grid[prow + x];
      left = grid[crow + x - 1];
      diagonal = grid[prow + x - 1];
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
  }

  /* grouped operations */
  function performOperations(target, operations) {
    var
      diff = 0,
      i = 1,
      length = operations.length,
      curr, prev, op
    ;
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
  }

  /* one-by-one operation (testing purpose)
  function performOperations(target, operations) {
    for (var op, diff = 0, i = 0, length = operations.length; i < length; i++) {
      op = operations[i];
      target.splice.apply(target, [op.y + diff, op.count].concat(op.items));
      diff += op.type === INSERT ?
                op.items.length : (op.type === DELETE ?
                  -op.count : 0);
    }
  }
  // */

}()));

// umd.KISS
try { module.exports = hyperHTML; } catch(o_O) {}