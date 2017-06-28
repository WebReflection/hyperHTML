var hyperHTML = (function (globalDocument) {'use strict';

  /*! (c) 2017 Andrea Giammarchi @WebReflection, (MIT) */

  // ---------------------------------------------
  // hyperHTML Public API
  // ---------------------------------------------

  // The document must be swap-able at runtime.
  // Needed by both basicHTML and nativeHTML
  hyperHTML.document = globalDocument;

  // hyperHTML.bind(el) ⚡️
  function hyperHTML(template) {
    var hyper = hypers.get(this);
    if (
      !hyper ||
      hyper.template !== (FF ? unique(template) : template)
    ) {
      hyper = upgrade.apply(this, arguments);
      hypers.set(this, hyper);
    }
    update.apply(hyper.updates, arguments);
    return this;
  }

  // hyperHTML.adopt(el) 🐣
  hyperHTML.adopt = function adopt(node) {
    return function () {
      notAdopting = false;
      hyperHTML.apply(node, arguments);
      notAdopting = true;
      return node;
    };
  };

  // hyperHTML.wire(obj, 'type:ID') ➰
  hyperHTML.wire = function wire(obj, type) {
    return arguments.length < 1 ?
      wireContent('html') :
      (obj == null ?
        wireContent(type || 'html') :
        wireWeakly(obj, type || 'html')
      );
  };

  // - - - - - - - - - - - - - - - - - - - - - - -

  // ---------------------------------------------
  // Constants
  // ---------------------------------------------

  // Node.CONSTANTS
  // without assuming Node is globally available
  // since this project is used on the backend too
  var ELEMENT_NODE = 1;
  var ATTRIBUTE_NODE = 2;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  var DOCUMENT_FRAGMENT_NODE = 11;

  // SVG related
  var OWNER_SVG_ELEMENT = 'ownerSVGElement';
  var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

  var SHOULD_USE_ATTRIBUTE = /^style$/i;
  var EXPANDO = '_hyper_html: ';
  var UID = EXPANDO + ((Math.random() * new Date) | 0) + ';';
  var UIDC = '<!--' + UID + '-->';

  // ---------------------------------------------
  // DOM Manipulation
  // ---------------------------------------------

  // return -1 if no differences are found
  // the index where differences starts otherwise
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

  // accordingly with the content type
  // it replace the content of a node
  // with the give child
  function populateNode(parent, child) {
    switch (child.nodeType) {
      case ELEMENT_NODE:
        var childNodes = parent.childNodes;
        if (childNodes[0] === child) {
          removeNodeList(childNodes, 1);
          break;
        }
        resetAndPopulate(parent, child);
        break;
      case DOCUMENT_FRAGMENT_NODE:
        if (indexOfDifferences(parent.childNodes, child.childNodes) !== -1) {
          resetAndPopulate(parent, child);
        }
        break;
      case TEXT_NODE:
        parent.textContent = child.textContent;
        break;
    }
  }

  // remove a list of nodes from startIndex to list.length
  function removeNodeList(list, startIndex) {
    var length = list.length, child;
    while (startIndex < length--) {
      child = list[length];
      child.parentNode.removeChild(child);
    }
  }

  // erase a node content and populate it
  function resetAndPopulate(parent, child) {
    parent.textContent = '';
    parent.appendChild(child);
  }

  // append childNodes to a node from a specific index
  function updateViaArray(node, childNodes, i) {
    var fragment = emptyFragment(node);
    if (i !== 0) {
      removeNodeList(node.childNodes, i);
      appendNodes(fragment, childNodes.slice(i));
      node.appendChild(fragment);
    } else {
      appendNodes(fragment, childNodes);
      resetAndPopulate(node, fragment);
    }
  }

  // ---------------------------------------------
  // hyperHTML Operations
  // ---------------------------------------------

  // `<div>${'any'}</div>`
  function setAnyContent(node) {
    return function any(value) {
      switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
          node.innerHTML = value;
          break;
        case 'function':
          any(value(node, node.children, 0));
          break;
        default:
          if (isArray(value)) {
            var i, length = value.length;
            if (length === 1) {
              any(value[0]);
            } else {
              switch (length === 0 ? '' : typeof value[0]) {
                case 'string':
                  any(value.join(''));
                  break;
                case 'function':
                  var children = slice.call(node.children);
                  for (i = 0, length = value.length; i < length; i++) {
                    value[i] = value[i](node, children, i);
                  }
                  removeNodeList(children, i);
                  any(value.concat.apply([], value));
                  break;
                default:
                  i = indexOfDifferences(node.childNodes, value);
                  if (i !== -1) updateViaArray(node, value, i);
                  break;
              }
            }
          } else if ('then' in value) {
            value.then(any);
          } else {
            populateNode(node, value);
          }
          break;
      }
    };
  }

  // `<div class="${'attr'}"></div>`
  function setAttribute(attribute, removeAttributes) {
    var
      name = attribute.name,
      node = attribute.ownerElement,
      isEvent = name.slice(0, 2) === 'on',
      isSpecial = name in node && !(
                    // always use set attribute with SVGs
                    OWNER_SVG_ELEMENT in node ||
                    SHOULD_USE_ATTRIBUTE.test(name)
                  ),
      oldValue
    ;
    if (isSpecial) removeAttributes.push(node, name);
    return isSpecial ?
      function specialAttr(newValue) {
        if (oldValue !== newValue) {
          if (isEvent && oldValue && ('handleEvent' in oldValue)) {
            handleEvent(node, 'remove', name, oldValue);
          }
          oldValue = newValue;
          if (isEvent && newValue && ('handleEvent' in newValue)) {
            handleEvent(node, 'add', name, newValue);
          } else {
            node[name] = newValue;
          }
        }
      } :
      function attr(newValue) {
        if (oldValue !== newValue) {
          oldValue = newValue;
          attribute.value = newValue;
        }
      };
  }

  // `<div> ${'text'} </div>`
  function setTextContent(node) {
    var oldValue;
    return function text(newValue) {
      if (oldValue !== newValue) {
        oldValue = newValue;
        node.textContent = newValue;
      }
    };
  }

  // `<li>a</li>${'virtual'}<li>c</li>`
  function setVirtualContent(node, childNodes) {
    return function anyVirtual(value) {
      switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
          removeNodeList(childNodes, 0);
          var fragment = createFragment(node, value);
          childNodes = slice.call(fragment.childNodes);
          node.parentNode.insertBefore(fragment, node);
          break;
        case 'function':
          anyVirtual(value(node.parentNode, childNodes, 0));
          break;
        default:
          if (isArray(value)) {
            var i, length = value.length;
            if (length === 0) {
              removeNodeList(childNodes, 0);
              childNodes = [];
            } else {
              switch (typeof value[0]) {
                case 'string':
                  anyVirtual(value.join(''));
                  break;
                case 'function':
                  var parentNode = node.parentNode;
                  for (i = 0, length = value.length; i < length; i++) {
                    value[i] = value[i](parentNode, childNodes, i);
                  }
                  anyVirtual(value.concat.apply([], value));
                  break;
                default:
                  i = indexOfDifferences(childNodes, value);
                  if (i !== -1) {
                    var fragment = emptyFragment(node);
                    removeNodeList(childNodes, i);
                    value = value.slice(i);
                    appendNodes(fragment, value);
                    node.parentNode.insertBefore(fragment, node);
                    childNodes = childNodes.slice(0, i).concat(value);
                  }
                  break;
              }
            }
          } else if ('then' in value) {
            value.then(anyVirtual);
          } else {
            removeNodeList(childNodes, 0);
            childNodes = value.nodeType === DOCUMENT_FRAGMENT_NODE ?
              slice.call(value.childNodes) :
              [value];
            node.parentNode.insertBefore(value, node);
          }
          break;
      }
    };
  }

  // ---------------------------------------------
  // DOM Traversing
  // ---------------------------------------------

  // look for attributes that contains the comment text
  function attributesSeeker(node, paths) {
    for (var
      attribute,
      value = IE ? UID : UIDC,
      attributes = node.attributes,
      i = 0, length = attributes.length;
      i < length; i++
    ) {
      attribute = attributes[i];
      if (attribute.value === value) {
        paths.push(
          Path(
            'attr',
            // with IE the order doesn't really matter
            // as long as the right attribute is addressed
            IE ?
              node.attributes[IEAttributes.shift()] :
              attribute
          )
        );
      }
    }
  }

  // walk the fragment tree in search of comments
  function commentsSeeker(node, paths) {
    for (var
      child, text,
      childNodes = node.childNodes,
      length = childNodes.length,
      i = 0; i < length; i++
    ) {
      child = childNodes[i];
      switch (child.nodeType) {
        case ELEMENT_NODE:
          attributesSeeker(child, paths);
          commentsSeeker(child, paths);
          break;
        case COMMENT_NODE:
          if (child.textContent === UID) {
            if (length === 1) {
              paths.push(Path('any', node));
            } else if (
              (i < 1 || childNodes[i - 1].nodeType === ELEMENT_NODE) &&
              (i + 1 === length || childNodes[i + 1].nodeType === ELEMENT_NODE)
            ) {
              paths.push(Path('virtual', child));
            } else {
              text = createText(child, '');
              child.parentNode.replaceChild(text, child);
              paths.push(Path('text', text));
            }
          }
          break;
        case TEXT_NODE:
          if (SHOULD_USE_ATTRIBUTE.test(node.nodeName) && child.textContent === UIDC) {
            paths.push(Path('text', node));
          }
          break;
      }
    }
  }

  // ---------------------------------------------
  // Features detection / ugly UA sniffs
  // ---------------------------------------------

  // Firefox < 55 has non standard template literals.
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1108941
  // TODO: is there any better way to feature detect this ?
  var FF = typeof navigator === 'object' &&
            /Firefox\/(\d+)/.test(navigator.userAgent) &&
            parseFloat(RegExp.$1) < 55;

  // If attributes order is shuffled, threat the browser differently
  // Usually this is a well known IE only limitation but some older FF does the same.
  var IE =  (function () {
              var p  = globalDocument.createElement('p');
              p.innerHTML = '<i data-i="" class=""></i>';
              return /class/i.test(p.firstChild.attributes[0].name);
            }());

  // ---------------------------------------------
  // Helpers
  // ---------------------------------------------

  // used to convert childNodes to Array
  var slice = [].slice;

  // return a single node or an Array or nodes
  function createContent(node) {
    for (var
      child,
      content = [],
      childNodes = node.childNodes,
      i = 0,
      length = childNodes.length;
      i < length; i++
    ) {
      child = childNodes[i];
      if (
        child.nodeType === ELEMENT_NODE ||
        trim.call(child.textContent).length !== 0
      ) {
        content.push(child);
      }
    }
    return content.length === 1 ? content[0] : content;
  }

  // given a node, inject some html and return
  // the resulting template document fragment
  function createFragment(node, html) {
    return (
      OWNER_SVG_ELEMENT in node ?
        createSVGFragment :
        createHTMLFragment
    )(node, html);
  }

  // create fragment for HTML
  function createHTMLFragment(node, html) {
    var fragment;
    var document = node.ownerDocument;
    var container = document.createElement('template');
    var hasContent = 'content' in container;
    var needsTableWrap = false;
    if (!hasContent) {
      // DO NOT MOVE THE FOLLOWING LINE ELSEWHERE
      fragment = document.createDocumentFragment();
      // (a jsdom + nodejs tests coverage gotcha)

      // el.innerHTML = '<td></td>'; is not possible
      // if the content is a partial internal table content
      // it needs to be wrapped around once injected.
      // HTMLTemplateElement does not suffer this issue.
      needsTableWrap = /^[^\S]*?<(t(?:head|body|foot|r|d|h))/i.test(html);
    }
    if (needsTableWrap) {
      // secure the RegExp.$1 result ASAP to avoid issues
      // in case a non-browser DOM library uses RegExp internally
      // when HTML content is injected (basicHTML / jsdom / others...)
      var selector = RegExp.$1;
      container.innerHTML = '<table>' + html + '</table>';
      appendNodes(fragment, slice.call(container.querySelectorAll(selector)));
    } else {
      container.innerHTML = html;
      if (hasContent) {
        fragment = container.content;
      } else {
        appendNodes(fragment, slice.call(container.childNodes));
      }
    }
    return fragment;
  }

  // create a fragment for SVG
  function createSVGFragment(node, html) {
    var document = node.ownerDocument;
    var fragment = document.createDocumentFragment();
    var container = document.createElementNS(SVG_NAMESPACE, 'svg');
    container.innerHTML = html;
    appendNodes(fragment, slice.call(container.childNodes));
    return fragment;
  }

  // given a node, it does what is says
  function createText(node, text) {
    return node.ownerDocument.createTextNode(text);
  }

  // given an info, tries to find out the best option
  // to replace or update the content
  function discoverNode(parentNode, virtual, info, childNodes) {
    for (var
      target = parentNode,
      document = parentNode.ownerDocument,
      path = info.path,
      virtualNode = getNode(virtual, path),
      i = 0,
      length = path.length;
      i < length; i++
    ) {
      switch (path[i++]) {
        case 'attributes':
          var name = virtualNode.name;
          if (!parentNode.hasAttribute(name)) {
            parentNode.setAttribute(name, '');
          }
          target = parentNode.attributes[name];
          break;
        case 'childNodes':
          switch (info.type) {
            // TODO: supports multiple text per element ?
            case 'text':
              var before = getTextContent(virtualNode, 'previous');
              var after = getTextContent(virtualNode, 'next');
              do {
                target = parentNode.firstChild;
                if (target && target.nodeType === TEXT_NODE) {
                  parentNode.removeChild(target);
                } else {
                  break;
                }
              } while (target);
              var fragment = document.createDocumentFragment();
              if (before.length) {
                fragment.appendChild(createText(parentNode, before));
              }
              target = fragment.appendChild(createText(parentNode, ''));
              if (after.length) {
                fragment.appendChild(createText(parentNode, after));
              }
              parentNode.insertBefore(fragment, parentNode.firstChild);
              break;
            // TODO: supports multiple virtual content per element ?
            case 'virtual':
              var children = getChildren(parentNode);
              var virtualChildren = getChildren(virtualNode.parentNode);
              target = virtualNode.previousElementSibling;
              var before = target ? (path.indexOf.call(virtualChildren, target) + 1) : -1;
              target = virtualNode.nextElementSibling;
              var after = target ? path.indexOf.call(virtualChildren, target) : -1;
              target = document.createComment(UID);
              switch (true) {
                // `${'virtual'}` is actually resolved as `${'any'}`
                // case before < 0 && after < 0: before = 0;

                // `</a>${'virtual'}`
                case after < 0:
                  after = children.length;
                  break;
                // `${'virtual'}<b>`
                case before < 0:
                  before = 0;
                // `</a>${'virtual'}<b>`
                default:
                  after = -(virtualChildren.length - after);
                  break;
              }
              childNodes.push.apply(
                childNodes,
                slice.call(children, before, after)
              );
              parentNode.insertBefore(
                target,
                childNodes.length ?
                  childNodes[childNodes.length - 1].nextElementSibling :
                  slice.call(children, after)[0]
              );
              if (childNodes.length === 0) {
                removePreviousText(parentNode, target);
              }
              break;
          }
          break;
        default:
          // if the node is not there, create it
          target = getChildren(parentNode)[path[i]] ||
                    parentNode.appendChild(
                      parentNode.ownerDocument.createElement(
                        getNode(virtual, path.slice(0, i + 1)).nodeName
                      )
                    );
          parentNode = target;
          break;
      }
    }
    return target;
  }

  // create an empty fragment from a generic node
  function emptyFragment(node) {
    return node.ownerDocument.createDocumentFragment();
  }

  // given a node, returns text content before it or after it
  function getTextContent(node, direction) {
    var content = [];
    var method = direction === 'next' ?
        content.push : content.unshift;
    do {
      node = node[direction + 'Sibling'];
      if (node && node.nodeType === TEXT_NODE) {
        method.call(content, node.textContent);
      } else {
        return content.join('');
      }
    } while (true);
  }

  // add or remove event listeners from a node
  function handleEvent(node, action, ontype, eventListener) {
    node[action + 'EventListener'](ontype.slice(2), eventListener);
  }

  // remove a list of [node, attribute]
  function removeAttributeList(list) {
    for (var i = 0, length = list.length; i < length; i++) {
      list[i++].removeAttribute(list[i]);
    }
  }

  // remove all text nodes from a virtual space
  function removePreviousText(parentNode, node) {
    var previousSibling = node.previousSibling;
    if (previousSibling && previousSibling.nodeType === TEXT_NODE) {
      parentNode.removeChild(previousSibling);
      removePreviousText(parentNode, node);
    }
  }

  // specify the content to update
  function setContent(type, target, removeAttributes, childNodes) {
    var update;
    switch (type) {
      case 'any':
        update = setAnyContent(target);
        break;
      case 'attr':
        update = setAttribute(target, removeAttributes);
        break;
      case 'text':
        update = setTextContent(target);
        break;
      case 'virtual':
        update = setVirtualContent(target, childNodes);
        break;
    }
    return update;
  }

  // used for common path creation.
  function Path(type, node) {
    return {type: type, path: createPath(node)};
  }

  // ---------------------------------------------
  // Hybrid Shims
  // ---------------------------------------------

  // WeakMap with partial EXPANDO fallback
  var $WeakMap = typeof WeakMap === typeof $WeakMap ?
      function () {
        return {
          get: function (obj) { return obj[EXPANDO]; },
          set: function (obj, value) {
            Object.defineProperty(obj, EXPANDO, {
              configurable: true,
              value: value
            });
          }
        };
      } :
      WeakMap;

  // Map with partial double Array fallback
  var $Map = typeof Map === typeof $Map ?
      function () {
        var k = [], v = [];
        return {
          get: function (obj) {
            return v[k.indexOf(obj)];
          },
          // being used with unique template literals
          // there is never a case when a value is overwritten
          // no need to check upfront for the indexOf
          set: function (obj, value) {
            v[k.push(obj) - 1] = value;
          }
        };
      } :
      Map;

  // TODO: which browser needs these partial polyfills here?
  var isArray = Array.isArray ||
                (function () {
                  var toString = {}.toString;
                  // I once had an engine returning [array Array]
                  // and I've got scared since!
                  var s = toString.call([]);
                  return function (a) {
                    return toString.call(a) === s;
                  };
                }());
  
  var trim = EXPANDO.trim ||
              function () { return this.replace(/^\s+|\s+$/g, ''); };

  // ---------------------------------------------
  // Shared variables
  // ---------------------------------------------

  // normalize Firefox issue with template literals
  var templateObjects, unique;
  if (FF) {
    templateObjects = Object.create(null);
    unique = function (template) {
      var key = template.join(UID);
      return templateObjects[key] ||
            (templateObjects[key] = template);
    };
  }

  // use native .append(...childNodes) where available
  var appendNodes = 'append' in globalDocument ?
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
      };

  // returns children or retrieve them in IE/Edge
  var getChildren = 'children' in globalDocument ?
      function (node) { return node.children; } :
      function (node) {
        for (var
          child,
          children = [],
          childNodes = node.childNodes,
          j = 0, i = 0, length = childNodes.length;
          i < length; i++
        ) {
          child = childNodes[i];
          if (child.nodeType === ELEMENT_NODE)
            children[j++] = child;
        }
        return children;
      };

  // return the correct node walking through a path
  // fixes IE/Edge issues with attributes and children
  var getNode = IE ?
      function (parentNode, path) {
        for (var name, i = 0, length = path.length; i < length; i++) {
          name = path[i++];
          switch (name) {
            case 'children':
              parentNode = getChildren(parentNode)[path[i]];
              break;
            default:
              parentNode = parentNode[name][path[i]];
              break;
          }
        }
        return parentNode;
      } :
      function (parentNode, path) {
        for (var i = 0, length = path.length; i < length; i++) {
          parentNode = parentNode[path[i++]][path[i]];
        }
        return parentNode;
      };

  // fixes IE problems with comments
  if (IE) {
    var IEAttributes;
    var no = new RegExp('([^\\S][a-z]+[a-z0-9_-]*=)([\'"])' + UIDC + '\\2', 'g');
    var comments = function ($0, $1, $2) {
          IEAttributes.push($1.slice(1, -1));
          return $1 + $2 + UID + $2;
        };
  }

  // [element] = {template, updates};
  var hypers = new $WeakMap;

  // [element] = {template, updates};
  var wires = new $WeakMap;

  // [template] = {fragment, paths};
  var templates = new $Map;

  // internal signal to switch adoption
  var notAdopting = true;

  // ---------------------------------------------
  // Template related utilities
  // ---------------------------------------------

  // given a unique template object
  // create, parse, and store retrieved info
  function createTemplate(template) {
    var paths = [];
    var html = template.join(UIDC);
    if (IE) {
      IEAttributes = [];
      html = html.replace(no, comments);
    }
    var fragment = createFragment(this, html);
    var info = {fragment: fragment, paths: paths};
    commentsSeeker(fragment, paths);
    templates.set(template, info);
    return info;
  }

  // given a generic node, returns a path capable
  // of retrieving such path back again.
  // TODO: worth passing the index when available ?
  function createPath(node) {
    var path = [];
    var parentNode;
    switch(node.nodeType) {
      case ELEMENT_NODE:
      case DOCUMENT_FRAGMENT_NODE:
        parentNode = node;
        break;
      case TEXT_NODE:
      case COMMENT_NODE:
        parentNode = node.parentNode;
        path.unshift(
          'childNodes',
          path.indexOf.call(parentNode.childNodes, node)
        );
        break;
      case ATTRIBUTE_NODE:
      default: // jsdom here does not provide a nodeType 2 ...
        parentNode = node.ownerElement;
        path.unshift('attributes', node.name);
        break;
    }
    for (
      node = parentNode;
      parentNode = parentNode.parentNode;
      node = parentNode
    ) {
      path.unshift('children', path.indexOf.call(getChildren(parentNode), node));
    }
    return path;
  }

  // given a root node and a list of paths
  // creates an array of updates to invoke
  // whenever the next interpolation happens
  function createUpdates(fragment, paths) {
    for (var
      info, target,
      updates = [],
      removeAttributes = [],
      i = 0, length = paths.length;
      i < length; i++
    ) {
      info = paths[i];
      target = getNode(fragment, info.path);
      if (target.nodeType === DOCUMENT_FRAGMENT_NODE) {
        removeNodeList(target.childNodes, 0);
        target = this;
      }
      updates[i] = setContent(info.type, target, removeAttributes, []);
    }
    removeAttributeList(removeAttributes);
    return updates;
  }

  // like createUpdates but for nodes with already a content
  function discoverUpdates(fragment, paths) {
    for (var
      info, childNodes,
      updates = [],
      removeAttributes = [],
      i = 0, length = paths.length;
      i < length; i++
    ) {
      childNodes = [];
      info = paths[i];
      updates[i] = setContent(
        info.type,
        discoverNode(this, fragment, info, childNodes),
        removeAttributes,
        childNodes
      );
    }
    removeAttributeList(removeAttributes);
    return updates;
  }

  // invokes each update function passing interpolated value
  function update() {
    for (var i = 1, length = arguments.length; i < length; i++) {
      this[i - 1](arguments[i]);
    }
  }

  // create a template, if unknown
  // upgrade a node to use such template for future updates
  function upgrade(template) {
    if (FF) template = unique(template);
    var updates;
    var info =  templates.get(template) ||
                createTemplate.call(this, template);
    if (notAdopting) {
      var fragment = info.fragment.cloneNode(true);
      updates = createUpdates.call(this, fragment, info.paths);
      resetAndPopulate(this, fragment);
    } else {
      updates = discoverUpdates.call(this, info.fragment, info.paths);
    }
    return {template: template, updates: updates};
  }

  // ---------------------------------------------
  // Wires
  // ---------------------------------------------

  // create a new wire for generic DOM content
  function wireContent(type) {
    var adopter, content, container, fragment, render, setup, template;

    function before(document) {
      fragment = document.createDocumentFragment();
      container = type === 'svg' ?
        document.createElementNS(SVG_NAMESPACE, 'svg') :
        fragment;
      render = hyperHTML.bind(container);
    }

    function after() {
      if (setup) {
        setup = false;
        if (type === 'svg') {
          appendNodes(fragment, slice.call(container.childNodes));
        }
        content = createContent(fragment);
      }
      return content;
    }

    return type === 'adopt' ?
      function adopt(statics) {
        var args = arguments;
        if (FF) statics = unique(statics);
        if (template !== statics) {
          setup = true;
          template = statics;
          adopter = function (parentNode, children, i) {
            if (setup) {
              if (i < children.length) {
                container = children[i];
                fragment = {
                  ownerDocument: container.ownerDocument,
                  childNodes: [container],
                  children: [container]
                };
                render = hyperHTML.adopt(fragment);
              } else {
                if (OWNER_SVG_ELEMENT in parentNode) type = 'svg';
                before(parentNode.ownerDocument);
              }
            }
            render.apply(null, args);
            return after();
          };
        }
        return adopter;
      } :
      function update(statics) {
        if (FF) statics = unique(statics);
        if (template !== statics) {
          setup = true;
          template = statics;
          before(hyperHTML.document);
        }
        render.apply(null, arguments);
        return after();
      };
  }

  // setup a weak reference if needed and return a wire by ID
  function wireWeakly(obj, type) {
    var wire = wires.get(obj);
    var i = type.indexOf(':');
    var id = type;
    if (-1 < i) {
      id = type.slice(i + 1);
      type = type.slice(0, i) || 'html';
    }
    if (!wire) {
      wire = {};
      wires.set(obj, wire);
    }
    return wire[id] || (wire[id] = wireContent(type));
  }

  // ---------------------------------------------
  // ⚡️ ️️The End ➰
  // ---------------------------------------------
  return hyperHTML;

}(document));

// umd.KISS
try { module.exports = hyperHTML; } catch(o_O) {}
