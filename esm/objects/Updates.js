import majinbuu from 'https://unpkg.com/majinbuu@latest/esm/main.js';

import {
  CONNECTED, DISCONNECTED,
  COMMENT_NODE, DOCUMENT_FRAGMENT_NODE, ELEMENT_NODE, TEXT_NODE,
  OWNER_SVG_ELEMENT,
  SHOULD_USE_ATTRIBUTE,
  SHOULD_USE_TEXT_CONTENT,
  UID, UIDC
} from '../shared/constants.js';

import Aura from '../classes/Aura.js';
import Component from '../classes/Component.js';
import Dictionary from '../classes/Dictionary.js';
import Path from './Path.js';
import Transformer from './Transformer.js';
import {text} from '../shared/easy-dom.js';
import {isArray, trim, WeakSet} from '../shared/poorlyfills.js';
import {createFragment} from '../shared/utils.js';

const Promise = global.Promise;
const components = new WeakSet;
const slice = [].slice;

const create = (root, paths) => {
  const updates = [];
  const length = paths.length;
  for (let i = 0; i < length; i++) {
    const info = paths[i];
    const node = Path.find(root, info.path);
    switch (info.type) {
      case 'any':
        updates.push(setAnyContent(node, []));
        break;
      case 'attr':
        updates.push(setAttribute(node, info.name));
        break;
      case 'text':
        updates.push(setTextContent(node));
        break;
    }
  }
  return updates;
};

const find = (node, paths, parts) => {
  const childNodes = node.childNodes;
  const length = childNodes.length;
  for (let i = 0; i < length; i++) {
    let child = childNodes[i];
    switch (child.nodeType) {
      case ELEMENT_NODE:
        findAttributes(child, paths, parts);
        find(child, paths, parts);
        break;
      case COMMENT_NODE:
        if (child.textContent === UID) {
          parts.shift();
          paths.push(Path.create('any', child));
        }
        break;
      case TEXT_NODE:
        if (
          SHOULD_USE_TEXT_CONTENT.test(node.nodeName) &&
          trim.call(child.textContent) === UIDC
        ) {
          parts.shift();
          paths.push(Path.create('text', node));
        }
        break;
    }
  }
};

const findAttributes = (node, paths, parts) => {
  const cache = new Dictionary;
  const attributes = node.attributes;
  const array = slice.call(attributes);
  const length = array.length;
  for (let i = 0; i < length; i++) {
    const attribute = array[i];
    if (attribute.value === UID) {
      const name = attribute.name;
      if (!(name in cache)) {
        const realName = parts.shift().replace(/^(?:|[\S\s]*?\s)(\S+?)=['"]?$/, '$1');
        cache[name] = attributes[realName] ||
                      attributes[realName.toLowerCase()];
        paths.push(Path.create('attr', cache[name], realName));
      }
      node.removeAttributeNode(attribute);
    }
  }
};

const setAnyContent = (node, childNodes) => {
  const aura = new Aura(node, childNodes);
  let oldValue;
  const anyContent = value => {
    switch (typeof value) {
      case 'string':
      case 'number':
      case 'boolean':
        let length = childNodes.length;
        if (
          length === 1 &&
          childNodes[0].nodeType === TEXT_NODE
        ) {
          if (oldValue !== value) {
            oldValue = value;
            childNodes[0].textContent = value;
          }
        } else {
          oldValue = value;
          if (length) {
            aura.splice(0, length, text(node, value));
          } else {
            node.parentNode.insertBefore(
              (childNodes[0] = text(node, value)),
              node
            );
          }
        }
        break;
      case 'object':
      case 'undefined':
        if (value == null) {
          oldValue = value;
          anyContent('');
          break;
        } else if (value instanceof Component) {
          value = value.render();
        }
      default:
        oldValue = value;
        if (isArray(value)) {
          if (value.length === 0) {
            aura.splice(0);
          } else {
            switch (typeof value[0]) {
              case 'string':
              case 'number':
              case 'boolean':
                anyContent({html: value});
                break;
              case 'object':
                if (isArray(value[0])) {
                  value = value.concat.apply([], value);
                }
                if (isPromise_ish(value[0])) {
                  Promise.all(value).then(anyContent);
                  break;
                } else {
                  for (let i = 0, length = value.length; i < length; i++) {
                    if (value[i] instanceof Component) {
                      value[i] = value[i].render();
                    }
                  }
                }
              default:
                optimist(aura, value);
                break;
            }
          }
        } else if (isNode_ish(value)) {
          optimist(
            aura,
            value.nodeType === DOCUMENT_FRAGMENT_NODE ?
              slice.call(value.childNodes) :
              [value]
          );
        } else if (isPromise_ish(value)) {
          value.then(anyContent);
        } else if ('placeholder' in value) {
          invokeAtDistance(value, anyContent);
        } else if ('text' in value) {
          anyContent(String(value.text));
        } else if ('any' in value) {
          anyContent(value.any);
        } else if ('html' in value) {
          aura.splice(0);
          const fragment = createFragment(node, [].concat(value.html).join(''));
          childNodes.push.apply(childNodes, fragment.childNodes);
          node.parentNode.insertBefore(fragment, node);
        } else if ('length' in value) {
          anyContent(slice.call(value));
        } else {
          anyContent(Transformer.invoke(value, anyContent));
        }
        break;
    }
  };
  return anyContent;
};

const asHTML = html => ({html});

const isNode_ish = value => 'ELEMENT_NODE' in value;
const isPromise_ish = value => value != null && 'then' in value;

const invokeAtDistance = (value, callback) => {
  callback(value.placeholder);
  if ('text' in value) {
    Promise.resolve(value.text).then(String).then(callback);
  } else if ('any' in value) {
    Promise.resolve(value.any).then(callback);
  } else if ('html' in value) {
    Promise.resolve(value.html).then(asHTML).then(callback);
  } else {
    Promise.resolve(Transformer.invoke(value, callback)).then(callback);
  }
}

const isSpecialAttribute = (node, name) =>
                            !(OWNER_SVG_ELEMENT in node) && name in node;
const setAttribute = (attribute, name) => {
  const node = attribute.ownerElement;
  const isData = name === 'data';
  const isEvent = !isData && /^on/.test(name);
  const isSpecial = isData ||
                    (isSpecialAttribute(node, name) &&
                    !SHOULD_USE_ATTRIBUTE.test(name));
  let noOwner = isSpecial || isEvent;
  let oldValue, type;
  if (isEvent) {
    type = name.slice(2);
    if (type === CONNECTED || type === DISCONNECTED) {
      components.add(node);
    }
    else if (name.toLowerCase() in node) {
      type = type.toLowerCase();
    }
  }
  if (!noOwner) node.setAttributeNode(attribute);
  return isEvent ?
    newValue => {
      if (oldValue !== newValue) {
        if (oldValue) node.removeEventListener(type, oldValue, false);
        oldValue = newValue;
        if (newValue) node.addEventListener(type, newValue, false);
      }
    } :
    (isSpecial ?
      newValue => {
        if (oldValue !== newValue) {
          oldValue = newValue;
          if (node[name] !== newValue) {
            node[name] = newValue;
          }
        }
      } :
      newValue => {
        if (oldValue !== newValue) {
          oldValue = newValue;
          if (attribute.value !== newValue) {
            if (newValue == null) {
              if (!noOwner) {
                noOwner = true;
                node.removeAttributeNode(attribute);
              }
            } else {
              attribute.value = newValue;
              if (noOwner) {
                noOwner = false;
                node.setAttributeNode(attribute);
              }
            }
          }
        }
      });
};

const optimist = (aura, value) => {
  let length = aura.length;
  if (value.length !== length) {
    majinbuu(aura, value, Aura.MAX_LIST_SIZE);
  } else {
    for (let i = 0; i < length--; i++) {
      if (aura[length] !== value[length] || aura[i] !== value[i]) {
        majinbuu(aura, value, Aura.MAX_LIST_SIZE);
        return;
      }
    }
  }
}

const setTextContent = node => {
  let oldValue;
  return newValue => {
    if (oldValue !== newValue)
      node.textContent = (oldValue = newValue);
  };
};

export default {create, find};
