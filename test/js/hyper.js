
// A Basic Hyper Class
class Hyper extends HTMLElement {
  _initHyper() {
    if ('hyper' in this) return;
    this.hyper = hyperHTML.wire();
    this.appendChild(this.render());
  }
  attributeChangedCallback() { this._initHyper(); }
  connectedCallback() { this._initHyper(); }
}
