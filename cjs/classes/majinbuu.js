'use strict';
/*! Copyright (c) 2017, Andrea Giammarchi, @WebReflection */

// grid operations
const DELETE = 'del';
const INSERT = 'ins';
const SUBSTITUTE = 'sub';

// typed Array
const TypedArray = global.Int32Array || Array;

const majinbuu = (from, to, MAX_SIZE) => {

  const fromLength = from.length;
  const toLength = to.length;
  const TOO_MANY = (MAX_SIZE || Infinity) < Math.sqrt((fromLength || 1) * (toLength || 1));

  if (fromLength < 1 || TOO_MANY) {
    if (toLength || TOO_MANY) {
      from.splice.apply(from, [0, fromLength].concat(to));
    }
    return;
  }
  if (toLength < 1) {
    from.splice(0);
    return;
  }
  performOperations(
    from,
    getOperations(from, to, levenstein(from, to))
  );
}; 

// given an object that would like to intercept
// all splice operations performed through a list,
// wraps the list.splice method to delegate such object
// and it puts back original splice right before every invocation.
// Note: do not use the same list in two different aura
const aura = (splicer, list) => {
  const splice = list.splice;
  function $splice() {
    list.splice = splice;
    const result = splicer.splice.apply(splicer, arguments);
    list.splice = $splice;
    return result;
  }
  list.splice = $splice;
  return list;
};

// Helpers - - - - - - - - - - - - - - - - - - - - - -

// originally readapted from:
// http://webreflection.blogspot.co.uk/2009/02/levenshtein-algorithm-revisited-25.html
// then rewritten in C for Emscripten (see levenstein.c)
// then "screw you ASM" due no much gain but very bloated code
const levenstein = (from, to) => {
  const fromLength = from.length + 1;
  const toLength = to.length + 1;
  const size = fromLength * toLength;
  const grid = new TypedArray(size);
  let x = 0;
  let y = 0;
  let X = 0;
  let Y = 0;
  let crow = 0;
  let prow = 0;
  let del, ins, sub;
  grid[0] = 0;
  while (++x < toLength) grid[x] = x;
  while (++y < fromLength) {
    X = x = 0;
    prow = crow;
    crow = y * toLength;
    grid[crow + x] = y;
    while (++x < toLength) {
      del = grid[prow + x] + 1;
      ins = grid[crow + X] + 1;
      sub = grid[prow + X] + (from[Y] == to[X] ? 0 : 1);
      grid[crow + x] = del < ins ?
                        (del < sub ?
                          del : sub) :
                        (ins < sub ?
                          ins : sub);
      ++X;
    };
    Y = y;
  }
  return grid;
};

// add operations (in reversed order)
const addOperation = (list, type, x, y, count, items) => {
  list.unshift({type, x, y, count, items});
};

// walk the Levenshtein grid bottom -> up
const getOperations = (Y, X, grid) => {
  const list = [];
  const YL = Y.length + 1;
  const XL = X.length + 1;
  let y = YL - 1;
  let x = XL - 1;
  let cell,
      top, left, diagonal,
      crow, prow;
  while (x && y) {
    crow = y * XL + x;
    prow = crow - XL;
    cell = grid[crow];
    top = grid[prow];
    left = grid[crow - 1];
    diagonal = grid[prow - 1];
    if (diagonal <= left && diagonal <= top && diagonal <= cell) {
      x--;
      y--;
      if (diagonal < cell) {
        addOperation(list, SUBSTITUTE, x, y, 1, [X[x]]);
      }
    }
    else if (left <= top && left <= cell) {
      x--;
      addOperation(list, INSERT, x, y, 0, [X[x]]);
    }
    else {
      y--;
      addOperation(list, DELETE, x, y, 1, []);
    }
  }
  while (x--) {
    addOperation(list, INSERT, x, y, 0, [X[x]]);
  }
  while (y--) {
    addOperation(list, DELETE, x, y, 1, []);
  }
  return list;
};

/* grouped operations */
const performOperations = (target, operations) => {
  const length = operations.length;
  let diff = 0;
  let i = 1;
  let curr, prev, op;
  if (length) {
    op = (prev = operations[0]);
    while (i < length) {
      curr = operations[i++];
      if (prev.type === curr.type && (curr.x - prev.x) <= 1 && (curr.y - prev.y) <= 1) {
        op.count += curr.count;
        op.items = op.items.concat(curr.items);
      } else {
        target.splice.apply(target, [op.y + diff, op.count].concat(op.items));
        diff += op.type === INSERT ?
          op.items.length : (op.type === DELETE ?
            -op.count : 0);
        op = curr;
      }
      prev = curr;
    }
    target.splice.apply(target, [op.y + diff, op.count].concat(op.items));
  }
};

majinbuu.aura = aura;

Object.defineProperty(exports, '__esModule', {value: true}).default = majinbuu;
exports.aura = aura;
exports.majinbuu = majinbuu;
