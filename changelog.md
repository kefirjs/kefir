## 0.3.0

 - Removed undocumented feature of `.merge` and `.concat` that allowed to not wrap observables to array but pass them as individual arguments
 - Changed arguments order in `.scan`, `.reduce`, and `.diff`
 - Added support of on/off methods pair to `.fromEvent`
 - Removed undocumented support of bind/unbind pair from `.fromEvent`
 - Method `.waitFor` renamed to `.skipUntilBy`
 - New method `.takeUntilBy`
 - Method `source.flatMapFirst(fn)` now won't call `fn` when skiping values from `source`

## 0.2.11

 - The `fn` argument of the `.diff` method is now optional
 - New method `.waitFor`
 - New method `.takeWhileBy`
 - New method `.skipWhileBy`


## 0.2.10

 - Method `.transform` renamed to `.flatten`
 - New method `.slidingWindow`


## 0.2.9

 - The `fn` argument of the `.transform` method is now optional
 - New method `.transduce`


## 0.2.8

 - Method `.flatMapWithConcurrencyLimit` renamed to `.flatMapConcurLimit`
 - New method `.transform`
 - New method `.timestamp`
 - New method `Kefir.bus`


## 0.2.7

Methods so far:

  - Kefir.emitter
  - Kefir.never
  - Kefir.later
  - Kefir.interval
  - Kefir.sequentially
  - Kefir.repeatedly
  - Kefir.fromPoll
  - Kefir.withInterval
  - Kefir.fromCallback
  - Kefir.fromEvent
  - Kefir.fromBinder
  - Kefir.constant
  - jQuery::asKefirStream
  - jQuery::asKefirProperty
  - .toProperty
  - .changes
  - .onValue
  - .offValue
  - .onEnd
  - .offEnd
  - .onAny
  - .offAny
  - .log
  - .offLog
  - .map
  - .mapTo
  - .pluck
  - .invoke
  - .not
  - .tap
  - .filter
  - .take
  - .takeWhile
  - .skip
  - .skipWhile
  - .skipDuplicates
  - .diff
  - .scan
  - .reduce
  - .delay
  - .throttle
  - .debounce
  - .withHandler
  - .combine
  - .and
  - .or
  - .sampledBy
  - .merge
  - .concat
  - .pool
  - .flatMap
  - .flatMapLatest
  - .flatMapFirst
  - .flatMapConcat
  - .flatMapWithConcurrencyLimit
  - .awating
  - .filterBy

