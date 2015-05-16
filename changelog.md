## Next

 - [emitter](http://pozadi.github.io/kefir/#emitter-object) methods now return a boolean representing whether anybody interested in future events (i.e. whether connected observable is active)
 - Another optimization for `.flatMap((x) => Kefir.constan(...))` case (see [9e4a58a](https://github.com/pozadi/kefir/commit/9e4a58a02ec5f80b3c3c6cf52e5e5065249aba50))

## 2.4.1 (14/05/2015)

 - `.flatMap*`, `.pool`, and `.merge` was optimized for use with constants (`Kefir.contant*`, `Kefir.never`), combined with optimizations for constants in 2.4.0 this `foo.flatMap((x) => Kefir.constant(x + 1))` is only ~2x slower than `foo.map(x => x + 1)`

## 2.4.0 (11/05/2015)

 - New method `.flatMapErrors`
 - A bug in `.flatMap*` fixed (see [98f65b7](https://github.com/pozadi/kefir/commit/98f65b775e2a9785bb66fa1f4a98ffc9bd03b9ff))
 - `Kefir.constant()` and `Kefir.contantError()` made cheaper and faster, so they can be used with `.flatMap` even more freely (see [1c9de75](https://github.com/pozadi/kefir/commit/1c9de75aa7ed38949716b9d117b430587bd3425c))

## 2.3.0 (10/05/2015)

 - New method `.toPromise`

## 2.2.1 (09/05/2015)

 - A bug in `.offLog` fixed

## 2.2.0 (08/05/2015)

 - Codebase ported to ES6 (Babel) with CommonJS modules
 - A bug in .combine fixed (see [#98](https://github.com/pozadi/kefir/issues/98))

## 2.1.0 (28/04/2015)

 - New method `.last`
 - The `.reduce` method is deprecated in favor of `.scan(...).last()`

## 2.0.2 (26/04/2015)

No changes.

## 2.0.1 (26/04/2015)

 - A bug in `.flatMap` fixed (see [#92](https://github.com/pozadi/kefir/issues/92))

## 2.0.0 (22/04/2015)

### Breaking changes

 - Removed support of old transducers protocol in the `.transduce` (see [#79](https://github.com/pozadi/kefir/issues/79))
 - `stream.changes()` now returns a new stream with current values/errors removed (see [#56](https://github.com/pozadi/kefir/issues/56))
 - Properties now can't have both current value and current error at the same time (see [#55](https://github.com/pozadi/kefir/issues/55))
 - Better errors handling in `.combine` (see [#54](https://github.com/pozadi/kefir/issues/54))
 - The `.toProperty` method now accepts a callbak instead of a simple value (see [#82](https://github.com/pozadi/kefir/issues/82))
 - The `.fromEvent` method is renamed to `.fromEvents`
 - The `.fromBinder` method is renamed to `.stream`
 - The `.mapEnd` method is renamed to `.beforeEnd` (see [#89](https://github.com/pozadi/kefir/issues/89))

### Other changes

 - The `.fromSubUnsub` method is deprecated (see [#71](https://github.com/pozadi/kefir/issues/71))
 - Methods `Kefir.emitter()` and `Kefir.bus()` are deprecated (see [#88](https://github.com/pozadi/kefir/issues/88))

## 1.3.2 (26/04/2015)

 - A bug in `.flatMap` fixed (see [#92](https://github.com/pozadi/kefir/issues/92))

## 1.3.1 (04/04/2015)

 - The `.transduce` method updated to add support of new protocol (see [#78](https://github.com/pozadi/kefir/issues/78))


## 1.3.0 (29/03/2015)

 - Following methods are deprecated:
   `.repeatedly`, `.mapTo`, `.pluck`, `.invoke`, `.not`, `.timestamp`, `.tap`, `.and`, `.or`
   (see [#71](https://github.com/pozadi/kefir/issues/71))

## 1.2.0 (14/03/2015)

 - `Kefir.sampledBy` is deprecated in favor of 3 arity `Kefir.combine`

## 1.1.0 (15/02/2015)

 - The `Bus` and `Pool` classes are exposed as `Kefir.Bus` and `Kefir.Pool`
 - A bug in `.merge` and `.zip` (which may cause them to not unsubscribe from their sources in very rare cases) fixed
 - New method `.emitEvent` in Emitter, Emitter Object, and Bus
 - New method `Kefir.repeat`

## 1.0.0 (31/01/2015)

 - jQuery plugin moved to a [separate repo](https://github.com/pozadi/kefir-jquery)
 - Minor improvement in .skipDuplicates method [#42](https://github.com/pozadi/kefir/issues/42)
 - Deperecated method .withDefault now removed

## 0.5.3 (12/01/2015)

 - A bug in .fromBinder fixed (continuation of [#35](https://github.com/pozadi/kefir/issues/35))

## 0.5.2 (12/01/2015)

 - A bug in .fromBinder fixed [#35](https://github.com/pozadi/kefir/issues/35)

## 0.5.1 (08/01/2015)

 - Undocumented methods `.on/.off` renamed to `._on/._off`
 - The `.changes` method now can be called on a stream
 - The `.toProperty` method now can be called on a property, and works similar to `.withDefault`
 - The `.withDefault` method is now deprecated, and will be removed in the future
 - New method `.fromSubUnsub`
 - New method `.fromNodeCallback`
 - New method `.fromPromise`


## 0.5.0 (06/01/2015)

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


## 0.4.2 (24/12/2014)

 - A bug in `.flatMap` fixed [#29](https://github.com/pozadi/kefir/issues/29)
 - Minor perf fixes

## 0.4.1 (30/11/2014)

 - New method `.bufferWhile`
 - New method `.bufferBy`
 - New method `.bufferWhileBy`
 - New method `.withDefault`
 - New method `.zip`


## 0.4.0 (23/11/2014)

 - The `seed` argument in `.scan`, `.reduce`, and `.diff` is now optional
 - Removed support of ["array functions"](https://github.com/pozadi/kefir/blob/2edf32a82d5b24ecb6ed99c9bcbd2391b91c8715/docs-src/descriptions/about-callbacks.jade)
 - The default `fn` in `obs.sampledBy(other, fn)` changed from `function(a, b) {return [a, b]}` to `function(a, b) {return a}`. The default `fn` for `Kefir.sampledBy` hasn't changed.
 - New method `.mapEnd`
 - New method `.skipEnd`
 - The `fn` argument in `.filter`, `.takeWhile`, and `.skipWhile` is now optional


## 0.3.0 (19/11/2014)

 - Removed undocumented feature of `.merge` and `.concat` that allowed to not wrap observables to array but pass them as individual arguments
 - Changed arguments order in `.scan`, `.reduce`, and `.diff`
 - Added support of on/off methods pair to `.fromEvent`
 - Removed undocumented support of bind/unbind pair from `.fromEvent`
 - Method `.waitFor` renamed to `.skipUntilBy`
 - New method `.takeUntilBy`
 - Method `source.flatMapFirst(fn)` now won't call `fn` when skiping values from `source`

## 0.2.11 (03/11/2014)

 - The `fn` argument of the `.diff` method is now optional
 - New method `.waitFor`
 - New method `.takeWhileBy`
 - New method `.skipWhileBy`


## 0.2.10 (26/10/2014)

 - Method `.transform` renamed to `.flatten`
 - New method `.slidingWindow`


## 0.2.9 (19/10/2014)

 - The `fn` argument of the `.transform` method is now optional
 - New method `.transduce`


## 0.2.8 (12/10/2014)

 - Method `.flatMapWithConcurrencyLimit` renamed to `.flatMapConcurLimit`
 - New method `.transform`
 - New method `.timestamp`
 - New method `Kefir.bus`


## 0.2.7 (05/10/2014)

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

