require('jsdom').env(
  require('fs').readFileSync(__dirname + '/index.html').toString(),
  [],
  function (err, window) {
    /*
    if (!global.CustomEvent) {
      global.CustomEvent = function (type, init) {
        var e = document.createEvent('Event');
        e.initEvent(type, init.bubbles, init.cancelable);
        e.detail = init.detail;
        return e;
      };
    }
    //*/
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
