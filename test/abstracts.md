# Abstract

The following content represents ideal steps
performed by hyperHTML to grant performance,
recycle everything it can, and update layouts.

It's rather a specification than current implementation,
but the goal is to optimize such specification as much as possible
and achieve best performance on top of that.



### Definitions

`hyperHTML` is a function tag for template literals.

Its `statics` argument is a unique templateObject
http://www.ecma-international.org/ecma-262/6.0/#sec-gettemplateobject

Its `context` MUST be a DOM Element.

`hyperHTML.bind(context)` creates a new tag for such `context`.

A list of `paths` is an array of instructions used to address a specific target node.
Each instruction also carry the kind of update operation the target needs.

```js
// paths example
[
  {type: 'text', path: ['children', 1, 'childNodes', 0]},
  {type: 'any', path: ['children', 5]},
  {type: 'virtual', path: ['children', 1, 'children', 3, 'childNodes', 2]}
]
```

A list of `updates` is an aray containing functions in charge of updating each path through interpolations.
```js
// updates through interpolated values
interpolations.forEach((value, i) => updates[i](value));
```


### Algorithm 
```
hyperHTML(statics, ...interpolations)
│
└▶  is `statics` known?
    │
    ├▶  YES
    │
    │   is current `context` representing `statics` ?
    │   │
    │   ├▶  YES
    │   │
    │   │   update through `interpolations`
    │   │
    │   └▶  NO  ┌─────────────────────────────────────────┐
    │           ▼                                         │
    │       clone the `fragment` related to `statics`     │
    │                                                     │
    │       retrieve the list of `paths` to update        │
    │                                                     │
    │       create a list of `updates`                    │
    │                                                     │
    │       relate `updates` to current `context`         │
    │                                                     │
    │       update `fragment` through `interpolations`    │
    │                                                     │
    │       replace `context` content with the `fragment` │
    │                                                     │
    └▶  NO                                                │
                                                          │
        create offline `fragment` with `statics`          │
                                                          │
        create a list of `paths` to update                │
                                                          │
        relate the `fragment` to `statics`                │
                                                          │
        relate the `paths` to `statics` ──────────────────┘
```

### Weakly referenced

```
context
  ├▶  statics
  └▶  updates

any
  └▶  wires
```

### Strongly referenced

Template literals are _forever_, there's no reason to create extra GC pressure.

```
statics
  ├▶  fragment
  └▶  paths
```
