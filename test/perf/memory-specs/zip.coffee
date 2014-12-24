require('../memory-helper.coffee').setupSpec 'stream1.zip(stream2, ->)', {
  kefir: (streams, Kefir) -> Kefir.zip(streams, ->)
  bacon: ([stream1, stream2]) -> stream1.zip(stream2, ->)
  provideNBases: 2
}
