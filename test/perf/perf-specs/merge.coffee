Kefir = require('../../../dist/kefir.js')

require('../perf-helper.coffee').setupTest 'Kefir.merge(s,s,s,s)', {
  kefir: (s) -> Kefir.merge(s,s,s,s)
}
