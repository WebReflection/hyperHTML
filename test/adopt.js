var wrap = document.body.appendChild(document.createElement('div'));
wrap = document.createElement('div');
wrap.innerHTML = '<div test="before"> before <ul><li> lonely </li></ul>NO<hr></div>';

var div = wrap.firstElementChild;
var text = div.firstChild;
var ul = div.firstElementChild;
var hr = div.lastElementChild;
var render = hyperHTML.adopt(wrap);
var model = {
  test: 'after',
  text: 'after',
  list: [
    {name: 'first'},
    {name: 'second'}
  ],
  inBetween: 'OK'
};

function update(render, model) {
  render`
  <div test="${model.test}">
    ${model.text}
    <ul>${
      model.list.map(item => `<li> ${item.name} </li>`)
    }</ul>${
      model.inBetween
    }<hr>
  </div>
  `;
}

console.log('-----------------------------------------------------------------');

setTimeout(() => {
  update(render, model);
}, 1000);