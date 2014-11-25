(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! Kefir.js v0.4.0
 *  https://github.com/pozadi/kefir
 */
;(function(global){
  "use strict";

  var Kefir = {};


function and() {
  for (var i = 0; i < arguments.length; i++) {
    if (!arguments[i]) {
      return arguments[i];
    }
  }
  return arguments[i - 1];
}

function or() {
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i]) {
      return arguments[i];
    }
  }
  return arguments[i - 1];
}

function not(x) {
  return !x;
}

function concat(a, b) {
  var result, length, i, j;
  if (a.length === 0) {  return b  }
  if (b.length === 0) {  return a  }
  j = 0;
  result = new Array(a.length + b.length);
  length = a.length;
  for (i = 0; i < length; i++, j++) {
    result[j] = a[i];
  }
  length = b.length;
  for (i = 0; i < length; i++, j++) {
    result[j] = b[i];
  }
  return result;
}

function find(arr, value) {
  var length = arr.length
    , i;
  for (i = 0; i < length; i++) {
    if (arr[i] === value) {  return i  }
  }
  return -1;
}

function findByPred(arr, pred) {
  var length = arr.length
    , i;
  for (i = 0; i < length; i++) {
    if (pred(arr[i])) {  return i  }
  }
  return -1;
}

function cloneArray(input) {
  var length = input.length
    , result = new Array(length)
    , i;
  for (i = 0; i < length; i++) {
    result[i] = input[i];
  }
  return result;
}

function remove(input, index) {
  var length = input.length
    , result, i, j;
  if (index >= 0 && index < length) {
    if (length === 1) {
      return [];
    } else {
      result = new Array(length - 1);
      for (i = 0, j = 0; i < length; i++) {
        if (i !== index) {
          result[j] = input[i];
          j++;
        }
      }
      return result;
    }
  } else {
    return input;
  }
}

function removeByPred(input, pred) {
  return remove(input, findByPred(input, pred));
}

function map(input, fn) {
  var length = input.length
    , result = new Array(length)
    , i;
  for (i = 0; i < length; i++) {
    result[i] = fn(input[i]);
  }
  return result;
}

function forEach(arr, fn) {
  var length = arr.length
    , i;
  for (i = 0; i < length; i++) {  fn(arr[i])  }
}

function fillArray(arr, value) {
  var length = arr.length
    , i;
  for (i = 0; i < length; i++) {
    arr[i] = value;
  }
}

function contains(arr, value) {
  return find(arr, value) !== -1;
}

function rest(arr, start, onEmpty) {
  if (arr.length > start) {
    return Array.prototype.slice.call(arr, start);
  }
  return onEmpty;
}

function slide(cur, next, max) {
  var length = Math.min(max, cur.length + 1),
      offset = cur.length - length + 1,
      result = new Array(length),
      i;
  for (i = offset; i < length; i++) {
    result[i - offset] = cur[i];
  }
  result[length - 1] = next;
  return result;
}

function isEqualArrays(a, b) {
  var length, i;
  if (a == null && b == null) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (i = 0, length = a.length; i < length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function spread(fn, length) {
  switch(length) {
    case 0:  return function(a) {  return fn()  };
    case 1:  return function(a) {  return fn(a[0])  };
    case 2:  return function(a) {  return fn(a[0], a[1])  };
    case 3:  return function(a) {  return fn(a[0], a[1], a[2])  };
    case 4:  return function(a) {  return fn(a[0], a[1], a[2], a[3])  };
    default: return function(a) {  return fn.apply(null, a)  };
  }
}

function apply(fn, c, a) {
  var aLength = a ? a.length : 0;
  if (c == null) {
    switch (aLength) {
      case 0:  return fn();
      case 1:  return fn(a[0]);
      case 2:  return fn(a[0], a[1]);
      case 3:  return fn(a[0], a[1], a[2]);
      case 4:  return fn(a[0], a[1], a[2], a[3]);
      default: return fn.apply(null, a);
    }
  } else {
    switch (aLength) {
      case 0:  return fn.call(c);
      default: return fn.apply(c, a);
    }
  }
}

function get(map, key, notFound) {
  if (map && key in map) {
    return map[key];
  } else {
    return notFound;
  }
}

function own(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function createObj(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F();
}

function extend(target /*, mixin1, mixin2...*/) {
  var length = arguments.length
    , i, prop;
  for (i = 1; i < length; i++) {
    for (prop in arguments[i]) {
      target[prop] = arguments[i][prop];
    }
  }
  return target;
}

function inherit(Child, Parent /*, mixin1, mixin2...*/) {
  var length = arguments.length
    , i;
  Child.prototype = createObj(Parent.prototype);
  Child.prototype.constructor = Child;
  for (i = 2; i < length; i++) {
    extend(Child.prototype, arguments[i]);
  }
  return Child;
}

var NOTHING = ['<nothing>'];
var END = 'end';
var VALUE = 'value';
var ANY = 'any';

function noop() {}

function id(x) {
  return x;
}

function strictEqual(a, b) {
  return a === b;
}

function defaultDiff(a, b) {
  return [a, b]
}

var now = Date.now ?
  function() { return Date.now() } :
  function() { return new Date().getTime() };

function isFn(fn) {
  return typeof fn === 'function';
}

function isUndefined(x) {
  return typeof x === 'undefined';
}

function isArrayLike(xs) {
  return isArray(xs) || isArguments(xs);
}

var isArray = Array.isArray || function(xs) {
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

function withInterval(name, mixin) {

  function AnonymousStream(wait, args) {
    Stream.call(this);
    this._wait = wait;
    this._intervalId = null;
    var $ = this;
    this._$onTick = function() {  $._onTick()  }
    this._init(args);
  }

  inherit(AnonymousStream, Stream, {

    _name: name,

    _init: function(args) {},
    _free: function() {},

    _onTick: function() {},

    _onActivation: function() {
      this._intervalId = setInterval(this._$onTick, this._wait);
    },
    _onDeactivation: function() {
      if (this._intervalId !== null) {
        clearInterval(this._intervalId);
        this._intervalId = null;
      }
    },

    _clear: function() {
      Stream.prototype._clear.call(this);
      this._$onTick = null;
      this._free();
    }

  }, mixin);

  Kefir[name] = function(wait) {
    return new AnonymousStream(wait, rest(arguments, 1, []));
  }
}

function withOneSource(name, mixin, options) {


  options = extend({
    streamMethod: function(StreamClass, PropertyClass) {
      return function() {  return new StreamClass(this, arguments)  }
    },
    propertyMethod: function(StreamClass, PropertyClass) {
      return function() {  return new PropertyClass(this, arguments)  }
    }
  }, options || {});



  mixin = extend({
    _init: function(args) {},
    _free: function() {},

    _handleValue: function(x, isCurrent) {  this._send(VALUE, x, isCurrent)  },
    _handleEnd: function(__, isCurrent) {  this._send(END, null, isCurrent)  },

    _onActivationHook: function() {},
    _onDeactivationHook: function() {},

    _handleAny: function(event) {
      switch (event.type) {
        case VALUE: this._handleValue(event.value, event.current); break;
        case END: this._handleEnd(event.value, event.current); break;
      }
    },

    _onActivation: function() {
      this._onActivationHook();
      this._source.onAny(this._$handleAny);
    },
    _onDeactivation: function() {
      this._onDeactivationHook();
      this._source.offAny(this._$handleAny);
    }
  }, mixin || {});



  function buildClass(BaseClass) {
    function AnonymousObservable(source, args) {
      BaseClass.call(this);
      this._source = source;
      this._name = source._name + '.' + name;
      this._init(args);
      var $ = this;
      this._$handleAny = function(event) {  $._handleAny(event)  }
    }

    inherit(AnonymousObservable, BaseClass, {
      _clear: function() {
        BaseClass.prototype._clear.call(this);
        this._source = null;
        this._$handleAny = null;
        this._free();
      }
    }, mixin);

    return AnonymousObservable;
  }


  var AnonymousStream = buildClass(Stream);
  var AnonymousProperty = buildClass(Property);

  if (options.streamMethod) {
    Stream.prototype[name] = options.streamMethod(AnonymousStream, AnonymousProperty);
  }

  if (options.propertyMethod) {
    Property.prototype[name] = options.propertyMethod(AnonymousStream, AnonymousProperty);
  }

}

function withTwoSources(name, mixin /*, options*/) {

  mixin = extend({
    _init: function() {},
    _free: function() {},

    _handlePrimaryValue: function(x, isCurrent) {  this._send(VALUE, x, isCurrent)  },
    _handlePrimaryEnd: function(__, isCurrent) {  this._send(END, null, isCurrent)  },

    _handleSecondaryValue: function(x, isCurrent) {  this._lastSecondary = x  },
    _handleSecondaryEnd: function(__, isCurrent) {},

    _handlePrimaryAny: function(event) {
      switch (event.type) {
        case VALUE: this._handlePrimaryValue(event.value, event.current); break;
        case END: this._handlePrimaryEnd(event.value, event.current); break;
      }
    },
    _handleSecondaryAny: function(event) {
      switch (event.type) {
        case VALUE:
          this._handleSecondaryValue(event.value, event.current);
          break;
        case END:
          this._handleSecondaryEnd(event.value, event.current);
          this._removeSecondary();
          break;
      }
    },

    _removeSecondary: function() {
      if (this._secondary !== null) {
        this._secondary.offAny(this._$handleSecondaryAny);
        this._$handleSecondaryAny = null;
        this._secondary = null;
      }
    },

    _onActivation: function() {
      if (this._secondary !== null) {
        this._secondary.onAny(this._$handleSecondaryAny);
      }
      if (this._alive) {
        this._primary.onAny(this._$handlePrimaryAny);
      }
    },
    _onDeactivation: function() {
      if (this._secondary !== null) {
        this._secondary.offAny(this._$handleSecondaryAny);
      }
      this._primary.offAny(this._$handlePrimaryAny);
    }
  }, mixin || {});



  function buildClass(BaseClass) {
    function AnonymousObservable(primary, secondary) {
      BaseClass.call(this);
      this._primary = primary;
      this._secondary = secondary;
      this._name = primary._name + '.' + name;
      this._lastSecondary = NOTHING;
      var $ = this;
      this._$handleSecondaryAny = function(event) {  $._handleSecondaryAny(event)  }
      this._$handlePrimaryAny = function(event) {  $._handlePrimaryAny(event)  }
      this._init();
    }

    inherit(AnonymousObservable, BaseClass, {
      _clear: function() {
        BaseClass.prototype._clear.call(this);
        this._primary = null;
        this._secondary = null;
        this._lastSecondary = null;
        this._$handleSecondaryAny = null;
        this._$handlePrimaryAny = null;
        this._free();
      }
    }, mixin);

    return AnonymousObservable;
  }


  var AnonymousStream = buildClass(Stream);
  var AnonymousProperty = buildClass(Property);

  Stream.prototype[name] = function(secondary) {
    return new AnonymousStream(this, secondary);
  }

  Property.prototype[name] = function(secondary) {
    return new AnonymousProperty(this, secondary);
  }

}

// Subscribers

function Subscribers() {
  this._items = [];
}

extend(Subscribers, {
  callOne: function(fnData, event) {
    if (fnData.type === ANY) {
      fnData.fn(event);
    } else if (fnData.type === event.type) {
      if (fnData.type === VALUE) {
        fnData.fn(event.value);
      } else {
        fnData.fn();
      }
    }
  },
  callOnce: function(type, fn, event) {
    if (type === ANY) {
      fn(event);
    } else if (type === event.type) {
      if (type === VALUE) {
        fn(event.value);
      } else {
        fn();
      }
    }
  }
});

extend(Subscribers.prototype, {
  add: function(type, fn, _key) {
    this._items = concat(this._items, [{
      type: type,
      fn: fn,
      key: _key || NOTHING
    }]);
  },
  remove: function(type, fn, _key) {
    this._items = removeByPred(this._items, function(fnData) {
      return fnData.type === type &&
        (fnData.fn === fn || isEqualArrays(fnData.key, _key));
    });
  },
  callAll: function(event) {
    var items = this._items;
    for (var i = 0; i < items.length; i++) {
      Subscribers.callOne(items[i], event);
    }
  },
  isEmpty: function() {
    return this._items.length === 0;
  }
});





// Events

function Event(type, value, current) {
  return {type: type, value: value, current: !!current};
}

var CURRENT_END = Event(END, undefined, true);





// Observable

function Observable() {
  this._subscribers = new Subscribers();
  this._active = false;
  this._alive = true;
}
Kefir.Observable = Observable;

extend(Observable.prototype, {

  _name: 'observable',

  _onActivation: function() {},
  _onDeactivation: function() {},

  _setActive: function(active) {
    if (this._active !== active) {
      this._active = active;
      if (active) {
        this._onActivation();
      } else {
        this._onDeactivation();
      }
    }
  },

  _clear: function() {
    this._setActive(false);
    this._alive = false;
    this._subscribers = null;
  },

  _send: function(type, x, isCurrent) {
    if (this._alive) {
      this._subscribers.callAll(Event(type, x, isCurrent));
      if (type === END) {  this._clear()  }
    }
  },

  on: function(type, fn, _key) {
    if (this._alive) {
      this._subscribers.add(type, fn, _key);
      this._setActive(true);
    } else {
      Subscribers.callOnce(type, fn, CURRENT_END);
    }
    return this;
  },

  off: function(type, fn, _key) {
    if (this._alive) {
      this._subscribers.remove(type, fn, _key);
      if (this._subscribers.isEmpty()) {
        this._setActive(false);
      }
    }
    return this;
  },

  onValue:  function(fn, _key) {  return this.on(VALUE, fn, _key)   },
  onEnd:    function(fn, _key) {  return this.on(END, fn, _key)     },
  onAny:    function(fn, _key) {  return this.on(ANY, fn, _key)     },

  offValue: function(fn, _key) {  return this.off(VALUE, fn, _key)  },
  offEnd:   function(fn, _key) {  return this.off(END, fn, _key)    },
  offAny:   function(fn, _key) {  return this.off(ANY, fn, _key)    }

});


// extend() can't handle `toString` in IE8
Observable.prototype.toString = function() {  return '[' + this._name + ']'  };









// Stream

function Stream() {
  Observable.call(this);
}
Kefir.Stream = Stream;

inherit(Stream, Observable, {

  _name: 'stream'

});







// Property

function Property() {
  Observable.call(this);
  this._current = NOTHING;
}
Kefir.Property = Property;

inherit(Property, Observable, {

  _name: 'property',

  _send: function(type, x, isCurrent) {
    if (this._alive) {
      if (!isCurrent) {
        this._subscribers.callAll(Event(type, x));
      }
      if (type === VALUE) {  this._current = x  }
      if (type === END) {  this._clear()  }
    }
  },

  on: function(type, fn, _key) {
    if (this._alive) {
      this._subscribers.add(type, fn, _key);
      this._setActive(true);
    }
    if (this._current !== NOTHING) {
      Subscribers.callOnce(type, fn, Event(VALUE, this._current, true));
    }
    if (!this._alive) {
      Subscribers.callOnce(type, fn, CURRENT_END);
    }
    return this;
  }

});






// Log

Observable.prototype.log = function(name) {
  name = name || this.toString();
  this.onAny(function(event) {
    var typeStr = '<' + event.type + (event.current ? ':current' : '') + '>';
    if (event.type === VALUE) {
      console.log(name, typeStr, event.value);
    } else {
      console.log(name, typeStr);
    }
  }, '__logKey__' + name);
  return this;
}

Observable.prototype.offLog = function(name) {
  name = name || this.toString();
  this.offAny(null, '__logKey__' + name);
  return this;
}



// Kefir.withInterval()

withInterval('withInterval', {
  _init: function(args) {
    this._fn = args[0];
    var $ = this;
    this._emitter = {
      emit: function(x) {  $._send(VALUE, x)  },
      end: function() {  $._send(END)  }
    }
  },
  _free: function() {
    this._fn = null;
    this._emitter = null;
  },
  _onTick: function() {
    this._fn(this._emitter);
  }
});





// Kefir.fromPoll()

withInterval('fromPoll', {
  _init: function(args) {
    this._fn = args[0];
  },
  _free: function() {
    this._fn = null;
  },
  _onTick: function() {
    this._send(VALUE, this._fn());
  }
});





// Kefir.interval()

withInterval('interval', {
  _init: function(args) {
    this._x = args[0];
  },
  _free: function() {
    this._x = null;
  },
  _onTick: function() {
    this._send(VALUE, this._x);
  }
});




// Kefir.sequentially()

withInterval('sequentially', {
  _init: function(args) {
    this._xs = cloneArray(args[0]);
    if (this._xs.length === 0) {
      this._send(END)
    }
  },
  _free: function() {
    this._xs = null;
  },
  _onTick: function() {
    switch (this._xs.length) {
      case 1:
        this._send(VALUE, this._xs[0]);
        this._send(END);
        break;
      default:
        this._send(VALUE, this._xs.shift());
    }
  }
});




// Kefir.repeatedly()

withInterval('repeatedly', {
  _init: function(args) {
    this._xs = cloneArray(args[0]);
    this._i = -1;
  },
  _onTick: function() {
    if (this._xs.length > 0) {
      this._i = (this._i + 1) % this._xs.length;
      this._send(VALUE, this._xs[this._i]);
    }
  }
});





// Kefir.later()

withInterval('later', {
  _init: function(args) {
    this._x = args[0];
  },
  _free: function() {
    this._x = null;
  },
  _onTick: function() {
    this._send(VALUE, this._x);
    this._send(END);
  }
});

function _AbstractPool(options) {
  Stream.call(this);

  this._queueLim = get(options, 'queueLim', 0);
  this._concurLim = get(options, 'concurLim', -1);
  this._drop = get(options, 'drop', 'new');
  if (this._concurLim === 0) {
    throw new Error('options.concurLim can\'t be 0');
  }

  var $ = this;
  this._$handleSubAny = function(event) {  $._handleSubAny(event)  };

  this._queue = [];
  this._curSources = [];
  this._activating = false;
}

inherit(_AbstractPool, Stream, {

  _name: 'abstractPool',

  _add: function(obj, toObs) {
    toObs = toObs || id;
    if (this._concurLim === -1 || this._curSources.length < this._concurLim) {
      this._addToCur(toObs(obj));
    } else {
      if (this._queueLim === -1 || this._queue.length < this._queueLim) {
        this._addToQueue(toObs(obj));
      } else if (this._drop === 'old') {
        this._removeOldest();
        this._add(toObs(obj));
      }
    }
  },
  _addAll: function(obss) {
    var $ = this;
    forEach(obss, function(obs) {  $._add(obs)  });
  },
  _remove: function(obs) {
    if (this._removeCur(obs) === -1) {
      this._removeQueue(obs);
    }
  },

  _addToQueue: function(obs) {
    this._queue = concat(this._queue, [obs]);
  },
  _addToCur: function(obs) {
    this._curSources = concat(this._curSources, [obs]);
    if (this._active) {  this._sub(obs)  }
  },
  _sub: function(obs) {
    var $ = this;
    obs.onAny(this._$handleSubAny);
    obs.onEnd(function() {  $._removeCur(obs)  }, [this, obs]);
  },
  _unsub: function(obs) {
    obs.offAny(this._$handleSubAny);
    obs.offEnd(null, [this, obs]);
  },
  _handleSubAny: function(event) {
    if (event.type === VALUE) {
      this._send(VALUE, event.value, event.current && this._activating);
    }
  },

  _removeQueue: function(obs) {
    var index = find(this._queue, obs);
    this._queue = remove(this._queue, index);
    return index;
  },
  _removeCur: function(obs) {
    if (this._active) {  this._unsub(obs)  }
    var index = find(this._curSources, obs);
    this._curSources = remove(this._curSources, index);
    if (index !== -1) {
      if (this._queue.length !== 0) {
        this._pullQueue();
      } else if (this._curSources.length === 0) {
        this._onEmpty();
      }
    }
    return index;
  },
  _removeOldest: function() {
    this._removeCur(this._curSources[0]);
  },

  _pullQueue: function() {
    if (this._queue.length !== 0) {
      this._queue = cloneArray(this._queue);
      this._addToCur(this._queue.shift());
    }
  },

  _onActivation: function() {
    var sources = this._curSources
      , i;
    this._activating = true;
    for (i = 0; i < sources.length; i++) {  this._sub(sources[i])  }
    this._activating = false;
  },
  _onDeactivation: function() {
    var sources = this._curSources
      , i;
    for (i = 0; i < sources.length; i++) {  this._unsub(sources[i])  }
  },

  _isEmpty: function() {  return this._curSources.length === 0  },
  _onEmpty: function() {},

  _clear: function() {
    Stream.prototype._clear.call(this);
    this._queue = null;
    this._curSources = null;
    this._$handleSubAny = null;
  }

});





// .merge()

var MergeLike = {
  _onEmpty: function() {
    if (this._initialised) {  this._send(END, null, this._activating)  }
  }
};

function Merge(sources) {
  _AbstractPool.call(this);
  if (sources.length === 0) {  this._send(END)  } else {  this._addAll(sources)  }
  this._initialised = true;
}

inherit(Merge, _AbstractPool, extend({_name: 'merge'}, MergeLike));

Kefir.merge = function(obss) {
  return new Merge(obss);
}

Observable.prototype.merge = function(other) {
  return Kefir.merge([this, other]);
}




// .concat()

function Concat(sources) {
  _AbstractPool.call(this, {concurLim: 1, queueLim: -1});
  if (sources.length === 0) {  this._send(END)  } else {  this._addAll(sources)  }
  this._initialised = true;
}

inherit(Concat, _AbstractPool, extend({_name: 'concat'}, MergeLike));

Kefir.concat = function(obss) {
  return new Concat(obss);
}

Observable.prototype.concat = function(other) {
  return Kefir.concat([this, other]);
}






// .pool()

function Pool() {
  _AbstractPool.call(this);
}

inherit(Pool, _AbstractPool, {

  _name: 'pool',

  plug: function(obs) {
    this._add(obs);
    return this;
  },
  unplug: function(obs) {
    this._remove(obs);
    return this;
  }

});

Kefir.pool = function() {
  return new Pool();
}





// .bus()

function Bus() {
  _AbstractPool.call(this);
}

inherit(Bus, _AbstractPool, {

  _name: 'bus',

  plug: function(obs) {
    this._add(obs);
    return this;
  },
  unplug: function(obs) {
    this._remove(obs);
    return this;
  },

  emit: function(x) {
    this._send(VALUE, x);
    return this;
  },
  end: function() {
    this._send(END);
    return this;
  }

});

Kefir.bus = function() {
  return new Bus();
}





// .flatMap()

function FlatMap(source, fn, options) {
  _AbstractPool.call(this, options);
  this._source = source;
  this._fn = fn || id;
  this._mainEnded = false;
  this._lastCurrent = null;

  var $ = this;
  this._$handleMainSource = function(event) {  $._handleMainSource(event)  };
}

inherit(FlatMap, _AbstractPool, {

  _onActivation: function() {
    _AbstractPool.prototype._onActivation.call(this);
    this._activating = true;
    this._source.onAny(this._$handleMainSource);
    this._activating = false;
  },
  _onDeactivation: function() {
    _AbstractPool.prototype._onDeactivation.call(this);
    this._source.offAny(this._$handleMainSource);
  },

  _handleMainSource: function(event) {
    if (event.type === VALUE) {
      if (!event.current || this._lastCurrent !== event.value) {
        this._add(event.value, this._fn);
      }
      this._lastCurrent = event.value;
    } else {
      if (this._isEmpty()) {
        this._send(END, null, event.current);
      } else {
        this._mainEnded = true;
      }
    }
  },

  _onEmpty: function() {
    if (this._mainEnded) {  this._send(END)  }
  },

  _clear: function() {
    _AbstractPool.prototype._clear.call(this);
    this._source = null;
    this._lastCurrent = null;
    this._$handleMainSource = null;
  }

});

Observable.prototype.flatMap = function(fn) {
  return new FlatMap(this, fn)
    .setName(this, 'flatMap');
}

Observable.prototype.flatMapLatest = function(fn) {
  return new FlatMap(this, fn, {concurLim: 1, drop: 'old'})
    .setName(this, 'flatMapLatest');
}

Observable.prototype.flatMapFirst = function(fn) {
  return new FlatMap(this, fn, {concurLim: 1})
    .setName(this, 'flatMapFirst');
}

Observable.prototype.flatMapConcat = function(fn) {
  return new FlatMap(this, fn, {queueLim: -1, concurLim: 1})
    .setName(this, 'flatMapConcat');
}

Observable.prototype.flatMapConcurLimit = function(fn, limit) {
  var result;
  if (limit === 0) {
    result = Kefir.never();
  } else {
    if (limit < 0) {  limit = -1  }
    result = new FlatMap(this, fn, {queueLim: -1, concurLim: limit});
  }
  return result.setName(this, 'flatMapConcurLimit');
}





// .sampledBy()

function SampledBy(passive, active, combinator) {
  Stream.call(this);
  if (active.length === 0) {
    this._send(END);
  } else {
    this._passiveCount = passive.length;
    this._sources = concat(passive, active);
    this._combinator = combinator ? spread(combinator, this._sources.length) : id;
    this._aliveCount = 0;
    this._currents = new Array(this._sources.length);
    fillArray(this._currents, NOTHING);
    this._activating = false;
    this._emitAfterActivation = false;
    this._endAfterActivation = false;
  }
}


function bind_SampledBy_handleAny($, i) {
  return function(event) {  $._handleAny(i, event)  };
}

inherit(SampledBy, Stream, {

  _name: 'sampledBy',

  _onActivation: function() {
    var length = this._sources.length,
        i;
    this._aliveCount = length - this._passiveCount;
    this._activating = true;
    for (i = 0; i < length; i++) {
      this._sources[i].onAny(bind_SampledBy_handleAny(this, i), [this, i]);
    }
    this._activating = false;
    if (this._emitAfterActivation) {
      this._emitAfterActivation = false;
      this._emitIfFull(true);
    }
    if (this._endAfterActivation) {
      this._send(END, null, true);
    }
  },

  _onDeactivation: function() {
    var length = this._sources.length,
        i;
    for (i = 0; i < length; i++) {
      this._sources[i].offAny(null, [this, i]);
    }
  },

  _emitIfFull: function(isCurrent) {
    if (!contains(this._currents, NOTHING)) {
      var combined = cloneArray(this._currents);
      combined = this._combinator(combined);
      this._send(VALUE, combined, isCurrent);
    }
  },

  _handleAny: function(i, event) {
    if (event.type === VALUE) {
      this._currents[i] = event.value;
      if (i >= this._passiveCount) {
        if (this._activating) {
          this._emitAfterActivation = true;
        } else {
          this._emitIfFull(event.current);
        }
      }
    } else {
      if (i >= this._passiveCount) {
        this._aliveCount--;
        if (this._aliveCount === 0) {
          if (this._activating) {
            this._endAfterActivation = true;
          } else {
            this._send(END, null, event.current);
          }
        }
      }
    }
  },

  _clear: function() {
    Stream.prototype._clear.call(this);
    this._sources = null;
    this._currents = null;
    this._combinator = null;
  }

});

Kefir.sampledBy = function(passive, active, combinator) {
  return new SampledBy(passive, active, combinator);
}

Observable.prototype.sampledBy = function(other, combinator) {
  return Kefir.sampledBy([this], [other], combinator || id);
}




// .combine()

Kefir.combine = function(sources, combinator) {
  var result = new SampledBy([], sources, combinator);
  result._name = 'combine';
  return result;
}

Observable.prototype.combine = function(other, combinator) {
  return Kefir.combine([this, other], combinator);
}

function produceStream(StreamClass, PropertyClass) {
  return function() {  return new StreamClass(this, arguments)  }
}
function produceProperty(StreamClass, PropertyClass) {
  return function() {  return new PropertyClass(this, arguments)  }
}



// .toProperty()

withOneSource('toProperty', {
  _init: function(args) {
    if (args.length > 0) {
      this._send(VALUE, args[0]);
    }
  }
}, {propertyMethod: null, streamMethod: produceProperty});




// .changes()

withOneSource('changes', {
  _handleValue: function(x, isCurrent) {
    if (!isCurrent) {
      this._send(VALUE, x);
    }
  }
}, {streamMethod: null, propertyMethod: produceStream});




// .withHandler()

withOneSource('withHandler', {
  _init: function(args) {
    this._handler = args[0];
    this._forcedCurrent = false;
    var $ = this;
    this._emitter = {
      emit: function(x) {  $._send(VALUE, x, $._forcedCurrent)  },
      end: function() {  $._send(END, null, $._forcedCurrent)  }
    }
  },
  _free: function() {
    this._handler = null;
    this._emitter = null;
  },
  _handleAny: function(event) {
    this._forcedCurrent = event.current;
    this._handler(this._emitter, event);
    this._forcedCurrent = false;
  }
});




// .flatten(fn)

withOneSource('flatten', {
  _init: function(args) {
    this._fn = args[0] ? args[0] : id;
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    var xs = this._fn(x);
    for (var i = 0; i < xs.length; i++) {
      this._send(VALUE, xs[i], isCurrent);
    }
  }
});







// .transduce(transducer)

function xformForObs(obs) {
  return {
    step: function(res, input) {
      obs._send(VALUE, input, obs._forcedCurrent);
      return null;
    },
    result: function(res) {
      obs._send(END, null, obs._forcedCurrent);
      return null;
    }
  };
}

withOneSource('transduce', {
  _init: function(args) {
    this._xform = args[0](xformForObs(this));
  },
  _free: function() {
    this._xform = null;
  },
  _handleValue: function(x, isCurrent) {
    this._forcedCurrent = isCurrent;
    if (this._xform.step(null, x) !== null) {
      this._xform.result(null);
    }
    this._forcedCurrent = false;
  },
  _handleEnd: function(__, isCurrent) {
    this._forcedCurrent = isCurrent;
    this._xform.result(null);
    this._forcedCurrent = false;
  }
});





var withFnArgMixin = {
  _init: function(args) {  this._fn = args[0] || id  },
  _free: function() {  this._fn = null  }
};



// .map(fn)

withOneSource('map', extend({
  _handleValue: function(x, isCurrent) {
    this._send(VALUE, this._fn(x), isCurrent);
  }
}, withFnArgMixin));





// .filter(fn)

withOneSource('filter', extend({
  _handleValue: function(x, isCurrent) {
    if (this._fn(x)) {
      this._send(VALUE, x, isCurrent);
    }
  }
}, withFnArgMixin));





// .takeWhile(fn)

withOneSource('takeWhile', extend({
  _handleValue: function(x, isCurrent) {
    if (this._fn(x)) {
      this._send(VALUE, x, isCurrent);
    } else {
      this._send(END, null, isCurrent);
    }
  }
}, withFnArgMixin));





// .take(n)

withOneSource('take', {
  _init: function(args) {
    this._n = args[0];
    if (this._n <= 0) {
      this._send(END);
    }
  },
  _handleValue: function(x, isCurrent) {
    this._n--;
    this._send(VALUE, x, isCurrent);
    if (this._n === 0) {
      this._send(END, null, isCurrent);
    }
  }
});





// .skip(n)

withOneSource('skip', {
  _init: function(args) {
    this._n = Math.max(0, args[0]);
  },
  _handleValue: function(x, isCurrent) {
    if (this._n === 0) {
      this._send(VALUE, x, isCurrent);
    } else {
      this._n--;
    }
  }
});




// .skipDuplicates([fn])

withOneSource('skipDuplicates', {
  _init: function(args) {
    this._fn = args[0] || strictEqual;
    this._prev = NOTHING;
  },
  _free: function() {
    this._fn = null;
    this._prev = null;
  },
  _handleValue: function(x, isCurrent) {
    if (this._prev === NOTHING || !this._fn(this._prev, x)) {
      this._send(VALUE, x, isCurrent);
      this._prev = x;
    }
  }
});





// .skipWhile(fn)

withOneSource('skipWhile', {
  _init: function(args) {
    this._fn = args[0] || id;
    this._skip = true;
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    if (!this._skip) {
      this._send(VALUE, x, isCurrent);
      return;
    }
    if (!this._fn(x)) {
      this._skip = false;
      this._fn = null;
      this._send(VALUE, x, isCurrent);
    }
  }
});





// .diff(fn, seed)

withOneSource('diff', {
  _init: function(args) {
    this._fn = args[0] || defaultDiff;
    this._prev = args.length > 1 ? args[1] : NOTHING;
  },
  _free: function() {
    this._prev = null;
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    if (this._prev !== NOTHING) {
      this._send(VALUE, this._fn(this._prev, x), isCurrent);
    }
    this._prev = x;
  }
});





// .scan(fn, seed)

withOneSource('scan', {
  _init: function(args) {
    this._fn = args[0];
    if (args.length > 1) {
      this._send(VALUE, args[1], true);
    }
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    if (this._current !== NOTHING) {
      x = this._fn(this._current, x);
    }
    this._send(VALUE, x, isCurrent);
  }
}, {streamMethod: produceProperty});





// .reduce(fn, seed)

withOneSource('reduce', {
  _init: function(args) {
    this._fn = args[0];
    this._result = args.length > 1 ? args[1] : NOTHING;
  },
  _free: function() {
    this._fn = null;
    this._result = null;
  },
  _handleValue: function(x) {
    this._result = (this._result === NOTHING) ? x : this._fn(this._result, x);
  },
  _handleEnd: function(__, isCurrent) {
    if (this._result !== NOTHING) {
      this._send(VALUE, this._result, isCurrent);
    }
    this._send(END, null, isCurrent);
  }
});




// .mapEnd(fn)

withOneSource('mapEnd', {
  _init: function(args) {
    this._fn = args[0];
  },
  _free: function() {
    this._fn = null;
  },
  _handleEnd: function(__, isCurrent) {
    this._send(VALUE, this._fn(), isCurrent);
    this._send(END, null, isCurrent);
  }
});




// .skipEnd()

withOneSource('skipEnd', {
  _handleEnd: function(__, isCurrent) {}
});




// .slidingWindow(max[, min])

withOneSource('slidingWindow', {
  _init: function(args) {
    this._max = args[0];
    this._min = args[1] || 0;
    this._cache = [];
  },
  _free: function() {
    this._cache = null;
  },
  _handleValue: function(x, isCurrent) {
    this._cache = slide(this._cache, x, this._max);
    if (this._cache.length >= this._min) {
      this._send(VALUE, this._cache, isCurrent);
    }
  }
});





// .debounce(wait, {immediate})

withOneSource('debounce', {
  _init: function(args) {
    this._wait = Math.max(0, args[0]);
    this._immediate = get(args[1], 'immediate', false);
    this._lastAttempt = 0;
    this._timeoutId = null;
    this._laterValue = null;
    this._endLater = false;
    var $ = this;
    this._$later = function() {  $._later()  };
  },
  _free: function() {
    this._laterValue = null;
    this._$later = null;
  },
  _handleValue: function(x, isCurrent) {
    if (isCurrent) {
      this._send(VALUE, x, isCurrent);
    } else {
      this._lastAttempt = now();
      if (this._immediate && !this._timeoutId) {
        this._send(VALUE, x);
      }
      if (!this._timeoutId) {
        this._timeoutId = setTimeout(this._$later, this._wait);
      }
      if (!this._immediate) {
        this._laterValue = x;
      }
    }
  },
  _handleEnd: function(__, isCurrent) {
    if (isCurrent) {
      this._send(END, null, isCurrent);
    } else {
      if (this._timeoutId && !this._immediate) {
        this._endLater = true;
      } else {
        this._send(END);
      }
    }
  },
  _later: function() {
    var last = now() - this._lastAttempt;
    if (last < this._wait && last >= 0) {
      this._timeoutId = setTimeout(this._$later, this._wait - last);
    } else {
      this._timeoutId = null;
      if (!this._immediate) {
        this._send(VALUE, this._laterValue);
        this._laterValue = null;
      }
      if (this._endLater) {
        this._send(END);
      }
    }
  }
});





// .throttle(wait, {leading, trailing})

withOneSource('throttle', {
  _init: function(args) {
    this._wait = Math.max(0, args[0]);
    this._leading = get(args[1], 'leading', true);
    this._trailing = get(args[1], 'trailing', true);
    this._trailingValue = null;
    this._timeoutId = null;
    this._endLater = false;
    this._lastCallTime = 0;
    var $ = this;
    this._$trailingCall = function() {  $._trailingCall()  };
  },
  _free: function() {
    this._trailingValue = null;
    this._$trailingCall = null;
  },
  _handleValue: function(x, isCurrent) {
    if (isCurrent) {
      this._send(VALUE, x, isCurrent);
    } else {
      var curTime = now();
      if (this._lastCallTime === 0 && !this._leading) {
        this._lastCallTime = curTime;
      }
      var remaining = this._wait - (curTime - this._lastCallTime);
      if (remaining <= 0) {
        this._cancelTraling();
        this._lastCallTime = curTime;
        this._send(VALUE, x);
      } else if (this._trailing) {
        this._cancelTraling();
        this._trailingValue = x;
        this._timeoutId = setTimeout(this._$trailingCall, remaining);
      }
    }
  },
  _handleEnd: function(__, isCurrent) {
    if (isCurrent) {
      this._send(END, null, isCurrent);
    } else {
      if (this._timeoutId) {
        this._endLater = true;
      } else {
        this._send(END);
      }
    }
  },
  _cancelTraling: function() {
    if (this._timeoutId !== null) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  },
  _trailingCall: function() {
    this._send(VALUE, this._trailingValue);
    this._timeoutId = null;
    this._trailingValue = null;
    this._lastCallTime = !this._leading ? 0 : now();
    if (this._endLater) {
      this._send(END);
    }
  }
});





// .delay()

withOneSource('delay', {
  _init: function(args) {
    this._wait = Math.max(0, args[0]);
    this._buff = [];
    var $ = this;
    this._$shiftBuff = function() {  $._send(VALUE, $._buff.shift())  }
  },
  _free: function() {
    this._buff = null;
    this._$shiftBuff = null;
  },
  _handleValue: function(x, isCurrent) {
    if (isCurrent) {
      this._send(VALUE, x, isCurrent);
    } else {
      this._buff.push(x);
      setTimeout(this._$shiftBuff, this._wait);
    }
  },
  _handleEnd: function(__, isCurrent) {
    if (isCurrent) {
      this._send(END, null, isCurrent);
    } else {
      var $ = this;
      setTimeout(function() {  $._send(END)  }, this._wait);
    }
  }
});

// Kefir.fromBinder(fn)

function FromBinder(fn) {
  Stream.call(this);
  this._fn = fn;
  this._unsubscribe = null;
}

inherit(FromBinder, Stream, {

  _name: 'fromBinder',

  _onActivation: function() {
    var $ = this
      , isCurrent = true
      , emitter = {
        emit: function(x) {  $._send(VALUE, x, isCurrent)  },
        end: function() {  $._send(END, null, isCurrent)  }
      };
    this._unsubscribe = this._fn(emitter) || null;
    isCurrent = false;
  },
  _onDeactivation: function() {
    if (this._unsubscribe !== null) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
  },

  _clear: function() {
    Stream.prototype._clear.call(this);
    this._fn = null;
  }

})

Kefir.fromBinder = function(fn) {
  return new FromBinder(fn);
}






// Kefir.emitter()

function Emitter() {
  Stream.call(this);
}

inherit(Emitter, Stream, {
  _name: 'emitter',
  emit: function(x) {
    this._send(VALUE, x);
    return this;
  },
  end: function() {
    this._send(END);
    return this;
  }
});

Kefir.emitter = function() {
  return new Emitter();
}







// Kefir.never()

var neverObj = new Stream();
neverObj._send(END);
neverObj._name = 'never';
Kefir.never = function() {  return neverObj  }





// Kefir.constant(x)

function Constant(x) {
  Property.call(this);
  this._send(VALUE, x);
  this._send(END);
}

inherit(Constant, Property, {
  _name: 'constant'
})

Kefir.constant = function(x) {
  return new Constant(x);
}


// .setName

Observable.prototype.setName = function(sourceObs, selfName /* or just selfName */) {
  this._name = selfName ? sourceObs._name + '.' + selfName : sourceObs;
  return this;
}



// .mapTo

Observable.prototype.mapTo = function(value) {
  return this.map(function() {  return value  }).setName(this, 'mapTo');
}



// .pluck

Observable.prototype.pluck = function(propertyName) {
  return this.map(function(x) {
    return x[propertyName];
  }).setName(this, 'pluck');
}



// .invoke

Observable.prototype.invoke = function(methodName /*, arg1, arg2... */) {
  var args = rest(arguments, 1);
  return this.map(args ?
    function(x) {  return apply(x[methodName], x, args)  } :
    function(x) {  return x[methodName]()  }
  ).setName(this, 'invoke');
}




// .timestamp

Observable.prototype.timestamp = function() {
  return this.map(function(x) {  return {value: x, time: now()}  }).setName(this, 'timestamp');
}




// .tap

Observable.prototype.tap = function(fn) {
  return this.map(function(x) {
    fn(x);
    return x;
  }).setName(this, 'tap');
}



// .and

Kefir.and = function(observables) {
  return Kefir.combine(observables, and).setName('and');
}

Observable.prototype.and = function(other) {
  return this.combine(other, and).setName('and');
}



// .or

Kefir.or = function(observables) {
  return Kefir.combine(observables, or).setName('or');
}

Observable.prototype.or = function(other) {
  return this.combine(other, or).setName('or');
}



// .not

Observable.prototype.not = function() {
  return this.map(not).setName(this, 'not');
}



// .awaiting

Observable.prototype.awaiting = function(other) {
  return Kefir.merge([
    this.mapTo(true),
    other.mapTo(false)
  ]).skipDuplicates().toProperty(false).setName(this, 'awaiting');
}




// .fromCallback

Kefir.fromCallback = function(callbackConsumer) {
  var called = false;
  return Kefir.fromBinder(function(emitter) {
    if (!called) {
      callbackConsumer(function(x) {
        emitter.emit(x);
        emitter.end();
      });
      called = true;
    }
  }).setName('fromCallback');
}





// ._fromEvent

Kefir._fromEvent = function(sub, unsub, transformer) {
  return Kefir.fromBinder(function(emitter) {
    var handler = transformer ? function() {
      emitter.emit(apply(transformer, this, arguments));
    } : emitter.emit;
    sub(handler);
    return function() {  unsub(handler)  };
  });
}




// .fromEvent

var subUnsubPairs = [
  ['addEventListener', 'removeEventListener'],
  ['addListener', 'removeListener'],
  ['on', 'off']
];

Kefir.fromEvent = function(target, eventName, transformer) {
  var pair, sub, unsub;

  for (var i = 0; i < subUnsubPairs.length; i++) {
    pair = subUnsubPairs[i];
    if (isFn(target[pair[0]]) && isFn(target[pair[1]])) {
      sub = pair[0];
      unsub = pair[1];
      break;
    }
  }

  if (sub === undefined) {
    throw new Error('target don\'t support any of addEventListener/removeEventListener, addListener/removeListener, on/off method pair');
  }

  return Kefir._fromEvent(
    function(handler) {  target[sub](eventName, handler)  },
    function(handler) {  target[unsub](eventName, handler)  },
    transformer
  ).setName('fromEvent');
}

withTwoSources('filterBy', {

  _handlePrimaryValue: function(x, isCurrent) {
    if (this._lastSecondary !== NOTHING && this._lastSecondary) {
      this._send(VALUE, x, isCurrent);
    }
  },

  _handleSecondaryEnd: function(__, isCurrent) {
    if (this._lastSecondary === NOTHING || !this._lastSecondary) {
      this._send(END, null, isCurrent);
    }
  }

});



withTwoSources('skipUntilBy', {

  _handlePrimaryValue: function(x, isCurrent) {
    if (this._lastSecondary !== NOTHING) {
      this._send(VALUE, x, isCurrent);
    }
  },

  _handleSecondaryValue: function(x) {
    this._lastSecondary = x;
    this._removeSecondary();
  },

  _handleSecondaryEnd: function(__, isCurrent) {
    if (this._lastSecondary === NOTHING) {
      this._send(END, null, isCurrent);
    }
  }

});



withTwoSources('takeUntilBy', {

  _handleSecondaryValue: function(x, isCurrent) {
    this._send(END, null, isCurrent);
  }

});



withTwoSources('takeWhileBy', {

  _handlePrimaryValue: function(x, isCurrent) {
    if (this._lastSecondary !== NOTHING) {
      this._send(VALUE, x, isCurrent);
    }
  },

  _handleSecondaryValue: function(x, isCurrent) {
    this._lastSecondary = x;
    if (!this._lastSecondary) {
      this._send(END, null, isCurrent);
    }
  },

  _handleSecondaryEnd: function(__, isCurrent) {
    if (this._lastSecondary === NOTHING) {
      this._send(END, null, isCurrent);
    }
  }

});




withTwoSources('skipWhileBy', {

  _handlePrimaryValue: function(x, isCurrent) {
    if (this._lastSecondary !== NOTHING && !this._lastSecondary) {
      this._send(VALUE, x, isCurrent);
    }
  },

  _handleSecondaryValue: function(x, isCurrent) {
    this._lastSecondary = x;
    if (!this._lastSecondary) {
      this._removeSecondary();
    }
  },

  _handleSecondaryEnd: function(__, isCurrent) {
    if (this._lastSecondary === NOTHING || this._lastSecondary) {
      this._send(END, null, isCurrent);
    }
  }

});


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
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],3:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],4:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],5:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":4,"_process":3,"inherits":2}],6:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v1.11.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-05-01T17:42Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper window is present,
		// execute the factory and get jQuery
		// For environments that do not inherently posses a window with a document
		// (such as Node.js), expose a jQuery-making factory as module.exports
		// This accentuates the need for the creation of a real window
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//

var deletedIds = [];

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "1.11.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1, IE<9
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: deletedIds.sort,
	splice: deletedIds.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		return !jQuery.isArray( obj ) && obj - parseFloat( obj ) >= 0;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( support.ownLast ) {
			for ( key in obj ) {
				return hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call(obj) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1, IE<9
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( indexOf ) {
				return indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		while ( j < len ) {
			first[ i++ ] = second[ j++ ];
		}

		// Support: IE<9
		// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
		if ( len !== len ) {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: function() {
		return +( new Date() );
	},

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v1.10.19
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-04-18
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + characterEncoding + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document (jQuery #6963)
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== strundefined && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare,
		doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent !== parent.top ) {
		// IE11 does not have attachEvent, so all must suffer
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", function() {
				setDocument();
			}, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", function() {
				setDocument();
			});
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = rnative.test( doc.getElementsByClassName ) && assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select msallowclip=''><option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowclip^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (oldCache = outerCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							outerCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context !== document && context;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is no seed and only one group
	if ( match.length === 1 ) {

		// Take a shortcut and set the context if the root selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		}));
};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
});


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.extend({
	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

jQuery.fn.extend({
	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.unique(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});
var rnotwhite = (/\S+/g);



// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );

					} else if ( !(--remaining) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {
	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
});

/**
 * Clean-up method for dom ready events
 */
function detach() {
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );

	} else {
		document.detachEvent( "onreadystatechange", completed );
		window.detachEvent( "onload", completed );
	}
}

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	// readyState === "complete" is good enough for us to call the dom ready in oldIE
	if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
		detach();
		jQuery.ready();
	}
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};


var strundefined = typeof undefined;



// Support: IE<9
// Iteration over object's inherited properties before its own
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownLast = i !== "0";

// Note: most support tests are defined in their respective modules.
// false until the test is run
support.inlineBlockNeedsLayout = false;

// Execute ASAP in case we need to set body.style.zoom
jQuery(function() {
	// Minified: var a,b,c,d
	var val, div, body, container;

	body = document.getElementsByTagName( "body" )[ 0 ];
	if ( !body || !body.style ) {
		// Return for frameset docs that don't have a body
		return;
	}

	// Setup
	div = document.createElement( "div" );
	container = document.createElement( "div" );
	container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
	body.appendChild( container ).appendChild( div );

	if ( typeof div.style.zoom !== strundefined ) {
		// Support: IE<8
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

		support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
		if ( val ) {
			// Prevent IE 6 from affecting layout for positioned elements #11048
			// Prevent IE from shrinking the body in IE 7 mode #12869
			// Support: IE<8
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );
});




(function() {
	var div = document.createElement( "div" );

	// Execute the test only if not already executed in another module.
	if (support.deleteExpando == null) {
		// Support: IE<9
		support.deleteExpando = true;
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
})();


/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( elem ) {
	var noData = jQuery.noData[ (elem.nodeName + " ").toLowerCase() ],
		nodeType = +elem.nodeType || 1;

	// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
	return nodeType !== 1 && nodeType !== 9 ?
		false :

		// Nodes accept data unless otherwise specified; rejection can be conditional
		!noData || noData !== true && elem.getAttribute("classid") === noData;
};


var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}

function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements (space-suffixed to avoid Object.prototype collisions)
	// throw uncatchable exceptions if you attempt to set expando properties
	noData: {
		"applet ": true,
		"embed ": true,
		// ...but Flash objects (which have this classid) *can* handle expandos
		"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var i, name, data,
			elem = this[0],
			attrs = elem && elem.attributes;

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice(5) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});


jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};



// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		length = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {
			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < length; i++ ) {
				fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			length ? fn( elems[0], key ) : emptyGet;
};
var rcheckableType = (/^(?:checkbox|radio)$/i);



(function() {
	// Minified: var a,b,c
	var input = document.createElement( "input" ),
		div = document.createElement( "div" ),
		fragment = document.createDocumentFragment();

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName( "tbody" ).length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	input.type = "checkbox";
	input.checked = true;
	fragment.appendChild( input );
	support.appendChecked = input.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE6-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// #11217 - WebKit loses check when the name is after the checked attribute
	fragment.appendChild( div );
	div.innerHTML = "<input type='radio' checked='checked' name='t'/>";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	support.noCloneEvent = true;
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Execute the test only if not already executed in another module.
	if (support.deleteExpando == null) {
		// Support: IE<9
		support.deleteExpando = true;
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}
	}
})();


(function() {
	var i, eventName,
		div = document.createElement( "div" );

	// Support: IE<9 (lack submit/change bubble), Firefox 23+ (lack focusin event)
	for ( i in { submit: true, change: true, focusin: true }) {
		eventName = "on" + i;

		if ( !(support[ i + "Bubbles" ] = eventName in window) ) {
			// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
			div.setAttribute( eventName, "t" );
			support[ i + "Bubbles" ] = div.attributes[ eventName ].expando === false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
})();


var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&
				// Support: IE < 9, Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					jQuery._removeData( doc, fix );
				} else {
					jQuery._data( doc, fix, attaches );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!support.noCloneEvent || !support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = (rtagName.exec( elem ) || [ "", "" ])[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						deletedIds.push( id );
					}
				}
			}
		}
	}
});

jQuery.fn.extend({
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	remove: function( selector, keepData /* Internal Use Only */ ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map(function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ (rtagName.exec( value ) || [ "", "" ])[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var arg = arguments[ 0 ];

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			arg = this.parentNode;

			jQuery.cleanData( getAll( this ) );

			if ( arg ) {
				arg.replaceChild( elem, this );
			}
		});

		// Force removal if there was no new content (e.g., from empty arguments)
		return arg && (arg.length || arg.nodeType) ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});


var iframe,
	elemdisplay = {};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var style,
		elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		// getDefaultComputedStyle might be reliably used only on attached element
		display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?

			// Use of this method is a temporary fix (more like optmization) until something better comes along,
			// since it was removed from specification and supported only in FF
			style.display : jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}


(function() {
	var shrinkWrapBlocksVal;

	support.shrinkWrapBlocks = function() {
		if ( shrinkWrapBlocksVal != null ) {
			return shrinkWrapBlocksVal;
		}

		// Will be changed later if needed.
		shrinkWrapBlocksVal = false;

		// Minified: var b,c,d
		var div, body, container;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {
			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		// Support: IE6
		// Check if elements with layout shrink-wrap their children
		if ( typeof div.style.zoom !== strundefined ) {
			// Reset CSS: box-sizing; display; margin; border
			div.style.cssText =
				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;" +
				"padding:1px;width:1px;zoom:1";
			div.appendChild( document.createElement( "div" ) ).style.width = "5px";
			shrinkWrapBlocksVal = div.offsetWidth !== 3;
		}

		body.removeChild( container );

		return shrinkWrapBlocksVal;
	};

})();
var rmargin = (/^margin/);

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );



var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}




function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			var condition = conditionFn();

			if ( condition == null ) {
				// The test was not ready at this point; screw the hook this time
				// but check again when needed next time.
				return;
			}

			if ( condition ) {
				// Hook not needed (or it's not possible to use it due to missing dependency),
				// remove it.
				// Since there are no other hooks for marginRight, remove the whole object.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.

			return (this.get = hookFn).apply( this, arguments );
		}
	};
}


(function() {
	// Minified: var b,c,d,e,f,g, h,i
	var div, style, a, pixelPositionVal, boxSizingReliableVal,
		reliableHiddenOffsetsVal, reliableMarginRightVal;

	// Setup
	div = document.createElement( "div" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];
	style = a && a.style;

	// Finish early in limited (non-browser) environments
	if ( !style ) {
		return;
	}

	style.cssText = "float:left;opacity:.5";

	// Support: IE<9
	// Make sure that element opacity exists (as opposed to filter)
	support.opacity = style.opacity === "0.5";

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: Firefox<29, Android 2.3
	// Vendor-prefix box-sizing
	support.boxSizing = style.boxSizing === "" || style.MozBoxSizing === "" ||
		style.WebkitBoxSizing === "";

	jQuery.extend(support, {
		reliableHiddenOffsets: function() {
			if ( reliableHiddenOffsetsVal == null ) {
				computeStyleTests();
			}
			return reliableHiddenOffsetsVal;
		},

		boxSizingReliable: function() {
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},

		pixelPosition: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelPositionVal;
		},

		// Support: Android 2.3
		reliableMarginRight: function() {
			if ( reliableMarginRightVal == null ) {
				computeStyleTests();
			}
			return reliableMarginRightVal;
		}
	});

	function computeStyleTests() {
		// Minified: var b,c,d,j
		var div, body, container, contents;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {
			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		div.style.cssText =
			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
			"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
			"border:1px;padding:1px;width:4px;position:absolute";

		// Support: IE<9
		// Assume reasonable values in the absence of getComputedStyle
		pixelPositionVal = boxSizingReliableVal = false;
		reliableMarginRightVal = true;

		// Check for getComputedStyle so that this code is not run in IE<9.
		if ( window.getComputedStyle ) {
			pixelPositionVal = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			boxSizingReliableVal =
				( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Support: Android 2.3
			// Div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			contents = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			contents.style.cssText = div.style.cssText =
				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
			contents.style.marginRight = contents.style.width = "0";
			div.style.width = "1px";

			reliableMarginRightVal =
				!parseFloat( ( window.getComputedStyle( contents, null ) || {} ).marginRight );
		}

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		contents = div.getElementsByTagName( "td" );
		contents[ 0 ].style.cssText = "margin:0;border:0;padding:0;display:none";
		reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
		if ( reliableHiddenOffsetsVal ) {
			contents[ 0 ].style.display = "";
			contents[ 1 ].style.display = "none";
			reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
		}

		body.removeChild( container );
	}

})();


// A method for quickly swapping in/out CSS properties to get correct calculations.
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var
		ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,

	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];


// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display && display !== "none" || !hidden ) {
				jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Support: IE
				// Swallow errors from 'invalid' CSS values (#5509)
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// Work around by temporarily setting element display to inline-block
			return jQuery.swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

jQuery.fn.extend({
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	}
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		} ]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			jQuery._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";
			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !support.shrinkWrapBlocks() ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {
	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};


(function() {
	// Minified: var a,b,c,d,e
	var input, div, select, a, opt;

	// Setup
	div = document.createElement( "div" );
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName("a")[ 0 ];

	// First batch of tests.
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE8 only
	// Check if we can trust getAttribute("value")
	input = document.createElement( "input" );
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";
})();


var rreturn = /\r/g;

jQuery.fn.extend({
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					jQuery.trim( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) >= 0 ) {

						// Support: IE6
						// When new option element is added to select box we need to
						// force reflow of newly added node in order to workaround delay
						// of initialization properties
						try {
							option.selected = optionSet = true;

						} catch ( _ ) {

							// Will be executed only in IE6
							option.scrollHeight;
						}

					} else {
						option.selected = false;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}

				return options;
			}
		}
	}
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});




var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = support.getSetAttribute,
	getSetInput = support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
});

jQuery.extend({
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// Retrieve booleans specially
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {

	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {
				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		} :
		function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
			}
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			if ( name === "value" || value === elem.getAttribute( name ) ) {
				return value;
			}
		}
	};

	// Some attributes are constructed with empty-string values when not defined
	attrHandle.id = attrHandle.name = attrHandle.coords =
		function( elem, name, isXML ) {
			var ret;
			if ( !isXML ) {
				return (ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
			}
		};

	// Fixing value retrieval on a button requires this module
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			if ( ret && ret.specified ) {
				return ret.value;
			}
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}

if ( !support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}




var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend({
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	}
});

jQuery.extend({
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

// Support: Safari, IE9+
// mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}




var rclass = /[\t\r\n\f]/g;

jQuery.fn.extend({
	addClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = value ? jQuery.trim( cur ) : "";
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}
});




// Return jQuery for attributes-only inclusion


jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});


var nonce = jQuery.now();

var rquery = (/\?/);



var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {
	// Attempt to parse using the native JSON parser first
	if ( window.JSON && window.JSON.parse ) {
		// Support: Android 2.3
		// Workaround failure to string-cast null input
		return window.JSON.parse( data + "" );
	}

	var requireNonComma,
		depth = null,
		str = jQuery.trim( data + "" );

	// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
	// after removing valid tokens
	return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {

		// Force termination if we see a misplaced comma
		if ( requireNonComma && comma ) {
			depth = 0;
		}

		// Perform no more replacements after returning to outermost depth
		if ( depth === 0 ) {
			return token;
		}

		// Commas must not follow "[", "{", or ","
		requireNonComma = open || comma;

		// Determine new depth
		// array/object open ("[" or "{"): depth += true - false (increment)
		// array/object close ("]" or "}"): depth += false - true (decrement)
		// other cases ("," or primitive): depth += true - true (numeric cast)
		depth += !close - !open;

		// Remove this token
		return "";
	}) ) ?
		( Function( "return " + str ) )() :
		jQuery.error( "Invalid JSON: " + data );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	try {
		if ( window.DOMParser ) { // Standard
			tmp = new DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} else { // IE
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}
	} catch( e ) {
		xml = undefined;
	}
	if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType.charAt( 0 ) === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});


jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};


jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});


jQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
		(!support.reliableHiddenOffsets() &&
			((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});


// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?
	// Support: IE6+
	function() {

		// XHR cannot access local files, always use ActiveX for that case
		return !this.isLocal &&

			// Support: IE7-8
			// oldIE XHR does not support non-RFC2616 methods (#13240)
			// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
			// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
			// Although this check for six methods instead of eight
			// since IE also does not support "trace" and "connect"
			/^(get|post|head|put|delete|options)$/i.test( this.type ) &&

			createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

var xhrId = 0,
	xhrCallbacks = {},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE<10
// Open requests must be manually aborted on unload (#5280)
if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	});
}

// Determine support properties
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( options ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !options.crossDomain || support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					// Open the socket
					xhr.open( options.type, options.url, options.async, options.username, options.password );

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {
						// Support: IE<9
						// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
						// request header to a null-value.
						//
						// To keep consistent with other XHR implementations, cast the value
						// to string and ignore `undefined`.
						if ( headers[ i ] !== undefined ) {
							xhr.setRequestHeader( i, headers[ i ] + "" );
						}
					}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( options.hasContent && options.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, statusText, responses;

						// Was never called and is aborted or complete
						if ( callback && ( isAbort || xhr.readyState === 4 ) ) {
							// Clean up
							delete xhrCallbacks[ id ];
							callback = undefined;
							xhr.onreadystatechange = jQuery.noop;

							// Abort manually if needed
							if ( isAbort ) {
								if ( xhr.readyState !== 4 ) {
									xhr.abort();
								}
							} else {
								responses = {};
								status = xhr.status;

								// Support: IE<10
								// Accessing binary-data responseText throws an exception
								// (#11426)
								if ( typeof xhr.responseText === "string" ) {
									responses.text = xhr.responseText;
								}

								// Firefox throws an exception when accessing
								// statusText for faulty cross-domain requests
								try {
									statusText = xhr.statusText;
								} catch( e ) {
									// We normalize with Webkit giving an empty statusText
									statusText = "";
								}

								// Filter status for non standard behaviors

								// If the request is local and we have data: assume a success
								// (success with no data won't get notified, that's the best we
								// can do given current implementations)
								if ( !status && options.isLocal && !options.crossDomain ) {
									status = responses.text ? 200 : 404;
								// IE - #1450: sometimes returns 1223 when it should be 204
								} else if ( status === 1223 ) {
									status = 204;
								}
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, xhr.getAllResponseHeaders() );
						}
					};

					if ( !options.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						// Add to the list of active xhr callbacks
						xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});




// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = jQuery.trim( url.slice( off, url.length ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep(jQuery.timers, function( fn ) {
		return elem === fn.elem;
	}).length;
};





var docElem = window.document.documentElement;

/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			jQuery.inArray("auto", [ curCSSTop, curCSSLeft ] ) > -1;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend({
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var docElem, win,
			box = { top: 0, left: 0 },
			elem = this[ 0 ],
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== strundefined ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
			left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );
				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
});


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});


// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	});
}




var
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;

}));

},{}],7:[function(require,module,exports){
/**
 * Sinon core utilities. For internal use only.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var sinon = (function () {
    var sinon;
    var isNode = typeof module !== "undefined" && module.exports && typeof require === "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require, exports, module) {
        sinon = module.exports = require("./sinon/util/core");
        require("./sinon/extend");
        require("./sinon/typeOf");
        require("./sinon/times_in_words");
        require("./sinon/spy");
        require("./sinon/call");
        require("./sinon/behavior");
        require("./sinon/stub");
        require("./sinon/mock");
        require("./sinon/collection");
        require("./sinon/assert");
        require("./sinon/sandbox");
        require("./sinon/test");
        require("./sinon/test_case");
        require("./sinon/match");
        require("./sinon/format");
        require("./sinon/log_error");
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
        sinon = module.exports;
    } else {
        sinon = {};
    }

    return sinon;
}());

},{"./sinon/assert":8,"./sinon/behavior":9,"./sinon/call":10,"./sinon/collection":11,"./sinon/extend":12,"./sinon/format":13,"./sinon/log_error":14,"./sinon/match":15,"./sinon/mock":16,"./sinon/sandbox":17,"./sinon/spy":18,"./sinon/stub":19,"./sinon/test":20,"./sinon/test_case":21,"./sinon/times_in_words":22,"./sinon/typeOf":23,"./sinon/util/core":24}],8:[function(require,module,exports){
(function (global){
/**
 * @depend times_in_words.js
 * @depend util/core.js
 * @depend stub.js
 * @depend format.js
 */
/**
 * Assertions matching the test spy retrieval interface.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function (sinon, global) {
    var slice = Array.prototype.slice;

    function makeApi(sinon) {
        var assert;

        function verifyIsStub() {
            var method;

            for (var i = 0, l = arguments.length; i < l; ++i) {
                method = arguments[i];

                if (!method) {
                    assert.fail("fake is not a spy");
                }

                if (typeof method != "function") {
                    assert.fail(method + " is not a function");
                }

                if (typeof method.getCall != "function") {
                    assert.fail(method + " is not stubbed");
                }
            }
        }

        function failAssertion(object, msg) {
            object = object || global;
            var failMethod = object.fail || assert.fail;
            failMethod.call(object, msg);
        }

        function mirrorPropAsAssertion(name, method, message) {
            if (arguments.length == 2) {
                message = method;
                method = name;
            }

            assert[name] = function (fake) {
                verifyIsStub(fake);

                var args = slice.call(arguments, 1);
                var failed = false;

                if (typeof method == "function") {
                    failed = !method(fake);
                } else {
                    failed = typeof fake[method] == "function" ?
                        !fake[method].apply(fake, args) : !fake[method];
                }

                if (failed) {
                    failAssertion(this, fake.printf.apply(fake, [message].concat(args)));
                } else {
                    assert.pass(name);
                }
            };
        }

        function exposedName(prefix, prop) {
            return !prefix || /^fail/.test(prop) ? prop :
                prefix + prop.slice(0, 1).toUpperCase() + prop.slice(1);
        }

        assert = {
            failException: "AssertError",

            fail: function fail(message) {
                var error = new Error(message);
                error.name = this.failException || assert.failException;

                throw error;
            },

            pass: function pass(assertion) {},

            callOrder: function assertCallOrder() {
                verifyIsStub.apply(null, arguments);
                var expected = "", actual = "";

                if (!sinon.calledInOrder(arguments)) {
                    try {
                        expected = [].join.call(arguments, ", ");
                        var calls = slice.call(arguments);
                        var i = calls.length;
                        while (i) {
                            if (!calls[--i].called) {
                                calls.splice(i, 1);
                            }
                        }
                        actual = sinon.orderByFirstCall(calls).join(", ");
                    } catch (e) {
                        // If this fails, we'll just fall back to the blank string
                    }

                    failAssertion(this, "expected " + expected + " to be " +
                                "called in order but were called as " + actual);
                } else {
                    assert.pass("callOrder");
                }
            },

            callCount: function assertCallCount(method, count) {
                verifyIsStub(method);

                if (method.callCount != count) {
                    var msg = "expected %n to be called " + sinon.timesInWords(count) +
                        " but was called %c%C";
                    failAssertion(this, method.printf(msg));
                } else {
                    assert.pass("callCount");
                }
            },

            expose: function expose(target, options) {
                if (!target) {
                    throw new TypeError("target is null or undefined");
                }

                var o = options || {};
                var prefix = typeof o.prefix == "undefined" && "assert" || o.prefix;
                var includeFail = typeof o.includeFail == "undefined" || !!o.includeFail;

                for (var method in this) {
                    if (method != "expose" && (includeFail || !/^(fail)/.test(method))) {
                        target[exposedName(prefix, method)] = this[method];
                    }
                }

                return target;
            },

            match: function match(actual, expectation) {
                var matcher = sinon.match(expectation);
                if (matcher.test(actual)) {
                    assert.pass("match");
                } else {
                    var formatted = [
                        "expected value to match",
                        "    expected = " + sinon.format(expectation),
                        "    actual = " + sinon.format(actual)
                    ]
                    failAssertion(this, formatted.join("\n"));
                }
            }
        };

        mirrorPropAsAssertion("called", "expected %n to have been called at least once but was never called");
        mirrorPropAsAssertion("notCalled", function (spy) { return !spy.called; },
                            "expected %n to not have been called but was called %c%C");
        mirrorPropAsAssertion("calledOnce", "expected %n to be called once but was called %c%C");
        mirrorPropAsAssertion("calledTwice", "expected %n to be called twice but was called %c%C");
        mirrorPropAsAssertion("calledThrice", "expected %n to be called thrice but was called %c%C");
        mirrorPropAsAssertion("calledOn", "expected %n to be called with %1 as this but was called with %t");
        mirrorPropAsAssertion("alwaysCalledOn", "expected %n to always be called with %1 as this but was called with %t");
        mirrorPropAsAssertion("calledWithNew", "expected %n to be called with new");
        mirrorPropAsAssertion("alwaysCalledWithNew", "expected %n to always be called with new");
        mirrorPropAsAssertion("calledWith", "expected %n to be called with arguments %*%C");
        mirrorPropAsAssertion("calledWithMatch", "expected %n to be called with match %*%C");
        mirrorPropAsAssertion("alwaysCalledWith", "expected %n to always be called with arguments %*%C");
        mirrorPropAsAssertion("alwaysCalledWithMatch", "expected %n to always be called with match %*%C");
        mirrorPropAsAssertion("calledWithExactly", "expected %n to be called with exact arguments %*%C");
        mirrorPropAsAssertion("alwaysCalledWithExactly", "expected %n to always be called with exact arguments %*%C");
        mirrorPropAsAssertion("neverCalledWith", "expected %n to never be called with arguments %*%C");
        mirrorPropAsAssertion("neverCalledWithMatch", "expected %n to never be called with match %*%C");
        mirrorPropAsAssertion("threw", "%n did not throw exception%C");
        mirrorPropAsAssertion("alwaysThrew", "%n did not always throw exception%C");

        sinon.assert = assert;
        return assert;
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require, exports, module) {
        var sinon = require("./util/core");
        require("./match");
        module.exports = makeApi(sinon);
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else if (!sinon) {
        return;
    } else {
        makeApi(sinon);
    }

}(typeof sinon == "object" && sinon || null, typeof window != "undefined" ? window : (typeof self != "undefined") ? self : global));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./match":15,"./util/core":24}],9:[function(require,module,exports){
(function (process){
/**
 * @depend util/core.js
 * @depend extend.js
 */
/**
 * Stub behavior
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @author Tim Fischbach (mail@timfischbach.de)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function (sinon) {
    var slice = Array.prototype.slice;
    var join = Array.prototype.join;

    var nextTick = (function () {
        if (typeof process === "object" && typeof process.nextTick === "function") {
            return process.nextTick;
        } else if (typeof setImmediate === "function") {
            return setImmediate;
        } else {
            return function (callback) {
                setTimeout(callback, 0);
            };
        }
    })();

    function throwsException(error, message) {
        if (typeof error == "string") {
            this.exception = new Error(message || "");
            this.exception.name = error;
        } else if (!error) {
            this.exception = new Error("Error");
        } else {
            this.exception = error;
        }

        return this;
    }

    function getCallback(behavior, args) {
        var callArgAt = behavior.callArgAt;

        if (callArgAt < 0) {
            var callArgProp = behavior.callArgProp;

            for (var i = 0, l = args.length; i < l; ++i) {
                if (!callArgProp && typeof args[i] == "function") {
                    return args[i];
                }

                if (callArgProp && args[i] &&
                    typeof args[i][callArgProp] == "function") {
                    return args[i][callArgProp];
                }
            }

            return null;
        }

        return args[callArgAt];
    }

    function makeApi(sinon) {
        function getCallbackError(behavior, func, args) {
            if (behavior.callArgAt < 0) {
                var msg;

                if (behavior.callArgProp) {
                    msg = sinon.functionName(behavior.stub) +
                        " expected to yield to '" + behavior.callArgProp +
                        "', but no object with such a property was passed.";
                } else {
                    msg = sinon.functionName(behavior.stub) +
                        " expected to yield, but no callback was passed.";
                }

                if (args.length > 0) {
                    msg += " Received [" + join.call(args, ", ") + "]";
                }

                return msg;
            }

            return "argument at index " + behavior.callArgAt + " is not a function: " + func;
        }

        function callCallback(behavior, args) {
            if (typeof behavior.callArgAt == "number") {
                var func = getCallback(behavior, args);

                if (typeof func != "function") {
                    throw new TypeError(getCallbackError(behavior, func, args));
                }

                if (behavior.callbackAsync) {
                    nextTick(function () {
                        func.apply(behavior.callbackContext, behavior.callbackArguments);
                    });
                } else {
                    func.apply(behavior.callbackContext, behavior.callbackArguments);
                }
            }
        }

        var proto = {
            create: function create(stub) {
                var behavior = sinon.extend({}, sinon.behavior);
                delete behavior.create;
                behavior.stub = stub;

                return behavior;
            },

            isPresent: function isPresent() {
                return (typeof this.callArgAt == "number" ||
                        this.exception ||
                        typeof this.returnArgAt == "number" ||
                        this.returnThis ||
                        this.returnValueDefined);
            },

            invoke: function invoke(context, args) {
                callCallback(this, args);

                if (this.exception) {
                    throw this.exception;
                } else if (typeof this.returnArgAt == "number") {
                    return args[this.returnArgAt];
                } else if (this.returnThis) {
                    return context;
                }

                return this.returnValue;
            },

            onCall: function onCall(index) {
                return this.stub.onCall(index);
            },

            onFirstCall: function onFirstCall() {
                return this.stub.onFirstCall();
            },

            onSecondCall: function onSecondCall() {
                return this.stub.onSecondCall();
            },

            onThirdCall: function onThirdCall() {
                return this.stub.onThirdCall();
            },

            withArgs: function withArgs(/* arguments */) {
                throw new Error("Defining a stub by invoking \"stub.onCall(...).withArgs(...)\" is not supported. " +
                                "Use \"stub.withArgs(...).onCall(...)\" to define sequential behavior for calls with certain arguments.");
            },

            callsArg: function callsArg(pos) {
                if (typeof pos != "number") {
                    throw new TypeError("argument index is not number");
                }

                this.callArgAt = pos;
                this.callbackArguments = [];
                this.callbackContext = undefined;
                this.callArgProp = undefined;
                this.callbackAsync = false;

                return this;
            },

            callsArgOn: function callsArgOn(pos, context) {
                if (typeof pos != "number") {
                    throw new TypeError("argument index is not number");
                }
                if (typeof context != "object") {
                    throw new TypeError("argument context is not an object");
                }

                this.callArgAt = pos;
                this.callbackArguments = [];
                this.callbackContext = context;
                this.callArgProp = undefined;
                this.callbackAsync = false;

                return this;
            },

            callsArgWith: function callsArgWith(pos) {
                if (typeof pos != "number") {
                    throw new TypeError("argument index is not number");
                }

                this.callArgAt = pos;
                this.callbackArguments = slice.call(arguments, 1);
                this.callbackContext = undefined;
                this.callArgProp = undefined;
                this.callbackAsync = false;

                return this;
            },

            callsArgOnWith: function callsArgWith(pos, context) {
                if (typeof pos != "number") {
                    throw new TypeError("argument index is not number");
                }
                if (typeof context != "object") {
                    throw new TypeError("argument context is not an object");
                }

                this.callArgAt = pos;
                this.callbackArguments = slice.call(arguments, 2);
                this.callbackContext = context;
                this.callArgProp = undefined;
                this.callbackAsync = false;

                return this;
            },

            yields: function () {
                this.callArgAt = -1;
                this.callbackArguments = slice.call(arguments, 0);
                this.callbackContext = undefined;
                this.callArgProp = undefined;
                this.callbackAsync = false;

                return this;
            },

            yieldsOn: function (context) {
                if (typeof context != "object") {
                    throw new TypeError("argument context is not an object");
                }

                this.callArgAt = -1;
                this.callbackArguments = slice.call(arguments, 1);
                this.callbackContext = context;
                this.callArgProp = undefined;
                this.callbackAsync = false;

                return this;
            },

            yieldsTo: function (prop) {
                this.callArgAt = -1;
                this.callbackArguments = slice.call(arguments, 1);
                this.callbackContext = undefined;
                this.callArgProp = prop;
                this.callbackAsync = false;

                return this;
            },

            yieldsToOn: function (prop, context) {
                if (typeof context != "object") {
                    throw new TypeError("argument context is not an object");
                }

                this.callArgAt = -1;
                this.callbackArguments = slice.call(arguments, 2);
                this.callbackContext = context;
                this.callArgProp = prop;
                this.callbackAsync = false;

                return this;
            },

            throws: throwsException,
            throwsException: throwsException,

            returns: function returns(value) {
                this.returnValue = value;
                this.returnValueDefined = true;

                return this;
            },

            returnsArg: function returnsArg(pos) {
                if (typeof pos != "number") {
                    throw new TypeError("argument index is not number");
                }

                this.returnArgAt = pos;

                return this;
            },

            returnsThis: function returnsThis() {
                this.returnThis = true;

                return this;
            }
        };

        // create asynchronous versions of callsArg* and yields* methods
        for (var method in proto) {
            // need to avoid creating anotherasync versions of the newly added async methods
            if (proto.hasOwnProperty(method) &&
                method.match(/^(callsArg|yields)/) &&
                !method.match(/Async/)) {
                proto[method + "Async"] = (function (syncFnName) {
                    return function () {
                        var result = this[syncFnName].apply(this, arguments);
                        this.callbackAsync = true;
                        return result;
                    };
                })(method);
            }
        }

        sinon.behavior = proto;
        return proto;
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require, exports, module) {
        var sinon = require("./util/core");
        module.exports = makeApi(sinon);
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else if (!sinon) {
        return;
    } else {
        makeApi(sinon);
    }
}(typeof sinon == "object" && sinon || null));

}).call(this,require('_process'))
},{"./util/core":24,"_process":3}],10:[function(require,module,exports){
/**
  * @depend util/core.js
  * @depend match.js
  * @depend format.js
  */
/**
  * Spy calls
  *
  * @author Christian Johansen (christian@cjohansen.no)
  * @author Maximilian Antoni (mail@maxantoni.de)
  * @license BSD
  *
  * Copyright (c) 2010-2013 Christian Johansen
  * Copyright (c) 2013 Maximilian Antoni
  */
"use strict";

(function (sinon) {
    function makeApi(sinon) {
        function throwYieldError(proxy, text, args) {
            var msg = sinon.functionName(proxy) + text;
            if (args.length) {
                msg += " Received [" + slice.call(args).join(", ") + "]";
            }
            throw new Error(msg);
        }

        var slice = Array.prototype.slice;

        var callProto = {
            calledOn: function calledOn(thisValue) {
                if (sinon.match && sinon.match.isMatcher(thisValue)) {
                    return thisValue.test(this.thisValue);
                }
                return this.thisValue === thisValue;
            },

            calledWith: function calledWith() {
                for (var i = 0, l = arguments.length; i < l; i += 1) {
                    if (!sinon.deepEqual(arguments[i], this.args[i])) {
                        return false;
                    }
                }

                return true;
            },

            calledWithMatch: function calledWithMatch() {
                for (var i = 0, l = arguments.length; i < l; i += 1) {
                    var actual = this.args[i];
                    var expectation = arguments[i];
                    if (!sinon.match || !sinon.match(expectation).test(actual)) {
                        return false;
                    }
                }
                return true;
            },

            calledWithExactly: function calledWithExactly() {
                return arguments.length == this.args.length &&
                    this.calledWith.apply(this, arguments);
            },

            notCalledWith: function notCalledWith() {
                return !this.calledWith.apply(this, arguments);
            },

            notCalledWithMatch: function notCalledWithMatch() {
                return !this.calledWithMatch.apply(this, arguments);
            },

            returned: function returned(value) {
                return sinon.deepEqual(value, this.returnValue);
            },

            threw: function threw(error) {
                if (typeof error === "undefined" || !this.exception) {
                    return !!this.exception;
                }

                return this.exception === error || this.exception.name === error;
            },

            calledWithNew: function calledWithNew() {
                return this.proxy.prototype && this.thisValue instanceof this.proxy;
            },

            calledBefore: function (other) {
                return this.callId < other.callId;
            },

            calledAfter: function (other) {
                return this.callId > other.callId;
            },

            callArg: function (pos) {
                this.args[pos]();
            },

            callArgOn: function (pos, thisValue) {
                this.args[pos].apply(thisValue);
            },

            callArgWith: function (pos) {
                this.callArgOnWith.apply(this, [pos, null].concat(slice.call(arguments, 1)));
            },

            callArgOnWith: function (pos, thisValue) {
                var args = slice.call(arguments, 2);
                this.args[pos].apply(thisValue, args);
            },

            yield: function () {
                this.yieldOn.apply(this, [null].concat(slice.call(arguments, 0)));
            },

            yieldOn: function (thisValue) {
                var args = this.args;
                for (var i = 0, l = args.length; i < l; ++i) {
                    if (typeof args[i] === "function") {
                        args[i].apply(thisValue, slice.call(arguments, 1));
                        return;
                    }
                }
                throwYieldError(this.proxy, " cannot yield since no callback was passed.", args);
            },

            yieldTo: function (prop) {
                this.yieldToOn.apply(this, [prop, null].concat(slice.call(arguments, 1)));
            },

            yieldToOn: function (prop, thisValue) {
                var args = this.args;
                for (var i = 0, l = args.length; i < l; ++i) {
                    if (args[i] && typeof args[i][prop] === "function") {
                        args[i][prop].apply(thisValue, slice.call(arguments, 2));
                        return;
                    }
                }
                throwYieldError(this.proxy, " cannot yield to '" + prop +
                    "' since no callback was passed.", args);
            },

            toString: function () {
                var callStr = this.proxy.toString() + "(";
                var args = [];

                for (var i = 0, l = this.args.length; i < l; ++i) {
                    args.push(sinon.format(this.args[i]));
                }

                callStr = callStr + args.join(", ") + ")";

                if (typeof this.returnValue != "undefined") {
                    callStr += " => " + sinon.format(this.returnValue);
                }

                if (this.exception) {
                    callStr += " !" + this.exception.name;

                    if (this.exception.message) {
                        callStr += "(" + this.exception.message + ")";
                    }
                }

                return callStr;
            }
        };

        callProto.invokeCallback = callProto.yield;

        function createSpyCall(spy, thisValue, args, returnValue, exception, id) {
            if (typeof id !== "number") {
                throw new TypeError("Call id is not a number");
            }
            var proxyCall = sinon.create(callProto);
            proxyCall.proxy = spy;
            proxyCall.thisValue = thisValue;
            proxyCall.args = args;
            proxyCall.returnValue = returnValue;
            proxyCall.exception = exception;
            proxyCall.callId = id;

            return proxyCall;
        }
        createSpyCall.toString = callProto.toString; // used by mocks

        sinon.spyCall = createSpyCall;
        return createSpyCall;
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require, exports, module) {
        var sinon = require("./util/core");
        require("./match");
        module.exports = makeApi(sinon);
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else if (!sinon) {
        return;
    } else {
        makeApi(sinon);
    }
}(typeof sinon == "object" && sinon || null));

},{"./match":15,"./util/core":24}],11:[function(require,module,exports){
/**
 * @depend util/core.js
 * @depend stub.js
 * @depend mock.js
 */
/**
 * Collections of stubs, spies and mocks.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function (sinon) {
    var push = [].push;
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function getFakes(fakeCollection) {
        if (!fakeCollection.fakes) {
            fakeCollection.fakes = [];
        }

        return fakeCollection.fakes;
    }

    function each(fakeCollection, method) {
        var fakes = getFakes(fakeCollection);

        for (var i = 0, l = fakes.length; i < l; i += 1) {
            if (typeof fakes[i][method] == "function") {
                fakes[i][method]();
            }
        }
    }

    function compact(fakeCollection) {
        var fakes = getFakes(fakeCollection);
        var i = 0;
        while (i < fakes.length) {
            fakes.splice(i, 1);
        }
    }

    function makeApi(sinon) {
        var collection = {
            verify: function resolve() {
                each(this, "verify");
            },

            restore: function restore() {
                each(this, "restore");
                compact(this);
            },

            reset: function restore() {
                each(this, "reset");
            },

            verifyAndRestore: function verifyAndRestore() {
                var exception;

                try {
                    this.verify();
                } catch (e) {
                    exception = e;
                }

                this.restore();

                if (exception) {
                    throw exception;
                }
            },

            add: function add(fake) {
                push.call(getFakes(this), fake);
                return fake;
            },

            spy: function spy() {
                return this.add(sinon.spy.apply(sinon, arguments));
            },

            stub: function stub(object, property, value) {
                if (property) {
                    var original = object[property];

                    if (typeof original != "function") {
                        if (!hasOwnProperty.call(object, property)) {
                            throw new TypeError("Cannot stub non-existent own property " + property);
                        }

                        object[property] = value;

                        return this.add({
                            restore: function () {
                                object[property] = original;
                            }
                        });
                    }
                }
                if (!property && !!object && typeof object == "object") {
                    var stubbedObj = sinon.stub.apply(sinon, arguments);

                    for (var prop in stubbedObj) {
                        if (typeof stubbedObj[prop] === "function") {
                            this.add(stubbedObj[prop]);
                        }
                    }

                    return stubbedObj;
                }

                return this.add(sinon.stub.apply(sinon, arguments));
            },

            mock: function mock() {
                return this.add(sinon.mock.apply(sinon, arguments));
            },

            inject: function inject(obj) {
                var col = this;

                obj.spy = function () {
                    return col.spy.apply(col, arguments);
                };

                obj.stub = function () {
                    return col.stub.apply(col, arguments);
                };

                obj.mock = function () {
                    return col.mock.apply(col, arguments);
                };

                return obj;
            }
        };

        sinon.collection = collection;
        return collection;
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require, exports, module) {
        var sinon = require("./util/core");
        require("./mock");
        require("./spy");
        require("./stub");
        module.exports = makeApi(sinon);
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else if (!sinon) {
        return;
    } else {
        makeApi(sinon);
    }
}(typeof sinon == "object" && sinon || null));

},{"./mock":16,"./spy":18,"./stub":19,"./util/core":24}],12:[function(require,module,exports){
/**
 * @depend ../sinon.js
 */
"use strict";

(function (sinon) {
    function makeApi(sinon) {

        // Adapted from https://developer.mozilla.org/en/docs/ECMAScript_DontEnum_attribute#JScript_DontEnum_Bug
        var hasDontEnumBug = (function () {
            var obj = {
                constructor: function () {
                    return "0";
                },
                toString: function () {
                    return "1";
                },
                valueOf: function () {
                    return "2";
                },
                toLocaleString: function () {
                    return "3";
                },
                prototype: function () {
                    return "4";
                },
                isPrototypeOf: function () {
                    return "5";
                },
                propertyIsEnumerable: function () {
                    return "6";
                },
                hasOwnProperty: function () {
                    return "7";
                },
                length: function () {
                    return "8";
                },
                unique: function () {
                    return "9"
                }
            };

            var result = [];
            for (var prop in obj) {
                result.push(obj[prop]());
            }
            return result.join("") !== "0123456789";
        })();

        /* Public: Extend target in place with all (own) properties from sources in-order. Thus, last source will
         *         override properties in previous sources.
         *
         * target - The Object to extend
         * sources - Objects to copy properties from.
         *
         * Returns the extended target
         */
        function extend(target /*, sources */) {
            var sources = Array.prototype.slice.call(arguments, 1),
                source, i, prop;

            for (i = 0; i < sources.length; i++) {
                source = sources[i];

                for (prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        target[prop] = source[prop];
                    }
                }

                // Make sure we copy (own) toString method even when in JScript with DontEnum bug
                // See https://developer.mozilla.org/en/docs/ECMAScript_DontEnum_attribute#JScript_DontEnum_Bug
                if (hasDontEnumBug && source.hasOwnProperty("toString") && source.toString !== target.toString) {
                    target.toString = source.toString;
                }
            }

            return target;
        };

        sinon.extend = extend;
        return sinon.extend;
    }

    function loadDependencies(require, exports, module) {
        var sinon = require("./util/core");
        module.exports = makeApi(sinon);
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else if (!sinon) {
        return;
    } else {
        makeApi(sinon);
    }
}(typeof sinon == "object" && sinon || null));

},{"./util/core":24}],13:[function(require,module,exports){
/**
 * @depend ../sinon.js
 */
/**
 * Format functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2014 Christian Johansen
 */
"use strict";

(function (sinon, formatio) {
    function makeApi(sinon) {
        function valueFormatter(value) {
            return "" + value;
        }

        function getFormatioFormatter() {
            var formatter = formatio.configure({
                    quoteStrings: false,
                    limitChildrenCount: 250
                });

            function format() {
                return formatter.ascii.apply(formatter, arguments);
            };

            return format;
        }

        function getNodeFormatter(value) {
            function format(value) {
                return typeof value == "object" && value.toString === Object.prototype.toString ? util.inspect(value) : value;
            };

            try {
                var util = require("util");
            } catch (e) {
                /* Node, but no util module - would be very old, but better safe than sorry */
            }

            return util ? format : valueFormatter;
        }

        var isNode = typeof module !== "undefined" && module.exports && typeof require == "function",
            formatter;

        if (isNode) {
            try {
                formatio = require("formatio");
            } catch (e) {}
        }

        if (formatio) {
            formatter = getFormatioFormatter()
        } else if (isNode) {
            formatter = getNodeFormatter();
        } else {
            formatter = valueFormatter;
        }

        sinon.format = formatter;
        return sinon.format;
    }

    function loadDependencies(require, exports, module) {
        var sinon = require("./util/core");
        module.exports = makeApi(sinon);
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else if (!sinon) {
        return;
    } else {
        makeApi(sinon);
    }
}(
    (typeof sinon == "object" && sinon || null),
    (typeof formatio == "object" && formatio)
));

},{"./util/core":24,"formatio":29,"util":5}],14:[function(require,module,exports){
/**
 * @depend ../sinon.js
 */
/**
 * Logs errors
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2014 Christian Johansen
 */
"use strict";

(function (sinon) {
    // cache a reference to setTimeout, so that our reference won't be stubbed out
    // when using fake timers and errors will still get logged
    // https://github.com/cjohansen/Sinon.JS/issues/381
    var realSetTimeout = setTimeout;

    function makeApi(sinon) {

        function log() {}

        function logError(label, err) {
            var msg = label + " threw exception: ";

            sinon.log(msg + "[" + err.name + "] " + err.message);

            if (err.stack) {
                sinon.log(err.stack);
            }

            logError.setTimeout(function () {
                err.message = msg + err.message;
                throw err;
            }, 0);
        };

        // wrap realSetTimeout with something we can stub in tests
        logError.setTimeout = function (func, timeout) {
            realSetTimeout(func, timeout);
        }

        var exports = {};
        exports.log = sinon.log = log;
        exports.logError = sinon.logError = logError;

        return exports;
    }

    function loadDependencies(require, exports, module) {
        var sinon = require("./util/core");
        module.exports = makeApi(sinon);
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else if (!sinon) {
        return;
    } else {
        makeApi(sinon);
    }
}(typeof sinon == "object" && sinon || null));

},{"./util/core":24}],15:[function(require,module,exports){
/**
 * @depend util/core.js
 * @depend typeOf.js
 */
/*jslint eqeqeq: false, onevar: false, plusplus: false*/
/*global module, require, sinon*/
/**
 * Match functions
 *
 * @author Maximilian Antoni (mail@maxantoni.de)
 * @license BSD
 *
 * Copyright (c) 2012 Maximilian Antoni
 */
"use strict";

(function (sinon) {
    function makeApi(sinon) {
        function assertType(value, type, name) {
            var actual = sinon.typeOf(value);
            if (actual !== type) {
                throw new TypeError("Expected type of " + name + " to be " +
                    type + ", but was " + actual);
            }
        }

        var matcher = {
            toString: function () {
                return this.message;
            }
        };

        function isMatcher(object) {
            return matcher.isPrototypeOf(object);
        }

        function matchObject(expectation, actual) {
            if (actual === null || actual === undefined) {
                return false;
            }
            for (var key in expectation) {
                if (expectation.hasOwnProperty(key)) {
                    var exp = expectation[key];
                    var act = actual[key];
                    if (match.isMatcher(exp)) {
                        if (!exp.test(act)) {
                            return false;
                        }
                    } else if (sinon.typeOf(exp) === "object") {
                        if (!matchObject(exp, act)) {
                            return false;
                        }
                    } else if (!sinon.deepEqual(exp, act)) {
                        return false;
                    }
                }
            }
            return true;
        }

        matcher.or = function (m2) {
            if (!arguments.length) {
                throw new TypeError("Matcher expected");
            } else if (!isMatcher(m2)) {
                m2 = match(m2);
            }
            var m1 = this;
            var or = sinon.create(matcher);
            or.test = function (actual) {
                return m1.test(actual) || m2.test(actual);
            };
            or.message = m1.message + ".or(" + m2.message + ")";
            return or;
        };

        matcher.and = function (m2) {
            if (!arguments.length) {
                throw new TypeError("Matcher expected");
            } else if (!isMatcher(m2)) {
                m2 = match(m2);
            }
            var m1 = this;
            var and = sinon.create(matcher);
            and.test = function (actual) {
                return m1.test(actual) && m2.test(actual);
            };
            and.message = m1.message + ".and(" + m2.message + ")";
            return and;
        };

        var match = function (expectation, message) {
            var m = sinon.create(matcher);
            var type = sinon.typeOf(expectation);
            switch (type) {
            case "object":
                if (typeof expectation.test === "function") {
                    m.test = function (actual) {
                        return expectation.test(actual) === true;
                    };
                    m.message = "match(" + sinon.functionName(expectation.test) + ")";
                    return m;
                }
                var str = [];
                for (var key in expectation) {
                    if (expectation.hasOwnProperty(key)) {
                        str.push(key + ": " + expectation[key]);
                    }
                }
                m.test = function (actual) {
                    return matchObject(expectation, actual);
                };
                m.message = "match(" + str.join(", ") + ")";
                break;
            case "number":
                m.test = function (actual) {
                    return expectation == actual;
                };
                break;
            case "string":
                m.test = function (actual) {
                    if (typeof actual !== "string") {
                        return false;
                    }
                    return actual.indexOf(expectation) !== -1;
                };
                m.message = "match(\"" + expectation + "\")";
                break;
            case "regexp":
                m.test = function (actual) {
                    if (typeof actual !== "string") {
                        return false;
                    }
                    return expectation.test(actual);
                };
                break;
            case "function":
                m.test = expectation;
                if (message) {
                    m.message = message;
                } else {
                    m.message = "match(" + sinon.functionName(expectation) + ")";
                }
                break;
            default:
                m.test = function (actual) {
                    return sinon.deepEqual(expectation, actual);
                };
            }
            if (!m.message) {
                m.message = "match(" + expectation + ")";
            }
            return m;
        };

        match.isMatcher = isMatcher;

        match.any = match(function () {
            return true;
        }, "any");

        match.defined = match(function (actual) {
            return actual !== null && actual !== undefined;
        }, "defined");

        match.truthy = match(function (actual) {
            return !!actual;
        }, "truthy");

        match.falsy = match(function (actual) {
            return !actual;
        }, "falsy");

        match.same = function (expectation) {
            return match(function (actual) {
                return expectation === actual;
            }, "same(" + expectation + ")");
        };

        match.typeOf = function (type) {
            assertType(type, "string", "type");
            return match(function (actual) {
                return sinon.typeOf(actual) === type;
            }, "typeOf(\"" + type + "\")");
        };

        match.instanceOf = function (type) {
            assertType(type, "function", "type");
            return match(function (actual) {
                return actual instanceof type;
            }, "instanceOf(" + sinon.functionName(type) + ")");
        };

        function createPropertyMatcher(propertyTest, messagePrefix) {
            return function (property, value) {
                assertType(property, "string", "property");
                var onlyProperty = arguments.length === 1;
                var message = messagePrefix + "(\"" + property + "\"";
                if (!onlyProperty) {
                    message += ", " + value;
                }
                message += ")";
                return match(function (actual) {
                    if (actual === undefined || actual === null ||
                            !propertyTest(actual, property)) {
                        return false;
                    }
                    return onlyProperty || sinon.deepEqual(value, actual[property]);
                }, message);
            };
        }

        match.has = createPropertyMatcher(function (actual, property) {
            if (typeof actual === "object") {
                return property in actual;
            }
            return actual[property] !== undefined;
        }, "has");

        match.hasOwn = createPropertyMatcher(function (actual, property) {
            return actual.hasOwnProperty(property);
        }, "hasOwn");

        match.bool = match.typeOf("boolean");
        match.number = match.typeOf("number");
        match.string = match.typeOf("string");
        match.object = match.typeOf("object");
        match.func = match.typeOf("function");
        match.array = match.typeOf("array");
        match.regexp = match.typeOf("regexp");
        match.date = match.typeOf("date");

        sinon.match = match;
        return match;
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require, exports, module) {
        var sinon = require("./util/core");
        module.exports = makeApi(sinon);
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else if (!sinon) {
        return;
    } else {
        makeApi(sinon);
    }
}(typeof sinon == "object" && sinon || null));

},{"./util/core":24}],16:[function(require,module,exports){
/**
 * @depend times_in_words.js
 * @depend util/core.js
 * @depend extend.js
 * @depend stub.js
 * @depend format.js
 */
/**
 * Mock functions.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function (sinon) {
    function makeApi(sinon) {
        var push = [].push;
        var match = sinon.match;

        function mock(object) {
            if (!object) {
                return sinon.expectation.create("Anonymous mock");
            }

            return mock.create(object);
        }

        function each(collection, callback) {
            if (!collection) {
                return;
            }

            for (var i = 0, l = collection.length; i < l; i += 1) {
                callback(collection[i]);
            }
        }

        sinon.extend(mock, {
            create: function create(object) {
                if (!object) {
                    throw new TypeError("object is null");
                }

                var mockObject = sinon.extend({}, mock);
                mockObject.object = object;
                delete mockObject.create;

                return mockObject;
            },

            expects: function expects(method) {
                if (!method) {
                    throw new TypeError("method is falsy");
                }

                if (!this.expectations) {
                    this.expectations = {};
                    this.proxies = [];
                }

                if (!this.expectations[method]) {
                    this.expectations[method] = [];
                    var mockObject = this;

                    sinon.wrapMethod(this.object, method, function () {
                        return mockObject.invokeMethod(method, this, arguments);
                    });

                    push.call(this.proxies, method);
                }

                var expectation = sinon.expectation.create(method);
                push.call(this.expectations[method], expectation);

                return expectation;
            },

            restore: function restore() {
                var object = this.object;

                each(this.proxies, function (proxy) {
                    if (typeof object[proxy].restore == "function") {
                        object[proxy].restore();
                    }
                });
            },

            verify: function verify() {
                var expectations = this.expectations || {};
                var messages = [], met = [];

                each(this.proxies, function (proxy) {
                    each(expectations[proxy], function (expectation) {
                        if (!expectation.met()) {
                            push.call(messages, expectation.toString());
                        } else {
                            push.call(met, expectation.toString());
                        }
                    });
                });

                this.restore();

                if (messages.length > 0) {
                    sinon.expectation.fail(messages.concat(met).join("\n"));
                } else if (met.length > 0) {
                    sinon.expectation.pass(messages.concat(met).join("\n"));
                }

                return true;
            },

            invokeMethod: function invokeMethod(method, thisValue, args) {
                var expectations = this.expectations && this.expectations[method];
                var length = expectations && expectations.length || 0, i;

                for (i = 0; i < length; i += 1) {
                    if (!expectations[i].met() &&
                        expectations[i].allowsCall(thisValue, args)) {
                        return expectations[i].apply(thisValue, args);
                    }
                }

                var messages = [], available, exhausted = 0;

                for (i = 0; i < length; i += 1) {
                    if (expectations[i].allowsCall(thisValue, args)) {
                        available = available || expectations[i];
                    } else {
                        exhausted += 1;
                    }
                    push.call(messages, "    " + expectations[i].toString());
                }

                if (exhausted === 0) {
                    return available.apply(thisValue, args);
                }

                messages.unshift("Unexpected call: " + sinon.spyCall.toString.call({
                    proxy: method,
                    args: args
                }));

                sinon.expectation.fail(messages.join("\n"));
            }
        });

        var times = sinon.timesInWords;
        var slice = Array.prototype.slice;

        function callCountInWords(callCount) {
            if (callCount == 0) {
                return "never called";
            } else {
                return "called " + times(callCount);
            }
        }

        function expectedCallCountInWords(expectation) {
            var min = expectation.minCalls;
            var max = expectation.maxCalls;

            if (typeof min == "number" && typeof max == "number") {
                var str = times(min);

                if (min != max) {
                    str = "at least " + str + " and at most " + times(max);
                }

                return str;
            }

            if (typeof min == "number") {
                return "at least " + times(min);
            }

            return "at most " + times(max);
        }

        function receivedMinCalls(expectation) {
            var hasMinLimit = typeof expectation.minCalls == "number";
            return !hasMinLimit || expectation.callCount >= expectation.minCalls;
        }

        function receivedMaxCalls(expectation) {
            if (typeof expectation.maxCalls != "number") {
                return false;
            }

            return expectation.callCount == expectation.maxCalls;
        }

        function verifyMatcher(possibleMatcher, arg) {
            if (match && match.isMatcher(possibleMatcher)) {
                return possibleMatcher.test(arg);
            } else {
                return true;
            }
        }

        sinon.expectation = {
            minCalls: 1,
            maxCalls: 1,

            create: function create(methodName) {
                var expectation = sinon.extend(sinon.stub.create(), sinon.expectation);
                delete expectation.create;
                expectation.method = methodName;

                return expectation;
            },

            invoke: function invoke(func, thisValue, args) {
                this.verifyCallAllowed(thisValue, args);

                return sinon.spy.invoke.apply(this, arguments);
            },

            atLeast: function atLeast(num) {
                if (typeof num != "number") {
                    throw new TypeError("'" + num + "' is not number");
                }

                if (!this.limitsSet) {
                    this.maxCalls = null;
                    this.limitsSet = true;
                }

                this.minCalls = num;

                return this;
            },

            atMost: function atMost(num) {
                if (typeof num != "number") {
                    throw new TypeError("'" + num + "' is not number");
                }

                if (!this.limitsSet) {
                    this.minCalls = null;
                    this.limitsSet = true;
                }

                this.maxCalls = num;

                return this;
            },

            never: function never() {
                return this.exactly(0);
            },

            once: function once() {
                return this.exactly(1);
            },

            twice: function twice() {
                return this.exactly(2);
            },

            thrice: function thrice() {
                return this.exactly(3);
            },

            exactly: function exactly(num) {
                if (typeof num != "number") {
                    throw new TypeError("'" + num + "' is not a number");
                }

                this.atLeast(num);
                return this.atMost(num);
            },

            met: function met() {
                return !this.failed && receivedMinCalls(this);
            },

            verifyCallAllowed: function verifyCallAllowed(thisValue, args) {
                if (receivedMaxCalls(this)) {
                    this.failed = true;
                    sinon.expectation.fail(this.method + " already called " + times(this.maxCalls));
                }

                if ("expectedThis" in this && this.expectedThis !== thisValue) {
                    sinon.expectation.fail(this.method + " called with " + thisValue + " as thisValue, expected " +
                        this.expectedThis);
                }

                if (!("expectedArguments" in this)) {
                    return;
                }

                if (!args) {
                    sinon.expectation.fail(this.method + " received no arguments, expected " +
                        sinon.format(this.expectedArguments));
                }

                if (args.length < this.expectedArguments.length) {
                    sinon.expectation.fail(this.method + " received too few arguments (" + sinon.format(args) +
                        "), expected " + sinon.format(this.expectedArguments));
                }

                if (this.expectsExactArgCount &&
                    args.length != this.expectedArguments.length) {
                    sinon.expectation.fail(this.method + " received too many arguments (" + sinon.format(args) +
                        "), expected " + sinon.format(this.expectedArguments));
                }

                for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {

                    if (!verifyMatcher(this.expectedArguments[i], args[i])) {
                        sinon.expectation.fail(this.method + " received wrong arguments " + sinon.format(args) +
                            ", didn't match " + this.expectedArguments.toString());
                    }

                    if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {
                        sinon.expectation.fail(this.method + " received wrong arguments " + sinon.format(args) +
                            ", expected " + sinon.format(this.expectedArguments));
                    }
                }
            },

            allowsCall: function allowsCall(thisValue, args) {
                if (this.met() && receivedMaxCalls(this)) {
                    return false;
                }

                if ("expectedThis" in this && this.expectedThis !== thisValue) {
                    return false;
                }

                if (!("expectedArguments" in this)) {
                    return true;
                }

                args = args || [];

                if (args.length < this.expectedArguments.length) {
                    return false;
                }

                if (this.expectsExactArgCount &&
                    args.length != this.expectedArguments.length) {
                    return false;
                }

                for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {
                    if (!verifyMatcher(this.expectedArguments[i], args[i])) {
                        return false;
                    }

                    if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {
                        return false;
                    }
                }

                return true;
            },

            withArgs: function withArgs() {
                this.expectedArguments = slice.call(arguments);
                return this;
            },

            withExactArgs: function withExactArgs() {
                this.withArgs.apply(this, arguments);
                this.expectsExactArgCount = true;
                return this;
            },

            on: function on(thisValue) {
                this.expectedThis = thisValue;
                return this;
            },

            toString: function () {
                var args = (this.expectedArguments || []).slice();

                if (!this.expectsExactArgCount) {
                    push.call(args, "[...]");
                }

                var callStr = sinon.spyCall.toString.call({
                    proxy: this.method || "anonymous mock expectation",
                    args: args
                });

                var message = callStr.replace(", [...", "[, ...") + " " +
                    expectedCallCountInWords(this);

                if (this.met()) {
                    return "Expectation met: " + message;
                }

                return "Expected " + message + " (" +
                    callCountInWords(this.callCount) + ")";
            },

            verify: function verify() {
                if (!this.met()) {
                    sinon.expectation.fail(this.toString());
                } else {
                    sinon.expectation.pass(this.toString());
                }

                return true;
            },

            pass: function pass(message) {
                sinon.assert.pass(message);
            },

            fail: function fail(message) {
                var exception = new Error(message);
                exception.name = "ExpectationError";

                throw exception;
            }
        };

        sinon.mock = mock;
        return mock;
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require, exports, module) {
        var sinon = require("./util/core");
        require("./call");
        require("./match");
        require("./spy");
        module.exports = makeApi(sinon);
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else if (!sinon) {
        return;
    } else {
        makeApi(sinon);
    }
}(typeof sinon == "object" && sinon || null));

},{"./call":10,"./match":15,"./spy":18,"./util/core":24}],17:[function(require,module,exports){
/**
 * @depend util/core.js
 * @depend extend.js
 * @depend collection.js
 * @depend util/fake_timers.js
 * @depend util/fake_server_with_clock.js
 */
/**
 * Manages fake collections as well as fake utilities such as Sinon's
 * timers and fake XHR implementation in one convenient object.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function () {
    function makeApi(sinon) {
        var push = [].push;

        function exposeValue(sandbox, config, key, value) {
            if (!value) {
                return;
            }

            if (config.injectInto && !(key in config.injectInto)) {
                config.injectInto[key] = value;
                sandbox.injectedKeys.push(key);
            } else {
                push.call(sandbox.args, value);
            }
        }

        function prepareSandboxFromConfig(config) {
            var sandbox = sinon.create(sinon.sandbox);

            if (config.useFakeServer) {
                if (typeof config.useFakeServer == "object") {
                    sandbox.serverPrototype = config.useFakeServer;
                }

                sandbox.useFakeServer();
            }

            if (config.useFakeTimers) {
                if (typeof config.useFakeTimers == "object") {
                    sandbox.useFakeTimers.apply(sandbox, config.useFakeTimers);
                } else {
                    sandbox.useFakeTimers();
                }
            }

            return sandbox;
        }

        sinon.sandbox = sinon.extend(sinon.create(sinon.collection), {
            useFakeTimers: function useFakeTimers() {
                this.clock = sinon.useFakeTimers.apply(sinon, arguments);

                return this.add(this.clock);
            },

            serverPrototype: sinon.fakeServer,

            useFakeServer: function useFakeServer() {
                var proto = this.serverPrototype || sinon.fakeServer;

                if (!proto || !proto.create) {
                    return null;
                }

                this.server = proto.create();
                return this.add(this.server);
            },

            inject: function (obj) {
                sinon.collection.inject.call(this, obj);

                if (this.clock) {
                    obj.clock = this.clock;
                }

                if (this.server) {
                    obj.server = this.server;
                    obj.requests = this.server.requests;
                }

                obj.match = sinon.match;

                return obj;
            },

            restore: function () {
                sinon.collection.restore.apply(this, arguments);
                this.restoreContext();
            },

            restoreContext: function () {
                if (this.injectedKeys) {
                    for (var i = 0, j = this.injectedKeys.length; i < j; i++) {
                        delete this.injectInto[this.injectedKeys[i]];
                    }
                    this.injectedKeys = [];
                }
            },

            create: function (config) {
                if (!config) {
                    return sinon.create(sinon.sandbox);
                }

                var sandbox = prepareSandboxFromConfig(config);
                sandbox.args = sandbox.args || [];
                sandbox.injectedKeys = [];
                sandbox.injectInto = config.injectInto;
                var prop, value, exposed = sandbox.inject({});

                if (config.properties) {
                    for (var i = 0, l = config.properties.length; i < l; i++) {
                        prop = config.properties[i];
                        value = exposed[prop] || prop == "sandbox" && sandbox;
                        exposeValue(sandbox, config, prop, value);
                    }
                } else {
                    exposeValue(sandbox, config, "sandbox", value);
                }

                return sandbox;
            },

            match: sinon.match
        });

        sinon.sandbox.useFakeXMLHttpRequest = sinon.sandbox.useFakeServer;

        return sinon.sandbox;
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require, exports, module) {
        var sinon = require("./util/core");
        require("./util/fake_server");
        require("./util/fake_timers");
        require("./collection");
        module.exports = makeApi(sinon);
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else if (!sinon) {
        return;
    } else {
        makeApi(sinon);
    }
}());

},{"./collection":11,"./util/core":24,"./util/fake_server":26,"./util/fake_timers":27}],18:[function(require,module,exports){
/**
  * @depend times_in_words.js
  * @depend util/core.js
  * @depend extend.js
  * @depend call.js
  * @depend format.js
  */
/**
  * Spy functions
  *
  * @author Christian Johansen (christian@cjohansen.no)
  * @license BSD
  *
  * Copyright (c) 2010-2013 Christian Johansen
  */
"use strict";

(function (sinon) {
    function makeApi(sinon) {
        var push = Array.prototype.push;
        var slice = Array.prototype.slice;
        var callId = 0;

        function spy(object, property) {
            if (!property && typeof object == "function") {
                return spy.create(object);
            }

            if (!object && !property) {
                return spy.create(function () { });
            }

            var method = object[property];
            return sinon.wrapMethod(object, property, spy.create(method));
        }

        function matchingFake(fakes, args, strict) {
            if (!fakes) {
                return;
            }

            for (var i = 0, l = fakes.length; i < l; i++) {
                if (fakes[i].matches(args, strict)) {
                    return fakes[i];
                }
            }
        }

        function incrementCallCount() {
            this.called = true;
            this.callCount += 1;
            this.notCalled = false;
            this.calledOnce = this.callCount == 1;
            this.calledTwice = this.callCount == 2;
            this.calledThrice = this.callCount == 3;
        }

        function createCallProperties() {
            this.firstCall = this.getCall(0);
            this.secondCall = this.getCall(1);
            this.thirdCall = this.getCall(2);
            this.lastCall = this.getCall(this.callCount - 1);
        }

        var vars = "a,b,c,d,e,f,g,h,i,j,k,l";
        function createProxy(func) {
            // Retain the function length:
            var p;
            if (func.length) {
                eval("p = (function proxy(" + vars.substring(0, func.length * 2 - 1) +
                    ") { return p.invoke(func, this, slice.call(arguments)); });");
            } else {
                p = function proxy() {
                    return p.invoke(func, this, slice.call(arguments));
                };
            }
            return p;
        }

        var uuid = 0;

        // Public API
        var spyApi = {
            reset: function () {
                if (this.invoking) {
                    var err = new Error("Cannot reset Sinon function while invoking it. " +
                                        "Move the call to .reset outside of the callback.");
                    err.name = "InvalidResetException";
                    throw err;
                }

                this.called = false;
                this.notCalled = true;
                this.calledOnce = false;
                this.calledTwice = false;
                this.calledThrice = false;
                this.callCount = 0;
                this.firstCall = null;
                this.secondCall = null;
                this.thirdCall = null;
                this.lastCall = null;
                this.args = [];
                this.returnValues = [];
                this.thisValues = [];
                this.exceptions = [];
                this.callIds = [];
                if (this.fakes) {
                    for (var i = 0; i < this.fakes.length; i++) {
                        this.fakes[i].reset();
                    }
                }
            },

            create: function create(func) {
                var name;

                if (typeof func != "function") {
                    func = function () { };
                } else {
                    name = sinon.functionName(func);
                }

                var proxy = createProxy(func);

                sinon.extend(proxy, spy);
                delete proxy.create;
                sinon.extend(proxy, func);

                proxy.reset();
                proxy.prototype = func.prototype;
                proxy.displayName = name || "spy";
                proxy.toString = sinon.functionToString;
                proxy.instantiateFake = sinon.spy.create;
                proxy.id = "spy#" + uuid++;

                return proxy;
            },

            invoke: function invoke(func, thisValue, args) {
                var matching = matchingFake(this.fakes, args);
                var exception, returnValue;

                incrementCallCount.call(this);
                push.call(this.thisValues, thisValue);
                push.call(this.args, args);
                push.call(this.callIds, callId++);

                // Make call properties available from within the spied function:
                createCallProperties.call(this);

                try {
                    this.invoking = true;

                    if (matching) {
                        returnValue = matching.invoke(func, thisValue, args);
                    } else {
                        returnValue = (this.func || func).apply(thisValue, args);
                    }

                    var thisCall = this.getCall(this.callCount - 1);
                    if (thisCall.calledWithNew() && typeof returnValue !== "object") {
                        returnValue = thisValue;
                    }
                } catch (e) {
                    exception = e;
                } finally {
                    delete this.invoking;
                }

                push.call(this.exceptions, exception);
                push.call(this.returnValues, returnValue);

                // Make return value and exception available in the calls:
                createCallProperties.call(this);

                if (exception !== undefined) {
                    throw exception;
                }

                return returnValue;
            },

            named: function named(name) {
                this.displayName = name;
                return this;
            },

            getCall: function getCall(i) {
                if (i < 0 || i >= this.callCount) {
                    return null;
                }

                return sinon.spyCall(this, this.thisValues[i], this.args[i],
                                        this.returnValues[i], this.exceptions[i],
                                        this.callIds[i]);
            },

            getCalls: function () {
                var calls = [];
                var i;

                for (i = 0; i < this.callCount; i++) {
                    calls.push(this.getCall(i));
                }

                return calls;
            },

            calledBefore: function calledBefore(spyFn) {
                if (!this.called) {
                    return false;
                }

                if (!spyFn.called) {
                    return true;
                }

                return this.callIds[0] < spyFn.callIds[spyFn.callIds.length - 1];
            },

            calledAfter: function calledAfter(spyFn) {
                if (!this.called || !spyFn.called) {
                    return false;
                }

                return this.callIds[this.callCount - 1] > spyFn.callIds[spyFn.callCount - 1];
            },

            withArgs: function () {
                var args = slice.call(arguments);

                if (this.fakes) {
                    var match = matchingFake(this.fakes, args, true);

                    if (match) {
                        return match;
                    }
                } else {
                    this.fakes = [];
                }

                var original = this;
                var fake = this.instantiateFake();
                fake.matchingAguments = args;
                fake.parent = this;
                push.call(this.fakes, fake);

                fake.withArgs = function () {
                    return original.withArgs.apply(original, arguments);
                };

                for (var i = 0; i < this.args.length; i++) {
                    if (fake.matches(this.args[i])) {
                        incrementCallCount.call(fake);
                        push.call(fake.thisValues, this.thisValues[i]);
                        push.call(fake.args, this.args[i]);
                        push.call(fake.returnValues, this.returnValues[i]);
                        push.call(fake.exceptions, this.exceptions[i]);
                        push.call(fake.callIds, this.callIds[i]);
                    }
                }
                createCallProperties.call(fake);

                return fake;
            },

            matches: function (args, strict) {
                var margs = this.matchingAguments;

                if (margs.length <= args.length &&
                    sinon.deepEqual(margs, args.slice(0, margs.length))) {
                    return !strict || margs.length == args.length;
                }
            },

            printf: function (format) {
                var spy = this;
                var args = slice.call(arguments, 1);
                var formatter;

                return (format || "").replace(/%(.)/g, function (match, specifyer) {
                    formatter = spyApi.formatters[specifyer];

                    if (typeof formatter == "function") {
                        return formatter.call(null, spy, args);
                    } else if (!isNaN(parseInt(specifyer, 10))) {
                        return sinon.format(args[specifyer - 1]);
                    }

                    return "%" + specifyer;
                });
            }
        };

        function delegateToCalls(method, matchAny, actual, notCalled) {
            spyApi[method] = function () {
                if (!this.called) {
                    if (notCalled) {
                        return notCalled.apply(this, arguments);
                    }
                    return false;
                }

                var currentCall;
                var matches = 0;

                for (var i = 0, l = this.callCount; i < l; i += 1) {
                    currentCall = this.getCall(i);

                    if (currentCall[actual || method].apply(currentCall, arguments)) {
                        matches += 1;

                        if (matchAny) {
                            return true;
                        }
                    }
                }

                return matches === this.callCount;
            };
        }

        delegateToCalls("calledOn", true);
        delegateToCalls("alwaysCalledOn", false, "calledOn");
        delegateToCalls("calledWith", true);
        delegateToCalls("calledWithMatch", true);
        delegateToCalls("alwaysCalledWith", false, "calledWith");
        delegateToCalls("alwaysCalledWithMatch", false, "calledWithMatch");
        delegateToCalls("calledWithExactly", true);
        delegateToCalls("alwaysCalledWithExactly", false, "calledWithExactly");
        delegateToCalls("neverCalledWith", false, "notCalledWith",
            function () { return true; });
        delegateToCalls("neverCalledWithMatch", false, "notCalledWithMatch",
            function () { return true; });
        delegateToCalls("threw", true);
        delegateToCalls("alwaysThrew", false, "threw");
        delegateToCalls("returned", true);
        delegateToCalls("alwaysReturned", false, "returned");
        delegateToCalls("calledWithNew", true);
        delegateToCalls("alwaysCalledWithNew", false, "calledWithNew");
        delegateToCalls("callArg", false, "callArgWith", function () {
            throw new Error(this.toString() + " cannot call arg since it was not yet invoked.");
        });
        spyApi.callArgWith = spyApi.callArg;
        delegateToCalls("callArgOn", false, "callArgOnWith", function () {
            throw new Error(this.toString() + " cannot call arg since it was not yet invoked.");
        });
        spyApi.callArgOnWith = spyApi.callArgOn;
        delegateToCalls("yield", false, "yield", function () {
            throw new Error(this.toString() + " cannot yield since it was not yet invoked.");
        });
        // "invokeCallback" is an alias for "yield" since "yield" is invalid in strict mode.
        spyApi.invokeCallback = spyApi.yield;
        delegateToCalls("yieldOn", false, "yieldOn", function () {
            throw new Error(this.toString() + " cannot yield since it was not yet invoked.");
        });
        delegateToCalls("yieldTo", false, "yieldTo", function (property) {
            throw new Error(this.toString() + " cannot yield to '" + property +
                "' since it was not yet invoked.");
        });
        delegateToCalls("yieldToOn", false, "yieldToOn", function (property) {
            throw new Error(this.toString() + " cannot yield to '" + property +
                "' since it was not yet invoked.");
        });

        spyApi.formatters = {
            c: function (spy) {
                return sinon.timesInWords(spy.callCount);
            },

            n: function (spy) {
                return spy.toString();
            },

            C: function (spy) {
                var calls = [];

                for (var i = 0, l = spy.callCount; i < l; ++i) {
                    var stringifiedCall = "    " + spy.getCall(i).toString();
                    if (/\n/.test(calls[i - 1])) {
                        stringifiedCall = "\n" + stringifiedCall;
                    }
                    push.call(calls, stringifiedCall);
                }

                return calls.length > 0 ? "\n" + calls.join("\n") : "";
            },

            t: function (spy) {
                var objects = [];

                for (var i = 0, l = spy.callCount; i < l; ++i) {
                    push.call(objects, sinon.format(spy.thisValues[i]));
                }

                return objects.join(", ");
            },

            "*": function (spy, args) {
                var formatted = [];

                for (var i = 0, l = args.length; i < l; ++i) {
                    push.call(formatted, sinon.format(args[i]));
                }

                return formatted.join(", ");
            }
        };

        sinon.extend(spy, spyApi);

        spy.spyCall = sinon.spyCall;
        sinon.spy = spy;

        return spy;
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require, exports, module) {
        var sinon = require("./util/core");
        require("./call");
        module.exports = makeApi(sinon);
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else if (!sinon) {
        return;
    } else {
        makeApi(sinon);
    }
}(typeof sinon == "object" && sinon || null));

},{"./call":10,"./util/core":24}],19:[function(require,module,exports){
/**
 * @depend util/core.js
 * @depend extend.js
 * @depend spy.js
 * @depend behavior.js
 */
/**
 * Stub functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function (sinon) {
    function makeApi(sinon) {
        function stub(object, property, func) {
            if (!!func && typeof func != "function") {
                throw new TypeError("Custom stub should be function");
            }

            var wrapper;

            if (func) {
                wrapper = sinon.spy && sinon.spy.create ? sinon.spy.create(func) : func;
            } else {
                wrapper = stub.create();
            }

            if (!object && typeof property === "undefined") {
                return sinon.stub.create();
            }

            if (typeof property === "undefined" && typeof object == "object") {
                for (var prop in object) {
                    if (typeof object[prop] === "function") {
                        stub(object, prop);
                    }
                }

                return object;
            }

            return sinon.wrapMethod(object, property, wrapper);
        }

        function getDefaultBehavior(stub) {
            return stub.defaultBehavior || getParentBehaviour(stub) || sinon.behavior.create(stub);
        }

        function getParentBehaviour(stub) {
            return (stub.parent && getCurrentBehavior(stub.parent));
        }

        function getCurrentBehavior(stub) {
            var behavior = stub.behaviors[stub.callCount - 1];
            return behavior && behavior.isPresent() ? behavior : getDefaultBehavior(stub);
        }

        var uuid = 0;

        var proto = {
            create: function create() {
                var functionStub = function () {
                    return getCurrentBehavior(functionStub).invoke(this, arguments);
                };

                functionStub.id = "stub#" + uuid++;
                var orig = functionStub;
                functionStub = sinon.spy.create(functionStub);
                functionStub.func = orig;

                sinon.extend(functionStub, stub);
                functionStub.instantiateFake = sinon.stub.create;
                functionStub.displayName = "stub";
                functionStub.toString = sinon.functionToString;

                functionStub.defaultBehavior = null;
                functionStub.behaviors = [];

                return functionStub;
            },

            resetBehavior: function () {
                var i;

                this.defaultBehavior = null;
                this.behaviors = [];

                delete this.returnValue;
                delete this.returnArgAt;
                this.returnThis = false;

                if (this.fakes) {
                    for (i = 0; i < this.fakes.length; i++) {
                        this.fakes[i].resetBehavior();
                    }
                }
            },

            onCall: function onCall(index) {
                if (!this.behaviors[index]) {
                    this.behaviors[index] = sinon.behavior.create(this);
                }

                return this.behaviors[index];
            },

            onFirstCall: function onFirstCall() {
                return this.onCall(0);
            },

            onSecondCall: function onSecondCall() {
                return this.onCall(1);
            },

            onThirdCall: function onThirdCall() {
                return this.onCall(2);
            }
        };

        for (var method in sinon.behavior) {
            if (sinon.behavior.hasOwnProperty(method) &&
                !proto.hasOwnProperty(method) &&
                method != "create" &&
                method != "withArgs" &&
                method != "invoke") {
                proto[method] = (function (behaviorMethod) {
                    return function () {
                        this.defaultBehavior = this.defaultBehavior || sinon.behavior.create(this);
                        this.defaultBehavior[behaviorMethod].apply(this.defaultBehavior, arguments);
                        return this;
                    };
                }(method));
            }
        }

        sinon.extend(stub, proto);
        sinon.stub = stub;

        return stub;
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require, exports, module) {
        var sinon = require("./util/core");
        require("./behavior");
        require("./spy");
        module.exports = makeApi(sinon);
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else if (!sinon) {
        return;
    } else {
        makeApi(sinon);
    }
}(typeof sinon == "object" && sinon || null));

},{"./behavior":9,"./spy":18,"./util/core":24}],20:[function(require,module,exports){
/**
 * @depend util/core.js
 * @depend stub.js
 * @depend mock.js
 * @depend sandbox.js
 */
/**
 * Test function, sandboxes fakes
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function (sinon) {
    function makeApi(sinon) {
        function test(callback) {
            var type = typeof callback;

            if (type != "function") {
                throw new TypeError("sinon.test needs to wrap a test function, got " + type);
            }

            function sinonSandboxedTest() {
                var config = sinon.getConfig(sinon.config);
                config.injectInto = config.injectIntoThis && this || config.injectInto;
                var sandbox = sinon.sandbox.create(config);
                var exception, result;
                var doneIsWrapped = false;
                var argumentsCopy = Array.prototype.slice.call(arguments);
                if (argumentsCopy.length > 0 && typeof argumentsCopy[arguments.length - 1] == "function") {
                    var oldDone = argumentsCopy[arguments.length - 1];
                    argumentsCopy[arguments.length - 1] = function done(result) {
                        if (result) {
                            sandbox.restore();
                            throw exception;
                        } else {
                            sandbox.verifyAndRestore();
                        }
                        oldDone(result);
                    }
                    doneIsWrapped = true;
                }

                var args = argumentsCopy.concat(sandbox.args);

                try {
                    result = callback.apply(this, args);
                } catch (e) {
                    exception = e;
                }

                if (!doneIsWrapped) {
                    if (typeof exception !== "undefined") {
                        sandbox.restore();
                        throw exception;
                    } else {
                        sandbox.verifyAndRestore();
                    }
                }

                return result;
            };

            if (callback.length) {
                return function sinonAsyncSandboxedTest(callback) {
                    return sinonSandboxedTest.apply(this, arguments);
                };
            }

            return sinonSandboxedTest;
        }

        test.config = {
            injectIntoThis: true,
            injectInto: null,
            properties: ["spy", "stub", "mock", "clock", "server", "requests"],
            useFakeTimers: true,
            useFakeServer: true
        };

        sinon.test = test;
        return test;
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require, exports, module) {
        var sinon = require("./util/core");
        require("./sandbox");
        module.exports = makeApi(sinon);
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else if (!sinon) {
        return;
    } else {
        makeApi(sinon);
    }
}(typeof sinon == "object" && sinon || null));

},{"./sandbox":17,"./util/core":24}],21:[function(require,module,exports){
/**
 * @depend util/core.js
 * @depend test.js
 */
/**
 * Test case, sandboxes all test functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function (sinon) {
    function createTest(property, setUp, tearDown) {
        return function () {
            if (setUp) {
                setUp.apply(this, arguments);
            }

            var exception, result;

            try {
                result = property.apply(this, arguments);
            } catch (e) {
                exception = e;
            }

            if (tearDown) {
                tearDown.apply(this, arguments);
            }

            if (exception) {
                throw exception;
            }

            return result;
        };
    }

    function makeApi(sinon) {
        function testCase(tests, prefix) {
            /*jsl:ignore*/
            if (!tests || typeof tests != "object") {
                throw new TypeError("sinon.testCase needs an object with test functions");
            }
            /*jsl:end*/

            prefix = prefix || "test";
            var rPrefix = new RegExp("^" + prefix);
            var methods = {}, testName, property, method;
            var setUp = tests.setUp;
            var tearDown = tests.tearDown;

            for (testName in tests) {
                if (tests.hasOwnProperty(testName)) {
                    property = tests[testName];

                    if (/^(setUp|tearDown)$/.test(testName)) {
                        continue;
                    }

                    if (typeof property == "function" && rPrefix.test(testName)) {
                        method = property;

                        if (setUp || tearDown) {
                            method = createTest(property, setUp, tearDown);
                        }

                        methods[testName] = sinon.test(method);
                    } else {
                        methods[testName] = tests[testName];
                    }
                }
            }

            return methods;
        }

        sinon.testCase = testCase;
        return testCase;
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require, exports, module) {
        var sinon = require("./util/core");
        require("./test");
        module.exports = makeApi(sinon);
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else if (!sinon) {
        return;
    } else {
        makeApi(sinon);
    }
}(typeof sinon == "object" && sinon || null));

},{"./test":20,"./util/core":24}],22:[function(require,module,exports){
/**
 * @depend ../sinon.js
 */
"use strict";

(function (sinon) {
    function makeApi(sinon) {

        function timesInWords(count) {
            switch (count) {
                case 1:
                    return "once";
                case 2:
                    return "twice";
                case 3:
                    return "thrice";
                default:
                    return (count || 0) + " times";
            }
        }

        sinon.timesInWords = timesInWords;
        return sinon.timesInWords;
    }

    function loadDependencies(require, exports, module) {
        var sinon = require("./util/core");
        module.exports = makeApi(sinon);
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else if (!sinon) {
        return;
    } else {
        makeApi(sinon);
    }
}(typeof sinon == "object" && sinon || null));

},{"./util/core":24}],23:[function(require,module,exports){
/**
 * @depend ../sinon.js
 */
/**
 * Format functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2014 Christian Johansen
 */
"use strict";

(function (sinon, formatio) {
    function makeApi(sinon) {
        function typeOf(value) {
            if (value === null) {
                return "null";
            } else if (value === undefined) {
                return "undefined";
            }
            var string = Object.prototype.toString.call(value);
            return string.substring(8, string.length - 1).toLowerCase();
        };

        sinon.typeOf = typeOf;
        return sinon.typeOf;
    }

    function loadDependencies(require, exports, module) {
        var sinon = require("./util/core");
        module.exports = makeApi(sinon);
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else if (!sinon) {
        return;
    } else {
        makeApi(sinon);
    }
}(
    (typeof sinon == "object" && sinon || null),
    (typeof formatio == "object" && formatio)
));

},{"./util/core":24}],24:[function(require,module,exports){
/**
 * @depend ../../sinon.js
 */
/**
 * Sinon core utilities. For internal use only.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function (sinon) {
    var div = typeof document != "undefined" && document.createElement("div");
    var hasOwn = Object.prototype.hasOwnProperty;

    function isDOMNode(obj) {
        var success = false;

        try {
            obj.appendChild(div);
            success = div.parentNode == obj;
        } catch (e) {
            return false;
        } finally {
            try {
                obj.removeChild(div);
            } catch (e) {
                // Remove failed, not much we can do about that
            }
        }

        return success;
    }

    function isElement(obj) {
        return div && obj && obj.nodeType === 1 && isDOMNode(obj);
    }

    function isFunction(obj) {
        return typeof obj === "function" || !!(obj && obj.constructor && obj.call && obj.apply);
    }

    function isReallyNaN(val) {
        return typeof val === "number" && isNaN(val);
    }

    function mirrorProperties(target, source) {
        for (var prop in source) {
            if (!hasOwn.call(target, prop)) {
                target[prop] = source[prop];
            }
        }
    }

    function isRestorable(obj) {
        return typeof obj === "function" && typeof obj.restore === "function" && obj.restore.sinon;
    }

    function makeApi(sinon) {
        sinon.wrapMethod = function wrapMethod(object, property, method) {
            if (!object) {
                throw new TypeError("Should wrap property of object");
            }

            if (typeof method != "function") {
                throw new TypeError("Method wrapper should be function");
            }

            var wrappedMethod = object[property],
                error;

            if (!isFunction(wrappedMethod)) {
                error = new TypeError("Attempted to wrap " + (typeof wrappedMethod) + " property " +
                                    property + " as function");
            } else if (wrappedMethod.restore && wrappedMethod.restore.sinon) {
                error = new TypeError("Attempted to wrap " + property + " which is already wrapped");
            } else if (wrappedMethod.calledBefore) {
                var verb = !!wrappedMethod.returns ? "stubbed" : "spied on";
                error = new TypeError("Attempted to wrap " + property + " which is already " + verb);
            }

            if (error) {
                if (wrappedMethod && wrappedMethod.stackTrace) {
                    error.stack += "\n--------------\n" + wrappedMethod.stackTrace;
                }
                throw error;
            }

            // IE 8 does not support hasOwnProperty on the window object and Firefox has a problem
            // when using hasOwn.call on objects from other frames.
            var owned = object.hasOwnProperty ? object.hasOwnProperty(property) : hasOwn.call(object, property);
            object[property] = method;
            method.displayName = property;
            // Set up a stack trace which can be used later to find what line of
            // code the original method was created on.
            method.stackTrace = (new Error("Stack Trace for original")).stack;

            method.restore = function () {
                // For prototype properties try to reset by delete first.
                // If this fails (ex: localStorage on mobile safari) then force a reset
                // via direct assignment.
                if (!owned) {
                    delete object[property];
                }
                if (object[property] === method) {
                    object[property] = wrappedMethod;
                }
            };

            method.restore.sinon = true;
            mirrorProperties(method, wrappedMethod);

            return method;
        };

        sinon.create = function create(proto) {
            var F = function () {};
            F.prototype = proto;
            return new F();
        };

        sinon.deepEqual = function deepEqual(a, b) {
            if (sinon.match && sinon.match.isMatcher(a)) {
                return a.test(b);
            }

            if (typeof a != "object" || typeof b != "object") {
                if (isReallyNaN(a) && isReallyNaN(b)) {
                    return true;
                } else {
                    return a === b;
                }
            }

            if (isElement(a) || isElement(b)) {
                return a === b;
            }

            if (a === b) {
                return true;
            }

            if ((a === null && b !== null) || (a !== null && b === null)) {
                return false;
            }

            if (a instanceof RegExp && b instanceof RegExp) {
                return (a.source === b.source) && (a.global === b.global) &&
                    (a.ignoreCase === b.ignoreCase) && (a.multiline === b.multiline);
            }

            var aString = Object.prototype.toString.call(a);
            if (aString != Object.prototype.toString.call(b)) {
                return false;
            }

            if (aString == "[object Date]") {
                return a.valueOf() === b.valueOf();
            }

            var prop, aLength = 0, bLength = 0;

            if (aString == "[object Array]" && a.length !== b.length) {
                return false;
            }

            for (prop in a) {
                aLength += 1;

                if (!(prop in b)) {
                    return false;
                }

                if (!deepEqual(a[prop], b[prop])) {
                    return false;
                }
            }

            for (prop in b) {
                bLength += 1;
            }

            return aLength == bLength;
        };

        sinon.functionName = function functionName(func) {
            var name = func.displayName || func.name;

            // Use function decomposition as a last resort to get function
            // name. Does not rely on function decomposition to work - if it
            // doesn't debugging will be slightly less informative
            // (i.e. toString will say 'spy' rather than 'myFunc').
            if (!name) {
                var matches = func.toString().match(/function ([^\s\(]+)/);
                name = matches && matches[1];
            }

            return name;
        };

        sinon.functionToString = function toString() {
            if (this.getCall && this.callCount) {
                var thisValue, prop, i = this.callCount;

                while (i--) {
                    thisValue = this.getCall(i).thisValue;

                    for (prop in thisValue) {
                        if (thisValue[prop] === this) {
                            return prop;
                        }
                    }
                }
            }

            return this.displayName || "sinon fake";
        };

        sinon.getConfig = function (custom) {
            var config = {};
            custom = custom || {};
            var defaults = sinon.defaultConfig;

            for (var prop in defaults) {
                if (defaults.hasOwnProperty(prop)) {
                    config[prop] = custom.hasOwnProperty(prop) ? custom[prop] : defaults[prop];
                }
            }

            return config;
        };

        sinon.defaultConfig = {
            injectIntoThis: true,
            injectInto: null,
            properties: ["spy", "stub", "mock", "clock", "server", "requests"],
            useFakeTimers: true,
            useFakeServer: true
        };

        sinon.timesInWords = function timesInWords(count) {
            return count == 1 && "once" ||
                count == 2 && "twice" ||
                count == 3 && "thrice" ||
                (count || 0) + " times";
        };

        sinon.calledInOrder = function (spies) {
            for (var i = 1, l = spies.length; i < l; i++) {
                if (!spies[i - 1].calledBefore(spies[i]) || !spies[i].called) {
                    return false;
                }
            }

            return true;
        };

        sinon.orderByFirstCall = function (spies) {
            return spies.sort(function (a, b) {
                // uuid, won't ever be equal
                var aCall = a.getCall(0);
                var bCall = b.getCall(0);
                var aId = aCall && aCall.callId || -1;
                var bId = bCall && bCall.callId || -1;

                return aId < bId ? -1 : 1;
            });
        };

        sinon.createStubInstance = function (constructor) {
            if (typeof constructor !== "function") {
                throw new TypeError("The constructor should be a function.");
            }
            return sinon.stub(sinon.create(constructor.prototype));
        };

        sinon.restore = function (object) {
            if (object !== null && typeof object === "object") {
                for (var prop in object) {
                    if (isRestorable(object[prop])) {
                        object[prop].restore();
                    }
                }
            } else if (isRestorable(object)) {
                object.restore();
            }
        };

        return sinon;
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require, exports) {
        makeApi(exports);
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports);
    } else if (!sinon) {
        return;
    } else {
        makeApi(sinon);
    }
}(typeof sinon == "object" && sinon || null));

},{}],25:[function(require,module,exports){
/**
 * Minimal Event interface implementation
 *
 * Original implementation by Sven Fuchs: https://gist.github.com/995028
 * Modifications and tests by Christian Johansen.
 *
 * @author Sven Fuchs (svenfuchs@artweb-design.de)
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2011 Sven Fuchs, Christian Johansen
 */
"use strict";

if (typeof sinon == "undefined") {
    this.sinon = {};
}

(function () {
    var push = [].push;

    function makeApi(sinon) {
        sinon.Event = function Event(type, bubbles, cancelable, target) {
            this.initEvent(type, bubbles, cancelable, target);
        };

        sinon.Event.prototype = {
            initEvent: function (type, bubbles, cancelable, target) {
                this.type = type;
                this.bubbles = bubbles;
                this.cancelable = cancelable;
                this.target = target;
            },

            stopPropagation: function () {},

            preventDefault: function () {
                this.defaultPrevented = true;
            }
        };

        sinon.ProgressEvent = function ProgressEvent(type, progressEventRaw, target) {
            this.initEvent(type, false, false, target);
            this.loaded = progressEventRaw.loaded || null;
            this.total = progressEventRaw.total || null;
        };

        sinon.ProgressEvent.prototype = new sinon.Event();

        sinon.ProgressEvent.prototype.constructor =  sinon.ProgressEvent;

        sinon.CustomEvent = function CustomEvent(type, customData, target) {
            this.initEvent(type, false, false, target);
            this.detail = customData.detail || null;
        };

        sinon.CustomEvent.prototype = new sinon.Event();

        sinon.CustomEvent.prototype.constructor =  sinon.CustomEvent;

        sinon.EventTarget = {
            addEventListener: function addEventListener(event, listener) {
                this.eventListeners = this.eventListeners || {};
                this.eventListeners[event] = this.eventListeners[event] || [];
                push.call(this.eventListeners[event], listener);
            },

            removeEventListener: function removeEventListener(event, listener) {
                var listeners = this.eventListeners && this.eventListeners[event] || [];

                for (var i = 0, l = listeners.length; i < l; ++i) {
                    if (listeners[i] == listener) {
                        return listeners.splice(i, 1);
                    }
                }
            },

            dispatchEvent: function dispatchEvent(event) {
                var type = event.type;
                var listeners = this.eventListeners && this.eventListeners[type] || [];

                for (var i = 0; i < listeners.length; i++) {
                    if (typeof listeners[i] == "function") {
                        listeners[i].call(this, event);
                    } else {
                        listeners[i].handleEvent(event);
                    }
                }

                return !!event.defaultPrevented;
            }
        };
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require) {
        var sinon = require("./core");
        makeApi(sinon);
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require);
    } else {
        makeApi(sinon);
    }
}());

},{"./core":24}],26:[function(require,module,exports){
/**
 * @depend fake_xml_http_request.js
 * @depend ../format.js
 * @depend ../log_error.js
 */
/**
 * The Sinon "server" mimics a web server that receives requests from
 * sinon.FakeXMLHttpRequest and provides an API to respond to those requests,
 * both synchronously and asynchronously. To respond synchronuously, canned
 * answers have to be provided upfront.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

if (typeof sinon == "undefined") {
    var sinon = {};
}

(function () {
    var push = [].push;
    function F() {}

    function create(proto) {
        F.prototype = proto;
        return new F();
    }

    function responseArray(handler) {
        var response = handler;

        if (Object.prototype.toString.call(handler) != "[object Array]") {
            response = [200, {}, handler];
        }

        if (typeof response[2] != "string") {
            throw new TypeError("Fake server response body should be string, but was " +
                                typeof response[2]);
        }

        return response;
    }

    var wloc = typeof window !== "undefined" ? window.location : {};
    var rCurrLoc = new RegExp("^" + wloc.protocol + "//" + wloc.host);

    function matchOne(response, reqMethod, reqUrl) {
        var rmeth = response.method;
        var matchMethod = !rmeth || rmeth.toLowerCase() == reqMethod.toLowerCase();
        var url = response.url;
        var matchUrl = !url || url == reqUrl || (typeof url.test == "function" && url.test(reqUrl));

        return matchMethod && matchUrl;
    }

    function match(response, request) {
        var requestUrl = request.url;

        if (!/^https?:\/\//.test(requestUrl) || rCurrLoc.test(requestUrl)) {
            requestUrl = requestUrl.replace(rCurrLoc, "");
        }

        if (matchOne(response, this.getHTTPMethod(request), requestUrl)) {
            if (typeof response.response == "function") {
                var ru = response.url;
                var args = [request].concat(ru && typeof ru.exec == "function" ? ru.exec(requestUrl).slice(1) : []);
                return response.response.apply(response, args);
            }

            return true;
        }

        return false;
    }

    function makeApi(sinon) {
        sinon.fakeServer = {
            create: function () {
                var server = create(this);
                this.xhr = sinon.useFakeXMLHttpRequest();
                server.requests = [];

                this.xhr.onCreate = function (xhrObj) {
                    server.addRequest(xhrObj);
                };

                return server;
            },

            addRequest: function addRequest(xhrObj) {
                var server = this;
                push.call(this.requests, xhrObj);

                xhrObj.onSend = function () {
                    server.handleRequest(this);

                    if (server.autoRespond && !server.responding) {
                        setTimeout(function () {
                            server.responding = false;
                            server.respond();
                        }, server.autoRespondAfter || 10);

                        server.responding = true;
                    }
                };
            },

            getHTTPMethod: function getHTTPMethod(request) {
                if (this.fakeHTTPMethods && /post/i.test(request.method)) {
                    var matches = (request.requestBody || "").match(/_method=([^\b;]+)/);
                    return !!matches ? matches[1] : request.method;
                }

                return request.method;
            },

            handleRequest: function handleRequest(xhr) {
                if (xhr.async) {
                    if (!this.queue) {
                        this.queue = [];
                    }

                    push.call(this.queue, xhr);
                } else {
                    this.processRequest(xhr);
                }
            },

            log: function log(response, request) {
                var str;

                str =  "Request:\n"  + sinon.format(request)  + "\n\n";
                str += "Response:\n" + sinon.format(response) + "\n\n";

                sinon.log(str);
            },

            respondWith: function respondWith(method, url, body) {
                if (arguments.length == 1 && typeof method != "function") {
                    this.response = responseArray(method);
                    return;
                }

                if (!this.responses) { this.responses = []; }

                if (arguments.length == 1) {
                    body = method;
                    url = method = null;
                }

                if (arguments.length == 2) {
                    body = url;
                    url = method;
                    method = null;
                }

                push.call(this.responses, {
                    method: method,
                    url: url,
                    response: typeof body == "function" ? body : responseArray(body)
                });
            },

            respond: function respond() {
                if (arguments.length > 0) {
                    this.respondWith.apply(this, arguments);
                }

                var queue = this.queue || [];
                var requests = queue.splice(0, queue.length);
                var request;

                while (request = requests.shift()) {
                    this.processRequest(request);
                }
            },

            processRequest: function processRequest(request) {
                try {
                    if (request.aborted) {
                        return;
                    }

                    var response = this.response || [404, {}, ""];

                    if (this.responses) {
                        for (var l = this.responses.length, i = l - 1; i >= 0; i--) {
                            if (match.call(this, this.responses[i], request)) {
                                response = this.responses[i].response;
                                break;
                            }
                        }
                    }

                    if (request.readyState != 4) {
                        this.log(response, request);

                        request.respond(response[0], response[1], response[2]);
                    }
                } catch (e) {
                    sinon.logError("Fake server request processing", e);
                }
            },

            restore: function restore() {
                return this.xhr.restore && this.xhr.restore.apply(this.xhr, arguments);
            }
        };
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require, exports, module) {
        var sinon = require("./core");
        require("./fake_xml_http_request");
        makeApi(sinon);
        module.exports = sinon;
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else {
        makeApi(sinon);
    }
}());

},{"./core":24,"./fake_xml_http_request":28}],27:[function(require,module,exports){
(function (global){
/*global lolex */

/**
 * Fake timer API
 * setTimeout
 * setInterval
 * clearTimeout
 * clearInterval
 * tick
 * reset
 * Date
 *
 * Inspired by jsUnitMockTimeOut from JsUnit
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

if (typeof sinon == "undefined") {
    var sinon = {};
}

(function (global) {
    function makeApi(sinon, lol) {
        var _lolex = typeof lolex !== "undefined" ? lolex : lol;

        sinon.useFakeTimers = function () {
            var now, methods = Array.prototype.slice.call(arguments);

            if (typeof methods[0] === "string") {
                now = 0;
            } else {
                now = methods.shift();
            }

            var clock = _lolex.install(now || 0, methods);
            clock.restore = clock.uninstall;
            return clock;
        };

        sinon.clock = {
            create: function (now) {
                return _lolex.createClock(now);
            }
        };

        sinon.timers = {
            setTimeout: setTimeout,
            clearTimeout: clearTimeout,
            setImmediate: (typeof setImmediate !== "undefined" ? setImmediate : undefined),
            clearImmediate: (typeof clearImmediate !== "undefined" ? clearImmediate : undefined),
            setInterval: setInterval,
            clearInterval: clearInterval,
            Date: Date
        };
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require, epxorts, module) {
        var sinon = require("./core");
        makeApi(sinon, require("lolex"));
        module.exports = sinon;
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else {
        makeApi(sinon);
    }
}(typeof global != "undefined" && typeof global !== "function" ? global : this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./core":24,"lolex":31}],28:[function(require,module,exports){
/**
 * @depend core.js
 * @depend ../extend.js
 * @depend event.js
 * @depend ../log_error.js
 */
/**
 * Fake XMLHttpRequest object
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function (global) {

    var supportsProgress = typeof ProgressEvent !== "undefined";
    var supportsCustomEvent = typeof CustomEvent !== "undefined";
    var sinonXhr = { XMLHttpRequest: global.XMLHttpRequest };
    sinonXhr.GlobalXMLHttpRequest = global.XMLHttpRequest;
    sinonXhr.GlobalActiveXObject = global.ActiveXObject;
    sinonXhr.supportsActiveX = typeof sinonXhr.GlobalActiveXObject != "undefined";
    sinonXhr.supportsXHR = typeof sinonXhr.GlobalXMLHttpRequest != "undefined";
    sinonXhr.workingXHR = sinonXhr.supportsXHR ? sinonXhr.GlobalXMLHttpRequest : sinonXhr.supportsActiveX
                                     ? function () { return new sinonXhr.GlobalActiveXObject("MSXML2.XMLHTTP.3.0") } : false;
    sinonXhr.supportsCORS = sinonXhr.supportsXHR && "withCredentials" in (new sinonXhr.GlobalXMLHttpRequest());

    /*jsl:ignore*/
    var unsafeHeaders = {
        "Accept-Charset": true,
        "Accept-Encoding": true,
        Connection: true,
        "Content-Length": true,
        Cookie: true,
        Cookie2: true,
        "Content-Transfer-Encoding": true,
        Date: true,
        Expect: true,
        Host: true,
        "Keep-Alive": true,
        Referer: true,
        TE: true,
        Trailer: true,
        "Transfer-Encoding": true,
        Upgrade: true,
        "User-Agent": true,
        Via: true
    };
    /*jsl:end*/

    function FakeXMLHttpRequest() {
        this.readyState = FakeXMLHttpRequest.UNSENT;
        this.requestHeaders = {};
        this.requestBody = null;
        this.status = 0;
        this.statusText = "";
        this.upload = new UploadProgress();
        if (sinonXhr.supportsCORS) {
            this.withCredentials = false;
        }

        var xhr = this;
        var events = ["loadstart", "load", "abort", "loadend"];

        function addEventListener(eventName) {
            xhr.addEventListener(eventName, function (event) {
                var listener = xhr["on" + eventName];

                if (listener && typeof listener == "function") {
                    listener.call(this, event);
                }
            });
        }

        for (var i = events.length - 1; i >= 0; i--) {
            addEventListener(events[i]);
        }

        if (typeof FakeXMLHttpRequest.onCreate == "function") {
            FakeXMLHttpRequest.onCreate(this);
        }
    }

    // An upload object is created for each
    // FakeXMLHttpRequest and allows upload
    // events to be simulated using uploadProgress
    // and uploadError.
    function UploadProgress() {
        this.eventListeners = {
            progress: [],
            load: [],
            abort: [],
            error: []
        }
    }

    UploadProgress.prototype.addEventListener = function addEventListener(event, listener) {
        this.eventListeners[event].push(listener);
    };

    UploadProgress.prototype.removeEventListener = function removeEventListener(event, listener) {
        var listeners = this.eventListeners[event] || [];

        for (var i = 0, l = listeners.length; i < l; ++i) {
            if (listeners[i] == listener) {
                return listeners.splice(i, 1);
            }
        }
    };

    UploadProgress.prototype.dispatchEvent = function dispatchEvent(event) {
        var listeners = this.eventListeners[event.type] || [];

        for (var i = 0, listener; (listener = listeners[i]) != null; i++) {
            listener(event);
        }
    };

    function verifyState(xhr) {
        if (xhr.readyState !== FakeXMLHttpRequest.OPENED) {
            throw new Error("INVALID_STATE_ERR");
        }

        if (xhr.sendFlag) {
            throw new Error("INVALID_STATE_ERR");
        }
    }

    function getHeader(headers, header) {
        header = header.toLowerCase();

        for (var h in headers) {
            if (h.toLowerCase() == header) {
                return h;
            }
        }

        return null;
    }

    // filtering to enable a white-list version of Sinon FakeXhr,
    // where whitelisted requests are passed through to real XHR
    function each(collection, callback) {
        if (!collection) {
            return;
        }

        for (var i = 0, l = collection.length; i < l; i += 1) {
            callback(collection[i]);
        }
    }
    function some(collection, callback) {
        for (var index = 0; index < collection.length; index++) {
            if (callback(collection[index]) === true) {
                return true;
            }
        }
        return false;
    }
    // largest arity in XHR is 5 - XHR#open
    var apply = function (obj, method, args) {
        switch (args.length) {
        case 0: return obj[method]();
        case 1: return obj[method](args[0]);
        case 2: return obj[method](args[0], args[1]);
        case 3: return obj[method](args[0], args[1], args[2]);
        case 4: return obj[method](args[0], args[1], args[2], args[3]);
        case 5: return obj[method](args[0], args[1], args[2], args[3], args[4]);
        }
    };

    FakeXMLHttpRequest.filters = [];
    FakeXMLHttpRequest.addFilter = function addFilter(fn) {
        this.filters.push(fn)
    };
    var IE6Re = /MSIE 6/;
    FakeXMLHttpRequest.defake = function defake(fakeXhr, xhrArgs) {
        var xhr = new sinonXhr.workingXHR();
        each([
            "open",
            "setRequestHeader",
            "send",
            "abort",
            "getResponseHeader",
            "getAllResponseHeaders",
            "addEventListener",
            "overrideMimeType",
            "removeEventListener"
        ], function (method) {
            fakeXhr[method] = function () {
                return apply(xhr, method, arguments);
            };
        });

        var copyAttrs = function (args) {
            each(args, function (attr) {
                try {
                    fakeXhr[attr] = xhr[attr]
                } catch (e) {
                    if (!IE6Re.test(navigator.userAgent)) {
                        throw e;
                    }
                }
            });
        };

        var stateChange = function stateChange() {
            fakeXhr.readyState = xhr.readyState;
            if (xhr.readyState >= FakeXMLHttpRequest.HEADERS_RECEIVED) {
                copyAttrs(["status", "statusText"]);
            }
            if (xhr.readyState >= FakeXMLHttpRequest.LOADING) {
                copyAttrs(["responseText", "response"]);
            }
            if (xhr.readyState === FakeXMLHttpRequest.DONE) {
                copyAttrs(["responseXML"]);
            }
            if (fakeXhr.onreadystatechange) {
                fakeXhr.onreadystatechange.call(fakeXhr, { target: fakeXhr });
            }
        };

        if (xhr.addEventListener) {
            for (var event in fakeXhr.eventListeners) {
                if (fakeXhr.eventListeners.hasOwnProperty(event)) {
                    each(fakeXhr.eventListeners[event], function (handler) {
                        xhr.addEventListener(event, handler);
                    });
                }
            }
            xhr.addEventListener("readystatechange", stateChange);
        } else {
            xhr.onreadystatechange = stateChange;
        }
        apply(xhr, "open", xhrArgs);
    };
    FakeXMLHttpRequest.useFilters = false;

    function verifyRequestOpened(xhr) {
        if (xhr.readyState != FakeXMLHttpRequest.OPENED) {
            throw new Error("INVALID_STATE_ERR - " + xhr.readyState);
        }
    }

    function verifyRequestSent(xhr) {
        if (xhr.readyState == FakeXMLHttpRequest.DONE) {
            throw new Error("Request done");
        }
    }

    function verifyHeadersReceived(xhr) {
        if (xhr.async && xhr.readyState != FakeXMLHttpRequest.HEADERS_RECEIVED) {
            throw new Error("No headers received");
        }
    }

    function verifyResponseBodyType(body) {
        if (typeof body != "string") {
            var error = new Error("Attempted to respond to fake XMLHttpRequest with " +
                                 body + ", which is not a string.");
            error.name = "InvalidBodyException";
            throw error;
        }
    }

    FakeXMLHttpRequest.parseXML = function parseXML(text) {
        var xmlDoc;

        if (typeof DOMParser != "undefined") {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(text, "text/xml");
        } else {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(text);
        }

        return xmlDoc;
    };

    FakeXMLHttpRequest.statusCodes = {
        100: "Continue",
        101: "Switching Protocols",
        200: "OK",
        201: "Created",
        202: "Accepted",
        203: "Non-Authoritative Information",
        204: "No Content",
        205: "Reset Content",
        206: "Partial Content",
        300: "Multiple Choice",
        301: "Moved Permanently",
        302: "Found",
        303: "See Other",
        304: "Not Modified",
        305: "Use Proxy",
        307: "Temporary Redirect",
        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        407: "Proxy Authentication Required",
        408: "Request Timeout",
        409: "Conflict",
        410: "Gone",
        411: "Length Required",
        412: "Precondition Failed",
        413: "Request Entity Too Large",
        414: "Request-URI Too Long",
        415: "Unsupported Media Type",
        416: "Requested Range Not Satisfiable",
        417: "Expectation Failed",
        422: "Unprocessable Entity",
        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
        505: "HTTP Version Not Supported"
    };

    function makeApi(sinon) {
        sinon.xhr = sinonXhr;

        sinon.extend(FakeXMLHttpRequest.prototype, sinon.EventTarget, {
            async: true,

            open: function open(method, url, async, username, password) {
                this.method = method;
                this.url = url;
                this.async = typeof async == "boolean" ? async : true;
                this.username = username;
                this.password = password;
                this.responseText = null;
                this.responseXML = null;
                this.requestHeaders = {};
                this.sendFlag = false;

                if (FakeXMLHttpRequest.useFilters === true) {
                    var xhrArgs = arguments;
                    var defake = some(FakeXMLHttpRequest.filters, function (filter) {
                        return filter.apply(this, xhrArgs)
                    });
                    if (defake) {
                        return FakeXMLHttpRequest.defake(this, arguments);
                    }
                }
                this.readyStateChange(FakeXMLHttpRequest.OPENED);
            },

            readyStateChange: function readyStateChange(state) {
                this.readyState = state;

                if (typeof this.onreadystatechange == "function") {
                    try {
                        this.onreadystatechange();
                    } catch (e) {
                        sinon.logError("Fake XHR onreadystatechange handler", e);
                    }
                }

                this.dispatchEvent(new sinon.Event("readystatechange"));

                switch (this.readyState) {
                    case FakeXMLHttpRequest.DONE:
                        this.dispatchEvent(new sinon.Event("load", false, false, this));
                        this.dispatchEvent(new sinon.Event("loadend", false, false, this));
                        this.upload.dispatchEvent(new sinon.Event("load", false, false, this));
                        if (supportsProgress) {
                            this.upload.dispatchEvent(new sinon.ProgressEvent("progress", {loaded: 100, total: 100}));
                        }
                        break;
                }
            },

            setRequestHeader: function setRequestHeader(header, value) {
                verifyState(this);

                if (unsafeHeaders[header] || /^(Sec-|Proxy-)/.test(header)) {
                    throw new Error("Refused to set unsafe header \"" + header + "\"");
                }

                if (this.requestHeaders[header]) {
                    this.requestHeaders[header] += "," + value;
                } else {
                    this.requestHeaders[header] = value;
                }
            },

            // Helps testing
            setResponseHeaders: function setResponseHeaders(headers) {
                verifyRequestOpened(this);
                this.responseHeaders = {};

                for (var header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        this.responseHeaders[header] = headers[header];
                    }
                }

                if (this.async) {
                    this.readyStateChange(FakeXMLHttpRequest.HEADERS_RECEIVED);
                } else {
                    this.readyState = FakeXMLHttpRequest.HEADERS_RECEIVED;
                }
            },

            // Currently treats ALL data as a DOMString (i.e. no Document)
            send: function send(data) {
                verifyState(this);

                if (!/^(get|head)$/i.test(this.method)) {
                    var contentType = getHeader(this.requestHeaders, "Content-Type");
                    if (this.requestHeaders[contentType]) {
                        var value = this.requestHeaders[contentType].split(";");
                        this.requestHeaders[contentType] = value[0] + ";charset=utf-8";
                    } else {
                        this.requestHeaders["Content-Type"] = "text/plain;charset=utf-8";
                    }

                    this.requestBody = data;
                }

                this.errorFlag = false;
                this.sendFlag = this.async;
                this.readyStateChange(FakeXMLHttpRequest.OPENED);

                if (typeof this.onSend == "function") {
                    this.onSend(this);
                }

                this.dispatchEvent(new sinon.Event("loadstart", false, false, this));
            },

            abort: function abort() {
                this.aborted = true;
                this.responseText = null;
                this.errorFlag = true;
                this.requestHeaders = {};

                if (this.readyState > FakeXMLHttpRequest.UNSENT && this.sendFlag) {
                    this.readyStateChange(FakeXMLHttpRequest.DONE);
                    this.sendFlag = false;
                }

                this.readyState = FakeXMLHttpRequest.UNSENT;

                this.dispatchEvent(new sinon.Event("abort", false, false, this));

                this.upload.dispatchEvent(new sinon.Event("abort", false, false, this));

                if (typeof this.onerror === "function") {
                    this.onerror();
                }
            },

            getResponseHeader: function getResponseHeader(header) {
                if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {
                    return null;
                }

                if (/^Set-Cookie2?$/i.test(header)) {
                    return null;
                }

                header = getHeader(this.responseHeaders, header);

                return this.responseHeaders[header] || null;
            },

            getAllResponseHeaders: function getAllResponseHeaders() {
                if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {
                    return "";
                }

                var headers = "";

                for (var header in this.responseHeaders) {
                    if (this.responseHeaders.hasOwnProperty(header) &&
                        !/^Set-Cookie2?$/i.test(header)) {
                        headers += header + ": " + this.responseHeaders[header] + "\r\n";
                    }
                }

                return headers;
            },

            setResponseBody: function setResponseBody(body) {
                verifyRequestSent(this);
                verifyHeadersReceived(this);
                verifyResponseBodyType(body);

                var chunkSize = this.chunkSize || 10;
                var index = 0;
                this.responseText = "";

                do {
                    if (this.async) {
                        this.readyStateChange(FakeXMLHttpRequest.LOADING);
                    }

                    this.responseText += body.substring(index, index + chunkSize);
                    index += chunkSize;
                } while (index < body.length);

                var type = this.getResponseHeader("Content-Type");

                if (this.responseText &&
                    (!type || /(text\/xml)|(application\/xml)|(\+xml)/.test(type))) {
                    try {
                        this.responseXML = FakeXMLHttpRequest.parseXML(this.responseText);
                    } catch (e) {
                        // Unable to parse XML - no biggie
                    }
                }

                this.readyStateChange(FakeXMLHttpRequest.DONE);
            },

            respond: function respond(status, headers, body) {
                this.status = typeof status == "number" ? status : 200;
                this.statusText = FakeXMLHttpRequest.statusCodes[this.status];
                this.setResponseHeaders(headers || {});
                this.setResponseBody(body || "");
            },

            uploadProgress: function uploadProgress(progressEventRaw) {
                if (supportsProgress) {
                    this.upload.dispatchEvent(new sinon.ProgressEvent("progress", progressEventRaw));
                }
            },

            uploadError: function uploadError(error) {
                if (supportsCustomEvent) {
                    this.upload.dispatchEvent(new sinon.CustomEvent("error", {detail: error}));
                }
            }
        });

        sinon.extend(FakeXMLHttpRequest, {
            UNSENT: 0,
            OPENED: 1,
            HEADERS_RECEIVED: 2,
            LOADING: 3,
            DONE: 4
        });

        sinon.useFakeXMLHttpRequest = function () {
            FakeXMLHttpRequest.restore = function restore(keepOnCreate) {
                if (sinonXhr.supportsXHR) {
                    global.XMLHttpRequest = sinonXhr.GlobalXMLHttpRequest;
                }

                if (sinonXhr.supportsActiveX) {
                    global.ActiveXObject = sinonXhr.GlobalActiveXObject;
                }

                delete FakeXMLHttpRequest.restore;

                if (keepOnCreate !== true) {
                    delete FakeXMLHttpRequest.onCreate;
                }
            };
            if (sinonXhr.supportsXHR) {
                global.XMLHttpRequest = FakeXMLHttpRequest;
            }

            if (sinonXhr.supportsActiveX) {
                global.ActiveXObject = function ActiveXObject(objId) {
                    if (objId == "Microsoft.XMLHTTP" || /^Msxml2\.XMLHTTP/i.test(objId)) {

                        return new FakeXMLHttpRequest();
                    }

                    return new sinonXhr.GlobalActiveXObject(objId);
                };
            }

            return FakeXMLHttpRequest;
        };

        sinon.FakeXMLHttpRequest = FakeXMLHttpRequest;
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require, exports, module) {
        var sinon = require("./core");
        require("./event");
        makeApi(sinon);
        module.exports = sinon;
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module);
    } else if (typeof sinon === "undefined") {
        return;
    } else {
        makeApi(sinon);
    }

})(typeof self !== "undefined" ? self : this);

},{"./core":24,"./event":25}],29:[function(require,module,exports){
(function (global){
((typeof define === "function" && define.amd && function (m) {
    define("formatio", ["samsam"], m);
}) || (typeof module === "object" && function (m) {
    module.exports = m(require("samsam"));
}) || function (m) { this.formatio = m(this.samsam); }
)(function (samsam) {
    "use strict";

    var formatio = {
        excludeConstructors: ["Object", /^.$/],
        quoteStrings: true,
        limitChildrenCount: 0
    };

    var hasOwn = Object.prototype.hasOwnProperty;

    var specialObjects = [];
    if (typeof global !== "undefined") {
        specialObjects.push({ object: global, value: "[object global]" });
    }
    if (typeof document !== "undefined") {
        specialObjects.push({
            object: document,
            value: "[object HTMLDocument]"
        });
    }
    if (typeof window !== "undefined") {
        specialObjects.push({ object: window, value: "[object Window]" });
    }

    function functionName(func) {
        if (!func) { return ""; }
        if (func.displayName) { return func.displayName; }
        if (func.name) { return func.name; }
        var matches = func.toString().match(/function\s+([^\(]+)/m);
        return (matches && matches[1]) || "";
    }

    function constructorName(f, object) {
        var name = functionName(object && object.constructor);
        var excludes = f.excludeConstructors ||
                formatio.excludeConstructors || [];

        var i, l;
        for (i = 0, l = excludes.length; i < l; ++i) {
            if (typeof excludes[i] === "string" && excludes[i] === name) {
                return "";
            } else if (excludes[i].test && excludes[i].test(name)) {
                return "";
            }
        }

        return name;
    }

    function isCircular(object, objects) {
        if (typeof object !== "object") { return false; }
        var i, l;
        for (i = 0, l = objects.length; i < l; ++i) {
            if (objects[i] === object) { return true; }
        }
        return false;
    }

    function ascii(f, object, processed, indent) {
        if (typeof object === "string") {
            var qs = f.quoteStrings;
            var quote = typeof qs !== "boolean" || qs;
            return processed || quote ? '"' + object + '"' : object;
        }

        if (typeof object === "function" && !(object instanceof RegExp)) {
            return ascii.func(object);
        }

        processed = processed || [];

        if (isCircular(object, processed)) { return "[Circular]"; }

        if (Object.prototype.toString.call(object) === "[object Array]") {
            return ascii.array.call(f, object, processed);
        }

        if (!object) { return String((1/object) === -Infinity ? "-0" : object); }
        if (samsam.isElement(object)) { return ascii.element(object); }

        if (typeof object.toString === "function" &&
                object.toString !== Object.prototype.toString) {
            return object.toString();
        }

        var i, l;
        for (i = 0, l = specialObjects.length; i < l; i++) {
            if (object === specialObjects[i].object) {
                return specialObjects[i].value;
            }
        }

        return ascii.object.call(f, object, processed, indent);
    }

    ascii.func = function (func) {
        return "function " + functionName(func) + "() {}";
    };

    ascii.array = function (array, processed) {
        processed = processed || [];
        processed.push(array);
        var pieces = [];
        var i, l;
        l = (this.limitChildrenCount > 0) ? 
            Math.min(this.limitChildrenCount, array.length) : array.length;

        for (i = 0; i < l; ++i) {
            pieces.push(ascii(this, array[i], processed));
        }

        if(l < array.length)
            pieces.push("[... " + (array.length - l) + " more elements]");

        return "[" + pieces.join(", ") + "]";
    };

    ascii.object = function (object, processed, indent) {
        processed = processed || [];
        processed.push(object);
        indent = indent || 0;
        var pieces = [], properties = samsam.keys(object).sort();
        var length = 3;
        var prop, str, obj, i, k, l;
        l = (this.limitChildrenCount > 0) ? 
            Math.min(this.limitChildrenCount, properties.length) : properties.length;

        for (i = 0; i < l; ++i) {
            prop = properties[i];
            obj = object[prop];

            if (isCircular(obj, processed)) {
                str = "[Circular]";
            } else {
                str = ascii(this, obj, processed, indent + 2);
            }

            str = (/\s/.test(prop) ? '"' + prop + '"' : prop) + ": " + str;
            length += str.length;
            pieces.push(str);
        }

        var cons = constructorName(this, object);
        var prefix = cons ? "[" + cons + "] " : "";
        var is = "";
        for (i = 0, k = indent; i < k; ++i) { is += " "; }

        if(l < properties.length)
            pieces.push("[... " + (properties.length - l) + " more elements]");

        if (length + indent > 80) {
            return prefix + "{\n  " + is + pieces.join(",\n  " + is) + "\n" +
                is + "}";
        }
        return prefix + "{ " + pieces.join(", ") + " }";
    };

    ascii.element = function (element) {
        var tagName = element.tagName.toLowerCase();
        var attrs = element.attributes, attr, pairs = [], attrName, i, l, val;

        for (i = 0, l = attrs.length; i < l; ++i) {
            attr = attrs.item(i);
            attrName = attr.nodeName.toLowerCase().replace("html:", "");
            val = attr.nodeValue;
            if (attrName !== "contenteditable" || val !== "inherit") {
                if (!!val) { pairs.push(attrName + "=\"" + val + "\""); }
            }
        }

        var formatted = "<" + tagName + (pairs.length > 0 ? " " : "");
        var content = element.innerHTML;

        if (content.length > 20) {
            content = content.substr(0, 20) + "[...]";
        }

        var res = formatted + pairs.join(" ") + ">" + content +
                "</" + tagName + ">";

        return res.replace(/ contentEditable="inherit"/, "");
    };

    function Formatio(options) {
        for (var opt in options) {
            this[opt] = options[opt];
        }
    }

    Formatio.prototype = {
        functionName: functionName,

        configure: function (options) {
            return new Formatio(options);
        },

        constructorName: function (object) {
            return constructorName(this, object);
        },

        ascii: function (object, processed, indent) {
            return ascii(this, object, processed, indent);
        }
    };

    return Formatio.prototype;
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"samsam":30}],30:[function(require,module,exports){
((typeof define === "function" && define.amd && function (m) { define("samsam", m); }) ||
 (typeof module === "object" &&
      function (m) { module.exports = m(); }) || // Node
 function (m) { this.samsam = m(); } // Browser globals
)(function () {
    var o = Object.prototype;
    var div = typeof document !== "undefined" && document.createElement("div");

    function isNaN(value) {
        // Unlike global isNaN, this avoids type coercion
        // typeof check avoids IE host object issues, hat tip to
        // lodash
        var val = value; // JsLint thinks value !== value is "weird"
        return typeof value === "number" && value !== val;
    }

    function getClass(value) {
        // Returns the internal [[Class]] by calling Object.prototype.toString
        // with the provided value as this. Return value is a string, naming the
        // internal class, e.g. "Array"
        return o.toString.call(value).split(/[ \]]/)[1];
    }

    /**
     * @name samsam.isArguments
     * @param Object object
     *
     * Returns ``true`` if ``object`` is an ``arguments`` object,
     * ``false`` otherwise.
     */
    function isArguments(object) {
        if (getClass(object) === 'Arguments') { return true; }
        if (typeof object !== "object" || typeof object.length !== "number" ||
                getClass(object) === "Array") {
            return false;
        }
        if (typeof object.callee == "function") { return true; }
        try {
            object[object.length] = 6;
            delete object[object.length];
        } catch (e) {
            return true;
        }
        return false;
    }

    /**
     * @name samsam.isElement
     * @param Object object
     *
     * Returns ``true`` if ``object`` is a DOM element node. Unlike
     * Underscore.js/lodash, this function will return ``false`` if ``object``
     * is an *element-like* object, i.e. a regular object with a ``nodeType``
     * property that holds the value ``1``.
     */
    function isElement(object) {
        if (!object || object.nodeType !== 1 || !div) { return false; }
        try {
            object.appendChild(div);
            object.removeChild(div);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * @name samsam.keys
     * @param Object object
     *
     * Return an array of own property names.
     */
    function keys(object) {
        var ks = [], prop;
        for (prop in object) {
            if (o.hasOwnProperty.call(object, prop)) { ks.push(prop); }
        }
        return ks;
    }

    /**
     * @name samsam.isDate
     * @param Object value
     *
     * Returns true if the object is a ``Date``, or *date-like*. Duck typing
     * of date objects work by checking that the object has a ``getTime``
     * function whose return value equals the return value from the object's
     * ``valueOf``.
     */
    function isDate(value) {
        return typeof value.getTime == "function" &&
            value.getTime() == value.valueOf();
    }

    /**
     * @name samsam.isNegZero
     * @param Object value
     *
     * Returns ``true`` if ``value`` is ``-0``.
     */
    function isNegZero(value) {
        return value === 0 && 1 / value === -Infinity;
    }

    /**
     * @name samsam.equal
     * @param Object obj1
     * @param Object obj2
     *
     * Returns ``true`` if two objects are strictly equal. Compared to
     * ``===`` there are two exceptions:
     *
     *   - NaN is considered equal to NaN
     *   - -0 and +0 are not considered equal
     */
    function identical(obj1, obj2) {
        if (obj1 === obj2 || (isNaN(obj1) && isNaN(obj2))) {
            return obj1 !== 0 || isNegZero(obj1) === isNegZero(obj2);
        }
    }


    /**
     * @name samsam.deepEqual
     * @param Object obj1
     * @param Object obj2
     *
     * Deep equal comparison. Two values are "deep equal" if:
     *
     *   - They are equal, according to samsam.identical
     *   - They are both date objects representing the same time
     *   - They are both arrays containing elements that are all deepEqual
     *   - They are objects with the same set of properties, and each property
     *     in ``obj1`` is deepEqual to the corresponding property in ``obj2``
     *
     * Supports cyclic objects.
     */
    function deepEqualCyclic(obj1, obj2) {

        // used for cyclic comparison
        // contain already visited objects
        var objects1 = [],
            objects2 = [],
        // contain pathes (position in the object structure)
        // of the already visited objects
        // indexes same as in objects arrays
            paths1 = [],
            paths2 = [],
        // contains combinations of already compared objects
        // in the manner: { "$1['ref']$2['ref']": true }
            compared = {};

        /**
         * used to check, if the value of a property is an object
         * (cyclic logic is only needed for objects)
         * only needed for cyclic logic
         */
        function isObject(value) {

            if (typeof value === 'object' && value !== null &&
                    !(value instanceof Boolean) &&
                    !(value instanceof Date)    &&
                    !(value instanceof Number)  &&
                    !(value instanceof RegExp)  &&
                    !(value instanceof String)) {

                return true;
            }

            return false;
        }

        /**
         * returns the index of the given object in the
         * given objects array, -1 if not contained
         * only needed for cyclic logic
         */
        function getIndex(objects, obj) {

            var i;
            for (i = 0; i < objects.length; i++) {
                if (objects[i] === obj) {
                    return i;
                }
            }

            return -1;
        }

        // does the recursion for the deep equal check
        return (function deepEqual(obj1, obj2, path1, path2) {
            var type1 = typeof obj1;
            var type2 = typeof obj2;

            // == null also matches undefined
            if (obj1 === obj2 ||
                    isNaN(obj1) || isNaN(obj2) ||
                    obj1 == null || obj2 == null ||
                    type1 !== "object" || type2 !== "object") {

                return identical(obj1, obj2);
            }

            // Elements are only equal if identical(expected, actual)
            if (isElement(obj1) || isElement(obj2)) { return false; }

            var isDate1 = isDate(obj1), isDate2 = isDate(obj2);
            if (isDate1 || isDate2) {
                if (!isDate1 || !isDate2 || obj1.getTime() !== obj2.getTime()) {
                    return false;
                }
            }

            if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
                if (obj1.toString() !== obj2.toString()) { return false; }
            }

            var class1 = getClass(obj1);
            var class2 = getClass(obj2);
            var keys1 = keys(obj1);
            var keys2 = keys(obj2);

            if (isArguments(obj1) || isArguments(obj2)) {
                if (obj1.length !== obj2.length) { return false; }
            } else {
                if (type1 !== type2 || class1 !== class2 ||
                        keys1.length !== keys2.length) {
                    return false;
                }
            }

            var key, i, l,
                // following vars are used for the cyclic logic
                value1, value2,
                isObject1, isObject2,
                index1, index2,
                newPath1, newPath2;

            for (i = 0, l = keys1.length; i < l; i++) {
                key = keys1[i];
                if (!o.hasOwnProperty.call(obj2, key)) {
                    return false;
                }

                // Start of the cyclic logic

                value1 = obj1[key];
                value2 = obj2[key];

                isObject1 = isObject(value1);
                isObject2 = isObject(value2);

                // determine, if the objects were already visited
                // (it's faster to check for isObject first, than to
                // get -1 from getIndex for non objects)
                index1 = isObject1 ? getIndex(objects1, value1) : -1;
                index2 = isObject2 ? getIndex(objects2, value2) : -1;

                // determine the new pathes of the objects
                // - for non cyclic objects the current path will be extended
                //   by current property name
                // - for cyclic objects the stored path is taken
                newPath1 = index1 !== -1
                    ? paths1[index1]
                    : path1 + '[' + JSON.stringify(key) + ']';
                newPath2 = index2 !== -1
                    ? paths2[index2]
                    : path2 + '[' + JSON.stringify(key) + ']';

                // stop recursion if current objects are already compared
                if (compared[newPath1 + newPath2]) {
                    return true;
                }

                // remember the current objects and their pathes
                if (index1 === -1 && isObject1) {
                    objects1.push(value1);
                    paths1.push(newPath1);
                }
                if (index2 === -1 && isObject2) {
                    objects2.push(value2);
                    paths2.push(newPath2);
                }

                // remember that the current objects are already compared
                if (isObject1 && isObject2) {
                    compared[newPath1 + newPath2] = true;
                }

                // End of cyclic logic

                // neither value1 nor value2 is a cycle
                // continue with next level
                if (!deepEqual(value1, value2, newPath1, newPath2)) {
                    return false;
                }
            }

            return true;

        }(obj1, obj2, '$1', '$2'));
    }

    var match;

    function arrayContains(array, subset) {
        if (subset.length === 0) { return true; }
        var i, l, j, k;
        for (i = 0, l = array.length; i < l; ++i) {
            if (match(array[i], subset[0])) {
                for (j = 0, k = subset.length; j < k; ++j) {
                    if (!match(array[i + j], subset[j])) { return false; }
                }
                return true;
            }
        }
        return false;
    }

    /**
     * @name samsam.match
     * @param Object object
     * @param Object matcher
     *
     * Compare arbitrary value ``object`` with matcher.
     */
    match = function match(object, matcher) {
        if (matcher && typeof matcher.test === "function") {
            return matcher.test(object);
        }

        if (typeof matcher === "function") {
            return matcher(object) === true;
        }

        if (typeof matcher === "string") {
            matcher = matcher.toLowerCase();
            var notNull = typeof object === "string" || !!object;
            return notNull &&
                (String(object)).toLowerCase().indexOf(matcher) >= 0;
        }

        if (typeof matcher === "number") {
            return matcher === object;
        }

        if (typeof matcher === "boolean") {
            return matcher === object;
        }

        if (getClass(object) === "Array" && getClass(matcher) === "Array") {
            return arrayContains(object, matcher);
        }

        if (matcher && typeof matcher === "object") {
            var prop;
            for (prop in matcher) {
                var value = object[prop];
                if (typeof value === "undefined" &&
                        typeof object.getAttribute === "function") {
                    value = object.getAttribute(prop);
                }
                if (typeof value === "undefined" || !match(value, matcher[prop])) {
                    return false;
                }
            }
            return true;
        }

        throw new Error("Matcher was not a string, a number, a " +
                        "function, a boolean or an object");
    };

    return {
        isArguments: isArguments,
        isElement: isElement,
        isDate: isDate,
        isNegZero: isNegZero,
        identical: identical,
        deepEqual: deepEqualCyclic,
        match: match,
        keys: keys
    };
});

},{}],31:[function(require,module,exports){
(function (global){
/*jslint eqeqeq: false, plusplus: false, evil: true, onevar: false, browser: true, forin: false*/
/*global global*/
/**
 * @author Christian Johansen (christian@cjohansen.no) and contributors
 * @license BSD
 *
 * Copyright (c) 2010-2014 Christian Johansen
 */
"use strict";

// node expects setTimeout/setInterval to return a fn object w/ .ref()/.unref()
// browsers, a number.
// see https://github.com/cjohansen/Sinon.JS/pull/436
var timeoutResult = setTimeout(function() {}, 0);
var addTimerReturnsObject = typeof timeoutResult === "object";
clearTimeout(timeoutResult);

var NativeDate = Date;
var id = 1;

/**
 * Parse strings like "01:10:00" (meaning 1 hour, 10 minutes, 0 seconds) into
 * number of milliseconds. This is used to support human-readable strings passed
 * to clock.tick()
 */
function parseTime(str) {
    if (!str) {
        return 0;
    }

    var strings = str.split(":");
    var l = strings.length, i = l;
    var ms = 0, parsed;

    if (l > 3 || !/^(\d\d:){0,2}\d\d?$/.test(str)) {
        throw new Error("tick only understands numbers and 'h:m:s'");
    }

    while (i--) {
        parsed = parseInt(strings[i], 10);

        if (parsed >= 60) {
            throw new Error("Invalid time " + str);
        }

        ms += parsed * Math.pow(60, (l - i - 1));
    }

    return ms * 1000;
}

/**
 * Used to grok the `now` parameter to createClock.
 */
function getEpoch(epoch) {
    if (!epoch) { return 0; }
    if (typeof epoch.getTime === "function") { return epoch.getTime(); }
    if (typeof epoch === "number") { return epoch; }
    throw new TypeError("now should be milliseconds since UNIX epoch");
}

function inRange(from, to, timer) {
    return timer && timer.callAt >= from && timer.callAt <= to;
}

function mirrorDateProperties(target, source) {
    if (source.now) {
        target.now = function now() {
            return target.clock.now;
        };
    } else {
        delete target.now;
    }

    if (source.toSource) {
        target.toSource = function toSource() {
            return source.toSource();
        };
    } else {
        delete target.toSource;
    }

    target.toString = function toString() {
        return source.toString();
    };

    target.prototype = source.prototype;
    target.parse = source.parse;
    target.UTC = source.UTC;
    target.prototype.toUTCString = source.prototype.toUTCString;

    for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
            target[prop] = source[prop];
        }
    }

    return target;
}

function createDate() {
    function ClockDate(year, month, date, hour, minute, second, ms) {
        // Defensive and verbose to avoid potential harm in passing
        // explicit undefined when user does not pass argument
        switch (arguments.length) {
        case 0:
            return new NativeDate(ClockDate.clock.now);
        case 1:
            return new NativeDate(year);
        case 2:
            return new NativeDate(year, month);
        case 3:
            return new NativeDate(year, month, date);
        case 4:
            return new NativeDate(year, month, date, hour);
        case 5:
            return new NativeDate(year, month, date, hour, minute);
        case 6:
            return new NativeDate(year, month, date, hour, minute, second);
        default:
            return new NativeDate(year, month, date, hour, minute, second, ms);
        }
    }

    return mirrorDateProperties(ClockDate, NativeDate);
}

function addTimer(clock, timer) {
    if (typeof timer.func === "undefined") {
        throw new Error("Callback must be provided to timer calls");
    }

    if (!clock.timers) {
        clock.timers = {};
    }

    timer.id = id++;
    timer.createdAt = clock.now;
    timer.callAt = clock.now + (timer.delay || 0);

    clock.timers[timer.id] = timer;

    if (addTimerReturnsObject) {
        return {
            id: timer.id,
            ref: function() {},
            unref: function() {}
        };
    }
    else {
        return timer.id;
    }
}

function firstTimerInRange(clock, from, to) {
    var timers = clock.timers, timer = null;

    for (var id in timers) {
        if (!inRange(from, to, timers[id])) {
            continue;
        }

        if (!timer || ~compareTimers(timer, timers[id])) {
            timer = timers[id];
        }
    }

    return timer;
}

function compareTimers(a, b) {
    // Sort first by absolute timing
    if (a.callAt < b.callAt) {
        return -1;
    }
    if (a.callAt > b.callAt) {
        return 1;
    }

    // Sort next by immediate, immediate timers take precedence
    if (a.immediate && !b.immediate) {
        return -1;
    }
    if (!a.immediate && b.immediate) {
        return 1;
    }

    // Sort next by creation time, earlier-created timers take precedence
    if (a.createdAt < b.createdAt) {
        return -1;
    }
    if (a.createdAt > b.createdAt) {
        return 1;
    }

    // Sort next by id, lower-id timers take precedence
    if (a.id < b.id) {
        return -1;
    }
    if (a.id > b.id) {
        return 1;
    }

    // As timer ids are unique, no fallback `0` is necessary
}

function callTimer(clock, timer) {
    if (typeof timer.interval == "number") {
        clock.timers[timer.id].callAt += timer.interval;
    } else {
        delete clock.timers[timer.id];
    }

    try {
        if (typeof timer.func == "function") {
            timer.func.apply(null, timer.args);
        } else {
            eval(timer.func);
        }
    } catch (e) {
        var exception = e;
    }

    if (!clock.timers[timer.id]) {
        if (exception) {
            throw exception;
        }
        return;
    }

    if (exception) {
        throw exception;
    }
}

function uninstall(clock, target) {
    var method;

    for (var i = 0, l = clock.methods.length; i < l; i++) {
        method = clock.methods[i];

        if (target[method].hadOwnProperty) {
            target[method] = clock["_" + method];
        } else {
            try {
                delete target[method];
            } catch (e) {}
        }
    }

    // Prevent multiple executions which will completely remove these props
    clock.methods = [];
}

function hijackMethod(target, method, clock) {
    clock[method].hadOwnProperty = Object.prototype.hasOwnProperty.call(target, method);
    clock["_" + method] = target[method];

    if (method == "Date") {
        var date = mirrorDateProperties(clock[method], target[method]);
        target[method] = date;
    } else {
        target[method] = function () {
            return clock[method].apply(clock, arguments);
        };

        for (var prop in clock[method]) {
            if (clock[method].hasOwnProperty(prop)) {
                target[method][prop] = clock[method][prop];
            }
        }
    }

    target[method].clock = clock;
}

var timers = {
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setImmediate: (typeof setImmediate !== "undefined" ? setImmediate : undefined),
    clearImmediate: (typeof clearImmediate !== "undefined" ? clearImmediate: undefined),
    setInterval: setInterval,
    clearInterval: clearInterval,
    Date: Date
};

var keys = Object.keys || function (obj) {
    var ks = [];
    for (var key in obj) {
        ks.push(key);
    }
    return ks;
};

exports.timers = timers;

var createClock = exports.createClock = function (now) {
    var clock = {
        now: getEpoch(now),
        timeouts: {},
        Date: createDate()
    };

    clock.Date.clock = clock;

    clock.setTimeout = function setTimeout(func, timeout) {
        return addTimer(clock, {
            func: func,
            args: Array.prototype.slice.call(arguments, 2),
            delay: timeout
        });
    };

    clock.clearTimeout = function clearTimeout(timerId) {
        if (!timerId) {
            // null appears to be allowed in most browsers, and appears to be
            // relied upon by some libraries, like Bootstrap carousel
            return;
        }
        if (!clock.timers) {
            clock.timers = [];
        }
        // in Node, timerId is an object with .ref()/.unref(), and
        // its .id field is the actual timer id.
        if (typeof timerId === "object") {
            timerId = timerId.id
        }
        if (timerId in clock.timers) {
            delete clock.timers[timerId];
        }
    };

    clock.setInterval = function setInterval(func, timeout) {
        return addTimer(clock, {
            func: func,
            args: Array.prototype.slice.call(arguments, 2),
            delay: timeout,
            interval: timeout
        });
    };

    clock.clearInterval = function clearInterval(timerId) {
        clock.clearTimeout(timerId);
    };

    clock.setImmediate = function setImmediate(func) {
        return addTimer(clock, {
            func: func,
            args: Array.prototype.slice.call(arguments, 1),
            immediate: true
        });
    };

    clock.clearImmediate = function clearImmediate(timerId) {
        clock.clearTimeout(timerId);
    };

    clock.tick = function tick(ms) {
        ms = typeof ms == "number" ? ms : parseTime(ms);
        var tickFrom = clock.now, tickTo = clock.now + ms, previous = clock.now;
        var timer = firstTimerInRange(clock, tickFrom, tickTo);

        var firstException;
        while (timer && tickFrom <= tickTo) {
            if (clock.timers[timer.id]) {
                tickFrom = clock.now = timer.callAt;
                try {
                    callTimer(clock, timer);
                } catch (e) {
                    firstException = firstException || e;
                }
            }

            timer = firstTimerInRange(clock, previous, tickTo);
            previous = tickFrom;
        }

        clock.now = tickTo;

        if (firstException) {
            throw firstException;
        }

        return clock.now;
    };

    clock.reset = function reset() {
        clock.timers = {};
    };

    return clock;
};

exports.install = function install(target, now, toFake) {
    if (typeof target === "number") {
        toFake = now;
        now = target;
        target = null;
    }

    if (!target) {
        target = global;
    }

    var clock = createClock(now);

    clock.uninstall = function () {
        uninstall(clock, target);
    };

    clock.methods = toFake || [];

    if (clock.methods.length === 0) {
        clock.methods = keys(timers);
    }

    for (var i = 0, l = clock.methods.length; i < l; i++) {
        hijackMethod(target, clock.methods[i], clock);
    }

    return clock;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],32:[function(require,module,exports){
// transducers-js 0.4.136
// http://github.com/cognitect-labs/transducers-js
// 
// Copyright 2014 Cognitect. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License..
var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.isDef = function(a) {
  return void 0 !== a;
};
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  a[0] in c || !c.execScript || c.execScript("var " + a[0]);
  for (var d;a.length && (d = a.shift());) {
    !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {};
  }
};
goog.define = function(a, b) {
  var c = b;
  COMPILED || (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, a) ? c = goog.global.CLOSURE_UNCOMPILED_DEFINES[a] : goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, a) && (c = goog.global.CLOSURE_DEFINES[a]));
  goog.exportPath_(a, c);
};
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.STRICT_MODE_COMPATIBLE = !1;
goog.provide = function(a) {
  if (!COMPILED && goog.isProvided_(a)) {
    throw Error('Namespace "' + a + '" already declared.');
  }
  goog.constructNamespace_(a);
};
goog.constructNamespace_ = function(a, b) {
  if (!COMPILED) {
    delete goog.implicitNamespaces_[a];
    for (var c = a;(c = c.substring(0, c.lastIndexOf("."))) && !goog.getObjectByName(c);) {
      goog.implicitNamespaces_[c] = !0;
    }
  }
  goog.exportPath_(a, b);
};
goog.module = function(a) {
  if (!goog.isString(a) || !a) {
    throw Error("Invalid module identifier");
  }
  if (!goog.isInModuleLoader_()) {
    throw Error("Module " + a + " has been loaded incorrectly.");
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  goog.moduleLoaderState_.moduleName = a;
  if (!COMPILED) {
    if (goog.isProvided_(a)) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    delete goog.implicitNamespaces_[a];
  }
};
goog.module.get = function(a) {
  return goog.module.getInternal_(a);
};
goog.module.getInternal_ = function(a) {
  if (!COMPILED) {
    return goog.isProvided_(a) ? a in goog.loadedModules_ ? goog.loadedModules_[a] : goog.getObjectByName(a) : null;
  }
};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function() {
  return null != goog.moduleLoaderState_;
};
goog.module.declareTestMethods = function() {
  if (!goog.isInModuleLoader_()) {
    throw Error("goog.module.declareTestMethods must be called from within a goog.module");
  }
  goog.moduleLoaderState_.declareTestMethods = !0;
};
goog.module.declareLegacyNamespace = function() {
  if (!COMPILED && !goog.isInModuleLoader_()) {
    throw Error("goog.module.declareLegacyNamespace must be called from within a goog.module");
  }
  if (!COMPILED && !goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module must be called prior to goog.module.declareLegacyNamespace.");
  }
  goog.moduleLoaderState_.declareLegacyNamespace = !0;
};
goog.setTestOnly = function(a) {
  if (COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
  }
};
goog.forwardDeclare = function(a) {
};
COMPILED || (goog.isProvided_ = function(a) {
  return a in goog.loadedModules_ || !goog.implicitNamespaces_[a] && goog.isDefAndNotNull(goog.getObjectByName(a));
}, goog.implicitNamespaces_ = {"goog.module":!0});
goog.getObjectByName = function(a, b) {
  for (var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if (goog.isDefAndNotNull(d[e])) {
      d = d[e];
    } else {
      return null;
    }
  }
  return d;
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for (d in a) {
    c[d] = a[d];
  }
};
goog.addDependency = function(a, b, c, d) {
  if (goog.DEPENDENCIES_ENABLED) {
    var e;
    a = a.replace(/\\/g, "/");
    for (var f = goog.dependencies_, g = 0;e = b[g];g++) {
      f.nameToPath[e] = a, f.pathIsModule[a] = !!d;
    }
    for (d = 0;b = c[d];d++) {
      a in f.requires || (f.requires[a] = {}), f.requires[a][b] = !0;
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.logToConsole_ = function(a) {
  goog.global.console && goog.global.console.error(a);
};
goog.require = function(a) {
  if (!COMPILED) {
    if (goog.isProvided_(a)) {
      return goog.isInModuleLoader_() ? goog.module.getInternal_(a) : null;
    }
    if (goog.ENABLE_DEBUG_LOADER) {
      var b = goog.getPathFromDeps_(a);
      if (b) {
        return goog.included_[b] = !0, goog.writeScripts_(), null;
      }
    }
    a = "goog.require could not find: " + a;
    goog.logToConsole_(a);
    throw Error(a);
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a, b) {
  return a;
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if (a.instance_) {
      return a.instance_;
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
    return a.instance_ = new a;
  };
};
goog.instantiatedSingletons_ = [];
goog.LOAD_MODULE_USING_EVAL = !0;
goog.SEAL_MODULE_EXPORTS = goog.DEBUG;
goog.loadedModules_ = {};
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
goog.DEPENDENCIES_ENABLED && (goog.included_ = {}, goog.dependencies_ = {pathIsModule:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return "undefined" != typeof a && "write" in a;
}, goog.findBasePath_ = function() {
  if (goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH;
  } else {
    if (goog.inHtmlDocument_()) {
      for (var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1;0 <= b;--b) {
        var c = a[b].src, d = c.lastIndexOf("?"), d = -1 == d ? c.length : d;
        if ("base.js" == c.substr(d - 7, 7)) {
          goog.basePath = c.substr(0, d - 7);
          break;
        }
      }
    }
  }
}, goog.importScript_ = function(a, b) {
  (goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_)(a, b) && (goog.dependencies_.written[a] = !0);
}, goog.IS_OLD_IE_ = goog.global.document && goog.global.document.all && !goog.global.atob, goog.importModule_ = function(a) {
  goog.importScript_("", 'goog.retrieveAndExecModule_("' + a + '");') && (goog.dependencies_.written[a] = !0);
}, goog.queuedModules_ = [], goog.retrieveAndExecModule_ = function(a) {
  for (var b;-1 != (b = a.indexOf("/./"));) {
    a = a.substr(0, b) + a.substr(b + 2);
  }
  for (;-1 != (b = a.indexOf("/../"));) {
    var c = a.lastIndexOf("/", b - 1);
    a = a.substr(0, c) + a.substr(b + 3);
  }
  b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  var d = null, c = new goog.global.XMLHttpRequest;
  c.onload = function() {
    d = this.responseText;
  };
  c.open("get", a, !1);
  c.send();
  d = c.responseText;
  if (null != d) {
    c = goog.wrapModule_(a, d), goog.IS_OLD_IE_ ? goog.queuedModules_.push(c) : b(a, c), goog.dependencies_.written[a] = !0;
  } else {
    throw Error("load of " + a + "failed");
  }
}, goog.wrapModule_ = function(a, b) {
  return goog.LOAD_MODULE_USING_EVAL && goog.isDef(goog.global.JSON) ? "goog.loadModule(" + goog.global.JSON.stringify(b + "\n//# sourceURL=" + a + "\n") + ");" : 'goog.loadModule(function(exports) {"use strict";' + b + "\n;return exports});\n//# sourceURL=" + a + "\n";
}, goog.loadQueuedModules_ = function() {
  var a = goog.queuedModules_.length;
  if (0 < a) {
    var b = goog.queuedModules_;
    goog.queuedModules_ = [];
    for (var c = 0;c < a;c++) {
      goog.globalEval(b[c]);
    }
  }
}, goog.loadModule = function(a) {
  try {
    goog.moduleLoaderState_ = {moduleName:void 0, declareTestMethods:!1};
    var b;
    if (goog.isFunction(a)) {
      b = a.call(goog.global, {});
    } else {
      if (goog.isString(a)) {
        b = goog.loadModuleFromSource_.call(goog.global, a);
      } else {
        throw Error("Invalid module definition");
      }
    }
    var c = goog.moduleLoaderState_.moduleName;
    if (!goog.isString(c) || !c) {
      throw Error('Invalid module name "' + c + '"');
    }
    goog.moduleLoaderState_.declareLegacyNamespace ? goog.constructNamespace_(c, b) : goog.SEAL_MODULE_EXPORTS && Object.seal && Object.seal(b);
    goog.loadedModules_[c] = b;
    if (goog.moduleLoaderState_.declareTestMethods) {
      for (var d in b) {
        if (0 === d.indexOf("test", 0) || "tearDown" == d || "setup" == d) {
          goog.global[d] = b[d];
        }
      }
    }
  } finally {
    goog.moduleLoaderState_ = null;
  }
}, goog.loadModuleFromSource_ = function(a) {
  eval(a);
  return{};
}, goog.writeScriptTag_ = function(a, b) {
  if (goog.inHtmlDocument_()) {
    var c = goog.global.document;
    if ("complete" == c.readyState) {
      if (/\bdeps.js$/.test(a)) {
        return!1;
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    var d = goog.IS_OLD_IE_;
    void 0 === b ? d ? (d = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ", c.write('<script type="text/javascript" src="' + a + '"' + d + ">\x3c/script>")) : c.write('<script type="text/javascript" src="' + a + '">\x3c/script>') : c.write('<script type="text/javascript">' + b + "\x3c/script>");
    return!0;
  }
  return!1;
}, goog.lastNonModuleScriptIndex_ = 0, goog.onScriptLoad_ = function(a, b) {
  "complete" == a.readyState && goog.lastNonModuleScriptIndex_ == b && goog.loadQueuedModules_();
  return!0;
}, goog.writeScripts_ = function() {
  function a(e) {
    if (!(e in d.written)) {
      if (!(e in d.visited) && (d.visited[e] = !0, e in d.requires)) {
        for (var f in d.requires[e]) {
          if (!goog.isProvided_(f)) {
            if (f in d.nameToPath) {
              a(d.nameToPath[f]);
            } else {
              throw Error("Undefined nameToPath for " + f);
            }
          }
        }
      }
      e in c || (c[e] = !0, b.push(e));
    }
  }
  var b = [], c = {}, d = goog.dependencies_, e;
  for (e in goog.included_) {
    d.written[e] || a(e);
  }
  for (var f = 0;f < b.length;f++) {
    e = b[f], goog.dependencies_.written[e] = !0;
  }
  var g = goog.moduleLoaderState_;
  goog.moduleLoaderState_ = null;
  for (f = 0;f < b.length;f++) {
    if (e = b[f]) {
      d.pathIsModule[e] ? goog.importModule_(goog.basePath + e) : goog.importScript_(goog.basePath + e);
    } else {
      throw goog.moduleLoaderState_ = g, Error("Undefined script input");
    }
  }
  goog.moduleLoaderState_ = g;
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null;
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
  var b = typeof a;
  if ("object" == b) {
    if (a) {
      if (a instanceof Array) {
        return "array";
      }
      if (a instanceof Object) {
        return b;
      }
      var c = Object.prototype.toString.call(a);
      if ("[object Window]" == c) {
        return "object";
      }
      if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return "array";
      }
      if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if ("function" == b && "undefined" == typeof a.call) {
      return "object";
    }
  }
  return b;
};
goog.isNull = function(a) {
  return null === a;
};
goog.isDefAndNotNull = function(a) {
  return null != a;
};
goog.isArray = function(a) {
  return "array" == goog.typeOf(a);
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return "array" == b || "object" == b && "number" == typeof a.length;
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && "function" == typeof a.getFullYear;
};
goog.isString = function(a) {
  return "string" == typeof a;
};
goog.isBoolean = function(a) {
  return "boolean" == typeof a;
};
goog.isNumber = function(a) {
  return "number" == typeof a;
};
goog.isFunction = function(a) {
  return "function" == goog.typeOf(a);
};
goog.isObject = function(a) {
  var b = typeof a;
  return "object" == b && null != a || "function" == b;
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(a) {
  return!!a[goog.UID_PROPERTY_];
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_];
  } catch (b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if ("object" == b || "array" == b) {
    if (a.clone) {
      return a.clone();
    }
    var b = "array" == b ? [] : {}, c;
    for (c in a) {
      b[c] = goog.cloneObject(a[c]);
    }
    return b;
  }
  return a;
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments);
};
goog.bindJs_ = function(a, b, c) {
  if (!a) {
    throw Error();
  }
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c);
    };
  }
  return function() {
    return a.apply(b, arguments);
  };
};
goog.bind = function(a, b, c) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
  return goog.bind.apply(null, arguments);
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = c.slice();
    b.push.apply(b, arguments);
    return a.apply(this, b);
  };
};
goog.mixin = function(a, b) {
  for (var c in b) {
    a[c] = b[c];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return+new Date;
};
goog.globalEval = function(a) {
  if (goog.global.execScript) {
    goog.global.execScript(a, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
        goog.global.eval(a);
      } else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = !1;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a;
  }, d = function(a) {
    a = a.split("-");
    for (var b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]));
    }
    return b.join("-");
  }, d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
    return a;
  };
  return b ? a + "-" + d(b) : d(a);
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b;
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
  b && (a = a.replace(/\{\$([^}]+)}/g, function(a, d) {
    return d in b ? b[d] : a;
  }));
  return a;
};
goog.getMsgWithFallback = function(a, b) {
  return a;
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c);
};
goog.exportProperty = function(a, b, c) {
  a[b] = c;
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a;
  a.base = function(a, c, f) {
    var g = Array.prototype.slice.call(arguments, 2);
    return b.prototype[c].apply(a, g);
  };
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !d) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (d.superClass_) {
    return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1));
  }
  for (var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
    if (g.prototype[b] === d) {
      f = !0;
    } else {
      if (f) {
        return g.prototype[b].apply(a, e);
      }
    }
  }
  if (a[b] === d) {
    return a.constructor.prototype[b].apply(a, e);
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  a.call(goog.global);
};
COMPILED || (goog.global.COMPILED = COMPILED);
goog.defineClass = function(a, b) {
  var c = b.constructor, d = b.statics;
  c && c != Object.prototype.constructor || (c = function() {
    throw Error("cannot instantiate an interface (no constructor defined).");
  });
  c = goog.defineClass.createSealingConstructor_(c, a);
  a && goog.inherits(c, a);
  delete b.constructor;
  delete b.statics;
  goog.defineClass.applyProperties_(c.prototype, b);
  null != d && (d instanceof Function ? d(c) : goog.defineClass.applyProperties_(c, d));
  return c;
};
goog.defineClass.SEAL_CLASS_INSTANCES = goog.DEBUG;
goog.defineClass.createSealingConstructor_ = function(a, b) {
  if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
    if (b && b.prototype && b.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]) {
      return a;
    }
    var c = function() {
      var b = a.apply(this, arguments) || this;
      b[goog.UID_PROPERTY_] = b[goog.UID_PROPERTY_];
      this.constructor === c && Object.seal(b);
      return b;
    };
    return c;
  }
  return a;
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.defineClass.applyProperties_ = function(a, b) {
  for (var c in b) {
    Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
  }
  for (var d = 0;d < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;d++) {
    c = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[d], Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
  }
};
goog.tagUnsealableClass = function(a) {
  !COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES && (a.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = !0);
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
goog.debug = {};
goog.debug.Error = function(a) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error);
  } else {
    var b = Error().stack;
    b && (this.stack = b);
  }
  a && (this.message = String(a));
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.dom = {};
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.string = {};
goog.string.DETECT_DOUBLE_ESCAPING = !1;
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0);
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c;
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length));
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length));
};
goog.string.caseInsensitiveEquals = function(a, b) {
  return a.toLowerCase() == b.toLowerCase();
};
goog.string.subs = function(a, b) {
  for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1);e.length && 1 < c.length;) {
    d += c.shift() + e.shift();
  }
  return d + c.join("%s");
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
goog.string.isEmptyOrWhitespace = function(a) {
  return/^[\s\xa0]*$/.test(a);
};
goog.string.isEmptyString = function(a) {
  return 0 == a.length;
};
goog.string.isEmpty = goog.string.isEmptyOrWhitespace;
goog.string.isEmptyOrWhitespaceSafe = function(a) {
  return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(a));
};
goog.string.isEmptySafe = goog.string.isEmptyOrWhitespaceSafe;
goog.string.isBreakingWhitespace = function(a) {
  return!/[^\t\n\r ]/.test(a);
};
goog.string.isAlpha = function(a) {
  return!/[^a-zA-Z]/.test(a);
};
goog.string.isNumeric = function(a) {
  return!/[^0-9]/.test(a);
};
goog.string.isAlphaNumeric = function(a) {
  return!/[^a-zA-Z0-9]/.test(a);
};
goog.string.isSpace = function(a) {
  return " " == a;
};
goog.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a;
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ");
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n");
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ");
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ");
};
goog.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
goog.string.trim = goog.TRUSTED_SITE && String.prototype.trim ? function(a) {
  return a.trim();
} : function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "");
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "");
};
goog.string.caseInsensitiveCompare = function(a, b) {
  var c = String(a).toLowerCase(), d = String(b).toLowerCase();
  return c < d ? -1 : c == d ? 0 : 1;
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
  if (a == b) {
    return 0;
  }
  if (!a) {
    return-1;
  }
  if (!b) {
    return 1;
  }
  for (var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0;f < e;f++) {
    var g = c[f], h = d[f];
    if (g != h) {
      return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1;
    }
  }
  return c.length != d.length ? c.length - d.length : a < b ? -1 : 1;
};
goog.string.urlEncode = function(a) {
  return encodeURIComponent(String(a));
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "));
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>");
};
goog.string.htmlEscape = function(a, b) {
  if (b) {
    a = a.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;"), goog.string.DETECT_DOUBLE_ESCAPING && (a = a.replace(goog.string.E_RE_, "&#101;"));
  } else {
    if (!goog.string.ALL_RE_.test(a)) {
      return a;
    }
    -1 != a.indexOf("&") && (a = a.replace(goog.string.AMP_RE_, "&amp;"));
    -1 != a.indexOf("<") && (a = a.replace(goog.string.LT_RE_, "&lt;"));
    -1 != a.indexOf(">") && (a = a.replace(goog.string.GT_RE_, "&gt;"));
    -1 != a.indexOf('"') && (a = a.replace(goog.string.QUOT_RE_, "&quot;"));
    -1 != a.indexOf("'") && (a = a.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;"));
    -1 != a.indexOf("\x00") && (a = a.replace(goog.string.NULL_RE_, "&#0;"));
    goog.string.DETECT_DOUBLE_ESCAPING && -1 != a.indexOf("e") && (a = a.replace(goog.string.E_RE_, "&#101;"));
  }
  return a;
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a;
};
goog.string.unescapeEntitiesWithDocument = function(a, b) {
  return goog.string.contains(a, "&") ? goog.string.unescapeEntitiesUsingDom_(a, b) : a;
};
goog.string.unescapeEntitiesUsingDom_ = function(a, b) {
  var c = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, d;
  d = b ? b.createElement("div") : goog.global.document.createElement("div");
  return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, b) {
    var g = c[a];
    if (g) {
      return g;
    }
    if ("#" == b.charAt(0)) {
      var h = Number("0" + b.substr(1));
      isNaN(h) || (g = String.fromCharCode(h));
    }
    g || (d.innerHTML = a + " ", g = d.firstChild.nodeValue.slice(0, -1));
    return c[a] = g;
  });
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return'"';
      default:
        if ("#" == c.charAt(0)) {
          var d = Number("0" + c.substr(1));
          if (!isNaN(d)) {
            return String.fromCharCode(d);
          }
        }
        return a;
    }
  });
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b);
};
goog.string.preserveSpaces = function(a) {
  return a.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP);
};
goog.string.stripQuotes = function(a, b) {
  for (var c = b.length, d = 0;d < c;d++) {
    var e = 1 == c ? b : b.charAt(d);
    if (a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1);
    }
  }
  return a;
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a;
};
goog.string.truncateMiddle = function(a, b, c, d) {
  c && (a = goog.string.unescapeEntities(a));
  if (d && a.length > b) {
    d > b && (d = b);
    var e = a.length - d;
    a = a.substring(0, b - d) + "..." + a.substring(e);
  } else {
    a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e));
  }
  c && (a = goog.string.htmlEscape(a));
  return a;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = String(a);
  if (a.quote) {
    return a.quote();
  }
  for (var b = ['"'], c = 0;c < a.length;c++) {
    var d = a.charAt(c), e = d.charCodeAt(0);
    b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d));
  }
  b.push('"');
  return b.join("");
};
goog.string.escapeString = function(a) {
  for (var b = [], c = 0;c < a.length;c++) {
    b[c] = goog.string.escapeChar(a.charAt(c));
  }
  return b.join("");
};
goog.string.escapeChar = function(a) {
  if (a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a];
  }
  if (a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a];
  }
  var b = a, c = a.charCodeAt(0);
  if (31 < c && 127 > c) {
    b = a;
  } else {
    if (256 > c) {
      if (b = "\\x", 16 > c || 256 < c) {
        b += "0";
      }
    } else {
      b = "\\u", 4096 > c && (b += "0");
    }
    b += c.toString(16).toUpperCase();
  }
  return goog.string.jsEscapeCache_[a] = b;
};
goog.string.contains = function(a, b) {
  return-1 != a.indexOf(b);
};
goog.string.caseInsensitiveContains = function(a, b) {
  return goog.string.contains(a.toLowerCase(), b.toLowerCase());
};
goog.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0;
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  0 <= b && b < a.length && 0 < c && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return d;
};
goog.string.remove = function(a, b) {
  var c = new RegExp(goog.string.regExpEscape(b), "");
  return a.replace(c, "");
};
goog.string.removeAll = function(a, b) {
  var c = new RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(c, "");
};
goog.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
goog.string.repeat = function(a, b) {
  return Array(b + 1).join(a);
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : String(a);
  c = a.indexOf(".");
  -1 == c && (c = a.length);
  return goog.string.repeat("0", Math.max(0, b - c)) + a;
};
goog.string.makeSafe = function(a) {
  return null == a ? "" : String(a);
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "");
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36);
};
goog.string.compareVersions = function(a, b) {
  for (var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0;0 == c && g < f;g++) {
    var h = d[g] || "", k = e[g] || "", l = RegExp("(\\d*)(\\D*)", "g"), p = RegExp("(\\d*)(\\D*)", "g");
    do {
      var m = l.exec(h) || ["", "", ""], n = p.exec(k) || ["", "", ""];
      if (0 == m[0].length && 0 == n[0].length) {
        break;
      }
      var c = 0 == m[1].length ? 0 : parseInt(m[1], 10), q = 0 == n[1].length ? 0 : parseInt(n[1], 10), c = goog.string.compareElements_(c, q) || goog.string.compareElements_(0 == m[2].length, 0 == n[2].length) || goog.string.compareElements_(m[2], n[2]);
    } while (0 == c);
  }
  return c;
};
goog.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  for (var b = 0, c = 0;c < a.length;++c) {
    b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_;
  }
  return b;
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && goog.string.isEmpty(a) ? NaN : b;
};
goog.string.isLowerCamelCase = function(a) {
  return/^[a-z]+([A-Z][a-z]*)*$/.test(a);
};
goog.string.isUpperCamelCase = function(a) {
  return/^([A-Z][a-z]*)+$/.test(a);
};
goog.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase();
  });
};
goog.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.string.toTitleCase = function(a, b) {
  var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
  return a.replace(new RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(a, b, c) {
    return b + c.toUpperCase();
  });
};
goog.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN;
};
goog.string.splitLimit = function(a, b, c) {
  a = a.split(b);
  for (var d = [];0 < c && a.length;) {
    d.push(a.shift()), c--;
  }
  a.length && d.push(a.join(b));
  return d;
};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a;
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.DEFAULT_ERROR_HANDLER = function(a) {
  throw a;
};
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
  var e = "Assertion failed";
  if (c) {
    var e = e + (": " + c), f = d
  } else {
    a && (e += ": " + a, f = b);
  }
  a = new goog.asserts.AssertionError("" + e, f || []);
  goog.asserts.errorHandler_(a);
};
goog.asserts.setErrorHandler = function(a) {
  goog.asserts.ENABLE_ASSERTS && (goog.asserts.errorHandler_ = a);
};
goog.asserts.assert = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.fail = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)));
};
goog.asserts.assertNumber = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertString = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertFunction = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertObject = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertArray = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertBoolean = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertElement = function(a, b, c) {
  !goog.asserts.ENABLE_ASSERTS || goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT || goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
  !goog.asserts.ENABLE_ASSERTS || a instanceof b || goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
  return a;
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
  for (var a in Object.prototype) {
    goog.asserts.fail(a + " should not be enumerable in Object.prototype.");
  }
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.ASSUME_NATIVE_FUNCTIONS = !1;
goog.array.peek = function(a) {
  return a[a.length - 1];
};
goog.array.last = goog.array.peek;
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.indexOf) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c);
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if (goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.indexOf(b, c) : -1;
  }
  for (;c < a.length;c++) {
    if (c in a && a[c] === b) {
      return c;
    }
  }
  return-1;
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.lastIndexOf) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c);
} : function(a, b, c) {
  c = null == c ? a.length - 1 : c;
  0 > c && (c = Math.max(0, a.length + c));
  if (goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.lastIndexOf(b, c) : -1;
  }
  for (;0 <= c;c--) {
    if (c in a && a[c] === b) {
      return c;
    }
  }
  return-1;
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.forEach) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a);
  }
};
goog.array.forEachRight = function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;--d) {
    d in e && b.call(c, e[d], d, a);
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.filter) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0;h < d;h++) {
    if (h in g) {
      var k = g[h];
      b.call(c, k, h, a) && (e[f++] = k);
    }
  }
  return e;
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.map) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && (e[g] = b.call(c, f[g], g, a));
  }
  return e;
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduce) ? function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  d && (b = goog.bind(b, d));
  return goog.array.ARRAY_PROTOTYPE_.reduce.call(a, b, c);
} : function(a, b, c, d) {
  var e = c;
  goog.array.forEach(a, function(c, g) {
    e = b.call(d, e, c, g, a);
  });
  return e;
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduceRight) ? function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  d && (b = goog.bind(b, d));
  return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(a, b, c);
} : function(a, b, c, d) {
  var e = c;
  goog.array.forEachRight(a, function(c, g) {
    e = b.call(d, e, c, g, a);
  });
  return e;
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.some) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if (f in e && b.call(c, e[f], f, a)) {
      return!0;
    }
  }
  return!1;
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.every) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if (f in e && !b.call(c, e[f], f, a)) {
      return!1;
    }
  }
  return!0;
};
goog.array.count = function(a, b, c) {
  var d = 0;
  goog.array.forEach(a, function(a, f, g) {
    b.call(c, a, f, g) && ++d;
  }, c);
  return d;
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b];
};
goog.array.findIndex = function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if (f in e && b.call(c, e[f], f, a)) {
      return f;
    }
  }
  return-1;
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b];
};
goog.array.findIndexRight = function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;d--) {
    if (d in e && b.call(c, e[d], d, a)) {
      return d;
    }
  }
  return-1;
};
goog.array.contains = function(a, b) {
  return 0 <= goog.array.indexOf(a, b);
};
goog.array.isEmpty = function(a) {
  return 0 == a.length;
};
goog.array.clear = function(a) {
  if (!goog.isArray(a)) {
    for (var b = a.length - 1;0 <= b;b--) {
      delete a[b];
    }
  }
  a.length = 0;
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b);
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b);
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b);
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d);
};
goog.array.remove = function(a, b) {
  var c = goog.array.indexOf(a, b), d;
  (d = 0 <= c) && goog.array.removeAt(a, c);
  return d;
};
goog.array.removeAt = function(a, b) {
  goog.asserts.assert(null != a.length);
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length;
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1;
};
goog.array.removeAllIf = function(a, b, c) {
  var d = 0;
  goog.array.forEachRight(a, function(e, f) {
    b.call(c, e, f, a) && goog.array.removeAt(a, f) && d++;
  });
  return d;
};
goog.array.concat = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.join = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.toArray = function(a) {
  var b = a.length;
  if (0 < b) {
    for (var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d];
    }
    return c;
  }
  return[];
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(a, b) {
  for (var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if (goog.isArray(d) || (e = goog.isArrayLike(d)) && Object.prototype.hasOwnProperty.call(d, "callee")) {
      a.push.apply(a, d);
    } else {
      if (e) {
        for (var f = a.length, g = d.length, h = 0;h < g;h++) {
          a[f + h] = d[h];
        }
      } else {
        a.push(d);
      }
    }
  }
};
goog.array.splice = function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1));
};
goog.array.slice = function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c);
};
goog.array.removeDuplicates = function(a, b, c) {
  b = b || a;
  var d = function(a) {
    return goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g;
  };
  c = c || d;
  for (var d = {}, e = 0, f = 0;f < a.length;) {
    var g = a[f++], h = c(g);
    Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, b[e++] = g);
  }
  b.length = e;
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b);
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, !0, void 0, c);
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  for (var f = 0, g = a.length, h;f < g;) {
    var k = f + g >> 1, l;
    l = c ? b.call(e, a[k], k, a) : b(d, a[k]);
    0 < l ? f = k + 1 : (g = k, h = !l);
  }
  return h ? f : ~f;
};
goog.array.sort = function(a, b) {
  a.sort(b || goog.array.defaultCompare);
};
goog.array.stableSort = function(a, b) {
  for (var c = 0;c < a.length;c++) {
    a[c] = {index:c, value:a[c]};
  }
  var d = b || goog.array.defaultCompare;
  goog.array.sort(a, function(a, b) {
    return d(a.value, b.value) || a.index - b.index;
  });
  for (c = 0;c < a.length;c++) {
    a[c] = a[c].value;
  }
};
goog.array.sortByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return d(b(a), b(c));
  });
};
goog.array.sortObjectsByKey = function(a, b, c) {
  goog.array.sortByKey(a, function(a) {
    return a[b];
  }, c);
};
goog.array.isSorted = function(a, b, c) {
  b = b || goog.array.defaultCompare;
  for (var d = 1;d < a.length;d++) {
    var e = b(a[d - 1], a[d]);
    if (0 < e || 0 == e && c) {
      return!1;
    }
  }
  return!0;
};
goog.array.equals = function(a, b, c) {
  if (!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return!1;
  }
  var d = a.length;
  c = c || goog.array.defaultCompareEquality;
  for (var e = 0;e < d;e++) {
    if (!c(a[e], b[e])) {
      return!1;
    }
  }
  return!0;
};
goog.array.compare3 = function(a, b, c) {
  c = c || goog.array.defaultCompare;
  for (var d = Math.min(a.length, b.length), e = 0;e < d;e++) {
    var f = c(a[e], b[e]);
    if (0 != f) {
      return f;
    }
  }
  return goog.array.defaultCompare(a.length, b.length);
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b;
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1;
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return 0 <= b ? goog.array.removeAt(a, b) : !1;
};
goog.array.bucket = function(a, b, c) {
  for (var d = {}, e = 0;e < a.length;e++) {
    var f = a[e], g = b.call(c, f, e, a);
    goog.isDef(g) && (d[g] || (d[g] = [])).push(f);
  }
  return d;
};
goog.array.toObject = function(a, b, c) {
  var d = {};
  goog.array.forEach(a, function(e, f) {
    d[b.call(c, e, f, a)] = e;
  });
  return d;
};
goog.array.range = function(a, b, c) {
  var d = [], e = 0, f = a;
  c = c || 1;
  void 0 !== b && (e = a, f = b);
  if (0 > c * (f - e)) {
    return[];
  }
  if (0 < c) {
    for (a = e;a < f;a += c) {
      d.push(a);
    }
  } else {
    for (a = e;a > f;a += c) {
      d.push(a);
    }
  }
  return d;
};
goog.array.repeat = function(a, b) {
  for (var c = [], d = 0;d < b;d++) {
    c[d] = a;
  }
  return c;
};
goog.array.flatten = function(a) {
  for (var b = [], c = 0;c < arguments.length;c++) {
    var d = arguments[c];
    goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d);
  }
  return b;
};
goog.array.rotate = function(a, b) {
  goog.asserts.assert(null != a.length);
  a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
  return a;
};
goog.array.moveItem = function(a, b, c) {
  goog.asserts.assert(0 <= b && b < a.length);
  goog.asserts.assert(0 <= c && c < a.length);
  b = goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1);
  goog.array.ARRAY_PROTOTYPE_.splice.call(a, c, 0, b[0]);
};
goog.array.zip = function(a) {
  if (!arguments.length) {
    return[];
  }
  for (var b = [], c = 0;;c++) {
    for (var d = [], e = 0;e < arguments.length;e++) {
      var f = arguments[e];
      if (c >= f.length) {
        return b;
      }
      d.push(f[c]);
    }
    b.push(d);
  }
};
goog.array.shuffle = function(a, b) {
  for (var c = b || Math.random, d = a.length - 1;0 < d;d--) {
    var e = Math.floor(c() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f;
  }
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
  for (var d in a) {
    b.call(c, a[d], d, a);
  }
};
goog.object.filter = function(a, b, c) {
  var d = {}, e;
  for (e in a) {
    b.call(c, a[e], e, a) && (d[e] = a[e]);
  }
  return d;
};
goog.object.map = function(a, b, c) {
  var d = {}, e;
  for (e in a) {
    d[e] = b.call(c, a[e], e, a);
  }
  return d;
};
goog.object.some = function(a, b, c) {
  for (var d in a) {
    if (b.call(c, a[d], d, a)) {
      return!0;
    }
  }
  return!1;
};
goog.object.every = function(a, b, c) {
  for (var d in a) {
    if (!b.call(c, a[d], d, a)) {
      return!1;
    }
  }
  return!0;
};
goog.object.getCount = function(a) {
  var b = 0, c;
  for (c in a) {
    b++;
  }
  return b;
};
goog.object.getAnyKey = function(a) {
  for (var b in a) {
    return b;
  }
};
goog.object.getAnyValue = function(a) {
  for (var b in a) {
    return a[b];
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b);
};
goog.object.getValues = function(a) {
  var b = [], c = 0, d;
  for (d in a) {
    b[c++] = a[d];
  }
  return b;
};
goog.object.getKeys = function(a) {
  var b = [], c = 0, d;
  for (d in a) {
    b[c++] = d;
  }
  return b;
};
goog.object.getValueByKeys = function(a, b) {
  for (var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1;c < d.length && (a = a[d[c]], goog.isDef(a));c++) {
  }
  return a;
};
goog.object.containsKey = function(a, b) {
  return b in a;
};
goog.object.containsValue = function(a, b) {
  for (var c in a) {
    if (a[c] == b) {
      return!0;
    }
  }
  return!1;
};
goog.object.findKey = function(a, b, c) {
  for (var d in a) {
    if (b.call(c, a[d], d, a)) {
      return d;
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return(b = goog.object.findKey(a, b, c)) && a[b];
};
goog.object.isEmpty = function(a) {
  for (var b in a) {
    return!1;
  }
  return!0;
};
goog.object.clear = function(a) {
  for (var b in a) {
    delete a[b];
  }
};
goog.object.remove = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c;
};
goog.object.add = function(a, b, c) {
  if (b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c);
};
goog.object.get = function(a, b, c) {
  return b in a ? a[b] : c;
};
goog.object.set = function(a, b, c) {
  a[b] = c;
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c;
};
goog.object.equals = function(a, b) {
  if (!goog.array.equals(goog.object.getKeys(a), goog.object.getKeys(b))) {
    return!1;
  }
  for (var c in a) {
    if (a[c] !== b[c]) {
      return!1;
    }
  }
  return!0;
};
goog.object.clone = function(a) {
  var b = {}, c;
  for (c in a) {
    b[c] = a[c];
  }
  return b;
};
goog.object.unsafeClone = function(a) {
  var b = goog.typeOf(a);
  if ("object" == b || "array" == b) {
    if (a.clone) {
      return a.clone();
    }
    var b = "array" == b ? [] : {}, c;
    for (c in a) {
      b[c] = goog.object.unsafeClone(a[c]);
    }
    return b;
  }
  return a;
};
goog.object.transpose = function(a) {
  var b = {}, c;
  for (c in a) {
    b[a[c]] = c;
  }
  return b;
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(a, b) {
  for (var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for (c in d) {
      a[c] = d[c];
    }
    for (var f = 0;f < goog.object.PROTOTYPE_FIELDS_.length;f++) {
      c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
    }
  }
};
goog.object.create = function(a) {
  var b = arguments.length;
  if (1 == b && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0]);
  }
  if (b % 2) {
    throw Error("Uneven number of arguments");
  }
  for (var c = {}, d = 0;d < b;d += 2) {
    c[arguments[d]] = arguments[d + 1];
  }
  return c;
};
goog.object.createSet = function(a) {
  var b = arguments.length;
  if (1 == b && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0]);
  }
  for (var c = {}, d = 0;d < b;d++) {
    c[arguments[d]] = !0;
  }
  return c;
};
goog.object.createImmutableView = function(a) {
  var b = a;
  Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
  return b;
};
goog.object.isImmutableView = function(a) {
  return!!Object.isFrozen && Object.isFrozen(a);
};
var com = {cognitect:{}};
com.cognitect.transducers = {};
var TRANSDUCERS_DEV = !0, TRANSDUCERS_NODE_TARGET = !0, TRANSDUCERS_BROWSER_TARGET = !1, TRANSDUCERS_BROWSER_AMD_TARGET = !1;
com.cognitect.transducers.isString = function(a) {
  return "string" == typeof x;
};
com.cognitect.transducers.isArray = "undefined" != typeof Array.isArray ? function(a) {
  return Array.isArray(a);
} : function(a) {
  return "array" == goog.typeOf(a);
};
com.cognitect.transducers.isObject = function(a) {
  return "object" == goog.typeOf(a);
};
com.cognitect.transducers.isIterable = function(a) {
  return a["@@iterator"] || a.next;
};
com.cognitect.transducers.slice = function(a, b, c) {
  return null == c ? Array.prototype.slice.call(a, b) : Array.prototype.slice.call(a, b, c);
};
com.cognitect.transducers.complement = function(a) {
  return function(b) {
    return!a.apply(null, com.cognitect.transducers.slice(arguments, 0));
  };
};
com.cognitect.transducers.Wrap = function(a) {
  this.stepFn = a;
};
com.cognitect.transducers.Wrap.prototype.init = function() {
  throw Error("init not implemented");
};
com.cognitect.transducers.Wrap.prototype.result = function(a) {
  return a;
};
com.cognitect.transducers.Wrap.prototype.step = function(a, b) {
  return this.stepFn(a, b);
};
com.cognitect.transducers.wrap = function(a) {
  return "function" == typeof a ? new com.cognitect.transducers.Wrap(a) : a;
};
com.cognitect.transducers.Reduced = function(a) {
  this.__transducers_reduced__ = !0;
  this.value = a;
};
com.cognitect.transducers.reduced = function(a) {
  return new com.cognitect.transducers.Reduced(a);
};
com.cognitect.transducers.isReduced = function(a) {
  return a instanceof com.cognitect.transducers.Reduced || a && a.__transducers_reduced__;
};
com.cognitect.transducers.ensureReduced = function(a) {
  return com.cognitect.transducers.isReduced(a) ? a : com.cognitect.transducers.reduced(a);
};
com.cognitect.transducers.deref = function(a) {
  return a.value;
};
com.cognitect.transducers.unreduced = function(a) {
  return com.cognitect.transducers.isReduced(a) ? com.cognitect.transducers.deref(a) : a;
};
com.cognitect.transducers.identity = function(a) {
  return a;
};
com.cognitect.transducers.comp = function(a) {
  var b = arguments.length;
  if (2 == b) {
    var c = arguments[0], d = arguments[1];
    return function(a) {
      return c(d.apply(null, com.cognitect.transducers.slice(arguments, 0)));
    };
  }
  if (2 < b) {
    return com.cognitect.transducers.reduce(com.cognitect.transducers.comp, arguments[0], com.cognitect.transducers.slice(arguments, 1));
  }
  if (TRANSDUCERS_DEV) {
    throw Error("comp must given at least 2 arguments");
  }
};
com.cognitect.transducers.Map = function(a, b) {
  this.f = a;
  this.xf = b;
};
com.cognitect.transducers.Map.prototype.init = function() {
  return this.xf.init();
};
com.cognitect.transducers.Map.prototype.result = function(a) {
  return this.xf.result(a);
};
com.cognitect.transducers.Map.prototype.step = function(a, b) {
  return this.xf.step(a, this.f(b));
};
com.cognitect.transducers.map = function(a) {
  if (TRANSDUCERS_DEV && null == a) {
    throw Error("At least one argument must be supplied to map");
  }
  return function(b) {
    return new com.cognitect.transducers.Map(a, b);
  };
};
com.cognitect.transducers.Filter = function(a, b) {
  this.pred = a;
  this.xf = b;
};
com.cognitect.transducers.Filter.prototype.init = function() {
  return this.xf.init();
};
com.cognitect.transducers.Filter.prototype.result = function(a) {
  return this.xf.result(a);
};
com.cognitect.transducers.Filter.prototype.step = function(a, b) {
  return this.pred(b) ? this.xf.step(a, b) : a;
};
com.cognitect.transducers.filter = function(a) {
  if (TRANSDUCERS_DEV && "function" != typeof a) {
    throw Error("filter must be given a function");
  }
  return function(b) {
    return new com.cognitect.transducers.Filter(a, b);
  };
};
com.cognitect.transducers.remove = function(a) {
  if (TRANSDUCERS_DEV && "function" != typeof a) {
    throw Error("remove must be given a function");
  }
  return com.cognitect.transducers.filter(com.cognitect.transducers.complement(a));
};
com.cognitect.transducers.Take = function(a, b) {
  this.n = a;
  this.xf = b;
};
com.cognitect.transducers.Take.prototype.init = function() {
  return this.xf.init();
};
com.cognitect.transducers.Take.prototype.result = function(a) {
  return this.xf.result(a);
};
com.cognitect.transducers.Take.prototype.step = function(a, b) {
  a = 0 < this.n ? this.xf.step(a, b) : com.cognitect.transducers.ensureReduced(a);
  this.n--;
  return a;
};
com.cognitect.transducers.take = function(a) {
  if (TRANSDUCERS_DEV && "number" != typeof a) {
    throw Error("take must be given an integer");
  }
  return function(b) {
    return new com.cognitect.transducers.Take(a, b);
  };
};
com.cognitect.transducers.TakeWhile = function(a, b) {
  this.pred = a;
  this.xf = b;
};
com.cognitect.transducers.TakeWhile.prototype.init = function() {
  return this.xf.init();
};
com.cognitect.transducers.TakeWhile.prototype.result = function(a) {
  return this.xf.result(a);
};
com.cognitect.transducers.TakeWhile.prototype.step = function(a, b) {
  return this.pred(b) ? this.xf.step(a, b) : com.cognitect.transducers.reduced(a);
};
com.cognitect.transducers.takeWhile = function(a) {
  if (TRANSDUCERS_DEV && "function" != typeof a) {
    throw Error("takeWhile must given a function");
  }
  return function(b) {
    return new com.cognitect.transducers.TakeWhile(a, b);
  };
};
com.cognitect.transducers.TakeNth = function(a, b) {
  this.i = -1;
  this.n = a;
  this.xf = b;
};
com.cognitect.transducers.TakeNth.prototype.init = function() {
  return this.xf.init();
};
com.cognitect.transducers.TakeNth.prototype.result = function(a) {
  return this.xf.result(a);
};
com.cognitect.transducers.TakeNth.prototype.step = function(a, b) {
  this.i++;
  return 0 == this.i % this.n ? this.xf.step(a, b) : a;
};
com.cognitect.transducers.takeNth = function(a) {
  if (TRANSDUCERS_DEV && "number" != typeof a) {
    throw Error("takeNth must be given a number");
  }
  return function(b) {
    return new com.cognitect.transducers.TakeNth(a, b);
  };
};
com.cognitect.transducers.Drop = function(a, b) {
  this.n = a;
  this.xf = b;
};
com.cognitect.transducers.Drop.prototype.init = function() {
  return this.xf.init();
};
com.cognitect.transducers.Drop.prototype.result = function(a) {
  return this.xf.result(a);
};
com.cognitect.transducers.Drop.prototype.step = function(a, b) {
  return 0 < this.n ? (this.n--, a) : this.xf.step(a, b);
};
com.cognitect.transducers.drop = function(a) {
  if (TRANSDUCERS_DEV && "number" !== typeof a) {
    throw Error("drop must be given an integer");
  }
  return function(b) {
    return new com.cognitect.transducers.Drop(a, b);
  };
};
com.cognitect.transducers.DropWhile = function(a, b) {
  this.drop = !0;
  this.pred = a;
  this.xf = b;
};
com.cognitect.transducers.DropWhile.prototype.init = function() {
  return this.xf.init();
};
com.cognitect.transducers.DropWhile.prototype.result = function(a) {
  return this.xf.result(a);
};
com.cognitect.transducers.DropWhile.prototype.step = function(a, b) {
  if (this.drop && this.pred(b)) {
    return a;
  }
  this.drop && (this.drop = !1);
  return this.xf.step(a, b);
};
com.cognitect.transducers.dropWhile = function(a) {
  if (TRANSDUCERS_DEV && "function" != typeof a) {
    throw Error("dropWhile must be given a function");
  }
  return function(b) {
    return new com.cognitect.transducers.DropWhile(a, b);
  };
};
com.cognitect.transducers.NONE = {};
com.cognitect.transducers.PartitionBy = function(a, b) {
  this.f = a;
  this.xf = b;
  this.a = [];
  this.pval = com.cognitect.transducers.NONE;
};
com.cognitect.transducers.PartitionBy.prototype.init = function() {
  return this.xf.init();
};
com.cognitect.transducers.PartitionBy.prototype.result = function(a) {
  0 < this.a.length && (a = com.cognitect.transducers.unreduced(this.xf.step(a, this.a)), this.a = []);
  return this.xf.result(a);
};
com.cognitect.transducers.PartitionBy.prototype.step = function(a, b) {
  var c = this.pval;
  this.pval = val = this.f(b);
  if (c == com.cognitect.transducers.NONE || c == val) {
    return this.a.push(b), a;
  }
  c = this.xf.step(a, this.a);
  this.a = [];
  com.cognitect.transducers.isReduced(c) || this.a.push(b);
  return c;
};
com.cognitect.transducers.partitionBy = function(a) {
  if (TRANSDUCERS_DEV && "function" != typeof a) {
    throw Error("partitionBy must be given an function");
  }
  return function(b) {
    return new com.cognitect.transducers.PartitionBy(a, b);
  };
};
com.cognitect.transducers.PartitionAll = function(a, b) {
  this.n = a;
  this.xf = b;
  this.a = [];
};
com.cognitect.transducers.PartitionAll.prototype.init = function() {
  return this.xf.init();
};
com.cognitect.transducers.PartitionAll.prototype.result = function(a) {
  0 < this.a.length && (a = com.cognitect.transducers.unreduced(this.xf.step(a, this.a)), this.a = []);
  return this.xf.result(a);
};
com.cognitect.transducers.PartitionAll.prototype.step = function(a, b) {
  this.a.push(b);
  if (this.n == this.a.length) {
    var c = this.a;
    this.a = [];
    return this.xf.step(a, c);
  }
  return a;
};
com.cognitect.transducers.partitionAll = function(a) {
  if (TRANSDUCERS_DEV && "number" != typeof a) {
    throw Error("partitionAll must be given a number");
  }
  return function(b) {
    return new com.cognitect.transducers.PartitionAll(a, b);
  };
};
com.cognitect.transducers.Keep = function(a, b) {
  this.f = a;
  this.xf = b;
};
com.cognitect.transducers.Keep.prototype.init = function() {
  return this.xf.init();
};
com.cognitect.transducers.Keep.prototype.result = function(a) {
  return this.xf.result(a);
};
com.cognitect.transducers.Keep.prototype.step = function(a, b) {
  return null == this.f(b) ? a : this.xf.step(a, b);
};
com.cognitect.transducers.keep = function(a) {
  if (TRANSDUCERS_DEV && "function" != typeof a) {
    throw Error("keep must be given a function");
  }
  return function(b) {
    return new com.cognitect.transducers.Keep(a, b);
  };
};
com.cognitect.transducers.KeepIndexed = function(a, b) {
  this.i = -1;
  this.f = a;
  this.xf = b;
};
com.cognitect.transducers.KeepIndexed.prototype.init = function() {
  return this.xf.init();
};
com.cognitect.transducers.KeepIndexed.prototype.result = function(a) {
  return this.xf.result(a);
};
com.cognitect.transducers.KeepIndexed.prototype.step = function(a, b) {
  this.i++;
  return null == this.f(this.i, b) ? a : this.xf.step(a, b);
};
com.cognitect.transducers.keepIndexed = function(a) {
  if (TRANSDUCERS_DEV && "function" != typeof a) {
    throw Error("keepIndexed must be given a function");
  }
  return function(b) {
    return new com.cognitect.transducers.KeepIndexed(a, b);
  };
};
com.cognitect.transducers.preservingReduced = function(a) {
  return{init:function() {
    return a.init();
  }, result:function(a) {
    return a;
  }, step:function(b, c) {
    var d = a.step(b, c);
    return com.cognitect.transducers.isReduced(d) ? com.cognitect.transducers.reduced(d) : d;
  }};
};
com.cognitect.transducers.cat = function(a) {
  var b = com.cognitect.transducers.preservingReduced(a);
  return{init:function() {
    return a.init();
  }, result:function(b) {
    return a.result(b);
  }, step:function(a, d) {
    return com.cognitect.transducers.reduce(b, a, d);
  }};
};
com.cognitect.transducers.mapcat = function(a) {
  return com.cognitect.transducers.comp(com.cognitect.transducers.map(a), com.cognitect.transducers.cat);
};
com.cognitect.transducers.stringReduce = function(a, b, c) {
  for (var d = 0;d < c.length;d++) {
    if (b = a.step(b, c.charAt(d)), com.cognitect.transducers.isReduced(b)) {
      b = com.cognitect.transducers.deref(b);
      break;
    }
  }
  return a.result(b);
};
com.cognitect.transducers.arrayReduce = function(a, b, c) {
  for (var d = 0;d < c.length;d++) {
    if (b = a.step(b, c[d]), com.cognitect.transducers.isReduced(b)) {
      b = com.cognitect.transducers.deref(b);
      break;
    }
  }
  return a.result(b);
};
com.cognitect.transducers.objectReduce = function(a, b, c) {
  for (var d in c) {
    if (c.hasOwnProperty(d) && (b = a.step(b, [d, c[d]]), com.cognitect.transducers.isReduced(b))) {
      b = com.cognitect.transducers.deref(b);
      break;
    }
  }
  return a.result(b);
};
com.cognitect.transducers.iterableReduce = function(a, b, c) {
  c["@@iterator"] && (c = c["@@iterator"]());
  for (var d = c.next();!d.done;) {
    b = a.step(b, d.value);
    if (com.cognitect.transducers.isReduced(b)) {
      b = com.cognitect.transducers.deref(b);
      break;
    }
    d = c.next();
  }
  return a.result(b);
};
com.cognitect.transducers.reduce = function(a, b, c) {
  if (c) {
    a = "function" == typeof a ? com.cognitect.transducers.wrap(a) : a;
    if (com.cognitect.transducers.isString(c)) {
      return com.cognitect.transducers.stringReduce(a, b, c);
    }
    if (com.cognitect.transducers.isArray(c)) {
      return com.cognitect.transducers.arrayReduce(a, b, c);
    }
    if (com.cognitect.transducers.isIterable(c)) {
      return com.cognitect.transducers.iterableReduce(a, b, c);
    }
    if (com.cognitect.transducers.isObject(c)) {
      return com.cognitect.transducers.objectReduce(a, b, c);
    }
    throw Error("Cannot reduce instance of " + c.constructor.name);
  }
};
com.cognitect.transducers.transduce = function(a, b, c, d) {
  b = "function" == typeof b ? com.cognitect.transducers.wrap(b) : b;
  a = a(b);
  return com.cognitect.transducers.reduce(a, c, d);
};
com.cognitect.transducers.stringAppend = function(a, b) {
  return a + b;
};
com.cognitect.transducers.arrayPush = function(a, b) {
  a.push(b);
  return a;
};
com.cognitect.transducers.addEntry = function(a, b) {
  a[b[0]] = b[1];
  return a;
};
com.cognitect.transducers.into = function(a, b, c) {
  if (com.cognitect.transducers.isString(a)) {
    return com.cognitect.transducers.transduce(b, com.cognitect.transducers.stringAppend, a, c);
  }
  if (com.cognitect.transducers.isArray(a)) {
    return com.cognitect.transducers.transduce(b, com.cognitect.transducers.arrayPush, a, c);
  }
  if (com.cognitect.transducers.isObject(a)) {
    return com.cognitect.transducers.transduce(b, com.cognitect.transducers.addEntry, a, c);
  }
};
com.cognitect.transducers.Completing = function(a, b) {
  this.cf = a;
  this.xf = b;
};
com.cognitect.transducers.Completing.prototype.init = function() {
  return this.xf.init();
};
com.cognitect.transducers.Completing.prototype.result = function(a) {
  return this.cf(a);
};
com.cognitect.transducers.Completing.prototype.step = function(a, b) {
  return this.xf.step(a, b);
};
com.cognitect.transducers.completing = function(a, b) {
  a = "function" == typeof a ? com.cognitect.transducers.wrap(a) : a;
  b = b || com.cognitect.transducers.identity;
  if (TRANSDUCERS_DEV && null != a && !com.cognitect.transducers.isObject(a)) {
    throw Error("completing must be given a transducer as first argument");
  }
  return new com.cognitect.transducers.Completing(b, a);
};
com.cognitect.transducers.toFn = function(a, b) {
  "function" == typeof b && (b = com.cognitect.transducers.wrap(b));
  var c = a(b);
  return c.step.bind(c);
};
com.cognitect.transducers.first = com.cognitect.transducers.wrap(function(a, b) {
  return com.cognitect.transducers.reduced(b);
});
TRANSDUCERS_BROWSER_TARGET && (goog.exportSymbol("transducers.reduced", com.cognitect.transducers.reduced), goog.exportSymbol("transducers.isReduced", com.cognitect.transducers.isReduced), goog.exportSymbol("transducers.comp", com.cognitect.transducers.comp), goog.exportSymbol("transducers.complement", com.cognitect.transducers.complement), goog.exportSymbol("transducers.transduce", com.cognitect.transducers.transduce), goog.exportSymbol("transducers.reduce", com.cognitect.transducers.reduce), goog.exportSymbol("transducers.map", 
com.cognitect.transducers.map), goog.exportSymbol("transducers.Map", com.cognitect.transducers.Map), goog.exportSymbol("transducers.filter", com.cognitect.transducers.filter), goog.exportSymbol("transducers.Filter", com.cognitect.transducers.Filter), goog.exportSymbol("transducers.remove", com.cognitect.transducers.remove), goog.exportSymbol("transducers.Remove", com.cognitect.transducers.Remove), goog.exportSymbol("transducers.keep", com.cognitect.transducers.keep), goog.exportSymbol("transducers.Keep", 
com.cognitect.transducers.Keep), goog.exportSymbol("transducers.keepIndexed", com.cognitect.transducers.keepIndexed), goog.exportSymbol("transducers.KeepIndexed", com.cognitect.transducers.KeepIndexed), goog.exportSymbol("transducers.take", com.cognitect.transducers.take), goog.exportSymbol("transducers.Take", com.cognitect.transducers.Take), goog.exportSymbol("transducers.takeWhile", com.cognitect.transducers.takeWhile), goog.exportSymbol("transducers.TakeWhile", com.cognitect.transducers.TakeWhile), 
goog.exportSymbol("transducers.takeNth", com.cognitect.transducers.takeNth), goog.exportSymbol("transducers.TakeNth", com.cognitect.transducers.TakeNth), goog.exportSymbol("transducers.drop", com.cognitect.transducers.drop), goog.exportSymbol("transducers.Drop", com.cognitect.transducers.Drop), goog.exportSymbol("transducers.dropWhile", com.cognitect.transducers.dropWhile), goog.exportSymbol("transducers.DropWhile", com.cognitect.transducers.DropWhile), goog.exportSymbol("transducers.partitionBy", 
com.cognitect.transducers.partitionBy), goog.exportSymbol("transducers.PartitionBy", com.cognitect.transducers.PartitionBy), goog.exportSymbol("transducers.partitionAll", com.cognitect.transducers.partitionAll), goog.exportSymbol("transducers.PartitionAll", com.cognitect.transducers.PartitionAll), goog.exportSymbol("transducers.completing", com.cognitect.transducers.completing), goog.exportSymbol("transducers.Completing", com.cognitect.transducers.Completing), goog.exportSymbol("transducers.wrap", 
com.cognitect.transducers.wrap), goog.exportSymbol("transducers.Wrap", com.cognitect.transducers.Wrap), goog.exportSymbol("transducers.cat", com.cognitect.transducers.cat), goog.exportSymbol("transducers.mapcat", com.cognitect.transducers.mapcat), goog.exportSymbol("transducers.into", com.cognitect.transducers.into), goog.exportSymbol("transducers.toFn", com.cognitect.transducers.toFn), goog.exportSymbol("transducers.first", com.cognitect.transducers.first), goog.exportSymbol("transducers.ensureReduced", 
com.cognitect.transducers.first), goog.exportSymbol("transducers.unreduced", com.cognitect.transducers.first), goog.exportSymbol("transducers.deref", com.cognitect.transducers.deref));
TRANSDUCERS_NODE_TARGET && (module.exports = {reduced:com.cognitect.transducers.reduced, isReduced:com.cognitect.transducers.isReduced, comp:com.cognitect.transducers.comp, complement:com.cognitect.transducers.complement, map:com.cognitect.transducers.map, Map:com.cognitect.transducers.Map, filter:com.cognitect.transducers.filter, Filter:com.cognitect.transducers.Filter, remove:com.cognitect.transducers.remove, Remove:com.cognitect.transducers.Remove, keep:com.cognitect.transducers.keep, Kemove:com.cognitect.transducers.Keep, 
keepIndexed:com.cognitect.transducers.keepIndexed, KeepIndexed:com.cognitect.transducers.KeepIndexed, take:com.cognitect.transducers.take, Take:com.cognitect.transducers.Take, takeWhile:com.cognitect.transducers.takeWhile, TakeWhile:com.cognitect.transducers.TakeWhile, takeNth:com.cognitect.transducers.takeNth, TakeNth:com.cognitect.transducers.TakeNth, drop:com.cognitect.transducers.drop, Drop:com.cognitect.transducers.Drop, dropWhile:com.cognitect.transducers.dropWhile, DropWhile:com.cognitect.transducers.DropWhile, 
partitionBy:com.cognitect.transducers.partitionBy, PartitionBy:com.cognitect.transducers.PartitionBy, partitionAll:com.cognitect.transducers.partitionAll, PartitionAll:com.cognitect.transducers.PartitionAll, completing:com.cognitect.transducers.completing, Completing:com.cognitect.transducers.Completing, wrap:com.cognitect.transducers.wrap, Wrap:com.cognitect.transducers.Wrap, cat:com.cognitect.transducers.cat, mapcat:com.cognitect.transducers.mapcat, transduce:com.cognitect.transducers.transduce, 
reduce:com.cognitect.transducers.reduce, into:com.cognitect.transducers.into, toFn:com.cognitect.transducers.toFn, first:com.cognitect.transducers.first, ensureReduced:com.cognitect.transducers.ensureReduced, unreduced:com.cognitect.transducers.unreduced, deref:com.cognitect.transducers.deref});


},{}],33:[function(require,module,exports){

// basic protocol helpers

var symbolExists = typeof Symbol !== 'undefined';

var protocols = {
  iterator: symbolExists ? Symbol.iterator : '@@iterator',
  transformer: symbolExists ? Symbol('transformer') : '@@transformer'
};

function throwProtocolError(name, coll) {
  throw new Error("don't know how to " + name + " collection: " +
                  coll);
}

function fulfillsProtocol(obj, name) {
  if(name === 'iterator') {
    // Accept ill-formed iterators that don't conform to the
    // protocol by accepting just next()
    return obj[protocols.iterator] || obj.next;
  }

  return obj[protocols[name]];
}

function getProtocolProperty(obj, name) {
  return obj[protocols[name]];
}

function iterator(coll) {
  var iter = getProtocolProperty(coll, 'iterator');
  if(iter) {
    return iter.call(coll);
  }
  else if(coll.next) {
    // Basic duck typing to accept an ill-formed iterator that doesn't
    // conform to the iterator protocol (all iterators should have the
    // @@iterator method and return themselves, but some engines don't
    // have that on generators like older v8)
    return coll;
  }
  else if(isArray(coll)) {
    return new ArrayIterator(coll);
  }
  else if(isObject(coll)) {
    return new ObjectIterator(coll);
  }
}

function ArrayIterator(arr) {
  this.arr = arr;
  this.index = 0;
}

ArrayIterator.prototype.next = function() {
  if(this.index < this.arr.length) {
    return {
      value: this.arr[this.index++],
      done: false
    };
  }
  return {
    done: true
  }
};

function ObjectIterator(obj) {
  this.obj = obj;
  this.keys = Object.keys(obj);
  this.index = 0;
}

ObjectIterator.prototype.next = function() {
  if(this.index < this.keys.length) {
    var k = this.keys[this.index++];
    return {
      value: [k, this.obj[k]],
      done: false
    };
  }
  return {
    done: true
  }
};

// helpers

var toString = Object.prototype.toString;
var isArray = typeof Array.isArray === 'function' ? Array.isArray : function(obj) {
  return toString.call(obj) == '[object Array]';
};

function isFunction(x) {
  return typeof x === 'function';
}

function isObject(x) {
  return x instanceof Object &&
    Object.getPrototypeOf(x) === Object.getPrototypeOf({});
}

function isNumber(x) {
  return typeof x === 'number';
}

function Reduced(value) {
  this.__transducers_reduced__ = true;
  this.value = value;
}

function isReduced(x) {
  return (x instanceof Reduced) || (x && x.__transducers_reduced__);
}

function deref(x) {
  return x.value;
}

/**
 * This is for transforms that may call their nested transforms before
 * Reduced-wrapping the result (e.g. "take"), to avoid nested Reduced.
 */
function ensureReduced(val) {
  if(isReduced(val)) {
    return val;
  } else {
    return new Reduced(val);
  }
}

/**
 * This is for tranforms that call their nested transforms when
 * performing completion (like "partition"), to avoid signaling
 * termination after already completing.
 */
function ensureUnreduced(v) {
  if(isReduced(v)) {
    return deref(v);
  } else {
    return v;
  }
}

function reduce(coll, xform, init) {
  if(isArray(coll)) {
    var result = init;
    var index = -1;
    var len = coll.length;
    while(++index < len) {
      result = xform.step(result, coll[index]);
      if(isReduced(result)) {
        result = deref(result);
        break;
      }
    }
    return xform.result(result);
  }
  else if(isObject(coll) || fulfillsProtocol(coll, 'iterator')) {
    var result = init;
    var iter = iterator(coll);
    var val = iter.next();
    while(!val.done) {
      result = xform.step(result, val.value);
      if(isReduced(result)) {
        result = deref(result);
        break;
      }
      val = iter.next();
    }
    return xform.result(result);
  }
  throwProtocolError('iterate', coll);
}

function transduce(coll, xform, reducer, init) {
  xform = xform(reducer);
  if(init === undefined) {
    init = xform.init();
  }
  return reduce(coll, xform, init);
}

function compose() {
  var funcs = Array.prototype.slice.call(arguments);
  return function(r) {
    var value = r;
    for(var i=funcs.length-1; i>=0; i--) {
      value = funcs[i](value);
    }
    return value;
  }
}

// transformations

function transformer(f) {
  return {
    init: function() {
      throw new Error('init value unavailable');
    },
    result: function(v) {
      return v;
    },
    step: f
  };
}

function bound(f, ctx, count) {
  count = count != null ? count : 1;

  if(!ctx) {
    return f;
  }
  else {
    switch(count) {
    case 1:
      return function(x) {
        return f.call(ctx, x);
      }
    case 2:
      return function(x, y) {
        return f.call(ctx, x, y);
      }
    default:
      return f.bind(ctx);
    }
  }
}

function arrayMap(arr, f, ctx) {
  var index = -1;
  var length = arr.length;
  var result = Array(length);
  f = bound(f, ctx, 2);

  while (++index < length) {
    result[index] = f(arr[index], index);
  }
  return result;
}

function arrayFilter(arr, f, ctx) {
  var len = arr.length;
  var result = [];
  f = bound(f, ctx, 2);

  for(var i=0; i<len; i++) {
    if(f(arr[i], i)) {
      result.push(arr[i]);
    }
  }
  return result;
}

function Map(f, xform) {
  this.xform = xform;
  this.f = f;
}

Map.prototype.init = function() {
  return this.xform.init();
};

Map.prototype.result = function(v) {
  return this.xform.result(v);
};

Map.prototype.step = function(res, input) {
  return this.xform.step(res, this.f(input));
};

function map(coll, f, ctx) {
  if(isFunction(coll)) { ctx = f; f = coll; coll = null; }
  f = bound(f, ctx);

  if(coll) {
    if(isArray(coll)) {
      return arrayMap(coll, f, ctx);
    }
    return seq(coll, map(f));
  }

  return function(xform) {
    return new Map(f, xform);
  }
}

function Filter(f, xform) {
  this.xform = xform;
  this.f = f;
}

Filter.prototype.init = function() {
  return this.xform.init();
};

Filter.prototype.result = function(v) {
  return this.xform.result(v);
};

Filter.prototype.step = function(res, input) {
  if(this.f(input)) {
    return this.xform.step(res, input);
  }
  return res;
};

function filter(coll, f, ctx) {
  if(isFunction(coll)) { ctx = f; f = coll; coll = null; }
  f = bound(f, ctx);

  if(coll) {
    if(isArray(coll)) {
      return arrayFilter(coll, f, ctx);
    }
    return seq(coll, filter(f));
  }

  return function(xform) {
    return new Filter(f, xform);
  };
}

function remove(coll, f, ctx) {
  if(isFunction(coll)) { ctx = f; f = coll; coll = null; }
  f = bound(f, ctx);
  return filter(coll, function(x) { return !f(x); });
}

function keep(coll) {
  return filter(coll, function(x) { return x != null });
}

function Dedupe(xform) {
  this.xform = xform;
  this.last = undefined;
}

Dedupe.prototype.init = function() {
  return this.xform.init();
};

Dedupe.prototype.result = function(v) {
  return this.xform.result(v);
};

Dedupe.prototype.step = function(result, input) {
  if(input !== this.last) {
    this.last = input;
    return this.xform.step(result, input);
  }
  return result;
};

function dedupe(coll) {
  if(coll) {
    return seq(coll, dedupe());
  }

  return function(xform) {
    return new Dedupe(xform);
  }
}

function TakeWhile(f, xform) {
  this.xform = xform;
  this.f = f;
}

TakeWhile.prototype.init = function() {
  return this.xform.init();
};

TakeWhile.prototype.result = function(v) {
  return this.xform.result(v);
};

TakeWhile.prototype.step = function(result, input) {
  if(this.f(input)) {
    return this.xform.step(result, input);
  }
  return new Reduced(result);
};

function takeWhile(coll, f, ctx) {
  if(isFunction(coll)) { ctx = f; f = coll; coll = null; }
  f = bound(f, ctx);

  if(coll) {
    return seq(coll, takeWhile(f));
  }

  return function(xform) {
    return new TakeWhile(f, xform);
  }
}

function Take(n, xform) {
  this.n = n;
  this.i = 0;
  this.xform = xform;
}

Take.prototype.init = function() {
  return this.xform.init();
};

Take.prototype.result = function(v) {
  return this.xform.result(v);
};

Take.prototype.step = function(result, input) {
  if (this.i < this.n) {
    result = this.xform.step(result, input);
    if(this.i + 1 >= this.n) {
      // Finish reducing on the same step as the final value. TODO:
      // double-check that this doesn't break any semantics
      result = ensureReduced(result);
    }
  }
  this.i++;
  return result;
};

function take(coll, n) {
  if(isNumber(coll)) { n = coll; coll = null }

  if(coll) {
    return seq(coll, take(n));
  }

  return function(xform) {
    return new Take(n, xform);
  }
}

function Drop(n, xform) {
  this.n = n;
  this.i = 0;
  this.xform = xform;
}

Drop.prototype.init = function() {
  return this.xform.init();
};

Drop.prototype.result = function(v) {
  return this.xform.result(v);
};

Drop.prototype.step = function(result, input) {
  if(this.i++ < this.n) {
    return result;
  }
  return this.xform.step(result, input);
};

function drop(coll, n) {
  if(isNumber(coll)) { n = coll; coll = null }

  if(coll) {
    return seq(coll, drop(n));
  }

  return function(xform) {
    return new Drop(n, xform);
  }
}

function DropWhile(f, xform) {
  this.xform = xform;
  this.f = f;
  this.dropping = true;
}

DropWhile.prototype.init = function() {
  return this.xform.init();
};

DropWhile.prototype.result = function(v) {
  return this.xform.result(v);
};

DropWhile.prototype.step = function(result, input) {
  if(this.dropping) {
    if(this.f(input)) {
      return result;
    }
    else {
      this.dropping = false;
    }
  }
  return this.xform.step(result, input);
};

function dropWhile(coll, f, ctx) {
  if(isFunction(coll)) { ctx = f; f = coll; coll = null; }
  f = bound(f, ctx);

  if(coll) {
    return seq(coll, dropWhile(f));
  }

  return function(xform) {
    return new DropWhile(f, xform);
  }
}

function Partition(n, xform) {
  this.n = n;
  this.i = 0;
  this.xform = xform;
  this.part = new Array(n);
}

Partition.prototype.init = function() {
  return this.xform.init();
};

Partition.prototype.result = function(v) {
  if (this.i > 0) {
    return ensureUnreduced(this.xform.step(v, this.part.slice(0, this.i)));
  }
  return this.xform.result(v);
};

Partition.prototype.step = function(result, input) {
  this.part[this.i] = input;
  this.i += 1;
  if (this.i === this.n) {
    var out = this.part.slice(0, this.n);
    this.part = new Array(this.n);
    this.i = 0;
    return this.xform.step(result, out);
  }
  return result;
};

function partition(coll, n) {
  if (isNumber(coll)) {
    n = coll; coll = null;
  }

  if (coll) {
    return seq(coll, partition(n));
  }

  return function(xform) {
    return new Partition(n, xform);
  };
}

var NOTHING = {};

function PartitionBy(f, xform) {
  // TODO: take an "opts" object that allows the user to specify
  // equality
  this.f = f;
  this.xform = xform;
  this.part = [];
  this.last = NOTHING;
}

PartitionBy.prototype.init = function() {
  return this.xform.init();
};

PartitionBy.prototype.result = function(v) {
  var l = this.part.length;
  if (l > 0) {
    return ensureUnreduced(this.xform.step(v, this.part.slice(0, l)));
  }
  return this.xform.result(v);
};

PartitionBy.prototype.step = function(result, input) {
  var current = this.f(input);
  if (current === this.last || this.last === NOTHING) {
    this.part.push(input);
  } else {
    result = this.xform.step(result, this.part);
    this.part = [input];
  }
  this.last = current;
  return result;
};

function partitionBy(coll, f, ctx) {
  if (isFunction(coll)) { ctx = f; f = coll; coll = null; }
  f = bound(f, ctx);

  if (coll) {
    return seq(coll, partitionBy(f));
  }

  return function(xform) {
    return new PartitionBy(f, xform);
  };
}

// pure transducers (cannot take collections)

function Cat(xform) {
  this.xform = xform;
}

Cat.prototype.init = function() {
  return this.xform.init();
};

Cat.prototype.result = function(v) {
  return this.xform.result(v);
};

Cat.prototype.step = function(result, input) {
  var xform = this.xform;
  var newxform = {
    init: function() {
      return xform.init();
    },
    result: function(v) {
      return v;
    },
    step: function(result, input) {
      var val = xform.step(result, input);
      return isReduced(val) ? deref(val) : val;
    }
  }

  return reduce(input, newxform, result);
};

function cat(xform) {
  return new Cat(xform);
}

function mapcat(f, ctx) {
  f = bound(f, ctx);
  return compose(map(f), cat);
}

// collection helpers

function push(arr, x) {
  arr.push(x);
  return arr;
}

function merge(obj, x) {
  if(isArray(x) && x.length === 2) {
    obj[x[0]] = x[1];
  }
  else {
    var keys = Object.keys(x);
    var len = keys.length;
    for(var i=0; i<len; i++) {
      obj[keys[i]] = x[keys[i]];
    }
  }
  return obj;
}

var arrayReducer = {
  init: function() {
    return [];
  },
  result: function(v) {
    return v;
  },
  step: push
}

var objReducer = {
  init: function() {
    return {};
  },
  result: function(v) {
    return v;
  },
  step: merge
};

function getReducer(coll) {
  if(isArray(coll)) {
    return arrayReducer;
  }
  else if(isObject(coll)) {
    return objReducer;
  }
  else if(fulfillsProtocol(coll, 'transformer')) {
    return getProtocolProperty(coll, 'transformer');
  }
  throwProtocolError('getReducer', coll);
}

// building new collections

function toArray(coll, xform) {
  if(!xform) {
    return reduce(coll, arrayReducer, []);
  }
  return transduce(coll, xform, arrayReducer, []);
}

function toObj(coll, xform) {
  if(!xform) {
    return reduce(coll, objReducer, {});
  }
  return transduce(coll, xform, objReducer, {});
}

function toIter(coll, xform) {
  if(!xform) {
    return iterator(coll);
  }
  return new LazyTransformer(xform, coll);
}

function seq(coll, xform) {
  if(isArray(coll)) {
    return transduce(coll, xform, arrayReducer, []);
  }
  else if(isObject(coll)) {
    return transduce(coll, xform, objReducer, {});
  }
  else if(fulfillsProtocol(coll, 'transformer')) {
    var transformer = getProtocolProperty(coll, 'transformer');
    return transduce(coll, xform, transformer, transformer.init());
  }
  else if(fulfillsProtocol(coll, 'iterator')) {
    return new LazyTransformer(xform, coll);
  }
  throwProtocolError('sequence', coll);
}

function into(to, xform, from) {
  if(isArray(to)) {
    return transduce(from, xform, arrayReducer, to);
  }
  else if(isObject(to)) {
    return transduce(from, xform, objReducer, to);
  }
  else if(fulfillsProtocol(to, 'transformer')) {
    return transduce(from,
                     xform,
                     getProtocolProperty(to, 'transformer'),
                     to);
  }
  throwProtocolError('into', to);
}

// laziness

var stepper = {
  result: function(v) {
    return isReduced(v) ? deref(v) : v;
  },
  step: function(lt, x) {
    lt.items.push(x);
    return lt.rest;
  }
}

function Stepper(xform, iter) {
  this.xform = xform(stepper);
  this.iter = iter;
}

Stepper.prototype.step = function(lt) {
  var len = lt.items.length;
  while(lt.items.length === len) {
    var n = this.iter.next();
    if(n.done || isReduced(n.value)) {
      // finalize
      this.xform.result(this);
      break;
    }

    // step
    this.xform.step(lt, n.value);
  }
}

function LazyTransformer(xform, coll) {
  this.iter = iterator(coll);
  this.items = [];
  this.stepper = new Stepper(xform, iterator(coll));
}

LazyTransformer.prototype[protocols.iterator] = function() {
  return this;
}

LazyTransformer.prototype.next = function() {
  this.step();

  if(this.items.length) {
    return {
      value: this.items.pop(),
      done: false
    }
  }
  else {
    return { done: true };
  }
};

LazyTransformer.prototype.step = function() {
  if(!this.items.length) {
    this.stepper.step(this);
  }
}

// util

function range(n) {
  var arr = new Array(n);
  for(var i=0; i<arr.length; i++) {
    arr[i] = i;
  }
  return arr;
}


module.exports = {
  reduce: reduce,
  transformer: transformer,
  Reduced: Reduced,
  iterator: iterator,
  push: push,
  merge: merge,
  transduce: transduce,
  seq: seq,
  toArray: toArray,
  toObj: toObj,
  toIter: toIter,
  into: into,
  compose: compose,
  map: map,
  filter: filter,
  remove: remove,
  cat: cat,
  mapcat: mapcat,
  keep: keep,
  dedupe: dedupe,
  take: take,
  takeWhile: takeWhile,
  drop: drop,
  dropWhile: dropWhile,
  partition: partition,
  partitionBy: partitionBy,
  range: range,

  protocols: protocols,
  LazyTransformer: LazyTransformer
};

},{}],34:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('bus', function() {
  it('should return stream', function() {
    return expect(Kefir.bus()).toBeStream();
  });
  it('should not be ended', function() {
    return expect(Kefir.bus()).toEmit([]);
  });
  it('should emit values and end', function() {
    var a;
    a = Kefir.bus();
    return expect(a).toEmit([1, 2, 3, '<end>'], function() {
      a.emit(1);
      a.emit(2);
      a.emit(3);
      return a.end();
    });
  });
  it('should return stream', function() {
    return expect(Kefir.bus()).toBeStream();
  });
  it('should activate sources', function() {
    var a, b, bus, c;
    a = stream();
    b = prop();
    c = stream();
    bus = Kefir.bus().plug(a).plug(b).plug(c);
    expect(bus).toActivate(a, b, c);
    bus.unplug(b);
    expect(bus).toActivate(a, c);
    return expect(bus).not.toActivate(b);
  });
  it('should deliver events from observables', function() {
    var a, b, bus, c;
    a = stream();
    b = send(prop(), [0]);
    c = stream();
    bus = Kefir.bus().plug(a).plug(b).plug(c);
    return expect(bus).toEmit([
      {
        current: 0
      }, 1, 2, 3, 4, 5, 6
    ], function() {
      send(a, [1]);
      send(b, [2]);
      send(c, [3]);
      send(a, ['<end>']);
      send(b, [4, '<end>']);
      return send(c, [5, 6, '<end>']);
    });
  });
  it('should deliver currents from all source properties, but only to first subscriber on each activation', function() {
    var a, b, bus, c;
    a = send(prop(), [0]);
    b = send(prop(), [1]);
    c = send(prop(), [2]);
    bus = Kefir.bus().plug(a).plug(b).plug(c);
    expect(bus).toEmit([
      {
        current: 0
      }, {
        current: 1
      }, {
        current: 2
      }
    ]);
    bus = Kefir.bus().plug(a).plug(b).plug(c);
    activate(bus);
    expect(bus).toEmit([]);
    bus = Kefir.bus().plug(a).plug(b).plug(c);
    activate(bus);
    deactivate(bus);
    return expect(bus).toEmit([
      {
        current: 0
      }, {
        current: 1
      }, {
        current: 2
      }
    ]);
  });
  it('should not deliver events from removed sources', function() {
    var a, b, bus, c;
    a = stream();
    b = send(prop(), [0]);
    c = stream();
    bus = Kefir.bus().plug(a).plug(b).plug(c).unplug(b);
    return expect(bus).toEmit([1, 3, 5, 6], function() {
      send(a, [1]);
      send(b, [2]);
      send(c, [3]);
      send(a, ['<end>']);
      send(b, [4, '<end>']);
      return send(c, [5, 6, '<end>']);
    });
  });
  it('should correctly handle current values of new sub sources', function() {
    var b, bus, c;
    bus = Kefir.bus();
    b = send(prop(), [1]);
    c = send(prop(), [2]);
    return expect(bus).toEmit([1, 2], function() {
      bus.plug(b);
      return bus.plug(c);
    });
  });
  return it('should deactivate sources on end', function() {
    var a, b, bus, c, obs, _i, _j, _len, _len1, _ref1, _ref2, _results;
    a = stream();
    b = prop();
    c = stream();
    bus = Kefir.bus().plug(a).plug(b).plug(c);
    bus.onEnd(function() {});
    _ref1 = [a, b, c];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      obs = _ref1[_i];
      expect(obs).toBeActive();
    }
    bus.end();
    _ref2 = [a, b, c];
    _results = [];
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      obs = _ref2[_j];
      _results.push(expect(obs).not.toBeActive());
    }
    return _results;
  });
});



},{"../test-helpers.coffee":88}],35:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('changes', function() {
  describe('stream', function() {
    return it('should not have .changes method', function() {
      return expect(stream().changes).toBe(void 0);
    });
  });
  return describe('property', function() {
    it('should return stream', function() {
      return expect(prop().changes()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.changes()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).changes()).toEmit(['<end:current>']);
    });
    return it('should handle events and current', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.changes()).toEmit([2, 3, '<end>'], function() {
        return send(a, [2, 3, '<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],36:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref,
  __slice = [].slice;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('combine', function() {
  it('should return stream', function() {
    expect(Kefir.combine([])).toBeStream();
    expect(Kefir.combine([stream(), prop()])).toBeStream();
    expect(stream().combine(stream())).toBeStream();
    return expect(prop().combine(prop())).toBeStream();
  });
  it('should be ended if empty array provided', function() {
    return expect(Kefir.combine([])).toEmit(['<end:current>']);
  });
  it('should be ended if array of ended observables provided', function() {
    var a, b, c;
    a = send(stream(), ['<end>']);
    b = send(prop(), ['<end>']);
    c = send(stream(), ['<end>']);
    expect(Kefir.combine([a, b, c])).toEmit(['<end:current>']);
    return expect(a.combine(b)).toEmit(['<end:current>']);
  });
  it('should be ended and has current if array of ended properties provided and each of them has current', function() {
    var a, b, c;
    a = send(prop(), [1, '<end>']);
    b = send(prop(), [2, '<end>']);
    c = send(prop(), [3, '<end>']);
    expect(Kefir.combine([a, b, c])).toEmit([
      {
        current: [1, 2, 3]
      }, '<end:current>'
    ]);
    return expect(a.combine(b)).toEmit([
      {
        current: [1, 2]
      }, '<end:current>'
    ]);
  });
  it('should activate sources', function() {
    var a, b, c;
    a = stream();
    b = prop();
    c = stream();
    expect(Kefir.combine([a, b, c])).toActivate(a, b, c);
    return expect(a.combine(b)).toActivate(a, b);
  });
  it('should handle events and current from observables', function() {
    var a, b, c;
    a = stream();
    b = send(prop(), [0]);
    c = stream();
    expect(Kefir.combine([a, b, c])).toEmit([[1, 0, 2], [1, 3, 2], [1, 4, 2], [1, 4, 5], [1, 4, 6], '<end>'], function() {
      send(a, [1]);
      send(c, [2]);
      send(b, [3]);
      send(a, ['<end>']);
      send(b, [4, '<end>']);
      return send(c, [5, 6, '<end>']);
    });
    a = stream();
    b = send(prop(), [0]);
    return expect(a.combine(b)).toEmit([[1, 0], [1, 2], [1, 3], '<end>'], function() {
      send(a, [1]);
      send(b, [2]);
      send(a, ['<end>']);
      return send(b, [3, '<end>']);
    });
  });
  it('should accept optional combinator function', function() {
    var a, b, c, join;
    a = stream();
    b = send(prop(), [0]);
    c = stream();
    join = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return args.join('+');
    };
    expect(Kefir.combine([a, b, c], join)).toEmit(['1+0+2', '1+3+2', '1+4+2', '1+4+5', '1+4+6', '<end>'], function() {
      send(a, [1]);
      send(c, [2]);
      send(b, [3]);
      send(a, ['<end>']);
      send(b, [4, '<end>']);
      return send(c, [5, 6, '<end>']);
    });
    a = stream();
    b = send(prop(), [0]);
    return expect(a.combine(b, join)).toEmit(['1+0', '1+2', '1+3', '<end>'], function() {
      send(a, [1]);
      send(b, [2]);
      send(a, ['<end>']);
      return send(b, [3, '<end>']);
    });
  });
  return it('when activating second time and has 2+ properties in sources, should emit current value at most once', function() {
    var a, b, cb;
    a = send(prop(), [0]);
    b = send(prop(), [1]);
    cb = Kefir.combine([a, b]);
    activate(cb);
    deactivate(cb);
    return expect(cb).toEmit([
      {
        current: [0, 1]
      }
    ]);
  });
});



},{"../test-helpers.coffee":88}],37:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('concat', function() {
  it('should return stream', function() {
    expect(Kefir.concat([])).toBeStream();
    expect(Kefir.concat([stream(), prop()])).toBeStream();
    expect(stream().concat(stream())).toBeStream();
    return expect(prop().concat(prop())).toBeStream();
  });
  it('should be ended if empty array provided', function() {
    return expect(Kefir.concat([])).toEmit(['<end:current>']);
  });
  it('should be ended if array of ended observables provided', function() {
    var a, b, c;
    a = send(stream(), ['<end>']);
    b = send(prop(), ['<end>']);
    c = send(stream(), ['<end>']);
    expect(Kefir.concat([a, b, c])).toEmit(['<end:current>']);
    return expect(a.concat(b)).toEmit(['<end:current>']);
  });
  it('should activate only current source', function() {
    var a, b, c;
    a = stream();
    b = prop();
    c = stream();
    expect(Kefir.concat([a, b, c])).toActivate(a);
    expect(Kefir.concat([a, b, c])).not.toActivate(b, c);
    expect(a.concat(b)).toActivate(a);
    expect(a.concat(b)).not.toActivate(b);
    send(a, ['<end>']);
    expect(Kefir.concat([a, b, c])).toActivate(b);
    expect(Kefir.concat([a, b, c])).not.toActivate(a, c);
    expect(a.concat(b)).toActivate(b);
    return expect(a.concat(b)).not.toActivate(a);
  });
  it('should deliver events from observables, then end when all of them end', function() {
    var a, b, c;
    a = send(prop(), [0]);
    b = prop();
    c = stream();
    expect(Kefir.concat([a, b, c])).toEmit([
      {
        current: 0
      }, 1, 4, 2, 5, 7, 8, '<end>'
    ], function() {
      send(a, [1]);
      send(b, [2]);
      send(c, [3]);
      send(a, [4, '<end>']);
      send(b, [5]);
      send(c, [6]);
      send(b, ['<end>']);
      return send(c, [7, 8, '<end>']);
    });
    a = send(prop(), [0]);
    b = stream();
    return expect(a.concat(b)).toEmit([
      {
        current: 0
      }, 1, 3, 4, '<end>'
    ], function() {
      send(a, [1]);
      send(b, [2]);
      send(a, ['<end>']);
      return send(b, [3, 4, '<end>']);
    });
  });
  it('should deliver current from current source, but only to first subscriber on each activation', function() {
    var a, b, c, concat;
    a = send(prop(), [0]);
    b = send(prop(), [1]);
    c = stream();
    concat = Kefir.concat([a, b, c]);
    expect(concat).toEmit([
      {
        current: 0
      }
    ]);
    concat = Kefir.concat([a, b, c]);
    activate(concat);
    expect(concat).toEmit([]);
    concat = Kefir.concat([a, b, c]);
    activate(concat);
    deactivate(concat);
    return expect(concat).toEmit([
      {
        current: 0
      }
    ]);
  });
  return it('if made of ended properties, should emit all currents then end', function() {
    return expect(Kefir.concat([send(prop(), [0, '<end>']), send(prop(), [1, '<end>']), send(prop(), [2, '<end>'])])).toEmit([
      {
        current: 0
      }, {
        current: 1
      }, {
        current: 2
      }, '<end:current>'
    ]);
  });
});



},{"../test-helpers.coffee":88}],38:[function(require,module,exports){
var Kefir;

Kefir = require('kefir');

describe('constant', function() {
  it('should return property', function() {
    return expect(Kefir.constant(1)).toBeProperty();
  });
  return it('should be ended and has current', function() {
    return expect(Kefir.constant(1)).toEmit([
      {
        current: 1
      }, '<end:current>'
    ]);
  });
});



},{"kefir":90}],39:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('debounce', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().debounce(100)).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.debounce(100)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).debounce(100)).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.debounce(100)).toEmitInTime([[160, 3], [360, 4], [710, 8], [710, '<end>']], function(tick) {
        send(a, [1]);
        tick(30);
        send(a, [2]);
        tick(30);
        send(a, [3]);
        tick(200);
        send(a, [4]);
        tick(200);
        send(a, [5]);
        tick(90);
        send(a, [6]);
        tick(30);
        send(a, [7]);
        tick(30);
        return send(a, [8, '<end>']);
      });
    });
    it('should end immediately if no value to emit later', function() {
      var a;
      a = stream();
      return expect(a.debounce(100)).toEmitInTime([[100, 1], [200, '<end>']], function(tick) {
        send(a, [1]);
        tick(200);
        return send(a, ['<end>']);
      });
    });
    it('should handle events (immediate)', function() {
      var a;
      a = stream();
      return expect(a.debounce(100, {
        immediate: true
      })).toEmitInTime([[0, 1], [260, 4], [460, 5], [610, '<end>']], function(tick) {
        send(a, [1]);
        tick(30);
        send(a, [2]);
        tick(30);
        send(a, [3]);
        tick(200);
        send(a, [4]);
        tick(200);
        send(a, [5]);
        tick(90);
        send(a, [6]);
        tick(30);
        send(a, [7]);
        tick(30);
        return send(a, [8, '<end>']);
      });
    });
    return it('should end immediately if no value to emit later (immediate)', function() {
      var a;
      a = stream();
      return expect(a.debounce(100, {
        immediate: true
      })).toEmitInTime([[0, 1], [0, '<end>']], function(tick) {
        return send(a, [1, '<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().debounce(100)).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.debounce(100)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).debounce(100)).toEmit(['<end:current>']);
    });
    it('should be ended if source was ended (with current)', function() {
      return expect(send(prop(), [1, '<end>']).debounce(100)).toEmit([
        {
          current: 1
        }, '<end:current>'
      ]);
    });
    it('should handle events', function() {
      var a;
      a = send(prop(), [0]);
      return expect(a.debounce(100)).toEmitInTime([
        [
          0, {
            current: 0
          }
        ], [160, 3], [360, 4], [710, 8], [710, '<end>']
      ], function(tick) {
        send(a, [1]);
        tick(30);
        send(a, [2]);
        tick(30);
        send(a, [3]);
        tick(200);
        send(a, [4]);
        tick(200);
        send(a, [5]);
        tick(90);
        send(a, [6]);
        tick(30);
        send(a, [7]);
        tick(30);
        return send(a, [8, '<end>']);
      });
    });
    it('should end immediately if no value to emit later', function() {
      var a;
      a = send(prop(), [0]);
      return expect(a.debounce(100)).toEmitInTime([
        [
          0, {
            current: 0
          }
        ], [100, 1], [200, '<end>']
      ], function(tick) {
        send(a, [1]);
        tick(200);
        return send(a, ['<end>']);
      });
    });
    it('should handle events (immediate)', function() {
      var a;
      a = send(prop(), [0]);
      return expect(a.debounce(100, {
        immediate: true
      })).toEmitInTime([
        [
          0, {
            current: 0
          }
        ], [0, 1], [260, 4], [460, 5], [610, '<end>']
      ], function(tick) {
        send(a, [1]);
        tick(30);
        send(a, [2]);
        tick(30);
        send(a, [3]);
        tick(200);
        send(a, [4]);
        tick(200);
        send(a, [5]);
        tick(90);
        send(a, [6]);
        tick(30);
        send(a, [7]);
        tick(30);
        return send(a, [8, '<end>']);
      });
    });
    return it('should end immediately if no value to emit later (immediate)', function() {
      var a;
      a = send(prop(), [0]);
      return expect(a.debounce(100, {
        immediate: true
      })).toEmitInTime([
        [
          0, {
            current: 0
          }
        ], [0, 1], [0, '<end>']
      ], function(tick) {
        return send(a, [1, '<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],40:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('delay', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().delay(100)).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.delay(100)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).delay(100)).toEmit(['<end:current>']);
    });
    return it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.delay(100)).toEmitInTime([[100, 1], [150, 2], [250, '<end>']], function(tick) {
        send(a, [1]);
        tick(50);
        send(a, [2]);
        tick(100);
        return send(a, ['<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().delay(100)).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.delay(100)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).delay(100)).toEmit(['<end:current>']);
    });
    return it('should handle events and current', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.delay(100)).toEmitInTime([
        [
          0, {
            current: 1
          }
        ], [100, 2], [150, 3], [250, '<end>']
      ], function(tick) {
        send(a, [2]);
        tick(50);
        send(a, [3]);
        tick(100);
        return send(a, ['<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],41:[function(require,module,exports){
var Kefir, minus, noop, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

noop = function() {};

minus = function(prev, next) {
  return prev - next;
};

describe('diff', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().diff(noop, 0)).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.diff(noop, 0)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).diff(noop, 0)).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.diff(minus, 0)).toEmit([-1, -2, '<end>'], function() {
        return send(a, [1, 3, '<end>']);
      });
    });
    it('works without fn argument', function() {
      var a;
      a = stream();
      return expect(a.diff(null, 0)).toEmit([[0, 1], [1, 3], '<end>'], function() {
        return send(a, [1, 3, '<end>']);
      });
    });
    return it('if no seed provided uses first value as seed', function() {
      var a;
      a = stream();
      expect(a.diff(minus)).toEmit([-1, -2, '<end>'], function() {
        return send(a, [0, 1, 3, '<end>']);
      });
      a = stream();
      return expect(a.diff()).toEmit([[0, 1], [1, 3], '<end>'], function() {
        return send(a, [0, 1, 3, '<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().diff(noop, 0)).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.diff(noop, 0)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).diff(noop, 0)).toEmit(['<end:current>']);
    });
    it('should handle events and current', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.diff(minus, 0)).toEmit([
        {
          current: -1
        }, -2, -3, '<end>'
      ], function() {
        return send(a, [3, 6, '<end>']);
      });
    });
    it('works without fn argument', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.diff(null, 0)).toEmit([
        {
          current: [0, 1]
        }, [1, 3], [3, 6], '<end>'
      ], function() {
        return send(a, [3, 6, '<end>']);
      });
    });
    return it('if no seed provided uses first value as seed', function() {
      var a;
      a = send(prop(), [0]);
      expect(a.diff(minus)).toEmit([-1, -2, '<end>'], function() {
        return send(a, [1, 3, '<end>']);
      });
      a = send(prop(), [0]);
      return expect(a.diff()).toEmit([[0, 1], [1, 3], '<end>'], function() {
        return send(a, [1, 3, '<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],42:[function(require,module,exports){
var Kefir;

Kefir = require('kefir');

describe('emitter', function() {
  it('should return stream', function() {
    return expect(Kefir.emitter()).toBeStream();
  });
  it('should not be ended', function() {
    return expect(Kefir.emitter()).toEmit([]);
  });
  return it('should emit values and end', function() {
    var a;
    a = Kefir.emitter();
    return expect(a).toEmit([1, 2, 3, '<end>'], function() {
      a.emit(1);
      a.emit(2);
      a.emit(3);
      return a.end();
    });
  });
});



},{"kefir":90}],43:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('filterBy', function() {
  describe('stream, stream', function() {
    it('should return a stream', function() {
      return expect(stream().filterBy(stream())).toBeStream();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.filterBy(b)).toActivate(a, b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(stream(), ['<end>']).filterBy(stream())).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended', function() {
      return expect(stream().filterBy(send(stream(), ['<end>']))).toEmit(['<end:current>']);
    });
    it('should end when secondary ends if last value from it was falsey', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.filterBy(b)).toEmit(['<end>'], function() {
        return send(b, [false, '<end>']);
      });
    });
    it('should not end when secondary ends if last value from it wasn\'t falsey', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.filterBy(b)).toEmit([], function() {
        return send(b, [true, '<end>']);
      });
    });
    it('should ignore values from primary until first value from secondary', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.filterBy(b)).toEmit([], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should filter values as expected', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.filterBy(b)).toEmit([3, 4, 7, 8, '<end>'], function() {
        send(b, [true]);
        send(a, [3, 4]);
        send(b, [0]);
        send(a, [5, 6]);
        send(b, [1]);
        send(a, [7, 8]);
        send(b, [false]);
        return send(a, [9, '<end>']);
      });
    });
  });
  describe('stream, property', function() {
    it('should return a stream', function() {
      return expect(stream().filterBy(prop())).toBeStream();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.filterBy(b)).toActivate(a, b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(stream(), ['<end>']).filterBy(prop())).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended and has no current', function() {
      return expect(stream().filterBy(send(prop(), ['<end>']))).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended and has falsey current', function() {
      return expect(stream().filterBy(send(prop(), [false, '<end>']))).toEmit(['<end:current>']);
    });
    it('should not be ended if secondary was ended but has truthy current', function() {
      return expect(stream().filterBy(send(prop(), [true, '<end>']))).toEmit([]);
    });
    it('should end when secondary ends if last value from it was falsey', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.filterBy(b)).toEmit(['<end>'], function() {
        return send(b, [false, '<end>']);
      });
    });
    it('should not end when secondary ends if last value from it wasn\'t falsey', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.filterBy(b)).toEmit([], function() {
        return send(b, [true, '<end>']);
      });
    });
    it('should ignore values from primary until first value from secondary', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.filterBy(b)).toEmit([], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should filter values as expected', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.filterBy(b)).toEmit([3, 4, 7, 8, '<end>'], function() {
        send(b, [true]);
        send(a, [3, 4]);
        send(b, [0]);
        send(a, [5, 6]);
        send(b, [1]);
        send(a, [7, 8]);
        send(b, [false]);
        return send(a, [9, '<end>']);
      });
    });
  });
  describe('property, stream', function() {
    it('should return a property', function() {
      return expect(prop().filterBy(stream())).toBeProperty();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.filterBy(b)).toActivate(a, b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(prop(), ['<end>']).filterBy(stream())).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended', function() {
      return expect(prop().filterBy(send(stream(), ['<end>']))).toEmit(['<end:current>']);
    });
    it('should end when secondary ends if last value from it was falsey', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.filterBy(b)).toEmit(['<end>'], function() {
        return send(b, [false, '<end>']);
      });
    });
    it('should not end when secondary ends if last value from it wasn\'t falsey', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.filterBy(b)).toEmit([], function() {
        return send(b, [true, '<end>']);
      });
    });
    it('should ignore values from primary until first value from secondary', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.filterBy(b)).toEmit([], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should filter values as expected', function() {
      var a, b;
      a = send(prop(), [0]);
      b = stream();
      return expect(a.filterBy(b)).toEmit([3, 4, 7, 8, '<end>'], function() {
        send(b, [true]);
        send(a, [3, 4]);
        send(b, [0]);
        send(a, [5, 6]);
        send(b, [1]);
        send(a, [7, 8]);
        send(b, [false]);
        return send(a, [9, '<end>']);
      });
    });
  });
  return describe('property, property', function() {
    it('should return a property', function() {
      return expect(prop().filterBy(prop())).toBeProperty();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.filterBy(b)).toActivate(a, b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(prop(), ['<end>']).filterBy(prop())).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended and has no current', function() {
      return expect(prop().filterBy(send(prop(), ['<end>']))).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended and has falsey current', function() {
      return expect(prop().filterBy(send(prop(), [false, '<end>']))).toEmit(['<end:current>']);
    });
    it('should not be ended if secondary was ended but has truthy current', function() {
      return expect(prop().filterBy(send(prop(), [true, '<end>']))).toEmit([]);
    });
    it('should end when secondary ends if last value from it was falsey', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.filterBy(b)).toEmit(['<end>'], function() {
        return send(b, [false, '<end>']);
      });
    });
    it('should not end when secondary ends if last value from it wasn\'t falsey', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.filterBy(b)).toEmit([], function() {
        return send(b, [true, '<end>']);
      });
    });
    it('should ignore values from primary until first value from secondary', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.filterBy(b)).toEmit([], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should filter values as expected', function() {
      var a, b;
      a = send(prop(), [0]);
      b = send(prop(), [true]);
      return expect(a.filterBy(b)).toEmit([
        {
          current: 0
        }, 3, 4, 7, 8, '<end>'
      ], function() {
        send(a, [3, 4]);
        send(b, [0]);
        send(a, [5, 6]);
        send(b, [1]);
        send(a, [7, 8]);
        send(b, [false]);
        return send(a, [9, '<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],44:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('filter', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().filter(function() {})).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.filter(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).filter(function() {})).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.filter(function(x) {
        return x > 3;
      })).toEmit([4, 5, 6, '<end>'], function() {
        return send(a, [1, 2, 4, 5, 0, 6, '<end>']);
      });
    });
    return it('shoud use id as default predicate', function() {
      var a;
      a = stream();
      return expect(a.filter()).toEmit([4, 5, 6, '<end>'], function() {
        return send(a, [0, 0, 4, 5, 0, 6, '<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().filter(function() {})).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.filter(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).filter(function() {})).toEmit(['<end:current>']);
    });
    it('should handle events and current', function() {
      var a;
      a = send(prop(), [5]);
      return expect(a.filter(function(x) {
        return x > 2;
      })).toEmit([
        {
          current: 5
        }, 4, 3, '<end>'
      ], function() {
        return send(a, [4, 3, 2, 1, '<end>']);
      });
    });
    it('should handle current (not pass)', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.filter(function(x) {
        return x > 2;
      })).toEmit([]);
    });
    return it('shoud use id as default predicate', function() {
      var a;
      a = send(prop(), [0]);
      expect(a.filter()).toEmit([4, 5, 6, '<end>'], function() {
        return send(a, [0, 4, 5, 0, 6, '<end>']);
      });
      a = send(prop(), [1]);
      return expect(a.filter()).toEmit([
        {
          current: 1
        }, 4, 5, 6, '<end>'
      ], function() {
        return send(a, [0, 4, 5, 0, 6, '<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],45:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('flatMapConcat', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().flatMapConcat()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.flatMapConcat()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).flatMapConcat()).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a, b, c;
      a = stream();
      b = stream();
      c = stream();
      return expect(a.flatMapConcat()).toEmit([1, 2, 5, 6, '<end>'], function() {
        send(b, [0]);
        send(a, [b]);
        send(b, [1, 2]);
        send(a, [c, '<end>']);
        send(c, [4]);
        send(b, [5, '<end>']);
        return send(c, [6, '<end>']);
      });
    });
    it('should activate sub-sources', function() {
      var a, b, c, map;
      a = stream();
      b = stream();
      c = send(prop(), [0]);
      map = a.flatMapConcat();
      activate(map);
      send(a, [b, c]);
      deactivate(map);
      expect(map).toActivate(b);
      expect(map).not.toActivate(c);
      send(b, ['<end>']);
      return expect(map).toActivate(c);
    });
    it('should accept optional map fn', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.flatMapConcat(function(x) {
        return x.obs;
      })).toEmit([1, 2, '<end>'], function() {
        send(b, [0]);
        send(a, [
          {
            obs: b
          }, '<end>'
        ]);
        return send(b, [1, 2, '<end>']);
      });
    });
    it('should correctly handle current values of sub sources on activation', function() {
      var a, b, m;
      a = stream();
      b = send(prop(), [1]);
      m = a.flatMapConcat();
      activate(m);
      send(a, [b]);
      deactivate(m);
      return expect(m).toEmit([
        {
          current: 1
        }
      ]);
    });
    it('should correctly handle current values of new sub sources', function() {
      var a, b, c, d;
      a = stream();
      b = send(prop(), [1, '<end>']);
      c = send(prop(), [2]);
      d = send(prop(), [3]);
      return expect(a.flatMapConcat()).toEmit([1, 2], function() {
        return send(a, [b, c, d]);
      });
    });
    return it('should work nicely with Kefir.constant and Kefir.never', function() {
      var a;
      a = stream();
      return expect(a.flatMapConcat(function(x) {
        if (x > 2) {
          return Kefir.constant(x);
        } else {
          return Kefir.never();
        }
      })).toEmit([3, 4, 5], function() {
        return send(a, [1, 2, 3, 4, 5]);
      });
    });
  });
  return describe('property', function() {
    it('should return stream', function() {
      return expect(prop().flatMapConcat()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.flatMapConcat()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).flatMapConcat()).toEmit(['<end:current>']);
    });
    it('should be ended if source was ended (with value)', function() {
      return expect(send(prop(), [send(prop(), [0, '<end>']), '<end>']).flatMapConcat()).toEmit([
        {
          current: 0
        }, '<end:current>'
      ]);
    });
    return it('should correctly handle current value of source', function() {
      var a, b;
      a = send(prop(), [0]);
      b = send(prop(), [a]);
      return expect(b.flatMapConcat()).toEmit([
        {
          current: 0
        }
      ]);
    });
  });
});



},{"../test-helpers.coffee":88}],46:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('flatMapFirst', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().flatMapFirst()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.flatMapFirst()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).flatMapFirst()).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a, b, c;
      a = stream();
      b = stream();
      c = stream();
      return expect(a.flatMapFirst()).toEmit([1, 2, 4, '<end>'], function() {
        send(b, [0]);
        send(a, [b]);
        send(b, [1]);
        send(a, [c]);
        send(b, [2, '<end>']);
        send(c, [3]);
        send(a, [c, '<end>']);
        return send(c, [4, '<end>']);
      });
    });
    it('should activate sub-sources (only first)', function() {
      var a, b, c, map;
      a = stream();
      b = stream();
      c = send(prop(), [0]);
      map = a.flatMapFirst();
      activate(map);
      send(a, [b, c]);
      deactivate(map);
      expect(map).toActivate(b);
      return expect(map).not.toActivate(c);
    });
    it('should accept optional map fn', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.flatMapFirst(function(x) {
        return x.obs;
      })).toEmit([1, 2, '<end>'], function() {
        send(a, [
          {
            obs: b
          }, '<end>'
        ]);
        return send(b, [1, 2, '<end>']);
      });
    });
    it('should correctly handle current values of sub sources on activation', function() {
      var a, b, c, m;
      a = stream();
      b = send(prop(), [1]);
      c = send(prop(), [2]);
      m = a.flatMapFirst();
      activate(m);
      send(a, [b, c]);
      deactivate(m);
      return expect(m).toEmit([
        {
          current: 1
        }
      ]);
    });
    it('should correctly handle current values of new sub sources', function() {
      var a, b, c, d;
      a = stream();
      b = send(prop(), [1, '<end>']);
      c = send(prop(), [2]);
      d = send(prop(), [3]);
      return expect(a.flatMapFirst()).toEmit([1, 2], function() {
        return send(a, [b, c, d]);
      });
    });
    it('should work nicely with Kefir.constant and Kefir.never', function() {
      var a;
      a = stream();
      return expect(a.flatMapFirst(function(x) {
        if (x > 2) {
          return Kefir.constant(x);
        } else {
          return Kefir.never();
        }
      })).toEmit([3, 4, 5], function() {
        return send(a, [1, 2, 3, 4, 5]);
      });
    });
    return it('should not call transformer function when skiping values', function() {
      var a, b, c, count, result;
      count = 0;
      a = stream();
      b = stream();
      c = stream();
      result = a.flatMapFirst(function(x) {
        count++;
        return x;
      });
      activate(result);
      expect(count).toBe(0);
      send(a, [b]);
      expect(count).toBe(1);
      send(a, [c]);
      expect(count).toBe(1);
      send(b, ['<end>']);
      expect(count).toBe(1);
      send(a, [c]);
      return expect(count).toBe(2);
    });
  });
  return describe('property', function() {
    it('should return stream', function() {
      return expect(prop().flatMapFirst()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.flatMapFirst()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).flatMapFirst()).toEmit(['<end:current>']);
    });
    it('should be ended if source was ended (with value)', function() {
      return expect(send(prop(), [send(prop(), [0, '<end>']), '<end>']).flatMapFirst()).toEmit([
        {
          current: 0
        }, '<end:current>'
      ]);
    });
    return it('should correctly handle current value of source', function() {
      var a, b;
      a = send(prop(), [0]);
      b = send(prop(), [a]);
      return expect(b.flatMapFirst()).toEmit([
        {
          current: 0
        }
      ]);
    });
  });
});



},{"../test-helpers.coffee":88}],47:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('flatMapLatest', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().flatMapLatest()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.flatMapLatest()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).flatMapLatest()).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a, b, c;
      a = stream();
      b = stream();
      c = send(prop(), [0]);
      return expect(a.flatMapLatest()).toEmit([1, 0, 3, 5, '<end>'], function() {
        send(b, [0]);
        send(a, [b]);
        send(b, [1]);
        send(a, [c]);
        send(b, [2]);
        send(c, [3]);
        send(a, [b, '<end>']);
        send(c, [4]);
        return send(b, [5, '<end>']);
      });
    });
    it('should activate sub-sources (only latest)', function() {
      var a, b, c, map;
      a = stream();
      b = stream();
      c = send(prop(), [0]);
      map = a.flatMapLatest();
      activate(map);
      send(a, [b, c]);
      deactivate(map);
      expect(map).toActivate(c);
      return expect(map).not.toActivate(b);
    });
    it('should accept optional map fn', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.flatMapLatest(function(x) {
        return x.obs;
      })).toEmit([1, 2, '<end>'], function() {
        send(a, [
          {
            obs: b
          }, '<end>'
        ]);
        return send(b, [1, 2, '<end>']);
      });
    });
    it('should correctly handle current values of sub sources on activation', function() {
      var a, b, c, m;
      a = stream();
      b = send(prop(), [1]);
      c = send(prop(), [2]);
      m = a.flatMapLatest();
      activate(m);
      send(a, [b, c]);
      deactivate(m);
      return expect(m).toEmit([
        {
          current: 2
        }
      ]);
    });
    it('should correctly handle current values of new sub sources', function() {
      var a, b, c;
      a = stream();
      b = send(prop(), [1]);
      c = send(prop(), [2]);
      return expect(a.flatMapLatest()).toEmit([1, 2], function() {
        return send(a, [b, c]);
      });
    });
    return it('should work nicely with Kefir.constant and Kefir.never', function() {
      var a;
      a = stream();
      return expect(a.flatMapLatest(function(x) {
        if (x > 2) {
          return Kefir.constant(x);
        } else {
          return Kefir.never();
        }
      })).toEmit([3, 4, 5], function() {
        return send(a, [1, 2, 3, 4, 5]);
      });
    });
  });
  return describe('property', function() {
    it('should return stream', function() {
      return expect(prop().flatMapLatest()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.flatMapLatest()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).flatMapLatest()).toEmit(['<end:current>']);
    });
    it('should be ended if source was ended (with value)', function() {
      return expect(send(prop(), [send(prop(), [0, '<end>']), '<end>']).flatMapLatest()).toEmit([
        {
          current: 0
        }, '<end:current>'
      ]);
    });
    return it('should correctly handle current value of source', function() {
      var a, b;
      a = send(prop(), [0]);
      b = send(prop(), [a]);
      return expect(b.flatMapLatest()).toEmit([
        {
          current: 0
        }
      ]);
    });
  });
});



},{"../test-helpers.coffee":88}],48:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('flatMapConcurLimit', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().flatMapConcurLimit(null, 1)).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.flatMapConcurLimit(null, 1)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).flatMapConcurLimit(null, 1)).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a, b, c, d;
      a = stream();
      b = stream();
      c = stream();
      d = stream();
      return expect(a.flatMapConcurLimit(null, 2)).toEmit([1, 2, 4, 5, 6, '<end>'], function() {
        send(b, [0]);
        send(a, [b]);
        send(b, [1]);
        send(a, [c, d, '<end>']);
        send(c, [2]);
        send(d, [3]);
        send(b, [4, '<end>']);
        send(d, [5, '<end>']);
        return send(c, [6, '<end>']);
      });
    });
    it('should activate sub-sources', function() {
      var a, b, c, d, map;
      a = stream();
      b = stream();
      c = stream();
      d = stream();
      map = a.flatMapConcurLimit(null, 2);
      activate(map);
      send(a, [b, c, d]);
      deactivate(map);
      expect(map).toActivate(b, c);
      expect(map).not.toActivate(d);
      send(b, ['<end>']);
      return expect(map).toActivate(d);
    });
    it('should accept optional map fn', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.flatMapConcurLimit((function(x) {
        return x.obs;
      }), 1)).toEmit([1, 2, '<end>'], function() {
        send(b, [0]);
        send(a, [
          {
            obs: b
          }, '<end>'
        ]);
        return send(b, [1, 2, '<end>']);
      });
    });
    it('should correctly handle current values of sub sources on activation', function() {
      var a, b, c, d, m;
      a = stream();
      b = send(prop(), [1]);
      c = send(prop(), [2]);
      d = send(prop(), [3]);
      m = a.flatMapConcurLimit(null, 2);
      activate(m);
      send(a, [b, c, d]);
      deactivate(m);
      return expect(m).toEmit([
        {
          current: 1
        }, {
          current: 2
        }
      ]);
    });
    return it('should correctly handle current values of new sub sources', function() {
      var a, b, c, d, e;
      a = stream();
      b = send(prop(), [1, '<end>']);
      c = send(prop(), [2]);
      d = send(prop(), [3]);
      e = send(prop(), [4]);
      return expect(a.flatMapConcurLimit(null, 2)).toEmit([4, 1, 2], function() {
        return send(a, [e, b, c, d]);
      });
    });
  });
  return describe('property', function() {
    it('should return stream', function() {
      return expect(prop().flatMapConcurLimit(null, 1)).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.flatMapConcurLimit(null, 1)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).flatMapConcurLimit(null, 1)).toEmit(['<end:current>']);
    });
    it('should be ended if source was ended (with value)', function() {
      return expect(send(prop(), [send(prop(), [0, '<end>']), '<end>']).flatMapConcurLimit(null, 1)).toEmit([
        {
          current: 0
        }, '<end:current>'
      ]);
    });
    return it('should correctly handle current value of source', function() {
      var a, b;
      a = send(prop(), [0]);
      b = send(prop(), [a]);
      return expect(b.flatMapConcurLimit(null, 1)).toEmit([
        {
          current: 0
        }
      ]);
    });
  });
});



},{"../test-helpers.coffee":88}],49:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('flatMap', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().flatMap()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.flatMap()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).flatMap()).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a, b, c;
      a = stream();
      b = stream();
      c = send(prop(), [0]);
      return expect(a.flatMap()).toEmit([1, 2, 0, 3, 4, '<end>'], function() {
        send(b, [0]);
        send(a, [b]);
        send(b, [1, 2]);
        send(a, [c, '<end>']);
        send(b, [3, '<end>']);
        return send(c, [4, '<end>']);
      });
    });
    it('should activate sub-sources', function() {
      var a, b, c, map;
      a = stream();
      b = stream();
      c = send(prop(), [0]);
      map = a.flatMap();
      activate(map);
      send(a, [b, c]);
      deactivate(map);
      return expect(map).toActivate(b, c);
    });
    it('should accept optional map fn', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.flatMap(function(x) {
        return x.obs;
      })).toEmit([1, 2, '<end>'], function() {
        send(b, [0]);
        send(a, [
          {
            obs: b
          }, '<end>'
        ]);
        return send(b, [1, 2, '<end>']);
      });
    });
    it('should correctly handle current values of sub sources on activation', function() {
      var a, b, c, m;
      a = stream();
      b = send(prop(), [1]);
      c = send(prop(), [2]);
      m = a.flatMap();
      activate(m);
      send(a, [b, c]);
      deactivate(m);
      return expect(m).toEmit([
        {
          current: 1
        }, {
          current: 2
        }
      ]);
    });
    it('should correctly handle current values of new sub sources', function() {
      var a, b, c;
      a = stream();
      b = send(prop(), [1]);
      c = send(prop(), [2]);
      return expect(a.flatMap()).toEmit([1, 2], function() {
        return send(a, [b, c]);
      });
    });
    return it('should work nicely with Kefir.constant and Kefir.never', function() {
      var a;
      a = stream();
      return expect(a.flatMap(function(x) {
        if (x > 2) {
          return Kefir.constant(x);
        } else {
          return Kefir.never();
        }
      })).toEmit([3, 4, 5], function() {
        return send(a, [1, 2, 3, 4, 5]);
      });
    });
  });
  return describe('property', function() {
    it('should return stream', function() {
      return expect(prop().flatMap()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.flatMap()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).flatMap()).toEmit(['<end:current>']);
    });
    it('should be ended if source was ended (with value)', function() {
      return expect(send(prop(), [send(prop(), [0, '<end>']), '<end>']).flatMap()).toEmit([
        {
          current: 0
        }, '<end:current>'
      ]);
    });
    it('should not costantly adding current value on each activation', function() {
      var a, b, map;
      a = send(prop(), [0]);
      b = send(prop(), [a]);
      map = b.flatMap();
      activate(map);
      deactivate(map);
      activate(map);
      deactivate(map);
      return expect(map).toEmit([
        {
          current: 0
        }
      ]);
    });
    it('should allow to add same obs several times', function() {
      var a, b, c;
      b = send(prop(), ['b0']);
      c = stream();
      a = send(prop(), [b]);
      return expect(a.flatMap()).toEmit([
        {
          current: 'b0'
        }, 'b0', 'b0', 'b0', 'b0', 'b1', 'b1', 'b1', 'b1', 'b1', 'c1', 'c1', 'c1', '<end>'
      ], function() {
        send(a, [b, c, b, c, c, b, b, '<end>']);
        send(b, ['b1', '<end>']);
        return send(c, ['c1', '<end>']);
      });
    });
    return it('should correctly handle current value of source', function() {
      var a, b;
      a = send(prop(), [0]);
      b = send(prop(), [a]);
      return expect(b.flatMap()).toEmit([
        {
          current: 0
        }
      ]);
    });
  });
});



},{"../test-helpers.coffee":88}],50:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('flatten', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().flatten(function() {})).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.flatten(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).flatten(function() {})).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.flatten(function(x) {
        var _i, _results;
        if (x > 1) {
          return (function() {
            _results = [];
            for (var _i = 1; 1 <= x ? _i <= x : _i >= x; 1 <= x ? _i++ : _i--){ _results.push(_i); }
            return _results;
          }).apply(this);
        } else {
          return [];
        }
      })).toEmit([1, 2, 1, 2, 3, '<end>'], function() {
        return send(a, [1, 2, 3, '<end>']);
      });
    });
    return it('if no `fn` provided should use the `id` function by default', function() {
      var a;
      a = stream();
      return expect(a.flatten()).toEmit([1, 2, 3, '<end>'], function() {
        return send(a, [[1], [], [2, 3], '<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().flatten(function() {})).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.flatten(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).flatten(function() {})).toEmit(['<end:current>']);
    });
    it('should handle events (handler skips current)', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.flatten(function(x) {
        var _i, _results;
        if (x > 1) {
          return (function() {
            _results = [];
            for (var _i = 1; 1 <= x ? _i <= x : _i >= x; 1 <= x ? _i++ : _i--){ _results.push(_i); }
            return _results;
          }).apply(this);
        } else {
          return [];
        }
      })).toEmit([1, 2, 1, 2, 3, '<end>'], function() {
        return send(a, [2, 3, '<end>']);
      });
    });
    it('should handle current correctly', function() {
      return expect(send(prop(), [1]).flatten(function(x) {
        var _i, _results;
        return (function() {
          _results = [];
          for (var _i = 1; 1 <= x ? _i <= x : _i >= x; 1 <= x ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this);
      })).toEmit([
        {
          current: 1
        }
      ]);
    });
    it('should handle multiple currents correctly', function() {
      return expect(send(prop(), [2]).flatten(function(x) {
        var _i, _results;
        return (function() {
          _results = [];
          for (var _i = 1; 1 <= x ? _i <= x : _i >= x; 1 <= x ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this);
      })).toEmit([
        {
          current: 2
        }
      ]);
    });
    return it('if no `fn` provided should use the `id` function by default', function() {
      var a;
      a = send(prop(), [[1]]);
      return expect(a.flatten()).toEmit([
        {
          current: 1
        }, 2, 3, 4, '<end>'
      ], function() {
        return send(a, [[2], [], [3, 4], '<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],51:[function(require,module,exports){
var Kefir, activate, deactivate, _ref;

_ref = require('../test-helpers.coffee'), activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('fromBinder', function() {
  it('should return stream', function() {
    return expect(Kefir.fromBinder(function() {})).toBeStream();
  });
  it('should not be ended', function() {
    return expect(Kefir.fromBinder(function() {})).toEmit([]);
  });
  it('should emit values and end', function() {
    var a, emitter;
    emitter = null;
    a = Kefir.fromBinder(function(em) {
      emitter = em;
      return null;
    });
    return expect(a).toEmit([1, 2, 3, '<end>'], function() {
      emitter.emit(1);
      emitter.emit(2);
      emitter.emit(3);
      return emitter.end();
    });
  });
  it('should call `subscribe` / `unsubscribe` on activation / deactivation', function() {
    var a, subCount, unsubCount;
    subCount = 0;
    unsubCount = 0;
    a = Kefir.fromBinder(function() {
      subCount++;
      return function() {
        return unsubCount++;
      };
    });
    expect(subCount).toBe(0);
    expect(unsubCount).toBe(0);
    activate(a);
    expect(subCount).toBe(1);
    activate(a);
    expect(subCount).toBe(1);
    deactivate(a);
    expect(unsubCount).toBe(0);
    deactivate(a);
    expect(unsubCount).toBe(1);
    expect(subCount).toBe(1);
    activate(a);
    expect(subCount).toBe(2);
    expect(unsubCount).toBe(1);
    deactivate(a);
    return expect(unsubCount).toBe(2);
  });
  return it('should automatically controll isCurent argument in `send`', function() {
    expect(Kefir.fromBinder(function(emitter) {
      emitter.end();
      return null;
    })).toEmit(['<end:current>']);
    return expect(Kefir.fromBinder(function(emitter) {
      emitter.emit(1);
      emitter.emit(2);
      setTimeout(function() {
        emitter.emit(2);
        return emitter.end();
      }, 1000);
      return null;
    })).toEmitInTime([
      [
        0, {
          current: 1
        }
      ], [
        0, {
          current: 2
        }
      ], [1000, 2], [1000, '<end>']
    ]);
  });
});



},{"../test-helpers.coffee":88}],52:[function(require,module,exports){
var Kefir, activate, deactivate, _ref;

_ref = require('../test-helpers.coffee'), activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('fromCallback', function() {
  it('should return stream', function() {
    return expect(Kefir.fromCallback(function() {})).toBeStream();
  });
  it('should not be ended', function() {
    return expect(Kefir.fromCallback(function() {})).toEmit([]);
  });
  it('should call `callbackConsumer` on first activation, and only on first', function() {
    var count, s;
    count = 0;
    s = Kefir.fromCallback(function() {
      return count++;
    });
    expect(count).toBe(0);
    activate(s);
    expect(count).toBe(1);
    deactivate(s);
    activate(s);
    deactivate(s);
    activate(s);
    return expect(count).toBe(1);
  });
  it('should emit first result and end after that', function() {
    var cb;
    cb = null;
    return expect(Kefir.fromCallback(function(_cb) {
      return cb = _cb;
    })).toEmit([1, '<end>'], function() {
      return cb(1);
    });
  });
  it('should work after deactivation/activate cicle', function() {
    var cb, s;
    cb = null;
    s = Kefir.fromCallback(function(_cb) {
      return cb = _cb;
    });
    activate(s);
    deactivate(s);
    activate(s);
    deactivate(s);
    return expect(s).toEmit([1, '<end>'], function() {
      return cb(1);
    });
  });
  return it('should emit a current, if `callback` is called immediately in `callbackConsumer`', function() {
    return expect(Kefir.fromCallback(function(cb) {
      return cb(1);
    })).toEmit([
      {
        current: 1
      }, '<end:current>'
    ]);
  });
});



},{"../test-helpers.coffee":88}],53:[function(require,module,exports){
var Kefir, activate, deactivate, _ref;

_ref = require('../test-helpers.coffee'), activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('fromEvent', function() {
  var domTarget, nodeTarget, onOffTarget;
  domTarget = function() {
    return {
      addEventListener: function(name, fn) {
        return this[name + 'Listener'] = fn;
      },
      removeEventListener: function(name, fn) {
        if (this[name + 'Listener'] === fn) {
          return delete this[name + 'Listener'];
        }
      }
    };
  };
  nodeTarget = function() {
    return {
      addListener: function(name, fn) {
        return this[name + 'Listener'] = fn;
      },
      removeListener: function(name, fn) {
        if (this[name + 'Listener'] === fn) {
          return delete this[name + 'Listener'];
        }
      }
    };
  };
  onOffTarget = function() {
    return {
      on: function(name, fn) {
        return this[name + 'Listener'] = fn;
      },
      off: function(name, fn) {
        if (this[name + 'Listener'] === fn) {
          return delete this[name + 'Listener'];
        }
      }
    };
  };
  it('should return stream', function() {
    return expect(Kefir.fromEvent(domTarget(), 'foo')).toBeStream();
  });
  it('should not be ended', function() {
    return expect(Kefir.fromEvent(domTarget(), 'foo')).toEmit([]);
  });
  it('should subscribe/unsubscribe from target', function() {
    var a, target;
    target = domTarget();
    a = Kefir.fromEvent(target, 'foo');
    expect(target.fooListener).toBeUndefined();
    activate(a);
    expect(target.fooListener).toEqual(jasmine.any(Function));
    deactivate(a);
    expect(target.fooListener).toBeUndefined();
    target = onOffTarget();
    a = Kefir.fromEvent(target, 'foo');
    expect(target.fooListener).toBeUndefined();
    activate(a);
    expect(target.fooListener).toEqual(jasmine.any(Function));
    deactivate(a);
    expect(target.fooListener).toBeUndefined();
    target = nodeTarget();
    a = Kefir.fromEvent(target, 'foo');
    expect(target.fooListener).toBeUndefined();
    activate(a);
    expect(target.fooListener).toEqual(jasmine.any(Function));
    deactivate(a);
    return expect(target.fooListener).toBeUndefined();
  });
  it('should emit values', function() {
    var a, target;
    target = domTarget();
    a = Kefir.fromEvent(target, 'foo');
    expect(a).toEmit([1, 2, 3], function() {
      target.fooListener(1);
      target.fooListener(2);
      return target.fooListener(3);
    });
    target = nodeTarget();
    a = Kefir.fromEvent(target, 'foo');
    expect(a).toEmit([1, 2, 3], function() {
      target.fooListener(1);
      target.fooListener(2);
      return target.fooListener(3);
    });
    target = onOffTarget();
    a = Kefir.fromEvent(target, 'foo');
    return expect(a).toEmit([1, 2, 3], function() {
      target.fooListener(1);
      target.fooListener(2);
      return target.fooListener(3);
    });
  });
  return it('should accept optional transformer and call it properly', function() {
    var a, target;
    target = domTarget();
    a = Kefir.fromEvent(target, 'foo', function(a, b) {
      return [this, a, b];
    });
    return expect(a).toEmit([
      [
        {
          a: 1
        }, void 0, void 0
      ], [
        {
          b: 1
        }, 1, void 0
      ], [
        {
          c: 1
        }, 1, 2
      ]
    ], function() {
      target.fooListener.call({
        a: 1
      });
      target.fooListener.call({
        b: 1
      }, 1);
      return target.fooListener.call({
        c: 1
      }, 1, 2);
    });
  });
});



},{"../test-helpers.coffee":88}],54:[function(require,module,exports){
var Kefir;

Kefir = require('kefir');

describe('fromPoll', function() {
  it('should return stream', function() {
    return expect(Kefir.fromPoll(100, function() {})).toBeStream();
  });
  return it('should emit whatever fn returns at certain time', function() {
    var i;
    i = 0;
    return expect(Kefir.fromPoll(100, function() {
      return ++i;
    })).toEmitInTime([[100, 1], [200, 2], [300, 3]], null, 350);
  });
});



},{"kefir":90}],55:[function(require,module,exports){
var Kefir;

Kefir = require('kefir');

describe('interval', function() {
  it('should return stream', function() {
    return expect(Kefir.interval(100, 1)).toBeStream();
  });
  return it('should repeat same value at certain time', function() {
    return expect(Kefir.interval(100, 1)).toEmitInTime([[100, 1], [200, 1], [300, 1]], null, 350);
  });
});



},{"kefir":90}],56:[function(require,module,exports){
var $, Kefir, countListentrs, inBrowser, withDOM, _ref;

_ref = require('../test-helpers.coffee'), withDOM = _ref.withDOM, inBrowser = _ref.inBrowser, Kefir = _ref.Kefir;

if (!inBrowser) {
  console.log('Skipping jQuery specs in not browser enviroment ...');
} else {
  $ = require('jquery');
  require('addons/kefir-jquery');
  countListentrs = function($el, event, selector) {
    var allListeners, count, listener, _i, _len, _ref1;
    allListeners = $._data($el.get(0), "events");
    count = 0;
    if ((allListeners != null ? allListeners[event] : void 0) != null) {
      _ref1 = allListeners[event];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        listener = _ref1[_i];
        if (listener.selector === selector) {
          count++;
        }
      }
    }
    return count;
  };
  describe('jQuery addon', function() {
    describe('making sure test enviroment is ok', function() {
      describe('countListentrs()', function() {
        it('returns 0 when no listeners at all', function() {
          return withDOM(function(tmpDom) {
            expect(countListentrs($(tmpDom), 'click')).toBe(0);
            return expect(countListentrs($(tmpDom), 'click', '.foo')).toBe(0);
          });
        });
        it('returns 0 when there is listeners but for different event', function() {
          return withDOM(function(tmpDom) {
            $(tmpDom).on('mouseover', function() {});
            expect(countListentrs($(tmpDom), 'click')).toBe(0);
            return expect(countListentrs($(tmpDom), 'click', '.foo')).toBe(0);
          });
        });
        it('returns 0 when there is listeners but for different selector', function() {
          return withDOM(function(tmpDom) {
            $(tmpDom).on('click', '.bar', function() {});
            expect(countListentrs($(tmpDom), 'click')).toBe(0);
            return expect(countListentrs($(tmpDom), 'click', '.foo')).toBe(0);
          });
        });
        it('returns right ammount of listeners', function() {
          return withDOM(function(tmpDom) {
            $(tmpDom).on('mouseover', function() {});
            $(tmpDom).on('click', function() {});
            $(tmpDom).on('click', '.foo', function() {});
            $(tmpDom).on('click', '.foo', function() {});
            $(tmpDom).on('click', '.bar', function() {});
            expect(countListentrs($(tmpDom), 'click')).toBe(1);
            expect(countListentrs($(tmpDom), 'click', '.foo')).toBe(2);
            $(tmpDom).off('click');
            expect(countListentrs($(tmpDom), 'click')).toBe(0);
            expect(countListentrs($(tmpDom), 'click', '.foo')).toBe(0);
            return expect(countListentrs($(tmpDom), 'mouseover')).toBe(1);
          });
        });
        return it('returns right ammount of listeners (custom events)', function() {
          return withDOM(function(tmpDom) {
            $(tmpDom).on('kick', function() {});
            $(tmpDom).on('lick', function() {});
            $(tmpDom).on('lick', '.foo', function() {});
            $(tmpDom).on('lick', '.foo', function() {});
            $(tmpDom).on('lick', '.bar', function() {});
            expect(countListentrs($(tmpDom), 'lick')).toBe(1);
            expect(countListentrs($(tmpDom), 'lick', '.foo')).toBe(2);
            $(tmpDom).off('lick');
            expect(countListentrs($(tmpDom), 'lick')).toBe(0);
            expect(countListentrs($(tmpDom), 'lick', '.foo')).toBe(0);
            return expect(countListentrs($(tmpDom), 'kick')).toBe(1);
          });
        });
      });
      return describe('$.fn.trigger()', function() {
        it('callback being called', function() {
          return withDOM(function(tmpDom) {
            var callCount;
            callCount = 0;
            $(tmpDom).on('click', function() {
              return callCount++;
            });
            expect(callCount).toBe(0);
            $(tmpDom).trigger('click');
            expect(callCount).toBe(1);
            $(tmpDom).trigger('click');
            return expect(callCount).toBe(2);
          });
        });
        it('callback being called (custom event)', function() {
          return withDOM(function(tmpDom) {
            var callCount;
            callCount = 0;
            $(tmpDom).on('lick', function() {
              return callCount++;
            });
            expect(callCount).toBe(0);
            $(tmpDom).trigger('lick');
            expect(callCount).toBe(1);
            $(tmpDom).trigger('lick');
            return expect(callCount).toBe(2);
          });
        });
        it('callback with selector being called', function() {
          return withDOM(function(tmpDom) {
            var $bar, $foo, callCount;
            callCount = 0;
            $(tmpDom).on('click', '.foo', function() {
              return callCount++;
            });
            $foo = $('<div class="foo"></div>').appendTo(tmpDom);
            expect(callCount).toBe(0);
            $foo.trigger('click');
            expect(callCount).toBe(1);
            $foo.trigger('click');
            expect(callCount).toBe(2);
            $bar = $('<div class="bar"></div>').appendTo(tmpDom);
            $bar.trigger('click');
            return expect(callCount).toBe(2);
          });
        });
        return it('callback with selector being called (custom event)', function() {
          return withDOM(function(tmpDom) {
            var $bar, $foo, callCount;
            callCount = 0;
            $(tmpDom).on('lick', '.foo', function() {
              return callCount++;
            });
            $foo = $('<div class="foo"></div>').appendTo(tmpDom);
            expect(callCount).toBe(0);
            $foo.trigger('lick');
            expect(callCount).toBe(1);
            $foo.trigger('lick');
            expect(callCount).toBe(2);
            $bar = $('<div class="bar"></div>').appendTo(tmpDom);
            $bar.trigger('lick');
            return expect(callCount).toBe(2);
          });
        });
      });
    });
    describe('$.fn.asKefirStream()', function() {
      it('should return stream', function() {
        return withDOM(function(tmpDom) {
          return expect($(tmpDom).asKefirStream('click')).toBeStream();
        });
      });
      it('should add/remove jquery-listener on activation/deactivation', function() {
        return withDOM(function(tmpDom) {
          var clicks, f, f2, licks;
          clicks = $(tmpDom).asKefirStream('click');
          licks = $(tmpDom).asKefirStream('lick');
          f = function() {};
          f2 = function() {};
          expect(countListentrs($(tmpDom), 'click')).toBe(0);
          expect(countListentrs($(tmpDom), 'lick')).toBe(0);
          clicks.on('value', f);
          expect(countListentrs($(tmpDom), 'click')).toBe(1);
          expect(countListentrs($(tmpDom), 'lick')).toBe(0);
          licks.on('value', f);
          clicks.on('value', f2);
          expect(countListentrs($(tmpDom), 'click')).toBe(1);
          expect(countListentrs($(tmpDom), 'lick')).toBe(1);
          licks.off('value', f);
          expect(countListentrs($(tmpDom), 'click')).toBe(1);
          expect(countListentrs($(tmpDom), 'lick')).toBe(0);
          clicks.off('value', f);
          expect(countListentrs($(tmpDom), 'click')).toBe(1);
          expect(countListentrs($(tmpDom), 'lick')).toBe(0);
          clicks.off('value', f2);
          expect(countListentrs($(tmpDom), 'click')).toBe(0);
          return expect(countListentrs($(tmpDom), 'lick')).toBe(0);
        });
      });
      it('should add/remove jquery-listener on activation/deactivation (with selector)', function() {
        return withDOM(function(tmpDom) {
          var clicks, f;
          clicks = $(tmpDom).asKefirStream('click', '.foo');
          expect(countListentrs($(tmpDom), 'click', '.foo')).toBe(0);
          clicks.on('value', f = function() {});
          expect(countListentrs($(tmpDom), 'click', '.foo')).toBe(1);
          clicks.off('value', f);
          return expect(countListentrs($(tmpDom), 'click', '.foo')).toBe(0);
        });
      });
      it('should deliver events', function() {
        return withDOM(function(tmpDom) {
          return expect($(tmpDom).asKefirStream('click').map(function(e) {
            return e.type;
          })).toEmit(['click', 'click'], function() {
            return $(tmpDom).trigger('click').trigger('click');
          });
        });
      });
      it('should deliver events (with selector)', function() {
        return withDOM(function(tmpDom) {
          return expect($(tmpDom).asKefirStream('click', '.foo').map(function(e) {
            return $(e.target).attr('class');
          })).toEmit(['foo', 'foo', 'foo bar'], function() {
            var $bar, $foo;
            $foo = $('<div class="foo"></div>').appendTo(tmpDom);
            $foo.trigger('click').trigger('click');
            $bar = $('<div class="foo bar"></div>').appendTo(tmpDom);
            $bar.trigger('click');
            $bar.removeClass('foo');
            return $bar.trigger('click');
          });
        });
      });
      it('should accept optional transformer fn', function() {
        return withDOM(function(tmpDom) {
          return expect($(tmpDom).asKefirStream('click', function(e) {
            return e.type;
          })).toEmit(['click', 'click'], function() {
            return $(tmpDom).trigger('click').trigger('click');
          });
        });
      });
      it('should pass data to transformer', function() {
        return withDOM(function(tmpDom) {
          return expect($(tmpDom).asKefirStream('click', function(e, data) {
            return data;
          })).toEmit([1, 2], function() {
            return $(tmpDom).trigger('click', 1).trigger('click', 2);
          });
        });
      });
      return it('should call transformer with correct this context', function() {
        return withDOM(function(tmpDom) {
          return expect($(tmpDom).asKefirStream('click', function(e) {
            return e.currentTarget === this;
          })).toEmit([true, true], function() {
            return $(tmpDom).trigger('click').trigger('click');
          });
        });
      });
    });
    return describe('$.fn.asKefirProperty()', function() {
      it('should return property', function() {
        return withDOM(function(tmpDom) {
          return expect($(tmpDom).asKefirProperty('click', function() {})).toBeProperty();
        });
      });
      it('should throw if no getter provided', function() {
        return withDOM(function(tmpDom) {
          expect(function() {
            return $(tmpDom).asKefirProperty('click');
          }).toThrow();
          return expect(function() {
            return $(tmpDom).asKefirProperty('click', '.foo');
          }).toThrow();
        });
      });
      it('should call getter immediately after creation (without event)', function() {
        return withDOM(function(tmpDom) {
          var count;
          count = 0;
          $(tmpDom).asKefirProperty('click', function(event) {
            if (event === void 0) {
              return count++;
            }
          });
          return expect(count).toBe(1);
        });
      });
      it('should has current value returned by getter', function() {
        return withDOM(function(tmpDom) {
          return expect($(tmpDom).asKefirProperty('click', function() {
            return 0;
          })).toEmit([
            {
              current: 0
            }
          ]);
        });
      });
      return it('should handle events', function() {
        return withDOM(function(tmpDom) {
          var i;
          i = 0;
          return expect($(tmpDom).asKefirProperty('click', function(event, data) {
            if (!event) {
              return 0;
            } else {
              if (event.type === 'click' && event.currentTarget === this) {
                return data;
              } else {
                return -1;
              }
            }
          })).toEmit([
            {
              current: 0
            }, 1, 2
          ], function() {
            return $(tmpDom).trigger('click', 1).trigger('click', 2);
          });
        });
      });
    });
  });
}



},{"../test-helpers.coffee":88,"addons/kefir-jquery":89,"jquery":6}],57:[function(require,module,exports){
var Kefir;

Kefir = require('kefir');

describe('later', function() {
  it('should return stream', function() {
    return expect(Kefir.later(100, 1)).toBeStream();
  });
  return it('should emmit value after interval then end', function() {
    return expect(Kefir.later(100, 1)).toEmitInTime([[100, 1], [100, '<end>']]);
  });
});



},{"kefir":90}],58:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('mapEnd', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().mapEnd(function() {})).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.mapEnd(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).mapEnd(function() {
        return 42;
      })).toEmit([
        {
          current: 42
        }, '<end:current>'
      ]);
    });
    return it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.mapEnd(function() {
        return 42;
      })).toEmit([1, 2, 42, '<end>'], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().mapEnd(function() {})).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.mapEnd(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      expect(send(prop(), ['<end>']).mapEnd(function() {
        return 42;
      })).toEmit([
        {
          current: 42
        }, '<end:current>'
      ]);
      return expect(send(prop(), [1, '<end>']).mapEnd(function() {
        return 42;
      })).toEmit([
        {
          current: 42
        }, '<end:current>'
      ]);
    });
    return it('should handle events and current', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.mapEnd(function() {
        return 42;
      })).toEmit([
        {
          current: 1
        }, 2, 3, 42, '<end>'
      ], function() {
        return send(a, [2, 3, '<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],59:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('map', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().map(function() {})).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.map(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).map(function() {})).toEmit(['<end:current>']);
    });
    return it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.map(function(x) {
        return x * 2;
      })).toEmit([2, 4, '<end>'], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().map(function() {})).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.map(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).map(function() {})).toEmit(['<end:current>']);
    });
    return it('should handle events and current', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.map(function(x) {
        return x * 2;
      })).toEmit([
        {
          current: 2
        }, 4, 6, '<end>'
      ], function() {
        return send(a, [2, 3, '<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],60:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('merge', function() {
  it('should return stream', function() {
    expect(Kefir.merge([])).toBeStream();
    expect(Kefir.merge([stream(), prop()])).toBeStream();
    expect(stream().merge(stream())).toBeStream();
    return expect(prop().merge(prop())).toBeStream();
  });
  it('should be ended if empty array provided', function() {
    return expect(Kefir.merge([])).toEmit(['<end:current>']);
  });
  it('should be ended if array of ended observables provided', function() {
    var a, b, c;
    a = send(stream(), ['<end>']);
    b = send(prop(), ['<end>']);
    c = send(stream(), ['<end>']);
    expect(Kefir.merge([a, b, c])).toEmit(['<end:current>']);
    return expect(a.merge(b)).toEmit(['<end:current>']);
  });
  it('should activate sources', function() {
    var a, b, c;
    a = stream();
    b = prop();
    c = stream();
    expect(Kefir.merge([a, b, c])).toActivate(a, b, c);
    return expect(a.merge(b)).toActivate(a, b);
  });
  it('should deliver events from observables, then end when all of them end', function() {
    var a, b, c;
    a = stream();
    b = send(prop(), [0]);
    c = stream();
    expect(Kefir.merge([a, b, c])).toEmit([
      {
        current: 0
      }, 1, 2, 3, 4, 5, 6, '<end>'
    ], function() {
      send(a, [1]);
      send(b, [2]);
      send(c, [3]);
      send(a, ['<end>']);
      send(b, [4, '<end>']);
      return send(c, [5, 6, '<end>']);
    });
    a = stream();
    b = send(prop(), [0]);
    return expect(a.merge(b)).toEmit([
      {
        current: 0
      }, 1, 2, 3, '<end>'
    ], function() {
      send(a, [1]);
      send(b, [2]);
      send(a, ['<end>']);
      return send(b, [3, '<end>']);
    });
  });
  return it('should deliver currents from all source properties, but only to first subscriber on each activation', function() {
    var a, b, c, merge;
    a = send(prop(), [0]);
    b = send(prop(), [1]);
    c = send(prop(), [2]);
    merge = Kefir.merge([a, b, c]);
    expect(merge).toEmit([
      {
        current: 0
      }, {
        current: 1
      }, {
        current: 2
      }
    ]);
    merge = Kefir.merge([a, b, c]);
    activate(merge);
    expect(merge).toEmit([]);
    merge = Kefir.merge([a, b, c]);
    activate(merge);
    deactivate(merge);
    return expect(merge).toEmit([
      {
        current: 0
      }, {
        current: 1
      }, {
        current: 2
      }
    ]);
  });
});



},{"../test-helpers.coffee":88}],61:[function(require,module,exports){
var Kefir;

Kefir = require('kefir');

describe('never', function() {
  it('should return stream', function() {
    return expect(Kefir.never()).toBeStream();
  });
  return it('should be ended', function() {
    return expect(Kefir.never()).toEmit(['<end:current>']);
  });
});



},{"kefir":90}],62:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('pool', function() {
  it('should return stream', function() {
    return expect(Kefir.pool()).toBeStream();
  });
  it('should activate sources', function() {
    var a, b, c, pool;
    a = stream();
    b = prop();
    c = stream();
    pool = Kefir.pool().plug(a).plug(b).plug(c);
    expect(pool).toActivate(a, b, c);
    pool.unplug(b);
    expect(pool).toActivate(a, c);
    return expect(pool).not.toActivate(b);
  });
  it('should deliver events from observables', function() {
    var a, b, c, pool;
    a = stream();
    b = send(prop(), [0]);
    c = stream();
    pool = Kefir.pool().plug(a).plug(b).plug(c);
    return expect(pool).toEmit([
      {
        current: 0
      }, 1, 2, 3, 4, 5, 6
    ], function() {
      send(a, [1]);
      send(b, [2]);
      send(c, [3]);
      send(a, ['<end>']);
      send(b, [4, '<end>']);
      return send(c, [5, 6, '<end>']);
    });
  });
  it('should deliver currents from all source properties, but only to first subscriber on each activation', function() {
    var a, b, c, pool;
    a = send(prop(), [0]);
    b = send(prop(), [1]);
    c = send(prop(), [2]);
    pool = Kefir.pool().plug(a).plug(b).plug(c);
    expect(pool).toEmit([
      {
        current: 0
      }, {
        current: 1
      }, {
        current: 2
      }
    ]);
    pool = Kefir.pool().plug(a).plug(b).plug(c);
    activate(pool);
    expect(pool).toEmit([]);
    pool = Kefir.pool().plug(a).plug(b).plug(c);
    activate(pool);
    deactivate(pool);
    return expect(pool).toEmit([
      {
        current: 0
      }, {
        current: 1
      }, {
        current: 2
      }
    ]);
  });
  it('should not deliver events from removed sources', function() {
    var a, b, c, pool;
    a = stream();
    b = send(prop(), [0]);
    c = stream();
    pool = Kefir.pool().plug(a).plug(b).plug(c).unplug(b);
    return expect(pool).toEmit([1, 3, 5, 6], function() {
      send(a, [1]);
      send(b, [2]);
      send(c, [3]);
      send(a, ['<end>']);
      send(b, [4, '<end>']);
      return send(c, [5, 6, '<end>']);
    });
  });
  return it('should correctly handle current values of new sub sources', function() {
    var b, c, pool;
    pool = Kefir.pool();
    b = send(prop(), [1]);
    c = send(prop(), [2]);
    return expect(pool).toEmit([1, 2], function() {
      pool.plug(b);
      return pool.plug(c);
    });
  });
});



},{"../test-helpers.coffee":88}],63:[function(require,module,exports){
var Kefir, activate, prop, send, _ref;

_ref = require('../test-helpers.coffee'), prop = _ref.prop, send = _ref.send, activate = _ref.activate, Kefir = _ref.Kefir;

describe('Property', function() {
  describe('new', function() {
    it('should create a Property', function() {
      expect(prop()).toBeProperty();
      return expect(new Kefir.Property()).toBeProperty();
    });
    it('should not be ended', function() {
      return expect(prop()).toEmit([]);
    });
    return it('should not be active', function() {
      return expect(prop()).not.toBeActive();
    });
  });
  describe('end', function() {
    it('should end when `end` sent', function() {
      var s;
      s = prop();
      return expect(s).toEmit(['<end>'], function() {
        return send(s, ['<end>']);
      });
    });
    it('should call `end` subscribers', function() {
      var log, s;
      s = prop();
      log = [];
      s.onEnd(function() {
        return log.push(1);
      });
      s.onEnd(function() {
        return log.push(2);
      });
      expect(log).toEqual([]);
      send(s, ['<end>']);
      return expect(log).toEqual([1, 2]);
    });
    it('should call `end` subscribers on already ended property', function() {
      var log, s;
      s = prop();
      send(s, ['<end>']);
      log = [];
      s.onEnd(function() {
        return log.push(1);
      });
      s.onEnd(function() {
        return log.push(2);
      });
      return expect(log).toEqual([1, 2]);
    });
    it('should deactivate on end', function() {
      var s;
      s = prop();
      activate(s);
      expect(s).toBeActive();
      send(s, ['<end>']);
      return expect(s).not.toBeActive();
    });
    return it('should stop deliver new values after end', function() {
      var s;
      s = prop();
      return expect(s).toEmit([1, 2, '<end>'], function() {
        return send(s, [1, 2, '<end>', 3]);
      });
    });
  });
  describe('active state', function() {
    it('should activate when first subscriber added (value)', function() {
      var s;
      s = prop();
      s.onValue(function() {});
      return expect(s).toBeActive();
    });
    it('should activate when first subscriber added (end)', function() {
      var s;
      s = prop();
      s.onEnd(function() {});
      return expect(s).toBeActive();
    });
    it('should activate when first subscriber added (any)', function() {
      var s;
      s = prop();
      s.onAny(function() {});
      return expect(s).toBeActive();
    });
    return it('should deactivate when all subscribers removed', function() {
      var any1, any2, end1, end2, s, value1, value2;
      s = prop();
      s.onAny((any1 = function() {}));
      s.onAny((any2 = function() {}));
      s.onValue((value1 = function() {}));
      s.onValue((value2 = function() {}));
      s.onEnd((end1 = function() {}));
      s.onEnd((end2 = function() {}));
      s.offValue(value1);
      s.offValue(value2);
      s.offAny(any1);
      s.offAny(any2);
      s.offEnd(end1);
      expect(s).toBeActive();
      s.offEnd(end2);
      return expect(s).not.toBeActive();
    });
  });
  return describe('subscribers', function() {
    it('should deliver values and current', function() {
      var s;
      s = send(prop(), [0]);
      return expect(s).toEmit([
        {
          current: 0
        }, 1, 2
      ], function() {
        return send(s, [1, 2]);
      });
    });
    it('onValue subscribers should be called with 1 argument', function() {
      var count, s;
      s = send(prop(), [0]);
      count = null;
      s.onValue(function() {
        return count = arguments.length;
      });
      expect(count).toBe(1);
      send(s, [1]);
      return expect(count).toBe(1);
    });
    it('onAny subscribers should be called with 1 arguments', function() {
      var count, s;
      s = send(prop(), [0]);
      count = null;
      s.onAny(function() {
        return count = arguments.length;
      });
      expect(count).toBe(1);
      send(s, [1]);
      return expect(count).toBe(1);
    });
    return it('onEnd subscribers should be called with 0 arguments', function() {
      var count, s;
      s = send(prop(), [0]);
      count = null;
      s.onEnd(function() {
        return count = arguments.length;
      });
      send(s, ['<end>']);
      expect(count).toBe(0);
      s.onEnd(function() {
        return count = arguments.length;
      });
      return expect(count).toBe(0);
    });
  });
});



},{"../test-helpers.coffee":88}],64:[function(require,module,exports){
var Kefir, minus, noop, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

noop = function() {};

minus = function(prev, next) {
  return prev - next;
};

describe('reduce', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().reduce(noop, 0)).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.reduce(noop, 0)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).reduce(noop, 0)).toEmit([
        {
          current: 0
        }, '<end:current>'
      ]);
    });
    it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.reduce(minus, 0)).toEmit([-4, '<end>'], function() {
        return send(a, [1, 3, '<end>']);
      });
    });
    return it('if no seed provided uses first value as seed', function() {
      var a;
      a = stream();
      expect(a.reduce(minus)).toEmit([-4, '<end>'], function() {
        return send(a, [0, 1, 3, '<end>']);
      });
      a = stream();
      expect(a.reduce(minus)).toEmit([0, '<end>'], function() {
        return send(a, [0, '<end>']);
      });
      a = stream();
      return expect(a.reduce(minus)).toEmit(['<end>'], function() {
        return send(a, ['<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().reduce(noop, 0)).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.reduce(noop, 0)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).reduce(noop, 0)).toEmit([
        {
          current: 0
        }, '<end:current>'
      ]);
    });
    it('should handle events and current', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.reduce(minus, 0)).toEmit([-10, '<end>'], function() {
        return send(a, [3, 6, '<end>']);
      });
    });
    return it('if no seed provided uses first value as seed', function() {
      var a;
      a = send(prop(), [0]);
      expect(a.reduce(minus)).toEmit([-4, '<end>'], function() {
        return send(a, [1, 3, '<end>']);
      });
      a = send(prop(), [0]);
      expect(a.reduce(minus)).toEmit([0, '<end>'], function() {
        return send(a, ['<end>']);
      });
      a = send(prop(), [0, '<end>']);
      return expect(a.reduce(minus)).toEmit([
        {
          current: 0
        }, '<end:current>'
      ]);
    });
  });
});



},{"../test-helpers.coffee":88}],65:[function(require,module,exports){
var Kefir;

Kefir = require('kefir');

describe('repeatedly', function() {
  it('should return stream', function() {
    return expect(Kefir.repeatedly(100, [1, 2, 3])).toBeStream();
  });
  it('should emmit nothing if empty array provided', function() {
    return expect(Kefir.repeatedly(100, [])).toEmitInTime([], null, 750);
  });
  return it('should repeat values from array at certain time', function() {
    return expect(Kefir.repeatedly(100, [1, 2, 3])).toEmitInTime([[100, 1], [200, 2], [300, 3], [400, 1], [500, 2], [600, 3], [700, 1]], null, 750);
  });
});



},{"kefir":90}],66:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref,
  __slice = [].slice;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('sampledBy', function() {
  it('should return stream', function() {
    expect(Kefir.sampledBy([], [])).toBeStream();
    expect(Kefir.sampledBy([stream(), prop()], [stream(), prop()])).toBeStream();
    expect(prop().sampledBy(stream())).toBeStream();
    return expect(stream().sampledBy(prop())).toBeStream();
  });
  it('should be ended if empty array provided', function() {
    expect(Kefir.sampledBy([stream(), prop()], [])).toEmit(['<end:current>']);
    return expect(Kefir.sampledBy([], [stream(), prop()])).toEmit([]);
  });
  it('should be ended if array of ended observables provided', function() {
    var a, b, c;
    a = send(stream(), ['<end>']);
    b = send(prop(), ['<end>']);
    c = send(stream(), ['<end>']);
    expect(Kefir.sampledBy([stream(), prop()], [a, b, c])).toEmit(['<end:current>']);
    return expect(prop().sampledBy(a)).toEmit(['<end:current>']);
  });
  it('should be ended and emmit current (once) if array of ended properties provided and each of them has current', function() {
    var a, b, c, s1, s2;
    a = send(prop(), [1, '<end>']);
    b = send(prop(), [2, '<end>']);
    c = send(prop(), [3, '<end>']);
    s1 = Kefir.sampledBy([a], [b, c]);
    s2 = a.sampledBy(b);
    expect(s1).toEmit([
      {
        current: [1, 2, 3]
      }, '<end:current>'
    ]);
    expect(s2).toEmit([
      {
        current: 1
      }, '<end:current>'
    ]);
    expect(s1).toEmit(['<end:current>']);
    return expect(s2).toEmit(['<end:current>']);
  });
  it('should activate sources', function() {
    var a, b, c;
    a = stream();
    b = prop();
    c = stream();
    expect(Kefir.sampledBy([a], [b, c])).toActivate(a, b, c);
    return expect(a.sampledBy(b)).toActivate(a, b);
  });
  it('should handle events and current from observables', function() {
    var a, b, c, d;
    a = stream();
    b = send(prop(), [0]);
    c = stream();
    d = stream();
    expect(Kefir.sampledBy([a, b], [c, d])).toEmit([[1, 0, 2, 3], [1, 4, 5, 3], [1, 4, 6, 3], [1, 4, 6, 7], '<end>'], function() {
      send(a, [1]);
      send(c, [2]);
      send(d, [3]);
      send(b, [4, '<end>']);
      send(c, [5, 6, '<end>']);
      return send(d, [7, '<end>']);
    });
    a = stream();
    b = send(prop(), [0]);
    return expect(a.sampledBy(b)).toEmit([2, 4, 4, '<end>'], function() {
      send(b, [1]);
      send(a, [2]);
      send(b, [3]);
      send(a, [4]);
      return send(b, [5, 6, '<end>']);
    });
  });
  it('should accept optional combinator function', function() {
    var a, b, c, d, join;
    join = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return args.join('+');
    };
    a = stream();
    b = send(prop(), [0]);
    c = stream();
    d = stream();
    expect(Kefir.sampledBy([a, b], [c, d], join)).toEmit(['1+0+2+3', '1+4+5+3', '1+4+6+3', '1+4+6+7', '<end>'], function() {
      send(a, [1]);
      send(c, [2]);
      send(d, [3]);
      send(b, [4, '<end>']);
      send(c, [5, 6, '<end>']);
      return send(d, [7, '<end>']);
    });
    a = stream();
    b = send(prop(), [0]);
    return expect(a.sampledBy(b, join)).toEmit(['2+3', '4+5', '4+6', '<end>'], function() {
      send(b, [1]);
      send(a, [2]);
      send(b, [3]);
      send(a, [4]);
      return send(b, [5, 6, '<end>']);
    });
  });
  it('when activating second time and has 2+ properties in sources, should emit current value at most once', function() {
    var a, b, c, sb;
    a = send(prop(), [0]);
    b = send(prop(), [1]);
    c = send(prop(), [2]);
    sb = Kefir.sampledBy([a], [b, c]);
    activate(sb);
    deactivate(sb);
    return expect(sb).toEmit([
      {
        current: [0, 1, 2]
      }
    ]);
  });
  return it('one sampledBy should remove listeners of another', function() {
    var a, b, s1, s2;
    a = send(prop(), [0]);
    b = stream();
    s1 = a.sampledBy(b);
    s2 = a.sampledBy(b);
    activate(s1);
    activate(s2);
    deactivate(s2);
    return expect(s1).toEmit([0], function() {
      return send(b, [1]);
    });
  });
});



},{"../test-helpers.coffee":88}],67:[function(require,module,exports){
var Kefir, minus, noop, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

noop = function() {};

minus = function(prev, next) {
  return prev - next;
};

describe('scan', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().scan(noop, 0)).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.scan(noop, 0)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).scan(noop, 0)).toEmit([
        {
          current: 0
        }, '<end:current>'
      ]);
    });
    it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.scan(minus, 0)).toEmit([
        {
          current: 0
        }, -1, -4, '<end>'
      ], function() {
        return send(a, [1, 3, '<end>']);
      });
    });
    return it('if no seed provided uses first value as seed', function() {
      var a;
      a = stream();
      return expect(a.scan(minus)).toEmit([0, -1, -4, '<end>'], function() {
        return send(a, [0, 1, 3, '<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().scan(noop, 0)).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.scan(noop, 0)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).scan(noop, 0)).toEmit([
        {
          current: 0
        }, '<end:current>'
      ]);
    });
    it('should handle events and current', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.scan(minus, 0)).toEmit([
        {
          current: -1
        }, -4, -10, '<end>'
      ], function() {
        return send(a, [3, 6, '<end>']);
      });
    });
    return it('if no seed provided uses first value as seed', function() {
      var a;
      a = send(prop(), [0]);
      return expect(a.scan(minus)).toEmit([
        {
          current: 0
        }, -1, -4, '<end>'
      ], function() {
        return send(a, [1, 3, '<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],68:[function(require,module,exports){
var Kefir;

Kefir = require('kefir');

describe('sequentially', function() {
  it('should return stream', function() {
    return expect(Kefir.sequentially(100, [1, 2, 3])).toBeStream();
  });
  it('should be ended if empty array provided', function() {
    return expect(Kefir.sequentially(100, [])).toEmitInTime([[0, '<end:current>']]);
  });
  return it('should emmit values at certain time then end', function() {
    return expect(Kefir.sequentially(100, [1, 2, 3])).toEmitInTime([[100, 1], [200, 2], [300, 3], [300, '<end>']]);
  });
});



},{"kefir":90}],69:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('skipDuplicates', function() {
  var roundlyEqual;
  roundlyEqual = function(a, b) {
    return Math.round(a) === Math.round(b);
  };
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().skipDuplicates()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.skipDuplicates()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).skipDuplicates()).toEmit(['<end:current>']);
    });
    it('should handle events (default comparator)', function() {
      var a;
      a = stream();
      return expect(a.skipDuplicates()).toEmit([1, 2, 3, '<end>'], function() {
        return send(a, [1, 1, 2, 3, 3, '<end>']);
      });
    });
    return it('should handle events (custom comparator)', function() {
      var a;
      a = stream();
      return expect(a.skipDuplicates(roundlyEqual)).toEmit([1, 2, 3.8, '<end>'], function() {
        return send(a, [1, 1.1, 2, 3.8, 4, '<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().skipDuplicates()).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.skipDuplicates()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).skipDuplicates()).toEmit(['<end:current>']);
    });
    it('should handle events and current (default comparator)', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.skipDuplicates()).toEmit([
        {
          current: 1
        }, 2, 3, '<end>'
      ], function() {
        return send(a, [1, 1, 2, 3, 3, '<end>']);
      });
    });
    return it('should handle events and current (custom comparator)', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.skipDuplicates(roundlyEqual)).toEmit([
        {
          current: 1
        }, 2, 3, '<end>'
      ], function() {
        return send(a, [1.1, 1.2, 2, 3, 3.2, '<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],70:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('mapEnd', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().skipEnd()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.skipEnd()).toActivate(a);
    });
    it('should not be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).skipEnd()).toEmit([]);
    });
    return it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.skipEnd()).toEmit([1, 2], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().skipEnd()).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.skipEnd()).toActivate(a);
    });
    it('should not be ended if source was ended', function() {
      expect(send(prop(), ['<end>']).skipEnd()).toEmit([]);
      return expect(send(prop(), [1, '<end>']).skipEnd()).toEmit([
        {
          current: 1
        }
      ]);
    });
    return it('should handle events and current', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.skipEnd()).toEmit([
        {
          current: 1
        }, 2, 3
      ], function() {
        return send(a, [2, 3, '<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],71:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir, activate = _ref.activate, deactivate = _ref.deactivate;

describe('skipUntilBy', function() {
  describe('stream, stream', function() {
    it('should return a stream', function() {
      return expect(stream().skipUntilBy(stream())).toBeStream();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.skipUntilBy(b)).toActivate(a, b);
    });
    it('should not activate secondary after first value from it', function() {
      var a, b, res;
      a = stream();
      b = stream();
      res = a.skipUntilBy(b);
      activate(res);
      send(b, [1]);
      deactivate(res);
      expect(res).toActivate(a);
      return expect(res).not.toActivate(b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(stream(), ['<end>']).skipUntilBy(stream())).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended', function() {
      return expect(stream().skipUntilBy(send(stream(), ['<end>']))).toEmit(['<end:current>']);
    });
    it('should not end when secondary ends if it produced at least one value', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.skipUntilBy(b)).toEmit([], function() {
        return send(b, [0, '<end>']);
      });
    });
    it('should ignore values from primary until first value from secondary', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.skipUntilBy(b)).toEmit([], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should emit all values from primary after first value from secondary', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.skipUntilBy(b)).toEmit([3, 4, 5, 6, 7, 8, 9, '<end>'], function() {
        send(b, [true]);
        send(a, [3, 4]);
        send(b, [0]);
        send(a, [5, 6]);
        send(b, [1]);
        send(a, [7, 8]);
        send(b, [false]);
        return send(a, [9, '<end>']);
      });
    });
  });
  describe('stream, property', function() {
    it('should return a stream', function() {
      return expect(stream().skipUntilBy(prop())).toBeStream();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.skipUntilBy(b)).toActivate(a, b);
    });
    it('should not activate secondary after first value from it', function() {
      var a, b, res;
      a = stream();
      b = prop();
      res = a.skipUntilBy(b);
      activate(res);
      send(b, [1]);
      deactivate(res);
      expect(res).toActivate(a);
      return expect(res).not.toActivate(b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(stream(), ['<end>']).skipUntilBy(prop())).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended and has no current', function() {
      return expect(stream().skipUntilBy(send(prop(), ['<end>']))).toEmit(['<end:current>']);
    });
    it('should not be ended if secondary was ended but has any current', function() {
      return expect(stream().skipUntilBy(send(prop(), [0, '<end>']))).toEmit([]);
    });
    it('should not end when secondary ends if it produced at least one value', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.skipUntilBy(b)).toEmit([], function() {
        return send(b, [true, '<end>']);
      });
    });
    it('should ignore values from primary until first value from secondary', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.skipUntilBy(b)).toEmit([], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should filter values as expected', function() {
      var a, b;
      a = stream();
      b = send(prop(), [0]);
      return expect(a.skipUntilBy(b)).toEmit([3, 4, 5, 6, 7, 8, 9, '<end>'], function() {
        send(a, [3, 4]);
        send(b, [2]);
        send(a, [5, 6]);
        send(b, [1]);
        send(a, [7, 8]);
        send(b, [false]);
        return send(a, [9, '<end>']);
      });
    });
  });
  describe('property, stream', function() {
    it('should return a property', function() {
      return expect(prop().skipUntilBy(stream())).toBeProperty();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.skipUntilBy(b)).toActivate(a, b);
    });
    it('should not activate secondary after first value from it', function() {
      var a, b, res;
      a = prop();
      b = stream();
      res = a.skipUntilBy(b);
      activate(res);
      send(b, [1]);
      deactivate(res);
      expect(res).toActivate(a);
      return expect(res).not.toActivate(b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(prop(), ['<end>']).skipUntilBy(stream())).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended', function() {
      return expect(prop().skipUntilBy(send(stream(), ['<end>']))).toEmit(['<end:current>']);
    });
    it('should not end when secondary ends if it produced at least one value', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.skipUntilBy(b)).toEmit([], function() {
        return send(b, [0, '<end>']);
      });
    });
    it('should ignore values from primary until first value from secondary', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.skipUntilBy(b)).toEmit([], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should filter values as expected', function() {
      var a, b;
      a = send(prop(), [0]);
      b = stream();
      return expect(a.skipUntilBy(b)).toEmit([3, 4, 5, 6, 7, 8, 9, '<end>'], function() {
        send(b, [true]);
        send(a, [3, 4]);
        send(b, [0]);
        send(a, [5, 6]);
        send(b, [1]);
        send(a, [7, 8]);
        send(b, [false]);
        return send(a, [9, '<end>']);
      });
    });
  });
  return describe('property, property', function() {
    it('should return a property', function() {
      return expect(prop().skipUntilBy(prop())).toBeProperty();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.skipUntilBy(b)).toActivate(a, b);
    });
    it('should not activate secondary after first value from it', function() {
      var a, b, res;
      a = prop();
      b = prop();
      res = a.skipUntilBy(b);
      activate(res);
      send(b, [1]);
      deactivate(res);
      expect(res).toActivate(a);
      return expect(res).not.toActivate(b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(prop(), ['<end>']).skipUntilBy(prop())).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended and has no current', function() {
      return expect(prop().skipUntilBy(send(prop(), ['<end>']))).toEmit(['<end:current>']);
    });
    it('should not be ended if secondary was ended but has any current', function() {
      return expect(prop().skipUntilBy(send(prop(), [0, '<end>']))).toEmit([]);
    });
    it('should not end when secondary ends if it produced at least one value', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.skipUntilBy(b)).toEmit([], function() {
        return send(b, [true, '<end>']);
      });
    });
    it('should ignore values from primary until first value from secondary', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.skipUntilBy(b)).toEmit([], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should filter values as expected', function() {
      var a, b;
      a = send(prop(), [0]);
      b = send(prop(), [0]);
      return expect(a.skipUntilBy(b)).toEmit([
        {
          current: 0
        }, 3, 4, 5, 6, 7, 8, 9, '<end>'
      ], function() {
        send(a, [3, 4]);
        send(b, [2]);
        send(a, [5, 6]);
        send(b, [1]);
        send(a, [7, 8]);
        send(b, [false]);
        return send(a, [9, '<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],72:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir, deactivate = _ref.deactivate, activate = _ref.activate;

describe('skipWhileBy', function() {
  describe('stream, stream', function() {
    it('should return a stream', function() {
      return expect(stream().skipWhileBy(stream())).toBeStream();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.skipWhileBy(b)).toActivate(a, b);
    });
    it('should not activate secondary after first falsey value from it', function() {
      var a, b, res;
      a = stream();
      b = stream();
      res = a.skipWhileBy(b);
      activate(res);
      send(b, [true, false]);
      deactivate(res);
      expect(res).toActivate(a);
      return expect(res).not.toActivate(b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(stream(), ['<end>']).skipWhileBy(stream())).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended', function() {
      return expect(stream().skipWhileBy(send(stream(), ['<end>']))).toEmit(['<end:current>']);
    });
    it('should end when secondary ends if only value from it was truthy', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.skipWhileBy(b)).toEmit(['<end>'], function() {
        return send(b, [true, '<end>']);
      });
    });
    it('should ignore values from primary until first value from secondary', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.skipWhileBy(b)).toEmit([], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should skip values as expected', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.skipWhileBy(b)).toEmit([7, 8, 9, '<end>'], function() {
        send(b, [true]);
        send(a, [3, 4]);
        send(b, [1]);
        send(a, [5, 6]);
        send(b, [false]);
        send(a, [7, 8]);
        send(b, [true]);
        return send(a, [9, '<end>']);
      });
    });
  });
  describe('stream, property', function() {
    it('should return a stream', function() {
      return expect(stream().skipWhileBy(prop())).toBeStream();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.skipWhileBy(b)).toActivate(a, b);
    });
    it('should not activate secondary after first falsey value from it', function() {
      var a, b, res;
      a = stream();
      b = prop();
      res = a.skipWhileBy(b);
      activate(res);
      send(b, [true, false]);
      deactivate(res);
      expect(res).toActivate(a);
      return expect(res).not.toActivate(b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(stream(), ['<end>']).skipWhileBy(prop())).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended and has no current', function() {
      return expect(stream().skipWhileBy(send(prop(), ['<end>']))).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended and has truthy current', function() {
      return expect(stream().skipWhileBy(send(prop(), [true, '<end>']))).toEmit(['<end:current>']);
    });
    it('should not be ended if secondary was ended but has falsey current', function() {
      return expect(stream().skipWhileBy(send(prop(), [false, '<end>']))).toEmit([]);
    });
    it('should end when secondary ends if only value from it was truthy', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.skipWhileBy(b)).toEmit(['<end>'], function() {
        return send(b, [true, '<end>']);
      });
    });
    it('should ignore values from primary until first value from secondary', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.skipWhileBy(b)).toEmit([], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should skip values as expected', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.skipWhileBy(b)).toEmit([7, 8, 9, '<end>'], function() {
        send(b, [true]);
        send(a, [3, 4]);
        send(b, [1]);
        send(a, [5, 6]);
        send(b, [false]);
        send(a, [7, 8]);
        send(b, [true]);
        return send(a, [9, '<end>']);
      });
    });
  });
  describe('property, stream', function() {
    it('should return a property', function() {
      return expect(prop().skipWhileBy(stream())).toBeProperty();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.skipWhileBy(b)).toActivate(a, b);
    });
    it('should not activate secondary after first falsey value from it', function() {
      var a, b, res;
      a = prop();
      b = stream();
      res = a.skipWhileBy(b);
      activate(res);
      send(b, [true, false]);
      deactivate(res);
      expect(res).toActivate(a);
      return expect(res).not.toActivate(b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(prop(), ['<end>']).skipWhileBy(stream())).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended', function() {
      return expect(prop().skipWhileBy(send(stream(), ['<end>']))).toEmit(['<end:current>']);
    });
    it('should end when secondary ends if only value from it was truthy', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.skipWhileBy(b)).toEmit(['<end>'], function() {
        return send(b, [true, '<end>']);
      });
    });
    it('should ignore values from primary until first value from secondary', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.skipWhileBy(b)).toEmit([], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should skip values as expected', function() {
      var a, b;
      a = send(prop(), [0]);
      b = stream();
      return expect(a.skipWhileBy(b)).toEmit([7, 8, 9, '<end>'], function() {
        send(b, [true]);
        send(a, [3, 4]);
        send(b, [1]);
        send(a, [5, 6]);
        send(b, [false]);
        send(a, [7, 8]);
        send(b, [true]);
        return send(a, [9, '<end>']);
      });
    });
  });
  return describe('property, property', function() {
    it('should return a property', function() {
      return expect(prop().skipWhileBy(prop())).toBeProperty();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.skipWhileBy(b)).toActivate(a, b);
    });
    it('should not activate secondary after first falsey value from it', function() {
      var a, b, res;
      a = prop();
      b = prop();
      res = a.skipWhileBy(b);
      activate(res);
      send(b, [true, false]);
      deactivate(res);
      expect(res).toActivate(a);
      return expect(res).not.toActivate(b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(prop(), ['<end>']).skipWhileBy(prop())).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended and has no current', function() {
      return expect(prop().skipWhileBy(send(prop(), ['<end>']))).toEmit(['<end:current>']);
    });
    it('should not be ended if secondary was ended and has falsey current', function() {
      return expect(prop().skipWhileBy(send(prop(), [false, '<end>']))).toEmit([]);
    });
    it('should be ended if secondary was ended but has truthy current', function() {
      return expect(prop().skipWhileBy(send(prop(), [true, '<end>']))).toEmit(['<end:current>']);
    });
    it('should end when secondary ends if only value from it was truthy', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.skipWhileBy(b)).toEmit(['<end>'], function() {
        return send(b, [true, '<end>']);
      });
    });
    it('should ignore values from primary until first value from secondary', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.skipWhileBy(b)).toEmit([], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should skip values as expected', function() {
      var a, b;
      a = send(prop(), [0]);
      b = send(prop(), [true]);
      return expect(a.skipWhileBy(b)).toEmit([7, 8, 9, '<end>'], function() {
        send(a, [3, 4]);
        send(b, [1]);
        send(a, [5, 6]);
        send(b, [false]);
        send(a, [7, 8]);
        send(b, [true]);
        return send(a, [9, '<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],73:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('skipWhile', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().skipWhile(function() {
        return false;
      })).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.skipWhile(function() {
        return false;
      })).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).skipWhile(function() {
        return false;
      })).toEmit(['<end:current>']);
    });
    it('should handle events (`-> true`)', function() {
      var a;
      a = stream();
      return expect(a.skipWhile(function() {
        return true;
      })).toEmit(['<end>'], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
    it('should handle events (`-> false`)', function() {
      var a;
      a = stream();
      return expect(a.skipWhile(function() {
        return false;
      })).toEmit([1, 2, 3, '<end>'], function() {
        return send(a, [1, 2, 3, '<end>']);
      });
    });
    it('should handle events (`(x) -> x < 3`)', function() {
      var a;
      a = stream();
      return expect(a.skipWhile(function(x) {
        return x < 3;
      })).toEmit([3, 4, 5, '<end>'], function() {
        return send(a, [1, 2, 3, 4, 5, '<end>']);
      });
    });
    return it('shoud use id as default predicate', function() {
      var a;
      a = stream();
      return expect(a.skipWhile()).toEmit([0, 4, 5, '<end>'], function() {
        return send(a, [1, 2, 0, 4, 5, '<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().skipWhile(function() {
        return false;
      })).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.skipWhile(function() {
        return false;
      })).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).skipWhile(function() {
        return false;
      })).toEmit(['<end:current>']);
    });
    it('should handle events and current (`-> true`)', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.skipWhile(function() {
        return true;
      })).toEmit(['<end>'], function() {
        return send(a, [2, '<end>']);
      });
    });
    it('should handle events and current (`-> false`)', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.skipWhile(function() {
        return false;
      })).toEmit([
        {
          current: 1
        }, 2, 3, '<end>'
      ], function() {
        return send(a, [2, 3, '<end>']);
      });
    });
    it('should handle events and current (`(x) -> x < 3`)', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.skipWhile(function(x) {
        return x < 3;
      })).toEmit([3, 4, 5, '<end>'], function() {
        return send(a, [2, 3, 4, 5, '<end>']);
      });
    });
    return it('shoud use id as default predicate', function() {
      var a;
      a = send(prop(), [1]);
      expect(a.skipWhile()).toEmit([0, 4, 5, '<end>'], function() {
        return send(a, [2, 0, 4, 5, '<end>']);
      });
      a = send(prop(), [0]);
      return expect(a.skipWhile()).toEmit([
        {
          current: 0
        }, 2, 0, 4, 5, '<end>'
      ], function() {
        return send(a, [2, 0, 4, 5, '<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],74:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('skip', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().skip(3)).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.skip(3)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).skip(3)).toEmit(['<end:current>']);
    });
    it('should handle events (less than `n`)', function() {
      var a;
      a = stream();
      return expect(a.skip(3)).toEmit(['<end>'], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
    it('should handle events (more than `n`)', function() {
      var a;
      a = stream();
      return expect(a.skip(3)).toEmit([4, 5, '<end>'], function() {
        return send(a, [1, 2, 3, 4, 5, '<end>']);
      });
    });
    it('should handle events (n == 0)', function() {
      var a;
      a = stream();
      return expect(a.skip(0)).toEmit([1, 2, 3, '<end>'], function() {
        return send(a, [1, 2, 3, '<end>']);
      });
    });
    return it('should handle events (n == -1)', function() {
      var a;
      a = stream();
      return expect(a.skip(-1)).toEmit([1, 2, 3, '<end>'], function() {
        return send(a, [1, 2, 3, '<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().skip(3)).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.skip(3)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).skip(3)).toEmit(['<end:current>']);
    });
    it('should handle events and current (less than `n`)', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.skip(3)).toEmit(['<end>'], function() {
        return send(a, [2, '<end>']);
      });
    });
    it('should handle events and current (more than `n`)', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.skip(3)).toEmit([4, 5, '<end>'], function() {
        return send(a, [2, 3, 4, 5, '<end>']);
      });
    });
    it('should handle events and current (n == 0)', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.skip(0)).toEmit([
        {
          current: 1
        }, 2, 3, '<end>'
      ], function() {
        return send(a, [2, 3, '<end>']);
      });
    });
    return it('should handle events and current (n == -1)', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.skip(-1)).toEmit([
        {
          current: 1
        }, 2, 3, '<end>'
      ], function() {
        return send(a, [2, 3, '<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],75:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('slidingWindow', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().slidingWindow(1)).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.slidingWindow(1)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).slidingWindow(1)).toEmit(['<end:current>']);
    });
    it('.slidingWindow(3) should work correctly', function() {
      var a;
      a = stream();
      return expect(a.slidingWindow(3)).toEmit([[1], [1, 2], [1, 2, 3], [2, 3, 4], [3, 4, 5], '<end>'], function() {
        return send(a, [1, 2, 3, 4, 5, '<end>']);
      });
    });
    it('.slidingWindow(3, 2) should work correctly', function() {
      var a;
      a = stream();
      return expect(a.slidingWindow(3, 2)).toEmit([[1, 2], [1, 2, 3], [2, 3, 4], [3, 4, 5], '<end>'], function() {
        return send(a, [1, 2, 3, 4, 5, '<end>']);
      });
    });
    it('.slidingWindow(3, 3) should work correctly', function() {
      var a;
      a = stream();
      return expect(a.slidingWindow(3, 3)).toEmit([[1, 2, 3], [2, 3, 4], [3, 4, 5], '<end>'], function() {
        return send(a, [1, 2, 3, 4, 5, '<end>']);
      });
    });
    return it('.slidingWindow(3, 4) should work correctly', function() {
      var a;
      a = stream();
      return expect(a.slidingWindow(3, 4)).toEmit(['<end>'], function() {
        return send(a, [1, 2, 3, 4, 5, '<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().slidingWindow(1)).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.slidingWindow(1)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).slidingWindow(1)).toEmit(['<end:current>']);
    });
    it('.slidingWindow(3) should work correctly', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.slidingWindow(3)).toEmit([
        {
          current: [1]
        }, [1, 2], [1, 2, 3], [2, 3, 4], [3, 4, 5], '<end>'
      ], function() {
        return send(a, [2, 3, 4, 5, '<end>']);
      });
    });
    it('.slidingWindow(3, 2) should work correctly', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.slidingWindow(3, 2)).toEmit([[1, 2], [1, 2, 3], [2, 3, 4], [3, 4, 5], '<end>'], function() {
        return send(a, [2, 3, 4, 5, '<end>']);
      });
    });
    it('.slidingWindow(3, 3) should work correctly', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.slidingWindow(3, 3)).toEmit([[1, 2, 3], [2, 3, 4], [3, 4, 5], '<end>'], function() {
        return send(a, [2, 3, 4, 5, '<end>']);
      });
    });
    return it('.slidingWindow(3, 4) should work correctly', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.slidingWindow(3, 4)).toEmit(['<end>'], function() {
        return send(a, [2, 3, 4, 5, '<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],76:[function(require,module,exports){
var Kefir, activate, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, send = _ref.send, activate = _ref.activate, Kefir = _ref.Kefir;

describe('Stream', function() {
  describe('new', function() {
    it('should create a Stream', function() {
      expect(stream()).toBeStream();
      return expect(new Kefir.Stream()).toBeStream();
    });
    it('should not be ended', function() {
      return expect(stream()).toEmit([]);
    });
    return it('should not be active', function() {
      return expect(stream()).not.toBeActive();
    });
  });
  describe('end', function() {
    it('should end when `end` sent', function() {
      var s;
      s = stream();
      return expect(s).toEmit(['<end>'], function() {
        return send(s, ['<end>']);
      });
    });
    it('should call `end` subscribers', function() {
      var log, s;
      s = stream();
      log = [];
      s.onEnd(function() {
        return log.push(1);
      });
      s.onEnd(function() {
        return log.push(2);
      });
      expect(log).toEqual([]);
      send(s, ['<end>']);
      return expect(log).toEqual([1, 2]);
    });
    it('should call `end` subscribers on already ended stream', function() {
      var log, s;
      s = stream();
      send(s, ['<end>']);
      log = [];
      s.onEnd(function() {
        return log.push(1);
      });
      s.onEnd(function() {
        return log.push(2);
      });
      return expect(log).toEqual([1, 2]);
    });
    it('should deactivate on end', function() {
      var s;
      s = stream();
      activate(s);
      expect(s).toBeActive();
      send(s, ['<end>']);
      return expect(s).not.toBeActive();
    });
    return it('should stop deliver new values after end', function() {
      var s;
      s = stream();
      return expect(s).toEmit([1, 2, '<end>'], function() {
        return send(s, [1, 2, '<end>', 3]);
      });
    });
  });
  describe('active state', function() {
    it('should activate when first subscriber added (value)', function() {
      var s;
      s = stream();
      s.onValue(function() {});
      return expect(s).toBeActive();
    });
    it('should activate when first subscriber added (end)', function() {
      var s;
      s = stream();
      s.onEnd(function() {});
      return expect(s).toBeActive();
    });
    it('should activate when first subscriber added (any)', function() {
      var s;
      s = stream();
      s.onAny(function() {});
      return expect(s).toBeActive();
    });
    return it('should deactivate when all subscribers removed', function() {
      var any1, any2, end1, end2, s, value1, value2;
      s = stream();
      s.onAny((any1 = function() {}));
      s.onAny((any2 = function() {}));
      s.onValue((value1 = function() {}));
      s.onValue((value2 = function() {}));
      s.onEnd((end1 = function() {}));
      s.onEnd((end2 = function() {}));
      s.offValue(value1);
      s.offValue(value2);
      s.offAny(any1);
      s.offAny(any2);
      s.offEnd(end1);
      expect(s).toBeActive();
      s.offEnd(end2);
      return expect(s).not.toBeActive();
    });
  });
  return describe('subscribers', function() {
    it('should deliver values', function() {
      var s;
      s = stream();
      return expect(s).toEmit([1, 2], function() {
        return send(s, [1, 2]);
      });
    });
    it('should not deliver values to unsubscribed subscribers', function() {
      var a, b, log, s;
      log = [];
      a = function(x) {
        return log.push('a' + x);
      };
      b = function(x) {
        return log.push('b' + x);
      };
      s = stream();
      s.onValue(a);
      s.onValue(b);
      send(s, [1]);
      s.offValue(function() {});
      send(s, [2]);
      s.offValue(a);
      send(s, [3]);
      s.offValue(b);
      send(s, [4]);
      return expect(log).toEqual(['a1', 'b1', 'a2', 'b2', 'b3']);
    });
    it('onValue subscribers should be called with 1 argument', function() {
      var count, s;
      s = stream();
      count = null;
      s.onValue(function() {
        return count = arguments.length;
      });
      send(s, [1]);
      return expect(count).toBe(1);
    });
    it('onAny subscribers should be called with 1 arguments', function() {
      var count, s;
      s = stream();
      count = null;
      s.onAny(function() {
        return count = arguments.length;
      });
      send(s, [1]);
      return expect(count).toBe(1);
    });
    it('onEnd subscribers should be called with 0 arguments', function() {
      var count, s;
      s = stream();
      count = null;
      s.onEnd(function() {
        return count = arguments.length;
      });
      send(s, ['<end>']);
      expect(count).toBe(0);
      s.onEnd(function() {
        return count = arguments.length;
      });
      return expect(count).toBe(0);
    });
    return it('should correctly handle unsubscribe during call loop', function() {
      var a, b, log, s;
      s = stream();
      log = [];
      a = function(x) {
        log.push('a' + x);
        return s.offValue(b);
      };
      b = function(x) {
        return log.push('b' + x);
      };
      s.onValue(a);
      s.onValue(b);
      send(s, [1, 2]);
      return expect(log).toEqual(['a1', 'b1', 'a2']);
    });
  });
});



},{"../test-helpers.coffee":88}],77:[function(require,module,exports){
var Kefir, expectToBehaveAsMap, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

expectToBehaveAsMap = function(gen, mapFn, toObj) {
  var mapEv;
  if (toObj == null) {
    toObj = function(x) {
      return x;
    };
  }
  mapEv = function(events, mapFn) {
    var event, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = events.length; _i < _len; _i++) {
      event = events[_i];
      if (event === '<end>') {
        _results.push('<end>');
      } else if ((event != null ? event.current : void 0) != null) {
        _results.push({
          current: mapFn(event.current)
        });
      } else {
        _results.push(mapFn(event));
      }
    }
    return _results;
  };
  describe('stream', function() {
    it('should return stream', function() {
      return expect(gen(stream())).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(gen(a)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(gen(send(stream(), ['<end>']))).toEmit(['<end:current>']);
    });
    return it('should handle events', function() {
      var a;
      a = stream();
      return expect(gen(a)).toEmit(mapEv(mapEv([1, 2, '<end>'], toObj), mapFn), function() {
        return send(a, mapEv([1, 2, '<end>'], toObj));
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(gen(prop())).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(gen(a)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(gen(send(prop(), ['<end>']))).toEmit(['<end:current>']);
    });
    return it('should handle events and current', function() {
      var a;
      a = send(prop(), [toObj(1)]);
      return expect(gen(a)).toEmit(mapEv(mapEv([
        {
          current: 1
        }, 2, 3, '<end>'
      ], toObj), mapFn), function() {
        return send(a, mapEv([2, 3, '<end>'], toObj));
      });
    });
  });
};

describe('mapTo', function() {
  return expectToBehaveAsMap(function(s) {
    return s.mapTo(1);
  }, function() {
    return 1;
  });
});

describe('not', function() {
  return expectToBehaveAsMap(function(s) {
    return s.not();
  }, function(x) {
    return !x;
  });
});

describe('pluck', function() {
  return expectToBehaveAsMap(function(s) {
    return s.pluck('foo');
  }, function(x) {
    return x.foo;
  }, function(x) {
    return {
      foo: x
    };
  });
});

describe('invoke w/o args', function() {
  return expectToBehaveAsMap(function(s) {
    return s.invoke('bar');
  }, function(x) {
    return x.bar();
  }, function(x) {
    return {
      foo: x,
      bar: function() {
        return this.foo;
      }
    };
  });
});

describe('invoke w/ args', function() {
  return expectToBehaveAsMap(function(s) {
    return s.invoke('bar', 1, 2);
  }, function(x) {
    return x.bar(1, 2);
  }, function(x) {
    return {
      foo: x,
      bar: function(a, b) {
        return this.foo + a + b;
      }
    };
  });
});

describe('tap', function() {
  return expectToBehaveAsMap(function(s) {
    return s.tap(function(x) {
      return x.foo += 1;
    });
  }, function(x) {
    x.foo += 1;
    return x;
  }, function(x) {
    return {
      foo: x
    };
  });
});

describe('setName', function() {
  it('should return same observable', function() {
    var a;
    a = stream();
    expect(a.setName('foo')).toBe(a);
    return expect(a.setName(stream(), 'foo')).toBe(a);
  });
  return it('should update observable name', function() {
    var a;
    a = stream();
    expect(a.toString()).toBe('[stream]');
    a.setName('foo');
    expect(a.toString()).toBe('[foo]');
    a.setName(stream().setName('foo'), 'bar');
    return expect(a.toString()).toBe('[foo.bar]');
  });
});

describe('and', function() {
  return it('should work as expected', function() {
    var a, b, c;
    a = stream();
    b = prop();
    c = send(prop(), [1]);
    return expect(Kefir.and([a, b, c])).toEmit([false, false, 10, 11, 0], function() {
      send(a, [true]);
      send(b, [false]);
      send(c, [10]);
      send(b, [1]);
      send(c, [11]);
      return send(a, [0]);
    });
  });
});

describe('or', function() {
  return it('should work as expected', function() {
    var a, b, c;
    a = stream();
    b = prop();
    c = send(prop(), [1]);
    return expect(Kefir.or([a, b, c])).toEmit([true, 1, 2, 1, 11], function() {
      send(a, [true]);
      send(b, [false]);
      send(a, [0]);
      send(b, [2, false]);
      return send(c, [11]);
    });
  });
});

describe('awaiting', function() {
  it('stream and stream', function() {
    var a, b;
    a = stream();
    b = stream();
    return expect(a.awaiting(b)).toEmit([
      {
        current: false
      }, true, false, true
    ], function() {
      send(a, [1]);
      send(b, [1]);
      send(b, [1]);
      send(a, [1]);
      return send(a, [1]);
    });
  });
  it('property and stream', function() {
    var a, b;
    a = send(prop(), [1]);
    b = stream();
    return expect(a.awaiting(b)).toEmit([
      {
        current: true
      }, false, true
    ], function() {
      send(a, [1]);
      send(b, [1]);
      send(b, [1]);
      send(a, [1]);
      return send(a, [1]);
    });
  });
  return it('property and property', function() {
    var a, b;
    a = send(prop(), [1]);
    b = send(prop(), [1]);
    return expect(a.awaiting(b)).toEmit([
      {
        current: false
      }, true, false, true
    ], function() {
      send(a, [1]);
      send(b, [1]);
      send(b, [1]);
      send(a, [1]);
      return send(a, [1]);
    });
  });
});



},{"../test-helpers.coffee":88}],78:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('takeUntilBy', function() {
  describe('stream, stream', function() {
    it('should return a stream', function() {
      return expect(stream().takeUntilBy(stream())).toBeStream();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.takeUntilBy(b)).toActivate(a, b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(stream(), ['<end>']).takeUntilBy(stream())).toEmit(['<end:current>']);
    });
    it('should not be ended if secondary was ended', function() {
      return expect(stream().takeUntilBy(send(stream(), ['<end>']))).toEmit([]);
    });
    it('should not end when secondary ends if there was no values from it', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.takeUntilBy(b)).toEmit([], function() {
        return send(b, ['<end>']);
      });
    });
    it('should end on first any value from secondary', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.takeUntilBy(b)).toEmit(['<end>'], function() {
        return send(b, [0]);
      });
    });
    it('should emit values from primary until first value from secondary', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.takeUntilBy(b)).toEmit([1, 2], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should take values as expected', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.takeUntilBy(b)).toEmit([3, 4, '<end>'], function() {
        send(a, [3, 4]);
        send(b, [0]);
        send(a, [5, 6]);
        send(b, [false]);
        send(a, [7, 8]);
        send(b, [true]);
        return send(a, [9]);
      });
    });
  });
  describe('stream, property', function() {
    it('should return a stream', function() {
      return expect(stream().takeUntilBy(prop())).toBeStream();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.takeUntilBy(b)).toActivate(a, b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(stream(), ['<end>']).takeUntilBy(prop())).toEmit(['<end:current>']);
    });
    it('should not be ended if secondary was ended and has no current', function() {
      return expect(stream().takeUntilBy(send(prop(), ['<end>']))).toEmit([]);
    });
    it('should be ended if secondary was ended and has any current', function() {
      return expect(stream().takeUntilBy(send(prop(), [0, '<end>']))).toEmit(['<end:current>']);
    });
    it('should end on first any value from secondary', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.takeUntilBy(b)).toEmit(['<end>'], function() {
        return send(b, [0]);
      });
    });
    it('should not end when secondary ends there was no values from it', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.takeUntilBy(b)).toEmit([], function() {
        return send(b, ['<end>']);
      });
    });
    it('should emit values from primary until first value from secondary', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.takeUntilBy(b)).toEmit([1, 2], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should take values as expected', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.takeUntilBy(b)).toEmit([3, 4, '<end>'], function() {
        send(a, [3, 4]);
        send(b, [0]);
        send(a, [5, 6]);
        send(b, [false]);
        send(a, [7, 8]);
        send(b, [true]);
        return send(a, [9]);
      });
    });
  });
  describe('property, stream', function() {
    it('should return a property', function() {
      return expect(prop().takeUntilBy(stream())).toBeProperty();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.takeUntilBy(b)).toActivate(a, b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(prop(), ['<end>']).takeUntilBy(stream())).toEmit(['<end:current>']);
    });
    it('should not be ended if secondary was ended', function() {
      return expect(prop().takeUntilBy(send(stream(), ['<end>']))).toEmit([]);
    });
    it('should not end when secondary ends if there was no values from it', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.takeUntilBy(b)).toEmit([], function() {
        return send(b, ['<end>']);
      });
    });
    it('should end on first any value from secondary', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.takeUntilBy(b)).toEmit(['<end>'], function() {
        return send(b, [0]);
      });
    });
    it('should emit values from primary until first value from secondary', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.takeUntilBy(b)).toEmit([1, 2], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should take values as expected', function() {
      var a, b;
      a = send(prop(), [0]);
      b = stream();
      return expect(a.takeUntilBy(b)).toEmit([
        {
          current: 0
        }, 3, 4, '<end>'
      ], function() {
        send(a, [3, 4]);
        send(b, [1]);
        send(a, [5, 6]);
        send(b, [false]);
        send(a, [7, 8]);
        send(b, [true]);
        return send(a, [9]);
      });
    });
  });
  return describe('property, property', function() {
    it('should return a property', function() {
      return expect(prop().takeUntilBy(prop())).toBeProperty();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.takeUntilBy(b)).toActivate(a, b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(prop(), ['<end>']).takeUntilBy(prop())).toEmit(['<end:current>']);
    });
    it('should not be ended if secondary was ended and has no current', function() {
      return expect(prop().takeUntilBy(send(prop(), ['<end>']))).toEmit([]);
    });
    it('should be ended if secondary was ended and has any current', function() {
      return expect(prop().takeUntilBy(send(prop(), [0, '<end>']))).toEmit(['<end:current>']);
    });
    it('should end on first any value from secondary', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.takeUntilBy(b)).toEmit(['<end>'], function() {
        return send(b, [0]);
      });
    });
    it('should not end when secondary ends if there was no values from it', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.takeUntilBy(b)).toEmit([], function() {
        return send(b, ['<end>']);
      });
    });
    it('should emit values from primary until first value from secondary', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.takeUntilBy(b)).toEmit([1, 2], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should take values as expected', function() {
      var a, b;
      a = send(prop(), [0]);
      b = prop();
      return expect(a.takeUntilBy(b)).toEmit([
        {
          current: 0
        }, 3, 4, '<end>'
      ], function() {
        send(a, [3, 4]);
        send(b, [1]);
        send(a, [5, 6]);
        send(b, [false]);
        send(a, [7, 8]);
        send(b, [true]);
        return send(a, [9]);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],79:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('takeWhileBy', function() {
  describe('stream, stream', function() {
    it('should return a stream', function() {
      return expect(stream().takeWhileBy(stream())).toBeStream();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.takeWhileBy(b)).toActivate(a, b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(stream(), ['<end>']).takeWhileBy(stream())).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended', function() {
      return expect(stream().takeWhileBy(send(stream(), ['<end>']))).toEmit(['<end:current>']);
    });
    it('should not end when secondary ends if only value from it was truthy', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.takeWhileBy(b)).toEmit([], function() {
        return send(b, [true, '<end>']);
      });
    });
    it('should end on first falsey value from secondary', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.takeWhileBy(b)).toEmit(['<end>'], function() {
        return send(b, [true, false]);
      });
    });
    it('should ignore values from primary until first value from secondary', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.takeWhileBy(b)).toEmit([], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should take values as expected', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.takeWhileBy(b)).toEmit([3, 4, 5, 6, '<end>'], function() {
        send(b, [true]);
        send(a, [3, 4]);
        send(b, [1]);
        send(a, [5, 6]);
        send(b, [false]);
        send(a, [7, 8]);
        send(b, [true]);
        return send(a, [9]);
      });
    });
  });
  describe('stream, property', function() {
    it('should return a stream', function() {
      return expect(stream().takeWhileBy(prop())).toBeStream();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.takeWhileBy(b)).toActivate(a, b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(stream(), ['<end>']).takeWhileBy(prop())).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended and has no current', function() {
      return expect(stream().takeWhileBy(send(prop(), ['<end>']))).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended and has falsey current', function() {
      return expect(stream().takeWhileBy(send(prop(), [false, '<end>']))).toEmit(['<end:current>']);
    });
    it('should not be ended if secondary was ended but has truthy current', function() {
      return expect(stream().takeWhileBy(send(prop(), [true, '<end>']))).toEmit([]);
    });
    it('should end on first falsey value from secondary', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.takeWhileBy(b)).toEmit(['<end>'], function() {
        return send(b, [true, false]);
      });
    });
    it('should not end when secondary ends if only value from it was truthy', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.takeWhileBy(b)).toEmit([], function() {
        return send(b, [true, '<end>']);
      });
    });
    it('should ignore values from primary until first value from secondary', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.takeWhileBy(b)).toEmit([], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should take values as expected', function() {
      var a, b;
      a = stream();
      b = prop();
      return expect(a.takeWhileBy(b)).toEmit([3, 4, 5, 6, '<end>'], function() {
        send(b, [true]);
        send(a, [3, 4]);
        send(b, [1]);
        send(a, [5, 6]);
        send(b, [false]);
        send(a, [7, 8]);
        send(b, [true]);
        return send(a, [9]);
      });
    });
  });
  describe('property, stream', function() {
    it('should return a property', function() {
      return expect(prop().takeWhileBy(stream())).toBeProperty();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.takeWhileBy(b)).toActivate(a, b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(prop(), ['<end>']).takeWhileBy(stream())).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended', function() {
      return expect(prop().takeWhileBy(send(stream(), ['<end>']))).toEmit(['<end:current>']);
    });
    it('should not end when secondary ends if only value from it was truthy', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.takeWhileBy(b)).toEmit([], function() {
        return send(b, [true, '<end>']);
      });
    });
    it('should end on first falsey value from secondary', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.takeWhileBy(b)).toEmit(['<end>'], function() {
        return send(b, [true, false]);
      });
    });
    it('should ignore values from primary until first value from secondary', function() {
      var a, b;
      a = prop();
      b = stream();
      return expect(a.takeWhileBy(b)).toEmit([], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should take values as expected', function() {
      var a, b;
      a = send(prop(), [0]);
      b = stream();
      return expect(a.takeWhileBy(b)).toEmit([3, 4, 5, 6, '<end>'], function() {
        send(b, [true]);
        send(a, [3, 4]);
        send(b, [1]);
        send(a, [5, 6]);
        send(b, [false]);
        send(a, [7, 8]);
        send(b, [true]);
        return send(a, [9]);
      });
    });
  });
  return describe('property, property', function() {
    it('should return a property', function() {
      return expect(prop().takeWhileBy(prop())).toBeProperty();
    });
    it('should activate/deactivate sources', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.takeWhileBy(b)).toActivate(a, b);
    });
    it('should be ended if primary was ended', function() {
      return expect(send(prop(), ['<end>']).takeWhileBy(prop())).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended and has no current', function() {
      return expect(prop().takeWhileBy(send(prop(), ['<end>']))).toEmit(['<end:current>']);
    });
    it('should be ended if secondary was ended and has falsey current', function() {
      return expect(prop().takeWhileBy(send(prop(), [false, '<end>']))).toEmit(['<end:current>']);
    });
    it('should not be ended if secondary was ended but has truthy current', function() {
      return expect(prop().takeWhileBy(send(prop(), [true, '<end>']))).toEmit([]);
    });
    it('should end on first falsey value from secondary', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.takeWhileBy(b)).toEmit(['<end>'], function() {
        return send(b, [true, false]);
      });
    });
    it('should not end when secondary ends if only value from it was truthy', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.takeWhileBy(b)).toEmit([], function() {
        return send(b, [true, '<end>']);
      });
    });
    it('should ignore values from primary until first value from secondary', function() {
      var a, b;
      a = prop();
      b = prop();
      return expect(a.takeWhileBy(b)).toEmit([], function() {
        return send(a, [1, 2]);
      });
    });
    return it('should take values as expected', function() {
      var a, b;
      a = send(prop(), [0]);
      b = send(prop(), [true]);
      return expect(a.takeWhileBy(b)).toEmit([
        {
          current: 0
        }, 3, 4, 5, 6, '<end>'
      ], function() {
        send(a, [3, 4]);
        send(b, [1]);
        send(a, [5, 6]);
        send(b, [false]);
        send(a, [7, 8]);
        send(b, [true]);
        return send(a, [9]);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],80:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('takeWhile', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().takeWhile(function() {
        return true;
      })).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.takeWhile(function() {
        return true;
      })).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).takeWhile(function() {
        return true;
      })).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.takeWhile(function(x) {
        return x < 4;
      })).toEmit([1, 2, 3, '<end>'], function() {
        return send(a, [1, 2, 3, 4, 5, '<end>']);
      });
    });
    it('should handle events (natural end)', function() {
      var a;
      a = stream();
      return expect(a.takeWhile(function(x) {
        return x < 4;
      })).toEmit([1, 2, '<end>'], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
    it('should handle events (with `-> false`)', function() {
      var a;
      a = stream();
      return expect(a.takeWhile(function() {
        return false;
      })).toEmit(['<end>'], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
    return it('shoud use id as default predicate', function() {
      var a;
      a = stream();
      return expect(a.takeWhile()).toEmit([1, 2, '<end>'], function() {
        return send(a, [1, 2, 0, 5, '<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().takeWhile(function() {
        return true;
      })).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.takeWhile(function() {
        return true;
      })).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).takeWhile(function() {
        return true;
      })).toEmit(['<end:current>']);
    });
    it('should be ended if calback was `-> false` and source has a current', function() {
      return expect(send(prop(), [1]).takeWhile(function() {
        return false;
      })).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.takeWhile(function(x) {
        return x < 4;
      })).toEmit([
        {
          current: 1
        }, 2, 3, '<end>'
      ], function() {
        return send(a, [2, 3, 4, 5, '<end>']);
      });
    });
    it('should handle events (natural end)', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.takeWhile(function(x) {
        return x < 4;
      })).toEmit([
        {
          current: 1
        }, 2, '<end>'
      ], function() {
        return send(a, [2, '<end>']);
      });
    });
    it('should handle events (with `-> false`)', function() {
      var a;
      a = prop();
      return expect(a.takeWhile(function() {
        return false;
      })).toEmit(['<end>'], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
    return it('shoud use id as default predicate', function() {
      var a;
      a = send(prop(), [1]);
      expect(a.takeWhile()).toEmit([
        {
          current: 1
        }, 2, '<end>'
      ], function() {
        return send(a, [2, 0, 5, '<end>']);
      });
      a = send(prop(), [0]);
      return expect(a.takeWhile()).toEmit(['<end:current>'], function() {
        return send(a, [2, 0, 5, '<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],81:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('take', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().take(3)).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.take(3)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).take(3)).toEmit(['<end:current>']);
    });
    it('should be ended if `n` is 0', function() {
      return expect(stream().take(0)).toEmit(['<end:current>']);
    });
    it('should handle events (less than `n`)', function() {
      var a;
      a = stream();
      return expect(a.take(3)).toEmit([1, 2, '<end>'], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
    return it('should handle events (more than `n`)', function() {
      var a;
      a = stream();
      return expect(a.take(3)).toEmit([1, 2, 3, '<end>'], function() {
        return send(a, [1, 2, 3, 4, 5, '<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().take(3)).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.take(3)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).take(3)).toEmit(['<end:current>']);
    });
    it('should be ended if `n` is 0', function() {
      return expect(prop().take(0)).toEmit(['<end:current>']);
    });
    it('should handle events and current (less than `n`)', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.take(3)).toEmit([
        {
          current: 1
        }, 2, '<end>'
      ], function() {
        return send(a, [2, '<end>']);
      });
    });
    it('should handle events and current (more than `n`)', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.take(3)).toEmit([
        {
          current: 1
        }, 2, 3, '<end>'
      ], function() {
        return send(a, [2, 3, 4, 5, '<end>']);
      });
    });
    return it('should work correctly with .constant', function() {
      return expect(Kefir.constant(1).take(1)).toEmit([
        {
          current: 1
        }, '<end:current>'
      ]);
    });
  });
});



},{"../test-helpers.coffee":88}],82:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('throttle', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().throttle(100)).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.throttle(100)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).throttle(100)).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.throttle(100)).toEmitInTime([[0, 1], [100, 4], [200, 5], [320, 6], [520, 7], [620, 9], [620, '<end>']], function(tick) {
        send(a, [1]);
        tick(30);
        send(a, [2]);
        tick(30);
        send(a, [3]);
        tick(30);
        send(a, [4]);
        tick(30);
        send(a, [5]);
        tick(200);
        send(a, [6]);
        tick(200);
        send(a, [7]);
        tick(30);
        send(a, [8]);
        tick(30);
        send(a, [9]);
        tick(30);
        return send(a, ['<end>']);
      });
    });
    it('should handle events {trailing: false}', function() {
      var a;
      a = stream();
      return expect(a.throttle(100, {
        trailing: false
      })).toEmitInTime([[0, 1], [120, 5], [320, 6], [520, 7], [610, '<end>']], function(tick) {
        send(a, [1]);
        tick(30);
        send(a, [2]);
        tick(30);
        send(a, [3]);
        tick(30);
        send(a, [4]);
        tick(30);
        send(a, [5]);
        tick(200);
        send(a, [6]);
        tick(200);
        send(a, [7]);
        tick(30);
        send(a, [8]);
        tick(30);
        send(a, [9]);
        tick(30);
        return send(a, ['<end>']);
      });
    });
    it('should handle events {leading: false}', function() {
      var a;
      a = stream();
      return expect(a.throttle(100, {
        leading: false
      })).toEmitInTime([[100, 4], [220, 5], [420, 6], [620, 9], [620, '<end>']], function(tick) {
        send(a, [1]);
        tick(30);
        send(a, [2]);
        tick(30);
        send(a, [3]);
        tick(30);
        send(a, [4]);
        tick(30);
        send(a, [5]);
        tick(200);
        send(a, [6]);
        tick(200);
        send(a, [7]);
        tick(30);
        send(a, [8]);
        tick(30);
        send(a, [9]);
        tick(30);
        return send(a, ['<end>']);
      });
    });
    return it('should handle events {leading: false, trailing: false}', function() {
      var a;
      a = stream();
      return expect(a.throttle(100, {
        leading: false,
        trailing: false
      })).toEmitInTime([[120, 5], [320, 6], [520, 7], [610, '<end>']], function(tick) {
        send(a, [1]);
        tick(30);
        send(a, [2]);
        tick(30);
        send(a, [3]);
        tick(30);
        send(a, [4]);
        tick(30);
        send(a, [5]);
        tick(200);
        send(a, [6]);
        tick(200);
        send(a, [7]);
        tick(30);
        send(a, [8]);
        tick(30);
        send(a, [9]);
        tick(30);
        return send(a, ['<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().throttle(100)).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.throttle(100)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).throttle(100)).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a;
      a = send(prop(), [0]);
      return expect(a.throttle(100)).toEmitInTime([
        [
          0, {
            current: 0
          }
        ], [0, 1], [100, 4], [200, 5], [320, 6], [520, 7], [620, 9], [620, '<end>']
      ], function(tick) {
        send(a, [1]);
        tick(30);
        send(a, [2]);
        tick(30);
        send(a, [3]);
        tick(30);
        send(a, [4]);
        tick(30);
        send(a, [5]);
        tick(200);
        send(a, [6]);
        tick(200);
        send(a, [7]);
        tick(30);
        send(a, [8]);
        tick(30);
        send(a, [9]);
        tick(30);
        return send(a, ['<end>']);
      });
    });
    it('should handle events {trailing: false}', function() {
      var a;
      a = send(prop(), [0]);
      return expect(a.throttle(100, {
        trailing: false
      })).toEmitInTime([
        [
          0, {
            current: 0
          }
        ], [0, 1], [120, 5], [320, 6], [520, 7], [610, '<end>']
      ], function(tick) {
        send(a, [1]);
        tick(30);
        send(a, [2]);
        tick(30);
        send(a, [3]);
        tick(30);
        send(a, [4]);
        tick(30);
        send(a, [5]);
        tick(200);
        send(a, [6]);
        tick(200);
        send(a, [7]);
        tick(30);
        send(a, [8]);
        tick(30);
        send(a, [9]);
        tick(30);
        return send(a, ['<end>']);
      });
    });
    it('should handle events {leading: false}', function() {
      var a;
      a = send(prop(), [0]);
      return expect(a.throttle(100, {
        leading: false
      })).toEmitInTime([
        [
          0, {
            current: 0
          }
        ], [100, 4], [220, 5], [420, 6], [620, 9], [620, '<end>']
      ], function(tick) {
        send(a, [1]);
        tick(30);
        send(a, [2]);
        tick(30);
        send(a, [3]);
        tick(30);
        send(a, [4]);
        tick(30);
        send(a, [5]);
        tick(200);
        send(a, [6]);
        tick(200);
        send(a, [7]);
        tick(30);
        send(a, [8]);
        tick(30);
        send(a, [9]);
        tick(30);
        return send(a, ['<end>']);
      });
    });
    return it('should handle events {leading: false, trailing: false}', function() {
      var a;
      a = send(prop(), [0]);
      return expect(a.throttle(100, {
        leading: false,
        trailing: false
      })).toEmitInTime([
        [
          0, {
            current: 0
          }
        ], [120, 5], [320, 6], [520, 7], [610, '<end>']
      ], function(tick) {
        send(a, [1]);
        tick(30);
        send(a, [2]);
        tick(30);
        send(a, [3]);
        tick(30);
        send(a, [4]);
        tick(30);
        send(a, [5]);
        tick(200);
        send(a, [6]);
        tick(200);
        send(a, [7]);
        tick(30);
        send(a, [8]);
        tick(30);
        send(a, [9]);
        tick(30);
        return send(a, ['<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],83:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('timestamp', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().timestamp()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.timestamp()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).timestamp()).toEmit(['<end:current>']);
    });
    return it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.timestamp()).toEmitInTime([
        [
          0, {
            value: 1,
            time: 10000
          }
        ], [
          50, {
            value: 2,
            time: 10050
          }
        ], [150, '<end>']
      ], function(tick) {
        send(a, [1]);
        tick(50);
        send(a, [2]);
        tick(100);
        return send(a, ['<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().timestamp()).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.timestamp()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).timestamp()).toEmit(['<end:current>']);
    });
    return it('should handle events and current', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.timestamp()).toEmitInTime([
        [
          0, {
            current: {
              value: 1,
              time: 10000
            }
          }
        ], [
          0, {
            value: 2,
            time: 10000
          }
        ], [
          50, {
            value: 3,
            time: 10050
          }
        ], [150, '<end>']
      ], function(tick) {
        send(a, [2]);
        tick(50);
        send(a, [3]);
        tick(100);
        return send(a, ['<end>']);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],84:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('toProperty', function() {
  describe('stream', function() {
    it('should return property', function() {
      return expect(stream().toProperty()).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.toProperty()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).toProperty()).toEmit(['<end:current>']);
    });
    it('should be ended if source was ended (with current)', function() {
      return expect(send(stream(), ['<end>']).toProperty(0)).toEmit([
        {
          current: 0
        }, '<end:current>'
      ]);
    });
    return it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.toProperty(0)).toEmit([
        {
          current: 0
        }, 1, 2, '<end>'
      ], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
  });
  return describe('property', function() {
    return it('should not have .toProperty method', function() {
      return expect(prop().toProperty).toBe(void 0);
    });
  });
});



},{"../test-helpers.coffee":88}],85:[function(require,module,exports){
var Kefir, comp, noop, prop, send, stream, testWithLib, _ref,
  __slice = [].slice;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

comp = function() {
  var fns;
  fns = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return function(x) {
    var f, _i, _len, _ref1;
    _ref1 = fns.slice(0).reverse();
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      f = _ref1[_i];
      x = f(x);
    }
    return x;
  };
};

testWithLib = function(name, t) {
  return describe("with " + name + " implementation", function() {
    describe('stream', function() {
      it('`map` should work', function() {
        var a;
        a = stream();
        return expect(a.transduce(t.map(function(x) {
          return x * 2;
        }))).toEmit([2, 4, 6, '<end>'], function() {
          return send(a, [1, 2, 3, '<end>']);
        });
      });
      it('`filter` should work', function() {
        var a;
        a = stream();
        return expect(a.transduce(t.filter(function(x) {
          return x % 2 === 0;
        }))).toEmit([2, 4, '<end>'], function() {
          return send(a, [1, 2, 3, 4, '<end>']);
        });
      });
      it('`take` should work', function() {
        var a;
        a = stream();
        expect(a.transduce(t.take(2))).toEmit([1, 2, '<end>'], function() {
          return send(a, [1, 2, 3, 4]);
        });
        a = stream();
        return expect(a.transduce(t.take(2))).toEmit([1, '<end>'], function() {
          return send(a, [1, '<end>']);
        });
      });
      it('`map.filter.take` should work', function() {
        var a, tr;
        tr = comp(t.map(function(x) {
          return x + 10;
        }), t.filter(function(x) {
          return x % 2 === 0;
        }), t.take(2));
        a = stream();
        return expect(a.transduce(tr)).toEmit([12, 14, '<end>'], function() {
          return send(a, [1, 2, 3, 4, 5, 6]);
        });
      });
      if (t.partitionAll) {
        it('`partitionAll` should work', function() {
          var a;
          a = stream();
          expect(a.transduce(t.partitionAll(2))).toEmit([[1, 2], [3, 4], '<end>'], function() {
            return send(a, [1, 2, 3, 4, '<end>']);
          });
          a = stream();
          return expect(a.transduce(t.partitionAll(2))).toEmit([[1, 2], [3], '<end>'], function() {
            return send(a, [1, 2, 3, '<end>']);
          });
        });
        return it('`take.partitionAll` should work', function() {
          var a, tr;
          tr = comp(t.take(3), t.partitionAll(2));
          a = stream();
          expect(a.transduce(tr)).toEmit([[1, 2], [3], '<end>'], function() {
            return send(a, [1, 2, 3, 4, '<end>']);
          });
          tr = comp(t.take(2), t.partitionAll(2));
          a = stream();
          return expect(a.transduce(tr)).toEmit([[1, 2], '<end>'], function() {
            return send(a, [1, 2, 3, 4, '<end>']);
          });
        });
      }
    });
    return describe('property', function() {
      it('`map` should work', function() {
        var a;
        a = send(prop(), [1]);
        return expect(a.transduce(t.map(function(x) {
          return x * 2;
        }))).toEmit([
          {
            current: 2
          }, 4, 6, '<end>'
        ], function() {
          return send(a, [2, 3, '<end>']);
        });
      });
      it('`filter` should work', function() {
        var a;
        a = send(prop(), [1]);
        expect(a.transduce(t.filter(function(x) {
          return x % 2 === 0;
        }))).toEmit([2, 4, '<end>'], function() {
          return send(a, [2, 3, 4, '<end>']);
        });
        a = send(prop(), [2]);
        return expect(a.transduce(t.filter(function(x) {
          return x % 2 === 0;
        }))).toEmit([
          {
            current: 2
          }, 4, '<end>'
        ], function() {
          return send(a, [1, 3, 4, '<end>']);
        });
      });
      it('`take` should work', function() {
        var a;
        a = send(prop(), [1]);
        expect(a.transduce(t.take(2))).toEmit([
          {
            current: 1
          }, 2, '<end>'
        ], function() {
          return send(a, [2, 3, 4]);
        });
        a = send(prop(), [1]);
        return expect(a.transduce(t.take(3))).toEmit([
          {
            current: 1
          }, 2, '<end>'
        ], function() {
          return send(a, [2, '<end>']);
        });
      });
      it('`map.filter.take` should work', function() {
        var a, tr;
        tr = comp(t.map(function(x) {
          return x + 10;
        }), t.filter(function(x) {
          return x % 2 === 0;
        }), t.take(2));
        a = send(prop(), [1]);
        expect(a.transduce(tr)).toEmit([12, 14, '<end>'], function() {
          return send(a, [2, 3, 4, 5, 6]);
        });
        a = send(prop(), [2]);
        return expect(a.transduce(tr)).toEmit([
          {
            current: 12
          }, 14, '<end>'
        ], function() {
          return send(a, [1, 3, 4, 5, 6]);
        });
      });
      if (t.partitionAll) {
        it('`partitionAll` should work', function() {
          var a;
          a = send(prop(), [1]);
          expect(a.transduce(t.partitionAll(2))).toEmit([[1, 2], [3, 4], '<end>'], function() {
            return send(a, [2, 3, 4, '<end>']);
          });
          a = send(prop(), [1]);
          return expect(a.transduce(t.partitionAll(2))).toEmit([[1, 2], [3], '<end>'], function() {
            return send(a, [2, 3, '<end>']);
          });
        });
        return it('`take.partitionAll` should work', function() {
          var a, tr;
          tr = comp(t.take(3), t.partitionAll(2));
          a = send(prop(), [1]);
          expect(a.transduce(tr)).toEmit([[1, 2], [3], '<end>'], function() {
            return send(a, [2, 3, 4, '<end>']);
          });
          tr = comp(t.take(2), t.partitionAll(2));
          a = send(prop(), [1]);
          return expect(a.transduce(tr)).toEmit([[1, 2], '<end>'], function() {
            return send(a, [2, 3, 4, '<end>']);
          });
        });
      }
    });
  });
};

noop = function(x) {
  return x;
};

describe('transduce', function() {
  describe('with `noop` transducer', function() {
    describe('stream', function() {
      it('should return stream', function() {
        return expect(stream().transduce(noop)).toBeStream();
      });
      it('should activate/deactivate source', function() {
        var a;
        a = stream();
        return expect(a.transduce(noop)).toActivate(a);
      });
      it('should be ended if source was ended', function() {
        return expect(send(stream(), ['<end>']).transduce(noop)).toEmit(['<end:current>']);
      });
      return it('should handle events', function() {
        var a;
        a = stream();
        return expect(a.transduce(noop)).toEmit([1, 2, 3, '<end>'], function() {
          return send(a, [1, 2, 3, '<end>']);
        });
      });
    });
    return describe('property', function() {
      it('should return property', function() {
        return expect(prop().transduce(noop)).toBeProperty();
      });
      it('should activate/deactivate source', function() {
        var a;
        a = prop();
        return expect(a.transduce(noop)).toActivate(a);
      });
      it('should be ended if source was ended', function() {
        return expect(send(prop(), ['<end>']).transduce(noop)).toEmit(['<end:current>']);
      });
      return it('should handle events and current', function() {
        var a;
        a = send(prop(), [1]);
        return expect(a.transduce(noop)).toEmit([
          {
            current: 1
          }, 2, 3, '<end>'
        ], function() {
          return send(a, [2, 3, '<end>']);
        });
      });
    });
  });
  testWithLib('Cognitect Labs', require('transducers-js'));
  return testWithLib('James Long\'s', require('transducers.js'));
});



},{"../test-helpers.coffee":88,"transducers-js":32,"transducers.js":33}],86:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('withHandler', function() {
  var duplicate, mirror;
  mirror = function(emitter, event) {
    if (event.type === 'value') {
      return emitter.emit(event.value);
    } else {
      return emitter.end();
    }
  };
  duplicate = function(emitter, event) {
    if (event.type === 'value') {
      emitter.emit(event.value);
      if (!event.current) {
        return emitter.emit(event.value);
      }
    } else {
      return emitter.end();
    }
  };
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().withHandler(function() {})).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.withHandler(function() {})).toActivate(a);
    });
    it('should not be ended if source was ended (by default)', function() {
      return expect(send(stream(), ['<end>']).withHandler(function() {})).toEmit([]);
    });
    it('should be ended if source was ended (with `mirror` handler)', function() {
      return expect(send(stream(), ['<end>']).withHandler(mirror)).toEmit(['<end:current>']);
    });
    it('should handle events (with `duplicate` handler)', function() {
      var a;
      a = stream();
      return expect(a.withHandler(duplicate)).toEmit([1, 1, 2, 2, '<end>'], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
    return it('should automatically preserve isCurent (end)', function() {
      var a;
      a = stream();
      expect(a.withHandler(mirror)).toEmit(['<end>'], function() {
        return send(a, ['<end>']);
      });
      return expect(a.withHandler(mirror)).toEmit(['<end:current>']);
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().withHandler(function() {})).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.withHandler(function() {})).toActivate(a);
    });
    it('should not be ended if source was ended (by default)', function() {
      return expect(send(prop(), ['<end>']).withHandler(function() {})).toEmit([]);
    });
    it('should be ended if source was ended (with `mirror` handler)', function() {
      return expect(send(prop(), ['<end>']).withHandler(mirror)).toEmit(['<end:current>']);
    });
    it('should handle events and current (with `duplicate` handler)', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.withHandler(duplicate)).toEmit([
        {
          current: 1
        }, 2, 2, 3, 3, '<end>'
      ], function() {
        return send(a, [2, 3, '<end>']);
      });
    });
    it('should automatically preserve isCurent (end)', function() {
      var a;
      a = prop();
      expect(a.withHandler(mirror)).toEmit(['<end>'], function() {
        return send(a, ['<end>']);
      });
      return expect(a.withHandler(mirror)).toEmit(['<end:current>']);
    });
    return it('should automatically preserve isCurent (value)', function() {
      var a, savedEmitter;
      a = prop();
      expect(a.withHandler(mirror)).toEmit([1], function() {
        return send(a, [1]);
      });
      expect(a.withHandler(mirror)).toEmit([
        {
          current: 1
        }
      ]);
      savedEmitter = null;
      return expect(a.withHandler(function(emitter, event) {
        mirror(emitter, event);
        return savedEmitter = emitter;
      })).toEmit([
        {
          current: 1
        }, 2
      ], function() {
        return savedEmitter.emit(2);
      });
    });
  });
});



},{"../test-helpers.coffee":88}],87:[function(require,module,exports){
var Kefir;

Kefir = require('kefir');

describe('withInterval', function() {
  it('should return stream', function() {
    return expect(Kefir.withInterval(100, function() {})).toBeStream();
  });
  return it('should work as expected', function() {
    var fn, i;
    i = 0;
    fn = function(emitter) {
      i++;
      emitter.emit(i);
      emitter.emit(i * 2);
      if (i === 3) {
        return emitter.end();
      }
    };
    return expect(Kefir.withInterval(100, fn)).toEmitInTime([[100, 1], [100, 2], [200, 2], [200, 4], [300, 3], [300, 6], [300, '<end>']]);
  });
});



},{"kefir":90}],88:[function(require,module,exports){
var Kefir, getCurrent, logItem, sinon, _activateHelper,
  __slice = [].slice;

Kefir = require("../dist/kefir");

sinon = require('sinon');

exports.Kefir = Kefir;

logItem = function(event) {
  if (event.type === 'value') {
    if (event.current) {
      return {
        current: event.value
      };
    } else {
      return event.value;
    }
  } else {
    if (event.current) {
      return '<end:current>';
    } else {
      return '<end>';
    }
  }
};

exports.watch = function(obs) {
  var log;
  log = [];
  obs.onAny(function(event) {
    return log.push(logItem(event));
  });
  return log;
};

exports.watchWithTime = function(obs) {
  var log, startTime;
  startTime = new Date();
  log = [];
  obs.onAny(function(event) {
    return log.push([new Date() - startTime, logItem(event)]);
  });
  return log;
};

exports.send = function(obs, events) {
  var event, _i, _len;
  for (_i = 0, _len = events.length; _i < _len; _i++) {
    event = events[_i];
    if (event === '<end>') {
      obs._send('end');
    } else {
      obs._send('value', event);
    }
  }
  return obs;
};

_activateHelper = function() {};

exports.activate = function(obs) {
  obs.onEnd(_activateHelper);
  return obs;
};

exports.deactivate = function(obs) {
  obs.offEnd(_activateHelper);
  return obs;
};

exports.prop = function() {
  return new Kefir.Property();
};

exports.stream = function() {
  return new Kefir.Stream();
};

exports.withFakeTime = function(cb) {
  var clock;
  clock = sinon.useFakeTimers(10000);
  cb(function(t) {
    return clock.tick(t);
  });
  return clock.restore();
};

exports.inBrowser = (typeof window !== "undefined" && window !== null) && (typeof document !== "undefined" && document !== null);

exports.withDOM = function(cb) {
  var div;
  div = document.createElement('div');
  document.body.appendChild(div);
  cb(div);
  return document.body.removeChild(div);
};

getCurrent = function(prop) {
  var save, val;
  val = getCurrent.NOTHING;
  save = function(x, isCurrent) {
    if (isCurrent) {
      return val = x;
    }
  };
  prop.on('value', save);
  prop.off('value', save);
  return val;
};

getCurrent.NOTHING = ['<getCurrent.NOTHING>'];

beforeEach(function() {
  return this.addMatchers({
    toBeProperty: function() {
      this.message = function() {
        return "Expected " + (this.actual.toString()) + " to be instance of Property";
      };
      return this.actual instanceof Kefir.Property;
    },
    toBeStream: function() {
      this.message = function() {
        return "Expected " + (this.actual.toString()) + " to be instance of Stream";
      };
      return this.actual instanceof Kefir.Stream;
    },
    toBeActive: function() {
      return this.actual._active;
    },
    toEmit: function(expectedLog, cb) {
      var log;
      log = exports.watch(this.actual);
      if (typeof cb === "function") {
        cb();
      }
      this.message = function() {
        return "Expected to emit " + (jasmine.pp(expectedLog)) + ", actually emitted " + (jasmine.pp(log));
      };
      return this.env.equals_(expectedLog, log);
    },
    toEmitInTime: function(expectedLog, cb, timeLimit) {
      var log;
      if (timeLimit == null) {
        timeLimit = 10000;
      }
      log = null;
      exports.withFakeTime((function(_this) {
        return function(tick) {
          log = exports.watchWithTime(_this.actual);
          if (typeof cb === "function") {
            cb(tick);
          }
          return tick(timeLimit);
        };
      })(this));
      this.message = function() {
        return "Expected to emit " + (jasmine.pp(expectedLog)) + ", actually emitted " + (jasmine.pp(log));
      };
      return this.env.equals_(expectedLog, log);
    },
    toHasNoCurrent: function() {
      return getCurrent(this.actual) === getCurrent.NOTHING;
    },
    toHasCurrent: function(x) {
      return getCurrent(this.actual) === x;
    },
    toHasEqualCurrent: function(x) {
      return this.env.equals_(x, getCurrent(this.actual));
    },
    toActivate: function() {
      var allTrue, condition, conditions, obs, obss, _i, _len;
      obss = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      conditions = [];
      conditions.push.apply(conditions, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = obss.length; _i < _len; _i++) {
          obs = obss[_i];
          _results.push(!obs._active);
        }
        return _results;
      })());
      exports.activate(this.actual);
      conditions.push.apply(conditions, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = obss.length; _i < _len; _i++) {
          obs = obss[_i];
          _results.push(obs._active);
        }
        return _results;
      })());
      exports.deactivate(this.actual);
      conditions.push.apply(conditions, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = obss.length; _i < _len; _i++) {
          obs = obss[_i];
          _results.push(!obs._active);
        }
        return _results;
      })());
      exports.activate(this.actual);
      conditions.push.apply(conditions, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = obss.length; _i < _len; _i++) {
          obs = obss[_i];
          _results.push(obs._active);
        }
        return _results;
      })());
      exports.deactivate(this.actual);
      conditions.push.apply(conditions, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = obss.length; _i < _len; _i++) {
          obs = obss[_i];
          _results.push(!obs._active);
        }
        return _results;
      })());
      allTrue = true;
      for (_i = 0, _len = conditions.length; _i < _len; _i++) {
        condition = conditions[_i];
        allTrue = allTrue && condition;
      }
      this.message = function() {
        var obssString;
        obssString = ((function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = obss.length; _j < _len1; _j++) {
            obs = obss[_j];
            _results.push(obs.toString());
          }
          return _results;
        })()).join(', ');
        return "Expected " + (this.actual.toString()) + " to activate " + obssString + " (results: " + (jasmine.pp(conditions)) + ")";
      };
      return allTrue;
    }
  });
});



},{"../dist/kefir":1,"sinon":7}],89:[function(require,module,exports){
/*! An addon for Kefir.js v0.4.0
 *  https://github.com/pozadi/kefir
 */
;(function(global){
  "use strict";

  function init(Kefir, $) {



    $.fn.asKefirStream = function(eventName, selector, transformer) {
      var $el = this;
      if (transformer == null && selector != null && 'string' !== typeof selector) {
        transformer = selector;
        selector = null;
      }
      return Kefir._fromEvent(
        function(handler) {  $el.on(eventName, selector, handler)  },
        function(handler) {  $el.off(eventName, selector, handler)  },
        transformer
      ).setName('asKefirStream');
    }



    $.fn.asKefirProperty = function(eventName, selector, getter) {
      if (getter == null) {
        getter = selector;
        selector = null;
      }
      return this.asKefirStream(eventName, selector, getter)
        .toProperty(getter())
        .setName('asKefirProperty');
    }



  }

  if (typeof define === 'function' && define.amd) {
    define(['kefir', 'jquery'], init);
  } else if (typeof module === "object" && typeof exports === "object") {
    var kefir = require('kefir');
    var jQuery = require('jquery');
    init(kefir, jQuery);
  } else {
    init(global.Kefir, global.jQuery);
  }

}(this));

},{"jquery":6,"kefir":90}],90:[function(require,module,exports){
module.exports=require(1)
},{"/Users/anon/projects/my/kefir/dist/kefir.js":1}]},{},[34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87]);
