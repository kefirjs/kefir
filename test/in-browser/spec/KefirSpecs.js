(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! kefir - 0.1.9
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
  if (arrayLike instanceof Array) {
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

function callSubscriber(subscriber, moreArgs){
  // subscriber = [
  //   eventName,
  //   fn,
  //   context,
  //   arg1,
  //   arg2,
  //   ...
  // ]
  var fn = subscriber[1];
  var context = subscriber[2];
  var args = restArgs(subscriber, 3);
  if (moreArgs){
    args = args.concat(toArray(moreArgs));
  }
  return fn.apply(context, args);
}

function isFn(fn) {
  return typeof fn === "function";
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
      var firstValueSubscriber = (type === 'value' && !this.__hasSubscribers('value'));
      this.__subscribers.push(arguments);
      if (firstValueSubscriber) {
        this.__onFirstIn();
      }
    } else if (type === 'end') {
      callSubscriber(arguments);
    }
  },
  __off: function(type /*,callback [, context [, arg1, arg2 ...]]*/){
    if (!this.isEnded()) {
      for (var i = 0; i < this.__subscribers.length; i++) {
        if (isEqualArrays(this.__subscribers[i], arguments)) {
          this.__subscribers[i] = null;
        }
      }
      if (type === 'value' && !this.__hasSubscribers('value')) {
        this.__onLastOut();
      }
    }
  },
  __send: function(type /*[, arg1, arg2, ...]*/) {
    if (!this.isEnded()) {
      for (var i = 0; i < this.__subscribers.length; i++) {
        var subscriber = this.__subscribers[i];
        if (subscriber && subscriber[0] === type) {
          var result = callSubscriber(subscriber, restArgs(arguments, 1));
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
  },
  __sendEnd: function(){
    this.__send('end');
  },
  __sendAny: function(x){
    if (x === END) {
      this.__sendEnd();
    } else if (x instanceof Kefir.BunchOfValues) {
      for (var i = 0; i < x.values.length; i++) {
        this.__sendAny(x.values[i]);
      }
    } else if (x !== Kefir.NOTHING) {
      this.__sendValue(x);
    }
  },


  onValue: function(){
    this.__on.apply(this, ['value'].concat(toArray(arguments)));
  },
  offValue: function(){
    this.__off.apply(this, ['value'].concat(toArray(arguments)));
  },
  onEnd: function(){
    this.__on.apply(this, ['end'].concat(toArray(arguments)));
  },
  offEnd: function(){
    this.__off.apply(this, ['end'].concat(toArray(arguments)));
  },

  // for Property
  onNewValue: function(){
    this.onValue.apply(this, arguments);
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
  this.__cached = (typeof initial !== "undefined") ? initial : Kefir.NOTHING;
}

inherit(Property, Observable, {

  __ClassName: 'Property',

  hasCached: function(){
    return this.__cached !== Kefir.NOTHING;
  },
  getCached: function(){
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
  },
  onValue: function() {
    if ( this.hasCached() ) {
      callSubscriber(['value'].concat(toArray(arguments)), [this.__cached]);
    }
    this.onNewValue.apply(this, arguments);
  }

})



// Log

Observable.prototype.log = function(text) {
  if (!text) {
    text = this.toString();
  }
  function log(x){  console.log(text, x)  }
  this.onValue(log);
  this.onEnd(function(){  log(END)  });
}

// TODO
//
// Kefir.constant(x)



// Never

var neverObj = new Stream();
neverObj.__sendEnd();
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
  onValue: function(){
    if (!this.isEnded()) {
      callSubscriber(['value'].concat(toArray(arguments)), [this.__value]);
      this.__value = null;
      this.__sendEnd();
    }
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
  __onFirstIn: function(){
    var _this = this;
    this.__usubscriber = this.__subscribe(function(x){
      _this.__sendAny(x);
    });
  },
  __onLastOut: function(){
    if (isFn(this.__usubscriber)) {
      this.__usubscriber();
    }
    this.__usubscriber = null;
  },
  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__subscribe = null;
  }

})

Kefir.fromBinder = function(subscribe){
  return new Kefir.FromBinderStream(subscribe);
}

var WithSourceStreamMixin = {
  __Constructor: function(source) {
    this.__source = source;
    source.onEnd(this.__sendEnd, this);
    if (source instanceof Property && this instanceof Property && source.hasCached()) {
      this.__handle(source.getCached());
    }
  },
  __handle: function(x){
    this.__sendAny(x);
  },
  __onFirstIn: function(){
    this.__source.onNewValue(this.__handle, this);
  },
  __onLastOut: function(){
    this.__source.offValue(this.__handle, this);
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
  if (typeof initial === "undefined") {
    return this
  } else {
    var prop = new Kefir.PropertyFromStream(this);
    prop.__sendValue(initial);
    return prop;
  }
}





// property.changes()

Kefir.ChangesStream = function ChangesStream(source){
  Stream.call(this);
  this.__Constructor(source);
}

inherit(Kefir.ChangesStream, Stream, WithSourceStreamMixin, {
  __ClassName: 'ChangesStream'
})

Property.prototype.changes = function() {
  return new Kefir.ChangesStream(this);
}





// .scan(seed, fn)

Kefir.ScanProperty = function ScanProperty(source, seed, fn){
  Property.call(this, null, null, seed);
  this.__fn = fn;
  this.__Constructor(source);
}

inherit(Kefir.ScanProperty, Property, WithSourceStreamMixin, {

  __ClassName: 'ScanProperty',

  __handle: function(x){
    this.__sendValue( this.__fn(this.getCached(), x) );
  },
  __clear: function(){
    WithSourceStreamMixin.__clear.call(this);
    this.__fn = null;
  }

})

Observable.prototype.scan = function(seed, fn) {
  return new Kefir.ScanProperty(this, seed, fn);
}




// .map(fn)

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
    this.__sendAny( this.__mapFn(x) );
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

Stream.prototype.map = function(fn) {
  return new Kefir.MappedStream(this, fn);
}

Property.prototype.map = function(fn) {
  return new Kefir.MappedProperty(this, fn);
}




// .diff(seed, fn)

Observable.prototype.diff = function(prev, fn) {
  return this.map(function(x){
    var result = fn(prev, x);
    prev = x;
    return result;
  })
}





// .filter(fn)

Observable.prototype.filter = function(fn) {
  return this.map(function(x){
    if (fn(x)) {
      return x;
    } else {
      return NOTHING;
    }
  })
}




// .takeWhile(fn)

Observable.prototype.takeWhile = function(fn) {
  return this.map(function(x){
    if (fn(x)) {
      return x;
    } else {
      return END;
    }
  })
}




// .take(n)

Observable.prototype.take = function(n) {
  return this.map(function(x){
    if (n <= 0) {
      return END;
    }
    if (n === 1) {
      return Kefir.bunch(x, END);
    }
    n--;
    return x;
  })
}




// .skip(n)

Observable.prototype.skip = function(n) {
  return this.map(function(x){
    if (n <= 0) {
      return x;
    } else {
      n--;
      return Kefir.NOTHING;
    }
  })
}





// .skipDuplicates([fn])

Observable.prototype.skipDuplicates = function(fn) {
  var prev, hasPrev = false;
  return this.map(function(x){
    var result;
    if (hasPrev && (fn ? fn(prev, x) : prev === x)) {
      result = Kefir.NOTHING;
    } else {
      result = x;
    }
    hasPrev = true;
    prev = x;
    return result;
  })
}





// .skipWhile(f)

Observable.prototype.skipWhile = function(fn) {
  var skip = true;
  return this.map(function(x){
    if (skip && fn(x)) {
      return Kefir.NOTHING;
    } else {
      skip = false;
      return x;
    }
  })
}

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
        stream.onValue(this.__handlePlugged, this, i);
      }
      stream.onEnd(this.__unplugById, this, i);
    }
  },
  __unplugById: function(i){
    if ( !this.isEnded() ) {
      var stream = this.__plugged[i];
      if (stream) {
        this.__plugged[i] = null;
        stream.offValue(this.__handlePlugged, this, i);
        stream.onEnd(this.__unplugById, this, i);
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
        stream.onValue(this.__handlePlugged, this, i);
      }
    }
  },
  __onLastOut: function(){
    for (var i = 0; i < this.__plugged.length; i++) {
      var stream = this.__plugged[i];
      if (stream) {
        stream.offValue(this.__handlePlugged, this, i);
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





// Bus

Kefir.Bus = function Bus(){
  Stream.call(this);
  this.__initPluggable();
}

inherit(Kefir.Bus, Stream, PluggableMixin, {

  __ClassName: 'Bus',

  push: function(x){
    this.__sendAny(x);
  },
  plug: function(stream){
    this.__plug(stream);
  },
  unplug: function(stream){
    this.__unplug(stream);
  },
  end: function(){
    this.__sendEnd();
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





// FlatMap

Kefir.FlatMappedStream = function FlatMappedStream(sourceStream, mapFn){
  Stream.call(this);
  this.__initPluggable();
  this.__sourceStream = sourceStream;
  this.__mapFn = mapFn;
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
    this.__plug(  this.__mapFn(x)  );
  },
  __onFirstIn: function(){
    this.__sourceStream.onValue(this.__plugResult, this);
    PluggableMixin.__onFirstIn.call(this);
  },
  __onLastOut: function(){
    this.__sourceStream.offValue(this.__plugResult, this);
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
    this.__mapFn = null;
  }

})

Observable.prototype.flatMap = function(fn) {
  return new Kefir.FlatMappedStream(this, fn);
};








// Merge

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









// Combine

Kefir.CombinedStream = function CombinedStream(sources, mapFn){
  Stream.call(this);
  this.__initPluggable();
  for (var i = 0; i < sources.length; i++) {
    this.__plug(sources[i]);
  }
  this.__cachedValues = new Array(sources.length);
  this.__hasCached = new Array(sources.length);
  this.__mapFn = mapFn;
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
    this.__hasCached[i] = true;
    this.__cachedValues[i] = x;
    if (this.__allCached()) {
      if (isFn(this.__mapFn)) {
        this.__sendAny(this.__mapFn.apply(null, this.__cachedValues));
      } else {
        this.__sendValue(this.__cachedValues.slice(0));
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
  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__clearPluggable();
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
  this.__bindedSend = function(){  _this.__sendAny(sourceFn())  }
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

Kefir.fromPoll = function(interval, fn){
  return new FromPollStream(interval, fn);
}



// Interval

Kefir.interval = function(interval, x){
  return new FromPollStream(interval, function(){  return x });
}



// Sequentially

Kefir.sequentially = function(interval, xs){
  xs = xs.slice(0);
  return new FromPollStream(interval, function(){
    if (xs.length === 0) {
      return END;
    }
    if (xs.length === 1){
      return Kefir.bunch(xs[0], END);
    }
    return xs.shift();
  });
}



// Repeatedly

Kefir.repeatedly = function(interval, xs){
  var i = -1;
  return new FromPollStream(interval, function(){
    return xs[++i % xs.length];
  });
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

},{"../../dist/kefir.js":1,"../test-helpers":26}],3:[function(require,module,exports){
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



});

},{"../../dist/kefir.js":1,"../test-helpers":26}],4:[function(require,module,exports){
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
    expect(diffs.hasCached()).toBe(true);
    expect(diffs.getCached()).toBe(1);

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
    expect(diffs.hasCached()).toBe(false);
    expect(diffs.getCached()).toBe(Kefir.NOTHING);

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

},{"../../dist/kefir.js":1,"../test-helpers":26}],5:[function(require,module,exports){
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
    expect(filtered.hasCached()).toBe(true);
    expect(filtered.getCached()).toBe(6);

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
    expect(filtered.hasCached()).toBe(false);
    expect(filtered.getCached()).toBe(Kefir.NOTHING);

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

},{"../../dist/kefir.js":1,"../test-helpers":26}],6:[function(require,module,exports){
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


});

},{"../../dist/kefir.js":1,"../test-helpers":26}],7:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":26}],8:[function(require,module,exports){
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

    var result = helpers.getOutput(obs);

    __send(1);
    __send(2);
    __send(Kefir.NOTHING);
    __send(Kefir.bunch(3, Kefir.NOTHING, 4, Kefir.END));

    expect(result).toEqual({
      ended: true,
      xs: [1, 2, 3, 4]
    });

  });




});

},{"../../dist/kefir.js":1,"../test-helpers":26}],9:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":26}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
    expect(mapped.hasCached()).toBe(true);
    expect(mapped.getCached()).toBe(10);

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


});

},{"../../dist/kefir.js":1,"../test-helpers":26}],12:[function(require,module,exports){
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


});

},{"../../dist/kefir.js":1,"../test-helpers":26}],13:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":26}],14:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":26}],15:[function(require,module,exports){
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


  it("_sendAny", function(){

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

},{"../../dist/kefir.js":1,"../test-helpers":26}],16:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":26}],17:[function(require,module,exports){
var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Property", function(){

  it("hasCached, getCached", function(){

    var prop = new Kefir.Property();

    expect(prop.hasCached()).toBe(false);
    expect(prop.getCached()).toBe(Kefir.NOTHING);

    prop.__sendValue(1)
    expect(prop.hasCached()).toBe(true);
    expect(prop.getCached()).toBe(1);

    prop = new Kefir.Property(null, null, 2);

    expect(prop.hasCached()).toBe(true);
    expect(prop.getCached()).toBe(2);

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

    expect(prop.hasCached()).toBe(false);
    expect(prop.getCached()).toBe(Kefir.NOTHING);
    expect(log).toEqual([]);

    stream.__sendValue(1);

    expect(prop.hasCached()).toBe(true);
    expect(prop.getCached()).toBe(1);
    expect(log).toEqual([1]);

    stream.__sendValue(2);

    expect(prop.hasCached()).toBe(true);
    expect(prop.getCached()).toBe(2);
    expect(log).toEqual([1, 2]);

    stream.__sendEnd();

    expect(prop.isEnded()).toBe(true);
    expect(prop.hasCached()).toBe(true);
    expect(prop.getCached()).toBe(2);


    // with initial

    var prop2 = stream.toProperty(5);

    expect(prop2.hasCached()).toBe(true);
    expect(prop2.getCached()).toBe(5);

  });



  it("property.toProperty()", function(){

    var prop = new Kefir.Property(null, null, 'foo');

    expect(prop.toProperty()).toBe(prop);


    // with initial

    var prop2 = prop.toProperty(5);

    expect(prop2.hasCached()).toBe(true);
    expect(prop2.getCached()).toBe(5);

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


});

},{"../../dist/kefir.js":1,"../test-helpers":26}],18:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":26}],19:[function(require,module,exports){
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
    expect(scanned.hasCached()).toBe(true);
    expect(scanned.getCached()).toBe(0);

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
    expect(scanned.hasCached()).toBe(true);
    expect(scanned.getCached()).toBe(11);

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
    expect(scanned.hasCached()).toBe(true);
    expect(scanned.getCached()).toBe(5);

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


});

},{"../../dist/kefir.js":1,"../test-helpers":26}],20:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":26}],21:[function(require,module,exports){
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
    expect(mapped.hasCached()).toBe(true);
    expect(mapped.getCached()).toBe(5);

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
    expect(mapped.hasCached()).toBe(false);
    expect(mapped.getCached()).toBe(Kefir.NOTHING);

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
    expect(mapped.hasCached()).toBe(true);
    expect(mapped.getCached()).toBe(5);

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

},{"../../dist/kefir.js":1,"../test-helpers":26}],22:[function(require,module,exports){
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
    expect(mapped.hasCached()).toBe(false);
    expect(mapped.getCached()).toBe(Kefir.NOTHING);

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
    expect(mapped.hasCached()).toBe(true);
    expect(mapped.getCached()).toBe(5);

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

},{"../../dist/kefir.js":1,"../test-helpers":26}],23:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":26}],24:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":26}],25:[function(require,module,exports){
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

},{"../../dist/kefir.js":1,"../test-helpers":26}],26:[function(require,module,exports){
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

},{"../dist/kefir.js":1}]},{},[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25])