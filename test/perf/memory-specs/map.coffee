require('../memory-helper.coffee').setupSpec '.map(->)', {
  kefir: (stream) -> stream.map(->)
  rx: (stream) -> stream.map(->)
  bacon: (stream) -> stream.map(->)
  provideBase: true
}
