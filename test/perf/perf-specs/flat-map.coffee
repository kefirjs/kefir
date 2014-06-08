Kefir = require('../../../dist/kefir.js')
Bacon = require('baconjs')

require('../perf-helper.coffee').setupTest 'stream.flatMap (x) -> Lib.once(x)', {
  kefir: (stream) ->
    stream.flatMap (x) -> Kefir.once(x)
  bacon: (stream) ->
    stream.flatMap (x) -> Bacon.once(x)
}
