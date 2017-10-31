import {create, fragment, text} from './easy-dom.js';

const testFragment = fragment(document);

// DOM4 node.append(...many)
export const hasAppend = 'append' in testFragment;

// beside IE, old WebKit browsers don't have `children` in DocumentFragment
export const hasChildren = 'children' in testFragment;

// detect old browsers without HTMLTemplateElement content support
export const hasContent = 'content' in create(document, 'template');

// If attributes order is shuffled, threat the browser differently
// Usually this is a well known IE/Edge only issue but some older FF does the same.
const p = create(document, 'p');
p.innerHTML = '<i data-i="" class=""></i>';
export const hasDoomedAttributes = /class/i.test(p.firstChild.attributes[0].name);

// IE 11 has problems with cloning templates: it "forgets" empty childNodes
testFragment.appendChild(text(testFragment, 'g'));
testFragment.appendChild(text(testFragment, ''));
export const hasDoomedCloneNode = testFragment.cloneNode(true).childNodes.length === 1;

// old browsers need to fallback to cloneNode
// Custom Elements V0 and V1 will work polyfilled
export const hasImportNode = 'importNode' in document;
