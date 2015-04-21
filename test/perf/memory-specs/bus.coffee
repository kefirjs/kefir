h = require('../memory-helper.coffee')

h.setupSpec 'bus vs pool', {
  kefir: (Kefir) -> Kefir.pool()
  bacon: (Bacon) -> new Bacon.Bus()
}
