var fs = require('fs');
fs.writeFileSync(
  'index.js',
  fs.readFileSync('hyperhtml.js')
    .toString()
    .replace(/\/\*!([a-z-]+)\*\//g, function ($0, $1) {
      return  fs.readFileSync(require.resolve($1))
                .toString()
                .replace(/^.+?(function\s*\()/, ', $1')
                .replace(/(}\(\));[\s\S]*$/, '$1');
    })
);