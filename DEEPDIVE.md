# hyperHTML Developer DeepDive

Being extremely lightweight and simple, there's not much to learn about `hyperHTML`, but there's surely more to discuss about patterns floating around it.

This document aim is to provide as many details as possible per each operation that's possible via `hyperHTML`.


## How can the template be unique

One thing I have recently discovered about template literals, and I wish I knew it before, is that these are as static as any other string.

This means that not only ``(`a` === `a`)`` is true, but also  ``((a=>a)`a${1}b` === (a=>a)`a${2}b`)``.

This is the first bit to understand: each template string is unique and if the target node has been using this template before, it won't actually parse it again at all and it will simply use the rest of the arguments passed along to update nested bits already known.


#### How are known nodes discovered

The very first time a new template is used against a node, its full content is injected into such node using a special `<!--_hyperHTML-965678965456-->` random comment instead of real values.

Such comment is used to discover both attributes, text nodes, and whole fragments or HTML content, the very first time only.

```js
// simulation of initial fake injection
function fakeContent(statics, ...values) {
  const content = statics.join('<!--_hyperHTML-965678965456-->');
  this.innerHTML = content;
}

const render = fakeContent.bind(document.body);

// inject fakeContent to the target
render`a ${'b'} c`;

// check its content
console.log(
  document.body.childNodes
);
// [text, comment, text]
```

As basic example, it would be now possible to drop that `comment` with a text node that will update its content when `values[0]` is passed on, and once all nodes have been mapped 1:1 to the amount of extra arguments passed along to update each sub-value, real data is used and real data will be used from that very moment on to populate nodes and attributes.

At this point `hyperHTML` uses an [expando property](https://developer.mozilla.org/en-US/docs/Glossary/Expando), for the sake of wider compatibility and to avoid too many [GC pressure](https://mail.mozilla.org/pipermail/es-discuss/2014-December/040565.html) due a potentially heavily populated WeakMap, to save the list of callbacks used to update only what's needed to be updated, being specific text nodes, attributes, or fragments, and together with the static template reference.

From now on, every time the same template is used, all `hyperHTML` has to do is the following:

```js
// used when the template is known
function update(statics, ...values) {
  // list of callbacks that target directly the node
  const updates = this[EXPANDO].updates;
  // per each value passed along
  values.forEach((value, i) =>
    // update the related content
    updates[i](value));
  // it's a 1:1 DOM relationships
}
```


## How are attributes updated

Quite often developers thinks about DOM attributes as something you can get or set via `node.setAttribute(name, value)`.
Well, that's half of the story, 'cause [attributes are just nodes](https://dom.spec.whatwg.org/#interface-attr) like anything else on the DOM.

This means that a generic attribute can be updated simply setting its `.value` property, like an `input` element would update its view when we set its value. It'd be silly to `input.setAttribute('value', content)` when we can just `input.value = content`, right?

And that's how attributes are updated here. Trapped in a closure, a ner template render will simply target the specific attribute and change its value, with the only exception of those attributes prefixed with `on`.

These are meant to be handlers, and since nobody likes to deal with handlers as string content, `hyperHTML` recognizes these attributes and it actually remove them from the node, bit it will assign to the attribute owner, the node, the DOM Level 0 event.

```js
// simulation of the attribute update mechanism
if (attribute.name.indexOf('on') === 0) {
  node.removeAttribute(attribute.name);
  updateAttributeUsing(callback => {
    node[attribute.name] = callback;
  });
} else {
  updateAttributeUsing(value => {
    attribute.value = value;
  });
}
```

#### Attributes, the right way

I'm pretty sure at some point someone will file a bug about having the following situation not working:
```js
function update(render, state) {
  // WRONG WAY TO SET ATTRIBUTES
  render`
    <div class="one two ${state.three}">
      ${state.whatever}
    </div>
  `;
}
```

The performance oriented simplicity of `hyperHTML` simply looks for mutable attributes, it doesn't bother with partially mutable attributes. You can also agree with me above code is [YAGNI](https://en.wikipedia.org/wiki/You_aren't_gonna_need_it) at its best.

Following **the correct way** to obtain the exact same result:
```js
function update(render, state) {
  render`
    <div class="${'one two ' + state.three}">
      ${state.whatever}
    </div>
  `;
}
```
That's it, really, you have a `class` attribute that will update when changes happen, end of all troubles ^_^


## How are text nodes updated

Text nodes have a very simple rule: if they are in the wild, they'll be targeted and created.
```js
function update(render) {
  render`
    <div>
      ${'text node'}
      <h3>${'html' || node || array}</h3>
      ${'text node'}
      <ul>${
        // no surrounding chars is HTML
        'html' || node || array
      }</ul>
      <!-- everything else is text -->
      ${new Date || 'text node'}
    </div>
  `;
}
```

**Remember:** raw text nodes updates are the fastest, cheapest thing to do. Since also CSS ignores spaces around text, unless of course the node is a special one, don't enclose a text node only right in between tags, put a space and it'll be faster and safer!

```js
function update(render) {
  render`
    <p>${'this will accept <em>HTML</em>'}</p>
    <p>
      ${'this will update a raw <nope>textNode</nope>'}
    </p>
  `;
}

// test it!
update(hyperHTML.bind(document.body));
```


## How are HTML and Document Fragments managed

This is "_the hard core_" bit. By this time, you should've understood how to hook yourself into HTML and fragments world.

Literally check the example right before this chapter to remember that you **must not have spaces** or any other char around your fragment, being a table row, a list, or anything else, literally!

```js
function update(render) {
  render`${
    'even this is a fragment'
  }`;
}

function update(render) {
  render`
  <table>
    <tbody>
      <tr>${
        'so is this'
      }</tr>${
        'and even this!!!'
    }</tbody>
  </table>
  `;
}
```

Got it? Put a single space around your `${template entry points}` and goodbye HTML or fragments.

#### Good!

Now we can return few different kind of things per each fragment:

  * a generic DOM `node`, probably the most common case, it will just be there where you expect it when you need it!
  * a `string`, in such case `innerHTML` will kicks in like there's no tomorrow
  * a `boolean` or a `number`, that will be injected through the cheap `textContent` instead of `innerHTML`
  * a `DocumentFragment` which will be compared through its childNodes, and if already there, nothing will happen 'cause fragments are just an indirection to reach real updates, and these also lose nodes once appended
  * an `Array` of _strings_, that will be injected through `innerHTML` through a brutal `.join('')`
  * an `Array` of _nodes_, that if not already the same on the DOM, will be replaced all at once through a runtime fragment.

I think I've managed to not forget any case (please file a bug if I did!), but the annoying bit is when you use a fragment as a target.


### Binding A Document Fragment

For documentation sake I'll write down what happens now, but this is the only bit I'm still a bit puzzled about.

So here the thing: document fragments lose their content, so if you try to `appendChild(fragment)` twice nothing happens.

Was that meant to be an empty fragment? Was it used elsewhere already? You'll never know.


#### Fragments Are Essential

There are cases where you cannot use anything else but a fragment.
As example, imagine you want to append a list of `<LI>` elements or `<TR>` or `<TD>`, there's no HTML node suitable to temporarily wrap those elements, so `DocumentFragment` it is.


### hyperHTML work around

Comparing nodes is all `hyperHTML` can do, so whenever you need to actually **return a fragment** to compose the layout like I've done in [the DBMonster example page](https://github.com/WebReflection/hyperHTML/blob/master/test/dbmonster.html#L38-L86), don't return directly the rendered result, but its very first node instead.

I'm planning to experiment if I should automagically do the same via `hyperHTML`, but the truth is that you might want to return not one node but a list of nodes as fragment childnodes, and there's no way I can fix that <sub>(yeah yeah there is but not right now on a Sunday evening launch at almost midnight ...)</sub>

I'll come back to this!

Best Regards