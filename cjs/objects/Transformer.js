'use strict';
const transformers = {};
const transformersKeys = [];
const hasOwnProperty = transformers.hasOwnProperty;

let length = 0;

// hyperHTML.define('intent', (object, update) => {...})
// can be used to define a third parts update mechanism
// when every other known mechanism failed.
// hyper.define('user', info => info.name);
// hyper(node)`<p>${{user}}</p>`;
Object.defineProperty(exports, '__esModule', {value: true}).default = {
  define: (transformer, callback) => {
    if (!(transformer in transformers)) {
      length = transformersKeys.push(transformer);
    }
    transformers[transformer] = callback;
  },
  invoke: (object, callback) => {
    for (let i = 0; i < length; i++) {
      let key = transformersKeys[i];
      if (hasOwnProperty.call(object, key)) {
        return transformers[key](object[key], callback);
      }
    }
  }
};
