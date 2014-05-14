(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! kefir - 0.1.6
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
  return Array.prototype.slice.call(arrayLike);
}

function createObj(proto) {
  var F = function(){};
  F.prototype = proto;
  return new F();
}

function extend() {
  var objects = toArray(arguments);
  if (objects.length === 1) {
    return objects[0];
  }
  var result = objects.shift();
  for (var i = 0; i < objects.length; i++) {
    for (var prop in objects[i]) {
      if(own(objects[i], prop)) {
        result[prop] = objects[i][prop];
      }
    }
  }
  return result;
}

function inherit(Child, Parent) { // (Child, Parent[, mixin1, mixin2, ...])
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

function removeFromArray(array, value) {
  for (var i = 0; i < array.length;) {
    if (array[i] === value) {
      array.splice(i, 1);
    } else {
      i++;
    }
  }
}

function killInArray(array, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === value) {
      delete array[i];
    }
  }
}

function isAllDead(array) {
  for (var i = 0; i < array.length; i++) {
    /*jshint eqnull:true */
    if (array[i] != null) {
      return false;
    }
  }
  return true;
}

function firstArrOrToArr(args) {
  if (Object.prototype.toString.call(args[0]) === '[object Array]') {
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

function callFn(args/*, moreArgs...*/){
  var fn = args[0];
  var context = args[1];
  var bindedArgs = restArgs(args, 2);
  var moreArgs = restArgs(arguments, 1);
  return fn.apply(context, bindedArgs.concat(moreArgs));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertStream(stream){
  assert(stream instanceof Stream, "not a Stream: " + stream)
}

function assertProperty(property){
  assert(property instanceof Property, "not a Property: " + property)
}

function isFn(fn) {
  return typeof fn === "function";
}

function withName(name, obj){
  obj.__objName = name;
  return obj;
}

function isEqualArrays(a, b){
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



// Class method names convention
//
// __foo: can be used only inside class or child class
// _foo: can be used only inside Kefir
// foo: public API


var Kefir = {};

var NOTHING = Kefir.NOTHING = ['<nothing>'];
var END = Kefir.END = ['<end>'];
var NO_MORE = Kefir.NO_MORE = ['<no more>'];


// BunchOfValues
//
// Example:
//   stream._send(Kefir.bunch(1, 2, Kefir.END))

Kefir.BunchOfValues = function(values){
  this.values = values;
}
Kefir.bunch = function() {
  return new Kefir.BunchOfValues(firstArrOrToArr(arguments));
}



// Callbacks

var Callbacks = Kefir.Callbacks = function Callbacks(){
  this.__subscribers = null;
}

inherit(Callbacks, Object, {

  add: function(/*callback [, context [, arg1, arg2 ...]]*/){
    if (!this.__subscribers) {
      this.__subscribers = [];
    }
    this.__subscribers.push(arguments);
  },
  remove: function(/*callback [, context [, arg1, arg2 ...]]*/){
    if (this.isEmpty()) {return}
    for (var i = 0; i < this.__subscribers.length; i++) {
      if (isEqualArrays(this.__subscribers[i], arguments)) {
        this.__subscribers[i] = null;
      }
    }
    if (isAllDead(this.__subscribers)){
      this.__subscribers = null;
    }
  },
  isEmpty: function(){
    return !this.__subscribers;
  },
  hasOne: function(){
    return !this.isEmpty() && this.__subscribers.length === 1;
  },
  send: function(x){
    if (this.isEmpty()) {return}
    for (var i = 0, l = this.__subscribers.length; i < l; i++) {
      if (this.__subscribers[i]) {
        if(NO_MORE === callFn(this.__subscribers[i], x)) {
          this.remove.apply(this, this.__subscribers[i]);
        }
      }
    }
  }

})





// Observable

var Observable = Kefir.Observable = function Observable(onFirstIn, onLastOut){

  // __onFirstIn, __onLastOut can also be added to prototype of child classes
  if (isFn(onFirstIn)) {
    this.__onFirstIn = onFirstIn;
  }
  if (isFn(onLastOut)) {
    this.__onLastOut = onLastOut;
  }

  this.__subscribers = new Callbacks;
  this.__endSubscribers = new Callbacks;

}

inherit(Observable, Object, {

  __ClassName: 'Observable',
  _send: function(x) {
    if (!this.isEnded()) {
      if (x === END) {
        this.__end();
      } else if (x instanceof Kefir.BunchOfValues) {
        for (var i = 0; i < x.values.length; i++) {
          this._send(x.values[i]);
        }
      } else if (x !== Kefir.NOTHING) {
        this.__deliver(x);
      }
    }
  },
  __deliver: function(x){
    if (!this.__subscribers.isEmpty()) {
      this.__subscribers.send(x);
      if (this.__subscribers.isEmpty()) {
        this.__onLastOut();
      }
    }
  },
  on: function(/*callback [, context [, arg1, arg2 ...]]*/) {
    if (!this.isEnded()) {
      this.__subscribers.add.apply(this.__subscribers, arguments);
      if (this.__subscribers.hasOne()) {
        this.__onFirstIn();
      }
    }
  },
  onChanges: function(){
    this.on.apply(this, arguments);
  },
  onValue: function(){
    this.on.apply(this, arguments);
  },
  off: function(/*callback [, context [, arg1, arg2 ...]]*/) {
    if (!this.isEnded()) {
      this.__subscribers.remove.apply(this.__subscribers, arguments);
      if (this.__subscribers.isEmpty()) {
        this.__onLastOut();
      }
    }
  },
  onEnd: function(/*callback [, context [, arg1, arg2 ...]]*/) {
    if (this.isEnded()) {
      callFn(arguments);
    } else {
      this.__endSubscribers.add.apply(this.__endSubscribers, arguments);
    }
  },
  offEnd: function(/*callback [, context [, arg1, arg2 ...]]*/) {
    if (!this.isEnded()){
      this.__endSubscribers.remove.apply(this.__endSubscribers, arguments);
    }
  },
  isEnded: function() {
    return !this.__subscribers;
  },
  hasSubscribers: function(){
    return !this.isEnded() && !this.__subscribers.isEmpty();
  },
  __onFirstIn: noop,
  __onLastOut: noop,
  __sendEnd: function(){
    this._send(END);
  },
  __end: function() {
    if (!this.isEnded()) {
      this.__onLastOut();
      this.__endSubscribers.send();
      if (own(this, '__onFirstIn')) {
        this.__onFirstIn = null;
      }
      if (own(this, '__onLastOut')) {
        this.__onLastOut = null;
      }
      this.__subscribers = null;
      this.__endSubscribers = null;
    }
  },
  toString: function(){
    return '[' + this.__ClassName + (this.__objName ? (' | ' + this.__objName) : '') + ']';
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
  this.__cached = (typeof initial !== "undefined") ? initial : Kefir.NOTHING;
}

inherit(Property, Observable, {

  __ClassName: 'Property',
  onChanges: function(){
    Observable.prototype.on.apply(this, arguments);
  },
  on: function(/*callback [, context [, arg1, arg2 ...]]*/) {
    if ( this.hasCached() ) {
      callFn(arguments, this.__cached);
    }
    this.onChanges.apply(this, arguments);
  },
  _send: function(x) {
    if (!this.isEnded()){
      this.__cached = x;
    }
    Observable.prototype._send.call(this, x);
  },
  toProperty: function(initial){
    assert(
      typeof initial === "undefined",
      "can't convert Property to Property with new initial value"
    )
    return this;
  },
  hasCached: function(){
    return this.__cached !== Kefir.NOTHING;
  },
  getCached: function(){
    return this.__cached;
  }

})



// Log

Observable.prototype.log = function(text) {
  function log(value){
    if (text) {
      console.log(text, value);
    } else {
      console.log(value);
    }
  }
  this.on(log);
  this.onEnd(function(){  log(END)  });
}

// TODO
//
// Kefir.constant(x)



// Never

var neverObj = new Stream();
neverObj._send(Kefir.END);
neverObj.__objName = 'Kefir.never()'
Kefir.never = function() {
  return neverObj;
}




// Once

Kefir.OnceStream = function OnceStream(value){
  Stream.call(this);
  this.__value = value;
}

inherit(Kefir.OnceStream, Stream, {

  __ClassName: 'OnceStream',
  __objName: 'Kefir.once(x)',
  __onFirstIn: function(){
    this._send(this.__value);
    this.__value = null;
    this._send(Kefir.END);
  }

})

Kefir.once = function(x) {
  return new Kefir.OnceStream(x);
}





// fromBinder

Kefir.FromBinderStream = function FromBinderStream(subscribe){
  Stream.call(this);
  this.__subscribe = subscribe;
}

inherit(Kefir.FromBinderStream, Stream, {

  __ClassName: 'FromBinderStream',
  __objName: 'Kefir.fromBinder(subscribe)',
  __onFirstIn: function(){
    var _this = this;
    this.__usubscriber = this.__subscribe(function(x){
      _this._send(x);
    });
  },
  __onLastOut: function(){
    if (isFn(this.__usubscriber)) {
      this.__usubscriber();
    }
    this.__usubscriber = null;
  },
  __end: function(){
    Stream.prototype.__end.call(this);
    this.__subscribe = null;
  }

})

Kefir.fromBinder = function(subscribe){
  return new Kefir.FromBinderStream(subscribe);
}

// TODO
//
// stream.skipWhile(f)
// observable.skip(n)
//
// observable.scan(seed, f)
// observable.diff(start, f)
//
// observable.skipDuplicates(isEqual)



var WithSourceStreamMixin = {
  __Constructor: function(source) {
    this.__source = source;
    source.onEnd(this.__sendEnd, this);
    if (source instanceof Property && this instanceof Property && source.hasCached()) {
      this.__handle(source.getCached());
    }
  },
  __handle: function(x){
    this._send(x);
  },
  __onFirstIn: function(){
    this.__source.onChanges(this.__handle, this);
  },
  __onLastOut: function(){
    this.__source.off(this.__handle, this);
  },
  __end: function(){
    this.__source = null;
  }
}





// Stream::toProperty()

Kefir.PropertyFromStream = function PropertyFromStream(source, initial){
  assertStream(source);
  Property.call(this, null, null, initial);
  this.__Constructor.call(this, source);
}

inherit(Kefir.PropertyFromStream, Property, WithSourceStreamMixin, {

  __ClassName: 'PropertyFromStream',
  __objName: 'stream.toProperty()',
  __end: function(){
    Property.prototype.__end.call(this);
    WithSourceStreamMixin.__end.call(this);
  }

})

Stream.prototype.toProperty = function(initial){
  return new Kefir.PropertyFromStream(this, initial);
}





// Property::changes()

Kefir.ChangesStream = function ChangesStream(source){
  assertProperty(source);
  Stream.call(this);
  this.__Constructor.call(this, source);
}

inherit(Kefir.ChangesStream, Stream, WithSourceStreamMixin, {

  __ClassName: 'ChangesStream',
  __objName: 'property.changes()',
  __end: function(){
    Stream.prototype.__end.call(this);
    WithSourceStreamMixin.__end.call(this);
  }

})

Property.prototype.changes = function() {
  return new Kefir.ChangesStream(this);
}






// Map

var MapMixin = {
  __Constructor: function(source, mapFn){
    if (source instanceof Property) {
      Property.call(this);
    } else {
      Stream.call(this);
    }
    this.__mapFn = mapFn;
    WithSourceStreamMixin.__Constructor.call(this, source);
  },
  __handle: function(x){
    this._send( this.__mapFn(x) );
  },
  __end: function(){
    Stream.prototype.__end.call(this);
    WithSourceStreamMixin.__end.call(this);
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

Observable.prototype.map = function(fn) {
  if (this instanceof Property) {
    return new Kefir.MappedProperty(this, fn);
  } else {
    return new Kefir.MappedStream(this, fn);
  }
}






// Filter

var filterMixin = {
  __handle: function(x){
    if (this.__mapFn(x)) {
      this._send(x);
    }
  }
}
inheritMixin(filterMixin, MapMixin);

Kefir.FilteredStream = function FilteredStream(){
  this.__Constructor.apply(this, arguments);
}

inherit(Kefir.FilteredStream, Stream, filterMixin, {
  __ClassName: 'FilteredStream'
})

Kefir.FilteredProperty = function FilteredProperty(){
  this.__Constructor.apply(this, arguments);
}

inherit(Kefir.FilteredProperty, Property, filterMixin, {
  __ClassName: 'FilteredProperty'
})

Observable.prototype.filter = function(fn) {
  if (this instanceof Property) {
    return new Kefir.FilteredProperty(this, fn);
  } else {
    return new Kefir.FilteredStream(this, fn);
  }
}





// TakeWhile

var TakeWhileMixin = {
  __handle: function(x){
    if (this.__mapFn(x)) {
      this._send(x);
    } else {
      this._send(Kefir.END);
    }
  }
}
inheritMixin(TakeWhileMixin, MapMixin);

Kefir.TakeWhileStream = function TakeWhileStream(){
  this.__Constructor.apply(this, arguments);
}

inherit(Kefir.TakeWhileStream, Stream, TakeWhileMixin, {
  __ClassName: 'TakeWhileStream'
})

Kefir.TakeWhileProperty = function TakeWhileProperty(){
  this.__Constructor.apply(this, arguments);
}

inherit(Kefir.TakeWhileProperty, Property, TakeWhileMixin, {
  __ClassName: 'TakeWhileStream'
})

Observable.prototype.takeWhile = function(fn) {
  if (this instanceof Property) {
    return new Kefir.TakeWhileProperty(this, fn);
  } else {
    return new Kefir.TakeWhileStream(this, fn);
  }
}




// Take

Observable.prototype.take = function(n) {
  return withName('observable.take(n)', this.takeWhile(function(){
    return n-- > 0;
  }))
};

// TODO
//
// observable.flatMapLatest(f)
// observable.flatMapFirst(f)
//
// observable.zip(other, f)
//
// observable.awaiting(otherObservable)
//
// stream.concat(otherStream)
//
// Kefir.onValues(a, b [, c...], f)




// var PluggableMixin = {

//   __Constructor: function(){
//     this.__plugged = [];
//   },
//   __handlePlugged: function(i, value){
//     this._send(value);
//   },
//   __end: function(){
//     this.__plugged = null;
//   }


// }





// Bus

Kefir.Bus = function Bus(){
  Stream.call(this);
  this.__plugged = [];
}

inherit(Kefir.Bus, Stream, {

  __ClassName: 'Bus',
  __objName: 'Kefir.bus()',
  push: function(x){
    this._send(x)
  },
  plug: function(stream){
    if (!this.isEnded()) {
      this.__plugged.push(stream);
      if (this.hasSubscribers()) {
        stream.on(this._send, this);
      }
      stream.onEnd(this.unplug, this, stream);
    }
  },
  unplug: function(stream){
    if (!this.isEnded()) {
      stream.off(this._send, this);
      removeFromArray(this.__plugged, stream);
    }
  },
  end: function(){
    this._send(Kefir.END);
  },
  __onFirstIn: function(){
    for (var i = 0; i < this.__plugged.length; i++) {
      this.__plugged[i].on(this._send, this);
    }
  },
  __onLastOut: function(){
    for (var i = 0; i < this.__plugged.length; i++) {
      this.__plugged[i].off(this._send, this);
    }
  },
  __end: function(){
    Stream.prototype.__end.call(this);
    this.__plugged = null;
    this.push = noop;
  }

});

Kefir.bus = function(){
  return new Kefir.Bus;
}





// FlatMap

Kefir.FlatMappedStream = function FlatMappedStream(sourceStream, mapFn){
  Stream.call(this)
  this.__sourceStream = sourceStream;
  this.__plugged = [];
  this.__mapFn = mapFn;
  sourceStream.onEnd(this.__sendEnd, this);
}

inherit(Kefir.FlatMappedStream, Stream, {

  __ClassName: 'FlatMappedStream',
  __objName: 'observable.flatMap(fn)',
  __plugResult: function(x){
    this.__plug(  this.__mapFn(x)  );
  },
  __onFirstIn: function(){
    this.__sourceStream.on(this.__plugResult, this);
    for (var i = 0; i < this.__plugged.length; i++) {
      this.__plugged[i].on(this._send, this);
    }
  },
  __onLastOut: function(){
    this.__sourceStream.off(this.__plugResult, this);
    for (var i = 0; i < this.__plugged.length; i++) {
      this.__plugged[i].off(this._send, this);
    }
  },
  __plug: function(stream){
    this.__plugged.push(stream);
    if (this.hasSubscribers()) {
      stream.on(this._send, this);
    }
    stream.onEnd(this.__unplug, this, stream);
  },
  __unplug: function(stream){
    if (!this.isEnded()) {
      stream.off(this._send, this);
      removeFromArray(this.__plugged, stream);
    }
  },
  __end: function(){
    Stream.prototype.__end.call(this);
    this.__sourceStream = null;
    this.__mapFn = null;
    this.__plugged = null;
  }

})

Observable.prototype.flatMap = function(fn) {
  return new Kefir.FlatMappedStream(this, fn);
};








// Merge

Kefir.MergedStream = function MergedStream(){
  Stream.call(this)
  this.__sources = firstArrOrToArr(arguments);
  for (var i = 0; i < this.__sources.length; i++) {
    this.__sources[i].onEnd(this.__unplug, this, this.__sources[i]);
  }
}

inherit(Kefir.MergedStream, Stream, {

  __ClassName: 'MergedStream',
  __objName: 'Kefir.merge(streams)',
  __onFirstIn: function(){
    for (var i = 0; i < this.__sources.length; i++) {
      this.__sources[i].onChanges(this._send, this);
    }
  },
  __onLastOut: function(){
    for (var i = 0; i < this.__sources.length; i++) {
      this.__sources[i].off(this._send, this);
    }
  },
  __unplug: function(stream){
    stream.off(this._send, this);
    removeFromArray(this.__sources, stream);
    if (this.__sources.length === 0) {
      this._send(Kefir.END);
    }
  },
  __end: function(){
    Stream.prototype.__end.call(this);
    this.__sources = null;
  }

});

Kefir.merge = function() {
  return new Kefir.MergedStream(firstArrOrToArr(arguments));
}

Stream.prototype.merge = function() {
  return Kefir.merge([this].concat(firstArrOrToArr(arguments)));
}









// Combine

Kefir.CombinedStream = function CombinedStream(sources, mapFn){
  Stream.call(this)

  this.__sources = sources;
  this.__cachedValues = new Array(sources.length);
  this.__hasCached = new Array(sources.length);
  this.__mapFn = mapFn;

  for (var i = 0; i < this.__sources.length; i++) {
    this.__sources[i].onEnd(this.__unplug, this, i);
  }

}

inherit(Kefir.CombinedStream, Stream, {

  __ClassName: 'CombinedStream',
  __objName: 'Kefir.combine(streams, fn)',
  __onFirstIn: function(){
    for (var i = 0; i < this.__sources.length; i++) {
      if (this.__sources[i]) {
        this.__sources[i].on(this.__receive, this, i);
      }
    }
  },
  __onLastOut: function(){
    for (var i = 0; i < this.__sources.length; i++) {
      if (this.__sources[i]) {
        this.__sources[i].off(this.__receive, this, i);
      }
    }
  },
  __unplug: function(i){
    this.__sources[i].off(this.__receive, this, i);
    this.__sources[i] = null
    if (isAllDead(this.__sources)) {
      this._send(Kefir.END);
    }
  },
  __receive: function(i, x) {
    this.__hasCached[i] = true;
    this.__cachedValues[i] = x;
    if (this.__allCached()) {
      if (isFn(this.__mapFn)) {
        this._send(this.__mapFn.apply(null, this.__cachedValues));
      } else {
        this._send(this.__cachedValues.slice(0));
      }
    }
  },
  __allCached: function(){
    for (var i = 0; i < this.__hasCached.length; i++) {
      if (!this.__hasCached[i]) {
        return false;
      }
    }
    return true;
  },
  __end: function(){
    Stream.prototype.__end.call(this);
    this.__sources = null;
    this.__cachedValues = null;
    this.__hasCached = null;
    this.__mapFn = null;
  }

});

Kefir.combine = function(sources, mapFn) {
  return new Kefir.CombinedStream(sources, mapFn);
}

Observable.prototype.combine = function(sources, mapFn) {
  return Kefir.combine([this].concat(sources), mapFn);
}

// FromPoll

var FromPollStream = Kefir.FromPollStream = function FromPollStream(interval, sourceFn){
  Stream.call(this);
  this.__interval = interval;
  this.__intervalId = null;
  var _this = this;
  this.__send = function(){  _this._send(sourceFn())  }
}

inherit(FromPollStream, Stream, {

  __ClassName: 'FromPollStream',
  __objName: 'Kefir.fromPoll(interval, fn)',
  __onFirstIn: function(){
    this.__intervalId = setInterval(this.__send, this.__interval);
  },
  __onLastOut: function(){
    if (this.__intervalId !== null){
      clearInterval(this.__intervalId);
      this.__intervalId = null;
    }
  },
  __end: function(){
    Stream.prototype.__end.call(this);
    this.__send = null;
  }

});

Kefir.fromPoll = function(interval, fn){
  return withName('Kefir.fromPoll(interval, fn)', new FromPollStream(interval, fn));
}



// Interval

Kefir.interval = function(interval, x){
  return withName('Kefir.interval(interval, x)', new FromPollStream(interval, function(){  return x }));
}



// Sequentially

Kefir.sequentially = function(interval, xs){
  xs = xs.slice(0);
  return withName('Kefir.sequentially(interval, xs)', new FromPollStream(interval, function(){
    if (xs.length === 0) {
      return END;
    }
    if (xs.length === 1){
      return Kefir.bunch(xs[0], END);
    }
    return xs.shift();
  }));
}



// Repeatedly

Kefir.repeatedly = function(interval, xs){
  var i = -1;
  return withName('Kefir.repeatedly(interval, xs)', new FromPollStream(interval, function(){
    return xs[++i % xs.length];
  }));
}

// TODO
//
// // more underscore-style maybe?
// observable.delay(delay)
// observable.throttle(delay)
// observable.debounce(delay)
// observable.debounceImmediate(delay)
//
// Kefir.later(delay, value)


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


describe("Base stream:", function(){

  it("onEnd(), offEnd() works", function(done) {

    var stream = helpers.sampleStream([]);

    setTimeout(function(){
      stream._send(Kefir.END);
    }, 0);

    var calls = 0;

    var unsubscriber = function(){
      calls += 10;
    }

    stream.onEnd(unsubscriber);
    stream.offEnd(unsubscriber);

    stream.onEnd(function(){
      calls++;
    });

    setTimeout(function(){
      // subscription after end
      stream.onEnd(function(){
        calls++;
      });
      expect(calls).toBe(2);
      done();
    }, 50);

  }, 100);


  it("no values after end", function(done) {

    var stream = helpers.sampleStream([1, 2, Kefir.END, 3, 4]);

    helpers.captureOutput(stream, function(values){
      expect(values).toEqual([1, 2]);
      done();
    });

  }, 100);


  it("stream deliver events to all subscribers", function(done) {

    var stream = helpers.sampleStream([1, 2, Kefir.END]);

    var result1 = [];
    stream.on(function(value){
      result1.push(value);
    });

    var result2 = [];
    stream.on(function(value){
      result2.push(value);
    });

    stream.onEnd(function(){
      expect(result1).toEqual([1, 2]);
      expect(result2).toEqual([1, 2]);
      done();
    });

  }, 100);

  it("stream do not deliver events to unsubscribers", function(done) {

    var stream = helpers.sampleStream([1, 2, Kefir.END]);

    var result1 = [];
    stream.on(function(value){
      result1.push(value);
    });

    var result2 = [];
    var unsubscriber = function(value){
      result2.push(value);
    }
    stream.on(unsubscriber);
    stream.off(unsubscriber);

    stream.onEnd(function(){
      expect(result1).toEqual([1, 2]);
      expect(result2).toEqual([]);
      done();
    });

  }, 100);


});

},{"../../dist/kefir.js":1,"../test-helpers":20}],3:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');


describe("Bus:", function(){



  it("push() works", function(done) {

    var bus = new Kefir.Bus;

    bus.push('no subscribers – will not be delivered');

    setTimeout(function(){
      bus.push(2);
      bus.end();
    }, 0);

    helpers.captureOutput(bus, function(values){
      expect(values).toEqual([1, 2]);
      done();
    });

    bus.push(1);

  }, 100);




  it("plug() works", function(done) {

    var mainBus = new Kefir.Bus;
    var source1 = new Kefir.Bus;
    var source2 = new Kefir.Bus;

    mainBus.plug(source1);

    source1.push('no subscribers – will not be delivered');

    setTimeout(function(){
      source2.push('not plugged – will not be delivered');
      source1.push(1);
      mainBus.plug(source2);
    }, 0);

    setTimeout(function(){
      source2.push(2);
      source1.push(3);
      source1.end();
    }, 0);

    setTimeout(function(){
      source2.push(4);
      mainBus.end();
    }, 0);

    helpers.captureOutput(mainBus, function(values){
      expect(values).toEqual([1, 2, 3, 4]);
      done();
    });

  }, 100);




  it("unplug() works", function(done) {

    var mainBus = new Kefir.Bus;
    var source = new Kefir.Bus;

    mainBus.plug(source);


    setTimeout(function(){
      source.push(1);
      mainBus.unplug(source);
    }, 0);

    setTimeout(function(){
      source.push(2);
      source.end();
      mainBus.end();
    }, 0);

    helpers.captureOutput(mainBus, function(values){
      expect(values).toEqual([1]);
      done();
    });

  }, 100);




});

},{"../../dist/kefir.js":1,"../test-helpers":20}],4:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Combine:", function(){

  it("simple case", function(done){

    var stream1 = helpers.sampleStream([1, 3, Kefir.END], 15);
    var stream2 = helpers.sampleStream([6, 5, Kefir.END], 20);

    // --1--3
    // ---6---5
    // ---7-9-8

    var combined = stream1.combine(stream2, function(s1, s2){
      return s1 + s2;
    })

    helpers.captureOutput(combined, function(values){
      expect(values).toEqual([7, 9, 8]);
      done();
    });

  }, 100);


  it("with property", function(done){

    var stream1 = helpers.sampleStream([1, 3, Kefir.END], 15);
    var stream2 = helpers.sampleStream([6, 5, Kefir.END], 20).toProperty(0);

    // --1--3
    // 0--6---5
    // --17-9-8

    var combined = stream1.combine(stream2, function(s1, s2){
      return s1 + s2;
    })

    helpers.captureOutput(combined, function(values){
      expect(values).toEqual([1, 7, 9, 8]);
      done();
    });

  }, 100);



  it("with temporary all unsubscribed", function(done){

    var bus1 = new Kefir.Bus;
    var bus2 = new Kefir.Bus;
    var combined = bus1.combine(bus2, function(a, b) { return a + b });

    helpers.captureOutput(combined.take(2), function(values){
      expect(values).toEqual([3, 5]);
    });

    bus1.push(1)
    bus2.push(2) // 1 + 2 = 3
    bus1.push(3) // 3 + 2 = 5
    expect(bus1.hasSubscribers()).toBe(true);
    expect(bus2.hasSubscribers()).toBe(true);
    bus2.push(4) // 3 + 4 = 7
    expect(bus1.hasSubscribers()).toBe(false);
    expect(bus2.hasSubscribers()).toBe(false);


    helpers.captureOutput(combined, function(values){
      expect(values).toEqual([9, 11]);
      done();
    });

    bus1.push(5) // 5 + 4 = 9
    bus2.push(6) // 5 + 6 = 11
    bus1.end()
    bus2.end()


  }, 100);



});

},{"../../dist/kefir.js":1,"../test-helpers":20}],5:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Filter:", function(){

  it("works", function(done){

    var stream = helpers.sampleStream([1, 2, 3, 4, Kefir.END]);
    var filtered = stream.filter(function(x){
      return x % 2 === 0;
    })

    helpers.captureOutput(filtered, function(values){
      expect(values).toEqual([2, 4]);
      done();
    });

  }, 100);



  it("works with properties", function(done){

    var property = helpers.sampleStream([1, 2, 3, 4, Kefir.END]).toProperty(6);

    var filtered = property.filter(function(x){
      return x % 2 === 0;
    })

    expect(filtered instanceof Kefir.Property).toBe(true);
    expect(filtered.getCached()).toBe(6);

    helpers.captureOutput(filtered, function(values){
      expect(values).toEqual([6, 2, 4]);
      done();
    });

  }, 100);



  it("works with properties 2", function(done){

    var property = helpers.sampleStream([1, 2, 3, 4, Kefir.END]).toProperty(5);

    var filtered = property.filter(function(x){
      return x % 2 === 0;
    })

    expect(filtered instanceof Kefir.Property).toBe(true);
    expect(filtered.hasCached()).toBe(false);

    helpers.captureOutput(filtered, function(values){
      expect(values).toEqual([2, 4]);
      done();
    });

  }, 100);



});

},{"../../dist/kefir.js":1,"../test-helpers":20}],6:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("FlatMap:", function(){

  it("works", function(done){

    var main = new Kefir.Bus;
    var mapped = main.flatMap(function(x){
      return x;
    });

    var childA = new Kefir.Bus;
    var childB = new Kefir.Bus;

    helpers.captureOutput(mapped, function(values){
      expect(values).toEqual([1, 2, 3, 4]);
      done();
    });

    main.push(childA)
    childA.push(1)
    main.push(childB)
    childB.push(2)
    childA.push(3)
    childB.push(4)
    main.end()

  }, 100);


});

},{"../../dist/kefir.js":1,"../test-helpers":20}],7:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("FromPoll:", function(){

  it("works", function(done){

    function pollArray(values, interval){
      return Kefir.fromPoll(interval, function(){
        if (values.length > 0) {
          return values.shift();
        } else {
          return Kefir.END;
        }
      })
    }

    var stream1 = helpers.sampleStream([1, Kefir.END]);
    var stream2 = pollArray([2, 4], 30);
    var stream3 = pollArray([3, 5], 45);

    // -1----------
    // ---2---4----
    // -----3-----5
    var merged = stream1.merge(stream2, stream3);

    helpers.captureOutput(merged, function(values){
      expect(values).toEqual([1, 2, 3, 4, 5]);
      done();
    });

  }, 200);


});

},{"../../dist/kefir.js":1,"../test-helpers":20}],8:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("interval:", function(){

  it("works", function(done){

    var stream1 = helpers.sampleStream([1, Kefir.END]);
    var stream2 = Kefir.interval(30, 2).take(2);
    var stream3 = Kefir.interval(45, 3).take(2);

    // -1----------
    // ---2---2----
    // -----3-----3
    var merged = stream1.merge(stream2, stream3);

    helpers.captureOutput(merged, function(values){
      expect(values).toEqual([1, 2, 3, 2, 3]);
      done();
    });

  }, 200);


});

},{"../../dist/kefir.js":1,"../test-helpers":20}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Map:", function(){

  it("works", function(done){

    var stream = helpers.sampleStream([1, 2, Kefir.END]);
    var mapped = stream.map(function(x){
      return x*2;
    })

    helpers.captureOutput(mapped, function(values){
      expect(values).toEqual([2, 4]);
      done();
    });

  }, 100);


  it("produce Property from Property", function(done){

    var property = helpers.sampleStream([1, 2, Kefir.END]).toProperty(5);

    var mapped = property.map(function(x){
      return x*2;
    })

    expect(mapped instanceof Kefir.Property).toBe(true);
    expect(mapped.getCached()).toBe(10);

    helpers.captureOutput(mapped, function(values){
      expect(values).toEqual([10, 2, 4]);
      done();
    });

  }, 100);



  it("with temporary all unsubscribed", function(done){

    var bus = new Kefir.Bus;
    var mapped = bus.map(function(x){
      return x*2;
    })

    helpers.captureOutput(mapped.take(2), function(values){
      expect(values).toEqual([2, 4]);
    });

    bus.push(1)
    bus.push(2)
    expect(bus.hasSubscribers()).toBe(true);
    bus.push(3)
    expect(bus.hasSubscribers()).toBe(false);

    helpers.captureOutput(mapped, function(values){
      expect(values).toEqual([8, 10]);
      done();
    });

    bus.push(4)
    bus.push(5)
    bus.end()

  }, 100);


});

},{"../../dist/kefir.js":1,"../test-helpers":20}],11:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Merge:", function(){


  it("works", function(done){

    var stream1 = helpers.sampleStream([1, Kefir.END]);
    var stream2 = helpers.sampleStream([2, 4, Kefir.END], 30);
    var stream3 = helpers.sampleStream([3, 5, Kefir.END], 45);

    // -1----------
    // ---2---4----
    // -----3-----5
    var merged = stream1.merge(stream2, stream3);

    helpers.captureOutput(merged, function(values){
      expect(values).toEqual([1, 2, 3, 4, 5]);
      done();
    });

  }, 200);


});

},{"../../dist/kefir.js":1,"../test-helpers":20}],12:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Never:", function(){

  it("works", function(done){

    helpers.captureOutput(Kefir.never(), function(values){
      expect(values).toEqual([]);
      done();
    });

  }, 100);


});

},{"../../dist/kefir.js":1,"../test-helpers":20}],13:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("No more:", function(){

  it("works", function(){

    var bus = new Kefir.Bus;

    var values = []
    bus.on(function(x){
      values.push(x);
      if (x > 2) {
        return Kefir.NO_MORE;
      }
    });

    bus.push(1);
    bus.push(2);
    bus.push(3);
    bus.push(4);
    bus.push(5);

    expect(values).toEqual([1, 2, 3]);

  });


});

},{"../../dist/kefir.js":1,"../test-helpers":20}],14:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Once:", function(){

  it("works", function(done){

    var stream = Kefir.once(1);

    helpers.captureOutput(stream, function(values){
      expect(values).toEqual([1]);
    });

    helpers.captureOutput(stream, function(values){
      expect(values).toEqual([]);
      done();
    });

  }, 100);


});

},{"../../dist/kefir.js":1,"../test-helpers":20}],15:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');


describe("Property:", function(){



  it("works", function(done) {

    var bus = new Kefir.Bus;
    var property = bus.toProperty();

    var result1 = []
    property.on(function(x){
      result1.push(x)
    })
    expect(result1).toEqual([]);

    bus.push(1);

    var result2 = []
    property.on(function(x){
      result2.push(x)
    })
    expect(result1).toEqual([1]);
    expect(result2).toEqual([1]);

    bus.push(2);
    bus.end();

    property.onEnd(function(){
      expect(result1).toEqual([1, 2]);
      expect(result2).toEqual([1, 2]);
      done()
    });

  }, 100);


  it("initial value works", function(done) {

    var bus = new Kefir.Bus;
    var property = bus.toProperty(1);

    var result1 = []
    property.on(function(x){
      result1.push(x)
    })
    expect(result1).toEqual([1]);

    bus.push(2);
    bus.end();

    property.onEnd(function(){
      expect(result1).toEqual([1, 2]);
      done()
    });

  }, 100);


  it("changes", function(done) {

    var bus = new Kefir.Bus;
    var property = bus.toProperty(1);

    helpers.captureOutput(property, function(values){
      expect(values).toEqual([1, 2, 3]);
    });

    helpers.captureOutput(property.changes(), function(values){
      expect(values).toEqual([2, 3]);
      done();
    });

    bus.push(2);
    bus.push(3);
    bus.end();

  }, 100);



  it("property.toProperty()", function() {

    var bus = new Kefir.Bus;
    var property = bus.toProperty(1);

    expect(property.toProperty()).toBe(property);
    expect(function(){
      property.toProperty(2);
    }).toThrow();

  });




});

},{"../../dist/kefir.js":1,"../test-helpers":20}],16:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("repeatedly:", function(){

  it("works", function(done){

    var stream1 = helpers.sampleStream([1, Kefir.END]);
    var stream2 = Kefir.repeatedly(30, [2, 4]).take(5);
    var stream3 = Kefir.repeatedly(45, [3, 5]).take(1);

    // 1
    // ---2---4---2---4---2
    // -----3
    var merged = stream1.merge(stream2, stream3);

    helpers.captureOutput(merged, function(values){
      expect(values).toEqual([1, 2, 3, 4, 2, 4, 2]);
      done();
    });

  }, 200);


});

},{"../../dist/kefir.js":1,"../test-helpers":20}],17:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("sequentially:", function(){

  it("works", function(done){

    var stream1 = helpers.sampleStream([1, Kefir.END]);
    var stream2 = Kefir.sequentially(30, [2, 4]);
    var stream3 = Kefir.sequentially(45, [3, 5]);

    // -1----------
    // ---2---4----
    // -----3-----5
    var merged = stream1.merge(stream2, stream3);

    helpers.captureOutput(merged, function(values){
      expect(values).toEqual([1, 2, 3, 4, 5]);
      done();
    });

  }, 200);


});

},{"../../dist/kefir.js":1,"../test-helpers":20}],18:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Take while:", function(){

  it("works", function(done){

    var stream = helpers.sampleStream([1, 2, 3, 4, Kefir.END]);
    var filtered = stream.takeWhile(function(x){
      return x !== 3;
    })

    helpers.captureOutput(filtered, function(values){
      expect(values).toEqual([1, 2]);
      done();
    });

  }, 100);


});

},{"../../dist/kefir.js":1,"../test-helpers":20}],19:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Take:", function(){

  it("works", function(done){

    var stream = helpers.sampleStream([1, 2, 3, 4, Kefir.END]);

    var first2 = stream.take(2);
    var first10 = stream.take(10);

    helpers.captureOutput(first2, function(values){
      expect(values).toEqual([1, 2]);
    });

    helpers.captureOutput(first10, function(values){
      expect(values).toEqual([1, 2, 3, 4]);
      done();
    });

  }, 100);


});

},{"../../dist/kefir.js":1,"../test-helpers":20}],20:[function(require,module,exports){
var Kefir = require('../dist/kefir.js');

exports.captureOutput = function(stream, callback, timeout) {
  var values = [];

  function log(value){
    values.push(value);
  }

  function report(){
    stream.off(log);
    stream.offEnd(report);
    callback(values);
  }

  stream.on(log);
  stream.onEnd(report);

  if (typeof timeout === "number") {
    setTimeout(report, timeout);
  }
}



exports.sampleStream = function(values, timeout){
  timeout = timeout || 0;
  return Kefir.fromBinder(function(sink){
    var send = function() {
      if (values.length > 0) {
        sink(values.shift());
        setTimeout(send, timeout);
      }
    }
    setTimeout(send, timeout);
    return function(){};
  });
}

},{"../dist/kefir.js":1}]},{},[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])