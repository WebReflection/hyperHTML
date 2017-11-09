const transformers = {};
const transformersKeys = [];
const hasOwnProperty = transformers.hasOwnProperty;

let length = 0;

export default {
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
