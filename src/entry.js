const Kefir = require('./kefir');
const Observable = require('./observable');
const deprecated = require('./patterns/deprecated');
const {isFn} = require('./utils/types');
const {circleShift} = require('./utils/collections');
const {apply} = require('./utils/functions');
const {NOTHING} = require('./constants');



Kefir.Observable = Observable;
Kefir.Stream = require('./stream');
Kefir.Property = require('./property');



const {StreamStream, Emitter, neverInstance, Constant, ConstantError, Repeat} = require('./primary');

Kefir.stream = function(fn) {
  return new StreamStream(fn);
};

Kefir.Emitter = Emitter;
Kefir.emitter = deprecated('Kefir.emitter()', 'Kefir.stream()', function() {
  return new Emitter();
});

Kefir.never = function() {
  return neverInstance;
};

Kefir.constant = function(x) {
  return new Constant(x);
};

Kefir.constantError = function(x) {
  return new ConstantError(x);
};

Kefir.repeat = function(generator) {
  return new Repeat(generator);
};



const map = require('./one-source/map');

Observable.prototype.map = function(fn = (x) => x) {
  return map(this, fn);
};



const slidingWindow = require('./one-source/sliding-window');

Observable.prototype.slidingWindow = function(max, min = 0) {
  return slidingWindow(this, max, min);
};



const skipWhile = require('./one-source/skip-while');

Observable.prototype.skipWhile = function(fn = (x) => x) {
  return skipWhile(this, fn);
};



const takeWhile = require('./one-source/take-while');

Observable.prototype.takeWhile = function(fn = (x) => x) {
  return takeWhile(this, fn);
};



const skip = require('./one-source/skip');

Observable.prototype.skip = function(n) {
  return skip(this, n);
};



const take = require('./one-source/take');

Observable.prototype.take = function(n) {
  return take(this, n);
};



const skipDuplicates = require('./one-source/skip-duplicates');

Observable.prototype.skipDuplicates = function(fn = (a, b) => a === b) {
  return skipDuplicates(this, fn);
};



const skipEnd = require('./one-source/skip-end');

Observable.prototype.skipEnd = function() {
  return skipEnd(this);
};



const skipErrors = require('./one-source/skip-errors');

Observable.prototype.skipErrors = function() {
  return skipErrors(this);
};



const skipValues = require('./one-source/skip-values');

Observable.prototype.skipValues = function() {
  return skipValues(this);
};



const filterErrors = require('./one-source/filter-errors');

Observable.prototype.filterErrors = function(fn = (x) => x) {
  return filterErrors(this, fn);
};



const filter = require('./one-source/filter');

Observable.prototype.filter = function(fn = (x) => x) {
  return filter(this, fn);
};



const endOnError = require('./one-source/end-on-error');

Observable.prototype.endOnError = function() {
  return endOnError(this);
};



const diff = require('./one-source/diff');

function defaultDiff(a, b) {
  return [a, b];
}

Observable.prototype.diff = function(fn, seed = NOTHING) {
  return diff(this, fn || defaultDiff, seed); // we want to also support `null` as "no fn"
};



const beforeEnd = require('./one-source/before-end');

Observable.prototype.beforeEnd = function(fn) {
  return beforeEnd(this, fn);
};



const delay = require('./one-source/delay');

Observable.prototype.delay = function(wait) {
  return delay(this, wait);
};



const mapErrors = require('./one-source/map-errors');

Observable.prototype.mapErrors = function(fn = (x) => x) {
  return mapErrors(this, fn);
};



const errorsToValues = require('./one-source/errors-to-values');

Observable.prototype.errorsToValues = function(fn = (x) => ({convert: true, value: x})) {
  return errorsToValues(this, fn);
};



const valuesToErrors = require('./one-source/values-to-errors');

Observable.prototype.valuesToErrors = function(fn = (x => ({convert: true, error: x}))) {
  return valuesToErrors(this, fn);
};



const flatten = require('./one-source/flatten');

Observable.prototype.flatten = function(fn = (x) => x) {
  return flatten(this, fn);
};



const transduce = require('./one-source/transduce');

Observable.prototype.transduce = function(transducer) {
  return transduce(this, transducer);
};



const last = require('./one-source/last');

Observable.prototype.last = function() {
  return last(this);
};



const withHandler = require('./one-source/with-handler');

Observable.prototype.withHandler = function(fn) {
  return withHandler(this, fn);
};



const debounce = require('./one-source/debounce');

Observable.prototype.debounce = function(wait, {immediate = false} = {}) {
  return debounce(this, wait, {immediate});
};



const throttle = require('./one-source/throttle');

Observable.prototype.throttle = function(wait, {leading = true, trailing = true} = {}) {
  return throttle(this, wait, {leading, trailing});
};



const bufferWhile = require('./one-source/buffer-while');

Observable.prototype.bufferWhile = function(fn = (x) => x, {flushOnEnd = true} = {}) {
  return bufferWhile(this, fn, {flushOnEnd});
};



const toProperty = require('./one-source/to-property');

Observable.prototype.toProperty = function(fn = null) {
  if (fn !== null && !isFn(fn)) {
    throw new TypeError('The .toProperty method must be called with no args or with a function as an argument');
  }
  return toProperty(this, fn);
};



const changes = require('./one-source/changes');

Observable.prototype.changes = function() {
  return changes(this);
};



const scan = require('./one-source/scan');

Observable.prototype.scan = function(fn, seed = NOTHING) {
  return scan(this, fn, seed);
};



const reduce = require('./one-source/reduce');

Observable.prototype.reduce = deprecated('.reduce(fn, seed)', '.scan(fn, seed).last()',
  function(fn, seed = NOTHING) {
    return reduce(this, fn, seed);
  }
);






const {Merge, Concat, Pool, Bus, FlatMap, Zip, Combine} = require('./multiple-sources');

Kefir.merge = function(obss) {
  return new Merge(obss);
};
Observable.prototype.merge = function(other) {
  return Kefir.merge([this, other]);
};

Kefir.concat = function(obss) {
  return new Concat(obss);
};
Observable.prototype.concat = function(other) {
  return Kefir.concat([this, other]);
};

Kefir.Pool = Pool;
Kefir.pool = function() {
  return new Pool();
};

Kefir.Bus = Bus;
Kefir.bus = deprecated('Kefir.bus()', 'Kefir.pool() or Kefir.stream()', function() {
  return new Bus();
});

Observable.prototype.flatMap = function(fn) {
  return new FlatMap(this, fn)
    .setName(this, 'flatMap');
};
Observable.prototype.flatMapLatest = function(fn) {
  return new FlatMap(this, fn, {concurLim: 1, drop: 'old'})
    .setName(this, 'flatMapLatest');
};
Observable.prototype.flatMapFirst = function(fn) {
  return new FlatMap(this, fn, {concurLim: 1})
    .setName(this, 'flatMapFirst');
};
Observable.prototype.flatMapConcat = function(fn) {
  return new FlatMap(this, fn, {queueLim: -1, concurLim: 1})
    .setName(this, 'flatMapConcat');
};
Observable.prototype.flatMapConcurLimit = function(fn, limit) {
  let result;
  if (limit === 0) {
    result = Kefir.never();
  } else {
    if (limit < 0) {
      limit = -1;
    }
    result = new FlatMap(this, fn, {queueLim: -1, concurLim: limit});
  }
  return result.setName(this, 'flatMapConcurLimit');
};

Kefir.zip = function(sources, combinator) {
  return new Zip(sources, combinator);
};
Observable.prototype.zip = function(other, combinator) {
  return new Zip([this, other], combinator);
};

Kefir.combine = function(active, passive, combinator) {
  if (isFn(passive)) {
    combinator = passive;
    passive = null;
  }
  return new Combine(active, passive || [], combinator);
};
Observable.prototype.combine = function(other, combinator) {
  return Kefir.combine([this, other], combinator);
};

function id2(_, x) {return x;}
Kefir.sampledBy = deprecated(
  'Kefir.sampledBy()',
  'Kefir.combine(active, passive, combinator)',
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

    return new Combine(active, passive, _combinator).setName('sampledBy');
  }
);
Observable.prototype.sampledBy = function(other, combinator) {
  let _combinator;
  if (combinator) {
    _combinator = function(active, passive) {
      return combinator(passive, active);
    };
  }
  return new Combine([other], [this], _combinator || id2).setName(this, 'sampledBy');
};




require('./interval');
require('./two-sources');
require('./sugar');



Kefir.Kefir = Kefir;
module.exports = Kefir;
