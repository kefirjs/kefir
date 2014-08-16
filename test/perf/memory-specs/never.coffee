require('../memory-helper.coffee').setupSpec '.never()', {
  kefir: (Kefir) -> Kefir.never()
  bacon: (Bacon) -> Bacon.never()
  rx: (Rx) -> Rx.Observable.never()
}
