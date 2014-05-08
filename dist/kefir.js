/*! Kefir - 0.1.0
 *  https://github.com/pozadi/kefir
 */
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

  function createObj(proto) {
    var F = function(){};
    F.prototype = proto;
    return new F();
  }

  function extend(to, from) {
    for (var prop in from) {
      if(from.hasOwnProperty(prop)) {
        to[prop] = from[prop];
      }
    }
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

  function noop(){}

  function firstArrOrToArr(args) {
    if (Object.prototype.toString.call(args[0]) === '[object Array]') {
      return args[0];
    }
    return Array.prototype.slice.call(args);
  }







  // Base Stream class

  Kefir.Stream = inherit(function Stream(onFirstSubscribed, onLastUsubscribed){

    // __onFirstSubscribed, __onLastUsubscribed can also be added to prototype of child classes
    if (typeof onFirstSubscribed === "function") {
      this.__onFirstSubscribed = onFirstSubscribed;
    }
    if (typeof onFirstSubscribed === "function") {
      this.__onLastUsubscribed = onLastUsubscribed;
    }

    this.__subscribers = [];
    this.__endSubscribers = [];
  }, Object, {

    _send: function(value) {
      if (!this.isEnded()) {
        if (value === Kefir.END) {
          this.__end();
        } else {
          for (var i = 0; i < this.__subscribers.length; i++) {
            var callback = this.__subscribers[i];
            if (typeof callback === "function") {
              if(Kefir.NO_MORE === callback(value)) {
                this.unsubscribe(callback);
              }
            }
          }
        }
      }
    },
    subscribe: function(callback) {
      if (!this.isEnded()) {
        this.__subscribers.push(callback);
        if (this.__subscribers.length === 1) {
          this.__onFirstSubscribed();
        }
      }
    },
    unsubscribe: function(callback) {
      if (!this.isEnded()) {
        killInArray(this.__subscribers, callback);
        if (isAllDead(this.__subscribers)) {
          this.__subscribers = [];
          this.__onLastUsubscribed();
        }
      }
    },
    onEnd: function(callback) {
      if (this.isEnded()) {
        callback();
      } else {
        this.__endSubscribers.push(callback);
      }
    },
    offEnd: function(callback) {
      if (!this.isEnded()) {
        removeFromArray(this.__endSubscribers, callback);
      }
    },
    isEnded: function() {
      return this.__subscribers === null;
    },
    hasSubscribers: function(){
      return !this.isEnded() && this.__subscribers.length > 0;
    },
    __onFirstSubscribed: noop,
    __onLastUsubscribed: noop,
    __end: function() {
      if (!this.isEnded()) {
        this.__onLastUsubscribed();
        if (this.hasOwnProperty(this.__onFirstSubscribed)) {
          this.__onFirstSubscribed = null;
        }
        if (this.hasOwnProperty(this.__onLastUsubscribed)) {
          this.__onLastUsubscribed = null;
        }
        this.__subscribers = null;
        for (var i = 0; i < this.__endSubscribers.length; i++) {
          this.__endSubscribers[i]();
        }
        this.__endSubscribers = null;
      }
    }

  });






  // Never

  Kefir.__neverObj = createObj(Kefir.Stream.prototype);
  Kefir.__neverObj.__subscribers = null;

  Kefir.never = function() {
    return Kefir.__neverObj;
  }




  // Once

  Kefir.Once = inherit(function Once(value){
    Kefir.Stream.call(this);
    this.__value = value;
  }, Kefir.Stream, {

    __onFirstSubscribed: function(){
      this._send(this.__value);
      this.__value = null;
      this._send(Kefir.END);
    }

  });

  Kefir.once = function(value) {
    return new Kefir.Once(value);
  }




  // Property

  Kefir.Property = inherit(function Property(onFirstSubscribed, onLastUsubscribed, initialValue){
    Kefir.Stream.call(this, onFirstSubscribed, onLastUsubscribed);
    this.__hasCached = (typeof initialValue !== "undefined");
    this.__cached = initialValue;
  }, Kefir.Stream, {

    subscribe: function(callback) {
      if (this.__hasCached) {
        callback(this.__cached);
      }
      Kefir.Stream.prototype.subscribe.call(this, callback);
    },
    _send: function(value) {
      if (!this.isEnded()){
        this.__hasCached = true;
        this.__cached = value;
      }
      Kefir.Stream.prototype._send.call(this, value);
    }

  })

  Kefir.PropertyFromStream = inherit(function PropertyFromStream(sourceStream, initialValue){
    Kefir.Property.call(this, null, null, initialValue)
    this.__sourceStream = sourceStream;
    var _this = this;
    this.__deliver = function(x){  _this._send(x)  }
    sourceStream.onEnd(function(){  _this._send(Kefir.END)  })
  }, Kefir.Property, {

    __onFirstSubscribed: function(){
      this.__sourceStream.subscribe(this.__deliver);
    },
    __onLastUsubscribed: function(){
      this.__sourceStream.unsubscribe(this.__deliver);
    },
    __end: function(){
      Kefir.Stream.prototype.__end.call(this);
      this.__sourceStream = null;
      this.__deliver = null;
    }

  })

  Kefir.toProperty = function(sourceStream, initialValue){
    return new Kefir.PropertyFromStream(sourceStream, initialValue);
  }
  Kefir.Stream.prototype.toProperty = function(initialValue){
    return Kefir.toProperty(this, initialValue);
  }






  // fromBinder

  Kefir.FromBinderStream = inherit(function FromBinderStream(generator){
    Kefir.Stream.call(this);
    this.__generator = generator;
    var _this = this;
    this.__deliver = function(x){  _this._send(x)  }
  }, Kefir.Stream, {

    __onFirstSubscribed: function(){
      this.__generatorUsubscriber = this.__generator(this.__deliver);
    },
    __onLastUsubscribed: function(){
      if (typeof this.__generatorUsubscriber === "function") {
        this.__generatorUsubscriber();
      }
      this.__generatorUsubscriber = null;
    },
    __end: function(){
      Kefir.Stream.prototype.__end.call(this);
      this.__generator = null;
      this.__deliver = null;
    }

  })

  Kefir.fromBinder = function(generator){
    return new Kefir.FromBinderStream(generator);
  }








  // Bus

  Kefir.Bus = inherit(function Bus(){
    Kefir.Stream.call(this);
    this.__plugged = [];
    var _this = this;
    this.push = function(x){  _this._send(x)  }
  }, Kefir.Stream, {

    plug: function(stream){
      if (!this.isEnded()) {
        this.__plugged.push(stream);
        if (this.hasSubscribers()) {
          stream.subscribe(this.push);
        }
        var _this = this;
        stream.onEnd(function(){  _this.unplug(stream)  });
      }
    },
    unplug: function(stream){
      if (!this.isEnded()) {
        stream.unsubscribe(this.push);
        removeFromArray(this.__plugged, stream);
      }
    },
    end: function(){
      this._send(Kefir.END);
    },
    __onFirstSubscribed: function(){
      for (var i = 0; i < this.__plugged.length; i++) {
        this.__plugged[i].subscribe(this.push);
      }
    },
    __onLastUsubscribed: function(){
      for (var i = 0; i < this.__plugged.length; i++) {
        this.__plugged[i].unsubscribe(this.push);
      }
    },
    __end: function(){
      Kefir.Stream.prototype.__end.call(this);
      this.__plugged = null;
      this.push = noop;
    }

  });










  // Map

  Kefir.MappedStream = inherit(function MappedStream(sourceStream, mapFn){
    Kefir.Stream.call(this)
    this.__sourceStream = sourceStream;
    var _this = this;
    this.__deliver = function(x){  _this._send(mapFn(x))  }
    sourceStream.onEnd(function(){  _this._send(Kefir.END)  })
  }, Kefir.Stream, {

    __onFirstSubscribed: function(){
      this.__sourceStream.subscribe(this.__deliver);
    },
    __onLastUsubscribed: function(){
      this.__sourceStream.unsubscribe(this.__deliver);
    },
    __end: function(){
      Kefir.Stream.prototype.__end.call(this);
      this.__sourceStream = null;
      this.__deliver = null;
    }

  });

  Kefir.map = function(stream, mapFn) {
    return new Kefir.MappedStream(stream, mapFn);
  }

  Kefir.Stream.prototype.map = function(fn) {
    return Kefir.map(this, fn);
  };





  // Filter

  Kefir.FilteredStream = inherit(function FilteredStream(sourceStream, filterFn){
    Kefir.Stream.call(this);
    this.__sourceStream = sourceStream;
    var _this = this;
    this.__deliver = function(x){
      if (filterFn(x)) {
        _this._send(x);
      }
    }
    sourceStream.onEnd(function(){  _this._send(Kefir.END)  })
  }, Kefir.MappedStream);

  Kefir.filter = function(stream, filterFn) {
    return new Kefir.FilteredStream(stream, filterFn);
  }

  Kefir.Stream.prototype.filter = function(fn) {
    return Kefir.filter(this, fn);
  };




  // TakeWhile

  Kefir.TakeWhileStream = inherit(function TakeWhileStream(sourceStream, filterFn){
    Kefir.Stream.call(this);
    this.__sourceStream = sourceStream;
    var _this = this;
    this.__deliver = function(x){
      if (filterFn(x)) {
        _this._send(x);
      } else {
        _this._send(Kefir.END);
      }
    }
    sourceStream.onEnd(function(){  _this._send(Kefir.END)  })
  }, Kefir.MappedStream);

  Kefir.takeWhile = function(stream, filterFn) {
    return new Kefir.TakeWhileStream(stream, filterFn);
  }

  Kefir.Stream.prototype.takeWhile = function(fn) {
    return Kefir.takeWhile(this, fn);
  };




  // Take

  Kefir.take = function(stream, n) {
    return new Kefir.TakeWhileStream(stream, function(){
      return n-- > 0;
    });
  }

  Kefir.Stream.prototype.take = function(n) {
    return Kefir.take(this, n);
  };






  // FlatMap

  Kefir.FlatMappedStream = inherit(function FlatMappedStream(sourceStream, mapFn){
    Kefir.Stream.call(this)
    this.__sourceStream = sourceStream;
    this.__plugged = [];
    var _this = this;
    this.__deliver = function(x){ _this._send(x)  }
    this.__plugResult = function(x){  _this.__plug(mapFn(x))  }
    sourceStream.onEnd(function(){  _this._send(Kefir.END)  })
  }, Kefir.Stream, {

    __onFirstSubscribed: function(){
      this.__sourceStream.subscribe(this.__plugResult);
      for (var i = 0; i < this.__plugged.length; i++) {
        this.__plugged[i].subscribe(this.__deliver);
      }
    },
    __onLastUsubscribed: function(){
      this.__sourceStream.unsubscribe(this.__plugResult);
      for (var i = 0; i < this.__plugged.length; i++) {
        this.__plugged[i].unsubscribe(this.__deliver);
      }
    },
    __plug: function(stream){
      this.__plugged.push(stream);
      if (this.hasSubscribers()) {
        stream.subscribe(this.__deliver);
      }
      var _this = this;
      stream.onEnd(function(){  _this.__unplug(stream)  });
    },
    __unplug: function(stream){
      if (!this.isEnded()) {
        stream.unsubscribe(this.__deliver);
        removeFromArray(this.__plugged, stream);
      }
    },
    __end: function(){
      Kefir.Stream.prototype.__end.call(this);
      this.__sourceStream = null;
      this.__deliver = null;
      this.__plugResult = null;
      this.__plugged = null;
    }

  });

  Kefir.flatMap = function(stream, mapFn) {
    return new Kefir.FlatMappedStream(stream, mapFn);
  }

  Kefir.Stream.prototype.flatMap = function(fn) {
    return Kefir.flatMap(this, fn);
  };








  // Merge

  Kefir.MergedStream = inherit(function MergedStream(){
    Kefir.Stream.call(this)
    this.__sourceStreams = firstArrOrToArr(arguments);
    var _this = this;
    this.__deliver = function(x){  _this._send(x)  }
    for (var i = 0; i < this.__sourceStreams.length; i++) {
      this.__sourceStreams[i].onEnd(
        this.__unplugFor(this.__sourceStreams[i])
      );
    }
  }, Kefir.Stream, {

    __onFirstSubscribed: function(){
      for (var i = 0; i < this.__sourceStreams.length; i++) {
        this.__sourceStreams[i].subscribe(this.__deliver);
      }
    },
    __onLastUsubscribed: function(){
      for (var i = 0; i < this.__sourceStreams.length; i++) {
        this.__sourceStreams[i].unsubscribe(this.__deliver);
      }
    },
    __unplug: function(stream){
      stream.unsubscribe(this.__deliver);
      removeFromArray(this.__sourceStreams, stream);
      if (this.__sourceStreams.length === 0) {
        this._send(Kefir.END);
      }
    },
    __unplugFor: function(stream){
      var _this = this;
      return function(){  _this.__unplug(stream)  }
    },
    __end: function(){
      Kefir.Stream.prototype.__end.call(this);
      this.__sourceStreams = null;
      this.__deliver = null;
    }

  });

  Kefir.merge = function() {
    return new Kefir.MergedStream(firstArrOrToArr(arguments));
  }

  Kefir.Stream.prototype.merge = function() {
    return Kefir.merge([this].concat(firstArrOrToArr(arguments)));
  }









  // Combine

  Kefir.CombinedStream = inherit(function CombinedStream(sourceStreams, mapFn){
    Kefir.Stream.call(this)

    this.__sourceStreams = sourceStreams;
    this.__cachedValues = new Array(sourceStreams.length);
    this.__hasCached = new Array(sourceStreams.length);
    this.__receiveFns = new Array(sourceStreams.length);
    this.__mapFn = mapFn;

    for (var i = 0; i < this.__sourceStreams.length; i++) {
      this.__receiveFns[i] = this.__receiveFor(i);
      this.__sourceStreams[i].onEnd( this.__unplugFor(i) );
    }

  }, Kefir.Stream, {

    __onFirstSubscribed: function(){
      for (var i = 0; i < this.__sourceStreams.length; i++) {
        if (this.__sourceStreams[i]) {
          this.__sourceStreams[i].subscribe(this.__receiveFns[i]);
        }
      }
    },
    __onLastUsubscribed: function(){
      for (var i = 0; i < this.__sourceStreams.length; i++) {
        if (this.__sourceStreams[i]) {
          this.__sourceStreams[i].unsubscribe(this.__receiveFns[i]);
        }
      }
    },
    __unplug: function(i){
      this.__sourceStreams[i].unsubscribe(this.__receiveFns[i]);
      this.__sourceStreams[i] = null
      this.__receiveFns[i] = null
      if (this.__allDead()) {
        this._send(Kefir.END);
      }
    },
    __unplugFor: function(i){
      var _this = this;
      return function(){  _this.__unplug(i)  }
    },
    __receive: function(i, value) {
      this.__hasCached[i] = true;
      this.__cachedValues[i] = value;
      if (this.__allCached()) {
        if (typeof this.__mapFn === "function") {
          this._send(this.__mapFn.apply(null, this.__cachedValues));
        } else {
          this._send(this.__cachedValues.slice(0));
        }
      }
    },
    __receiveFor: function(i) {
      var _this = this;
      return function(value){
        _this.__receive(i, value);
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
    __allDead: function(){
      for (var i = 0; i < this.__sourceStreams.length; i++) {
        if (this.__sourceStreams[i]) {
          return false;
        }
      }
      return true;
    },
    __end: function(){
      Kefir.Stream.prototype.__end.call(this);
      this.__sourceStreams = null;
      this.__cachedValues = null;
      this.__hasCached = null;
      this.__receiveFns = null;
      this.__mapFn = null;
    }

  });

  Kefir.combine = function(streams, mapFn) {
    return new Kefir.CombinedStream(streams, mapFn);
  }

  Kefir.Stream.prototype.combine = function(streams, mapFn) {
    return Kefir.combine([this].concat(streams), mapFn);
  }





  // Log

  Kefir.Stream.prototype.log = function(text) {
    function log(value){
      if (text) {
        console.log(text, value);
      } else {
        console.log(value);
      }
    }
    this.subscribe(log);
    this.onEnd(function(){  log(Kefir.END)  });
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
