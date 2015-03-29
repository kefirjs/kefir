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


// Output

a.emit(true);
b.emit(false);
c.emit(true);
b.emit(true);
a.emit(false);
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


// Output

a.emit(true);
b.emit(false);
c.emit(true);
b.emit(true);
a.emit(false);
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
