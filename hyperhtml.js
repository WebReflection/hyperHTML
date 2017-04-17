var hyperHTML = (function () {'use strict';

  /*! (C) 2017 Andrea Giammarchi @WebReflection (MIT) */

  // hyperHTML \o/
  //
  // var render = hyperHTML.bind(document.body);
  // setInterval(() => render`
  //  <h1>⚡️ hyperHTML ⚡️</h1>
  //  <p>
  //    ${(new Date).toLocaleString()}
  //  </p>
  // `, 1000);
  function hyperHTML(statics) {
    return  EXPANDO in this &&
            this[EXPANDO].s === statics ?
              update.apply(this, arguments) :
              upgrade.apply(this, arguments);
  }

  // A wire ➰ is a bridge between a document fragment
  // and its inevitably lost list of rendered nodes
  //
  // var render = hyperHTML.wire();
  // render`
  //  <div>Hello Wired!</div>
  // `;
  //
  // Every single invocation will return that div
  // or the list of elements it contained as Array.
  // This simplifies most task where hyperHTML
  // is used to create the node itself, instead of
  // populating an already known and bound one.
  hyperHTML.wire = function wire(obj, type) {
    return arguments.length < 1 ?
      wireContent('html') :
      (obj == null ?
        wireContent(type || 'html') :
        (wm.get(obj) || wireWeakly(obj, type || 'html'))
      );
  };

  // - - - - - - - - - - - - - - - - - -  - - - - -

  // -------------------------
  // DOM parsing & traversing
  // -------------------------

  // setup attributes for updates
  //
  // <p class="${state.class}" onclick="${event.click}"></p>
  //
  // Note: always use quotes around attributes, even for events,
  //       booleans, or numbers, otherwise this function fails.
  function attributesSeeker(node, actions) {
    for (var
      attribute,
      value = IE ? uid : uidc,
      attributes = slice.call(node.attributes),
      i = 0,
      length = attributes.length;
      i < length; i++
    ) {
      attribute = attributes[i];
      if (attribute.value === value) {
        // with IE the order doesn't really matter
        // as long as the right attribute is addressed
        actions.push(setAttribute(node, IE ?
          node.getAttributeNode(IEAttributes.shift()) :
          attribute
        ));
      }
    }
  }

  // traverse the whole node in search of editable content
  // decide what each future update should change
  //
  // <div atr="${some.attribute}">
  //    <h1>${some.HTML}</h1>
  //    <p>
  //      ${some.text}
  //    </p>
  // </div>
  function lukeTreeWalker(node, actions) {
    for (var
      child, text,
      childNodes = slice.call(node.childNodes),
      length = childNodes.length,
      i = 0; i < length; i++
    ) {
      child = childNodes[i];
      switch (child.nodeType) {
        case 1:
          attributesSeeker(child, actions);
          lukeTreeWalker(child, actions);
          break;
        case 8:
          if (child.textContent === uid) {
            if (length === 1) {
              actions.push(setAnyContent(node));
              node.removeChild(child);
            } else if (
              (i < 1 || childNodes[i - 1].nodeType === 1) &&
              (i + 1 === length || childNodes[i + 1].nodeType === 1)
            ) {
              actions.push(setVirtualContent(child));
            } else {
              text = node.ownerDocument.createTextNode('');
              actions.push(setTextContent(text));
              node.replaceChild(text, child);
            }
          }
          break;
      }
    }
  }


  // -------------------------
  // DOM manipulating
  // -------------------------

  // update regular bound nodes
  //
  // var render = hyperHTML.bind(node);
  // function update() {
  //  render`template`;
  // }
  function setAnyContent(node) {
    return function any(value) {
      switch (typeof value) {
        case 'string':
          node.innerHTML = value;
          break;
        case 'number':
        case 'boolean':
          node.textContent = value;
          break;
        default:
          if (Array.isArray(value)) {
            if (value.length === 1) {
              any(value[0]);
            } else if(typeof value[0] === 'string') {
              any(value.join(''));
            } else {
              var i = indexOfDiffereces(node.childNodes, value);
              if (-1 < i) {
                updateViaArray(node, value, i);
              }
            }
          } else {
            populateNode(node, value);
          }
          break;
      }
    };
  }

  // update attributes node
  //
  // render`<a href="${url}" onclick="${click}">${name}</a>`;
  //
  // Note: attributes with `on` prefix are set directly as callbacks.
  //       These won't ever be transformed into strings while other
  //       attributes will be automatically sanitized.
  function setAttribute(node, attribute) {
    var
      name = attribute.name,
      isSpecial = SPECIAL_ATTRIBUTE.test(name)
    ;
    if (isSpecial) node.removeAttribute(name);
    return isSpecial ?
      function event(value) {
        node[name] = value;
      } :
      function attr(value) {
        attribute.value = value;
      };
  }

  // update the "emptiness"
  // this function is used when template literals
  // have sneaky html/fragment capable
  // updates in the wild (no spaces around)
  //
  // render`
  //  <p>Content before</p>${
  //  'any content in between'
  //  }<p>Content after</p>
  // `;
  //
  // Note: this is the most expensive
  //       update of them all.
  function setVirtualContent(node) {
    var
      fragment = document.createDocumentFragment(),
      childNodes = []
    ;
    return function any(value) {
      var i, parentNode = node.parentNode;
      switch (typeof value) {
        case 'number':
        case 'boolean':
          removeNodeList(childNodes, 0);
          var newNode = document.createTextNode(value);
          childNodes = [newNode];
          parentNode.insertBefore(newNode, node);
          break;
        case 'string':
          removeNodeList(childNodes, 0);
          injectHTML(fragment, value);
          childNodes = slice.call(fragment.childNodes);
          parentNode.insertBefore(fragment, node);
          break;
        default:
          if (Array.isArray(value)) {
            if (value.length === 0) {
              any(value[0]);
            } else if(typeof value[0] === 'string') {
              any(value.join(''));
            } else {
              i = indexOfDiffereces(childNodes, value);
              if (-1 < i) {
                removeNodeList(childNodes, i);
                value = value.slice(i);
                appendNodes(fragment, value);
                parentNode.insertBefore(fragment, node);
                childNodes.push.apply(childNodes, value);
              }
            }
          } else {
            removeNodeList(childNodes, 0);
            childNodes = value.nodeType === 11 ?
              slice.call(value.childNodes) :
              [value];
            parentNode.insertBefore(value, node);
          }
          break;
      }
    };
  }

  // basic closure to update nodes textContent
  //
  // render`
  //  <p>
  //    ${'spaces around means textContent'}
  //  </p>`;
  function setTextContent(node) {
    return function text(value) {
      node.textContent = value;
    };
  }


  // -------------------------
  // Helpers
  // -------------------------

  // it does exactly what it says
  function appendNodes(node, childNodes) {
    for (var
      i = 0,
      length = childNodes.length;
      i < length; i++
    ) {
      node.appendChild(childNodes[i]);
    }
  }

  // given two collections, find
  // the first index that has different content.
  // If the two lists are the same, return -1
  // to indicate no differences were found.
  function indexOfDiffereces(a, b) {
    if (a === b) return -1;
    var
      i = 0,
      aLength = a.length,
      bLength = b.length
    ;
    while (i < aLength) {
      if (i < bLength && a[i] === b[i]) i++;
      else return i;
    }
    return i === bLength ? -1 : i;
  }

  // inject HTML into a template node
  // and populate a fragment with resulting nodes
  //
  // IE9~IE11 are not compatible with the template tag.
  // If the content is a partial part of a table there is a fallback.
  // Not the most elegant/robust way but good enough for common cases.
  // (I don't want to include a whole DOM parser for IE only here).
  function injectHTML(fragment, html) {
    var
      fallback = IE && /^[^\S]*?<(t(?:head|body|foot|r|d|h))/i.test(html),
      template = fragment.ownerDocument.createElement('template')
    ;
    template.innerHTML = fallback ? ('<table>' + html + '</table>') : html;
    if (fallback) {
      template = {childNodes: template.querySelectorAll(RegExp.$1)};
    }
    appendNodes(
      fragment,
      slice.call((template.content || template).childNodes)
    );
  }

  // accordingly with the kind of child
  // it put its content into a parent node
  function populateNode(parent, child) {
    switch (child.nodeType) {
      case 1:
        var childNodes = parent.childNodes;
        if (childNodes.length !== 1 || childNodes[0] !== child) {
          resetAndPopulate(parent, child);
        }
        break;
      case 11:
        if (-1 < indexOfDiffereces(parent.childNodes, child.childNodes)) {
          resetAndPopulate(parent, child);
        }
        break;
      case 3:
        parent.textContent = child.textContent;
        break;
    }
  }

  // it does exactly what it says
  function removeNodeList(list, startIndex) {
    var length = list.length, child;
    while (startIndex < length--) {
      child = list[length];
      child.parentNode.removeChild(child);
    }
  }

  // drop all nodes and append a node
  function resetAndPopulate(parent, child) {
    parent.textContent = '';
    parent.appendChild(child);
  }

  // the first time a hyperHTML.wire() is invoked
  // remember the list of nodes that should be updated
  // at every consequent render call.
  // The resulting function might return the very first node
  // or the Array of all nodes that might need updates.
  function setupAndGetContent(node) {
    for (var
      child,
      children = [],
      childNodes = node.childNodes,
      i = 0,
      length = childNodes.length;
      i < length; i++
    ) {
      child = childNodes[i];
      if (
        1 === child.nodeType ||
        0 < trim.call(child.textContent).length
      ) {
        children.push(child);
      }
    }
    length = children.length;
    return length < 2 ?
      ((child = length < 1 ? node : children[0]),
      function () { return child; }) :
      function () { return children; };
  }

  // remove and/or and a list of nodes through an array
  function updateViaArray(node, childNodes, i) {
    var fragment = node.ownerDocument.createDocumentFragment();
    if (0 < i) {
      removeNodeList(node.childNodes, i);
      appendNodes(fragment, childNodes.slice(i));
      node.appendChild(fragment);
    } else {
      appendNodes(fragment, childNodes);
      resetAndPopulate(node, fragment);
    }
  }

  // create a new wire for generic DOM content
  function wireContent(type) {
    var content, container, fragment, render, setup, template;
    return function update(statics) {
      if (template !== statics) {
        setup = true;
        template = statics;
        fragment = document.createDocumentFragment();
        container = type === 'svg' ?
          document.createElementNS('http://www.w3.org/2000/svg', 'svg') :
          fragment;
        render = hyperHTML.bind(container);
      }
      render.apply(null, arguments);
      if (setup) {
        setup = false;
        if (type === 'svg') {
          appendNodes(fragment, slice.call(container.childNodes));
        }
        content = setupAndGetContent(fragment);
      }
      return content();
    };
  }

  // get or create a wired weak reference
  function wireWeakly(obj, type) {
    var wire = wireContent(type);
    wm.set(obj, wire);
    return wire;
  }

  // -------------------------
  // Template setup
  // -------------------------

  // each known hyperHTML update is
  // kept as simple as possible.
  function update() {
    for (var
      i = 1,
      length = arguments.length,
      updates = this[EXPANDO].u;
      i < length; i++
    ) {
      updates[i - 1](arguments[i]);
    }
    return this;
  }

  // but the first time, it needs to be setup.
  // From now on, only update(statics) will be called
  // unless this node won't be used for other renderings.
  function upgrade(statics) {
    var
      updates = [],
      html = statics.join(uidc)
    ;
    if (IE) {
      IEAttributes = [];
      injectHTML(this, html.replace(no, comments));
    } else if (this.nodeType === 1) {
      this.innerHTML = html;
    } else {
      injectHTML(this, html);
    }
    lukeTreeWalker(this, updates);
    this[EXPANDO] = {s: statics, u: updates};
    return update.apply(this, arguments);
  }

  // -------------------------
  // the trash bin
  // -------------------------

  // IE used to suck.
  /*
  // even in a try/catch this throw an error
  // since it's reliable though, I'll keep it around
  function isIE() {
    var p = document.createElement('p');
    p.innerHTML = '<i onclick="<!---->">';
    return p.childNodes[0].onclick == null;
  }
  //*/

  // remove and/or and a list of nodes through a fragment
  /* temporarily removed until it's demonstrated it's needed
  function updateViaFragment(node, fragment, i) {
    if (0 < i) {
      removeNodeList(node.childNodes, i);
      var slim = fragment.cloneNode();
      appendNodes(slim, slice.call(fragment.childNodes, i));
      node.appendChild(fragment, slim);
    } else {
      resetAndPopulate(node, fragment);
    }
  }
  //*/

  // -------------------------
  // local variables
  // -------------------------

  var
    // decide special attributes behavior (DOM Level 0 events or "boolean attributes", as per HTML)
    SPECIAL_ATTRIBUTE = /^(?:(?:on|allow)[a-z]+|async|autofocus|autoplay|capture|checked|controls|default|defer|disabled|formnovalidate|hidden|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected|truespeed|typemustmatch|usecache)$/,
    // avoids WeakMap to avoid memory pressure, use CSS compatible syntax for IE
    EXPANDO = '_hyper_html: ',
    // use a pseudo unique id to avoid conflicts and normalize CSS style for IE
    uid = EXPANDO + ((Math.random() * new Date) | 0) + ';',
    // use comment nodes with pseudo unique content to setup
    uidc = '<!--' + uid + '-->',
    // threat it differently
    IE = 'documentMode' in document,
    no = IE && new RegExp('([^\\S][a-z]+[a-z0-9_-]*=)([\'"])' + uidc + '\\2', 'g'),
    comments = IE && function ($0, $1, $2) {
      IEAttributes.push($1.slice(1, -1));
      return $1 + $2 + uid + $2;
    },
    // verify empty textContent on .wire() setup
    trim = EXPANDO.trim || function () {
      return this.replace(/^\s+|\s+$/g, '');
    },
    // convert DOM.childNodes into arrays to avoid
    // DOM mutation backfiring on loops
    slice = [].slice,
    // used for weak references
    // if WeakMap is not available
    // it uses a configurable, non enumerable,
    // quick and dirty expando property.
    wm = typeof WeakMap === typeof wm ?
      {
        get: function (obj) { return obj[EXPANDO]; },
        set: function (obj, value) {
          Object.defineProperty(obj, EXPANDO, {
            configurable: true,
            value: value
          });
        }
      } :
      new WeakMap(),
    IEAttributes
  ;

  // Simply to avoid duplicated RegExp in viperHTML
  hyperHTML.SPECIAL_ATTRIBUTE = SPECIAL_ATTRIBUTE;

  // -------------------------
  // ⚡️ ️️The End ➰
  // -------------------------
  return hyperHTML;

}());

// umd.KISS
try { module.exports = hyperHTML; } catch(o_O) {}
