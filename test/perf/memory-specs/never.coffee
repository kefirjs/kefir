require('../memory-helper.coffee').setupSpec '.never()', {
  kefir: (Kefir) -> Kefir.empty()
  bacon: (Bacon) -> Bacon.never()
  rx: (Rx) -> Rx.Observable.never()
}
