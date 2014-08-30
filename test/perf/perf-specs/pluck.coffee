Kefir = require('../../../dist/kefir.js')
Bacon = require('baconjs')

require('../perf-helper.coffee').setupTest 'stream.pluck(\'foo\')', {
  kefir: (stream) -> stream.pluck('foo')
  bacon: (stream) -> stream.map('.foo')
}
