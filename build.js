#!/usr/bin/env node
var rollup = require('rollup').rollup;
var rts    = require('rollup-plugin-typescript');
var ts     = require('typescript');
var minify = require('uglify-js').minify;
var ruglify= require('rollup-plugin-uglify');
var chalk  = require('chalk');
var fs     = require('fs');

var cache;

rollup({
  entry: 'src/index.ts',
  cache: cache,
  external: ['commander','fs','chalk'],
  plugins: [
    rts({typescript: ts}),
    ruglify({}, minify)
  ]
}).then(bundle => {
  // Generate bundle + sourcemap
  var result = bundle.generate({
    // output format - 'amd', 'cjs', 'es', 'iife', 'umd'
    format: 'cjs'
  });

  // Cache our bundle for later use (optional)
  cache = bundle;

  fs.writeFileSync('sy', "#!/usr/bin/env node\n"+result.code);
  fs.chmodSync('sy', 0755);

  console.log(chalk.green("Build success"));
});