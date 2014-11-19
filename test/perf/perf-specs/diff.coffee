require('../perf-helper.coffee').setupTest 'stream.diff(0, (a, x) -> a + x)', {
  kefir: (stream) -> stream.diff(0, (a, x) -> a + x)
  kefirA: (stream) -> stream.diff(0)
  # rx: (stream) -> stream.diff(0, (a, x) -> a + x)
  bacon: (stream) -> stream.diff(0, (a, x) -> a + x)
  getVal: -> 1
}
