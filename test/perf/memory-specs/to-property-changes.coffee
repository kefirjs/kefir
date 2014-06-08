require('../memory-helper.coffee').setupSpec '.toProperty(1).changes()', {
  kefir: (stream) -> stream.toProperty(1).changes()
  # rx: (stream) -> stream.publishValue(1).refCount()
  bacon: (stream) -> stream.toProperty(1).changes()
  provideBase: true
}
