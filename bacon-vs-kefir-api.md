# Comparison of public APIs of `Bacon v0.7.49` and `Kefir v1.1.0`



### Create Stream

| Bacon | Kefir | Comments |
| ----- | ----- | -------- |
| `$.fn.asEventStream(eventName, [selector], [eventTransformer])` | `$.fn.asKefirStream(eventName, [selector], [eventTransformer])` | In Kefir this method available not in core but in separate lib [kefir-jquery](https://github.com/pozadi/kefir-jquery) |
| `Bacon.fromPromise(promise [, abort])` | `Kefir.fromPromise(promise)` | No `abort` option in Kefir, and the result is a Property unlike Stream in Bacon |
| `Bacon.fromEventTarget(target, eventName [, eventTransformer])` | `Kefir.fromEvent(target, eventName [, eventTransformer])` |  |
| `Bacon.fromCallback(f [, args...])` | `Kefir.fromCallback(fn)` | No `args` argument in Kefir |
| `Bacon.fromCallback(object, methodName [, args...])` | No alt., easy to do by yourself |  |
| `Bacon.fromNodeCallback(f [, args...])` | `Kefir.fromNodeCallback(fn)` | No `args` argument in Kefir |
| `Bacon.fromNodeCallback(object, methodName [, args...])` | No alt., easy to do by yourself |  |
| `Bacon.fromPoll(interval, fn)` | `Kefir.fromPoll(interval, fn)` | In Kefir there is no feature "Polling ends permanently when f returns Bacon.End" |
| `Bacon.once(value)` | No alt., considered harmful, use `Kefir.constant(value)` instead |  |
| `Bacon.fromArray(values)` | No alt., considered harmful, try to use `Kefir.sequentially(0, values)` instead |  |
| `Bacon.interval(interval, value)` | `Kefir.interval(interval, value)` |  |
| `Bacon.sequentially(interval, values)` | `Kefir.sequentially(interval, values)` |  |
| `Bacon.repeatedly(interval, values)` | `Kefir.repeatedly(interval, values)` |  |
| `Bacon.repeat(fn)` | `Kefir.repeat(fn)` |  |
| `Bacon.never()` | `Kefir.never()` |  |
| `Bacon.later(delay, value)` | `Kefir.later(delay, value)` |  |
| `new Bacon.EventStream(subscribe)` | No alt., is `Kefir.fromBinder(subscribe)` a worthy alternative? |  |
| use bus | `Kefir.emitter()` |  |
| `Bacon.fromBinder(subscribe)` | `Kefir.fromBinder(subscribe)` | In Kefir [emitter object](https://pozadi.github.io/kefir/#emitter-object) used unlike `sink` function in Bacon. In Kefir there is no feature "The sink function may return Bacon.noMore ..." |
| No alt. | `Kefir.withInterval(interval, handler)` |  |
| No alt. | `Kefir.fromSubUnsub(subscribe, unsubscribe, [transform])` |  |



### Create Property

| Bacon | Kefir | Comments |
| ----- | ----- | -------- |
| No alt., easy to do by yourself | `$.fn.asKefirProperty(eventName, [selector], getter)` | Also from [kefir-jquery](https://github.com/pozadi/kefir-jquery) |
| `Bacon.constant(value)` | `Kefir.constant(value)` |  |
| No alt. | `Kefir.constantError(error)` | Bacon properties can't have current error, only values |
| `Bacon.fromPromise(promise [, abort])` | `Kefir.fromPromise(promise)` | This method was alredy mentioned in "Create Stream" section, duplicated here as Kefir's version returns a Property |


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
| use `unsub` function, or `Bacon.noMore` | `obs.offValue(fn)` |  |
| use `unsub` function, or `Bacon.noMore` | `obs.offError(fn)` |  |
| use `unsub` function, or `Bacon.noMore` | `obs.offEnd(fn)` |  |
| use `unsub` function, or `Bacon.noMore` | `obs.offAny(fn)` |  |
| `obs.log([name])` | `obs.log([name])` | The log format is different. Kefir returns `this` unlike Bacon, that returns `unusb` function |
| use `unsub` function | `obs.offLog([name])` |  |
| `obs.name(newName)` | `obs.setName(newName)` |  |
| `observable.withDescription(param...)` | No alt.  |  |
| `property.assign(obj, method [, param...])` | No alt. | This is basically alias for `.onValue` and all magic done by [Function Construction rules](https://github.com/baconjs/bacon.js#function-construction-rules) which Kefir doesn't support |




### Modify an observable

| Bacon | Kefir | Comments |
| ----- | ----- | -------- |
| `obs.map(fn)` | `obs.map(fn)` |  |
| `obs.mapError(fn)` | `obs.errorsToValues(fn)` | In Kefir you supposed to return an object with shape `{convert: Bool, value: Any}`, in Bacon you return `Event`. In Kefir there is no way to chnage error content if you not converting it to a value. |
| No alt. | `obs.mapErrors(fn)` | Just like `.map` but for errors. Doesn't convert errors to values or something. |
| `obs.errors()` | `obs.skipValues()` |  |
| `obs.skipErrors()` | `obs.skipErrors()` |  |
| No alt. | `obs.skipEnd()` |  |
| `obs.mapEnd(fn)` | `obs.mapEnd(fn)` |  |
| `obs.filter(fn)` | `obs.filter(fn)` |  |
| `obs.takeWhile(fn)` | `obs.takeWhile(fn)` |  |
| `obs.take(n)` | `obs.take(n)` |  |
| `obs.delay(delay)` | `obs.delay(delay)` |  |
| `obs.throttle(delay)` | `obs.throttle(delay, [options])` | Kefir accepts underscore-like options object |
| `obs.debounce(delay)` | `obs.debounce(delay, [options])` | Kefir accepts underscore-like options object |
| `obs.debounceImmediate(delay)` | `obs.debounce(delay, {immediate: true})` |  |
| `obs.bufferingThrottle(minimumInterval)` | No alt. |  |
| `obs.doAction(fn)` | `obs.tap(fn)` |  |
| `obs.not()` | `obs.not()` |  |
| `obs.scan(seed, fn)` | `obs.scan(fn, [seed])` |  |
| `obs.reduce(seed, fn)` | `obs.reduce(fn, [seed])` | In Bacon there is also `.fold` alias for `.reduce` |
| `obs.diff(start, fn)` | `obs.diff([fn], [seed])` |  |
| `obs.slidingWindow(max [, min])` | `obs.slidingWindow(max [, min])` |  |
| `obs.map(value)` | `obs.mapTo(value)` | In Bacon the `value` can't be a function or an observable, as `.map` will handle them differently |
| `obs.map('.foo')` | `obs.pluck(propertyName)` |  |
| `obs.map('.foo')` where `foo` is a method | `obs.invoke(methodName)` |  |
| No alt. | `obs.timestamp()` |  |
| `obs.skip(n)` | `obs.skip(n)` |  |
| `obs.skipWhile(predicate)` | `obs.skipWhile([predicate])` |  |
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
| No alt. | `Kefir.and(obss)` |  |
| No alt. | `Kefir.or(obss)` |  |
| No alt. | `Kefir.sampledBy(passiveObss, activeObss, [fn])` |  |
| `Bacon.zipAsArray(streams)`, `Bacon.zipWith(streams, f)` | `Kefir.zip(sources, [combinator])` |  |
| `Bacon.mergeAll(streams)` | `Kefir.merge(obss)` |  |
| No alt. | `Kefir.concat(obss)` |  |
| `new Bacon.Bus()` | `Kefir.bus()` | In Kefir there is `emit` method unlike `push` in Bacon |
| use bus | `Kefir.pool()` |  |
| `obs.flatMap(fn)` | `obs.flatMap([fn])` |  |
| `obs.flatMapLatest(fn)` | `obs.flatMapLatest([fn])` |  |
| `obs.flatMapFirst(fn)` | `obs.flatMapFirst([fn])` |  |
| `obs.flatMapError(fn)` | No alt. |  |
| `obs.flatMapWithConcurrencyLimit(limit, fn)` | `obs.flatMapConcurLimit([fn], limit)` |  |
| `obs.flatMapConcat(fn)` | `obs.flatMapConcat([fn])` |  |
| `Bacon.onValues(a, b [, c...], f)` | No alt. |  |
| `Bacon.when()` | No alt. |  |
| `Bacon.update()` | No alt. |  |




### Combine two observables

| Bacon | Kefir | Comments |
| ----- | ----- | -------- |
| `stream.map(property)` | `property.sampledBy(stream)` |  |
| `obs.filter(property)` | `obs.filterBy(obs)` |  |
| `obs.takeWhile(property)` | `obs.takeWhileBy(obs)` |  |
| `obs.combine(obs2, fn)` | `obs.combine(obs2, [fn])` |  |
| `stream.skipWhile(property)` | `obs.skipWhileBy(otherObs)` |  |
| `stream.skipUntil(stream2)` | `obs.skipUntilBy(otherObs)` |  |
| `obs.takeUntil(stream) ` | `obs.takeUntilBy(otherObs)` |  |
| No alt. | `obs.bufferBy(otherObs, [options])` |  |
| `obs.awaiting(otherObs)` | `obs.awaiting(otherObs)` |  |
| `obs.zip(other, fn)` | `obs.zip(other, [fn])` | In Kefir you can also pass array as `other` arg |
| `property.sampledBy(obs, [fn])` | `obs.sampledBy(obs, [fn])` |  |
| `property.and(other)` | `obs.and(other)` |  |
| `property.or(other)` | `obs.or(other)` |  |
| `stream.concat(otherStream)` | `obs.concat(otherObs)` |  |
| `stream.merge(otherStream)` | `obs.merge(otherObs)` |  |
| `stream.holdWhen(valve)` | `obs.bufferWhileBy(otherObs, [options])` |  |



### Other features

| Bacon | Kefir | Comments |
| ----- | ----- | -------- |
| [Function Construction rules](https://github.com/baconjs/bacon.js#function-construction-rules) | Not supported |  |
| [Atomic updates](https://github.com/baconjs/bacon.js#atomic-updates) | Not supported |  |
| Meaningful `.toString` | Partial support | Kefir doesn't shows argumetns only chain of method names |
| [Lazy evaluation](https://github.com/baconjs/bacon.js#lazy-evaluation) | Not supported |  |
