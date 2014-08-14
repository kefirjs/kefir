helper = require('../perf-helper.coffee')

helper.setupTest 'stream.map(->)', {
  kefir: (stream) -> stream.map(->)
}

helper.setupTest 'stream.map(->, null, 1)', {
  kefir: (stream) -> stream.map([(->), null, 1])
}

helper.setupTest 'stream.map(->, {})', {
  kefir: (stream) -> stream.map([(->), {}])
}

helper.setupTest 'stream.map(->, {}, 0)', {
  kefir: (stream) -> stream.map([(->), {}, 0])
}

helper.setupTest 'stream.map(->, {}, 0, 1)', {
  kefir: (stream) -> stream.map([(->), {}, 0, 1])
}

helper.setupTest 'stream.map(->, {}, 0, 1, 2)', {
  kefir: (stream) -> stream.map([(->), {}, 0, 1, 2])
}

helper.setupTest 'stream.map(->, null, 0, 1, 2)', {
  kefir: (stream) -> stream.map([(->), null, 0, 1, 2])
}

helper.setupTest 'stream.map(->, null, 0, 1, 2, 3, 4, 5, 6)', {
  kefir: (stream) -> stream.map([(->), null, 0, 1, 2, 3, 4, 5, 6])
}

helper.setupTest 'stream.map(->, {}, 0, 1, 2, 3, 4, 5, 6)', {
  kefir: (stream) -> stream.map([(->), {}, 0, 1, 2, 3, 4, 5, 6])
}
