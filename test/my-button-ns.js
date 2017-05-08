fetch('my-button.css').then(t => t.text()).then(css => {

  document.head.appendChild(
    document.createElement('style')
  ).textContent = css.replace(/^(\S)/gm, 'my-button-ns $1');

  class MyButtonNS extends HTMLElement {

    // bind once the component Shadow DOM
    constructor(self) {
      self = super(self);
      self.html = hyperHTML.bind(self);
      return self;
    }

    // render once connected
    connectedCallback() {
      this.render();
    }

    // do something on click
    onclick(event) {
      event.preventDefault();
      alert('clicked');
    }

    // render whenever it's necessary
    render() {
      this.html`
      <button onclick="${this.onclick}">
        ${this.nodeName.toLowerCase()} (poly + no Shadow DOM)
      </button>`;
    }

  }

  // register the component
  customElements.define('my-button-ns', MyButtonNS);

});
