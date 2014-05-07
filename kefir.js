(function(){
  "use strict";


  // Class method names convention
  //
  // __foo: can be used only inside class or child class
  // _foo: can be used only inside Kefir
  // foo: public API





  var Kefir = {};

  Kefir.END = ['<end>'];



  // Utils

  function createObj(proto) {
    var F = function(){};
    F.prototype = proto;
    return new F();
  }

  function inherit(Child, Parent) {
    Child.prototype = createObj(Parent.prototype);
    Child.prototype.constructor = Child;
    Child.prototype.__superConstructor = Parent;
    Child.prototype.__superProto = Parent.prototype;
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

  function noop(){}

  function firstArrOrToArr(args) {
    if (Object.prototype.toString.call(args[0]) === '[object Array]') {
      return args[0];
    }
    return Array.prototype.slice.call(args);
  }







  // Base Stream class

  Kefir.Stream = function Stream(onFirstSubscribed, onLastUsubscribed){

    // __onFirstSubscribed, __onLastUsubscribed can also be added to prototype of child classes
    if (typeof onFirstSubscribed === "function") {
      this.__onFirstSubscribed = onFirstSubscribed;
    }
    if (typeof onFirstSubscribed === "function") {
      this.__onLastUsubscribed = onLastUsubscribed;
    }

    this.__subscribers = [];
    this.__endSubscribers = [];
  }

  Kefir.Stream.prototype._send = function(value) {
    if (!this.isEnded()) {
      if (value === Kefir.END) {
        this.__end();
      } else {
        for (var i = 0; i < this.__subscribers.length; i++) {
          this.__subscribers[i](value);
        }
      }
    }
  }

  Kefir.Stream.prototype.subscribe = function(callback) {
    if (!this.isEnded()) {
      if (this.__subscribers.length === 0) {
        this.__onFirstSubscribed();
      }
      this.__subscribers.push(callback);
    }
  }
  Kefir.Stream.prototype.unsubscribe = function(callback) {
    if (!this.isEnded()) {
      removeFromArray(this.__subscribers, callback);
      if (this.__subscribers.length === 0) {
        this.__onLastUsubscribed();
      }
    }
  }
  Kefir.Stream.prototype.onEnd = function(callback) {
    if (this.isEnded()) {
      callback();
    } else {
      this.__endSubscribers.push(callback);
    }
  }
  Kefir.Stream.prototype.offEnd = function(callback) {
    if (!this.isEnded()) {
      removeFromArray(this.__endSubscribers, callback);
    }
  }
  Kefir.Stream.prototype.isEnded = function() {
    return this.__subscribers === null;
  }
  Kefir.Stream.prototype.hasSubscribers = function(){
    return !this.isEnded() && this.__subscribers.length > 0;
  }


  Kefir.Stream.prototype.__onFirstSubscribed = noop
  Kefir.Stream.prototype.__onLastUsubscribed = noop

  Kefir.Stream.prototype.__end = function() {
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





  // Property
  // FIXME: property should never end. should it?

  Kefir.Property = inherit(function Property(onFirstSubscribed, onLastUsubscribed, initialValue){
    this.__superConstructor(onFirstSubscribed, onLastUsubscribed);
    this.__hasCached = (typeof initialValue !== "undefined");
    this.__cached = initialValue;
  }, Kefir.Stream);
  Kefir.Property.prototype.subscribe = function(callback) {
    if (this.__hasCached) {
      callback(this.__cached);
    }
    this.__superProto.subscribe.call(this, callback);
  }
  Kefir.Property.prototype._send = function(value) {
    this.__hasCached = true;
    if (!this.isEnded()){
      this.__cached = value;
    }
    this.__superProto._send.call(this, value);
  }
  Kefir.toProperty = function(sourceStream, initialValue){
    var send = function(val){  resultStream._send(val)  }
    var onFirstIn = function(){  sourceStream.subscribe(send)  }
    var onLastOut = function(){  sourceStream.unsubscribe(send)  }
    sourceStream.onEnd(function(){ resultStream._send(Kefir.END) })
    var resultStream = new Kefir.Property(onFirstIn, onLastOut, initialValue);
    return resultStream;
  }
  Kefir.Stream.prototype.toProperty = function(initialValue){
    return Kefir.toProperty(this, initialValue);
  }






  // fromBinder

  Kefir.fromBinder = function(generator){
    var generatorUsubscriber = null;
    var send = function(val){  stream._send(val)  }

    var subToGenerator = function(){
      generatorUsubscriber = generator(send);
    }
    var unsubFromGenerator = function(){
      if (typeof generatorUsubscriber === "function") {
        generatorUsubscriber();
      }
      generatorUsubscriber = null;
    }

    var stream = new Kefir.Stream(subToGenerator, unsubFromGenerator);
    return stream;
  }








  // Bus

  Kefir.Bus = inherit(function Bus(){
    this.__superConstructor();
    this.__plugged = [];
    var _this = this;
    this.push = function(x){  _this._send(x)  }
  }, Kefir.Stream);

  Kefir.Bus.prototype.plug = function(stream){
    if (!this.isEnded()) {
      this.__plugged.push(stream);
      if (this.hasSubscribers()) {
        stream.subscribe(this.push);
      }
      var _this = this;
      stream.onEnd(function(){  _this.unplug(stream)  });
    }
  };

  Kefir.Bus.prototype.unplug = function(stream){
    if (!this.isEnded()) {
      stream.unsubscribe(this.push);
      removeFromArray(this.__plugged, stream);
    }
  };

  Kefir.Bus.prototype.end = function(){
    this._send(Kefir.END);
  }

  Kefir.Bus.prototype.__onFirstSubscribed = function(){
    for (var i = 0; i < this.__plugged.length; i++) {
      this.__plugged[i].subscribe(this.push);
    }
  }
  Kefir.Bus.prototype.__onLastUsubscribed = function(){
    for (var i = 0; i < this.__plugged.length; i++) {
      this.__plugged[i].unsubscribe(this.push);
    }
  }

  Kefir.Bus.prototype.__end = function(){
    this.__superProto.__end.call(this);
    this.__plugged = null;
    this.push = noop;
  }








  // Map

  Kefir.MappedStream = inherit(function MappedStream(sourceStream, mapFn){
    this.__superConstructor()
    this.__sourceStream = sourceStream;
    var _this = this;
    this.__deliver = function(x){  _this._send(mapFn(x))  }
    sourceStream.onEnd(function(){  _this._send(Kefir.END)  })
  }, Kefir.Stream);

  Kefir.MappedStream.prototype.__onFirstSubscribed = function(){
    this.__sourceStream.subscribe(this.__deliver);
  }
  Kefir.MappedStream.prototype.__onLastUsubscribed = function(){
    this.__sourceStream.unsubscribe(this.__deliver);
  }
  Kefir.MappedStream.prototype.__end = function(){
    this.__superProto.__end.call(this);
    this.__sourceStream = null;
    this.__deliver = null;
  }

  Kefir.map = function(stream, mapFn) {
    return new Kefir.MappedStream(stream, mapFn);
  }

  Kefir.Stream.prototype.map = function(fn) {
    return Kefir.map(this, fn);
  };






  // FlatMap

  Kefir.FlatMappedStream = inherit(function FlatMappedStream(sourceStream, mapFn){
    this.__superConstructor()
    this.__sourceStream = sourceStream;
    this.__plugged = [];
    var _this = this;
    this.__deliver = function(x){ _this._send(x)  }
    this.__plugResult = function(x){  _this.__plug(mapFn(x))  }
    sourceStream.onEnd(function(){  _this._send(Kefir.END)  })
  }, Kefir.Stream);
  Kefir.FlatMappedStream.prototype.__onFirstSubscribed = function(){
    this.__sourceStream.subscribe(this.__plugResult);
    for (var i = 0; i < this.__plugged.length; i++) {
      this.__plugged[i].subscribe(this.__deliver);
    }
  }
  Kefir.FlatMappedStream.prototype.__onLastUsubscribed = function(){
    this.__sourceStream.unsubscribe(this.__plugResult);
    for (var i = 0; i < this.__plugged.length; i++) {
      this.__plugged[i].unsubscribe(this.__deliver);
    }
  }
  Kefir.FlatMappedStream.prototype.__plug = function(stream){
    this.__plugged.push(stream);
    if (this.hasSubscribers()) {
      stream.subscribe(this.__deliver);
    }
    var _this = this;
    stream.onEnd(function(){  _this.__unplug(stream)  });
  };
  Kefir.FlatMappedStream.prototype.__unplug = function(stream){
    if (!this.isEnded()) {
      stream.unsubscribe(this.__deliver);
      removeFromArray(this.__plugged, stream);
    }
  };
  Kefir.FlatMappedStream.prototype.__end = function(){
    this.__superProto.__end.call(this);
    this.__sourceStream = null;
    this.__deliver = null;
    this.__plugResult = null;
    this.__plugged = null;
  }

  Kefir.flatMap = function(stream, mapFn) {
    return new Kefir.FlatMappedStream(stream, mapFn);
  }

  Kefir.Stream.prototype.flatMap = function(fn) {
    return Kefir.flatMap(this, fn);
  };





  // Merge

  Kefir.MergedStream = inherit(function MergedStream(){
    this.__superConstructor()
    this.__sourceStreams = firstArrOrToArr(arguments);
    var _this = this;
    this.__deliver = function(x){  _this._send(x)  }
    for (var i = 0; i < this.__sourceStreams.length; i++) {
      this.__sourceStreams[i].onEnd(
        this.__unplugFor(this.__sourceStreams[i])
      );
    }
  }, Kefir.Stream);

  Kefir.MergedStream.prototype.__onFirstSubscribed = function(){
    for (var i = 0; i < this.__sourceStreams.length; i++) {
      this.__sourceStreams[i].subscribe(this.__deliver);
    }
  }
  Kefir.MergedStream.prototype.__onLastUsubscribed = function(){
    for (var i = 0; i < this.__sourceStreams.length; i++) {
      this.__sourceStreams[i].unsubscribe(this.__deliver);
    }
  }
  Kefir.MergedStream.prototype.__unplug = function(stream){
    stream.unsubscribe(this.__deliver);
    removeFromArray(this.__sourceStreams, stream);
    if (this.__sourceStreams.length === 0) {
      this._send(Kefir.END);
    }
  }
  Kefir.MergedStream.prototype.__unplugFor = function(stream){
    var _this = this;
    return function(){
      _this.__unplug(stream);
    }
  }
  Kefir.MergedStream.prototype.__end = function(){
    this.__superProto.__end.call(this);
    this.__sourceStreams = null;
    this.__deliver = null;
  }

  Kefir.merge = function() {
    return new Kefir.MergedStream(firstArrOrToArr(arguments));
  }

  Kefir.Stream.prototype.merge = function() {
    return Kefir.merge([this].concat(firstArrOrToArr(arguments)));
  }






  // Log

  Kefir.Stream.prototype.log = function(text) {
    this.subscribe(function(value){
      if (text) {
        console.log(text, value);
      } else {
        console.log(value);
      }
    });
  };








  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return Kefir;
    });
    this.Kefir = Kefir;
  } else if (typeof module === "object" && typeof exports === "object") {
    module.exports = Kefir;
    Kefir.Kefir = Kefir;
  } else {
    this.Kefir = Kefir;
  }




}());
