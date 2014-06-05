require('../memory-helper.coffee').setupSpec '.skipDuplicates(->)', {
  kefir: (stream) -> stream.skipDuplicates(->)
  rx: (stream) -> stream.distinctUntilChanged(->)
  bacon: (stream) -> stream.skipDuplicates(->)
  provideBase: true
}
