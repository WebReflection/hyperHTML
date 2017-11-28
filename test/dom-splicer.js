var splicer = new DOMSplicer({
  target: document.documentElement
});

var a = document.createTextNode('a');
var b = document.createTextNode('b');
var c = document.createTextNode('c');
var d = document.createTextNode('d');
var e = document.createTextNode('e');
var f = document.createTextNode('f');
var g = document.createTextNode('g');
var h = document.createTextNode('h');
var i = document.createTextNode('i');

console.time();
splicer.splice(0, 0, a, b, c, d, e);
console.timeEnd();
verify(splicer);

console.time();
splicer.splice(2, 1, g);
console.timeEnd();
verify(splicer);

splicer = new DOMSplicer({
  target: document.createElement('div'),
  childNodes: []
});

console.time();
splicer.splice(0, 0, a, b, c, d, e);
console.timeEnd();
verify(splicer);

console.time();
splicer.splice(2, 1, g);
console.timeEnd();
verify(splicer);

console.time();
splicer.splice();
console.timeEnd();
verify(splicer);

console.time();
splicer.splice(1, 1);
console.timeEnd();
verify(splicer);

console.time();
splicer.splice(10);
console.timeEnd();
verify(splicer);

console.time();
splicer.splice(-1);
console.timeEnd();
verify(splicer);

const fragment = document.createDocumentFragment();
fragment.appendChild(document.createComment('placeholder'));
splicer = new DOMSplicer({
  before: fragment.childNodes[0]
});
splicer.splice(0, 0, a, b, c, d, e);

splicer = new DOMSplicer({
  target: fragment,
  childNodes: {length: 0}
});
splicer.splice(0, 100);

function verify(splicer) {
  console.assert(
    [].slice.call(splicer.childNodes).every(
      function (node, i) {
        return splicer.target.childNodes[i] === node;
      }
    ),
    'splicer.childNodes same as splicer.target.childNodes'
  );
  console.assert(
    [].slice.call(splicer.target.childNodes).every(
      function (node, i) {
        return splicer.childNodes[i] === node;
      }
    ),
    'splicer.target.childNodes same as splicer.childNodes'
  );
}