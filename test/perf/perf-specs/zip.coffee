Kefir = require('../../../dist/kefir.js')
Bacon = require('baconjs')


require('../perf-helper.coffee').setupTest 'a.zip([b], (a, b) -> a + b) where both `a` and `b` depends on `stream`', {
  kefir: (stream) ->
    a = stream.map (x) -> x + 1
    b = stream.map (x) -> x + 2
    Kefir.zip([a, b], (a, b) -> a + b)
  bacon: (stream) ->
    a = stream.map (x) -> x + 1
    b = stream.map (x) -> x + 2
    a.zip(b, (a, b) -> a + b)
  getVal: -> 1
}
