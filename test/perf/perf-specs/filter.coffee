id = (x) -> x
flyd = require('flyd');
flydFilter = require('flyd-filter');

require('../perf-helper.coffee').setupTest 'stream.filter(id)', {
  kefir: (stream) -> stream.filter(id)
  rx: (stream) -> stream.filter(id)
  bacon: (stream) -> stream.filter(id)
  flyd: (stream) -> flydFilter(id, stream)
}
