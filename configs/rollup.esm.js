import base from './rollup.dev.js'
import stripCode from 'rollup-plugin-strip-code'

export default Object.assign({}, base, {
  format: 'es',
  plugins: [
    stripCode({
      start_comment: 'dev-code',
      end_comment: 'end-dev-code',
    }),
  ].concat(base.plugins),
  dest: 'dist/kefir.esm.js',
})
