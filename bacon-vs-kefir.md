# Comparison of Bacon.js and Kefir.js API

:rocket: — implemented

:bike: — partially implemented

:ghost: — not the same thing, but can be used instead

:broken_heart: — not implemented



For detailed descriptions of features see
[Bacon.js documentation](https://github.com/baconjs/bacon.js/blob/master/README.md)


### Create Stream

:point_up: There is no Streams in Kefir (only Properties), so if any methods
here marked as implemented it means that they are implemented but produces Properties.

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `$::asEventStream(eventName)` | :broken_heart: | |
| `Bacon.fromPromise(promise [, abort])` | :broken_heart: |  |
| `Bacon.fromEventTarget(target, eventName [, eventTransformer])` | :broken_heart: |  |
| `Bacon.fromCallback(f [, args...])` | :broken_heart: |  |
| `Bacon.fromCallback(object, methodName [, args...])` | :broken_heart: |  |
| `Bacon.fromNodeCallback(f [, args...])` | :broken_heart: |  |
| `Bacon.fromNodeCallback(object, methodName [, args...])` | :broken_heart: |  |
| `Bacon.fromPoll(interval, f)` | :rocket: | `Kefir.fromPoll(interval, f)` |
| `Bacon.once(value)` | :ghost: | `Kefir.constant(value)` |
| `Bacon.fromArray(values)` | :broken_heart: |  |
| `Bacon.interval(interval, value)` | :rocket: | `Kefir.interval(interval, value)` |
| `Bacon.sequentially(interval, values)` | :rocket: | `Kefir.sequentially(interval, values)` |
| `Bacon.repeatedly(interval, values)` | :rocket: | `Kefir.repeatedly(interval, values)` |
| `Bacon.never()` | :rocket: | `Kefir.empty()` |
| `Bacon.later(delay, value)` | :rocket: | `Kefir.later(delay, value)` |
| `new Bacon.EventStream(subscribe)` | :broken_heart: |  |
| `property.changes()` | :ghost: | `property.removeCurrent()` |
| `property.toEventStream()` | :broken_heart: |  |
| `new Bacon.Bus()` | :broken_heart: |  |
| `Bacon.fromBinder(subscribe)` | :rocket: | `Kefir.fromBinder(subscribe)` |


### Methods of Stream/Property

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `observable.onValue(f)` | :rocket: | `property.on('value', f)` / `property.watch('value', f)` |
| `observable.onError(f)` | :rocket: | `property.on('error', f)` / `property.watch('error', f)` |
| `observable.onEnd(f)` | :rocket: | `property.on('end', f)` |
| `observable.map(f)` | :rocket: | `property.map(f)` |
| `stream.map(property)` | :ghost: | `property1.sampledBy(property2)` |
| `observable.mapError(f)` | :broken_heart: |  |
| `observable.errors()` | :broken_heart: |  |
| `observable.skipErrors()` | :broken_heart: |  |
| `observable.mapEnd(f)` | :broken_heart: |  |
| `observable.filter(f)` | :rocket: | `property.filter(f)` |
| `observable.filter(property)` | :broken_heart: |  |
| `observable.takeWhile(f)` | :rocket: | `property.takeWhile(f)` |
| `observable.takeWhile(property)` | :broken_heart: |  |
| `observable.take(n)` | :rocket: | `property.take(n)` |
| `observable.takeUntil(stream)` | :broken_heart: |  |
| `observable.skip(n)` | :rocket: | `property.skip(n)` |
| `observable.delay(delay)` | :rocket: | `property.delay(delay)` |
| `observable.throttle(delay)` | :rocket: | `property.throttle(delay)` |
| `observable.debounce(delay)` | :broken_heart: |  |
| `observable.debounceImmediate(delay)` | :broken_heart: |  |
| `observable.doAction(f)` | :broken_heart: |  |
| `observable.not()` | :broken_heart: |  |
| `observable.flatMap(f)` | :rocket: | `property.flatMap(f)` |
| `observable.flatMapLatest(f)` | :rocket: | `property.flatMapLatest(f)` |
| `observable.flatMapFirst(f)` | :broken_heart: |  |
| `observable.scan(seed, f)` | :rocket: | `property.scan(seed, f)` |
| `observable.fold(seed, f) / observable.reduce(seed, f)` | :rocket: | `property.reduce(seed, f)` |
| `observable.diff(start, f)` | :rocket: | `property.diff(start, f)` |
| `observable.zip(other, f)` | :broken_heart: |  |
| `observable.slidingWindow(max [, min])` | :broken_heart: |  |
| `observable.log()` | :rocket: | `property.log()` |
| `observable.combine(property2, f)` | :rocket: |  `property1.combine(property2, f)` |
| `observable.withStateMachine(initState, f)` | :broken_heart: |  |
| `observable.decode(mapping)` | :broken_heart: |  |
| `observable.awaiting(otherObservable)` | :broken_heart: |  |
| `observable.endOnError()` | :broken_heart: |  |
| `observable.endOnError(f)` | :broken_heart: |  |
| `observable.withHandler(f)` | :broken_heart: |  |
| `observable.name(newName)` | :broken_heart: |  |
| `observable.withDescription(param...)` | :broken_heart: |  |


### Methods of Stream

:point_up: of Property in Kefir

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `stream.subscribe(f)` | :broken_heart: |  |
| `stream.onValue(f)` | :rocket: | `property.on('value', f)` |
| `stream.onValues(f)` | :broken_heart: |  |
| `stream.skipDuplicates(isEqual)` | :rocket: | `property.skipDuplicates(isEqual)` |
| `stream.concat(otherStream)` | :broken_heart: |  |
| `stream.merge(otherStream)` | :rocket: | `property1.merge(property2)` |
| `stream.startWith(value)` | :ghost: | `property.addCurrent('value', value)` |
| `stream.skipWhile(f)` | :rocket: | `property.skipWhile(f)` |
| `stream.skipWhile(property)` | :broken_heart: |  |
| `stream.skipUntil(stream2)` | :broken_heart: |  |
| `stream.bufferWithTime(delay)` | :broken_heart: |  |
| `stream.bufferWithTime(f)` | :broken_heart: |  |
| `stream.bufferWithCount(count)` | :broken_heart: |  |
| `stream.bufferWithTimeOrCount(delay, count)` | :broken_heart: |  |
| `stream.toProperty()` | :broken_heart: |  |
| `stream.toProperty(initialValue)` | :ghost: | `property.addCurrent('value', initialValue)` |



### Methods of Property

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `Bacon.constant(x)` | :rocket: | `Kefir.constant(x)` |
| `property.subscribe(f)` | :broken_heart: |  |
| `property.onValue(f)` | :rocket: | `property.watch('value', f)` |
| `property.onValues(f)` | :broken_heart: |  |
| `property.assign(obj, method [, param...])` | :ghost: | `property.watch('value', [method, obj, param...])` |
| `property.sample(interval)` | :ghost: | `property.sampledBy(Kefir.interval(interval))` |
| `property.sampledBy(stream)` | :rocket: | `property1.sampledBy(property2)` |
| `property.sampledBy(property)` | :rocket: | `property1.sampledBy(property2)` |
| `property.sampledBy(streamOrProperty, f)` | :rocket: | `property1.sampledBy(property2)` |
| `property.skipDuplicates(isEqual)` | :rocket: | `property.skipDuplicates(isEqual)` |
| `property.changes()` |  :ghost: | `property.removeCurrent()` |
| `property.and(other)` | :broken_heart: |  |
| `property.or(other)` | :broken_heart: |  |
| `property.startWith(value)` | :ghost: | `property.addCurrent('value', value)` |



### Combining multiple streams and properties

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `Bacon.combineAsArray(streams)` | :rocket: | `Kefir.combine(properties)` |
| `Bacon.combineAsArray(s1, s2...)` | :ghost: | `Kefir.combine([p1, p2...])` |
| `Bacon.combineWith(f, stream1, stream2...)` | :rocket: | `Kefir.combine(properties, f)`  |
| `Bacon.combineTemplate(template)` | :ghost: | `Kefir.combine([a, b, c], function(a, b, c) { /* build template here */ })` |
| `Bacon.mergeAll(streams)` | :rocket: | `Kefir.merge(properties)` / `Kefir.merge(prop1, prop2, ...)` |
| `Bacon.zipAsArray(streams)` | :broken_heart: |  |
| `Bacon.zipAsArray(stream1, stream2...)` | :broken_heart: |  |
| `Bacon.zipWith(streams, f)` | :broken_heart: |  |
| `Bacon.zipWith(f, stream1, stream1...)` | :broken_heart: |  |
| `Bacon.onValues(a, b [, c...], f)` | :broken_heart: |  |



### Function Construction

https://github.com/baconjs/bacon.js/tree/master#function-construction-rules

:ghost:

Everywhere :hushed: in Kefir where you pass function you can also pass an array
`[fn, thisContext, arg1, arg2...]`.
And in that array you can pass method name instead of actual method for example:
`['foo', obj]` is equivalent of `[obj.foo, obj]`.


### Bus

:ghost: use `Kefir.pool()` or `Kefir.emitter()` if you need `bus` functionality

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `new Bacon.Bus()` | :ghost: | `Kefir.pool()` or `Kefir.emitter()` |
| `bus.push(x)` | :rocket: | `emitter.emit('value', x)` |
| `bus.error(e)` | :rocket: | `emitter.emit('error', e)` |
| `bus.end()` | :rocket: | `emitter.emit('end')` |
| `bus.plug(stream)` | :rocket: | `pool.add(property)` |
| `bus.unplug(stream)` | :rocket: | `pool.remove(property)` |



### Events, Errors

:bike:



### Join Patterns

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `Bacon.when()` | :broken_heart: |  |
| `Bacon.update()` | :broken_heart: |  |



### Cleaning up

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| Return `Bacon.noMore` from the handler function | :broken_heart: |   |
| Call the `dispose()` function that was returned by the `subscribe()` call | :ghost: | `stream.off(type, f)` |



### Atomic updates

https://github.com/baconjs/bacon.js/tree/master#atomic-updates

:broken_heart:



### Glitch-free updates

https://github.com/baconjs/bacon.js/issues/272

:broken_heart:



### Meaningful toString

https://github.com/baconjs/bacon.js/issues/265

:bike:



### :fire: Only in Kefir

 - properties has not only current values, but also current errors
 - you can get current value/error without sunscribing via `property.get('value')` / `property.get('error')`
 - you can choose to get current value/error in listener or to subscribe only for changes (use `property.on()` for changes, and `property.watch()` for current value and changes)
