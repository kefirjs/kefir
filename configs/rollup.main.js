import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import stripCode from 'rollup-plugin-strip-code'

const pkg = require('../package.json')

const banner = `/*! Kefir.js v${pkg.version}
 *  ${pkg.homepage}
 */
`

export default {
  moduleName: 'Kefir',
  entry: 'src/index.js',
  format: 'umd',
  banner: banner,
  plugins: [
    stripCode({
      start_comment: 'dev-code',
      end_comment: 'end-dev-code',
    }),
    babel({presets: ['es2015-loose-rollup']}),
    nodeResolve({main: true}),
    commonjs(),
  ],
  dest: 'dist/kefir.js',
}
