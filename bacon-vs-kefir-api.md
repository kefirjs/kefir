## Comparison of public APIs of `Bacon v0.7.49` and `Kefir v1.1.0`



### Create Stream

| Bacon | Kefir | Comments |
| ----- | ----- | -------- |
| `$.fn.asEventStream(eventName, [selector], [eventTransformer])` | `$.fn.asKefirStream(eventName, [selector], [eventTransformer])` | In Kefir this method available not in core but in separate lib [kefir-jquery](https://github.com/pozadi/kefir-jquery) |
| `Bacon.fromPromise(promise, [abort])` | `Kefir.fromPromise(promise)` | No `abort` option in Kefir, and the result is a Property unlike Stream in Bacon |
| `Bacon.fromEvent(target, eventName, [eventTransformer])` | `Kefir.fromEvent(target, eventName, [eventTransformer])` |  |
| `Bacon.fromCallback(f, [args...])` | `Kefir.fromCallback(fn)` | No `args` argument in Kefir |
| `Bacon.fromCallback(object, methodName, [args...])` | No alt. |  |
| `Bacon.fromNodeCallback(f, [args...])` | `Kefir.fromNodeCallback(fn)` | No `args` argument in Kefir |
| `Bacon.fromNodeCallback(object, methodName, [args...])` | No alt. |  |
| `Bacon.fromPoll(interval, fn)` | `Kefir.fromPoll(interval, fn)` | In Kefir there is no feature "Polling ends permanently when f returns Bacon.End" |
| `Bacon.once(value)` | No alt., considered harmful, use `Kefir.constant(value)` instead |  |
| `Bacon.fromArray(values)` | No alt., considered harmful, try to use `Kefir.sequentially(0, values)` instead |  |
| `Bacon.interval(interval, value)` | `Kefir.interval(interval, value)` |  |
| `Bacon.sequentially(interval, values)` | `Kefir.sequentially(interval, values)` |  |
| `Bacon.repeatedly(interval, values)` | `Kefir.repeatedly(interval, values)` |  |
| `Bacon.repeat(fn)` | `Kefir.repeat(fn)` |  |
| `Bacon.never()` | `Kefir.never()` |  |
| `Bacon.later(delay, value)` | `Kefir.later(delay, value)` |  |
| `new Bacon.EventStream(subscribe)` | Use `Kefir.fromBinder` |  |
| Use bus | `Kefir.emitter()` |  |
| `Bacon.fromBinder(subscribe)` | `Kefir.fromBinder(subscribe)` | In Kefir [emitter object](https://pozadi.github.io/kefir/#emitter-object) used unlike `sink` function in Bacon. In Kefir there is no feature "The sink function may return Bacon.noMore ..." |
| No alt. | `Kefir.withInterval(interval, handler)` |  |
| No alt. | `Kefir.fromSubUnsub(subscribe, unsubscribe, [transform])` |  |



### Create Property

| Bacon | Kefir | Comments |
| ----- | ----- | -------- |
| No alt. | `$.fn.asKefirProperty(eventName, [selector], getter)` | Also from [kefir-jquery](https://github.com/pozadi/kefir-jquery) |
| `Bacon.constant(value)` | `Kefir.constant(value)` |  |
| No alt. | `Kefir.constantError(error)` | Bacon properties can't have current error, only values |
| `Bacon.fromPromise(promise, [abort])` | `Kefir.fromPromise(promise)` | This method was alredy mentioned in "Create Stream" section, duplicated here as Kefir's version returns a Property |


### Convert observables

| Bacon | Kefir | Comments |
| ----- | ----- | -------- |
| `property.changes()` | `property.changes()` |  |
| `property.toEventStream()` | No alt. |  |
| `stream.toProperty([current])` | `stream.toProperty([current])` |  |



### Main observable methods

| Bacon | Kefir | Comments |
| ----- | ----- | -------- |
| `obs.onValue(fn)` | `obs.onValue(fn)` | Kefir returns `this` for chaining, unlike Bacon that returns `unsubscribe` function. Also Kefir doesn't support feature of unsubscribing by return `noMore` special value. |
| `obs.onError(fn)` | `obs.onError(fn)` | Same as for `obs.onValue` |
| `obs.onEnd(fn)` | `obs.onEnd(fn)` | Same as for `obs.onValue` |
| `obs.subscribe(fn)` | `obs.onAny(fn)` | Same as for `obs.onValue`, plus there is differencies in event object API |
| Use `unsub` function, or `Bacon.noMore` | `obs.offValue(fn)` |  |
| Use `unsub` function, or `Bacon.noMore` | `obs.offError(fn)` |  |
| Use `unsub` function, or `Bacon.noMore` | `obs.offEnd(fn)` |  |
| Use `unsub` function, or `Bacon.noMore` | `obs.offAny(fn)` |  |
| `obs.log([name])` | `obs.log([name])` | The log format is different. Kefir returns `this` unlike Bacon, that returns `unusb` function |
| Use `unsub` function | `obs.offLog([name])` |  |
| `obs.name(newName)` | `obs.setName(newName)` |  |
| `observable.withDescription(param...)` | No alt.  |  |
| `property.assign(obj, method, [param...])` | No alt. | This is basically alias for `.onValue` and all magic done by [Function Construction rules](https://github.com/baconjs/bacon.js#function-construction-rules) which Kefir doesn't support |




### Modify an observable

| Bacon | Kefir | Comments |
| ----- | ----- | -------- |
| `obs.map(fn)` | `obs.map(fn)` |  |
| `obs.mapError(fn)` | `obs.errorsToValues(fn)` | In Kefir you supposed to return an object with shape `{convert: Bool, value: Any}`, in Bacon you return `Event`. |
| No alt. | `obs.mapErrors(fn)` | Just like `.map` but for errors. Doesn't convert errors to values or something. |
| `obs.errors()` | `obs.skipValues()` |  |
| `obs.skipErrors()` | `obs.skipErrors()` |  |
| No alt. | `obs.skipEnd()` |  |
| `obs.mapEnd(fn)` | `obs.mapEnd(fn)` |  |
| `obs.filter(predicate)` | `obs.filter(predicate)` |  |
| `obs.takeWhile(predicate)` | `obs.takeWhile(predicate)` |  |
| `obs.take(n)` | `obs.take(n)` |  |
| `obs.delay(delay)` | `obs.delay(delay)` |  |
| `obs.throttle(delay)` | `obs.throttle(delay, [options])` | Kefir accepts underscore-like options object |
| `obs.debounce(delay)` | `obs.debounce(delay, [options])` | Kefir accepts underscore-like options object |
| `obs.debounceImmediate(delay)` | `obs.debounce(delay, {immediate: true})` |  |
| `obs.bufferingThrottle(minimumInterval)` | No alt. |  |
| `obs.doAction(fn)` | `obs.tap(fn)` |  |
| `obs.not()` | `obs.not()` |  |
| `obs.scan(seed, fn)` | `obs.scan(fn, [seed])` | In Kefir, `seed` does second and optional. |
| `obs.reduce(seed, fn)` | `obs.reduce(fn, [seed])` | In Kefir, `seed` does second and optional. In Bacon there is also `.fold` alias for `.reduce` |
| `obs.diff(start, fn)` | `obs.diff([fn], [seed])` | In Kefir both args optional, and with different order. |
| `obs.slidingWindow(max, [min])` | `obs.slidingWindow(max, [min])` |  |
| `obs.map(value)` | `obs.mapTo(value)` | In Bacon the `value` can't be a function or an observable, as `.map` will handle them differently |
| `obs.map('.foo')` | `obs.pluck(propertyName)` |  |
| `obs.map('.foo')` where `foo` is a method | `obs.invoke(methodName)` |  |
| No alt. | `obs.timestamp()` |  |
| `obs.skip(n)` | `obs.skip(n)` |  |
| `obs.skipWhile(predicate)` | `obs.skipWhile([predicate])` | In Kefir `predicate` optional |
| `obs.skipDuplicates([comparator])` | `obs.skipDuplicates([comparator])` |  |
| No alt. | `obs.flatten([transformer])` |  |
| No alt. | `obs.transduce(transducer)` |  |
| No alt. | `obs.valuesToErrors([handler])` |  |
| No alt. | `obs.filterErrors([predicate])` |  |
| `obs.endOnError([predicate])` | `obs.endOnError()` | Bacon allows to provide predicate function to end only on certain errors  |
| `obs.withStateMachine(initState, f)` | No alt. |  |
| `obs.decode(mapping)` | No alt. |  |
| `obs.withHandler(handler)` | `obs.withHandler(handler)` | Same functionality but API (inside `handler`) is pretty different |
| `obs.startWith(value)` | No alt. |  |
| No alt. | `obs.bufferWhile([predicate], [options])` |  |
| `stream.bufferWithTime(delay)` | No alt. |  |
| `stream.bufferWithTime(f)` | No alt. |  |
| `stream.bufferWithCount(count)` | No alt. |  |
| `stream.bufferWithTimeOrCount(delay, count)` | No alt. |  |
| `property.sample(interval)` | No alt. |  |




### Combine observables

| Bacon | Kefir | Comments |
| ----- | ----- | -------- |
| `Bacon.combineAsArray(obss)`, `Bacon.combineWith(f, obs1, obs2...)` | `Kefir.combine(obss, [fn])` |  |
| `Bacon.combineTemplate(template)` | No alt. | |
| No alt. | `Kefir.and(obss)` | Bacon only supports two arity `.and` (see below) |
| No alt. | `Kefir.or(obss)` | Bacon only supports two arity `.or` (see below) |
| No alt. | `Kefir.sampledBy(passiveObss, activeObss, [fn])` | Bacon only supports two arity `.sampledBy` (see below) |
| `Bacon.zipAsArray(streams)`, `Bacon.zipWith(streams, f)` | `Kefir.zip(sources, [combinator])` | In Kefir you can also pass ordinary arrays among with observables in `sources` |
| `Bacon.mergeAll(streams)` | `Kefir.merge(obss)` |  |
| No alt. | `Kefir.concat(obss)` |  |
| `new Bacon.Bus()` | `Kefir.bus()` | In Kefir there is `emit` method unlike `push` in Bacon |
| Use bus | `Kefir.pool()` |  |
| `obs.flatMap(fn)` | `obs.flatMap([fn])` | In Kefir `fn` optional |
| `obs.flatMapLatest(fn)` | `obs.flatMapLatest([fn])` | In Kefir `fn` optional |
| `obs.flatMapFirst(fn)` | `obs.flatMapFirst([fn])` | In Kefir `fn` optional |
| `obs.flatMapError(fn)` | No alt. |  |
| `obs.flatMapWithConcurrencyLimit(limit, fn)` | `obs.flatMapConcurLimit([fn], limit)` | In Kefir `fn` optional, diff args order |
| `obs.flatMapConcat(fn)` | `obs.flatMapConcat([fn])` | In Kefir `fn` optional |
| `Bacon.onValues(a, b, [c...], f)` | No alt. |  |
| `Bacon.when()` | No alt. |  |
| `Bacon.update()` | No alt. |  |




### Combine two observables

| Bacon | Kefir | Comments |
| ----- | ----- | -------- |
| `stream.map(property)` | Use `.sampledBy()` |  |
| `obs.filter(property)` | `obs.filterBy(obs)` |  |
| `obs.takeWhile(property)` | `obs.takeWhileBy(obs)` | Bacon supports only Property in second position. See also `obs.takeWhile(predicate)` above. |
| `obs.combine(obs2, fn)` | `obs.combine(obs2, [fn])` | In Kefir `fn` optional |
| `stream.skipWhile(property)` | `obs.skipWhileBy(otherObs)` | Bacon supports only (Stream, Property) pair as operands. See also `obs.skipWhile(predicate)` above. |
| `stream.skipUntil(otherObs)` | `obs.skipUntilBy(otherObs)` | Bacon supports only Streams in first position. |
| `stream.takeUntil(otherObs) ` | `obs.takeUntilBy(otherObs)` | Bacon supports only Streams in first position. |
| No alt. | `obs.bufferBy(otherObs, [options])` |  |
| `obs.awaiting(otherObs)` | `obs.awaiting(otherObs)` |  |
| `obs.zip(other, fn)` | `obs.zip(other, [fn])` | In Kefir `fn` optional, and you can also pass array as `other` arg |
| `property.sampledBy(obs, [fn])` | `obs.sampledBy(obs, [fn])` |  |
| `property.and(other)` | `obs.and(other)` |  |
| `property.or(other)` | `obs.or(other)` |  |
| `stream.concat(otherStream)` | `obs.concat(otherObs)` | Bacon supports only streams? |
| `stream.merge(otherStream)` | `obs.merge(otherObs)` | Bacon supports only streams? |
| `stream.holdWhen(valve)` | `obs.bufferWhileBy(otherObs, [options])` | Bacon supports only streams? |



### Other features

| Bacon | Kefir | Comments |
| ----- | ----- | -------- |
| [Function Construction rules](https://github.com/baconjs/bacon.js#function-construction-rules) | Not supported |  |
| [Atomic updates](https://github.com/baconjs/bacon.js#atomic-updates) | Not supported |  |
| Meaningful `.toString` | Partial support | Kefir doesn't shows arguments only chain of method names |
| [Lazy evaluation](https://github.com/baconjs/bacon.js#lazy-evaluation) | Not supported |  |
