import babel from 'rollup-plugin-babel';

export default {
  input: 'esm/index.js',
  plugins: [
    babel({
      plugins: require('./babel-plugins.json')
    })
  ],
  output: {
    exports: 'named',
    file: 'index.js',
    format: 'iife',
    name: 'hyperHTML'
  }
};
