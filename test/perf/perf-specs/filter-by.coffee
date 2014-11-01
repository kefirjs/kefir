Kefir = require('../../../dist/kefir.js')
Bacon = require('baconjs')

require('../perf-helper.coffee').setupTest 'stream.filter(constant(true))', {
  kefir: (stream) -> stream.filterBy(Kefir.constant(true))
  bacon: (stream) -> stream.filter(Bacon.constant(true))
}
