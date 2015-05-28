flyd = require('flyd');

id = (x) -> x

require('../perf-helper.coffee').setupTest 'stream.map(id)', {
  kefir: (stream) -> stream.map(id)
  rx: (stream) -> stream.map(id)
  bacon: (stream) -> stream.map(id)
  flyd: (stream) -> flyd.map(id, stream)
}
