var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n    <p data-counter="', '">\n      Time: ', '\n    </p>\n    '], ['\n    <p data-counter="', '">\n      Time: ', '\n    </p>\n    ']),
    _templateObject2 = _taggedTemplateLiteral(['<p>', ' world</p>'], ['<p>', ' world</p>']),
    _templateObject3 = _taggedTemplateLiteral(['<p>', '</p>'], ['<p>', '</p>']),
    _templateObject4 = _taggedTemplateLiteral(['<a href="#" onClick="', '">click</a>'], ['<a href="#" onClick="', '">click</a>']),
    _templateObject5 = _taggedTemplateLiteral(['<span onCustom-EVENT="', '">how cool</span>'], ['<span onCustom-EVENT="', '">how cool</span>']),
    _templateObject6 = _taggedTemplateLiteral(['\n        <p>1</p>\n      '], ['\n        <p>1</p>\n      ']),
    _templateObject7 = _taggedTemplateLiteral(['\n        0\n        <p>1</p>\n      '], ['\n        0\n        <p>1</p>\n      ']),
    _templateObject8 = _taggedTemplateLiteral(['', ''], ['', '']),
    _templateObject9 = _taggedTemplateLiteral(['a'], ['a']),
    _templateObject10 = _taggedTemplateLiteral(['b'], ['b']),
    _templateObject11 = _taggedTemplateLiteral(['\n      <span style="', '">O</span>'], ['\n      <span style="', '">O</span>']),
    _templateObject12 = _taggedTemplateLiteral(['\n      <section>\n        <ul>', '</ul>\n      </section>'], ['\n      <section>\n        <ul>', '</ul>\n      </section>']),
    _templateObject13 = _taggedTemplateLiteral(['\n            <li data-test="', '">', '</li>\n            '], ['\n            <li data-test="', '">', '</li>\n            ']),
    _templateObject14 = _taggedTemplateLiteral(['<div>', '</div>'], ['<div>', '</div>']),
    _templateObject15 = _taggedTemplateLiteral(['<a></a>'], ['<a></a>']),
    _templateObject16 = _taggedTemplateLiteral(['<p></p>'], ['<p></p>']),
    _templateObject17 = _taggedTemplateLiteral(['<p>', '</p>', '<hr><div>', '</div>', ''], ['<p>', '</p>', '<hr><div>', '</div>', '']),
    _templateObject18 = _taggedTemplateLiteral(['<!--not hyperHTML-->'], ['<!--not hyperHTML-->']),
    _templateObject19 = _taggedTemplateLiteral(['<br/>', ''], ['<br/>', '']),
    _templateObject20 = _taggedTemplateLiteral(['', '<br/>'], ['', '<br/>']),
    _templateObject21 = _taggedTemplateLiteral(['<style> ', ' </style>'], ['<style> ', ' </style>']),
    _templateObject22 = _taggedTemplateLiteral(['a=', ''], ['a=', '']),
    _templateObject23 = _taggedTemplateLiteral(['[', ']'], ['[', ']']),
    _templateObject24 = _taggedTemplateLiteral(['<p onclick="', '" onmouseover="', '" align="', '"></p>'], ['<p onclick="', '" onmouseover="', '" align="', '"></p>']),
    _templateObject25 = _taggedTemplateLiteral(['<br/>', '<br/>'], ['<br/>', '<br/>']),
    _templateObject26 = _taggedTemplateLiteral(['<rect x="1" y="2" />'], ['<rect x="1" y="2" />']),
    _templateObject27 = _taggedTemplateLiteral(['<svg></svg>'], ['<svg></svg>']),
    _templateObject28 = _taggedTemplateLiteral([''], ['']),
    _templateObject29 = _taggedTemplateLiteral(['<tr><td>ok</td></tr>'], ['<tr><td>ok</td></tr>']),
    _templateObject30 = _taggedTemplateLiteral([' <br/>', '<br/> '], [' <br/>', '<br/> ']),
    _templateObject31 = _taggedTemplateLiteral(['<textarea style=', '>', '</textarea>'], ['<textarea style=', '>', '</textarea>']),
    _templateObject32 = _taggedTemplateLiteral(['<p data=', '></p>'], ['<p data=', '></p>']),
    _templateObject33 = _taggedTemplateLiteral(['<p data=', '>', '</p>'], ['<p data=', '>', '</p>']),
    _templateObject34 = _taggedTemplateLiteral(['<textarea new>', '</textarea>'], ['<textarea new>', '</textarea>']),
    _templateObject35 = _taggedTemplateLiteral(['<p><!--ok--></p>'], ['<p><!--ok--></p>']),
    _templateObject36 = _taggedTemplateLiteral(['<rect style=', ' />'], ['<rect style=', ' />']),
    _templateObject37 = _taggedTemplateLiteral(['\n    <input value="', '" shaka="', '">'], ['\n    <input value="', '" shaka="', '">']),
    _templateObject38 = _taggedTemplateLiteral(['\n      <div>First name: ', '</div>\n      <p></p>'], ['\n      <div>First name: ', '</div>\n      <p></p>']),
    _templateObject39 = _taggedTemplateLiteral(['\n    <p></p>', ''], ['\n    <p></p>', '']),
    _templateObject40 = _taggedTemplateLiteral(['<textarea>', '</textarea>'], ['<textarea>', '</textarea>']),
    _templateObject41 = _taggedTemplateLiteral(['<p _foo=', '></p>'], ['<p _foo=', '></p>']),
    _templateObject42 = _taggedTemplateLiteral(['<p test=', '></p>'], ['<p test=', '></p>']),
    _templateObject43 = _taggedTemplateLiteral(['a ', ''], ['a ', '']),
    _templateObject44 = _taggedTemplateLiteral(['<p any-attr=', '>any content</p>'], ['<p any-attr=', '>any content</p>']),
    _templateObject45 = _taggedTemplateLiteral(['<input name=', '>'], ['<input name=', '>']),
    _templateObject46 = _taggedTemplateLiteral(['abc'], ['abc']),
    _templateObject47 = _taggedTemplateLiteral(['<p>a', 'c</p>'], ['<p>a', 'c</p>']),
    _templateObject48 = _taggedTemplateLiteral(['a', 'c'], ['a', 'c']),
    _templateObject49 = _taggedTemplateLiteral(['<rect />'], ['<rect />']),
    _templateObject50 = _taggedTemplateLiteral(['<div data=', '>abc</div>'], ['<div data=', '>abc</div>']),
    _templateObject51 = _taggedTemplateLiteral(['\n      <button>hello</button>'], ['\n      <button>hello</button>']),
    _templateObject52 = _taggedTemplateLiteral(['\n      <rect x=', ' y=', ' />'], ['\n      <rect x=', ' y=', ' />']),
    _templateObject53 = _taggedTemplateLiteral(['\n      <p attr=', ' onclick=', '>hello</p>'], ['\n      <p attr=', ' onclick=', '>hello</p>']),
    _templateObject54 = _taggedTemplateLiteral(['\n        <p data-call="test" onclick=', '>hello</p>'], ['\n        <p data-call="test" onclick=', '>hello</p>']),
    _templateObject55 = _taggedTemplateLiteral(['<div>\n      <dumb-element dumb=', ' asd=', '></dumb-element><dumber-element dumb=', '></dumber-element>\n    </div>'], ['<div>\n      <dumb-element dumb=', ' asd=', '></dumb-element><dumber-element dumb=', '></dumber-element>\n    </div>']),
    _templateObject56 = _taggedTemplateLiteral(['<ul>\n      ', '\n    </ul>'], ['<ul>\n      ', '\n    </ul>']),
    _templateObject57 = _taggedTemplateLiteral(['<li data-id=', '>', '</li>'], ['<li data-id=', '>', '</li>']),
    _templateObject58 = _taggedTemplateLiteral(['\n        <p onconnected=', ' ondisconnected=', '>hello</p>'], ['\n        <p onconnected=', ' ondisconnected=', '>hello</p>']),
    _templateObject59 = _taggedTemplateLiteral(['<p style=', '></p>'], ['<p style=', '></p>']),
    _templateObject60 = _taggedTemplateLiteral(['<svg viewBox=', '></svg>'], ['<svg viewBox=', '></svg>']),
    _templateObject61 = _taggedTemplateLiteral(['<a-scene></a-scene>'], ['<a-scene></a-scene>']);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

tressa.title('HyperHTML');
tressa.assert(typeof hyperHTML === 'function', 'hyperHTML is a function');

try {
  tressa.log('');
} catch (e) {
  tressa.log = console.log.bind(console);
}

tressa.async(function (done) {
  tressa.log('## injecting text and attributes');
  var i = 0;
  var div = document.body.appendChild(document.createElement('div'));
  var render = hyperHTML.bind(div);
  function update(i) {
    return render(_templateObject, i,
    // IE Edge mobile did something funny here
    // as template string returned xxx.xxxx
    // but as innerHTML returned xxx.xx
    (Math.random() * new Date()).toFixed(2));
  }
  function compare(html) {
    return (/^\s*<p data-counter="\d">\s*Time: \d+\.\d+<[^>]+?>\s*<\/p>\s*$/i.test(html)
    );
  }
  var html = update(i++).innerHTML;
  var p = div.querySelector('p');
  var attr = p.attributes[0];
  tressa.assert(compare(html), 'correct HTML');
  tressa.assert(html === div.innerHTML, 'correctly returned');
  setTimeout(function () {
    tressa.log('## updating same nodes');
    var html = update(i++).innerHTML;
    tressa.assert(compare(html), 'correct HTML update');
    tressa.assert(html === div.innerHTML, 'update applied');
    tressa.assert(p === div.querySelector('p'), 'no node was changed');
    tressa.assert(attr === p.attributes[0], 'no attribute was changed');
    done();
  });
}).then(function () {
  return tressa.async(function (done) {
    tressa.log('## perf: same virtual text twice');
    var div = document.body.appendChild(document.createElement('div'));
    var render = hyperHTML.bind(div);
    var html = (update('hello').innerHTML, update('hello').innerHTML);
    function update(text) {
      return render(_templateObject2, text);
    }
    tressa.assert(update('hello').innerHTML === update('hello').innerHTML, 'same text');
    done(div);
  });
}).then(function () {
  return tressa.async(function (done) {
    tressa.log('## injecting HTML');
    var div = document.body.appendChild(document.createElement('div'));
    var render = hyperHTML.bind(div);
    var html = update('hello').innerHTML;
    function update(text) {
      return render(_templateObject3, ['<strong>' + text + '</strong>']);
    }
    function compare(html) {
      return (/^<p><strong>\w+<\/strong><!--.+?--><\/p>$/i.test(html)
      );
    }
    tressa.assert(compare(html), 'HTML injected');
    tressa.assert(html === div.innerHTML, 'HTML returned');
    done(div);
  });
}).then(function (div) {
  return tressa.async(function (done) {
    tressa.log('## function attributes');
    var render = hyperHTML.bind(div);
    var times = 0;
    update(function (e) {
      console.log(e.type);
      if (++times > 1) {
        return tressa.assert(false, 'events are broken');
      }
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      tressa.assert(true, 'onclick invoked');
      tressa.assert(!a.hasAttribute('onclick'), 'no attribute');
      update(null);
      e = document.createEvent('Event');
      e.initEvent('click', false, false);
      a.dispatchEvent(e);
      done(div);
    });
    function update(click) {
      // also test case-insensitive builtin events
      return render(_templateObject4, click);
    }
    var a = div.querySelector('a');
    var e = document.createEvent('Event');
    e.initEvent('click', false, false);
    a.dispatchEvent(e);
  });
}).then(function (div) {
  return tressa.async(function (done) {
    tressa.log('## changing template');
    var render = hyperHTML.bind(div);
    var html = update('hello').innerHTML;
    function update(text) {
      return render(_templateObject3, { any: ['<em>' + text + '</em>'] });
    }
    function compare(html) {
      return (/^<p><em>\w+<\/em><!--.+?--><\/p>$/i.test(html)
      );
    }
    tressa.assert(compare(html), 'new HTML injected');
    tressa.assert(html === div.innerHTML, 'new HTML returned');
    done(div);
  });
}).then(function () {
  return tressa.async(function (done) {
    tressa.log('## custom events');
    var render = hyperHTML.bind(document.createElement('p'));
    var e = document.createEvent('Event');
    e.initEvent('Custom-EVENT', true, true);
    render(_templateObject5, function (e) {
      tressa.assert(e.type === 'Custom-EVENT', 'event triggered');
      done();
    }).firstElementChild.dispatchEvent(e);
  });
}).then(function () {
  return tressa.async(function (done) {
    tressa.log('## hyperHTML.wire()');

    var render = hyperHTML.wire();
    var update = function update() {
      return render(_templateObject6);
    };
    var node = update();
    tressa.assert(node.nodeName.toLowerCase() === 'p', 'correct node');
    var same = update();
    tressa.assert(node === same, 'same node returned');

    render = hyperHTML.wire(null);
    update = function update() {
      return render(_templateObject7);
    };
    node = update();
    tressa.assert(Array.isArray(node), 'list of nodes');
    same = update();
    tressa.assert(node.length === same.length && node[0] && node.every(function (n, i) {
      return same[i] === n;
    }), 'same list returned');
    var div = document.createElement('div');
    render = hyperHTML.bind(div);
    render(_templateObject8, node);
    same = div.childNodes;
    tressa.assert(node[0] && node.every(function (n, i) {
      return same[i] === n;
    }), 'same list applied');

    render = hyperHTML.wire();
    if (function (s) {
      return s;
    }(_templateObject9) === function (s) {
      return s;
    }(_templateObject9)) {
      tressa.assert(render(_templateObject9) === render(_templateObject9) && render(_templateObject9) !== render(_templateObject10), 'template sensible wire');
    } else {
      tressa.log('⚠️ this *browser* is *not spec compliant*');
    }

    done();
  });
}).then(function () {
  return tressa.async(function (done) {
    tressa.log('## hyperHTML.wire(object)');
    var point = { x: 1, y: 2 };
    function update() {
      return hyperHTML.wire(point)(_templateObject11, '\n        position: absolute;\n        left: ' + point.x + 'px;\n        top: ' + point.y + 'px;\n      ');
    }
    try {
      update();
    } catch (e) {
      console.error(e);
    }
    tressa.assert(update() === update(), 'same output');
    tressa.assert(hyperHTML.wire(point) === hyperHTML.wire(point), 'same wire');
    done();
  });
}).then(function () {
  if (typeof MutationObserver === 'undefined') return;
  return tressa.async(function (done) {
    tressa.log('## preserve first child where first child is the same as incoming');
    var div = document.body.appendChild(document.createElement('div'));
    var render = hyperHTML.bind(div);
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0, len = mutations.length; i < len; i++) {
        trackMutations(mutations[i].addedNodes, 'added');
        trackMutations(mutations[i].removedNodes, 'removed');
      }
    });

    observer.observe(div, {
      childList: true,
      subtree: true
    });

    var counters = [];

    function trackMutations(nodes, countKey) {
      for (var i = 0, len = nodes.length, counter, key; i < len; i++) {
        if (nodes[i] && nodes[i].getAttribute && nodes[i].getAttribute('data-test')) {
          key = nodes[i].getAttribute('data-test');
          counter = counters[key] || (counters[key] = { added: 0, removed: 0 });
          counter[countKey]++;
        }
        if (nodes[i].childNodes.length > 0) {
          trackMutations(nodes[i].childNodes, countKey);
        }
      }
    }

    var listItems = [];

    function update(items) {
      render(_templateObject12, items.map(function (item, i) {
        return hyperHTML.wire(listItems[i] || (listItems[i] = {}))(_templateObject13, i, item.text);
      }));
    }

    update([]);

    setTimeout(function () {
      update([{ text: 'test1' }]);
    }, 10);
    setTimeout(function () {
      update([{ text: 'test1' }, { text: 'test2' }]);
    }, 20);
    setTimeout(function () {
      update([{ text: 'test1' }]);
    }, 30);
    setTimeout(function () {
      if (counters.length) {
        tressa.assert(counters[0].added === 1, 'first item added only once');
        tressa.assert(counters[0].removed === 0, 'first item never removed');
      }
      done();
    }, 100);
  });
}).then(function () {
  tressa.log('## rendering one node');
  var div = document.createElement('div');
  var br = document.createElement('br');
  var hr = document.createElement('hr');
  hyperHTML.bind(div)(_templateObject14, br);
  tressa.assert(div.firstChild.firstChild === br, 'one child is added');
  hyperHTML.bind(div)(_templateObject14, hr);
  tressa.assert(div.firstChild.firstChild === hr, 'one child is changed');
  hyperHTML.bind(div)(_templateObject14, [hr, br]);
  tressa.assert(div.firstChild.childNodes[0] === hr && div.firstChild.childNodes[1] === br, 'more children are added');
  hyperHTML.bind(div)(_templateObject14, [br, hr]);
  tressa.assert(div.firstChild.childNodes[0] === br && div.firstChild.childNodes[1] === hr, 'children can be swapped');
  hyperHTML.bind(div)(_templateObject14, br);
  tressa.assert(div.firstChild.firstChild === br, 'one child is kept');
  hyperHTML.bind(div)(_templateObject14, []);
  tressa.assert(/<div><!--.+?--><\/div>/.test(div.innerHTML), 'dropped all children');
}).then(function () {
  tressa.log('## wire by id');
  var ref = {};
  var wires = {
    a: hyperHTML.wire(ref, ':a')(_templateObject15),
    p: hyperHTML.wire(ref, ':p')(_templateObject16)
  };
  tressa.assert(wires.a.nodeName.toLowerCase() === 'a', '<a> is correct');
  tressa.assert(wires.p.nodeName.toLowerCase() === 'p', '<p> is correct');
  tressa.assert(hyperHTML.wire(ref, ':a')(_templateObject15) === wires.a, 'same wire for <a>');
  tressa.assert(hyperHTML.wire(ref, ':p')(_templateObject16) === wires.p, 'same wire for <p>');
}).then(function () {
  return tressa.async(function (done) {
    tressa.log('## Promises instead of nodes');
    var wrap = document.createElement('div');
    var render = hyperHTML.bind(wrap);
    render(_templateObject17, new Promise(function (r) {
      setTimeout(r, 50, 'any');
    }), new Promise(function (r) {
      setTimeout(r, 10, 'virtual');
    }), [new Promise(function (r) {
      setTimeout(r, 20, 1);
    }), new Promise(function (r) {
      setTimeout(r, 10, 2);
    })], [new Promise(function (r) {
      setTimeout(r, 20, 3);
    }), new Promise(function (r) {
      setTimeout(r, 10, 4);
    })]);
    var result = wrap.innerHTML;
    setTimeout(function () {
      tressa.assert(result !== wrap.innerHTML, 'promises fullfilled');
      tressa.assert(/^<p>any<!--.+?--><\/p>virtual<!--.+?--><hr(?: ?\/)?><div>12<!--.+?--><\/div>34<!--.+?-->$/.test(wrap.innerHTML), 'both any and virtual content correct');
      done();
    }, 100);
  });
}).then(function () {
  tressa.log('## for code coverage sake');
  var wrap = document.createElement('div');
  var text = [document.createTextNode('a'), document.createTextNode('b'), document.createTextNode('c')];
  var testingMajinBuu = hyperHTML.bind(wrap);
  testingMajinBuu(_templateObject8, [text]);
  tressa.assert(wrap.textContent === 'abc');
  text[0] = document.createTextNode('c');
  text[2] = document.createTextNode('a');
  testingMajinBuu(_templateObject8, [text]);
  tressa.assert(wrap.textContent === 'cba');

  var result = hyperHTML.wire()(_templateObject18);
  tressa.assert(result.nodeType === 8, 'it is a comment');
  tressa.assert(result.textContent === 'not hyperHTML', 'correct content');
  hyperHTML.bind(wrap)(_templateObject19, 'node before');
  tressa.assert(/^<br(?: ?\/)?>node before<!--.+?-->$/i.test(wrap.innerHTML), 'node before');
  hyperHTML.bind(wrap)(_templateObject20, 'node after');
  tressa.assert(/^node after<!--.+?--><br(?: ?\/)?>$/i.test(wrap.innerHTML), 'node after');
  hyperHTML.bind(wrap)(_templateObject21, 'hyper-html{}');
  tressa.assert('<style>hyper-html{}</style>' === wrap.innerHTML.toLowerCase(), 'node style');
  hyperHTML.bind(wrap)(_templateObject8, document.createTextNode('a'));
  hyperHTML.bind(wrap)(_templateObject8, document.createDocumentFragment());
  hyperHTML.bind(wrap)(_templateObject8, document.createDocumentFragment());
  var fragment = document.createDocumentFragment();
  fragment.appendChild(document.createTextNode('b'));
  hyperHTML.bind(wrap)(_templateObject8, fragment);
  hyperHTML.bind(wrap)(_templateObject8, 123);
  tressa.assert(wrap.textContent === '123', 'text as number');
  hyperHTML.bind(wrap)(_templateObject8, true);
  tressa.assert(wrap.textContent === 'true', 'text as boolean');
  hyperHTML.bind(wrap)(_templateObject8, [1]);
  tressa.assert(wrap.textContent === '1', 'text as one entry array');
  hyperHTML.bind(wrap)(_templateObject8, ['1', '2']);
  tressa.assert(wrap.textContent === '12', 'text as multi entry array of strings');
  var arr = [document.createTextNode('a'), document.createTextNode('b')];
  hyperHTML.bind(wrap)(_templateObject8, [arr]);
  tressa.assert(wrap.textContent === 'ab', 'text as multi entry array of nodes');
  hyperHTML.bind(wrap)(_templateObject8, [arr]);
  tressa.assert(wrap.textContent === 'ab', 'same array of nodes');
  hyperHTML.bind(wrap)(_templateObject8, wrap.childNodes);
  tressa.assert(wrap.textContent === 'ab', 'childNodes as list');
  hyperHTML.bind(wrap)(_templateObject22, { length: 1, '0': 'b' });
  tressa.assert(wrap.textContent === 'a=b', 'childNodes as virtual list');
  hyperHTML.bind(wrap)(_templateObject23, 'text');
  hyperHTML.bind(wrap)(_templateObject23, 'text');
  var onclick = function onclick(e) {};
  var handler = { handleEvent: onclick };
  hyperHTML.bind(wrap)(_templateObject24, onclick, handler, 'left');
  handler = { handleEvent: onclick };
  hyperHTML.bind(wrap)(_templateObject24, onclick, handler, 'left');
  hyperHTML.bind(wrap)(_templateObject24, onclick, handler, 'left');
  hyperHTML.bind(wrap)(_templateObject25, arr[0]);
  hyperHTML.bind(wrap)(_templateObject25, arr);
  hyperHTML.bind(wrap)(_templateObject25, arr);
  hyperHTML.bind(wrap)(_templateObject25, []);
  hyperHTML.bind(wrap)(_templateObject25, ['1', '2']);
  hyperHTML.bind(wrap)(_templateObject25, document.createDocumentFragment());
  tressa.assert(true, 'passed various virtual content scenarios');
  var svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  if (!('ownerSVGElement' in svgContainer)) svgContainer.ownerSVGElement = null;
  hyperHTML.bind(svgContainer)(_templateObject26);
  result = hyperHTML.wire(null, 'svg')(_templateObject27);
  tressa.assert(result.nodeName.toLowerCase() === 'svg', 'svg content is allowed too');
  result = hyperHTML.wire()(_templateObject28);
  tressa.assert(!result.innerHTML, 'empty content');
  var tr = hyperHTML.wire()(_templateObject29);
  tressa.assert(true, 'even TR as template');

  hyperHTML.bind(wrap)(_templateObject8, ' 1 ');
  tressa.assert(wrap.textContent === ' 1 ', 'text in between');

  hyperHTML.bind(wrap)(_templateObject30, 1);
  tressa.assert(/ <br(?: ?\/)?>1<!--.+?--><br(?: ?\/)?> /.test(wrap.innerHTML), 'virtual content in between');

  var last = hyperHTML.wire();
  last(_templateObject31, 'border:0', 'same text');
  last(_templateObject31, { border: 0 }, 'same text');
  last(_templateObject31, { vh: 100 }, 'same text');
  last(_templateObject31, { vh: 10, vw: 1 }, 'same text');
  last(_templateObject31, null, 'same text');
  last(_templateObject31, '', 'same text');
  var sameStyle = { ord: 0 };
  last(_templateObject31, sameStyle, 'same text');
  last(_templateObject31, sameStyle, 'same text');
  last(_templateObject32, last);
  last(_templateObject32, last);
  var p = last(_templateObject33, last, 0);
  var UID = p.childNodes[1].data;
  last(_templateObject34, '<!--' + UID + '-->');
  hyperHTML.wire()(_templateObject35);
}).then(function () {
  tressa.log('## SVG and style');
  var render = hyperHTML.wire(null, 'svg');
  Object.prototype.ownerSVGElement = null;
  var node = render(_templateObject36, {});
  delete Object.prototype.ownerSVGElement;
  render(_templateObject36, { width: 100 });
  console.log(node.getAttribute('style'));
  tressa.assert(node.getAttribute('style') === 'width:100px;', 'correct style object');
  render(_templateObject36, 'height:10px;');
  tressa.assert(node.getAttribute('style') === 'height:10px;', 'correct style string');
  render(_templateObject36, null);
  tressa.assert(node.getAttribute('style') === '', 'correct style reset');
}).then(function () {
  tressa.log('## no WebKit backfire');
  var div = document.createElement('div');
  function update(value, attr) {
    return hyperHTML.bind(div)(_templateObject37, value, attr);
  }
  var input = update('', '').firstElementChild;
  input.value = '456';
  input.setAttribute('shaka', 'laka');
  update('123', 'laka');
  tressa.assert(input.value === '123', 'correct input');
  tressa.assert(input.value === '123', 'correct attribute');
  update('', '');
  input.value = '123';
  input.attributes.shaka.value = 'laka';
  update('123', 'laka');
  tressa.assert(input.value === '123', 'input.value was not reassigned');
}).then(function () {
  tressa.log('## wired arrays are rendered properly');
  var div = document.createElement('div');
  var employees = [{ first: 'Bob', last: 'Li' }, { first: 'Ayesha', last: 'Johnson' }];
  hyperHTML.bind(div)(_templateObject8, employees.map(function (employee) {
    return hyperHTML.wire(employee)(_templateObject38, employee.first);
  }));
  tressa.assert(div.childElementCount === 4, 'correct elements as setAny');
  hyperHTML.bind(div)(_templateObject39, employees.map(function (employee) {
    return hyperHTML.wire(employee)(_templateObject38, employee.first);
  }));
  tressa.assert(div.childElementCount === 5, 'correct elements as setVirtual');
}).then(function () {
  return tressa.async(function (done) {
    tressa.log('## textarea text');
    var div = document.createElement('div');
    hyperHTML.bind(div)(_templateObject40, 1);
    var ta = div.firstElementChild;
    tressa.assert(ta.textContent === '1', 'primitives are fine');
    hyperHTML.bind(div)(_templateObject40, null);
    tressa.assert(ta.textContent === '', 'null/undefined is fine');
    var p = Promise.resolve('OK');
    hyperHTML.bind(div)(_templateObject40, p);
    p.then(function () {
      console.log(div.innerHTML);
      tressa.assert(ta.textContent === 'OK', 'promises are fine');
      hyperHTML.bind(div)(_templateObject40, { text: 'text' });
      tressa.assert(ta.textContent === 'text', 'text is fine');
      hyperHTML.bind(div)(_templateObject40, { html: 'html' });
      tressa.assert(ta.textContent === 'html', 'html is fine');
      hyperHTML.bind(div)(_templateObject40, { any: 'any' });
      tressa.assert(ta.textContent === 'any', 'any is fine');
      hyperHTML.bind(div)(_templateObject40, ['ar', 'ray']);
      tressa.assert(ta.textContent === 'array', 'array is fine');
      hyperHTML.bind(div)(_templateObject40, { placeholder: 'placeholder' });
      tressa.assert(ta.textContent === 'placeholder', 'placeholder is fine');
      hyperHTML.bind(div)(_templateObject40, { unknown: 'unknown' });
      tressa.assert(ta.textContent === '', 'intents are fine');
      done();
    });
  });
}).then(function () {
  tressa.log('## attributes with weird chars');
  var div = document.createElement('div');
  hyperHTML.bind(div)(_templateObject41, 'bar');
  tressa.assert(div.firstChild.getAttribute('_foo') === 'bar', 'OK');
}).then(function () {
  tressa.log('## attributes without quotes');
  var div = document.createElement('div');
  hyperHTML.bind(div)(_templateObject42, 'a"b');
  tressa.assert(div.firstChild.getAttribute('test') === 'a"b', 'OK');
}).then(function () {
  tressa.log('## any content extras');
  var div = document.createElement('div');
  hyperHTML.bind(div)(_templateObject3, undefined);
  tressa.assert(/<p><!--.+?--><\/p>/.test(div.innerHTML), 'expected layout');
  hyperHTML.bind(div)(_templateObject3, { text: '<img/>' });
  tressa.assert(/<p>&lt;img(?: ?\/)?&gt;<!--.+?--><\/p>/.test(div.innerHTML), 'expected text');
}).then(function () {
  tressa.log('## virtual content extras');
  var div = document.createElement('div');
  hyperHTML.bind(div)(_templateObject43, null);
  tressa.assert(/a <[^>]+?>/.test(div.innerHTML), 'expected layout');
  hyperHTML.bind(div)(_templateObject43, { text: '<img/>' });
  tressa.assert(/a &lt;img(?: ?\/)?&gt;<[^>]+?>/.test(div.innerHTML), 'expected text');
  hyperHTML.bind(div)(_templateObject43, { any: 123 });
  tressa.assert(/a 123<[^>]+?>/.test(div.innerHTML), 'expected any');
  hyperHTML.bind(div)(_templateObject43, { html: '<b>ok</b>' });
  tressa.assert(/a <b>ok<\/b><[^>]+?>/.test(div.innerHTML), 'expected html');
  hyperHTML.bind(div)(_templateObject43, {});
  tressa.assert(/a <[^>]+?>/.test(div.innerHTML), 'expected nothing');
}).then(function () {
  tressa.log('## defined transformer');
  hyperHTML.define('eUC', encodeURIComponent);
  var div = document.createElement('div');
  hyperHTML.bind(div)(_templateObject22, { eUC: 'b c' });
  tressa.assert(/a=b%20c<[^>]+?>/.test(div.innerHTML), 'expected virtual layout');
  hyperHTML.bind(div)(_templateObject3, { eUC: 'b c' });
  tressa.assert(/<p>b%20c<!--.+?--><\/p>/.test(div.innerHTML), 'expected layout');
  // TODO: for coverage sake
  //       defined transformer ... so what?
  hyperHTML.define('eUC', encodeURIComponent);
  //       non existent one ... so what?
  hyperHTML.bind(div)(_templateObject22, { nOPE: 'b c' });
}).then(function () {
  tressa.log('## attributes with null values');
  var div = document.createElement('div');
  hyperHTML.bind(div)(_templateObject44, '1');
  tressa.assert(div.firstChild.hasAttribute('any-attr') && div.firstChild.getAttribute('any-attr') === '1', 'regular attribute');
  hyperHTML.bind(div)(_templateObject44, null);
  tressa.assert(!div.firstChild.hasAttribute('any-attr') && div.firstChild.getAttribute('any-attr') == null, 'can be removed');
  hyperHTML.bind(div)(_templateObject44, undefined);
  tressa.assert(!div.firstChild.hasAttribute('any-attr') && div.firstChild.getAttribute('any-attr') == null, 'multiple times');
  hyperHTML.bind(div)(_templateObject44, '2');
  tressa.assert(div.firstChild.hasAttribute('any-attr') && div.firstChild.getAttribute('any-attr') === '2', 'but can be also reassigned');
  hyperHTML.bind(div)(_templateObject44, '3');
  tressa.assert(div.firstChild.hasAttribute('any-attr') && div.firstChild.getAttribute('any-attr') === '3', 'many other times');
  hyperHTML.bind(div)(_templateObject45, 'test');
  tressa.assert(div.firstChild.hasAttribute('name') && div.firstChild.name === 'test', 'special attributes are set too');
  hyperHTML.bind(div)(_templateObject45, null);
  tressa.assert(!div.firstChild.hasAttribute('name') && !div.firstChild.name, 'but can also be removed');
  hyperHTML.bind(div)(_templateObject45, undefined);
  tressa.assert(!div.firstChild.hasAttribute('name') && !div.firstChild.name, 'with either null or undefined');
  hyperHTML.bind(div)(_templateObject45, 'back');
  tressa.assert(div.firstChild.hasAttribute('name') && div.firstChild.name === 'back', 'and can be put back');
}).then(function () {
  return tressa.async(function (done) {
    tressa.log('## placeholder');
    var div = document.createElement('div');
    var vdiv = document.createElement('div');
    hyperHTML.bind(div)(_templateObject3, { eUC: 'b c', placeholder: 'z' });
    hyperHTML.bind(vdiv)(_templateObject22, { eUC: 'b c', placeholder: 'z' });
    tressa.assert(/<p>z<!--.+?--><\/p>/.test(div.innerHTML), 'expected inner placeholder layout');
    tressa.assert(/a=z<[^>]+?>/.test(vdiv.innerHTML), 'expected virtual placeholder layout');
    setTimeout(function () {
      tressa.assert(/<p>b%20c<!--.+?--><\/p>/.test(div.innerHTML), 'expected inner resolved layout');
      tressa.assert(/a=b%20c<[^>]+?>/.test(vdiv.innerHTML), 'expected virtual resolved layout');
      hyperHTML.bind(div)(_templateObject3, { text: 1, placeholder: '9' });
      setTimeout(function () {
        tressa.assert(/<p>1<!--.+?--><\/p>/.test(div.innerHTML), 'placeholder with text');
        hyperHTML.bind(div)(_templateObject3, { any: [1, 2], placeholder: '9' });
        setTimeout(function () {
          tressa.assert(/<p>12<!--.+?--><\/p>/.test(div.innerHTML), 'placeholder with any');
          hyperHTML.bind(div)(_templateObject3, { html: '<b>3</b>', placeholder: '9' });
          setTimeout(function () {
            tressa.assert(/<p><b>3<\/b><!--.+?--><\/p>/.test(div.innerHTML), 'placeholder with html');
            done();
          }, 10);
        }, 10);
      }, 10);
    }, 10);
  });
}).then(function () {
  tressa.log('## hyper(...)');
  var hyper = hyperHTML.hyper;
  tressa.assert(typeof hyper() === 'function', 'empty hyper() is a wire tag');
  tressa.assert(hyper(_templateObject46).textContent === 'abc', 'hyper`abc`');
  tressa.assert(hyper(_templateObject47, 2).textContent === 'a2c', 'hyper`<p>a${2}c</p>`');
  tressa.assert(hyper(document.createElement('div'))(_templateObject46).textContent === 'abc', 'hyper(div)`abc`');
  tressa.assert(hyper(document.createElement('div'))(_templateObject48, 'b').textContent === 'abc', 'hyper(div)`a${"b"}c`');
  // WFT jsdom ?!
  delete Object.prototype.nodeType;
  tressa.assert(hyper({})(_templateObject46).textContent === 'abc', 'hyper({})`abc`');
  tressa.assert(hyper({})(_templateObject47, 'b').textContent === 'abc', 'hyper({})`<p>a${\'b\'}c</p>`');
  tressa.assert(hyper({}, ':id')(_templateObject46).textContent === 'abc', 'hyper({}, \':id\')`abc`');
  tressa.assert(hyper({}, ':id')(_templateObject47, 'b').textContent === 'abc', 'hyper({}, \':id\')`<p>a${\'b\'}c</p>`');
  tressa.assert(hyper('svg')(_templateObject49), 'hyper("svg")`<rect />`');
}).then(function () {
  tressa.log('## data=${anyContent}');
  var obj = { rand: Math.random() };
  var div = hyperHTML.wire()(_templateObject50, obj);
  tressa.assert(div.data === obj, 'data available without serialization');
  tressa.assert(div.outerHTML === '<div>abc</div>', 'attribute not there');
}).then(function () {
  tressa.log('## hyper.Component');

  var Button = function (_hyperHTML$Component) {
    _inherits(Button, _hyperHTML$Component);

    function Button() {
      _classCallCheck(this, Button);

      return _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).apply(this, arguments));
    }

    _createClass(Button, [{
      key: 'render',
      value: function render() {
        return this.html(_templateObject51);
      }
    }]);

    return Button;
  }(hyperHTML.Component);

  var Rect = function (_hyperHTML$Component2) {
    _inherits(Rect, _hyperHTML$Component2);

    function Rect(state) {
      var _this2;

      _classCallCheck(this, Rect);

      (_this2 = _possibleConstructorReturn(this, (Rect.__proto__ || Object.getPrototypeOf(Rect)).call(this)), _this2).setState(state);
      return _this2;
    }

    _createClass(Rect, [{
      key: 'render',
      value: function render() {
        return this.svg(_templateObject52, this.state.x, this.state.y);
      }
    }]);

    return Rect;
  }(hyperHTML.Component);

  var Paragraph = function (_hyperHTML$Component3) {
    _inherits(Paragraph, _hyperHTML$Component3);

    function Paragraph(state) {
      var _this3;

      _classCallCheck(this, Paragraph);

      (_this3 = _possibleConstructorReturn(this, (Paragraph.__proto__ || Object.getPrototypeOf(Paragraph)).call(this)), _this3).setState(state);
      return _this3;
    }

    _createClass(Paragraph, [{
      key: 'onclick',
      value: function onclick() {
        this.clicked = true;
      }
    }, {
      key: 'render',
      value: function render() {
        return this.html(_templateObject53, this.state.attr, this);
      }
    }]);

    return Paragraph;
  }(hyperHTML.Component);

  var div = document.createElement('div');
  var render = hyperHTML.bind(div);
  render(_templateObject8, [new Button(), new Rect({ x: 123, y: 456 })]);
  tressa.assert(div.querySelector('button'), 'the <button> exists');
  tressa.assert(div.querySelector('rect'), 'the <rect /> exists');
  var p = new Paragraph(function () {
    return { attr: 'test' };
  });
  render(_templateObject8, p);
  tressa.assert(div.querySelector('p').getAttribute('attr') === 'test', 'the <p attr=test> is defined');
  p.render().click();
  tressa.assert(p.clicked, 'the event worked');
}).then(function () {
  return tressa.async(function (done) {
    tressa.log('## Component method via data-call');

    var Paragraph = function (_hyperHTML$Component4) {
      _inherits(Paragraph, _hyperHTML$Component4);

      function Paragraph() {
        _classCallCheck(this, Paragraph);

        return _possibleConstructorReturn(this, (Paragraph.__proto__ || Object.getPrototypeOf(Paragraph)).apply(this, arguments));
      }

      _createClass(Paragraph, [{
        key: 'globally',
        value: function globally(e) {
          tressa.assert(e.type === 'click', 'data-call invoked globall');
          done();
        }
      }, {
        key: 'test',
        value: function test(e) {
          tressa.assert(e.type === 'click', 'data-call invoked locally');
        }
      }, {
        key: 'render',
        value: function render() {
          return this.html(_templateObject54, this);
        }
      }]);

      return Paragraph;
    }(hyperHTML.Component);

    var GlobalEvent = function (_hyperHTML$Component5) {
      _inherits(GlobalEvent, _hyperHTML$Component5);

      function GlobalEvent() {
        _classCallCheck(this, GlobalEvent);

        return _possibleConstructorReturn(this, (GlobalEvent.__proto__ || Object.getPrototypeOf(GlobalEvent)).apply(this, arguments));
      }

      _createClass(GlobalEvent, [{
        key: 'onclick',
        value: function onclick(e) {
          tressa.assert(e.type === 'click', 'click invoked globally');
          document.removeEventListener('click', this);
          done();
        }
      }, {
        key: 'render',
        value: function render() {
          document.addEventListener('click', this);
          return document;
        }
      }]);

      return GlobalEvent;
    }(hyperHTML.Component);

    var p = new Paragraph();
    p.render().click();
    var e = document.createEvent('Event');
    e.initEvent('click', true, true);
    new GlobalEvent().render().dispatchEvent(e);
  });
}).then(function () {
  return tressa.async(function (done) {
    tressa.log('## Custom Element attributes');
    var global = document.defaultView;
    var registry = global.customElements;
    var customElements = {
      _: Object.create(null),
      define: function define(name, Class) {
        this._[name.toLowerCase()] = Class;
      },
      get: function get(name) {
        return this._[name.toLowerCase()];
      }
    };
    Object.defineProperty(global, 'customElements', {
      configurable: true,
      value: customElements
    });
    function DumbElement() {}
    DumbElement.prototype.dumb = null;
    DumbElement.prototype.asd = null;
    customElements.define('dumb-element', DumbElement);
    function update(wire) {
      return wire(_templateObject55, true, 'qwe', true);
    }
    var div = update(hyperHTML.wire());
    if (!(div.firstElementChild instanceof DumbElement)) {
      tressa.assert(div.firstElementChild.dumb !== true, 'not upgraded elements does not have special attributes');
      tressa.assert(div.lastElementChild.dumb !== true, 'unknown elements never have special attributes');
      // simulate an upgrade
      div.firstElementChild.constructor.prototype.dumb = null;
    }
    div = update(hyperHTML.wire());
    delete div.firstElementChild.constructor.prototype.dumb;
    tressa.assert(div.firstElementChild.dumb === true, 'upgraded elements have special attributes');
    Object.defineProperty(global, 'customElements', {
      configurable: true,
      value: registry
    });
    done();
  });
}).then(function () {
  tressa.log('## hyper.Component state');

  var DefaultState = function (_hyperHTML$Component6) {
    _inherits(DefaultState, _hyperHTML$Component6);

    function DefaultState() {
      _classCallCheck(this, DefaultState);

      return _possibleConstructorReturn(this, (DefaultState.__proto__ || Object.getPrototypeOf(DefaultState)).apply(this, arguments));
    }

    _createClass(DefaultState, [{
      key: 'render',
      value: function render() {}
    }, {
      key: 'defaultState',
      get: function get() {
        return { a: 'a' };
      }
    }]);

    return DefaultState;
  }(hyperHTML.Component);

  var State = function (_hyperHTML$Component7) {
    _inherits(State, _hyperHTML$Component7);

    function State() {
      _classCallCheck(this, State);

      return _possibleConstructorReturn(this, (State.__proto__ || Object.getPrototypeOf(State)).apply(this, arguments));
    }

    return State;
  }(hyperHTML.Component);

  var ds = new DefaultState();
  var o = ds.state;
  tressa.assert(!ds.propertyIsEnumerable('state'), 'states are not enumerable');
  tressa.assert(!ds.propertyIsEnumerable('_state$'), 'neither their secret');
  tressa.assert(o.a === 'a', 'default state retrieved');
  var s = new State();
  s.state = o;
  tressa.assert(s.state === o, 'state can be set too');
  ds.setState({ b: 'b' });
  tressa.assert(o.a === 'a' && o.b === 'b', 'state was updated');
  s.state = { z: 123 };
  tressa.assert(s.state.z === 123 && !s.state.a, 'state can be re-set too');
}).then(function () {
  tressa.log('## splice and sort');
  var todo = [{ id: 0, text: 'write documentation' }, { id: 1, text: 'publish online' }, { id: 2, text: 'create Code Pen' }];
  var div = document.createElement('div');
  update();
  todo.sort(function (a, b) {
    return a.text < b.text ? -1 : 1;
  });
  update();
  tressa.assert(/^\s+create Code Pen\s*publish online\s*write documentation\s+$/.test(div.textContent), 'correct order');
  function update() {
    hyperHTML.bind(div)(_templateObject56, todo.map(function (item) {
      return hyperHTML.wire(item)(_templateObject57, item.id, item.text);
    }));
  }
}).then(function () {
  return tressa.async(function (done) {
    tressa.log('## Component connected/disconnected');

    var Paragraph = function (_hyperHTML$Component8) {
      _inherits(Paragraph, _hyperHTML$Component8);

      function Paragraph() {
        _classCallCheck(this, Paragraph);

        return _possibleConstructorReturn(this, (Paragraph.__proto__ || Object.getPrototypeOf(Paragraph)).apply(this, arguments));
      }

      _createClass(Paragraph, [{
        key: 'onconnected',
        value: function onconnected(e) {
          tressa.assert(e.type === 'connected', 'component connected');
          e.currentTarget.parentNode.removeChild(e.currentTarget);
        }
      }, {
        key: 'ondisconnected',
        value: function ondisconnected(e) {
          tressa.assert(e.type === 'disconnected', 'component disconnected');
          done();
        }
      }, {
        key: 'render',
        value: function render() {
          return this.html(_templateObject58, this, this);
        }
      }]);

      return Paragraph;
    }(hyperHTML.Component);

    var p = new Paragraph().render();
    document.body.appendChild(p);
    setTimeout(function () {
      if (p.parentNode) {
        var e = document.createEvent('Event');
        e.initEvent('DOMNodeInserted', false, false);
        Object.defineProperty(e, 'target', { value: document.body });
        document.dispatchEvent(e);
        setTimeout(function () {
          e = document.createEvent('Event');
          e.initEvent('DOMNodeInserted', false, false);
          Object.defineProperty(e, 'target', { value: document.createTextNode('') });
          document.dispatchEvent(e);
          setTimeout(function () {
            e = document.createEvent('Event');
            e.initEvent('DOMNodeRemoved', false, false);
            Object.defineProperty(e, 'target', { value: p });
            document.dispatchEvent(e);
            delete p.disconnected;
            document.dispatchEvent(e);
          }, 100);
        }, 100);
      }
    }, 100);
  });
}).then(function () {
  tressa.log('## style=${fun}');
  var render = hyperHTML.wire();
  var p = render(_templateObject59, { fontSize: 24 });
  tressa.assert(p.style.fontSize, p.style.fontSize);
  render(_templateObject59, {});
  tressa.assert(!p.style.fontSize, 'object cleaned');
  render(_templateObject59, 'font-size: 18px');
  tressa.assert(p.style.fontSize, p.style.fontSize);
})
// WARNING THESE TEST MUST BE AT THE VERY END
// WARNING THESE TEST MUST BE AT THE VERY END
// WARNING THESE TEST MUST BE AT THE VERY END
.then(function () {
  // WARNING THESE TEST MUST BE AT THE VERY END
  tressa.log('## IE9 double viewBox 🌈 🌈');
  var output = document.createElement('div');
  try {
    hyperHTML.bind(output)(_templateObject60, '0 0 50 50');
    tressa.assert(output.firstChild.getAttribute('viewBox') == '0 0 50 50', 'correct camelCase attribute');
  } catch (o_O) {
    tressa.assert(true, 'code coverage caveat');
  }
}).then(function () {
  tressa.log('## A-Frame compatibility');
  var output = hyperHTML.wire()(_templateObject61);
  tressa.assert(output.nodeName.toLowerCase() === 'a-scene', 'correct element');
})
// */
.then(function () {
  if (!tressa.exitCode) {
    document.body.style.backgroundColor = '#0FA';
  }
  tressa.end();
});