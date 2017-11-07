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

  require(1);
  require(3);
  var Path = require.I(require(5));

  var hyper = function hyper() {};
  require.E(exports).default = hyper;

  exports.Path = Path;
}, function (global, require, module, exports) {
  // classes/Aura.js
  'use strict';

  var majinbuu = require.I(require(2));

  // used as class but it returns a modified childNodes
  // it's not worth to use Babel class transpilation
  // for an utility facade with a context for convenience
  require.E(exports).default = Aura;

  function Aura(node, childNodes) {
    this.node = node;
    this.childNodes = childNodes;
    childNodes.become = become;
    return majinbuu.aura(this, childNodes);
  }

  // reflected through hyperHTML.MAX_LIST_SIZE
  Aura.MAX_LIST_SIZE = 1000;

  // wraps childNodes splice to pass through the Aura
  Aura.prototype.splice = function splice() {
    var ph = this.node;
    var cn = this.childNodes;
    var target = cn[(arguments.length <= 0 ? undefined : arguments[0]) + ((arguments.length <= 1 ? undefined : arguments[1]) || 0)] || ph;
    var result = cn.splice.apply(cn, arguments);
    var pn = ph.parentNode;
    var doc = pn.ownerDocument;
    for (var tmp, i = 0, length = result.length; i < length; i++) {
      tmp = result[i];
      // TODO: this is not optimal (but necessary)
      if (cn.indexOf(tmp) < 0) {
        pn.removeChild(tmp);
      }
    }
    for (var _tmp, _i = 2, _length = arguments.length; _i < _length; pn.insertBefore(_tmp, target)) {
      if (_length - _i === 1) {
        var _ref;

        _tmp = (_ref = _i++, arguments.length <= _ref ? undefined : arguments[_ref]);
      } else {
        _tmp = doc.createDocumentFragment();
        while (_i < _length) {
          var _ref2;

          _tmp.appendChild((_ref2 = _i++, arguments.length <= _ref2 ? undefined : arguments[_ref2]));
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
    var $splice = function $splice() {
      list.splice = splice;
      var result = splicer.splice.apply(splicer, arguments);
      list.splice = $splice;
      return result;
    };
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
  // classes/Component.js
  'use strict';

  var wire = require.I(require(4));

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

  // no need for a transpiled class here
  // Component needs lazy prototype accessors.
  // Using modern syntax to define it won't be enough
  function Component() {}
  Object.defineProperties(Component.prototype, {
    // same as HyperHTMLElement handleEvent
    handleEvent: {
      value: function value(e) {
        // both IE < 11 and JSDOM lack dataset
        var ct = e.currentTarget;
        this['getAttribute' in ct && ct.getAttribute('data-call') || 'on' + e.type](e);
      }
    },
    // returns its own HTML wire or create it once on comp.render()
    html: lazyGetter('html', wire.content),
    // returns its own SVG wire or create it once on comp.render()
    svg: lazyGetter('svg', wire.content),
    // same as HyperHTMLElement state
    state: lazyGetter('state', function () {
      return this.defaultState;
    }),
    // same as HyperHTMLElement get defaultState
    defaultState: {
      get: function get() {
        return {};
      }
    },
    // same as HyperHTMLElement setState
    setState: {
      value: function value(state) {
        var target = this.state;
        var source = typeof state === 'function' ? state.call(this, target) : state;
        for (var key in source) {
          target[key] = source[key];
        }this.render();
      }
    }
    // the render must be defined when extending hyper.Component
    // the render **must** return either comp.html or comp.svg wire
    // render() { return this.html`<p>that's it</p>`; }
  });

  require.E(exports).default = Component;
}, function (global, require, module, exports) {
  // hyper/wire.js
  'use strict';

  var wire = {};

  require.E(exports).default = wire;
}, function (global, require, module, exports) {
  // objects/Path.js
  'use strict';

  var _require = require(6),
      ATTRIBUTE_NODE = _require.ATTRIBUTE_NODE,
      COMMENT_NODE = _require.COMMENT_NODE,
      DOCUMENT_FRAGMENT_NODE = _require.DOCUMENT_FRAGMENT_NODE,
      ELEMENT_NODE = _require.ELEMENT_NODE;

  // always use childNodes
  // as it turned out retrieving them
  // is just as fast as retrieving children
  // if not faster (it also makes sense)
  // https://jsperf.com/child-ren-nodes/1


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
      case ATTRIBUTE_NODE:
      default:
        // jsdom here does not provide a nodeType 2 ...
        parentNode = node.ownerElement;
        path.unshift('attributes', node.name);
        break;
    }
    for (node = parentNode; parentNode = parentNode.parentNode; node = parentNode) {
      prepend(path, parentNode, node);
    }
    return path;
  };

  var Path = {
    create: function create(type, node, name) {
      return { type: type, name: name, path: createPath(node) };
    },
    find: function find(node, path) {
      var length = path.length;
      for (var i = 0; i < length; i++) {
        var key = path[i++];
        if (key === 'attributes') {
          node.setAttributeNode(node.ownerDocument.createAttribute(path[i]));
        }
        node = node[key][path[i]];
      }
      return node;
    }
  };

  require.E(exports).default = Path;
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
}]);
