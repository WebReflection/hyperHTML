require('jsdom').env(
  require('fs').readFileSync(__dirname + '/index.html').toString(),
  [],
  function (err, window) {
    global.hyperHTML = require('../min.js');
    global.tressa = require('tressa');
    global.document = window.document;
    require('./test.js');
  }
);
