require('../memory-helper.coffee').setupSpec '.flatMap(->)', {
  kefir: (stream) -> stream.flatMap(->)
  rx: (stream) -> stream.flatMap(->)
  bacon: (stream) -> stream.flatMap(->)
  provideBase: true
}
