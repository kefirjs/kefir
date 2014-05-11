# Bacon.js API implementation status

:rocket: — implemented

:bike: — partially implemented

:broken_heart: — not implemented




For detailed descriptions of features see
[Bacon.js documentation](https://github.com/baconjs/bacon.js/blob/master/README.md)


### Create Stream

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `$.asEventStream(eventName)` | :broken_heart: |  |
| `Bacon.fromPromise(promise [, abort])` | :broken_heart: |  |
| `Bacon.fromEventTarget(target, eventName [, eventTransformer])` | :broken_heart: |  |
| `Bacon.fromCallback(f [, args...])` | :broken_heart: |  |
| `Bacon.fromCallback(object, methodName [, args...])` | :broken_heart: |  |
| `Bacon.fromNodeCallback(f [, args...])` | :broken_heart: |  |
| `Bacon.fromNodeCallback(object, methodName [, args...])` | :broken_heart: |  |
| `Bacon.fromPoll(interval, f)` | :rocket: | `Kefir.fromPoll(interval, f)` |
| `Bacon.once(value)` | :rocket: | `Kefir.once(value)` |
| `Bacon.fromArray(values)` | :broken_heart: |  |
| `Bacon.interval(interval, value)` | :rocket: | `Kefir.interval(interval, value)` |
| `Bacon.sequentially(interval, values)` | :rocket: | `Kefir.sequentially(interval, values)` |
| `Bacon.repeatedly(interval, values)` | :rocket: | `Kefir.repeatedly(interval, values)` |
| `Bacon.never()` | :rocket: | `Kefir.never()` |
| `Bacon.later(delay, value)` | :broken_heart: |  |
| `new Bacon.EventStream(subscribe)` | :rocket: | `new Kefir.Stream(onFirstIn, onLastOut)` / `Kefir.fromBinder(subscribe)` |
| `property.changes()` | :rocket: | `property.changes()` |
| `property.toEventStream()` | :broken_heart: |  |
| `new Bacon.Bus()` | :rocket: | `new Kefir.Bus()` / `Kefir.bus()` |
| `Bacon.fromBinder(subscribe)` | :rocket: | `Kefir.fromBinder(subscribe)` |


### Methods of Stream/Property

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `observable.onValue(f)` | :rocket: | `observable.on(f)` |
| `observable.onError(f)` | :broken_heart: |  |
| `observable.onEnd(f)` | :rocket: | `observable.onEnd(f)` |
| `observable.map(f)` | :rocket: | `observable.map(f)` |
| `stream.map(property) / property.sampledBy(stream)` | :broken_heart: |  |
| `observable.mapError(f)` | :broken_heart: |  |
| `observable.errors()` | :broken_heart: |  |
| `observable.skipErrors()` | :broken_heart: |  |
| `observable.mapEnd(f)` | :broken_heart: |  |
| `observable.filter(f)` | :rocket: | `observable.filter(f)` |
| `observable.filter(property)` | :broken_heart: |  |
| `observable.takeWhile(f)` | :rocket: | `observable.takeWhile(f)` |
| `observable.takeWhile(property)` | :broken_heart: |  |
| `observable.take(n)` | :rocket: | `observable.take(n)` |
| `observable.takeUntil(stream)` | :broken_heart: |  |
| `observable.skip(n)` | :broken_heart: |  |
| `observable.delay(delay)` | :broken_heart: |  |
| `observable.throttle(delay)` | :broken_heart: |  |
| `observable.debounce(delay)` | :broken_heart: |  |
| `observable.debounceImmediate(delay)` | :broken_heart: |  |
| `observable.doAction(f)` | :broken_heart: |  |
| `observable.not()` | :broken_heart: |  |
| `observable.flatMap(f)` | :rocket: | `observable.flatMap(f)` |
| `observable.flatMapLatest(f)` | :broken_heart: |  |
| `observable.flatMapFirst(f)` | :broken_heart: |  |
| `observable.scan(seed, f)` | :broken_heart: |  |
| `observable.fold(seed, f) / observable.reduce(seed, f)` | :broken_heart: |  |
| `observable.diff(start, f)` | :broken_heart: |  |
| `observable.zip(other, f)` | :broken_heart: |  |
| `observable.slidingWindow(max [, min])` | :broken_heart: |  |
| `observable.log()` | :bike: | `observable.log()` |
| `observable.combine(property2, f)` | :rocket: | `observable.combine(streams, f)` |
| `observable.withStateMachine(initState, f)` | :broken_heart: |  |
| `observable.decode(mapping)` | :broken_heart: |  |
| `observable.awaiting(otherObservable)` | :broken_heart: |  |
| `observable.endOnError()` | :broken_heart: |  |
| `observable.endOnError(f)` | :broken_heart: |  |
| `observable.withHandler(f)` | :broken_heart: |  |
| `observable.name(newName)` | :broken_heart: |  |
| `observable.withDescription(param...)` | :broken_heart: |  |


### Methods of Stream

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `stream.subscribe(f)` | :broken_heart: |  |
| `stream.onValue(f)` | :rocket: | `stream.on(f)` |
| `stream.onValues(f)` | :broken_heart: |  |
| `stream.skipDuplicates(isEqual)` | :broken_heart: |  |
| `stream.concat(otherStream)` | :broken_heart: |  |
| `stream.merge(otherStream)` | :rocket: | `stream.merge(stream1[, stream2, ...])` / `stream.merge(streams)` |
| `stream.startWith(value)` | :broken_heart: |  |
| `stream.skipWhile(f)` | :broken_heart: |  |
| `stream.skipWhile(property)` | :broken_heart: |  |
| `stream.skipUntil(stream2)` | :broken_heart: |  |
| `stream.bufferWithTime(delay)` | :broken_heart: |  |
| `stream.bufferWithTime(f)` | :broken_heart: |  |
| `stream.bufferWithCount(count)` | :broken_heart: |  |
| `stream.bufferWithTimeOrCount(delay, count)` | :broken_heart: |  |
| `stream.toProperty()` | :rocket: | `stream.toProperty()` |
| `stream.toProperty(initialValue)` | :rocket: | `stream.toProperty(initialValue)` |



### Methods of Property

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `Bacon.constant(x)` | :broken_heart: |  |
| `property.subscribe(f)` | :broken_heart: |  |
| `property.onValue(f)` | :rocket: | `property.on(f)` |
| `property.onValues(f)` | :broken_heart: |  |
| `property.assign(obj, method [, param...])` | :broken_heart: |  |
| `property.sample(interval)` | :broken_heart: |  |
| `property.sampledBy(stream)` | :broken_heart: |  |
| `property.sampledBy(property)` | :broken_heart: |  |
| `property.sampledBy(streamOrProperty, f)` | :broken_heart: |  |
| `property.skipDuplicates(isEqual)` | :broken_heart: |  |
| `property.changes()` | :rocket: | `property.changes()` |
| `property.and(other)` | :broken_heart: |  |
| `property.or(other)` | :broken_heart: |  |
| `property.startWith(value)` | :broken_heart: |  |



### Combining multiple streams and properties

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `Bacon.combineAsArray(streams)` | :rocket: | `Kefir.combine(streams)` |
| `Bacon.combineAsArray(s1, s2...)` | :broken_heart: |  |
| `Bacon.combineWith(f, stream1, stream2...)` | :rocket: | `Kefir.combine(streams, f)`  |
| `Bacon.combineTemplate(template)` | :broken_heart: |  |
| `Bacon.mergeAll(streams)` | :rocket: | `Kefir.merge(streams)` / `Kefir.merge(stream1[, stream2, ...])` |
| `Bacon.zipAsArray(streams)` | :broken_heart: |  |
| `Bacon.zipAsArray(stream1, stream2...)` | :broken_heart: |  |
| `Bacon.zipWith(streams, f)` | :broken_heart: |  |
| `Bacon.zipWith(f, stream1, stream1...)` | :broken_heart: |  |
| `Bacon.onValues(a, b [, c...], f)` | :broken_heart: |  |



### Function Construction

https://github.com/baconjs/bacon.js/tree/master#function-construction-rules

:broken_heart:


### Bus

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `new Bacon.Bus()` | :rocket: | `new Kefir.Bus()` |
| `bus.push(x)` | :rocket: | `bus.push(x)` |
| `bus.end()` | :rocket: | `bus.end()` |
| `bus.error(e)` | :broken_heart: |  |
| `bus.plug(stream)` | :rocket: | `bus.plug(stream)` |



### Events, Errors

:broken_heart:



### Join Patterns

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `Bacon.when()` | :broken_heart: |  |
| `Bacon.update()` | :broken_heart: |  |



### Cleaning up

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| Return `Bacon.noMore` from the handler function | :rocket: | Return `Kefir.NO_MORE` ...  |
| Call the `dispose()` function that was returned by the `subscribe()` call | :bike: | `stream.off(f)` |



### Atomic updates

https://github.com/baconjs/bacon.js/tree/master#atomic-updates

:broken_heart:



### Glitch-free updates

https://github.com/baconjs/bacon.js/issues/272

:broken_heart:



### Meaningful toString

https://github.com/baconjs/bacon.js/issues/265

:bike:
