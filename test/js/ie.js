window.onload = () => {

  const articleElement = document.querySelector('article');

  const update = (render, state) => render`
    <article data-magic="${state.magic}">
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
      title: 'True story',
      magic: true,
      paragraphs: [
        {title: 'touching'},
        {title: 'incredible'},
        {title: 'doge'}
      ]
    }
  );

};