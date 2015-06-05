require('../perf-helper.coffee').setupTest 'just stream', {
  kefir: (stream) -> stream
  rx: (stream) -> stream
  bacon: (stream) -> stream
  flyd: (stream) -> stream
}
