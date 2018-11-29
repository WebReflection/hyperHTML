'use strict';
const {fragment} = require('./easy-dom.js');

// DOM4 node.append(...many)
const hasAppend = 'append' in fragment(document);
exports.hasAppend = hasAppend;
