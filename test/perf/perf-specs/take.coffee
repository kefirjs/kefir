require('../perf-helper.coffee').setupTest 'stream.take(100000000000000)', {
  kefir: (stream) -> stream.take(100000000000000)
  rx: (stream) -> stream.take(100000000000000)
  bacon: (stream) -> stream.take(100000000000000)
}
