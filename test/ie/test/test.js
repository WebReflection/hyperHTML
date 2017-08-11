'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _templateObject = _taggedTemplateLiteral(['\n    <p data-counter="', '">\n      Time: ', '\n    </p>\n    '], ['\n    <p data-counter="', '">\n      Time: ', '\n    </p>\n    ']),
    _templateObject2 = _taggedTemplateLiteral(['<p>', '</p>'], ['<p>', '</p>']),
    _templateObject3 = _taggedTemplateLiteral(['<a href="#" onclick="', '">click</a>'], ['<a href="#" onclick="', '">click</a>']),
    _templateObject4 = _taggedTemplateLiteral(['<span oncustom="', '">how cool</span>'], ['<span oncustom="', '">how cool</span>']),
    _templateObject5 = _taggedTemplateLiteral(['\n        <p>1</p>\n      '], ['\n        <p>1</p>\n      ']),
    _templateObject6 = _taggedTemplateLiteral(['\n        0\n        <p>1</p>\n      '], ['\n        0\n        <p>1</p>\n      ']),
    _templateObject7 = _taggedTemplateLiteral(['', ''], ['', '']),
    _templateObject8 = _taggedTemplateLiteral(['a'], ['a']),
    _templateObject9 = _taggedTemplateLiteral(['b'], ['b']),
    _templateObject10 = _taggedTemplateLiteral(['\n      <span style="', '">O</span>'], ['\n      <span style="', '">O</span>']),
    _templateObject11 = _taggedTemplateLiteral(['\n      <section>\n        <ul>', '</ul>\n      </section>'], ['\n      <section>\n        <ul>', '</ul>\n      </section>']),
    _templateObject12 = _taggedTemplateLiteral(['\n            <li data-test="', '">', '</li>\n            '], ['\n            <li data-test="', '">', '</li>\n            ']),
    _templateObject13 = _taggedTemplateLiteral(['<div>', '</div>'], ['<div>', '</div>']),
    _templateObject14 = _taggedTemplateLiteral(['<a></a>'], ['<a></a>']),
    _templateObject15 = _taggedTemplateLiteral(['<p></p>'], ['<p></p>']),
    _templateObject16 = _taggedTemplateLiteral(['\n    <style>', '</style>\n    <p onclick="', '"> ', ' </p>\n    <div test="', '">\n      ', '\n      <ul>\n      ', '\n      </ul>\n      ', '\n      <hr>\n    </div>\n    '], ['\n    <style>', '</style>\n    <p onclick="', '"> ', ' </p>\n    <div test="', '">\n      ', '\n      <ul>\n      ', '\n      </ul>\n      ', '\n      <hr>\n    </div>\n    ']),
    _templateObject17 = _taggedTemplateLiteral(['<div>', ' </div>'], ['<div>', ' </div>']),
    _templateObject18 = _taggedTemplateLiteral(['<br>', ''], ['<br>', '']),
    _templateObject19 = _taggedTemplateLiteral(['', '<hr>'], ['', '<hr>']),
    _templateObject20 = _taggedTemplateLiteral(['<br>', '<hr>'], ['<br>', '<hr>']),
    _templateObject21 = _taggedTemplateLiteral(['<ul>', '</ul>'], ['<ul>', '</ul>']),
    _templateObject22 = _taggedTemplateLiteral(['\n      <li> ', ' </li>\n    '], ['\n      <li> ', ' </li>\n    ']),
    _templateObject23 = _taggedTemplateLiteral(['<p></p>', '<hr>'], ['<p></p>', '<hr>']),
    _templateObject24 = _taggedTemplateLiteral(['<span> ', ' </span>'], ['<span> ', ' </span>']),
    _templateObject25 = _taggedTemplateLiteral(['<svg>', '</svg>'], ['<svg>', '</svg>']),
    _templateObject26 = _taggedTemplateLiteral(['\n      <rect x="', '" y="', '" />\n    '], ['\n      <rect x="', '" y="', '" />\n    ']),
    _templateObject27 = _taggedTemplateLiteral(['<p>', '</p>', '<hr><div>', '</div>', ''], ['<p>', '</p>', '<hr><div>', '</div>', '']),
    _templateObject28 = _taggedTemplateLiteral(['<!--not hyprHTML-->'], ['<!--not hyprHTML-->']),
    _templateObject29 = _taggedTemplateLiteral(['', '<br>'], ['', '<br>']),
    _templateObject30 = _taggedTemplateLiteral(['<style> ', ' </style>'], ['<style> ', ' </style>']),
    _templateObject31 = _taggedTemplateLiteral(['a=', ''], ['a=', '']),
    _templateObject32 = _taggedTemplateLiteral(['[', ']'], ['[', ']']),
    _templateObject33 = _taggedTemplateLiteral(['<p onclick="', '" onmouseover="', '" align="', '"></p>'], ['<p onclick="', '" onmouseover="', '" align="', '"></p>']),
    _templateObject34 = _taggedTemplateLiteral(['<br>', '<br>'], ['<br>', '<br>']),
    _templateObject35 = _taggedTemplateLiteral(['<rect x="1" y="2" />'], ['<rect x="1" y="2" />']),
    _templateObject36 = _taggedTemplateLiteral(['<svg></svg>'], ['<svg></svg>']),
    _templateObject37 = _taggedTemplateLiteral([''], ['']),
    _templateObject38 = _taggedTemplateLiteral(['<tr><td>ok</td></tr>'], ['<tr><td>ok</td></tr>']),
    _templateObject39 = _taggedTemplateLiteral([' <br>', '</br> '], [' <br>', '</br> ']),
    _templateObject40 = _taggedTemplateLiteral(['\n    <input value="', '" shaka="', '">'], ['\n    <input value="', '" shaka="', '">']),
    _templateObject41 = _taggedTemplateLiteral(['\n      <div>First name: ', '</div>\n      <p></p>'], ['\n      <div>First name: ', '</div>\n      <p></p>']),
    _templateObject42 = _taggedTemplateLiteral(['\n    <p></p>', ''], ['\n    <p></p>', '']),
    _templateObject43 = _taggedTemplateLiteral(['<p test=', '></p>'], ['<p test=', '></p>']),
    _templateObject44 = _taggedTemplateLiteral(['a ', ''], ['a ', '']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var SKIP_ADOPT = (typeof location === 'undefined' ? 'undefined' : _typeof(location)) !== (typeof SKIP_ADOPT === 'undefined' ? 'undefined' : _typeof(SKIP_ADOPT)) && -1 < location.search.indexOf('noadopt');

tressa.title('HyperHTML');
tressa.assert(typeof hyperHTML === 'function', 'hyperHTML is a function');

try {
  tressa.log(1);
} catch (e) {
  tressa.log = console.log.bind(console);
}

/*
tressa.async(function (done) {
  var wrap = document.createElement('p');
  hyperHTML.bind(wrap)`${1}`;
  hyperHTML.bind(wrap)`${2}`;
  tressa.assert(wrap.textContent == 2);
  done();
})
*/
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
    tressa.log('## injecting HTML');
    var div = document.body.appendChild(document.createElement('div'));
    var render = hyperHTML.bind(div);
    var html = update('hello').innerHTML;
    function update(text) {
      return render(_templateObject2, ['<strong>' + text + '</strong>']);
    }
    function compare(html) {
      return (/^<p><strong>\w+<\/strong><\/p>$/i.test(html)
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
      return render(_templateObject3, click);
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
      return render(_templateObject2, { any: ['<em>' + text + '</em>'] });
    }
    function compare(html) {
      return (/^<p><em>\w+<\/em><\/p>$/i.test(html)
      );
    }
    tressa.assert(compare(html), 'new HTML injected');
    tressa.assert(html === div.innerHTML, 'new HTML returned');
    done(div);
  });
}).then(function () {
  tressa.log('## custom events');
  var render = hyperHTML.bind(document.createElement('p'));
  var e = document.createEvent('Event');
  e.initEvent('custom', true, true);
  render(_templateObject4, function (e) {
    tressa.assert(e.type === 'custom', 'event triggered');
  }).firstElementChild.dispatchEvent(e);
}).then(function () {
  tressa.log('## hyperHTML.escape(html)');
  tressa.assert(hyperHTML.escape('<html>') === '&lt;html&gt;', 'escape as expected');
}).then(function () {
  return tressa.async(function (done) {
    tressa.log('## hyperHTML.wire()');

    var render = hyperHTML.wire();
    var update = function update() {
      return render(_templateObject5);
    };
    var node = update();
    tressa.assert(node.nodeName === 'P', 'correct node');
    var same = update();
    tressa.assert(node === same, 'same node returned');

    render = hyperHTML.wire(null);
    update = function update() {
      return render(_templateObject6);
    };
    node = update();
    tressa.assert(Array.isArray(node), 'list of nodes');
    same = update();
    tressa.assert(node.length === same.length && node[0] && node.every(function (n, i) {
      return same[i] === n;
    }), 'same list returned');
    var div = document.createElement('div');
    render = hyperHTML.bind(div);
    render(_templateObject7, node);
    same = div.childNodes;
    tressa.assert(node.length === same.length && node[0] && node.every(function (n, i) {
      return same[i] === n;
    }), 'same list applied');

    render = hyperHTML.wire();
    if (function (s) {
      return s;
    }(_templateObject8) === function (s) {
      return s;
    }(_templateObject8)) {
      tressa.assert(render(_templateObject8) === render(_templateObject8) && render(_templateObject8) !== render(_templateObject9), 'template sensible wire');
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
      return hyperHTML.wire(point)(_templateObject10, '\n        position: absolute;\n        left: ' + point.x + 'px;\n        top: ' + point.y + 'px;\n      ');
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
      render(_templateObject11, items.map(function (item, i) {
        return hyperHTML.wire(listItems[i] || (listItems[i] = {}))(_templateObject12, i, item.text);
      }));
    }

    update([]);

    setTimeout(function () {
      update([{ text: 'test1' }]);
    });
    setTimeout(function () {
      update([{ text: 'test1' }, { text: 'test2' }]);
    });
    setTimeout(function () {
      update([{ text: 'test1' }]);
    });
    setTimeout(function () {
      if (counters.length) {
        tressa.assert(counters[0].added === 1, 'first item added only once');
        tressa.assert(counters[0].removed === 0, 'first item never removed');
      }
      done();
    });
  });
}).then(function () {
  tressa.log('## rendering one node');
  var div = document.createElement('div');
  var br = document.createElement('br');
  var hr = document.createElement('hr');
  hyperHTML.bind(div)(_templateObject13, br);
  tressa.assert(div.firstChild.firstChild === br, 'one child is added');
  hyperHTML.bind(div)(_templateObject13, hr);
  tressa.assert(div.firstChild.firstChild === hr, 'one child is changed');
  hyperHTML.bind(div)(_templateObject13, [hr, br]);
  tressa.assert(div.firstChild.childNodes[0] === hr && div.firstChild.childNodes[1] === br, 'more children are added');
  hyperHTML.bind(div)(_templateObject13, [br, hr]);
  tressa.assert(div.firstChild.childNodes[0] === br && div.firstChild.childNodes[1] === hr, 'children can be swapped');
  hyperHTML.bind(div)(_templateObject13, br);
  tressa.assert(div.firstChild.firstChild === br, 'one child is kept');
  hyperHTML.bind(div)(_templateObject13, []);
  tressa.assert(div.firstChild.childNodes.length === 0, 'dropped all children');
}).then(function () {
  tressa.log('## wire by id');
  var ref = {};
  var wires = {
    a: hyperHTML.wire(ref, ':a')(_templateObject14),
    p: hyperHTML.wire(ref, ':p')(_templateObject15)
  };
  tressa.assert(wires.a.nodeName.toLowerCase() === 'a', '<a> is correct');
  tressa.assert(wires.p.nodeName.toLowerCase() === 'p', '<p> is correct');
  tressa.assert(hyperHTML.wire(ref, ':a')(_templateObject14) === wires.a, 'same wire for <a>');
  tressa.assert(hyperHTML.wire(ref, ':p')(_templateObject15) === wires.p, 'same wire for <p>');
}).then(function () {
  if (SKIP_ADOPT) return;
  tressa.log('## hyperHTML.adopt(node)');
  var wrap = document.createElement('div');
  wrap.innerHTML = '<style>*{color:red;}</style><p></p><div test="before"> before <ul><li> lonely </li></ul>NO<hr></div>';
  var div = wrap.lastElementChild;
  var text = div.firstChild;
  var ul = div.firstElementChild;
  var hr = div.lastElementChild;
  var model = {
    click: function click() {},
    css: '* { color: blue; }',
    test: 'after',
    text: 'after',
    list: [{ name: 'first' }, { name: 'second' }],
    inBetween: 'OK'
  };

  var render = hyperHTML.adopt(wrap);
  update(render, model);
  tressa.assert(wrap.lastElementChild === div, 'structure has not changed');
  tressa.assert(div.firstElementChild === ul, 'not even the list');
  tressa.assert(div.lastElementChild === hr, 'or the hr');
  model.list.push({ name: 'third' });
  model.inBetween = document.createElement('br');
  update(render, model);
  tressa.assert(wrap.lastElementChild === div, 'not even after model changes');
  tressa.assert(div.firstElementChild === ul, 'including the list');
  tressa.assert(div.lastElementChild === hr, 'and the hr');

  function update(render, model) {
    render(_templateObject16, model.css, model.click, Math.random(), model.test, model.text, model.list.map(function (item) {
      return '<li> ' + item.name + ' </li>';
    }), model.inBetween);
  }
}).then(function () {
  tressa.log('## weird .adopt(node) cases');
  var wrap = document.createElement('div');
  wrap.innerHTML = '<div>text</div>';
  hyperHTML.adopt(wrap)(_templateObject13, ' right');
  tressa.assert(wrap.innerHTML === '<div> right</div>', 'right text OK');
  hyperHTML.adopt(wrap)(_templateObject17, 'left ');
  tressa.assert(wrap.innerHTML === '<div>left </div>', 'left text OK');
  wrap.innerHTML = '';
  hyperHTML.adopt(wrap)(_templateObject7, 'any');
  tressa.assert(wrap.innerHTML === 'any', '`${\'virtual\'}` is like `${\'any\'}`');
  wrap.innerHTML = '<br>';
  hyperHTML.adopt(wrap)(_templateObject18, 'virtual');
  if (SKIP_ADOPT) return;
  tressa.assert(/^<br>virtual<!--.+?-->$/.test(wrap.innerHTML), '`<br>${\'virtual\'}`');
  wrap.innerHTML = '<hr>';
  hyperHTML.adopt(wrap)(_templateObject19, 'virtual');
  tressa.assert(/^virtual<!--.+?--><hr>$/.test(wrap.innerHTML), '${\'virtual\'}<hr>`');
  wrap.innerHTML = '<br><i>before</i><hr>';
  hyperHTML.adopt(wrap)(_templateObject20, ['<strong>after</strong>']);
  tressa.assert(/^<br><strong>after<\/strong><!--.+?--><hr>$/.test(wrap.innerHTML), '<br>${\'<strong>after</strong>\'}<hr>');
}).then(function () {
  if (SKIP_ADOPT) return;
  tressa.log('## hyperHTML.wire(node, "adopt")');
  var wrap = document.createElement('div');
  wrap.innerHTML = '<ul><li>before</li></ul>';
  var items = [{ text: 'first' }];
  var li = wrap.querySelector('li');
  var result = hyperHTML.adopt(wrap)(_templateObject21, items.map(function (item) {
    return hyperHTML.wire(item, 'adopt')(_templateObject22, item.text);
  }));
  var list = wrap.querySelectorAll('li');
  tressa.assert(list.length === 1 && list[0] === li && result.innerHTML === '<ul><li>first</li></ul>', 'one element can be adopted');
  result = hyperHTML.adopt(wrap)(_templateObject21, items.map(function (item) {
    return hyperHTML.wire(item, 'adopt')(_templateObject22, item.text);
  }));
  list = wrap.querySelectorAll('li');
  tressa.assert(list.length === 1 && list[0] === li && result.innerHTML === '<ul><li>first</li></ul>', 'even after multiple passes');
  wrap = document.createElement('div');
  wrap.innerHTML = '<ul></ul>';
  result = hyperHTML.adopt(wrap)(_templateObject21, [{ text: 'new' }, { text: 'nodes' }].map(function (item) {
    return hyperHTML.wire(item, 'adopt')(_templateObject22, item.text);
  }));
  list = wrap.querySelectorAll('li');
  tressa.assert(list.length === 2 && result.innerHTML === '<ul><li>new</li><li>nodes</li></ul>', 'if not there, elements get created');

  wrap = document.createElement('div');
  wrap.innerHTML = '<p></p><hr>';
  result = hyperHTML.adopt(wrap)(_templateObject23, hyperHTML.wire(items[0], 'adopt')(_templateObject24, items[0].text));
  var lastResult = result.innerHTML;
  result = hyperHTML.adopt(wrap)(_templateObject23, items.map(function (item) {
    return hyperHTML.wire(item, 'adopt')(_templateObject24, item.text);
  }));
  tressa.assert(lastResult === result.innerHTML, 'virtual content can be adopted too');

  wrap = document.createElement('div');
  wrap.innerHTML = '<svg></svg>';
  if (!('ownerSVGElement' in wrap.firstChild)) wrap.firstChild.ownerSVGElement = null;
  result = hyperHTML.adopt(wrap)(_templateObject25, [{ x: 1, y: 2 }].map(function (item) {
    return hyperHTML.wire(item, 'adopt')(_templateObject26, item.x, item.y);
  }));
  tressa.assert(/<svg(?: xmlns=[^>]+?)?>\s*<rect [xy]="[12]" [xy]="[12]">\s*<\/rect>\s*<\/svg>/.test(result.innerHTML) && result.querySelector('rect').getAttribute('x') == 1 && result.querySelector('rect').getAttribute('y') == 2, 'svg content can be adopted too');
}).then(function () {
  return tressa.async(function (done) {
    tressa.log('## Promises instead of nodes');
    var wrap = document.createElement('div');
    var render = hyperHTML.bind(wrap);
    render(_templateObject27, new Promise(function (r) {
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
      tressa.assert(/^<p>any<\/p>virtual<!--.+?--><hr><div>12<\/div>34<!--.+?-->$/.test(wrap.innerHTML), 'both any and virtual content correct');
      done();
    }, 100);
  });
}).then(function () {
  tressa.log('## for code coverage sake');
  var wrap = document.createElement('div');
  var result = hyperHTML.wire()(_templateObject28);
  tressa.assert(result.nodeType === 8, 'it is a comment');
  tressa.assert(result.textContent === 'not hyprHTML', 'correct content');
  hyperHTML.bind(wrap)(_templateObject18, 'node before');
  tressa.assert(/^<br>node before<!--.+?-->$/i.test(wrap.innerHTML), 'node before');
  hyperHTML.bind(wrap)(_templateObject29, 'node after');
  tressa.assert(/^node after<!--.+?--><br>$/i.test(wrap.innerHTML), 'node after');
  hyperHTML.bind(wrap)(_templateObject30, 'hyper-html{}');
  tressa.assert('<style>hyper-html{}</style>' === wrap.innerHTML.toLowerCase(), 'node style');
  hyperHTML.bind(wrap)(_templateObject7, document.createTextNode('a'));
  hyperHTML.bind(wrap)(_templateObject7, document.createDocumentFragment());
  hyperHTML.bind(wrap)(_templateObject7, document.createDocumentFragment());
  var fragment = document.createDocumentFragment();
  fragment.appendChild(document.createTextNode('b'));
  hyperHTML.bind(wrap)(_templateObject7, fragment);
  hyperHTML.bind(wrap)(_templateObject7, 123);
  tressa.assert(wrap.textContent === '123', 'text as number');
  hyperHTML.bind(wrap)(_templateObject7, true);
  tressa.assert(wrap.textContent === 'true', 'text as boolean');
  hyperHTML.bind(wrap)(_templateObject7, [1]);
  tressa.assert(wrap.textContent === '1', 'text as one entry array');
  hyperHTML.bind(wrap)(_templateObject7, ['1', '2']);
  tressa.assert(wrap.textContent === '12', 'text as multi entry array of strings');
  var arr = [document.createTextNode('a'), document.createTextNode('b')];
  hyperHTML.bind(wrap)(_templateObject7, [arr]);
  tressa.assert(wrap.textContent === 'ab', 'text as multi entry array of nodes');
  hyperHTML.bind(wrap)(_templateObject7, [arr]);
  tressa.assert(wrap.textContent === 'ab', 'same array of nodes');
  hyperHTML.bind(wrap)(_templateObject7, wrap.childNodes);
  tressa.assert(wrap.textContent === 'ab', 'childNodes as list');
  hyperHTML.bind(wrap)(_templateObject31, { length: 1, '0': 'b' });
  tressa.assert(wrap.textContent === 'a=b', 'childNodes as virtual list');
  hyperHTML.bind(wrap)(_templateObject32, 'text');
  hyperHTML.bind(wrap)(_templateObject32, 'text');
  var onclick = function onclick(e) {};
  var handler = { handleEvent: onclick };
  hyperHTML.bind(wrap)(_templateObject33, onclick, handler, 'left');
  handler = { handleEvent: onclick };
  hyperHTML.bind(wrap)(_templateObject33, onclick, handler, 'left');
  hyperHTML.bind(wrap)(_templateObject33, onclick, handler, 'left');
  hyperHTML.bind(wrap)(_templateObject34, arr[0]);
  hyperHTML.bind(wrap)(_templateObject34, arr);
  hyperHTML.bind(wrap)(_templateObject34, arr);
  hyperHTML.bind(wrap)(_templateObject34, []);
  hyperHTML.bind(wrap)(_templateObject34, ['1', '2']);
  hyperHTML.bind(wrap)(_templateObject34, document.createDocumentFragment());
  tressa.assert(true, 'passed various virtual content scenarios');
  var svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  if (!('ownerSVGElement' in svgContainer)) svgContainer.ownerSVGElement = null;
  hyperHTML.bind(svgContainer)(_templateObject35);
  result = hyperHTML.wire(null, 'svg')(_templateObject36);
  tressa.assert(result.nodeName.toLowerCase() === 'svg', 'svg content is allowed too');
  result = hyperHTML.wire()(_templateObject37);
  tressa.assert(!result.innerHTML, 'empty content');
  var tr = hyperHTML.wire()(_templateObject38);
  tressa.assert(true, 'even TR as template');

  hyperHTML.bind(wrap)(_templateObject7, ' 1 ');
  tressa.assert(wrap.textContent === ' 1 ', 'text in between');

  hyperHTML.bind(wrap)(_templateObject39, 1);
  tressa.assert(/ <br>1<!--.+?--><br> /.test(wrap.innerHTML), 'virtual content in between');
}).then(function () {
  tressa.log('## no WebKit backfire');
  var div = document.createElement('div');
  function update(value, attr) {
    return hyperHTML.bind(div)(_templateObject40, value, attr);
  }
  var input = update('', '').firstElementChild;
  input.value = '456';
  input.attributes.shaka.value = 'laka';
  update('123', 'laka');
  tressa.assert(input.value === '123', 'correct input');
  tressa.assert(input.value === '123', 'correct attribute');
}).then(function () {
  tressa.log('## wired arrays are rendered properly');
  var div = document.createElement('div');
  var employees = [{ first: 'Bob', last: 'Li' }, { first: 'Ayesha', last: 'Johnson' }];
  hyperHTML.bind(div)(_templateObject7, employees.map(function (employee) {
    return hyperHTML.wire(employee)(_templateObject41, employee.first);
  }));
  tressa.assert(div.childElementCount === 4, 'correct elements as setAny');
  hyperHTML.bind(div)(_templateObject42, employees.map(function (employee) {
    return hyperHTML.wire(employee)(_templateObject41, employee.first);
  }));
  tressa.assert(div.childElementCount === 5, 'correct elements as setVirtual');
}).then(function () {
  tressa.log('## attributes without quotes');
  var div = document.createElement('div');
  hyperHTML.bind(div)(_templateObject43, 'a"b');
  tressa.assert(div.firstChild.getAttribute('test') === 'a"b', 'OK');
}).then(function () {
  tressa.log('## any content extras');
  var div = document.createElement('div');
  hyperHTML.bind(div)(_templateObject2, undefined);
  tressa.assert(div.innerHTML === '<p></p>', 'expected layout');
  hyperHTML.bind(div)(_templateObject2, { text: '<img>' });
  tressa.assert(div.innerHTML === '<p>&lt;img&gt;</p>', 'expected text');
  hyperHTML.bind(div)(_templateObject2, function () {
    return '<b>';
  });
  tressa.assert(div.innerHTML === '<p>&lt;b&gt;</p>', 'expected callback');
}).then(function () {
  tressa.log('## virtual content extras');
  var div = document.createElement('div');
  hyperHTML.bind(div)(_templateObject44, null);
  tressa.assert(/a <[^>]+?>/.test(div.innerHTML), 'expected layout');
  hyperHTML.bind(div)(_templateObject44, { text: '<img>' });
  tressa.assert(/a &lt;img&gt;<[^>]+?>/.test(div.innerHTML), 'expected text');
  hyperHTML.bind(div)(_templateObject44, { any: 123 });
  tressa.assert(/a 123<[^>]+?>/.test(div.innerHTML), 'expected any');
  hyperHTML.bind(div)(_templateObject44, { html: '<b>ok</b>' });
  tressa.assert(/a <b>ok<\/b><[^>]+?>/.test(div.innerHTML), 'expected html');
  hyperHTML.bind(div)(_templateObject44, {});
  tressa.assert(/a <[^>]+?>/.test(div.innerHTML), 'expected nothing');
}).then(function () {
  tressa.log('## defined transformer');
  hyperHTML.define('eUC', encodeURIComponent);
  var div = document.createElement('div');
  hyperHTML.bind(div)(_templateObject31, { eUC: 'b c' });
  tressa.assert(/a=b%20c<[^>]+?>/.test(div.innerHTML), 'expected virtual layout');
  hyperHTML.bind(div)(_templateObject2, { eUC: 'b c' });
  tressa.assert(/<p>b%20c<\/p>/.test(div.innerHTML), 'expected layout');
}).then(function () {
  return tressa.async(function (done) {
    tressa.log('## placeholder');
    var div = document.createElement('div');
    var vdiv = document.createElement('div');
    hyperHTML.bind(div)(_templateObject2, { eUC: 'b c', placeholder: 'z' });
    hyperHTML.bind(vdiv)(_templateObject31, { eUC: 'b c', placeholder: 'z' });
    tressa.assert(/<p>z<\/p>/.test(div.innerHTML), 'expected inner placeholder layout');
    tressa.assert(/a=z<[^>]+?>/.test(vdiv.innerHTML), 'expected virtual placeholder layout');
    setTimeout(function () {
      tressa.assert(/<p>b%20c<\/p>/.test(div.innerHTML), 'expected inner resolved layout');
      tressa.assert(/a=b%20c<[^>]+?>/.test(vdiv.innerHTML), 'expected virtual resolved layout');
      hyperHTML.bind(div)(_templateObject2, { text: 1, placeholder: '9' });
      setTimeout(function () {
        tressa.assert(/<p>1<\/p>/.test(div.innerHTML), 'placeholder with text');
        hyperHTML.bind(div)(_templateObject2, { any: [1, 2], placeholder: '9' });
        setTimeout(function () {
          tressa.assert(/<p>12<\/p>/.test(div.innerHTML), 'placeholder with any');
          hyperHTML.bind(div)(_templateObject2, { html: '<b>3</b>', placeholder: '9' });
          setTimeout(function () {
            tressa.assert(/<p><b>3<\/b><\/p>/.test(div.innerHTML), 'placeholder with html');
            done();
          }, 10);
        }, 10);
      }, 10);
    }, 10);
  });
})
// */
.then(function () {
  if (!tressa.exitCode) {
    document.body.style.backgroundColor = '#0FA';
  }
  tressa.end();
});