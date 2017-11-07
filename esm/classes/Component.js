import wire from '../hyper/wire.js';

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

// no need for a transpiled class here
// Component needs lazy prototype accessors.
// Using modern syntax to define it won't be enough
function Component() {}
Object.defineProperties(
  Component.prototype,
  {
    // same as HyperHTMLElement handleEvent
    handleEvent: {value(e) {
      // both IE < 11 and JSDOM lack dataset
      const ct = e.currentTarget;
      this[
        ('getAttribute' in ct && ct.getAttribute('data-call')) ||
        ('on' + e.type)
      ](e);
    }},
    // returns its own HTML wire or create it once on comp.render()
    html: lazyGetter('html', wire.content),
    // returns its own SVG wire or create it once on comp.render()
    svg: lazyGetter('svg', wire.content),
    // same as HyperHTMLElement state
    state: lazyGetter('state', function () { return this.defaultState; }),
    // same as HyperHTMLElement get defaultState
    defaultState: {get() { return {}; }},
    // same as HyperHTMLElement setState
    setState: {value(state) {
      const target = this.state;
      const source = typeof state === 'function' ? state.call(this, target) : state;
      for (const key in source) target[key] = source[key];
      this.render();
    }}
    // the render must be defined when extending hyper.Component
    // the render **must** return either comp.html or comp.svg wire
    // render() { return this.html`<p>that's it</p>`; }
  }
);

export default Component;
