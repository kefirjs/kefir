helper = require '../perf-helper.coffee'


id = (x) -> x

helper.setupTest 'see spec code ...', {
  kefir: (stream) -> stream.mapTo([1]).flatten()
  kefirA: (stream) -> stream.mapTo([1,2]).flatten()
  kefirB: (stream) -> stream.mapTo([1]).flatten(id)
  kefirC: (stream) -> stream.mapTo([1,2]).flatten(id)
}

