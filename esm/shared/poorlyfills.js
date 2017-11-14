import {UID} from './constants.js';

let Event = global.Event;
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

export const Map = global.Map || function Map() {
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

export const WeakMap = global.WeakMap || function WeakMap() {
  return {
    get(obj) { return obj[UID]; },
    set(obj, value) {
      Object.defineProperty(obj, UID, {
        configurable: true,
        value
      });
    }
  };
};

export const WeakSet = global.WeakSet || function WeakSet() {
  const wm = new WeakMap;
  return {
    add(obj) { wm.set(obj, true); },
    has(obj) { return wm.get(obj) === true; }
  };
};

// TODO: which browser needs these partial polyfills here?
export const isArray = Array.isArray || (toString =>
  arr => toString.call(arr) === '[object Array]'
)({}.toString);

export const trim = UID.trim || function () {
  return this.replace(/^\s+|\s+$/g, '');
};
