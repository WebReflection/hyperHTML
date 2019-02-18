## [babel-plugin-remove-ungap]

Remove the [@ungap ponyfill modules] from your bundle.  This will decrease the size of
your bundle if you are targeting modern browsers only or if your build already includes
other polyfills.  This has been tested with [hyperHTML] and [lighterhtml] bundles.


## [babel-plugin-template-html-minifier]

Run [html-minifier] on hyperHTML templates.


## [babel-plugin-bare-import-rewrite]

This can be used as an alternative to [rollup-plugin-node-resolve], or can be used with certain node.js
web servers to allow browsing live from source.

Known web server integrations:
* [fastify-babel] plugin for [fastify] enables running any babel plugins, generally expects `payload.filename` as set by [fastify-static]
* [express-transform-bare-module-specifiers] for [express] servers


## [vinyl-rollup]

This module copies the output of rollup builds to a stream of vinyl-fs objects for [gulp].
In addition it optionally adds files from modules that were bundled into the stream.  This
makes it easy to ensure that LICENSE and package.json files associated with bundled modules
are published on the web server without publishing node.js server-side dependencies to the web.
This can also be used to copy complete modules if required for licensing or if bundled code
requires additional assets that are not part of the bundled JS (images for example).


## [babel-plugin-bundled-import-meta]

If `node_modules/some-web-component/index.js` uses `import.meta.url` to calculate the actual
path to `node_modules/some-web-components/image.png`, rollup does not compensate. This babel
plugin rewrites references to `import.meta.url` so it points to the original location where
it is expected that the additional assets (images and such) can be found. This plugin works
well with `vinyl-rollup` with `copyModules: true`.


[babel-plugin-remove-ungap]: https://github.com/cfware/babel-plugin-remove-ungap#readme
[@ungap ponyfill modules]: https://github.com/ungap/ungap.github.io#readme
[hyperHTML]: https://github.com/WebReflection/hyperHTML#readme
[lighterhtml]: https://github.com/WebReflection/lighterhtml#readme
[babel-plugin-template-html-minifier]: https://github.com/cfware/babel-plugin-template-html-minifier#readme
[html-minifier]: https://github.com/kangax/html-minifier#readme
[babel-plugin-bare-import-rewrite]: https://github.com/cfware/babel-plugin-bare-import-rewrite#readme
[rollup-plugin-node-resolve]: https://github.com/rollup/rollup-plugin-node-resolve#readme
[fastify]: https://github.com/fastify/fastify#readme
[fastify-babel]: https://github.com/cfware/fastify-babel#readme
[fastify-static]: https://github.com/fastify/fastify-static#readme
[express-transform-bare-module-specifiers]: https://github.com/nodecg/express-transform-bare-module-specifiers#readme
[express]: https://github.com/expressjs/express#readme
[vinyl-rollup]: https://github.com/cfware/vinyl-rollup#readme
[gulp]: https://github.com/gulpjs/gulp#readme
[babel-plugin-bundled-import-meta]: https://github.com/cfware/babel-plugin-bundled-import-meta#readme
