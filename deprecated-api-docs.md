# Deprecated API Methods documentation

All documentation on deprecated methods are moved
from [main docs](http://pozadi.github.io/kefir/) to this file.



### `Kefir.repeatedly(interval, values)`

Creates a stream, that produces given **values** (array),
with given **interval** in milliseconds. When all values emitted,
it begins to produce them again from the start. Never ends.

```js
// Example

var stream = Kefir.repeatedly(1000, [1, 2, 3]);
stream.log();


// Output

> [repeatedly] <value> 1
> [repeatedly] <value> 2
> [repeatedly] <value> 3
> [repeatedly] <value> 1
> [repeatedly] <value> 2
> [repeatedly] <value> 3
> [repeatedly] <value> 1
...


// Events diagram

stream:  ----1----2----3----1----2----3----1---
```



### `obs.mapTo(value)`

*Shorthand for*: `obs.map(function() {return value})`

On each value from original observable emits given **value**.

```js
// Example

var source = Kefir.sequentially(100, [1, 2, 3]);
var result = source.mapTo(5);
result.log();


// Output

> [sequentially.mapTo] <value> 5
> [sequentially.mapTo] <value> 5
> [sequentially.mapTo] <value> 5
> [sequentially.mapTo] <end>


// Events diagram

source: ---1---2---3X
result: ---5---5---5X
```



### `obs.pluck(propertyName)`

*Shorthand for*: `obs.map(function(x) {return x.foo})`

On each value from original observable emits `value[propertyName]`.

```js
// Example

var source = Kefir.sequentially(100, [{num: 1}, {num: 2}, {num: 3}]);
var result = source.pluck('num');
result.log();


// Output

> [sequentially.pluck] <value> 1
> [sequentially.pluck] <value> 2
> [sequentially.pluck] <value> 3
> [sequentially.pluck] <end>


// Events diagram

source: --------•--------•--------•X
          {num:1}  {num:2}  {num:3}
result: --------1--------2--------3X
```




### `obs.invoke(methodName)`

*Shorthand for*: `obs.map(function(x) {return x.foo()})`

Just like **.pluck**, but instead of emitting `value[propertyName]`
it emits `value[methodName]()`, i.e. calls method **methodName** of
each value object and emits whatever it returns.

```js
// Example

var source = Kefir.sequentially(100, [
  {foo: function(){return 1}},
  {foo: function(){return 2}},
  {foo: function(){return 3}}
]);
var result = source.invoke('foo');
result.log();


// Output

> [sequentially.invoke] <value> 1
> [sequentially.invoke] <value> 2
> [sequentially.invoke] <value> 3
> [sequentially.invoke] <end>


// Events diagram

source: ------------•------------•------------•X
          {foo:()=>1}  {foo:()=>2}  {foo:()=>3}
result: ------------1------------2------------3X
```



### `obs.not()`

*Shorthand for*: `obs.map(function(x) {return !x})`

Inverts every value from original observable using `!` operator.

```js
// Example

var source = Kefir.sequentially(100, [true, false, true]);
var result = source.not();
result.log();


// Output

> [sequentially.not] <value> false
> [sequentially.not] <value> true
> [sequentially.not] <value> false
> [sequentially.not] <end>


// Events diagram

source: ---t---f---tX
result: ---f---t---fX
```




### `obs.timestamp()`

*Shorthand for*: `obs.map(function(x) {return {value: x, time: new Date().getTime()}})`

Wraps each value to object with timestamp of the event.

```js
// Example

var source = Kefir.sequentially(100, [1, 2]);
var result = source.timestamp();
result.log();


// Output

> [sequentially.timestamp] <value> Object {value: 1, time: 1413022203878}
> [sequentially.timestamp] <value> Object {value: 2, time: 1413022203980}
> [sequentially.timestamp] <end>


// Events diagram

source: --------1--------2X
result: --------•--------•X
  {value:1,time:...}    {value:2,time:...}
```




### `obs.tap(fn)`

Just like **.map** applies given fn function to each value from original
observable, but emits original value (not what fn returns).

```js
// Example

var source = Kefir.sequentially(100, [1, 2, 3]);
var result = source.tap(function(x) {
  console.log('from tap fn:', x);
  return 5; // will be ignored
});
result.log();


// Output

> from tap fn: 1
> [sequentially.tap] <value> 1
> from tap fn: 2
> [sequentially.tap] <value> 2
> from tap fn: 3
> [sequentially.tap] <value> 3
> [sequentially.tap] <end>


// Events diagram

source: ---1---2---3X
result: ---1---2---3X
```





### `Kefir.and(obss)`

*Alias*: `obs.and(otherObs)`

Combines **obss** observables using `&&` (logical and) operator.

```js
// Example

var a = Kefir.emitter();
var b = Kefir.emitter();
var c = Kefir.emitter();
var isAllTrue = Kefir.and([a, b, c]);
isAllTrue.log();

a.emit(true);
b.emit(false);
c.emit(true);
b.emit(true);
a.emit(false);


// Output

> [and] <value> false
> [and] <value> true
> [and] <value> false


// Events diagram

a:          --t-----------f--
b:          -----f-----t-----
c:          --------t--------

isAllTrue:  --------f--t--f--
```



### `Kefir.or(obss)`

*Alias*: `obs.or(otherObs)`

Combines **obss** observables using `||` (logical or) operator.

```js
// Example

var a = Kefir.emitter();
var b = Kefir.emitter();
var c = Kefir.emitter();
var isAnyTrue = Kefir.or([a, b, c]);
isAnyTrue.log();

a.emit(true);
b.emit(false);
c.emit(true);
b.emit(true);
a.emit(false);


// Output

> [or] <value> true
> [or] <value> true
> [or] <value> true


// Events diagram

a:          --t-----------f--
b:          -----f-----t-----
c:          --------t--------

isAnyTrue:  --------t--t--t--
```



### `Kefir.sampledBy(passiveObss, activeObss, [combinator])`

Same as [.combine](http://pozadi.github.io/kefir/#combine),
except passive observables goes as the first argument unlike second in **.combine**,
and both `passiveObss` and `activeObss` are required.



### Kefir.fromSubUnsub(subscribe, unsubscribe, [transform])

Creates a stream from **subscribe** and **unsubscribe** functions.
The **subscribe** function is called on each [activation](http://pozadi.github.io/kefir/#active-state)
with a callback as argument,
giving you an opportunity to subscribe with this callback to an original source of values.
When all subscribers from the stream are removed, the **unsubscribe** function is called
with the same callback, so you can unsubscribe from your original source.

You can also provide a **transform** function, which will work the same way as in
[fromEvents](http://pozadi.github.io/kefir/#from-event).

```js
// Example

function subscribe(callback) {
  document.body.addEventListener('click', callback);
}

function unsubscribe(callback) {
  document.body.removeEventListener('click', callback);
}

function transform(event) {
  return event.type + ' on ' + this.tagName;
}

var stream = Kefir.fromSubUnsub(subscribe, unsubscribe, transform);
stream.log();


// Output

> [fromBinder] <value> click on BODY
> [fromBinder] <value> click on BODY
> [fromBinder] <value> click on BODY


// Events diagram

stream:  ----•--------------•----•---
  'click on...'  'click on...'  'click on...'
```



### Kefir.emitter()

Creates an emitter, which is an ordinary stream, but with additional methods:
`.emit(value)`, `.error(error)`, `.end()`, and `.emitEvent()`.
The first three are pretty self-descriptive, and the last one accepts an event object with the same format
than in the [onAny](http://pozadi.github.io/kefir/#on-any) method, and emits that event.
Once an emitter was created, one can easily emit all three kinds of events from it,
using these methods.

```js
// Example

var emitter = Kefir.emitter();
emitter.log();

emitter.emit(1);
emitter.error('Oops!');
emitter.end();


// Output

> [emitter] <value> 1
> [emitter] <error> Oops!
> [emitter] <end>


// Events diagram

emitter:  ----1----e----X
                   Oops!
```




### Kefir.bus()

**Bus** is a `Kefir.pool()` with `Kefir.emitter()` methods so one can emit
values from it directly.

```js
// Example

var bus = Kefir.bus();
var emitter = Kefir.emitter();
bus.log();

bus.plug(emitter);
bus.emit(1);
emitter.emit(2);
bus.end();


// Output

> [bus] <value> 1
> [bus] <value> 2
> [bus] <end>
```



### obs.reduce(fn, [seed])

Similar to [.scan](http://pozadi.github.io/kefir/#scan),
but emits only the last result just before end.

```js
// Example

var source = Kefir.sequentially(100, [1, 2, 2, 3]);
var result = source.reduce(function(prev, next) {
  return next + prev;
}, 0);
result.log();


// Output

> [sequentially.reduce] <value> 8
> [sequentially.reduce] <end>


// Events diagram

source:  ---1---2---2---3 X
result:  ----------------8X
```



### obs.takeWhileBy(otherObs)

Works like [takeWhile](http://pozadi.github.io/kefir/#take-while), but instead
of using a predicate function it uses another observable. It takes values from
**obs** observable until the first falsey value from **otherObs**.

Note: it will not produce any value until the first value from **otherObs**.
If that is not what you need, just turn your stream into a property with the
current value at `true` by calling `.toProperty(() => true)`.

```js
// Example

var foo = Kefir.sequentially(100, [1, 2, 3, 4, 5, 6, 7, 8]);
var bar = Kefir.sequentially(200, [true, false, true]).delay(40).toProperty(() => true);
var result = foo.takeWhileBy(bar);
result.log();


// Output
> [sequentially.takeWhileBy] <value> 1
> [sequentially.takeWhileBy] <value> 2
> [sequentially.takeWhileBy] <value> 3
> [sequentially.takeWhileBy] <value> 4
> [sequentially.takeWhileBy] <end>


// Events diagram

foo:     ----1----2----3----4----5----6----7----8X
bar:     t----------t---------f---------tX

result:  ----1----2----3----4-X
```




### obs.skipWhileBy(otherObs)

Works like [skipWhile](http://pozadi.github.io/kefir/#skip-while), but instead
of using a predicate function it uses another observable. It skips values from
**obs** observable until the first falsey value from **otherObs**.

```js
// Example

var foo = Kefir.sequentially(100, [1, 2, 3, 4, 5, 6, 7, 8]);
var bar = Kefir.sequentially(200, [true, false, true]).delay(40);
var result = foo.skipWhileBy(bar);
result.log();


// Output

> [sequentially.skipWhileBy] <value> 1
> [sequentially.skipWhileBy] <value> 2
> [sequentially.skipWhileBy] <value> 3
> [sequentially.skipWhileBy] <value> 4
> [sequentially.skipWhileBy] <end>


// Events diagram

foo:     ----1----2----3----4----5----6----7----8X
bar:     -----------t---------f---------tX

result:  ------------------------5----6----7----8X
```
