Kefir = require('../../../dist/kefir.js')
Bacon = require('baconjs')



require('../perf-helper.coffee').setupTest 'a.combine([b], (a, b) -> a + b) where both `a` and `b` depends on `stream`', {
  kefir: (property) ->
    a = property.map (x) -> x + 1
    b = property.map (x) -> x + 2
    Kefir.combine([a, b], (a, b) -> a + b)
  bacon: (stream) ->
    a = stream.map (x) -> x + 1
    b = stream.map (x) -> x + 2
    a.combine(b, (a, b) -> a + b)
}
