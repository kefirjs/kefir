const Kefir = require('./kefir');
const Observable = require('./observable');
const deprecated = require('./patterns/deprecated');
const {isFn} = require('./utils/types');
const {circleShift} = require('./utils/collections');
const {apply} = require('./utils/functions');
const {NOTHING} = require('./constants');
const {StreamStream, Emitter, Constant, ConstantError, Repeat} = require('./primary');
const {Merge, Concat, Pool, Bus, FlatMap, Zip, Combine} = require('./multiple-sources');
require('./two-sources');
require('./sugar');


Kefir.Observable = Observable;
Kefir.Stream = require('./stream');
Kefir.Property = require('./property');


// Create a stream
// -----------------------------------------------------------------------------

// - never
const never = require('./primary/never');
Kefir.never = never;

// - later
Kefir.later = require('./time-based/later');

// - interval
Kefir.interval = require('./time-based/interval');

// - sequentially
const sequentially = require('./time-based/sequentially');
Kefir.sequentially = function(wait, xs) {
  return xs.length === 0 ? never() : sequentially(wait, xs);
};

// - fromPoll
Kefir.fromPoll = require('./time-based/from-poll');

// - withInterval
Kefir.withInterval = require('./time-based/with-interval');

// - fromCallback
// - fromNodeCallback
// - fromEvents

// - stream
Kefir.stream = function(fn) {
  return new StreamStream(fn);
};


// Create a property
// -----------------------------------------------------------------------------

// - constant
Kefir.constant = function(x) {
  return new Constant(x);
};

// - constantError
Kefir.constantError = function(x) {
  return new ConstantError(x);
};

// - fromPromise


// Convert observables
// -----------------------------------------------------------------------------

// - toProperty
const toProperty = require('./one-source/to-property');
Observable.prototype.toProperty = function(fn = null) {
  if (fn !== null && !isFn(fn)) {
    throw new TypeError('The .toProperty method must be called with no args or with a function as an argument');
  }
  return toProperty(this, fn);
};

// - changes
const changes = require('./one-source/changes');
Observable.prototype.changes = function() {
  return changes(this);
};


// Modify an observable
// -----------------------------------------------------------------------------

// - map
const map = require('./one-source/map');
Observable.prototype.map = function(fn = (x) => x) {
  return map(this, fn);
};

// - filter
const filter = require('./one-source/filter');
Observable.prototype.filter = function(fn = (x) => x) {
  return filter(this, fn);
};

// - take
const take = require('./one-source/take');
Observable.prototype.take = function(n) {
  return take(this, n);
};

// - takeWhile
const takeWhile = require('./one-source/take-while');
Observable.prototype.takeWhile = function(fn = (x) => x) {
  return takeWhile(this, fn);
};

// - last
const last = require('./one-source/last');
Observable.prototype.last = function() {
  return last(this);
};

// - skip
const skip = require('./one-source/skip');
Observable.prototype.skip = function(n) {
  return skip(this, n);
};

// - skipWhile
const skipWhile = require('./one-source/skip-while');
Observable.prototype.skipWhile = function(fn = (x) => x) {
  return skipWhile(this, fn);
};

// - skipDuplicates
const skipDuplicates = require('./one-source/skip-duplicates');
Observable.prototype.skipDuplicates = function(fn = (a, b) => a === b) {
  return skipDuplicates(this, fn);
};

// - diff
const diff = require('./one-source/diff');
function defaultDiff(a, b) {
  return [a, b];
}
Observable.prototype.diff = function(fn /* Function | falsey */, seed = NOTHING) {
  return diff(this, fn || defaultDiff, seed);
};

// - scan
const scan = require('./one-source/scan');
Observable.prototype.scan = function(fn, seed = NOTHING) {
  return scan(this, fn, seed);
};

// - flatten
const flatten = require('./one-source/flatten');
Observable.prototype.flatten = function(fn = (x) => x) {
  return flatten(this, fn);
};

// - delay
const delay = require('./one-source/delay');
Observable.prototype.delay = function(wait) {
  return delay(this, wait);
};

// - throttle
const throttle = require('./one-source/throttle');
Observable.prototype.throttle = function(wait, {leading = true, trailing = true} = {}) {
  return throttle(this, wait, {leading, trailing});
};

// - debounce
const debounce = require('./one-source/debounce');
Observable.prototype.debounce = function(wait, {immediate = false} = {}) {
  return debounce(this, wait, {immediate});
};

// - valuesToErrors
const valuesToErrors = require('./one-source/values-to-errors');
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
const combine = require('./many-sources/combine');
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
Kefir.zip = function(sources, combinator) {
  return new Zip(sources, combinator);
};
Observable.prototype.zip = function(other, combinator) {
  return new Zip([this, other], combinator);
};

// - merge
Kefir.merge = function(obss) {
  return new Merge(obss);
};
Observable.prototype.merge = function(other) {
  return Kefir.merge([this, other]);
};

// - concat
Kefir.concat = function(obss) {
  return new Concat(obss);
};
Observable.prototype.concat = function(other) {
  return Kefir.concat([this, other]);
};

// - pool
Kefir.Pool = Pool;
Kefir.pool = function() {
  return new Pool();
};

// - repeat
Kefir.repeat = function(generator) {
  return new Repeat(generator);
};

// - flatMap
Observable.prototype.flatMap = function(fn) {
  return new FlatMap(this, fn)
    .setName(this, 'flatMap');
};

// - flatMapLatest
Observable.prototype.flatMapLatest = function(fn) {
  return new FlatMap(this, fn, {concurLim: 1, drop: 'old'})
    .setName(this, 'flatMapLatest');
};

// - flatMapFirst
Observable.prototype.flatMapFirst = function(fn) {
  return new FlatMap(this, fn, {concurLim: 1})
    .setName(this, 'flatMapFirst');
};

// - flatMapConcat
Observable.prototype.flatMapConcat = function(fn) {
  return new FlatMap(this, fn, {queueLim: -1, concurLim: 1})
    .setName(this, 'flatMapConcat');
};

// - flatMapConcurLimit
Observable.prototype.flatMapConcurLimit = function(fn, limit) {
  let result;
  if (limit === 0) {
    result = never();
  } else {
    if (limit < 0) {
      limit = -1;
    }
    result = new FlatMap(this, fn, {queueLim: -1, concurLim: limit});
  }
  return result.setName(this, 'flatMapConcurLimit');
};


// Combine two observables
// -----------------------------------------------------------------------------

// - filterBy
// - sampledBy
function id2(_, x) {return x;}
Observable.prototype.sampledBy = function(other, combinator) {
  let _combinator;
  if (combinator) {
    _combinator = function(active, passive) {
      return combinator(passive, active);
    };
  }
  return combine([other], [this], _combinator || id2).setName(this, 'sampledBy');
};

// - takeWhileBy
// - skipWhileBy
// - skipUntilBy
// - takeUntilBy
// - bufferBy
// - bufferWhileBy
// - awaiting



// Deprecated
// -----------------------------------------------------------------------------

Kefir.Emitter = Emitter;
Kefir.emitter = deprecated('Kefir.emitter()', 'Kefir.stream()', function() {
  return new Emitter();
});

Kefir.Bus = Bus;
Kefir.bus = deprecated('Kefir.bus()', 'Kefir.pool() or Kefir.stream()', function() {
  return new Bus();
});

const reduce = require('./one-source/reduce');
Observable.prototype.reduce = deprecated('.reduce(fn, seed)', '.scan(fn, seed).last()',
  function(fn, seed = NOTHING) {
    return reduce(this, fn, seed);
  }
);

Kefir.sampledBy = deprecated('Kefir.sampledBy()', 'Kefir.combine(active, passive, combinator)',
  function(passive, active, combinator) {

    // we need to flip `passive` and `active` in combinator function
    let _combinator = combinator;
    if (passive.length > 0) {
      let passiveLength = passive.length;
      _combinator = function() {
        let args = circleShift(arguments, passiveLength);
        return combinator ? apply(combinator, null, args) : args;
      };
    }

    return combine(active, passive, _combinator).setName('sampledBy');
  }
);

const repeatedly = require('./time-based/repeatedly');
Kefir.repeatedly = deprecated('Kefir.repeatedly()',
  'Kefir.repeat(() => Kefir.sequentially(...)})', repeatedly);




// -----------------------------------------------------------------------------

module.exports = Kefir;
module.exports.Kefir = Kefir;
