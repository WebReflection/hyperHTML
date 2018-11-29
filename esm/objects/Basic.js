import CustomEvent from '@ungap/custom-event';
import WeakSet from '@ungap/essential-weakset';
import disconnected from 'disconnected';
import domdiff from 'domdiff';
import domtagger from 'domtagger';
import hyperStyle from 'hyperhtml-style';

const CONNECTED = 'connected';
const DISCONNECTED = 'dis' + CONNECTED;

const slice = [].slice;
const observe = disconnected({Event: CustomEvent, WeakSet});

export {Tagger, observe};

// list of attributes that should not be directly assigned
const readOnly = /^(?:form|list)$/i;

function Tagger(type) {
  this.type = type;
  return domtagger(this);
}

Tagger.prototype = {

  attribute(node, name, original) {
    const isSVG = 'ownerSVGElement' in node;
    let oldValue;
    if (name === 'style')
      return hyperStyle(node);
    else if ('on' === name.slice(0, 2)) {
      let type = name.slice(2);
      if (type === CONNECTED || type === DISCONNECTED)
        observe(node);
      else if (name.toLowerCase()
        in node)
        type = type.toLowerCase();
      return newValue => {
        if (oldValue !== newValue) {
          if (oldValue)
            node.removeEventListener(type, oldValue, false);
          oldValue = newValue;
          if (newValue)
            node.addEventListener(type, newValue, false);
        }
      };
    }
    else if (
      name === 'data' ||
      (!isSVG && name in node && !readOnly.test(name))
    ) {
      return newValue => {
        if (oldValue !== newValue) {
          oldValue = newValue;
          if (node[name] !== newValue) {
            node[name] = newValue;
            if (newValue == null) {
              node.removeAttribute(name);
            }
          }
        }
      };
    }
    else {
      let owner = false;
      const attribute = original.cloneNode(true);
      return newValue => {
        if (oldValue !== newValue) {
          oldValue = newValue;
          if (attribute.value !== newValue) {
            if (newValue == null) {
              if (owner) {
                owner = false;
                node.removeAttributeNode(attribute);
              }
              attribute.value = newValue;
            } else {
              attribute.value = newValue;
              if (!owner) {
                owner = true;
                node.setAttributeNode(attribute);
              }
            }
          }
        }
      };
    }
  },

  any(node, childNodes) {
    const diffOptions = {before: node};
    let fastPath = false;
    let oldValue;
    const anyContent = value => {
      switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
          if (fastPath) {
            if (oldValue !== value) {
              oldValue = value;
              childNodes[0].textContent = value;
            }
          } else {
            fastPath = true;
            oldValue = value;
            childNodes = domdiff(
              node.parentNode,
              childNodes,
              [node.ownerDocument.createTextNode(value)],
              diffOptions
            );
          }
          break;
        case 'function':
          anyContent(value(node));
          break;
        case 'object':
        case 'undefined':
          if (value == null) {
            fastPath = false;
            childNodes = domdiff(
              node.parentNode,
              childNodes,
              [],
              diffOptions
            );
            break;
          }
        default:
          fastPath = false;
          oldValue = value;
          if ('ELEMENT_NODE' in value) {
            childNodes = domdiff(
              node.parentNode,
              childNodes,
              value.nodeType === 11 ?
                slice.call(value.childNodes) :
                [value],
              diffOptions
            );
          }
          break;
      }
    };
    return anyContent;
  },

  text(node) {
    let oldValue;
    return value => {
      if (oldValue !== value) {
        oldValue = value;
        node.textContent = value == null ? '' : value;
      }
    };
  }
};
