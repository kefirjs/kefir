id = (x) -> x

require('../benchmark-helper.coffee').setupTest 'stream.filter(id)', {
  kefir: (stream) -> stream.filter(id)
  rx: (stream) -> stream.filter(id)
  bacon: (stream) -> stream.filter(id)
}
