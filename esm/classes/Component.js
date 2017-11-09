import {content} from '../hyper/wire.js';

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

function Component() {}
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
    setState: {value(state) {
      const target = this.state;
      const source = typeof state === 'function' ? state.call(this, target) : state;
      for (const key in source) target[key] = source[key];
      this.render();
    }}
  }
);

export default Component;
