require('../memory-helper.coffee').setupSpec '.filter(->)', {
  kefir: (stream) -> stream.filter(->)
  rx: (stream) -> stream.filter(->)
  bacon: (stream) -> stream.filter(->)
  provideBase: true
}
