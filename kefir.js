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
