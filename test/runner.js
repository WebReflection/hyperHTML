require('jsdom').env(
  require('fs').readFileSync(__dirname + '/index.html').toString(),
  [],
  function (err, window) {
    global.document = window.document;
    global.tressa = require('tressa');
    global.hyperHTML = require('../hyperhtml.js');
    require('./test.js');
    setTimeout(function () {
      var proto = global.document;
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
      global.String.prototype.trim = global.WeakMap = global.Map = void 0;
      delete require.cache[require.resolve('../hyperhtml.js')];
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
      global.hyperHTML = require('../hyperhtml.js');
      Array.isArray = isArray;
      Map = $Map;
      require('./test.js');
    }, 500);
  }
);
