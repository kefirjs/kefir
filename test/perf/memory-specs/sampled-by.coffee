# require('../memory-helper.coffee').setupSpec 'stream1.sampledBy(stream2, ->)', {
#   kefir: ([stream1, stream2]) -> stream1.sampledBy(stream2, ->)
#   # rx: ([stream1, stream2]) -> stream1.sampledBy(stream2, ->)
#   bacon: ([stream1, stream2]) -> stream1.sampledBy(stream2, ->)
#   provideNBases: 2
# }
