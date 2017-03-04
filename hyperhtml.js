var hyperHTML = (function () {'use strict';

  /*! (C) 2017 Andrea Giammarchi @WebReflection (MIT) */

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
        actions.push(setAttribute(attribute));
      }
    }
  }

  function lukeTreeWalker(node, actions) {
    for (var
      child,
      childNodes = node.childNodes,
      i = 0,
      length = childNodes.length;
      i < length; i++
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

  function update(values) {
    var html = [values[0]];
    for (var
      any,
      html = [values[0]],
      updates = this[EXPANDO],
      i = 1,
      length = values.length;
      i < length; i++
    ) {
      any = arguments[i];
      updates[i - 1](any);
      html.push(any, values[i]);
    }
    return html.join('');
  }

  function upgrade(values) {
    for (var
      self = this,
      html = [values[0]],
      i = 1,
      length = values.length;
      i < length; i++
    ) {
      html.push(uid, values[i]);
    }
    self.innerHTML = html.join('');
    lukeTreeWalker(self, (self[EXPANDO] = []));
    return update.apply(this, arguments);
  }

  function setAttribute(attribute) {
    return function (value) {
      attribute.value = value;
    };
  }

  function setAnyContent(node) {
    return function (value) {
      switch (typeof value) {
        // all primitives are considered html
        case 'string':
        case 'number':
        case 'boolean':
          node.innerHTML = value;
          break;
        default:
          if (node.firstChild !== value) {
            if (node.childNodes.length === 1) {
              node.replaceChild(value, node.firstChild);
            } else {
              node.textContent = '';
              node.appendChild(value);
            }
          }
          break;
      }
    };
  }

  function setTextContent(node) {
    return function (value) {
      node.textContent = value;
    };
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

  var
    EXPANDO = '_hyperHTML',
    uid = EXPANDO + ((Math.random() * new Date) | 0)
  ;

  return function hyperHTML() {
    return EXPANDO in this ?
      update.apply(this, arguments) :
      upgrade.apply(this, arguments);
  }

}());

try { module.exports = hyperHTML; } catch(o_O) {}
