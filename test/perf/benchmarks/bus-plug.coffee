Kefir = require('../../../dist/kefir.js')
Bacon = require('baconjs')

require('../benchmark-helper.coffee').setupTest 'bus.plug(stream)', {
  kefir: (stream) ->
    bus = Kefir.bus()
    bus.plug(stream)
    bus
  bacon: (stream) ->
    bus = new Bacon.Bus()
    bus.plug(stream)
    bus
}
