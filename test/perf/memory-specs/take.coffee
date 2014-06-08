require('../memory-helper.coffee').setupSpec '.take(5)', {
  kefir: (stream) -> stream.take(5)
  rx: (stream) -> stream.take(5)
  bacon: (stream) -> stream.take(5)
  provideBase: true
}
