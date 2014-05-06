(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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





  // fromBinder

  Kefir.fromBinder = function(generator){
    var generatorUsubscriber = null;
    var send = function(val){
      stream._send(val)
    }

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

  Kefir.merge = function() {

    var sources = firstArrOrToArr(arguments);
    var lastSink = null;

    var result = Kefir.fromBinder(function(sink){
      lastSink = sink;
      for (var i = 0; i < sources.length; i++) {
        sources[i].subscribe(sink);
      }
      return function(){
        for (var i = 0; i < sources.length; i++) {
          sources[i].unsubscribe(sink);
        }
        lastSink = null;
      };
    });

    // FIXME: this is sign that it should be class here
    function bindOnEnd(source){
      source.onEnd(function(){
        source.unsubscribe(lastSink);
        removeFromArray(sources, source);
        if (sources.length === 0) {
          result._send(Kefir.END);
        }
      });
    }

    for (var i = 0; i < sources.length; i++) {
      bindOnEnd(sources[i]);
    }

    return result;
  };

  Kefir.Stream.prototype.merge = function() {
    return Kefir.merge([this].concat(firstArrOrToArr(arguments)));
  };






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

},{"../../kefir.js":1,"../test-helpers":7}],3:[function(require,module,exports){
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

},{"../../kefir.js":1,"../test-helpers":7}],4:[function(require,module,exports){
var Kefir = require('../../kefir.js');
var helpers = require('../test-helpers');



describe("FlatMap:", function(){

  it("works", function(done){

    var stream = helpers.sampleStream([4, 2, Kefir.END], 100);
    var mapped = stream.flatMap(function(x){
      return helpers.sampleStream([x, x, Kefir.END], 20 * x);
    });

    // ---------4---------2
    //           -------4-------4
    //                     ---2---2
    // -----------------4-----2-4-2

    helpers.captureOutput(mapped, function(values){
      expect(values).toEqual([4, 2, 4, 2]);
      done();
    });

  }, 400);


});

},{"../../kefir.js":1,"../test-helpers":7}],5:[function(require,module,exports){
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

},{"../../kefir.js":1,"../test-helpers":7}],6:[function(require,module,exports){
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

},{"../../kefir.js":1,"../test-helpers":7}],7:[function(require,module,exports){
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

},{"../kefir.js":1}]},{},[2,3,4,5,6])