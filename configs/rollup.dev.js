import base from './rollup.main.js'

export default Object.assign({}, base, {
  dest: 'dist/kefir.dev.js',
  plugins: base.plugins.filter(plugin => plugin.name !== 'stripCode'),
})
