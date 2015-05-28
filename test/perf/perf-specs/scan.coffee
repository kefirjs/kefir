flyd = require('flyd');

require('../perf-helper.coffee').setupTest 'stream.scan(0, (a, x) -> a + x)', {
  kefir: (stream) -> stream.scan(((a, x) -> a + x), 0)
  rx: (stream) -> stream.scan(0, (a, x) -> a + x)
  bacon: (stream) -> stream.scan(0, (a, x) -> a + x)
  flyd: (stream) -> flyd.scan(((a, x) -> a + x), 0, stream)
  getVal: -> 1
}
