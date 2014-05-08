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



  // Utils

  function createObj(proto) {
    var F = function(){};
    F.prototype = proto;
    return new F();
  }

  function inherit(Child, Parent) {
    Child.prototype = createObj(Parent.prototype);
    Child.prototype.constructor = Child;
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
      this.__subscribers.push(callback);
      if (this.__subscribers.length === 1) {
        this.__onFirstSubscribed();
      }
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
  }, Kefir.Stream);

  Kefir.Once.prototype.__onFirstSubscribed = function(){
    this._send(this.__value);
    this.__value = null;
    this._send(Kefir.END);
  }

  Kefir.once = function(value) {
    return new Kefir.Once(value);
  }




  // Property

  Kefir.Property = inherit(function Property(onFirstSubscribed, onLastUsubscribed, initialValue){
    Kefir.Stream.call(this, onFirstSubscribed, onLastUsubscribed);
    this.__hasCached = (typeof initialValue !== "undefined");
    this.__cached = initialValue;
  }, Kefir.Stream);
  Kefir.Property.prototype.subscribe = function(callback) {
    if (this.__hasCached) {
      callback(this.__cached);
    }
    Kefir.Stream.prototype.subscribe.call(this, callback);
  }
  Kefir.Property.prototype._send = function(value) {
    this.__hasCached = true;
    if (!this.isEnded()){
      this.__cached = value;
    }
    Kefir.Stream.prototype._send.call(this, value);
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

  Kefir.FromBinderStream = inherit(function FromBinderStream(generator){
    Kefir.Stream.call(this);
    this.__generator = generator;
    var _this = this;
    this.__deliver = function(x){  _this._send(x)  }
  }, Kefir.Stream)

  Kefir.FromBinderStream.prototype.__onFirstSubscribed = function(){
    this.__generatorUsubscriber = this.__generator(this.__deliver);
  }
  Kefir.FromBinderStream.prototype.__onLastUsubscribed = function(){
    if (typeof this.__generatorUsubscriber === "function") {
      this.__generatorUsubscriber();
    }
    this.__generatorUsubscriber = null;
  }
  Kefir.FromBinderStream.prototype.__end = function(){
    Kefir.Stream.prototype.__end.call(this);
    this.__generator = null;
    this.__deliver = null;
  }

  Kefir.fromBinder = function(generator){
    return new Kefir.FromBinderStream(generator);
  }








  // Bus

  Kefir.Bus = inherit(function Bus(){
    Kefir.Stream.call(this);
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
    Kefir.Stream.prototype.__end.call(this);
    this.__plugged = null;
    this.push = noop;
  }








  // Map

  Kefir.MappedStream = inherit(function MappedStream(sourceStream, mapFn){
    Kefir.Stream.call(this)
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
    Kefir.Stream.prototype.__end.call(this);
    this.__sourceStream = null;
    this.__deliver = null;
  }

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






  // FlatMap

  Kefir.FlatMappedStream = inherit(function FlatMappedStream(sourceStream, mapFn){
    Kefir.Stream.call(this)
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
    Kefir.Stream.prototype.__end.call(this);
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
    Kefir.Stream.call(this)
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
    return function(){  _this.__unplug(stream)  }
  }
  Kefir.MergedStream.prototype.__end = function(){
    Kefir.Stream.prototype.__end.call(this);
    this.__sourceStreams = null;
    this.__deliver = null;
  }

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

  }, Kefir.Stream);

  Kefir.CombinedStream.prototype.__onFirstSubscribed = function(){
    for (var i = 0; i < this.__sourceStreams.length; i++) {
      if (this.__sourceStreams[i]) {
        this.__sourceStreams[i].subscribe(this.__receiveFns[i]);
      }
    }
  }
  Kefir.CombinedStream.prototype.__onLastUsubscribed = function(){
    for (var i = 0; i < this.__sourceStreams.length; i++) {
      if (this.__sourceStreams[i]) {
        this.__sourceStreams[i].unsubscribe(this.__receiveFns[i]);
      }
    }
  }

  Kefir.CombinedStream.prototype.__unplug = function(i){
    this.__sourceStreams[i].unsubscribe(this.__receiveFns[i]);
    this.__sourceStreams[i] = null
    this.__receiveFns[i] = null
    if (this.__allDead()) {
      this._send(Kefir.END);
    }
  }
  Kefir.CombinedStream.prototype.__unplugFor = function(i){
    var _this = this;
    return function(){  _this.__unplug(i)  }
  }

  Kefir.CombinedStream.prototype.__receive = function(i, value) {
    this.__hasCached[i] = true;
    this.__cachedValues[i] = value;
    if (this.__allCached()) {
      if (typeof this.__mapFn === "function") {
        this._send(this.__mapFn.apply(null, this.__cachedValues));
      } else {
        this._send(this.__cachedValues.slice(0));
      }
    }
  }

  Kefir.CombinedStream.prototype.__receiveFor = function(i) {
    var _this = this;
    return function(value){
      _this.__receive(i, value);
    }
  }

  Kefir.CombinedStream.prototype.__allCached = function(){
    for (var i = 0; i < this.__hasCached.length; i++) {
      if (!this.__hasCached[i]) {
        return false;
      }
    }
    return true;
  }

  Kefir.CombinedStream.prototype.__allDead = function(){
    for (var i = 0; i < this.__sourceStreams.length; i++) {
      if (this.__sourceStreams[i]) {
        return false;
      }
    }
    return true;
  }

  Kefir.CombinedStream.prototype.__end = function(){
    Kefir.Stream.prototype.__end.call(this);
    this.__sourceStreams = null;
    this.__cachedValues = null;
    this.__hasCached = null;
    this.__receiveFns = null;
    this.__mapFn = null;
  }

  Kefir.combine = function(streams, mapFn) {
    return new Kefir.CombinedStream(streams, mapFn);
  }

  Kefir.Stream.prototype.combine = function(streams, mapFn) {
    return Kefir.combine([this].concat(streams), mapFn);
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
    global.Kefir = Kefir;
  } else if (typeof module === "object" && typeof exports === "object") {
    module.exports = Kefir;
    Kefir.Kefir = Kefir;
  } else {
    global.Kefir = Kefir;
  }

}(this));

},{}],2:[function(require,module,exports){
var Kefir = require('../../kefir.js');
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
    stream.subscribe(function(value){
      result1.push(value);
    });

    var result2 = [];
    stream.subscribe(function(value){
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
    stream.subscribe(function(value){
      result1.push(value);
    });

    var result2 = [];
    var unsubscriber = function(value){
      result2.push(value);
    }
    stream.subscribe(unsubscriber);
    stream.unsubscribe(unsubscriber);

    stream.onEnd(function(){
      expect(result1).toEqual([1, 2]);
      expect(result2).toEqual([]);
      done();
    });

  }, 100);


});

},{"../../kefir.js":1,"../test-helpers":13}],3:[function(require,module,exports){
var Kefir = require('../../kefir.js');
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

},{"../../kefir.js":1,"../test-helpers":13}],4:[function(require,module,exports){
var Kefir = require('../../kefir.js');
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

});

},{"../../kefir.js":1,"../test-helpers":13}],5:[function(require,module,exports){
var Kefir = require('../../kefir.js');
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


});

},{"../../kefir.js":1,"../test-helpers":13}],6:[function(require,module,exports){
var Kefir = require('../../kefir.js');
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

},{"../../kefir.js":1,"../test-helpers":13}],7:[function(require,module,exports){
var Kefir = require('../../kefir.js');
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


});

},{"../../kefir.js":1,"../test-helpers":13}],8:[function(require,module,exports){
var Kefir = require('../../kefir.js');
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

},{"../../kefir.js":1,"../test-helpers":13}],9:[function(require,module,exports){
var Kefir = require('../../kefir.js');
var helpers = require('../test-helpers');



describe("Never:", function(){

  it("works", function(done){

    helpers.captureOutput(Kefir.never(), function(values){
      expect(values).toEqual([]);
      done();
    });

  }, 100);


});

},{"../../kefir.js":1,"../test-helpers":13}],10:[function(require,module,exports){
var Kefir = require('../../kefir.js');
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

},{"../../kefir.js":1,"../test-helpers":13}],11:[function(require,module,exports){
var Kefir = require('../../kefir.js');
var helpers = require('../test-helpers');


describe("Property:", function(){



  it("works", function(done) {

    var bus = new Kefir.Bus;
    var property = bus.toProperty();

    var result1 = []
    property.subscribe(function(x){
      result1.push(x)
    })
    expect(result1).toEqual([]);

    bus.push(1);

    var result2 = []
    property.subscribe(function(x){
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
    property.subscribe(function(x){
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



});

},{"../../kefir.js":1,"../test-helpers":13}],12:[function(require,module,exports){
var Kefir = require('../../kefir.js');
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

},{"../../kefir.js":1,"../test-helpers":13}],13:[function(require,module,exports){
var Kefir = require('../kefir.js');

exports.captureOutput = function(stream, callback, timeout) {
  var values = [];

  function log(value){
    values.push(value);
  }

  function report(){
    stream.unsubscribe(log);
    stream.offEnd(report);
    callback(values);
  }

  stream.subscribe(log);
  stream.onEnd(report);

  if (typeof timeout === "number") {
    setTimeout(report, timeout);
  }
}



exports.sampleStream = function(values, timeout){
  timeout = timeout || 0;
  values.reverse();
  return Kefir.fromBinder(function(sink){
    var send = function() {
      if (values.length > 0) {
        sink(values.pop());
        setTimeout(send, timeout);
      }
    }
    setTimeout(send, timeout);
    return function(){};
  });
}

},{"../kefir.js":1}]},{},[2,3,4,5,6,7,8,9,10,11,12])