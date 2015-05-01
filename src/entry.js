import Kefir from './kefir';
import Observable from './observable';
import Stream from './stream';
import Property from './property';
import deprecated from './patterns/deprecated';
import {isFn} from './utils/types';
import {circleShift} from './utils/collections';
import {apply} from './utils/functions';



Kefir.Observable = Observable;
Kefir.Stream = Stream;
Kefir.Property = Property;



import {StreamStream, Emitter, neverInstance, Constant, ConstantError, Repeat} from './primary';

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



import {MapStream, MapProperty} from './one-source/map';

Stream.prototype.map = function(fn = (x => x)) {
  return new MapStream(this, {fn});
};

Property.prototype.map = function(fn = (x => x)) {
  return new MapProperty(this, {fn});
};



import {WithHandlerStream, WithHandlerProperty} from './one-source/with-handler';

Stream.prototype.withHandler = function(fn) {
  return new WithHandlerStream(this, {fn});
};

Property.prototype.withHandler = function(fn) {
  return new WithHandlerProperty(this, {fn});
};



import {DebounceStream, DebounceProperty} from './one-source/debounce';

Stream.prototype.debounce = function(wait, {immediate = false} = {}) {
  return new DebounceStream(this, {wait, immediate});
};

Property.prototype.debounce = function(wait, {immediate = false} = {}) {
  return new DebounceProperty(this, {wait, immediate});
};



import {ThrottleStream, ThrottleProperty} from './one-source/throttle';

Stream.prototype.throttle = function(wait, {leading = true, trailing = true} = {}) {
  return new ThrottleStream(this, {wait, leading, trailing});
};

Property.prototype.throttle = function(wait, {leading = true, trailing = true} = {}) {
  return new ThrottleProperty(this, {wait, leading, trailing});
};



import {BufferWhileStream, BufferWhileProperty} from './one-source/buffer-while';

Stream.prototype.bufferWhile = function(fn = (x => x), {flushOnEnd = true} = {}) {
  return new BufferWhileStream(this, {fn, flushOnEnd});
};

Property.prototype.bufferWhile = function(fn = (x => x), {flushOnEnd = true} = {}) {
  return new BufferWhileProperty(this, {fn, flushOnEnd});
};



import ToPropertyProperty from './one-source/to-property';

Observable.prototype.toProperty = function(fn) {
  return new ToPropertyProperty(this, {fn});
};



import ChangesStream from './one-source/changes';

Observable.prototype.changes = function() {
  return new ChangesStream(this);
};



import ScapProperty from './one-source/scan';

Observable.prototype.scan = function(...args) {
  return new ScapProperty(this, args);
};



import {Merge, Concat, Pool, Bus, FlatMap, Zip, Combine} from './multiple-sources';

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




import intervalBased from './interval';
import oneSource from './one-source';
import twoSources from './two-sources';
import sugar from './sugar';



// Not using ES6 `export` by intent
Kefir.Kefir = Kefir;
module.exports = Kefir;



