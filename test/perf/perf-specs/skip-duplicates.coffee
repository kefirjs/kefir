# eq = -> true

require('../perf-helper.coffee').setupTest 'stream.skipDuplicates()', {
  kefir: (stream) -> stream.skipDuplicates()
  rx: (stream) -> stream.distinctUntilChanged()
  bacon: (stream) -> stream.skipDuplicates()
}

i = 0

require('../perf-helper.coffee').setupTest 'stream.skipDuplicates(-> false)', {
  kefir: (stream) -> stream.skipDuplicates(-> false)
  rx: (stream) -> stream.distinctUntilChanged(-> ++i)
  bacon: (stream) -> stream.skipDuplicates(-> false)
}
