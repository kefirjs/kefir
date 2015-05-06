const {isFn} = require('./utils/types');
const {NOTHING} = require('./constants');

// TODO: should be inlined in here
const Kefir = require('./kefir');
const deprecated = require('./patterns/deprecated');

// TODO: split
require('./two-sources');


const Observable = Kefir.Observable = require('./observable');
Kefir.Stream = require('./stream');
Kefir.Property = require('./property');




// Create a stream
// -----------------------------------------------------------------------------

// - never
const never = require('./primary/never'); // () -> Stream
Kefir.never = never;

// - later
Kefir.later = require('./time-based/later'); // (number, any) -> Stream

// - interval
Kefir.interval = require('./time-based/interval'); // (number, any) -> Stream

// - sequentially
const sequentially = require('./time-based/sequentially'); // (number, Array<any>) -> Stream
Kefir.sequentially = function(wait, xs) {
  return xs.length === 0 ? never() : sequentially(wait, xs);
};

// - fromPoll
Kefir.fromPoll = require('./time-based/from-poll'); // (number, Function) -> Stream

// - withInterval
Kefir.withInterval = require('./time-based/with-interval'); // (number, Function) -> Stream

// - fromCallback
Kefir.fromCallback = require('./primary/from-callback');

// - fromNodeCallback
Kefir.fromNodeCallback = require('./primary/from-node-callback');

// - fromEvents
Kefir.fromEvents = require('./primary/from-events');

// - stream
Kefir.stream = require('./primary/stream'); // (Function) -> Stream


// Create a property
// -----------------------------------------------------------------------------

// - constant
Kefir.constant = require('./primary/constant'); // (any) -> Property

// - constantError
Kefir.constantError = require('./primary/constant-error'); // (any) -> Property

// - fromPromise
Kefir.fromPromise = require('./primary/from-promise');




// Convert observables
// -----------------------------------------------------------------------------

// - toProperty
const toProperty = require('./one-source/to-property'); // (Stream|Property, Function|null) -> Property
Observable.prototype.toProperty = function(fn = null) {
  if (fn !== null && !isFn(fn)) {
    throw new TypeError('The .toProperty method must be called with no args or with a function as an argument');
  }
  return toProperty(this, fn);
};

// - changes
const changes = require('./one-source/changes'); // (Stream|Property) -> Stream
Observable.prototype.changes = function() {
  return changes(this);
};





// Modify an observable
// -----------------------------------------------------------------------------

// - map
const map = require('./one-source/map'); // A: Stream|Property, (A, Function) -> A
Observable.prototype.map = function(fn = (x) => x) {
  return map(this, fn);
};

// - filter
const filter = require('./one-source/filter'); // A: Stream|Property, (A, Function) -> A
Observable.prototype.filter = function(fn = (x) => x) {
  return filter(this, fn);
};

// - take
const take = require('./one-source/take'); // A: Stream|Property, (A, number) -> A
Observable.prototype.take = function(n) {
  return take(this, n);
};

// - takeWhile
const takeWhile = require('./one-source/take-while'); // A: Stream|Property, (A, Function) -> A
Observable.prototype.takeWhile = function(fn = (x) => x) {
  return takeWhile(this, fn);
};

// - last
const last = require('./one-source/last'); // A: Stream|Property, (A) -> A
Observable.prototype.last = function() {
  return last(this);
};

// - skip
const skip = require('./one-source/skip'); // A: Stream|Property, (A, number) -> A
Observable.prototype.skip = function(n) {
  return skip(this, n);
};

// - skipWhile
const skipWhile = require('./one-source/skip-while'); // A: Stream|Property, (A, Function) -> A
Observable.prototype.skipWhile = function(fn = (x) => x) {
  return skipWhile(this, fn);
};

// - skipDuplicates
const skipDuplicates = require('./one-source/skip-duplicates'); // A: Stream|Property, (A, Function) -> A
Observable.prototype.skipDuplicates = function(fn = (a, b) => a === b) {
  return skipDuplicates(this, fn);
};

// - diff
const diff = require('./one-source/diff'); // A: Stream|Property, (A, Function, any|NOTHING) -> A
function defaultDiff(a, b) {
  return [a, b];
}
Observable.prototype.diff = function(fn /* Function | falsey */, seed = NOTHING) {
  return diff(this, fn || defaultDiff, seed);
};

// - scan
const scan = require('./one-source/scan'); // (Stream|Property, Function, any|NOTHING) -> Property
Observable.prototype.scan = function(fn, seed = NOTHING) {
  return scan(this, fn, seed);
};

// - flatten
const flatten = require('./one-source/flatten'); // A: Stream|Property, (A, Function) -> A
Observable.prototype.flatten = function(fn = (x) => x) {
  return flatten(this, fn);
};

// - delay
const delay = require('./one-source/delay'); // A: Stream|Property, (A, number) -> A
Observable.prototype.delay = function(wait) {
  return delay(this, wait);
};

// - throttle
const throttle = require('./one-source/throttle'); // A: Stream|Property, (A, number, Object) -> A
Observable.prototype.throttle = function(wait, {leading = true, trailing = true} = {}) {
  return throttle(this, wait, {leading, trailing});
};

// - debounce
const debounce = require('./one-source/debounce'); // A: Stream|Property, (A, number, Object) -> A
Observable.prototype.debounce = function(wait, {immediate = false} = {}) {
  return debounce(this, wait, {immediate});
};

// - valuesToErrors
const valuesToErrors = require('./one-source/values-to-errors'); // A: Stream|Property, (A, Function) -> A
Observable.prototype.valuesToErrors = function(fn = (x => ({convert: true, error: x}))) {
  return valuesToErrors(this, fn);
};

// - errorsToValues
const errorsToValues = require('./one-source/errors-to-values');
Observable.prototype.errorsToValues = function(fn = (x) => ({convert: true, value: x})) {
  return errorsToValues(this, fn);
};

// - mapErrors
const mapErrors = require('./one-source/map-errors');
Observable.prototype.mapErrors = function(fn = (x) => x) {
  return mapErrors(this, fn);
};

// - filterErrors
const filterErrors = require('./one-source/filter-errors');
Observable.prototype.filterErrors = function(fn = (x) => x) {
  return filterErrors(this, fn);
};

// - endOnError
const endOnError = require('./one-source/end-on-error');
Observable.prototype.endOnError = function() {
  return endOnError(this);
};

// - skipValues
const skipValues = require('./one-source/skip-values');
Observable.prototype.skipValues = function() {
  return skipValues(this);
};

// - skipErrors
const skipErrors = require('./one-source/skip-errors');
Observable.prototype.skipErrors = function() {
  return skipErrors(this);
};

// - skipEnd
const skipEnd = require('./one-source/skip-end');
Observable.prototype.skipEnd = function() {
  return skipEnd(this);
};

// - beforeEnd
const beforeEnd = require('./one-source/before-end');
Observable.prototype.beforeEnd = function(fn) {
  return beforeEnd(this, fn);
};

// - slidingWindow
const slidingWindow = require('./one-source/sliding-window');
Observable.prototype.slidingWindow = function(max, min = 0) {
  return slidingWindow(this, max, min);
};

// - bufferWhile
const bufferWhile = require('./one-source/buffer-while');
Observable.prototype.bufferWhile = function(fn = (x) => x, {flushOnEnd = true} = {}) {
  return bufferWhile(this, fn, {flushOnEnd});
};

// - transduce
const transduce = require('./one-source/transduce');
Observable.prototype.transduce = function(transducer) {
  return transduce(this, transducer);
};

// - withHandler
const withHandler = require('./one-source/with-handler');
Observable.prototype.withHandler = function(fn) {
  return withHandler(this, fn);
};





// Combine observables
// -----------------------------------------------------------------------------

// - combine
const combine = require('./many-sources/combine'); // (Array<Oservable>, Array<Oservable>, Function | falsey) -> Stream
// (Array, Array, Function)
// (Array, Array)
// (Array, Function)
// (Array)
Kefir.combine = function(active, passive = [], combinator) {
  if (isFn(passive)) {
    combinator = passive;
    passive = [];
  }
  return combine(active, passive, combinator);
};
// (Array, Function)
// (Array)
Observable.prototype.combine = function(other, combinator) {
  return combine([this, other], [], combinator);
};

// - zip
const zip = Kefir.zip = require('./many-sources/zip');
Observable.prototype.zip = function(other, combinator /* Function | falsey */) {
  return zip([this, other], combinator);
};

// - merge
const merge = Kefir.merge = require('./many-sources/merge');
Observable.prototype.merge = function(other) {
  return merge([this, other]);
};

// - concat
const concat = Kefir.concat = require('./many-sources/concat');
Observable.prototype.concat = function(other) {
  return concat([this, other]);
};

// - pool
const Pool = Kefir.Pool = require('./many-sources/pool');
Kefir.pool = function() {
  return new Pool();
};

// - repeat
Kefir.repeat = require('./many-sources/repeat'); // (Function) -> Stream


// - flatMap
const flatMap = require('./many-sources/flat-map');
Observable.prototype.flatMap = function(fn) {
  return flatMap(this, fn);
};

// - flatMapLatest
Observable.prototype.flatMapLatest = function(fn) {
  return flatMap(this, fn, {concurLim: 1, drop: 'old'}).setName(this, 'flatMapLatest');
};

// - flatMapFirst
Observable.prototype.flatMapFirst = function(fn) {
  return flatMap(this, fn, {concurLim: 1}).setName(this, 'flatMapFirst');
};

// - flatMapConcat
Observable.prototype.flatMapConcat = function(fn) {
  return flatMap(this, fn, {queueLim: -1, concurLim: 1}).setName(this, 'flatMapConcat');
};

// - flatMapConcurLimit
Observable.prototype.flatMapConcurLimit = function(fn, limit) {
  return flatMap(this, fn, {queueLim: -1, concurLim: limit}).setName(this, 'flatMapConcurLimit');
};


// Combine two observables
// -----------------------------------------------------------------------------

// - filterBy
// - sampledBy
const sampledBy2items = require('./two-sources/sampled-by');
Observable.prototype.sampledBy = function(other, combinator /* Function | falsey */) {
  return sampledBy2items(this, other, combinator);
};

// - takeWhileBy
// - skipWhileBy
// - skipUntilBy
// - takeUntilBy
// - bufferBy
// - bufferWhileBy
// - awaiting
const awaiting = require('./two-sources/awaiting');
Observable.prototype.awaiting = function(other) {
  return awaiting(this, other);
}






// Deprecated
// -----------------------------------------------------------------------------

const Emitter = Kefir.Emitter = require('./primary/emitter');
Kefir.emitter = deprecated('Kefir.emitter()', 'Kefir.stream()',
  function() {
    return new Emitter();
  }
);

const Bus = Kefir.Bus = require('./many-sources/bus');
Kefir.bus = deprecated('Kefir.bus()', 'Kefir.pool() or Kefir.stream()',
  function() {
    return new Bus();
  }
);

const reduce = require('./one-source/reduce');
Observable.prototype.reduce = deprecated('.reduce(fn, seed)', '.scan(fn, seed).last()',
  function(fn, seed = NOTHING) {
    return reduce(this, fn, seed);
  }
);

// (Array<Oservable>, Array<Oservable>, Function | falsey) -> Stream
const sampledByManyItems = require('./many-sources/sampled-by');
Kefir.sampledBy = deprecated('Kefir.sampledBy()', 'Kefir.combine()', sampledByManyItems);

const repeatedly = require('./time-based/repeatedly');
Kefir.repeatedly = deprecated('Kefir.repeatedly()', 'Kefir.repeat(() => Kefir.sequentially(...)})', repeatedly);

const mapTo = require('./one-source/map-to');
Observable.prototype.mapTo = deprecated('.mapTo()', '.map(() => value)',
  function(x) {
    return mapTo(this, x);
  }
);

const tap = require('./one-source/tap');
Observable.prototype.tap = deprecated('.tap()', '.map((v) => {fn(v); return v})',
  function(fn) {
    return tap(this, fn);
  }
);

const pluck = require('./one-source/pluck');
Observable.prototype.pluck = deprecated('.pluck()', '.map((x) => x.foo)',
  function(propName) {
    return pluck(this, propName);
  }
);

const invoke = require('./one-source/invoke');
Observable.prototype.invoke = deprecated('.invoke()', '.map((x) => x.foo())',
  function(methodName, ...args) {
    return invoke(this, methodName, args);
  }
);

const timestamp = require('./one-source/timestamp');
Observable.prototype.timestamp = deprecated('.timestamp()', '.map((x) => {value: x, time: Date.now()})',
  function() {
    return timestamp(this);
  }
);

const and = require('./many-sources/and');
Kefir.and = deprecated('Kefir.and()', 'Kefir.combine([a, b], (a, b) => a && b)', and);
Observable.prototype.and = deprecated('.and()', '.combine(other, (a, b) => a && b)',
  function(other) {
    return and([this, other]);
  }
);

const or = require('./many-sources/or');
Kefir.or = deprecated('Kefir.or()', 'Kefir.combine([a, b], (a, b) => a || b)', or);
Observable.prototype.or = deprecated('.or()', '.combine(other, (a, b) => a || b)',
  function(other) {
    return or([this, other]);
  }
);

const not = require('./one-source/not');
Observable.prototype.not = deprecated('.not()', '.map((x) => !x)',
  function() {
    return not(this);
  }
);

const fromSubUnsub = require('./primary/from-sub-unsub');
Kefir.fromSubUnsub = deprecated('.fromSubUnsub()', 'Kefir.stream()', fromSubUnsub);





// -----------------------------------------------------------------------------

module.exports = Kefir;
module.exports.Kefir = Kefir;
