require('../memory-helper.coffee').setupSpec '.throttle(1)', {
  kefir: (stream) -> stream.throttle(1)
  rx: (stream) -> stream.throttle(1)
  bacon: (stream) -> stream.throttle(1)
  provideBase: true
}
