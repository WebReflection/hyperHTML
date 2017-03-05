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
      if (attribute.value === uidc) {
        actions.push(setAttribute(node, attribute));
      }
    }
  }

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
            } else {
              text = node.ownerDocument.createTextNode('');
              node.replaceChild(text, child);
              actions.push(setTextContent(text));
            }
          }
          break;
      }
    }
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
            if (value.length === 0) {
              any(value[0]);
            } else if(typeof value[0] === 'string') {
              any(value.join(''));
            } else {
              if (!sameList(node.childNodes, value)) {
                any(populateFragment(
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
      function attr(value) {
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

  function resetAndPopulate(parent, child) {
    parent.textContent = '';
    parent.appendChild(child);
  }

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

  // Template setup
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

  function upgrade(statics) {
    for (var
      template,
      updates = [],
      html = [statics[0]],
      i = 1,
      length = statics.length;
      i < length; i++
    ) {
      html.push(uidc, statics[i]);
    }
    if (this.nodeType === 1) {
      this.innerHTML = html.join('');
    } else {
      template = this.ownerDocument.createElement('template');
      template.innerHTML = html.join('');
      populateFragment(
        this,
        slice.call((template.content || template).childNodes)
      );
    }
    lukeTreeWalker(this, updates);
    this[EXPANDO] = {s: statics, u: updates};
    return update.apply(this, arguments);
  }

  // local variables
  var
    EXPANDO = '_hyperHTML',
    uid = EXPANDO + ((Math.random() * new Date) | 0),
    uidc = '<!--' + uid + '-->',
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
