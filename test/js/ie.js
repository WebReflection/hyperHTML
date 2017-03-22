window.onload = () => {

  const articleElement = document.querySelector('article');

  const update = (render, state) => render`
    <article
      onclick="alert([this.id,this.className])"
      data-magic="${state.magic}"
      id="${state.id}"
      class="${state.class}"
    >
      <h3>${state.title}</h3>
      List of ${state.paragraphs.length} paragraphs:
      <ul onclick="${e => alert(e.target.innerHTML)}">${
        state.paragraphs
          .map(p => hyperHTML.wire(p)`<li>${p.title}</li>`)
      }</ul>
    </article>
    `;

  update(
    hyperHTML.bind(articleElement),
    {
      id: 'completely-random',
      class: 'it-does-not-matter',
      title: 'True story',
      magic: true,
      paragraphs: [
        {title: 'touching'},
        {title: 'incredible'},
        {title: 'doge'}
      ]
    }
  );

  const tbody = hyperHTML.bind(document.body.appendChild(
    document.createElement('table')
  ).appendChild(
    document.createElement('tbody')
  ));

  tbody`
      <tr>
        <td>even</td>
        <td style="text-align:right;font-weight:bold">IE</td>
      </tr>
      <tr>
        <td colspan="2">
          can do partial ${'<tr>'}
        </td>
      </tr>
    `;

};