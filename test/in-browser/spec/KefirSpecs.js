(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! kefir - 0.1.10
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

function restArgs(args, start, nullOnEmpty){
  if (args.length > start) {
    return Array.prototype.slice.call(args, start);
  }
  if (nullOnEmpty) {
    return null;
  } else {
    return [];
  }
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

function callFn(fnMeta, moreArgs){
  // fnMeta = [
  //   fn,
  //   context,
  //   arg1,
  //   arg2,
  //   ...
  // ]
  var fn, context, args;
  if (isFn(fnMeta)) {
    fn = fnMeta;
    context = null;
    args = null;
  } else {
    context = fnMeta[1];
    fn = getFn(fnMeta[0], context);
    args = restArgs(fnMeta, 2, true);
  }
  if (moreArgs){
    if (args) {
      args = args.concat(toArray(moreArgs));
    } else {
      args = moreArgs;
    }
  }
  return args ? fn.apply(context, args) : fn.call(context);
}

function normFnMeta(fnMeta) {
  if (isArray(fnMeta) || isArguments(fnMeta)) {
    if (fnMeta.length === 1) {
      return fnMeta[0];
    }
    if (fnMeta.length === 0) {
      return null;
    }
  }
  return fnMeta;
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



// Observable

var Observable = Kefir.Observable = function Observable(onFirstIn, onLastOut){

  // __onFirstIn, __onLastOut can also be added to prototype of child classes
  if (isFn(onFirstIn)) {
    this.__onFirstIn = onFirstIn;
  }
  if (isFn(onLastOut)) {
    this.__onLastOut = onLastOut;
  }

  this.__subscribers = [];

}

inherit(Observable, Object, {

  __ClassName: 'Observable',

  toString: function(){
    return '[' + this.__ClassName + (this.__objName ? (' | ' + this.__objName) : '') + ']';
  },

  __onFirstIn: noop,
  __onLastOut: noop,

  __on: function(type /*,callback [, context [, arg1, arg2 ...]]*/){
    if (!this.isEnded()) {
      var firstIn = (
        (type === 'value' || type === 'error') &&
        !(this.__hasSubscribers('value') || this.__hasSubscribers('error'))
      );
      this.__subscribers.push(arguments);
      if (firstIn) {
        this.__onFirstIn();
      }
    } else if (type === 'end') {
      callFn(restArgs(arguments, 1));
    }
  },
  __off: function(type /*,callback [, context [, arg1, arg2 ...]]*/){
    if (!this.isEnded()) {
      for (var i = 0; i < this.__subscribers.length; i++) {
        if (isEqualArrays(this.__subscribers[i], arguments)) {
          this.__subscribers[i] = null;
        }
      }
      if (
        (type === 'value' || type === 'error') &&
        !(this.__hasSubscribers('value') || this.__hasSubscribers('error'))
      ) {
        this.__onLastOut();
      }
    }
  },
  __send: function(type /*[, arg1, arg2, ...]*/) {
    if (!this.isEnded()) {
      for (var i = 0; i < this.__subscribers.length; i++) {
        var subscriber = this.__subscribers[i];
        if (subscriber && subscriber[0] === type) {
          var result = callFn(restArgs(subscriber, 1), restArgs(arguments, 1));
          if (result === NO_MORE) {
            this.__off.apply(this, subscriber)
          }
        }
      }
      if (type === 'end') {
        this.__clear();
      }
    }
  },
  __hasSubscribers: function(type) {
    if (this.isEnded()) {
      return false;
    }
    for (var i = 0; i < this.__subscribers.length; i++) {
      if (this.__subscribers[i] && this.__subscribers[i][0] === type) {
        return true;
      }
    }
    return false;
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
    if (x === END) {
      this.__sendEnd();
    } else if (x instanceof Kefir.BunchOfValues) {
      for (var i = 0; i < x.values.length; i++) {
        this.__sendAny(x.values[i]);
      }
    } else if (x instanceof Kefir.Error) {
      this.__sendError(x.error);
    } else if (x !== NOTHING) {
      this.__sendValue(x);
    }
    return this;
  },


  onValue: function(){
    this.__on.apply(this, ['value'].concat(toArray(arguments)));
    return this;
  },
  offValue: function(){
    this.__off.apply(this, ['value'].concat(toArray(arguments)));
    return this;
  },
  onError: function(){
    this.__on.apply(this, ['error'].concat(toArray(arguments)));
    return this;
  },
  offError: function(){
    this.__off.apply(this, ['error'].concat(toArray(arguments)));
    return this;
  },
  onEnd: function(){
    this.__on.apply(this, ['end'].concat(toArray(arguments)));
    return this;
  },
  offEnd: function(){
    this.__off.apply(this, ['end'].concat(toArray(arguments)));
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
    this.__on.apply(this, ['value'].concat(toArray(arguments)));
    return this;
  },
  onValue: function() {
    if ( this.hasValue() ) {
      callFn(arguments, [this.__cached])
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
      callFn(arguments, [this.__value]);
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
  this.__subscribeFnMeta = normFnMeta(subscribeFnMeta);
}

inherit(Kefir.FromBinderStream, Stream, {

  __ClassName: 'FromBinderStream',
  __onFirstIn: function(){
    var _this = this;
    this.__usubscriber = callFn(this.__subscribeFnMeta, [function(x){
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
    this.__subscribeFnMeta = null;
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
  this.__fnMeta = normFnMeta(fnMeta);
  this.__Constructor(source);
}

inherit(Kefir.ScanProperty, Property, WithSourceStreamMixin, {

  __ClassName: 'ScanProperty',

  __handle: function(x){
    this.__sendValue( callFn(this.__fnMeta, [this.getValue(), x]) );
  },
  __clear: function(){
    WithSourceStreamMixin.__clear.call(this);
    this.__fnMeta = null;
  }

})

Observable.prototype.scan = function(seed/*fn[, context[, arg1, arg2, ...]]*/) {
  return new Kefir.ScanProperty(this, seed, restArgs(arguments, 1));
}




// .reduce(seed, fn)

Kefir.ReducedProperty = function ReducedProperty(source, seed, fnMeta){
  Property.call(this);
  this.__fnMeta = normFnMeta(fnMeta);
  this.__result = seed;
  source.onEnd('__sendResult', this);
  this.__Constructor(source);
}

inherit(Kefir.ReducedProperty, Property, WithSourceStreamMixin, {

  __ClassName: 'ReducedProperty',

  __handle: function(x){
    this.__result = callFn(this.__fnMeta, [this.__result, x]);
  },
  __sendResult: function(){
    this.__sendValue(this.__result);
  },
  __clear: function(){
    WithSourceStreamMixin.__clear.call(this);
    this.__fnMeta = null;
    this.__result = null;
  }

});

Observable.prototype.reduce = function(seed/*fn[, context[, arg1, arg2, ...]]*/) {
  return new Kefir.ReducedProperty(this, seed, restArgs(arguments, 1));
}




// .map(fn)

var MapMixin = {
  __Constructor: function(source, mapFnMeta){
    if (this instanceof Property) {
      Property.call(this);
    } else {
      Stream.call(this);
    }
    this.__mapFnMeta = normFnMeta(mapFnMeta);
    WithSourceStreamMixin.__Constructor.call(this, source);
  },
  __handle: function(x){
    this.__sendAny(
      this.__mapFnMeta ? callFn(this.__mapFnMeta, [x]) : x
    );
  },
  __clear: function(){
    WithSourceStreamMixin.__clear.call(this);
    this.__mapFnMeta = null;
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

var diffMapFn = function(x){
  var result = callFn(this.fnMeta, [this.prev, x]);
  this.prev = x;
  return result;
}

Observable.prototype.diff = function(start/*fn[, context[, arg1, arg2, ...]]*/) {
  return this.map(diffMapFn, {
    prev: start,
    fnMeta: normFnMeta(restArgs(arguments, 1))
  });
}





// .filter(fn)

var filterMapFn = function(filterFnMeta, x){
  if (callFn(filterFnMeta, [x])) {
    return x;
  } else {
    return NOTHING;
  }
}

Observable.prototype.filter = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  return this.map(filterMapFn, null, normFnMeta(arguments));
}




// .takeWhile(fn)

var takeWhileMapFn = function(fnMeta, x) {
  if (callFn(fnMeta, [x])) {
    return x;
  } else {
    return END;
  }
}

Observable.prototype.takeWhile = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  return this.map(takeWhileMapFn, null, normFnMeta(arguments));
}




// .take(n)

var takeMapFn = function(x) {
  if (this.n <= 0) {
    return END;
  }
  if (this.n === 1) {
    return Kefir.bunch(x, END);
  }
  this.n--;
  return x;
}

Observable.prototype.take = function(n) {
  return this.map(takeMapFn, {n: n});
}




// .skip(n)

var skipMapFn = function(x) {
  if (this.n <= 0) {
    return x;
  } else {
    this.n--;
    return NOTHING;
  }
}

Observable.prototype.skip = function(n) {
  return this.map(skipMapFn, {n: n});
}





// .skipDuplicates([fn])

var skipDuplicatesMapFn = function(x){
  var result;
  if (this.prev !== NOTHING && (this.fn ? this.fn(this.prev, x) : this.prev === x)) {
    result = NOTHING;
  } else {
    result = x;
  }
  this.hasPrev = true;
  this.prev = x;
  return result;
}

Observable.prototype.skipDuplicates = function(fn) {
  return this.map(skipDuplicatesMapFn, {fn: fn, prev: NOTHING});
}





// .skipWhile(fn)

var skipWhileMapFn = function(x){
  if (this.skip && callFn(this.fnMeta, [x])) {
    return NOTHING;
  } else {
    this.skip = false;
    return x;
  }
}

Observable.prototype.skipWhile = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  return this.map(skipWhileMapFn, {skip: true, fnMeta: normFnMeta(arguments)});
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
    this.__fnMeta = normFnMeta(fnMeta);
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
      if (this.__fnMeta) {
        x = callFn(this.__fnMeta, [x, y]);
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
    return new Kefir.SampledByStream(this, observable, restArgs(arguments, 1));
  } else {
    return new Kefir.SampledByProperty(this, observable, restArgs(arguments, 1));
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
  __handlePlugged: function(i, value){
    this.__sendAny(value);
  },
  __plug: function(stream){
    if ( !this.isEnded() ) {
      this.__plugged.push(stream);
      var i = this.__plugged.length - 1;
      if (this.__hasSubscribers('value')) {
        stream.onValue('__handlePlugged', this, i);
        stream.onError('__sendError', this);
      }
      stream.onEnd('__unplugById', this, i);
    }
  },
  __unplugById: function(i){
    if ( !this.isEnded() ) {
      var stream = this.__plugged[i];
      if (stream) {
        this.__plugged[i] = null;
        stream.offValue('__handlePlugged', this, i);
        stream.offError('__sendError', this);
        stream.offEnd('__unplugById', this, i);
      }
    }
  },
  __unplug: function(stream){
    if ( !this.isEnded() ) {
      for (var i = 0; i < this.__plugged.length; i++) {
        if (this.__plugged[i] === stream) {
          this.__unplugById(i);
        }
      }
    }
  },
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
  this.__mapFnMeta = normFnMeta(mapFnMeta);
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
    this.__plug( callFn(this.__mapFnMeta, [x]) );
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
  __unplugById: function(i){
    PluggableMixin.__unplugById.call(this, i);
    if (!this.isEnded() && this.__hasNoPlugged() && this.__sourceStream.isEnded()) {
      this.__sendEnd();
    }
  },
  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__clearPluggable();
    this.__sourceStream = null;
    this.__mapFnMeta = null;
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
    for (var i = 0; i < this.__plugged.length; i++) {
      this.__unplugById(i);
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
  __unplugById: function(i){
    PluggableMixin.__unplugById.call(this, i);
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
  this.__initPluggable();
  for (var i = 0; i < sources.length; i++) {
    this.__plug(sources[i]);
  }
  this.__cachedValues = new Array(sources.length);
  this.__hasValue = new Array(sources.length);
  this.__mapFnMeta = normFnMeta(mapFnMeta);
}

inherit(Kefir.CombinedStream, Stream, PluggableMixin, {

  __ClassName: 'CombinedStream',

  __unplugById: function(i){
    PluggableMixin.__unplugById.call(this, i);
    if (this.__hasNoPlugged()) {
      this.__sendEnd();
    }
  },
  __handlePlugged: function(i, x) {
    this.__hasValue[i] = true;
    this.__cachedValues[i] = x;
    if (this.__allCached()) {
      if (this.__mapFnMeta) {
        this.__sendAny(callFn(this.__mapFnMeta, this.__cachedValues));
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
    this.__clearPluggable();
    this.__cachedValues = null;
    this.__hasValue = null;
    this.__mapFnMeta = null;
  }

});

Kefir.combine = function(sources/*, fn[, context[, arg1, arg2, ...]]*/) {
  return new Kefir.CombinedStream(sources, restArgs(arguments, 1));
}

Observable.prototype.combine = function(sources/*, fn[, context[, arg1, arg2, ...]]*/) {
  return new Kefir.CombinedStream([this].concat(sources), restArgs(arguments, 1));
}






// Kefir.onValues()

Kefir.onValues = function(streams/*, fn[, context[, arg1, agr2, ...]]*/){
  var fnMeta = normFnMeta(restArgs(arguments, 1))
  return Kefir.combine(streams).onValue(callFn, null, fnMeta);
}

// TODO
//
// observable.throttle(wait, leading, trailing)
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








// Kefir.fromPoll()

var FromPollStream = Kefir.FromPollStream = function FromPollStream(interval, sourceFnMeta){
  Stream.call(this);
  this.__interval = interval;
  this.__intervalId = null;
  var _this = this;
  sourceFnMeta = normFnMeta(sourceFnMeta);
  this.__bindedSend = function(){  _this.__sendAny(callFn(sourceFnMeta))  }
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
  return new FromPollStream(interval, restArgs(arguments, 1));
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],3:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],4:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".delay()", function(){


  beforeEach(function() {
    jasmine.Clock.useMock();
  });

  it("stream.delay()", function(){

    var stream = new Kefir.Stream();
    var delayed = stream.delay(100);

    expect(delayed).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(delayed);

    expect(result.xs).toEqual([]);

    stream.__sendValue(1);
    expect(result.xs).toEqual([]);

    jasmine.Clock.tick(50);
    expect(result.xs).toEqual([]);

    jasmine.Clock.tick(51);
    expect(result.xs).toEqual([1]);

    stream.__sendValue(2);
    jasmine.Clock.tick(20);
    stream.__sendValue(3);

    expect(result.xs).toEqual([1]);

    jasmine.Clock.tick(81);
    expect(result.xs).toEqual([1, 2]);

    jasmine.Clock.tick(20);
    expect(result.xs).toEqual([1, 2, 3]);

    stream.__sendEnd();
    expect(result.ended).toBe(false);

    jasmine.Clock.tick(101);
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

    jasmine.Clock.tick(50);
    expect(result.xs).toEqual([0]);

    jasmine.Clock.tick(51);
    expect(result.xs).toEqual([0, 1]);

    property.__sendValue(2);
    jasmine.Clock.tick(20);
    property.__sendValue(3);

    expect(result.xs).toEqual([0, 1]);

    jasmine.Clock.tick(81);
    expect(result.xs).toEqual([0, 1, 2]);

    jasmine.Clock.tick(20);
    expect(result.xs).toEqual([0, 1, 2, 3]);

    property.__sendEnd();
    expect(result.ended).toBe(false);

    jasmine.Clock.tick(101);
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],5:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],6:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],7:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],8:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],9:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],10:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Kefir.fromPoll()", function(){

  beforeEach(function() {
    jasmine.Clock.useMock();
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

    jasmine.Clock.tick(10);
    expect(log).toEqual([]);

    jasmine.Clock.tick(21);
    expect(log).toEqual([1]);

    jasmine.Clock.tick(30);
    expect(log).toEqual([1, 2]);

    jasmine.Clock.tick(30);
    expect(log).toEqual([1, 2, 3]);

    jasmine.Clock.tick(30);
    expect(stream.isEnded()).toBe(true);
    expect(log).toEqual([1, 2, 3]);

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":32}],11:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Kefir.interval()", function(){

  beforeEach(function() {
    jasmine.Clock.useMock();
  });

  it("ok", function(){

    var stream = Kefir.interval(30, 2);

    var result = helpers.getOutput(stream);

    expect(result.xs).toEqual([]);

    jasmine.Clock.tick(10);
    expect(result.xs).toEqual([]);

    jasmine.Clock.tick(21);
    expect(result.xs).toEqual([2]);

    jasmine.Clock.tick(30);
    expect(result.xs).toEqual([2, 2]);

    jasmine.Clock.tick(15);
    expect(result.xs).toEqual([2, 2]);

    jasmine.Clock.tick(15);
    expect(result.xs).toEqual([2, 2, 2]);

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":32}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Kefir.later()", function(){

  beforeEach(function() {
    jasmine.Clock.useMock();
  });

  it("ok", function(){

    var stream = Kefir.later(30, 2);

    var result = helpers.getOutput(stream);

    expect(result.xs).toEqual([]);

    jasmine.Clock.tick(10);
    expect(result.xs).toEqual([]);

    jasmine.Clock.tick(21);
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

    jasmine.Clock.tick(16);
    expect(result.xs).toEqual([]);
    expect(result2.xs).toEqual([]);

    jasmine.Clock.tick(15);
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

    jasmine.Clock.tick(31);

    expect(calls).toBe(0);
    expect(stream.isEnded()).toBe(true);

  });

  it(".later(delay, Kefir.error('e'))", function(){

    var stream = Kefir.later(30, Kefir.error('e'));

    var result = helpers.getOutputAndErrors(stream);

    expect(result.xs).toEqual([]);
    expect(result.errors).toEqual([]);

    jasmine.Clock.tick(10);
    expect(result.xs).toEqual([]);
    expect(result.errors).toEqual([]);

    jasmine.Clock.tick(21);
    expect(result.xs).toEqual([]);
    expect(result.errors).toEqual(['e']);
    expect(result.ended).toEqual(true);

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":32}],14:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],15:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],16:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],17:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],18:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],19:[function(require,module,exports){
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


},{"../../dist/kefir.js":1,"../test-helpers":32}],20:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],21:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],22:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],23:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Kefir.repeatedly()", function(){

  beforeEach(function() {
    jasmine.Clock.useMock();
  });

  it("ok", function(){

    var stream = Kefir.repeatedly(30, [2, 4]);

    var result = helpers.getOutput(stream);

    expect(result.xs).toEqual([]);

    jasmine.Clock.tick(10);
    expect(result.xs).toEqual([]);

    jasmine.Clock.tick(21);
    expect(result.xs).toEqual([2]);

    jasmine.Clock.tick(30);
    expect(result.xs).toEqual([2, 4]);

    jasmine.Clock.tick(15);
    expect(result.xs).toEqual([2, 4]);

    jasmine.Clock.tick(15);
    expect(result.xs).toEqual([2, 4, 2]);

    jasmine.Clock.tick(90);
    expect(result.xs).toEqual([2, 4, 2, 4, 2, 4]);

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":32}],24:[function(require,module,exports){
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


},{"../../dist/kefir.js":1,"../test-helpers":32}],25:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],26:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Kefir.sequentially()", function(){

  beforeEach(function() {
    jasmine.Clock.useMock();
  });

  it("ok", function(){

    var stream = Kefir.sequentially(30, [2, 4]);

    var result = helpers.getOutput(stream);

    expect(result.xs).toEqual([]);

    jasmine.Clock.tick(10);
    expect(result.xs).toEqual([]);

    jasmine.Clock.tick(21);
    expect(result.xs).toEqual([2]);

    jasmine.Clock.tick(30);
    expect(result.xs).toEqual([2, 4]);
    expect(result.ended).toEqual(true);

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":32}],27:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],28:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],29:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],30:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],31:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":32}],32:[function(require,module,exports){
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

},{"../dist/kefir.js":1}]},{},[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20,21,22,23,25,26,27,28,29,30,31,19,24])