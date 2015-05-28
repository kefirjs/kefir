Kefir = require('../../../dist/kefir.js')
Bacon = require('baconjs')
flyd = require('flyd');

require('../perf-helper.coffee').setupTest 'bus.plug(stream)', {
  kefir: (stream) ->
    pool = Kefir.pool()
    pool.plug(stream)
    pool
  bacon: (stream) ->
    bus = new Bacon.Bus()
    bus.plug(stream)
    bus
  flyd: (stream) ->
    s = flyd.stream()
    flyd.map(s, stream);
    s
}
