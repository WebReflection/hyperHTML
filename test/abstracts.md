# Abstract

The following content represents ideal steps
performed by hyperHTML to grant performance,
recycle everything it can, and update layouts.

It's rather a specification than current implementation,
but the goal is to optimize such specification as much as possible
and achieve best performance on top of that.

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

TODO: is an `expando` property that faster than a `WeakMap`?

```
context
  ├▶  statics
  └▶  updates

any
  └▶  wires
```

### Strongly referenced

Template literals are _forever_, there's no reason to create extra GC pressure.

TODO: is a native `Map` faster than a pair of arrays?

```
statics
  ├▶  fragment
  └▶  paths
```

### What is a wire ?

A wire is a weakly linked document fragment content representing the node itself,
as opposite of the container, like it is for `hyperHTML` bound `contexts`.

```
hyperHTML.wire(any, type:ID)
│
└▶  is `any` known?
    │
    ├▶  YES
    │
    │   is `:ID` already known ?
    │   │
    │   ├▶  YES
    │   │
    │   │   retrieve the `fragment` via `any`[`type:ID`]
    │   │
    │   │   return (...args) =>
    │   │           hyperHTML.call(`fragment`, ...args).children;
    │   │
    │   └▶  NO  ┌─────────────────────────────────────────┐
    │           ▼                                         │
    │       create a `fragment`                           │
    │                                                     │
    │       relate `any`[`type:ID`] to the `fragment`     │
    │                                                     │
    └▶  NO                                                │
                                                          │
        if `any` is null, let it be a new `{}`.           │
                                                          │
        relate `any` to a new `{}` wire. ─────────────────┘
```

