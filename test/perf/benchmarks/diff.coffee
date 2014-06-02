require('../benchmark-helper.coffee').setupTest 'stream.diff(0, (a, x) -> a + x)', {
  kefir: (stream) -> stream.diff(0, (a, x) -> a + x)
  # rx: (stream) -> stream.diff(0, (a, x) -> a + x)
  bacon: (stream) -> stream.diff(0, (a, x) -> a + x)
}
