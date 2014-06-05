require('../memory-helper.coffee').setupSpec 'new Bus()', {
  kefir: (Kefir) -> Kefir.bus()
  bacon: (Bacon) -> new Bacon.Bus()
}
