function usableAfter(object, property, times) {
  if (!times) times = 0;
  var original = object[property], i = 0;
  Object.defineProperty(object, property, {
    get() {
      return i++ < times ? void 0 : original;
    }
  });
}

const $WeakMap = global.WeakMap;

global.tressa = require('tressa');

const {CustomEvent, Document, HTMLElement} = require('basichtml');
global.window = global;
global.document = new Document();
global.customElements = document.customElements;
global.CustomEvent = CustomEvent;

document.importNode = function (node, deep) {
  return node.cloneNode(deep);
};

customElements.define('input', class extends HTMLElement {
  get name() { return this.getAttribute('name'); }
  set name(text) { this.setAttribute('name', text); }
  get value() { return this.getAttribute('value'); }
  set value(text) { this.setAttribute('value', text); }
});

global.hyperHTML = require('../cjs').default;

require('./test.js');

setTimeout(function () {
  return;

  delete require.cache[require.resolve('../cjs')];
  delete require.cache[require.resolve('./test.js')];

  usableAfter(Array, 'isArray', 1);
  usableAfter(String.prototype, 'trim', 1);

  global.navigator = {userAgent: 'Firefox/54'};

  /*
  const propertyIsEnumerable = {}.propertyIsEnumerable;
  Object.prototype.propertyIsEnumerable = function (key) {
    return key === 'raw' ? true : propertyIsEnumerable.call(this, key);
  };
  */

  delete global.Int32Array;
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

  window.hyperHTML = require('../cjs').default;
  require('./domdiff.js');
  require('./test.js');

  if ($WeakMap) setTimeout(() => {
    delete require.cache[require.resolve('../cjs')];
    delete require.cache[require.resolve('./test.js')];
    global.WeakMap = function () {
      const wm = new $WeakMap;
      wm.get = () => false;
      return wm;
    };
    require('../cjs');
    require('./test.js');
  }, 2000);
}, 3000);