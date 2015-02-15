(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! Kefir.js v1.1.0
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
var ERROR = 'error';
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
    _handleError: function(x, isCurrent) {  this._send(ERROR, x, isCurrent)  },
    _handleEnd: function(__, isCurrent) {  this._send(END, null, isCurrent)  },

    _handleAny: function(event) {
      switch (event.type) {
        case VALUE: this._handleValue(event.value, event.current); break;
        case ERROR: this._handleError(event.value, event.current); break;
        case END: this._handleEnd(event.value, event.current); break;
      }
    },

    _onActivation: function() {
      this._source.onAny(this._$handleAny);
    },
    _onDeactivation: function() {
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
    _init: function(args) {},
    _free: function() {},

    _handlePrimaryValue: function(x, isCurrent) {  this._send(VALUE, x, isCurrent)  },
    _handlePrimaryError: function(x, isCurrent) {  this._send(ERROR, x, isCurrent)  },
    _handlePrimaryEnd: function(__, isCurrent) {  this._send(END, null, isCurrent)  },

    _handleSecondaryValue: function(x, isCurrent) {  this._lastSecondary = x  },
    _handleSecondaryError: function(x, isCurrent) {  this._send(ERROR, x, isCurrent)  },
    _handleSecondaryEnd: function(__, isCurrent) {},

    _handlePrimaryAny: function(event) {
      switch (event.type) {
        case VALUE:
          this._handlePrimaryValue(event.value, event.current);
          break;
        case ERROR:
          this._handlePrimaryError(event.value, event.current);
          break;
        case END:
          this._handlePrimaryEnd(event.value, event.current);
          break;
      }
    },
    _handleSecondaryAny: function(event) {
      switch (event.type) {
        case VALUE:
          this._handleSecondaryValue(event.value, event.current);
          break;
        case ERROR:
          this._handleSecondaryError(event.value, event.current);
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
    function AnonymousObservable(primary, secondary, args) {
      BaseClass.call(this);
      this._primary = primary;
      this._secondary = secondary;
      this._name = primary._name + '.' + name;
      this._lastSecondary = NOTHING;
      var $ = this;
      this._$handleSecondaryAny = function(event) {  $._handleSecondaryAny(event)  }
      this._$handlePrimaryAny = function(event) {  $._handlePrimaryAny(event)  }
      this._init(args);
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
    return new AnonymousStream(this, secondary, rest(arguments, 1, []));
  }

  Property.prototype[name] = function(secondary) {
    return new AnonymousProperty(this, secondary, rest(arguments, 1, []));
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
      if (fnData.type === VALUE || fnData.type === ERROR) {
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
      if (type === VALUE || type === ERROR) {
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
      key: _key || null
    }]);
  },
  remove: function(type, fn, _key) {
    var pred = isArray(_key) ?
      function(fnData) {return fnData.type === type && isEqualArrays(fnData.key, _key)} :
      function(fnData) {return fnData.type === type && fnData.fn === fn};
    this._items = removeByPred(this._items, pred);
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

  _on: function(type, fn, _key) {
    if (this._alive) {
      this._subscribers.add(type, fn, _key);
      this._setActive(true);
    } else {
      Subscribers.callOnce(type, fn, CURRENT_END);
    }
    return this;
  },

  _off: function(type, fn, _key) {
    if (this._alive) {
      this._subscribers.remove(type, fn, _key);
      if (this._subscribers.isEmpty()) {
        this._setActive(false);
      }
    }
    return this;
  },

  onValue:  function(fn, _key) {  return this._on(VALUE, fn, _key)   },
  onError:  function(fn, _key) {  return this._on(ERROR, fn, _key)   },
  onEnd:    function(fn, _key) {  return this._on(END, fn, _key)     },
  onAny:    function(fn, _key) {  return this._on(ANY, fn, _key)     },

  offValue: function(fn, _key) {  return this._off(VALUE, fn, _key)  },
  offError: function(fn, _key) {  return this._off(ERROR, fn, _key)  },
  offEnd:   function(fn, _key) {  return this._off(END, fn, _key)    },
  offAny:   function(fn, _key) {  return this._off(ANY, fn, _key)    }

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
  this._currentError = NOTHING;
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
      if (type === ERROR) {  this._currentError = x  }
      if (type === END) {  this._clear()  }
    }
  },

  _on: function(type, fn, _key) {
    if (this._alive) {
      this._subscribers.add(type, fn, _key);
      this._setActive(true);
    }
    if (this._current !== NOTHING) {
      Subscribers.callOnce(type, fn, Event(VALUE, this._current, true));
    }
    if (this._currentError !== NOTHING) {
      Subscribers.callOnce(type, fn, Event(ERROR, this._currentError, true));
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
    if (event.type === VALUE || event.type === ERROR) {
      console.log(name, typeStr, event.value);
    } else {
      console.log(name, typeStr);
    }
  }, ['__logKey__', this, name]);
  return this;
}

Observable.prototype.offLog = function(name) {
  name = name || this.toString();
  this.offAny(null, ['__logKey__', this, name]);
  return this;
}



// Kefir.withInterval()

withInterval('withInterval', {
  _init: function(args) {
    this._fn = args[0];
    var $ = this;
    this._emitter = {
      emit: function(x) {  $._send(VALUE, x)  },
      error: function(x) {  $._send(ERROR, x)  },
      end: function() {  $._send(END)  },
      emitEvent: function(e) {  $._send(e.type, e.value)  }
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
    if (this._active) {  this._subscribe(obs)  }
  },
  _subscribe: function(obs) {
    var $ = this;
    obs.onAny(this._$handleSubAny);
    obs.onEnd(function() {  $._removeCur(obs)  }, [this, obs]);
  },
  _unsubscribe: function(obs) {
    obs.offAny(this._$handleSubAny);
    obs.offEnd(null, [this, obs]);
  },
  _handleSubAny: function(event) {
    if (event.type === VALUE || event.type === ERROR) {
      this._send(event.type, event.value, event.current && this._activating);
    }
  },

  _removeQueue: function(obs) {
    var index = find(this._queue, obs);
    this._queue = remove(this._queue, index);
    return index;
  },
  _removeCur: function(obs) {
    if (this._active) {  this._unsubscribe(obs)  }
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
    for (i = 0; i < sources.length; i++) {
      if (this._active) {
        this._subscribe(sources[i]);
      }
    }
    this._activating = false;
  },
  _onDeactivation: function() {
    var sources = this._curSources
      , i;
    for (i = 0; i < sources.length; i++) {  this._unsubscribe(sources[i])  }
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
Kefir.Pool = Pool;

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
Kefir.Bus = Bus;

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
  error: function(x) {
    this._send(ERROR, x);
    return this;
  },
  end: function() {
    this._send(END);
    return this;
  },
  emitEvent: function(event) {
    this._send(event.type, event.value);
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
    if (this._active) {
      this._activating = true;
      this._source.onAny(this._$handleMainSource);
      this._activating = false;
    }
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
    }
    if (event.type === ERROR) {
      this._send(ERROR, event.value, event.current);
    }
    if (event.type === END) {
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






// .zip()

function Zip(sources, combinator) {
  Stream.call(this);
  if (sources.length === 0) {
    this._send(END);
  } else {
    this._buffers = map(sources, function(source) {
      return isArray(source) ? cloneArray(source) : [];
    });
    this._sources = map(sources, function(source) {
      return isArray(source) ? Kefir.never() : source;
    });
    this._combinator = combinator ? spread(combinator, this._sources.length) : id;
    this._aliveCount = 0;
  }
}


inherit(Zip, Stream, {

  _name: 'zip',

  _onActivation: function() {
    var i, length = this._sources.length;
    this._drainArrays();
    this._aliveCount = length;
    for (i = 0; i < length; i++) {
      if (this._active) {
        this._sources[i].onAny(this._bindHandleAny(i), [this, i]);
      }
    }
  },

  _onDeactivation: function() {
    for (var i = 0; i < this._sources.length; i++) {
      this._sources[i].offAny(null, [this, i]);
    }
  },

  _emit: function(isCurrent) {
    var values = new Array(this._buffers.length);
    for (var i = 0; i < this._buffers.length; i++) {
      values[i] = this._buffers[i].shift();
    }
    this._send(VALUE, this._combinator(values), isCurrent);
  },

  _isFull: function() {
    for (var i = 0; i < this._buffers.length; i++) {
      if (this._buffers[i].length === 0) {
        return false;
      }
    }
    return true;
  },

  _emitIfFull: function(isCurrent) {
    if (this._isFull()) {
      this._emit(isCurrent);
    }
  },

  _drainArrays: function() {
    while (this._isFull()) {
      this._emit(true);
    }
  },

  _bindHandleAny: function(i) {
    var $ = this;
    return function(event) {  $._handleAny(i, event)  };
  },

  _handleAny: function(i, event) {
    if (event.type === VALUE) {
      this._buffers[i].push(event.value);
      this._emitIfFull(event.current);
    }
    if (event.type === ERROR) {
      this._send(ERROR, event.value, event.current);
    }
    if (event.type === END) {
      this._aliveCount--;
      if (this._aliveCount === 0) {
        this._send(END, null, event.current);
      }
    }
  },

  _clear: function() {
    Stream.prototype._clear.call(this);
    this._sources = null;
    this._buffers = null;
    this._combinator = null;
  }

});

Kefir.zip = function(sources, combinator) {
  return new Zip(sources, combinator);
}

Observable.prototype.zip = function(other, combinator) {
  return new Zip([this, other], combinator);
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


inherit(SampledBy, Stream, {

  _name: 'sampledBy',

  _onActivation: function() {
    var length = this._sources.length,
        i;
    this._aliveCount = length - this._passiveCount;
    this._activating = true;
    for (i = 0; i < length; i++) {
      this._sources[i].onAny(this._bindHandleAny(i), [this, i]);
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

  _bindHandleAny: function(i) {
    var $ = this;
    return function(event) {  $._handleAny(i, event)  };
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
    }
    if (event.type === ERROR) {
      this._send(ERROR, event.value, event.current);
    }
    if (event.type === END) {
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
  return new SampledBy([], sources, combinator).setName('combine');
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
}, {propertyMethod: produceProperty, streamMethod: produceProperty});





// .changes()

withOneSource('changes', {
  _handleValue: function(x, isCurrent) {
    if (!isCurrent) {
      this._send(VALUE, x);
    }
  },
  _handleError: function(x, isCurrent) {
    if (!isCurrent) {
      this._send(ERROR, x);
    }
  }
}, {
  streamMethod: function() {
    return function() {
      return this;
    }
  },
  propertyMethod: produceStream
});




// .withHandler()

withOneSource('withHandler', {
  _init: function(args) {
    this._handler = args[0];
    this._forcedCurrent = false;
    var $ = this;
    this._emitter = {
      emit: function(x) {  $._send(VALUE, x, $._forcedCurrent)  },
      error: function(x) {  $._send(ERROR, x, $._forcedCurrent)  },
      end: function() {  $._send(END, null, $._forcedCurrent)  },
      emitEvent: function(e) {  $._send(e.type, e.value, $._forcedCurrent)  }
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




// .mapErrors(fn)

withOneSource('mapErrors', extend({
  _handleError: function(x, isCurrent) {
    this._send(ERROR, this._fn(x), isCurrent);
  }
}, withFnArgMixin));



// .errorsToValues(fn)

function defaultErrorsToValuesHandler(x) {
  return {
    convert: true,
    value: x
  };
}

withOneSource('errorsToValues', extend({
  _init: function(args) {
    this._fn = args[0] || defaultErrorsToValuesHandler;
  },
  _free: function() {
    this._fn = null;
  },
  _handleError: function(x, isCurrent) {
    var result = this._fn(x);
    var type = result.convert ? VALUE : ERROR;
    var newX = result.convert ? result.value : x;
    this._send(type, newX, isCurrent);
  }
}));



// .valuesToErrors(fn)

function defaultValuesToErrorsHandler(x) {
  return {
    convert: true,
    error: x
  };
}

withOneSource('valuesToErrors', extend({
  _init: function(args) {
    this._fn = args[0] || defaultValuesToErrorsHandler;
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    var result = this._fn(x);
    var type = result.convert ? ERROR : VALUE;
    var newX = result.convert ? result.error : x;
    this._send(type, newX, isCurrent);
  }
}));




// .filter(fn)

withOneSource('filter', extend({
  _handleValue: function(x, isCurrent) {
    if (this._fn(x)) {
      this._send(VALUE, x, isCurrent);
    }
  }
}, withFnArgMixin));




// .filterErrors(fn)

withOneSource('filterErrors', extend({
  _handleError: function(x, isCurrent) {
    if (this._fn(x)) {
      this._send(ERROR, x, isCurrent);
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
      this._prev = x;
      this._send(VALUE, x, isCurrent);
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




// .skipValue()

withOneSource('skipValues', {
  _handleValue: function() {}
});



// .skipError()

withOneSource('skipErrors', {
  _handleError: function() {}
});



// .skipEnd()

withOneSource('skipEnd', {
  _handleEnd: function() {}
});



// .endOnError(fn)

withOneSource('endOnError', extend({
  _handleError: function(x, isCurrent) {
    this._send(ERROR, x, isCurrent);
    this._send(END, null, isCurrent);
  }
}));



// .slidingWindow(max[, min])

withOneSource('slidingWindow', {
  _init: function(args) {
    this._max = args[0];
    this._min = args[1] || 0;
    this._buff = [];
  },
  _free: function() {
    this._buff = null;
  },
  _handleValue: function(x, isCurrent) {
    this._buff = slide(this._buff, x, this._max);
    if (this._buff.length >= this._min) {
      this._send(VALUE, this._buff, isCurrent);
    }
  }
});




// .bufferWhile([predicate], [options])

withOneSource('bufferWhile', {
  _init: function(args) {
    this._fn = args[0] || id;
    this._flushOnEnd = get(args[1], 'flushOnEnd', true);
    this._buff = [];
  },
  _free: function() {
    this._buff = null;
  },
  _flush: function(isCurrent) {
    if (this._buff !== null && this._buff.length !== 0) {
      this._send(VALUE, this._buff, isCurrent);
      this._buff = [];
    }
  },
  _handleValue: function(x, isCurrent) {
    this._buff.push(x);
    if (!this._fn(x)) {
      this._flush(isCurrent);
    }
  },
  _handleEnd: function(x, isCurrent) {
    if (this._flushOnEnd) {
      this._flush(isCurrent);
    }
    this._send(END, null, isCurrent);
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
        error: function(x) {  $._send(ERROR, x, isCurrent)  },
        end: function() {  $._send(END, null, isCurrent)  },
        emitEvent: function(e) {  $._send(e.type, e.value, isCurrent)  }
      };
    this._unsubscribe = this._fn(emitter) || null;

    // work around https://github.com/pozadi/kefir/issues/35
    if (!this._active && this._unsubscribe !== null) {
      this._unsubscribe();
      this._unsubscribe = null;
    }

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
  error: function(x) {
    this._send(ERROR, x);
    return this;
  },
  end: function() {
    this._send(END);
    return this;
  },
  emitEvent: function(event) {
    this._send(event.type, event.value);
  }
});

Kefir.emitter = function() {
  return new Emitter();
}

Kefir.Emitter = Emitter;







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




// Kefir.constantError(x)

function ConstantError(x) {
  Property.call(this);
  this._send(ERROR, x);
  this._send(END);
}

inherit(ConstantError, Property, {
  _name: 'constantError'
})

Kefir.constantError = function(x) {
  return new ConstantError(x);
}




// Kefir.repeat(generator)

function Repeat(generator) {
  Stream.call(this);
  this._generator = generator;
  this._source = null;
  this._inLoop = false;
  this._activating = false;
  this._iteration = 0;

  var $ = this;
  this._$handleAny = function(event) {
    $._handleAny(event);
  };
}

inherit(Repeat, Stream, {

  _name: 'repeat',

  _handleAny: function(event) {
    if (event.type === END) {
      this._source = null;
      this._startLoop();
    } else {
      this._send(event.type, event.value, this._activating);
    }
  },

  _startLoop: function() {
    if (!this._inLoop) {
      this._inLoop = true;
      while (this._source === null && this._alive && this._active) {
        this._source = this._generator(this._iteration++);
        if (this._source) {
          this._source.onAny(this._$handleAny);
        } else {
          this._send(END);
        }
      }
      this._inLoop = false;
    }
  },

  _onActivation: function() {
    this._activating = true;
    if (this._source) {
      this._source.onAny(this._$handleAny);
    } else {
      this._startLoop();
    }
    this._activating = false;
  },

  _onDeactivation: function() {
    if (this._source) {
      this._source.offAny(this._$handleAny);
    }
  },

  _clear: function() {
    Stream.prototype._clear.call(this);
    this._generator = null;
    this._source = null;
    this._$handleAny = null;
  }

});

Kefir.repeat = function(generator) {
  return new Repeat(generator);
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




// .fromNodeCallback

Kefir.fromNodeCallback = function(callbackConsumer) {
  var called = false;
  return Kefir.fromBinder(function(emitter) {
    if (!called) {
      callbackConsumer(function(error, x) {
        if (error) {
          emitter.error(error);
        } else {
          emitter.emit(x);
        }
        emitter.end();
      });
      called = true;
    }
  }).setName('fromNodeCallback');
}




// .fromPromise

Kefir.fromPromise = function(promise) {
  var called = false;
  return Kefir.fromBinder(function(emitter) {
    if (!called) {
      var onValue = function(x) {
        emitter.emit(x);
        emitter.end();
      };
      var onError = function(x) {
        emitter.error(x);
        emitter.end();
      };
      var _promise = promise.then(onValue, onError);

      // prevent promise/A+ libraries like Q to swallow exceptions
      if (_promise && isFn(_promise.done)) {
        _promise.done();
      }

      called = true;
    }
  }).toProperty().setName('fromPromise');
}






// .fromSubUnsub

Kefir.fromSubUnsub = function(sub, unsub, transformer) {
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
    throw new Error('target don\'t support any of ' +
      'addEventListener/removeEventListener, addListener/removeListener, on/off method pair');
  }

  return Kefir.fromSubUnsub(
    function(handler) {  target[sub](eventName, handler)  },
    function(handler) {  target[unsub](eventName, handler)  },
    transformer
  ).setName('fromEvent');
}

var withTwoSourcesAndBufferMixin = {
  _init: function(args) {
    this._buff = [];
    this._flushOnEnd = get(args[0], 'flushOnEnd', true);
  },
  _free: function() {
    this._buff = null;
  },
  _flush: function(isCurrent) {
    if (this._buff !== null && this._buff.length !== 0) {
      this._send(VALUE, this._buff, isCurrent);
      this._buff = [];
    }
  },

  _handlePrimaryEnd: function(__, isCurrent) {
    if (this._flushOnEnd) {
      this._flush(isCurrent);
    }
    this._send(END, null, isCurrent);
  }
};



withTwoSources('bufferBy', extend({

  _onActivation: function() {
    this._primary.onAny(this._$handlePrimaryAny);
    if (this._alive && this._secondary !== null) {
      this._secondary.onAny(this._$handleSecondaryAny);
    }
  },

  _handlePrimaryValue: function(x, isCurrent) {
    this._buff.push(x);
  },

  _handleSecondaryValue: function(x, isCurrent) {
    this._flush(isCurrent);
  },

  _handleSecondaryEnd: function(x, isCurrent) {
    if (!this._flushOnEnd) {
      this._send(END, null, isCurrent);
    }
  }

}, withTwoSourcesAndBufferMixin));




withTwoSources('bufferWhileBy', extend({

  _handlePrimaryValue: function(x, isCurrent) {
    this._buff.push(x);
    if (this._lastSecondary !== NOTHING && !this._lastSecondary) {
      this._flush(isCurrent);
    }
  },

  _handleSecondaryEnd: function(x, isCurrent) {
    if (!this._flushOnEnd && (this._lastSecondary === NOTHING || this._lastSecondary)) {
      this._send(END, null, isCurrent);
    }
  }

}, withTwoSourcesAndBufferMixin));





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

  _init: function() {
    this._hasFalseyFromSecondary = false;
  },

  _handlePrimaryValue: function(x, isCurrent) {
    if (this._hasFalseyFromSecondary) {
      this._send(VALUE, x, isCurrent);
    }
  },

  _handleSecondaryValue: function(x, isCurrent) {
    this._hasFalseyFromSecondary = this._hasFalseyFromSecondary || !x;
  },

  _handleSecondaryEnd: function(__, isCurrent) {
    if (!this._hasFalseyFromSecondary) {
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
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

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
process.umask = function() { return 0; };

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

},{"./sinon/assert":7,"./sinon/behavior":8,"./sinon/call":9,"./sinon/collection":10,"./sinon/extend":11,"./sinon/format":12,"./sinon/log_error":13,"./sinon/match":14,"./sinon/mock":15,"./sinon/sandbox":16,"./sinon/spy":17,"./sinon/stub":18,"./sinon/test":19,"./sinon/test_case":20,"./sinon/times_in_words":21,"./sinon/typeOf":22,"./sinon/util/core":23}],7:[function(require,module,exports){
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
},{"./match":14,"./util/core":23}],8:[function(require,module,exports){
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
},{"./util/core":23,"_process":3}],9:[function(require,module,exports){
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

},{"./match":14,"./util/core":23}],10:[function(require,module,exports){
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

},{"./mock":15,"./spy":17,"./stub":18,"./util/core":23}],11:[function(require,module,exports){
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

},{"./util/core":23}],12:[function(require,module,exports){
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

},{"./util/core":23,"formatio":28,"util":5}],13:[function(require,module,exports){
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

},{"./util/core":23}],14:[function(require,module,exports){
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

},{"./util/core":23}],15:[function(require,module,exports){
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

},{"./call":9,"./match":14,"./spy":17,"./util/core":23}],16:[function(require,module,exports){
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

},{"./collection":10,"./util/core":23,"./util/fake_server":25,"./util/fake_timers":26}],17:[function(require,module,exports){
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

},{"./call":9,"./util/core":23}],18:[function(require,module,exports){
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

},{"./behavior":8,"./spy":17,"./util/core":23}],19:[function(require,module,exports){
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

},{"./sandbox":16,"./util/core":23}],20:[function(require,module,exports){
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

},{"./test":19,"./util/core":23}],21:[function(require,module,exports){
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

},{"./util/core":23}],22:[function(require,module,exports){
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

},{"./util/core":23}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"./core":23}],25:[function(require,module,exports){
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

},{"./core":23,"./fake_xml_http_request":27}],26:[function(require,module,exports){
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
        var llx = typeof lolex !== "undefined" ? lolex : lol;

        sinon.useFakeTimers = function () {
            var now, methods = Array.prototype.slice.call(arguments);

            if (typeof methods[0] === "string") {
                now = 0;
            } else {
                now = methods.shift();
            }

            var clock = llx.install(now || 0, methods);
            clock.restore = clock.uninstall;
            return clock;
        };

        sinon.clock = {
            create: function (now) {
                return llx.createClock(now);
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
},{"./core":23,"lolex":30}],27:[function(require,module,exports){
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
        207: "Multi-Status",
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

},{"./core":23,"./event":24}],28:[function(require,module,exports){
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
},{"samsam":29}],29:[function(require,module,exports){
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

        if (typeof(matcher) === "undefined") {
            return typeof(object) === "undefined";
        }

        if (matcher === null) {
            return object === null;
        }

        if (getClass(object) === "Array" && getClass(matcher) === "Array") {
            return arrayContains(object, matcher);
        }

        if (matcher && typeof matcher === "object") {
            if (matcher === object) {
                return true;
            }
            var prop;
            for (prop in matcher) {
                var value = object[prop];
                if (typeof value === "undefined" &&
                        typeof object.getAttribute === "function") {
                    value = object.getAttribute(prop);
                }
                if (matcher[prop] === null || typeof matcher[prop] === 'undefined') {
                    if (value !== matcher[prop]) {
                        return false;
                    }
                } else if (typeof  value === "undefined" || !match(value, matcher[prop])) {
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

},{}],30:[function(require,module,exports){
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
},{}],31:[function(require,module,exports){
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


},{}],32:[function(require,module,exports){

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

},{}],33:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir, deactivate = _ref.deactivate, activate = _ref.activate;

describe('bufferBy', function() {
  describe('common', function() {
    it('should activate/deactivate sources', function() {
      var a, b;
      a = stream();
      b = stream();
      expect(a.bufferBy(b)).toActivate(a, b);
      a = stream();
      b = prop();
      expect(a.bufferBy(b)).toActivate(a, b);
      a = prop();
      b = stream();
      expect(a.bufferBy(b)).toActivate(a, b);
      a = prop();
      b = prop();
      return expect(a.bufferBy(b)).toActivate(a, b);
    });
    it('should end when primary ends', function() {
      var a, b;
      expect(send(stream(), ['<end>']).bufferBy(stream())).toEmit(['<end:current>']);
      a = stream();
      b = stream();
      return expect(a.bufferBy(b)).toEmit(['<end>'], function() {
        return send(a, ['<end>']);
      });
    });
    it('should flush buffer on end', function() {
      var a, b;
      expect(send(prop(), [1, '<end>']).bufferBy(stream())).toEmit([
        {
          current: [1]
        }, '<end:current>'
      ]);
      a = stream();
      b = stream();
      return expect(a.bufferBy(b)).toEmit([[1, 2], '<end>'], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
    it('should not flush buffer on end if {flushOnEnd: false}', function() {
      var a, b;
      expect(send(prop(), [1, '<end>']).bufferBy(stream(), {
        flushOnEnd: false
      })).toEmit(['<end:current>']);
      a = stream();
      b = stream();
      return expect(a.bufferBy(b, {
        flushOnEnd: false
      })).toEmit(['<end>'], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
    it('should not end when secondary ends', function() {
      var a, b;
      expect(stream().bufferBy(send(stream(), ['<end>']))).toEmit([]);
      a = stream();
      b = stream();
      return expect(a.bufferBy(b)).toEmit([], function() {
        return send(b, ['<end>']);
      });
    });
    it('should do end when secondary ends if {flushOnEnd: false}', function() {
      var a, b;
      expect(stream().bufferBy(send(stream(), ['<end>']), {
        flushOnEnd: false
      })).toEmit(['<end:current>']);
      a = stream();
      b = stream();
      return expect(a.bufferBy(b, {
        flushOnEnd: false
      })).toEmit(['<end>'], function() {
        return send(b, ['<end>']);
      });
    });
    it('should flush buffer (if not empty) on each value from secondary', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.bufferBy(b)).toEmit([[1, 2], [3]], function() {
        send(b, [0]);
        send(a, [1, 2]);
        send(b, [0]);
        send(b, [0]);
        send(a, [3]);
        send(b, [0]);
        return send(a, [4]);
      });
    });
    return it('errors should flow', function() {
      var a, b;
      a = stream();
      b = stream();
      expect(a.bufferBy(b)).errorsToFlow(a);
      a = stream();
      b = stream();
      expect(a.bufferBy(b)).errorsToFlow(b);
      a = prop();
      b = stream();
      expect(a.bufferBy(b)).errorsToFlow(a);
      a = prop();
      b = stream();
      expect(a.bufferBy(b)).errorsToFlow(b);
      a = stream();
      b = prop();
      expect(a.bufferBy(b)).errorsToFlow(a);
      a = stream();
      b = prop();
      expect(a.bufferBy(b)).errorsToFlow(b);
      a = prop();
      b = prop();
      expect(a.bufferBy(b)).errorsToFlow(a);
      a = prop();
      b = prop();
      return expect(a.bufferBy(b)).errorsToFlow(b);
    });
  });
  describe('stream + stream', function() {
    return it('returns stream', function() {
      return expect(stream().bufferBy(stream())).toBeStream();
    });
  });
  describe('stream + property', function() {
    return it('returns stream', function() {
      return expect(stream().bufferBy(prop())).toBeStream();
    });
  });
  describe('property + stream', function() {
    it('returns property', function() {
      return expect(prop().bufferBy(stream())).toBeProperty();
    });
    return it('includes current to buffer', function() {
      var a, b;
      a = send(prop(), [1]);
      b = stream();
      return expect(a.bufferBy(b)).toEmit([[1]], function() {
        return send(b, [0]);
      });
    });
  });
  return describe('property + property', function() {
    it('returns property', function() {
      return expect(prop().bufferBy(prop())).toBeProperty();
    });
    return it('both have current', function() {
      var a, b;
      a = send(prop(), [1]);
      b = send(prop(), [2]);
      return expect(a.bufferBy(b)).toEmit([
        {
          current: [1]
        }
      ]);
    });
  });
});



},{"../test-helpers.coffee":102}],34:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir, deactivate = _ref.deactivate, activate = _ref.activate;

describe('bufferWhileBy', function() {
  describe('common', function() {
    it('should activate/deactivate sources', function() {
      var a, b;
      a = stream();
      b = stream();
      expect(a.bufferWhileBy(b)).toActivate(a, b);
      a = stream();
      b = prop();
      expect(a.bufferWhileBy(b)).toActivate(a, b);
      a = prop();
      b = stream();
      expect(a.bufferWhileBy(b)).toActivate(a, b);
      a = prop();
      b = prop();
      return expect(a.bufferWhileBy(b)).toActivate(a, b);
    });
    it('should end when primary ends', function() {
      var a, b;
      expect(send(stream(), ['<end>']).bufferWhileBy(stream())).toEmit(['<end:current>']);
      a = stream();
      b = stream();
      return expect(a.bufferWhileBy(b)).toEmit(['<end>'], function() {
        return send(a, ['<end>']);
      });
    });
    it('should flush buffer on end', function() {
      var a, b;
      expect(send(prop(), [1, '<end>']).bufferWhileBy(stream())).toEmit([
        {
          current: [1]
        }, '<end:current>'
      ]);
      a = stream();
      b = stream();
      return expect(a.bufferWhileBy(b)).toEmit([[1, 2], '<end>'], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
    it('should not flush buffer on end if {flushOnEnd: false}', function() {
      var a, b;
      expect(send(prop(), [1, '<end>']).bufferWhileBy(stream(), {
        flushOnEnd: false
      })).toEmit(['<end:current>']);
      a = stream();
      b = stream();
      return expect(a.bufferWhileBy(b, {
        flushOnEnd: false
      })).toEmit(['<end>'], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
    it('should end when secondary ends, if it haven\'t emitted any value (w/ {flushOnEnd: false})', function() {
      var a, b;
      expect(stream().bufferWhileBy(send(stream(), ['<end>']), {
        flushOnEnd: false
      })).toEmit(['<end:current>']);
      a = stream();
      b = stream();
      return expect(a.bufferWhileBy(b, {
        flushOnEnd: false
      })).toEmit(['<end>'], function() {
        return send(b, ['<end>']);
      });
    });
    it('should end when secondary ends, if its last emitted value was truthy (w/ {flushOnEnd: false})', function() {
      var a, b;
      expect(stream().bufferWhileBy(send(prop(), [true, '<end>']), {
        flushOnEnd: false
      })).toEmit(['<end:current>']);
      a = stream();
      b = stream();
      return expect(a.bufferWhileBy(b, {
        flushOnEnd: false
      })).toEmit(['<end>'], function() {
        return send(b, [true, '<end>']);
      });
    });
    it('should not end when secondary ends, if its last emitted value was falsy (w/ {flushOnEnd: false})', function() {
      var a, b;
      expect(stream().bufferWhileBy(send(prop(), [false, '<end>']), {
        flushOnEnd: false
      })).toEmit([]);
      a = stream();
      b = stream();
      return expect(a.bufferWhileBy(b, {
        flushOnEnd: false
      })).toEmit([], function() {
        return send(b, [false, '<end>']);
      });
    });
    it('should not end when secondary ends (w/o {flushOnEnd: false})', function() {
      var a, b;
      expect(stream().bufferWhileBy(send(prop(), ['<end>']))).toEmit([]);
      a = stream();
      b = stream();
      expect(a.bufferWhileBy(b)).toEmit([], function() {
        return send(b, ['<end>']);
      });
      expect(stream().bufferWhileBy(send(prop(), [true, '<end>']))).toEmit([]);
      a = stream();
      b = stream();
      expect(a.bufferWhileBy(b)).toEmit([], function() {
        return send(b, [true, '<end>']);
      });
      expect(stream().bufferWhileBy(send(prop(), [false, '<end>']))).toEmit([]);
      a = stream();
      b = stream();
      return expect(a.bufferWhileBy(b)).toEmit([], function() {
        return send(b, [false, '<end>']);
      });
    });
    it('should flush buffer on each value from primary if last value form secondary was falsy', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.bufferWhileBy(b)).toEmit([[1, 2, 3, 4], [5], [6, 7, 8]], function() {
        send(a, [1, 2]);
        send(b, [true]);
        send(a, [3]);
        send(b, [false]);
        send(a, [4]);
        send(a, [5]);
        send(b, [true]);
        send(a, [6, 7]);
        send(b, [false]);
        return send(a, [8]);
      });
    });
    return it('errors should flow', function() {
      var a, b;
      a = stream();
      b = stream();
      expect(a.bufferWhileBy(b)).errorsToFlow(a);
      a = stream();
      b = stream();
      expect(a.bufferWhileBy(b)).errorsToFlow(b);
      a = prop();
      b = stream();
      expect(a.bufferWhileBy(b)).errorsToFlow(a);
      a = prop();
      b = stream();
      expect(a.bufferWhileBy(b)).errorsToFlow(b);
      a = stream();
      b = prop();
      expect(a.bufferWhileBy(b)).errorsToFlow(a);
      a = stream();
      b = prop();
      expect(a.bufferWhileBy(b)).errorsToFlow(b);
      a = prop();
      b = prop();
      expect(a.bufferWhileBy(b)).errorsToFlow(a);
      a = prop();
      b = prop();
      return expect(a.bufferWhileBy(b)).errorsToFlow(b);
    });
  });
  describe('stream + stream', function() {
    return it('returns stream', function() {
      return expect(stream().bufferWhileBy(stream())).toBeStream();
    });
  });
  describe('stream + property', function() {
    return it('returns stream', function() {
      return expect(stream().bufferWhileBy(prop())).toBeStream();
    });
  });
  describe('property + stream', function() {
    it('returns property', function() {
      return expect(prop().bufferWhileBy(stream())).toBeProperty();
    });
    return it('includes current to buffer', function() {
      var a, b;
      a = send(prop(), [1]);
      b = stream();
      return expect(a.bufferWhileBy(b)).toEmit([[1, 2]], function() {
        send(b, [false]);
        return send(a, [2]);
      });
    });
  });
  return describe('property + property', function() {
    it('returns property', function() {
      return expect(prop().bufferWhileBy(prop())).toBeProperty();
    });
    return it('both have current', function() {
      var a, b;
      a = send(prop(), [1]);
      b = send(prop(), [false]);
      expect(a.bufferWhileBy(b)).toEmit([
        {
          current: [1]
        }
      ]);
      a = send(prop(), [1]);
      b = send(prop(), [true]);
      return expect(a.bufferWhileBy(b)).toEmit([]);
    });
  });
});



},{"../test-helpers.coffee":102}],35:[function(require,module,exports){
var Kefir, not3, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

not3 = function(x) {
  return x !== 3;
};

describe('bufferWhile', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().bufferWhile(not3)).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.bufferWhile(not3)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).bufferWhile(not3)).toEmit(['<end:current>']);
    });
    it('should work correctly', function() {
      var a;
      a = stream();
      return expect(a.bufferWhile(not3)).toEmit([[3], [1, 2, 3], [4, 3], [3], [5, 6], '<end>'], function() {
        return send(a, [3, 1, 2, 3, 4, 3, 3, 5, 6, '<end>']);
      });
    });
    it('should not flush buffer on end if {flushOnEnd: false}', function() {
      var a;
      a = stream();
      return expect(a.bufferWhile(not3, {
        flushOnEnd: false
      })).toEmit([[3], [1, 2, 3], [4, 3], [3], '<end>'], function() {
        return send(a, [3, 1, 2, 3, 4, 3, 3, 5, 6, '<end>']);
      });
    });
    return it('errors should flow', function() {
      var a;
      a = stream();
      return expect(a.bufferWhile(not3)).errorsToFlow(a);
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().bufferWhile(not3)).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.bufferWhile(not3)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      expect(send(prop(), ['<end>']).bufferWhile(not3)).toEmit(['<end:current>']);
      expect(send(prop(), [3, '<end>']).bufferWhile(not3)).toEmit([
        {
          current: [3]
        }, '<end:current>'
      ]);
      expect(send(prop(), [2, '<end>']).bufferWhile(not3)).toEmit([
        {
          current: [2]
        }, '<end:current>'
      ]);
      expect(send(prop(), [3, '<end>']).bufferWhile(not3, {
        flushOnEnd: false
      })).toEmit([
        {
          current: [3]
        }, '<end:current>'
      ]);
      return expect(send(prop(), [2, '<end>']).bufferWhile(not3, {
        flushOnEnd: false
      })).toEmit(['<end:current>']);
    });
    it('should work correctly', function() {
      var a;
      a = send(prop(), [3]);
      expect(a.bufferWhile(not3)).toEmit([
        {
          current: [3]
        }, [1, 2, 3], [4, 3], [3], [5, 6], '<end>'
      ], function() {
        return send(a, [1, 2, 3, 4, 3, 3, 5, 6, '<end>']);
      });
      a = send(prop(), [1]);
      return expect(a.bufferWhile(not3)).toEmit([[1, 2, 3], [5, 6], '<end>'], function() {
        return send(a, [2, 3, 5, 6, '<end>']);
      });
    });
    return it('errors should flow', function() {
      var a;
      a = prop();
      return expect(a.bufferWhile(not3)).errorsToFlow(a);
    });
  });
});



},{"../test-helpers.coffee":102}],36:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('bus', function() {
  it('should return stream', function() {
    expect(Kefir.bus()).toBeStream();
    return expect(new Kefir.Bus()).toBeStream();
  });
  it('should return bus', function() {
    expect(Kefir.bus()).toBeBus();
    return expect(new Kefir.Bus()).toBeBus();
  });
  it('should not be ended', function() {
    return expect(Kefir.bus()).toEmit([]);
  });
  it('should emit events', function() {
    var a;
    a = Kefir.bus();
    return expect(a).toEmit([
      1, 2, {
        error: -1
      }, 3, '<end>'
    ], function() {
      a.emit(1);
      a.emit(2);
      a.error(-1);
      a.emit(3);
      return a.end();
    });
  });
  it('should emit events via .emitEvent', function() {
    var a;
    a = Kefir.bus();
    return expect(a).toEmit([
      1, 2, {
        error: -1
      }, 3, '<end>'
    ], function() {
      a.emitEvent({
        type: 'value',
        value: 1,
        current: false
      });
      a.emitEvent({
        type: 'value',
        value: 2,
        current: true
      });
      a.emitEvent({
        type: 'error',
        value: -1,
        current: false
      });
      a.emitEvent({
        type: 'value',
        value: 3,
        current: false
      });
      return a.emitEvent({
        type: 'end',
        value: void 0,
        current: false
      });
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
  it('errors should flow', function() {
    var a, b, c, pool;
    a = stream();
    b = prop();
    c = stream();
    pool = Kefir.bus();
    pool.plug(a);
    expect(pool).errorsToFlow(a);
    pool.unplug(a);
    expect(pool).not.errorsToFlow(a);
    pool.plug(a);
    pool.plug(b);
    expect(pool).errorsToFlow(a);
    expect(pool).errorsToFlow(b);
    pool.unplug(b);
    expect(pool).not.errorsToFlow(b);
    pool.plug(c);
    return expect(pool).errorsToFlow(c);
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



},{"../test-helpers.coffee":102}],37:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('changes', function() {
  describe('stream', function() {
    return it('should just return same stream', function() {
      var a;
      a = stream();
      return expect(a.changes()).toBe(a);
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
      a = send(prop(), [
        1, {
          error: 4
        }
      ]);
      return expect(a.changes()).toEmit([
        2, {
          error: 5
        }, 3, '<end>'
      ], function() {
        return send(a, [
          2, {
            error: 5
          }, 3, '<end>'
        ]);
      });
    });
  });
});



},{"../test-helpers.coffee":102}],38:[function(require,module,exports){
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
  it('when activating second time and has 2+ properties in sources, should emit current value at most once', function() {
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
  return it('errors should flow', function() {
    var a, b, c;
    a = stream();
    b = prop();
    c = stream();
    expect(Kefir.combine([a, b, c])).errorsToFlow(a);
    a = stream();
    b = prop();
    c = stream();
    expect(Kefir.combine([a, b, c])).errorsToFlow(b);
    a = stream();
    b = prop();
    c = stream();
    return expect(Kefir.combine([a, b, c])).errorsToFlow(c);
  });
});



},{"../test-helpers.coffee":102}],39:[function(require,module,exports){
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
  it('if made of ended properties, should emit all currents then end', function() {
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
  return it('errors should flow', function() {
    var a, b, c, result;
    a = stream();
    b = prop();
    c = stream();
    expect(Kefir.concat([a, b, c])).errorsToFlow(a);
    a = send(stream(), ['<end>']);
    b = prop();
    c = stream();
    expect(Kefir.concat([a, b, c])).errorsToFlow(b);
    a = send(stream(), ['<end>']);
    b = prop();
    c = stream();
    result = Kefir.concat([a, b, c]);
    activate(result);
    send(b, ['<end>']);
    deactivate(result);
    return expect(result).errorsToFlow(c);
  });
});



},{"../test-helpers.coffee":102}],40:[function(require,module,exports){
var Kefir;

Kefir = require('../../dist/kefir');

describe('constantError', function() {
  it('should return property', function() {
    return expect(Kefir.constantError(1)).toBeProperty();
  });
  return it('should be ended and has a current error', function() {
    return expect(Kefir.constantError(1)).toEmit([
      {
        currentError: 1
      }, '<end:current>'
    ]);
  });
});



},{"../../dist/kefir":1}],41:[function(require,module,exports){
var Kefir;

Kefir = require('../../dist/kefir');

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



},{"../../dist/kefir":1}],42:[function(require,module,exports){
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
    it('should end immediately if no value to emit later (immediate)', function() {
      var a;
      a = stream();
      return expect(a.debounce(100, {
        immediate: true
      })).toEmitInTime([[0, 1], [0, '<end>']], function(tick) {
        return send(a, [1, '<end>']);
      });
    });
    return it('errors should flow', function() {
      var a;
      a = stream();
      return expect(a.debounce(100)).errorsToFlow(a);
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
    it('should end immediately if no value to emit later (immediate)', function() {
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
    return it('errors should flow', function() {
      var a;
      a = prop();
      return expect(a.debounce(100)).errorsToFlow(a);
    });
  });
});



},{"../test-helpers.coffee":102}],43:[function(require,module,exports){
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
    it('should handle events', function() {
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
    return it('errors should flow', function() {
      var a;
      a = stream();
      return expect(a.delay(100)).errorsToFlow(a);
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
    it('should handle events and current', function() {
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
    return it('errors should flow', function() {
      var a;
      a = prop();
      return expect(a.delay(100)).errorsToFlow(a);
    });
  });
});



},{"../test-helpers.coffee":102}],44:[function(require,module,exports){
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
    it('if no seed provided uses first value as seed', function() {
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
    return it('errors should flow', function() {
      var a;
      a = stream();
      return expect(a.diff()).errorsToFlow(a);
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
    it('if no seed provided uses first value as seed', function() {
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
    return it('errors should flow', function() {
      var a;
      a = prop();
      return expect(a.diff()).errorsToFlow(a);
    });
  });
});



},{"../test-helpers.coffee":102}],45:[function(require,module,exports){
var Kefir;

Kefir = require('../../dist/kefir');

describe('emitter', function() {
  it('should return stream', function() {
    expect(Kefir.emitter()).toBeStream();
    return expect(new Kefir.Emitter()).toBeStream();
  });
  it('should return emitter', function() {
    expect(Kefir.emitter()).toBeEmitter();
    return expect(new Kefir.Emitter()).toBeEmitter();
  });
  it('should not be ended', function() {
    return expect(Kefir.emitter()).toEmit([]);
  });
  it('should emit events', function() {
    var a;
    a = Kefir.emitter();
    return expect(a).toEmit([
      1, 2, {
        error: -1
      }, 3, '<end>'
    ], function() {
      a.emit(1);
      a.emit(2);
      a.error(-1);
      a.emit(3);
      return a.end();
    });
  });
  return it('should emit events via .emitEvent', function() {
    var a;
    a = Kefir.emitter();
    return expect(a).toEmit([
      1, 2, {
        error: -1
      }, 3, '<end>'
    ], function() {
      a.emitEvent({
        type: 'value',
        value: 1,
        current: false
      });
      a.emitEvent({
        type: 'value',
        value: 2,
        current: true
      });
      a.emitEvent({
        type: 'error',
        value: -1,
        current: false
      });
      a.emitEvent({
        type: 'value',
        value: 3,
        current: false
      });
      return a.emitEvent({
        type: 'end',
        value: void 0,
        current: false
      });
    });
  });
});



},{"../../dist/kefir":1}],46:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('endOnError', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().endOnError()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.endOnError()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).endOnError()).toEmit(['<end:current>']);
    });
    return it('should handle events', function() {
      var a;
      a = stream();
      expect(a.endOnError()).toEmit([
        1, {
          error: 5
        }, '<end>'
      ], function() {
        return send(a, [
          1, {
            error: 5
          }, 2
        ]);
      });
      a = stream();
      return expect(a.endOnError()).toEmit([1, 2, '<end>'], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().endOnError()).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.endOnError()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).endOnError()).toEmit(['<end:current>']);
    });
    it('should handle events and current', function() {
      var a;
      a = send(prop(), [1]);
      expect(a.endOnError()).toEmit([
        {
          current: 1
        }, {
          error: 5
        }, '<end>'
      ], function() {
        return send(a, [
          {
            error: 5
          }, 2
        ]);
      });
      a = send(prop(), [1]);
      return expect(a.endOnError()).toEmit([
        {
          current: 1
        }, 2, '<end>'
      ], function() {
        return send(a, [2, '<end>']);
      });
    });
    return it('should handle currents', function() {
      var a;
      a = send(prop(), [
        1, {
          error: -1
        }
      ]);
      expect(a.endOnError()).toEmit([
        {
          current: 1
        }, {
          currentError: -1
        }, '<end:current>'
      ]);
      a = send(prop(), [
        1, {
          error: -1
        }, '<end>'
      ]);
      expect(a.endOnError()).toEmit([
        {
          current: 1
        }, {
          currentError: -1
        }, '<end:current>'
      ]);
      a = send(prop(), [1, '<end>']);
      return expect(a.endOnError()).toEmit([
        {
          current: 1
        }, '<end:current>'
      ]);
    });
  });
});



},{"../test-helpers.coffee":102}],47:[function(require,module,exports){
var Kefir, handler, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

handler = function(x) {
  return {
    convert: x >= 0,
    value: x * 3
  };
};

describe('errorsToValues', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().errorsToValues(function() {})).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.errorsToValues(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).errorsToValues(function() {})).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.errorsToValues(handler)).toEmit([
        1, 6, {
          error: -1
        }, 9, 4, '<end>'
      ], function() {
        return send(a, [
          1, {
            error: 2
          }, {
            error: -1
          }, {
            error: 3
          }, 4, '<end>'
        ]);
      });
    });
    return it('default handler should convert all errors', function() {
      var a;
      a = stream();
      return expect(a.errorsToValues()).toEmit([1, 2, -1, 3, 4, '<end>'], function() {
        return send(a, [
          1, {
            error: 2
          }, {
            error: -1
          }, {
            error: 3
          }, 4, '<end>'
        ]);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().errorsToValues(function() {})).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.errorsToValues(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).errorsToValues(function() {})).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.errorsToValues(handler)).toEmit([
        {
          current: 1
        }, 6, {
          error: -1
        }, 9, 4, '<end>'
      ], function() {
        return send(a, [
          {
            error: 2
          }, {
            error: -1
          }, {
            error: 3
          }, 4, '<end>'
        ]);
      });
    });
    return it('should handle currents', function() {
      var a;
      a = send(prop(), [
        {
          error: -2
        }
      ]);
      expect(a.errorsToValues(handler)).toEmit([
        {
          currentError: -2
        }
      ]);
      a = send(prop(), [
        {
          error: 2
        }
      ]);
      expect(a.errorsToValues(handler)).toEmit([
        {
          current: 6
        }
      ]);
      a = send(prop(), [
        1, {
          error: 2
        }
      ]);
      expect(a.errorsToValues(handler)).toEmit([
        {
          current: 6
        }
      ]);
      a = send(prop(), [
        {
          error: 2
        }, 1
      ]);
      expect(a.errorsToValues(handler)).toEmit([
        {
          current: 6
        }
      ]);
      a = send(prop(), [
        {
          error: -2
        }
      ]);
      expect(a.errorsToValues(handler)).toEmit([
        {
          currentError: -2
        }
      ]);
      a = send(prop(), [
        1, {
          error: -2
        }
      ]);
      return expect(a.errorsToValues(handler)).toEmit([
        {
          current: 1
        }, {
          currentError: -2
        }
      ]);
    });
  });
});



},{"../test-helpers.coffee":102}],48:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('filterBy', function() {
  describe('common', function() {
    return it('errors should flow', function() {
      var a, b;
      a = stream();
      b = stream();
      expect(a.filterBy(b)).errorsToFlow(a);
      a = stream();
      b = stream();
      expect(a.filterBy(b)).errorsToFlow(b);
      a = prop();
      b = stream();
      expect(a.filterBy(b)).errorsToFlow(a);
      a = prop();
      b = stream();
      expect(a.filterBy(b)).errorsToFlow(b);
      a = stream();
      b = prop();
      expect(a.filterBy(b)).errorsToFlow(a);
      a = stream();
      b = prop();
      expect(a.filterBy(b)).errorsToFlow(b);
      a = prop();
      b = prop();
      expect(a.filterBy(b)).errorsToFlow(a);
      a = prop();
      b = prop();
      return expect(a.filterBy(b)).errorsToFlow(b);
    });
  });
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



},{"../test-helpers.coffee":102}],49:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('filterErrors', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().filterErrors(function() {})).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.filterErrors(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).filterErrors(function() {})).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.filterErrors(function(x) {
        return x > 3;
      })).toEmit([
        -1, {
          error: 4
        }, -2, {
          error: 5
        }, {
          error: 6
        }, '<end>'
      ], function() {
        return send(a, [
          -1, {
            error: 1
          }, {
            error: 2
          }, {
            error: 3
          }, {
            error: 4
          }, -2, {
            error: 5
          }, {
            error: 0
          }, {
            error: 6
          }, '<end>'
        ]);
      });
    });
    return it('shoud use id as default predicate', function() {
      var a;
      a = stream();
      return expect(a.filterErrors()).toEmit([
        -1, {
          error: 4
        }, -2, {
          error: 5
        }, false, {
          error: 6
        }, '<end>'
      ], function() {
        return send(a, [
          -1, {
            error: 0
          }, {
            error: false
          }, {
            error: null
          }, {
            error: 4
          }, -2, {
            error: 5
          }, {
            error: ''
          }, false, {
            error: 6
          }, '<end>'
        ]);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().filterErrors(function() {})).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.filterErrors(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).filterErrors(function() {})).toEmit(['<end:current>']);
    });
    it('should handle events and current', function() {
      var a;
      a = send(prop(), [
        -1, {
          error: 5
        }
      ]);
      return expect(a.filterErrors(function(x) {
        return x > 3;
      })).toEmit([
        {
          current: -1
        }, {
          currentError: 5
        }, {
          error: 4
        }, -2, {
          error: 6
        }, '<end>'
      ], function() {
        return send(a, [
          {
            error: 1
          }, {
            error: 2
          }, {
            error: 3
          }, {
            error: 4
          }, -2, {
            error: 0
          }, {
            error: 6
          }, '<end>'
        ]);
      });
    });
    it('should handle current (not pass)', function() {
      var a;
      a = send(prop(), [
        1, {
          error: 0
        }
      ]);
      return expect(a.filterErrors(function(x) {
        return x > 2;
      })).toEmit([
        {
          current: 1
        }
      ]);
    });
    return it('shoud use id as default predicate', function() {
      var a;
      a = send(prop(), [
        -1, {
          error: 5
        }
      ]);
      expect(a.filterErrors()).toEmit([
        {
          current: -1
        }, {
          currentError: 5
        }, {
          error: 4
        }, -2, {
          error: 6
        }, '<end>'
      ], function() {
        return send(a, [
          {
            error: 0
          }, {
            error: false
          }, {
            error: null
          }, {
            error: 4
          }, -2, {
            error: void 0
          }, {
            error: 6
          }, '<end>'
        ]);
      });
      a = send(prop(), [
        1, {
          error: 0
        }
      ]);
      return expect(a.filterErrors()).toEmit([
        {
          current: 1
        }
      ]);
    });
  });
});



},{"../test-helpers.coffee":102}],50:[function(require,module,exports){
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
      })).toEmit([
        4, 5, {
          error: 7
        }, 6, '<end>'
      ], function() {
        return send(a, [
          1, 2, 4, 5, 0, {
            error: 7
          }, 6, '<end>'
        ]);
      });
    });
    return it('shoud use id as default predicate', function() {
      var a;
      a = stream();
      return expect(a.filter()).toEmit([
        4, 5, {
          error: 7
        }, 6, '<end>'
      ], function() {
        return send(a, [
          0, 0, 4, 5, 0, {
            error: 7
          }, 6, '<end>'
        ]);
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
      a = send(prop(), [
        5, {
          error: 0
        }
      ]);
      return expect(a.filter(function(x) {
        return x > 2;
      })).toEmit([
        {
          current: 5
        }, {
          currentError: 0
        }, 4, {
          error: 7
        }, 3, '<end>'
      ], function() {
        return send(a, [
          4, {
            error: 7
          }, 3, 2, 1, '<end>'
        ]);
      });
    });
    it('should handle current (not pass)', function() {
      var a;
      a = send(prop(), [
        1, {
          error: 0
        }
      ]);
      return expect(a.filter(function(x) {
        return x > 2;
      })).toEmit([
        {
          currentError: 0
        }
      ]);
    });
    return it('shoud use id as default predicate', function() {
      var a;
      a = send(prop(), [
        0, {
          error: -1
        }
      ]);
      expect(a.filter()).toEmit([
        {
          currentError: -1
        }, 4, {
          error: -2
        }, 5, 6, '<end>'
      ], function() {
        return send(a, [
          0, 4, {
            error: -2
          }, 5, 0, 6, '<end>'
        ]);
      });
      a = send(prop(), [
        1, {
          error: -1
        }
      ]);
      return expect(a.filter()).toEmit([
        {
          current: 1
        }, {
          currentError: -1
        }, 4, {
          error: -2
        }, 5, 6, '<end>'
      ], function() {
        return send(a, [
          0, 4, {
            error: -2
          }, 5, 0, 6, '<end>'
        ]);
      });
    });
  });
});



},{"../test-helpers.coffee":102}],51:[function(require,module,exports){
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



},{"../test-helpers.coffee":102}],52:[function(require,module,exports){
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



},{"../test-helpers.coffee":102}],53:[function(require,module,exports){
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



},{"../test-helpers.coffee":102}],54:[function(require,module,exports){
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



},{"../test-helpers.coffee":102}],55:[function(require,module,exports){
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
    it('should work nicely with Kefir.constant and Kefir.never', function() {
      var a;
      a = stream();
      return expect(a.flatMap(function(x) {
        if (x > 2) {
          return Kefir.constant(x);
        } else if (x < 0) {
          return Kefir.constantError(x);
        } else {
          return Kefir.never();
        }
      })).toEmit([
        3, {
          error: -1
        }, 4, {
          error: -2
        }, 5
      ], function() {
        return send(a, [1, 2, 3, -1, 4, -2, 5]);
      });
    });
    it('Bug in flatMap: exception thrown when resubscribing to stream', function() {
      var handler, src, stream1, sub;
      src = Kefir.emitter();
      stream1 = src.flatMap(function(x) {
        return x;
      });
      handler = function() {};
      stream1.onValue(handler);
      sub = Kefir.emitter();
      src.emit(sub);
      src.end();
      stream1.offValue(handler);
      sub.end();
      return stream1.onValue(handler);
    });
    return it('errors should flow', function() {
      var a, b, c, result;
      a = stream();
      b = stream();
      c = prop();
      result = a.flatMap();
      activate(result);
      send(a, [b, c]);
      deactivate(result);
      expect(result).errorsToFlow(a);
      expect(result).errorsToFlow(b);
      return expect(result).errorsToFlow(c);
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
    it('should correctly handle current value of source', function() {
      var a, b;
      a = send(prop(), [0]);
      b = send(prop(), [a]);
      return expect(b.flatMap()).toEmit([
        {
          current: 0
        }
      ]);
    });
    it('errors should flow 1', function() {
      var a, result;
      a = prop();
      result = a.flatMap();
      return expect(result).errorsToFlow(a);
    });
    return it('errors should flow 2', function() {
      var a, b, c, result;
      a = prop();
      b = stream();
      c = prop();
      result = a.flatMap();
      activate(result);
      send(a, [b, c]);
      deactivate(result);
      expect(result).errorsToFlow(b);
      return expect(result).errorsToFlow(c);
    });
  });
});



},{"../test-helpers.coffee":102}],56:[function(require,module,exports){
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
      })).toEmit([
        1, 2, {
          error: 4
        }, 1, 2, 3, '<end>'
      ], function() {
        return send(a, [
          1, 2, {
            error: 4
          }, 3, '<end>'
        ]);
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
      })).toEmit([
        1, 2, {
          error: 4
        }, 1, 2, 3, '<end>'
      ], function() {
        return send(a, [
          2, {
            error: 4
          }, 3, '<end>'
        ]);
      });
    });
    it('should handle current correctly', function() {
      return expect(send(prop(), [
        1, {
          error: 0
        }
      ]).flatten(function(x) {
        var _i, _results;
        return (function() {
          _results = [];
          for (var _i = 1; 1 <= x ? _i <= x : _i >= x; 1 <= x ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this);
      })).toEmit([
        {
          current: 1
        }, {
          currentError: 0
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



},{"../test-helpers.coffee":102}],57:[function(require,module,exports){
var Kefir, activate, deactivate, _ref;

_ref = require('../test-helpers.coffee'), activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('fromBinder', function() {
  it('should return stream', function() {
    return expect(Kefir.fromBinder(function() {})).toBeStream();
  });
  it('should not be ended', function() {
    return expect(Kefir.fromBinder(function() {})).toEmit([]);
  });
  it('should emit values, errors, and end', function() {
    var a, emitter;
    emitter = null;
    a = Kefir.fromBinder(function(em) {
      emitter = em;
      return null;
    });
    return expect(a).toEmit([
      1, 2, {
        error: -1
      }, 3, '<end>'
    ], function() {
      emitter.emit(1);
      emitter.emit(2);
      emitter.error(-1);
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
  it('should automatically controll isCurent argument in `send`', function() {
    expect(Kefir.fromBinder(function(emitter) {
      emitter.end();
      return null;
    })).toEmit(['<end:current>']);
    return expect(Kefir.fromBinder(function(emitter) {
      emitter.emit(1);
      emitter.error(-1);
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
          currentError: -1
        }
      ], [
        0, {
          current: 2
        }
      ], [1000, 2], [1000, '<end>']
    ]);
  });
  it('should support emitter.emitEvent', function() {
    return expect(Kefir.fromBinder(function(emitter) {
      emitter.emitEvent({
        type: 'value',
        value: 1,
        current: true
      });
      emitter.emitEvent({
        type: 'error',
        value: -1,
        current: false
      });
      emitter.emitEvent({
        type: 'value',
        value: 2,
        current: false
      });
      setTimeout(function() {
        emitter.emitEvent({
          type: 'value',
          value: 3,
          current: true
        });
        emitter.emitEvent({
          type: 'value',
          value: 4,
          current: false
        });
        return emitter.emitEvent({
          type: 'end',
          value: void 0,
          current: false
        });
      }, 1000);
      return null;
    })).toEmitInTime([
      [
        0, {
          current: 1
        }
      ], [
        0, {
          currentError: -1
        }
      ], [
        0, {
          current: 2
        }
      ], [1000, 3], [1000, 4], [1000, '<end>']
    ]);
  });
  return it('should work with .take(1) and sync emit', function() {
    var a, log, subCalls, unsubCalls;
    subCalls = 0;
    unsubCalls = 0;
    log = [];
    a = Kefir.fromBinder(function(emitter) {
      var logRecord;
      logRecord = {
        sub: 1,
        unsub: 0
      };
      log.push(logRecord);
      emitter.emit(1);
      return function() {
        return logRecord.unsub++;
      };
    });
    a.take(1).onValue(function() {});
    a.take(1).onValue(function() {});
    return expect(log).toEqual([
      {
        sub: 1,
        unsub: 1
      }, {
        sub: 1,
        unsub: 1
      }
    ]);
  });
});



},{"../test-helpers.coffee":102}],58:[function(require,module,exports){
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



},{"../test-helpers.coffee":102}],59:[function(require,module,exports){
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



},{"../test-helpers.coffee":102}],60:[function(require,module,exports){
var Kefir, activate, deactivate, _ref;

_ref = require('../test-helpers.coffee'), activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('fromNodeCallback', function() {
  it('should return stream', function() {
    return expect(Kefir.fromNodeCallback(function() {})).toBeStream();
  });
  it('should not be ended', function() {
    return expect(Kefir.fromNodeCallback(function() {})).toEmit([]);
  });
  it('should call `callbackConsumer` on first activation, and only on first', function() {
    var count, s;
    count = 0;
    s = Kefir.fromNodeCallback(function() {
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
    return expect(Kefir.fromNodeCallback(function(_cb) {
      return cb = _cb;
    })).toEmit([1, '<end>'], function() {
      return cb(null, 1);
    });
  });
  it('should emit first error and end after that', function() {
    var cb;
    cb = null;
    return expect(Kefir.fromNodeCallback(function(_cb) {
      return cb = _cb;
    })).toEmit([
      {
        error: -1
      }, '<end>'
    ], function() {
      return cb(-1);
    });
  });
  it('should work after deactivation/activate cicle', function() {
    var cb, s;
    cb = null;
    s = Kefir.fromNodeCallback(function(_cb) {
      return cb = _cb;
    });
    activate(s);
    deactivate(s);
    activate(s);
    deactivate(s);
    return expect(s).toEmit([1, '<end>'], function() {
      return cb(null, 1);
    });
  });
  return it('should emit a current, if `callback` is called immediately in `callbackConsumer`', function() {
    expect(Kefir.fromNodeCallback(function(cb) {
      return cb(null, 1);
    })).toEmit([
      {
        current: 1
      }, '<end:current>'
    ]);
    return expect(Kefir.fromNodeCallback(function(cb) {
      return cb(-1);
    })).toEmit([
      {
        currentError: -1
      }, '<end:current>'
    ]);
  });
});



},{"../test-helpers.coffee":102}],61:[function(require,module,exports){
var Kefir;

Kefir = require('../../dist/kefir');

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



},{"../../dist/kefir":1}],62:[function(require,module,exports){
var Kefir, activate, deactivate, _ref;

_ref = require('../test-helpers.coffee'), activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('fromPromise', function() {
  var failedAsync, failedSync, fulfilledAsync, fulfilledSync, inProgress;
  inProgress = {
    then: function() {}
  };
  fulfilledSync = {
    then: function(onSuccess) {
      return onSuccess(1);
    }
  };
  failedSync = {
    then: function(onSuccess, onError) {
      return onError(1);
    }
  };
  fulfilledAsync = {
    then: function(onSuccess) {
      var fulfill;
      fulfill = function() {
        return onSuccess(1);
      };
      return setTimeout(fulfill, 1000);
    }
  };
  failedAsync = {
    then: function(onSuccess, onError) {
      var fail;
      fail = function() {
        return onError(1);
      };
      return setTimeout(fail, 1000);
    }
  };
  it('should return property', function() {
    return expect(Kefir.fromPromise(inProgress)).toBeProperty();
  });
  it('should call `property.then` on first activation, and only on first', function() {
    var count, s;
    count = 0;
    s = Kefir.fromPromise({
      then: function() {
        return count++;
      }
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
  it('should call `property.done`', function() {
    var count, s;
    count = 0;
    s = Kefir.fromPromise({
      then: (function() {
        return this;
      }),
      done: (function() {
        return count++;
      })
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
  it('should work correctly with inProgress property', function() {
    return expect(Kefir.fromPromise(inProgress)).toEmitInTime([]);
  });
  it('... with fulfilledSync property', function() {
    return expect(Kefir.fromPromise(fulfilledSync)).toEmit([
      {
        current: 1
      }, '<end:current>'
    ]);
  });
  it('... with failedSync property', function() {
    return expect(Kefir.fromPromise(failedSync)).toEmit([
      {
        currentError: 1
      }, '<end:current>'
    ]);
  });
  it('... with fulfilledAsync property', function() {
    var a;
    a = Kefir.fromPromise(fulfilledAsync);
    expect(a).toEmitInTime([[1000, 1], [1000, '<end>']]);
    return expect(a).toEmit([
      {
        current: 1
      }, '<end:current>'
    ]);
  });
  return it('... with failedAsync property', function() {
    var a;
    a = Kefir.fromPromise(failedAsync);
    expect(a).toEmitInTime([
      [
        1000, {
          error: 1
        }
      ], [1000, '<end>']
    ]);
    return expect(a).toEmit([
      {
        currentError: 1
      }, '<end:current>'
    ]);
  });
});



},{"../test-helpers.coffee":102}],63:[function(require,module,exports){
var Kefir, activate, deactivate, noop, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ref = require('../test-helpers.coffee'), activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

noop = function() {};

describe('fromSubUnsub', function() {
  var Target;
  Target = (function() {
    function Target() {
      this.unsub = __bind(this.unsub, this);
      this.sub = __bind(this.sub, this);
      this.listener = null;
    }

    Target.prototype.sub = function(fn) {
      return this.listener = fn;
    };

    Target.prototype.unsub = function(fn) {
      return this.listener = null;
    };

    return Target;

  })();
  it('should return stream', function() {
    return expect(Kefir.fromSubUnsub(noop, noop, noop)).toBeStream();
  });
  it('should not be ended', function() {
    return expect(Kefir.fromSubUnsub(noop, noop, noop)).toEmit([]);
  });
  it('should subscribe/unsubscribe from target', function() {
    var a, target;
    target = new Target();
    a = Kefir.fromSubUnsub(target.sub, target.unsub);
    expect(target.listener).toBe(null);
    activate(a);
    expect(target.listener).toEqual(jasmine.any(Function));
    deactivate(a);
    return expect(target.listener).toBe(null);
  });
  it('should emit values', function() {
    var a, target;
    target = new Target();
    a = Kefir.fromSubUnsub(target.sub, target.unsub);
    return expect(a).toEmit([1, 2, 3], function() {
      target.listener(1);
      target.listener(2);
      return target.listener(3);
    });
  });
  return it('should accept optional transformer and call it properly', function() {
    var a, target;
    target = new Target();
    a = Kefir.fromSubUnsub(target.sub, target.unsub, function(a, b) {
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
      target.listener.call({
        a: 1
      });
      target.listener.call({
        b: 1
      }, 1);
      return target.listener.call({
        c: 1
      }, 1, 2);
    });
  });
});



},{"../test-helpers.coffee":102}],64:[function(require,module,exports){
var Kefir;

Kefir = require('../../dist/kefir');

describe('interval', function() {
  it('should return stream', function() {
    return expect(Kefir.interval(100, 1)).toBeStream();
  });
  return it('should repeat same value at certain time', function() {
    return expect(Kefir.interval(100, 1)).toEmitInTime([[100, 1], [200, 1], [300, 1]], null, 350);
  });
});



},{"../../dist/kefir":1}],65:[function(require,module,exports){
var Kefir;

Kefir = require('../../dist/kefir');

describe('later', function() {
  it('should return stream', function() {
    return expect(Kefir.later(100, 1)).toBeStream();
  });
  return it('should emmit value after interval then end', function() {
    return expect(Kefir.later(100, 1)).toEmitInTime([[100, 1], [100, '<end>']]);
  });
});



},{"../../dist/kefir":1}],66:[function(require,module,exports){
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
    it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.mapEnd(function() {
        return 42;
      })).toEmit([1, 2, 42, '<end>'], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
    return it('errors should flow', function() {
      var a;
      a = stream();
      return expect(a.mapEnd(function() {})).errorsToFlow(a);
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
    it('should handle events and current', function() {
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
    return it('errors should flow', function() {
      var a;
      a = prop();
      return expect(a.mapEnd(function() {})).errorsToFlow(a);
    });
  });
});



},{"../test-helpers.coffee":102}],67:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('mapErrors', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().mapErrors(function() {})).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.mapErrors(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).mapErrors(function() {})).toEmit(['<end:current>']);
    });
    return it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.mapErrors(function(x) {
        return x * 2;
      })).toEmit([
        1, {
          error: -2
        }, 2, {
          error: -4
        }, '<end>'
      ], function() {
        return send(a, [
          1, {
            error: -1
          }, 2, {
            error: -2
          }, '<end>'
        ]);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().mapErrors(function() {})).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.mapErrors(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).mapErrors(function() {})).toEmit(['<end:current>']);
    });
    return it('should handle events and current', function() {
      var a;
      a = send(prop(), [
        1, {
          error: -1
        }
      ]);
      return expect(a.mapErrors(function(x) {
        return x * 2;
      })).toEmit([
        {
          current: 1
        }, {
          currentError: -2
        }, 2, {
          error: -4
        }, 3, {
          error: -6
        }, '<end>'
      ], function() {
        return send(a, [
          2, {
            error: -2
          }, 3, {
            error: -3
          }, '<end>'
        ]);
      });
    });
  });
});



},{"../test-helpers.coffee":102}],68:[function(require,module,exports){
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
      })).toEmit([
        2, {
          error: 5
        }, 4, '<end>'
      ], function() {
        return send(a, [
          1, {
            error: 5
          }, 2, '<end>'
        ]);
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
      a = send(prop(), [
        1, {
          error: 0
        }
      ]);
      return expect(a.map(function(x) {
        return x * 2;
      })).toEmit([
        {
          current: 2
        }, {
          currentError: 0
        }, 4, {
          error: 5
        }, 6, '<end>'
      ], function() {
        return send(a, [
          2, {
            error: 5
          }, 3, '<end>'
        ]);
      });
    });
  });
});



},{"../test-helpers.coffee":102}],69:[function(require,module,exports){
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
  it('should deliver currents from all source properties, but only to first subscriber on each activation', function() {
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
  it('errors should flow', function() {
    var a, b, c;
    a = stream();
    b = prop();
    c = stream();
    expect(Kefir.merge([a, b, c])).errorsToFlow(a);
    a = stream();
    b = prop();
    c = stream();
    expect(Kefir.merge([a, b, c])).errorsToFlow(b);
    a = stream();
    b = prop();
    c = stream();
    return expect(Kefir.merge([a, b, c])).errorsToFlow(c);
  });
  return it('should work correctly when unsuscribing after one sync event', function() {
    var a, b, c;
    a = Kefir.constant(1);
    b = Kefir.interval(1000, 1);
    c = a.merge(b);
    activate(c.take(1));
    return expect(b).not.toBeActive();
  });
});



},{"../test-helpers.coffee":102}],70:[function(require,module,exports){
var Kefir;

Kefir = require('../../dist/kefir');

describe('never', function() {
  it('should return stream', function() {
    return expect(Kefir.never()).toBeStream();
  });
  return it('should be ended', function() {
    return expect(Kefir.never()).toEmit(['<end:current>']);
  });
});



},{"../../dist/kefir":1}],71:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('pool', function() {
  it('should return stream', function() {
    expect(Kefir.pool()).toBeStream();
    return expect(new Kefir.Pool()).toBeStream();
  });
  it('should return pool', function() {
    expect(Kefir.pool()).toBePool();
    return expect(new Kefir.Pool()).toBePool();
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
  it('should correctly handle current values of new sub sources', function() {
    var b, c, pool;
    pool = Kefir.pool();
    b = send(prop(), [1]);
    c = send(prop(), [2]);
    return expect(pool).toEmit([1, 2], function() {
      pool.plug(b);
      return pool.plug(c);
    });
  });
  return it('errors should flow', function() {
    var a, b, c, pool;
    a = stream();
    b = prop();
    c = stream();
    pool = Kefir.pool();
    pool.plug(a);
    expect(pool).errorsToFlow(a);
    pool.unplug(a);
    expect(pool).not.errorsToFlow(a);
    pool.plug(a);
    pool.plug(b);
    expect(pool).errorsToFlow(a);
    expect(pool).errorsToFlow(b);
    pool.unplug(b);
    expect(pool).not.errorsToFlow(b);
    pool.plug(c);
    return expect(pool).errorsToFlow(c);
  });
});



},{"../test-helpers.coffee":102}],72:[function(require,module,exports){
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
    it('should activate when first subscriber added (error)', function() {
      var s;
      s = prop();
      s.onError(function() {});
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
    it('should deliver errors and current error', function() {
      var s;
      s = send(prop(), [
        {
          error: 0
        }
      ]);
      return expect(s).toEmit([
        {
          currentError: 0
        }, {
          error: 1
        }, {
          error: 2
        }
      ], function() {
        return send(s, [
          {
            error: 1
          }, {
            error: 2
          }
        ]);
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
    it('onError subscribers should be called with 1 argument', function() {
      var count, s;
      s = send(prop(), [
        {
          error: 0
        }
      ]);
      count = null;
      s.onError(function() {
        return count = arguments.length;
      });
      expect(count).toBe(1);
      send(s, [
        {
          error: 1
        }
      ]);
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



},{"../test-helpers.coffee":102}],73:[function(require,module,exports){
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
    it('if no seed provided uses first value as seed', function() {
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
    return it('errors should flow', function() {
      var a;
      a = stream();
      return expect(a.reduce(minus)).errorsToFlow(a);
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
    it('if no seed provided uses first value as seed', function() {
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
    return it('errors should flow', function() {
      var a;
      a = prop();
      return expect(a.reduce(minus)).errorsToFlow(a);
    });
  });
});



},{"../test-helpers.coffee":102}],74:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('repeat', function() {
  it('should return stream', function() {
    return expect(Kefir.repeat()).toBeStream();
  });
  it('should work correctly (with .constant)', function() {
    var a;
    a = Kefir.repeat(function(i) {
      return Kefir[i === 2 ? 'constantError' : 'constant'](i);
    });
    return expect(a.take(3)).toEmit([
      {
        current: 0
      }, {
        current: 1
      }, {
        currentError: 2
      }, {
        current: 3
      }, '<end:current>'
    ]);
  });
  it('should work correctly (with .later)', function() {
    var a;
    a = Kefir.repeat(function(i) {
      return Kefir.later(100, i);
    });
    return expect(a.take(3)).toEmitInTime([[100, 0], [200, 1], [300, 2], [300, '<end>']]);
  });
  it('should work correctly (with .sequentially)', function() {
    var a;
    a = Kefir.repeat(function(i) {
      return Kefir.sequentially(100, [1, 2, 3]);
    });
    return expect(a.take(5)).toEmitInTime([[100, 1], [200, 2], [300, 3], [400, 1], [500, 2], [500, '<end>']]);
  });
  it('should not cause stack overflow', function() {
    var a, genConstant, sum;
    sum = function(a, b) {
      return a + b;
    };
    genConstant = function() {
      return Kefir.constant(1);
    };
    a = Kefir.repeat(genConstant).take(3000).reduce(sum, 0);
    return expect(a).toEmit([
      {
        current: 3000
      }, '<end:current>'
    ]);
  });
  it('should get new source only if previous one ended', function() {
    var a, b, callsCount;
    a = stream();
    callsCount = 0;
    b = Kefir.repeat(function() {
      callsCount++;
      if (!a._alive) {
        a = stream();
      }
      return a;
    });
    expect(callsCount).toBe(0);
    activate(b);
    expect(callsCount).toBe(1);
    deactivate(b);
    activate(b);
    expect(callsCount).toBe(1);
    send(a, ['<end>']);
    return expect(callsCount).toBe(2);
  });
  it('should unsubscribe from source', function() {
    var a, b;
    a = stream();
    b = Kefir.repeat(function() {
      return a;
    });
    return expect(b).toActivate(a);
  });
  it('should end when falsy value returned from generator', function() {
    var a;
    a = Kefir.repeat(function(i) {
      if (i < 3) {
        return Kefir.constant(i);
      } else {
        return false;
      }
    });
    return expect(a).toEmit([
      {
        current: 0
      }, {
        current: 1
      }, {
        current: 2
      }, '<end>'
    ]);
  });
  return it('should work with @AgentME\'s setup', function() {
    var allSpawned, i, obs, step, _i, _len, _results;
    allSpawned = [];
    i = 0;
    step = function() {
      var a, b, c;
      if (++i === 1) {
        a = Kefir.later(1, 'later');
        allSpawned.push(a);
        return a;
      } else {
        a = Kefir.constant(5);
        b = Kefir.repeatedly(200, [6, 7, 8]);
        c = a.merge(b);
        allSpawned.push(a);
        allSpawned.push(b);
        allSpawned.push(c);
        return c;
      }
    };
    expect(Kefir.repeat(step).take(2)).toEmitInTime([[1, 'later'], [1, 5], [1, '<end>']], (function() {}), 100);
    _results = [];
    for (_i = 0, _len = allSpawned.length; _i < _len; _i++) {
      obs = allSpawned[_i];
      _results.push(expect(obs).not.toBeActive());
    }
    return _results;
  });
});



},{"../test-helpers.coffee":102}],75:[function(require,module,exports){
var Kefir;

Kefir = require('../../dist/kefir');

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



},{"../../dist/kefir":1}],76:[function(require,module,exports){
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
  it('one sampledBy should remove listeners of another', function() {
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
  return it('errors should flow', function() {
    var a, b, c, d;
    a = stream();
    b = prop();
    c = stream();
    d = prop();
    expect(Kefir.sampledBy([a, b], [c, d])).errorsToFlow(a);
    a = stream();
    b = prop();
    c = stream();
    d = prop();
    expect(Kefir.sampledBy([a, b], [c, d])).errorsToFlow(b);
    a = stream();
    b = prop();
    c = stream();
    d = prop();
    expect(Kefir.sampledBy([a, b], [c, d])).errorsToFlow(c);
    a = stream();
    b = prop();
    c = stream();
    d = prop();
    return expect(Kefir.sampledBy([a, b], [c, d])).errorsToFlow(d);
  });
});



},{"../test-helpers.coffee":102}],77:[function(require,module,exports){
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
    it('if no seed provided uses first value as seed', function() {
      var a;
      a = stream();
      return expect(a.scan(minus)).toEmit([0, -1, -4, '<end>'], function() {
        return send(a, [0, 1, 3, '<end>']);
      });
    });
    return it('errors should flow', function() {
      var a;
      a = stream();
      return expect(a.scan(minus)).errorsToFlow(a);
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
    it('if no seed provided uses first value as seed', function() {
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
    return it('errors should flow', function() {
      var a;
      a = prop();
      return expect(a.scan(minus)).errorsToFlow(a);
    });
  });
});



},{"../test-helpers.coffee":102}],78:[function(require,module,exports){
var Kefir;

Kefir = require('../../dist/kefir');

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



},{"../../dist/kefir":1}],79:[function(require,module,exports){
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
    it('should handle events (custom comparator)', function() {
      var a;
      a = stream();
      return expect(a.skipDuplicates(roundlyEqual)).toEmit([1, 2, 3.8, '<end>'], function() {
        return send(a, [1, 1.1, 2, 3.8, 4, '<end>']);
      });
    });
    it('errors should flow', function() {
      var a;
      a = stream();
      return expect(a.skipDuplicates()).errorsToFlow(a);
    });
    return it('should help with creating circular dependencies', function() {
      var a, b;
      a = Kefir.bus();
      b = a.map(function(x) {
        return x;
      });
      a.plug(b.skipDuplicates());
      return expect(b).toEmit([1, 1], function() {
        return a.emit(1);
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
    it('should handle events and current (custom comparator)', function() {
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
    return it('errors should flow', function() {
      var a;
      a = prop();
      return expect(a.skipDuplicates()).errorsToFlow(a);
    });
  });
});



},{"../test-helpers.coffee":102}],80:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('skipEnd', function() {
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
    it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.skipEnd()).toEmit([1, 2], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
    return it('errors should flow', function() {
      var a;
      a = stream();
      return expect(a.skipEnd()).errorsToFlow(a);
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
    it('should handle events and current', function() {
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
    return it('errors should flow', function() {
      var a;
      a = prop();
      return expect(a.skipEnd()).errorsToFlow(a);
    });
  });
});



},{"../test-helpers.coffee":102}],81:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('skipErrors', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().skipErrors()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.skipErrors()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).skipErrors()).toEmit(['<end:current>']);
    });
    return it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.skipErrors()).toEmit([1, 2, '<end>'], function() {
        return send(a, [
          1, {
            error: -1
          }, 2, {
            error: -2
          }, '<end>'
        ]);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().skipErrors()).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.skipErrors()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).skipErrors()).toEmit(['<end:current>']);
    });
    return it('should handle events and current', function() {
      var a;
      a = send(prop(), [
        1, {
          error: -1
        }
      ]);
      return expect(a.skipErrors()).toEmit([
        {
          current: 1
        }, 2, 3, '<end>'
      ], function() {
        return send(a, [
          2, {
            error: -2
          }, 3, {
            error: -3
          }, '<end>'
        ]);
      });
    });
  });
});



},{"../test-helpers.coffee":102}],82:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir, activate = _ref.activate, deactivate = _ref.deactivate;

describe('skipUntilBy', function() {
  describe('common', function() {
    it('errors should flow', function() {
      var a, b;
      a = stream();
      b = stream();
      expect(a.skipUntilBy(b)).errorsToFlow(a);
      a = stream();
      b = stream();
      expect(a.skipUntilBy(b)).errorsToFlow(b);
      a = prop();
      b = stream();
      expect(a.skipUntilBy(b)).errorsToFlow(a);
      a = prop();
      b = stream();
      expect(a.skipUntilBy(b)).errorsToFlow(b);
      a = stream();
      b = prop();
      expect(a.skipUntilBy(b)).errorsToFlow(a);
      a = stream();
      b = prop();
      expect(a.skipUntilBy(b)).errorsToFlow(b);
      a = prop();
      b = prop();
      expect(a.skipUntilBy(b)).errorsToFlow(a);
      a = prop();
      b = prop();
      return expect(a.skipUntilBy(b)).errorsToFlow(b);
    });
    return it('errors should flow after first value from secondary', function() {
      var a, b, res;
      a = stream();
      b = stream();
      res = a.skipUntilBy(b);
      activate(res);
      send(b, [1]);
      deactivate(res);
      return expect(res).errorsToFlow(b);
    });
  });
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
    it('should do activate secondary after first value from it', function() {
      var a, b, res;
      a = stream();
      b = stream();
      res = a.skipUntilBy(b);
      activate(res);
      send(b, [1]);
      deactivate(res);
      expect(res).toActivate(a);
      return expect(res).toActivate(b);
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
    it('should do activate secondary after first value from it', function() {
      var a, b, res;
      a = stream();
      b = prop();
      res = a.skipUntilBy(b);
      activate(res);
      send(b, [1]);
      deactivate(res);
      expect(res).toActivate(a);
      return expect(res).toActivate(b);
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
    it('should do activate secondary after first value from it', function() {
      var a, b, res;
      a = prop();
      b = stream();
      res = a.skipUntilBy(b);
      activate(res);
      send(b, [1]);
      deactivate(res);
      expect(res).toActivate(a);
      return expect(res).toActivate(b);
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
    it('should do activate secondary after first value from it', function() {
      var a, b, res;
      a = prop();
      b = prop();
      res = a.skipUntilBy(b);
      activate(res);
      send(b, [1]);
      deactivate(res);
      expect(res).toActivate(a);
      return expect(res).toActivate(b);
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



},{"../test-helpers.coffee":102}],83:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('skipValues', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().skipValues()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.skipValues()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).skipValues()).toEmit(['<end:current>']);
    });
    return it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.skipValues()).toEmit([
        {
          error: -1
        }, {
          error: -2
        }, '<end>'
      ], function() {
        return send(a, [
          1, {
            error: -1
          }, 2, {
            error: -2
          }, '<end>'
        ]);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().skipValues()).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.skipValues()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).skipValues()).toEmit(['<end:current>']);
    });
    return it('should handle events and current', function() {
      var a;
      a = send(prop(), [
        1, {
          error: -1
        }
      ]);
      return expect(a.skipValues()).toEmit([
        {
          currentError: -1
        }, {
          error: -2
        }, {
          error: -3
        }, '<end>'
      ], function() {
        return send(a, [
          2, {
            error: -2
          }, 3, {
            error: -3
          }, '<end>'
        ]);
      });
    });
  });
});



},{"../test-helpers.coffee":102}],84:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir, deactivate = _ref.deactivate, activate = _ref.activate;

describe('skipWhileBy', function() {
  describe('common', function() {
    it('errors should flow', function() {
      var a, b;
      a = stream();
      b = stream();
      expect(a.skipWhileBy(b)).errorsToFlow(a);
      a = stream();
      b = stream();
      expect(a.skipWhileBy(b)).errorsToFlow(b);
      a = prop();
      b = stream();
      expect(a.skipWhileBy(b)).errorsToFlow(a);
      a = prop();
      b = stream();
      expect(a.skipWhileBy(b)).errorsToFlow(b);
      a = stream();
      b = prop();
      expect(a.skipWhileBy(b)).errorsToFlow(a);
      a = stream();
      b = prop();
      expect(a.skipWhileBy(b)).errorsToFlow(b);
      a = prop();
      b = prop();
      expect(a.skipWhileBy(b)).errorsToFlow(a);
      a = prop();
      b = prop();
      return expect(a.skipWhileBy(b)).errorsToFlow(b);
    });
    return it('errors should flow after first falsey value from secondary', function() {
      var a, b, res;
      a = stream();
      b = stream();
      res = a.skipUntilBy(b);
      activate(res);
      send(b, [true, false]);
      deactivate(res);
      return expect(res).errorsToFlow(b);
    });
  });
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
    it('should do activate secondary after first falsey value from it', function() {
      var a, b, res;
      a = stream();
      b = stream();
      res = a.skipWhileBy(b);
      activate(res);
      send(b, [true, false]);
      deactivate(res);
      expect(res).toActivate(a);
      return expect(res).toActivate(b);
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
    it('should do activate secondary after first falsey value from it', function() {
      var a, b, res;
      a = stream();
      b = prop();
      res = a.skipWhileBy(b);
      activate(res);
      send(b, [true, false]);
      deactivate(res);
      expect(res).toActivate(a);
      return expect(res).toActivate(b);
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
    it('should do activate secondary after first falsey value from it', function() {
      var a, b, res;
      a = prop();
      b = stream();
      res = a.skipWhileBy(b);
      activate(res);
      send(b, [true, false]);
      deactivate(res);
      expect(res).toActivate(a);
      return expect(res).toActivate(b);
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
    it('should do activate secondary after first falsey value from it', function() {
      var a, b, res;
      a = prop();
      b = prop();
      res = a.skipWhileBy(b);
      activate(res);
      send(b, [true, false]);
      deactivate(res);
      expect(res).toActivate(a);
      return expect(res).toActivate(b);
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



},{"../test-helpers.coffee":102}],85:[function(require,module,exports){
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
    it('shoud use id as default predicate', function() {
      var a;
      a = stream();
      return expect(a.skipWhile()).toEmit([0, 4, 5, '<end>'], function() {
        return send(a, [1, 2, 0, 4, 5, '<end>']);
      });
    });
    return it('errors should flow', function() {
      var a;
      a = stream();
      return expect(a.skipWhile()).errorsToFlow(a);
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
    it('shoud use id as default predicate', function() {
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
    return it('errors should flow', function() {
      var a;
      a = prop();
      return expect(a.skipWhile()).errorsToFlow(a);
    });
  });
});



},{"../test-helpers.coffee":102}],86:[function(require,module,exports){
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
    it('should handle events (n == -1)', function() {
      var a;
      a = stream();
      return expect(a.skip(-1)).toEmit([1, 2, 3, '<end>'], function() {
        return send(a, [1, 2, 3, '<end>']);
      });
    });
    return it('errors should flow', function() {
      var a;
      a = stream();
      return expect(a.skip(1)).errorsToFlow(a);
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
    it('should handle events and current (n == -1)', function() {
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
    return it('errors should flow', function() {
      var a;
      a = prop();
      return expect(a.skip(1)).errorsToFlow(a);
    });
  });
});



},{"../test-helpers.coffee":102}],87:[function(require,module,exports){
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
    it('.slidingWindow(3, 4) should work correctly', function() {
      var a;
      a = stream();
      return expect(a.slidingWindow(3, 4)).toEmit(['<end>'], function() {
        return send(a, [1, 2, 3, 4, 5, '<end>']);
      });
    });
    return it('errors should flow', function() {
      var a;
      a = stream();
      return expect(a.slidingWindow(3, 4)).errorsToFlow(a);
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
    it('.slidingWindow(3, 4) should work correctly', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.slidingWindow(3, 4)).toEmit(['<end>'], function() {
        return send(a, [2, 3, 4, 5, '<end>']);
      });
    });
    return it('errors should flow', function() {
      var a;
      a = prop();
      return expect(a.slidingWindow(3, 4)).errorsToFlow(a);
    });
  });
});



},{"../test-helpers.coffee":102}],88:[function(require,module,exports){
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
    it('should activate when first subscriber added (error)', function() {
      var s;
      s = stream();
      s.onError(function() {});
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
      var any1, any2, end1, end2, error1, error2, s, value1, value2;
      s = stream();
      s.onAny((any1 = function() {}));
      s.onAny((any2 = function() {}));
      s.onValue((value1 = function() {}));
      s.onValue((value2 = function() {}));
      s.onError((error1 = function() {}));
      s.onError((error2 = function() {}));
      s.onEnd((end1 = function() {}));
      s.onEnd((end2 = function() {}));
      s.offValue(value1);
      s.offValue(value2);
      s.offError(error1);
      s.offError(error2);
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
    it('should deliver errors', function() {
      var s;
      s = stream();
      return expect(s).toEmit([
        {
          error: 1
        }, {
          error: 2
        }
      ], function() {
        return send(s, [
          {
            error: 1
          }, {
            error: 2
          }
        ]);
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
    it('should not deliver errors to unsubscribed subscribers', function() {
      var a, b, log, s;
      log = [];
      a = function(x) {
        return log.push('a' + x);
      };
      b = function(x) {
        return log.push('b' + x);
      };
      s = stream();
      s.onError(a);
      s.onError(b);
      send(s, [
        {
          error: 1
        }
      ]);
      s.offError(function() {});
      send(s, [
        {
          error: 2
        }
      ]);
      s.offError(a);
      send(s, [
        {
          error: 3
        }
      ]);
      s.offError(b);
      send(s, [
        {
          error: 4
        }
      ]);
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
    it('onError subscribers should be called with 1 argument', function() {
      var count, s;
      s = stream();
      count = null;
      s.onError(function() {
        return count = arguments.length;
      });
      send(s, [
        {
          error: 1
        }
      ]);
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



},{"../test-helpers.coffee":102}],89:[function(require,module,exports){
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



},{"../test-helpers.coffee":102}],90:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('takeUntilBy', function() {
  describe('common', function() {
    return it('errors should flow', function() {
      var a, b;
      a = stream();
      b = stream();
      expect(a.takeUntilBy(b)).errorsToFlow(a);
      a = stream();
      b = stream();
      expect(a.takeUntilBy(b)).errorsToFlow(b);
      a = prop();
      b = stream();
      expect(a.takeUntilBy(b)).errorsToFlow(a);
      a = prop();
      b = stream();
      expect(a.takeUntilBy(b)).errorsToFlow(b);
      a = stream();
      b = prop();
      expect(a.takeUntilBy(b)).errorsToFlow(a);
      a = stream();
      b = prop();
      expect(a.takeUntilBy(b)).errorsToFlow(b);
      a = prop();
      b = prop();
      expect(a.takeUntilBy(b)).errorsToFlow(a);
      a = prop();
      b = prop();
      return expect(a.takeUntilBy(b)).errorsToFlow(b);
    });
  });
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



},{"../test-helpers.coffee":102}],91:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('takeWhileBy', function() {
  describe('common', function() {
    return it('errors should flow', function() {
      var a, b;
      a = stream();
      b = stream();
      expect(a.takeWhileBy(b)).errorsToFlow(a);
      a = stream();
      b = stream();
      expect(a.takeWhileBy(b)).errorsToFlow(b);
      a = prop();
      b = stream();
      expect(a.takeWhileBy(b)).errorsToFlow(a);
      a = prop();
      b = stream();
      expect(a.takeWhileBy(b)).errorsToFlow(b);
      a = stream();
      b = prop();
      expect(a.takeWhileBy(b)).errorsToFlow(a);
      a = stream();
      b = prop();
      expect(a.takeWhileBy(b)).errorsToFlow(b);
      a = prop();
      b = prop();
      expect(a.takeWhileBy(b)).errorsToFlow(a);
      a = prop();
      b = prop();
      return expect(a.takeWhileBy(b)).errorsToFlow(b);
    });
  });
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



},{"../test-helpers.coffee":102}],92:[function(require,module,exports){
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
    it('shoud use id as default predicate', function() {
      var a;
      a = stream();
      return expect(a.takeWhile()).toEmit([1, 2, '<end>'], function() {
        return send(a, [1, 2, 0, 5, '<end>']);
      });
    });
    return it('errors should flow', function() {
      var a;
      a = stream();
      return expect(a.takeWhile()).errorsToFlow(a);
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
    it('shoud use id as default predicate', function() {
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
    return it('errors should flow', function() {
      var a;
      a = prop();
      return expect(a.takeWhile()).errorsToFlow(a);
    });
  });
});



},{"../test-helpers.coffee":102}],93:[function(require,module,exports){
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
    it('should handle events (more than `n`)', function() {
      var a;
      a = stream();
      return expect(a.take(3)).toEmit([1, 2, 3, '<end>'], function() {
        return send(a, [1, 2, 3, 4, 5, '<end>']);
      });
    });
    return it('errors should flow', function() {
      var a;
      a = stream();
      return expect(a.take(1)).errorsToFlow(a);
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
    it('should work correctly with .constant', function() {
      return expect(Kefir.constant(1).take(1)).toEmit([
        {
          current: 1
        }, '<end:current>'
      ]);
    });
    return it('errors should flow', function() {
      var a;
      a = prop();
      return expect(a.take(1)).errorsToFlow(a);
    });
  });
});



},{"../test-helpers.coffee":102}],94:[function(require,module,exports){
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
    it('should handle events {leading: false, trailing: false}', function() {
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
    return it('errors should flow', function() {
      var a;
      a = stream();
      return expect(a.throttle(100)).errorsToFlow(a);
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
    it('should handle events {leading: false, trailing: false}', function() {
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
    return it('errors should flow', function() {
      var a;
      a = prop();
      return expect(a.throttle(100)).errorsToFlow(a);
    });
  });
});



},{"../test-helpers.coffee":102}],95:[function(require,module,exports){
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



},{"../test-helpers.coffee":102}],96:[function(require,module,exports){
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
      var a, p;
      a = stream();
      p = a.toProperty(0);
      expect(p).toEmit([
        {
          current: 0
        }, 1, {
          error: 3
        }, 2, '<end>'
      ], function() {
        return send(a, [
          1, {
            error: 3
          }, 2, '<end>'
        ]);
      });
      return expect(p).toEmit([
        {
          current: 2
        }, {
          currentError: 3
        }, '<end:current>'
      ]);
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().toProperty(0)).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.toProperty(0)).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      expect(send(prop(), ['<end>']).toProperty(0)).toEmit([
        {
          current: 0
        }, '<end:current>'
      ]);
      return expect(send(prop(), [1, '<end>']).toProperty(0)).toEmit([
        {
          current: 1
        }, '<end:current>'
      ]);
    });
    it('should handle events', function() {
      var a, b;
      a = send(prop(), [1]);
      b = a.toProperty(0);
      expect(b).toEmit([
        {
          current: 1
        }, 2, {
          error: 3
        }, '<end>'
      ], function() {
        return send(a, [
          2, {
            error: 3
          }, '<end>'
        ]);
      });
      expect(b).toEmit([
        {
          current: 2
        }, {
          currentError: 3
        }, '<end:current>'
      ]);
      a = prop();
      b = a.toProperty(0);
      expect(b).toEmit([
        {
          current: 0
        }, 2, {
          error: 3
        }, '<end>'
      ], function() {
        return send(a, [
          2, {
            error: 3
          }, '<end>'
        ]);
      });
      return expect(b).toEmit([
        {
          current: 2
        }, {
          currentError: 3
        }, '<end:current>'
      ]);
    });
    return it('if original property has no current, and .toProperty called with no arguments, then result should have no current', function() {
      return expect(prop().toProperty()).toEmit([]);
    });
  });
});



},{"../test-helpers.coffee":102}],97:[function(require,module,exports){
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
        return expect(a.transduce(noop)).toEmit([
          1, 2, {
            error: 4
          }, 3, '<end>'
        ], function() {
          return send(a, [
            1, 2, {
              error: 4
            }, 3, '<end>'
          ]);
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
        a = send(prop(), [
          1, {
            error: 0
          }
        ]);
        return expect(a.transduce(noop)).toEmit([
          {
            current: 1
          }, {
            currentError: 0
          }, 2, {
            error: 4
          }, 3, '<end>'
        ], function() {
          return send(a, [
            2, {
              error: 4
            }, 3, '<end>'
          ]);
        });
      });
    });
  });
  testWithLib('Cognitect Labs', require('transducers-js'));
  return testWithLib('James Long\'s', require('transducers.js'));
});



},{"../test-helpers.coffee":102,"transducers-js":31,"transducers.js":32}],98:[function(require,module,exports){
var Kefir, handler, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

handler = function(x) {
  return {
    convert: x < 0,
    error: x * 3
  };
};

describe('valuesToErrors', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().valuesToErrors(function() {})).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.valuesToErrors(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).valuesToErrors(function() {})).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.valuesToErrors(handler)).toEmit([
        1, {
          error: -6
        }, {
          error: -3
        }, {
          error: -12
        }, 5, '<end>'
      ], function() {
        return send(a, [
          1, -2, {
            error: -3
          }, -4, 5, '<end>'
        ]);
      });
    });
    return it('default handler should convert all values', function() {
      var a;
      a = stream();
      return expect(a.valuesToErrors()).toEmit([
        {
          error: 1
        }, {
          error: -2
        }, {
          error: -3
        }, {
          error: -4
        }, {
          error: 5
        }, '<end>'
      ], function() {
        return send(a, [
          1, -2, {
            error: -3
          }, -4, 5, '<end>'
        ]);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().valuesToErrors(function() {})).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.valuesToErrors(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(prop(), ['<end>']).valuesToErrors(function() {})).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a;
      a = send(prop(), [1]);
      return expect(a.valuesToErrors(handler)).toEmit([
        {
          current: 1
        }, {
          error: -6
        }, {
          error: -3
        }, {
          error: -12
        }, 5, '<end>'
      ], function() {
        return send(a, [
          -2, {
            error: -3
          }, -4, 5, '<end>'
        ]);
      });
    });
    return it('should handle currents', function() {
      var a;
      a = send(prop(), [2]);
      expect(a.valuesToErrors(handler)).toEmit([
        {
          current: 2
        }
      ]);
      a = send(prop(), [-2]);
      expect(a.valuesToErrors(handler)).toEmit([
        {
          currentError: -6
        }
      ]);
      a = send(prop(), [
        -5, {
          error: -2
        }
      ]);
      expect(a.valuesToErrors(handler)).toEmit([
        {
          currentError: -2
        }
      ]);
      a = send(prop(), [
        {
          error: -2
        }, -5
      ]);
      expect(a.valuesToErrors(handler)).toEmit([
        {
          currentError: -2
        }
      ]);
      a = send(prop(), [
        {
          error: -2
        }
      ]);
      expect(a.valuesToErrors(handler)).toEmit([
        {
          currentError: -2
        }
      ]);
      a = send(prop(), [
        1, {
          error: -2
        }
      ]);
      return expect(a.valuesToErrors(handler)).toEmit([
        {
          current: 1
        }, {
          currentError: -2
        }
      ]);
    });
  });
});



},{"../test-helpers.coffee":102}],99:[function(require,module,exports){
var Kefir, prop, send, stream, _ref;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, Kefir = _ref.Kefir;

describe('withHandler', function() {
  var duplicate, emitEventMirror, mirror;
  mirror = function(emitter, event) {
    switch (event.type) {
      case 'value':
        return emitter.emit(event.value);
      case 'error':
        return emitter.error(event.value);
      case 'end':
        return emitter.end();
    }
  };
  emitEventMirror = function(emitter, event) {
    return emitter.emitEvent(event);
  };
  duplicate = function(emitter, event) {
    if (event.type === 'value') {
      emitter.emit(event.value);
      if (!event.current) {
        return emitter.emit(event.value);
      }
    } else if (event.type === 'error') {
      emitter.error(event.value);
      if (!event.current) {
        return emitter.error(event.value);
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
      return expect(a.withHandler(duplicate)).toEmit([
        1, 1, {
          error: 3
        }, {
          error: 3
        }, 2, 2, '<end>'
      ], function() {
        return send(a, [
          1, {
            error: 3
          }, 2, '<end>'
        ]);
      });
    });
    it('should automatically preserve isCurent (end)', function() {
      var a;
      a = stream();
      expect(a.withHandler(mirror)).toEmit(['<end>'], function() {
        return send(a, ['<end>']);
      });
      return expect(a.withHandler(mirror)).toEmit(['<end:current>']);
    });
    return it('should support emitter.emitEvent', function() {
      var a;
      a = stream();
      return expect(a.withHandler(emitEventMirror)).toEmit([
        1, {
          error: 3
        }, 2, '<end>'
      ], function() {
        return send(a, [
          1, {
            error: 3
          }, 2, '<end>'
        ]);
      });
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
      a = send(prop(), [
        1, {
          error: 0
        }
      ]);
      return expect(a.withHandler(duplicate)).toEmit([
        {
          current: 1
        }, {
          currentError: 0
        }, 2, 2, {
          error: 4
        }, {
          error: 4
        }, 3, 3, '<end>'
      ], function() {
        return send(a, [
          2, {
            error: 4
          }, 3, '<end>'
        ]);
      });
    });
    it('should support emitter.emitEvent', function() {
      var a;
      a = send(prop(), [
        1, {
          error: 0
        }
      ]);
      return expect(a.withHandler(emitEventMirror)).toEmit([
        {
          current: 1
        }, {
          currentError: 0
        }, 2, {
          error: 4
        }, 3, '<end>'
      ], function() {
        return send(a, [
          2, {
            error: 4
          }, 3, '<end>'
        ]);
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
    it('should automatically preserve isCurent (value)', function() {
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
    return it('should automatically preserve isCurent (error)', function() {
      var a, savedEmitter;
      a = prop();
      expect(a.withHandler(mirror)).toEmit([
        {
          error: 1
        }
      ], function() {
        return send(a, [
          {
            error: 1
          }
        ]);
      });
      expect(a.withHandler(mirror)).toEmit([
        {
          currentError: 1
        }
      ]);
      savedEmitter = null;
      return expect(a.withHandler(function(emitter, event) {
        mirror(emitter, event);
        return savedEmitter = emitter;
      })).toEmit([
        {
          currentError: 1
        }, {
          error: 2
        }
      ], function() {
        return savedEmitter.emit({
          error: 2
        });
      });
    });
  });
});



},{"../test-helpers.coffee":102}],100:[function(require,module,exports){
var Kefir;

Kefir = require('../../dist/kefir');

describe('withInterval', function() {
  it('should return stream', function() {
    return expect(Kefir.withInterval(100, function() {})).toBeStream();
  });
  it('should work as expected', function() {
    var fn, i;
    i = 0;
    fn = function(emitter) {
      i++;
      if (i === 2) {
        emitter.error(-1);
      } else {
        emitter.emit(i);
        emitter.emit(i * 2);
      }
      if (i === 3) {
        return emitter.end();
      }
    };
    return expect(Kefir.withInterval(100, fn)).toEmitInTime([
      [100, 1], [100, 2], [
        200, {
          error: -1
        }
      ], [300, 3], [300, 6], [300, '<end>']
    ]);
  });
  return it('should support emitter.emitEvent', function() {
    var fn, i;
    i = 0;
    fn = function(emitter) {
      i++;
      if (i === 2) {
        emitter.emitEvent({
          type: 'error',
          value: -1,
          current: false
        });
      } else {
        emitter.emitEvent({
          type: 'value',
          value: i,
          current: true
        });
        emitter.emitEvent({
          type: 'value',
          value: i * 2,
          current: false
        });
      }
      if (i === 3) {
        return emitter.emitEvent({
          type: 'end',
          value: void 0,
          current: false
        });
      }
    };
    return expect(Kefir.withInterval(100, fn)).toEmitInTime([
      [100, 1], [100, 2], [
        200, {
          error: -1
        }
      ], [300, 3], [300, 6], [300, '<end>']
    ]);
  });
});



},{"../../dist/kefir":1}],101:[function(require,module,exports){
var Kefir, activate, deactivate, prop, send, stream, _ref,
  __slice = [].slice;

_ref = require('../test-helpers.coffee'), stream = _ref.stream, prop = _ref.prop, send = _ref.send, activate = _ref.activate, deactivate = _ref.deactivate, Kefir = _ref.Kefir;

describe('zip', function() {
  it('should return stream', function() {
    expect(Kefir.zip([])).toBeStream();
    expect(Kefir.zip([stream(), prop()])).toBeStream();
    expect(stream().zip(stream())).toBeStream();
    return expect(prop().zip(prop())).toBeStream();
  });
  it('should be ended if empty array provided', function() {
    return expect(Kefir.zip([])).toEmit(['<end:current>']);
  });
  it('should be ended if array of ended observables provided', function() {
    var a, b, c;
    a = send(stream(), ['<end>']);
    b = send(prop(), ['<end>']);
    c = send(stream(), ['<end>']);
    expect(Kefir.zip([a, b, c])).toEmit(['<end:current>']);
    return expect(a.zip(b)).toEmit(['<end:current>']);
  });
  it('should be ended and has current if array of ended properties provided and each of them has current', function() {
    var a, b, c;
    a = send(prop(), [1, '<end>']);
    b = send(prop(), [2, '<end>']);
    c = send(prop(), [3, '<end>']);
    expect(Kefir.zip([a, b, c])).toEmit([
      {
        current: [1, 2, 3]
      }, '<end:current>'
    ]);
    return expect(a.zip(b)).toEmit([
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
    expect(Kefir.zip([a, b, c])).toActivate(a, b, c);
    return expect(a.zip(b)).toActivate(a, b);
  });
  it('should handle events and current from observables', function() {
    var a, b, c;
    a = stream();
    b = send(prop(), [0]);
    c = stream();
    expect(Kefir.zip([a, b, c])).toEmit([[1, 0, 3], [4, 2, 5], [6, 9, 8], '<end>'], function() {
      send(a, [1]);
      send(b, [2]);
      send(c, [3]);
      send(a, [4]);
      send(c, [5]);
      send(a, [6, 7]);
      send(c, [8]);
      send(b, [9, '<end>']);
      send(a, ['<end>']);
      return send(c, ['<end>']);
    });
    a = stream();
    b = send(prop(), [0]);
    return expect(a.zip(b)).toEmit([[1, 0], [3, 2], '<end>'], function() {
      send(b, [2]);
      send(a, [1, 3, '<end>']);
      return send(b, ['<end>']);
    });
  });
  it('should support arrays', function() {
    var a, b, c;
    a = [1, 4, 6, 7];
    b = send(prop(), [0]);
    c = stream();
    expect(Kefir.zip([a, b, c])).toEmit([[1, 0, 3], [4, 2, 5], [6, 9, 8], '<end>'], function() {
      send(b, [2]);
      send(c, [3]);
      send(c, [5]);
      send(c, [8]);
      send(b, [9, '<end>']);
      return send(c, ['<end>']);
    });
    a = [1, 3];
    b = send(prop(), [0]);
    return expect(b.zip(a)).toEmit([
      {
        current: [0, 1]
      }, [2, 3], '<end>'
    ], function() {
      send(b, [2]);
      return send(b, ['<end>']);
    });
  });
  it('should work with arrays only', function() {
    return expect(Kefir.zip([[1, 2, 3], [4, 5], [6, 7, 8, 9]])).toEmit([
      {
        current: [1, 4, 6]
      }, {
        current: [2, 5, 7]
      }, '<end:current>'
    ]);
  });
  it('should accept optional combinator function', function() {
    var a, b, c, join;
    join = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return args.join('+');
    };
    a = stream();
    b = send(prop(), [0]);
    c = stream();
    expect(Kefir.zip([a, b, c], join)).toEmit(['1+0+3', '4+2+5', '6+9+8', '<end>'], function() {
      send(a, [1]);
      send(b, [2]);
      send(c, [3]);
      send(a, [4]);
      send(c, [5]);
      send(a, [6, 7]);
      send(c, [8]);
      send(b, [9, '<end>']);
      send(a, ['<end>']);
      return send(c, ['<end>']);
    });
    a = stream();
    b = send(prop(), [0]);
    return expect(a.zip(b, join)).toEmit(['1+0', '3+2', '<end>'], function() {
      send(b, [2]);
      send(a, [1, 3, '<end>']);
      return send(b, ['<end>']);
    });
  });
  it('errors should flow', function() {
    var a, b, c;
    a = stream();
    b = prop();
    c = stream();
    expect(Kefir.zip([a, b, c])).errorsToFlow(a);
    a = stream();
    b = prop();
    c = stream();
    expect(Kefir.zip([a, b, c])).errorsToFlow(b);
    a = stream();
    b = prop();
    c = stream();
    return expect(Kefir.zip([a, b, c])).errorsToFlow(c);
  });
  it('when activating second time and has 2+ properties in sources, should emit current value at most once', function() {
    var a, b, cb;
    a = send(prop(), [0]);
    b = send(prop(), [1]);
    cb = Kefir.zip([a, b]);
    activate(cb);
    deactivate(cb);
    return expect(cb).toEmit([
      {
        current: [0, 1]
      }
    ]);
  });
  return it('should work correctly when unsuscribing after one sync event', function() {
    var a, a0, b, b0, c, c1;
    a0 = stream();
    a = a0.toProperty(1);
    b0 = stream();
    b = b0.toProperty(1);
    c = Kefir.zip([a, b]);
    activate(c1 = c.take(2));
    send(b0, [1, 1]);
    send(a0, [1]);
    deactivate(c1);
    activate(c.take(1));
    return expect(b).not.toBeActive();
  });
});



},{"../test-helpers.coffee":102}],102:[function(require,module,exports){
var Kefir, logItem, sinon, _activateHelper,
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
  } else if (event.type === 'error') {
    if (event.current) {
      return {
        currentError: event.value
      };
    } else {
      return {
        error: event.value
      };
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
  var fn, log, unwatch;
  log = [];
  fn = function(event) {
    return log.push(logItem(event));
  };
  unwatch = function() {
    return obs.offAny(fn);
  };
  obs.onAny(fn);
  return {
    log: log,
    unwatch: unwatch
  };
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
    }
    if (typeof event === 'object' && 'error' in event) {
      obs._send('error', event.error);
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
    toBeEmitter: function() {
      this.message = function() {
        return "Expected " + (this.actual.toString()) + " to be instance of Emitter";
      };
      return this.actual instanceof Kefir.Emitter;
    },
    toBePool: function() {
      this.message = function() {
        return "Expected " + (this.actual.toString()) + " to be instance of Pool";
      };
      return this.actual instanceof Kefir.Pool;
    },
    toBeBus: function() {
      this.message = function() {
        return "Expected " + (this.actual.toString()) + " to be instance of Bus";
      };
      return this.actual instanceof Kefir.Bus;
    },
    toBeActive: function() {
      return this.actual._active;
    },
    toEmit: function(expectedLog, cb) {
      var log, unwatch, _ref;
      _ref = exports.watch(this.actual), log = _ref.log, unwatch = _ref.unwatch;
      if (typeof cb === "function") {
        cb();
      }
      unwatch();
      this.message = function() {
        return "Expected to emit " + (jasmine.pp(expectedLog)) + ", actually emitted " + (jasmine.pp(log));
      };
      return this.env.equals_(expectedLog, log);
    },
    errorsToFlow: function(source) {
      var expectedLog, log, unwatch, _ref;
      expectedLog = this.isNot ? [] : [
        {
          error: -2
        }, {
          error: -3
        }
      ];
      if (this.actual instanceof Kefir.Property) {
        exports.activate(this.actual);
        exports.send(source, [
          {
            error: -1
          }
        ]);
        exports.deactivate(this.actual);
        if (!this.isNot) {
          expectedLog.unshift({
            currentError: -1
          });
        }
      } else if (source instanceof Kefir.Property) {
        exports.send(source, [
          {
            error: -1
          }
        ]);
        if (!this.isNot) {
          expectedLog.unshift({
            currentError: -1
          });
        }
      }
      _ref = exports.watch(this.actual), log = _ref.log, unwatch = _ref.unwatch;
      exports.send(source, [
        {
          error: -2
        }, {
          error: -3
        }
      ]);
      unwatch();
      if (this.isNot) {
        this.message = function() {
          return "Expected errors not to flow (i.e. to emit [], actually emitted " + (jasmine.pp(log)) + ")";
        };
        return !this.env.equals_(expectedLog, log);
      } else {
        this.message = function() {
          return "Expected errors to flow (i.e. to emit " + (jasmine.pp(expectedLog)) + ", actually emitted " + (jasmine.pp(log)) + ")";
        };
        return this.env.equals_(expectedLog, log);
      }
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
    toActivate: function() {
      var andOp, check, correctResults, name, notNotStr, notStr, obs, obss, orOp, tests;
      obss = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      orOp = function(a, b) {
        return a || b;
      };
      andOp = function(a, b) {
        return a && b;
      };
      notStr = (this.isNot ? 'not ' : '');
      notNotStr = (this.isNot ? '' : 'not ');
      tests = {};
      tests["some activated at start"] = true;
      tests["some " + notNotStr + "activated"] = true;
      tests["some " + notNotStr + "deactivated"] = true;
      tests["some " + notNotStr + "activated at second try"] = true;
      tests["some " + notNotStr + "deactivated at second try"] = true;
      correctResults = {};
      correctResults["some activated at start"] = true;
      correctResults["some " + notNotStr + "activated"] = true;
      correctResults["some " + notNotStr + "deactivated"] = true;
      correctResults["some " + notNotStr + "activated at second try"] = true;
      correctResults["some " + notNotStr + "deactivated at second try"] = true;
      if (this.isNot) {
        correctResults["some " + notNotStr + "activated"] = false;
        correctResults["some " + notNotStr + "activated at second try"] = false;
      }
      check = function(test, conditions) {
        var condition, _i, _j, _len, _len1;
        if (correctResults[test] === true) {
          for (_i = 0, _len = conditions.length; _i < _len; _i++) {
            condition = conditions[_i];
            if (!condition) {
              tests[test] = false;
              return;
            }
          }
        } else {
          for (_j = 0, _len1 = conditions.length; _j < _len1; _j++) {
            condition = conditions[_j];
            if (condition) {
              return;
            }
          }
          return tests[test] = false;
        }
      };
      check("some activated at start", (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = obss.length; _i < _len; _i++) {
          obs = obss[_i];
          _results.push(!obs._active);
        }
        return _results;
      })());
      exports.activate(this.actual);
      check("some " + notNotStr + "activated", (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = obss.length; _i < _len; _i++) {
          obs = obss[_i];
          _results.push(obs._active);
        }
        return _results;
      })());
      exports.deactivate(this.actual);
      check("some " + notNotStr + "deactivated", (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = obss.length; _i < _len; _i++) {
          obs = obss[_i];
          _results.push(!obs._active);
        }
        return _results;
      })());
      exports.activate(this.actual);
      check("some " + notNotStr + "activated at second try", (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = obss.length; _i < _len; _i++) {
          obs = obss[_i];
          _results.push(obs._active);
        }
        return _results;
      })());
      exports.deactivate(this.actual);
      check("some " + notNotStr + "deactivated at second try", (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = obss.length; _i < _len; _i++) {
          obs = obss[_i];
          _results.push(!obs._active);
        }
        return _results;
      })());
      this.message = function() {
        var failedTest, name, obssNames;
        failedTest = ((function() {
          var _results;
          _results = [];
          for (name in tests) {
            if (tests[name] !== correctResults[name]) {
              _results.push(name);
            }
          }
          return _results;
        })()).join(', ');
        obssNames = ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = obss.length; _i < _len; _i++) {
            obs = obss[_i];
            _results.push(obs.toString());
          }
          return _results;
        })()).join(', ');
        return "Expected " + (this.actual.toString()) + " to " + notStr + "activate: " + obssNames + " (" + failedTest + ")";
      };
      for (name in tests) {
        if (tests[name] !== correctResults[name]) {
          return this.isNot;
        }
      }
      return !this.isNot;
    }
  });
});



},{"../dist/kefir":1,"sinon":6}]},{},[33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101]);
