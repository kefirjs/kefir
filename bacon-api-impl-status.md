# Bacon.js API implementation status

:rocket: — already implemented

:bike: — partially implemented

:+1: — will be implemented most likely

:question: — may be will be implemented, may be not

:broken_heart: — probably will not be implemented



### Create Stream

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `$.asEventStream(eventName)` | :question: |  |
| `Bacon.fromPromise(promise [, abort])` | :question: |  |
| `Bacon.fromEventTarget(target, eventName [, eventTransformer])` | :question: |  |
| `Bacon.fromCallback(f [, args...])` | :question: |  |
| `Bacon.fromCallback(object, methodName [, args...])` | :question: |  |
| `Bacon.fromNodeCallback(f [, args...])` | :question: |  |
| `Bacon.fromNodeCallback(object, methodName [, args...])` | :question: |  |
| `Bacon.fromPoll(interval, f)` | :question: |  |
| `Bacon.once(value)` | :question: |  |
| `Bacon.fromArray(values)` | :question: |  |
| `Bacon.interval(interval, value)` | :question: |  |
| `Bacon.sequentially(interval, values)` | :question: |  |
| `Bacon.repeatedly(interval, values)` | :question: |  |
| `Bacon.never()` | :question: |  |
| `Bacon.later(delay, value)` | :question: |  |
| `new Bacon.EventStream(subscribe)` | :bike: | `new Kefir.Stream(onFirstSubscribed, onLastUsubscribed)` |
| `property.changes()` | :question: |  |
| `property.toEventStream()` | :question: |  |
| `new Bacon.Bus()` | :rocket: |  |
| `Bacon.fromBinder(subscribe)` | :rocket: |  |


### Methods of Stream/Property

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `observable.onValue(f)` | :rocket: | `stream.subscribe(f)` |
| `observable.onError(f)` | :broken_heart: |  |
| `observable.onEnd(f)` | :question: |  |
| `observable.map(f)` | :rocket: |  |
| `stream.map(property) / property.sampledBy(stream)` | :question: |  |
| `observable.mapError(f)` | :broken_heart: |  |
| `observable.errors()` | :broken_heart: |  |
| `observable.skipErrors()` | :broken_heart: |  |
| `observable.mapEnd(f)` | :question: |  |
| `observable.filter(f)` | :question: |  |
| `observable.filter(property)` | :question: |  |
| `observable.takeWhile(f)` | :question: |  |
| `observable.takeWhile(property)` | :question: |  |
| `observable.take(n)` | :question: |  |
| `observable.takeUntil(stream)` | :question: |  |
| `observable.skip(n)` | :question: |  |
| `observable.delay(delay)` | :question: |  |
| `observable.throttle(delay)` | :question: |  |
| `observable.debounce(delay)` | :question: |  |
| `observable.debounceImmediate(delay)` | :question: |  |
| `observable.doAction(f)` | :question: |  |
| `observable.not()` | :question: |  |
| `observable.flatMap(f)` | :rocket: |  |
| `observable.flatMapLatest(f)` | :question: |  |
| `observable.flatMapFirst(f)` | :question: |  |
| `observable.scan(seed, f)` | :question: |  |
| `observable.fold(seed, f) / observable.reduce(seed, f)` | :question: |  |
| `observable.diff(start, f)` | :question: |  |
| `observable.zip(other, f)` | :question: |  |
| `observable.slidingWindow(max [, min])` | :question: |  |
| `observable.log()` | :rocket: |  |
| `observable.combine(property2, f)` | :rocket: |  |
| `observable.withStateMachine(initState, f)` | :question: |  |
| `observable.decode(mapping)` | :question: |  |
| `observable.awaiting(otherObservable)` | :question: |  |
| `observable.endOnError()` | :question: |  |
| `observable.endOnError(f)` | :question: |  |
| `observable.withHandler(f)` | :question: |  |
| `observable.name(newName)` | :question: |  |
| `observable.withDescription(param...)` | :question: |  |


### Methods of Stream

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `stream.subscribe(f)` | :broken_heart: |  |
| `stream.onValue(f)` | :rocket: | `stream.subscribe(f)` |
| `stream.onValues(f)` | :question: |  |
| `stream.skipDuplicates(isEqual)` | :question: |  |
| `stream.concat(otherStream)` | :question: |  |
| `stream.merge(otherStream)` | :rocket: |  |
| `stream.startWith(value)` | :question: |  |
| `stream.skipWhile(f)` | :question: |  |
| `stream.skipWhile(property)` | :question: |  |
| `stream.skipUntil(stream2)` | :question: |  |
| `stream.bufferWithTime(delay)` | :question: |  |
| `stream.bufferWithTime(f)` | :question: |  |
| `stream.bufferWithCount(count)` | :question: |  |
| `stream.bufferWithTimeOrCount(delay, count)` | :question: |  |
| `stream.toProperty()` | :rocket: |  |
| `stream.toProperty(initialValue)` | :rocket: |  |



### Methods of Property

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `Bacon.constant(x)` | :question: |  |
| `property.subscribe(f)` | :broken_heart: |  |
| `property.onValue(f)` | :rocket: | `property.subscribe()` |
| `property.onValues(f)` | :question: |  |
| `property.assign(obj, method [, param...])` | :question: |  |
| `property.sample(interval)` | :question: |  |
| `property.sampledBy(stream)` | :question: |  |
| `property.sampledBy(property)` | :question: |  |
| `property.sampledBy(streamOrProperty, f)` | :question: |  |
| `property.skipDuplicates(isEqual)` | :question: |  |
| `property.changes()` | :question: |  |
| `property.and(other)` | :question: |  |
| `property.or(other)` | :question: |  |
| `property.startWith(value)` | :question: |  |



### Combining multiple streams and properties

| Bacon feature | Status | Kefir feature |
|:---|:---:|:---|
| `Bacon.combineAsArray(streams)` | :rocket: |  |
| `Bacon.combineAsArray(s1, s2...)` | :question: |  |
| `Bacon.combineWith(f, stream1, stream2...)` | :question: |  |
| `Bacon.combineTemplate(template)` | :question: |  |
| `Bacon.mergeAll(streams)` | :rocket: |  |
| `Bacon.zipAsArray(streams)` | :question: |  |
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
| `new Bacon.Bus()` | :rocket: |  |
| `bus.push(x)` | :rocket: |  |
| `bus.end()` | :rocket: |  |
| `bus.error(e)` | :broken_heart: |  |
| `bus.plug(stream)` | :rocket: |  |



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
| `Return Bacon.noMore from the handler function` | :question: |  |
| `Call the dispose() function that was returned by the subscribe() call` | :broken_heart: / :rocket: | `stream.unsubscribe(f)` |



### Atomic updates

https://github.com/baconjs/bacon.js/tree/master#atomic-updates

:broken_heart:








