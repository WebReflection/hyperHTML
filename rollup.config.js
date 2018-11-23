import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'esm/index.js',
  plugins: [
    resolve({
      module: true
    }),
    babel({
      plugins: require('./babel-plugins.json')
    })
  ],
  context: 'null',
  moduleContext: 'null',
  output: {
    exports: 'named',
    file: 'index.js',
    format: 'iife',
    name: 'hyperHTML'
  }
};
