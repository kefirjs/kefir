Kefir = require('../../../dist/kefir.js')
Bacon = require('baconjs')

require('../perf-helper.coffee').setupTest 'bus.plug(stream)', {
  kefir: (stream) ->
    pool = Kefir.pool()
    pool.add(stream)
    pool
  bacon: (stream) ->
    bus = new Bacon.Bus()
    bus.plug(stream)
    bus
}
