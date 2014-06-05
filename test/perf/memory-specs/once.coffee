require('../memory-helper.coffee').setupSpec '.once(i)', {
  kefir: (Kefir, i) -> Kefir.once(i)
  bacon: (Bacon, i) -> Bacon.once(i)
}
