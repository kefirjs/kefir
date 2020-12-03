import base from './rollup.main.js'

export default Object.assign({}, base, {
  format: 'es',
  dest: 'dist/kefir.esm.js',
})
