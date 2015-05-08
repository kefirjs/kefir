const Kefir = module.exports = {};
Kefir.Kefir = Kefir;


Kefir.DEPRECATION_WARNINGS = true;
function deprecated(name, alt, fn) {
  return function() {
    if (Kefir.DEPRECATION_WARNINGS && (typeof console !== 'undefined') && console.log) {

      const message = `Method \`${name}\` is deprecated, and to be removed in v3.0.0.
Use \`${alt}\` instead.
To disable all warnings like this set \`Kefir.DEPRECATION_WARNINGS = false\`.`;

      console.log(message);
    }
    return fn.apply(this, arguments);
  };
}


const Observable = Kefir.Observable = require('./observable');
Kefir.Stream = require('./stream');
Kefir.Property = require('./property');




// Create a stream
// -----------------------------------------------------------------------------

// () -> Stream
Kefir.never = require('./primary/never');

// (number, any) -> Stream
Kefir.later = require('./time-based/later');

// (number, any) -> Stream
Kefir.interval = require('./time-based/interval');

// (number, Array<any>) -> Stream
Kefir.sequentially = require('./time-based/sequentially')

// (number, Function) -> Stream
Kefir.fromPoll = require('./time-based/from-poll');

// (number, Function) -> Stream
Kefir.withInterval = require('./time-based/with-interval');

// (Function) -> Stream
Kefir.fromCallback = require('./primary/from-callback');

// (Function) -> Stream
Kefir.fromNodeCallback = require('./primary/from-node-callback');

// Target = {addEventListener, removeEventListener}|{addListener, removeListener}|{on, off}
// (Target, string, Function|falsey) -> Stream
Kefir.fromEvents = require('./primary/from-events');

// (Function) -> Stream
Kefir.stream = require('./primary/stream');




// Create a property
// -----------------------------------------------------------------------------

// (any) -> Property
Kefir.constant = require('./primary/constant');

// (any) -> Property
Kefir.constantError = require('./primary/constant-error');

// (Promise) -> Property
Kefir.fromPromise = require('./primary/from-promise');




// Convert observables
// -----------------------------------------------------------------------------

// (Stream|Property, Function|undefined) -> Property
const toProperty = require('./one-source/to-property');
Observable.prototype.toProperty = function(fn) {
  return toProperty(this, fn);
};

// (Stream|Property) -> Stream
const changes = require('./one-source/changes');
Observable.prototype.changes = function() {
  return changes(this);
};





// Modify an observable
// -----------------------------------------------------------------------------

// (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property
const map = require('./one-source/map');
Observable.prototype.map = function(fn) {
  return map(this, fn);
};

// (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property
const filter = require('./one-source/filter');
Observable.prototype.filter = function(fn) {
  return filter(this, fn);
};

// (Stream, number) -> Stream
// (Property, number) -> Property
const take = require('./one-source/take');
Observable.prototype.take = function(n) {
  return take(this, n);
};

// (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property
const takeWhile = require('./one-source/take-while');
Observable.prototype.takeWhile = function(fn) {
  return takeWhile(this, fn);
};

// (Stream) -> Stream
// (Property) -> Property
const last = require('./one-source/last');
Observable.prototype.last = function() {
  return last(this);
};

// (Stream, number) -> Stream
// (Property, number) -> Property
const skip = require('./one-source/skip');
Observable.prototype.skip = function(n) {
  return skip(this, n);
};

// (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property
const skipWhile = require('./one-source/skip-while');
Observable.prototype.skipWhile = function(fn) {
  return skipWhile(this, fn);
};

// (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property
const skipDuplicates = require('./one-source/skip-duplicates');
Observable.prototype.skipDuplicates = function(fn) {
  return skipDuplicates(this, fn);
};

// (Stream, Function|falsey, any|undefined) -> Stream
// (Property, Function|falsey, any|undefined) -> Property
const diff = require('./one-source/diff');
Observable.prototype.diff = function(fn, seed) {
  return diff(this, fn, seed);
};

// (Stream|Property, Function, any|undefined) -> Property
const scan = require('./one-source/scan');
Observable.prototype.scan = function(fn, seed) {
  return scan(this, fn, seed);
};

// (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property
const flatten = require('./one-source/flatten');
Observable.prototype.flatten = function(fn) {
  return flatten(this, fn);
};

// (Stream, number) -> Stream
// (Property, number) -> Property
const delay = require('./one-source/delay');
Observable.prototype.delay = function(wait) {
  return delay(this, wait);
};

// Options = {leading: boolean|undefined, trailing: boolean|undefined}
// (Stream, number, Options|undefined) -> Stream
// (Property, number, Options|undefined) -> Property
const throttle = require('./one-source/throttle');
Observable.prototype.throttle = function(wait, options) {
  return throttle(this, wait, options);
};

// Options = {immediate: boolean|undefined}
// (Stream, number, Options|undefined) -> Stream
// (Property, number, Options|undefined) -> Property
const debounce = require('./one-source/debounce');
Observable.prototype.debounce = function(wait, options) {
  return debounce(this, wait, options);
};

// (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property
const valuesToErrors = require('./one-source/values-to-errors');
Observable.prototype.valuesToErrors = function(fn) {
  return valuesToErrors(this, fn);
};

// (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property
const errorsToValues = require('./one-source/errors-to-values');
Observable.prototype.errorsToValues = function(fn) {
  return errorsToValues(this, fn);
};

// (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property
const mapErrors = require('./one-source/map-errors');
Observable.prototype.mapErrors = function(fn) {
  return mapErrors(this, fn);
};

// (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property
const filterErrors = require('./one-source/filter-errors');
Observable.prototype.filterErrors = function(fn) {
  return filterErrors(this, fn);
};

// (Stream) -> Stream
// (Property) -> Property
const endOnError = require('./one-source/end-on-error');
Observable.prototype.endOnError = function() {
  return endOnError(this);
};

// (Stream) -> Stream
// (Property) -> Property
const skipValues = require('./one-source/skip-values');
Observable.prototype.skipValues = function() {
  return skipValues(this);
};

// (Stream) -> Stream
// (Property) -> Property
const skipErrors = require('./one-source/skip-errors');
Observable.prototype.skipErrors = function() {
  return skipErrors(this);
};

// (Stream) -> Stream
// (Property) -> Property
const skipEnd = require('./one-source/skip-end');
Observable.prototype.skipEnd = function() {
  return skipEnd(this);
};

// (Stream, Function) -> Stream
// (Property, Function) -> Property
const beforeEnd = require('./one-source/before-end');
Observable.prototype.beforeEnd = function(fn) {
  return beforeEnd(this, fn);
};

// (Stream, number, number|undefined) -> Stream
// (Property, number, number|undefined) -> Property
const slidingWindow = require('./one-source/sliding-window');
Observable.prototype.slidingWindow = function(max, min) {
  return slidingWindow(this, max, min);
};

// Options = {flushOnEnd: boolean|undefined}
// (Stream, Function|falsey, Options|undefined) -> Stream
// (Property, Function|falsey, Options|undefined) -> Property
const bufferWhile = require('./one-source/buffer-while');
Observable.prototype.bufferWhile = function(fn, options) {
  return bufferWhile(this, fn, options);
};

// (Stream, Function) -> Stream
// (Property, Function) -> Property
const transduce = require('./one-source/transduce');
Observable.prototype.transduce = function(transducer) {
  return transduce(this, transducer);
};

// (Stream, Function) -> Stream
// (Property, Function) -> Property
const withHandler = require('./one-source/with-handler');
Observable.prototype.withHandler = function(fn) {
  return withHandler(this, fn);
};





// Combine observables
// -----------------------------------------------------------------------------

// (Array<Stream|Property>, Function|undefiend) -> Stream
// (Array<Stream|Property>, Array<Stream|Property>, Function|undefiend) -> Stream
const combine = Kefir.combine = require('./many-sources/combine');
Observable.prototype.combine = function(other, combinator) {
  return combine([this, other], combinator);
};

// (Array<Stream|Property>, Function|undefiend) -> Stream
const zip = Kefir.zip = require('./many-sources/zip');
Observable.prototype.zip = function(other, combinator) {
  return zip([this, other], combinator);
};

// (Array<Stream|Property>) -> Stream
const merge = Kefir.merge = require('./many-sources/merge');
Observable.prototype.merge = function(other) {
  return merge([this, other]);
};

// (Array<Stream|Property>) -> Stream
const concat = Kefir.concat = require('./many-sources/concat');
Observable.prototype.concat = function(other) {
  return concat([this, other]);
};

// () -> Pool
const Pool = Kefir.Pool = require('./many-sources/pool');
Kefir.pool = function() {
  return new Pool();
};

// (Function) -> Stream
Kefir.repeat = require('./many-sources/repeat');

// Options = {concurLim: number|undefined, queueLim: number|undefined, drop: 'old'|'new'|undefiend}
// (Stream|Property, Function|falsey, Options|undefined) -> Stream
const flatMap = require('./many-sources/flat-map');
Observable.prototype.flatMap = function(fn) {
  return flatMap(this, fn);
};
Observable.prototype.flatMapLatest = function(fn) {
  return flatMap(this, fn, {concurLim: 1, drop: 'old'}).setName(this, 'flatMapLatest');
};
Observable.prototype.flatMapFirst = function(fn) {
  return flatMap(this, fn, {concurLim: 1}).setName(this, 'flatMapFirst');
};
Observable.prototype.flatMapConcat = function(fn) {
  return flatMap(this, fn, {queueLim: -1, concurLim: 1}).setName(this, 'flatMapConcat');
};
Observable.prototype.flatMapConcurLimit = function(fn, limit) {
  return flatMap(this, fn, {queueLim: -1, concurLim: limit}).setName(this, 'flatMapConcurLimit');
};






// Combine two observables
// -----------------------------------------------------------------------------

// (Stream, Stream|Property) -> Stream
// (Property, Stream|Property) -> Property
const filterBy = require('./two-sources/filter-by');
Observable.prototype.filterBy = function(other) {
  return filterBy(this, other);
};

// (Stream, Stream|Property, Function|undefiend) -> Stream
// (Property, Stream|Property, Function|undefiend) -> Property
const sampledBy2items = require('./two-sources/sampled-by');
Observable.prototype.sampledBy = function(other, combinator) {
  return sampledBy2items(this, other, combinator);
};

// (Stream, Stream|Property) -> Stream
// (Property, Stream|Property) -> Property
const takeWhileBy = require('./two-sources/take-while-by');
Observable.prototype.takeWhileBy = function(other) {
  return takeWhileBy(this, other);
};

// (Stream, Stream|Property) -> Stream
// (Property, Stream|Property) -> Property
const skipWhileBy = require('./two-sources/skip-while-by');
Observable.prototype.skipWhileBy = function(other) {
  return skipWhileBy(this, other);
};

// (Stream, Stream|Property) -> Stream
// (Property, Stream|Property) -> Property
const skipUntilBy = require('./two-sources/skip-until-by');
Observable.prototype.skipUntilBy = function(other) {
  return skipUntilBy(this, other);
};

// (Stream, Stream|Property) -> Stream
// (Property, Stream|Property) -> Property
const takeUntilBy = require('./two-sources/take-until-by');
Observable.prototype.takeUntilBy = function(other) {
  return takeUntilBy(this, other);
};

// Options = {flushOnEnd: boolean|undefined}
// (Stream, Stream|Property, Options|undefined) -> Stream
// (Property, Stream|Property, Options|undefined) -> Property
const bufferBy = require('./two-sources/buffer-by');
Observable.prototype.bufferBy = function(other, options) {
  return bufferBy(this, other, options);
};

// Options = {flushOnEnd: boolean|undefined}
// (Stream, Stream|Property, Options|undefined) -> Stream
// (Property, Stream|Property, Options|undefined) -> Property
const bufferWhileBy = require('./two-sources/buffer-while-by');
Observable.prototype.bufferWhileBy = function(other, options) {
  return bufferWhileBy(this, other, options);
};

// (Stream|Property, Stream|Property) -> Property
const awaiting = require('./two-sources/awaiting');
Observable.prototype.awaiting = function(other) {
  return awaiting(this, other);
};






// Deprecated
// -----------------------------------------------------------------------------

// () -> Emitter
const Emitter = Kefir.Emitter = require('./primary/emitter');
Kefir.emitter = deprecated('Kefir.emitter()', 'Kefir.stream()',
  function() {
    return new Emitter();
  }
);

// () -> Bus
const Bus = Kefir.Bus = require('./many-sources/bus');
Kefir.bus = deprecated('Kefir.bus()', 'Kefir.pool() or Kefir.stream()',
  function() {
    return new Bus();
  }
);

// (Stream, Function, any|undefined) -> Stream
// (Property, Function, any|undefined) -> Property
const reduce = require('./one-source/reduce');
Observable.prototype.reduce = deprecated('.reduce(fn, seed)', '.scan(fn, seed).last()',
  function(fn, seed) {
    return reduce(this, fn, seed);
  }
);

// (Array<Stream|Property>, Array<Stream|Property>, Function|undefined) -> Stream
const sampledByManyItems = require('./many-sources/sampled-by');
Kefir.sampledBy = deprecated('Kefir.sampledBy()', 'Kefir.combine()', sampledByManyItems);

// (number, Array<any>) -> Stream
const repeatedly = require('./time-based/repeatedly');
Kefir.repeatedly = deprecated('Kefir.repeatedly()', 'Kefir.repeat(() => Kefir.sequentially(...)})', repeatedly);

// (Stream, any) -> Stream
// (Property, any) -> Property
const mapTo = require('./one-source/map-to');
Observable.prototype.mapTo = deprecated('.mapTo()', '.map(() => value)',
  function(x) {
    return mapTo(this, x);
  }
);

// (Stream, Function) -> Stream
// (Property, Function) -> Property
const tap = require('./one-source/tap');
Observable.prototype.tap = deprecated('.tap()', '.map((v) => {fn(v); return v})',
  function(fn) {
    return tap(this, fn);
  }
);

// (Stream, string) -> Stream
// (Property, string) -> Property
const pluck = require('./one-source/pluck');
Observable.prototype.pluck = deprecated('.pluck()', '.map((x) => x.foo)',
  function(propName) {
    return pluck(this, propName);
  }
);

// (Stream, string, Array) -> Stream
// (Property, string, Array) -> Property
const invoke = require('./one-source/invoke');
Observable.prototype.invoke = deprecated('.invoke()', '.map((x) => x.foo())',
  function(methodName, ...args) {
    return invoke(this, methodName, args);
  }
);

// (Stream) -> Stream
// (Property) -> Property
const timestamp = require('./one-source/timestamp');
Observable.prototype.timestamp = deprecated('.timestamp()', '.map((x) => {value: x, time: Date.now()})',
  function() {
    return timestamp(this);
  }
);

// (Array<Stream|Property>) -> Stream
const and = require('./many-sources/and');
Kefir.and = deprecated('Kefir.and()', 'Kefir.combine([a, b], (a, b) => a && b)', and);
Observable.prototype.and = deprecated('.and()', '.combine(other, (a, b) => a && b)',
  function(other) {
    return and([this, other]);
  }
);

// (Array<Stream|Property>) -> Stream
const or = require('./many-sources/or');
Kefir.or = deprecated('Kefir.or()', 'Kefir.combine([a, b], (a, b) => a || b)', or);
Observable.prototype.or = deprecated('.or()', '.combine(other, (a, b) => a || b)',
  function(other) {
    return or([this, other]);
  }
);

// (Stream) -> Stream
// (Property) -> Property
const not = require('./one-source/not');
Observable.prototype.not = deprecated('.not()', '.map((x) => !x)',
  function() {
    return not(this);
  }
);

// (Function, Function, Function|undefined) -> Stream
const fromSubUnsub = require('./primary/from-sub-unsub');
Kefir.fromSubUnsub = deprecated('.fromSubUnsub()', 'Kefir.stream()', fromSubUnsub);
