var projectFiles = [
  '../cjs/classes/Aura.js',
  '../cjs/classes/Component.js',
  '../cjs/hyper/render.js',
  '../cjs/hyper/wire.js',
  '../cjs/objects/Path.js',
  '../cjs/objects/Transformer.js',
  '../cjs/objects/Updates.js',
  '../cjs/shared/constants.js',
  '../cjs/shared/easy-dom.js',
  '../cjs/shared/features-detection.js',
  '../cjs/shared/poorlyfills.js',
  '../cjs/shared/utils.js',
  '../cjs/main.js'
];

function usableAfter(object, property, times) {
  if (!times) times = 0;
  var original = object[property], i = 0;
  Object.defineProperty(object, property, {
    get() {
      return i++ < times ? void 0 : original;
    }
  });
}

global.tressa = require('tressa');

const {Document, HTMLElement} = require('basichtml');
global.window = global;
global.document = new Document();
global.customElements = document.customElements;

document.importNode = function (node, deep) {
  return node.cloneNode(deep);
};

customElements.define('input', class extends HTMLElement {
  get name() { return this.getAttribute('name'); }
  set name(text) { this.setAttribute('name', text); }
  get value() { return this.getAttribute('value'); }
  set value(text) { this.setAttribute('value', text); }
});

global.hyperHTML = require('../cjs/main.js').default;

require('./test.js');

setTimeout(function () {

  projectFiles.forEach(name => {
    delete require.cache[require.resolve(name)];
  });
  delete require.cache[require.resolve('./test.js')];

  usableAfter(Array, 'isArray', 1);
  usableAfter(String.prototype, 'trim', 1);

  global.navigator = {userAgent: 'Firefox/54'};

  delete document.importNode;
  delete Object.getPrototypeOf(document.constructor.prototype).importNode;
  delete Object.getPrototypeOf(document.createDocumentFragment().constructor.prototype).append;

  var createElement = document.createElement;
  document.createElement = function (name) {
    return createElement.call(this, name === 'template' ? 'div' : name);
  };

  var createDocumentFragment = document.createDocumentFragment, cDF = 0;
  document.createDocumentFragment = function () {
    return cDF++ === 0 ?
      {
        ownerDocument: document,
        appendChild: Object,
        cloneNode: function () {
          return {childNodes: {length: 1}};
        }
      } :
      createDocumentFragment.call(document);
  };

  global.WeakMap = global.WeakSet = global.Map = void 0;

  global.Event = function (type) {
    var e = global.document.createEvent('Event');
    e.initEvent(type, false, false);
    return e;
  };
  global.MutationObserver = function (fn) {
    return {observe: function (document) {
      document.addEventListener('DOMNodeInserted', function (e) {
        fn([{
          addedNodes: [e.target],
          removedNodes: []
        }]);
      }, false);
      document.addEventListener('DOMNodeRemoved', function (e) {
        fn([{
          addedNodes: [],
          removedNodes: [e.target]
        }]);
      }, false);
    }};
  };

  global.hyperHTML = require('../cjs/main.js').default;
  require('./test.js');

}, 1000);

/*
require('jsdom').env(
  require('fs').readFileSync(__dirname + '/index.html').toString(),
  [],
  function (err, window) {
    global.document = window.document;
    global.tressa = require('tressa');
    var Int32Array = global.Int32Array;
    global.Int32Array = void 0;
    global.hyperHTML = require('../index.js');
    global.Int32Array = Int32Array;
    require('./test.js');
    setTimeout(function () {
      var proto = global.document.createDocumentFragment();
      do {
        proto = Object.getPrototypeOf(proto);
      } while(!Object.getOwnPropertyNames(proto, 'children'));

      delete proto.children;

      global.navigator = {userAgent: 'Firefox/54'};
      Object.prototype.append = function () {
        [].forEach.call(arguments, this.appendChild, this);
      };
      Object.prototype.nodeType = 2;
      var $Map = global.Map;
      // var $CustomEvent = global.CustomEvent;
      global.String.prototype.trim = global.WeakMap = global.WeakSet = global.Map = void 0;
      delete require.cache[require.resolve('../index.js')];
      delete require.cache[require.resolve('./test.js')];
      delete global.document.importNode;
      delete Object.getPrototypeOf(global.document).importNode;
      // fake initial feature detection
      var createElement = global.document.createElement;
      var templates = 0;
      global.document.createElement = function () {
        global.document.createElement = function (name) {
          return createElement.call(
            global.document,
            name === 'template' ? (++templates % 15 ? 'div' : name) : name);
        };
        //delete document.createElement('template').constructor.prototype.content;
        return {firstChild:{attributes:[{name:'class'}]}};
      };
      var isArray = Array.isArray;
      delete Array.isArray;

      // forcing once IE11 shenanigans with fragments
      var createDocumentFragment = global.document.createDocumentFragment;
      global.document.createDocumentFragment = function () {
        this.createDocumentFragment = createDocumentFragment;
        var featureDetection = createDocumentFragment.call(global.document);
        var appendChild = featureDetection.appendChild;
        featureDetection.appendChild = function (child) {
          if (child.textContent.length) appendChild.call(this, child);
          else featureDetection.appendChild = appendChild;
          return this;
        };
        return featureDetection;
      };
      var bind = Function.prototype.bind;
      delete Function.prototype.bind;

      global.Event = function (type) {
        var e = global.document.createEvent('Event');
        e.initEvent(type, false, false);
        return e;
      };
      global.MutationObserver = function (fn) {
        return {observe: function (document) {
          document.addEventListener('DOMNodeInserted', function (e) {
            fn([{
              addedNodes: [e.target],
              removedNodes: []
            }]);
          }, false);
          document.addEventListener('DOMNodeRemoved', function (e) {
            fn([{
              addedNodes: [],
              removedNodes: [e.target]
            }]);
          }, false);
        }};
      };
      global.hyperHTML = require('../index.js');
      
      Function.prototype.bind = bind;

      Array.isArray = isArray;
      Map = $Map;

      // how to reproduce the lovely double viewPort fucktard IE9 behavior?
      var div = global.document.createElement('div');
      div.innerHTML = '<svg></svg>';
      var removeAttributeNode = div.firstChild.constructor.prototype.removeAttributeNode;
      var lastRemovedNode;
      div.firstChild.constructor.prototype.removeAttributeNode = function (attribute) {
        lastRemovedNode = attribute;
        return removeAttributeNode.apply(this, arguments);
      };
      var create = Object.create;
      Object.create = function (proto) {
        if (proto === null && arguments.length < 2) {
          return {get viewBox() {
            return lastRemovedNode;
          }};
        }
        else {
          return create.apply(null, arguments);
        }
      };
      require('./test.js');
    }, 500);
  }
);
*/