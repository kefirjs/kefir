# Create Stream

| Bacon feature | Status | Comment |
|:---|:---:|:---|
| $.asEventStream(eventName) | :question: |  |
| Bacon.fromPromise(promise [, abort]) | :question: |  |
| Bacon.fromEventTarget(target, eventName [, eventTransformer]) | :question: |  |
| Bacon.fromCallback(f [, args...]) | :question: |  |
| Bacon.fromCallback(object, methodName [, args...]) | :question: |  |
| Bacon.fromNodeCallback(f [, args...]) | :question: |  |
| Bacon.fromNodeCallback(object, methodName [, args...]) | :question: |  |
| Bacon.fromPoll(interval, f) | :question: |  |
| Bacon.once(value) | :question: |  |
| Bacon.fromArray(values) | :question: |  |
| Bacon.interval(interval, value) | :question: |  |
| Bacon.sequentially(interval, values) | :question: |  |
| Bacon.repeatedly(interval, values) | :question: |  |
| Bacon.never() | :question: |  |
| Bacon.later(delay, value) | :question: |  |
| new Bacon.EventStream(subscribe) | :question: |  |
| property.changes() | :question: |  |
| property.toEventStream() | :question: |  |
| new Bacon.Bus() | :question: |  |
| Bacon.fromBinder(subscribe) | :question: |  |


# Methods of Stream/Property

observable.onValue(f)
observable.onError(f)
observable.onEnd(f)
observable.map(f)
stream.map(property) / property.sampledBy(stream)
observable.mapError(f)
observable.errors()
observable.skipErrors()
observable.mapEnd(f)
observable.filter(f)
observable.filter(property)
observable.takeWhile(f)
observable.takeWhile(property)
observable.take(n)
observable.takeUntil(stream)
observable.skip(n)
observable.delay(delay)
observable.throttle(delay)
observable.debounce(delay)
observable.debounceImmediate(delay)
observable.doAction(f)
observable.not()
observable.flatMap(f)
observable.flatMapLatest(f)
observable.flatMapFirst(f)
observable.scan(seed, f)
observable.fold(seed, f) / observable.reduce(seed, f)
observable.diff(start, f)
observable.zip(other, f)
observable.slidingWindow(max [, min])
observable.log()
observable.combine(property2, f)
observable.withStateMachine(initState, f)
observable.decode(mapping)
observable.awaiting(otherObservable)
observable.endOnError()
observable.endOnError(f)
observable.withHandler(f)
observable.name(newName)
observable.withDescription(param...)


# Methods of Stream

stream.subscribe(f)
stream.onValue(f)
stream.onValues(f)
stream.skipDuplicates(isEqual)
stream.concat(otherStream)
stream.merge(otherStream)
stream.startWith(value)
stream.skipWhile(f)
stream.skipWhile(property)
stream.skipUntil(stream2)
stream.bufferWithTime(delay)
stream.bufferWithTime(f)
stream.bufferWithCount(count)
stream.bufferWithTimeOrCount(delay, count)
stream.toProperty()
stream.toProperty(initialValue)



# Methods of Property

Bacon.constant(x)
property.subscribe(f)
property.onValue(f)
property.onValues(f)
property.assign(obj, method [, param...])
property.sample(interval)
property.sampledBy(stream)
property.sampledBy(property)
property.sampledBy(streamOrProperty, f)
property.skipDuplicates(isEqual)
property.changes()
property.and(other)
property.or(other)
property.startWith(value)



# Combining multiple streams and properties

Bacon.combineAsArray(streams)
Bacon.combineAsArray(s1, s2...)
Bacon.combineWith(f, stream1, stream2...)
Bacon.combineTemplate(template)
Bacon.mergeAll(streams)
Bacon.zipAsArray(streams)
Bacon.zipAsArray(stream1, stream2...)
Bacon.zipWith(streams, f)
Bacon.zipWith(f, stream1, stream1...)
Bacon.onValues(a, b [, c...], f)



# Function Construction

https://github.com/baconjs/bacon.js/tree/master#function-construction-rules



# Bus

new Bacon.Bus()
bus.push(x)
bus.end()
bus.error(e)
bus.plug(stream)



# Event, Errors

won't implemented



# Join Patterns

Bacon.when()
Bacon.update()



# Cleaning up

Return Bacon.noMore from the handler function
Call the dispose() function that was returned by the subscribe() call



# Atomic updates

https://github.com/baconjs/bacon.js/tree/master#atomic-updates








