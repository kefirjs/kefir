(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
  "use strict";


  // Class method names convention
  //
  // __foo: can be used only inside class or child class
  // _foo: can be used only insid Kefir
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

  Kefir.Stream = function Stream(generator) {

    if (!generator) {
      this._end();
      return;
    }

    this.__generator = generator;
    this.__subscribers = [];
    this.__endSubscribers = [];
    this.__generatorUsubscriber = null;

    var _this = this;
    this.__deliver = function(val) {
      if (_this.isEnded()) {
        return;
      }
      if (val === Kefir.END) {
        _this._end();
      } else {
        for (var i = 0; i < _this.__subscribers.length; i++) {
          _this.__subscribers[i](val);
        }
      }
    };

  };

  Kefir.Stream.prototype.__subToGenerator = function(){
    if (this.__generatorUsubscriber === null && this.__generator) {
      this.__generatorUsubscriber = this.__generator(this.__deliver);
    }
  };

  Kefir.Stream.prototype.__unsubFromGenerator = function(){
    if (this.__generatorUsubscriber) {
      this.__generatorUsubscriber();
      this.__generatorUsubscriber = null;
    }
  };

  Kefir.Stream.prototype._end = function(){
    if (!this.isEnded()) {
      this.__unsubFromGenerator();
      this.__subscribers = null;
      this.__generator = null;
      this.__deliver = null;
      for (var i = 0; i < this.__endSubscribers.length; i++) {
        this.__endSubscribers[i]();
      }
      this.__endSubscribers = null;
    }
  };

  Kefir.Stream.prototype.subscribe = function(callback) {
    if (this.__generator) {
      this.__subToGenerator();
      this.__subscribers.push(callback);
    }
  };

  Kefir.Stream.prototype.unsubscribe = function(callback) {
    if (!this.isEnded() && this.__subscribers.length > 0) {
      removeFromArray(this.__subscribers, callback);
      if (this.__subscribers.length === 0) {
        this.__unsubFromGenerator();
      }
    }
  };

  Kefir.Stream.prototype.onEnd = function(callback) {
    if (this.isEnded()) {
      callback();
    } else {
      this.__endSubscribers.push(callback);
    }
  };

  Kefir.Stream.prototype.offEnd = function(callback) {
    if (!this.isEnded()) {
      removeFromArray(this.__endSubscribers, callback);
    }
  };

  Kefir.Stream.prototype.isEnded = function() {
    return this.__generator === null;
  };

  Kefir.Stream.prototype.hasListeners = function() {
    return this.__generatorUsubscriber !== null;
  };





  // Bus

  Kefir.Bus = inherit(function Bus(){

    this.__plugged = [];
    this.__listeningToPlugged = false;

    var _this = this;
    this.__superConstructor(function(sink){
      _this.__sink = sink;
      return function(){
        _this.__sink = null;
      };
    });

    this.push = function(value){
      if (_this.__sink) {
        _this.__sink(value);
      }
    };

  }, Kefir.Stream);

  Kefir.Bus.prototype.__startListenToPlugged = function(){
    if (this.__plugged && !this.__listeningToPlugged) {
      for (var i = 0; i < this.__plugged.length; i++) {
        this.__plugged[i].subscribe(this.push);
      }
      this.__listeningToPlugged = true;
    }
  };

  Kefir.Bus.prototype.__stopListenToPlugged = function(){
    if (this.__plugged && this.__listeningToPlugged) {
      for (var i = 0; i < this.__plugged.length; i++) {
        this.__plugged[i].unsubscribe(this.push);
      }
      this.__listeningToPlugged = false;
    }
  };

  Kefir.Bus.prototype.__subToGenerator = function(){
    this.__superProto.__subToGenerator.apply(this);
    this.__startListenToPlugged();
  };

  Kefir.Bus.prototype.__unsubFromGenerator = function(){
    this.__superProto.__unsubFromGenerator.apply(this);
    this.__stopListenToPlugged();
  };

  Kefir.Bus.prototype._end = function(){
    this.__superProto._end.apply(this);
    this.__stopListenToPlugged();
    this.__plugged = null;
  };

  Kefir.Bus.prototype.end = function(){
    this._end();
  };

  Kefir.Bus.prototype.plug = function(stream){
    this.__plugged.push(stream);
    if (this.__sink) {
      stream.subscribe(this.push);
    }
    var _that = this;
    stream.onEnd(function(){
      _that.unplug(stream);
    });
  };

  Kefir.Bus.prototype.unplug = function(stream){
    stream.unsubscribe(this.push);
    removeFromArray(this.__plugged, stream);
  };





  // Map

  Kefir.map = function(stream, mapFn) {
    var result = new Kefir.Stream(function(sink){
      var deliver = function(value){
        sink(mapFn(value));
      };
      stream.subscribe(deliver);
      return function(){
        stream.unsubscribe(deliver);
      };
    });

    stream.onEnd(function(){
      result._end();
    });

    return result;
  };

  Kefir.Stream.prototype.map = function(fn) {
    return Kefir.map(this, fn);
  };






  // Merge

  Kefir.merge = function() {

    var sources = firstArrOrToArr(arguments);
    var lastSink = null;

    var result = new Kefir.Stream(function(sink){
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

    function bindOnEnd(source){
      source.onEnd(function(){
        source.unsubscribe(lastSink);
        removeFromArray(sources, source);
        if (sources.length === 0) {
          result._end();
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
var Kefir = require('../kefir.js');
var helpers = require('../test-helpers');


describe("Base stream:", function(){

  it("onEnd(), offEnd() works", function(done) {

    var stream = helpers.sampleStream([]);

    setTimeout(function(){
      stream._end();
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

},{"../kefir.js":1,"../test-helpers":6}],3:[function(require,module,exports){
var Kefir = require('../kefir.js');
var helpers = require('../test-helpers');


describe("Bus:", function(){



  it("push() works", function(done) {

    var bus = new Kefir.Bus;

    bus.push('no subscribers – will not be delivered');
    bus.push(Kefir.END); // will not be delivered either

    setTimeout(function(){
      bus.push(2);
      bus.push(Kefir.END);
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

},{"../kefir.js":1,"../test-helpers":6}],4:[function(require,module,exports){
var Kefir = require('../kefir.js');
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

},{"../kefir.js":1,"../test-helpers":6}],5:[function(require,module,exports){
var Kefir = require('../kefir.js');
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

},{"../kefir.js":1,"../test-helpers":6}],6:[function(require,module,exports){
var Kefir = require('./kefir.js');

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
  return new Kefir.Stream(function(sink){
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

},{"./kefir.js":1}]},{},[2,3,4,5])