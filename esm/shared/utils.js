const {isArray} = Array;

export {isArray};

const {
  createDocumentFragment,
  createElement,
  createElementNS,
} = new Proxy({}, {
  get: (_, method) => document[method].bind(document)
});

const createHTML = html => {
  const template = createElement('template');
  template.innerHTML = html;
  return template.content;
};

let xml;
const createSVG = svg => {
  if (!xml) xml = createElementNS('http://www.w3.org/2000/svg', 'svg');
  xml.innerHTML = svg;
  const content = createDocumentFragment();
  content.append(...xml.childNodes);
  return content;
};

export const createContent = (text, type) => type == 'svg' ?
                              createSVG(text) : createHTML(text);