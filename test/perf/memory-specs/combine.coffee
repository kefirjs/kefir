require('../memory-helper.coffee').setupSpec 'stream1.combine(stream2, ->)', {
  kefir: (streams, Kefir) -> Kefir.combine(streams, ->)
  rx: ([stream1, stream2]) -> stream1.combineLatest(stream2, ->)
  bacon: ([stream1, stream2]) -> stream1.combine(stream2, ->)
  provideNBases: 2
}
