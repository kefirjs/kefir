(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(global){
  "use strict";


  // Class method names convention
  //
  // __foo: can be used only inside class or child class
  // _foo: can be used only inside Kefir
  // foo: public API



  var Kefir = {};

  Kefir.END = ['<end>'];
  Kefir.NO_MORE = ['<no more>'];




  // Utils

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

  function inherit(Child, Parent, childPrototype) {
    Child.prototype = createObj(Parent.prototype);
    Child.prototype.constructor = Child;
    if (childPrototype) {
      extend(Child.prototype, childPrototype)
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
        array[i] = null;
      }
    }
  }

  function isAllDead(array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
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





  // Callbacks

  var Callbacks = Kefir.Callbacks = inherit(function Callbacks(){
    this.__subscribers = null;
    this.__contexts = null;
  }, Object, {
    add: function(fn, context){
      if (this.__subscribers === null) {
        this.__subscribers = [];
        this.__contexts = [];
      }
      this.__subscribers.push(fn);
      this.__contexts.push(context);
    },
    remove: function(fn, context){
      if (this.isEmpty()) {return}
      for (var i = 0; i < this.__subscribers.length; i++) {
        if (this.__subscribers[i] === fn && this.__contexts[i] === context) {
          this.__subscribers[i] = null;
          this.__contexts[i] = null;
        }
      }
      if (isAllDead(this.__subscribers)){
        this.__subscribers = null;
        this.__contexts = null;
      }
    },
    isEmpty: function(){
      return this.__subscribers === null;
    },
    hasOne: function(){
      return !this.isEmpty() && this.__subscribers.length === 1;
    },
    send: function(x){
      if (this.isEmpty()) {return}
      for (var i = 0, l = this.__subscribers.length; i < l; i++) {
        var callback = this.__subscribers[i];
        var context = this.__contexts[i];
        if (isFn(callback)) {
          if(Kefir.NO_MORE === callback.call(context, x)) {
            this.remove(callback, context);
          }
        }
      }
    }
  });





  // Helper mixins

  var withHandlerMixin = {
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






  // Base Observable class

  var Observable = Kefir.Observable = inherit(function Observable(onFirstIn, onLastOut){

    // __onFirstIn, __onLastOut can also be added to prototype of child classes
    if (isFn(onFirstIn)) {
      this.__onFirstIn = onFirstIn;
    }
    if (isFn(onLastOut)) {
      this.__onLastOut = onLastOut;
    }

    this.__subscribers = new Callbacks;
    this.__endSubscribers = new Callbacks;
  }, Object, {

    __ClassName: 'Observable',
    _send: function(x) {
      if (!this.isEnded()) {
        if (x === Kefir.END) {
          this.__end();
        } else {
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
    on: function(callback, context) {
      if (!this.isEnded()) {
        this.__subscribers.add(callback, context);
        if (this.__subscribers.hasOne()) {
          this.__onFirstIn();
        }
      }
    },
    onChanges: function(callback, context){
      this.on(callback, context);
    },
    onValue: function(callback, context){
      this.on(callback, context);
    },
    off: function(callback, context) {
      if (!this.isEnded()) {
        this.__subscribers.remove(callback, context);
        if (this.__subscribers.isEmpty()) {
          this.__onLastOut();
        }
      }
    },
    onEnd: function(callback, context) {
      if (this.isEnded()) {
        callback.call(context);
      } else {
        this.__endSubscribers.add(callback, context);
      }
    },
    offEnd: function(callback, context) {
      if (!this.isEnded()){
        this.__endSubscribers.remove(callback, context);
      }
    },
    isEnded: function() {
      return this.__subscribers === null;
    },
    hasSubscribers: function(){
      return !this.isEnded() && !this.__subscribers.isEmpty();
    },
    __onFirstIn: noop,
    __onLastOut: noop,
    __sendEnd: function(){
      this._send(Kefir.END);
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

  });




  // Stream

  var Stream = Kefir.Stream = inherit(function Stream(){
    Observable.apply(this, arguments);
  }, Observable, {
    __ClassName: 'Stream'
  });





  // Never

  var neverObj = new Stream();
  neverObj._send(Kefir.END);
  neverObj.__objName = 'Kefir.never()'
  Kefir.never = function() {
    return neverObj;
  }




  // Once

  Kefir.OnceStream = inherit(function OnceStream(value){
    Stream.call(this);
    this.__value = value;
  }, Stream, {

    __ClassName: 'OnceStream',
    __objName: 'Kefir.once(x)',
    __onFirstIn: function(){
      this._send(this.__value);
      this.__value = null;
      this._send(Kefir.END);
    }

  });

  Kefir.once = function(x) {
    return new Kefir.OnceStream(x);
  }




  // Property

  var Property = Kefir.Property = inherit(function Property(onFirstIn, onLastOut, initial){
    Observable.call(this, onFirstIn, onLastOut);
    this.__hasCached = (typeof initial !== "undefined");
    this.__cached = initial;
  }, Observable, {

    __ClassName: 'Property',
    onChanges: function(callback, context){
      Observable.prototype.on.call(this, callback, context);
    },
    on: function(callback, context) {
      if (this.__hasCached) {
        callback.call(context, this.__cached);
      }
      this.onChanges(callback, context);
    },
    _send: function(x) {
      if (!this.isEnded()){
        this.__hasCached = true;
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
      return this.__hasCached;
    },
    getCached: function(){
      return this.__cached;
    }

  })

  Kefir.PropertyFromStream = inherit(function PropertyFromStream(source, initial){
    assertStream(source);
    Property.call(this, null, null, initial);
    this.__Constructor.call(this, source);
  }, Property, extend({}, withHandlerMixin, {

    __ClassName: 'PropertyFromStream',
    __objName: 'stream.toProperty()',
    __end: function(){
      Property.prototype.__end.call(this);
      withHandlerMixin.__end.call(this);
    }

  }))

  Stream.prototype.toProperty = function(initial){
    return new Kefir.PropertyFromStream(this, initial);
  }




  // Property::changes()

  Kefir.ChangesStream = inherit(function ChangesStream(source){
    assertProperty(source);
    Stream.call(this);
    this.__Constructor.call(this, source);
  }, Stream, extend({}, withHandlerMixin, {

    __ClassName: 'ChangesStream',
    __objName: 'property.changes()',
    __end: function(){
      Stream.prototype.__end.call(this);
      withHandlerMixin.__end.call(this);
    }

  }))

  Property.prototype.changes = function() {
    return new Kefir.ChangesStream(this);
  };





  // fromBinder

  Kefir.FromBinderStream = inherit(function FromBinderStream(subscribe){
    Stream.call(this);
    this.__subscribe = subscribe;
  }, Stream, {

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








  // Bus

  Kefir.Bus = inherit(function Bus(){
    Stream.call(this);
    this.__plugged = [];
  }, Stream, {

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
        var _this = this;
        stream.onEnd(function(){  _this.unplug(stream)  });
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




  // FromPoll

  var FromPollStream = Kefir.FromPollStream = inherit(function FromPollStream(interval, sourceFn){
    Stream.call(this);
    this.__interval = interval;
    this.__intervalId = null;
    var _this = this;
    this.__send = function(){  _this._send(sourceFn())  }
  }, Stream, {

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
      if (xs.length === 0){
        return Kefir.END;
      } else {
        return xs.shift();
      }
    }));
  }



  // Repeatedly

  Kefir.repeatedly = function(interval, xs){
    var i = -1;
    return withName('Kefir.repeatedly(interval, xs)', new FromPollStream(interval, function(){
      return xs[++i % xs.length];
    }));
  }




  // Map

  var mapMixin = extend({}, withHandlerMixin, {
    __Constructor: function(source, mapFn){
      if (source instanceof Property) {
        Property.call(this);
      } else {
        Stream.call(this);
      }
      this.__mapFn = mapFn;
      withHandlerMixin.__Constructor.call(this, source);
    },
    __handle: function(x){
      this._send( this.__mapFn(x) );
    },
    __end: function(){
      Stream.prototype.__end.call(this);
      withHandlerMixin.__end.call(this);
      this.__mapFn = null;
    }
  });

  Kefir.MappedStream = inherit(
    function MappedStream(){this.__Constructor.apply(this, arguments)},
    Stream, mapMixin
  );
  Kefir.MappedStream.prototype.__ClassName = 'MappedStream'

  Kefir.MappedProperty = inherit(
    function MappedProperty(){this.__Constructor.apply(this, arguments)},
    Property, mapMixin
  );
  Kefir.MappedProperty.prototype.__ClassName = 'MappedProperty'


  Observable.prototype.map = function(fn) {
    if (this instanceof Property) {
      return new Kefir.MappedProperty(this, fn);
    } else {
      return new Kefir.MappedStream(this, fn);
    }
  };







  // Filter

  var filterMixin = extend({}, mapMixin, {
    __handle: function(x){
      if (this.__mapFn(x)) {
        this._send(x);
      }
    }
  });

  Kefir.FilteredStream = inherit(
    function FilteredStream(){this.__Constructor.apply(this, arguments)},
    Stream, filterMixin
  );
  Kefir.FilteredStream.prototype.__ClassName = 'FilteredStream'

  Kefir.FilteredProperty = inherit(
    function FilteredProperty(){this.__Constructor.apply(this, arguments)},
    Property, filterMixin
  );
  Kefir.FilteredProperty.prototype.__ClassName = 'FilteredProperty'

  Observable.prototype.filter = function(fn) {
    if (this instanceof Property) {
      return new Kefir.FilteredProperty(this, fn);
    } else {
      return new Kefir.FilteredStream(this, fn);
    }
  };





  // TakeWhile

  var takeWhileMixin = extend({}, mapMixin, {
    __handle: function(x){
      if (this.__mapFn(x)) {
        this._send(x);
      } else {
        this._send(Kefir.END);
      }
    }
  });

  Kefir.TakeWhileStream = inherit(
    function TakeWhileStream(){this.__Constructor.apply(this, arguments)},
    Stream, takeWhileMixin
  );
  Kefir.TakeWhileStream.prototype.__ClassName = 'TakeWhileStream'

  Kefir.TakeWhileProperty = inherit(
    function TakeWhileProperty(){this.__Constructor.apply(this, arguments)},
    Property, takeWhileMixin
  );
  Kefir.TakeWhileProperty.prototype.__ClassName = 'TakeWhileProperty'

  Observable.prototype.takeWhile = function(fn) {
    if (this instanceof Property) {
      return new Kefir.TakeWhileProperty(this, fn);
    } else {
      return new Kefir.TakeWhileStream(this, fn);
    }
  };




  // Take

  Observable.prototype.take = function(n) {
    return withName('observable.take(n)', this.takeWhile(function(){
      return n-- > 0;
    }))
  };






  // FlatMap

  Kefir.FlatMappedStream = inherit(function FlatMappedStream(sourceStream, mapFn){
    Stream.call(this)
    this.__sourceStream = sourceStream;
    this.__plugged = [];
    this.__mapFn = mapFn;
    sourceStream.onEnd(this.__sendEnd, this);
  }, Stream, {

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
      var _this = this;
      stream.onEnd(function(){  _this.__unplug(stream)  });
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

  });

  Observable.prototype.flatMap = function(fn) {
    return new Kefir.FlatMappedStream(this, fn);
  };








  // Merge

  Kefir.MergedStream = inherit(function MergedStream(){
    Stream.call(this)
    this.__sources = firstArrOrToArr(arguments);
    for (var i = 0; i < this.__sources.length; i++) {
      assertStream(this.__sources[i]);
      this.__sources[i].onEnd(
        this.__unplugFor(this.__sources[i])
      );
    }
  }, Stream, {

    __ClassName: 'MergedStream',
    __objName: 'Kefir.merge(streams)',
    __onFirstIn: function(){
      for (var i = 0; i < this.__sources.length; i++) {
        this.__sources[i].on(this._send, this);
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
    __unplugFor: function(stream){
      var _this = this;
      return function(){  _this.__unplug(stream)  }
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

  Kefir.CombinedStream = inherit(function CombinedStream(sources, mapFn){
    Stream.call(this)

    this.__sources = sources;
    this.__cachedValues = new Array(sources.length);
    this.__hasCached = new Array(sources.length);
    this.__receiveFns = new Array(sources.length);
    this.__mapFn = mapFn;

    for (var i = 0; i < this.__sources.length; i++) {
      this.__receiveFns[i] = this.__receiveFor(i);
      this.__sources[i].onEnd( this.__unplugFor(i) );
    }

  }, Stream, {

    __ClassName: 'CombinedStream',
    __objName: 'Kefir.combine(streams, fn)',
    __onFirstIn: function(){
      for (var i = 0; i < this.__sources.length; i++) {
        if (this.__sources[i]) {
          this.__sources[i].on(this.__receiveFns[i]);
        }
      }
    },
    __onLastOut: function(){
      for (var i = 0; i < this.__sources.length; i++) {
        if (this.__sources[i]) {
          this.__sources[i].off(this.__receiveFns[i]);
        }
      }
    },
    __unplug: function(i){
      this.__sources[i].off(this.__receiveFns[i]);
      this.__sources[i] = null
      this.__receiveFns[i] = null
      if (isAllDead(this.__sources)) {
        this._send(Kefir.END);
      }
    },
    __unplugFor: function(i){
      var _this = this;
      return function(){  _this.__unplug(i)  }
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
    __receiveFor: function(i) {
      var _this = this;
      return function(x){
        _this.__receive(i, x);
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
      this.__receiveFns = null;
      this.__mapFn = null;
    }

  });

  Kefir.combine = function(sources, mapFn) {
    return new Kefir.CombinedStream(sources, mapFn);
  }

  Observable.prototype.combine = function(sources, mapFn) {
    return Kefir.combine([this].concat(sources), mapFn);
  }





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
    this.onEnd(function(){  log(Kefir.END)  });
  }




  // $::eventStream()

  var jQuery = global.jQuery || global.Zepto || (
    typeof window !== 'undefined' && (window.jQuery || window.Zepto)
  );
  if (jQuery) {

    jQuery.fn.eventStream = function(events, selector, eventTransformer){

      if (arguments.length === 2 && isFn(selector)) {
        eventTransformer = selector;
        selector = null;
      }

      if (!isFn(eventTransformer)) {
        eventTransformer = id;
      }

      var $this = this;

      function handler(){
        result._send( eventTransformer.apply(this, arguments) );
      }
      function sub(){
        $this.on(events, selector, handler);
      }
      function unsub(){
        $this.off(events, selector, handler);
      }

      var result = new Stream(sub, unsub);

      return result;
    }

  }





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
var Kefir = require('../../src/kefir.js');
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

},{"../../src/kefir.js":1,"../test-helpers":20}],3:[function(require,module,exports){
var Kefir = require('../../src/kefir.js');
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

},{"../../src/kefir.js":1,"../test-helpers":20}],4:[function(require,module,exports){
var Kefir = require('../../src/kefir.js');
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

},{"../../src/kefir.js":1,"../test-helpers":20}],5:[function(require,module,exports){
var Kefir = require('../../src/kefir.js');
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

},{"../../src/kefir.js":1,"../test-helpers":20}],6:[function(require,module,exports){
var Kefir = require('../../src/kefir.js');
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

},{"../../src/kefir.js":1,"../test-helpers":20}],7:[function(require,module,exports){
var Kefir = require('../../src/kefir.js');
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

},{"../../src/kefir.js":1,"../test-helpers":20}],8:[function(require,module,exports){
var Kefir = require('../../src/kefir.js');
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

},{"../../src/kefir.js":1,"../test-helpers":20}],9:[function(require,module,exports){
var Kefir = require('../../src/kefir.js');
var helpers = require('../test-helpers');


if (typeof window !== 'undefined'){

  describe("jQuery::eventStream()", function(){

    // it("works", function(done){

    //   // var stream1 = helpers.sampleStream([1, Kefir.END]);
    //   // var stream2 = Kefir.interval(30, 2).take(2);
    //   // var stream3 = Kefir.interval(45, 3).take(2);

    //   // // -1----------
    //   // // ---2---2----
    //   // // -----3-----3
    //   // var merged = stream1.merge(stream2, stream3);

    //   // helpers.captureOutput(merged, function(values){
    //   //   expect(values).toEqual([1, 2, 3, 2, 3]);
    //   //   done();
    //   // });

    //   jQuery('body').eventStream('')

    //   done();

    // }, 200);

    it("jquery itself works", function(){

      var count = 0;
      function handler(){ count++ }

      jQuery('body').on('click', handler);
      jQuery('body').trigger('click');
      jQuery('body').off('click', handler);

      expect(count).toBe(1);

    });



    it("just event name", function(done){

      var stream = jQuery('body').eventStream('click').take(2);

      helpers.captureOutput(stream, function(values){
        expect(values.length).toBe(2);
        done();
      });

      jQuery('body').trigger('click');
      jQuery('body').trigger('click');
      jQuery('body').trigger('click');

    });


    it("event name and selector", function(done){

      var stream = jQuery('body').eventStream('click', '.my-button').take(2);

      helpers.captureOutput(stream, function(values){
        expect(values.length).toBe(2);
        done();
      });

      $btn = jQuery('<button class="my-button">my-button</button>').appendTo('body');

      $btn.trigger('click');
      $btn.trigger('click');
      $btn.trigger('click');

      $btn.remove()

    });


    it("event name, selector, and transformer", function(done){

      var stream = jQuery('body')
        .eventStream('click', '.my-button', function(event){
          return this === event.currentTarget && jQuery(this).hasClass('my-button1');
        }).take(2);

      helpers.captureOutput(stream, function(values){
        expect(values).toEqual([true, true]);
        done();
      });

      $btn = jQuery('<button class="my-button">my-button</button>').appendTo('body');

      $btn.trigger('click');
      $btn.trigger('click');
      $btn.trigger('click');

      $btn.remove()

    });



    // it("just event name and selector", function(done){

    //   var stream = jQuery('body', ).eventStream('click').take(2);

    //   helpers.captureOutput(stream, function(values){
    //     expect(values.length).toBe(2);
    //     done();
    //   });

    // });


  });

}

},{"../../src/kefir.js":1,"../test-helpers":20}],10:[function(require,module,exports){
var Kefir = require('../../src/kefir.js');
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

},{"../../src/kefir.js":1,"../test-helpers":20}],11:[function(require,module,exports){
var Kefir = require('../../src/kefir.js');
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

},{"../../src/kefir.js":1,"../test-helpers":20}],12:[function(require,module,exports){
var Kefir = require('../../src/kefir.js');
var helpers = require('../test-helpers');



describe("Never:", function(){

  it("works", function(done){

    helpers.captureOutput(Kefir.never(), function(values){
      expect(values).toEqual([]);
      done();
    });

  }, 100);


});

},{"../../src/kefir.js":1,"../test-helpers":20}],13:[function(require,module,exports){
var Kefir = require('../../src/kefir.js');
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

},{"../../src/kefir.js":1,"../test-helpers":20}],14:[function(require,module,exports){
var Kefir = require('../../src/kefir.js');
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

},{"../../src/kefir.js":1,"../test-helpers":20}],15:[function(require,module,exports){
var Kefir = require('../../src/kefir.js');
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

},{"../../src/kefir.js":1,"../test-helpers":20}],16:[function(require,module,exports){
var Kefir = require('../../src/kefir.js');
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

},{"../../src/kefir.js":1,"../test-helpers":20}],17:[function(require,module,exports){
var Kefir = require('../../src/kefir.js');
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

},{"../../src/kefir.js":1,"../test-helpers":20}],18:[function(require,module,exports){
var Kefir = require('../../src/kefir.js');
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

},{"../../src/kefir.js":1,"../test-helpers":20}],19:[function(require,module,exports){
var Kefir = require('../../src/kefir.js');
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

},{"../../src/kefir.js":1,"../test-helpers":20}],20:[function(require,module,exports){
var Kefir = require('../src/kefir.js');

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

},{"../src/kefir.js":1}]},{},[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])