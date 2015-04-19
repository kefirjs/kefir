## 2.0.0

### Breaking changes

 - Removed support of old transducers protocol in the `.transduce` (see [#79](https://github.com/pozadi/kefir/issues/79))
 - `stream.changes()` now returns a new stream with current values/errors removed (see [#56](https://github.com/pozadi/kefir/issues/56))
 - Properties now can't have both current value and current error at the same time (see [#55](https://github.com/pozadi/kefir/issues/55))
 - Better errors handling in `.combine` (see [#54](https://github.com/pozadi/kefir/issues/54))
 - The `.toProperty` method now accepts a callbak instead of a simple value (see [#82](https://github.com/pozadi/kefir/issues/82))
 - The `.fromEvent` method is renamed to `.fromEvents`
 - The `.fromBinder` method is renamed to `.stream`

### Other changes

 - The `.fromSubUnsub` method is deprecated (see [#71](https://github.com/pozadi/kefir/issues/71))


## 1.3.1 (2015-04-04)

 - The `.transduce` method updated to add support of new protocol (see [#78](https://github.com/pozadi/kefir/issues/78))


## 1.3.0 (2015-03-29)

 - Following methods are deprecated:
   `.repeatedly`, `.mapTo`, `.pluck`, `.invoke`, `.not`, `.timestamp`, `.tap`, `.and`, `.or`
   (see [#71](https://github.com/pozadi/kefir/issues/71))

## 1.2.0 (2015-03-14)

 - `Kefir.sampledBy` is deprecated in favor of 3 arity `Kefir.combine`

## 1.1.0 (2015-02-15)

 - The `Bus` and `Pool` classes are exposed as `Kefir.Bus` and `Kefir.Pool`
 - A bug in `.merge` and `.zip` (which may cause them to not unsubscribe from their sources in very rare cases) fixed
 - New method `.emitEvent` in Emitter, Emitter Object, and Bus
 - New method `Kefir.repeat`

## 1.0.0 (2015-01-31)

 - jQuery plugin moved to a [separate repo](https://github.com/pozadi/kefir-jquery)
 - Minor improvement in .skipDuplicates method [#42](https://github.com/pozadi/kefir/issues/42)
 - Deperecated method .withDefault now removed

## 0.5.3 (2015-01-12)

 - A bug in .fromBinder fixed (continuation of [#35](https://github.com/pozadi/kefir/issues/35))

## 0.5.2 (2015-01-12)

 - A bug in .fromBinder fixed [#35](https://github.com/pozadi/kefir/issues/35)

## 0.5.1 (2015-01-08)

 - Undocumented methods `.on/.off` renamed to `._on/._off`
 - The `.changes` method now can be called on a stream
 - The `.toProperty` method now can be called on a property, and works similar to `.withDefault`
 - The `.withDefault` method is now deprecated, and will be removed in the future
 - New method `.fromSubUnsub`
 - New method `.fromNodeCallback`
 - New method `.fromPromise`


## 0.5.0 (2015-01-06)

 - Base errors support added (i.e. errors flow through all kind of transformations/combinations)
 - Properties now may have a current error (as well as current value)
 - New method `.onError`
 - New method `.offError`
 - New method `.error` in Emitter, Emitter Object, and Bus
 - New method `Kefir.constantError`
 - New method `.mapErrors`
 - New method `.filterErrors`
 - New method `.endOnError`
 - New method `.errorsToValues`
 - New method `.valuesToErrors`
 - New method `.skipErrors`
 - New method `.skipValues`


## 0.4.2 (2014-12-24)

 - A bug in `.flatMap` fixed [#29](https://github.com/pozadi/kefir/issues/29)
 - Minor perf fixes

## 0.4.1 (2014-11-30)

 - New method `.bufferWhile`
 - New method `.bufferBy`
 - New method `.bufferWhileBy`
 - New method `.withDefault`
 - New method `.zip`


## 0.4.0 (2014-11-23)

 - The `seed` argument in `.scan`, `.reduce`, and `.diff` is now optional
 - Removed support of ["array functions"](https://github.com/pozadi/kefir/blob/2edf32a82d5b24ecb6ed99c9bcbd2391b91c8715/docs-src/descriptions/about-callbacks.jade)
 - The default `fn` in `obs.sampledBy(other, fn)` changed from `function(a, b) {return [a, b]}` to `function(a, b) {return a}`. The default `fn` for `Kefir.sampledBy` hasn't changed.
 - New method `.mapEnd`
 - New method `.skipEnd`
 - The `fn` argument in `.filter`, `.takeWhile`, and `.skipWhile` is now optional


## 0.3.0 (2014-11-19)

 - Removed undocumented feature of `.merge` and `.concat` that allowed to not wrap observables to array but pass them as individual arguments
 - Changed arguments order in `.scan`, `.reduce`, and `.diff`
 - Added support of on/off methods pair to `.fromEvent`
 - Removed undocumented support of bind/unbind pair from `.fromEvent`
 - Method `.waitFor` renamed to `.skipUntilBy`
 - New method `.takeUntilBy`
 - Method `source.flatMapFirst(fn)` now won't call `fn` when skiping values from `source`

## 0.2.11 (2014-11-03)

 - The `fn` argument of the `.diff` method is now optional
 - New method `.waitFor`
 - New method `.takeWhileBy`
 - New method `.skipWhileBy`


## 0.2.10 (2014-10-26)

 - Method `.transform` renamed to `.flatten`
 - New method `.slidingWindow`


## 0.2.9 (2014-10-19)

 - The `fn` argument of the `.transform` method is now optional
 - New method `.transduce`


## 0.2.8 (2014-10-12)

 - Method `.flatMapWithConcurrencyLimit` renamed to `.flatMapConcurLimit`
 - New method `.transform`
 - New method `.timestamp`
 - New method `Kefir.bus`


## 0.2.7 (2014-10-05)

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

