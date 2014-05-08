# Bacon.js API implementation status

:rocket: — already implemented

:bike: — partially implemented

:+1: — will be implemented most likely

:question: — maybe will be implemented, maybe not

:broken_heart: — probably will not be implemented



For detailed descriptions of features see
[Bacon.js documentation](https://github.com/baconjs/bacon.js/blob/master/README.md)


### Create Stream

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `$.asEventStream(eventName)` | :+1: |  |
| `Bacon.fromPromise(promise [, abort])` | :+1: |  |
| `Bacon.fromEventTarget(target, eventName [, eventTransformer])` | :+1: |  |
| `Bacon.fromCallback(f [, args...])` | :+1: |  |
| `Bacon.fromCallback(object, methodName [, args...])` | :+1: |  |
| `Bacon.fromNodeCallback(f [, args...])` | :+1: |  |
| `Bacon.fromNodeCallback(object, methodName [, args...])` | :+1: |  |
| `Bacon.fromPoll(interval, f)` | :+1: |  |
| `Bacon.once(value)` | :rocket: |  |
| `Bacon.fromArray(values)` | :question: |  |
| `Bacon.interval(interval, value)` | :+1: |  |
| `Bacon.sequentially(interval, values)` | :+1: |  |
| `Bacon.repeatedly(interval, values)` | :+1: |  |
| `Bacon.never()` | :rocket: | `Kefir.never()` |
| `Bacon.later(delay, value)` | :+1: |  |
| `new Bacon.EventStream(subscribe)` | :rocket: | `new Kefir.Stream(onFirstSubscribed, onLastUsubscribed)` / `new Kefir.FromBinderStream(subscribe)` |
| `property.changes()` | :+1: |  |
| `property.toEventStream()` | :question: |  |
| `new Bacon.Bus()` | :rocket: | `new Kefir.Bus()` |
| `Bacon.fromBinder(subscribe)` | :rocket: | `Kefir.fromBinder(subscribe)` |


### Methods of Stream/Property

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `observable.onValue(f)` | :rocket: | `observable.subscribe(f)` |
| `observable.onError(f)` | :broken_heart: |  |
| `observable.onEnd(f)` | :rocket: | `observable.onEnd(f)` |
| `observable.map(f)` | :rocket: | `observable.onEnd(f)` |
| `stream.map(property) / property.sampledBy(stream)` | :question: |  |
| `observable.mapError(f)` | :broken_heart: |  |
| `observable.errors()` | :broken_heart: |  |
| `observable.skipErrors()` | :broken_heart: |  |
| `observable.mapEnd(f)` | :question: |  |
| `observable.filter(f)` | :rocket: | `observable.filter(f)` |
| `observable.filter(property)` | :question: |  |
| `observable.takeWhile(f)` | :rocket: | `observable.takeWhile(f)` |
| `observable.takeWhile(property)` | :question: |  |
| `observable.take(n)` | :+1: |  |
| `observable.takeUntil(stream)` | :question: |  |
| `observable.skip(n)` | :+1: |  |
| `observable.delay(delay)` | :+1: |  |
| `observable.throttle(delay)` | :+1: |  |
| `observable.debounce(delay)` | :+1: |  |
| `observable.debounceImmediate(delay)` | :+1: |  |
| `observable.doAction(f)` | :+1: |  |
| `observable.not()` | :+1: |  |
| `observable.flatMap(f)` | :rocket: | `observable.flatMap(f)` |
| `observable.flatMapLatest(f)` | :+1: |  |
| `observable.flatMapFirst(f)` | :question: |  |
| `observable.scan(seed, f)` | :+1: |  |
| `observable.fold(seed, f) / observable.reduce(seed, f)` | :+1: |  |
| `observable.diff(start, f)` | :+1: |  |
| `observable.zip(other, f)` | :+1: |  |
| `observable.slidingWindow(max [, min])` | :question: |  |
| `observable.log()` | :bike: | `observable.log()` |
| `observable.combine(property2, f)` | :rocket: | `observable.combine(streams, f)` |
| `observable.withStateMachine(initState, f)` | :question: |  |
| `observable.decode(mapping)` | :+1: |  |
| `observable.awaiting(otherObservable)` | :+1: |  |
| `observable.endOnError()` | :broken_heart: |  |
| `observable.endOnError(f)` | :broken_heart: |  |
| `observable.withHandler(f)` | :question: |  |
| `observable.name(newName)` | :broken_heart: |  |
| `observable.withDescription(param...)` | :broken_heart: |  |


### Methods of Stream

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `stream.subscribe(f)` | :broken_heart: |  |
| `stream.onValue(f)` | :rocket: | `stream.subscribe(f)` |
| `stream.onValues(f)` | :question: |  |
| `stream.skipDuplicates(isEqual)` | :+1: |  |
| `stream.concat(otherStream)` | :question: |  |
| `stream.merge(otherStream)` | :rocket: | `stream.merge(stream1[, stream2, ...])` / `stream.merge(streams)` |
| `stream.startWith(value)` | :question: |  |
| `stream.skipWhile(f)` | :+1: |  |
| `stream.skipWhile(property)` | :question: |  |
| `stream.skipUntil(stream2)` | :question: |  |
| `stream.bufferWithTime(delay)` | :question: |  |
| `stream.bufferWithTime(f)` | :question: |  |
| `stream.bufferWithCount(count)` | :question: |  |
| `stream.bufferWithTimeOrCount(delay, count)` | :question: |  |
| `stream.toProperty()` | :rocket: | `stream.toProperty()` |
| `stream.toProperty(initialValue)` | :rocket: | `stream.toProperty(initialValue)` |



### Methods of Property

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `Bacon.constant(x)` | :+1: |  |
| `property.subscribe(f)` | :broken_heart: |  |
| `property.onValue(f)` | :rocket: | `property.subscribe()` |
| `property.onValues(f)` | :question: |  |
| `property.assign(obj, method [, param...])` | :+1: |  |
| `property.sample(interval)` | :question: |  |
| `property.sampledBy(stream)` | :question: |  |
| `property.sampledBy(property)` | :question: |  |
| `property.sampledBy(streamOrProperty, f)` | :question: |  |
| `property.skipDuplicates(isEqual)` | :+1: |  |
| `property.changes()` | :+1: |  |
| `property.and(other)` | :+1: |  |
| `property.or(other)` | :+1: |  |
| `property.startWith(value)` | :question: |  |



### Combining multiple streams and properties

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `Bacon.combineAsArray(streams)` | :rocket: | `Kefir.combine(streams)` |
| `Bacon.combineAsArray(s1, s2...)` | :question: |  |
| `Bacon.combineWith(f, stream1, stream2...)` | :rocket: | `Kefir.combine(streams, f)`  |
| `Bacon.combineTemplate(template)` | :question: |  |
| `Bacon.mergeAll(streams)` | :rocket: | `Kefir.merge(streams)` / `Kefir.merge(stream1[, stream2, ...])` |
| `Bacon.zipAsArray(streams)` | :+1: |  |
| `Bacon.zipAsArray(stream1, stream2...)` | :question: |  |
| `Bacon.zipWith(streams, f)` | :question: |  |
| `Bacon.zipWith(f, stream1, stream1...)` | :question: |  |
| `Bacon.onValues(a, b [, c...], f)` | :question: |  |



### Function Construction

https://github.com/baconjs/bacon.js/tree/master#function-construction-rules

:+1:


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
| `Bacon.when()` | :question: |  |
| `Bacon.update()` | :question: |  |



### Cleaning up

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `Return Bacon.noMore from the handler function` | :+1: |  |
| `Call the dispose() function that was returned by the subscribe() call` | :broken_heart: / :rocket: | `stream.unsubscribe(f)` |



### Atomic updates

https://github.com/baconjs/bacon.js/tree/master#atomic-updates

:question:



### Glitch-free updates

https://github.com/baconjs/bacon.js/issues/272

:question:

