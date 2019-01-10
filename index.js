var hyperHTML = (function (document) {
  'use strict';

  /*! (c) Andrea Giammarchi - ISC */
  var self = null ||
  /* istanbul ignore next */
  {};

  try {
    self.WeakMap = WeakMap;
  } catch (WeakMap) {
    // this could be better but 90% of the time
    // it's everything developers need as fallback
    self.WeakMap = function (id, Object) {

      var dP = Object.defineProperty;
      var hOP = Object.hasOwnProperty;
      var proto = WeakMap.prototype;

      proto.delete = function (key) {
        return this.has(key) && delete key[this._];
      };

      proto.get = function (key) {
        return this.has(key) ? key[this._] : void 0;
      };

      proto.has = function (key) {
        return hOP.call(key, this._);
      };

      proto.set = function (key, value) {
        dP(key, this._, {
          configurable: true,
          value: value
        });
        return this;
      };

      return WeakMap;

      function WeakMap(iterable) {
        dP(this, '_', {
          value: '_@ungap/weakmap' + id++
        });
        if (iterable) iterable.forEach(add, this);
      }

      function add(pair) {
        this.set(pair[0], pair[1]);
      }
    }(Math.random(), Object);
  }

  var WeakMap$1 = self.WeakMap;

  /*! (c) Andrea Giammarchi - ISC */
  var self$1 = null ||
  /* istanbul ignore next */
  {};

  try {
    self$1.WeakSet = WeakSet;
  } catch (WeakSet) {
    (function (id, dP) {
      var proto = WeakSet.prototype;

      proto.add = function (object) {
        if (!this.has(object)) dP(object, this._, {
          value: true,
          configurable: true
        });
        return this;
      };

      proto.has = function (object) {
        return this.hasOwnProperty.call(object, this._);
      };

      proto.delete = function (object) {
        return this.has(object) && delete object[this._];
      };

      self$1.WeakSet = WeakSet;

      function WeakSet() {

        dP(this, '_', {
          value: '_@ungap/weakmap' + id++
        });
      }
    })(Math.random(), Object.defineProperty);
  }

  var WeakSet$1 = self$1.WeakSet;

  /*! (c) Andrea Giammarchi - ISC */
  var self$2 = null ||
  /* istanbul ignore next */
  {};

  try {
    self$2.Map = Map;
  } catch (Map) {
    self$2.Map = function Map() {
      var i = 0;
      var k = [];
      var v = [];
      return {
        delete: function _delete(key) {
          var had = contains(key);

          if (had) {
            k.splice(i, 1);
            v.splice(i, 1);
          }

          return had;
        },
        get: function get(key) {
          return contains(key) ? v[i] : void 0;
        },
        has: function has(key) {
          return contains(key);
        },
        set: function set(key, value) {
          v[contains(key) ? i : k.push(key) - 1] = value;
          return this;
        }
      };

      function contains(v) {
        i = k.indexOf(v);
        return -1 < i;
      }
    };
  }

  var Map$1 = self$2.Map;

  var append = function append(get, parent, children, start, end, before) {
    if (end - start < 2) parent.insertBefore(get(children[start], 1), before);else {
      var fragment = parent.ownerDocument.createDocumentFragment();

      while (start < end) {
        fragment.appendChild(get(children[start++], 1));
      }

      parent.insertBefore(fragment, before);
    }
  };
  var eqeq = function eqeq(a, b) {
    return a == b;
  };
  var identity = function identity(O) {
    return O;
  };
  var indexOf = function indexOf(moreNodes, moreStart, moreEnd, lessNodes, lessStart, lessEnd, compare) {
    var length = lessEnd - lessStart;
    /* istanbul ignore if */

    if (length < 1) return -1;

    while (moreEnd - moreStart >= length) {
      var m = moreStart;
      var l = lessStart;

      while (m < moreEnd && l < lessEnd && compare(moreNodes[m], lessNodes[l])) {
        m++;
        l++;
      }

      if (l === lessEnd) return moreStart;
      moreStart = m + 1;
    }

    return -1;
  };
  var isReversed = function isReversed(futureNodes, futureEnd, currentNodes, currentStart, currentEnd, compare) {
    while (currentStart < currentEnd && compare(currentNodes[currentStart], futureNodes[futureEnd - 1])) {
      currentStart++;
      futureEnd--;
    }
    return futureEnd === 0;
  };
  var next = function next(get, list, i, length, before) {
    return i < length ? get(list[i], 0) : 0 < i ? get(list[i - 1], -0).nextSibling : before;
  };
  var remove = function remove(get, parent, children, start, end) {
    if (end - start < 2) parent.removeChild(get(children[start], -1));else {
      var range = parent.ownerDocument.createRange();
      range.setStartBefore(get(children[start], -1));
      range.setEndAfter(get(children[end - 1], -1));
      range.deleteContents();
    }
  }; // - - - - - - - - - - - - - - - - - - -
  // diff related constants and utilities
  // - - - - - - - - - - - - - - - - - - -

  var DELETION = -1;
  var INSERTION = 1;
  var SKIP = 0;
  var SKIP_OND = 50;

  var HS = function HS(futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges) {
    var k = 0;
    /* istanbul ignore next */

    var minLen = futureChanges < currentChanges ? futureChanges : currentChanges;
    var link = Array(minLen++);
    var tresh = Array(minLen);
    tresh[0] = -1;

    for (var i = 1; i < minLen; i++) {
      tresh[i] = currentEnd;
    }

    var keymap = new Map$1();

    for (var _i = currentStart; _i < currentEnd; _i++) {
      keymap.set(currentNodes[_i], _i);
    }

    for (var _i2 = futureStart; _i2 < futureEnd; _i2++) {
      var idxInOld = keymap.get(futureNodes[_i2]);

      if (idxInOld != null) {
        k = findK(tresh, minLen, idxInOld);
        /* istanbul ignore else */

        if (-1 < k) {
          tresh[k] = idxInOld;
          link[k] = {
            newi: _i2,
            oldi: idxInOld,
            prev: link[k - 1]
          };
        }
      }
    }

    k = --minLen;
    --currentEnd;

    while (tresh[k] > currentEnd) {
      --k;
    }

    minLen = currentChanges + futureChanges - k;
    var diff = Array(minLen);
    var ptr = link[k];
    --futureEnd;

    while (ptr) {
      var _ptr = ptr,
          newi = _ptr.newi,
          oldi = _ptr.oldi;

      while (futureEnd > newi) {
        diff[--minLen] = INSERTION;
        --futureEnd;
      }

      while (currentEnd > oldi) {
        diff[--minLen] = DELETION;
        --currentEnd;
      }

      diff[--minLen] = SKIP;
      --futureEnd;
      --currentEnd;
      ptr = ptr.prev;
    }

    while (futureEnd >= futureStart) {
      diff[--minLen] = INSERTION;
      --futureEnd;
    }

    while (currentEnd >= currentStart) {
      diff[--minLen] = DELETION;
      --currentEnd;
    }

    return diff;
  }; // this is pretty much the same petit-dom code without the delete map part
  // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L556-L561


  var OND = function OND(futureNodes, futureStart, rows, currentNodes, currentStart, cols, compare) {
    var length = rows + cols;
    var v = [];
    var d, k, r, c, pv, cv, pd;

    outer: for (d = 0; d <= length; d++) {
      /* istanbul ignore if */
      if (d > SKIP_OND) return null;
      pd = d - 1;
      /* istanbul ignore next */

      pv = d ? v[d - 1] : [0, 0];
      cv = v[d] = [];

      for (k = -d; k <= d; k += 2) {
        if (k === -d || k !== d && pv[pd + k - 1] < pv[pd + k + 1]) {
          c = pv[pd + k + 1];
        } else {
          c = pv[pd + k - 1] + 1;
        }

        r = c - k;

        while (c < cols && r < rows && compare(currentNodes[currentStart + c], futureNodes[futureStart + r])) {
          c++;
          r++;
        }

        if (c === cols && r === rows) {
          break outer;
        }

        cv[d + k] = c;
      }
    }

    var diff = Array(d / 2 + length / 2);
    var diffIdx = diff.length - 1;

    for (d = v.length - 1; d >= 0; d--) {
      while (c > 0 && r > 0 && compare(currentNodes[currentStart + c - 1], futureNodes[futureStart + r - 1])) {
        // diagonal edge = equality
        diff[diffIdx--] = SKIP;
        c--;
        r--;
      }

      if (!d) break;
      pd = d - 1;
      /* istanbul ignore next */

      pv = d ? v[d - 1] : [0, 0];
      k = c - r;

      if (k === -d || k !== d && pv[pd + k - 1] < pv[pd + k + 1]) {
        // vertical edge = insertion
        r--;
        diff[diffIdx--] = INSERTION;
      } else {
        // horizontal edge = deletion
        c--;
        diff[diffIdx--] = DELETION;
      }
    }

    return diff;
  };

  var applyDiff = function applyDiff(diff, get, parentNode, futureNodes, futureStart, currentNodes, currentStart, currentLength, before) {
    var live = new Map$1();
    var length = diff.length;
    var currentIndex = currentStart;
    var i = 0;

    while (i < length) {
      switch (diff[i++]) {
        case SKIP:
          futureStart++;
          currentIndex++;
          break;

        case INSERTION:
          // TODO: bulk appends for sequential nodes
          live.set(futureNodes[futureStart], 1);
          append(get, parentNode, futureNodes, futureStart++, futureStart, currentIndex < currentLength ? get(currentNodes[currentIndex], 1) : before);
          break;

        case DELETION:
          currentIndex++;
          break;
      }
    }

    i = 0;

    while (i < length) {
      switch (diff[i++]) {
        case SKIP:
          currentStart++;
          break;

        case DELETION:
          // TODO: bulk removes for sequential nodes
          if (live.has(currentNodes[currentStart])) currentStart++;else remove(get, parentNode, currentNodes, currentStart++, currentStart);
          break;
      }
    }
  };

  var findK = function findK(ktr, length, j) {
    var lo = 1;
    var hi = length;

    while (lo < hi) {
      var mid = (lo + hi) / 2 >>> 0;
      if (j < ktr[mid]) hi = mid;else lo = mid + 1;
    }

    return lo;
  };

  var smartDiff = function smartDiff(get, parentNode, futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges, currentLength, compare, before) {
    applyDiff(OND(futureNodes, futureStart, futureChanges, currentNodes, currentStart, currentChanges, compare) || HS(futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges), get, parentNode, futureNodes, futureStart, currentNodes, currentStart, currentLength, before);
  };

  /*! (c) 2018 Andrea Giammarchi (ISC) */

  var domdiff = function domdiff(parentNode, // where changes happen
  currentNodes, // Array of current items/nodes
  futureNodes, // Array of future items/nodes
  options // optional object with one of the following properties
  //  before: domNode
  //  compare(generic, generic) => true if same generic
  //  node(generic) => Node
  ) {
    if (!options) options = {};
    var compare = options.compare || eqeq;
    var get = options.node || identity;
    var before = options.before == null ? null : get(options.before, 0);
    var currentLength = currentNodes.length;
    var currentEnd = currentLength;
    var currentStart = 0;
    var futureEnd = futureNodes.length;
    var futureStart = 0; // common prefix

    while (currentStart < currentEnd && futureStart < futureEnd && compare(currentNodes[currentStart], futureNodes[futureStart])) {
      currentStart++;
      futureStart++;
    } // common suffix


    while (currentStart < currentEnd && futureStart < futureEnd && compare(currentNodes[currentEnd - 1], futureNodes[futureEnd - 1])) {
      currentEnd--;
      futureEnd--;
    }

    var currentSame = currentStart === currentEnd;
    var futureSame = futureStart === futureEnd; // same list

    if (currentSame && futureSame) return futureNodes; // only stuff to add

    if (currentSame && futureStart < futureEnd) {
      append(get, parentNode, futureNodes, futureStart, futureEnd, next(get, currentNodes, currentStart, currentLength, before));
      return futureNodes;
    } // only stuff to remove


    if (futureSame && currentStart < currentEnd) {
      remove(get, parentNode, currentNodes, currentStart, currentEnd);
      return futureNodes;
    }

    var currentChanges = currentEnd - currentStart;
    var futureChanges = futureEnd - futureStart;
    var i = -1; // 2 simple indels: the shortest sequence is a subsequence of the longest

    if (currentChanges < futureChanges) {
      i = indexOf(futureNodes, futureStart, futureEnd, currentNodes, currentStart, currentEnd, compare); // inner diff

      if (-1 < i) {
        append(get, parentNode, futureNodes, futureStart, i, get(currentNodes[currentStart], 0));
        append(get, parentNode, futureNodes, i + currentChanges, futureEnd, next(get, currentNodes, currentEnd, currentLength, before));
        return futureNodes;
      }
    }
    /* istanbul ignore else */
    else if (futureChanges < currentChanges) {
        i = indexOf(currentNodes, currentStart, currentEnd, futureNodes, futureStart, futureEnd, compare); // outer diff

        if (-1 < i) {
          remove(get, parentNode, currentNodes, currentStart, i);
          remove(get, parentNode, currentNodes, i + futureChanges, currentEnd);
          return futureNodes;
        }
      } // common case with one replacement for many nodes
    // or many nodes replaced for a single one

    /* istanbul ignore else */


    if (currentChanges < 2 || futureChanges < 2) {
      append(get, parentNode, futureNodes, futureStart, futureEnd, get(currentNodes[currentStart], 0));
      remove(get, parentNode, currentNodes, currentStart, currentEnd);
      return futureNodes;
    } // the half match diff part has been skipped in petit-dom
    // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L391-L397
    // accordingly, I think it's safe to skip in here too
    // if one day it'll come out like the speediest thing ever to do
    // then I might add it in here too
    // Extra: before going too fancy, what about reversed lists ?
    //        This should bail out pretty quickly if that's not the case.


    if (currentChanges === futureChanges && isReversed(futureNodes, futureEnd, currentNodes, currentStart, currentEnd, compare)) {
      append(get, parentNode, futureNodes, futureStart, futureEnd, next(get, currentNodes, currentEnd, currentLength, before));
      return futureNodes;
    } // last resort through a smart diff


    smartDiff(get, parentNode, futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges, currentLength, compare, before);
    return futureNodes;
  };

  

  /*! (c) Andrea Giammarchi - ISC */
  var self$3 = null ||
  /* istanbul ignore next */
  {};
  self$3.CustomEvent = typeof CustomEvent === 'function' ? CustomEvent : function (__p__) {
    CustomEvent[__p__] = new CustomEvent('').constructor[__p__];
    return CustomEvent;

    function CustomEvent(type, init) {
      if (!init) init = {};
      var e = document.createEvent('CustomEvent');
      e.initCustomEvent(type, !!init.bubbles, !!init.cancelable, init.detail);
      return e;
    }
  }('prototype');
  var CustomEvent$1 = self$3.CustomEvent;

  // able to create Custom Elements like components
  // including the ability to listen to connect/disconnect
  // events via onconnect/ondisconnect attributes
  // Components can be created imperatively or declaratively.
  // The main difference is that declared components
  // will not automatically render on setState(...)
  // to simplify state handling on render.

  function Component() {
    return this; // this is needed in Edge !!!
  } // Component is lazily setup because it needs
  // wire mechanism as lazy content

  function setup(content) {
    // there are various weakly referenced variables in here
    // and mostly are to use Component.for(...) static method.
    var children = new WeakMap$1();
    var create = Object.create;

    var createEntry = function createEntry(wm, id, component) {
      wm.set(id, component);
      return component;
    };

    var get = function get(Class, info, context, id) {
      var relation = info.get(Class) || relate(Class, info);

      switch (typeof(id)) {
        case 'object':
        case 'function':
          var wm = relation.w || (relation.w = new WeakMap$1());
          return wm.get(id) || createEntry(wm, id, new Class(context));

        default:
          var sm = relation.p || (relation.p = create(null));
          return sm[id] || (sm[id] = new Class(context));
      }
    };

    var relate = function relate(Class, info) {
      var relation = {
        w: null,
        p: null
      };
      info.set(Class, relation);
      return relation;
    };

    var set = function set(context) {
      var info = new Map$1();
      children.set(context, info);
      return info;
    }; // The Component Class


    Object.defineProperties(Component, {
      // Component.for(context[, id]) is a convenient way
      // to automatically relate data/context to children components
      // If not created yet, the new Component(context) is weakly stored
      // and after that same instance would always be returned.
      for: {
        configurable: true,
        value: function value(context, id) {
          return get(this, children.get(context) || set(context), context, id == null ? 'default' : id);
        }
      }
    });
    Object.defineProperties(Component.prototype, {
      // all events are handled with the component as context
      handleEvent: {
        value: function value(e) {
          var ct = e.currentTarget;
          this['getAttribute' in ct && ct.getAttribute('data-call') || 'on' + e.type](e);
        }
      },
      // components will lazily define html or svg properties
      // as soon as these are invoked within the .render() method
      // Such render() method is not provided by the base class
      // but it must be available through the Component extend.
      // Declared components could implement a
      // render(props) method too and use props as needed.
      html: lazyGetter('html', content),
      svg: lazyGetter('svg', content),
      // the state is a very basic/simple mechanism inspired by Preact
      state: lazyGetter('state', function () {
        return this.defaultState;
      }),
      // it is possible to define a default state that'd be always an object otherwise
      defaultState: {
        get: function get() {
          return {};
        }
      },
      // dispatch a bubbling, cancelable, custom event
      // through the first known/available node
      dispatch: {
        value: function value(type, detail) {
          var _wire$ = this._wire$;

          if (_wire$) {
            var event = new CustomEvent$1(type, {
              bubbles: true,
              cancelable: true,
              detail: detail
            });
            event.component = this;
            return (_wire$.dispatchEvent ? _wire$ : _wire$.childNodes[0]).dispatchEvent(event);
          }

          return false;
        }
      },
      // setting some property state through a new object
      // or a callback, triggers also automatically a render
      // unless explicitly specified to not do so (render === false)
      setState: {
        value: function value(state, render) {
          var target = this.state;
          var source = typeof state === 'function' ? state.call(this, target) : state;

          for (var key in source) {
            target[key] = source[key];
          }

          if (render !== false) this.render();
          return this;
        }
      }
    });
  } // instead of a secret key I could've used a WeakMap
  // However, attaching a property directly will result
  // into better performance with thousands of components
  // hanging around, and less memory pressure caused by the WeakMap

  var lazyGetter = function lazyGetter(type, fn) {
    var secret = '_' + type + '$';
    return {
      get: function get() {
        return this[secret] || setValue(this, secret, fn.call(this, type));
      },
      set: function set(value) {
        setValue(this, secret, value);
      }
    };
  }; // shortcut to set value on get or set(value)


  var setValue = function setValue(self, secret, value) {
    return Object.defineProperty(self, secret, {
      configurable: true,
      value: typeof value === 'function' ? function () {
        return self._wire$ = value.apply(this, arguments);
      } : value
    })[secret];
  };

  var attributes = {};
  var intents = {};
  var keys = [];
  var hasOwnProperty = intents.hasOwnProperty;
  var length = 0;
  var Intent = {
    // used to invoke right away hyper:attributes
    attributes: attributes,
    // hyperHTML.define('intent', (object, update) => {...})
    // can be used to define a third parts update mechanism
    // when every other known mechanism failed.
    // hyper.define('user', info => info.name);
    // hyper(node)`<p>${{user}}</p>`;
    define: function define(intent, callback) {
      if (intent.indexOf('-') < 0) {
        if (!(intent in intents)) {
          length = keys.push(intent);
        }

        intents[intent] = callback;
      } else {
        attributes[intent] = callback;
      }
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

  var isArray = Array.isArray || function (toString) {
    var $ = toString.call([]);
    return function isArray(object) {
      return toString.call(object) === $;
    };
  }({}.toString);

  /*! (c) Andrea Giammarchi - ISC */
  var createContent = function (document) {

    var FRAGMENT = 'fragment';
    var TEMPLATE = 'template';
    var HAS_CONTENT = 'content' in create(TEMPLATE);
    var createHTML = HAS_CONTENT ? function (html) {
      var template = create(TEMPLATE);
      template.innerHTML = html;
      return template.content;
    } : function (html) {
      var content = create(FRAGMENT);
      var template = create(TEMPLATE);
      var childNodes = null;

      if (/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(html)) {
        var selector = RegExp.$1;
        template.innerHTML = '<table>' + html + '</table>';
        childNodes = template.querySelectorAll(selector);
      } else {
        template.innerHTML = html;
        childNodes = template.childNodes;
      }

      append(content, childNodes);
      return content;
    };
    return function createContent(markup, type) {
      return (type === 'svg' ? createSVG : createHTML)(markup);
    };

    function append(root, childNodes) {
      var length = childNodes.length;

      while (length--) {
        root.appendChild(childNodes[0]);
      }
    }

    function create(element) {
      return element === FRAGMENT ? document.createDocumentFragment() : document.createElementNS('http://www.w3.org/1999/xhtml', element);
    } // it could use createElementNS when hasNode is there
    // but this fallback is equally fast and easier to maintain
    // it is also battle tested already in all IE


    function createSVG(svg) {
      var content = create(FRAGMENT);
      var template = create('div');
      template.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + svg + '</svg>';
      append(content, template.firstChild.childNodes);
      return content;
    }
  }(document);

  /*! (c) Andrea Giammarchi */
  function disconnected(poly) {

    var CONNECTED = 'connected';
    var DISCONNECTED = 'dis' + CONNECTED;
    var Event = poly.Event;
    var WeakSet = poly.WeakSet;
    var notObserving = true;
    var observer = new WeakSet();
    return function observe(node) {
      if (notObserving) {
        notObserving = !notObserving;
        startObserving(node.ownerDocument);
      }

      observer.add(node);
      return node;
    };

    function startObserving(document) {
      var dispatched = null;

      try {
        new MutationObserver(changes).observe(document, {
          subtree: true,
          childList: true
        });
      } catch (o_O) {
        var timer = 0;
        var records = [];

        var reschedule = function reschedule(record) {
          records.push(record);
          clearTimeout(timer);
          timer = setTimeout(function () {
            changes(records.splice(timer = 0, records.length));
          }, 0);
        };

        document.addEventListener('DOMNodeRemoved', function (event) {
          reschedule({
            addedNodes: [],
            removedNodes: [event.target]
          });
        }, true);
        document.addEventListener('DOMNodeInserted', function (event) {
          reschedule({
            addedNodes: [event.target],
            removedNodes: []
          });
        }, true);
      }

      function changes(records) {
        dispatched = new Tracker();

        for (var record, length = records.length, i = 0; i < length; i++) {
          record = records[i];
          dispatchAll(record.removedNodes, DISCONNECTED, CONNECTED);
          dispatchAll(record.addedNodes, CONNECTED, DISCONNECTED);
        }

        dispatched = null;
      }

      function dispatchAll(nodes, type, counter) {
        for (var node, event = new Event(type), length = nodes.length, i = 0; i < length; (node = nodes[i++]).nodeType === 1 && dispatchTarget(node, event, type, counter)) {
        }
      }

      function dispatchTarget(node, event, type, counter) {
        if (observer.has(node) && !dispatched[type].has(node)) {
          dispatched[counter].delete(node);
          dispatched[type].add(node);
          node.dispatchEvent(event);
          /*
          // The event is not bubbling (perf reason: should it?),
          // hence there's no way to know if
          // stop/Immediate/Propagation() was called.
          // Should DOM Level 0 work at all?
          // I say it's a YAGNI case for the time being,
          // and easy to implement in user-land.
          if (!event.cancelBubble) {
            var fn = node['on' + type];
            if (fn)
              fn.call(node, event);
          }
          */
        }

        for (var // apparently is node.children || IE11 ... ^_^;;
        // https://github.com/WebReflection/disconnected/issues/1
        children = node.children || [], length = children.length, i = 0; i < length; dispatchTarget(children[i++], event, type, counter)) {
        }
      }

      function Tracker() {
        this[CONNECTED] = new WeakSet();
        this[DISCONNECTED] = new WeakSet();
      }
    }
  }

  /*! (c) Andrea Giammarchi - ISC */

  /*! (c) Andrea Giammarchi - ISC */
  var importNode = function (document, appendChild, cloneNode, createTextNode, importNode) {
    var native = importNode in document; // IE 11 has problems with cloning templates:
    // it "forgets" empty childNodes. This feature-detects that.

    var fragment = document.createDocumentFragment();
    fragment[appendChild](document[createTextNode]('g'));
    fragment[appendChild](document[createTextNode](''));
    var content = native ? document[importNode](fragment, true) : fragment[cloneNode](true);
    return content.childNodes.length < 2 ? function importNode(node, deep) {
      var clone = node[cloneNode]();

      for (var childNodes = node.childNodes || [], length = childNodes.length, i = 0; deep && i < length; i++) {
        clone[appendChild](importNode(childNodes[i], deep));
      }

      return clone;
    } : native ? document[importNode] : function (node, deep) {
      return node[cloneNode](!!deep);
    };
  }(document, 'appendChild', 'cloneNode', 'createTextNode', 'importNode');

  var trim = ''.trim || function () {
    return String(this).replace(/^\s+|\s+/g, '');
  };

  // Custom
  var UID = '-' + Math.random().toFixed(6) + '%'; //                           Edge issue!

  if (!function (template, content, tabindex) {
    return content in template && (template.innerHTML = '<p ' + tabindex + '="' + UID + '"></p>', template[content].childNodes[0].getAttribute(tabindex) == UID);
  }(document.createElement('template'), 'content', 'tabindex')) {
    UID = '_dt: ' + UID.slice(1, -1) + ';';
  }

  var UIDC = '<!--' + UID + '-->'; // DOM

  var COMMENT_NODE = 8;
  var ELEMENT_NODE = 1;
  var TEXT_NODE = 3;
  var SHOULD_USE_TEXT_CONTENT = /^(?:style|textarea)$/i;
  var VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;

  function sanitize (template) {
    return template.join(UIDC).replace(selfClosing, fullClosing).replace(attrSeeker, attrReplacer);
  }
  var spaces = ' \\f\\n\\r\\t';
  var almostEverything = '[^ ' + spaces + '\\/>"\'=]+';
  var attrName = '[ ' + spaces + ']+' + almostEverything;
  var tagName = '<([A-Za-z]+[A-Za-z0-9:_-]*)((?:';
  var attrPartials = '(?:\\s*=\\s*(?:\'[^\']*?\'|"[^"]*?"|<[^>]*?>|' + almostEverything + '))?)';
  var attrSeeker = new RegExp(tagName + attrName + attrPartials + '+)([ ' + spaces + ']*/?>)', 'g');
  var selfClosing = new RegExp(tagName + attrName + attrPartials + '*)([ ' + spaces + ']*/>)', 'g');
  var findAttributes = new RegExp('(' + attrName + '\\s*=\\s*)([\'"]?)' + UIDC + '\\2', 'gi');

  function attrReplacer($0, $1, $2, $3) {
    return '<' + $1 + $2.replace(findAttributes, replaceAttributes) + $3;
  }

  function replaceAttributes($0, $1, $2) {
    return $1 + ($2 || '"') + UID + ($2 || '"');
  }

  function fullClosing($0, $1, $2) {
    return VOID_ELEMENTS.test($1) ? $0 : '<' + $1 + $2 + '></' + $1 + '>';
  }

  function create(type, node, path, name) {
    return {
      name: name,
      node: node,
      path: path,
      type: type
    };
  }

  function find(node, path) {
    var length = path.length;
    var i = 0;

    while (i < length) {
      node = node.childNodes[path[i++]];
    }

    return node;
  }

  function parse(node, holes, parts, path) {
    var childNodes = node.childNodes;
    var length = childNodes.length;
    var i = 0;

    while (i < length) {
      var child = childNodes[i];

      switch (child.nodeType) {
        case ELEMENT_NODE:
          var childPath = path.concat(i);
          parseAttributes(child, holes, parts, childPath);
          parse(child, holes, parts, childPath);
          break;

        case COMMENT_NODE:
          if (child.textContent === UID) {
            parts.shift();
            holes.push( // basicHTML or other non standard engines
            // might end up having comments in nodes
            // where they shouldn't, hence this check.
            SHOULD_USE_TEXT_CONTENT.test(node.nodeName) ? create('text', node, path) : create('any', child, path.concat(i)));
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
            holes.push(create('text', node, path));
          }

          break;
      }

      i++;
    }
  }

  function parseAttributes(node, holes, parts, path) {
    var cache = new Map$1();
    var attributes = node.attributes;
    var remove = [];
    var array = remove.slice.call(attributes, 0);
    var length = array.length;
    var i = 0;

    while (i < length) {
      var attribute = array[i++];

      if (attribute.value === UID) {
        var name = attribute.name; // the following ignore is covered by IE
        // and the IE9 double viewBox test

        /* istanbul ignore else */

        if (!cache.has(name)) {
          var realName = parts.shift().replace(/^(?:|[\S\s]*?\s)(\S+?)\s*=\s*['"]?$/, '$1');
          var value = attributes[realName] || // the following ignore is covered by browsers
          // while basicHTML is already case-sensitive

          /* istanbul ignore next */
          attributes[realName.toLowerCase()];
          cache.set(name, value);
          holes.push(create('attr', value, path, realName));
        }

        remove.push(attribute);
      }
    }

    length = remove.length;
    i = 0;

    while (i < length) {
      // Edge HTML bug #16878726
      var attr = remove[i++];
      if (/^id$/i.test(attr.name)) node.removeAttribute(attr.name); // standard browsers would work just fine here
      else node.removeAttributeNode(attr);
    } // This is a very specific Firefox/Safari issue
    // but since it should be a not so common pattern,
    // it's probably worth patching regardless.
    // Basically, scripts created through strings are death.
    // You need to create fresh new scripts instead.
    // TODO: is there any other node that needs such nonsense?


    var nodeName = node.nodeName;

    if (/^script$/i.test(nodeName)) {
      // this used to be like that
      // var script = createElement(node, nodeName);
      // then Edge arrived and decided that scripts created
      // through template documents aren't worth executing
      // so it became this ... hopefully it won't hurt in the wild
      var script = document.createElement(nodeName);
      length = attributes.length;
      i = 0;

      while (i < length) {
        script.setAttributeNode(attributes[i++].cloneNode(true));
      }

      script.textContent = node.textContent;
      node.parentNode.replaceChild(script, node);
    }
  }

  // globals
  var parsed = new WeakMap$1();
  var referenced = new WeakMap$1();

  function createInfo(options, template) {
    var markup = sanitize(template);
    var transform = options.transform;
    if (transform) markup = transform(markup);
    var content = createContent(markup, options.type);
    cleanContent(content);
    var holes = [];
    parse(content, holes, template.slice(0), []);
    var info = {
      content: content,
      updates: function updates(content) {
        var callbacks = [];
        var len = holes.length;
        var i = 0;

        while (i < len) {
          var info = holes[i++];
          var node = find(content, info.path);

          switch (info.type) {
            case 'any':
              callbacks.push(options.any(node, []));
              break;

            case 'attr':
              callbacks.push(options.attribute(node, info.name, info.node));
              break;

            case 'text':
              callbacks.push(options.text(node));
              node.textContent = '';
              break;
          }
        }

        return function () {
          var length = arguments.length;
          var values = length - 1;
          var i = 1;

          if (len !== values) {
            throw new Error(values + ' values instead of ' + len + '\n' + template.join(', '));
          }

          while (i < length) {
            callbacks[i - 1](arguments[i++]);
          }

          return content;
        };
      }
    };
    parsed.set(template, info);
    return info;
  }

  function createDetails(options, template) {
    var info = parsed.get(template) || createInfo(options, template);
    var content = importNode.call(document, info.content, true);
    var details = {
      content: content,
      template: template,
      updates: info.updates(content)
    };
    referenced.set(options, details);
    return details;
  }

  function domtagger(options) {
    return function (template) {
      var details = referenced.get(options);
      if (details == null || details.template !== template) details = createDetails(options, template);
      details.updates.apply(null, arguments);
      return details.content;
    };
  }

  function cleanContent(fragment) {
    var childNodes = fragment.childNodes;
    var i = childNodes.length;

    while (i--) {
      var child = childNodes[i];

      if (child.nodeType !== 1 && trim.call(child.textContent).length === 0) {
        fragment.removeChild(child);
      }
    }
  }

  /*! (c) Andrea Giammarchi - ISC */
  var hyperStyle = function () {

    var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
    var hyphen = /([^A-Z])([A-Z]+)/g;
    return function hyperStyle(node, original) {
      return 'ownerSVGElement' in node ? svg(node, original) : update(node.style, false);
    };

    function ized($0, $1, $2) {
      return $1 + '-' + $2.toLowerCase();
    }

    function svg(node, original) {
      var style;
      if (original) style = original.cloneNode(true);else {
        node.setAttribute('style', '--hyper:style;');
        style = node.getAttributeNode('style');
      }
      style.value = '';
      node.setAttributeNode(style);
      return update(style, true);
    }

    function toStyle(object) {
      var key,
          css = [];

      for (key in object) {
        css.push(key.replace(hyphen, ized), ':', object[key], ';');
      }

      return css.join('');
    }

    function update(style, isSVG) {
      var oldType, oldValue;
      return function (newValue) {
        var info, key, styleValue, value;

        switch (typeof(newValue)) {
          case 'object':
            if (newValue) {
              if (oldType === 'object') {
                if (!isSVG) {
                  if (oldValue !== newValue) {
                    for (key in oldValue) {
                      if (!(key in newValue)) {
                        style[key] = '';
                      }
                    }
                  }
                }
              } else {
                if (isSVG) style.value = '';else style.cssText = '';
              }

              info = isSVG ? {} : style;

              for (key in newValue) {
                value = newValue[key];
                styleValue = typeof value === 'number' && !IS_NON_DIMENSIONAL.test(key) ? value + 'px' : value;
                if (!isSVG && /^--/.test(key)) info.setProperty(key, styleValue);else info[key] = styleValue;
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
    }
  }();

  // Node.CONSTANTS
  var DOCUMENT_FRAGMENT_NODE$1 = 11; // SVG related constants

  var OWNER_SVG_ELEMENT = 'ownerSVGElement'; // Custom Elements / MutationObserver constants

  var CONNECTED = 'connected';
  var DISCONNECTED = 'dis' + CONNECTED;

  var templateLiteral = function () {

    var RAW = 'raw';
    var isNoOp = false;

    var _templateLiteral = function templateLiteral(tl) {
      if ( // for badly transpiled literals
      !(RAW in tl) || // for some version of TypeScript
      tl.propertyIsEnumerable(RAW) || // and some other version of TypeScript
      !Object.isFrozen(tl.raw) || // or for Firefox < 55
      /Firefox\/(\d+)/.test((document.defaultView.navigator || {}).userAgent) && parseFloat(RegExp.$1) < 55) {
        var forever = {};

        _templateLiteral = function templateLiteral(tl) {
          var key = RAW + tl.join(RAW);
          return forever[key] || (forever[key] = tl);
        };

        return _templateLiteral(tl);
      } else {
        isNoOp = true;
        return tl;
      }
    };

    return function (tl) {
      return isNoOp ? tl : _templateLiteral(tl);
    };
  }();

  var doc = function doc(node) {
    return node.ownerDocument || node;
  };
  var fragment = function fragment(node) {
    return doc(node).createDocumentFragment();
  };
  var text = function text(node, _text) {
    return doc(node).createTextNode(_text);
  }; // appends an array of nodes
  // to a generic node/fragment
  // When available, uses append passing all arguments at once
  // hoping that's somehow faster, even if append has more checks on type
  // istanbul ignore next

  var append$1 = 'append' in fragment(document) ? function (node, childNodes) {
    node.append.apply(node, childNodes);
  } : function (node, childNodes) {
    var length = childNodes.length;

    for (var i = 0; i < length; i++) {
      node.appendChild(childNodes[i]);
    }
  }; // normalizes the template once for all arguments cases

  var reArguments = function reArguments(template) {
    var args = [templateLiteral(template)];

    for (var i = 1, length = arguments.length; i < length; i++) {
      args[i] = arguments[i];
    }

    return args;
  }; // just recycling a one-off array to use slice
  // in every needed place

  var slice = [].slice;

  function Wire(childNodes) {
    this.childNodes = childNodes;
    this.length = childNodes.length;
    this.first = childNodes[0];
    this.last = childNodes[this.length - 1];
    this._ = null;
  } // when a wire is inserted, all its nodes will follow

  Wire.prototype.valueOf = function valueOf(different) {
    var noFragment = this._ == null;
    if (noFragment) this._ = fragment(this.first);
    /* istanbul ignore else */

    if (noFragment || different) append$1(this._, this.childNodes);
    return this._;
  }; // when a wire is removed, all its nodes must be removed as well


  Wire.prototype.remove = function remove() {
    this._ = null;
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

  var observe = disconnected({
    Event: CustomEvent$1,
    WeakSet: WeakSet$1
  });

  var asHTML = function asHTML(html) {
    return {
      html: html
    };
  }; // returns nodes from wires and components


  var asNode = function asNode(item, i) {
    return 'ELEMENT_NODE' in item ? item : item.constructor === Wire ? // in the Wire case, the content can be
    // removed, post-pended, inserted, or pre-pended and
    // all these cases are handled by domdiff already

    /* istanbul ignore next */
    1 / i < 0 ? i ? item.remove() : item.last : i ? item.valueOf(true) : item.first : asNode(item.render(), i);
  }; // returns true if domdiff can handle the value


  var canDiff = function canDiff(value) {
    return 'ELEMENT_NODE' in value || value instanceof Wire || value instanceof Component;
  }; // when a Promise is used as interpolation value
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
  }; // quick and dirty way to check for Promise/ish values


  var isPromise_ish = function isPromise_ish(value) {
    return value != null && 'then' in value;
  }; // list of attributes that should not be directly assigned


  var readOnly = /^(?:form|list)$/i;

  function Tagger(type) {
    this.type = type;
    return domtagger(this);
  }

  Tagger.prototype = {
    // there are four kind of attributes, and related behavior:
    //  * events, with a name starting with `on`, to add/remove event listeners
    //  * special, with a name present in their inherited prototype, accessed directly
    //  * regular, accessed through get/setAttribute standard DOM methods
    //  * style, the only regular attribute that also accepts an object as value
    //    so that you can style=${{width: 120}}. In this case, the behavior has been
    //    fully inspired by Preact library and its simplicity.
    attribute: function attribute(node, name, original) {
      var isSVG = OWNER_SVG_ELEMENT in node;
      var oldValue; // if the attribute is the style one
      // handle it differently from others

      if (name === 'style') return hyperStyle(node, original, isSVG); // the name is an event one,
      // add/remove event listeners accordingly
      else if (/^on/.test(name)) {
          var type = name.slice(2);

          if (type === CONNECTED || type === DISCONNECTED) {
            observe(node);
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
        } // the attribute is special ('value' in input)
        // and it's not SVG *or* the name is exactly data,
        // in this case assign the value directly
        else if (name === 'data' || !isSVG && name in node && !readOnly.test(name)) {
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
          } else if (name in Intent.attributes) {
            return function (any) {
              var newValue = Intent.attributes[name](node, any);

              if (oldValue !== newValue) {
                oldValue = newValue;
                if (newValue == null) node.removeAttribute(name);else node.setAttribute(name, newValue);
              }
            };
          } // in every other case, use the attribute node as it is
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

                      attribute.value = newValue;
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
    },
    // in a hyper(node)`<div>${content}</div>` case
    // everything could happen:
    //  * it's a JS primitive, stored as text
    //  * it's null or undefined, the node should be cleaned
    //  * it's a component, update the content by rendering it
    //  * it's a promise, update the content once resolved
    //  * it's an explicit intent, perform the desired operation
    //  * it's an Array, resolve all values if Promises and/or
    //    update the node with the resulting list of content
    any: function any(node, childNodes) {
      var diffOptions = {
        node: asNode,
        before: node
      };
      var nodeType = OWNER_SVG_ELEMENT in node ?
      /* istanbul ignore next */
      'svg' : 'html';
      var fastPath = false;
      var oldValue;

      var anyContent = function anyContent(value) {
        switch (typeof(value)) {
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
              childNodes = domdiff(node.parentNode, childNodes, [text(node, value)], diffOptions);
            }

            break;

          case 'function':
            anyContent(value(node));
            break;

          case 'object':
          case 'undefined':
            if (value == null) {
              fastPath = false;
              childNodes = domdiff(node.parentNode, childNodes, [], diffOptions);
              break;
            }

          default:
            fastPath = false;
            oldValue = value;

            if (isArray(value)) {
              if (value.length === 0) {
                if (childNodes.length) {
                  childNodes = domdiff(node.parentNode, childNodes, [], diffOptions);
                }
              } else {
                switch (typeof(value[0])) {
                  case 'string':
                  case 'number':
                  case 'boolean':
                    anyContent({
                      html: value
                    });
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
                    childNodes = domdiff(node.parentNode, childNodes, value, diffOptions);
                    break;
                }
              }
            } else if (canDiff(value)) {
              childNodes = domdiff(node.parentNode, childNodes, value.nodeType === DOCUMENT_FRAGMENT_NODE$1 ? slice.call(value.childNodes) : [value], diffOptions);
            } else if (isPromise_ish(value)) {
              value.then(anyContent);
            } else if ('placeholder' in value) {
              invokeAtDistance(value, anyContent);
            } else if ('text' in value) {
              anyContent(String(value.text));
            } else if ('any' in value) {
              anyContent(value.any);
            } else if ('html' in value) {
              childNodes = domdiff(node.parentNode, childNodes, slice.call(createContent([].concat(value.html).join(''), nodeType).childNodes), diffOptions);
            } else if ('length' in value) {
              anyContent(slice.call(value));
            } else {
              anyContent(Intent.invoke(value, anyContent));
            }

            break;
        }
      };

      return anyContent;
    },
    // style or textareas don't accept HTML as content
    // it's pointless to transform or analyze anything
    // different from text there but it's worth checking
    // for possible defined intents.
    text: function text$$1(node) {
      var oldValue;

      var textContent = function textContent(value) {
        if (oldValue !== value) {
          oldValue = value;

          var type = typeof(value);

          if (type === 'object' && value) {
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
          } else if (type === 'function') {
            textContent(value(node));
          } else {
            node.textContent = value == null ? '' : value;
          }
        }
      };

      return textContent;
    }
  };

  var wires = new WeakMap$1(); // A wire is a callback used as tag function
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
  }; // A wire content is a virtual reference to one or more nodes.
  // It's represented by either a DOM node, or an Array.
  // In both cases, the wire content role is to simply update
  // all nodes through the list of related callbacks.
  // In few words, a wire content is like an invisible parent node
  // in charge of updating its content like a bound element would do.


  var content = function content(type) {
    var wire, tagger, template;
    return function () {
      var args = reArguments.apply(null, arguments);

      if (template !== args[0]) {
        template = args[0];
        tagger = new Tagger(type);
        wire = wireContent(tagger.apply(tagger, args));
      } else {
        tagger.apply(tagger, args);
      }

      return wire;
    };
  }; // wires are weakly created through objects.
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
  }; // A document fragment loses its nodes 
  // as soon as it is appended into another node.
  // This has the undesired effect of losing wired content
  // on a second render call, because (by then) the fragment would be empty:
  // no longer providing access to those sub-nodes that ultimately need to
  // stay associated with the original interpolation.
  // To prevent hyperHTML from forgetting about a fragment's sub-nodes,
  // fragments are instead returned as an Array of nodes or, if there's only one entry,
  // as a single referenced node which, unlike fragments, will indeed persist
  // wire content throughout multiple renderings.
  // The initial fragment, at this point, would be used as unique reference to this
  // array of nodes or to this single referenced node.


  var wireContent = function wireContent(node) {
    var childNodes = node.childNodes;
    return childNodes.length === 1 ? childNodes[0] : new Wire(slice.call(childNodes, 0));
  };

  // are already known to hyperHTML

  var bewitched = new WeakMap$1(); // better known as hyper.bind(node), the render is
  // the main tag function in charge of fully upgrading
  // or simply updating, contexts used as hyperHTML targets.
  // The `this` context is either a regular DOM node or a fragment.

  function render() {
    var wicked = bewitched.get(this);
    var args = reArguments.apply(null, arguments);

    if (wicked && wicked.template === args[0]) {
      wicked.tagger.apply(null, args);
    } else {
      upgrade.apply(this, args);
    }

    return this;
  } // an upgrade is in charge of collecting template info,
  // parse it once, if unknown, to map all interpolations
  // as single DOM callbacks, relate such template
  // to the current context, and render it after cleaning the context up


  function upgrade() {
    var args = reArguments.apply(null, arguments);
    var type = OWNER_SVG_ELEMENT in this ? 'svg' : 'html';
    var tagger = new Tagger(type);
    bewitched.set(this, {
      tagger: tagger,
      template: args[0]
    });
    this.textContent = '';
    this.appendChild(tagger.apply(null, args));
  }

  /*! (c) Andrea Giammarchi (ISC) */
  // you can do the following
  // const {bind, wire} = hyperHTML;
  // and use them right away: bind(node)`hello!`;

  var bind = function bind(context) {
    return render.bind(context);
  };

  var define = Intent.define;
  var tagger = Tagger.prototype;
  hyper.Component = Component;
  hyper.bind = bind;
  hyper.define = define;
  hyper.diff = domdiff;
  hyper.hyper = hyper;
  hyper.observe = observe;
  hyper.tagger = tagger;
  hyper.wire = wire; // exported as shared utils
  // for projects based on hyperHTML
  // that don't necessarily need upfront polyfills
  // i.e. those still targeting IE

  hyper._ = {
    WeakMap: WeakMap$1,
    WeakSet: WeakSet$1
  }; // the wire content is the lazy defined
  // html or svg property of each hyper.Component

  setup(content); // everything is exported directly or through the
  // that "magically" understands what's the best
  // thing to do with passed arguments

  function hyper(HTML) {
    return arguments.length < 2 ? HTML == null ? content('html') : typeof HTML === 'string' ? hyper.wire(null, HTML) : 'raw' in HTML ? content('html')(HTML) : 'nodeType' in HTML ? hyper.bind(HTML) : weakly(HTML, 'html') : ('raw' in HTML ? content('html') : hyper.wire).apply(null, arguments);
  }

  
  
  
  
  
  
  
  
  

  return hyper;

}(document));
