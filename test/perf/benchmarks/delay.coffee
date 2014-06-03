require('../benchmark-helper.coffee').setupTest 'stream.delay(0)', {
  kefir: (stream) -> stream.delay(0)
  rx: (stream) -> stream.delay(0)
  bacon: (stream) -> stream.delay(0)
  async: true
}
