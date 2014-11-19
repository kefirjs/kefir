Kefir = require('../../../dist/kefir.js')
Bacon = require('baconjs')



require('../perf-helper.coffee').setupTest 'constant.sampledBy(stream)', {
  kefir: (stream) ->
    Kefir.constant(1).sampledBy(stream)
  bacon: (stream) ->
    Bacon.constant(1).sampledBy(stream)
}


require('../perf-helper.coffee').setupTest 'constant.sampledBy(stream, f)', {
  kefir: (stream) ->
    Kefir.constant(1).sampledBy(stream, (a, b) -> a + b)
  bacon: (stream) ->
    Bacon.constant(1).sampledBy(stream, (a, b) -> a + b)
  getVal: -> 1
}


require('../perf-helper.coffee').setupTest 'stream.sampledBy(stream)', {
  kefir: (stream) ->
    stream.sampledBy(stream)
  bacon: (stream) ->
    stream.sampledBy(stream)
}

