var hyperHTML = (function (document) {
  'use strict';

  const {indexOf: indexOf$1, slice: slice$1} = [];

  const append = (get, parent, children, start, end, before) => {
    const isSelect = 'selectedIndex' in parent;
    let noSelection = isSelect;
    while (start < end) {
      const child = get(children[start], 1);
      parent.insertBefore(child, before);
      if (isSelect && noSelection && child.selected) {
        noSelection = !noSelection;
        let {selectedIndex} = parent;
        parent.selectedIndex = selectedIndex < 0 ?
          start :
          indexOf$1.call(parent.querySelectorAll('option'), child);
      }
      start++;
    }
  };

  const eqeq = (a, b) => a == b;

  const identity = O => O;

  const indexOf = (
    moreNodes,
    moreStart,
    moreEnd,
    lessNodes,
    lessStart,
    lessEnd,
    compare
  ) => {
    const length = lessEnd - lessStart;
    /* istanbul ignore if */
    if (length < 1)
      return -1;
    while ((moreEnd - moreStart) >= length) {
      let m = moreStart;
      let l = lessStart;
      while (
        m < moreEnd &&
        l < lessEnd &&
        compare(moreNodes[m], lessNodes[l])
      ) {
        m++;
        l++;
      }
      if (l === lessEnd)
        return moreStart;
      moreStart = m + 1;
    }
    return -1;
  };

  const isReversed = (
    futureNodes,
    futureEnd,
    currentNodes,
    currentStart,
    currentEnd,
    compare
  ) => {
    while (
      currentStart < currentEnd &&
      compare(
        currentNodes[currentStart],
        futureNodes[futureEnd - 1]
      )) {
        currentStart++;
        futureEnd--;
      }  return futureEnd === 0;
  };

  const next = (get, list, i, length, before) => i < length ?
                get(list[i], 0) :
                (0 < i ?
                  get(list[i - 1], -0).nextSibling :
                  before);

  const remove = (get, children, start, end) => {
    while (start < end)
      drop(get(children[start++], -1));
  };

  // - - - - - - - - - - - - - - - - - - -
  // diff related constants and utilities
  // - - - - - - - - - - - - - - - - - - -

  const DELETION = -1;
  const INSERTION = 1;
  const SKIP = 0;
  const SKIP_OND = 50;

  const HS = (
    futureNodes,
    futureStart,
    futureEnd,
    futureChanges,
    currentNodes,
    currentStart,
    currentEnd,
    currentChanges
  ) => {

    let k = 0;
    /* istanbul ignore next */
    let minLen = futureChanges < currentChanges ? futureChanges : currentChanges;
    const link = Array(minLen++);
    const tresh = Array(minLen);
    tresh[0] = -1;

    for (let i = 1; i < minLen; i++)
      tresh[i] = currentEnd;

    const nodes = currentNodes.slice(currentStart, currentEnd);

    for (let i = futureStart; i < futureEnd; i++) {
      const index = nodes.indexOf(futureNodes[i]);
      if (-1 < index) {
        const idxInOld = index + currentStart;
        k = findK(tresh, minLen, idxInOld);
        /* istanbul ignore else */
        if (-1 < k) {
          tresh[k] = idxInOld;
          link[k] = {
            newi: i,
            oldi: idxInOld,
            prev: link[k - 1]
          };
        }
      }
    }

    k = --minLen;
    --currentEnd;
    while (tresh[k] > currentEnd) --k;

    minLen = currentChanges + futureChanges - k;
    const diff = Array(minLen);
    let ptr = link[k];
    --futureEnd;
    while (ptr) {
      const {newi, oldi} = ptr;
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
  };

  // this is pretty much the same petit-dom code without the delete map part
  // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L556-L561
  const OND = (
    futureNodes,
    futureStart,
    rows,
    currentNodes,
    currentStart,
    cols,
    compare
  ) => {
    const length = rows + cols;
    const v = [];
    let d, k, r, c, pv, cv, pd;
    outer: for (d = 0; d <= length; d++) {
      /* istanbul ignore if */
      if (d > SKIP_OND)
        return null;
      pd = d - 1;
      /* istanbul ignore next */
      pv = d ? v[d - 1] : [0, 0];
      cv = v[d] = [];
      for (k = -d; k <= d; k += 2) {
        if (k === -d || (k !== d && pv[pd + k - 1] < pv[pd + k + 1])) {
          c = pv[pd + k + 1];
        } else {
          c = pv[pd + k - 1] + 1;
        }
        r = c - k;
        while (
          c < cols &&
          r < rows &&
          compare(
            currentNodes[currentStart + c],
            futureNodes[futureStart + r]
          )
        ) {
          c++;
          r++;
        }
        if (c === cols && r === rows) {
          break outer;
        }
        cv[d + k] = c;
      }
    }

    const diff = Array(d / 2 + length / 2);
    let diffIdx = diff.length - 1;
    for (d = v.length - 1; d >= 0; d--) {
      while (
        c > 0 &&
        r > 0 &&
        compare(
          currentNodes[currentStart + c - 1],
          futureNodes[futureStart + r - 1]
        )
      ) {
        // diagonal edge = equality
        diff[diffIdx--] = SKIP;
        c--;
        r--;
      }
      if (!d)
        break;
      pd = d - 1;
      /* istanbul ignore next */
      pv = d ? v[d - 1] : [0, 0];
      k = c - r;
      if (k === -d || (k !== d && pv[pd + k - 1] < pv[pd + k + 1])) {
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

  const applyDiff = (
    diff,
    get,
    parentNode,
    futureNodes,
    futureStart,
    currentNodes,
    currentStart,
    currentLength,
    before
  ) => {
    const live = [];
    const length = diff.length;
    let currentIndex = currentStart;
    let i = 0;
    while (i < length) {
      switch (diff[i++]) {
        case SKIP:
          futureStart++;
          currentIndex++;
          break;
        case INSERTION:
          // TODO: bulk appends for sequential nodes
          live.push(futureNodes[futureStart]);
          append(
            get,
            parentNode,
            futureNodes,
            futureStart++,
            futureStart,
            currentIndex < currentLength ?
              get(currentNodes[currentIndex], 0) :
              before
          );
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
          if (-1 < live.indexOf(currentNodes[currentStart]))
            currentStart++;
          else
            remove(
              get,
              currentNodes,
              currentStart++,
              currentStart
            );
          break;
      }
    }
  };

  const findK = (ktr, length, j) => {
    let lo = 1;
    let hi = length;
    while (lo < hi) {
      const mid = ((lo + hi) / 2) >>> 0;
      if (j < ktr[mid])
        hi = mid;
      else
        lo = mid + 1;
    }
    return lo;
  };

  const smartDiff = (
    get,
    parentNode,
    futureNodes,
    futureStart,
    futureEnd,
    futureChanges,
    currentNodes,
    currentStart,
    currentEnd,
    currentChanges,
    currentLength,
    compare,
    before
  ) => {
    applyDiff(
      OND(
        futureNodes,
        futureStart,
        futureChanges,
        currentNodes,
        currentStart,
        currentChanges,
        compare
      ) ||
      HS(
        futureNodes,
        futureStart,
        futureEnd,
        futureChanges,
        currentNodes,
        currentStart,
        currentEnd,
        currentChanges
      ),
      get,
      parentNode,
      futureNodes,
      futureStart,
      currentNodes,
      currentStart,
      currentLength,
      before
    );
  };

  const drop = node => (node.remove || dropChild).call(node);

  function dropChild() {
    const {parentNode} = this;
    /* istanbul ignore else */
    if (parentNode)
      parentNode.removeChild(this);
  }

  /*! (c) 2018 Andrea Giammarchi (ISC) */


  const domdiff = (
    parentNode,     // where changes happen
    currentNodes,   // Array of current items/nodes
    futureNodes,    // Array of future items/nodes
    options         // optional object with one of the following properties
                    //  before: domNode
                    //  compare(generic, generic) => true if same generic
                    //  node(generic) => Node
  ) => {
    if (!options)
      options = {};

    const compare = options.compare || eqeq;
    const get = options.node || identity;
    const before = options.before == null ? null : get(options.before, 0);

    const currentLength = currentNodes.length;
    let currentEnd = currentLength;
    let currentStart = 0;

    let futureEnd = futureNodes.length;
    let futureStart = 0;

    // common prefix
    while (
      currentStart < currentEnd &&
      futureStart < futureEnd &&
      compare(currentNodes[currentStart], futureNodes[futureStart])
    ) {
      currentStart++;
      futureStart++;
    }

    // common suffix
    while (
      currentStart < currentEnd &&
      futureStart < futureEnd &&
      compare(currentNodes[currentEnd - 1], futureNodes[futureEnd - 1])
    ) {
      currentEnd--;
      futureEnd--;
    }

    const currentSame = currentStart === currentEnd;
    const futureSame = futureStart === futureEnd;

    // same list
    if (currentSame && futureSame)
      return futureNodes;

    // only stuff to add
    if (currentSame && futureStart < futureEnd) {
      append(
        get,
        parentNode,
        futureNodes,
        futureStart,
        futureEnd,
        next(get, currentNodes, currentStart, currentLength, before)
      );
      return futureNodes;
    }

    // only stuff to remove
    if (futureSame && currentStart < currentEnd) {
      remove(
        get,
        currentNodes,
        currentStart,
        currentEnd
      );
      return futureNodes;
    }

    const currentChanges = currentEnd - currentStart;
    const futureChanges = futureEnd - futureStart;
    let i = -1;

    // 2 simple indels: the shortest sequence is a subsequence of the longest
    if (currentChanges < futureChanges) {
      i = indexOf(
        futureNodes,
        futureStart,
        futureEnd,
        currentNodes,
        currentStart,
        currentEnd,
        compare
      );
      // inner diff
      if (-1 < i) {
        append(
          get,
          parentNode,
          futureNodes,
          futureStart,
          i,
          get(currentNodes[currentStart], 0)
        );
        append(
          get,
          parentNode,
          futureNodes,
          i + currentChanges,
          futureEnd,
          next(get, currentNodes, currentEnd, currentLength, before)
        );
        return futureNodes;
      }
    }
    /* istanbul ignore else */
    else if (futureChanges < currentChanges) {
      i = indexOf(
        currentNodes,
        currentStart,
        currentEnd,
        futureNodes,
        futureStart,
        futureEnd,
        compare
      );
      // outer diff
      if (-1 < i) {
        remove(
          get,
          currentNodes,
          currentStart,
          i
        );
        remove(
          get,
          currentNodes,
          i + futureChanges,
          currentEnd
        );
        return futureNodes;
      }
    }

    // common case with one replacement for many nodes
    // or many nodes replaced for a single one
    /* istanbul ignore else */
    if ((currentChanges < 2 || futureChanges < 2)) {
      append(
        get,
        parentNode,
        futureNodes,
        futureStart,
        futureEnd,
        get(currentNodes[currentStart], 0)
      );
      remove(
        get,
        currentNodes,
        currentStart,
        currentEnd
      );
      return futureNodes;
    }

    // the half match diff part has been skipped in petit-dom
    // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L391-L397
    // accordingly, I think it's safe to skip in here too
    // if one day it'll come out like the speediest thing ever to do
    // then I might add it in here too

    // Extra: before going too fancy, what about reversed lists ?
    //        This should bail out pretty quickly if that's not the case.
    if (
      currentChanges === futureChanges &&
      isReversed(
        futureNodes,
        futureEnd,
        currentNodes,
        currentStart,
        currentEnd,
        compare
      )
    ) {
      append(
        get,
        parentNode,
        futureNodes,
        futureStart,
        futureEnd,
        next(get, currentNodes, currentEnd, currentLength, before)
      );
      return futureNodes;
    }

    // last resort through a smart diff
    smartDiff(
      get,
      parentNode,
      futureNodes,
      futureStart,
      futureEnd,
      futureChanges,
      currentNodes,
      currentStart,
      currentEnd,
      currentChanges,
      currentLength,
      compare,
      before
    );

    return futureNodes;
  };

  // hyperHTML.Component is a very basic class
  // able to create Custom Elements like components
  // including the ability to listen to connect/disconnect
  // events via onconnect/ondisconnect attributes
  // Components can be created imperatively or declaratively.
  // The main difference is that declared components
  // will not automatically render on setState(...)
  // to simplify state handling on render.
  class Component {}

  // Component is lazily setup because it needs
  // wire mechanism as lazy content
  function setup(content) {
    // there are various weakly referenced variables in here
    // and mostly are to use Component.for(...) static method.
    const children = new WeakMap;
    const create = Object.create;
    const createEntry = (wm, id, component) => {
      wm.set(id, component);
      return component;
    };
    const get = (Class, info, context, id) => {
      const relation = info.get(Class) || relate(Class, info);
      switch (typeof id) {
        case 'object':
        case 'function':
          const wm = relation.w || (relation.w = new WeakMap);
          return wm.get(id) || createEntry(wm, id, new Class(context));
        default:
          const sm = relation.p || (relation.p = create(null));
          return sm[id] || (sm[id] = new Class(context));
      }
    };
    const relate = (Class, info) => {
      const relation = {w: null, p: null};
      info.set(Class, relation);
      return relation;
    };
    const set = context => {
      const info = new Map;
      children.set(context, info);
      return info;
    };
    // The Component Class
    Object.defineProperties(
      Component,
      {
        // Component.for(context[, id]) is a convenient way
        // to automatically relate data/context to children components
        // If not created yet, the new Component(context) is weakly stored
        // and after that same instance would always be returned.
        for: {
          configurable: true,
          value(context, id) {
            return get(
              this,
              children.get(context) || set(context),
              context,
              id == null ?
                'default' : id
            );
          }
        }
      }
    );
    Object.defineProperties(
      Component.prototype,
      {
        // all events are handled with the component as context
        handleEvent: {value(e) {
          const ct = e.currentTarget;
          this[
            ('getAttribute' in ct && ct.getAttribute('data-call')) ||
            ('on' + e.type)
          ](e);
        }},
        // components will lazily define html or svg properties
        // as soon as these are invoked within the .render() method
        // Such render() method is not provided by the base class
        // but it must be available through the Component extend.
        // Declared components could implement a
        // render(props) method too and use props as needed.
        html: lazyGetter('html', content),
        svg: lazyGetter('svg', content),
        // the state is a very basic/simple mechanism inspired by Preact
        state: lazyGetter('state', function () { return this.defaultState; }),
        // it is possible to define a default state that'd be always an object otherwise
        defaultState: {get() { return {}; }},
        // dispatch a bubbling, cancelable, custom event
        // through the first known/available node
        dispatch: {value(type, detail) {
          const {_wire$} = this;
          if (_wire$) {
            const event = new CustomEvent(type, {
              bubbles: true,
              cancelable: true,
              detail
            });
            event.component = this;
            return (_wire$.dispatchEvent ?
                      _wire$ :
                      _wire$.firstChild
                    ).dispatchEvent(event);
          }
          return false;
        }},
        // setting some property state through a new object
        // or a callback, triggers also automatically a render
        // unless explicitly specified to not do so (render === false)
        setState: {value(state, render) {
          const target = this.state;
          const source = typeof state === 'function' ? state.call(this, target) : state;
          for (const key in source) target[key] = source[key];
          if (render !== false)
            this.render();
          return this;
        }}
      }
    );
  }

  // instead of a secret key I could've used a WeakMap
  // However, attaching a property directly will result
  // into better performance with thousands of components
  // hanging around, and less memory pressure caused by the WeakMap
  const lazyGetter = (type, fn) => {
    const secret = '_' + type + '$';
    return {
      get() {
        return this[secret] || setValue(this, secret, fn.call(this, type));
      },
      set(value) {
        setValue(this, secret, value);
      }
    };
  };

  // shortcut to set value on get or set(value)
  const setValue = (self, secret, value) =>
    Object.defineProperty(self, secret, {
      configurable: true,
      value: typeof value === 'function' ?
        function () {
          return (self._wire$ = value.apply(this, arguments));
        } :
        value
    })[secret]
  ;

  Object.defineProperties(
    Component.prototype,
    {
      // used to distinguish better than instanceof
      ELEMENT_NODE: {value: 1},
      nodeType: {value: -1}
    }
  );

  const attributes = {};
  const intents = {};
  const keys = [];
  const hasOwnProperty = intents.hasOwnProperty;

  let length = 0;

  var Intent = {

    // used to invoke right away hyper:attributes
    attributes,

    // hyperHTML.define('intent', (object, update) => {...})
    // can be used to define a third parts update mechanism
    // when every other known mechanism failed.
    // hyper.define('user', info => info.name);
    // hyper(node)`<p>${{user}}</p>`;
    define: (intent, callback) => {
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
    invoke: (object, callback) => {
      for (let i = 0; i < length; i++) {
        let key = keys[i];
        if (hasOwnProperty.call(object, key)) {
          return intents[key](object[key], callback);
        }
      }
    }
  };

  /*! (c) Andrea Giammarchi */
  function disconnected(poly) {  var Event = poly.Event;
    var WeakSet = poly.WeakSet;
    var notObserving = true;
    var observer = null;
    return function observe(node) {
      if (notObserving) {
        notObserving = !notObserving;
        observer = new WeakSet;
        startObserving(node.ownerDocument);
      }
      observer.add(node);
      return node;
    };
    function startObserving(document) {
      var connected = new WeakSet;
      var disconnected = new WeakSet;
      try {
        (new MutationObserver(changes)).observe(
          document,
          {subtree: true, childList: true}
        );
      }
      catch(o_O) {
        var timer = 0;
        var records = [];
        var reschedule = function (record) {
          records.push(record);
          clearTimeout(timer);
          timer = setTimeout(
            function () {
              changes(records.splice(timer = 0, records.length));
            },
            0
          );
        };
        document.addEventListener(
          'DOMNodeRemoved',
          function (event) {
            reschedule({addedNodes: [], removedNodes: [event.target]});
          },
          true
        );
        document.addEventListener(
          'DOMNodeInserted',
          function (event) {
            reschedule({addedNodes: [event.target], removedNodes: []});
          },
          true
        );
      }
      function changes(records) {
        for (var
          record,
          length = records.length,
          i = 0; i < length; i++
        ) {
          record = records[i];
          dispatchAll(record.removedNodes, 'disconnected', disconnected, connected);
          dispatchAll(record.addedNodes, 'connected', connected, disconnected);
        }
      }
      function dispatchAll(nodes, type, wsin, wsout) {
        for (var
          node,
          event = new Event(type),
          length = nodes.length,
          i = 0; i < length;
          (node = nodes[i++]).nodeType === 1 &&
          dispatchTarget(node, event, type, wsin, wsout)
        );
      }
      function dispatchTarget(node, event, type, wsin, wsout) {
        if (observer.has(node) && !wsin.has(node)) {
          wsout.delete(node);
          wsin.add(node);
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
        for (var
          // apparently is node.children || IE11 ... ^_^;;
          // https://github.com/WebReflection/disconnected/issues/1
          children = node.children || [],
          length = children.length,
          i = 0; i < length;
          dispatchTarget(children[i++], event, type, wsin, wsout)
        );
      }
    }
  }

  /*! (c) Andrea Giammarchi - ISC */
  var self = {};
  try { self.WeakMap = WeakMap; }
  catch (WeakMap) {
    // this could be better but 90% of the time
    // it's everything developers need as fallback
    self.WeakMap = (function (id, Object) {    var dP = Object.defineProperty;
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
        dP(key, this._, {configurable: true, value: value});
        return this;
      };
      return WeakMap;
      function WeakMap(iterable) {
        dP(this, '_', {value: '_@ungap/weakmap' + id++});
        if (iterable)
          iterable.forEach(add, this);
      }
      function add(pair) {
        this.set(pair[0], pair[1]);
      }
    }(Math.random(), Object));
  }
  var WeakMap$1 = self.WeakMap;

  /*! (c) Andrea Giammarchi - ISC */

  /*! (c) Andrea Giammarchi - ISC */
  var importNode = (function (
    document,
    appendChild,
    cloneNode,
    createTextNode,
    importNode
  ) {
    var native = importNode in document;
    // IE 11 has problems with cloning templates:
    // it "forgets" empty childNodes. This feature-detects that.
    var fragment = document.createDocumentFragment();
    fragment[appendChild](document[createTextNode]('g'));
    fragment[appendChild](document[createTextNode](''));
    /* istanbul ignore next */
    var content = native ?
      document[importNode](fragment, true) :
      fragment[cloneNode](true);
    return content.childNodes.length < 2 ?
      function importNode(node, deep) {
        var clone = node[cloneNode]();
        for (var
          /* istanbul ignore next */
          childNodes = node.childNodes || [],
          length = childNodes.length,
          i = 0; deep && i < length; i++
        ) {
          clone[appendChild](importNode(childNodes[i], deep));
        }
        return clone;
      } :
      /* istanbul ignore next */
      (native ?
        document[importNode] :
        function (node, deep) {
          return node[cloneNode](!!deep);
        }
      );
  }(
    document,
    'appendChild',
    'cloneNode',
    'createTextNode',
    'importNode'
  ));

  var trim = ''.trim || /* istanbul ignore next */ function () {
    return String(this).replace(/^\s+|\s+/g, '');
  };

  /*! (c) Andrea Giammarchi - ISC */

  // Custom
  var UID = '-' + Math.random().toFixed(6) + '%';
  //                           Edge issue!

  var UID_IE = false;

  try {
    if (!(function (template, content, tabindex) {
      return content in template && (
        (template.innerHTML = '<p ' + tabindex + '="' + UID + '"></p>'),
        template[content].childNodes[0].getAttribute(tabindex) == UID
      );
    }(document.createElement('template'), 'content', 'tabindex'))) {
      UID = '_dt: ' + UID.slice(1, -1) + ';';
      UID_IE = true;
    }
  } catch(meh) {}

  var UIDC = '<!--' + UID + '-->';

  // DOM
  var COMMENT_NODE = 8;
  var ELEMENT_NODE = 1;
  var TEXT_NODE = 3;

  var SHOULD_USE_TEXT_CONTENT = /^(?:plaintext|script|style|textarea|title|xmp)$/i;
  var VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;

  /*! (c) Andrea Giammarchi - ISC */


  function sanitize (template) {
    return template.join(UIDC)
            .replace(selfClosing, fullClosing)
            .replace(attrSeeker, attrReplacer);
  }

  var spaces = ' \\f\\n\\r\\t';
  var almostEverything = '[^' + spaces + '\\/>"\'=]+';
  var attrName = '[' + spaces + ']+' + almostEverything;
  var tagName = '<([A-Za-z]+[A-Za-z0-9:._-]*)((?:';
  var attrPartials = '(?:\\s*=\\s*(?:\'[^\']*?\'|"[^"]*?"|<[^>]*?>|' + almostEverything.replace('\\/', '') + '))?)';

  var attrSeeker = new RegExp(tagName + attrName + attrPartials + '+)([' + spaces + ']*/?>)', 'g');
  var selfClosing = new RegExp(tagName + attrName + attrPartials + '*)([' + spaces + ']*/>)', 'g');
  var findAttributes = new RegExp('(' + attrName + '\\s*=\\s*)([\'"]?)' + UIDC + '\\2', 'gi');

  function attrReplacer($0, $1, $2, $3) {
    return '<' + $1 + $2.replace(findAttributes, replaceAttributes) + $3;
  }

  function replaceAttributes($0, $1, $2) {
    return $1 + ($2 || '"') + UID + ($2 || '"');
  }

  function fullClosing($0, $1, $2) {
    return VOID_ELEMENTS.test($1) ? $0 : ('<' + $1 + $2 + '></' + $1 + '>');
  }

  var umap = _ => ({
    // About: get: _.get.bind(_)
    // It looks like WebKit/Safari didn't optimize bind at all,
    // so that using bind slows it down by 60%.
    // Firefox and Chrome are just fine in both cases,
    // so let's use the approach that works fast everywhere 👍
    get: key => _.get(key),
    set: (key, value) => (_.set(key, value), value)
  });

  /* istanbul ignore next */
  var normalizeAttributes = UID_IE ?
    function (attributes, parts) {
      var html = parts.join(' ');
      return parts.slice.call(attributes, 0).sort(function (left, right) {
        return html.indexOf(left.name) <= html.indexOf(right.name) ? -1 : 1;
      });
    } :
    function (attributes, parts) {
      return parts.slice.call(attributes, 0);
    }
  ;

  function find(node, path) {
    var length = path.length;
    var i = 0;
    while (i < length)
      node = node.childNodes[path[i++]];
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
          var textContent = child.textContent;
          if (textContent === UID) {
            parts.shift();
            holes.push(
              // basicHTML or other non standard engines
              // might end up having comments in nodes
              // where they shouldn't, hence this check.
              SHOULD_USE_TEXT_CONTENT.test(node.nodeName) ?
                Text(node, path) :
                Any(child, path.concat(i))
            );
          } else {
            switch (textContent.slice(0, 2)) {
              case '/*':
                if (textContent.slice(-2) !== '*/')
                  break;
              case '\uD83D\uDC7B': // ghost
                node.removeChild(child);
                i--;
                length--;
            }
          }
          break;
        case TEXT_NODE:
          // the following ignore is actually covered by browsers
          // only basicHTML ends up on previous COMMENT_NODE case
          // instead of TEXT_NODE because it knows nothing about
          // special style or textarea behavior
          /* istanbul ignore if */
          if (
            SHOULD_USE_TEXT_CONTENT.test(node.nodeName) &&
            trim.call(child.textContent) === UIDC
          ) {
            parts.shift();
            holes.push(Text(node, path));
          }
          break;
      }
      i++;
    }
  }

  function parseAttributes(node, holes, parts, path) {
    var attributes = node.attributes;
    var cache = [];
    var remove = [];
    var array = normalizeAttributes(attributes, parts);
    var length = array.length;
    var i = 0;
    while (i < length) {
      var attribute = array[i++];
      var direct = attribute.value === UID;
      var sparse;
      if (direct || 1 < (sparse = attribute.value.split(UIDC)).length) {
        var name = attribute.name;
        // the following ignore is covered by IE
        // and the IE9 double viewBox test
        /* istanbul ignore else */
        if (cache.indexOf(name) < 0) {
          cache.push(name);
          var realName = parts.shift().replace(
            direct ?
              /^(?:|[\S\s]*?\s)(\S+?)\s*=\s*('|")?$/ :
              new RegExp(
                '^(?:|[\\S\\s]*?\\s)(' + name + ')\\s*=\\s*(\'|")[\\S\\s]*',
                'i'
              ),
              '$1'
          );
          var value = attributes[realName] ||
                        // the following ignore is covered by browsers
                        // while basicHTML is already case-sensitive
                        /* istanbul ignore next */
                        attributes[realName.toLowerCase()];
          if (direct)
            holes.push(Attr(value, path, realName, null));
          else {
            var skip = sparse.length - 2;
            while (skip--)
              parts.shift();
            holes.push(Attr(value, path, realName, sparse));
          }
        }
        remove.push(attribute);
      }
    }
    length = remove.length;
    i = 0;

    /* istanbul ignore next */
    var cleanValue = 0 < length && UID_IE && !('ownerSVGElement' in node);
    while (i < length) {
      // Edge HTML bug #16878726
      var attr = remove[i++];
      // IE/Edge bug lighterhtml#63 - clean the value or it'll persist
      /* istanbul ignore next */
      if (cleanValue)
        attr.value = '';
      // IE/Edge bug lighterhtml#64 - don't use removeAttributeNode
      node.removeAttribute(attr.name);
    }

    // This is a very specific Firefox/Safari issue
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
      while (i < length)
        script.setAttributeNode(attributes[i++].cloneNode(true));
      script.textContent = node.textContent;
      node.parentNode.replaceChild(script, node);
    }
  }

  function Any(node, path) {
    return {
      type: 'any',
      node: node,
      path: path
    };
  }

  function Attr(node, path, name, sparse) {
    return {
      type: 'attr',
      node: node,
      path: path,
      name: name,
      sparse: sparse
    };
  }

  function Text(node, path) {
    return {
      type: 'text',
      node: node,
      path: path
    };
  }

  // globals

  var parsed = umap(new WeakMap$1);

  function createInfo(options, template) {
    var markup = (options.convert || sanitize)(template);
    var transform = options.transform;
    if (transform)
      markup = transform(markup);
    var content = createContent(markup, options.type);
    cleanContent(content);
    var holes = [];
    parse(content, holes, template.slice(0), []);
    return {
      content: content,
      updates: function (content) {
        var updates = [];
        var len = holes.length;
        var i = 0;
        var off = 0;
        while (i < len) {
          var info = holes[i++];
          var node = find(content, info.path);
          switch (info.type) {
            case 'any':
              updates.push({fn: options.any(node, []), sparse: false});
              break;
            case 'attr':
              var sparse = info.sparse;
              var fn = options.attribute(node, info.name, info.node);
              if (sparse === null)
                updates.push({fn: fn, sparse: false});
              else {
                off += sparse.length - 2;
                updates.push({fn: fn, sparse: true, values: sparse});
              }
              break;
            case 'text':
              updates.push({fn: options.text(node), sparse: false});
              node.textContent = '';
              break;
          }
        }
        len += off;
        return function () {
          var length = arguments.length;
          if (len !== (length - 1)) {
            throw new Error(
              (length - 1) + ' values instead of ' + len + '\n' +
              template.join('${value}')
            );
          }
          var i = 1;
          var off = 1;
          while (i < length) {
            var update = updates[i - off];
            if (update.sparse) {
              var values = update.values;
              var value = values[0];
              var j = 1;
              var l = values.length;
              off += l - 2;
              while (j < l)
                value += arguments[i++] + values[j++];
              update.fn(value);
            }
            else
              update.fn(arguments[i++]);
          }
          return content;
        };
      }
    };
  }

  function createDetails(options, template) {
    var info = parsed.get(template) || parsed.set(template, createInfo(options, template));
    return info.updates(importNode.call(document, info.content, true));
  }

  var empty = [];
  function domtagger(options) {
    var previous = empty;
    var updates = cleanContent;
    return function (template) {
      if (previous !== template)
        updates = createDetails(options, (previous = template));
      return updates.apply(null, arguments);
    };
  }

  function cleanContent(fragment) {
    var childNodes = fragment.childNodes;
    var i = childNodes.length;
    while (i--) {
      var child = childNodes[i];
      if (
        child.nodeType !== 1 &&
        trim.call(child.textContent).length === 0
      ) {
        fragment.removeChild(child);
      }
    }
  }

  /*! (c) Andrea Giammarchi - ISC */
  var hyperStyle = (function (){  // from https://github.com/developit/preact/blob/33fc697ac11762a1cb6e71e9847670d047af7ce5/src/varants.js
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
      if (original)
        style = original.cloneNode(true);
      else {
        node.setAttribute('style', '--hyper:style;');
        style = node.getAttributeNode('style');
      }
      style.value = '';
      node.setAttributeNode(style);
      return update(style, true);
    }
    function toStyle(object) {
      var key, css = [];
      for (key in object)
        css.push(key.replace(hyphen, ized), ':', object[key], ';');
      return css.join('');
    }
    function update(style, isSVG) {
      var oldType, oldValue;
      return function (newValue) {
        var info, key, styleValue, value;
        switch (typeof newValue) {
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
                if (isSVG)
                  style.value = '';
                else
                  style.cssText = '';
              }
              info = isSVG ? {} : style;
              for (key in newValue) {
                value = newValue[key];
                styleValue = typeof value === 'number' &&
                                    !IS_NON_DIMENSIONAL.test(key) ?
                                    (value + 'px') : value;
                if (!isSVG && /^--/.test(key))
                  info.setProperty(key, styleValue);
                else
                  info[key] = styleValue;
              }
              oldType = 'object';
              if (isSVG)
                style.value = toStyle((oldValue = info));
              else
                oldValue = newValue;
              break;
            }
          default:
            if (oldValue != newValue) {
              oldType = 'string';
              oldValue = newValue;
              if (isSVG)
                style.value = newValue || '';
              else
                style.cssText = newValue || '';
            }
            break;
        }
      };
    }
  }());

  /*! (c) Andrea Giammarchi - ISC */
  var Wire = (function (slice, proto) {

    proto = Wire.prototype;

    proto.ELEMENT_NODE = 1;
    proto.nodeType = 111;

    proto.remove = function (keepFirst) {
      var childNodes = this.childNodes;
      var first = this.firstChild;
      var last = this.lastChild;
      this._ = null;
      if (keepFirst && childNodes.length === 2) {
        last.parentNode.removeChild(last);
      } else {
        var range = this.ownerDocument.createRange();
        range.setStartBefore(keepFirst ? childNodes[1] : first);
        range.setEndAfter(last);
        range.deleteContents();
      }
      return first;
    };

    proto.valueOf = function (forceAppend) {
      var fragment = this._;
      var noFragment = fragment == null;
      if (noFragment)
        fragment = (this._ = this.ownerDocument.createDocumentFragment());
      if (noFragment || forceAppend) {
        for (var n = this.childNodes, i = 0, l = n.length; i < l; i++)
          fragment.appendChild(n[i]);
      }
      return fragment;
    };

    return Wire;

    function Wire(childNodes) {
      var nodes = (this.childNodes = slice.call(childNodes, 0));
      this.firstChild = nodes[0];
      this.lastChild = nodes[nodes.length - 1];
      this.ownerDocument = nodes[0].ownerDocument;
      this._ = null;
    }

  }([].slice));

  // Node.CONSTANTS
  // 'cause some engine has no global Node defined
  // (i.e. Node, NativeScript, basicHTML ... )
  const DOCUMENT_FRAGMENT_NODE = 11;

  // SVG related constants
  const OWNER_SVG_ELEMENT = 'ownerSVGElement';

  // Custom Elements / MutationObserver constants
  const CONNECTED = 'connected';
  const DISCONNECTED = 'dis' + CONNECTED;

  const {isArray} = Array;

  const {
    createDocumentFragment,
    createElement,
    createElementNS,
  } = new Proxy({}, {
    get: (_, method) => document[method].bind(document)
  });

  const createHTML = html => {
    const template = createElement('template');
    template.innerHTML = html;
    return template.content;
  };

  let xml;
  const createSVG = svg => {
    if (!xml) xml = createElementNS('http://www.w3.org/2000/svg', 'svg');
    xml.innerHTML = svg;
    const content = createDocumentFragment();
    content.append(...xml.childNodes);
    return content;
  };

  const createContent = (text, type) => type == 'svg' ?
                                createSVG(text) : createHTML(text);

  const componentType = Component.prototype.nodeType;
  const wireType = Wire.prototype.nodeType;

  const observe = disconnected({Event: CustomEvent, WeakSet});

  // returns an intent to explicitly inject content as html
  const asHTML = html => ({html});

  // returns nodes from wires and components
  const asNode = (item, i) => {
    switch (item.nodeType) {
      case wireType:
        // in the Wire case, the content can be
        // removed, post-pended, inserted, or pre-pended and
        // all these cases are handled by domdiff already
        /* istanbul ignore next */
        return (1 / i) < 0 ?
          (i ? item.remove(true) : item.lastChild) :
          (i ? item.valueOf(true) : item.firstChild);
      case componentType:
        return asNode(item.render(), i);
      default:
        return item;
    }
  };

  // returns true if domdiff can handle the value
  const canDiff = value => 'ELEMENT_NODE' in value;

  // borrowed from uhandlers
  // https://github.com/WebReflection/uhandlers
  const booleanSetter = (node, key, oldValue) => newValue => {
    if (oldValue !== !!newValue) {
      if ((oldValue = !!newValue))
        node.setAttribute(key, '');
      else
        node.removeAttribute(key);
    }
  };

  const hyperSetter = (node, name, svg) => svg ?
    value => {
      try {
        node[name] = value;
      }
      catch (nope) {
        node.setAttribute(name, value);
      }
    } :
    value => {
      node[name] = value;
    };

  // when a Promise is used as interpolation value
  // its result must be parsed once resolved.
  // This callback is in charge of understanding what to do
  // with a returned value once the promise is resolved.
  const invokeAtDistance = (value, callback) => {
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
  const isPromise_ish = value => value != null && 'then' in value;

  // list of attributes that should not be directly assigned
  const readOnly = /^(?:form|list)$/i;

  // reused every slice time
  const slice = [].slice;

  // simplifies text node creation
  const text = (node, text) => node.ownerDocument.createTextNode(text);

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
    attribute(node, name, original) {
      const isSVG = OWNER_SVG_ELEMENT in node;
      let oldValue;
      // if the attribute is the style one
      // handle it differently from others
      if (name === 'style')
        return hyperStyle(node, original, isSVG);
      // direct accessors for <input .value=${...}> and friends
      else if (name.slice(0, 1) === '.')
        return hyperSetter(node, name.slice(1), isSVG);
      // boolean accessors for <input .value=${...}> and friends
      else if (name.slice(0, 1) === '?')
        return booleanSetter(node, name.slice(1));
      // the name is an event one,
      // add/remove event listeners accordingly
      else if (/^on/.test(name)) {
        let type = name.slice(2);
        if (type === CONNECTED || type === DISCONNECTED) {
          observe(node);
        }
        else if (name.toLowerCase()
          in node) {
          type = type.toLowerCase();
        }
        return newValue => {
          if (oldValue !== newValue) {
            if (oldValue)
              node.removeEventListener(type, oldValue, false);
            oldValue = newValue;
            if (newValue)
              node.addEventListener(type, newValue, false);
          }
        };
      }
      // the attribute is special ('value' in input)
      // and it's not SVG *or* the name is exactly data,
      // in this case assign the value directly
      else if (
        name === 'data' ||
        (!isSVG && name in node && !readOnly.test(name))
      ) {
        return newValue => {
          if (oldValue !== newValue) {
            oldValue = newValue;
            if (node[name] !== newValue && newValue == null) {
              // cleanup on null to avoid silly IE/Edge bug
              node[name] = '';
              node.removeAttribute(name);
            }
            else
              node[name] = newValue;
          }
        };
      }
      else if (name in Intent.attributes) {
        return any => {
          const newValue = Intent.attributes[name](node, any);
          if (oldValue !== newValue) {
            oldValue = newValue;
            if (newValue == null)
              node.removeAttribute(name);
            else
              node.setAttribute(name, newValue);
          }
        };
      }
      // in every other case, use the attribute node as it is
      // update only the value, set it as node only when/if needed
      else {
        let owner = false;
        const attribute = original.cloneNode(true);
        return newValue => {
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
    any(node, childNodes) {
      const diffOptions = {node: asNode, before: node};
      const nodeType = OWNER_SVG_ELEMENT in node ? /* istanbul ignore next */ 'svg' : 'html';
      let fastPath = false;
      let oldValue;
      const anyContent = value => {
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
              childNodes = domdiff(
                node.parentNode,
                childNodes,
                [text(node, value)],
                diffOptions
              );
            }
            break;
          case 'function':
            anyContent(value(node));
            break;
          case 'object':
          case 'undefined':
            if (value == null) {
              fastPath = false;
              childNodes = domdiff(
                node.parentNode,
                childNodes,
                [],
                diffOptions
              );
              break;
            }
          default:
            fastPath = false;
            oldValue = value;
            if (isArray(value)) {
              if (value.length === 0) {
                if (childNodes.length) {
                  childNodes = domdiff(
                    node.parentNode,
                    childNodes,
                    [],
                    diffOptions
                  );
                }
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
                    }
                  default:
                    childNodes = domdiff(
                      node.parentNode,
                      childNodes,
                      value,
                      diffOptions
                    );
                    break;
                }
              }
            } else if (canDiff(value)) {
              childNodes = domdiff(
                node.parentNode,
                childNodes,
                value.nodeType === DOCUMENT_FRAGMENT_NODE ?
                  slice.call(value.childNodes) :
                  [value],
                diffOptions
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
              childNodes = domdiff(
                node.parentNode,
                childNodes,
                slice.call(
                  createContent(
                    [].concat(value.html).join(''),
                    nodeType
                  ).childNodes
                ),
                diffOptions
              );
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
    text(node) {
      let oldValue;
      const textContent = value => {
        if (oldValue !== value) {
          oldValue = value;
          const type = typeof value;
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

  var isNoOp = false;

  var templateLiteral = function (tl) {
    var RAW = 'raw';
    var isBroken = function (UA) {
      return /(Firefox|Safari)\/(\d+)/.test(UA) &&
            !/(Chrom[eium]+|Android)\/(\d+)/.test(UA);
    };
    var broken = isBroken((document.defaultView.navigator || {}).userAgent);
    var FTS = !(RAW in tl) ||
              tl.propertyIsEnumerable(RAW) ||
              !Object.isFrozen(tl[RAW]);
    if (broken || FTS) {
      var forever = {};
      var foreverCache = function (tl) {
        for (var key = '.', i = 0; i < tl.length; i++)
          key += tl[i].length + '.' + tl[i];
        return forever[key] || (forever[key] = tl);
      };
      // Fallback TypeScript shenanigans
      if (FTS)
        templateLiteral = foreverCache;
      // try fast path for other browsers:
      // store the template as WeakMap key
      // and forever cache it only when it's not there.
      // this way performance is still optimal,
      // penalized only when there are GC issues
      else {
        var wm = new WeakMap$1;
        var set = function (tl, unique) {
          wm.set(tl, unique);
          return unique;
        };
        templateLiteral = function (tl) {
          return wm.get(tl) || set(tl, foreverCache(tl));
        };
      }
    } else {
      isNoOp = true;
    }
    return TL(tl);
  };

  function TL(tl) {
    return isNoOp ? tl : templateLiteral(tl);
  }

  function tta (template) {
    var length = arguments.length;
    var args = [TL(template)];
    var i = 1;
    while (i < length)
      args.push(arguments[i++]);
    return args;
  }
  /**
   * best benchmark goes here
   * https://jsperf.com/tta-bench
   * I should probably have an @ungap/template-literal-es too
  export default (...args) => {
    args[0] = unique(args[0]);
    return args;
  };
   */

  // all wires used per each context
  const wires = new WeakMap;

  // A wire is a callback used as tag function
  // to lazily relate a generic object to a template literal.
  // hyper.wire(user)`<div id=user>${user.name}</div>`; => the div#user
  // This provides the ability to have a unique DOM structure
  // related to a unique JS object through a reusable template literal.
  // A wire can specify a type, as svg or html, and also an id
  // via html:id or :id convention. Such :id allows same JS objects
  // to be associated to different DOM structures accordingly with
  // the used template literal without losing previously rendered parts.
  const wire = (obj, type) => obj == null ?
    content(type || 'html') :
    weakly(obj, type || 'html');

  // A wire content is a virtual reference to one or more nodes.
  // It's represented by either a DOM node, or an Array.
  // In both cases, the wire content role is to simply update
  // all nodes through the list of related callbacks.
  // In few words, a wire content is like an invisible parent node
  // in charge of updating its content like a bound element would do.
  const content = type => {
    let wire, tagger, template;
    return function () {
      const args = tta.apply(null, arguments);
      if (template !== args[0]) {
        template = args[0];
        tagger = new Tagger(type);
        wire = wireContent(tagger.apply(tagger, args));
      } else {
        tagger.apply(tagger, args);
      }
      return wire;
    };
  };

  // wires are weakly created through objects.
  // Each object can have multiple wires associated
  // and this is thanks to the type + :id feature.
  const weakly = (obj, type) => {
    const i = type.indexOf(':');
    let wire = wires.get(obj);
    let id = type;
    if (-1 < i) {
      id = type.slice(i + 1);
      type = type.slice(0, i) || 'html';
    }
    if (!wire)
      wires.set(obj, wire = {});
    return wire[id] || (wire[id] = content(type));
  };

  // A document fragment loses its nodes 
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
  const wireContent = node => {
    const childNodes = node.childNodes;
    const {length} = childNodes;
    return length === 1 ?
      childNodes[0] :
      (length ? new Wire(childNodes) : node);
  };

  // a weak collection of contexts that
  // are already known to hyperHTML
  const bewitched = new WeakMap;

  // better known as hyper.bind(node), the render is
  // the main tag function in charge of fully upgrading
  // or simply updating, contexts used as hyperHTML targets.
  // The `this` context is either a regular DOM node or a fragment.
  function render() {
    const wicked = bewitched.get(this);
    const args = tta.apply(null, arguments);
    if (wicked && wicked.template === args[0]) {
      wicked.tagger.apply(null, args);
    } else {
      upgrade.apply(this, args);
    }
    return this;
  }

  // an upgrade is in charge of collecting template info,
  // parse it once, if unknown, to map all interpolations
  // as single DOM callbacks, relate such template
  // to the current context, and render it after cleaning the context up
  function upgrade(template) {
    const type = OWNER_SVG_ELEMENT in this ? 'svg' : 'html';
    const tagger = new Tagger(type);
    bewitched.set(this, {tagger, template: template});
    this.textContent = '';
    this.appendChild(tagger.apply(null, arguments));
  }

  /*! (c) Andrea Giammarchi (ISC) */

  // all functions are self bound to the right context
  // you can do the following
  // const {bind, wire} = hyperHTML;
  // and use them right away: bind(node)`hello!`;
  const bind = context => render.bind(context);
  const define = Intent.define;
  const tagger = Tagger.prototype;

  hyper.Component = Component;
  hyper.bind = bind;
  hyper.define = define;
  hyper.diff = domdiff;
  hyper.hyper = hyper;
  hyper.observe = observe;
  hyper.tagger = tagger;
  hyper.wire = wire;

  // the wire content is the lazy defined
  // html or svg property of each hyper.Component
  setup(content);

  // by default, hyperHTML is a smart function
  // that "magically" understands what's the best
  // thing to do with passed arguments
  function hyper(HTML) {
    return arguments.length < 2 ?
      (HTML == null ?
        content('html') :
        (typeof HTML === 'string' ?
          hyper.wire(null, HTML) :
          ('raw' in HTML ?
            content('html')(HTML) :
            ('nodeType' in HTML ?
              hyper.bind(HTML) :
              weakly(HTML, 'html')
            )
          )
        )) :
      ('raw' in HTML ?
        content('html') : hyper.wire
      ).apply(null, arguments);
  }

  
  
  
  
  
  
  
  
  

  return hyper;

})(document);
