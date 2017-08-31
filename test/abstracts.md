# Abstract

The following content represents ideal steps
performed by hyperHTML to grant performance,
recycle everything it can, and update layouts.

It's rather a specification than current implementation,
but the goal is to optimize such specification as much as possible
and achieve best performance on top of that.



### Definitions

`hyperHTML` is a function tag for template literals.

Its unique `templateObject` argument is generated once
implicitly invoked as template literal function-tag.
http://www.ecma-international.org/ecma-262/6.0/#sec-gettemplateobject

Its `context` MUST be a DOM Element.

`hyperHTML.bind(context)` creates a new function-tag for such `context`.

```js
const render = hyperHTML.bind(context);
render`
   <!-- this represents the contents of the DOM node -->
`;
```

A list of `paths` is an array of instructions used to address a specific target node.
Each instruction also includes the kind of update operation to be performed on the target node.

```js
// paths example
[
  {type: 'attr', path: ['children', 1, 'attributes', 2]},
  {type: 'text', path: ['children', 1, 'childNodes', 0]},
  {type: 'any', path: ['children', 5]},
  {type: 'virtual', path: ['children', 1, 'children', 3, 'childNodes', 2]}
]
```

Retrieving a node through a path can be done by reducing its values.

Updates are similarly defined through the following procedure.

```js
paths.forEach((info, i) => {
  const target = info.path.reduce(
    (node, accessor) => node[accessor],
    fragment
  );
  switch (info.type) {
    case 'attr': updates[i] = setAttribute(target); break;
    case 'any': updates[i] = setAnyContent(target); break;
    case 'text': updates[i] = setText(target); break;
    case 'virtual': updates[i] = setVirtualContent(target); break;
  }
});
```

The list of `updates` is an array containing functions in charge of updating each path through interpolations.
```js
// updates through interpolated values
interpolations.forEach((value, i) => updates[i](value));
```


### hyperHTML operations 
```
hyperHTML(templateObject, ...interpolations)
│
└▶  is current `context` known ?
    │
    ├▶  YES
    │
    │   is current `context` representing `templateObject` ?
    │   │
    │   ├▶  YES ┌───────────────────────────────────────────────┐
    │   │       ▼                                               │
    │   │   invoke `updates` through `interpolations`           │
    │   │                                                       │
    │   │   return the current `context`                        │
    │   │                                                       │
    └───┴▶  NO                                                  │
                                                                │
            is `templateObject` known ?                         │
            │                                                   │
        ┌───┼▶  YES                                             │
        │   │                                                   │
        │   │   clone deeply the `templateObject` `fragment`    │
        │   │                                                   │
        │   │   replace `context` content with the `fragment`   │
        │   │                                                   │
        │   │   retrieve via `paths` the nodes to update        │
        │   │                                                   │
        │   │   create a list of `updates`                      │
        │   │                                                   │
        │   │   relate `templateObject` to current `context`    │
        │   │                                                   │
        │   │   relate `updates` to current `context` ──────────┘
        │   │
        │   └▶  NO
        │
        │       create a `fragment` through `templateObject`
        │
        │       create a list of `paths` to find out nodes
        │
        │       relate `fragment` to current `templateObject`
        │
        │       relate `paths` to current `templateObject`  ──┐
        │                                                     │
        └─────────────────────────────────────────────────────┘
```

### Weakly referenced

```
context
  ├▶  templateObject
  └▶  updates

any
  └▶  wires
```

### Strongly referenced

Template literals are _forever_, there's no reason to create extra GC pressure.

```
templateObject
  ├▶  fragment
  └▶  paths
```
