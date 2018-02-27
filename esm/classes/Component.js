import { WeakMap } from '../shared/poorlyfills.js';

// hyperHTML.Component is a very basic class
// able to create Custom Elements like components
// including the ability to listen to connect/disconnect
// events via onconnect/ondisconnect attributes
// Components can be created imperatively or declaratively.
// The main difference is that declared components
// will not automatically render on setState(...)
// to simplify state handling on render.
export default function Component() {}

// components will lazily define html or svg properties
// as soon as these are invoked within the .render() method
// Such render() method is not provided by the base class
// but it must be available through the Component extend.
// Declared components could implement a
// render(props) method too and use props as needed.
export function setup(content) {
  const children = new WeakMap;
  const create = Object.create;
  const createEntry = (wm, id, component) => {
    wm.set(id, component);
    return component;
  };
  const get = (Class, info, id) => {
    switch (typeof id) {
      case 'object':
      case 'function':
        const wm = info.w || (info.w = new WeakMap);
        return wm.get(id) || createEntry(wm, id, new Class);
      default:
        const sm = info.p || (info.p = create(null));
        return sm[id] || (sm[id] = new Class);
    }
  };
  const set = context => {
    const info = {w: null, p: null};
    children.set(context, info);
    return info;
  };
  Object.defineProperties(
    Component,
    {
      for: {
        configurable: true,
        value(context, id) {
          const info = children.get(context) || set(context);
          return get(this, info, id == null ? 'default' : id);
        }
      }
    }
  );
  Object.defineProperties(
    Component.prototype,
    {
      handleEvent: {value(e) {
        const ct = e.currentTarget;
        this[
          ('getAttribute' in ct && ct.getAttribute('data-call')) ||
          ('on' + e.type)
        ](e);
      }},
      html: lazyGetter('html', content),
      svg: lazyGetter('svg', content),
      state: lazyGetter('state', function () { return this.defaultState; }),
      defaultState: {get() { return {}; }},
      setState: {value(state, render) {
        const target = this.state;
        const source = typeof state === 'function' ? state.call(this, target) : state;
        for (const key in source) target[key] = source[key];
        if (render !== false) this.render();
        return this;
      }}
    }
  );
}

// instead of a secret key I could've used a WeakMap
// However, attaching a property directly will result
// into better performance with thousands of components
// hanging around, and less memory pressure caused by the WeakMap
const lazyGetter = (type, fn) => {
  const secret = '_' + type + '$';
  return {
    get() {
      return this[secret] || (this[type] = fn.call(this, type));
    },
    set(value) {
      Object.defineProperty(this, secret, {configurable: true, value});
    }
  };
};
