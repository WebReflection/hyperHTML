var hyperHTML = (function () {'use strict';

  /*! (c) 2017 Andrea Giammarchi @WebReflection, (MIT) */

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

  // Specially useful when you have content rendered
  // on the server and you don't want to lose it
  // at the first time hyperHTML passes over it.
  // To be used instead of hyperHTML.bind(node)
  // but only if the content of the node is the equivalent
  // of the used template literal.
  //
  // <body><div adopted=""> adopt me </div></body>
  //
  // var render = hyperHTML.adopt(document.body);
  // render`<div adopted="${true}"> ${'new text'} </div>`;
  hyperHTML.adopt = function adopt(node) {
    return function (statics) {
      return  EXPANDO in node &&
            node[EXPANDO].s === statics ?
              update.apply(node, arguments) :
              remap.apply(node, arguments);
    };
  };

  // A wire ➰ is a bridge between a document fragment
  // and its inevitably lost list of rendered nodes
  //
  // var render = hyperHTML.wire(optObj);
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
        wireWeakly(obj, type || 'html')
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
      attributes = IE ?
        mapAttributes(node.attributes) :
        slice.call(node.attributes),
      i = 0,
      length = attributes.length;
      i < length; i++
    ) {
      attribute = attributes[i];
      if (attribute.value === value) {
        // with IE the order doesn't really matter
        // as long as the right attribute is addressed
        if (IE) attribute = node.getAttributeNode(IEAttributes.shift());
        actions.push(remapping ?
          {a:'attr', n:attribute} :
          setAttribute(node, attribute));
      }
    }
  }

  // traverse the whole node in search of editable content
  // decide what each future update should change
  //
  // <div atr="${some.attribute}">
  //    <h1>${some.HTML}</h1>
  //    <p> ${some.text} </p>
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
        case ELEMENT_NODE:
          attributesSeeker(child, actions);
          lukeTreeWalker(child, actions);
          break;
        case COMMENT_NODE:
          if (child.textContent === uid) {
            if (length === 1) {
              if (remapping) {
                actions.push({a:'any', n:node});
              } else {
                actions.push(setAnyContent(node));
                node.removeChild(child);
              }
            } else if (
              (i < 1 || childNodes[i - 1].nodeType === ELEMENT_NODE) &&
              (i + 1 === length || childNodes[i + 1].nodeType === ELEMENT_NODE)
            ) {
              actions.push(remapping ?
                {a:'vc', n:child} : setVirtualContent(child));
            } else {
              if (remapping) {
                actions.push({a:'text', n:child});
              } else {
                text = node.ownerDocument.createTextNode('');
                actions.push(setTextContent(text));
                node.replaceChild(text, child);
              }
            }
          }
          break;
        case TEXT_NODE:
          // TODO: once SHOULD_USE_ATTRIBUTE contains more attributes
          //       it's probably a good idea not to use it in here.
          if (SHOULD_USE_ATTRIBUTE.test(node.nodeName) && child.textContent === uidc) {
            actions.push(remapping ? {a:'text', n:node} : setTextContent(node));
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
              var i = indexOfDifferences(node.childNodes, value);
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
  // Note: attributes with a special meaning like DOM Level 0
  //       listeners or accessors properties are directly set
  function setAttribute(node, attribute) {
    var
      name = attribute.name,
      isEvent = name.slice(0, 2) === 'on',
      isSpecial = name in node && !SHOULD_USE_ATTRIBUTE.test(name),
      oldValue
    ;
    if (isSpecial) node.removeAttribute(name);
    return isSpecial ?
      function specialAttr(newValue) {
        if (oldValue !== newValue) {
          oldValue = newValue;
          if (isEvent) {
            node[name] = 'handleEvent' in newValue ?
              newValue.handleEvent.bind(newValue) :
              newValue;
          } else {
            node[name] = newValue;
          }
        }
      } :
      function attr(newValue) {
        if (oldValue !== newValue) {
          attribute.value = (oldValue = newValue);
        }
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
      fragment = node.ownerDocument.createDocumentFragment(),
      childNodes = []
    ;
    return function any(value) {
      var i, parentNode = node.parentNode;
      switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
          removeNodeList(childNodes, 0);
          injectHTML(fragment, value);
          childNodes = slice.call(fragment.childNodes);
          parentNode.insertBefore(fragment, node);
          break;
        default:
          if (Array.isArray(value)) {
            if (value.length === 0) {
              removeNodeList(childNodes, 0);
              childNodes = [];
            } else if(typeof value[0] === 'string') {
              any(value.join(''));
            } else {
              i = indexOfDifferences(childNodes, value);
              if (-1 < i) {
                removeNodeList(childNodes, i);
                value = value.slice(i);
                appendNodes(fragment, value);
                parentNode.insertBefore(fragment, node);
                childNodes = childNodes.slice(0, i).concat(value);
              }
            }
          } else {
            removeNodeList(childNodes, 0);
            childNodes = value.nodeType === DOCUMENT_FRAGMENT_NODE ?
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
    var oldValue;
    return function text(newValue) {
      if (oldValue !== newValue) {
        node.textContent = (oldValue = newValue);
      }
    };
  }


  // -------------------------
  // Helpers
  // -------------------------

  // given a generic text or comment node
  // remove the surrounding emptiness
  function cleanAround(textNode, sibling) {
    var adjacent = textNode[sibling];
    if (
      adjacent &&
      adjacent.nodeType === TEXT_NODE &&
      trim.call(adjacent.textContent).length < 1
    ) {
      textNode.parentNode.removeChild(adjacent);
      cleanAround(textNode, sibling);
    }
  }

  // find a live node through a virtual one
  function find(live, virtual) {
    var i, length, name, parentNode, map = [];
    switch(virtual.nodeType) {
      case ELEMENT_NODE:
        parentNode = virtual;
        break;
      case COMMENT_NODE:
        // clean up empty text nodes around
        cleanAround(virtual, 'previousSibling');
        cleanAround(virtual, 'nextSibling');
        parentNode = virtual.parentNode;
        map.unshift('childNodes', map.indexOf.call(parentNode.childNodes, virtual));
        break;
      case ATTRIBUTE_NODE:
      default: // jsdom here does not provide a nodeType 2 ...
        parentNode = virtual.ownerElement;
        map.unshift('getAttributeNode', virtual.name);
        break;
    }
    virtual = parentNode;
    while (parentNode = parentNode.parentNode) {
      map.unshift('children', map.indexOf.call(parentNode.children, virtual));
      virtual = parentNode;
    }
    for (i = 0, length = map.length; i < length; i++) {
      switch(name = map[i++]) {
        case 'getAttributeNode':
          parentNode = live[name](map[i]);
          live = parentNode || {ownerElement: live, name: map[i]};
          break;
        case 'childNodes':
          parentNode = live[name][map[i]];
          if (parentNode) live = parentNode;
          else {
            live.textContent = ' ';
            live = live.firstChild;
          }
          break;
        default:
          live = live[name][map[i]];
          break;
      }
    }
    return live;
  }

  // given two collections, find
  // the first index that has different content.
  function indexOfDifferences(a, b) {
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
      template = fragment.ownerDocument.createElement('template'),
      fallback = IE &&
                  !('content' in template) &&
                  /^[^\S]*?<(t(?:head|body|foot|r|d|h))/i.test(html)
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

  // IE / Edge Attributes values are resolved at runtime
  // no attribute.value is found if these are cleaned up when special
  // TODO: this might be used for every browser instead of slice.call
  //       to grant both name and value are preserved.
  //       However, this really looks just an IE/Edge bug.
  function mapAttributes(attributes) {
    for (var out = [], i = attributes.length; i--; out[i] = {
      name: attributes[i].name,
      value: attributes[i].value
    });
    return out;
  }

  // accordingly with the kind of child
  // it puts its content into a parent node
  function populateNode(parent, child) {
    switch (child.nodeType) {
      case ELEMENT_NODE:
        var childNodes = parent.childNodes;
        if (0 < childNodes.length) {
          if (childNodes[0] === child) {
            removeNodeList(childNodes, 1);
            break;
          }
        }
        resetAndPopulate(parent, child);
        break;
      case DOCUMENT_FRAGMENT_NODE:
        if (-1 < indexOfDifferences(parent.childNodes, child.childNodes)) {
          resetAndPopulate(parent, child);
        }
        break;
      case TEXT_NODE:
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
        child.nodeType === ELEMENT_NODE ||
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
        fragment = hyperHTML.document.createDocumentFragment();
        container = type === 'svg' ?
          hyperHTML.document.createElementNS('http://www.w3.org/2000/svg', 'svg') :
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

  // returns or create a weak wire by ID
  function wireByID(wires, id, type) {
    return wires[id] || (wires[id] = wireContent(type));
  }

  // setup a weak reference if needed and return a wire by ID
  function wireWeakly(obj, type) {
    var
      wires = wm.get(obj) || (wm.set(obj, wires = {}), wires),
      i = type.indexOf(':')
    ;
    return i < 0 ?
      wireByID(wires, type, type) :
      wireByID(wires, type.slice(i + 1), type.slice(0, i) || 'html');
  }

  // -------------------------
  // Template setup
  // -------------------------

  // given a live node and a tagged template literal
  // finds all needed updates without replacing,
  // at first pass, nodes that were already there
  function remap() {
    remapping = true;
    var
      i, length, action, node, text,
      fragment = upgrade.apply(
        this.ownerDocument.createDocumentFragment(),
        arguments
      ),
      actions = fragment[EXPANDO].u
    ;
    remapping = false;
    for (i = 0, length = actions.length; i < length; i++) {
      action = actions[i];
      node = find(this, action.n);
      switch (action.a) {
        case 'any':
          actions[i] = setAnyContent(node);
          node.textContent = '';
          break;
        case 'attr':
          actions[i] = setAttribute(node.ownerElement, node);
          break;
        case 'text':
          if (action.n.nodeType === ELEMENT_NODE) {
            actions[i] = setTextContent(node);
          }
          else {
            text = node.ownerDocument.createTextNode('');
            node.parentNode.replaceChild(text, node);
            actions[i] = setTextContent(text);
          }
          break;
        case 'vc':
          text = node.ownerDocument.createComment(uid);
          node.parentNode.replaceChild(text, node);
          actions[i] = setVirtualContent(text);
          break;
      }
    }
    this[EXPANDO] = fragment[EXPANDO];
    return update.apply(this, arguments);
  }

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
      removeNodeList(this.childNodes, 0);
      injectHTML(this, html.replace(no, comments));
    } else if (this.nodeType === ELEMENT_NODE) {
      this.innerHTML = html;
    } else {
      injectHTML(this, html);
    }
    lukeTreeWalker(this, updates);
    this[EXPANDO] = {s: statics, u: updates};
    return remapping ? this : update.apply(this, arguments);
  }

  // -------------------------
  // local variables
  // -------------------------

  var
    ELEMENT_NODE = 1,
    ATTRIBUTE_NODE = 2,
    TEXT_NODE = 3,
    COMMENT_NODE = 8,
    DOCUMENT_FRAGMENT_NODE = 11,
    // some attribute might be present on the element prototype but cannot be set directly
    // TODO: following RegExp used in lukeTreeWalker switch too
    //       if modified, remember to go there and remove its usage.
    SHOULD_USE_ATTRIBUTE = /^style$/i,
    // avoids WeakMap to avoid memory pressure, use CSS compatible syntax for IE
    EXPANDO = '_hyper_html: ',
    // use a pseudo unique id to avoid conflicts and normalize CSS style for IE
    uid = EXPANDO + ((Math.random() * new Date) | 0) + ';',
    // use comment nodes with pseudo unique content to setup
    uidc = '<!--' + uid + '-->',
    // if attributes order is shuffled, threat the browser differently
    IE = (function (p) {
      p.innerHTML = '<i data-i="" class=""></i>';
      return /class/i.test(p.firstChild.attributes[0].name);
    }(
      // beside the initial feature detection
      // the document could be swap-able at runtime
      (hyperHTML.document = document).createElement('p'))
    ),
    appendNodes = 'append' in document ?
      function (node, childNodes) {
        node.append.apply(node, childNodes);
      } :
      function appendNodes(node, childNodes) {
        for (var
          i = 0,
          length = childNodes.length;
          i < length; i++
        ) {
          node.appendChild(childNodes[i]);
        }
      },
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
    remapping = false,
    IEAttributes
  ;

  // -------------------------
  // ⚡️ ️️The End ➰
  // -------------------------
  return hyperHTML;

}());

// umd.KISS
try { module.exports = hyperHTML; } catch(o_O) {}
