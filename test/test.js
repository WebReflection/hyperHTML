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

    render = hyperHTML.wire();
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
  return tressa.async(function (done) {
    tressa.log('## preserve first child where first child is the same as incoming');
    var div = document.body.appendChild(document.createElement('div'));
    var render = hyperHTML.bind(div);
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0, len = mutations.length; i < len; i++) {
        trackMutations(mutations[i].addedNodes, 'added')
        trackMutations(mutations[i].removedNodes, 'removed')
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
          key = nodes[i].getAttribute('data-test')
          counter = counters[key] || (counters[key] = { added: 0, removed: 0 });
          counter[countKey]++;
        }
        if (nodes[i].childNodes.length > 0) {
          trackMutations(nodes[i].childNodes, countKey);
        }
      }
    }

    var list = {};
    var listItems = [];

    function update(items) {
      return hyperHTML.wire(list)`
      <section>
        <ul>${
          items.map(function (item, i) {
            return hyperHTML.wire((listItems[i] || (listItems[i] = {})))`
            <li data-test="${i}">${item.text}</li>
            `
          })
        }</ul>
      </section>`;
    }

    setTimeout(function () {
      render`${update([{ text: 'test1' }])}`;
    });
    setTimeout(function () {
      render`${update([{ text: 'test1' }, { text: 'test2' }])}`;
    });
    setTimeout(function () {
      render`${update([{ text: 'test1' }])}`;
    });
    setTimeout(function () {
      tressa.assert(counters[0].added === 1, 'first item added only once');
      tressa.assert(counters[0].removed === 0, 'first item never removed');
      done();
    });
  });
})
.then(function () {
  if (!tressa.exitCode) {
    document.body.style.backgroundColor = '#0FA';
  }
  tressa.end();
});