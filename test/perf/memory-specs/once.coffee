require('../memory-helper.coffee').setupSpec '.once(i)', {
  kefir: (Kefir, i) -> Kefir.constant(i)
  bacon: (Bacon, i) -> Bacon.once(i)
}
