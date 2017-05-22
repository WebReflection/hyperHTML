require('jsdom').env(
  require('fs').readFileSync(__dirname + '/index.html').toString(),
  [],
  function (err, window) {
    global.String.prototype.trim = global.WeakMap = void 0;
    global.document = window.document;
    global.hyperHTML = require('../hyperhtml.js');
    global.tressa = require('tressa');
    require('./test.js');
  }
);
