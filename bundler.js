var fs = require('fs');
var log = require('tressa').log;

if (process.argv.pop() === 'dependencies') {
  log('# Augmenting ' + require('./package.json').name);
  fs.writeFileSync(
    'index.js',
    fs.readFileSync('hyperhtml.js')
      .toString()
      .replace(/\/\*!([a-z-]+)\*\//g, function ($0, $1) {
        log(' module ' + $1);
        return  fs.readFileSync(require.resolve($1))
                  .toString()
                  .replace(/^.+?(function\s*\()/, ', $1')
                  .replace(/(}\(\));[\s\S]*$/, '$1')
                  // the following majinbuu parts cannot be covered in here
                  // however, these are covered in majinbuu project itself
                  .replace(/(\s+)if \(toLength \|\| TOO_MANY\) \{/, '$1/* istanbul ignore next */$1if (toLength || TOO_MANY) {')
                  .replace(/(\s+)if \(length\) \{/, '$1/* istanbul ignore else */$1if (length) {');
      })
  );
} else {
  log('# Bundling ' + require('./package.json').name);
  var defaultExport = function () {
    return /try\s*\{\s*module\.exports\s*=\s*([0-9a-zA-Z_$]+);?\s*\}\s*catch\(.+?\)\s*\{\s*\}/;
  };
  var source = fs.readFileSync('index.js').toString();
  var exports = ['export default $;'].concat([
    'adopt',
    'bind',
    'define',
    'escape',
    'hyper',
    'wire',
    'Component'
  ].map(function (name) {
    return 'export const ' + name + '=$.' + name + ';';
  }));
  function writeFile(name, moduleName, content) {
    fs.writeFileSync(
      name,
      content.replace(defaultExport(), '')
            .replace(new RegExp('var ' + moduleName + '(\\s*=)'), function ($0, $1) { return 'var $' + $1; }) +
            `\n` + exports.join('\n')
    );
  }
  if (defaultExport().test(source)) {
    var moduleName = RegExp.$1;
    log(' creating index.mjs');
    writeFile('index.mjs', moduleName, source);
  }
  var source = fs.readFileSync('min.js').toString();
  if (defaultExport().test(source)) {
    var moduleName = RegExp.$1;
    log(' creating min.mjs');
    writeFile('min.mjs', moduleName, source);
  }
}