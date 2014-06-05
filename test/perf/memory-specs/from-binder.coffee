require('../memory-helper.coffee').setupSpec '.fromBinder(->)', {
  kefir: (Kefir) -> Kefir.fromBinder(->)
  bacon: (Bacon) -> Bacon.fromBinder(->)
}
