import {G, UID} from './constants.js';

// you know that kind of basics you need to cover
// your use case only but you don't want to bloat the library?
// There's even a package in here:
// https://www.npmjs.com/package/poorlyfills

// used to dispatch simple events
let Event = G.Event;
try {
  new Event('Event');
} catch(o_O) {
  Event = function (type) {
    const e = document.createEvent('Event');
    e.initEvent(type, false, false);
    return e;
  };
}
export {Event};

// used to store template literals
/* istanbul ignore next */
export const Map = G.Map || function Map() {
  const keys = [], values = [];
  return {
    get(obj) {
      return values[keys.indexOf(obj)];
    },
    set(obj, value) {
      values[keys.push(obj) - 1] = value;
    }
  };
};

// used to store wired content
let ID = 0;
export const WeakMap = G.WeakMap || function WeakMap() {
  const key = UID + ID++;
  return {
    delete(obj) { delete obj[key]; },
    get(obj) { return obj[key]; },
    set(obj, value) {
      Object.defineProperty(obj, key, {
        configurable: true,
        value
      });
    }
  };
};

// used to store hyper.Components
export const WeakSet = G.WeakSet || function WeakSet() {
  const wm = new WeakMap;
  return {
    delete(obj) { wm.delete(obj); },
    add(obj) { wm.set(obj, true); },
    has(obj) { return wm.get(obj) === true; }
  };
};

// used to be sure IE9 or older Androids work as expected
export const isArray = Array.isArray || (toString =>
  arr => toString.call(arr) === '[object Array]'
)({}.toString);

export const trim = UID.trim || function () {
  return this.replace(/^\s+|\s+$/g, '');
};
