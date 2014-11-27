## next

 - New method `.bufferWhile`
 - New method `.bufferBy`
 - New method `.withDefault`


## 0.4.0

 - The `seed` argument in `.scan`, `.reduce`, and `.diff` is now optional
 - Removed support of ["array functions"](https://github.com/pozadi/kefir/blob/2edf32a82d5b24ecb6ed99c9bcbd2391b91c8715/docs-src/descriptions/about-callbacks.jade)
 - The default `fn` in `obs.sampledBy(other, fn)` changed from `function(a, b) {return [a, b]}` to `function(a, b) {return a}`. The default `fn` for `Kefir.sampledBy` hasn't changed.
 - New method `.mapEnd`
 - New method `.skipEnd`
 - The `fn` argument in `.filter`, `.takeWhile`, and `.skipWhile` is now optional


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

