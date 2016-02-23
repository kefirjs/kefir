const Kefir = {};
Kefir.Kefir = Kefir;
export { Kefir };
export default Kefir;

import Observable from './observable';
Kefir.Observable = Observable;
export { Observable };

import Stream from './stream';
Kefir.Stream = Stream;
export { Stream };

import Property from './property';
Kefir.Property = Property;
export { Property };



// Create a stream
// -----------------------------------------------------------------------------

// () -> Stream
import never from './primary/never';
Kefir.never = never;
export { never };

// (number, any) -> Stream
import later from './time-based/later';
Kefir.later = later;
export { later };

// (number, any) -> Stream
import interval from './time-based/interval';
Kefir.interval = interval;
export { interval };

// (number, Array<any>) -> Stream
import sequentially from './time-based/sequentially';
Kefir.sequentially = sequentially;
export { sequentially };

// (number, Function) -> Stream
import fromPoll from './time-based/from-poll';
Kefir.fromPoll = fromPoll;
export { fromPoll };

// (number, Function) -> Stream
import withInterval from './time-based/with-interval';
Kefir.withInterval = withInterval;
export { withInterval };

// (Function) -> Stream
import fromCallback from './primary/from-callback';
Kefir.fromCallback = fromCallback;
export { fromCallback };

// (Function) -> Stream
import fromNodeCallback from './primary/from-node-callback';
Kefir.fromNodeCallback = fromNodeCallback;
export { fromNodeCallback };

// Target = {addEventListener, removeEventListener}|{addListener, removeListener}|{on, off}
// (Target, string, Function|undefined) -> Stream
import fromEvents from './primary/from-events';
Kefir.fromEvents = fromEvents;
export { fromEvents };

// (Function) -> Stream
import stream from './primary/stream';
Kefir.stream = stream;
export { stream };



// Create a property
// -----------------------------------------------------------------------------

// (any) -> Property
import constant from './primary/constant';
Kefir.constant = constant;
export { constant };

// (any) -> Property
import constantError from './primary/constant-error';
Kefir.constantError = constantError;
export { constantError };





import toProperty from './one-source/to-property';
Observable.prototype.toProperty = function(fn) {
  return toProperty(this, fn);
};

import changes from './one-source/changes';
Observable.prototype.changes = function() {
  return changes(this);
};



// Interoperation with other implimentations
// -----------------------------------------------------------------------------

// (Promise) -> Property
import fromPromise from './interop/from-promise';
Kefir.fromPromise = fromPromise;
export { fromPromise };

import toPromise from './interop/to-promise';
Observable.prototype.toPromise = function(Promise) {
  return toPromise(this, Promise);
};

// (ESObservable) -> Stream
import fromESObservable from './interop/from-es-observable';
Kefir.fromESObservable = fromESObservable;
export { fromESObservable };

import toESObservable from './interop/to-es-observable';
Observable.prototype.toESObservable = toESObservable;
import symbol from './utils/symbol'
Observable.prototype[symbol('observable')] = toESObservable;





import map from './one-source/map';
Observable.prototype.map = function(fn) {
  return map(this, fn);
};

import filter from './one-source/filter';
Observable.prototype.filter = function(fn) {
  return filter(this, fn);
};

import take from './one-source/take';
Observable.prototype.take = function(n) {
  return take(this, n);
};

import takeErrors from './one-source/take-errors';
Observable.prototype.takeErrors = function(n) {
  return takeErrors(this, n);
};

import takeWhile from './one-source/take-while';
Observable.prototype.takeWhile = function(fn) {
  return takeWhile(this, fn);
};

import last from './one-source/last';
Observable.prototype.last = function() {
  return last(this);
};

import skip from './one-source/skip';
Observable.prototype.skip = function(n) {
  return skip(this, n);
};

import skipWhile from './one-source/skip-while';
Observable.prototype.skipWhile = function(fn) {
  return skipWhile(this, fn);
};

import skipDuplicates from './one-source/skip-duplicates';
Observable.prototype.skipDuplicates = function(fn) {
  return skipDuplicates(this, fn);
};

import diff from './one-source/diff';
Observable.prototype.diff = function(fn, seed) {
  return diff(this, fn, seed);
};

import scan from './one-source/scan';
Observable.prototype.scan = function(fn, seed) {
  return scan(this, fn, seed);
};

import flatten from './one-source/flatten';
Observable.prototype.flatten = function(fn) {
  return flatten(this, fn);
};

import delay from './one-source/delay';
Observable.prototype.delay = function(wait) {
  return delay(this, wait);
};

import throttle from './one-source/throttle';
Observable.prototype.throttle = function(wait, options) {
  return throttle(this, wait, options);
};

import debounce from './one-source/debounce';
Observable.prototype.debounce = function(wait, options) {
  return debounce(this, wait, options);
};

import mapErrors from './one-source/map-errors';
Observable.prototype.mapErrors = function(fn) {
  return mapErrors(this, fn);
};

import filterErrors from './one-source/filter-errors';
Observable.prototype.filterErrors = function(fn) {
  return filterErrors(this, fn);
};

import ignoreValues from './one-source/ignore-values';
Observable.prototype.ignoreValues = function() {
  return ignoreValues(this);
};

import ignoreErrors from './one-source/ignore-errors';
Observable.prototype.ignoreErrors = function() {
  return ignoreErrors(this);
};

import ignoreEnd from './one-source/ignore-end';
Observable.prototype.ignoreEnd = function() {
  return ignoreEnd(this);
};

import beforeEnd from './one-source/before-end';
Observable.prototype.beforeEnd = function(fn) {
  return beforeEnd(this, fn);
};

import slidingWindow from './one-source/sliding-window';
Observable.prototype.slidingWindow = function(max, min) {
  return slidingWindow(this, max, min);
};

import bufferWhile from './one-source/buffer-while';
Observable.prototype.bufferWhile = function(fn, options) {
  return bufferWhile(this, fn, options);
};

import bufferWithCount from './one-source/buffer-with-count';
Observable.prototype.bufferWithCount = function(count, options) {
  return bufferWithCount(this, count, options);
};

import bufferWithTimeOrCount from './one-source/buffer-with-time-or-count';
Observable.prototype.bufferWithTimeOrCount = function(wait, count, options) {
  return bufferWithTimeOrCount(this, wait, count, options);
};

import transduce from './one-source/transduce';
Observable.prototype.transduce = function(transducer) {
  return transduce(this, transducer);
};

import withHandler from './one-source/with-handler';
Observable.prototype.withHandler = function(fn) {
  return withHandler(this, fn);
};





// Combine observables
// -----------------------------------------------------------------------------

// (Array<Stream|Property>, Function|undefiend) -> Stream
// (Array<Stream|Property>, Array<Stream|Property>, Function|undefiend) -> Stream
import combine from './many-sources/combine';
Kefir.combine = combine;
export { combine };
Observable.prototype.combine = function(other, combinator) {
  return combine([this, other], combinator);
};

// (Array<Stream|Property>, Function|undefiend) -> Stream
import zip from './many-sources/zip';
Kefir.zip = zip;
export { zip };
Observable.prototype.zip = function(other, combinator) {
  return zip([this, other], combinator);
};

// (Array<Stream|Property>) -> Stream
import merge from './many-sources/merge';
Kefir.merge = merge;
export { merge };
Observable.prototype.merge = function(other) {
  return merge([this, other]);
};

// (Array<Stream|Property>) -> Stream
import concat from './many-sources/concat';
Kefir.concat = concat;
export { concat };
Observable.prototype.concat = function(other) {
  return concat([this, other]);
};

// () -> Pool
import Pool from './many-sources/pool';
Kefir.Pool = Pool;
const pool = function() {
  return new Pool();
};
Kefir.pool = pool;
export { Pool, pool };

// (Function) -> Stream
import repeat from './many-sources/repeat';
Kefir.repeat = repeat;
export { repeat };

import FlatMap from './many-sources/flat-map';
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

import FlatMapErrors from './many-sources/flat-map-errors';
Observable.prototype.flatMapErrors = function(fn) {
  return new FlatMapErrors(this, fn).setName(this, 'flatMapErrors');
};






import filterBy from './two-sources/filter-by';
Observable.prototype.filterBy = function(other) {
  return filterBy(this, other);
};

import sampledBy2items from './two-sources/sampled-by';
Observable.prototype.sampledBy = function(other, combinator) {
  return sampledBy2items(this, other, combinator);
};

import skipUntilBy from './two-sources/skip-until-by';
Observable.prototype.skipUntilBy = function(other) {
  return skipUntilBy(this, other);
};

import takeUntilBy from './two-sources/take-until-by';
Observable.prototype.takeUntilBy = function(other) {
  return takeUntilBy(this, other);
};

import bufferBy from './two-sources/buffer-by';
Observable.prototype.bufferBy = function(other, options) {
  return bufferBy(this, other, options);
};

import bufferWhileBy from './two-sources/buffer-while-by';
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

import awaiting from './two-sources/awaiting';
Observable.prototype.awaiting = function(other) {
  warn('You are using deprecated .awaiting() method, see https://github.com/rpominov/kefir/issues/145')
  return awaiting(this, other);
};

import valuesToErrors from './one-source/values-to-errors';
Observable.prototype.valuesToErrors = function(fn) {
  warn('You are using deprecated .valuesToErrors() method, see https://github.com/rpominov/kefir/issues/149')
  return valuesToErrors(this, fn);
};

import errorsToValues from './one-source/errors-to-values';
Observable.prototype.errorsToValues = function(fn) {
  warn('You are using deprecated .errorsToValues() method, see https://github.com/rpominov/kefir/issues/149')
  return errorsToValues(this, fn);
};

import endOnError from './one-source/end-on-error';
Observable.prototype.endOnError = function() {
  warn('You are using deprecated .endOnError() method, see https://github.com/rpominov/kefir/issues/150')
  return endOnError(this);
};
