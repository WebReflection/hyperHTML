var SKIP_ADOPT = typeof location !== typeof SKIP_ADOPT && -1 < location.search.indexOf('noadopt');

tressa.title('HyperHTML');
tressa.assert(typeof hyperHTML === 'function', 'hyperHTML is a function');

try { tressa.log(1); } catch(e) { tressa.log = console.log.bind(console); }

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
    return render`
    <p data-counter="${i}">
      Time: ${
        // IE Edge mobile did something funny here
        // as template string returned xxx.xxxx
        // but as innerHTML returned xxx.xx
        (Math.random() * new Date).toFixed(2)
      }
    </p>
    `;
  }
  function compare(html) {
    return /^\s*<p data-counter="\d">\s*Time: \d+\.\d+<[^>]+?>\s*<\/p>\s*$/i.test(html);
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
})
.then(function () {
  return tressa.async(function (done) {
    tressa.log('## perf: same virtual text twice');
    var div = document.body.appendChild(document.createElement('div'));
    var render = hyperHTML.bind(div);
    var html = (update('hello').innerHTML, update('hello').innerHTML);
    function update(text) {
      return render`<p>${text} world</p>`;
    }
    tressa.assert(
      update('hello').innerHTML ===
      update('hello').innerHTML,
      'same text'
    );
    done(div);
  });
})
.then(function () {
  return tressa.async(function (done) {
    tressa.log('## injecting HTML');
    var div = document.body.appendChild(document.createElement('div'));
    var render = hyperHTML.bind(div);
    var html = update('hello').innerHTML;
    function update(text) {
      return render`<p>${['<strong>' + text + '</strong>']}</p>`;
    }
    function compare(html) {
      return /^<p><strong>\w+<\/strong><\/p>$/i.test(html);
    }
    tressa.assert(compare(html), 'HTML injected');
    tressa.assert(html === div.innerHTML, 'HTML returned');
    done(div);
  });
})
.then(function (div) {
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
      return render`<a href="#" onClick="${click}">click</a>`;
    }
    var a = div.querySelector('a');
    var e = document.createEvent('Event');
    e.initEvent('click', false, false);
    a.dispatchEvent(e);
  });
})
.then(function (div) {
  return tressa.async(function (done) {
    tressa.log('## changing template');
    var render = hyperHTML.bind(div);
    var html = update('hello').innerHTML;
    function update(text) {
      return render`<p>${{any: ['<em>' + text + '</em>']}}</p>`;
    }
    function compare(html) {
      return /^<p><em>\w+<\/em><\/p>$/i.test(html);
    }
    tressa.assert(compare(html), 'new HTML injected');
    tressa.assert(html === div.innerHTML, 'new HTML returned');
    done(div);
  });
})
.then(function () {
  return tressa.async(function (done) {
    tressa.log('## custom events');
    var render = hyperHTML.bind(document.createElement('p'));
    var e = document.createEvent('Event');
    e.initEvent('Custom-EVENT', true, true);
    (render`<span onCustom-EVENT="${function (e) {
      tressa.assert(e.type === 'Custom-EVENT', 'event triggered');
      done();
    }}">how cool</span>`
    ).firstElementChild.dispatchEvent(e);
  });
})
.then(function () {
  tressa.log('## hyperHTML.escape(html)');
  tressa.assert(hyperHTML.escape('<html>') === '&lt;html&gt;', 'escape as expected');
})
.then(function () {
  return tressa.async(function (done) {
    tressa.log('## hyperHTML.wire()');

    var render = hyperHTML.wire();
    var update = function () {
      return render`
        <p>1</p>
      `;
    };
    var node = update();
    tressa.assert(node.nodeName === 'P', 'correct node');
    var same = update();
    tressa.assert(node === same, 'same node returned');

    render = hyperHTML.wire(null);
    update = function () {
      return render`
        0
        <p>1</p>
      `;
    };
    node = update();
    tressa.assert(Array.isArray(node), 'list of nodes');
    same = update();
    tressa.assert(
      node.length === same.length &&
      node[0] &&
      node.every(function (n, i) { return same[i] === n; }),
      'same list returned'
    );
    var div = document.createElement('div');
    render = hyperHTML.bind(div);
    render`${node}`;
    same = div.childNodes;
    tressa.assert(
      node.length === same.length &&
      node[0] &&
      node.every(function (n, i) { return same[i] === n; }),
      'same list applied'
    );

    render = hyperHTML.wire();
    if (
      (function(s){ return s; })`a` ===
      (function(s){ return s; })`a`
    ) {
      tressa.assert(
        render`a` === render`a` &&
        render`a` !== render`b`,
        'template sensible wire'
      );
    } else {
      tressa.log('⚠️ this *browser* is *not spec compliant*');
    }

    done();
  });
})
.then(function () {
  return tressa.async(function (done) {
    tressa.log('## hyperHTML.wire(object)');
    var point = {x: 1, y: 2};
    function update() {
      return hyperHTML.wire(point)`
      <span style="${`
        position: absolute;
        left: ${point.x}px;
        top: ${point.y}px;
      `}">O</span>`;
    }
    tressa.assert(update() === update(), 'same output');
    tressa.assert(hyperHTML.wire(point) === hyperHTML.wire(point), 'same wire');
    done();
  });
})
.then(function () {
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
      subtree: true,
    });

    var counters = [];

    function trackMutations (nodes, countKey) {
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
      render`
      <section>
        <ul>${
          items.map(function (item, i) {
            return hyperHTML.wire((listItems[i] || (listItems[i] = {})))`
            <li data-test="${i}">${item.text}</li>
            `;
          })
        }</ul>
      </section>`;
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
})
.then(function () {
  tressa.log('## rendering one node');
  var div = document.createElement('div');
  var br = document.createElement('br');
  var hr = document.createElement('hr');
  hyperHTML.bind(div)`<div>${br}</div>`;
  tressa.assert(div.firstChild.firstChild === br, 'one child is added');
  hyperHTML.bind(div)`<div>${hr}</div>`;
  tressa.assert(div.firstChild.firstChild === hr, 'one child is changed');
  hyperHTML.bind(div)`<div>${[hr, br]}</div>`;
  tressa.assert(
    div.firstChild.childNodes[0] === hr &&
    div.firstChild.childNodes[1] === br,
    'more children are added'
  );
  hyperHTML.bind(div)`<div>${[br, hr]}</div>`;
  tressa.assert(
    div.firstChild.childNodes[0] === br &&
    div.firstChild.childNodes[1] === hr,
    'children can be swapped'
  );
  hyperHTML.bind(div)`<div>${br}</div>`;
  tressa.assert(div.firstChild.firstChild === br, 'one child is kept');
  hyperHTML.bind(div)`<div>${[]}</div>`;
  tressa.assert(div.firstChild.childNodes.length === 0, 'dropped all children');
})
.then(function () {
  tressa.log('## wire by id');
  let ref = {};
  let wires = {
    a: hyperHTML.wire(ref, ':a')`<a></a>`,
    p: hyperHTML.wire(ref, ':p')`<p></p>`
  };
  tressa.assert(wires.a.nodeName.toLowerCase() === 'a', '<a> is correct');
  tressa.assert(wires.p.nodeName.toLowerCase() === 'p', '<p> is correct');
  tressa.assert(hyperHTML.wire(ref, ':a')`<a></a>` === wires.a, 'same wire for <a>');
  tressa.assert(hyperHTML.wire(ref, ':p')`<p></p>` === wires.p, 'same wire for <p>');
})
.then(function () {
  if (SKIP_ADOPT) return;
  tressa.log('## hyperHTML.adopt(node)');
  let wrap = document.createElement('div');
  wrap.innerHTML = '<style>*{color:red;}</style><p></p><div test="before"> before <ul><li> lonely </li></ul>NO<hr></div>';
  let div = wrap.lastElementChild;
  let text = div.firstChild;
  let ul = div.firstElementChild;
  let hr = div.lastElementChild;
  let model = {
    click: function () {},
    css: '* { color: blue; }',
    test: 'after',
    text: 'after',
    list: [
      {name: 'first'},
      {name: 'second'}
    ],
    inBetween: 'OK'
  };

  let render = hyperHTML.adopt(wrap);
  update(render, model);
  tressa.assert(wrap.lastElementChild === div, 'structure has not changed');
  tressa.assert(div.firstElementChild === ul, 'not even the list');
  tressa.assert(div.lastElementChild === hr, 'or the hr');
  model.list.push({name: 'third'});
  model.inBetween = document.createElement('br');
  update(render, model);
  tressa.assert(wrap.lastElementChild === div, 'not even after model changes');
  tressa.assert(div.firstElementChild === ul, 'including the list');
  tressa.assert(div.lastElementChild === hr, 'and the hr');

  function update(render, model) {
    render`
    <style>${model.css}</style>
    <p onclick="${model.click}"> ${Math.random()} </p>
    <div test="${model.test}">
      ${model.text}
      <ul>
      ${model.list.map(item => `<li> ${item.name} </li>`)}
      </ul>
      ${model.inBetween}
      <hr>
    </div>
    `;
  }
})
.then(function () {
  tressa.log('## weird .adopt(node) cases');
  let wrap = document.createElement('div');
  wrap.innerHTML = '<div>text</div>';
  hyperHTML.adopt(wrap)`<div>${' right'}</div>`;
  tressa.assert(wrap.innerHTML === '<div> right</div>', 'right text OK');
  hyperHTML.adopt(wrap)`<div>${'left '} </div>`;
  tressa.assert(wrap.innerHTML === '<div>left </div>', 'left text OK');
  wrap.innerHTML = '';
  hyperHTML.adopt(wrap)`${'any'}`;
  tressa.assert(wrap.innerHTML === 'any', '`${\'virtual\'}` is like `${\'any\'}`');
  wrap.innerHTML = '<br>';
  hyperHTML.adopt(wrap)`<br>${'virtual'}`;
  if (SKIP_ADOPT) return;
  tressa.assert(/^<br>virtual<!--.+?-->$/.test(wrap.innerHTML), '`<br>${\'virtual\'}`');
  wrap.innerHTML = '<hr>';
  hyperHTML.adopt(wrap)`${'virtual'}<hr>`;
  tressa.assert(/^virtual<!--.+?--><hr>$/.test(wrap.innerHTML), '${\'virtual\'}<hr>`');
  wrap.innerHTML = '<br><i>before</i><hr>';
  hyperHTML.adopt(wrap)`<br>${['<strong>after</strong>']}<hr>`;
  tressa.assert(/^<br><strong>after<\/strong><!--.+?--><hr>$/.test(wrap.innerHTML), '<br>${\'<strong>after</strong>\'}<hr>');
})
.then(function () {
  if (SKIP_ADOPT) return;
  tressa.log('## hyperHTML.wire(node, "adopt")');
  let wrap = document.createElement('div');
  wrap.innerHTML = '<ul><li>before</li></ul>';
  let items = [{text: 'first'}];
  let li = wrap.querySelector('li');
  let result = hyperHTML.adopt(wrap)`<ul>${
    items.map(item => hyperHTML.wire(item, 'adopt')`
      <li> ${item.text} </li>
    `)
  }</ul>`;
  let list = wrap.querySelectorAll('li');
  tressa.assert(
    list.length === 1 &&
    list[0] === li &&
    result.innerHTML === '<ul><li>first</li></ul>',
    'one element can be adopted'
  );
  result = hyperHTML.adopt(wrap)`<ul>${
    items.map(item => hyperHTML.wire(item, 'adopt')`
      <li> ${item.text} </li>
    `)
  }</ul>`;
  list = wrap.querySelectorAll('li');
  tressa.assert(
    list.length === 1 &&
    list[0] === li &&
    result.innerHTML === '<ul><li>first</li></ul>',
    'even after multiple passes'
  );
  wrap = document.createElement('div');
  wrap.innerHTML = '<ul></ul>';
  result = hyperHTML.adopt(wrap)`<ul>${
    [{text: 'new'}, {text: 'nodes'}].map(item => hyperHTML.wire(item, 'adopt')`
      <li> ${item.text} </li>
    `)
  }</ul>`;
  list = wrap.querySelectorAll('li');
  tressa.assert(
    list.length === 2 &&
    result.innerHTML === '<ul><li>new</li><li>nodes</li></ul>',
    'if not there, elements get created'
  );

  wrap = document.createElement('div');
  wrap.innerHTML = '<p></p><hr>';
  result = hyperHTML.adopt(wrap)`<p></p>${
    hyperHTML.wire(items[0], 'adopt')`<span> ${items[0].text} </span>`
  }<hr>`;
  let lastResult = result.innerHTML;
  result = hyperHTML.adopt(wrap)`<p></p>${
    items.map(item => hyperHTML.wire(item, 'adopt')`<span> ${item.text} </span>`)
  }<hr>`;
  tressa.assert(
    lastResult === result.innerHTML,
    'virtual content can be adopted too'
  );


  wrap = document.createElement('div');
  wrap.innerHTML = '<svg></svg>';
  if (!('ownerSVGElement' in wrap.firstChild)) wrap.firstChild.ownerSVGElement = null;
  result = hyperHTML.adopt(wrap)`<svg>${
    [{x: 1, y: 2}].map(item => hyperHTML.wire(item, 'adopt')`
      <rect x="${item.x}" y="${item.y}" />
    `)
  }</svg>`;
  tressa.assert(
    /<svg(?: xmlns=[^>]+?)?>\s*<rect [xy]="[12]" [xy]="[12]">\s*<\/rect>\s*<\/svg>/.test(result.innerHTML) &&
    result.querySelector('rect').getAttribute('x') == 1 &&
    result.querySelector('rect').getAttribute('y') == 2,
    'svg content can be adopted too'
  );

})
.then(function () {
  return tressa.async(function (done) {
    tressa.log('## Promises instead of nodes');
    let wrap = document.createElement('div');
    let render = hyperHTML.bind(wrap);
    render`<p>${
      new Promise(function (r) { setTimeout(r, 50, 'any'); })
    }</p>${
      new Promise(function (r) { setTimeout(r, 10, 'virtual'); })
    }<hr><div>${[
      new Promise(function (r) { setTimeout(r, 20, 1); }),
      new Promise(function (r) { setTimeout(r, 10, 2); }),
    ]}</div>${[
      new Promise(function (r) { setTimeout(r, 20, 3); }),
      new Promise(function (r) { setTimeout(r, 10, 4); }),
    ]}`;
    let result = wrap.innerHTML;
    setTimeout(function () {
      tressa.assert(result !== wrap.innerHTML, 'promises fullfilled');
      tressa.assert(
        /^<p>any<\/p>virtual<!--.+?--><hr><div>12<\/div>34<!--.+?-->$/.test(wrap.innerHTML),
        'both any and virtual content correct'
      );
      done();
    }, 100);
  });
})
.then(function () {
  tressa.log('## for code coverage sake');
  let wrap = document.createElement('div');
  let result = hyperHTML.wire()`<!--not hyprHTML-->`;
  tressa.assert(result.nodeType === 8, 'it is a comment');
  tressa.assert(result.textContent === 'not hyprHTML', 'correct content');
  hyperHTML.bind(wrap)`<br>${'node before'}`;
  tressa.assert(/^<br>node before<!--.+?-->$/i.test(wrap.innerHTML), 'node before');
  hyperHTML.bind(wrap)`${'node after'}<br>`;
  tressa.assert(/^node after<!--.+?--><br>$/i.test(wrap.innerHTML), 'node after');
  hyperHTML.bind(wrap)`<style> ${'hyper-html{}'} </style>`;
  tressa.assert('<style>hyper-html{}</style>' === wrap.innerHTML.toLowerCase(), 'node style');
  hyperHTML.bind(wrap)`${document.createTextNode('a')}`;
  hyperHTML.bind(wrap)`${document.createDocumentFragment()}`;
  hyperHTML.bind(wrap)`${document.createDocumentFragment()}`;
  let fragment = document.createDocumentFragment();
  fragment.appendChild(document.createTextNode('b'));
  hyperHTML.bind(wrap)`${fragment}`;
  hyperHTML.bind(wrap)`${123}`;
  tressa.assert(wrap.textContent === '123', 'text as number');
  hyperHTML.bind(wrap)`${true}`;
  tressa.assert(wrap.textContent === 'true', 'text as boolean');
  hyperHTML.bind(wrap)`${[1]}`;
  tressa.assert(wrap.textContent === '1', 'text as one entry array');
  hyperHTML.bind(wrap)`${['1', '2']}`;
  tressa.assert(wrap.textContent === '12', 'text as multi entry array of strings');
  let arr = [document.createTextNode('a'), document.createTextNode('b')];
  hyperHTML.bind(wrap)`${[arr]}`;
  tressa.assert(wrap.textContent === 'ab', 'text as multi entry array of nodes');
  hyperHTML.bind(wrap)`${[arr]}`;
  tressa.assert(wrap.textContent === 'ab', 'same array of nodes');
  hyperHTML.bind(wrap)`${wrap.childNodes}`;
  tressa.assert(wrap.textContent === 'ab', 'childNodes as list');
  hyperHTML.bind(wrap)`a=${{length:1, '0':'b'}}`;
  tressa.assert(wrap.textContent === 'a=b', 'childNodes as virtual list');
  hyperHTML.bind(wrap)`[${'text'}]`;
  hyperHTML.bind(wrap)`[${'text'}]`;
  let onclick = (e) => {};
  let handler = {handleEvent: onclick};
  hyperHTML.bind(wrap)`<p onclick="${onclick}" onmouseover="${handler}" align="${'left'}"></p>`;
  handler = {handleEvent: onclick};
  hyperHTML.bind(wrap)`<p onclick="${onclick}" onmouseover="${handler}" align="${'left'}"></p>`;
  hyperHTML.bind(wrap)`<p onclick="${onclick}" onmouseover="${handler}" align="${'left'}"></p>`;
  hyperHTML.bind(wrap)`<br>${arr[0]}<br>`;
  hyperHTML.bind(wrap)`<br>${arr}<br>`;
  hyperHTML.bind(wrap)`<br>${arr}<br>`;
  hyperHTML.bind(wrap)`<br>${[]}<br>`;
  hyperHTML.bind(wrap)`<br>${['1', '2']}<br>`;
  hyperHTML.bind(wrap)`<br>${document.createDocumentFragment()}<br>`;
  tressa.assert(true, 'passed various virtual content scenarios');
  let svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  if (!('ownerSVGElement' in svgContainer)) svgContainer.ownerSVGElement = null;
  hyperHTML.bind(svgContainer)`<rect x="1" y="2" />`;
  result = hyperHTML.wire(null, 'svg')`<svg></svg>`;
  tressa.assert(result.nodeName.toLowerCase() === 'svg', 'svg content is allowed too');
  result = hyperHTML.wire()``;
  tressa.assert(!result.innerHTML, 'empty content');
  let tr = hyperHTML.wire()`<tr><td>ok</td></tr>`;
  tressa.assert(true, 'even TR as template');

  hyperHTML.bind(wrap)`${' 1 '}`;
  tressa.assert(wrap.textContent === ' 1 ', 'text in between');

  hyperHTML.bind(wrap)` <br>${1}</br> `;
  tressa.assert(/ <br>1<!--.+?--><br> /.test(wrap.innerHTML), 'virtual content in between');

})
.then(function () {
  tressa.log('## no WebKit backfire');
  var div = document.createElement('div');
  function update(value, attr) {
    return hyperHTML.bind(div)`
    <input value="${value}" shaka="${attr}">`;
  }
  var input = update('', '').firstElementChild;
  input.value = '456';
  input.attributes.shaka.value = 'laka';
  update('123', 'laka');
  tressa.assert(input.value === '123', 'correct input');
  tressa.assert(input.value === '123', 'correct attribute');
})
.then(function () {
  tressa.log('## wired arrays are rendered properly');
  var div = document.createElement('div');
  var employees = [
    {first: 'Bob', last: 'Li'},
    {first: 'Ayesha', last: 'Johnson'}
  ];
  hyperHTML.bind(div)`${
    employees.map(
      employee => hyperHTML.wire(employee)`
      <div>First name: ${employee.first}</div>
      <p></p>`
    )
  }`;
  tressa.assert(div.childElementCount === 4, 'correct elements as setAny');
  hyperHTML.bind(div)`
    <p></p>${
    employees.map(
      employee => hyperHTML.wire(employee)`
      <div>First name: ${employee.first}</div>
      <p></p>`
    )
  }`;
  tressa.assert(div.childElementCount === 5, 'correct elements as setVirtual');
})
.then(function () {
  tressa.log('## attributes without quotes');
  var div = document.createElement('div');
  hyperHTML.bind(div)`<p test=${'a"b'}></p>`;
  tressa.assert(div.firstChild.getAttribute('test') === 'a"b', 'OK');
})
.then(function () {
  tressa.log('## any content extras');
  var div = document.createElement('div');
  hyperHTML.bind(div)`<p>${undefined}</p>`;
  tressa.assert(div.innerHTML === '<p></p>', 'expected layout');
  hyperHTML.bind(div)`<p>${{text: '<img>'}}</p>`;
  tressa.assert(div.innerHTML === '<p>&lt;img&gt;</p>', 'expected text');
  hyperHTML.bind(div)`<p>${function () { return '<b>'; }}</p>`;
  tressa.assert(div.innerHTML === '<p>&lt;b&gt;</p>', 'expected callback');
})
.then(function () {
  tressa.log('## virtual content extras');
  var div = document.createElement('div');
  hyperHTML.bind(div)`a ${null}`;
  tressa.assert(/a <[^>]+?>/.test(div.innerHTML), 'expected layout');
  hyperHTML.bind(div)`a ${{text: '<img>'}}`;
  tressa.assert(/a &lt;img&gt;<[^>]+?>/.test(div.innerHTML), 'expected text');
  hyperHTML.bind(div)`a ${{any: 123}}`;
  tressa.assert(/a 123<[^>]+?>/.test(div.innerHTML), 'expected any');
  hyperHTML.bind(div)`a ${{html: '<b>ok</b>'}}`;
  tressa.assert(/a <b>ok<\/b><[^>]+?>/.test(div.innerHTML), 'expected html');
  hyperHTML.bind(div)`a ${{}}`;
  tressa.assert(/a <[^>]+?>/.test(div.innerHTML), 'expected nothing');
})
.then(function () {
  tressa.log('## defined transformer');
  hyperHTML.define('eUC', encodeURIComponent);
  var div = document.createElement('div');
  hyperHTML.bind(div)`a=${{eUC: 'b c'}}`;
  tressa.assert(/a=b%20c<[^>]+?>/.test(div.innerHTML), 'expected virtual layout');
  hyperHTML.bind(div)`<p>${{eUC: 'b c'}}</p>`;
  tressa.assert(/<p>b%20c<\/p>/.test(div.innerHTML), 'expected layout');
})
.then(function () {
  tressa.log('## attributes with null values');
  var div = document.createElement('div');
  hyperHTML.bind(div)`<p any-attr=${'1'}>any content</p>`;
  tressa.assert(
    div.firstChild.hasAttribute('any-attr') &&
    div.firstChild.getAttribute('any-attr') === '1',
    'regular attribute'
  );
  hyperHTML.bind(div)`<p any-attr=${null}>any content</p>`;
  tressa.assert(
    !div.firstChild.hasAttribute('any-attr') &&
    div.firstChild.getAttribute('any-attr') == null,
    'can be removed'
  );
  hyperHTML.bind(div)`<p any-attr=${undefined}>any content</p>`;
  tressa.assert(
    !div.firstChild.hasAttribute('any-attr') &&
    div.firstChild.getAttribute('any-attr') == null,
    'multiple times'
  );
  hyperHTML.bind(div)`<p any-attr=${'2'}>any content</p>`;
  tressa.assert(
    div.firstChild.hasAttribute('any-attr') &&
    div.firstChild.getAttribute('any-attr') === '2',
    'but can be also reassigned'
  );
  hyperHTML.bind(div)`<p any-attr=${'3'}>any content</p>`;
  tressa.assert(
    div.firstChild.hasAttribute('any-attr') &&
    div.firstChild.getAttribute('any-attr') === '3',
    'many other times'
  );
  hyperHTML.bind(div)`<input name=${'test'}>`;
  tressa.assert(
    div.firstChild.hasAttribute('name') &&
    div.firstChild.name === 'test',
    'special attributes are set too'
  );
  hyperHTML.bind(div)`<input name=${null}>`;
  tressa.assert(
    !div.firstChild.hasAttribute('name') &&
    !div.firstChild.name,
    'but can also be removed'
  );
  hyperHTML.bind(div)`<input name=${undefined}>`;
  tressa.assert(
    !div.firstChild.hasAttribute('name') &&
    !div.firstChild.name,
    'with either null or undefined'
  );
})
.then(function () {return tressa.async(function (done) {
  tressa.log('## placeholder');
  var div = document.createElement('div');
  var vdiv = document.createElement('div');
  hyperHTML.bind(div)`<p>${{eUC: 'b c', placeholder: 'z'}}</p>`;
  hyperHTML.bind(vdiv)`a=${{eUC: 'b c', placeholder: 'z'}}`;
  tressa.assert(/<p>z<\/p>/.test(div.innerHTML), 'expected inner placeholder layout');
  tressa.assert(/a=z<[^>]+?>/.test(vdiv.innerHTML), 'expected virtual placeholder layout');
  setTimeout(function () {
    tressa.assert(/<p>b%20c<\/p>/.test(div.innerHTML), 'expected inner resolved layout');
    tressa.assert(/a=b%20c<[^>]+?>/.test(vdiv.innerHTML), 'expected virtual resolved layout');
    hyperHTML.bind(div)`<p>${{text: 1, placeholder: '9'}}</p>`;
    setTimeout(function () {
      tressa.assert(/<p>1<\/p>/.test(div.innerHTML), 'placeholder with text');
      hyperHTML.bind(div)`<p>${{any: [1, 2], placeholder: '9'}}</p>`;
      setTimeout(function () {
        tressa.assert(/<p>12<\/p>/.test(div.innerHTML), 'placeholder with any');
        hyperHTML.bind(div)`<p>${{html: '<b>3</b>', placeholder: '9'}}</p>`;
        setTimeout(function () {
          tressa.assert(/<p><b>3<\/b><\/p>/.test(div.innerHTML), 'placeholder with html');
          done();
        }, 10);
      }, 10);
    }, 10);
  }, 10);
});})
.then(function () {
  tressa.log('## hyper(...)');
  var hyper = hyperHTML.hyper;
  tressa.assert(typeof hyper() === 'function', 'empty hyper() is a wire tag');
  tressa.assert((hyper`abc`).textContent === 'abc', 'hyper`abc`');
  tressa.assert((hyper`<p>a${2}c</p>`).textContent === 'a2c', 'hyper`<p>a${2}c</p>`');
  tressa.assert((hyper(document.createElement('div'))`abc`).textContent === 'abc', 'hyper(div)`abc`');
  tressa.assert((hyper(document.createElement('div'))`a${'b'}c`).textContent === 'abc', 'hyper(div)`a${"b"}c`');
  // WFT jsdom ?!
  delete Object.prototype.nodeType;
  tressa.assert((hyper({})`abc`).textContent === 'abc', 'hyper({})`abc`');
  tressa.assert((hyper({})`<p>a${'b'}c</p>`).textContent === 'abc', 'hyper({})`<p>a${\'b\'}c</p>`');
  tressa.assert((hyper({}, ':id')`abc`).textContent === 'abc', 'hyper({}, \':id\')`abc`');
  tressa.assert((hyper({}, ':id')`<p>a${'b'}c</p>`).textContent === 'abc', 'hyper({}, \':id\')`<p>a${\'b\'}c</p>`');
  tressa.assert((hyper('svg')`<rect />`), 'hyper("svg")`<rect />`');
})
.then(function () {
  tressa.log('## data=${anyContent}');
  var obj = {rand: Math.random()};
  var div = hyperHTML.wire()`<div data=${obj}>abc</div>`;
  tressa.assert(div.data === obj, 'data available without serialization');
  tressa.assert(div.outerHTML === '<div>abc</div>', 'attribute not there');
})
.then(function () {
  tressa.log('## hyper.Component');
  class Button extends hyperHTML.Component {
    render() { return this.html`
      <button>hello</button>`;
    }
  }
  class Rect extends hyperHTML.Component {
    constructor(state) {
      super().setState(state);
    }
    render() { return this.svg`
      <rect x=${this.state.x} y=${this.state.y} />`;
    }
  }
  class Paragraph extends hyperHTML.Component {
    constructor(state) {
      super().setState(state);
    }
    onclick() { this.clicked = true; }
    render() { return this.html`
      <p attr=${this.state.attr} onclick=${this}>hello</p>`;
    }
  }
  var div = document.createElement('div');
  var render = hyperHTML.bind(div);
  render`${[
    new Button,
    new Rect({x: 123, y: 456})
  ]}`;
  tressa.assert(div.querySelector('button'), 'the <button> exists');
  tressa.assert(div.querySelector('rect'), 'the <rect /> exists');
  var p = new Paragraph(() => ({attr: 'test'}));
  render`${p}`;
  tressa.assert(div.querySelector('p').getAttribute('attr') === 'test', 'the <p attr=test> is defined');
  p.render().click();
  tressa.assert(p.clicked, 'the event worked');
})
.then(function () {
  tressa.log('## Custom Element attributes');
  var global = document.defaultView;
  var registry = global.customElements;
  var customElements = {
    _: Object.create(null),
    define: function (name, Class) {
      this._[name.toLowerCase()] = Class;
    },
    get: function (name) {
      return this._[name.toLowerCase()];
    }
  };
  Object.defineProperty(global, 'customElements', {
    configurable: true,
    value: customElements
  });
  function DumbElement() {}
  DumbElement.prototype.dumb = null;
  customElements.define('dumb-element', DumbElement);
  var div = hyperHTML.wire()`<div>
    <dumb-element dumb=${true}></dumb-element><dumber-element dumb=${true}></dumber-element>
  </div>`;
  Object.defineProperty(global, 'customElements', {
    configurable: true,
    value: registry
  });
  tressa.assert(div.firstElementChild.dumb === true, 'known elements can have special attributes');
  tressa.assert(div.lastElementChild.dumb !== true, 'unknown elements wouldn\'t');
})
// */
.then(function () {
  if (!tressa.exitCode) {
    document.body.style.backgroundColor = '#0FA';
  }
  tressa.end();
});