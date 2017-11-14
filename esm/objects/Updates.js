import majinbuu from 'https://unpkg.com/majinbuu@latest/esm/main.js';

import {
  CONNECTED, DISCONNECTED,
  COMMENT_NODE, DOCUMENT_FRAGMENT_NODE, ELEMENT_NODE, TEXT_NODE,
  OWNER_SVG_ELEMENT,
  IS_NON_DIMENSIONAL,
  SHOULD_USE_TEXT_CONTENT,
  UID, UIDC
} from '../shared/constants.js';

import Aura from '../classes/Aura.js';
import Component from '../classes/Component.js';
import Path from './Path.js';
import Transformer from './Transformer.js';
import {text} from '../shared/easy-dom.js';
import {Event, WeakSet, isArray, trim} from '../shared/poorlyfills.js';
import {createFragment, slice} from '../shared/utils.js';

const NUMBER = 'number';
const OBJECT = 'object';
const STRING = 'string';

const Promise = global.Promise;
const components = new WeakSet;

function Cache() {}
Cache.prototype = Object.create(null);

const asHTML = html => ({html});

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
        updates.push(setAttribute(node, info.name, info.node));
        break;
      case 'text':
        updates.push(setTextContent(node));
        break;
    }
  }
  return updates;
};

const dispatchAll = (nodes, type) => {
  const isConnected = type === CONNECTED;
  const length = nodes.length;
  for (let event, i = 0; i < length; i++) {
    let node = nodes[i];
    if (node.nodeType === ELEMENT_NODE) {
      event = dispatchTarget(node, isConnected, type, event);
    }
  }
};

const dispatchTarget = (node, isConnected, type, event) => {
  if (components.has(node)) {
    if (!event) event = new Event(type);
    node.dispatchEvent(event);
  }
  else {
    const children = node.children;
    const length = children.length;
    for (let i = 0; i < length; i++) {
      event = dispatchTarget(children[i], isConnected, type, event);
    }
  }
  return event;
}

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
  const cache = new Cache;
  const attributes = node.attributes;
  const array = slice.call(attributes);
  const remove = [];
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
      remove.push(attribute);
    }
  }
  const len = remove.length;
  for (let i = 0; i < remove.length; i++) {
    node.removeAttributeNode(remove[i]);
  }
};

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
};

const isNode_ish = value => 'ELEMENT_NODE' in value;
const isPromise_ish = value => value != null && 'then' in value;
const isSpecial = (node, name) => !(OWNER_SVG_ELEMENT in node) && name in node;

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
};

const setAnyContent = (node, childNodes) => {
  const aura = new Aura(node, childNodes);
  let oldValue;
  const anyContent = value => {
    switch (typeof value) {
      case STRING:
      case NUMBER:
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
      case OBJECT:
      case 'undefined':
        if (value == null) {
          oldValue = value;
          anyContent('');
          break;
        }
      default:
        oldValue = value;
        if (isArray(value)) {
          if (value.length === 0) {
            aura.splice(0);
          } else {
            switch (typeof value[0]) {
              case STRING:
              case NUMBER:
              case 'boolean':
                anyContent({html: value});
                break;
              case OBJECT:
                if (isArray(value[0])) {
                  value = value.concat.apply([], value);
                }
                if (isPromise_ish(value[0])) {
                  Promise.all(value).then(anyContent);
                  break;
                }
              default:
                optimist(aura, value);
                break;
            }
          }
        } else if (value instanceof Component) {
          optimist(aura, [value]);
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

const setAttribute = (node, name, original) => {
  const isStyle = name === 'style';
  const isData = !isStyle && name === 'data';
  let oldValue;
  if (!isStyle && !isData && /^on/.test(name)) {
    let type = name.slice(2);
    if (type === CONNECTED || type === DISCONNECTED) {
      components.add(node);
    }
    else if (name.toLowerCase() in node) {
      type = type.toLowerCase();
    }
    return newValue => {
      if (oldValue !== newValue) {
        if (oldValue) node.removeEventListener(type, oldValue, false);
        oldValue = newValue;
        if (newValue) node.addEventListener(type, newValue, false);
      }
    };
  } else if(isData || (!isStyle && isSpecial(node, name))) {
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
  } else if (isStyle) {
    let oldType;
    return newValue => {
      switch (typeof newValue) {
        case OBJECT:
          if (newValue) {
            const style = node.style;
            if (oldType === OBJECT) {
              for (const key in oldValue) {
                if (!(key in newValue)) {
                  style[key] = '';
                }
              }
            } else {
              style.cssText = '';
            }
            for (const key in newValue) {
              const value = newValue[key];
              style[key] =  typeof value === NUMBER &&
                            !IS_NON_DIMENSIONAL.test(key) ?
                              (value + 'px') : value;
            }
            oldType = OBJECT;
            oldValue = newValue;
            break;
          }
        default:
          if (oldValue != newValue) {
            oldType = STRING;
            oldValue = newValue;
            node.style.cssText = newValue || '';
          }
          break;
      }
    };
  } else {
    let noOwner = true;
    const attribute = original.cloneNode(true);
    return newValue => {
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
    };
  }
};

const setTextContent = node => {
  let oldValue;
  return newValue => {
    if (oldValue !== newValue)
      node.textContent = (oldValue = newValue);
  };
};

try {
  (new MutationObserver(records => {
    const length = records.length;
    for (let i = 0; i < length; i++) {
      let record = records[i];
      dispatchAll(record.removedNodes, DISCONNECTED);
      dispatchAll(record.addedNodes, CONNECTED);
    }
  })).observe(document, {subtree: true, childList: true});
} catch(o_O) {
  document.addEventListener('DOMNodeRemoved', event => {
    dispatchAll([event.target], DISCONNECTED);
  }, false);
  document.addEventListener('DOMNodeInserted', event => {
    dispatchAll([event.target], CONNECTED);
  }, false);
}

export default {create, find};
