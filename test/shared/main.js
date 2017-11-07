const {Document} = require('basichtml');
global.document = new Document();

const ed = require('../../cjs/shared/easy-dom');
console.assert(ed.create(document, 'P').nodeName === 'P', 'easy-dom.create');
console.assert(ed.fragment(document).nodeName === '#document-fragment', 'easy-dom.fragment');
console.assert(ed.text(document, 'hello').textContent === 'hello', 'easy-dom.text');

//const utils = require('../../cjs/shared/utils');

delete global.Event;
delete global.Map;
delete global.WeakMap;
delete global.WeakSet;
delete String.prototype.trim;
const isArray = Array.isArray;

let i = 0;
Object.defineProperty(Array, 'isArray', {
  configurable: true,
  get() { return i++ ? isArray : null; }
});
const pf = require('../../cjs/shared/poorlyfills.js');

console.assert(pf.isArray([]) && !pf.isArray({}), 'poorlyfilled isArray');

i = 0;
document.addEventListener('test', () => i++, {once: true});
document.dispatchEvent(new pf.Event('test'));
console.assert(i === 1, 'poorlyfilled Event');

let m = new pf.Map;
console.assert(m.get(pf) == null, 'poorlyfilled Map.get');
console.assert(!m.set(pf, 1), 'poorlyfilled Map.set');
console.assert(m.get(pf) === 1, 'poorlyfilled Map.get(1)');

let wm = new pf.WeakMap;
console.assert(wm.has(pf) == false, 'poorlyfilled WeakMap.has');
console.assert(wm.get(pf) == null, 'poorlyfilled WeakMap.get');
console.assert(!wm.set(pf, 1), 'poorlyfilled WeakMap.set');
console.assert(wm.has(pf) == true, 'poorlyfilled WeakMap.has(1)');
console.assert(wm.get(pf) === 1, 'poorlyfilled WeakMap.get(1)');
console.assert(!wm.delete(pf), 'poorlyfilled WeakMap.delete(1)');

let ws = new pf.WeakSet;
console.assert(ws.has(pf) === false, 'poorlyfilled WeakSet.has');
console.assert(!ws.add(pf), 'poorlyfilled WeakSet.add(1)');
console.assert(ws.has(pf) === true, 'poorlyfilled WeakSet.has(1)');

console.assert(pf.trim.call(' test ') === 'test', 'poorlyfilled trim');