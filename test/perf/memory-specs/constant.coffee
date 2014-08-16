require('../memory-helper.coffee').setupSpec '.constant(i)', {
  kefir: (Kefir, i) -> Kefir.constant(i)
  bacon: (Bacon, i) -> Bacon.constant(i)
}
