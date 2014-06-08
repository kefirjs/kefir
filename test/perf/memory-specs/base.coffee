require('../memory-helper.coffee').setupSpec 'very base stream', {
  kefir: (stream) -> stream
  rx: (stream) -> stream
  bacon: (stream) -> stream
  provideBaseOnEach: true
}
