require('../benchmark-helper.coffee').setupTest 'stream.scan(0, (a, x) -> a + x)', {
  kefir: (stream) -> stream.scan(0, (a, x) -> a + x)
  rx: (stream) -> stream.scan(0, (a, x) -> a + x)
  bacon: (stream) -> stream.scan(0, (a, x) -> a + x)
}
