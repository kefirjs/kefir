# require('../memory-helper.coffee').setupSpec '.mergeAll(s1, s2, s3, s4)', {
#   kefir: (streams, Kefir) -> Kefir.merge(streams)
#   rx: ([s1, s2, s3, s4], Rx) -> Rx.Observable.merge(s1, s2, s3, s4)
#   bacon: ([s1, s2, s3, s4], Bacon) -> Bacon.mergeAll(s1, s2, s3, s4)
#   provideNBases: 4
# }
