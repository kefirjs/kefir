id = (x) -> x

require('../perf-helper.coffee').setupTest 'stream.filter(id)', {
  kefir: (stream) -> stream.filter(id)
  rx: (stream) -> stream.filter(id)
  bacon: (stream) -> stream.filter(id)
}
