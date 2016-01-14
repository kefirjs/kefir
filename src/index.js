const Kefir = module.exports = {};
Kefir.Kefir = Kefir;

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
// (Target, string, Function|undefined) -> Stream
Kefir.fromEvents = require('./primary/from-events');

// (Function) -> Stream
Kefir.stream = require('./primary/stream');



// Create a property
// -----------------------------------------------------------------------------

// (any) -> Property
Kefir.constant = require('./primary/constant');

// (any) -> Property
Kefir.constantError = require('./primary/constant-error');





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



// Interoperation with other implimentations
// -----------------------------------------------------------------------------

// (Promise) -> Property
Kefir.fromPromise = require('./interop/from-promise');

// (Stream|Property, Function|undefined) -> Promise
const toPromise = require('./interop/to-promise');
Observable.prototype.toPromise = function(Promise) {
  return toPromise(this, Promise);
};

// (ESObservable) -> Stream
Kefir.fromESObservable = require('./interop/from-es-observable');

// (Stream|Property) -> ES7 Observable
const toESObservable = require('./interop/to-es-observable');
Observable.prototype.toESObservable = toESObservable;
Observable.prototype[require('./utils/symbol')('observable')] = toESObservable;

// (Node ReadableStream) -> Stream
Kefir.fromReadableStream = require('./interop/from-readable-stream');





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

// (Stream, number) -> Stream
// (Property, number) -> Property
const takeErrors = require('./one-source/take-errors');
Observable.prototype.takeErrors = function(n) {
  return takeErrors(this, n);
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
const ignoreValues = require('./one-source/ignore-values');
Observable.prototype.ignoreValues = function() {
  return ignoreValues(this);
};

// (Stream) -> Stream
// (Property) -> Property
const ignoreErrors = require('./one-source/ignore-errors');
Observable.prototype.ignoreErrors = function() {
  return ignoreErrors(this);
};

// (Stream) -> Stream
// (Property) -> Property
const ignoreEnd = require('./one-source/ignore-end');
Observable.prototype.ignoreEnd = function() {
  return ignoreEnd(this);
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

// (Stream, number) -> Stream
// (Property, number) -> Property
const bufferWithCount = require('./one-source/buffer-with-count');
Observable.prototype.bufferWithCount = function(count, options) {
  return bufferWithCount(this, count, options);
};

// Options = {flushOnEnd: boolean|undefined}
// (Stream, number, number, Options|undefined) -> Stream
// (Property, number, number, Options|undefined) -> Property
const bufferWithTimeOrCount = require('./one-source/buffer-with-time-or-count');
Observable.prototype.bufferWithTimeOrCount = function(wait, count, options) {
  return bufferWithTimeOrCount(this, wait, count, options);
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
const FlatMap = require('./many-sources/flat-map');
Observable.prototype.flatMap = function(fn) {
  return new FlatMap(this, fn).setName(this, 'flatMap');
};
Observable.prototype.flatMapLatest = function(fn) {
  return new FlatMap(this, fn, {concurLim: 1, drop: 'old'}).setName(this, 'flatMapLatest');
};
Observable.prototype.flatMapFirst = function(fn) {
  return new FlatMap(this, fn, {concurLim: 1}).setName(this, 'flatMapFirst');
};
Observable.prototype.flatMapConcat = function(fn) {
  return new FlatMap(this, fn, {queueLim: -1, concurLim: 1}).setName(this, 'flatMapConcat');
};
Observable.prototype.flatMapConcurLimit = function(fn, limit) {
  return new FlatMap(this, fn, {queueLim: -1, concurLim: limit}).setName(this, 'flatMapConcurLimit');
};

// (Stream|Property, Function|falsey) -> Stream
const FlatMapErrors = require('./many-sources/flat-map-errors');
Observable.prototype.flatMapErrors = function(fn) {
  return new FlatMapErrors(this, fn).setName(this, 'flatMapErrors');
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





// Deprecated
// -----------------------------------------------------------------------------

function warn(msg) {
  if (Kefir.DEPRECATION_WARNINGS !== false && console && typeof console.warn === 'function') {
    const msg2 = '\nHere is an Error object for you containing the call stack:';
    console.warn(msg, msg2, new Error());
  }
}

// (Stream|Property, Stream|Property) -> Property
const awaiting = require('./two-sources/awaiting');
Observable.prototype.awaiting = function(other) {
  warn('You are using deprecated .awaiting() method, see https://github.com/rpominov/kefir/issues/145')
  return awaiting(this, other);
};

// (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property
const valuesToErrors = require('./one-source/values-to-errors');
Observable.prototype.valuesToErrors = function(fn) {
  warn('You are using deprecated .valuesToErrors() method, see https://github.com/rpominov/kefir/issues/149')
  return valuesToErrors(this, fn);
};

// (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property
const errorsToValues = require('./one-source/errors-to-values');
Observable.prototype.errorsToValues = function(fn) {
  warn('You are using deprecated .errorsToValues() method, see https://github.com/rpominov/kefir/issues/149')
  return errorsToValues(this, fn);
};

// (Stream) -> Stream
// (Property) -> Property
const endOnError = require('./one-source/end-on-error');
Observable.prototype.endOnError = function() {
  warn('You are using deprecated .endOnError() method, see https://github.com/rpominov/kefir/issues/150')
  return endOnError(this);
};
