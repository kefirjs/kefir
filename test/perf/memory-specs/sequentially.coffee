require('../memory-helper.coffee').setupSpec '.sequentially(0, [1, 2])', {
  kefir: (Kefir) -> Kefir.sequentially(0, [1, 2])
  bacon: (Bacon) -> Bacon.sequentially(0, [1, 2])
}
