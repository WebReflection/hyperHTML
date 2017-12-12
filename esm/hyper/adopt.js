import {Map, WeakMap} from '../shared/poorlyfills.js';
import {UIDC} from '../shared/constants.js';
import Adopt from '../objects/Adopt.js';
import {
  createFragment,
  importNode,
  unique
} from '../shared/utils.js';

const bewitched = new WeakMap;
const templates = new Map;

const adopt = node => render.bind(node);

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
  const updates = Adopt.create(this, info.paths);
  bewitched.set(this, {template, updates});
  update.apply(updates, arguments);
}

function update() {
  const length = arguments.length;
  for (let i = 1; i < length; i++) {
    this[i - 1](arguments[i]);
  }
}

function createTemplate(template) {
  const paths = [];
  const fragment = createFragment(this, template.join(UIDC));
  Adopt.find(fragment, paths, template.slice());
  const info = {fragment, paths};
  templates.set(template, info);
  return info;
}

export default adopt;
