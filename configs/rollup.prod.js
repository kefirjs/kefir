import base from './rollup.main.js'
import uglify from 'rollup-plugin-uglify'

export default Object.assign({}, base, {
  plugins: base.plugins.concat([uglify({output: {comments: /\!\s\w/}})]),
  dest: 'dist/kefir.min.js',
})
