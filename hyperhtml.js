var hyperHTML = (function () {'use strict';

  /*! (C) 2017 Andrea Giammarchi @WebReflection (MIT) */

  // DOM parsing & traversing
  function attributesSeeker(node, actions) {
    for (var
      attribute,
      attributes = node.attributes,
      i = 0,
      length = attributes.length;
      i < length; i++
    ) {
      attribute = attributes[i];
      if (attribute.value === uid) {
        actions.push(setAttribute(node, attribute));
      }
    }
  }

  function lukeTreeWalker(node, actions) {
    for (var
      child,
      childNodes = slice.call(node.childNodes),
      i = 0; i < childNodes.length; i++
    ) {
      child = childNodes[i];
      switch (child.nodeType) {
        case 1:
          attributesSeeker(child, actions);
          lukeTreeWalker(child, actions);
          break;
        case 3:
          walkerTextRanger(node, child, actions);
          break;
      }
    }
  }

  function walkerTextRanger(parent, child, actions) {
    for (var
      doc = parent.ownerDocument || document,
      text = child.nodeValue,
      textNodes = text.split(uid),
      i = 0,
      length = textNodes.length;
      i < length; i++
    ) {
      if (i) {
        if (
          length === 2 &&
          (textNodes[0] + textNodes[1]).length < 1
        ) {
          actions.push(setAnyContent(parent));
          break;
        } else {
          actions.push(setTextContent(
            parent.insertBefore(
              doc.createTextNode(''),
              child
            )
          ));
        }
      }
      text = textNodes[i];
      if (text.length) {
        parent.insertBefore(
          doc.createTextNode(text),
          child
        );
      }
    }
    parent.removeChild(child);
  }

  // DOM manipulating
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
            any(populateFragment(
              document.createDocumentFragment(),
              value
            ));
          } else {
            populateNode(node, value);
          }
          break;
      }
    };
  }

  function setAttribute(node, attribute) {
    var
      name = attribute.name,
      onStuff = !name.indexOf('on')
    ;
    if (onStuff) node.removeAttribute(name);
    return onStuff ?
      function event(value) {
        node[name] = value;
      } :
      function attribute(value) {
        attribute.value = value;
      };
  }

  function setTextContent(node) {
    return function text(value) {
      node.textContent = value;
    };
  }

  // Helpers
  function populateFragment(f, nodes) {
    for (var
      i = 0,
      length = nodes.length;
      i < length; i++
    ) {
      f.appendChild(nodes[i]);
    }
    return f;
  }

  function populateNode(parent, child) {
    switch (child.nodeType) {
      case 11:
        if (!sameList(parent.childNodes, child.childNodes)) {
          resetAndPopulate(parent, child);
        }
        break;
      case 1:
        var childNodes = parent.childNodes;
        if (childNodes.length !== 1 || childNodes[0] !== child) {
          resetAndPopulate(parent, child);
        }
        break;
      case 3:
        parent.textContent = child.textContent;
        break;
    }
  }

  function resetAndPopulate(parent, child) {
    parent.textContent = '';
    parent.appendChild(child);
  }

  function sameList(a, b) {
    if (a === b) return true;
    var
      i = 0,
      aLength = a.length,
      bLength = b.length
    ;
    if (aLength !== bLength) return false;
    while (i < aLength) {
      if (a[i] !== b[i]) return false;
      i++;
    }
    return true;
  }

  // Template setup
  function update(statics) {
    for (var
      any,
      html = [statics[0]],
      updates = this[EXPANDO].u,
      i = 1,
      length = statics.length;
      i < length; i++
    ) {
      any = arguments[i];
      updates[i - 1](any);
      html.push(any, statics[i]);
    }
    return html.join('');
  }

  function upgrade(statics) {
    for (var
      updates = [],
      html = [statics[0]],
      i = 1,
      length = statics.length;
      i < length; i++
    ) {
      html.push(uid, statics[i]);
    }
    this.innerHTML = html.join('');
    lukeTreeWalker(this, updates);
    this[EXPANDO] = {s: statics, u: updates};
    return update.apply(this, arguments);
  }

  // local variables
  var
    EXPANDO = '_hyperHTML',
    uid = EXPANDO + ((Math.random() * new Date) | 0),
    slice = [].slice
  ;

  // hyperHTML \o/
  return function hyperHTML(statics) {
    return  EXPANDO in this &&
            this[EXPANDO].s === statics ?
              update.apply(this, arguments) :
              upgrade.apply(this, arguments);
  };

}());

// umd.KISS
try { module.exports = hyperHTML; } catch(o_O) {}
