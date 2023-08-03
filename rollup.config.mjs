import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'esm/index.js',
  plugins: [resolve({modulesOnly: true})],
  context: 'null',
  moduleContext: 'null',
  output: {
    exports: 'named',
    esModule: false,
    file: 'index.js',
    format: 'iife',
    name: 'hyperHTML'
  }
};
