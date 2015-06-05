Kefir = require('../../../dist/kefir.js')

id = (x) -> x
toConstant = (x) -> Kefir.constant(x)

fromArray = (arr) ->
  Kefir.stream ({emit, end}) ->
    for x in arr
      emit(x)
    end()

arr = [1..1000]


require('../perf-helper.coffee').setupTest 'A: s.flatten(fn), B: s.flatMap(fn)', {
  kefirA: (stream) -> stream.flatten(-> arr)
  kefirB: (stream) -> stream.flatMap(-> fromArray(arr))
}
