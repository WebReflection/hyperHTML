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
  hyperHTML.wire = function wire() {
    var
      fragment = document.createDocumentFragment(),
      render = hyperHTML.bind(fragment),
      setup = true,
      content
    ;
    return function update() {
      render.apply(null, arguments);
      if (setup) {
        setup = !setup;
        content = setupAndGetContent(fragment);
      }
      return content();
    };
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
      attributes = slice.call(node.attributes),
      i = 0,
      length = attributes.length;
      i < length; i++
    ) {
      attribute = attributes[i];
      if (attribute.value === uidc) {
        actions.push(setAttribute(node, attribute));
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
          if (length === 1) {
            actions.push(setAnyContent(node));
            node.removeChild(child);
          } else if (
            childNodes[i - 1].nodeType === 1 &&
            (i + 1 === length || childNodes[i + 1].nodeType === 1)
          ) {
            actions.push(setVirtualContent(child));
          } else {
            text = node.ownerDocument.createTextNode('');
            actions.push(setTextContent(text));
            node.replaceChild(text, child);
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
            if (value.length === 0) {
              any(value[0]);
            } else if(typeof value[0] === 'string') {
              any(value.join(''));
            } else {
              if (!sameList(node.childNodes, value)) {
                resetAndPopulate(node, appendNodes(
                  node.ownerDocument.createDocumentFragment(),
                  value
                ));
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
      var parentNode = node.parentNode;
      switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
          removeNodeList(childNodes);
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
              if (!sameList(childNodes, value)) {
                removeNodeList(childNodes);
                appendNodes(fragment, value);
                childNodes = slice.call(fragment.childNodes);
                parentNode.insertBefore(fragment, node);
              }
            }
          } else {
            removeNodeList(childNodes);
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

  // inject HTML into a template node
  // and populate a fragment with resulting nodes
  //
  // Note: for partial layout such `<tr>` or `<td>`
  //       you need an HTML5 compatible browser
  //       (or an HTML5 Template specification that works)
  function injectHTML(fragment, html) {
    var template = fragment.ownerDocument.createElement('template');
    template.innerHTML = html;
    appendNodes(
      fragment,
      slice.call((template.content || template).childNodes)
    );
  }

  // it does exactly what it says
  function appendNodes(node, childNodes) {
    for (var
      i = 0,
      length = childNodes.length;
      i < length; i++
    ) {
      node.appendChild(childNodes[i]);
    }
    return node;
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
        if (!sameList(parent.childNodes, child.childNodes)) {
          resetAndPopulate(parent, child);
        }
        break;
      case 3:
        parent.textContent = child.textContent;
        break;
    }
  }

  // drop all nodes and append a node
  function resetAndPopulate(parent, child) {
    parent.textContent = '';
    parent.appendChild(child);
  }

  // it does exactly what it says
  function removeNodeList(list) {
    var i = list.length, child;
    while (i--) {
      child = list[i];
      child.parentNode.removeChild(child);
    }
  }

  // compare two list of nodes
  // if different, will update later on
  function sameList(a, b) {
    if (a === b) return true;
    var
      i = 0,
      aLength = a.length
    ;
    if (aLength !== b.length) return false;
    while (i < aLength) {
      if (a[i] !== b[i]) return false;
      i++;
    }
    return true;
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


  // -------------------------
  // Template setup
  // -------------------------

  // each known hyperHTML update is
  // kept as simple as possible.
  function update(statics) {
    for (var
      i = 1,
      length = statics.length,
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
    if (this.nodeType === 1) {
      this.innerHTML = html;
    } else {
      injectHTML(this, html);
    }
    lukeTreeWalker(this, updates);
    this[EXPANDO] = {s: statics, u: updates};
    return update.apply(this, arguments);
  }


  // -------------------------
  // local variables
  // -------------------------

  var
    // decide special attributes behavior
    SPECIAL_ATTRIBUTE = /^(?:on[a-z]+|autofocus|disabled|required)$/,
    // avoids WeakMap to avoid memory pressure
    EXPANDO = '_hyperHTML',
    // use a pseudo unique id to avoid conflicts
    uid = EXPANDO + ((Math.random() * new Date) | 0),
    // use comment nodes with pseudo unique content to setup
    uidc = '<!--' + uid + '-->',
    // verify empty textContent on .wire() setup
    trim = EXPANDO.trim || function () {
      return this.replace(/^\s+|\s+$/g, '');
    },
    // convert DOM.childNodes into arrays to avoid
    // DOM mutation backfiring on loops
    slice = [].slice
  ;


  // -------------------------
  // ⚡️ ️️The End ➰
  // -------------------------
  return hyperHTML;

}());

// umd.KISS
try { module.exports = hyperHTML; } catch(o_O) {}
