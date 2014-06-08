require('../memory-helper.coffee').setupSpec '.combineAsArray(s1, s2, s3, s4)', {
  kefir: (streams, Kefir) -> Kefir.combine(streams)
  rx: ([s1, s2, s3, s4], Rx) -> Rx.Observable.forkJoin(s1, s2, s3, s4)
  bacon: ([s1, s2, s3, s4], Bacon) -> Bacon.combineAsArray(s1, s2, s3, s4)
  provideNBases: 4
}
