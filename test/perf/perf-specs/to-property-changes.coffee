require('../perf-helper.coffee').setupTest 'stream.toProperty(1).changes()', {
  kefir: (stream) -> stream.toProperty(1).changes()
  bacon: (stream) -> stream.toProperty(1).changes()
}
