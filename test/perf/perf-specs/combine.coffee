Kefir = require('../../../dist/kefir.js')
Bacon = require('baconjs')



require('../perf-helper.coffee').setupTest 'stream.combine(Lib.once(1), fn)', {
  kefir: (stream) ->
    Kefir.combine([stream, Kefir.constant(1)], (a, b) -> a + b)
  bacon: (stream) ->
    stream.combine(Bacon.once(1), (a, b) -> a + b)
}
