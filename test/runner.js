require('jsdom').env(
  require('fs').readFileSync(__dirname + '/index.html').toString(),
  [],
  function (err, window) {
    global.document = window.document;
    global.tressa = require('tressa');
    global.hyperHTML = require('../hyperhtml.js');
    require('./test.js');
    setTimeout(function () {
      global.String.prototype.trim = global.WeakMap = void 0;
      delete require.cache[require.resolve('../hyperhtml.js')];
      delete require.cache[require.resolve('./test.js')];
      // fake initial feature detection
      var createElement = global.document.createElement;
      global.document.createElement = function () {
        global.document.createElement = createElement;
        return {firstChild:{attributes:[{name:'class'}]}};
      };
      global.hyperHTML = require('../hyperhtml.js');
      require('./test.js');
    }, 500);
  }
);
