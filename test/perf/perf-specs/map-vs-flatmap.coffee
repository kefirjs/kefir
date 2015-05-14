Kefir = require('../../../dist/kefir.js')

id = (x) -> x
toConstant = (x) -> Kefir.constant(x)

require('../perf-helper.coffee').setupTest 'A: s.map(id), B: s.flatMap(toConstant)', {
  kefirA: (stream) -> stream.map(id)
  kefirB: (stream) -> stream.flatMap(toConstant)
}
