const Kefir = require('./kefir');
const Observable = require('./observable');
const Stream = require('./stream');
const Property = require('./property');
const deprecated = require('./patterns/deprecated');
const {isFn} = require('./utils/types');
const {circleShift} = require('./utils/collections');
const {apply} = require('./utils/functions');
const {NOTHING} = require('./constants');



Kefir.Observable = Observable;
Kefir.Stream = Stream;
Kefir.Property = Property;



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



const {SlidingWindowStream, SlidingWindowProperty} = require('./one-source/sliding-window');

Stream.prototype.slidingWindow = function(max, min = 0) {
  return new SlidingWindowStream(this, {min, max});
};

Property.prototype.slidingWindow = function(max, min = 0) {
  return new SlidingWindowProperty(this, {min, max});
};



const {SkipWhileStream, SkipWhileProperty} = require('./one-source/skip-while');

Stream.prototype.skipWhile = function(fn = (x) => x) {
  return new SkipWhileStream(this, {fn});
};

Property.prototype.skipWhile = function(fn = (x) => x) {
  return new SkipWhileProperty(this, {fn});
};



const {TakeWhileStream, TakeWhileProperty} = require('./one-source/take-while');

Stream.prototype.takeWhile = function(fn = (x) => x) {
  return new TakeWhileStream(this, {fn});
};

Property.prototype.takeWhile = function(fn = (x) => x) {
  return new TakeWhileProperty(this, {fn});
};



const {SkipStream, SkipProperty} = require('./one-source/skip');

Stream.prototype.skip = function(n) {
  return new SkipStream(this, {n});
};

Property.prototype.skip = function(n) {
  return new SkipProperty(this, {n});
};



const {TakeStream, TakeProperty} = require('./one-source/take');

Stream.prototype.take = function(n) {
  return new TakeStream(this, {n});
};

Property.prototype.take = function(n) {
  return new TakeProperty(this, {n});
};



const {SkipDuplicatesStream, SkipDuplicatesProperty} = require('./one-source/skip-duplicates');

Stream.prototype.skipDuplicates = function(fn = (a, b) => a === b) {
  return new SkipDuplicatesStream(this, {fn});
};

Property.prototype.skipDuplicates = function(fn = (a, b) => a === b) {
  return new SkipDuplicatesProperty(this, {fn});
};



const {SkipEndStream, SkipEndProperty} = require('./one-source/skip-end');

Stream.prototype.skipEnd = function() {
  return new SkipEndStream(this);
};

Property.prototype.skipEnd = function() {
  return new SkipEndProperty(this);
};



const {SkipErrorsStream, SkipErrorsProperty} = require('./one-source/skip-errors');

Stream.prototype.skipErrors = function() {
  return new SkipErrorsStream(this);
};

Property.prototype.skipErrors = function() {
  return new SkipErrorsProperty(this);
};



const {SkipValuesStream, SkipValuesProperty} = require('./one-source/skip-values');

Stream.prototype.skipValues = function() {
  return new SkipValuesStream(this);
};

Property.prototype.skipValues = function() {
  return new SkipValuesProperty(this);
};



const {FilterErrorsStream, FilterErrorsProperty} = require('./one-source/filter-errors');

Stream.prototype.filterErrors = function(fn = (x) => x) {
  return new FilterErrorsStream(this, {fn});
};

Property.prototype.filterErrors = function(fn = (x) => x) {
  return new FilterErrorsProperty(this, {fn});
};



const {FilterStream, FilterProperty} = require('./one-source/filter');

Stream.prototype.filter = function(fn = (x) => x) {
  return new FilterStream(this, {fn});
};

Property.prototype.filter = function(fn = (x) => x) {
  return new FilterProperty(this, {fn});
};



const {EndOnErrorStream, EndOnErrorProperty} = require('./one-source/end-on-error');

Stream.prototype.endOnError = function() {
  return new EndOnErrorStream(this);
};

Property.prototype.endOnError = function() {
  return new EndOnErrorProperty(this);
};



const {DiffStream, DiffProperty} = require('./one-source/diff');

function defaultDiffHandler(a, b) {
  return [a, b];
}

Stream.prototype.diff = function(fn, seed = NOTHING) {
  // `fn` is optional but we want also to support `null` as "no fn"
  fn = fn || defaultDiffHandler;
  return new DiffStream(this, {fn, seed});
};

Property.prototype.diff = function(fn, seed = NOTHING) {
  fn = fn || defaultDiffHandler;
  return new DiffProperty(this, {fn, seed});
};



const {BeforeEndStream, BeforeEndProperty} = require('./one-source/before-end');

Stream.prototype.beforeEnd = function(fn) {
  return new BeforeEndStream(this, {fn});
};

Property.prototype.beforeEnd = function(fn) {
  return new BeforeEndProperty(this, {fn});
};



const {DelayStream, DelayProperty} = require('./one-source/delay');

Stream.prototype.delay = function(wait) {
  return new DelayStream(this, {wait});
};

Property.prototype.delay = function(wait) {
  return new DelayProperty(this, {wait});
};



const {MapErrorsStream, MapErrorsProperty} = require('./one-source/map-errors');

Stream.prototype.mapErrors = function(fn = (x) => x) {
  return new MapErrorsStream(this, {fn});
};

Property.prototype.mapErrors = function(fn = (x) => x) {
  return new MapErrorsProperty(this, {fn});
};



const {ErrorsToValuesStream, ErrorsToValuesProperty} = require('./one-source/errors-to-values');

Stream.prototype.errorsToValues = function(fn = (x => ({convert: true, value: x}))) {
  return new ErrorsToValuesStream(this, {fn});
};

Property.prototype.errorsToValues = function(fn = (x => ({convert: true, value: x}))) {
  return new ErrorsToValuesProperty(this, {fn});
};



const {ValuesToErrorsStream, ValuesToErrorsProperty} = require('./one-source/values-to-errors');

Stream.prototype.valuesToErrors = function(fn = (x => ({convert: true, error: x}))) {
  return new ValuesToErrorsStream(this, {fn});
};

Property.prototype.valuesToErrors = function(fn = (x => ({convert: true, error: x}))) {
  return new ValuesToErrorsProperty(this, {fn});
};



const {FlattenStream, FlattenProperty} = require('./one-source/flatten');

Stream.prototype.flatten = function(fn = (x) => x) {
  return new FlattenStream(this, {fn});
};

Property.prototype.flatten = function(fn = (x) => x) {
  return new FlattenProperty(this, {fn});
};



const {TransduceStream, TransduceProperty} = require('./one-source/transduce');

Stream.prototype.transduce = function(transducer) {
  return new TransduceStream(this, {transducer});
};

Property.prototype.transduce = function(transducer) {
  return new TransduceProperty(this, {transducer});
};



const {LastStream, LastProperty} = require('./one-source/last');

Stream.prototype.last = function() {
  return new LastStream(this);
};

Property.prototype.last = function() {
  return new LastProperty(this);
};



const {WithHandlerStream, WithHandlerProperty} = require('./one-source/with-handler');

Stream.prototype.withHandler = function(fn) {
  return new WithHandlerStream(this, {fn});
};

Property.prototype.withHandler = function(fn) {
  return new WithHandlerProperty(this, {fn});
};



const {DebounceStream, DebounceProperty} = require('./one-source/debounce');

Stream.prototype.debounce = function(wait, {immediate = false} = {}) {
  return new DebounceStream(this, {wait, immediate});
};

Property.prototype.debounce = function(wait, {immediate = false} = {}) {
  return new DebounceProperty(this, {wait, immediate});
};



const {ThrottleStream, ThrottleProperty} = require('./one-source/throttle');

Stream.prototype.throttle = function(wait, {leading = true, trailing = true} = {}) {
  return new ThrottleStream(this, {wait, leading, trailing});
};

Property.prototype.throttle = function(wait, {leading = true, trailing = true} = {}) {
  return new ThrottleProperty(this, {wait, leading, trailing});
};



const {BufferWhileStream, BufferWhileProperty} = require('./one-source/buffer-while');

Stream.prototype.bufferWhile = function(fn = (x) => x, {flushOnEnd = true} = {}) {
  return new BufferWhileStream(this, {fn, flushOnEnd});
};

Property.prototype.bufferWhile = function(fn = (x) => x, {flushOnEnd = true} = {}) {
  return new BufferWhileProperty(this, {fn, flushOnEnd});
};



const ToPropertyProperty = require('./one-source/to-property');

Observable.prototype.toProperty = function(fn) {
  return new ToPropertyProperty(this, {fn});
};



const ChangesStream = require('./one-source/changes');

Observable.prototype.changes = function() {
  return new ChangesStream(this);
};



const ScapProperty = require('./one-source/scan');

Observable.prototype.scan = function(fn, seed = NOTHING) {
  return new ScapProperty(this, {fn, seed});
};



const {ReduceProperty, ReduceStream} = require('./one-source/reduce');

Property.prototype.reduce = deprecated('.reduce(fn, seed)', '.scan(fn, seed).last()',
  function(fn, seed = NOTHING) {
    return new ReduceProperty(this, {fn, seed});
  }
);

Stream.prototype.reduce = deprecated('.reduce(fn, seed)', '.scan(fn, seed).last()',
  function(fn, seed = NOTHING) {
    return new ReduceStream(this, {fn, seed});
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
  var result;
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
    var _combinator = combinator;
    if (passive.length > 0) {
      var passiveLength = passive.length;
      _combinator = function() {
        var args = circleShift(arguments, passiveLength);
        return combinator ? apply(combinator, null, args) : args;
      };
    }

    return new Combine(active, passive, _combinator).setName('sampledBy');
  }
);
Observable.prototype.sampledBy = function(other, combinator) {
  var _combinator;
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
