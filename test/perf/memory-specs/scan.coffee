require('../memory-helper.coffee').setupSpec '.scan(0, ->)', {
  kefir: (stream) -> stream.scan(0, ->)
  rx: (stream) -> stream.scan(0, ->)
  bacon: (stream) -> stream.scan(0, ->)
  provideBase: true
}
