fetch('my-button.css').then(t => t.text()).then(css => {

  class MyButton extends HTMLElement {

    // bind once the component Shadow DOM
    constructor() {
      super();
      this.html = hyperHTML.bind(
        this.attachShadow({mode: 'closed'})
      );
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
      <style>${css}</style>
      <button onclick="${this.onclick}">
        click ${this.nodeName.toLowerCase()}
      </button>`;
    }

  }

  // register the component
  customElements.define('my-button', MyButton);

});
