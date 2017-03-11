require('jsdom').env(
  require('fs').readFileSync(__dirname + '/index.html').toString(),
  [],
  function (err, window) {
    global.document = window.document;
    global.hyperHTML = require('../min.js');
    global.tressa = require('tressa');
    require('./test.js');
  }
);
