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
  var html = update(i++);
  var p = div.querySelector('p');
  var attr = p.attributes[0];
  tressa.assert(compare(html), 'correct HTML');
  tressa.assert(html === div.innerHTML, 'correctly returned');
  setTimeout(function () {
    tressa.log('## updating same nodes');
    var html = update(i++);
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
    var html = update('hello');
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
      return render`<a href="#" onclick=${click}>click</a>`;
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
    var html = update('hello');
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
  if (!tressa.exitCode) {
    document.body.style.backgroundColor = '#0FA';
  }
  tressa.end();
});