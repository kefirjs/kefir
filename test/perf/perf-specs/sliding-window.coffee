require('../perf-helper.coffee').setupTest 'stream.slidingWindow(5)', {
  kefir: (stream) -> stream.slidingWindow(5)
  rx: (stream) -> stream.bufferWithCount(5, 1)
  bacon: (stream) -> stream.slidingWindow(5)
}
