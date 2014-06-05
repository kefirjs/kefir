require('../memory-helper.coffee').setupSpec '.later(0, 1)', {
  kefir: (Kefir) -> Kefir.later(0, 1)
  bacon: (Bacon) -> Bacon.later(0, 1)
}
