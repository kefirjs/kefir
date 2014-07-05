h = require('../memory-helper.coffee')

h.setupSpec 'bus vs emitter', {
  kefir: (Kefir) -> Kefir.emitter()
  bacon: (Bacon) -> new Bacon.Bus()
}

h.setupSpec 'bus vs pool', {
  kefir: (Kefir) -> Kefir.pool()
  bacon: (Bacon) -> new Bacon.Bus()
}
