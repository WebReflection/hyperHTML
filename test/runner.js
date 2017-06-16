require('jsdom').env(
  require('fs').readFileSync(__dirname + '/index.html').toString(),
  [],
  function (err, window) {
    global.document = window.document;
    global.tressa = require('tressa');
    global.hyperHTML = require('../hyperhtml.js');
    require('./test.js');
    setTimeout(function () {
      Object.prototype.append = function () {
        [].forEach.call(arguments, this.appendChild, this);
      };
      Object.prototype.nodeType = 2;
      global.String.prototype.trim = global.WeakMap = void 0;
      delete require.cache[require.resolve('../hyperhtml.js')];
      delete require.cache[require.resolve('./test.js')];
      // fake initial feature detection
      var createElement = global.document.createElement;
      var templates = 0;
      global.document.createElement = function () {
        global.document.createElement = function (name) {
          return createElement.call(
            global.document,
            name === 'template' ? (++templates % 2 ? 'div' : name) : name);
        };
        //delete global.document.createElement('template').constructor.prototype.content;
        return {firstChild:{attributes:[{name:'class'}]}};
      };
      global.hyperHTML = require('../hyperhtml.js');
      require('./test.js');
    }, 500);
  }
);
