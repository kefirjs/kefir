Kefir = require('../../../dist/kefir.js')

require('../perf-helper.coffee').setupTest 'A: s.valuesToErrors(), B: s.flatMap(Kefir.constantError)', {
  kefirA: (stream) -> stream.valuesToErrors()
  kefirB: (stream) -> stream.flatMap(Kefir.constantError)
}


require('../perf-helper.coffee').setupTest 'A: s.valuesToErrors(fn), B: s.flatMap(fn)', {
  kefirA: (stream) -> stream.valuesToErrors((x) -> {convert: true, error: 1})
  kefirB: (stream) -> stream.flatMap((x) -> Kefir.constantError(1))
}

