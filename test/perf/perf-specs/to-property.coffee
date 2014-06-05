require('../perf-helper.coffee').setupTest 'stream.toProperty(1)', {
  kefir: (stream) -> stream.toProperty(1)
  rx: (stream) -> stream.publishValue(1).refCount()
  bacon: (stream) -> stream.toProperty(1)
}
