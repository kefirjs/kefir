var rollup = require('rollup').rollup
var babel = require('rollup-plugin-babel')
var uglify = require('rollup-plugin-uglify')
var nodeResolve = require('rollup-plugin-node-resolve')
var commonjs = require('rollup-plugin-commonjs')

function roll(plugins, bundlerOptions) {
  rollup({
    entry: 'src/index.js',
    plugins: plugins
  })
  .then(function (bundle) {
    return bundle.write(bundlerOptions).then(
      () => { console.log("OK:", bundlerOptions.dest) },
      () => { console.log("Error:", bundlerOptions.dest) }
    )
  })
}

function umd(dest, sourceMap) {
  return {
    format: 'umd',
    moduleName: 'Kefir',
    dest: dest,
    sourceMap: !!sourceMap
  }
}

roll([ babel(), nodeResolve({jsnext: true, main: true}), commonjs() ],
  umd('dist/kefir.js')
)

roll([ babel(), nodeResolve({jsnext: true, main: true}), commonjs(), uglify() ],
  umd('dist/kefir.min.js', true)
)
