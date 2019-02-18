import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'test/test.js',
  plugins: [
    resolve({module: true}),
    babel({presets: ["@babel/preset-env"]})
  ],
  context: 'null',
  moduleContext: 'null',
  output: {
    file: 'test/ie/test/test.js',
    format: 'iife'
  }
};
