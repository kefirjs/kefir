(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! kefir - 0.1.11
 *  https://github.com/pozadi/kefir
 */
(function(global){
  "use strict";

function noop(){}

function id(x){return x}

function own(obj, prop){
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function toArray(arrayLike){
  if (isArray(arrayLike)) {
    return arrayLike;
  } else {
    return Array.prototype.slice.call(arrayLike);
  }
}

function createObj(proto) {
  var F = function(){};
  F.prototype = proto;
  return new F();
}

function extend() {
  if (arguments.length === 1) {
    return arguments[0];
  }
  var result = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    for (var prop in arguments[i]) {
      if(own(arguments[i], prop)) {
        result[prop] = arguments[i][prop];
      }
    }
  }
  return result;
}

function inherit(Child, Parent/*[, mixin1, mixin2, ...]*/) {
  Child.prototype = createObj(Parent.prototype);
  Child.prototype.constructor = Child;
  for (var i = 2; i < arguments.length; i++) {
    extend(Child.prototype, arguments[i]);
  }
  return Child;
}

function inheritMixin(Child, Parent) {
  for (var prop in Parent) {
    if (own(Parent, prop) && !(prop in Child)) {
      Child[prop] = Parent[prop];
    }
  }
  return Child;
}

function firstArrOrToArr(args) {
  if (isArray(args[0])) {
    return args[0];
  }
  return toArray(args);
}

function rest(arr, start, onEmpty){
  if (arr.length > start) {
    return Array.prototype.slice.call(arr, start);
  }
  return onEmpty;
}

function getFn(fn, context) {
  if (isFn(fn)) {
    return fn;
  } else {
    /*jshint eqnull:true */
    if (context == null || !isFn(context[fn])) {
      throw new Error('not a function: ' + fn + ' in ' + context);
    } else {
      return context[fn];
    }
  }
}

function isFn(fn) {
  return typeof fn === 'function';
}

function isUndefined(x) {
  return typeof x === 'undefined';
}

function isArray(xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
}

var isArguments = function(xs) {
  return Object.prototype.toString.call(xs) === '[object Arguments]';
}

// For IE
if (!isArguments(arguments)) {
  isArguments = function(obj) {
    return !!(obj && own(obj, 'callee'));
  }
}

function isEqualArrays(a, b) {
  /*jshint eqnull:true */
  if (a == null && b == null) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

var now = Date.now ?
  function() { return Date.now() } :
  function() { return new Date().getTime() };

function get(map, key, notFound){
  if (map && key in map) {
    return map[key];
  } else {
    return notFound;
  }
}

var Kefir = {};



// Special values

var NOTHING = Kefir.NOTHING = ['<nothing>'];
var END = Kefir.END = ['<end>'];
var NO_MORE = Kefir.NO_MORE = ['<no more>'];

// Example:
//   stream.__sendAny(Kefir.bunch(1, 2, Kefir.END))
Kefir.BunchOfValues = function(values){
  this.values = values;
}
Kefir.bunch = function() {
  return new Kefir.BunchOfValues(firstArrOrToArr(arguments));
}

// Example:
//   stream.__sendAny(Kefir.error('network error'))
Kefir.Error = function(error) {
  this.error = error;
}

Kefir.error = function(error) {
  return new Kefir.Error(error);
}




// Callable

function Callable(fnMeta) {
  if (isFn(fnMeta) || (fnMeta instanceof Callable)) {
    return fnMeta;
  }
  if (isArray(fnMeta) || isArguments(fnMeta)) {
    if (fnMeta.length === 0) {
      throw new Error('can\'t convert to Callable ' + fnMeta);
    }
    if (fnMeta.length === 1) {
      if (isFn(fnMeta[0])) {
        return fnMeta[0];
      } else {
        throw new Error('can\'t convert to Callable ' + fnMeta);
      }
    }
    this.fn = getFn(fnMeta[0], fnMeta[1]);
    this.context = fnMeta[1];
    this.args = rest(fnMeta, 2, null);
  } else {
    throw new Error('can\'t convert to Callable ' + fnMeta);
  }
}


function callFast(fn, context, args) {
  if (context) {
    if (!args || args.length === 0) {
      return fn.call(context);
    } else {
      return fn.apply(context, args);
    }
  } else {
    if (!args || args.length === 0) {
      return fn();
    } else if (args.length === 1) {
      return fn(args[0]);
    } else if (args.length === 2) {
      return fn(args[0], args[1]);
    } else if (args.length === 3) {
      return fn(args[0], args[1], args[2]);
    }
    return fn.apply(null, args);
  }
}

Callable.call = function(callable, args) {
  if (isFn(callable)) {
    return callFast(callable, null, args);
  } else if (callable instanceof Callable) {
    if (callable.args) {
      if (args) {
        args = callable.args.concat(toArray(args));
      } else {
        args = callable.args;
      }
    }
    return callFast(callable.fn, callable.context, args);
  } else {
    return Callable.call(new Callable(callable), args);
  }
}

Callable.isEqual = function(a, b) {
  if (a === b) {
    return true;
  }
  a = new Callable(a);
  b = new Callable(b);
  if (a.fn === b.fn && a.context === b.context && isEqualArrays(a.args, b.args)) {
    return true;
  }
  return false;
}







// Observable

var Observable = Kefir.Observable = function Observable(onFirstIn, onLastOut){

  // __onFirstIn, __onLastOut can also be added to prototype of child classes
  if (isFn(onFirstIn)) {
    this.__onFirstIn = onFirstIn;
  }
  if (isFn(onLastOut)) {
    this.__onLastOut = onLastOut;
  }

  this.__subscribers = {};

}

inherit(Observable, Object, {

  __ClassName: 'Observable',

  toString: function(){
    return '[' + this.__ClassName + (this.__objName ? (' | ' + this.__objName) : '') + ']';
  },

  __onFirstIn: noop,
  __onLastOut: noop,

  __addSubscriber: function(type, fnMeta){
    if (!this.__subscribers[type]) {
      this.__subscribers[type] = [];
    }
    this.__subscribers[type].push(new Callable(fnMeta));
  },

  __removeSubscriber: function(type, fnMeta){
    if (this.__subscribers[type]) {
      for (var i = 0; i < this.__subscribers[type].length; i++) {
        if (this.__subscribers[type][i] !== null && Callable.isEqual(this.__subscribers[type][i], fnMeta)) {
          this.__subscribers[type].splice(i, 1);
          return;
        }
      }
    }
  },

  __isFirsOrLast: function(type) {
    return (type === 'value' || type === 'error') &&
      !this.__hasSubscribers('value') &&
      !this.__hasSubscribers('error');
  },
  __on: function(type, fnMeta){
    if (!this.isEnded()) {
      var firstIn = this.__isFirsOrLast(type);
      this.__addSubscriber(type, fnMeta);
      if (firstIn) {
        this.__onFirstIn();
      }
    } else if (type === 'end') {
      Callable.call(fnMeta);
    }
  },
  __off: function(type, fnMeta){
    if (!this.isEnded()) {
      this.__removeSubscriber(type, fnMeta);
      if (this.__isFirsOrLast(type)) {
        this.__onLastOut();
      }
    }
  },
  __send: function(type, x) {
    if (!this.isEnded()) {
      if (this.__subscribers[type]) {
        var subscribers = this.__subscribers[type].slice(0);
        for (var i = 0; i < subscribers.length; i++) {
          var args = (type === 'end' ? null : [x]);
          if (Callable.call(subscribers[i], args) === NO_MORE) {
            this.__off(type, subscribers[i]);
          }
        }
      }
      if (type === 'end') {
        this.__clear();
      }
    }
  },
  __hasSubscribers: function(type) {
    return !this.isEnded() &&
      !!this.__subscribers[type] &&
      this.__subscribers[type].length > 0;
  },
  __clear: function() {
    this.__onLastOut();
    if (own(this, '__onFirstIn')) {
      this.__onFirstIn = null;
    }
    if (own(this, '__onLastOut')) {
      this.__onLastOut = null;
    }
    this.__subscribers = null;
  },


  __sendValue: function(x){
    this.__send('value', x);
    return this;
  },
  __sendError: function(x){
    this.__send('error', x);
    return this;
  },
  __sendEnd: function(){
    this.__send('end');
    return this;
  },
  __sendAny: function(x){
    if (x === NOTHING) {  return this  }
    if (x === END) {  this.__sendEnd(); return this  }
    if (x instanceof Kefir.Error) {  this.__sendError(x.error); return this  }
    if (x instanceof Kefir.BunchOfValues) {
      for (var i = 0; i < x.values.length; i++) {
        this.__sendAny(x.values[i]);
      }
      return this;
    }
    this.__sendValue(x);
    return this;
  },


  onValue: function(){
    this.__on('value', arguments);
    return this;
  },
  offValue: function(){
    this.__off('value', arguments);
    return this;
  },
  onError: function(){
    this.__on('error', arguments);
    return this;
  },
  offError: function(){
    this.__off('error', arguments);
    return this;
  },
  onEnd: function(){
    this.__on('end', arguments);
    return this;
  },
  offEnd: function(){
    this.__off('end', arguments);
    return this;
  },

  // for Property
  onNewValue: function(){
    return this.onValue.apply(this, arguments);
  },

  isEnded: function() {
    return !this.__subscribers;
  }


})




// Stream

var Stream = Kefir.Stream = function Stream(){
  Observable.apply(this, arguments);
}

inherit(Stream, Observable, {
  __ClassName: 'Stream'
})




// Property

var Property = Kefir.Property = function Property(onFirstIn, onLastOut, initial){
  Observable.call(this, onFirstIn, onLastOut);
  this.__cached = isUndefined(initial) ? NOTHING : initial;
}

inherit(Property, Observable, {

  __ClassName: 'Property',

  hasValue: function(){
    return this.__cached !== NOTHING;
  },
  getValue: function(){
    return this.__cached;
  },

  __sendValue: function(x) {
    if (!this.isEnded()){
      this.__cached = x;
    }
    Observable.prototype.__sendValue.call(this, x);
  },
  onNewValue: function(){
    this.__on('value', arguments);
    return this;
  },
  onValue: function() {
    if ( this.hasValue() ) {
      Callable.call(arguments, [this.__cached]);
    }
    return this.onNewValue.apply(this, arguments);
  }

})



// Log

var logHelper = function(name, type, x) {
  console.log(name, type, x);
}

Observable.prototype.log = function(name) {
  if (!name) {
    name = this.toString();
  }
  this.onValue(logHelper, null, name, '<value>');
  this.onError(logHelper, null, name, '<error>');
  this.onEnd(logHelper, null, name, '<end>');
  return this;
}

// TODO
//
// Kefir.constant(x)
// Kefir.fromArray(values)
// Kefir.fromCallback(fn)



// Kefir.never()

var neverObj = new Stream();
neverObj.__sendEnd();
neverObj.__objName = 'Kefir.never()'
Kefir.never = function() {
  return neverObj;
}




// Kefir.once(x)

Kefir.OnceStream = function OnceStream(value){
  Stream.call(this);
  this.__value = value;
}

inherit(Kefir.OnceStream, Stream, {

  __ClassName: 'OnceStream',
  onValue: function(){
    if (!this.isEnded()) {
      Callable.call(arguments, [this.__value]);
      this.__value = null;
      this.__sendEnd();
    }
    return this;
  },
  onError: noop

})

Kefir.once = function(x) {
  return new Kefir.OnceStream(x);
}





// Kefir.fromBinder(fn)

Kefir.FromBinderStream = function FromBinderStream(subscribeFnMeta){
  Stream.call(this);
  this.__subscribeFn = new Callable(subscribeFnMeta);
}

inherit(Kefir.FromBinderStream, Stream, {

  __ClassName: 'FromBinderStream',
  __onFirstIn: function(){
    var _this = this;
    this.__usubscriber = Callable.call(this.__subscribeFn, [function(x){
      _this.__sendAny(x);
    }]);
  },
  __onLastOut: function(){
    if (isFn(this.__usubscriber)) {
      this.__usubscriber();
    }
    this.__usubscriber = null;
  },
  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__subscribeFn = null;
  }

})

Kefir.fromBinder = function(/*subscribe[, context[, arg1, arg2...]]*/){
  return new Kefir.FromBinderStream(arguments);
}

var WithSourceStreamMixin = {
  __Constructor: function(source) {
    this.__source = source;
    source.onEnd(this.__sendEnd, this);
    if (source instanceof Property && this instanceof Property && source.hasValue()) {
      this.__handle(source.getValue());
    }
  },
  __handle: function(x){
    this.__sendAny(x);
  },
  __onFirstIn: function(){
    this.__source.onNewValue('__handle', this);
    this.__source.onError('__sendError', this);
  },
  __onLastOut: function(){
    this.__source.offValue('__handle', this);
    this.__source.offError('__sendError', this);
  },
  __clear: function(){
    Observable.prototype.__clear.call(this);
    this.__source = null;
  }
}





// observable.toProperty([initial])

Kefir.PropertyFromStream = function PropertyFromStream(source, initial){
  Property.call(this, null, null, initial);
  this.__Constructor(source);
}

inherit(Kefir.PropertyFromStream, Property, WithSourceStreamMixin, {
  __ClassName: 'PropertyFromStream'
})

Stream.prototype.toProperty = function(initial){
  return new Kefir.PropertyFromStream(this, initial);
}

Property.prototype.toProperty = function(initial){
  if (isUndefined(initial)) {
    return this
  } else {
    var prop = new Kefir.PropertyFromStream(this);
    prop.__sendValue(initial);
    return prop;
  }
}






// .scan(seed, fn)

Kefir.ScanProperty = function ScanProperty(source, seed, fnMeta){
  Property.call(this, null, null, seed);
  this.__fn = new Callable(fnMeta);
  this.__Constructor(source);
}

inherit(Kefir.ScanProperty, Property, WithSourceStreamMixin, {

  __ClassName: 'ScanProperty',

  __handle: function(x){
    this.__sendValue( Callable.call(this.__fn, [this.getValue(), x]) );
  },
  __clear: function(){
    WithSourceStreamMixin.__clear.call(this);
    this.__fn = null;
  }

})

Observable.prototype.scan = function(seed/*fn[, context[, arg1, arg2, ...]]*/) {
  return new Kefir.ScanProperty(this, seed, rest(arguments, 1));
}




// .reduce(seed, fn)

Kefir.ReducedProperty = function ReducedProperty(source, seed, fnMeta){
  Property.call(this);
  this.__fn = new Callable(fnMeta);
  this.__result = seed;
  source.onEnd('__sendResult', this);
  this.__Constructor(source);
}

inherit(Kefir.ReducedProperty, Property, WithSourceStreamMixin, {

  __ClassName: 'ReducedProperty',

  __handle: function(x){
    this.__result = Callable.call(this.__fn, [this.__result, x]);
  },
  __sendResult: function(){
    this.__sendValue(this.__result);
  },
  __clear: function(){
    WithSourceStreamMixin.__clear.call(this);
    this.__fn = null;
    this.__result = null;
  }

});

Observable.prototype.reduce = function(seed/*fn[, context[, arg1, arg2, ...]]*/) {
  return new Kefir.ReducedProperty(this, seed, rest(arguments, 1));
}




// .map(fn)

var MapMixin = {
  __Constructor: function(source, mapFnMeta){
    if (this instanceof Property) {
      Property.call(this);
    } else {
      Stream.call(this);
    }
    this.__mapFn = mapFnMeta && new Callable(mapFnMeta);
    WithSourceStreamMixin.__Constructor.call(this, source);
  },
  __handle: function(x){
    this.__sendAny(
      this.__mapFn ? Callable.call(this.__mapFn, [x]) : x
    );
  },
  __clear: function(){
    WithSourceStreamMixin.__clear.call(this);
    this.__mapFn = null;
  }
}
inheritMixin(MapMixin, WithSourceStreamMixin);

Kefir.MappedStream = function MappedStream(){
  this.__Constructor.apply(this, arguments);
}

inherit(Kefir.MappedStream, Stream, MapMixin, {
  __ClassName: 'MappedStream'
});

Kefir.MappedProperty = function MappedProperty(){
  this.__Constructor.apply(this, arguments);
}

inherit(Kefir.MappedProperty, Property, MapMixin, {
  __ClassName: 'MappedProperty'
})

Stream.prototype.map = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  return new Kefir.MappedStream(this, arguments);
}

Property.prototype.map = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  return new Kefir.MappedProperty(this, arguments);
}




// property.changes()

Property.prototype.changes = function() {
  return new Kefir.MappedStream(this);
}




// .diff(seed, fn)

Observable.prototype.diff = function(start/*fn[, context[, arg1, arg2, ...]]*/) {
  var fn = new Callable(rest(arguments, 1));
  var prev = start;
  return this.map(function(x){
    var result = Callable.call(fn, [prev, x]);
    prev = x;
    return result;
  });
}





// .filter(fn)

Observable.prototype.filter = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  var fn = new Callable(arguments);
  return this.map(function(x){
    if (Callable.call(fn, [x])) {
      return x;
    } else {
      return NOTHING;
    }
  });
}




// .takeWhile(fn)

Observable.prototype.takeWhile = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  var fn = new Callable(arguments);
  return this.map(function(x) {
    if (Callable.call(fn, [x])) {
      return x;
    } else {
      return END;
    }
  });
}




// .take(n)

Observable.prototype.take = function(n) {
  return this.map(function(x) {
    if (n <= 0) {
      return END;
    }
    if (n === 1) {
      return Kefir.bunch(x, END);
    }
    n--;
    return x;
  });
}




// .skip(n)

Observable.prototype.skip = function(n) {
  return this.map(function(x) {
    if (n <= 0) {
      return x;
    } else {
      n--;
      return NOTHING;
    }
  });
}





// .skipDuplicates([fn])

Observable.prototype.skipDuplicates = function(fn) {
  var prev = NOTHING;
  return this.map(function(x){
    var result;
    if (prev !== NOTHING && (fn ? fn(prev, x) : prev === x)) {
      result = NOTHING;
    } else {
      result = x;
    }
    prev = x;
    return result;
  });
}





// .skipWhile(fn)

Observable.prototype.skipWhile = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  var fn = new Callable(arguments);
  var skip = true;
  return this.map(function(x){
    if (skip && Callable.call(fn, [x])) {
      return NOTHING;
    } else {
      skip = false;
      return x;
    }
  });
}

// TODO
//
// observable.filter(property)
// observable.takeWhile(property)
// observable.skipWhile(property)
//
// observable.awaiting(otherObservable)
// stream.skipUntil(stream2)




// .sampledBy(observable, fn)

var SampledByMixin = {
  __Constructor: function(main, sampler, fnMeta){
    if (this instanceof Property) {
      Property.call(this);
    } else {
      Stream.call(this);
    }
    this.__transformer = fnMeta && (new Callable(fnMeta));
    this.__mainStream = main;
    this.__lastValue = NOTHING;
    if (main instanceof Property && main.hasValue()) {
      this.__lastValue = main.getValue();
    }
    WithSourceStreamMixin.__Constructor.call(this, sampler);
  },
  __handle: function(y){
    if (this.__lastValue !== NOTHING) {
      var x = this.__lastValue;
      if (this.__transformer) {
        x = Callable.call(this.__transformer, [x, y]);
      }
      this.__sendValue(x);
    }
  },
  __onFirstIn: function(){
    WithSourceStreamMixin.__onFirstIn.call(this);
    this.__mainStream.onValue('__saveValue', this);
    this.__mainStream.onError('__sendError', this);
  },
  __onLastOut: function(){
    WithSourceStreamMixin.__onLastOut.call(this);
    this.__mainStream.offValue('__saveValue', this);
    this.__mainStream.offError('__sendError', this);
  },
  __saveValue: function(x){
    this.__lastValue = x;
  },
  __clear: function(){
    WithSourceStreamMixin.__clear.call(this);
    this.__lastValue = null;
    this.__fn = null;
    this.__mainStream = null;
  }
}

inheritMixin(SampledByMixin, WithSourceStreamMixin);

Kefir.SampledByStream = function SampledByStream(){
  this.__Constructor.apply(this, arguments);
}

inherit(Kefir.SampledByStream, Stream, SampledByMixin, {
  __ClassName: 'SampledByStream'
})

Kefir.SampledByProperty = function SampledByProperty(){
  this.__Constructor.apply(this, arguments);
}

inherit(Kefir.SampledByProperty, Property, SampledByMixin, {
  __ClassName: 'SampledByProperty'
})

Observable.prototype.sampledBy = function(observable/*fn[, context[, arg1, arg2, ...]]*/) {
  if (observable instanceof Stream) {
    return new Kefir.SampledByStream(this, observable, rest(arguments, 1));
  } else {
    return new Kefir.SampledByProperty(this, observable, rest(arguments, 1));
  }
}

// TODO
//
// observable.flatMapFirst(f)
//
// observable.zip(other, f)
//
// observable.awaiting(otherObservable)
//
// stream.concat(otherStream)




var PluggableMixin = {

  __initPluggable: function(){
    this.__plugged = [];
  },
  __clearPluggable: function(){
    this.__plugged = null;
  },
  __handlePlugged: function(value){
    this.__sendAny(value);
  },
  __plug: function(stream){
    if ( !this.isEnded() ) {
      this.__plugged.push(stream);
      if (this.__hasSubscribers('value') || this.__hasSubscribers('error')) {
        stream.onValue('__handlePlugged', this);
        stream.onError('__sendError', this);
      }
      stream.onEnd('__unplug', this, stream);
    }
  },
  __unplug: function(stream){
    if ( !this.isEnded() ) {
      for (var i = 0; i < this.__plugged.length; i++) {
        if (stream === this.__plugged[i]) {
          stream.offValue('__handlePlugged', this);
          stream.offError('__sendError', this);
          stream.offEnd('__unplug', this, stream);
          this.__plugged.splice(i, 1);
          return;
        }
      }
    }
  },
  __onFirstIn: function(){
    for (var i = 0; i < this.__plugged.length; i++) {
      var stream = this.__plugged[i];
      if (stream) {
        stream.onValue('__handlePlugged', this);
        stream.onError('__sendError', this);
      }
    }
  },
  __onLastOut: function(){
    for (var i = 0; i < this.__plugged.length; i++) {
      var stream = this.__plugged[i];
      if (stream) {
        stream.offValue('__handlePlugged', this);
        stream.offError('__sendError', this);
      }
    }
  },
  __hasNoPlugged: function(){
    return this.isEnded() || this.__plugged.length === 0;
  }

}





// Kefir.bus()

Kefir.Bus = function Bus(){
  Stream.call(this);
  this.__initPluggable();
}

inherit(Kefir.Bus, Stream, PluggableMixin, {

  __ClassName: 'Bus',

  push: function(x){
    this.__sendAny(x);
    return this;
  },
  error: function(e){
    this.__sendError(e);
    return this;
  },
  plug: function(stream){
    this.__plug(stream);
    return this;
  },
  unplug: function(stream){
    this.__unplug(stream);
    return this;
  },
  end: function(){
    this.__sendEnd();
    return this;
  },
  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__clearPluggable();
    this.push = noop;
  }

});

Kefir.bus = function(){
  return new Kefir.Bus();
}





// .flatMap()

Kefir.FlatMappedStream = function FlatMappedStream(sourceStream, mapFnMeta){
  Stream.call(this);
  this.__initPluggable();
  this.__sourceStream = sourceStream;
  this.__mapFn = new Callable(mapFnMeta);
  sourceStream.onEnd(this.__onSourceEnds, this);
}

inherit(Kefir.FlatMappedStream, Stream, PluggableMixin, {

  __ClassName: 'FlatMappedStream',

  __onSourceEnds: function(){
    if (this.__hasNoPlugged()) {
      this.__sendEnd();
    }
  },
  __plugResult: function(x){
    this.__plug( Callable.call(this.__mapFn, [x]) );
  },
  __onFirstIn: function(){
    this.__sourceStream.onValue('__plugResult', this);
    this.__sourceStream.onError('__sendError', this);
    PluggableMixin.__onFirstIn.call(this);
  },
  __onLastOut: function(){
    this.__sourceStream.offValue('__plugResult', this);
    this.__sourceStream.offError('__sendError', this);
    PluggableMixin.__onLastOut.call(this);
  },
  __unplug: function(stream){
    PluggableMixin.__unplug.call(this, stream);
    if (!this.isEnded() && this.__sourceStream.isEnded() && this.__hasNoPlugged()) {
      this.__sendEnd();
    }
  },
  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__clearPluggable();
    this.__sourceStream = null;
    this.__mapFn = null;
  }

})

Observable.prototype.flatMap = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  return new Kefir.FlatMappedStream(this, arguments);
};




// .flatMapLatest()

Kefir.FlatMapLatestStream = function FlatMapLatestStream(){
  Kefir.FlatMappedStream.apply(this, arguments);
}

inherit(Kefir.FlatMapLatestStream, Kefir.FlatMappedStream, {

  __ClassName: 'FlatMapLatestStream',

  __plugResult: function(x){
    if (this.__plugged.length === 1) {
      this.__unplug(this.__plugged[0]);
    }
    Kefir.FlatMappedStream.prototype.__plugResult.call(this, x);
  }

})

Observable.prototype.flatMapLatest = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  return new Kefir.FlatMapLatestStream(this, arguments);
};




// .merge()

Kefir.MergedStream = function MergedStream(){
  Stream.call(this);
  this.__initPluggable();
  var sources = firstArrOrToArr(arguments);
  for (var i = 0; i < sources.length; i++) {
    this.__plug(sources[i]);
  }
}

inherit(Kefir.MergedStream, Stream, PluggableMixin, {

  __ClassName: 'MergedStream',

  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__clearPluggable();
  },
  __unplug: function(stream){
    PluggableMixin.__unplug.call(this, stream);
    if (this.__hasNoPlugged()) {
      this.__sendEnd();
    }
  }

});

Kefir.merge = function() {
  return new Kefir.MergedStream(firstArrOrToArr(arguments));
}

Observable.prototype.merge = function() {
  return Kefir.merge([this].concat(firstArrOrToArr(arguments)));
}









// .combine()

Kefir.CombinedStream = function CombinedStream(sources, mapFnMeta){
  Stream.call(this);
  this.__plugged = sources;
  for (var i = 0; i < this.__plugged.length; i++) {
    sources[i].onEnd('__unplugById', this, i);
  }
  this.__cachedValues = new Array(sources.length);
  this.__hasValue = new Array(sources.length);
  this.__mapFn = mapFnMeta && new Callable(mapFnMeta);
}

inherit(Kefir.CombinedStream, Stream, {

  __ClassName: 'CombinedStream',

  __onFirstIn: function(){
    for (var i = 0; i < this.__plugged.length; i++) {
      var stream = this.__plugged[i];
      if (stream) {
        stream.onValue('__handlePlugged', this, i);
        stream.onError('__sendError', this);
      }
    }
  },
  __onLastOut: function(){
    for (var i = 0; i < this.__plugged.length; i++) {
      var stream = this.__plugged[i];
      if (stream) {
        stream.offValue('__handlePlugged', this, i);
        stream.offError('__sendError', this);
      }
    }
  },
  __hasNoPlugged: function(){
    if (this.isEnded()) {
      return true;
    }
    for (var i = 0; i < this.__plugged.length; i++) {
      if (this.__plugged[i]) {
        return false;
      }
    }
    return true;
  },
  __unplugById: function(i){
    var stream = this.__plugged[i];
    if (stream) {
      this.__plugged[i] = null;
      stream.offValue('__handlePlugged', this, i);
      stream.offError('__sendError', this);
      stream.offEnd('__unplugById', this, i);
      if (this.__hasNoPlugged()) {
        this.__sendEnd();
      }
    }
  },
  __handlePlugged: function(i, x) {
    this.__hasValue[i] = true;
    this.__cachedValues[i] = x;
    if (this.__allCached()) {
      if (this.__mapFn) {
        this.__sendAny(Callable.call(this.__mapFn, this.__cachedValues));
      } else {
        this.__sendValue(this.__cachedValues.slice(0));
      }
    }
  },
  __allCached: function(){
    for (var i = 0; i < this.__hasValue.length; i++) {
      if (!this.__hasValue[i]) {
        return false;
      }
    }
    return true;
  },
  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__plugged = null;
    this.__cachedValues = null;
    this.__hasValue = null;
    this.__mapFn = null;
  }

});

Kefir.combine = function(sources/*, fn[, context[, arg1, arg2, ...]]*/) {
  return new Kefir.CombinedStream(sources, rest(arguments, 1));
}

Observable.prototype.combine = function(sources/*, fn[, context[, arg1, arg2, ...]]*/) {
  return new Kefir.CombinedStream([this].concat(sources), rest(arguments, 1));
}






// Kefir.onValues()

Kefir.onValues = function(streams/*, fn[, context[, arg1, agr2, ...]]*/){
  var fn = new Callable(rest(arguments, 1))
  return Kefir.combine(streams).onValue(function(xs){
    return Callable.call(fn, xs);
  });
}

// TODO
//
// observable.debounce(wait, immediate)
// http://underscorejs.org/#defer





// Kefir.later()

Kefir.LaterStream = function LaterStream(wait, value) {
  Stream.call(this);
  this.__value = value;
  this.__wait = wait;
}

inherit(Kefir.LaterStream, Stream, {

  __ClassName: 'LaterStream',

  __onFirstIn: function(){
    var _this = this;
    setTimeout(function(){
      _this.__sendAny(_this.__value);
      _this.__sendEnd();
    }, this.__wait);
  },

  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__value = null;
    this.__wait = null;
  }

});

Kefir.later = function(wait, value) {
  return new Kefir.LaterStream(wait, value);
}





// .delay()

var DelayedMixin = {
  __Constructor: function(source, wait) {
    this.__source = source;
    this.__wait = wait;
    source.onEnd(this.__sendEndLater, this);
  },
  __sendLater: function(x){
    var _this = this;
    setTimeout(function(){  _this.__sendValue(x)  }, this.__wait);
  },
  __sendEndLater: function(){
    var _this = this;
    setTimeout(function(){  _this.__sendEnd()  }, this.__wait);
  },
  __onFirstIn: function(){
    this.__source.onNewValue('__sendLater', this);
    this.__source.onError('__sendError', this);
  },
  __onLastOut: function(){
    this.__source.offValue('__sendLater', this);
    this.__source.offError('__sendError', this);
  },
  __clear: function(){
    Observable.prototype.__clear.call(this);
    this.__source = null;
    this.__wait = null;
  }
}


Kefir.DelayedStream = function DelayedStream(source, wait) {
  Stream.call(this);
  DelayedMixin.__Constructor.call(this, source, wait);
}

inherit(Kefir.DelayedStream, Stream, DelayedMixin, {
  __ClassName: 'DelayedStream'
});

Stream.prototype.delay = function(wait) {
  return new Kefir.DelayedStream(this, wait);
}


Kefir.DelayedProperty = function DelayedProperty(source, wait) {
  Property.call(this);
  DelayedMixin.__Constructor.call(this, source, wait);
  if (source.hasValue()) {
    this.__sendValue(source.getValue());
  }
}

inherit(Kefir.DelayedProperty, Property, DelayedMixin, {
  __ClassName: 'DelayedProperty'
});

Property.prototype.delay = function(wait) {
  return new Kefir.DelayedProperty(this, wait);
}






// .throttle(wait, {leading, trailing})

var ThrottledMixin = {

  __Constructor: function(source, wait, options){
    this.__source = source;
    this.__wait = wait;
    this.__trailingCallValue = null;
    this.__trailingCallTimeoutId = null;
    this.__endAfterTrailingCall = false;
    this.__lastCallTime = 0;
    this.__leading = get(options, 'leading', true);
    this.__trailing = get(options, 'trailing', true);
    var _this = this;
    this.__makeTrailingCallBinded = function(){  _this.__makeTrailingCall()  };
    source.onEnd(this.__sendEndLater, this);
  },

  __sendEndLater: function(){
    if (this.__trailingCallTimeoutId) {
      this.__endAfterTrailingCall = true;
    } else {
      this.__sendEnd();
    }
  },

  __scheduleTralingCall: function(value, wait){
    if (this.__trailingCallTimeoutId) {
      this.__cancelTralingCall();
    }
    this.__trailingCallValue = value;
    this.__trailingCallTimeoutId = setTimeout(this.__makeTrailingCallBinded, wait);
  },
  __cancelTralingCall: function(){
    if (this.__trailingCallTimeoutId !== null) {
      clearTimeout(this.__trailingCallTimeoutId);
      this.__trailingCallTimeoutId = null;
    }
  },
  __makeTrailingCall: function(){
    this.__sendValue(this.__trailingCallValue);
    this.__trailingCallTimeoutId = null;
    this.__trailingCallValue = null;
    this.__lastCallTime = !this.__leading ? 0 : now();
    if (this.__endAfterTrailingCall) {
      this.__sendEnd();
    }
  },

  __handleValueFromSource: function(x){
    var curTime = now();
    if (this.__lastCallTime === 0 && !this.__leading) {
      this.__lastCallTime = curTime;
    }
    var remaining = this.__wait - (curTime - this.__lastCallTime);
    if (remaining <= 0) {
      this.__cancelTralingCall();
      this.__lastCallTime = curTime;
      this.__sendValue(x);
    } else if (this.__trailing) {
      this.__scheduleTralingCall(x, remaining);
    }
  },

  __onFirstIn: function(){
    this.__source.onNewValue('__handleValueFromSource', this);
    this.__source.onError('__sendError', this);
  },
  __onLastOut: function(){
    this.__source.offValue('__handleValueFromSource', this);
    this.__source.offError('__sendError', this);
  },

  __clear: function(){
    Observable.prototype.__clear.call(this);
    this.__source = null;
    this.__wait = null;
    this.__trailingCallValue = null;
    this.__trailingCallTimeoutId = null;
    this.__makeTrailingCallBinded = null;
  }

};

Kefir.ThrottledStream = function ThrottledStream() {
  Stream.call(this);
  ThrottledMixin.__Constructor.apply(this, arguments);
}

inherit(Kefir.ThrottledStream, Stream, ThrottledMixin, {
  __ClassName: 'ThrottledStream'
});

Stream.prototype.throttle = function(wait, options) {
  return new Kefir.ThrottledStream(this, wait, options);
}


Kefir.ThrottledProperty = function ThrottledProperty(source) {
  Property.call(this);
  ThrottledMixin.__Constructor.apply(this, arguments);
  if (source.hasValue()) {
    this.__sendValue(source.getValue());
  }
}

inherit(Kefir.ThrottledProperty, Property, ThrottledMixin, {
  __ClassName: 'ThrottledProperty'
});

Property.prototype.throttle = function(wait, options) {
  return new Kefir.ThrottledProperty(this, wait, options);
}






// Kefir.fromPoll()

var FromPollStream = Kefir.FromPollStream = function FromPollStream(interval, sourceFn){
  Stream.call(this);
  this.__interval = interval;
  this.__intervalId = null;
  var _this = this;
  sourceFn = new Callable(sourceFn);
  this.__bindedSend = function(){  _this.__sendAny(Callable.call(sourceFn))  }
}

inherit(FromPollStream, Stream, {

  __ClassName: 'FromPollStream',
  __onFirstIn: function(){
    this.__intervalId = setInterval(this.__bindedSend, this.__interval);
  },
  __onLastOut: function(){
    if (this.__intervalId !== null){
      clearInterval(this.__intervalId);
      this.__intervalId = null;
    }
  },
  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__bindedSend = null;
  }

});

Kefir.fromPoll = function(interval/*, fn[, context[, arg1, arg2, ...]]*/){
  return new FromPollStream(interval, rest(arguments, 1));
}



// Kefir.interval()

Kefir.interval = function(interval, x){
  return new FromPollStream(interval, [id, null, x]);
}



// Kefir.sequentially()

var sequentiallyHelperFn = function(){
  if (this.xs.length === 0) {
    return END;
  }
  if (this.xs.length === 1){
    return Kefir.bunch(this.xs[0], END);
  }
  return this.xs.shift();
}

Kefir.sequentially = function(interval, xs){
  return new FromPollStream(interval, [sequentiallyHelperFn, {xs: xs.slice(0)}]);
}



// Kefir.repeatedly()

var repeatedlyHelperFn = function(){
  this.i = (this.i + 1) % this.xs.length;
  return this.xs[this.i];
}

Kefir.repeatedly = function(interval, xs){
  return new FromPollStream(interval, [repeatedlyHelperFn, {i: -1, xs: xs}]);
}

// TODO
//
// stream.bufferWithTime(delay)
// stream.bufferWithTime(f)
// stream.bufferWithCount(count)
// stream.bufferWithTimeOrCount(delay, count)

// TODO
//
// observable.mapError(f)
// observable.errors()
// observable.skipErrors()
// observable.endOnError(f)

// TODO
//
// observable.not()
// property.and(other)
// property.or(other)
//
// http://underscorejs.org/#pluck
// http://underscorejs.org/#invoke

// TODO
//
// Model = Bus + Property + lenses


  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return Kefir;
    });
    global.Kefir = Kefir;
  } else if (typeof module === "object" && typeof exports === "object") {
    module.exports = Kefir;
    Kefir.Kefir = Kefir;
  } else {
    global.Kefir = Kefir;
  }

}(this));
},{}],2:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],3:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],4:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],5:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require("FWaASH"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":4,"FWaASH":3,"inherits":2}],6:[function(require,module,exports){
/*jslint eqeqeq: false, onevar: false, forin: true, nomen: false, regexp: false, plusplus: false*/
/*global module, require, __dirname, document*/
/**
 * Sinon core utilities. For internal use only.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var sinon = (function (formatio) {
    var div = typeof document != "undefined" && document.createElement("div");
    var hasOwn = Object.prototype.hasOwnProperty;

    function isDOMNode(obj) {
        var success = false;

        try {
            obj.appendChild(div);
            success = div.parentNode == obj;
        } catch (e) {
            return false;
        } finally {
            try {
                obj.removeChild(div);
            } catch (e) {
                // Remove failed, not much we can do about that
            }
        }

        return success;
    }

    function isElement(obj) {
        return div && obj && obj.nodeType === 1 && isDOMNode(obj);
    }

    function isFunction(obj) {
        return typeof obj === "function" || !!(obj && obj.constructor && obj.call && obj.apply);
    }

    function isReallyNaN(val) {
        return typeof val === 'number' && isNaN(val);
    }

    function mirrorProperties(target, source) {
        for (var prop in source) {
            if (!hasOwn.call(target, prop)) {
                target[prop] = source[prop];
            }
        }
    }

    function isRestorable (obj) {
        return typeof obj === "function" && typeof obj.restore === "function" && obj.restore.sinon;
    }

    var sinon = {
        wrapMethod: function wrapMethod(object, property, method) {
            if (!object) {
                throw new TypeError("Should wrap property of object");
            }

            if (typeof method != "function") {
                throw new TypeError("Method wrapper should be function");
            }

            var wrappedMethod = object[property],
                error;

            if (!isFunction(wrappedMethod)) {
                error = new TypeError("Attempted to wrap " + (typeof wrappedMethod) + " property " +
                                    property + " as function");
            } else if (wrappedMethod.restore && wrappedMethod.restore.sinon) {
                error = new TypeError("Attempted to wrap " + property + " which is already wrapped");
            } else if (wrappedMethod.calledBefore) {
                var verb = !!wrappedMethod.returns ? "stubbed" : "spied on";
                error = new TypeError("Attempted to wrap " + property + " which is already " + verb);
            }

            if (error) {
                if (wrappedMethod && wrappedMethod._stack) {
                    error.stack += '\n--------------\n' + wrappedMethod._stack;
                }
                throw error;
            }

            // IE 8 does not support hasOwnProperty on the window object and Firefox has a problem
            // when using hasOwn.call on objects from other frames.
            var owned = object.hasOwnProperty ? object.hasOwnProperty(property) : hasOwn.call(object, property);
            object[property] = method;
            method.displayName = property;
            // Set up a stack trace which can be used later to find what line of
            // code the original method was created on.
            method._stack = (new Error('Stack Trace for original')).stack;

            method.restore = function () {
                // For prototype properties try to reset by delete first.
                // If this fails (ex: localStorage on mobile safari) then force a reset
                // via direct assignment.
                if (!owned) {
                    delete object[property];
                }
                if (object[property] === method) {
                    object[property] = wrappedMethod;
                }
            };

            method.restore.sinon = true;
            mirrorProperties(method, wrappedMethod);

            return method;
        },

        extend: function extend(target) {
            for (var i = 1, l = arguments.length; i < l; i += 1) {
                for (var prop in arguments[i]) {
                    if (arguments[i].hasOwnProperty(prop)) {
                        target[prop] = arguments[i][prop];
                    }

                    // DONT ENUM bug, only care about toString
                    if (arguments[i].hasOwnProperty("toString") &&
                        arguments[i].toString != target.toString) {
                        target.toString = arguments[i].toString;
                    }
                }
            }

            return target;
        },

        create: function create(proto) {
            var F = function () {};
            F.prototype = proto;
            return new F();
        },

        deepEqual: function deepEqual(a, b) {
            if (sinon.match && sinon.match.isMatcher(a)) {
                return a.test(b);
            }

            if (typeof a != 'object' || typeof b != 'object') {
                if (isReallyNaN(a) && isReallyNaN(b)) {
                    return true;
                } else {
                    return a === b;
                }
            }

            if (isElement(a) || isElement(b)) {
                return a === b;
            }

            if (a === b) {
                return true;
            }

            if ((a === null && b !== null) || (a !== null && b === null)) {
                return false;
            }

            if (a instanceof RegExp && b instanceof RegExp) {
              return (a.source === b.source) && (a.global === b.global) &&
                (a.ignoreCase === b.ignoreCase) && (a.multiline === b.multiline);
            }

            var aString = Object.prototype.toString.call(a);
            if (aString != Object.prototype.toString.call(b)) {
                return false;
            }

            if (aString == "[object Date]") {
                return a.valueOf() === b.valueOf();
            }

            var prop, aLength = 0, bLength = 0;

            if (aString == "[object Array]" && a.length !== b.length) {
                return false;
            }

            for (prop in a) {
                aLength += 1;

                if (!(prop in b)) {
                    return false;
                }

                if (!deepEqual(a[prop], b[prop])) {
                    return false;
                }
            }

            for (prop in b) {
                bLength += 1;
            }

            return aLength == bLength;
        },

        functionName: function functionName(func) {
            var name = func.displayName || func.name;

            // Use function decomposition as a last resort to get function
            // name. Does not rely on function decomposition to work - if it
            // doesn't debugging will be slightly less informative
            // (i.e. toString will say 'spy' rather than 'myFunc').
            if (!name) {
                var matches = func.toString().match(/function ([^\s\(]+)/);
                name = matches && matches[1];
            }

            return name;
        },

        functionToString: function toString() {
            if (this.getCall && this.callCount) {
                var thisValue, prop, i = this.callCount;

                while (i--) {
                    thisValue = this.getCall(i).thisValue;

                    for (prop in thisValue) {
                        if (thisValue[prop] === this) {
                            return prop;
                        }
                    }
                }
            }

            return this.displayName || "sinon fake";
        },

        getConfig: function (custom) {
            var config = {};
            custom = custom || {};
            var defaults = sinon.defaultConfig;

            for (var prop in defaults) {
                if (defaults.hasOwnProperty(prop)) {
                    config[prop] = custom.hasOwnProperty(prop) ? custom[prop] : defaults[prop];
                }
            }

            return config;
        },

        format: function (val) {
            return "" + val;
        },

        defaultConfig: {
            injectIntoThis: true,
            injectInto: null,
            properties: ["spy", "stub", "mock", "clock", "server", "requests"],
            useFakeTimers: true,
            useFakeServer: true
        },

        timesInWords: function timesInWords(count) {
            return count == 1 && "once" ||
                count == 2 && "twice" ||
                count == 3 && "thrice" ||
                (count || 0) + " times";
        },

        calledInOrder: function (spies) {
            for (var i = 1, l = spies.length; i < l; i++) {
                if (!spies[i - 1].calledBefore(spies[i]) || !spies[i].called) {
                    return false;
                }
            }

            return true;
        },

        orderByFirstCall: function (spies) {
            return spies.sort(function (a, b) {
                // uuid, won't ever be equal
                var aCall = a.getCall(0);
                var bCall = b.getCall(0);
                var aId = aCall && aCall.callId || -1;
                var bId = bCall && bCall.callId || -1;

                return aId < bId ? -1 : 1;
            });
        },

        log: function () {},

        logError: function (label, err) {
            var msg = label + " threw exception: ";
            sinon.log(msg + "[" + err.name + "] " + err.message);
            if (err.stack) { sinon.log(err.stack); }

            setTimeout(function () {
                err.message = msg + err.message;
                throw err;
            }, 0);
        },

        typeOf: function (value) {
            if (value === null) {
                return "null";
            }
            else if (value === undefined) {
                return "undefined";
            }
            var string = Object.prototype.toString.call(value);
            return string.substring(8, string.length - 1).toLowerCase();
        },

        createStubInstance: function (constructor) {
            if (typeof constructor !== "function") {
                throw new TypeError("The constructor should be a function.");
            }
            return sinon.stub(sinon.create(constructor.prototype));
        },

        restore: function (object) {
            if (object !== null && typeof object === "object") {
                for (var prop in object) {
                    if (isRestorable(object[prop])) {
                        object[prop].restore();
                    }
                }
            }
            else if (isRestorable(object)) {
                object.restore();
            }
        }
    };

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === 'function' && typeof define.amd === 'object' && define.amd;

    function makePublicAPI(require, exports, module) {
        module.exports = sinon;
        sinon.spy = require("./sinon/spy");
        sinon.spyCall = require("./sinon/call");
        sinon.behavior = require("./sinon/behavior");
        sinon.stub = require("./sinon/stub");
        sinon.mock = require("./sinon/mock");
        sinon.collection = require("./sinon/collection");
        sinon.assert = require("./sinon/assert");
        sinon.sandbox = require("./sinon/sandbox");
        sinon.test = require("./sinon/test");
        sinon.testCase = require("./sinon/test_case");
        sinon.match = require("./sinon/match");
    }

    if (isAMD) {
        define(makePublicAPI);
    } else if (isNode) {
        try {
            formatio = require("formatio");
        } catch (e) {}
        makePublicAPI(require, exports, module);
    }

    if (formatio) {
        var formatter = formatio.configure({ quoteStrings: false });
        sinon.format = function () {
            return formatter.ascii.apply(formatter, arguments);
        };
    } else if (isNode) {
        try {
            var util = require("util");
            sinon.format = function (value) {
                return typeof value == "object" && value.toString === Object.prototype.toString ? util.inspect(value) : value;
            };
        } catch (e) {
            /* Node, but no util module - would be very old, but better safe than
             sorry */
        }
    }

    return sinon;
}(typeof formatio == "object" && formatio));

},{"./sinon/assert":7,"./sinon/behavior":8,"./sinon/call":9,"./sinon/collection":10,"./sinon/match":11,"./sinon/mock":12,"./sinon/sandbox":13,"./sinon/spy":14,"./sinon/stub":15,"./sinon/test":16,"./sinon/test_case":17,"formatio":19,"util":5}],7:[function(require,module,exports){
(function (global){
/**
 * @depend ../sinon.js
 * @depend stub.js
 */
/*jslint eqeqeq: false, onevar: false, nomen: false, plusplus: false*/
/*global module, require, sinon*/
/**
 * Assertions matching the test spy retrieval interface.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function (sinon, global) {
    var commonJSModule = typeof module !== "undefined" && module.exports && typeof require == "function";
    var slice = Array.prototype.slice;
    var assert;

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function verifyIsStub() {
        var method;

        for (var i = 0, l = arguments.length; i < l; ++i) {
            method = arguments[i];

            if (!method) {
                assert.fail("fake is not a spy");
            }

            if (typeof method != "function") {
                assert.fail(method + " is not a function");
            }

            if (typeof method.getCall != "function") {
                assert.fail(method + " is not stubbed");
            }
        }
    }

    function failAssertion(object, msg) {
        object = object || global;
        var failMethod = object.fail || assert.fail;
        failMethod.call(object, msg);
    }

    function mirrorPropAsAssertion(name, method, message) {
        if (arguments.length == 2) {
            message = method;
            method = name;
        }

        assert[name] = function (fake) {
            verifyIsStub(fake);

            var args = slice.call(arguments, 1);
            var failed = false;

            if (typeof method == "function") {
                failed = !method(fake);
            } else {
                failed = typeof fake[method] == "function" ?
                    !fake[method].apply(fake, args) : !fake[method];
            }

            if (failed) {
                failAssertion(this, fake.printf.apply(fake, [message].concat(args)));
            } else {
                assert.pass(name);
            }
        };
    }

    function exposedName(prefix, prop) {
        return !prefix || /^fail/.test(prop) ? prop :
            prefix + prop.slice(0, 1).toUpperCase() + prop.slice(1);
    }

    assert = {
        failException: "AssertError",

        fail: function fail(message) {
            var error = new Error(message);
            error.name = this.failException || assert.failException;

            throw error;
        },

        pass: function pass(assertion) {},

        callOrder: function assertCallOrder() {
            verifyIsStub.apply(null, arguments);
            var expected = "", actual = "";

            if (!sinon.calledInOrder(arguments)) {
                try {
                    expected = [].join.call(arguments, ", ");
                    var calls = slice.call(arguments);
                    var i = calls.length;
                    while (i) {
                        if (!calls[--i].called) {
                            calls.splice(i, 1);
                        }
                    }
                    actual = sinon.orderByFirstCall(calls).join(", ");
                } catch (e) {
                    // If this fails, we'll just fall back to the blank string
                }

                failAssertion(this, "expected " + expected + " to be " +
                              "called in order but were called as " + actual);
            } else {
                assert.pass("callOrder");
            }
        },

        callCount: function assertCallCount(method, count) {
            verifyIsStub(method);

            if (method.callCount != count) {
                var msg = "expected %n to be called " + sinon.timesInWords(count) +
                    " but was called %c%C";
                failAssertion(this, method.printf(msg));
            } else {
                assert.pass("callCount");
            }
        },

        expose: function expose(target, options) {
            if (!target) {
                throw new TypeError("target is null or undefined");
            }

            var o = options || {};
            var prefix = typeof o.prefix == "undefined" && "assert" || o.prefix;
            var includeFail = typeof o.includeFail == "undefined" || !!o.includeFail;

            for (var method in this) {
                if (method != "export" && (includeFail || !/^(fail)/.test(method))) {
                    target[exposedName(prefix, method)] = this[method];
                }
            }

            return target;
        },

        match: function match(actual, expectation) {
            var matcher = sinon.match(expectation);
            if (matcher.test(actual)) {
                assert.pass("match");
            } else {
                var formatted = [
                    "expected value to match",
                    "    expected = " + sinon.format(expectation),
                    "    actual = " + sinon.format(actual)
                ]
                failAssertion(this, formatted.join("\n"));
            }
        }
    };

    mirrorPropAsAssertion("called", "expected %n to have been called at least once but was never called");
    mirrorPropAsAssertion("notCalled", function (spy) { return !spy.called; },
                          "expected %n to not have been called but was called %c%C");
    mirrorPropAsAssertion("calledOnce", "expected %n to be called once but was called %c%C");
    mirrorPropAsAssertion("calledTwice", "expected %n to be called twice but was called %c%C");
    mirrorPropAsAssertion("calledThrice", "expected %n to be called thrice but was called %c%C");
    mirrorPropAsAssertion("calledOn", "expected %n to be called with %1 as this but was called with %t");
    mirrorPropAsAssertion("alwaysCalledOn", "expected %n to always be called with %1 as this but was called with %t");
    mirrorPropAsAssertion("calledWithNew", "expected %n to be called with new");
    mirrorPropAsAssertion("alwaysCalledWithNew", "expected %n to always be called with new");
    mirrorPropAsAssertion("calledWith", "expected %n to be called with arguments %*%C");
    mirrorPropAsAssertion("calledWithMatch", "expected %n to be called with match %*%C");
    mirrorPropAsAssertion("alwaysCalledWith", "expected %n to always be called with arguments %*%C");
    mirrorPropAsAssertion("alwaysCalledWithMatch", "expected %n to always be called with match %*%C");
    mirrorPropAsAssertion("calledWithExactly", "expected %n to be called with exact arguments %*%C");
    mirrorPropAsAssertion("alwaysCalledWithExactly", "expected %n to always be called with exact arguments %*%C");
    mirrorPropAsAssertion("neverCalledWith", "expected %n to never be called with arguments %*%C");
    mirrorPropAsAssertion("neverCalledWithMatch", "expected %n to never be called with match %*%C");
    mirrorPropAsAssertion("threw", "%n did not throw exception%C");
    mirrorPropAsAssertion("alwaysThrew", "%n did not always throw exception%C");

    sinon.assert = assert;

    if (typeof define === "function" && define.amd) {
        define(["module"], function(module) { module.exports = assert; });
    } else if (commonJSModule) {
        module.exports = assert;
    }
}(typeof sinon == "object" && sinon || null, typeof window != "undefined" ? window : (typeof self != "undefined") ? self : global));

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../sinon":6}],8:[function(require,module,exports){
(function (process){
/**
 * @depend ../sinon.js
 */
/*jslint eqeqeq: false, onevar: false*/
/*global module, require, sinon, process, setImmediate, setTimeout*/
/**
 * Stub behavior
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @author Tim Fischbach (mail@timfischbach.de)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function (sinon) {
    var commonJSModule = typeof module !== "undefined" && module.exports && typeof require == "function";

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    var slice = Array.prototype.slice;
    var join = Array.prototype.join;
    var proto;

    var nextTick = (function () {
        if (typeof process === "object" && typeof process.nextTick === "function") {
            return process.nextTick;
        } else if (typeof setImmediate === "function") {
            return setImmediate;
        } else {
            return function (callback) {
                setTimeout(callback, 0);
            };
        }
    })();

    function throwsException(error, message) {
        if (typeof error == "string") {
            this.exception = new Error(message || "");
            this.exception.name = error;
        } else if (!error) {
            this.exception = new Error("Error");
        } else {
            this.exception = error;
        }

        return this;
    }

    function getCallback(behavior, args) {
        var callArgAt = behavior.callArgAt;

        if (callArgAt < 0) {
            var callArgProp = behavior.callArgProp;

            for (var i = 0, l = args.length; i < l; ++i) {
                if (!callArgProp && typeof args[i] == "function") {
                    return args[i];
                }

                if (callArgProp && args[i] &&
                    typeof args[i][callArgProp] == "function") {
                    return args[i][callArgProp];
                }
            }

            return null;
        }

        return args[callArgAt];
    }

    function getCallbackError(behavior, func, args) {
        if (behavior.callArgAt < 0) {
            var msg;

            if (behavior.callArgProp) {
                msg = sinon.functionName(behavior.stub) +
                    " expected to yield to '" + behavior.callArgProp +
                    "', but no object with such a property was passed.";
            } else {
                msg = sinon.functionName(behavior.stub) +
                    " expected to yield, but no callback was passed.";
            }

            if (args.length > 0) {
                msg += " Received [" + join.call(args, ", ") + "]";
            }

            return msg;
        }

        return "argument at index " + behavior.callArgAt + " is not a function: " + func;
    }

    function callCallback(behavior, args) {
        if (typeof behavior.callArgAt == "number") {
            var func = getCallback(behavior, args);

            if (typeof func != "function") {
                throw new TypeError(getCallbackError(behavior, func, args));
            }

            if (behavior.callbackAsync) {
                nextTick(function() {
                    func.apply(behavior.callbackContext, behavior.callbackArguments);
                });
            } else {
                func.apply(behavior.callbackContext, behavior.callbackArguments);
            }
        }
    }

    proto = {
        create: function(stub) {
            var behavior = sinon.extend({}, sinon.behavior);
            delete behavior.create;
            behavior.stub = stub;

            return behavior;
        },

        isPresent: function() {
            return (typeof this.callArgAt == 'number' ||
                    this.exception ||
                    typeof this.returnArgAt == 'number' ||
                    this.returnThis ||
                    this.returnValueDefined);
        },

        invoke: function(context, args) {
            callCallback(this, args);

            if (this.exception) {
                throw this.exception;
            } else if (typeof this.returnArgAt == 'number') {
                return args[this.returnArgAt];
            } else if (this.returnThis) {
                return context;
            }

            return this.returnValue;
        },

        onCall: function(index) {
            return this.stub.onCall(index);
        },

        onFirstCall: function() {
            return this.stub.onFirstCall();
        },

        onSecondCall: function() {
            return this.stub.onSecondCall();
        },

        onThirdCall: function() {
            return this.stub.onThirdCall();
        },

        withArgs: function(/* arguments */) {
            throw new Error('Defining a stub by invoking "stub.onCall(...).withArgs(...)" is not supported. ' +
                            'Use "stub.withArgs(...).onCall(...)" to define sequential behavior for calls with certain arguments.');
        },

        callsArg: function callsArg(pos) {
            if (typeof pos != "number") {
                throw new TypeError("argument index is not number");
            }

            this.callArgAt = pos;
            this.callbackArguments = [];
            this.callbackContext = undefined;
            this.callArgProp = undefined;
            this.callbackAsync = false;

            return this;
        },

        callsArgOn: function callsArgOn(pos, context) {
            if (typeof pos != "number") {
                throw new TypeError("argument index is not number");
            }
            if (typeof context != "object") {
                throw new TypeError("argument context is not an object");
            }

            this.callArgAt = pos;
            this.callbackArguments = [];
            this.callbackContext = context;
            this.callArgProp = undefined;
            this.callbackAsync = false;

            return this;
        },

        callsArgWith: function callsArgWith(pos) {
            if (typeof pos != "number") {
                throw new TypeError("argument index is not number");
            }

            this.callArgAt = pos;
            this.callbackArguments = slice.call(arguments, 1);
            this.callbackContext = undefined;
            this.callArgProp = undefined;
            this.callbackAsync = false;

            return this;
        },

        callsArgOnWith: function callsArgWith(pos, context) {
            if (typeof pos != "number") {
                throw new TypeError("argument index is not number");
            }
            if (typeof context != "object") {
                throw new TypeError("argument context is not an object");
            }

            this.callArgAt = pos;
            this.callbackArguments = slice.call(arguments, 2);
            this.callbackContext = context;
            this.callArgProp = undefined;
            this.callbackAsync = false;

            return this;
        },

        yields: function () {
            this.callArgAt = -1;
            this.callbackArguments = slice.call(arguments, 0);
            this.callbackContext = undefined;
            this.callArgProp = undefined;
            this.callbackAsync = false;

            return this;
        },

        yieldsOn: function (context) {
            if (typeof context != "object") {
                throw new TypeError("argument context is not an object");
            }

            this.callArgAt = -1;
            this.callbackArguments = slice.call(arguments, 1);
            this.callbackContext = context;
            this.callArgProp = undefined;
            this.callbackAsync = false;

            return this;
        },

        yieldsTo: function (prop) {
            this.callArgAt = -1;
            this.callbackArguments = slice.call(arguments, 1);
            this.callbackContext = undefined;
            this.callArgProp = prop;
            this.callbackAsync = false;

            return this;
        },

        yieldsToOn: function (prop, context) {
            if (typeof context != "object") {
                throw new TypeError("argument context is not an object");
            }

            this.callArgAt = -1;
            this.callbackArguments = slice.call(arguments, 2);
            this.callbackContext = context;
            this.callArgProp = prop;
            this.callbackAsync = false;

            return this;
        },


        "throws": throwsException,
        throwsException: throwsException,

        returns: function returns(value) {
            this.returnValue = value;
            this.returnValueDefined = true;

            return this;
        },

        returnsArg: function returnsArg(pos) {
            if (typeof pos != "number") {
                throw new TypeError("argument index is not number");
            }

            this.returnArgAt = pos;

            return this;
        },

        returnsThis: function returnsThis() {
            this.returnThis = true;

            return this;
        }
    };

    // create asynchronous versions of callsArg* and yields* methods
    for (var method in proto) {
        // need to avoid creating anotherasync versions of the newly added async methods
        if (proto.hasOwnProperty(method) &&
            method.match(/^(callsArg|yields)/) &&
            !method.match(/Async/)) {
            proto[method + 'Async'] = (function (syncFnName) {
                return function () {
                    var result = this[syncFnName].apply(this, arguments);
                    this.callbackAsync = true;
                    return result;
                };
            })(method);
        }
    }

    sinon.behavior = proto;

    if (typeof define === "function" && define.amd) {
        define(["module"], function(module) { module.exports = proto; });
    } else if (commonJSModule) {
        module.exports = proto;
    }
}(typeof sinon == "object" && sinon || null));

}).call(this,require("FWaASH"))
},{"../sinon":6,"FWaASH":3}],9:[function(require,module,exports){
/**
  * @depend ../sinon.js
  * @depend match.js
  */
/*jslint eqeqeq: false, onevar: false, plusplus: false*/
/*global module, require, sinon*/
/**
  * Spy calls
  *
  * @author Christian Johansen (christian@cjohansen.no)
  * @author Maximilian Antoni (mail@maxantoni.de)
  * @license BSD
  *
  * Copyright (c) 2010-2013 Christian Johansen
  * Copyright (c) 2013 Maximilian Antoni
  */
"use strict";

(function (sinon) {
    var commonJSModule = typeof module !== "undefined" && module.exports && typeof require == "function";
    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function throwYieldError(proxy, text, args) {
        var msg = sinon.functionName(proxy) + text;
        if (args.length) {
            msg += " Received [" + slice.call(args).join(", ") + "]";
        }
        throw new Error(msg);
    }

    var slice = Array.prototype.slice;

    var callProto = {
        calledOn: function calledOn(thisValue) {
            if (sinon.match && sinon.match.isMatcher(thisValue)) {
                return thisValue.test(this.thisValue);
            }
            return this.thisValue === thisValue;
        },

        calledWith: function calledWith() {
            for (var i = 0, l = arguments.length; i < l; i += 1) {
                if (!sinon.deepEqual(arguments[i], this.args[i])) {
                    return false;
                }
            }

            return true;
        },

        calledWithMatch: function calledWithMatch() {
            for (var i = 0, l = arguments.length; i < l; i += 1) {
                var actual = this.args[i];
                var expectation = arguments[i];
                if (!sinon.match || !sinon.match(expectation).test(actual)) {
                    return false;
                }
            }
            return true;
        },

        calledWithExactly: function calledWithExactly() {
            return arguments.length == this.args.length &&
                this.calledWith.apply(this, arguments);
        },

        notCalledWith: function notCalledWith() {
            return !this.calledWith.apply(this, arguments);
        },

        notCalledWithMatch: function notCalledWithMatch() {
            return !this.calledWithMatch.apply(this, arguments);
        },

        returned: function returned(value) {
            return sinon.deepEqual(value, this.returnValue);
        },

        threw: function threw(error) {
            if (typeof error === "undefined" || !this.exception) {
                return !!this.exception;
            }

            return this.exception === error || this.exception.name === error;
        },

        calledWithNew: function calledWithNew() {
            return this.proxy.prototype && this.thisValue instanceof this.proxy;
        },

        calledBefore: function (other) {
            return this.callId < other.callId;
        },

        calledAfter: function (other) {
            return this.callId > other.callId;
        },

        callArg: function (pos) {
            this.args[pos]();
        },

        callArgOn: function (pos, thisValue) {
            this.args[pos].apply(thisValue);
        },

        callArgWith: function (pos) {
            this.callArgOnWith.apply(this, [pos, null].concat(slice.call(arguments, 1)));
        },

        callArgOnWith: function (pos, thisValue) {
            var args = slice.call(arguments, 2);
            this.args[pos].apply(thisValue, args);
        },

        "yield": function () {
            this.yieldOn.apply(this, [null].concat(slice.call(arguments, 0)));
        },

        yieldOn: function (thisValue) {
            var args = this.args;
            for (var i = 0, l = args.length; i < l; ++i) {
                if (typeof args[i] === "function") {
                    args[i].apply(thisValue, slice.call(arguments, 1));
                    return;
                }
            }
            throwYieldError(this.proxy, " cannot yield since no callback was passed.", args);
        },

        yieldTo: function (prop) {
            this.yieldToOn.apply(this, [prop, null].concat(slice.call(arguments, 1)));
        },

        yieldToOn: function (prop, thisValue) {
            var args = this.args;
            for (var i = 0, l = args.length; i < l; ++i) {
                if (args[i] && typeof args[i][prop] === "function") {
                    args[i][prop].apply(thisValue, slice.call(arguments, 2));
                    return;
                }
            }
            throwYieldError(this.proxy, " cannot yield to '" + prop +
                "' since no callback was passed.", args);
        },

        toString: function () {
            var callStr = this.proxy.toString() + "(";
            var args = [];

            for (var i = 0, l = this.args.length; i < l; ++i) {
                args.push(sinon.format(this.args[i]));
            }

            callStr = callStr + args.join(", ") + ")";

            if (typeof this.returnValue != "undefined") {
                callStr += " => " + sinon.format(this.returnValue);
            }

            if (this.exception) {
                callStr += " !" + this.exception.name;

                if (this.exception.message) {
                    callStr += "(" + this.exception.message + ")";
                }
            }

            return callStr;
        }
    };

    callProto.invokeCallback = callProto.yield;

    function createSpyCall(spy, thisValue, args, returnValue, exception, id) {
        if (typeof id !== "number") {
            throw new TypeError("Call id is not a number");
        }
        var proxyCall = sinon.create(callProto);
        proxyCall.proxy = spy;
        proxyCall.thisValue = thisValue;
        proxyCall.args = args;
        proxyCall.returnValue = returnValue;
        proxyCall.exception = exception;
        proxyCall.callId = id;

        return proxyCall;
    }
    createSpyCall.toString = callProto.toString; // used by mocks

    sinon.spyCall = createSpyCall;

    if (typeof define === "function" && define.amd) {
        define(["module"], function(module) { module.exports = createSpyCall; });
    } else if (commonJSModule) {
        module.exports = createSpyCall;
    }
}(typeof sinon == "object" && sinon || null));


},{"../sinon":6}],10:[function(require,module,exports){
/**
 * @depend ../sinon.js
 * @depend stub.js
 * @depend mock.js
 */
/*jslint eqeqeq: false, onevar: false, forin: true*/
/*global module, require, sinon*/
/**
 * Collections of stubs, spies and mocks.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function (sinon) {
    var commonJSModule = typeof module !== "undefined" && module.exports && typeof require == "function";
    var push = [].push;
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function getFakes(fakeCollection) {
        if (!fakeCollection.fakes) {
            fakeCollection.fakes = [];
        }

        return fakeCollection.fakes;
    }

    function each(fakeCollection, method) {
        var fakes = getFakes(fakeCollection);

        for (var i = 0, l = fakes.length; i < l; i += 1) {
            if (typeof fakes[i][method] == "function") {
                fakes[i][method]();
            }
        }
    }

    function compact(fakeCollection) {
        var fakes = getFakes(fakeCollection);
        var i = 0;
        while (i < fakes.length) {
          fakes.splice(i, 1);
        }
    }

    var collection = {
        verify: function resolve() {
            each(this, "verify");
        },

        restore: function restore() {
            each(this, "restore");
            compact(this);
        },

        verifyAndRestore: function verifyAndRestore() {
            var exception;

            try {
                this.verify();
            } catch (e) {
                exception = e;
            }

            this.restore();

            if (exception) {
                throw exception;
            }
        },

        add: function add(fake) {
            push.call(getFakes(this), fake);
            return fake;
        },

        spy: function spy() {
            return this.add(sinon.spy.apply(sinon, arguments));
        },

        stub: function stub(object, property, value) {
            if (property) {
                var original = object[property];

                if (typeof original != "function") {
                    if (!hasOwnProperty.call(object, property)) {
                        throw new TypeError("Cannot stub non-existent own property " + property);
                    }

                    object[property] = value;

                    return this.add({
                        restore: function () {
                            object[property] = original;
                        }
                    });
                }
            }
            if (!property && !!object && typeof object == "object") {
                var stubbedObj = sinon.stub.apply(sinon, arguments);

                for (var prop in stubbedObj) {
                    if (typeof stubbedObj[prop] === "function") {
                        this.add(stubbedObj[prop]);
                    }
                }

                return stubbedObj;
            }

            return this.add(sinon.stub.apply(sinon, arguments));
        },

        mock: function mock() {
            return this.add(sinon.mock.apply(sinon, arguments));
        },

        inject: function inject(obj) {
            var col = this;

            obj.spy = function () {
                return col.spy.apply(col, arguments);
            };

            obj.stub = function () {
                return col.stub.apply(col, arguments);
            };

            obj.mock = function () {
                return col.mock.apply(col, arguments);
            };

            return obj;
        }
    };

    sinon.collection = collection;

    if (typeof define === "function" && define.amd) {
        define(["module"], function(module) { module.exports = collection; });
    } else if (commonJSModule) {
        module.exports = collection;
    }
}(typeof sinon == "object" && sinon || null));

},{"../sinon":6}],11:[function(require,module,exports){
/* @depend ../sinon.js */
/*jslint eqeqeq: false, onevar: false, plusplus: false*/
/*global module, require, sinon*/
/**
 * Match functions
 *
 * @author Maximilian Antoni (mail@maxantoni.de)
 * @license BSD
 *
 * Copyright (c) 2012 Maximilian Antoni
 */
"use strict";

(function (sinon) {
    var commonJSModule = typeof module !== "undefined" && module.exports && typeof require == "function";

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function assertType(value, type, name) {
        var actual = sinon.typeOf(value);
        if (actual !== type) {
            throw new TypeError("Expected type of " + name + " to be " +
                type + ", but was " + actual);
        }
    }

    var matcher = {
        toString: function () {
            return this.message;
        }
    };

    function isMatcher(object) {
        return matcher.isPrototypeOf(object);
    }

    function matchObject(expectation, actual) {
        if (actual === null || actual === undefined) {
            return false;
        }
        for (var key in expectation) {
            if (expectation.hasOwnProperty(key)) {
                var exp = expectation[key];
                var act = actual[key];
                if (match.isMatcher(exp)) {
                    if (!exp.test(act)) {
                        return false;
                    }
                } else if (sinon.typeOf(exp) === "object") {
                    if (!matchObject(exp, act)) {
                        return false;
                    }
                } else if (!sinon.deepEqual(exp, act)) {
                    return false;
                }
            }
        }
        return true;
    }

    matcher.or = function (m2) {
        if (!arguments.length) {
            throw new TypeError("Matcher expected");
        } else if (!isMatcher(m2)) {
            m2 = match(m2);
        }
        var m1 = this;
        var or = sinon.create(matcher);
        or.test = function (actual) {
            return m1.test(actual) || m2.test(actual);
        };
        or.message = m1.message + ".or(" + m2.message + ")";
        return or;
    };

    matcher.and = function (m2) {
        if (!arguments.length) {
            throw new TypeError("Matcher expected");
        } else if (!isMatcher(m2)) {
            m2 = match(m2);
        }
        var m1 = this;
        var and = sinon.create(matcher);
        and.test = function (actual) {
            return m1.test(actual) && m2.test(actual);
        };
        and.message = m1.message + ".and(" + m2.message + ")";
        return and;
    };

    var match = function (expectation, message) {
        var m = sinon.create(matcher);
        var type = sinon.typeOf(expectation);
        switch (type) {
        case "object":
            if (typeof expectation.test === "function") {
                m.test = function (actual) {
                    return expectation.test(actual) === true;
                };
                m.message = "match(" + sinon.functionName(expectation.test) + ")";
                return m;
            }
            var str = [];
            for (var key in expectation) {
                if (expectation.hasOwnProperty(key)) {
                    str.push(key + ": " + expectation[key]);
                }
            }
            m.test = function (actual) {
                return matchObject(expectation, actual);
            };
            m.message = "match(" + str.join(", ") + ")";
            break;
        case "number":
            m.test = function (actual) {
                return expectation == actual;
            };
            break;
        case "string":
            m.test = function (actual) {
                if (typeof actual !== "string") {
                    return false;
                }
                return actual.indexOf(expectation) !== -1;
            };
            m.message = "match(\"" + expectation + "\")";
            break;
        case "regexp":
            m.test = function (actual) {
                if (typeof actual !== "string") {
                    return false;
                }
                return expectation.test(actual);
            };
            break;
        case "function":
            m.test = expectation;
            if (message) {
                m.message = message;
            } else {
                m.message = "match(" + sinon.functionName(expectation) + ")";
            }
            break;
        default:
            m.test = function (actual) {
              return sinon.deepEqual(expectation, actual);
            };
        }
        if (!m.message) {
            m.message = "match(" + expectation + ")";
        }
        return m;
    };

    match.isMatcher = isMatcher;

    match.any = match(function () {
        return true;
    }, "any");

    match.defined = match(function (actual) {
        return actual !== null && actual !== undefined;
    }, "defined");

    match.truthy = match(function (actual) {
        return !!actual;
    }, "truthy");

    match.falsy = match(function (actual) {
        return !actual;
    }, "falsy");

    match.same = function (expectation) {
        return match(function (actual) {
            return expectation === actual;
        }, "same(" + expectation + ")");
    };

    match.typeOf = function (type) {
        assertType(type, "string", "type");
        return match(function (actual) {
            return sinon.typeOf(actual) === type;
        }, "typeOf(\"" + type + "\")");
    };

    match.instanceOf = function (type) {
        assertType(type, "function", "type");
        return match(function (actual) {
            return actual instanceof type;
        }, "instanceOf(" + sinon.functionName(type) + ")");
    };

    function createPropertyMatcher(propertyTest, messagePrefix) {
        return function (property, value) {
            assertType(property, "string", "property");
            var onlyProperty = arguments.length === 1;
            var message = messagePrefix + "(\"" + property + "\"";
            if (!onlyProperty) {
                message += ", " + value;
            }
            message += ")";
            return match(function (actual) {
                if (actual === undefined || actual === null ||
                        !propertyTest(actual, property)) {
                    return false;
                }
                return onlyProperty || sinon.deepEqual(value, actual[property]);
            }, message);
        };
    }

    match.has = createPropertyMatcher(function (actual, property) {
        if (typeof actual === "object") {
            return property in actual;
        }
        return actual[property] !== undefined;
    }, "has");

    match.hasOwn = createPropertyMatcher(function (actual, property) {
        return actual.hasOwnProperty(property);
    }, "hasOwn");

    match.bool = match.typeOf("boolean");
    match.number = match.typeOf("number");
    match.string = match.typeOf("string");
    match.object = match.typeOf("object");
    match.func = match.typeOf("function");
    match.array = match.typeOf("array");
    match.regexp = match.typeOf("regexp");
    match.date = match.typeOf("date");

    sinon.match = match;

    if (typeof define === "function" && define.amd) {
        define(["module"], function(module) { module.exports = match; });
    } else if (commonJSModule) {
        module.exports = match;
    }
}(typeof sinon == "object" && sinon || null));

},{"../sinon":6}],12:[function(require,module,exports){
/**
 * @depend ../sinon.js
 * @depend stub.js
 */
/*jslint eqeqeq: false, onevar: false, nomen: false*/
/*global module, require, sinon*/
/**
 * Mock functions.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function (sinon) {
    var commonJSModule = typeof module !== "undefined" && module.exports && typeof require == "function";
    var push = [].push;
    var match;

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    match = sinon.match;

    if (!match && commonJSModule) {
        match = require("./match");
    }

    function mock(object) {
        if (!object) {
            return sinon.expectation.create("Anonymous mock");
        }

        return mock.create(object);
    }

    sinon.mock = mock;

    sinon.extend(mock, (function () {
        function each(collection, callback) {
            if (!collection) {
                return;
            }

            for (var i = 0, l = collection.length; i < l; i += 1) {
                callback(collection[i]);
            }
        }

        return {
            create: function create(object) {
                if (!object) {
                    throw new TypeError("object is null");
                }

                var mockObject = sinon.extend({}, mock);
                mockObject.object = object;
                delete mockObject.create;

                return mockObject;
            },

            expects: function expects(method) {
                if (!method) {
                    throw new TypeError("method is falsy");
                }

                if (!this.expectations) {
                    this.expectations = {};
                    this.proxies = [];
                }

                if (!this.expectations[method]) {
                    this.expectations[method] = [];
                    var mockObject = this;

                    sinon.wrapMethod(this.object, method, function () {
                        return mockObject.invokeMethod(method, this, arguments);
                    });

                    push.call(this.proxies, method);
                }

                var expectation = sinon.expectation.create(method);
                push.call(this.expectations[method], expectation);

                return expectation;
            },

            restore: function restore() {
                var object = this.object;

                each(this.proxies, function (proxy) {
                    if (typeof object[proxy].restore == "function") {
                        object[proxy].restore();
                    }
                });
            },

            verify: function verify() {
                var expectations = this.expectations || {};
                var messages = [], met = [];

                each(this.proxies, function (proxy) {
                    each(expectations[proxy], function (expectation) {
                        if (!expectation.met()) {
                            push.call(messages, expectation.toString());
                        } else {
                            push.call(met, expectation.toString());
                        }
                    });
                });

                this.restore();

                if (messages.length > 0) {
                    sinon.expectation.fail(messages.concat(met).join("\n"));
                } else {
                    sinon.expectation.pass(messages.concat(met).join("\n"));
                }

                return true;
            },

            invokeMethod: function invokeMethod(method, thisValue, args) {
                var expectations = this.expectations && this.expectations[method];
                var length = expectations && expectations.length || 0, i;

                for (i = 0; i < length; i += 1) {
                    if (!expectations[i].met() &&
                        expectations[i].allowsCall(thisValue, args)) {
                        return expectations[i].apply(thisValue, args);
                    }
                }

                var messages = [], available, exhausted = 0;

                for (i = 0; i < length; i += 1) {
                    if (expectations[i].allowsCall(thisValue, args)) {
                        available = available || expectations[i];
                    } else {
                        exhausted += 1;
                    }
                    push.call(messages, "    " + expectations[i].toString());
                }

                if (exhausted === 0) {
                    return available.apply(thisValue, args);
                }

                messages.unshift("Unexpected call: " + sinon.spyCall.toString.call({
                    proxy: method,
                    args: args
                }));

                sinon.expectation.fail(messages.join("\n"));
            }
        };
    }()));

    var times = sinon.timesInWords;

    sinon.expectation = (function () {
        var slice = Array.prototype.slice;
        var _invoke = sinon.spy.invoke;

        function callCountInWords(callCount) {
            if (callCount == 0) {
                return "never called";
            } else {
                return "called " + times(callCount);
            }
        }

        function expectedCallCountInWords(expectation) {
            var min = expectation.minCalls;
            var max = expectation.maxCalls;

            if (typeof min == "number" && typeof max == "number") {
                var str = times(min);

                if (min != max) {
                    str = "at least " + str + " and at most " + times(max);
                }

                return str;
            }

            if (typeof min == "number") {
                return "at least " + times(min);
            }

            return "at most " + times(max);
        }

        function receivedMinCalls(expectation) {
            var hasMinLimit = typeof expectation.minCalls == "number";
            return !hasMinLimit || expectation.callCount >= expectation.minCalls;
        }

        function receivedMaxCalls(expectation) {
            if (typeof expectation.maxCalls != "number") {
                return false;
            }

            return expectation.callCount == expectation.maxCalls;
        }

        function verifyMatcher(possibleMatcher, arg){
            if (match && match.isMatcher(possibleMatcher)) {
                return possibleMatcher.test(arg);
            } else {
                return true;
            }
        }

        return {
            minCalls: 1,
            maxCalls: 1,

            create: function create(methodName) {
                var expectation = sinon.extend(sinon.stub.create(), sinon.expectation);
                delete expectation.create;
                expectation.method = methodName;

                return expectation;
            },

            invoke: function invoke(func, thisValue, args) {
                this.verifyCallAllowed(thisValue, args);

                return _invoke.apply(this, arguments);
            },

            atLeast: function atLeast(num) {
                if (typeof num != "number") {
                    throw new TypeError("'" + num + "' is not number");
                }

                if (!this.limitsSet) {
                    this.maxCalls = null;
                    this.limitsSet = true;
                }

                this.minCalls = num;

                return this;
            },

            atMost: function atMost(num) {
                if (typeof num != "number") {
                    throw new TypeError("'" + num + "' is not number");
                }

                if (!this.limitsSet) {
                    this.minCalls = null;
                    this.limitsSet = true;
                }

                this.maxCalls = num;

                return this;
            },

            never: function never() {
                return this.exactly(0);
            },

            once: function once() {
                return this.exactly(1);
            },

            twice: function twice() {
                return this.exactly(2);
            },

            thrice: function thrice() {
                return this.exactly(3);
            },

            exactly: function exactly(num) {
                if (typeof num != "number") {
                    throw new TypeError("'" + num + "' is not a number");
                }

                this.atLeast(num);
                return this.atMost(num);
            },

            met: function met() {
                return !this.failed && receivedMinCalls(this);
            },

            verifyCallAllowed: function verifyCallAllowed(thisValue, args) {
                if (receivedMaxCalls(this)) {
                    this.failed = true;
                    sinon.expectation.fail(this.method + " already called " + times(this.maxCalls));
                }

                if ("expectedThis" in this && this.expectedThis !== thisValue) {
                    sinon.expectation.fail(this.method + " called with " + thisValue + " as thisValue, expected " +
                        this.expectedThis);
                }

                if (!("expectedArguments" in this)) {
                    return;
                }

                if (!args) {
                    sinon.expectation.fail(this.method + " received no arguments, expected " +
                        sinon.format(this.expectedArguments));
                }

                if (args.length < this.expectedArguments.length) {
                    sinon.expectation.fail(this.method + " received too few arguments (" + sinon.format(args) +
                        "), expected " + sinon.format(this.expectedArguments));
                }

                if (this.expectsExactArgCount &&
                    args.length != this.expectedArguments.length) {
                    sinon.expectation.fail(this.method + " received too many arguments (" + sinon.format(args) +
                        "), expected " + sinon.format(this.expectedArguments));
                }

                for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {

                    if (!verifyMatcher(this.expectedArguments[i],args[i])) {
                        sinon.expectation.fail(this.method + " received wrong arguments " + sinon.format(args) +
                            ", didn't match " + this.expectedArguments.toString());
                    }

                    if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {
                        sinon.expectation.fail(this.method + " received wrong arguments " + sinon.format(args) +
                            ", expected " + sinon.format(this.expectedArguments));
                    }
                }
            },

            allowsCall: function allowsCall(thisValue, args) {
                if (this.met() && receivedMaxCalls(this)) {
                    return false;
                }

                if ("expectedThis" in this && this.expectedThis !== thisValue) {
                    return false;
                }

                if (!("expectedArguments" in this)) {
                    return true;
                }

                args = args || [];

                if (args.length < this.expectedArguments.length) {
                    return false;
                }

                if (this.expectsExactArgCount &&
                    args.length != this.expectedArguments.length) {
                    return false;
                }

                for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {
                    if (!verifyMatcher(this.expectedArguments[i],args[i])) {
                        return false;
                    }

                    if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {
                        return false;
                    }
                }

                return true;
            },

            withArgs: function withArgs() {
                this.expectedArguments = slice.call(arguments);
                return this;
            },

            withExactArgs: function withExactArgs() {
                this.withArgs.apply(this, arguments);
                this.expectsExactArgCount = true;
                return this;
            },

            on: function on(thisValue) {
                this.expectedThis = thisValue;
                return this;
            },

            toString: function () {
                var args = (this.expectedArguments || []).slice();

                if (!this.expectsExactArgCount) {
                    push.call(args, "[...]");
                }

                var callStr = sinon.spyCall.toString.call({
                    proxy: this.method || "anonymous mock expectation",
                    args: args
                });

                var message = callStr.replace(", [...", "[, ...") + " " +
                    expectedCallCountInWords(this);

                if (this.met()) {
                    return "Expectation met: " + message;
                }

                return "Expected " + message + " (" +
                    callCountInWords(this.callCount) + ")";
            },

            verify: function verify() {
                if (!this.met()) {
                    sinon.expectation.fail(this.toString());
                } else {
                    sinon.expectation.pass(this.toString());
                }

                return true;
            },

            pass: function(message) {
              sinon.assert.pass(message);
            },
            fail: function (message) {
                var exception = new Error(message);
                exception.name = "ExpectationError";

                throw exception;
            }
        };
    }());

    sinon.mock = mock;

    if (typeof define === "function" && define.amd) {
        define(["module"], function(module) { module.exports = mock; });
    } else if (commonJSModule) {
        module.exports = mock;
    }
}(typeof sinon == "object" && sinon || null));

},{"../sinon":6,"./match":11}],13:[function(require,module,exports){
/**
 * @depend ../sinon.js
 * @depend collection.js
 * @depend util/fake_timers.js
 * @depend util/fake_server_with_clock.js
 */
/*jslint eqeqeq: false, onevar: false, plusplus: false*/
/*global require, module*/
/**
 * Manages fake collections as well as fake utilities such as Sinon's
 * timers and fake XHR implementation in one convenient object.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

if (typeof module !== "undefined" && module.exports && typeof require == "function") {
    var sinon = require("../sinon");
    sinon.extend(sinon, require("./util/fake_timers"));
}

(function () {
    var push = [].push;

    function exposeValue(sandbox, config, key, value) {
        if (!value) {
            return;
        }

        if (config.injectInto && !(key in config.injectInto)) {
            config.injectInto[key] = value;
            sandbox.injectedKeys.push(key);
        } else {
            push.call(sandbox.args, value);
        }
    }

    function prepareSandboxFromConfig(config) {
        var sandbox = sinon.create(sinon.sandbox);

        if (config.useFakeServer) {
            if (typeof config.useFakeServer == "object") {
                sandbox.serverPrototype = config.useFakeServer;
            }

            sandbox.useFakeServer();
        }

        if (config.useFakeTimers) {
            if (typeof config.useFakeTimers == "object") {
                sandbox.useFakeTimers.apply(sandbox, config.useFakeTimers);
            } else {
                sandbox.useFakeTimers();
            }
        }

        return sandbox;
    }

    sinon.sandbox = sinon.extend(sinon.create(sinon.collection), {
        useFakeTimers: function useFakeTimers() {
            this.clock = sinon.useFakeTimers.apply(sinon, arguments);

            return this.add(this.clock);
        },

        serverPrototype: sinon.fakeServer,

        useFakeServer: function useFakeServer() {
            var proto = this.serverPrototype || sinon.fakeServer;

            if (!proto || !proto.create) {
                return null;
            }

            this.server = proto.create();
            return this.add(this.server);
        },

        inject: function (obj) {
            sinon.collection.inject.call(this, obj);

            if (this.clock) {
                obj.clock = this.clock;
            }

            if (this.server) {
                obj.server = this.server;
                obj.requests = this.server.requests;
            }

            return obj;
        },

        restore: function () {
            sinon.collection.restore.apply(this, arguments);
            this.restoreContext();
        },

        restoreContext: function () {
            if (this.injectedKeys) {
                for (var i = 0, j = this.injectedKeys.length; i < j; i++) {
                    delete this.injectInto[this.injectedKeys[i]];
                }
                this.injectedKeys = [];
            }
        },

        create: function (config) {
            if (!config) {
                return sinon.create(sinon.sandbox);
            }

            var sandbox = prepareSandboxFromConfig(config);
            sandbox.args = sandbox.args || [];
            sandbox.injectedKeys = [];
            sandbox.injectInto = config.injectInto;
            var prop, value, exposed = sandbox.inject({});

            if (config.properties) {
                for (var i = 0, l = config.properties.length; i < l; i++) {
                    prop = config.properties[i];
                    value = exposed[prop] || prop == "sandbox" && sandbox;
                    exposeValue(sandbox, config, prop, value);
                }
            } else {
                exposeValue(sandbox, config, "sandbox", value);
            }

            return sandbox;
        }
    });

    sinon.sandbox.useFakeXMLHttpRequest = sinon.sandbox.useFakeServer;

    if (typeof define === "function" && define.amd) {
        define(["module"], function(module) { module.exports = sinon.sandbox; });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = sinon.sandbox;
    }
}());

},{"../sinon":6,"./util/fake_timers":18}],14:[function(require,module,exports){
/**
  * @depend ../sinon.js
  * @depend call.js
  */
/*jslint eqeqeq: false, onevar: false, plusplus: false*/
/*global module, require, sinon*/
/**
  * Spy functions
  *
  * @author Christian Johansen (christian@cjohansen.no)
  * @license BSD
  *
  * Copyright (c) 2010-2013 Christian Johansen
  */
"use strict";

(function (sinon) {
    var commonJSModule = typeof module !== "undefined" && module.exports && typeof require == "function";
    var push = Array.prototype.push;
    var slice = Array.prototype.slice;
    var callId = 0;

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function spy(object, property) {
        if (!property && typeof object == "function") {
            return spy.create(object);
        }

        if (!object && !property) {
            return spy.create(function () { });
        }

        var method = object[property];
        return sinon.wrapMethod(object, property, spy.create(method));
    }

    function matchingFake(fakes, args, strict) {
        if (!fakes) {
            return;
        }

        for (var i = 0, l = fakes.length; i < l; i++) {
            if (fakes[i].matches(args, strict)) {
                return fakes[i];
            }
        }
    }

    function incrementCallCount() {
        this.called = true;
        this.callCount += 1;
        this.notCalled = false;
        this.calledOnce = this.callCount == 1;
        this.calledTwice = this.callCount == 2;
        this.calledThrice = this.callCount == 3;
    }

    function createCallProperties() {
        this.firstCall = this.getCall(0);
        this.secondCall = this.getCall(1);
        this.thirdCall = this.getCall(2);
        this.lastCall = this.getCall(this.callCount - 1);
    }

    var vars = "a,b,c,d,e,f,g,h,i,j,k,l";
    function createProxy(func) {
        // Retain the function length:
        var p;
        if (func.length) {
            eval("p = (function proxy(" + vars.substring(0, func.length * 2 - 1) +
                ") { return p.invoke(func, this, slice.call(arguments)); });");
        }
        else {
            p = function proxy() {
                return p.invoke(func, this, slice.call(arguments));
            };
        }
        return p;
    }

    var uuid = 0;

    // Public API
    var spyApi = {
        reset: function () {
            this.called = false;
            this.notCalled = true;
            this.calledOnce = false;
            this.calledTwice = false;
            this.calledThrice = false;
            this.callCount = 0;
            this.firstCall = null;
            this.secondCall = null;
            this.thirdCall = null;
            this.lastCall = null;
            this.args = [];
            this.returnValues = [];
            this.thisValues = [];
            this.exceptions = [];
            this.callIds = [];
            if (this.fakes) {
                for (var i = 0; i < this.fakes.length; i++) {
                    this.fakes[i].reset();
                }
            }
        },

        create: function create(func) {
            var name;

            if (typeof func != "function") {
                func = function () { };
            } else {
                name = sinon.functionName(func);
            }

            var proxy = createProxy(func);

            sinon.extend(proxy, spy);
            delete proxy.create;
            sinon.extend(proxy, func);

            proxy.reset();
            proxy.prototype = func.prototype;
            proxy.displayName = name || "spy";
            proxy.toString = sinon.functionToString;
            proxy._create = sinon.spy.create;
            proxy.id = "spy#" + uuid++;

            return proxy;
        },

        invoke: function invoke(func, thisValue, args) {
            var matching = matchingFake(this.fakes, args);
            var exception, returnValue;

            incrementCallCount.call(this);
            push.call(this.thisValues, thisValue);
            push.call(this.args, args);
            push.call(this.callIds, callId++);

            createCallProperties.call(this);

            try {
                if (matching) {
                    returnValue = matching.invoke(func, thisValue, args);
                } else {
                    returnValue = (this.func || func).apply(thisValue, args);
                }

                var thisCall = this.getCall(this.callCount - 1);
                if (thisCall.calledWithNew() && typeof returnValue !== 'object') {
                    returnValue = thisValue;
                }
            } catch (e) {
                exception = e;
            }

            push.call(this.exceptions, exception);
            push.call(this.returnValues, returnValue);

            if (exception !== undefined) {
                throw exception;
            }

            return returnValue;
        },

        named: function named(name) {
            this.displayName = name;
            return this;
        },

        getCall: function getCall(i) {
            if (i < 0 || i >= this.callCount) {
                return null;
            }

            return sinon.spyCall(this, this.thisValues[i], this.args[i],
                                    this.returnValues[i], this.exceptions[i],
                                    this.callIds[i]);
        },

        getCalls: function () {
            var calls = [];
            var i;

            for (i = 0; i < this.callCount; i++) {
                calls.push(this.getCall(i));
            }

            return calls;
        },

        calledBefore: function calledBefore(spyFn) {
            if (!this.called) {
                return false;
            }

            if (!spyFn.called) {
                return true;
            }

            return this.callIds[0] < spyFn.callIds[spyFn.callIds.length - 1];
        },

        calledAfter: function calledAfter(spyFn) {
            if (!this.called || !spyFn.called) {
                return false;
            }

            return this.callIds[this.callCount - 1] > spyFn.callIds[spyFn.callCount - 1];
        },

        withArgs: function () {
            var args = slice.call(arguments);

            if (this.fakes) {
                var match = matchingFake(this.fakes, args, true);

                if (match) {
                    return match;
                }
            } else {
                this.fakes = [];
            }

            var original = this;
            var fake = this._create();
            fake.matchingAguments = args;
            fake.parent = this;
            push.call(this.fakes, fake);

            fake.withArgs = function () {
                return original.withArgs.apply(original, arguments);
            };

            for (var i = 0; i < this.args.length; i++) {
                if (fake.matches(this.args[i])) {
                    incrementCallCount.call(fake);
                    push.call(fake.thisValues, this.thisValues[i]);
                    push.call(fake.args, this.args[i]);
                    push.call(fake.returnValues, this.returnValues[i]);
                    push.call(fake.exceptions, this.exceptions[i]);
                    push.call(fake.callIds, this.callIds[i]);
                }
            }
            createCallProperties.call(fake);

            return fake;
        },

        matches: function (args, strict) {
            var margs = this.matchingAguments;

            if (margs.length <= args.length &&
                sinon.deepEqual(margs, args.slice(0, margs.length))) {
                return !strict || margs.length == args.length;
            }
        },

        printf: function (format) {
            var spy = this;
            var args = slice.call(arguments, 1);
            var formatter;

            return (format || "").replace(/%(.)/g, function (match, specifyer) {
                formatter = spyApi.formatters[specifyer];

                if (typeof formatter == "function") {
                    return formatter.call(null, spy, args);
                } else if (!isNaN(parseInt(specifyer, 10))) {
                    return sinon.format(args[specifyer - 1]);
                }

                return "%" + specifyer;
            });
        }
    };

    function delegateToCalls(method, matchAny, actual, notCalled) {
        spyApi[method] = function () {
            if (!this.called) {
                if (notCalled) {
                    return notCalled.apply(this, arguments);
                }
                return false;
            }

            var currentCall;
            var matches = 0;

            for (var i = 0, l = this.callCount; i < l; i += 1) {
                currentCall = this.getCall(i);

                if (currentCall[actual || method].apply(currentCall, arguments)) {
                    matches += 1;

                    if (matchAny) {
                        return true;
                    }
                }
            }

            return matches === this.callCount;
        };
    }

    delegateToCalls("calledOn", true);
    delegateToCalls("alwaysCalledOn", false, "calledOn");
    delegateToCalls("calledWith", true);
    delegateToCalls("calledWithMatch", true);
    delegateToCalls("alwaysCalledWith", false, "calledWith");
    delegateToCalls("alwaysCalledWithMatch", false, "calledWithMatch");
    delegateToCalls("calledWithExactly", true);
    delegateToCalls("alwaysCalledWithExactly", false, "calledWithExactly");
    delegateToCalls("neverCalledWith", false, "notCalledWith",
        function () { return true; });
    delegateToCalls("neverCalledWithMatch", false, "notCalledWithMatch",
        function () { return true; });
    delegateToCalls("threw", true);
    delegateToCalls("alwaysThrew", false, "threw");
    delegateToCalls("returned", true);
    delegateToCalls("alwaysReturned", false, "returned");
    delegateToCalls("calledWithNew", true);
    delegateToCalls("alwaysCalledWithNew", false, "calledWithNew");
    delegateToCalls("callArg", false, "callArgWith", function () {
        throw new Error(this.toString() + " cannot call arg since it was not yet invoked.");
    });
    spyApi.callArgWith = spyApi.callArg;
    delegateToCalls("callArgOn", false, "callArgOnWith", function () {
        throw new Error(this.toString() + " cannot call arg since it was not yet invoked.");
    });
    spyApi.callArgOnWith = spyApi.callArgOn;
    delegateToCalls("yield", false, "yield", function () {
        throw new Error(this.toString() + " cannot yield since it was not yet invoked.");
    });
    // "invokeCallback" is an alias for "yield" since "yield" is invalid in strict mode.
    spyApi.invokeCallback = spyApi.yield;
    delegateToCalls("yieldOn", false, "yieldOn", function () {
        throw new Error(this.toString() + " cannot yield since it was not yet invoked.");
    });
    delegateToCalls("yieldTo", false, "yieldTo", function (property) {
        throw new Error(this.toString() + " cannot yield to '" + property +
            "' since it was not yet invoked.");
    });
    delegateToCalls("yieldToOn", false, "yieldToOn", function (property) {
        throw new Error(this.toString() + " cannot yield to '" + property +
            "' since it was not yet invoked.");
    });

    spyApi.formatters = {
        "c": function (spy) {
            return sinon.timesInWords(spy.callCount);
        },

        "n": function (spy) {
            return spy.toString();
        },

        "C": function (spy) {
            var calls = [];

            for (var i = 0, l = spy.callCount; i < l; ++i) {
                var stringifiedCall = "    " + spy.getCall(i).toString();
                if (/\n/.test(calls[i - 1])) {
                    stringifiedCall = "\n" + stringifiedCall;
                }
                push.call(calls, stringifiedCall);
            }

            return calls.length > 0 ? "\n" + calls.join("\n") : "";
        },

        "t": function (spy) {
            var objects = [];

            for (var i = 0, l = spy.callCount; i < l; ++i) {
                push.call(objects, sinon.format(spy.thisValues[i]));
            }

            return objects.join(", ");
        },

        "*": function (spy, args) {
            var formatted = [];

            for (var i = 0, l = args.length; i < l; ++i) {
                push.call(formatted, sinon.format(args[i]));
            }

            return formatted.join(", ");
        }
    };

    sinon.extend(spy, spyApi);

    spy.spyCall = sinon.spyCall;
    sinon.spy = spy;

    if (typeof define === "function" && define.amd) {
        define(["module"], function(module) { module.exports = spy; });
    } else if (commonJSModule) {
        module.exports = spy;
    }
}(typeof sinon == "object" && sinon || null));

},{"../sinon":6}],15:[function(require,module,exports){
/**
 * @depend ../sinon.js
 * @depend spy.js
 * @depend behavior.js
 */
/*jslint eqeqeq: false, onevar: false*/
/*global module, require, sinon*/
/**
 * Stub functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function (sinon) {
    var commonJSModule = typeof module !== "undefined" && module.exports && typeof require == "function";

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function stub(object, property, func) {
        if (!!func && typeof func != "function") {
            throw new TypeError("Custom stub should be function");
        }

        var wrapper;

        if (func) {
            wrapper = sinon.spy && sinon.spy.create ? sinon.spy.create(func) : func;
        } else {
            wrapper = stub.create();
        }

        if (!object && typeof property === "undefined") {
            return sinon.stub.create();
        }

        if (typeof property === "undefined" && typeof object == "object") {
            for (var prop in object) {
                if (typeof object[prop] === "function") {
                    stub(object, prop);
                }
            }

            return object;
        }

        return sinon.wrapMethod(object, property, wrapper);
    }

    function getDefaultBehavior(stub) {
        return stub.defaultBehavior || getParentBehaviour(stub) || sinon.behavior.create(stub);
    }

    function getParentBehaviour(stub) {
        return (stub.parent && getCurrentBehavior(stub.parent));
    }

    function getCurrentBehavior(stub) {
        var behavior = stub.behaviors[stub.callCount - 1];
        return behavior && behavior.isPresent() ? behavior : getDefaultBehavior(stub);
    }

    var uuid = 0;

    sinon.extend(stub, (function () {
        var proto = {
            create: function create() {
                var functionStub = function () {
                    return getCurrentBehavior(functionStub).invoke(this, arguments);
                };

                functionStub.id = "stub#" + uuid++;
                var orig = functionStub;
                functionStub = sinon.spy.create(functionStub);
                functionStub.func = orig;

                sinon.extend(functionStub, stub);
                functionStub._create = sinon.stub.create;
                functionStub.displayName = "stub";
                functionStub.toString = sinon.functionToString;

                functionStub.defaultBehavior = null;
                functionStub.behaviors = [];

                return functionStub;
            },

            resetBehavior: function () {
                var i;

                this.defaultBehavior = null;
                this.behaviors = [];

                delete this.returnValue;
                delete this.returnArgAt;
                this.returnThis = false;

                if (this.fakes) {
                    for (i = 0; i < this.fakes.length; i++) {
                        this.fakes[i].resetBehavior();
                    }
                }
            },

            onCall: function(index) {
                if (!this.behaviors[index]) {
                    this.behaviors[index] = sinon.behavior.create(this);
                }

                return this.behaviors[index];
            },

            onFirstCall: function() {
                return this.onCall(0);
            },

            onSecondCall: function() {
                return this.onCall(1);
            },

            onThirdCall: function() {
                return this.onCall(2);
            }
        };

        for (var method in sinon.behavior) {
            if (sinon.behavior.hasOwnProperty(method) &&
                !proto.hasOwnProperty(method) &&
                method != 'create' &&
                method != 'withArgs' &&
                method != 'invoke') {
                proto[method] = (function(behaviorMethod) {
                    return function() {
                        this.defaultBehavior = this.defaultBehavior || sinon.behavior.create(this);
                        this.defaultBehavior[behaviorMethod].apply(this.defaultBehavior, arguments);
                        return this;
                    };
                }(method));
            }
        }

        return proto;
    }()));

    sinon.stub = stub;

    if (typeof define === "function" && define.amd) {
        define(["module"], function(module) { module.exports = stub; });
    } else if (commonJSModule) {
        module.exports = stub;
    }
}(typeof sinon == "object" && sinon || null));

},{"../sinon":6}],16:[function(require,module,exports){
/**
 * @depend ../sinon.js
 * @depend stub.js
 * @depend mock.js
 * @depend sandbox.js
 */
/*jslint eqeqeq: false, onevar: false, forin: true, plusplus: false*/
/*global module, require, sinon*/
/**
 * Test function, sandboxes fakes
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function (sinon) {
    var commonJSModule = typeof module !== "undefined" && module.exports && typeof require == "function";

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function test(callback) {
        var type = typeof callback;

        if (type != "function") {
            throw new TypeError("sinon.test needs to wrap a test function, got " + type);
        }

        function sinonSandboxedTest() {
            var config = sinon.getConfig(sinon.config);
            config.injectInto = config.injectIntoThis && this || config.injectInto;
            var sandbox = sinon.sandbox.create(config);
            var exception, result;
            var args = Array.prototype.slice.call(arguments).concat(sandbox.args);

            try {
                result = callback.apply(this, args);
            } catch (e) {
                exception = e;
            }

            if (typeof exception !== "undefined") {
                sandbox.restore();
                throw exception;
            }
            else {
                sandbox.verifyAndRestore();
            }

            return result;
        };

        if (callback.length) {
            return function sinonAsyncSandboxedTest(callback) {
                return sinonSandboxedTest.apply(this, arguments);
            };
        }

        return sinonSandboxedTest;
    }

    test.config = {
        injectIntoThis: true,
        injectInto: null,
        properties: ["spy", "stub", "mock", "clock", "server", "requests"],
        useFakeTimers: true,
        useFakeServer: true
    };

    sinon.test = test;

    if (typeof define === "function" && define.amd) {
        define(["module"], function(module) { module.exports = test; });
    } else if (commonJSModule) {
        module.exports = test;
    }
}(typeof sinon == "object" && sinon || null));

},{"../sinon":6}],17:[function(require,module,exports){
/**
 * @depend ../sinon.js
 * @depend test.js
 */
/*jslint eqeqeq: false, onevar: false, eqeqeq: false*/
/*global module, require, sinon*/
/**
 * Test case, sandboxes all test functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function (sinon) {
    var commonJSModule = typeof module !== "undefined" && module.exports && typeof require == "function";

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon || !Object.prototype.hasOwnProperty) {
        return;
    }

    function createTest(property, setUp, tearDown) {
        return function () {
            if (setUp) {
                setUp.apply(this, arguments);
            }

            var exception, result;

            try {
                result = property.apply(this, arguments);
            } catch (e) {
                exception = e;
            }

            if (tearDown) {
                tearDown.apply(this, arguments);
            }

            if (exception) {
                throw exception;
            }

            return result;
        };
    }

    function testCase(tests, prefix) {
        /*jsl:ignore*/
        if (!tests || typeof tests != "object") {
            throw new TypeError("sinon.testCase needs an object with test functions");
        }
        /*jsl:end*/

        prefix = prefix || "test";
        var rPrefix = new RegExp("^" + prefix);
        var methods = {}, testName, property, method;
        var setUp = tests.setUp;
        var tearDown = tests.tearDown;

        for (testName in tests) {
            if (tests.hasOwnProperty(testName)) {
                property = tests[testName];

                if (/^(setUp|tearDown)$/.test(testName)) {
                    continue;
                }

                if (typeof property == "function" && rPrefix.test(testName)) {
                    method = property;

                    if (setUp || tearDown) {
                        method = createTest(property, setUp, tearDown);
                    }

                    methods[testName] = sinon.test(method);
                } else {
                    methods[testName] = tests[testName];
                }
            }
        }

        return methods;
    }

    sinon.testCase = testCase;

    if (typeof define === "function" && define.amd) {
        define(["module"], function(module) { module.exports = testCase; });
    } else if (commonJSModule) {
        module.exports = testCase;
    }
}(typeof sinon == "object" && sinon || null));

},{"../sinon":6}],18:[function(require,module,exports){
(function (global){
/*jslint eqeqeq: false, plusplus: false, evil: true, onevar: false, browser: true, forin: false*/
/*global module, require, window*/
/**
 * Fake timer API
 * setTimeout
 * setInterval
 * clearTimeout
 * clearInterval
 * tick
 * reset
 * Date
 *
 * Inspired by jsUnitMockTimeOut from JsUnit
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

if (typeof sinon == "undefined") {
    var sinon = {};
}

(function (global) {
    // node expects setTimeout/setInterval to return a fn object w/ .ref()/.unref()
    // browsers, a number.
    // see https://github.com/cjohansen/Sinon.JS/pull/436
    var timeoutResult = setTimeout(function() {}, 0);
    var addTimerReturnsObject = typeof timeoutResult === 'object';
    clearTimeout(timeoutResult);

    var id = 1;

    function addTimer(args, recurring) {
        if (args.length === 0) {
            throw new Error("Function requires at least 1 parameter");
        }

        if (typeof args[0] === "undefined") {
            throw new Error("Callback must be provided to timer calls");
        }

        var toId = id++;
        var delay = args[1] || 0;

        if (!this.timeouts) {
            this.timeouts = {};
        }

        this.timeouts[toId] = {
            id: toId,
            func: args[0],
            callAt: this.now + delay,
            invokeArgs: Array.prototype.slice.call(args, 2)
        };

        if (recurring === true) {
            this.timeouts[toId].interval = delay;
        }

        if (addTimerReturnsObject) {
            return {
                id: toId,
                ref: function() {},
                unref: function() {}
            };
        }
        else {
            return toId;
        }
    }

    function parseTime(str) {
        if (!str) {
            return 0;
        }

        var strings = str.split(":");
        var l = strings.length, i = l;
        var ms = 0, parsed;

        if (l > 3 || !/^(\d\d:){0,2}\d\d?$/.test(str)) {
            throw new Error("tick only understands numbers and 'h:m:s'");
        }

        while (i--) {
            parsed = parseInt(strings[i], 10);

            if (parsed >= 60) {
                throw new Error("Invalid time " + str);
            }

            ms += parsed * Math.pow(60, (l - i - 1));
        }

        return ms * 1000;
    }

    function createObject(object) {
        var newObject;

        if (Object.create) {
            newObject = Object.create(object);
        } else {
            var F = function () {};
            F.prototype = object;
            newObject = new F();
        }

        newObject.Date.clock = newObject;
        return newObject;
    }

    sinon.clock = {
        now: 0,

        create: function create(now) {
            var clock = createObject(this);

            if (typeof now == "number") {
                clock.now = now;
            }

            if (!!now && typeof now == "object") {
                throw new TypeError("now should be milliseconds since UNIX epoch");
            }

            return clock;
        },

        setTimeout: function setTimeout(callback, timeout) {
            return addTimer.call(this, arguments, false);
        },

        clearTimeout: function clearTimeout(timerId) {
            if (!this.timeouts) {
                this.timeouts = [];
            }
            // in Node, timerId is an object with .ref()/.unref(), and
            // its .id field is the actual timer id.
            if (typeof timerId === 'object') {
              timerId = timerId.id
            }
            if (timerId in this.timeouts) {
                delete this.timeouts[timerId];
            }
        },

        setInterval: function setInterval(callback, timeout) {
            return addTimer.call(this, arguments, true);
        },

        clearInterval: function clearInterval(timerId) {
            this.clearTimeout(timerId);
        },

        setImmediate: function setImmediate(callback) {
            var passThruArgs = Array.prototype.slice.call(arguments, 1);

            return addTimer.call(this, [callback, 0].concat(passThruArgs), false);
        },

        clearImmediate: function clearImmediate(timerId) {
            this.clearTimeout(timerId);
        },

        tick: function tick(ms) {
            ms = typeof ms == "number" ? ms : parseTime(ms);
            var tickFrom = this.now, tickTo = this.now + ms, previous = this.now;
            var timer = this.firstTimerInRange(tickFrom, tickTo);

            var firstException;
            while (timer && tickFrom <= tickTo) {
                if (this.timeouts[timer.id]) {
                    tickFrom = this.now = timer.callAt;
                    try {
                      this.callTimer(timer);
                    } catch (e) {
                      firstException = firstException || e;
                    }
                }

                timer = this.firstTimerInRange(previous, tickTo);
                previous = tickFrom;
            }

            this.now = tickTo;

            if (firstException) {
              throw firstException;
            }

            return this.now;
        },

        firstTimerInRange: function (from, to) {
            var timer, smallest = null, originalTimer;

            for (var id in this.timeouts) {
                if (this.timeouts.hasOwnProperty(id)) {
                    if (this.timeouts[id].callAt < from || this.timeouts[id].callAt > to) {
                        continue;
                    }

                    if (smallest === null || this.timeouts[id].callAt < smallest) {
                        originalTimer = this.timeouts[id];
                        smallest = this.timeouts[id].callAt;

                        timer = {
                            func: this.timeouts[id].func,
                            callAt: this.timeouts[id].callAt,
                            interval: this.timeouts[id].interval,
                            id: this.timeouts[id].id,
                            invokeArgs: this.timeouts[id].invokeArgs
                        };
                    }
                }
            }

            return timer || null;
        },

        callTimer: function (timer) {
            if (typeof timer.interval == "number") {
                this.timeouts[timer.id].callAt += timer.interval;
            } else {
                delete this.timeouts[timer.id];
            }

            try {
                if (typeof timer.func == "function") {
                    timer.func.apply(null, timer.invokeArgs);
                } else {
                    eval(timer.func);
                }
            } catch (e) {
              var exception = e;
            }

            if (!this.timeouts[timer.id]) {
                if (exception) {
                  throw exception;
                }
                return;
            }

            if (exception) {
              throw exception;
            }
        },

        reset: function reset() {
            this.timeouts = {};
        },

        Date: (function () {
            var NativeDate = Date;

            function ClockDate(year, month, date, hour, minute, second, ms) {
                // Defensive and verbose to avoid potential harm in passing
                // explicit undefined when user does not pass argument
                switch (arguments.length) {
                case 0:
                    return new NativeDate(ClockDate.clock.now);
                case 1:
                    return new NativeDate(year);
                case 2:
                    return new NativeDate(year, month);
                case 3:
                    return new NativeDate(year, month, date);
                case 4:
                    return new NativeDate(year, month, date, hour);
                case 5:
                    return new NativeDate(year, month, date, hour, minute);
                case 6:
                    return new NativeDate(year, month, date, hour, minute, second);
                default:
                    return new NativeDate(year, month, date, hour, minute, second, ms);
                }
            }

            return mirrorDateProperties(ClockDate, NativeDate);
        }())
    };

    function mirrorDateProperties(target, source) {
        if (source.now) {
            target.now = function now() {
                return target.clock.now;
            };
        } else {
            delete target.now;
        }

        if (source.toSource) {
            target.toSource = function toSource() {
                return source.toSource();
            };
        } else {
            delete target.toSource;
        }

        target.toString = function toString() {
            return source.toString();
        };

        target.prototype = source.prototype;
        target.parse = source.parse;
        target.UTC = source.UTC;
        target.prototype.toUTCString = source.prototype.toUTCString;

        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                target[prop] = source[prop];
            }
        }

        return target;
    }

    var methods = ["Date", "setTimeout", "setInterval",
                   "clearTimeout", "clearInterval"];

    if (typeof global.setImmediate !== "undefined") {
        methods.push("setImmediate");
    }

    if (typeof global.clearImmediate !== "undefined") {
        methods.push("clearImmediate");
    }

    function restore() {
        var method;

        for (var i = 0, l = this.methods.length; i < l; i++) {
            method = this.methods[i];

            if (global[method].hadOwnProperty) {
                global[method] = this["_" + method];
            } else {
                try {
                    delete global[method];
                } catch (e) {}
            }
        }

        // Prevent multiple executions which will completely remove these props
        this.methods = [];
    }

    function stubGlobal(method, clock) {
        clock[method].hadOwnProperty = Object.prototype.hasOwnProperty.call(global, method);
        clock["_" + method] = global[method];

        if (method == "Date") {
            var date = mirrorDateProperties(clock[method], global[method]);
            global[method] = date;
        } else {
            global[method] = function () {
                return clock[method].apply(clock, arguments);
            };

            for (var prop in clock[method]) {
                if (clock[method].hasOwnProperty(prop)) {
                    global[method][prop] = clock[method][prop];
                }
            }
        }

        global[method].clock = clock;
    }

    sinon.useFakeTimers = function useFakeTimers(now) {
        var clock = sinon.clock.create(now);
        clock.restore = restore;
        clock.methods = Array.prototype.slice.call(arguments,
                                                   typeof now == "number" ? 1 : 0);

        if (clock.methods.length === 0) {
            clock.methods = methods;
        }

        for (var i = 0, l = clock.methods.length; i < l; i++) {
            stubGlobal(clock.methods[i], clock);
        }

        return clock;
    };
}(typeof global != "undefined" && typeof global !== "function" ? global : this));

sinon.timers = {
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setImmediate: (typeof setImmediate !== "undefined" ? setImmediate : undefined),
    clearImmediate: (typeof clearImmediate !== "undefined" ? clearImmediate: undefined),
    setInterval: setInterval,
    clearInterval: clearInterval,
    Date: Date
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = sinon;
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],19:[function(require,module,exports){
(function (global){
((typeof define === "function" && define.amd && function (m) {
    define("formatio", ["samsam"], m);
}) || (typeof module === "object" && function (m) {
    module.exports = m(require("samsam"));
}) || function (m) { this.formatio = m(this.samsam); }
)(function (samsam) {
    "use strict";

    var formatio = {
        excludeConstructors: ["Object", /^.$/],
        quoteStrings: true
    };

    var hasOwn = Object.prototype.hasOwnProperty;

    var specialObjects = [];
    if (typeof global !== "undefined") {
        specialObjects.push({ object: global, value: "[object global]" });
    }
    if (typeof document !== "undefined") {
        specialObjects.push({
            object: document,
            value: "[object HTMLDocument]"
        });
    }
    if (typeof window !== "undefined") {
        specialObjects.push({ object: window, value: "[object Window]" });
    }

    function functionName(func) {
        if (!func) { return ""; }
        if (func.displayName) { return func.displayName; }
        if (func.name) { return func.name; }
        var matches = func.toString().match(/function\s+([^\(]+)/m);
        return (matches && matches[1]) || "";
    }

    function constructorName(f, object) {
        var name = functionName(object && object.constructor);
        var excludes = f.excludeConstructors ||
                formatio.excludeConstructors || [];

        var i, l;
        for (i = 0, l = excludes.length; i < l; ++i) {
            if (typeof excludes[i] === "string" && excludes[i] === name) {
                return "";
            } else if (excludes[i].test && excludes[i].test(name)) {
                return "";
            }
        }

        return name;
    }

    function isCircular(object, objects) {
        if (typeof object !== "object") { return false; }
        var i, l;
        for (i = 0, l = objects.length; i < l; ++i) {
            if (objects[i] === object) { return true; }
        }
        return false;
    }

    function ascii(f, object, processed, indent) {
        if (typeof object === "string") {
            var qs = f.quoteStrings;
            var quote = typeof qs !== "boolean" || qs;
            return processed || quote ? '"' + object + '"' : object;
        }

        if (typeof object === "function" && !(object instanceof RegExp)) {
            return ascii.func(object);
        }

        processed = processed || [];

        if (isCircular(object, processed)) { return "[Circular]"; }

        if (Object.prototype.toString.call(object) === "[object Array]") {
            return ascii.array.call(f, object, processed);
        }

        if (!object) { return String((1/object) === -Infinity ? "-0" : object); }
        if (samsam.isElement(object)) { return ascii.element(object); }

        if (typeof object.toString === "function" &&
                object.toString !== Object.prototype.toString) {
            return object.toString();
        }

        var i, l;
        for (i = 0, l = specialObjects.length; i < l; i++) {
            if (object === specialObjects[i].object) {
                return specialObjects[i].value;
            }
        }

        return ascii.object.call(f, object, processed, indent);
    }

    ascii.func = function (func) {
        return "function " + functionName(func) + "() {}";
    };

    ascii.array = function (array, processed) {
        processed = processed || [];
        processed.push(array);
        var i, l, pieces = [];
        for (i = 0, l = array.length; i < l; ++i) {
            pieces.push(ascii(this, array[i], processed));
        }
        return "[" + pieces.join(", ") + "]";
    };

    ascii.object = function (object, processed, indent) {
        processed = processed || [];
        processed.push(object);
        indent = indent || 0;
        var pieces = [], properties = samsam.keys(object).sort();
        var length = 3;
        var prop, str, obj, i, l;

        for (i = 0, l = properties.length; i < l; ++i) {
            prop = properties[i];
            obj = object[prop];

            if (isCircular(obj, processed)) {
                str = "[Circular]";
            } else {
                str = ascii(this, obj, processed, indent + 2);
            }

            str = (/\s/.test(prop) ? '"' + prop + '"' : prop) + ": " + str;
            length += str.length;
            pieces.push(str);
        }

        var cons = constructorName(this, object);
        var prefix = cons ? "[" + cons + "] " : "";
        var is = "";
        for (i = 0, l = indent; i < l; ++i) { is += " "; }

        if (length + indent > 80) {
            return prefix + "{\n  " + is + pieces.join(",\n  " + is) + "\n" +
                is + "}";
        }
        return prefix + "{ " + pieces.join(", ") + " }";
    };

    ascii.element = function (element) {
        var tagName = element.tagName.toLowerCase();
        var attrs = element.attributes, attr, pairs = [], attrName, i, l, val;

        for (i = 0, l = attrs.length; i < l; ++i) {
            attr = attrs.item(i);
            attrName = attr.nodeName.toLowerCase().replace("html:", "");
            val = attr.nodeValue;
            if (attrName !== "contenteditable" || val !== "inherit") {
                if (!!val) { pairs.push(attrName + "=\"" + val + "\""); }
            }
        }

        var formatted = "<" + tagName + (pairs.length > 0 ? " " : "");
        var content = element.innerHTML;

        if (content.length > 20) {
            content = content.substr(0, 20) + "[...]";
        }

        var res = formatted + pairs.join(" ") + ">" + content +
                "</" + tagName + ">";

        return res.replace(/ contentEditable="inherit"/, "");
    };

    function Formatio(options) {
        for (var opt in options) {
            this[opt] = options[opt];
        }
    }

    Formatio.prototype = {
        functionName: functionName,

        configure: function (options) {
            return new Formatio(options);
        },

        constructorName: function (object) {
            return constructorName(this, object);
        },

        ascii: function (object, processed, indent) {
            return ascii(this, object, processed, indent);
        }
    };

    return Formatio.prototype;
});

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"samsam":20}],20:[function(require,module,exports){
((typeof define === "function" && define.amd && function (m) { define("samsam", m); }) ||
 (typeof module === "object" &&
      function (m) { module.exports = m(); }) || // Node
 function (m) { this.samsam = m(); } // Browser globals
)(function () {
    var o = Object.prototype;
    var div = typeof document !== "undefined" && document.createElement("div");

    function isNaN(value) {
        // Unlike global isNaN, this avoids type coercion
        // typeof check avoids IE host object issues, hat tip to
        // lodash
        var val = value; // JsLint thinks value !== value is "weird"
        return typeof value === "number" && value !== val;
    }

    function getClass(value) {
        // Returns the internal [[Class]] by calling Object.prototype.toString
        // with the provided value as this. Return value is a string, naming the
        // internal class, e.g. "Array"
        return o.toString.call(value).split(/[ \]]/)[1];
    }

    /**
     * @name samsam.isArguments
     * @param Object object
     *
     * Returns ``true`` if ``object`` is an ``arguments`` object,
     * ``false`` otherwise.
     */
    function isArguments(object) {
        if (getClass(object) === 'Arguments') { return true; }
        if (typeof object !== "object" || typeof object.length !== "number" ||
                getClass(object) === "Array") {
            return false;
        }
        if (typeof object.callee == "function") { return true; }
        try {
            object[object.length] = 6;
            delete object[object.length];
        } catch (e) {
            return true;
        }
        return false;
    }

    /**
     * @name samsam.isElement
     * @param Object object
     *
     * Returns ``true`` if ``object`` is a DOM element node. Unlike
     * Underscore.js/lodash, this function will return ``false`` if ``object``
     * is an *element-like* object, i.e. a regular object with a ``nodeType``
     * property that holds the value ``1``.
     */
    function isElement(object) {
        if (!object || object.nodeType !== 1 || !div) { return false; }
        try {
            object.appendChild(div);
            object.removeChild(div);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * @name samsam.keys
     * @param Object object
     *
     * Return an array of own property names.
     */
    function keys(object) {
        var ks = [], prop;
        for (prop in object) {
            if (o.hasOwnProperty.call(object, prop)) { ks.push(prop); }
        }
        return ks;
    }

    /**
     * @name samsam.isDate
     * @param Object value
     *
     * Returns true if the object is a ``Date``, or *date-like*. Duck typing
     * of date objects work by checking that the object has a ``getTime``
     * function whose return value equals the return value from the object's
     * ``valueOf``.
     */
    function isDate(value) {
        return typeof value.getTime == "function" &&
            value.getTime() == value.valueOf();
    }

    /**
     * @name samsam.isNegZero
     * @param Object value
     *
     * Returns ``true`` if ``value`` is ``-0``.
     */
    function isNegZero(value) {
        return value === 0 && 1 / value === -Infinity;
    }

    /**
     * @name samsam.equal
     * @param Object obj1
     * @param Object obj2
     *
     * Returns ``true`` if two objects are strictly equal. Compared to
     * ``===`` there are two exceptions:
     *
     *   - NaN is considered equal to NaN
     *   - -0 and +0 are not considered equal
     */
    function identical(obj1, obj2) {
        if (obj1 === obj2 || (isNaN(obj1) && isNaN(obj2))) {
            return obj1 !== 0 || isNegZero(obj1) === isNegZero(obj2);
        }
    }


    /**
     * @name samsam.deepEqual
     * @param Object obj1
     * @param Object obj2
     *
     * Deep equal comparison. Two values are "deep equal" if:
     *
     *   - They are equal, according to samsam.identical
     *   - They are both date objects representing the same time
     *   - They are both arrays containing elements that are all deepEqual
     *   - They are objects with the same set of properties, and each property
     *     in ``obj1`` is deepEqual to the corresponding property in ``obj2``
     *
     * Supports cyclic objects.
     */
    function deepEqualCyclic(obj1, obj2) {

        // used for cyclic comparison
        // contain already visited objects
        var objects1 = [],
            objects2 = [],
        // contain pathes (position in the object structure)
        // of the already visited objects
        // indexes same as in objects arrays
            paths1 = [],
            paths2 = [],
        // contains combinations of already compared objects
        // in the manner: { "$1['ref']$2['ref']": true }
            compared = {};

        /**
         * used to check, if the value of a property is an object
         * (cyclic logic is only needed for objects)
         * only needed for cyclic logic
         */
        function isObject(value) {

            if (typeof value === 'object' && value !== null &&
                    !(value instanceof Boolean) &&
                    !(value instanceof Date)    &&
                    !(value instanceof Number)  &&
                    !(value instanceof RegExp)  &&
                    !(value instanceof String)) {

                return true;
            }

            return false;
        }

        /**
         * returns the index of the given object in the
         * given objects array, -1 if not contained
         * only needed for cyclic logic
         */
        function getIndex(objects, obj) {

            var i;
            for (i = 0; i < objects.length; i++) {
                if (objects[i] === obj) {
                    return i;
                }
            }

            return -1;
        }

        // does the recursion for the deep equal check
        return (function deepEqual(obj1, obj2, path1, path2) {
            var type1 = typeof obj1;
            var type2 = typeof obj2;

            // == null also matches undefined
            if (obj1 === obj2 ||
                    isNaN(obj1) || isNaN(obj2) ||
                    obj1 == null || obj2 == null ||
                    type1 !== "object" || type2 !== "object") {

                return identical(obj1, obj2);
            }

            // Elements are only equal if identical(expected, actual)
            if (isElement(obj1) || isElement(obj2)) { return false; }

            var isDate1 = isDate(obj1), isDate2 = isDate(obj2);
            if (isDate1 || isDate2) {
                if (!isDate1 || !isDate2 || obj1.getTime() !== obj2.getTime()) {
                    return false;
                }
            }

            if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
                if (obj1.toString() !== obj2.toString()) { return false; }
            }

            var class1 = getClass(obj1);
            var class2 = getClass(obj2);
            var keys1 = keys(obj1);
            var keys2 = keys(obj2);

            if (isArguments(obj1) || isArguments(obj2)) {
                if (obj1.length !== obj2.length) { return false; }
            } else {
                if (type1 !== type2 || class1 !== class2 ||
                        keys1.length !== keys2.length) {
                    return false;
                }
            }

            var key, i, l,
                // following vars are used for the cyclic logic
                value1, value2,
                isObject1, isObject2,
                index1, index2,
                newPath1, newPath2;

            for (i = 0, l = keys1.length; i < l; i++) {
                key = keys1[i];
                if (!o.hasOwnProperty.call(obj2, key)) {
                    return false;
                }

                // Start of the cyclic logic

                value1 = obj1[key];
                value2 = obj2[key];

                isObject1 = isObject(value1);
                isObject2 = isObject(value2);

                // determine, if the objects were already visited
                // (it's faster to check for isObject first, than to
                // get -1 from getIndex for non objects)
                index1 = isObject1 ? getIndex(objects1, value1) : -1;
                index2 = isObject2 ? getIndex(objects2, value2) : -1;

                // determine the new pathes of the objects
                // - for non cyclic objects the current path will be extended
                //   by current property name
                // - for cyclic objects the stored path is taken
                newPath1 = index1 !== -1
                    ? paths1[index1]
                    : path1 + '[' + JSON.stringify(key) + ']';
                newPath2 = index2 !== -1
                    ? paths2[index2]
                    : path2 + '[' + JSON.stringify(key) + ']';

                // stop recursion if current objects are already compared
                if (compared[newPath1 + newPath2]) {
                    return true;
                }

                // remember the current objects and their pathes
                if (index1 === -1 && isObject1) {
                    objects1.push(value1);
                    paths1.push(newPath1);
                }
                if (index2 === -1 && isObject2) {
                    objects2.push(value2);
                    paths2.push(newPath2);
                }

                // remember that the current objects are already compared
                if (isObject1 && isObject2) {
                    compared[newPath1 + newPath2] = true;
                }

                // End of cyclic logic

                // neither value1 nor value2 is a cycle
                // continue with next level
                if (!deepEqual(value1, value2, newPath1, newPath2)) {
                    return false;
                }
            }

            return true;

        }(obj1, obj2, '$1', '$2'));
    }

    var match;

    function arrayContains(array, subset) {
        if (subset.length === 0) { return true; }
        var i, l, j, k;
        for (i = 0, l = array.length; i < l; ++i) {
            if (match(array[i], subset[0])) {
                for (j = 0, k = subset.length; j < k; ++j) {
                    if (!match(array[i + j], subset[j])) { return false; }
                }
                return true;
            }
        }
        return false;
    }

    /**
     * @name samsam.match
     * @param Object object
     * @param Object matcher
     *
     * Compare arbitrary value ``object`` with matcher.
     */
    match = function match(object, matcher) {
        if (matcher && typeof matcher.test === "function") {
            return matcher.test(object);
        }

        if (typeof matcher === "function") {
            return matcher(object) === true;
        }

        if (typeof matcher === "string") {
            matcher = matcher.toLowerCase();
            var notNull = typeof object === "string" || !!object;
            return notNull &&
                (String(object)).toLowerCase().indexOf(matcher) >= 0;
        }

        if (typeof matcher === "number") {
            return matcher === object;
        }

        if (typeof matcher === "boolean") {
            return matcher === object;
        }

        if (getClass(object) === "Array" && getClass(matcher) === "Array") {
            return arrayContains(object, matcher);
        }

        if (matcher && typeof matcher === "object") {
            var prop;
            for (prop in matcher) {
                var value = object[prop];
                if (typeof value === "undefined" &&
                        typeof object.getAttribute === "function") {
                    value = object.getAttribute(prop);
                }
                if (typeof value === "undefined" || !match(value, matcher[prop])) {
                    return false;
                }
            }
            return true;
        }

        throw new Error("Matcher was not a string, a number, a " +
                        "function, a boolean or an object");
    };

    return {
        isArguments: isArguments,
        isElement: isElement,
        isDate: isDate,
        isNegZero: isNegZero,
        identical: identical,
        deepEqual: deepEqualCyclic,
        match: match,
        keys: keys
    };
});

},{}],21:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');


describe("Bus", function(){



  it(".push()", function() {

    var bus = new Kefir.Bus();

    bus.push('no subscribers – will not be delivered');

    var result = helpers.getOutput(bus);

    bus.push(1);
    bus.push(2);
    bus.end();

    expect(result).toEqual({ended: true, xs: [1, 2]});

  });




  it(".error()", function() {

    var bus = new Kefir.Bus();

    var result = helpers.getOutputAndErrors(bus);

    bus.push(1);
    bus.push(Kefir.error('e1'));
    bus.error('e2');

    expect(result).toEqual({ended: false, xs: [1], errors: ['e1', 'e2']});

  });




  it(".plug()", function() {

    var mainBus = new Kefir.Bus();
    var source1 = new Kefir.Bus();
    var source2 = new Kefir.Bus();

    mainBus.plug(source1);

    source1.push('no subscribers – will not be delivered');

    var result = helpers.getOutput(mainBus);

    source2.push('not plugged – will not be delivered');
    source1.push(1);
    mainBus.plug(source2);

    source2.push(2);
    source1.push(3);
    source1.end();

    source2.push(4);
    mainBus.end();

    expect(result).toEqual({ended: true, xs: [1, 2, 3, 4]});

  });




  it(".unplug()", function() {

    var mainBus = new Kefir.Bus();
    var source = new Kefir.Bus();

    mainBus.plug(source);

    var result = helpers.getOutput(mainBus);

    source.push(1);
    mainBus.unplug(source);

    source.push(2);
    source.end();
    mainBus.end();

    expect(result).toEqual({ended: true, xs: [1]});

  });




});

},{"../../dist/kefir.js":1,"../test-helpers":52}],22:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".combine()", function(){

  it("2 streams", function(){

    var stream1 = new Kefir.Stream();
    var stream2 = new Kefir.Stream();

    // --1--3
    // ---6---5
    // ---7-9-8

    var combined = stream1.combine([stream2], function(s1, s2){
      return s1 + s2;
    })

    var result = helpers.getOutput(combined);

    stream1.__sendValue(1)
    stream2.__sendValue(6)
    stream1.__sendValue(3)
    stream1.__sendEnd()
    stream2.__sendValue(5)
    stream2.__sendEnd()

    expect(result).toEqual({
      ended: true,
      xs: [7, 9, 8]
    });

  });


  it("stream and property", function(){

    var stream1 = new Kefir.Stream();
    var stream2 = new Kefir.Stream();
    var prop2 = stream2.toProperty(0);

    // --1--3
    // 0--6---5
    // --17-9-8

    var combined = stream1.combine([prop2], function(s1, s2){
      return s1 + s2;
    })

    var result = helpers.getOutput(combined);

    stream1.__sendValue(1)
    stream2.__sendValue(6)
    stream1.__sendValue(3)
    stream1.__sendEnd()
    stream2.__sendValue(5)
    stream2.__sendEnd()

    expect(result).toEqual({
      ended: true,
      xs: [1, 7, 9, 8]
    });

  });



  it("4 streams", function(){

    var stream1 = new Kefir.Stream(); // --1---3
    var stream2 = new Kefir.Stream(); // ----2-------5
    var stream3 = new Kefir.Stream(); // 2-------1
    var stream4 = new Kefir.Stream(); // -4--------2
                                      // ----2-6-1-3-6

    var combined = stream1.combine([stream2, stream3, stream4], function(s1, s2, s3, s4){
      return (s1 + s2) * s3 - s4;
    })

    var result = helpers.getOutput(combined);

    stream3.__sendValue(2)
    stream4.__sendValue(4)
    stream1.__sendValue(1)
    stream2.__sendValue(2)
    stream1.__sendValue(3)
    stream1.__sendEnd()
    stream3.__sendValue(1)
    stream3.__sendEnd()
    stream4.__sendValue(2)
    stream4.__sendEnd()
    stream2.__sendValue(5)
    stream2.__sendEnd()

    expect(result).toEqual({
      ended: true,
      xs: [2, 6, 1, 3, 6]
    });

  });


  it("3 streams w/o fn", function(){

    var stream1 = new Kefir.Stream(); // --1---3
    var stream2 = new Kefir.Stream(); // ----2-------5
    var stream3 = new Kefir.Stream(); // 2-------1

    var combined = stream1.combine([stream2, stream3])

    var result = helpers.getOutput(combined);

    stream3.__sendValue(2)
    stream1.__sendValue(1)
    stream2.__sendValue(2)
    stream1.__sendValue(3)
    stream1.__sendEnd()
    stream3.__sendValue(1)
    stream3.__sendEnd()
    stream2.__sendValue(5)
    stream2.__sendEnd()

    expect(result).toEqual({
      ended: true,
      xs: [
        [1, 2, 2],
        [3, 2, 2],
        [3, 2, 1],
        [3, 5, 1]
      ]
    });

  });



  it("firstIn/lastOut", function(){

    var stream1 = new Kefir.Stream();
    var stream2 = new Kefir.Stream();
    var combined = stream1.combine([stream2], function(a, b) { return a + b });

    var result1 = helpers.getOutput(combined.take(2));

    stream1.__sendValue(1)
    stream2.__sendValue(2) // 1 + 2 = 3
    expect(stream1.__hasSubscribers('value')).toBe(true);
    expect(stream2.__hasSubscribers('value')).toBe(true);
    stream1.__sendValue(3) // 3 + 2 = 5
    expect(stream1.__hasSubscribers('value')).toBe(false);
    expect(stream2.__hasSubscribers('value')).toBe(false);
    stream2.__sendValue(4) // skipped

    var result2 = helpers.getOutput(combined);

    stream1.__sendValue(5) // 5 + 2 = 7
    stream2.__sendValue(6) // 5 + 6 = 11
    stream1.__sendEnd()
    stream2.__sendEnd()

    expect(result1).toEqual({
      ended: true,
      xs: [3, 5]
    });

    expect(result2).toEqual({
      ended: true,
      xs: [7, 11]
    });

  });





  it("errors", function(){
    var stream1 = new Kefir.Stream();
    var stream2 = new Kefir.Stream();
    var combined = stream1.combine([stream2], function(a, b) { return a + b });

    var result = helpers.getOutputAndErrors(combined);

    stream1.__sendError('e1');
    stream2.__sendError('e2');
    stream1.__sendError('e3');
    stream2.__sendError('e4');

    expect(result).toEqual({ended: false, xs: [], errors: ['e1', 'e2', 'e3', 'e4']});
  })



});

},{"../../dist/kefir.js":1,"../test-helpers":52}],23:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');
var sinon = require('sinon');



describe(".delay()", function(){


  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  it("stream.delay()", function(){

    var stream = new Kefir.Stream();
    var delayed = stream.delay(100);

    expect(delayed).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(delayed);

    expect(result.xs).toEqual([]);

    stream.__sendValue(1);
    expect(result.xs).toEqual([]);

    clock.tick(50);
    expect(result.xs).toEqual([]);

    clock.tick(51);
    expect(result.xs).toEqual([1]);

    stream.__sendValue(2);
    clock.tick(20);
    stream.__sendValue(3);

    expect(result.xs).toEqual([1]);

    clock.tick(81);
    expect(result.xs).toEqual([1, 2]);

    clock.tick(20);
    expect(result.xs).toEqual([1, 2, 3]);

    stream.__sendEnd();
    expect(result.ended).toBe(false);

    clock.tick(101);
    expect(result.ended).toBe(true);

  });




  it("property.delay()", function(){

    var property = new Kefir.Property(null, null, 0);
    var delayed = property.delay(100);

    expect(delayed).toEqual(jasmine.any(Kefir.Property));
    expect(delayed.hasValue()).toBe(true);
    expect(delayed.getValue()).toBe(0);

    var result = helpers.getOutput(delayed);

    expect(result.xs).toEqual([0]);

    property.__sendValue(1);
    expect(result.xs).toEqual([0]);

    clock.tick(50);
    expect(result.xs).toEqual([0]);

    clock.tick(51);
    expect(result.xs).toEqual([0, 1]);

    property.__sendValue(2);
    clock.tick(20);
    property.__sendValue(3);

    expect(result.xs).toEqual([0, 1]);

    clock.tick(81);
    expect(result.xs).toEqual([0, 1, 2]);

    clock.tick(20);
    expect(result.xs).toEqual([0, 1, 2, 3]);

    property.__sendEnd();
    expect(result.ended).toBe(false);

    clock.tick(101);
    expect(result.ended).toBe(true);

  });




  it("errors not delayed", function(){

    var stream = new Kefir.Stream();
    var delayed = stream.delay(100);

    var result = helpers.getOutputAndErrors(delayed);

    stream.__sendError('e');

    expect(result.errors).toEqual(['e']);

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52,"sinon":6}],24:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".diff()", function(){

  function subtract(prev, next){
    return next - prev;
  }

  it("stream.diff()", function(){

    var stream = new Kefir.Stream();
    var diffs = stream.diff(0, subtract);

    expect(diffs).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(diffs);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(4);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [1, 1, 2]
    });

  });

  it("property.diff()", function(){

    var prop = new Kefir.Property(null, null, 6);
    var diffs = prop.diff(5, subtract);

    expect(diffs).toEqual(jasmine.any(Kefir.Property));
    expect(diffs.hasValue()).toBe(true);
    expect(diffs.getValue()).toBe(1);

    var result = helpers.getOutput(diffs);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(4);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [1, -5, 1, 2]
    });

  });


  it("property.diff() w/o initial", function(){

    var prop = new Kefir.Property(null, null);
    var diffs = prop.diff(5, subtract);

    expect(diffs).toEqual(jasmine.any(Kefir.Property));
    expect(diffs.hasValue()).toBe(false);
    expect(diffs.getValue()).toBe(Kefir.NOTHING);

    var result = helpers.getOutput(diffs);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(4);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [-4, 1, 2]
    });

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52}],25:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".filter()", function(){

  function isEven(x){
    return x % 2 === 0;
  }

  it("stream.filter()", function(){

    var stream = new Kefir.Stream();
    var filtered = stream.filter(isEven);

    var result = helpers.getOutput(filtered);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendValue(4);
    stream.__sendValue(5);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [2, 4]
    });

  });



  it("property.filter()", function(){

    var prop = new Kefir.Property(null, null, 6);
    var filtered = prop.filter(isEven);

    expect(filtered).toEqual(jasmine.any(Kefir.Property));
    expect(filtered.hasValue()).toBe(true);
    expect(filtered.getValue()).toBe(6);

    var result = helpers.getOutput(filtered);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendValue(4);
    prop.__sendValue(5);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [6, 2, 4]
    });

  });


  it("property.filter() with wrong initial", function(){

    var prop = new Kefir.Property(null, null, 5);
    var filtered = prop.filter(isEven);

    expect(filtered).toEqual(jasmine.any(Kefir.Property));
    expect(filtered.hasValue()).toBe(false);
    expect(filtered.getValue()).toBe(Kefir.NOTHING);

    var result = helpers.getOutput(filtered);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendValue(4);
    prop.__sendValue(5);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [2, 4]
    });

  });

});

},{"../../dist/kefir.js":1,"../test-helpers":52}],26:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".flatMapLatest()", function(){

  it("filter with once() and never()", function(){

    var stream = new Kefir.Stream();
    var mapped = stream.flatMapLatest(function(x){
      if (x % 2 === 0) {
        return Kefir.once(x);
      } else {
        return Kefir.never();
      }
    });

    var result = helpers.getOutput(mapped);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendValue(4);
    stream.__sendValue(5);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [2, 4]
    });

  });




  it("property.flatMapLatest()", function(){

    var prop = new Kefir.Property(null, null, 1);
    var mapped = prop.flatMapLatest(function(x){
      return Kefir.once(x * 2);
    });

    expect(mapped).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(mapped);

    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [2, 4, 6]
    });

  });



  it("multiple values from children", function(){

    var childStreams = [
      new Kefir.Stream(),
      new Kefir.Stream(),
      new Kefir.Stream()
    ]

    var stream = new Kefir.Stream();
    var mapped = stream.flatMapLatest(function(x){
      return childStreams[x];
    });

    var result = helpers.getOutput(mapped);

    stream.__sendValue(2);
    childStreams[0].__sendValue("not delivered");
    childStreams[2].__sendValue(1);
    stream.__sendValue(0);
    childStreams[2].__sendValue("not delivered");
    childStreams[0].__sendValue(2);
    stream.__sendValue(1);
    childStreams[1].__sendValue(3);
    stream.__sendValue(1);
    childStreams[1].__sendValue(4);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: false,
      xs: [1, 2, 3, 4]
    });

    childStreams[0].__sendEnd()
    childStreams[1].__sendEnd()
    childStreams[2].__sendEnd()

    expect(result).toEqual({
      ended: true,
      xs: [1, 2, 3, 4]
    });


  });





  it("errors", function(){
    var stream = new Kefir.Stream();

    var childStreams = [
      new Kefir.Stream(),
      new Kefir.Stream(),
      new Kefir.Stream()
    ]

    var mapped = stream.flatMapLatest(function(x){
      return childStreams[x];
    });

    var result = helpers.getOutputAndErrors(mapped);

    stream.__sendValue(2);
    childStreams[0].__sendError('e0 - not delivered');
    childStreams[2].__sendError('e1');
    stream.__sendValue(0);
    childStreams[2].__sendError('e2 - not delivered');
    childStreams[0].__sendError('e2');
    stream.__sendError('e3');

    expect(result).toEqual({ended: false, xs: [], errors: ['e1', 'e2', 'e3']});
  })


});

},{"../../dist/kefir.js":1,"../test-helpers":52}],27:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".flatMap()", function(){

  it("filter with once() and never()", function(){

    var stream = new Kefir.Stream();
    var mapped = stream.flatMap(function(x){
      if (x % 2 === 0) {
        return Kefir.once(x);
      } else {
        return Kefir.never();
      }
    });

    var result = helpers.getOutput(mapped);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendValue(4);
    stream.__sendValue(5);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [2, 4]
    });

  });




  it("property.flatMap()", function(){

    var prop = new Kefir.Property(null, null, 1);
    var mapped = prop.flatMap(function(x){
      return Kefir.once(x * 2);
    });

    expect(mapped).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(mapped);

    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [2, 4, 6]
    });

  });



  it("multiple values from children", function(){

    var childStreams = [
      new Kefir.Stream(),
      new Kefir.Stream(),
      new Kefir.Stream()
    ]

    var stream = new Kefir.Stream();
    var mapped = stream.flatMap(function(x){
      return childStreams[x];
    });

    var result = helpers.getOutput(mapped);

    stream.__sendValue(2);
    childStreams[0].__sendValue("not delivered");
    childStreams[2].__sendValue(1);
    stream.__sendValue(0);
    childStreams[0].__sendValue(2);
    stream.__sendValue(1);
    childStreams[1].__sendValue(3);
    stream.__sendValue(1);
    childStreams[1].__sendValue(4);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: false,
      xs: [1, 2, 3, 4, 4]
    });

    childStreams[0].__sendEnd()
    childStreams[1].__sendEnd()
    childStreams[2].__sendEnd()

    expect(result).toEqual({
      ended: true,
      xs: [1, 2, 3, 4, 4]
    });


  });





  it("errors", function(){
    var stream = new Kefir.Stream();

    var childStreams = [
      new Kefir.Stream(),
      new Kefir.Stream(),
      new Kefir.Stream()
    ]

    var mapped = stream.flatMap(function(x){
      return childStreams[x];
    });

    var result = helpers.getOutputAndErrors(mapped);

    stream.__sendValue(2);
    childStreams[0].__sendError('e0 - not delivered');
    childStreams[2].__sendError('e1');
    stream.__sendValue(0);
    childStreams[0].__sendError('e2');
    stream.__sendError('e3');

    expect(result).toEqual({ended: false, xs: [], errors: ['e1', 'e2', 'e3']});
  })


});

},{"../../dist/kefir.js":1,"../test-helpers":52}],28:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');


describe("Kefir.fromBinder()", function(){



  it("subscribe/unsubscibe", function() {

    var log = [];
    var obs = Kefir.fromBinder(function(send){
      log.push('in');
      return function(){
        log.push('out');
      }
    });

    var subscriber1 = function(){}
    var subscriber2 = function(){}

    expect(log).toEqual([]);

    obs.onValue(subscriber1);
    expect(log).toEqual(['in']);

    obs.onValue(subscriber2);
    expect(log).toEqual(['in']);

    obs.offValue(subscriber1);
    expect(log).toEqual(['in']);

    obs.offValue(subscriber2);
    expect(log).toEqual(['in', 'out']);

    obs.onValue(subscriber1);
    expect(log).toEqual(['in', 'out', 'in']);

    obs.offValue(subscriber1);
    expect(log).toEqual(['in', 'out', 'in', 'out']);

  });



  it("send", function() {

    var __send;

    var obs = Kefir.fromBinder(function(send){
      __send = send;
      return function(){};
    });

    var result = helpers.getOutputAndErrors(obs);

    __send(1);
    __send(2);
    __send(Kefir.error('e1'));
    __send(Kefir.NOTHING);
    __send(Kefir.bunch(3, Kefir.NOTHING, Kefir.error('e2'), 4, Kefir.END));

    expect(result).toEqual({
      ended: true,
      xs: [1, 2, 3, 4],
      errors: ['e1', 'e2']
    });

  });




  it("with context and args", function() {

    var context = {
      send: null
    }

    var obs = Kefir.fromBinder(function(a, b, send){
      context.send = send;
      context.a = a;
      context.b = b;
    }, context, 'a', 'b');

    var result = helpers.getOutputAndErrors(obs);

    expect(context.send).toEqual(jasmine.any(Function))
    expect(context.a).toBe('a')
    expect(context.b).toBe('b')

    context.send(1);

    expect(result).toEqual({
      ended: false,
      xs: [1],
      errors: []
    });

  });






});

},{"../../dist/kefir.js":1,"../test-helpers":52}],29:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');
var sinon = require('sinon');



describe("Kefir.fromPoll()", function(){

  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  function pollArray(values, interval){
    return Kefir.fromPoll(interval, function(){
      if (values.length > 0) {
        return values.shift();
      } else {
        return Kefir.END;
      }
    });
  }

  it("ok", function(){

    var stream = pollArray([1, 2, 3], 30);

    var log = [];
    stream.onValue(function(x){
      log.push(x);
    });

    expect(log).toEqual([]);

    clock.tick(10);
    expect(log).toEqual([]);

    clock.tick(21);
    expect(log).toEqual([1]);

    clock.tick(30);
    expect(log).toEqual([1, 2]);

    clock.tick(30);
    expect(log).toEqual([1, 2, 3]);

    clock.tick(30);
    expect(stream.isEnded()).toBe(true);
    expect(log).toEqual([1, 2, 3]);

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52,"sinon":6}],30:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');
var sinon = require('sinon');



describe("Kefir.interval()", function(){

  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  it("ok", function(){

    var stream = Kefir.interval(30, 2);

    var result = helpers.getOutput(stream);

    expect(result.xs).toEqual([]);

    clock.tick(10);
    expect(result.xs).toEqual([]);

    clock.tick(21);
    expect(result.xs).toEqual([2]);

    clock.tick(30);
    expect(result.xs).toEqual([2, 2]);

    clock.tick(15);
    expect(result.xs).toEqual([2, 2]);

    clock.tick(15);
    expect(result.xs).toEqual([2, 2, 2]);

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52,"sinon":6}],31:[function(require,module,exports){
// var Kefir = require('../../dist/kefir.js');
// var helpers = require('../test-helpers');


// if (typeof window !== 'undefined'){

//   describe("jQuery::eventStream()", function(){


//     it("jquery itself works", function(){

//       var count = 0;
//       function handler(){ count++ }

//       jQuery('body').on('click', handler);
//       jQuery('body').trigger('click');
//       jQuery('body').off('click', handler);

//       expect(count).toBe(1);

//     });



//     it("just event name", function(done){

//       var stream = jQuery('body').eventStream('click').take(2);

//       helpers.captureOutput(stream, function(values){
//         expect(values.length).toBe(2);
//         done();
//       });

//       jQuery('body').trigger('click');
//       jQuery('body').trigger('click');
//       jQuery('body').trigger('click');

//     });


//     it("event name and selector", function(done){

//       var stream = jQuery('body').eventStream('click', '.my-button').take(2);

//       helpers.captureOutput(stream, function(values){
//         expect(values.length).toBe(2);
//         done();
//       });

//       $btn = jQuery('<button class="my-button">my-button</button>').appendTo('body');

//       $btn.trigger('click');
//       $btn.trigger('click');
//       $btn.trigger('click');

//       $btn.remove()

//     });


//     it("event name, selector, and transformer", function(done){

//       var stream = jQuery('body')
//         .eventStream('click', '.my-button', function(event){
//           return this === event.currentTarget && jQuery(this).hasClass('my-button');
//         }).take(2);

//       helpers.captureOutput(stream, function(values){
//         expect(values).toEqual([true, true]);
//         done();
//       });

//       $btn = jQuery('<button class="my-button">my-button</button>').appendTo('body');

//       $btn.trigger('click');
//       $btn.trigger('click');
//       $btn.trigger('click');

//       $btn.remove()

//     });


//   });

// }

},{}],32:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');
var sinon = require('sinon');



describe("Kefir.later()", function(){

  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  it("ok", function(){

    var stream = Kefir.later(30, 2);

    var result = helpers.getOutput(stream);

    expect(result.xs).toEqual([]);

    clock.tick(10);
    expect(result.xs).toEqual([]);

    clock.tick(21);
    expect(result.xs).toEqual([2]);
    expect(result.ended).toEqual(true);

  });

  it("2 subscribers", function(){

    var stream = Kefir.later(30, 2);

    var result = helpers.getOutput(stream);
    var result2 = null;

    setTimeout(function(){
      result2 = helpers.getOutput(stream);
    }, 15);

    expect(result.xs).toEqual([]);
    expect(result2).toBe(null);

    clock.tick(16);
    expect(result.xs).toEqual([]);
    expect(result2.xs).toEqual([]);

    clock.tick(15);
    expect(result.xs).toEqual([2]);
    expect(result2.xs).toEqual([2]);
    expect(result.ended).toEqual(true);

  });

  it("no subscribers on delivering time", function(){

    var stream = Kefir.later(30, 2);

    var calls = 0;
    function fn(){
      calls++;
    }

    stream.onValue(fn);
    stream.offValue(fn);

    clock.tick(31);

    expect(calls).toBe(0);
    expect(stream.isEnded()).toBe(true);

  });

  it(".later(delay, Kefir.error('e'))", function(){

    var stream = Kefir.later(30, Kefir.error('e'));

    var result = helpers.getOutputAndErrors(stream);

    expect(result.xs).toEqual([]);
    expect(result.errors).toEqual([]);

    clock.tick(10);
    expect(result.xs).toEqual([]);
    expect(result.errors).toEqual([]);

    clock.tick(21);
    expect(result.xs).toEqual([]);
    expect(result.errors).toEqual(['e']);
    expect(result.ended).toEqual(true);

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52,"sinon":6}],33:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".map()", function(){

  function x2(a){
    return a * 2;
  }

  it("stream.map()", function(){

    var stream = new Kefir.Stream();
    var mapped = stream.map(x2);

    var result = helpers.getOutput(mapped);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [2, 4]
    });

  });


  it("property.map()", function(){

    var prop = new Kefir.Property(null, null, 5);
    var mapped = prop.map(x2);

    expect(mapped).toEqual(jasmine.any(Kefir.Property));
    expect(mapped.hasValue()).toBe(true);
    expect(mapped.getValue()).toBe(10);

    var result = helpers.getOutput(mapped);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [10, 2, 4]
    });

  });



  it("firstIn/lastOut", function(){

    var stream = new Kefir.Stream();
    var mapped = stream.map(x2)

    var result1 = helpers.getOutput(mapped.take(2));
    stream.__sendValue(1)
    expect(stream.__hasSubscribers('value')).toBe(true);
    stream.__sendValue(2)
    expect(stream.__hasSubscribers('value')).toBe(false);
    stream.__sendValue(3)

    var result2 = helpers.getOutput(mapped);

    stream.__sendValue(4)
    stream.__sendValue(5)
    stream.__sendEnd()

    expect(result1).toEqual({
      ended: true,
      xs: [2, 4]
    });

    expect(result2).toEqual({
      ended: true,
      xs: [8, 10]
    });

  });



  it(".map() and errors", function(){

    var stream = new Kefir.Stream();
    var mapped = stream.map(x2);

    var result = helpers.getOutputAndErrors(mapped);

    stream.__sendValue(1);
    stream.__sendError('e1');
    stream.__sendAny(Kefir.error('e2'));

    expect(result).toEqual({
      ended: false,
      xs: [2],
      errors: ['e1', 'e2']
    });

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52}],34:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".merge()", function(){

  it("3 streams", function(){

    var stream1 = new Kefir.Stream()              // 1
    var stream2 = new Kefir.Stream()              // -2-4
    var stream3 = new Kefir.Stream()              // --3-5
    var merged = stream1.merge(stream2, stream3); // 12345

    var result = helpers.getOutput(merged)

    stream1.__sendValue(1);
    stream1.__sendEnd();
    stream2.__sendValue(2);
    stream3.__sendValue(3);
    stream2.__sendValue(4);
    stream2.__sendEnd();
    stream3.__sendValue(5);
    stream3.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [1, 2, 3, 4, 5]
    });

  });


  it("3 properties end 1 stream", function(){

    var prop1 = new Kefir.Property(null, null, 6);    // 6-1
    var prop2 = new Kefir.Property(null, null, 7);    // 7--2--5
    var prop3 = new Kefir.Property();                 // ----3
    var stream1 = new Kefir.Stream();                 // -----4
    var merged = prop1.merge(prop2, prop3, stream1);  // 6712345

    var result = helpers.getOutput(merged);

    prop1.__sendValue(1);
    prop1.__sendEnd();
    prop2.__sendValue(2);
    prop3.__sendValue(3);
    prop3.__sendEnd();
    stream1.__sendValue(4);
    stream1.__sendEnd();
    prop2.__sendValue(5);
    prop2.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [6, 7, 1, 2, 3, 4, 5]
    });

  });



  it("errors", function(){
    var stream1 = new Kefir.Stream();
    var stream2 = new Kefir.Stream();
    var merged = stream1.merge(stream2);

    var result = helpers.getOutputAndErrors(merged);

    stream1.__sendError('e1');
    stream2.__sendError('e2');
    stream1.__sendError('e3');
    stream2.__sendError('e4');

    expect(result).toEqual({ended: false, xs: [], errors: ['e1', 'e2', 'e3', 'e4']});
  })


});

},{"../../dist/kefir.js":1,"../test-helpers":52}],35:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Kefir.never()", function(){

  it("ok", function(){

    var stream = Kefir.never();

    expect(stream.isEnded()).toBe(true);

    var valueCall = 0;
    var endCall = 0;

    stream.onValue(function(){
      valueCall++;
    });

    stream.onEnd(function(){
      endCall++;
    });

    expect(valueCall).toBe(0);
    expect(endCall).toBe(1);


  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52}],36:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Kefir.NO_MORE", function(){

  it("ok", function(){

    var stream = new Kefir.Stream();

    var values = []
    stream.onValue(function(x){
      values.push(x);
      if (x > 2) {
        return Kefir.NO_MORE;
      }
    });

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(3);

    expect(stream.__hasSubscribers('value')).toBe(false);

    stream.__sendValue(4);
    stream.__sendValue(5);

    expect(values).toEqual([1, 2, 3]);

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52}],37:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');


describe("Observable/Stream", function(){

  it("onFirstIn/onLastOut", function(){

    var log = [];
    var obs = new Kefir.Observable(
      function(){ log.push('in') },
      function(){ log.push('out') }
    )

    var subscriber1 = function(){}
    var subscriber2 = function(){}

    expect(log).toEqual([]);

    obs.onValue(subscriber1);
    expect(log).toEqual(['in']);

    obs.onValue(subscriber2);
    expect(log).toEqual(['in']);

    obs.offValue(subscriber1);
    expect(log).toEqual(['in']);

    obs.offValue(subscriber2);
    expect(log).toEqual(['in', 'out']);

    obs.onValue(subscriber1);
    expect(log).toEqual(['in', 'out', 'in']);

    obs.offValue(subscriber1);
    expect(log).toEqual(['in', 'out', 'in', 'out']);

  });



  it("onValue/offValue", function(){

    var log = [];
    var obs = new Kefir.Observable();

    var subscriber = function(x){  log.push(x)  }

    obs.__sendValue(1);
    expect(log).toEqual([]);

    obs.onValue(subscriber);
    expect(log).toEqual([]);

    obs.__sendValue(2);
    expect(log).toEqual([2]);

    obs.__sendValue(3);
    expect(log).toEqual([2, 3]);

    obs.offValue(subscriber);
    obs.__sendValue(4);
    expect(log).toEqual([2, 3]);

    obs.onValue(subscriber);
    expect(log).toEqual([2, 3]);

    obs.__sendValue(5);
    expect(log).toEqual([2, 3, 5]);


  });


  it("onEnd/offEnd, isEnded", function(){

    var callCount = 0;
    var obs = new Kefir.Observable();

    var subscriber1 = function(x){  callCount++;  }
    var subscriber2 = function(x){  callCount++;  }

    obs.onEnd(subscriber1);
    obs.onEnd(subscriber2);

    expect(callCount).toBe(0);
    expect(obs.isEnded()).toBe(false);

    obs.offEnd(subscriber2);

    obs.__sendEnd();
    expect(callCount).toBe(1);
    expect(obs.isEnded()).toBe(true);

    obs.onEnd(subscriber2);
    expect(callCount).toBe(2);

  });



  it("subscribers with context and args", function(){

    var log = [];
    var obs = new Kefir.Observable();

    var subscriber = function(){
      log.push( [this].concat([].slice.call(arguments)) );
    }

    obs.onValue(subscriber, "foo", 1, 2);
    obs.onValue(subscriber, "bar", 3, 4);
    obs.onEnd(subscriber, "end", 5, 6);

    obs.__sendValue(1);
    expect(log).toEqual([
      ["foo", 1, 2, 1],
      ["bar", 3, 4, 1]
    ]);

    obs.offValue(subscriber, "bar", 3, 4);

    obs.__sendValue(2);
    expect(log).toEqual([
      ["foo", 1, 2, 1],
      ["bar", 3, 4, 1],
      ["foo", 1, 2, 2]
    ]);

    obs.__sendEnd()
    expect(log).toEqual([
      ["foo", 1, 2, 1],
      ["bar", 3, 4, 1],
      ["foo", 1, 2, 2],
      ["end", 5, 6]
    ]);

  });


  it("subscribers with string as fn and context", function(){

    var log = [];
    var obs = new Kefir.Observable();

    var subscriber = function(){
      log.push( [this.name].concat([].slice.call(arguments)) );
    }

    var context = {
      foo: subscriber,
      name: "bar"
    };

    obs.onValue("foo", context, 1, 2);

    obs.__sendValue(1);
    obs.__sendValue(2);

    expect(log).toEqual([
      ["bar", 1, 2, 1],
      ["bar", 1, 2, 2]
    ]);

  });


  it("send after end", function(){

    var log = [];
    var obs = new Kefir.Observable();

    var subscriber = function(x){  log.push(x)  }

    obs.onValue(subscriber);
    expect(log).toEqual([]);

    obs.__sendEnd();
    obs.__sendValue(1);
    expect(log).toEqual([]);

  });


  it("errors", function(){

    var obs = new Kefir.Observable();

    var result = helpers.getOutputAndErrors(obs);

    obs.__sendValue(1);
    obs.__sendError('e1');
    obs.__sendAny(Kefir.error('e2'));

    expect(result).toEqual({
      ended: false,
      xs: [1],
      errors: ['e1', 'e2']
    });

  });



  it("__sendAny", function(){

    var obs = new Kefir.Observable();

    var result = helpers.getOutput(obs);

    obs.__sendValue(1);
    obs.__sendAny(2);
    obs.__sendAny(Kefir.NOTHING);
    obs.__sendAny(Kefir.bunch(3, Kefir.NOTHING, 4, Kefir.END));

    expect(result).toEqual({
      ended: true,
      xs: [1, 2, 3, 4]
    });

  });



});

},{"../../dist/kefir.js":1,"../test-helpers":52}],38:[function(require,module,exports){
var Kefir, helpers;

Kefir = require('../../dist/kefir.js');

helpers = require('../test-helpers');

describe("Kefir.onValues()", function() {
  it("ok", function() {
    var log, stream1, stream2, stream3;
    stream1 = new Kefir.Stream();
    stream2 = new Kefir.Stream();
    stream3 = new Kefir.Stream();
    log = [];
    Kefir.onValues([stream1, stream2, stream3], function() {
      return log.push([].slice.call(arguments));
    });
    stream3.__sendValue(2);
    stream1.__sendValue(1);
    stream2.__sendValue(2);
    stream1.__sendValue(3);
    stream1.__sendEnd();
    stream3.__sendValue(1);
    stream3.__sendEnd();
    stream2.__sendValue(5);
    stream2.__sendEnd();
    return expect(log).toEqual([[1, 2, 2], [3, 2, 2], [3, 2, 1], [3, 5, 1]]);
  });
  return it("with context and args", function() {
    var log, stream1, stream2, stream3;
    stream1 = new Kefir.Stream();
    stream2 = new Kefir.Stream();
    stream3 = new Kefir.Stream();
    log = [];
    Kefir.onValues([stream1, stream2, stream3], function() {
      return log.push([this].concat([].slice.call(arguments)));
    }, "context", "arg1", "arg2");
    stream3.__sendValue(2);
    stream1.__sendValue(1);
    stream2.__sendValue(2);
    stream1.__sendValue(3);
    stream1.__sendEnd();
    stream3.__sendValue(1);
    stream3.__sendEnd();
    stream2.__sendValue(5);
    stream2.__sendEnd();
    return expect(log).toEqual([["context", "arg1", "arg2", 1, 2, 2], ["context", "arg1", "arg2", 3, 2, 2], ["context", "arg1", "arg2", 3, 2, 1], ["context", "arg1", "arg2", 3, 5, 1]]);
  });
});


},{"../../dist/kefir.js":1,"../test-helpers":52}],39:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Kefir.once()", function(){

  it("ok", function(){

    var stream = Kefir.once(1);

    var log = [];

    expect(stream.isEnded()).toBe(false);

    stream.onValue(function(x){
      log.push(x);
    });

    expect(log).toEqual([1]);
    expect(stream.isEnded()).toBe(true);

    log = [];

    stream.onValue(function(x){
      log.push(x);
    });

    expect(log).toEqual([]);


  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52}],40:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Property", function(){

  it("hasValue, getValue", function(){

    var prop = new Kefir.Property();

    expect(prop.hasValue()).toBe(false);
    expect(prop.getValue()).toBe(Kefir.NOTHING);

    prop.__sendValue(1)
    expect(prop.hasValue()).toBe(true);
    expect(prop.getValue()).toBe(1);

    prop = new Kefir.Property(null, null, 2);

    expect(prop.hasValue()).toBe(true);
    expect(prop.getValue()).toBe(2);

  });


  it("onValue", function(){

    var prop = new Kefir.Property(null, null, 'foo');

    var calls = 0;

    prop.onValue(function(x){
      expect(x).toBe('foo');
      calls++;
    })

    expect(calls).toBe(1);

  });


  it("onNewValue", function(){

    var log = [];
    var prop = new Kefir.Property(null, null, 'foo');

    prop.onNewValue(function(x){
      log.push(x);
    });

    prop.__sendValue(1);
    prop.__sendValue(2);

    expect(log).toEqual([1, 2]);

  });


  it("stream.toProperty()", function(){

    var stream = new Kefir.Stream();
    var prop = stream.toProperty();

    var log = [];
    prop.onValue(function(x){
      log.push(x);
    })

    expect(prop.hasValue()).toBe(false);
    expect(prop.getValue()).toBe(Kefir.NOTHING);
    expect(log).toEqual([]);

    stream.__sendValue(1);

    expect(prop.hasValue()).toBe(true);
    expect(prop.getValue()).toBe(1);
    expect(log).toEqual([1]);

    stream.__sendValue(2);

    expect(prop.hasValue()).toBe(true);
    expect(prop.getValue()).toBe(2);
    expect(log).toEqual([1, 2]);

    stream.__sendEnd();

    expect(prop.isEnded()).toBe(true);
    expect(prop.hasValue()).toBe(true);
    expect(prop.getValue()).toBe(2);


    // with initial

    var prop2 = stream.toProperty(5);

    expect(prop2.hasValue()).toBe(true);
    expect(prop2.getValue()).toBe(5);

  });



  it("property.toProperty()", function(){

    var prop = new Kefir.Property(null, null, 'foo');

    expect(prop.toProperty()).toBe(prop);


    // with initial

    var prop2 = prop.toProperty(5);

    expect(prop2.hasValue()).toBe(true);
    expect(prop2.getValue()).toBe(5);

  });


  it("stream.toProperty() and errors", function(){

    var stream = new Kefir.Stream();
    var prop = stream.toProperty();

    expect(stream.__hasSubscribers('error')).toBe(false);

    var result = helpers.getOutputAndErrors(prop);
    expect(stream.__hasSubscribers('error')).toBe(true);

    stream.__sendValue(1);
    stream.__sendError('e1');
    stream.__sendAny(Kefir.error('e2'));

    expect(result).toEqual({
      ended: false,
      xs: [1],
      errors: ['e1', 'e2']
    })

  });



  it("property.changes()", function(){

    var prop = new Kefir.Property(null, null, 'foo');
    var changesStream = prop.changes();

    expect(changesStream).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(changesStream);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [1, 2, 3]
    })

  });


  it("property.changes() and errors", function(){

    var prop = new Kefir.Property(null, null, 'foo');
    var changesStream = prop.changes();

    expect(changesStream).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutputAndErrors(changesStream);

    prop.__sendValue(1);
    prop.__sendError('e1');
    prop.__sendAny(Kefir.error('e2'));

    expect(result).toEqual({
      ended: false,
      xs: [1],
      errors: ['e1', 'e2']
    })

  });



});

},{"../../dist/kefir.js":1,"../test-helpers":52}],41:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".reduce()", function(){

  function sum(a, b){
    return a + b;
  }

  it("stream.reduce()", function(){

    var stream = new Kefir.Stream();
    var reduced = stream.reduce(0, sum);

    expect(reduced).toEqual(jasmine.any(Kefir.Property));
    expect(reduced.hasValue()).toBe(false);
    expect(reduced.getValue()).toBe(Kefir.NOTHING);

    var result = helpers.getOutput(reduced);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [6]
    });

  });

  it("property.reduce()", function(){

    var prop = new Kefir.Property(null, null, 6);
    var reduced = prop.reduce(5, sum);

    expect(reduced).toEqual(jasmine.any(Kefir.Property));
    expect(reduced.hasValue()).toBe(false);
    expect(reduced.getValue()).toBe(Kefir.NOTHING);

    var result = helpers.getOutput(reduced);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [17]
    });

  });


  it("property.reduce() w/o initial", function(){

    var prop = new Kefir.Property(null, null);
    var reduced = prop.reduce(5, sum);

    expect(reduced).toEqual(jasmine.any(Kefir.Property));
    expect(reduced.hasValue()).toBe(false);
    expect(reduced.getValue()).toBe(Kefir.NOTHING);

    var result = helpers.getOutput(reduced);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [11]
    });

  });



  it(".reduce() and errors", function(){

    var stream = new Kefir.Stream();
    var reduced = stream.reduce(0, sum);

    var result = helpers.getOutputAndErrors(reduced);

    stream.__sendValue(1);
    stream.__sendError('e1');
    stream.__sendAny(Kefir.error('e2'));

    expect(result).toEqual({
      ended: false,
      xs: [],
      errors: ['e1', 'e2']
    });

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52}],42:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');
var sinon = require('sinon');



describe("Kefir.repeatedly()", function(){

  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  it("ok", function(){

    var stream = Kefir.repeatedly(30, [2, 4]);

    var result = helpers.getOutput(stream);

    expect(result.xs).toEqual([]);

    clock.tick(10);
    expect(result.xs).toEqual([]);

    clock.tick(21);
    expect(result.xs).toEqual([2]);

    clock.tick(30);
    expect(result.xs).toEqual([2, 4]);

    clock.tick(15);
    expect(result.xs).toEqual([2, 4]);

    clock.tick(15);
    expect(result.xs).toEqual([2, 4, 2]);

    clock.tick(90);
    expect(result.xs).toEqual([2, 4, 2, 4, 2, 4]);

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52,"sinon":6}],43:[function(require,module,exports){
var Kefir, helpers;

Kefir = require('../../dist/kefir.js');

helpers = require('../test-helpers');

describe(".sampledBy()", function() {
  it("property.sampledBy(stream)", function() {
    var prop, result, sampled, stream;
    prop = new Kefir.Property();
    stream = new Kefir.Stream();
    sampled = prop.sampledBy(stream);
    expect(sampled).toEqual(jasmine.any(Kefir.Stream));
    result = helpers.getOutput(sampled);
    expect(result.xs).toEqual([]);
    stream.__sendValue(1);
    expect(result.xs).toEqual([]);
    prop.__sendValue(2);
    expect(result.xs).toEqual([]);
    stream.__sendValue(3);
    expect(result.xs).toEqual([2]);
    stream.__sendValue(4);
    expect(result.xs).toEqual([2, 2]);
    prop.__sendValue(5);
    expect(result.xs).toEqual([2, 2]);
    stream.__sendValue(6);
    expect(result.xs).toEqual([2, 2, 5]);
    stream.__sendEnd();
    return expect(result).toEqual({
      ended: true,
      xs: [2, 2, 5]
    });
  });
  it("property.sampledBy(stream, fn)", function() {
    var prop, result, sampled, stream;
    prop = new Kefir.Property();
    stream = new Kefir.Stream();
    sampled = prop.sampledBy(stream, function(a, b) {
      return a + b;
    });
    expect(sampled).toEqual(jasmine.any(Kefir.Stream));
    result = helpers.getOutput(sampled);
    expect(result.xs).toEqual([]);
    stream.__sendValue(1);
    expect(result.xs).toEqual([]);
    prop.__sendValue(2);
    expect(result.xs).toEqual([]);
    stream.__sendValue(3);
    expect(result.xs).toEqual([5]);
    stream.__sendValue(4);
    expect(result.xs).toEqual([5, 6]);
    prop.__sendValue(5);
    expect(result.xs).toEqual([5, 6]);
    stream.__sendValue(6);
    expect(result.xs).toEqual([5, 6, 11]);
    stream.__sendEnd();
    return expect(result).toEqual({
      ended: true,
      xs: [5, 6, 11]
    });
  });
  it("stream.sampledBy(property, fn)", function() {
    var prop, result, sampled, stream;
    prop = new Kefir.Property();
    stream = new Kefir.Stream();
    sampled = stream.sampledBy(prop, function(a, b) {
      return a + b;
    });
    expect(sampled).toEqual(jasmine.any(Kefir.Property));
    expect(sampled.hasValue()).toEqual(false);
    expect(sampled.getValue()).toEqual(Kefir.NOTHING);
    result = helpers.getOutput(sampled);
    expect(result.xs).toEqual([]);
    prop.__sendValue(1);
    expect(result.xs).toEqual([]);
    stream.__sendValue(2);
    expect(result.xs).toEqual([]);
    prop.__sendValue(3);
    expect(result.xs).toEqual([5]);
    prop.__sendValue(4);
    expect(result.xs).toEqual([5, 6]);
    stream.__sendValue(5);
    expect(result.xs).toEqual([5, 6]);
    prop.__sendValue(6);
    expect(result.xs).toEqual([5, 6, 11]);
    prop.__sendEnd();
    return expect(result).toEqual({
      ended: true,
      xs: [5, 6, 11]
    });
  });
  it("propert.sampledBy(property, fn) both has initial values", function() {
    var prop1, prop2, result, sampled;
    prop1 = new Kefir.Property(null, null, 1);
    prop2 = new Kefir.Property(null, null, 2);
    sampled = prop1.sampledBy(prop2, function(a, b) {
      return a + b;
    });
    expect(sampled).toEqual(jasmine.any(Kefir.Property));
    expect(sampled.hasValue()).toEqual(true);
    expect(sampled.getValue()).toEqual(3);
    result = helpers.getOutput(sampled);
    return expect(result.xs).toEqual([3]);
  });
  return it(".sampledBy() and errors", function() {
    var result, sampled, stream1, stream2;
    stream1 = new Kefir.Stream();
    stream2 = new Kefir.Stream();
    sampled = stream1.sampledBy(stream2);
    result = helpers.getOutputAndErrors(sampled);
    stream1.__sendError('e1-1');
    stream2.__sendError('e2-1');
    stream1.__sendError('e1-2');
    stream2.__sendError('e2-2');
    return expect(result).toEqual({
      ended: false,
      xs: [],
      errors: ['e1-1', 'e2-1', 'e1-2', 'e2-2']
    });
  });
});


},{"../../dist/kefir.js":1,"../test-helpers":52}],44:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".scan()", function(){

  function sum(a, b){
    return a + b;
  }

  it("stream.scan()", function(){

    var stream = new Kefir.Stream();
    var scanned = stream.scan(0, sum);

    expect(scanned).toEqual(jasmine.any(Kefir.Property));
    expect(scanned.hasValue()).toBe(true);
    expect(scanned.getValue()).toBe(0);

    var result = helpers.getOutput(scanned);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [0, 1, 3, 6]
    });

  });

  it("property.scan()", function(){

    var prop = new Kefir.Property(null, null, 6);
    var scanned = prop.scan(5, sum);

    expect(scanned).toEqual(jasmine.any(Kefir.Property));
    expect(scanned.hasValue()).toBe(true);
    expect(scanned.getValue()).toBe(11);

    var result = helpers.getOutput(scanned);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [11, 12, 14, 17]
    });

  });


  it("property.scan() w/o initial", function(){

    var prop = new Kefir.Property(null, null);
    var scanned = prop.scan(5, sum);

    expect(scanned).toEqual(jasmine.any(Kefir.Property));
    expect(scanned.hasValue()).toBe(true);
    expect(scanned.getValue()).toBe(5);

    var result = helpers.getOutput(scanned);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [5, 6, 8, 11]
    });

  });



  it(".scan() and errors", function(){

    var stream = new Kefir.Stream();
    var scanned = stream.scan(0, sum);

    var result = helpers.getOutputAndErrors(scanned);

    stream.__sendValue(1);
    stream.__sendError('e1');
    stream.__sendAny(Kefir.error('e2'));

    expect(result).toEqual({
      ended: false,
      xs: [0, 1],
      errors: ['e1', 'e2']
    });

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52}],45:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');
var sinon = require('sinon');




describe("Kefir.sequentially()", function(){

  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  it("ok", function(){

    var stream = Kefir.sequentially(30, [2, 4]);

    var result = helpers.getOutput(stream);

    expect(result.xs).toEqual([]);

    clock.tick(10);
    expect(result.xs).toEqual([]);

    clock.tick(21);
    expect(result.xs).toEqual([2]);

    clock.tick(30);
    expect(result.xs).toEqual([2, 4]);
    expect(result.ended).toEqual(true);

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52,"sinon":6}],46:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".skipDuplicates()", function(){

  it("stream.skipDuplicates()", function(){

    var stream = new Kefir.Stream();
    var mapped = stream.skipDuplicates();

    var result = helpers.getOutput(mapped);

    stream.__sendValue(null);
    stream.__sendValue(null);
    stream.__sendValue(undefined);
    stream.__sendValue(undefined);
    stream.__sendValue(false);
    stream.__sendValue(0);
    stream.__sendValue(1);
    stream.__sendValue(1);
    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [null, undefined, false, 0, 1, 2, 3]
    });

  });


  it("property.skipDuplicates()", function(){

    var prop = new Kefir.Property(null, null, 5);
    var mapped = prop.skipDuplicates();

    expect(mapped).toEqual(jasmine.any(Kefir.Property));
    expect(mapped.hasValue()).toBe(true);
    expect(mapped.getValue()).toBe(5);

    var result = helpers.getOutput(mapped);

    prop.__sendValue(null);
    prop.__sendValue(null);
    prop.__sendValue(undefined);
    prop.__sendValue(undefined);
    prop.__sendValue(false);
    prop.__sendValue(0);
    prop.__sendValue(1);
    prop.__sendValue(1);
    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [5, null, undefined, false, 0, 1, 2, 3]
    });

  });


  it("property.skipDuplicates() w/o initial", function(){

    var prop = new Kefir.Property();
    var mapped = prop.skipDuplicates();

    expect(mapped).toEqual(jasmine.any(Kefir.Property));
    expect(mapped.hasValue()).toBe(false);
    expect(mapped.getValue()).toBe(Kefir.NOTHING);

    var result = helpers.getOutput(mapped);

    prop.__sendValue(null);
    prop.__sendValue(null);
    prop.__sendValue(undefined);
    prop.__sendValue(undefined);
    prop.__sendValue(false);
    prop.__sendValue(0);
    prop.__sendValue(1);
    prop.__sendValue(1);
    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [null, undefined, false, 0, 1, 2, 3]
    });

  });


  it("stream.skipDuplicates(fn)", function(){

    var stream = new Kefir.Stream();
    var mapped = stream.skipDuplicates(function(a, b){ return a == b });

    var result = helpers.getOutput(mapped);

    stream.__sendValue(null);
    stream.__sendValue(null);
    stream.__sendValue(undefined);
    stream.__sendValue(undefined);
    stream.__sendValue(false);
    stream.__sendValue(0);
    stream.__sendValue(1);
    stream.__sendValue(1);
    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [null, false, 1, 2, 3]
    });

  });


  it("property.skipDuplicates(fn)", function(){

    var prop = new Kefir.Property(null, null, 5);
    var mapped = prop.skipDuplicates(function(a, b){ return a == b });

    expect(mapped).toEqual(jasmine.any(Kefir.Property));
    expect(mapped.hasValue()).toBe(true);
    expect(mapped.getValue()).toBe(5);

    var result = helpers.getOutput(mapped);

    prop.__sendValue(null);
    prop.__sendValue(null);
    prop.__sendValue(undefined);
    prop.__sendValue(undefined);
    prop.__sendValue(false);
    prop.__sendValue(0);
    prop.__sendValue(1);
    prop.__sendValue(1);
    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [5, null, false, 1, 2, 3]
    });

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52}],47:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".skipWhile(fn)", function(){

  function lessThan3(x){
    return x < 3;
  }

  it("stream.skipWhile(fn)", function(){

    var stream = new Kefir.Stream();
    var mapped = stream.skipWhile(lessThan3);

    var result = helpers.getOutput(mapped);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendValue(4);
    stream.__sendValue(1);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [3, 4, 1]
    });

  });


  it("property.skipWhile(fn) skip initial", function(){

    var prop = new Kefir.Property(null, null, 1);
    var mapped = prop.skipWhile(lessThan3);

    expect(mapped).toEqual(jasmine.any(Kefir.Property));
    expect(mapped.hasValue()).toBe(false);
    expect(mapped.getValue()).toBe(Kefir.NOTHING);

    var result = helpers.getOutput(mapped);

    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendValue(4);
    prop.__sendValue(1);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [3, 4, 1]
    });

  });


  it("property.skipWhile(fn) not skip initial", function(){

    var prop = new Kefir.Property(null, null, 5);
    var mapped = prop.skipWhile(lessThan3);

    expect(mapped).toEqual(jasmine.any(Kefir.Property));
    expect(mapped.hasValue()).toBe(true);
    expect(mapped.getValue()).toBe(5);

    var result = helpers.getOutput(mapped);

    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendValue(4);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [5, 2, 3, 4]
    });

  });






});

},{"../../dist/kefir.js":1,"../test-helpers":52}],48:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".skip()", function(){

  it("ok", function(){

    var stream = new Kefir.Stream();

    var skip2 = stream.skip(2);
    var skip10 = stream.skip(10);

    var result2 = helpers.getOutput(skip2);

    var result10 = helpers.getOutput(skip10);

    stream.__sendAny(Kefir.bunch(1, 2, 3, 4, Kefir.END));

    expect(result2).toEqual({
      ended: true,
      xs: [3, 4]
    })

    expect(result10).toEqual({
      ended: true,
      xs: []
    })

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52}],49:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".takeWhile()", function(){

  it("ok", function(){

    var stream = new Kefir.Stream();
    var whileNot3 = stream.takeWhile(function(x){
      return x !== 3;
    });

    var result = helpers.getOutput(whileNot3);

    stream.__sendAny(Kefir.bunch(1, 2, 3, 4, Kefir.END));

    expect(result).toEqual({
      ended: true,
      xs: [1, 2]
    })

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52}],50:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".take()", function(){

  it("ok", function(){

    var stream = new Kefir.Stream();

    var take2 = stream.take(2);
    var take10 = stream.take(10);

    var result2 = helpers.getOutput(take2);

    var result10 = helpers.getOutput(take10);

    stream.__sendAny(Kefir.bunch(1, 2, 3, 4, Kefir.END));

    expect(result2).toEqual({
      ended: true,
      xs: [1, 2]
    })

    expect(result10).toEqual({
      ended: true,
      xs: [1, 2, 3, 4]
    })

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52}],51:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');
var sinon = require('sinon');



describe(".throttle()", function(){

  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers(10000);
  });

  afterEach(function() {
    clock.restore();
  });


  it("stream.throttle(100)", function(){
    var stream = new Kefir.Stream();
    var throttled = stream.throttle(100);
    expect(throttled).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(throttled);
    expect(result.xs).toEqual([]);

    // leading
    stream.__sendValue(1);
    expect(result.xs).toEqual([1]);

    // skipped
    clock.tick(50);
    stream.__sendValue(0);
    expect(result.xs).toEqual([1]);

    // trailing
    clock.tick(25);
    stream.__sendValue(2);
    expect(result.xs).toEqual([1]);
    clock.tick(26);
    expect(result.xs).toEqual([1, 2]);

    // skipped as leading
    clock.tick(80);
    stream.__sendValue(3);
    expect(result.xs).toEqual([1, 2]);

    // but delivered as trailing
    clock.tick(21)
    expect(result.xs).toEqual([1, 2, 3]);

    // leading again
    clock.tick(101)
    stream.__sendValue(4);
    expect(result.xs).toEqual([1, 2, 3, 4]);

    // final state
    clock.tick(100000)
    expect(result.xs).toEqual([1, 2, 3, 4]);
  });



  it("stream.throttle(100, {leading: false})", function(){
    var stream = new Kefir.Stream();
    var throttled = stream.throttle(100, {leading: false});
    expect(throttled).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(throttled);
    expect(result.xs).toEqual([]);

    // leading (skipped)
    stream.__sendValue(1);
    expect(result.xs).toEqual([]);

    // skipped
    clock.tick(50);
    stream.__sendValue(0);
    expect(result.xs).toEqual([]);

    // trailing
    clock.tick(25);
    stream.__sendValue(2);
    expect(result.xs).toEqual([]);
    clock.tick(26);
    expect(result.xs).toEqual([2]);

    // skipped as leading
    clock.tick(80);
    stream.__sendValue(3);
    expect(result.xs).toEqual([2]);

    // but delivered as trailing (but only after `wait`ms)
    clock.tick(101)
    expect(result.xs).toEqual([2, 3]);

    // leading again (will be delivered as trailing)
    clock.tick(101)
    stream.__sendValue(4);
    expect(result.xs).toEqual([2, 3]);

    // final state
    clock.tick(100000)
    expect(result.xs).toEqual([2, 3, 4]);
  });




  it("stream.throttle(100, {trailing: false})", function(){
    var stream = new Kefir.Stream();
    var throttled = stream.throttle(100, {trailing: false});
    expect(throttled).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(throttled);
    expect(result.xs).toEqual([]);

    // leading
    stream.__sendValue(1);
    expect(result.xs).toEqual([1]);

    // skipped
    clock.tick(50);
    stream.__sendValue(0);
    expect(result.xs).toEqual([1]);

    // trailing (skipped too)
    clock.tick(25);
    stream.__sendValue(2);
    expect(result.xs).toEqual([1]);
    clock.tick(26);
    expect(result.xs).toEqual([1]);

    // leading (after more than `wait` ms after last delivered)
    clock.tick(80);
    stream.__sendValue(3);
    expect(result.xs).toEqual([1, 3]);

    // skipped
    clock.tick(50);
    stream.__sendValue(0);

    // leading (after more than `wait` ms after last skipped)
    clock.tick(101)
    stream.__sendValue(4);
    expect(result.xs).toEqual([1, 3, 4]);

    // final state
    clock.tick(100000)
    expect(result.xs).toEqual([1, 3, 4]);
  });



  it("stream.throttle(100, {trailing: false, leading: false})", function(){
    var stream = new Kefir.Stream();
    var throttled = stream.throttle(100, {trailing: false, leading: false});
    expect(throttled).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(throttled);
    expect(result.xs).toEqual([]);

    // leading (skipped)
    stream.__sendValue(0);
    expect(result.xs).toEqual([]);

    // less than `wait` ms after leading (skipped)
    clock.tick(50);
    stream.__sendValue(0);
    expect(result.xs).toEqual([]);

    // more than `wait` ms after leading (delivered)
    clock.tick(51);
    stream.__sendValue(1);
    expect(result.xs).toEqual([1]);

    // trailing (skipped)
    clock.tick(50);
    stream.__sendValue(0);

    // final state
    clock.tick(100000)
    expect(result.xs).toEqual([1]);
  });


  it("end w/ trailing", function(){

    var stream = new Kefir.Stream();
    var throttled = stream.throttle(100);
    expect(throttled).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(throttled);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendEnd();

    expect(result.xs).toEqual([1]);
    expect(result.ended).toBe(false);

    clock.tick(101);
    expect(result.ended).toBe(true);
    expect(result.xs).toEqual([1, 2]);

  });


  it("end w/o trailing", function(){

    var stream = new Kefir.Stream();
    var throttled = stream.throttle(100);
    expect(throttled).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(throttled);

    stream.__sendValue(1);
    stream.__sendEnd();

    expect(result.xs).toEqual([1]);
    expect(result.ended).toBe(true);

  });



  it("property.throttle(100) w/ initial", function(){
    var property = new Kefir.Property(null, null, 10);
    var throttled = property.throttle(100);
    expect(throttled).toEqual(jasmine.any(Kefir.Property));
    expect(throttled.hasValue()).toBe(true);
    expect(throttled.getValue()).toBe(10);

    var result = helpers.getOutput(throttled);
    expect(result.xs).toEqual([10]);

    // leading
    property.__sendValue(1);
    expect(result.xs).toEqual([10, 1]);

    // skipped
    clock.tick(50);
    property.__sendValue(0);
    expect(result.xs).toEqual([10, 1]);

    // trailing
    clock.tick(25);
    property.__sendValue(2);
    expect(result.xs).toEqual([10, 1]);
    clock.tick(26);
    expect(result.xs).toEqual([10, 1, 2]);

    // skipped as leading
    clock.tick(80);
    property.__sendValue(3);
    expect(result.xs).toEqual([10, 1, 2]);

    // but delivered as trailing
    clock.tick(21)
    expect(result.xs).toEqual([10, 1, 2, 3]);

    // leading again
    clock.tick(101)
    property.__sendValue(4);
    expect(result.xs).toEqual([10, 1, 2, 3, 4]);

    // final state
    clock.tick(100000)
    expect(result.xs).toEqual([10, 1, 2, 3, 4]);
    expect(throttled.getValue()).toBe(4);

  });


  it("property.throttle(100) w/o initial", function(){
    var property = new Kefir.Property();
    var throttled = property.throttle(100);
    expect(throttled).toEqual(jasmine.any(Kefir.Property));
    expect(throttled.hasValue()).toBe(false);
    expect(throttled.getValue()).toBe(Kefir.NOTHING);

    var result = helpers.getOutput(throttled);
    expect(result.xs).toEqual([]);

    // leading
    property.__sendValue(1);
    expect(result.xs).toEqual([1]);

    // skipped
    clock.tick(50);
    property.__sendValue(0);
    expect(result.xs).toEqual([1]);

    // trailing
    clock.tick(25);
    property.__sendValue(2);
    expect(result.xs).toEqual([1]);
    clock.tick(26);
    expect(result.xs).toEqual([1, 2]);

    // skipped as leading
    clock.tick(80);
    property.__sendValue(3);
    expect(result.xs).toEqual([1, 2]);

    // but delivered as trailing
    clock.tick(21)
    expect(result.xs).toEqual([1, 2, 3]);

    // leading again
    clock.tick(101)
    property.__sendValue(4);
    expect(result.xs).toEqual([1, 2, 3, 4]);

    // final state
    clock.tick(100000)
    expect(result.xs).toEqual([1, 2, 3, 4]);
    expect(throttled.getValue()).toBe(4);

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":52,"sinon":6}],52:[function(require,module,exports){
var Kefir = require('../dist/kefir.js');

exports.getOutput = function(stream) {
  var result = {
    xs: [],
    ended: false
  };
  stream.onValue(function(x){
    result.xs.push(x);
  });
  stream.onEnd(function(){
    result.ended = true;
  })
  return result;
}



exports.getOutputAndErrors = function(stream) {
  var result = {
    xs: [],
    errors: [],
    ended: false
  };
  stream.onValue(function(x){
    result.xs.push(x);
  });
  stream.onError(function(e){
    result.errors.push(e);
  });
  stream.onEnd(function(){
    result.ended = true;
  })
  return result;
}

},{"../dist/kefir.js":1}]},{},[21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,39,40,41,42,44,45,46,47,48,49,50,51,38,43])