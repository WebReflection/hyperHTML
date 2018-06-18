var domdiff = hyperHTML.diff;

var assert = tressa.assert;
var clean = function () {
  for (var cn = document.body.childNodes, i = cn.length; i--;) {
    document.body.removeChild(cn[i]);
  }
};
var compare = function (state, value) {
  assert(
    state.length === value.length &&
    value.split('').every(function (v, i) {
      return state[i] === nodes[v];
    }),
    value || '[empy]'
  );
};

var notNull = function (any) { return any != null; };

tressa.title('domdiff');

assert(typeof domdiff === 'function', 'is a function');

var nodes = {
  'a': document.createTextNode('a'),
  'b': document.createTextNode('b'),
  'c': document.createTextNode('c'),
  'd': document.createTextNode('d'),
  'e': document.createTextNode('e'),
  'f': document.createTextNode('f'),
  'g': document.createTextNode('g'),
  'h': document.createTextNode('h'),
  'i': document.createTextNode('i'),
  'j': document.createTextNode('j'),
  'k': document.createTextNode('k')
};

clean();
var newState = domdiff(
  document.body,
  [],
  [nodes.d, nodes.f, nodes.g]
);
compare(newState, 'dfg');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c].concat(newState)
);
compare(newState, 'abcdfg');

newState = domdiff(
  document.body,
  newState,
  [
    nodes.a, nodes.b, nodes.c,
    nodes.d, nodes.e, nodes.f,
    nodes.g
  ]
);
compare(newState, 'abcdefg');

newState = domdiff(
  document.body,
  newState,
  newState.slice().reverse()
);
compare(newState, 'gfedcba');

newState = domdiff(
  document.body,
  newState,
  [
    nodes.f, nodes.d, nodes.b,
    nodes.a, nodes.e, nodes.g
  ]
);
compare(newState, 'fdbaeg');

newState = domdiff(
  document.body,
  newState,
  [
    nodes.a, nodes.b, nodes.c,
    nodes.d, nodes.e, nodes.f
  ]
);
compare(newState, 'abcdef');

newState = domdiff(
  document.body,
  newState,
  [
    nodes.a, nodes.b, nodes.c,
    nodes.d, nodes.e, nodes.f,
    nodes.h, nodes.i, nodes.j
  ]
);
compare(newState, 'abcdefhij');

newState = domdiff(
  document.body,
  newState,
  [
    nodes.a, nodes.b, nodes.c,
    nodes.d, nodes.e, nodes.f,
    nodes.g, nodes.h, nodes.i,
    nodes.j, nodes.k
  ],
  Object
);
compare(newState, 'abcdefghijk');

newState = domdiff(
  document.body,
  newState,
  [
    nodes.g, nodes.h, nodes.i
  ],
  Object
);
compare(newState, 'ghi');

document.body.insertBefore(nodes.f, nodes.g);
if ('onclick' in document.body) {
  console.log('browser only');
  compare([].slice.call(document.body.childNodes), 'fghi');
}

clean();
document.body.insertBefore(nodes.k, null);
newState = domdiff(
  document.body,
  [],
  [
    nodes.c, nodes.d, nodes.e
  ],
  null,
  nodes.k
);
compare(newState, 'cde');

newState = domdiff(
  document.body,
  newState,
  [
    null, nodes.c, nodes.d, nodes.e, null
  ],
  null,
  nodes.k
);
compare(newState.filter(notNull), 'cde');

newState = domdiff(
  document.body,
  newState,
  [
    nodes.a, nodes.c, null, nodes.e, nodes.f
  ],
  null,
  nodes.k
);
compare(newState.filter(notNull), 'acef');


newState = domdiff(
  document.body,
  newState,
  [
    nodes.c, nodes.d, nodes.e,
    nodes.g, nodes.h, nodes.i
  ],
  null,
  nodes.k
);
compare(newState, 'cdeghi');

newState = domdiff(
  document.body,
  newState,
  [
    nodes.a, nodes.b, nodes.c,
    nodes.d, nodes.e, nodes.f,
    nodes.g, nodes.h, nodes.i
  ],
  null,
  nodes.k
);
compare(newState, 'abcdefghi');

newState = domdiff(
  document.body,
  newState,
  [
    nodes.b, nodes.a, nodes.c,
    nodes.d, nodes.e, nodes.f,
    nodes.g, nodes.i, nodes.h
  ],
  null,
  nodes.k
);
compare(newState, 'bacdefgih');

newState = domdiff(
  document.body,
  newState,
  [],
  null,
  nodes.k
);
compare(newState, '');

// https://github.com/snabbdom/snabbdom/blob/master/test/core.js
tressa.log('## snabbdom - updating children');
newState = domdiff(
  document.body,
  newState,
  [nodes.a],
  null,
  nodes.k
);
compare(newState, 'a');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c],
  null,
  nodes.k
);
compare(newState, 'abc');

newState = domdiff(
  document.body,
  newState,
  [nodes.d, nodes.e],
  null,
  nodes.k
);
compare(newState, 'de');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e],
  null,
  nodes.k
);
compare(newState, 'abcde');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.d, nodes.e],
  null,
  nodes.k
);
compare(newState, 'abde');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e],
  null,
  nodes.k
);
compare(newState, 'abcde');

newState = domdiff(
  document.body,
  newState,
  [nodes.b, nodes.c, nodes.d],
  null,
  nodes.k
);
compare(newState, 'bcd');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e],
  null,
  nodes.k
);
compare(newState, 'abcde');

newState = domdiff(
  document.body,
  newState,
  [],
  null,
  nodes.k
);
compare(newState, '');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c],
  null,
  nodes.k
);
compare(newState, 'abc');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, document.createTextNode('b'), nodes.c],
  null,
  nodes.k
);
assert(
  newState[1] !== nodes.b &&
  newState.length === 3 &&
  newState[0] === nodes.a &&
  newState[2] === nodes.c,
  'replace one child'
);

tressa.log('## snabbdom - removal of elements');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e],
  null,
  nodes.k
);
compare(newState, 'abcde');

newState = domdiff(
  document.body,
  newState,
  [nodes.c, nodes.d, nodes.e],
  null,
  nodes.k
);
compare(newState, 'cde');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e],
  null,
  nodes.k
);
compare(newState, 'abcde');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c],
  null,
  nodes.k
);
compare(newState, 'abc');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e],
  null,
  nodes.k
);
compare(newState, 'abcde');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.d, nodes.e],
  null,
  nodes.k
);
compare(newState, 'abde');

tressa.log('## snabbdom - element reordering');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d],
  null,
  nodes.k
);
compare(newState, 'abcd');

newState = domdiff(
  document.body,
  newState,
  [nodes.b, nodes.c, nodes.a, nodes.d],
  null,
  nodes.k
);
compare(newState, 'bcad');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c],
  null,
  nodes.k
);
compare(newState, 'abc');

newState = domdiff(
  document.body,
  newState,
  [nodes.b, nodes.c, nodes.a, nodes.d],
  null,
  nodes.k
);
compare(newState, 'bcad');

newState = domdiff(
  document.body,
  newState,
  [nodes.c, nodes.b, nodes.d],
  null,
  nodes.k
);
compare(newState, 'cbd');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c],
  null,
  nodes.k
);
compare(newState, 'abc');

newState = domdiff(
  document.body,
  newState,
  [nodes.b, nodes.c, nodes.a],
  null,
  nodes.k
);
compare(newState, 'bca');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d],
  null,
  nodes.k
);
compare(newState, 'abcd');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.d, nodes.b, nodes.c],
  null,
  nodes.k
);
compare(newState, 'adbc');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.d, nodes.b, nodes.c],
  null,
  nodes.k
);
compare(newState, 'adbc');

tressa.log('## snabbdom - combination');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e],
  null,
  nodes.k
);
compare(newState, 'abcde');

newState = domdiff(
  document.body,
  newState,
  [nodes.d, nodes.a, nodes.b, nodes.c, nodes.f],
  null,
  nodes.k
);
compare(newState, 'dabcf');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.d, nodes.e],
  null,
  nodes.k
);
compare(newState, 'ade');

newState = domdiff(
  document.body,
  newState,
  [nodes.d, nodes.f],
  null,
  nodes.k
);
compare(newState, 'df');

newState = domdiff(
  document.body,
  newState,
  [nodes.b, nodes.d, nodes.e],
  null,
  nodes.k
);
compare(newState, 'bde');

newState = domdiff(
  document.body,
  newState,
  [nodes.d, nodes.e, nodes.c],
  null,
  nodes.k
);
compare(newState, 'dec');

newState = domdiff(
  document.body,
  newState,
  [nodes.j, nodes.a, nodes.b, nodes.c],
  null,
  nodes.k
);
compare(newState, 'jabc');

newState = domdiff(
  document.body,
  newState,
  [nodes.d, nodes.a, nodes.b, nodes.c, nodes.j, nodes.e],
  null,
  nodes.k
);
compare(newState, 'dabcje');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e, nodes.f, nodes.g, nodes.h],
  null,
  nodes.k
);
compare(newState, 'abcdefgh');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e, nodes.f, nodes.g, nodes.h].reverse(),
  null,
  nodes.k
);
compare(newState, 'hgfedcba');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e, nodes.f],
  null,
  nodes.k
);
compare(newState, 'abcdef');

newState = domdiff(
  document.body,
  newState,
  [nodes.e, nodes.d, nodes.c, nodes.b, nodes.f, nodes.a],
  null,
  nodes.k
);
compare(newState, 'edcbfa');

tressa.log('## snabbdom - random values');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e, nodes.f],
  null,
  nodes.k
);
compare(newState, 'abcdef');

newState = domdiff(
  document.body,
  newState,
  [null, nodes.c, undefined, null, nodes.b, nodes.a, null, nodes.f, nodes.e, null, nodes.d, undefined],
  null,
  nodes.k
);
compare(newState.filter(notNull), 'cbafed');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e, nodes.f],
  null,
  nodes.k
);
compare(newState, 'abcdef');

newState = domdiff(
  document.body,
  newState,
  [null, null, undefined, null, null, undefined],
  null,
  nodes.k
);
compare(newState.filter(notNull), '');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e, nodes.f].reverse(),
  null,
  nodes.k
);
compare(newState, 'fedcba');




clean();
tressa.log('## snabbdom - updating children (unpinned)');
newState = domdiff(
  document.body,
  [],
  [nodes.a]
);
compare(newState, 'a');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c]
);
compare(newState, 'abc');

newState = domdiff(
  document.body,
  newState,
  [nodes.d, nodes.e]
);
compare(newState, 'de');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e]
);
compare(newState, 'abcde');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.d, nodes.e]
);
compare(newState, 'abde');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e]
);
compare(newState, 'abcde');

newState = domdiff(
  document.body,
  newState,
  [nodes.b, nodes.c, nodes.d]
);
compare(newState, 'bcd');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e]
);
compare(newState, 'abcde');

newState = domdiff(
  document.body,
  newState,
  []
);
compare(newState, '');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c]
);
compare(newState, 'abc');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, document.createTextNode('b'), nodes.c]
);
assert(
  newState[1] !== nodes.b &&
  newState.length === 3 &&
  newState[0] === nodes.a &&
  newState[2] === nodes.c,
  'replace one child'
);

tressa.log('## snabbdom - removal of elements (unpinned)');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e]
);
compare(newState, 'abcde');

newState = domdiff(
  document.body,
  newState,
  [nodes.c, nodes.d, nodes.e]
);
compare(newState, 'cde');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e]
);
compare(newState, 'abcde');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c]
);
compare(newState, 'abc');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e]
);
compare(newState, 'abcde');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.d, nodes.e]
);
compare(newState, 'abde');

tressa.log('## snabbdom - element reordering (unpinned)');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d]
);
compare(newState, 'abcd');

newState = domdiff(
  document.body,
  newState,
  [nodes.b, nodes.c, nodes.a, nodes.d]
);
compare(newState, 'bcad');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c]
);
compare(newState, 'abc');

newState = domdiff(
  document.body,
  newState,
  [nodes.b, nodes.c, nodes.a]
);
compare(newState, 'bca');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d]
);
compare(newState, 'abcd');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.d, nodes.b, nodes.c]
);
compare(newState, 'adbc');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.d, nodes.b, nodes.c]
);
compare(newState, 'adbc');

tressa.log('## snabbdom - combination (unpinned)');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e]
);
compare(newState, 'abcde');

newState = domdiff(
  document.body,
  newState,
  [nodes.d, nodes.a, nodes.b, nodes.c, nodes.f]
);
compare(newState, 'dabcf');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.d, nodes.e]
);
compare(newState, 'ade');

newState = domdiff(
  document.body,
  newState,
  [nodes.d, nodes.f]
);
compare(newState, 'df');

newState = domdiff(
  document.body,
  newState,
  [nodes.b, nodes.d, nodes.e]
);
compare(newState, 'bde');

newState = domdiff(
  document.body,
  newState,
  [nodes.d, nodes.e, nodes.c]
);
compare(newState, 'dec');

newState = domdiff(
  document.body,
  newState,
  [nodes.j, nodes.a, nodes.b, nodes.c]
);
compare(newState, 'jabc');

newState = domdiff(
  document.body,
  newState,
  [nodes.d, nodes.a, nodes.b, nodes.c, nodes.j, nodes.e]
);
compare(newState, 'dabcje');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e, nodes.f, nodes.g, nodes.h]
);
compare(newState, 'abcdefgh');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e, nodes.f, nodes.g, nodes.h].reverse()
);
compare(newState, 'hgfedcba');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e, nodes.f]
);
compare(newState, 'abcdef');

newState = domdiff(
  document.body,
  newState,
  [nodes.e, nodes.d, nodes.c, nodes.b, nodes.f, nodes.a]
);
compare(newState, 'edcbfa');

tressa.log('## snabbdom - random values (unpinned)');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e, nodes.f]
);
compare(newState, 'abcdef');

newState = domdiff(
  document.body,
  newState,
  [null, nodes.c, undefined, null, nodes.b, nodes.a, null, nodes.f, nodes.e, null, nodes.d, undefined]
);
compare(newState.filter(notNull), 'cbafed');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e, nodes.f]
);
compare(newState, 'abcdef');

newState = domdiff(
  document.body,
  newState,
  [null, null, undefined, null, null, undefined]
);
compare(newState.filter(notNull), '');

newState = domdiff(
  document.body,
  newState,
  [nodes.a, nodes.b, nodes.c, nodes.d, nodes.e, nodes.f].reverse()
);
compare(newState, 'fedcba');

newState = domdiff(
  document.body,
  newState,
  [nodes.a]
);
compare(newState, 'a');

newState = domdiff(
  document.body,
  newState,
  [nodes.b, nodes.c, nodes.d]
);
compare(newState, 'bcd');

newState = domdiff(
  document.body,
  newState,
  [nodes.a]
);
compare(newState, 'a');

newState = domdiff(
  document.body,
  newState,
  []
);

var data = [
  {"id": 4054, "title": "Serie 2"},
  {"id": 3982, "title": "Serie 3"},
  {"id": 4016, "title": "Gracias"},
  {"id":3984, "title": "Comparte"},
  {"id":3952, "title": "Lección 1"},
  {"id":3955, "title": "Lección 2"}
];

var wm = {};

var getItem = function (item) { return wm[item.id]; };

data.forEach(function (item) {
  wm[item.id] = document.createTextNode(item.id + ': ' + item.title);
});

newState = domdiff(
  document.body,
  newState,
  data.slice().map(getItem)
);

newState = domdiff(
  document.body,
  newState,
  data.slice().sort(function (a, b) {
    return a.title.localeCompare(b.title);
  }).map(getItem)
);

tressa.end();
