require('../perf-helper.coffee').setupTest 'stream.mapTo(1)', {
  kefir: (stream) -> stream.mapTo(1)
  bacon: (stream) -> stream.map(1)
}
