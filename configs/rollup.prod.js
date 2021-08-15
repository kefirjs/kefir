import base from './rollup.dev.js'
import uglify from 'rollup-plugin-uglify'
import stripCode from 'rollup-plugin-strip-code'

export default Object.assign({}, base, {
  plugins: [
    stripCode({
      start_comment: 'dev-code',
      end_comment: 'end-dev-code',
    }),
  ].concat(base.plugins.concat([uglify({output: {comments: /\!\s\w/}})])),
  dest: 'dist/kefir.min.js',
})
