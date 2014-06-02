id = (x) -> x

require('../benchmark-helper.coffee').setupTest 'stream.map(id)', {
  kefir: (stream) -> stream.map(id)
  rx: (stream) -> stream.map(id)
  bacon: (stream) -> stream.map(id)
}
