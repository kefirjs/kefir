require('../memory-helper.coffee').setupSpec '.delay(1)', {
  kefir: (stream) -> stream.delay(1)
  rx: (stream) -> stream.delay(1)
  bacon: (stream) -> stream.delay(1)
  provideBase: true
}
