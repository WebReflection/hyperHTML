import alias from 'rollup-plugin-alias';
import babel from 'rollup-plugin-babel';

export default {
  input: 'esm/main.js',
  plugins: [
    alias({
      'https://unpkg.com/majinbuu@latest/esm/main.js': 'node_modules/majinbuu/esm/main.js'
    }),
    babel({
      plugins: require('./babel-plugins.json')
    })
  ],
  output: {
    exports: 'named',
    file: 'index.v2.js',
    format: 'iife',
    name: 'hyperHTML'
  }
};