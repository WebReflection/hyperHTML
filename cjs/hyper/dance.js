'use strict';
const {UIDC} = require('../shared/constants.js');
const {Map, WeakMap} = require('../shared/poorlyfills.js');
const Updates = (m => m.__esModule ? m.default : m)(require('../objects/Updates.js'));
const {
  createFragment,
  importNode,
  unique
} = require('../shared/utils.js');

const bewitched = new WeakMap;
const templates = new Map;

function render(template) {
  const wicked = bewitched.get(this);
  if (wicked && wicked.template === unique(template)) {
    update.apply(wicked.updates, arguments);
  } else {
    upgrade.apply(this, arguments);
  }
  return this;
}

function upgrade(template) {
  template = unique(template);
  const info =  templates.get(template) ||
                createTemplate.call(this, template);
  const fragment = importNode(this.ownerDocument, info.fragment);
  const updates = Updates.create(this, fragment, info.paths);
  bewitched.set(this, {template, updates});
  update.apply(updates, arguments);
  this.textContent = '';
  this.appendChild(fragment);
}

function update() {

}

function createTemplate(template) {
  const paths = [];
  const fragment = createFragment(this, template.join(UIDC));
  const info = {fragment, paths};
  Updates.find(fragment, paths, template.slice());
  templates.set(template, info);
  return info;
}

exports.render = render;