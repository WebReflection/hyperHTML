tressa.title('HyperHTML');
tressa.assert(typeof hyperHTML === 'function', 'hyperHTML is a function');

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
    return /^\s*<p data-counter="\d">\s*Time: \d+\.\d+\s*<\/p>\s*$/i.test(html);
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
    tressa.log('## injecting HTML');
    var div = document.body.appendChild(document.createElement('div'));
    var render = hyperHTML.bind(div);
    var html = update('hello').innerHTML;
    function update(text) {
      return render`<p>${'<strong>' + text + '</strong>'}</p>`;
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
    update(function (e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      tressa.assert(true, 'onclick invoked');
      tressa.assert(!a.hasAttribute('onclick'), 'no attribute');
      done(div);
    });
    function update(click) {
      return render`<a href="#" onclick="${click}">click</a>`;
    }
    var a = div.querySelector('a');
    if (typeof CustomEvent === 'undefined') {
      a.onclick();
    } else {
      a.dispatchEvent(new CustomEvent('click'));
    }
  });
})
.then(function (div) {
  return tressa.async(function (done) {
    tressa.log('## changing template');
    var render = hyperHTML.bind(div);
    var html = update('hello').innerHTML;
    function update(text) {
      return render`<p>${'<em>' + text + '</em>'}</p>`;
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
      tressa.assert(counters[0].added === 1, 'first item added only once');
      tressa.assert(counters[0].removed === 0, 'first item never removed');
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
      <ul>${
        model.list.map(item => `<li> ${item.name} </li>`)
      }</ul>${
        model.inBetween
      }<hr>
    </div>
    `;
  }
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
  hyperHTML.bind(wrap)`<style>${'hyper-html{}'}</style>`;
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
  hyperHTML.bind(wrap)`[${'text'}]`;
  hyperHTML.bind(wrap)`[${'text'}]`;
  let onclick = (e) => {};
  let handler = {handleEvent: onclick};
  hyperHTML.bind(wrap)`<p onclick="${onclick}" onmouseover="${handler}" align="${'left'}"></p>`;
  hyperHTML.bind(wrap)`<p onclick="${onclick}" onmouseover="${handler}" align="${'left'}"></p>`;
  hyperHTML.bind(wrap)`<br>${arr[0]}<br>`;
  hyperHTML.bind(wrap)`<br>${arr}<br>`;
  hyperHTML.bind(wrap)`<br>${arr}<br>`;
  hyperHTML.bind(wrap)`<br>${[]}<br>`;
  hyperHTML.bind(wrap)`<br>${['1', '2']}<br>`;
  hyperHTML.bind(wrap)`<br>${document.createDocumentFragment()}<br>`;
  tressa.assert(true, 'passed various virtual content scenarios');
  result = hyperHTML.wire(null, 'svg')`<svg></svg>`;
  tressa.assert(result.nodeName.toLowerCase() === 'svg', 'svg content is allowed too');
  result = hyperHTML.wire()``;
  tressa.assert(!result.innerHTML, 'empty content');
  let tr = hyperHTML.wire()`<tr><td>ok</td></tr>`;
  tressa.assert(true, 'even TR as template');
})
.then(function () {
  if (!tressa.exitCode) {
    document.body.style.backgroundColor = '#0FA';
  }
  tressa.end();
});