(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! Kefir.js v2.7.1
 *  https://github.com/rpominov/kefir
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Kefir"] = factory();
	else
		root["Kefir"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Kefir = module.exports = {};
	Kefir.Kefir = Kefir;

	var Observable = Kefir.Observable = __webpack_require__(1);
	Kefir.Stream = __webpack_require__(6);
	Kefir.Property = __webpack_require__(7);

	// Create a stream
	// -----------------------------------------------------------------------------

	// () -> Stream
	Kefir.never = __webpack_require__(8);

	// (number, any) -> Stream
	Kefir.later = __webpack_require__(9);

	// (number, any) -> Stream
	Kefir.interval = __webpack_require__(11);

	// (number, Array<any>) -> Stream
	Kefir.sequentially = __webpack_require__(12);

	// (number, Function) -> Stream
	Kefir.fromPoll = __webpack_require__(13);

	// (number, Function) -> Stream
	Kefir.withInterval = __webpack_require__(14);

	// (Function) -> Stream
	Kefir.fromCallback = __webpack_require__(16);

	// (Function) -> Stream
	Kefir.fromNodeCallback = __webpack_require__(18);

	// Target = {addEventListener, removeEventListener}|{addListener, removeListener}|{on, off}
	// (Target, string, Function|undefined) -> Stream
	Kefir.fromEvents = __webpack_require__(19);

	// (Function) -> Stream
	Kefir.stream = __webpack_require__(17);

	// Create a property
	// -----------------------------------------------------------------------------

	// (any) -> Property
	Kefir.constant = __webpack_require__(22);

	// (any) -> Property
	Kefir.constantError = __webpack_require__(23);

	// (Promise) -> Property
	Kefir.fromPromise = __webpack_require__(24);

	// Convert observables
	// -----------------------------------------------------------------------------

	// (Stream|Property, Function|undefined) -> Property
	var toProperty = __webpack_require__(25);
	Observable.prototype.toProperty = function (fn) {
	  return toProperty(this, fn);
	};

	// (Stream|Property) -> Stream
	var changes = __webpack_require__(27);
	Observable.prototype.changes = function () {
	  return changes(this);
	};

	// Subscribe / add side effects
	// -----------------------------------------------------------------------------

	// (Stream|Property, Function|undefined) -> Promise
	var toPromise = __webpack_require__(28);
	Observable.prototype.toPromise = function (Promise) {
	  return toPromise(this, Promise);
	};

	// Modify an observable
	// -----------------------------------------------------------------------------

	// (Stream, Function|undefined) -> Stream
	// (Property, Function|undefined) -> Property
	var map = __webpack_require__(29);
	Observable.prototype.map = function (fn) {
	  return map(this, fn);
	};

	// (Stream, Function|undefined) -> Stream
	// (Property, Function|undefined) -> Property
	var filter = __webpack_require__(30);
	Observable.prototype.filter = function (fn) {
	  return filter(this, fn);
	};

	// (Stream, number) -> Stream
	// (Property, number) -> Property
	var take = __webpack_require__(31);
	Observable.prototype.take = function (n) {
	  return take(this, n);
	};

	// (Stream, Function|undefined) -> Stream
	// (Property, Function|undefined) -> Property
	var takeWhile = __webpack_require__(32);
	Observable.prototype.takeWhile = function (fn) {
	  return takeWhile(this, fn);
	};

	// (Stream) -> Stream
	// (Property) -> Property
	var last = __webpack_require__(33);
	Observable.prototype.last = function () {
	  return last(this);
	};

	// (Stream, number) -> Stream
	// (Property, number) -> Property
	var skip = __webpack_require__(34);
	Observable.prototype.skip = function (n) {
	  return skip(this, n);
	};

	// (Stream, Function|undefined) -> Stream
	// (Property, Function|undefined) -> Property
	var skipWhile = __webpack_require__(35);
	Observable.prototype.skipWhile = function (fn) {
	  return skipWhile(this, fn);
	};

	// (Stream, Function|undefined) -> Stream
	// (Property, Function|undefined) -> Property
	var skipDuplicates = __webpack_require__(36);
	Observable.prototype.skipDuplicates = function (fn) {
	  return skipDuplicates(this, fn);
	};

	// (Stream, Function|falsey, any|undefined) -> Stream
	// (Property, Function|falsey, any|undefined) -> Property
	var diff = __webpack_require__(37);
	Observable.prototype.diff = function (fn, seed) {
	  return diff(this, fn, seed);
	};

	// (Stream|Property, Function, any|undefined) -> Property
	var scan = __webpack_require__(38);
	Observable.prototype.scan = function (fn, seed) {
	  return scan(this, fn, seed);
	};

	// (Stream, Function|undefined) -> Stream
	// (Property, Function|undefined) -> Property
	var flatten = __webpack_require__(39);
	Observable.prototype.flatten = function (fn) {
	  return flatten(this, fn);
	};

	// (Stream, number) -> Stream
	// (Property, number) -> Property
	var delay = __webpack_require__(40);
	Observable.prototype.delay = function (wait) {
	  return delay(this, wait);
	};

	// Options = {leading: boolean|undefined, trailing: boolean|undefined}
	// (Stream, number, Options|undefined) -> Stream
	// (Property, number, Options|undefined) -> Property
	var throttle = __webpack_require__(41);
	Observable.prototype.throttle = function (wait, options) {
	  return throttle(this, wait, options);
	};

	// Options = {immediate: boolean|undefined}
	// (Stream, number, Options|undefined) -> Stream
	// (Property, number, Options|undefined) -> Property
	var debounce = __webpack_require__(43);
	Observable.prototype.debounce = function (wait, options) {
	  return debounce(this, wait, options);
	};

	// (Stream, Function|undefined) -> Stream
	// (Property, Function|undefined) -> Property
	var valuesToErrors = __webpack_require__(44);
	Observable.prototype.valuesToErrors = function (fn) {
	  return valuesToErrors(this, fn);
	};

	// (Stream, Function|undefined) -> Stream
	// (Property, Function|undefined) -> Property
	var errorsToValues = __webpack_require__(45);
	Observable.prototype.errorsToValues = function (fn) {
	  return errorsToValues(this, fn);
	};

	// (Stream, Function|undefined) -> Stream
	// (Property, Function|undefined) -> Property
	var mapErrors = __webpack_require__(46);
	Observable.prototype.mapErrors = function (fn) {
	  return mapErrors(this, fn);
	};

	// (Stream, Function|undefined) -> Stream
	// (Property, Function|undefined) -> Property
	var filterErrors = __webpack_require__(47);
	Observable.prototype.filterErrors = function (fn) {
	  return filterErrors(this, fn);
	};

	// (Stream) -> Stream
	// (Property) -> Property
	var endOnError = __webpack_require__(48);
	Observable.prototype.endOnError = function () {
	  return endOnError(this);
	};

	// (Stream) -> Stream
	// (Property) -> Property
	var skipValues = __webpack_require__(49);
	Observable.prototype.skipValues = function () {
	  return skipValues(this);
	};

	// (Stream) -> Stream
	// (Property) -> Property
	var skipErrors = __webpack_require__(50);
	Observable.prototype.skipErrors = function () {
	  return skipErrors(this);
	};

	// (Stream) -> Stream
	// (Property) -> Property
	var skipEnd = __webpack_require__(51);
	Observable.prototype.skipEnd = function () {
	  return skipEnd(this);
	};

	// (Stream, Function) -> Stream
	// (Property, Function) -> Property
	var beforeEnd = __webpack_require__(52);
	Observable.prototype.beforeEnd = function (fn) {
	  return beforeEnd(this, fn);
	};

	// (Stream, number, number|undefined) -> Stream
	// (Property, number, number|undefined) -> Property
	var slidingWindow = __webpack_require__(53);
	Observable.prototype.slidingWindow = function (max, min) {
	  return slidingWindow(this, max, min);
	};

	// Options = {flushOnEnd: boolean|undefined}
	// (Stream, Function|falsey, Options|undefined) -> Stream
	// (Property, Function|falsey, Options|undefined) -> Property
	var bufferWhile = __webpack_require__(54);
	Observable.prototype.bufferWhile = function (fn, options) {
	  return bufferWhile(this, fn, options);
	};

	// (Stream, Function) -> Stream
	// (Property, Function) -> Property
	var transduce = __webpack_require__(55);
	Observable.prototype.transduce = function (transducer) {
	  return transduce(this, transducer);
	};

	// (Stream, Function) -> Stream
	// (Property, Function) -> Property
	var withHandler = __webpack_require__(56);
	Observable.prototype.withHandler = function (fn) {
	  return withHandler(this, fn);
	};

	// Combine observables
	// -----------------------------------------------------------------------------

	// (Array<Stream|Property>, Function|undefiend) -> Stream
	// (Array<Stream|Property>, Array<Stream|Property>, Function|undefiend) -> Stream
	var combine = Kefir.combine = __webpack_require__(57);
	Observable.prototype.combine = function (other, combinator) {
	  return combine([this, other], combinator);
	};

	// (Array<Stream|Property>, Function|undefiend) -> Stream
	var zip = Kefir.zip = __webpack_require__(58);
	Observable.prototype.zip = function (other, combinator) {
	  return zip([this, other], combinator);
	};

	// (Array<Stream|Property>) -> Stream
	var merge = Kefir.merge = __webpack_require__(59);
	Observable.prototype.merge = function (other) {
	  return merge([this, other]);
	};

	// (Array<Stream|Property>) -> Stream
	var concat = Kefir.concat = __webpack_require__(61);
	Observable.prototype.concat = function (other) {
	  return concat([this, other]);
	};

	// () -> Pool
	var Pool = Kefir.Pool = __webpack_require__(63);
	Kefir.pool = function () {
	  return new Pool();
	};

	// (Function) -> Stream
	Kefir.repeat = __webpack_require__(62);

	// Options = {concurLim: number|undefined, queueLim: number|undefined, drop: 'old'|'new'|undefiend}
	// (Stream|Property, Function|falsey, Options|undefined) -> Stream
	var FlatMap = __webpack_require__(64);
	Observable.prototype.flatMap = function (fn) {
	  return new FlatMap(this, fn).setName(this, 'flatMap');
	};
	Observable.prototype.flatMapLatest = function (fn) {
	  return new FlatMap(this, fn, { concurLim: 1, drop: 'old' }).setName(this, 'flatMapLatest');
	};
	Observable.prototype.flatMapFirst = function (fn) {
	  return new FlatMap(this, fn, { concurLim: 1 }).setName(this, 'flatMapFirst');
	};
	Observable.prototype.flatMapConcat = function (fn) {
	  return new FlatMap(this, fn, { queueLim: -1, concurLim: 1 }).setName(this, 'flatMapConcat');
	};
	Observable.prototype.flatMapConcurLimit = function (fn, limit) {
	  return new FlatMap(this, fn, { queueLim: -1, concurLim: limit }).setName(this, 'flatMapConcurLimit');
	};

	// (Stream|Property, Function|falsey) -> Stream
	var FlatMapErrors = __webpack_require__(65);
	Observable.prototype.flatMapErrors = function (fn) {
	  return new FlatMapErrors(this, fn).setName(this, 'flatMapErrors');
	};

	// Combine two observables
	// -----------------------------------------------------------------------------

	// (Stream, Stream|Property) -> Stream
	// (Property, Stream|Property) -> Property
	var filterBy = __webpack_require__(66);
	Observable.prototype.filterBy = function (other) {
	  return filterBy(this, other);
	};

	// (Stream, Stream|Property, Function|undefiend) -> Stream
	// (Property, Stream|Property, Function|undefiend) -> Property
	var sampledBy2items = __webpack_require__(68);
	Observable.prototype.sampledBy = function (other, combinator) {
	  return sampledBy2items(this, other, combinator);
	};

	// (Stream, Stream|Property) -> Stream
	// (Property, Stream|Property) -> Property
	var skipUntilBy = __webpack_require__(69);
	Observable.prototype.skipUntilBy = function (other) {
	  return skipUntilBy(this, other);
	};

	// (Stream, Stream|Property) -> Stream
	// (Property, Stream|Property) -> Property
	var takeUntilBy = __webpack_require__(70);
	Observable.prototype.takeUntilBy = function (other) {
	  return takeUntilBy(this, other);
	};

	// Options = {flushOnEnd: boolean|undefined}
	// (Stream, Stream|Property, Options|undefined) -> Stream
	// (Property, Stream|Property, Options|undefined) -> Property
	var bufferBy = __webpack_require__(71);
	Observable.prototype.bufferBy = function (other, options) {
	  return bufferBy(this, other, options);
	};

	// Options = {flushOnEnd: boolean|undefined}
	// (Stream, Stream|Property, Options|undefined) -> Stream
	// (Property, Stream|Property, Options|undefined) -> Property
	var bufferWhileBy = __webpack_require__(72);
	Observable.prototype.bufferWhileBy = function (other, options) {
	  return bufferWhileBy(this, other, options);
	};

	// (Stream|Property, Stream|Property) -> Property
	var awaiting = __webpack_require__(73);
	Observable.prototype.awaiting = function (other) {
	  return awaiting(this, other);
	};

	// Deprecated
	// -----------------------------------------------------------------------------

	Kefir.DEPRECATION_WARNINGS = true;
	function deprecated(name, alt, fn) {
	  return function () {
	    if (Kefir.DEPRECATION_WARNINGS && typeof console !== 'undefined' && console.log) {

	      var message = 'Method `' + name + '` is deprecated, and to be removed in v3.0.0.\nUse `' + alt + '` instead.\nTo disable all warnings like this set `Kefir.DEPRECATION_WARNINGS = false`.';

	      console.log(message);
	    }
	    return fn.apply(this, arguments);
	  };
	}

	// () -> Emitter
	var Emitter = Kefir.Emitter = __webpack_require__(74);
	Kefir.emitter = deprecated('Kefir.emitter()', 'Kefir.stream()', function () {
	  return new Emitter();
	});

	// () -> Bus
	var Bus = Kefir.Bus = __webpack_require__(75);
	Kefir.bus = deprecated('Kefir.bus()', 'Kefir.pool() or Kefir.stream()', function () {
	  return new Bus();
	});

	// (Stream, Function, any|undefined) -> Stream
	// (Property, Function, any|undefined) -> Property
	var reduce = __webpack_require__(76);
	Observable.prototype.reduce = deprecated('.reduce(fn, seed)', '.scan(fn, seed).last()', function (fn, seed) {
	  return reduce(this, fn, seed);
	});

	// (Array<Stream|Property>, Array<Stream|Property>, Function|undefined) -> Stream
	var sampledByManyItems = __webpack_require__(77);
	Kefir.sampledBy = deprecated('Kefir.sampledBy()', 'Kefir.combine()', sampledByManyItems);

	// (number, Array<any>) -> Stream
	var repeatedly = __webpack_require__(78);
	Kefir.repeatedly = deprecated('Kefir.repeatedly()', 'Kefir.repeat(() => Kefir.sequentially(...)})', repeatedly);

	// (Stream, any) -> Stream
	// (Property, any) -> Property
	var mapTo = __webpack_require__(79);
	Observable.prototype.mapTo = deprecated('.mapTo()', '.map(() => value)', function (x) {
	  return mapTo(this, x);
	});

	// (Stream, Function) -> Stream
	// (Property, Function) -> Property
	var tap = __webpack_require__(80);
	Observable.prototype.tap = deprecated('.tap()', '.map((v) => {fn(v); return v})', function (fn) {
	  return tap(this, fn);
	});

	// (Stream, string) -> Stream
	// (Property, string) -> Property
	var pluck = __webpack_require__(81);
	Observable.prototype.pluck = deprecated('.pluck()', '.map((x) => x.foo)', function (propName) {
	  return pluck(this, propName);
	});

	// (Stream, string, Array) -> Stream
	// (Property, string, Array) -> Property
	var invoke = __webpack_require__(82);
	Observable.prototype.invoke = deprecated('.invoke()', '.map((x) => x.foo())', function (methodName) {
	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  return invoke(this, methodName, args);
	});

	// (Stream) -> Stream
	// (Property) -> Property
	var timestamp = __webpack_require__(83);
	Observable.prototype.timestamp = deprecated('.timestamp()', '.map((x) => {value: x, time: Date.now()})', function () {
	  return timestamp(this);
	});

	// (Array<Stream|Property>) -> Stream
	var and = __webpack_require__(84);
	Kefir.and = deprecated('Kefir.and()', 'Kefir.combine([a, b], (a, b) => a && b)', and);
	Observable.prototype.and = deprecated('.and()', '.combine(other, (a, b) => a && b)', function (other) {
	  return and([this, other]);
	});

	// (Array<Stream|Property>) -> Stream
	var or = __webpack_require__(85);
	Kefir.or = deprecated('Kefir.or()', 'Kefir.combine([a, b], (a, b) => a || b)', or);
	Observable.prototype.or = deprecated('.or()', '.combine(other, (a, b) => a || b)', function (other) {
	  return or([this, other]);
	});

	// (Stream) -> Stream
	// (Property) -> Property
	var not = __webpack_require__(86);
	Observable.prototype.not = deprecated('.not()', '.map((x) => !x)', function () {
	  return not(this);
	});

	// (Function, Function, Function|undefined) -> Stream
	var fromSubUnsub = __webpack_require__(20);
	Kefir.fromSubUnsub = deprecated('.fromSubUnsub()', 'Kefir.stream()', fromSubUnsub);

	// (Stream, Stream|Property) -> Stream
	// (Property, Stream|Property) -> Property
	var takeWhileBy = __webpack_require__(87);
	Observable.prototype.takeWhileBy = deprecated('.takeWhileBy(foo)', '.skipUntilBy(foo.filter((x) => !x))', function (other) {
	  return takeWhileBy(this, other);
	});

	// (Stream, Stream|Property) -> Stream
	// (Property, Stream|Property) -> Property
	var skipWhileBy = __webpack_require__(88);
	Observable.prototype.skipWhileBy = deprecated('.skipWhileBy(foo)', '.takeUntilBy(foo.filter((x) => !x))', function (other) {
	  return skipWhileBy(this, other);
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(2);

	var extend = _require.extend;

	var _require2 = __webpack_require__(3);

	var VALUE = _require2.VALUE;
	var ERROR = _require2.ERROR;
	var ANY = _require2.ANY;
	var END = _require2.END;

	var _require3 = __webpack_require__(4);

	var Dispatcher = _require3.Dispatcher;
	var callSubscriber = _require3.callSubscriber;

	var _require4 = __webpack_require__(5);

	var findByPred = _require4.findByPred;

	function Observable() {
	  this._dispatcher = new Dispatcher();
	  this._active = false;
	  this._alive = true;
	  this._activating = false;
	  this._logHandlers = null;
	}

	extend(Observable.prototype, {

	  _name: 'observable',

	  _onActivation: function _onActivation() {},
	  _onDeactivation: function _onDeactivation() {},

	  _setActive: function _setActive(active) {
	    if (this._active !== active) {
	      this._active = active;
	      if (active) {
	        this._activating = true;
	        this._onActivation();
	        this._activating = false;
	      } else {
	        this._onDeactivation();
	      }
	    }
	  },

	  _clear: function _clear() {
	    this._setActive(false);
	    this._alive = false;
	    this._dispatcher.cleanup();
	    this._dispatcher = null;
	    this._logHandlers = null;
	  },

	  _emit: function _emit(type, x) {
	    switch (type) {
	      case VALUE:
	        return this._emitValue(x);
	      case ERROR:
	        return this._emitError(x);
	      case END:
	        return this._emitEnd();
	    }
	  },

	  _emitValue: function _emitValue(value) {
	    if (this._alive) {
	      this._dispatcher.dispatch({ type: VALUE, value: value, current: this._activating });
	    }
	  },

	  _emitError: function _emitError(value) {
	    if (this._alive) {
	      this._dispatcher.dispatch({ type: ERROR, value: value, current: this._activating });
	    }
	  },

	  _emitEnd: function _emitEnd() {
	    if (this._alive) {
	      this._dispatcher.dispatch({ type: END, current: this._activating });
	      this._clear();
	    }
	  },

	  _on: function _on(type, fn) {
	    if (this._alive) {
	      this._dispatcher.add(type, fn);
	      this._setActive(true);
	    } else {
	      callSubscriber(type, fn, { type: END, current: true });
	    }
	    return this;
	  },

	  _off: function _off(type, fn) {
	    if (this._alive) {
	      var count = this._dispatcher.remove(type, fn);
	      if (count === 0) {
	        this._setActive(false);
	      }
	    }
	    return this;
	  },

	  onValue: function onValue(fn) {
	    return this._on(VALUE, fn);
	  },
	  onError: function onError(fn) {
	    return this._on(ERROR, fn);
	  },
	  onEnd: function onEnd(fn) {
	    return this._on(END, fn);
	  },
	  onAny: function onAny(fn) {
	    return this._on(ANY, fn);
	  },

	  offValue: function offValue(fn) {
	    return this._off(VALUE, fn);
	  },
	  offError: function offError(fn) {
	    return this._off(ERROR, fn);
	  },
	  offEnd: function offEnd(fn) {
	    return this._off(END, fn);
	  },
	  offAny: function offAny(fn) {
	    return this._off(ANY, fn);
	  },

	  // A and B must be subclasses of Stream and Property (order doesn't matter)
	  _ofSameType: function _ofSameType(A, B) {
	    return A.prototype.getType() === this.getType() ? A : B;
	  },

	  setName: function setName(sourceObs, /* optional */selfName) {
	    this._name = selfName ? sourceObs._name + '.' + selfName : sourceObs;
	    return this;
	  },

	  log: function log() {
	    var name = arguments.length <= 0 || arguments[0] === undefined ? this.toString() : arguments[0];

	    var handler = function handler(event) {
	      var type = '<' + event.type + (event.current ? ':current' : '') + '>';
	      if (event.type === END) {
	        console.log(name, type);
	      } else {
	        console.log(name, type, event.value);
	      }
	    };

	    if (this._alive) {
	      if (!this._logHandlers) {
	        this._logHandlers = [];
	      }
	      this._logHandlers.push({ name: name, handler: handler });
	    }

	    this.onAny(handler);

	    return this;
	  },

	  offLog: function offLog() {
	    var name = arguments.length <= 0 || arguments[0] === undefined ? this.toString() : arguments[0];

	    if (this._logHandlers) {
	      var handlerIndex = findByPred(this._logHandlers, function (obj) {
	        return obj.name === name;
	      });
	      if (handlerIndex !== -1) {
	        this.offAny(this._logHandlers[handlerIndex].handler);
	        this._logHandlers.splice(handlerIndex, 1);
	      }
	    }

	    return this;
	  }

	});

	// extend() can't handle `toString` in IE8
	Observable.prototype.toString = function () {
	  return '[' + this._name + ']';
	};

	module.exports = Observable;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	function createObj(proto) {
	  var F = function F() {};
	  F.prototype = proto;
	  return new F();
	}

	function extend(target /*, mixin1, mixin2...*/) {
	  var length = arguments.length,
	      i = undefined,
	      prop = undefined;
	  for (i = 1; i < length; i++) {
	    for (prop in arguments[i]) {
	      target[prop] = arguments[i][prop];
	    }
	  }
	  return target;
	}

	function inherit(Child, Parent /*, mixin1, mixin2...*/) {
	  var length = arguments.length,
	      i = undefined;
	  Child.prototype = createObj(Parent.prototype);
	  Child.prototype.constructor = Child;
	  for (i = 2; i < length; i++) {
	    extend(Child.prototype, arguments[i]);
	  }
	  return Child;
	}

	module.exports = { extend: extend, inherit: inherit };

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	exports.NOTHING = ['<nothing>'];
	exports.END = 'end';
	exports.VALUE = 'value';
	exports.ERROR = 'error';
	exports.ANY = 'any';

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(2);

	var extend = _require.extend;

	var _require2 = __webpack_require__(3);

	var VALUE = _require2.VALUE;
	var ERROR = _require2.ERROR;
	var ANY = _require2.ANY;

	var _require3 = __webpack_require__(5);

	var concat = _require3.concat;
	var findByPred = _require3.findByPred;
	var _remove = _require3.remove;
	var contains = _require3.contains;

	function callSubscriber(type, fn, event) {
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

	function Dispatcher() {
	  this._items = [];
	  this._inLoop = 0;
	  this._removedItems = null;
	}

	extend(Dispatcher.prototype, {

	  add: function add(type, fn) {
	    this._items = concat(this._items, [{ type: type, fn: fn }]);
	    return this._items.length;
	  },

	  remove: function remove(type, fn) {
	    var index = findByPred(this._items, function (x) {
	      return x.type === type && x.fn === fn;
	    });
	    if (this._inLoop !== 0 && index !== -1) {
	      if (this._removedItems === null) {
	        this._removedItems = [];
	      }
	      this._removedItems.push(this._items[index]);
	    }
	    this._items = _remove(this._items, index);
	    return this._items.length;
	  },

	  dispatch: function dispatch(event) {
	    this._inLoop++;
	    for (var i = 0, items = this._items; i < items.length; i++) {
	      if (this._items !== null && (this._removedItems === null || !contains(this._removedItems, items[i]))) {
	        callSubscriber(items[i].type, items[i].fn, event);
	      }
	    }
	    this._inLoop--;
	    if (this._inLoop === 0) {
	      this._removedItems = null;
	    }
	  },

	  cleanup: function cleanup() {
	    this._items = null;
	  }

	});

	module.exports = { callSubscriber: callSubscriber, Dispatcher: Dispatcher };

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	function concat(a, b) {
	  var result = undefined,
	      length = undefined,
	      i = undefined,
	      j = undefined;
	  if (a.length === 0) {
	    return b;
	  }
	  if (b.length === 0) {
	    return a;
	  }
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

	function circleShift(arr, distance) {
	  var length = arr.length,
	      result = new Array(length),
	      i = undefined;
	  for (i = 0; i < length; i++) {
	    result[(i + distance) % length] = arr[i];
	  }
	  return result;
	}

	function find(arr, value) {
	  var length = arr.length,
	      i = undefined;
	  for (i = 0; i < length; i++) {
	    if (arr[i] === value) {
	      return i;
	    }
	  }
	  return -1;
	}

	function findByPred(arr, pred) {
	  var length = arr.length,
	      i = undefined;
	  for (i = 0; i < length; i++) {
	    if (pred(arr[i])) {
	      return i;
	    }
	  }
	  return -1;
	}

	function cloneArray(input) {
	  var length = input.length,
	      result = new Array(length),
	      i = undefined;
	  for (i = 0; i < length; i++) {
	    result[i] = input[i];
	  }
	  return result;
	}

	function remove(input, index) {
	  var length = input.length,
	      result = undefined,
	      i = undefined,
	      j = undefined;
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
	  var length = input.length,
	      result = new Array(length),
	      i = undefined;
	  for (i = 0; i < length; i++) {
	    result[i] = fn(input[i]);
	  }
	  return result;
	}

	function forEach(arr, fn) {
	  var length = arr.length,
	      i = undefined;
	  for (i = 0; i < length; i++) {
	    fn(arr[i]);
	  }
	}

	function fillArray(arr, value) {
	  var length = arr.length,
	      i = undefined;
	  for (i = 0; i < length; i++) {
	    arr[i] = value;
	  }
	}

	function contains(arr, value) {
	  return find(arr, value) !== -1;
	}

	function slide(cur, next, max) {
	  var length = Math.min(max, cur.length + 1),
	      offset = cur.length - length + 1,
	      result = new Array(length),
	      i = undefined;
	  for (i = offset; i < length; i++) {
	    result[i - offset] = cur[i];
	  }
	  result[length - 1] = next;
	  return result;
	}

	module.exports = {
	  concat: concat,
	  circleShift: circleShift,
	  find: find,
	  findByPred: findByPred,
	  cloneArray: cloneArray,
	  remove: remove,
	  removeByPred: removeByPred,
	  map: map,
	  forEach: forEach,
	  fillArray: fillArray,
	  contains: contains,
	  slide: slide
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(2);

	var inherit = _require.inherit;

	var Observable = __webpack_require__(1);

	function Stream() {
	  Observable.call(this);
	}

	inherit(Stream, Observable, {

	  _name: 'stream',

	  getType: function getType() {
	    return 'stream';
	  }

	});

	module.exports = Stream;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(2);

	var inherit = _require.inherit;

	var _require2 = __webpack_require__(3);

	var VALUE = _require2.VALUE;
	var ERROR = _require2.ERROR;
	var END = _require2.END;

	var _require3 = __webpack_require__(4);

	var callSubscriber = _require3.callSubscriber;

	var Observable = __webpack_require__(1);

	function Property() {
	  Observable.call(this);
	  this._currentEvent = null;
	}

	inherit(Property, Observable, {

	  _name: 'property',

	  _emitValue: function _emitValue(value) {
	    if (this._alive) {
	      if (!this._activating) {
	        this._dispatcher.dispatch({ type: VALUE, value: value, current: this._activating });
	      }
	      this._currentEvent = { type: VALUE, value: value, current: true };
	    }
	  },

	  _emitError: function _emitError(value) {
	    if (this._alive) {
	      if (!this._activating) {
	        this._dispatcher.dispatch({ type: ERROR, value: value, current: this._activating });
	      }
	      this._currentEvent = { type: ERROR, value: value, current: true };
	    }
	  },

	  _emitEnd: function _emitEnd() {
	    if (this._alive) {
	      if (!this._activating) {
	        this._dispatcher.dispatch({ type: END, current: this._activating });
	      }
	      this._clear();
	    }
	  },

	  _on: function _on(type, fn) {
	    if (this._alive) {
	      this._dispatcher.add(type, fn);
	      this._setActive(true);
	    }
	    if (this._currentEvent !== null) {
	      callSubscriber(type, fn, this._currentEvent);
	    }
	    if (!this._alive) {
	      callSubscriber(type, fn, { type: END, current: true });
	    }
	    return this;
	  },

	  getType: function getType() {
	    return 'property';
	  }

	});

	module.exports = Property;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Stream = __webpack_require__(6);

	var neverS = new Stream();
	neverS._emitEnd();
	neverS._name = 'never';

	module.exports = function never() {
	  return neverS;
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var timeBased = __webpack_require__(10);

	var S = timeBased({

	  _name: 'later',

	  _init: function _init(_ref) {
	    var x = _ref.x;

	    this._x = x;
	  },

	  _free: function _free() {
	    this._x = null;
	  },

	  _onTick: function _onTick() {
	    this._emitValue(this._x);
	    this._emitEnd();
	  }

	});

	module.exports = function later(wait, x) {
	  return new S(wait, { x: x });
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(2);

	var inherit = _require.inherit;

	var Stream = __webpack_require__(6);

	module.exports = function timeBased(mixin) {

	  function AnonymousStream(wait, options) {
	    var _this = this;

	    Stream.call(this);
	    this._wait = wait;
	    this._intervalId = null;
	    this._$onTick = function () {
	      return _this._onTick();
	    };
	    this._init(options);
	  }

	  inherit(AnonymousStream, Stream, {

	    _init: function _init(options) {},
	    _free: function _free() {},

	    _onTick: function _onTick() {},

	    _onActivation: function _onActivation() {
	      this._intervalId = setInterval(this._$onTick, this._wait);
	    },

	    _onDeactivation: function _onDeactivation() {
	      if (this._intervalId !== null) {
	        clearInterval(this._intervalId);
	        this._intervalId = null;
	      }
	    },

	    _clear: function _clear() {
	      Stream.prototype._clear.call(this);
	      this._$onTick = null;
	      this._free();
	    }

	  }, mixin);

	  return AnonymousStream;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var timeBased = __webpack_require__(10);

	var S = timeBased({

	  _name: 'interval',

	  _init: function _init(_ref) {
	    var x = _ref.x;

	    this._x = x;
	  },

	  _free: function _free() {
	    this._x = null;
	  },

	  _onTick: function _onTick() {
	    this._emitValue(this._x);
	  }

	});

	module.exports = function interval(wait, x) {
	  return new S(wait, { x: x });
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var timeBased = __webpack_require__(10);

	var _require = __webpack_require__(5);

	var cloneArray = _require.cloneArray;

	var never = __webpack_require__(8);

	var S = timeBased({

	  _name: 'sequentially',

	  _init: function _init(_ref) {
	    var xs = _ref.xs;

	    this._xs = cloneArray(xs);
	  },

	  _free: function _free() {
	    this._xs = null;
	  },

	  _onTick: function _onTick() {
	    if (this._xs.length === 1) {
	      this._emitValue(this._xs[0]);
	      this._emitEnd();
	    } else {
	      this._emitValue(this._xs.shift());
	    }
	  }

	});

	module.exports = function sequentially(wait, xs) {
	  return xs.length === 0 ? never() : new S(wait, { xs: xs });
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var timeBased = __webpack_require__(10);

	var S = timeBased({

	  _name: 'fromPoll',

	  _init: function _init(_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },

	  _free: function _free() {
	    this._fn = null;
	  },

	  _onTick: function _onTick() {
	    var fn = this._fn;
	    this._emitValue(fn());
	  }

	});

	module.exports = function fromPoll(wait, fn) {
	  return new S(wait, { fn: fn });
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var timeBased = __webpack_require__(10);
	var emitter = __webpack_require__(15);

	var S = timeBased({

	  _name: 'withInterval',

	  _init: function _init(_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	    this._emitter = emitter(this);
	  },

	  _free: function _free() {
	    this._fn = null;
	    this._emitter = null;
	  },

	  _onTick: function _onTick() {
	    var fn = this._fn;
	    fn(this._emitter);
	  }

	});

	module.exports = function withInterval(wait, fn) {
	  return new S(wait, { fn: fn });
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function emitter(obs) {

	  function value(x) {
	    obs._emitValue(x);
	    return obs._active;
	  }

	  function error(x) {
	    obs._emitError(x);
	    return obs._active;
	  }

	  function end() {
	    obs._emitEnd();
	    return obs._active;
	  }

	  function event(e) {
	    obs._emit(e.type, e.value);
	    return obs._active;
	  }

	  return { value: value, error: error, end: end, event: event, emit: value, emitEvent: event };
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var stream = __webpack_require__(17);

	module.exports = function fromCallback(callbackConsumer) {

	  var called = false;

	  return stream(function (emitter) {

	    if (!called) {
	      callbackConsumer(function (x) {
	        emitter.emit(x);
	        emitter.end();
	      });
	      called = true;
	    }
	  }).setName('fromCallback');
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(2);

	var inherit = _require.inherit;

	var Stream = __webpack_require__(6);
	var emitter = __webpack_require__(15);

	function S(fn) {
	  Stream.call(this);
	  this._fn = fn;
	  this._unsubscribe = null;
	}

	inherit(S, Stream, {

	  _name: 'stream',

	  _onActivation: function _onActivation() {
	    var fn = this._fn;
	    var unsubscribe = fn(emitter(this));
	    this._unsubscribe = typeof unsubscribe === 'function' ? unsubscribe : null;

	    // fix https://github.com/rpominov/kefir/issues/35
	    if (!this._active) {
	      this._callUnsubscribe();
	    }
	  },

	  _callUnsubscribe: function _callUnsubscribe() {
	    if (this._unsubscribe !== null) {
	      this._unsubscribe();
	      this._unsubscribe = null;
	    }
	  },

	  _onDeactivation: function _onDeactivation() {
	    this._callUnsubscribe();
	  },

	  _clear: function _clear() {
	    Stream.prototype._clear.call(this);
	    this._fn = null;
	  }

	});

	module.exports = function stream(fn) {
	  return new S(fn);
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var stream = __webpack_require__(17);

	module.exports = function fromNodeCallback(callbackConsumer) {

	  var called = false;

	  return stream(function (emitter) {

	    if (!called) {
	      callbackConsumer(function (error, x) {
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
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var fromSubUnsub = __webpack_require__(20);

	var pairs = [['addEventListener', 'removeEventListener'], ['addListener', 'removeListener'], ['on', 'off']];

	module.exports = function fromEvents(target, eventName, transformer) {
	  var sub = undefined,
	      unsub = undefined;

	  for (var i = 0; i < pairs.length; i++) {
	    if (typeof target[pairs[i][0]] === 'function' && typeof target[pairs[i][1]] === 'function') {
	      sub = pairs[i][0];
	      unsub = pairs[i][1];
	      break;
	    }
	  }

	  if (sub === undefined) {
	    throw new Error('target don\'t support any of ' + 'addEventListener/removeEventListener, addListener/removeListener, on/off method pair');
	  }

	  return fromSubUnsub(function (handler) {
	    return target[sub](eventName, handler);
	  }, function (handler) {
	    return target[unsub](eventName, handler);
	  }, transformer).setName('fromEvents');
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var stream = __webpack_require__(17);

	var _require = __webpack_require__(21);

	var apply = _require.apply;

	module.exports = function fromSubUnsub(sub, unsub, transformer /* Function | falsey */) {
	  return stream(function (emitter) {

	    var handler = transformer ? function () {
	      emitter.emit(apply(transformer, this, arguments));
	    } : emitter.emit;

	    sub(handler);
	    return function () {
	      return unsub(handler);
	    };
	  }).setName('fromSubUnsub');
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";

	function spread(fn, length) {
	  switch (length) {
	    case 0:
	      return function (a) {
	        return fn();
	      };
	    case 1:
	      return function (a) {
	        return fn(a[0]);
	      };
	    case 2:
	      return function (a) {
	        return fn(a[0], a[1]);
	      };
	    case 3:
	      return function (a) {
	        return fn(a[0], a[1], a[2]);
	      };
	    case 4:
	      return function (a) {
	        return fn(a[0], a[1], a[2], a[3]);
	      };
	    default:
	      return function (a) {
	        return fn.apply(null, a);
	      };
	  }
	}

	function apply(fn, c, a) {
	  var aLength = a ? a.length : 0;
	  if (c == null) {
	    switch (aLength) {
	      case 0:
	        return fn();
	      case 1:
	        return fn(a[0]);
	      case 2:
	        return fn(a[0], a[1]);
	      case 3:
	        return fn(a[0], a[1], a[2]);
	      case 4:
	        return fn(a[0], a[1], a[2], a[3]);
	      default:
	        return fn.apply(null, a);
	    }
	  } else {
	    switch (aLength) {
	      case 0:
	        return fn.call(c);
	      default:
	        return fn.apply(c, a);
	    }
	  }
	}

	module.exports = { spread: spread, apply: apply };

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(2);

	var inherit = _require.inherit;

	var Property = __webpack_require__(7);

	// HACK:
	//   We don't call parent Class constructor, but instead putting all necessary
	//   properties into prototype to simulate ended Property
	//   (see Propperty and Observable classes).

	function P(value) {
	  this._currentEvent = { type: 'value', value: value, current: true };
	}

	inherit(P, Property, {
	  _name: 'constant',
	  _active: false,
	  _activating: false,
	  _alive: false,
	  _dispatcher: null,
	  _logHandlers: null
	});

	module.exports = function constant(x) {
	  return new P(x);
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(2);

	var inherit = _require.inherit;

	var Property = __webpack_require__(7);

	// HACK:
	//   We don't call parent Class constructor, but instead putting all necessary
	//   properties into prototype to simulate ended Property
	//   (see Propperty and Observable classes).

	function P(value) {
	  this._currentEvent = { type: 'error', value: value, current: true };
	}

	inherit(P, Property, {
	  _name: 'constantError',
	  _active: false,
	  _activating: false,
	  _alive: false,
	  _dispatcher: null,
	  _logHandlers: null
	});

	module.exports = function constantError(x) {
	  return new P(x);
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var stream = __webpack_require__(17);
	var toProperty = __webpack_require__(25);

	module.exports = function fromPromise(promise) {

	  var called = false;

	  var result = stream(function (emitter) {
	    if (!called) {
	      var onValue = function onValue(x) {
	        emitter.emit(x);
	        emitter.end();
	      };
	      var onError = function onError(x) {
	        emitter.error(x);
	        emitter.end();
	      };
	      var _promise = promise.then(onValue, onError);

	      // prevent libraries like 'Q' or 'when' from swallowing exceptions
	      if (_promise && typeof _promise.done === 'function') {
	        _promise.done();
	      }

	      called = true;
	    }
	  });

	  return toProperty(result, null).setName('fromPromise');
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createProperty = _require.createProperty;

	var P = createProperty('toProperty', {

	  _init: function _init(_ref) {
	    var fn = _ref.fn;

	    this._getInitialCurrent = fn;
	  },

	  _onActivation: function _onActivation() {
	    if (this._getInitialCurrent !== null) {
	      var getInitial = this._getInitialCurrent;
	      this._emitValue(getInitial());
	    }
	    this._source.onAny(this._$handleAny); // copied from patterns/one-source
	  }

	});

	module.exports = function toProperty(obs) {
	  var fn = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	  if (fn !== null && typeof fn !== 'function') {
	    throw new Error('You should call toProperty() with a function or no arguments.');
	  }
	  return new P(obs, { fn: fn });
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Stream = __webpack_require__(6);
	var Property = __webpack_require__(7);

	var _require = __webpack_require__(2);

	var inherit = _require.inherit;

	var _require2 = __webpack_require__(3);

	var VALUE = _require2.VALUE;
	var ERROR = _require2.ERROR;
	var END = _require2.END;

	function createConstructor(BaseClass, name) {
	  return function AnonymousObservable(source, options) {
	    var _this = this;

	    BaseClass.call(this);
	    this._source = source;
	    this._name = source._name + '.' + name;
	    this._init(options);
	    this._$handleAny = function (event) {
	      return _this._handleAny(event);
	    };
	  };
	}

	function createClassMethods(BaseClass) {
	  return {

	    _init: function _init(options) {},
	    _free: function _free() {},

	    _handleValue: function _handleValue(x) {
	      this._emitValue(x);
	    },
	    _handleError: function _handleError(x) {
	      this._emitError(x);
	    },
	    _handleEnd: function _handleEnd() {
	      this._emitEnd();
	    },

	    _handleAny: function _handleAny(event) {
	      switch (event.type) {
	        case VALUE:
	          return this._handleValue(event.value);
	        case ERROR:
	          return this._handleError(event.value);
	        case END:
	          return this._handleEnd();
	      }
	    },

	    _onActivation: function _onActivation() {
	      this._source.onAny(this._$handleAny);
	    },
	    _onDeactivation: function _onDeactivation() {
	      this._source.offAny(this._$handleAny);
	    },

	    _clear: function _clear() {
	      BaseClass.prototype._clear.call(this);
	      this._source = null;
	      this._$handleAny = null;
	      this._free();
	    }

	  };
	}

	function createStream(name, mixin) {
	  var S = createConstructor(Stream, name);
	  inherit(S, Stream, createClassMethods(Stream), mixin);
	  return S;
	}

	function createProperty(name, mixin) {
	  var P = createConstructor(Property, name);
	  inherit(P, Property, createClassMethods(Property), mixin);
	  return P;
	}

	module.exports = { createStream: createStream, createProperty: createProperty };

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;

	var S = createStream('changes', {

	  _handleValue: function _handleValue(x) {
	    if (!this._activating) {
	      this._emitValue(x);
	    }
	  },

	  _handleError: function _handleError(x) {
	    if (!this._activating) {
	      this._emitError(x);
	    }
	  }

	});

	module.exports = function changes(obs) {
	  return new S(obs);
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';

	function getGlodalPromise() {
	  if (typeof Promise === 'function') {
	    return Promise;
	  } else {
	    throw new Error('There isn\'t default Promise, use shim or parameter');
	  }
	}

	module.exports = function (obs) {
	  var Promise = arguments.length <= 1 || arguments[1] === undefined ? getGlodalPromise() : arguments[1];

	  var last = null;
	  return new Promise(function (resolve, reject) {
	    obs.onAny(function (event) {
	      if (event.type === 'end' && last !== null) {
	        (last.type === 'value' ? resolve : reject)(last.value);
	        last = null;
	      } else {
	        last = event;
	      }
	    });
	  });
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _init: function _init(_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },

	  _free: function _free() {
	    this._fn = null;
	  },

	  _handleValue: function _handleValue(x) {
	    var fn = this._fn;
	    this._emitValue(fn(x));
	  }

	};

	var S = createStream('map', mixin);
	var P = createProperty('map', mixin);

	var id = function id(x) {
	  return x;
	};

	module.exports = function map(obs) {
	  var fn = arguments.length <= 1 || arguments[1] === undefined ? id : arguments[1];

	  return new (obs._ofSameType(S, P))(obs, { fn: fn });
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _init: function _init(_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },

	  _free: function _free() {
	    this._fn = null;
	  },

	  _handleValue: function _handleValue(x) {
	    var fn = this._fn;
	    if (fn(x)) {
	      this._emitValue(x);
	    }
	  }

	};

	var S = createStream('filter', mixin);
	var P = createProperty('filter', mixin);

	var id = function id(x) {
	  return x;
	};

	module.exports = function filter(obs) {
	  var fn = arguments.length <= 1 || arguments[1] === undefined ? id : arguments[1];

	  return new (obs._ofSameType(S, P))(obs, { fn: fn });
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _init: function _init(_ref) {
	    var n = _ref.n;

	    this._n = n;
	    if (n <= 0) {
	      this._emitEnd();
	    }
	  },

	  _handleValue: function _handleValue(x) {
	    this._n--;
	    this._emitValue(x);
	    if (this._n === 0) {
	      this._emitEnd();
	    }
	  }

	};

	var S = createStream('take', mixin);
	var P = createProperty('take', mixin);

	module.exports = function takeWhile(obs, n) {
	  return new (obs._ofSameType(S, P))(obs, { n: n });
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _init: function _init(_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },

	  _free: function _free() {
	    this._fn = null;
	  },

	  _handleValue: function _handleValue(x) {
	    var fn = this._fn;
	    if (fn(x)) {
	      this._emitValue(x);
	    } else {
	      this._emitEnd();
	    }
	  }

	};

	var S = createStream('takeWhile', mixin);
	var P = createProperty('takeWhile', mixin);

	var id = function id(x) {
	  return x;
	};

	module.exports = function takeWhile(obs) {
	  var fn = arguments.length <= 1 || arguments[1] === undefined ? id : arguments[1];

	  return new (obs._ofSameType(S, P))(obs, { fn: fn });
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var _require2 = __webpack_require__(3);

	var NOTHING = _require2.NOTHING;

	var mixin = {

	  _init: function _init() {
	    this._lastValue = NOTHING;
	  },

	  _free: function _free() {
	    this._lastValue = null;
	  },

	  _handleValue: function _handleValue(x) {
	    this._lastValue = x;
	  },

	  _handleEnd: function _handleEnd() {
	    if (this._lastValue !== NOTHING) {
	      this._emitValue(this._lastValue);
	    }
	    this._emitEnd();
	  }

	};

	var S = createStream('last', mixin);
	var P = createProperty('last', mixin);

	module.exports = function last(obs) {
	  return new (obs._ofSameType(S, P))(obs);
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _init: function _init(_ref) {
	    var n = _ref.n;

	    this._n = Math.max(0, n);
	  },

	  _handleValue: function _handleValue(x) {
	    if (this._n === 0) {
	      this._emitValue(x);
	    } else {
	      this._n--;
	    }
	  }

	};

	var S = createStream('skip', mixin);
	var P = createProperty('skip', mixin);

	module.exports = function skip(obs, n) {
	  return new (obs._ofSameType(S, P))(obs, { n: n });
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _init: function _init(_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },

	  _free: function _free() {
	    this._fn = null;
	  },

	  _handleValue: function _handleValue(x) {
	    var fn = this._fn;
	    if (this._fn !== null && !fn(x)) {
	      this._fn = null;
	    }
	    if (this._fn === null) {
	      this._emitValue(x);
	    }
	  }

	};

	var S = createStream('skipWhile', mixin);
	var P = createProperty('skipWhile', mixin);

	var id = function id(x) {
	  return x;
	};

	module.exports = function skipWhile(obs) {
	  var fn = arguments.length <= 1 || arguments[1] === undefined ? id : arguments[1];

	  return new (obs._ofSameType(S, P))(obs, { fn: fn });
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var _require2 = __webpack_require__(3);

	var NOTHING = _require2.NOTHING;

	var mixin = {

	  _init: function _init(_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	    this._prev = NOTHING;
	  },

	  _free: function _free() {
	    this._fn = null;
	    this._prev = null;
	  },

	  _handleValue: function _handleValue(x) {
	    var fn = this._fn;
	    if (this._prev === NOTHING || !fn(this._prev, x)) {
	      this._prev = x;
	      this._emitValue(x);
	    }
	  }

	};

	var S = createStream('skipDuplicates', mixin);
	var P = createProperty('skipDuplicates', mixin);

	var eq = function eq(a, b) {
	  return a === b;
	};

	module.exports = function skipDuplicates(obs) {
	  var fn = arguments.length <= 1 || arguments[1] === undefined ? eq : arguments[1];

	  return new (obs._ofSameType(S, P))(obs, { fn: fn });
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var _require2 = __webpack_require__(3);

	var NOTHING = _require2.NOTHING;

	var mixin = {

	  _init: function _init(_ref) {
	    var fn = _ref.fn;
	    var seed = _ref.seed;

	    this._fn = fn;
	    this._prev = seed;
	  },

	  _free: function _free() {
	    this._prev = null;
	    this._fn = null;
	  },

	  _handleValue: function _handleValue(x) {
	    if (this._prev !== NOTHING) {
	      var fn = this._fn;
	      this._emitValue(fn(this._prev, x));
	    }
	    this._prev = x;
	  }

	};

	var S = createStream('diff', mixin);
	var P = createProperty('diff', mixin);

	function defaultFn(a, b) {
	  return [a, b];
	}

	module.exports = function diff(obs, fn) {
	  var seed = arguments.length <= 2 || arguments[2] === undefined ? NOTHING : arguments[2];

	  return new (obs._ofSameType(S, P))(obs, { fn: fn || defaultFn, seed: seed });
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createProperty = _require.createProperty;

	var _require2 = __webpack_require__(3);

	var ERROR = _require2.ERROR;
	var NOTHING = _require2.NOTHING;

	var P = createProperty('scan', {

	  _init: function _init(_ref) {
	    var fn = _ref.fn;
	    var seed = _ref.seed;

	    this._fn = fn;
	    if (seed !== NOTHING) {
	      this._emitValue(seed);
	    }
	  },

	  _free: function _free() {
	    this._fn = null;
	  },

	  _handleValue: function _handleValue(x) {
	    if (this._currentEvent !== null && this._currentEvent.type !== ERROR) {
	      var fn = this._fn;
	      x = fn(this._currentEvent.value, x);
	    }
	    this._emitValue(x);
	  }

	});

	module.exports = function scan(obs, fn) {
	  var seed = arguments.length <= 2 || arguments[2] === undefined ? NOTHING : arguments[2];

	  return new P(obs, { fn: fn, seed: seed });
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _init: function _init(_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },

	  _free: function _free() {
	    this._fn = null;
	  },

	  _handleValue: function _handleValue(x) {
	    var fn = this._fn;
	    var xs = fn(x);
	    for (var i = 0; i < xs.length; i++) {
	      this._emitValue(xs[i]);
	    }
	  }

	};

	var S = createStream('flatten', mixin);
	var P = createProperty('flatten', mixin);

	var id = function id(x) {
	  return x;
	};

	module.exports = function flatten(obs) {
	  var fn = arguments.length <= 1 || arguments[1] === undefined ? id : arguments[1];

	  return new (obs._ofSameType(S, P))(obs, { fn: fn });
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _init: function _init(_ref) {
	    var _this = this;

	    var wait = _ref.wait;

	    this._wait = Math.max(0, wait);
	    this._buff = [];
	    this._$shiftBuff = function () {
	      return _this._emitValue(_this._buff.shift());
	    };
	  },

	  _free: function _free() {
	    this._buff = null;
	    this._$shiftBuff = null;
	  },

	  _handleValue: function _handleValue(x) {
	    if (this._activating) {
	      this._emitValue(x);
	    } else {
	      this._buff.push(x);
	      setTimeout(this._$shiftBuff, this._wait);
	    }
	  },

	  _handleEnd: function _handleEnd() {
	    var _this2 = this;

	    if (this._activating) {
	      this._emitEnd();
	    } else {
	      setTimeout(function () {
	        return _this2._emitEnd();
	      }, this._wait);
	    }
	  }

	};

	var S = createStream('delay', mixin);
	var P = createProperty('delay', mixin);

	module.exports = function delay(obs, wait) {
	  return new (obs._ofSameType(S, P))(obs, { wait: wait });
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var now = __webpack_require__(42);

	var mixin = {

	  _init: function _init(_ref) {
	    var _this = this;

	    var wait = _ref.wait;
	    var leading = _ref.leading;
	    var trailing = _ref.trailing;

	    this._wait = Math.max(0, wait);
	    this._leading = leading;
	    this._trailing = trailing;
	    this._trailingValue = null;
	    this._timeoutId = null;
	    this._endLater = false;
	    this._lastCallTime = 0;
	    this._$trailingCall = function () {
	      return _this._trailingCall();
	    };
	  },

	  _free: function _free() {
	    this._trailingValue = null;
	    this._$trailingCall = null;
	  },

	  _handleValue: function _handleValue(x) {
	    if (this._activating) {
	      this._emitValue(x);
	    } else {
	      var curTime = now();
	      if (this._lastCallTime === 0 && !this._leading) {
	        this._lastCallTime = curTime;
	      }
	      var remaining = this._wait - (curTime - this._lastCallTime);
	      if (remaining <= 0) {
	        this._cancelTrailing();
	        this._lastCallTime = curTime;
	        this._emitValue(x);
	      } else if (this._trailing) {
	        this._cancelTrailing();
	        this._trailingValue = x;
	        this._timeoutId = setTimeout(this._$trailingCall, remaining);
	      }
	    }
	  },

	  _handleEnd: function _handleEnd() {
	    if (this._activating) {
	      this._emitEnd();
	    } else {
	      if (this._timeoutId) {
	        this._endLater = true;
	      } else {
	        this._emitEnd();
	      }
	    }
	  },

	  _cancelTrailing: function _cancelTrailing() {
	    if (this._timeoutId !== null) {
	      clearTimeout(this._timeoutId);
	      this._timeoutId = null;
	    }
	  },

	  _trailingCall: function _trailingCall() {
	    this._emitValue(this._trailingValue);
	    this._timeoutId = null;
	    this._trailingValue = null;
	    this._lastCallTime = !this._leading ? 0 : now();
	    if (this._endLater) {
	      this._emitEnd();
	    }
	  }

	};

	var S = createStream('throttle', mixin);
	var P = createProperty('throttle', mixin);

	module.exports = function throttle(obs, wait) {
	  var _ref2 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  var _ref2$leading = _ref2.leading;
	  var leading = _ref2$leading === undefined ? true : _ref2$leading;
	  var _ref2$trailing = _ref2.trailing;
	  var trailing = _ref2$trailing === undefined ? true : _ref2$trailing;

	  return new (obs._ofSameType(S, P))(obs, { wait: wait, leading: leading, trailing: trailing });
	};

/***/ },
/* 42 */
/***/ function(module, exports) {

	"use strict";

	module.exports = Date.now ? function () {
	  return Date.now();
	} : function () {
	  return new Date().getTime();
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var now = __webpack_require__(42);

	var mixin = {

	  _init: function _init(_ref) {
	    var _this = this;

	    var wait = _ref.wait;
	    var immediate = _ref.immediate;

	    this._wait = Math.max(0, wait);
	    this._immediate = immediate;
	    this._lastAttempt = 0;
	    this._timeoutId = null;
	    this._laterValue = null;
	    this._endLater = false;
	    this._$later = function () {
	      return _this._later();
	    };
	  },

	  _free: function _free() {
	    this._laterValue = null;
	    this._$later = null;
	  },

	  _handleValue: function _handleValue(x) {
	    if (this._activating) {
	      this._emitValue(x);
	    } else {
	      this._lastAttempt = now();
	      if (this._immediate && !this._timeoutId) {
	        this._emitValue(x);
	      }
	      if (!this._timeoutId) {
	        this._timeoutId = setTimeout(this._$later, this._wait);
	      }
	      if (!this._immediate) {
	        this._laterValue = x;
	      }
	    }
	  },

	  _handleEnd: function _handleEnd() {
	    if (this._activating) {
	      this._emitEnd();
	    } else {
	      if (this._timeoutId && !this._immediate) {
	        this._endLater = true;
	      } else {
	        this._emitEnd();
	      }
	    }
	  },

	  _later: function _later() {
	    var last = now() - this._lastAttempt;
	    if (last < this._wait && last >= 0) {
	      this._timeoutId = setTimeout(this._$later, this._wait - last);
	    } else {
	      this._timeoutId = null;
	      if (!this._immediate) {
	        this._emitValue(this._laterValue);
	        this._laterValue = null;
	      }
	      if (this._endLater) {
	        this._emitEnd();
	      }
	    }
	  }

	};

	var S = createStream('debounce', mixin);
	var P = createProperty('debounce', mixin);

	module.exports = function debounce(obs, wait) {
	  var _ref2 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  var _ref2$immediate = _ref2.immediate;
	  var immediate = _ref2$immediate === undefined ? false : _ref2$immediate;

	  return new (obs._ofSameType(S, P))(obs, { wait: wait, immediate: immediate });
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _init: function _init(_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },

	  _free: function _free() {
	    this._fn = null;
	  },

	  _handleValue: function _handleValue(x) {
	    var fn = this._fn;
	    var result = fn(x);
	    if (result.convert) {
	      this._emitError(result.error);
	    } else {
	      this._emitValue(x);
	    }
	  }

	};

	var S = createStream('valuesToErrors', mixin);
	var P = createProperty('valuesToErrors', mixin);

	var defFn = function defFn(x) {
	  return { convert: true, error: x };
	};

	module.exports = function valuesToErrors(obs) {
	  var fn = arguments.length <= 1 || arguments[1] === undefined ? defFn : arguments[1];

	  return new (obs._ofSameType(S, P))(obs, { fn: fn });
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _init: function _init(_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },

	  _free: function _free() {
	    this._fn = null;
	  },

	  _handleError: function _handleError(x) {
	    var fn = this._fn;
	    var result = fn(x);
	    if (result.convert) {
	      this._emitValue(result.value);
	    } else {
	      this._emitError(x);
	    }
	  }

	};

	var S = createStream('errorsToValues', mixin);
	var P = createProperty('errorsToValues', mixin);

	var defFn = function defFn(x) {
	  return { convert: true, value: x };
	};

	module.exports = function errorsToValues(obs) {
	  var fn = arguments.length <= 1 || arguments[1] === undefined ? defFn : arguments[1];

	  return new (obs._ofSameType(S, P))(obs, { fn: fn });
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _init: function _init(_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },

	  _free: function _free() {
	    this._fn = null;
	  },

	  _handleError: function _handleError(x) {
	    var fn = this._fn;
	    this._emitError(fn(x));
	  }

	};

	var S = createStream('mapErrors', mixin);
	var P = createProperty('mapErrors', mixin);

	var id = function id(x) {
	  return x;
	};

	module.exports = function mapErrors(obs) {
	  var fn = arguments.length <= 1 || arguments[1] === undefined ? id : arguments[1];

	  return new (obs._ofSameType(S, P))(obs, { fn: fn });
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _init: function _init(_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },

	  _free: function _free() {
	    this._fn = null;
	  },

	  _handleError: function _handleError(x) {
	    var fn = this._fn;
	    if (fn(x)) {
	      this._emitError(x);
	    }
	  }

	};

	var S = createStream('filterErrors', mixin);
	var P = createProperty('filterErrors', mixin);

	var id = function id(x) {
	  return x;
	};

	module.exports = function filterErrors(obs) {
	  var fn = arguments.length <= 1 || arguments[1] === undefined ? id : arguments[1];

	  return new (obs._ofSameType(S, P))(obs, { fn: fn });
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _handleError: function _handleError(x) {
	    this._emitError(x);
	    this._emitEnd();
	  }

	};

	var S = createStream('endOnError', mixin);
	var P = createProperty('endOnError', mixin);

	module.exports = function endOnError(obs) {
	  return new (obs._ofSameType(S, P))(obs);
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {
	  _handleValue: function _handleValue() {}
	};

	var S = createStream('skipValues', mixin);
	var P = createProperty('skipValues', mixin);

	module.exports = function skipValues(obs) {
	  return new (obs._ofSameType(S, P))(obs);
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {
	  _handleError: function _handleError() {}
	};

	var S = createStream('skipErrors', mixin);
	var P = createProperty('skipErrors', mixin);

	module.exports = function skipErrors(obs) {
	  return new (obs._ofSameType(S, P))(obs);
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {
	  _handleEnd: function _handleEnd() {}
	};

	var S = createStream('skipEnd', mixin);
	var P = createProperty('skipEnd', mixin);

	module.exports = function skipEnd(obs) {
	  return new (obs._ofSameType(S, P))(obs);
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _init: function _init(_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },

	  _free: function _free() {
	    this._fn = null;
	  },

	  _handleEnd: function _handleEnd() {
	    var fn = this._fn;
	    this._emitValue(fn());
	    this._emitEnd();
	  }

	};

	var S = createStream('beforeEnd', mixin);
	var P = createProperty('beforeEnd', mixin);

	module.exports = function beforeEnd(obs, fn) {
	  return new (obs._ofSameType(S, P))(obs, { fn: fn });
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var _require2 = __webpack_require__(5);

	var slide = _require2.slide;

	var mixin = {

	  _init: function _init(_ref) {
	    var min = _ref.min;
	    var max = _ref.max;

	    this._max = max;
	    this._min = min;
	    this._buff = [];
	  },

	  _free: function _free() {
	    this._buff = null;
	  },

	  _handleValue: function _handleValue(x) {
	    this._buff = slide(this._buff, x, this._max);
	    if (this._buff.length >= this._min) {
	      this._emitValue(this._buff);
	    }
	  }

	};

	var S = createStream('slidingWindow', mixin);
	var P = createProperty('slidingWindow', mixin);

	module.exports = function slidingWindow(obs, max) {
	  var min = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

	  return new (obs._ofSameType(S, P))(obs, { min: min, max: max });
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _init: function _init(_ref) {
	    var fn = _ref.fn;
	    var flushOnEnd = _ref.flushOnEnd;

	    this._fn = fn;
	    this._flushOnEnd = flushOnEnd;
	    this._buff = [];
	  },

	  _free: function _free() {
	    this._buff = null;
	  },

	  _flush: function _flush() {
	    if (this._buff !== null && this._buff.length !== 0) {
	      this._emitValue(this._buff);
	      this._buff = [];
	    }
	  },

	  _handleValue: function _handleValue(x) {
	    this._buff.push(x);
	    var fn = this._fn;
	    if (!fn(x)) {
	      this._flush();
	    }
	  },

	  _handleEnd: function _handleEnd() {
	    if (this._flushOnEnd) {
	      this._flush();
	    }
	    this._emitEnd();
	  }

	};

	var S = createStream('bufferWhile', mixin);
	var P = createProperty('bufferWhile', mixin);

	var id = function id(x) {
	  return x;
	};

	module.exports = function bufferWhile(obs, fn) {
	  var _ref2 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  var _ref2$flushOnEnd = _ref2.flushOnEnd;
	  var flushOnEnd = _ref2$flushOnEnd === undefined ? true : _ref2$flushOnEnd;

	  return new (obs._ofSameType(S, P))(obs, { fn: fn || id, flushOnEnd: flushOnEnd });
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	function xformForObs(obs) {
	  return {

	    '@@transducer/step': function transducerStep(res, input) {
	      obs._emitValue(input);
	      return null;
	    },

	    '@@transducer/result': function transducerResult(res) {
	      obs._emitEnd();
	      return null;
	    }

	  };
	}

	var mixin = {

	  _init: function _init(_ref) {
	    var transducer = _ref.transducer;

	    this._xform = transducer(xformForObs(this));
	  },

	  _free: function _free() {
	    this._xform = null;
	  },

	  _handleValue: function _handleValue(x) {
	    if (this._xform['@@transducer/step'](null, x) !== null) {
	      this._xform['@@transducer/result'](null);
	    }
	  },

	  _handleEnd: function _handleEnd() {
	    this._xform['@@transducer/result'](null);
	  }

	};

	var S = createStream('transduce', mixin);
	var P = createProperty('transduce', mixin);

	module.exports = function transduce(obs, transducer) {
	  return new (obs._ofSameType(S, P))(obs, { transducer: transducer });
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var emitter = __webpack_require__(15);

	var mixin = {

	  _init: function _init(_ref) {
	    var fn = _ref.fn;

	    this._handler = fn;
	    this._emitter = emitter(this);
	  },

	  _free: function _free() {
	    this._handler = null;
	    this._emitter = null;
	  },

	  _handleAny: function _handleAny(event) {
	    this._handler(this._emitter, event);
	  }

	};

	var S = createStream('withHandler', mixin);
	var P = createProperty('withHandler', mixin);

	module.exports = function withHandler(obs, fn) {
	  return new (obs._ofSameType(S, P))(obs, { fn: fn });
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Stream = __webpack_require__(6);

	var _require = __webpack_require__(3);

	var VALUE = _require.VALUE;
	var ERROR = _require.ERROR;
	var NOTHING = _require.NOTHING;

	var _require2 = __webpack_require__(2);

	var inherit = _require2.inherit;

	var _require3 = __webpack_require__(5);

	var concat = _require3.concat;
	var fillArray = _require3.fillArray;

	var _require4 = __webpack_require__(21);

	var spread = _require4.spread;

	var never = __webpack_require__(8);

	function defaultErrorsCombinator(errors) {
	  var latestError = undefined;
	  for (var i = 0; i < errors.length; i++) {
	    if (errors[i] !== undefined) {
	      if (latestError === undefined || latestError.index < errors[i].index) {
	        latestError = errors[i];
	      }
	    }
	  }
	  return latestError.error;
	}

	function Combine(active, passive, combinator) {
	  var _this = this;

	  Stream.call(this);
	  this._activeCount = active.length;
	  this._sources = concat(active, passive);
	  this._combinator = combinator ? spread(combinator, this._sources.length) : function (x) {
	    return x;
	  };
	  this._aliveCount = 0;
	  this._latestValues = new Array(this._sources.length);
	  this._latestErrors = new Array(this._sources.length);
	  fillArray(this._latestValues, NOTHING);
	  this._emitAfterActivation = false;
	  this._endAfterActivation = false;
	  this._latestErrorIndex = 0;

	  this._$handlers = [];

	  var _loop = function (i) {
	    _this._$handlers.push(function (event) {
	      return _this._handleAny(i, event);
	    });
	  };

	  for (var i = 0; i < this._sources.length; i++) {
	    _loop(i);
	  }
	}

	inherit(Combine, Stream, {

	  _name: 'combine',

	  _onActivation: function _onActivation() {
	    this._aliveCount = this._activeCount;

	    // we need to suscribe to _passive_ sources before _active_
	    // (see https://github.com/rpominov/kefir/issues/98)
	    for (var i = this._activeCount; i < this._sources.length; i++) {
	      this._sources[i].onAny(this._$handlers[i]);
	    }
	    for (var i = 0; i < this._activeCount; i++) {
	      this._sources[i].onAny(this._$handlers[i]);
	    }

	    if (this._emitAfterActivation) {
	      this._emitAfterActivation = false;
	      this._emitIfFull();
	    }
	    if (this._endAfterActivation) {
	      this._emitEnd();
	    }
	  },

	  _onDeactivation: function _onDeactivation() {
	    var length = this._sources.length,
	        i = undefined;
	    for (i = 0; i < length; i++) {
	      this._sources[i].offAny(this._$handlers[i]);
	    }
	  },

	  _emitIfFull: function _emitIfFull() {
	    var hasAllValues = true;
	    var hasErrors = false;
	    var length = this._latestValues.length;
	    var valuesCopy = new Array(length);
	    var errorsCopy = new Array(length);;

	    for (var i = 0; i < length; i++) {
	      valuesCopy[i] = this._latestValues[i];
	      errorsCopy[i] = this._latestErrors[i];

	      if (valuesCopy[i] === NOTHING) {
	        hasAllValues = false;
	      }

	      if (errorsCopy[i] !== undefined) {
	        hasErrors = true;
	      }
	    }

	    if (hasAllValues) {
	      var combinator = this._combinator;
	      this._emitValue(combinator(valuesCopy));
	    }
	    if (hasErrors) {
	      this._emitError(defaultErrorsCombinator(errorsCopy));
	    }
	  },

	  _handleAny: function _handleAny(i, event) {

	    if (event.type === VALUE || event.type === ERROR) {

	      if (event.type === VALUE) {
	        this._latestValues[i] = event.value;
	        this._latestErrors[i] = undefined;
	      }
	      if (event.type === ERROR) {
	        this._latestValues[i] = NOTHING;
	        this._latestErrors[i] = {
	          index: this._latestErrorIndex++,
	          error: event.value
	        };
	      }

	      if (i < this._activeCount) {
	        if (this._activating) {
	          this._emitAfterActivation = true;
	        } else {
	          this._emitIfFull();
	        }
	      }
	    } else {
	      // END

	      if (i < this._activeCount) {
	        this._aliveCount--;
	        if (this._aliveCount === 0) {
	          if (this._activating) {
	            this._endAfterActivation = true;
	          } else {
	            this._emitEnd();
	          }
	        }
	      }
	    }
	  },

	  _clear: function _clear() {
	    Stream.prototype._clear.call(this);
	    this._sources = null;
	    this._latestValues = null;
	    this._latestErrors = null;
	    this._combinator = null;
	    this._$handlers = null;
	  }

	});

	module.exports = function combine(active, passive, combinator) {
	  if (passive === undefined) passive = [];

	  if (typeof passive === 'function') {
	    combinator = passive;
	    passive = [];
	  }
	  return active.length === 0 ? never() : new Combine(active, passive, combinator);
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Stream = __webpack_require__(6);

	var _require = __webpack_require__(3);

	var VALUE = _require.VALUE;
	var ERROR = _require.ERROR;
	var END = _require.END;

	var _require2 = __webpack_require__(2);

	var inherit = _require2.inherit;

	var _require3 = __webpack_require__(5);

	var map = _require3.map;
	var cloneArray = _require3.cloneArray;

	var _require4 = __webpack_require__(21);

	var spread = _require4.spread;

	var never = __webpack_require__(8);

	var isArray = Array.isArray || function (xs) {
	  return Object.prototype.toString.call(xs) === '[object Array]';
	};

	function Zip(sources, combinator) {
	  var _this = this;

	  Stream.call(this);

	  this._buffers = map(sources, function (source) {
	    return isArray(source) ? cloneArray(source) : [];
	  });
	  this._sources = map(sources, function (source) {
	    return isArray(source) ? never() : source;
	  });

	  this._combinator = combinator ? spread(combinator, this._sources.length) : function (x) {
	    return x;
	  };
	  this._aliveCount = 0;

	  this._$handlers = [];

	  var _loop = function (i) {
	    _this._$handlers.push(function (event) {
	      return _this._handleAny(i, event);
	    });
	  };

	  for (var i = 0; i < this._sources.length; i++) {
	    _loop(i);
	  }
	}

	inherit(Zip, Stream, {

	  _name: 'zip',

	  _onActivation: function _onActivation() {

	    // if all sources are arrays
	    while (this._isFull()) {
	      this._emit();
	    }

	    var length = this._sources.length;
	    this._aliveCount = length;
	    for (var i = 0; i < length && this._active; i++) {
	      this._sources[i].onAny(this._$handlers[i]);
	    }
	  },

	  _onDeactivation: function _onDeactivation() {
	    for (var i = 0; i < this._sources.length; i++) {
	      this._sources[i].offAny(this._$handlers[i]);
	    }
	  },

	  _emit: function _emit() {
	    var values = new Array(this._buffers.length);
	    for (var i = 0; i < this._buffers.length; i++) {
	      values[i] = this._buffers[i].shift();
	    }
	    var combinator = this._combinator;
	    this._emitValue(combinator(values));
	  },

	  _isFull: function _isFull() {
	    for (var i = 0; i < this._buffers.length; i++) {
	      if (this._buffers[i].length === 0) {
	        return false;
	      }
	    }
	    return true;
	  },

	  _handleAny: function _handleAny(i, event) {
	    if (event.type === VALUE) {
	      this._buffers[i].push(event.value);
	      if (this._isFull()) {
	        this._emit();
	      }
	    }
	    if (event.type === ERROR) {
	      this._emitError(event.value);
	    }
	    if (event.type === END) {
	      this._aliveCount--;
	      if (this._aliveCount === 0) {
	        this._emitEnd();
	      }
	    }
	  },

	  _clear: function _clear() {
	    Stream.prototype._clear.call(this);
	    this._sources = null;
	    this._buffers = null;
	    this._combinator = null;
	    this._$handlers = null;
	  }

	});

	module.exports = function zip(observables, combinator /* Function | falsey */) {
	  return observables.length === 0 ? never() : new Zip(observables, combinator);
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(2);

	var inherit = _require.inherit;

	var AbstractPool = __webpack_require__(60);
	var never = __webpack_require__(8);

	function Merge(sources) {
	  AbstractPool.call(this);
	  this._addAll(sources);
	  this._initialised = true;
	}

	inherit(Merge, AbstractPool, {

	  _name: 'merge',

	  _onEmpty: function _onEmpty() {
	    if (this._initialised) {
	      this._emitEnd();
	    }
	  }

	});

	module.exports = function merge(observables) {
	  return observables.length === 0 ? never() : new Merge(observables);
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Stream = __webpack_require__(6);

	var _require = __webpack_require__(3);

	var VALUE = _require.VALUE;
	var ERROR = _require.ERROR;

	var _require2 = __webpack_require__(2);

	var inherit = _require2.inherit;

	var _require3 = __webpack_require__(5);

	var concat = _require3.concat;
	var forEach = _require3.forEach;
	var findByPred = _require3.findByPred;
	var find = _require3.find;
	var remove = _require3.remove;
	var cloneArray = _require3.cloneArray;

	var id = function id(x) {
	  return x;
	};

	function AbstractPool() {
	  var _this = this;

	  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  var _ref$queueLim = _ref.queueLim;
	  var queueLim = _ref$queueLim === undefined ? 0 : _ref$queueLim;
	  var _ref$concurLim = _ref.concurLim;
	  var concurLim = _ref$concurLim === undefined ? -1 : _ref$concurLim;
	  var _ref$drop = _ref.drop;
	  var drop = _ref$drop === undefined ? 'new' : _ref$drop;

	  Stream.call(this);

	  this._queueLim = queueLim < 0 ? -1 : queueLim;
	  this._concurLim = concurLim < 0 ? -1 : concurLim;
	  this._drop = drop;
	  this._queue = [];
	  this._curSources = [];
	  this._$handleSubAny = function (event) {
	    return _this._handleSubAny(event);
	  };
	  this._$endHandlers = [];
	  this._currentlyAdding = null;

	  if (this._concurLim === 0) {
	    this._emitEnd();
	  }
	}

	inherit(AbstractPool, Stream, {

	  _name: 'abstractPool',

	  _add: function _add(obj, toObs /* Function | falsey */) {
	    toObs = toObs || id;
	    if (this._concurLim === -1 || this._curSources.length < this._concurLim) {
	      this._addToCur(toObs(obj));
	    } else {
	      if (this._queueLim === -1 || this._queue.length < this._queueLim) {
	        this._addToQueue(toObs(obj));
	      } else if (this._drop === 'old') {
	        this._removeOldest();
	        this._add(obj, toObs);
	      }
	    }
	  },

	  _addAll: function _addAll(obss) {
	    var _this2 = this;

	    forEach(obss, function (obs) {
	      return _this2._add(obs);
	    });
	  },

	  _remove: function _remove(obs) {
	    if (this._removeCur(obs) === -1) {
	      this._removeQueue(obs);
	    }
	  },

	  _addToQueue: function _addToQueue(obs) {
	    this._queue = concat(this._queue, [obs]);
	  },

	  _addToCur: function _addToCur(obs) {
	    if (this._active) {

	      // HACK:
	      //
	      // We have two optimizations for cases when `obs` is ended. We don't want
	      // to add such observable to the list, but only want to emit events
	      // from it (if it has some).
	      //
	      // Instead of this hacks, we could just did following,
	      // but it would be 5-8 times slower:
	      //
	      //     this._curSources = concat(this._curSources, [obs]);
	      //     this._subscribe(obs);
	      //

	      // #1
	      // This one for cases when `obs` already ended
	      // e.g., Kefir.constant() or Kefir.never()
	      if (!obs._alive) {
	        if (obs._currentEvent) {
	          this._emit(obs._currentEvent.type, obs._currentEvent.value);
	        }
	        return;
	      }

	      // #2
	      // This one is for cases when `obs` going to end synchronously on
	      // first subscriber e.g., Kefir.stream(em => {em.emit(1); em.end()})
	      this._currentlyAdding = obs;
	      obs.onAny(this._$handleSubAny);
	      this._currentlyAdding = null;
	      if (obs._alive) {
	        this._curSources = concat(this._curSources, [obs]);
	        if (this._active) {
	          this._subToEnd(obs);
	        }
	      }
	    } else {
	      this._curSources = concat(this._curSources, [obs]);
	    }
	  },

	  _subToEnd: function _subToEnd(obs) {
	    var _this3 = this;

	    var onEnd = function onEnd() {
	      return _this3._removeCur(obs);
	    };
	    this._$endHandlers.push({ obs: obs, handler: onEnd });
	    obs.onEnd(onEnd);
	  },

	  _subscribe: function _subscribe(obs) {
	    obs.onAny(this._$handleSubAny);

	    // it can become inactive in responce of subscribing to `obs.onAny` above
	    if (this._active) {
	      this._subToEnd(obs);
	    }
	  },

	  _unsubscribe: function _unsubscribe(obs) {
	    obs.offAny(this._$handleSubAny);

	    var onEndI = findByPred(this._$endHandlers, function (obj) {
	      return obj.obs === obs;
	    });
	    if (onEndI !== -1) {
	      obs.offEnd(this._$endHandlers[onEndI].handler);
	      this._$endHandlers.splice(onEndI, 1);
	    }
	  },

	  _handleSubAny: function _handleSubAny(event) {
	    if (event.type === VALUE) {
	      this._emitValue(event.value);
	    } else if (event.type === ERROR) {
	      this._emitError(event.value);
	    }
	  },

	  _removeQueue: function _removeQueue(obs) {
	    var index = find(this._queue, obs);
	    this._queue = remove(this._queue, index);
	    return index;
	  },

	  _removeCur: function _removeCur(obs) {
	    if (this._active) {
	      this._unsubscribe(obs);
	    }
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

	  _removeOldest: function _removeOldest() {
	    this._removeCur(this._curSources[0]);
	  },

	  _pullQueue: function _pullQueue() {
	    if (this._queue.length !== 0) {
	      this._queue = cloneArray(this._queue);
	      this._addToCur(this._queue.shift());
	    }
	  },

	  _onActivation: function _onActivation() {
	    for (var i = 0, sources = this._curSources; i < sources.length && this._active; i++) {
	      this._subscribe(sources[i]);
	    }
	  },

	  _onDeactivation: function _onDeactivation() {
	    for (var i = 0, sources = this._curSources; i < sources.length; i++) {
	      this._unsubscribe(sources[i]);
	    }
	    if (this._currentlyAdding !== null) {
	      this._unsubscribe(this._currentlyAdding);
	    }
	  },

	  _isEmpty: function _isEmpty() {
	    return this._curSources.length === 0;
	  },

	  _onEmpty: function _onEmpty() {},

	  _clear: function _clear() {
	    Stream.prototype._clear.call(this);
	    this._queue = null;
	    this._curSources = null;
	    this._$handleSubAny = null;
	    this._$endHandlers = null;
	  }

	});

	module.exports = AbstractPool;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var repeat = __webpack_require__(62);

	module.exports = function concat(observables) {
	  return repeat(function (index) {
	    return observables.length > index ? observables[index] : false;
	  }).setName('concat');
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(2);

	var inherit = _require.inherit;

	var Stream = __webpack_require__(6);

	var _require2 = __webpack_require__(3);

	var END = _require2.END;

	function S(generator) {
	  var _this = this;

	  Stream.call(this);
	  this._generator = generator;
	  this._source = null;
	  this._inLoop = false;
	  this._iteration = 0;
	  this._$handleAny = function (event) {
	    return _this._handleAny(event);
	  };
	}

	inherit(S, Stream, {

	  _name: 'repeat',

	  _handleAny: function _handleAny(event) {
	    if (event.type === END) {
	      this._source = null;
	      this._getSource();
	    } else {
	      this._emit(event.type, event.value);
	    }
	  },

	  _getSource: function _getSource() {
	    if (!this._inLoop) {
	      this._inLoop = true;
	      var generator = this._generator;
	      while (this._source === null && this._alive && this._active) {
	        this._source = generator(this._iteration++);
	        if (this._source) {
	          this._source.onAny(this._$handleAny);
	        } else {
	          this._emitEnd();
	        }
	      }
	      this._inLoop = false;
	    }
	  },

	  _onActivation: function _onActivation() {
	    if (this._source) {
	      this._source.onAny(this._$handleAny);
	    } else {
	      this._getSource();
	    }
	  },

	  _onDeactivation: function _onDeactivation() {
	    if (this._source) {
	      this._source.offAny(this._$handleAny);
	    }
	  },

	  _clear: function _clear() {
	    Stream.prototype._clear.call(this);
	    this._generator = null;
	    this._source = null;
	    this._$handleAny = null;
	  }

	});

	module.exports = function (generator) {
	  return new S(generator);
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(2);

	var inherit = _require.inherit;

	var AbstractPool = __webpack_require__(60);

	function Pool() {
	  AbstractPool.call(this);
	}

	inherit(Pool, AbstractPool, {

	  _name: 'pool',

	  plug: function plug(obs) {
	    this._add(obs);
	    return this;
	  },

	  unplug: function unplug(obs) {
	    this._remove(obs);
	    return this;
	  }

	});

	module.exports = Pool;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(3);

	var VALUE = _require.VALUE;
	var ERROR = _require.ERROR;
	var END = _require.END;

	var _require2 = __webpack_require__(2);

	var inherit = _require2.inherit;

	var AbstractPool = __webpack_require__(60);

	function FlatMap(source, fn, options) {
	  var _this = this;

	  AbstractPool.call(this, options);
	  this._source = source;
	  this._fn = fn;
	  this._mainEnded = false;
	  this._lastCurrent = null;
	  this._$handleMain = function (event) {
	    return _this._handleMain(event);
	  };
	}

	inherit(FlatMap, AbstractPool, {

	  _onActivation: function _onActivation() {
	    AbstractPool.prototype._onActivation.call(this);
	    if (this._active) {
	      this._source.onAny(this._$handleMain);
	    }
	  },

	  _onDeactivation: function _onDeactivation() {
	    AbstractPool.prototype._onDeactivation.call(this);
	    this._source.offAny(this._$handleMain);
	    this._hadNoEvSinceDeact = true;
	  },

	  _handleMain: function _handleMain(event) {

	    if (event.type === VALUE) {
	      // Is latest value before deactivation survived, and now is 'current' on this activation?
	      // We don't want to handle such values, to prevent to constantly add
	      // same observale on each activation/deactivation when our main source
	      // is a `Kefir.conatant()` for example.
	      var sameCurr = this._activating && this._hadNoEvSinceDeact && this._lastCurrent === event.value;
	      if (!sameCurr) {
	        this._add(event.value, this._fn);
	      }
	      this._lastCurrent = event.value;
	      this._hadNoEvSinceDeact = false;
	    }

	    if (event.type === ERROR) {
	      this._emitError(event.value);
	    }

	    if (event.type === END) {
	      if (this._isEmpty()) {
	        this._emitEnd();
	      } else {
	        this._mainEnded = true;
	      }
	    }
	  },

	  _onEmpty: function _onEmpty() {
	    if (this._mainEnded) {
	      this._emitEnd();
	    }
	  },

	  _clear: function _clear() {
	    AbstractPool.prototype._clear.call(this);
	    this._source = null;
	    this._lastCurrent = null;
	    this._$handleMain = null;
	  }

	});

	module.exports = FlatMap;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(3);

	var VALUE = _require.VALUE;
	var ERROR = _require.ERROR;
	var END = _require.END;

	var _require2 = __webpack_require__(2);

	var inherit = _require2.inherit;

	var FlatMap = __webpack_require__(64);

	function FlatMapErrors(source, fn) {
	  FlatMap.call(this, source, fn);
	}

	inherit(FlatMapErrors, FlatMap, {

	  // Same as in FlatMap, only VALUE/ERROR flipped
	  _handleMain: function _handleMain(event) {

	    if (event.type === ERROR) {
	      var sameCurr = this._activating && this._hadNoEvSinceDeact && this._lastCurrent === event.value;
	      if (!sameCurr) {
	        this._add(event.value, this._fn);
	      }
	      this._lastCurrent = event.value;
	      this._hadNoEvSinceDeact = false;
	    }

	    if (event.type === VALUE) {
	      this._emitValue(event.value);
	    }

	    if (event.type === END) {
	      if (this._isEmpty()) {
	        this._emitEnd();
	      } else {
	        this._mainEnded = true;
	      }
	    }
	  }

	});

	module.exports = FlatMapErrors;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(67);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var _require2 = __webpack_require__(3);

	var NOTHING = _require2.NOTHING;

	var mixin = {

	  _handlePrimaryValue: function _handlePrimaryValue(x) {
	    if (this._lastSecondary !== NOTHING && this._lastSecondary) {
	      this._emitValue(x);
	    }
	  },

	  _handleSecondaryEnd: function _handleSecondaryEnd() {
	    if (this._lastSecondary === NOTHING || !this._lastSecondary) {
	      this._emitEnd();
	    }
	  }

	};

	var S = createStream('filterBy', mixin);
	var P = createProperty('filterBy', mixin);

	module.exports = function filterBy(primary, secondary) {
	  return new (primary._ofSameType(S, P))(primary, secondary);
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Stream = __webpack_require__(6);
	var Property = __webpack_require__(7);

	var _require = __webpack_require__(2);

	var inherit = _require.inherit;

	var _require2 = __webpack_require__(3);

	var VALUE = _require2.VALUE;
	var ERROR = _require2.ERROR;
	var END = _require2.END;
	var NOTHING = _require2.NOTHING;

	function createConstructor(BaseClass, name) {
	  return function AnonymousObservable(primary, secondary, options) {
	    var _this = this;

	    BaseClass.call(this);
	    this._primary = primary;
	    this._secondary = secondary;
	    this._name = primary._name + '.' + name;
	    this._lastSecondary = NOTHING;
	    this._$handleSecondaryAny = function (event) {
	      return _this._handleSecondaryAny(event);
	    };
	    this._$handlePrimaryAny = function (event) {
	      return _this._handlePrimaryAny(event);
	    };
	    this._init(options);
	  };
	}

	function createClassMethods(BaseClass) {
	  return {
	    _init: function _init(options) {},
	    _free: function _free() {},

	    _handlePrimaryValue: function _handlePrimaryValue(x) {
	      this._emitValue(x);
	    },
	    _handlePrimaryError: function _handlePrimaryError(x) {
	      this._emitError(x);
	    },
	    _handlePrimaryEnd: function _handlePrimaryEnd() {
	      this._emitEnd();
	    },

	    _handleSecondaryValue: function _handleSecondaryValue(x) {
	      this._lastSecondary = x;
	    },
	    _handleSecondaryError: function _handleSecondaryError(x) {
	      this._emitError(x);
	    },
	    _handleSecondaryEnd: function _handleSecondaryEnd() {},

	    _handlePrimaryAny: function _handlePrimaryAny(event) {
	      switch (event.type) {
	        case VALUE:
	          return this._handlePrimaryValue(event.value);
	        case ERROR:
	          return this._handlePrimaryError(event.value);
	        case END:
	          return this._handlePrimaryEnd(event.value);
	      }
	    },
	    _handleSecondaryAny: function _handleSecondaryAny(event) {
	      switch (event.type) {
	        case VALUE:
	          return this._handleSecondaryValue(event.value);
	        case ERROR:
	          return this._handleSecondaryError(event.value);
	        case END:
	          this._handleSecondaryEnd(event.value);
	          this._removeSecondary();
	      }
	    },

	    _removeSecondary: function _removeSecondary() {
	      if (this._secondary !== null) {
	        this._secondary.offAny(this._$handleSecondaryAny);
	        this._$handleSecondaryAny = null;
	        this._secondary = null;
	      }
	    },

	    _onActivation: function _onActivation() {
	      if (this._secondary !== null) {
	        this._secondary.onAny(this._$handleSecondaryAny);
	      }
	      if (this._active) {
	        this._primary.onAny(this._$handlePrimaryAny);
	      }
	    },
	    _onDeactivation: function _onDeactivation() {
	      if (this._secondary !== null) {
	        this._secondary.offAny(this._$handleSecondaryAny);
	      }
	      this._primary.offAny(this._$handlePrimaryAny);
	    },

	    _clear: function _clear() {
	      BaseClass.prototype._clear.call(this);
	      this._primary = null;
	      this._secondary = null;
	      this._lastSecondary = null;
	      this._$handleSecondaryAny = null;
	      this._$handlePrimaryAny = null;
	      this._free();
	    }

	  };
	}

	function createStream(name, mixin) {
	  var S = createConstructor(Stream, name);
	  inherit(S, Stream, createClassMethods(Stream), mixin);
	  return S;
	}

	function createProperty(name, mixin) {
	  var P = createConstructor(Property, name);
	  inherit(P, Property, createClassMethods(Property), mixin);
	  return P;
	}

	module.exports = { createStream: createStream, createProperty: createProperty };

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var combine = __webpack_require__(57);

	var id2 = function id2(_, x) {
	  return x;
	};

	module.exports = function sampledBy(passive, active, combinator) {
	  var _combinator = combinator ? function (a, b) {
	    return combinator(b, a);
	  } : id2;
	  return combine([active], [passive], _combinator).setName(passive, 'sampledBy');
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(67);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var _require2 = __webpack_require__(3);

	var NOTHING = _require2.NOTHING;

	var mixin = {

	  _handlePrimaryValue: function _handlePrimaryValue(x) {
	    if (this._lastSecondary !== NOTHING) {
	      this._emitValue(x);
	    }
	  },

	  _handleSecondaryEnd: function _handleSecondaryEnd() {
	    if (this._lastSecondary === NOTHING) {
	      this._emitEnd();
	    }
	  }

	};

	var S = createStream('skipUntilBy', mixin);
	var P = createProperty('skipUntilBy', mixin);

	module.exports = function skipUntilBy(primary, secondary) {
	  return new (primary._ofSameType(S, P))(primary, secondary);
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(67);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _handleSecondaryValue: function _handleSecondaryValue(x) {
	    this._emitEnd();
	  }

	};

	var S = createStream('takeUntilBy', mixin);
	var P = createProperty('takeUntilBy', mixin);

	module.exports = function takeUntilBy(primary, secondary) {
	  return new (primary._ofSameType(S, P))(primary, secondary);
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(67);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _init: function _init() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    var _ref$flushOnEnd = _ref.flushOnEnd;
	    var flushOnEnd = _ref$flushOnEnd === undefined ? true : _ref$flushOnEnd;

	    this._buff = [];
	    this._flushOnEnd = flushOnEnd;
	  },

	  _free: function _free() {
	    this._buff = null;
	  },

	  _flush: function _flush() {
	    if (this._buff !== null) {
	      this._emitValue(this._buff);
	      this._buff = [];
	    }
	  },

	  _handlePrimaryEnd: function _handlePrimaryEnd() {
	    if (this._flushOnEnd) {
	      this._flush();
	    }
	    this._emitEnd();
	  },

	  _onActivation: function _onActivation() {
	    this._primary.onAny(this._$handlePrimaryAny);
	    if (this._alive && this._secondary !== null) {
	      this._secondary.onAny(this._$handleSecondaryAny);
	    }
	  },

	  _handlePrimaryValue: function _handlePrimaryValue(x) {
	    this._buff.push(x);
	  },

	  _handleSecondaryValue: function _handleSecondaryValue(x) {
	    this._flush();
	  },

	  _handleSecondaryEnd: function _handleSecondaryEnd(x) {
	    if (!this._flushOnEnd) {
	      this._emitEnd();
	    }
	  }

	};

	var S = createStream('bufferBy', mixin);
	var P = createProperty('bufferBy', mixin);

	module.exports = function bufferBy(primary, secondary, options /* optional */) {
	  return new (primary._ofSameType(S, P))(primary, secondary, options);
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(67);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var _require2 = __webpack_require__(3);

	var NOTHING = _require2.NOTHING;

	var mixin = {

	  _init: function _init() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    var _ref$flushOnEnd = _ref.flushOnEnd;
	    var flushOnEnd = _ref$flushOnEnd === undefined ? true : _ref$flushOnEnd;
	    var _ref$flushOnChange = _ref.flushOnChange;
	    var flushOnChange = _ref$flushOnChange === undefined ? false : _ref$flushOnChange;

	    this._buff = [];
	    this._flushOnEnd = flushOnEnd;
	    this._flushOnChange = flushOnChange;
	  },

	  _free: function _free() {
	    this._buff = null;
	  },

	  _flush: function _flush() {
	    if (this._buff !== null && this._buff.length !== 0) {
	      this._emitValue(this._buff);
	      this._buff = [];
	    }
	  },

	  _handlePrimaryEnd: function _handlePrimaryEnd() {
	    if (this._flushOnEnd) {
	      this._flush();
	    }
	    this._emitEnd();
	  },

	  _handlePrimaryValue: function _handlePrimaryValue(x) {
	    this._buff.push(x);
	    if (this._lastSecondary !== NOTHING && !this._lastSecondary) {
	      this._flush();
	    }
	  },

	  _handleSecondaryEnd: function _handleSecondaryEnd(x) {
	    if (!this._flushOnEnd && (this._lastSecondary === NOTHING || this._lastSecondary)) {
	      this._emitEnd();
	    }
	  },

	  _handleSecondaryValue: function _handleSecondaryValue(x) {
	    if (this._flushOnChange && !x) {
	      this._flush();
	    }

	    // from default _handleSecondaryValue
	    this._lastSecondary = x;
	  }

	};

	var S = createStream('bufferWhileBy', mixin);
	var P = createProperty('bufferWhileBy', mixin);

	module.exports = function bufferWhileBy(primary, secondary, options /* optional */) {
	  return new (primary._ofSameType(S, P))(primary, secondary, options);
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var merge = __webpack_require__(59);
	var map = __webpack_require__(29);
	var skipDuplicates = __webpack_require__(36);
	var toProperty = __webpack_require__(25);

	var f = function f() {
	  return false;
	};
	var t = function t() {
	  return true;
	};

	module.exports = function awaiting(a, b) {
	  var result = merge([map(a, t), map(b, f)]);
	  result = skipDuplicates(result);
	  result = toProperty(result, f);
	  return result.setName(a, 'awaiting');
	};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(2);

	var inherit = _require.inherit;

	var Stream = __webpack_require__(6);

	function Emitter() {
	  Stream.call(this);
	}

	inherit(Emitter, Stream, {

	  _name: 'emitter',

	  emit: function emit(x) {
	    this._emitValue(x);
	    return this;
	  },

	  error: function error(x) {
	    this._emitError(x);
	    return this;
	  },

	  end: function end() {
	    this._emitEnd();
	    return this;
	  },

	  emitEvent: function emitEvent(event) {
	    this._emit(event.type, event.value);
	  }

	});

	module.exports = Emitter;

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(2);

	var inherit = _require.inherit;

	var AbstractPool = __webpack_require__(60);

	function Bus() {
	  AbstractPool.call(this);
	}

	inherit(Bus, AbstractPool, {

	  _name: 'bus',

	  plug: function plug(obs) {
	    this._add(obs);
	    return this;
	  },
	  unplug: function unplug(obs) {
	    this._remove(obs);
	    return this;
	  },

	  emit: function emit(x) {
	    this._emitValue(x);
	    return this;
	  },
	  error: function error(x) {
	    this._emitError(x);
	    return this;
	  },
	  end: function end() {
	    this._emitEnd();
	    return this;
	  },
	  emitEvent: function emitEvent(event) {
	    this._emit(event.type, event.value);
	  }

	});

	module.exports = Bus;

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(26);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var _require2 = __webpack_require__(3);

	var NOTHING = _require2.NOTHING;

	var mixin = {

	  _init: function _init(_ref) {
	    var fn = _ref.fn;
	    var seed = _ref.seed;

	    this._fn = fn;
	    this._result = seed;
	  },

	  _free: function _free() {
	    this._fn = null;
	    this._result = null;
	  },

	  _handleValue: function _handleValue(x) {
	    var fn = this._fn;
	    this._result = this._result === NOTHING ? x : fn(this._result, x);
	  },

	  _handleEnd: function _handleEnd() {
	    if (this._result !== NOTHING) {
	      this._emitValue(this._result);
	    }
	    this._emitEnd();
	  }

	};

	var S = createStream('reduce', mixin);
	var P = createProperty('reduce', mixin);

	module.exports = function reduce(obs, fn) {
	  var seed = arguments.length <= 2 || arguments[2] === undefined ? NOTHING : arguments[2];

	  return new (obs._ofSameType(S, P))(obs, { fn: fn, seed: seed });
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var combine = __webpack_require__(57);

	var _require = __webpack_require__(21);

	var apply = _require.apply;

	var _require2 = __webpack_require__(5);

	var circleShift = _require2.circleShift;

	module.exports = function sampledBy(passive, active, combinator) {

	  var _combinator = combinator;

	  // we need to flip `passive` and `active` in combinator function
	  if (passive.length > 0) {
	    _combinator = function () {
	      var args = circleShift(arguments, passive.length);
	      return combinator ? apply(combinator, null, args) : args;
	    };
	  }

	  return combine(active, passive, _combinator).setName('sampledBy');
	};

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var timeBased = __webpack_require__(10);

	var _require = __webpack_require__(5);

	var cloneArray = _require.cloneArray;

	var S = timeBased({

	  _name: 'repeatedly',

	  _init: function _init(_ref) {
	    var xs = _ref.xs;

	    this._xs = cloneArray(xs);
	    this._i = -1;
	  },

	  _onTick: function _onTick() {
	    if (this._xs.length > 0) {
	      this._i = (this._i + 1) % this._xs.length;
	      this._emitValue(this._xs[this._i]);
	    }
	  }

	});

	module.exports = function repeatedly(wait, xs) {
	  return new S(wait, { xs: xs });
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var map = __webpack_require__(29);

	module.exports = function mapTo(obs, x) {
	  return map(obs, function () {
	    return x;
	  }).setName(obs, 'mapTo');
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var map = __webpack_require__(29);

	module.exports = function tap(obs, fn) {
	  return map(obs, function (x) {
	    fn(x);return x;
	  }).setName(obs, 'tap');
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var map = __webpack_require__(29);

	module.exports = function pluck(obs, propName) {
	  return map(obs, function (x) {
	    return x[propName];
	  }).setName(obs, 'pluck');
	};

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var map = __webpack_require__(29);

	var _require = __webpack_require__(21);

	var apply = _require.apply;

	module.exports = function invoke(obs, methodName, args) {

	  var fn = args.length === 0 ? function (x) {
	    return x[methodName]();
	  } : function (x) {
	    return apply(x[methodName], x, args);
	  };

	  return map(obs, fn).setName(obs, 'invoke');
	};

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var map = __webpack_require__(29);
	var now = __webpack_require__(42);

	module.exports = function timestamp(obs) {
	  return map(obs, function (x) {
	    return { value: x, time: now() };
	  }).setName(obs, 'timestamp');
	};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var combine = __webpack_require__(57);

	function fn() {
	  var i = undefined;
	  for (i = 0; i < arguments.length; i++) {
	    if (!arguments[i]) {
	      return arguments[i];
	    }
	  }
	  return arguments[i - 1];
	}

	module.exports = function and(observables) {
	  return combine(observables, [], fn).setName('and');
	};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var combine = __webpack_require__(57);

	function fn() {
	  var i = undefined;
	  for (i = 0; i < arguments.length; i++) {
	    if (arguments[i]) {
	      return arguments[i];
	    }
	  }
	  return arguments[i - 1];
	}

	module.exports = function or(observables) {
	  return combine(observables, [], fn).setName('or');
	};

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var map = __webpack_require__(29);

	module.exports = function not(obs) {
	  return map(obs, function (x) {
	    return !x;
	  }).setName(obs, 'not');
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(67);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var _require2 = __webpack_require__(3);

	var NOTHING = _require2.NOTHING;

	var mixin = {

	  _handlePrimaryValue: function _handlePrimaryValue(x) {
	    if (this._lastSecondary !== NOTHING) {
	      this._emitValue(x);
	    }
	  },

	  _handleSecondaryValue: function _handleSecondaryValue(x) {
	    this._lastSecondary = x;
	    if (!this._lastSecondary) {
	      this._emitEnd();
	    }
	  },

	  _handleSecondaryEnd: function _handleSecondaryEnd() {
	    if (this._lastSecondary === NOTHING) {
	      this._emitEnd();
	    }
	  }

	};

	var S = createStream('takeWhileBy', mixin);
	var P = createProperty('takeWhileBy', mixin);

	module.exports = function takeWhileBy(primary, secondary) {
	  return new (primary._ofSameType(S, P))(primary, secondary);
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(67);

	var createStream = _require.createStream;
	var createProperty = _require.createProperty;

	var mixin = {

	  _init: function _init() {
	    this._hasFalseyFromSecondary = false;
	  },

	  _handlePrimaryValue: function _handlePrimaryValue(x) {
	    if (this._hasFalseyFromSecondary) {
	      this._emitValue(x);
	    }
	  },

	  _handleSecondaryValue: function _handleSecondaryValue(x) {
	    this._hasFalseyFromSecondary = this._hasFalseyFromSecondary || !x;
	  },

	  _handleSecondaryEnd: function _handleSecondaryEnd() {
	    if (!this._hasFalseyFromSecondary) {
	      this._emitEnd();
	    }
	  }

	};

	var S = createStream('skipWhileBy', mixin);
	var P = createProperty('skipWhileBy', mixin);

	module.exports = function skipWhileBy(primary, secondary) {
	  return new (primary._ofSameType(S, P))(primary, secondary);
	};

/***/ }
/******/ ])
});
;
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
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

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
 * @depend match.js
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

                if (method.proxy && method.proxy.isSinonProxy) {
                    verifyIsStub(method.proxy);
                } else {
                    if (typeof method != "function") {
                        assert.fail(method + " is not a function");
                    }

                    if (typeof method.getCall != "function") {
                        assert.fail(method + " is not stubbed");
                    }
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
                    failAssertion(this, (fake.printf || fake.proxy.printf).apply(fake, [message].concat(args)));
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
        mirrorPropAsAssertion("notCalled", function (spy) {
            return !spy.called;
        }, "expected %n to not have been called but was called %c%C");
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
        require("./format");
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
},{"./format":12,"./match":14,"./util/core":23}],8:[function(require,module,exports){
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
    var useLeftMostCallback = -1;
    var useRightMostCallback = -2;

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

        if (callArgAt >= 0) {
            return args[callArgAt];
        }

        var argumentList;

        if (callArgAt === useLeftMostCallback) {
            argumentList = args;
        }

        if (callArgAt === useRightMostCallback) {
            argumentList = slice.call(args).reverse();
        }

        var callArgProp = behavior.callArgProp;

        for (var i = 0, l = argumentList.length; i < l; ++i) {
            if (!callArgProp && typeof argumentList[i] == "function") {
                return argumentList[i];
            }

            if (callArgProp && argumentList[i] &&
                typeof argumentList[i][callArgProp] == "function") {
                return argumentList[i][callArgProp];
            }
        }

        return null;
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
                this.callArgAt = useLeftMostCallback;
                this.callbackArguments = slice.call(arguments, 0);
                this.callbackContext = undefined;
                this.callArgProp = undefined;
                this.callbackAsync = false;

                return this;
            },

            yieldsRight: function () {
                this.callArgAt = useRightMostCallback;
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

                this.callArgAt = useLeftMostCallback;
                this.callbackArguments = slice.call(arguments, 1);
                this.callbackContext = context;
                this.callArgProp = undefined;
                this.callbackAsync = false;

                return this;
            },

            yieldsTo: function (prop) {
                this.callArgAt = useLeftMostCallback;
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

                this.callArgAt = useLeftMostCallback;
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
        require("./extend");
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
},{"./extend":11,"./util/core":23,"_process":3}],9:[function(require,module,exports){
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
                var l = arguments.length;
                if (l > this.args.length) {
                    return false;
                }
                for (var i = 0; i < l; i += 1) {
                    if (!sinon.deepEqual(arguments[i], this.args[i])) {
                        return false;
                    }
                }

                return true;
            },

            calledWithMatch: function calledWithMatch() {
                var l = arguments.length;
                if (l > this.args.length) {
                    return false;
                }
                for (var i = 0; i < l; i += 1) {
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
        require("./format");
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

},{"./format":12,"./match":14,"./util/core":23}],10:[function(require,module,exports){
/**
 * @depend util/core.js
 * @depend spy.js
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
 * @depend util/core.js
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
 * @depend util/core.js
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

},{"./util/core":23,"formatio":30,"util":5}],13:[function(require,module,exports){
/**
 * @depend util/core.js
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
        require("./typeOf");
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

},{"./typeOf":22,"./util/core":23}],15:[function(require,module,exports){
/**
 * @depend times_in_words.js
 * @depend util/core.js
 * @depend call.js
 * @depend extend.js
 * @depend match.js
 * @depend spy.js
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
            // if (typeof console !== undefined && console.warn) {
            //     console.warn("mock will be removed from Sinon.JS v2.0");
            // }

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
        require("./times_in_words");
        require("./call");
        require("./extend");
        require("./match");
        require("./spy");
        require("./stub");
        require("./format");

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

},{"./call":9,"./extend":11,"./format":12,"./match":14,"./spy":17,"./stub":18,"./times_in_words":21,"./util/core":23}],16:[function(require,module,exports){
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
        require("./extend");
        require("./util/fake_server_with_clock");
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

},{"./collection":10,"./extend":11,"./util/core":23,"./util/fake_server_with_clock":26,"./util/fake_timers":27}],17:[function(require,module,exports){
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

        function spy(object, property, types) {
            if (!property && typeof object == "function") {
                return spy.create(object);
            }

            if (!object && !property) {
                return spy.create(function () { });
            }

            if (types) {
                var methodDesc = sinon.getPropertyDescriptor(object, property);
                for (var i = 0; i < types.length; i++) {
                    methodDesc[types[i]] = spy.create(methodDesc[types[i]]);
                }
                return sinon.wrapMethod(object, property, methodDesc);
            } else {
                var method = object[property];
                return sinon.wrapMethod(object, property, spy.create(method));
            }
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
        function createProxy(func, proxyLength) {
            // Retain the function length:
            var p;
            if (proxyLength) {
                eval("p = (function proxy(" + vars.substring(0, proxyLength * 2 - 1) +
                    ") { return p.invoke(func, this, slice.call(arguments)); });");
            } else {
                p = function proxy() {
                    return p.invoke(func, this, slice.call(arguments));
                };
            }
            p.isSinonProxy = true;
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

                return this;
            },

            create: function create(func, spyLength) {
                var name;

                if (typeof func != "function") {
                    func = function () { };
                } else {
                    name = sinon.functionName(func);
                }

                if (!spyLength) {
                    spyLength = func.length;
                }

                var proxy = createProxy(func, spyLength);

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
        delegateToCalls("neverCalledWith", false, "notCalledWith", function () {
            return true;
        });
        delegateToCalls("neverCalledWithMatch", false, "notCalledWithMatch", function () {
            return true;
        });
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
        require("./extend");
        require("./times_in_words");
        require("./format");
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

},{"./call":9,"./extend":11,"./format":12,"./times_in_words":21,"./util/core":23}],18:[function(require,module,exports){
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
            if (!!func && typeof func != "function" && typeof func != "object") {
                throw new TypeError("Custom stub should be a function or a property descriptor");
            }

            var wrapper;

            if (func) {
                if (typeof func == "function") {
                    wrapper = sinon.spy && sinon.spy.create ? sinon.spy.create(func) : func;
                } else {
                    wrapper = func;
                    if (sinon.spy && sinon.spy.create) {
                        var types = sinon.objectKeys(wrapper);
                        for (var i = 0; i < types.length; i++) {
                            wrapper[types[i]] = sinon.spy.create(wrapper[types[i]]);
                        }
                    }
                }
            } else {
                var stubLength = 0;
                if (typeof object == "object" && typeof object[property] == "function") {
                    stubLength = object[property].length;
                }
                wrapper = stub.create(stubLength);
            }

            if (!object && typeof property === "undefined") {
                return sinon.stub.create();
            }

            if (typeof property === "undefined" && typeof object == "object") {
                for (var prop in object) {
                    if (typeof sinon.getPropertyDescriptor(object, prop).value === "function") {
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
            create: function create(stubLength) {
                var functionStub = function () {
                    return getCurrentBehavior(functionStub).invoke(this, arguments);
                };

                functionStub.id = "stub#" + uuid++;
                var orig = functionStub;
                functionStub = sinon.spy.create(functionStub, stubLength);
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
        require("./extend");
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

},{"./behavior":8,"./extend":11,"./spy":17,"./util/core":23}],19:[function(require,module,exports){
/**
 * @depend util/core.js
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
        var slice = Array.prototype.slice;

        function test(callback) {
            var type = typeof callback;

            if (type != "function") {
                throw new TypeError("sinon.test needs to wrap a test function, got " + type);
            }

            function sinonSandboxedTest() {
                var config = sinon.getConfig(sinon.config);
                config.injectInto = config.injectIntoThis && this || config.injectInto;
                var sandbox = sinon.sandbox.create(config);
                var args = slice.call(arguments);
                var oldDone = args.length && args[args.length - 1];
                var exception, result;

                if (typeof oldDone == "function") {
                    args[args.length - 1] = function sinonDone(result) {
                        if (result) {
                            sandbox.restore();
                            throw exception;
                        } else {
                            sandbox.verifyAndRestore();
                        }
                        oldDone(result);
                    };
                }

                try {
                    result = callback.apply(this, args.concat(sandbox.args));
                } catch (e) {
                    exception = e;
                }

                if (typeof oldDone != "function") {
                    if (typeof exception !== "undefined") {
                        sandbox.restore();
                        throw exception;
                    } else {
                        sandbox.verifyAndRestore();
                    }
                }

                return result;
            }

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
    } else if (sinon) {
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
            if (!tests || typeof tests != "object") {
                throw new TypeError("sinon.testCase needs an object with test functions");
            }

            prefix = prefix || "test";
            var rPrefix = new RegExp("^" + prefix);
            var methods = {}, testName, property, method;
            var setUp = tests.setUp;
            var tearDown = tests.tearDown;

            for (testName in tests) {
                if (tests.hasOwnProperty(testName) && !/^(setUp|tearDown)$/.test(testName)) {
                    property = tests[testName];

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
 * @depend util/core.js
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
 * @depend util/core.js
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

    // Cheap way to detect if we have ES5 support.
    var hasES5Support = "keys" in Object;

    function makeApi(sinon) {
        sinon.wrapMethod = function wrapMethod(object, property, method) {
            if (!object) {
                throw new TypeError("Should wrap property of object");
            }

            if (typeof method != "function" && typeof method != "object") {
                throw new TypeError("Method wrapper should be a function or a property descriptor");
            }

            function checkWrappedMethod(wrappedMethod) {
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
            }

            var error, wrappedMethod;

            // IE 8 does not support hasOwnProperty on the window object and Firefox has a problem
            // when using hasOwn.call on objects from other frames.
            var owned = object.hasOwnProperty ? object.hasOwnProperty(property) : hasOwn.call(object, property);

            if (hasES5Support) {
                var methodDesc = (typeof method == "function") ? {value: method} : method,
                    wrappedMethodDesc = sinon.getPropertyDescriptor(object, property),
                    i;

                if (!wrappedMethodDesc) {
                    error = new TypeError("Attempted to wrap " + (typeof wrappedMethod) + " property " +
                                        property + " as function");
                } else if (wrappedMethodDesc.restore && wrappedMethodDesc.restore.sinon) {
                    error = new TypeError("Attempted to wrap " + property + " which is already wrapped");
                }
                if (error) {
                    if (wrappedMethodDesc && wrappedMethodDesc.stackTrace) {
                        error.stack += "\n--------------\n" + wrappedMethodDesc.stackTrace;
                    }
                    throw error;
                }

                var types = sinon.objectKeys(methodDesc);
                for (i = 0; i < types.length; i++) {
                    wrappedMethod = wrappedMethodDesc[types[i]];
                    checkWrappedMethod(wrappedMethod);
                }

                mirrorProperties(methodDesc, wrappedMethodDesc);
                for (i = 0; i < types.length; i++) {
                    mirrorProperties(methodDesc[types[i]], wrappedMethodDesc[types[i]]);
                }
                Object.defineProperty(object, property, methodDesc);
            } else {
                wrappedMethod = object[property];
                checkWrappedMethod(wrappedMethod);
                object[property] = method;
                method.displayName = property;
            }

            method.displayName = property;

            // Set up a stack trace which can be used later to find what line of
            // code the original method was created on.
            method.stackTrace = (new Error("Stack Trace for original")).stack;

            method.restore = function () {
                // For prototype properties try to reset by delete first.
                // If this fails (ex: localStorage on mobile safari) then force a reset
                // via direct assignment.
                if (!owned) {
                    // In some cases `delete` may throw an error
                    try {
                        delete object[property];
                    } catch (e) {}
                    // For native code functions `delete` fails without throwing an error
                    // on Chrome < 43, PhantomJS, etc.
                } else if (hasES5Support) {
                    Object.defineProperty(object, property, wrappedMethodDesc);
                }

                // Use strict equality comparison to check failures then force a reset
                // via direct assignment.
                if (object[property] === method) {
                    object[property] = wrappedMethod;
                }
            };

            method.restore.sinon = true;

            if (!hasES5Support) {
                mirrorProperties(method, wrappedMethod);
            }

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

        sinon.objectKeys = function objectKeys(obj) {
            if (obj !== Object(obj)) {
                throw new TypeError("sinon.objectKeys called on a non-object");
            }

            var keys = [];
            var key;
            for (key in obj) {
                if (hasOwn.call(obj, key)) {
                    keys.push(key);
                }
            }

            return keys;
        };

        sinon.getPropertyDescriptor = function getPropertyDescriptor(object, property) {
            var proto = object, descriptor;
            while (proto && !(descriptor = Object.getOwnPropertyDescriptor(proto, property))) {
                proto = Object.getPrototypeOf(proto);
            }
            return descriptor;
        }

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
            this.lengthComputable = !!progressEventRaw.total;
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
 * @depend fake_xdomain_request.js
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
                if (!sinon.xhr.supportsCORS) {
                    this.xhr = sinon.useFakeXDomainRequest();
                } else {
                    this.xhr = sinon.useFakeXMLHttpRequest();
                }
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

                    if (server.respondImmediately) {
                        server.respond();
                    } else if (server.autoRespond && !server.responding) {
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

                if (!this.responses) {
                    this.responses = [];
                }

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
        require("./fake_xdomain_request");
        require("./fake_xml_http_request");
        require("../format");
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

},{"../format":12,"./core":23,"./fake_xdomain_request":28,"./fake_xml_http_request":29}],26:[function(require,module,exports){
/**
 * @depend fake_server.js
 * @depend fake_timers.js
 */
/**
 * Add-on for sinon.fakeServer that automatically handles a fake timer along with
 * the FakeXMLHttpRequest. The direct inspiration for this add-on is jQuery
 * 1.3.x, which does not use xhr object's onreadystatehandler at all - instead,
 * it polls the object for completion with setInterval. Dispite the direct
 * motivation, there is nothing jQuery-specific in this file, so it can be used
 * in any environment where the ajax implementation depends on setInterval or
 * setTimeout.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function () {
    function makeApi(sinon) {
        function Server() {}
        Server.prototype = sinon.fakeServer;

        sinon.fakeServerWithClock = new Server();

        sinon.fakeServerWithClock.addRequest = function addRequest(xhr) {
            if (xhr.async) {
                if (typeof setTimeout.clock == "object") {
                    this.clock = setTimeout.clock;
                } else {
                    this.clock = sinon.useFakeTimers();
                    this.resetClock = true;
                }

                if (!this.longestTimeout) {
                    var clockSetTimeout = this.clock.setTimeout;
                    var clockSetInterval = this.clock.setInterval;
                    var server = this;

                    this.clock.setTimeout = function (fn, timeout) {
                        server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);

                        return clockSetTimeout.apply(this, arguments);
                    };

                    this.clock.setInterval = function (fn, timeout) {
                        server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);

                        return clockSetInterval.apply(this, arguments);
                    };
                }
            }

            return sinon.fakeServer.addRequest.call(this, xhr);
        };

        sinon.fakeServerWithClock.respond = function respond() {
            var returnVal = sinon.fakeServer.respond.apply(this, arguments);

            if (this.clock) {
                this.clock.tick(this.longestTimeout || 0);
                this.longestTimeout = 0;

                if (this.resetClock) {
                    this.clock.restore();
                    this.resetClock = false;
                }
            }

            return returnVal;
        };

        sinon.fakeServerWithClock.restore = function restore() {
            if (this.clock) {
                this.clock.restore();
            }

            return sinon.fakeServer.restore.apply(this, arguments);
        };
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require) {
        var sinon = require("./core");
        require("./fake_server");
        require("./fake_timers");
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

},{"./core":23,"./fake_server":25,"./fake_timers":27}],27:[function(require,module,exports){
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

    function loadDependencies(require, epxorts, module, lolex) {
        var sinon = require("./core");
        makeApi(sinon, lolex);
        module.exports = sinon;
    }

    if (isAMD) {
        define(loadDependencies);
    } else if (isNode) {
        loadDependencies(require, module.exports, module, require("lolex"));
    } else {
        makeApi(sinon);
    }
}(typeof global != "undefined" && typeof global !== "function" ? global : this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./core":23,"lolex":31}],28:[function(require,module,exports){
(function (global){
/**
 * @depend core.js
 * @depend ../extend.js
 * @depend event.js
 * @depend ../log_error.js
 */
/**
 * Fake XDomainRequest object
 */
"use strict";

if (typeof sinon == "undefined") {
    this.sinon = {};
}

// wrapper for global
(function (global) {
    var xdr = { XDomainRequest: global.XDomainRequest };
    xdr.GlobalXDomainRequest = global.XDomainRequest;
    xdr.supportsXDR = typeof xdr.GlobalXDomainRequest != "undefined";
    xdr.workingXDR = xdr.supportsXDR ? xdr.GlobalXDomainRequest :  false;

    function makeApi(sinon) {
        sinon.xdr = xdr;

        function FakeXDomainRequest() {
            this.readyState = FakeXDomainRequest.UNSENT;
            this.requestBody = null;
            this.requestHeaders = {};
            this.status = 0;
            this.timeout = null;

            if (typeof FakeXDomainRequest.onCreate == "function") {
                FakeXDomainRequest.onCreate(this);
            }
        }

        function verifyState(xdr) {
            if (xdr.readyState !== FakeXDomainRequest.OPENED) {
                throw new Error("INVALID_STATE_ERR");
            }

            if (xdr.sendFlag) {
                throw new Error("INVALID_STATE_ERR");
            }
        }

        function verifyRequestSent(xdr) {
            if (xdr.readyState == FakeXDomainRequest.UNSENT) {
                throw new Error("Request not sent");
            }
            if (xdr.readyState == FakeXDomainRequest.DONE) {
                throw new Error("Request done");
            }
        }

        function verifyResponseBodyType(body) {
            if (typeof body != "string") {
                var error = new Error("Attempted to respond to fake XDomainRequest with " +
                                    body + ", which is not a string.");
                error.name = "InvalidBodyException";
                throw error;
            }
        }

        sinon.extend(FakeXDomainRequest.prototype, sinon.EventTarget, {
            open: function open(method, url) {
                this.method = method;
                this.url = url;

                this.responseText = null;
                this.sendFlag = false;

                this.readyStateChange(FakeXDomainRequest.OPENED);
            },

            readyStateChange: function readyStateChange(state) {
                this.readyState = state;
                var eventName = "";
                switch (this.readyState) {
                case FakeXDomainRequest.UNSENT:
                    break;
                case FakeXDomainRequest.OPENED:
                    break;
                case FakeXDomainRequest.LOADING:
                    if (this.sendFlag) {
                        //raise the progress event
                        eventName = "onprogress";
                    }
                    break;
                case FakeXDomainRequest.DONE:
                    if (this.isTimeout) {
                        eventName = "ontimeout"
                    } else if (this.errorFlag || (this.status < 200 || this.status > 299)) {
                        eventName = "onerror";
                    } else {
                        eventName = "onload"
                    }
                    break;
                }

                // raising event (if defined)
                if (eventName) {
                    if (typeof this[eventName] == "function") {
                        try {
                            this[eventName]();
                        } catch (e) {
                            sinon.logError("Fake XHR " + eventName + " handler", e);
                        }
                    }
                }
            },

            send: function send(data) {
                verifyState(this);

                if (!/^(get|head)$/i.test(this.method)) {
                    this.requestBody = data;
                }
                this.requestHeaders["Content-Type"] = "text/plain;charset=utf-8";

                this.errorFlag = false;
                this.sendFlag = true;
                this.readyStateChange(FakeXDomainRequest.OPENED);

                if (typeof this.onSend == "function") {
                    this.onSend(this);
                }
            },

            abort: function abort() {
                this.aborted = true;
                this.responseText = null;
                this.errorFlag = true;

                if (this.readyState > sinon.FakeXDomainRequest.UNSENT && this.sendFlag) {
                    this.readyStateChange(sinon.FakeXDomainRequest.DONE);
                    this.sendFlag = false;
                }
            },

            setResponseBody: function setResponseBody(body) {
                verifyRequestSent(this);
                verifyResponseBodyType(body);

                var chunkSize = this.chunkSize || 10;
                var index = 0;
                this.responseText = "";

                do {
                    this.readyStateChange(FakeXDomainRequest.LOADING);
                    this.responseText += body.substring(index, index + chunkSize);
                    index += chunkSize;
                } while (index < body.length);

                this.readyStateChange(FakeXDomainRequest.DONE);
            },

            respond: function respond(status, contentType, body) {
                // content-type ignored, since XDomainRequest does not carry this
                // we keep the same syntax for respond(...) as for FakeXMLHttpRequest to ease
                // test integration across browsers
                this.status = typeof status == "number" ? status : 200;
                this.setResponseBody(body || "");
            },

            simulatetimeout: function simulatetimeout() {
                this.status = 0;
                this.isTimeout = true;
                // Access to this should actually throw an error
                this.responseText = undefined;
                this.readyStateChange(FakeXDomainRequest.DONE);
            }
        });

        sinon.extend(FakeXDomainRequest, {
            UNSENT: 0,
            OPENED: 1,
            LOADING: 3,
            DONE: 4
        });

        sinon.useFakeXDomainRequest = function useFakeXDomainRequest() {
            sinon.FakeXDomainRequest.restore = function restore(keepOnCreate) {
                if (xdr.supportsXDR) {
                    global.XDomainRequest = xdr.GlobalXDomainRequest;
                }

                delete sinon.FakeXDomainRequest.restore;

                if (keepOnCreate !== true) {
                    delete sinon.FakeXDomainRequest.onCreate;
                }
            };
            if (xdr.supportsXDR) {
                global.XDomainRequest = sinon.FakeXDomainRequest;
            }
            return sinon.FakeXDomainRequest;
        };

        sinon.FakeXDomainRequest = FakeXDomainRequest;
    }

    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;

    function loadDependencies(require, exports, module) {
        var sinon = require("./core");
        require("../extend");
        require("./event");
        require("../log_error");
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
})(typeof global !== "undefined" ? global : self);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../extend":11,"../log_error":13,"./core":23,"./event":24}],29:[function(require,module,exports){
(function (global){
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
    var supportsFormData = typeof FormData !== "undefined";
    var sinonXhr = { XMLHttpRequest: global.XMLHttpRequest };
    sinonXhr.GlobalXMLHttpRequest = global.XMLHttpRequest;
    sinonXhr.GlobalActiveXObject = global.ActiveXObject;
    sinonXhr.supportsActiveX = typeof sinonXhr.GlobalActiveXObject != "undefined";
    sinonXhr.supportsXHR = typeof sinonXhr.GlobalXMLHttpRequest != "undefined";
    sinonXhr.workingXHR = sinonXhr.supportsXHR ? sinonXhr.GlobalXMLHttpRequest : sinonXhr.supportsActiveX
                                     ? function () {
                                        return new sinonXhr.GlobalActiveXObject("MSXML2.XMLHTTP.3.0")
                                    } : false;
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

    // Note that for FakeXMLHttpRequest to work pre ES5
    // we lose some of the alignment with the spec.
    // To ensure as close a match as possible,
    // set responseType before calling open, send or respond;
    function FakeXMLHttpRequest() {
        this.readyState = FakeXMLHttpRequest.UNSENT;
        this.requestHeaders = {};
        this.requestBody = null;
        this.status = 0;
        this.statusText = "";
        this.upload = new UploadProgress();
        this.responseType = "";
        this.response = "";
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
                this.response = this.responseType === "json" ? null : "";
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

                switch (this.readyState) {
                    case FakeXMLHttpRequest.DONE:
                        if (supportsProgress) {
                            this.upload.dispatchEvent(new sinon.ProgressEvent("progress", {loaded: 100, total: 100}));
                            this.dispatchEvent(new sinon.ProgressEvent("progress", {loaded: 100, total: 100}));
                        }
                        this.upload.dispatchEvent(new sinon.Event("load", false, false, this));
                        this.dispatchEvent(new sinon.Event("load", false, false, this));
                        this.dispatchEvent(new sinon.Event("loadend", false, false, this));
                        break;
                }

                this.dispatchEvent(new sinon.Event("readystatechange"));
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
                    } else if (supportsFormData && !(data instanceof FormData)) {
                        this.requestHeaders["Content-Type"] = "text/plain;charset=utf-8";
                    }

                    this.requestBody = data;
                }

                this.errorFlag = false;
                this.sendFlag = this.async;
                this.response = this.responseType === "json" ? null : "";
                this.readyStateChange(FakeXMLHttpRequest.OPENED);

                if (typeof this.onSend == "function") {
                    this.onSend(this);
                }

                this.dispatchEvent(new sinon.Event("loadstart", false, false, this));
            },

            abort: function abort() {
                this.aborted = true;
                this.responseText = null;
                this.response = this.responseType === "json" ? null : "";
                this.errorFlag = true;
                this.requestHeaders = {};
                this.responseHeaders = {};

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

                this.response = this.responseType === "json" ? JSON.parse(this.responseText) : this.responseText;
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

            downloadProgress: function downloadProgress(progressEventRaw) {
                if (supportsProgress) {
                    this.dispatchEvent(new sinon.ProgressEvent("progress", progressEventRaw));
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
        require("../extend");
        require("./event");
        require("../log_error");
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

})(typeof global !== "undefined" ? global : self);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../extend":11,"../log_error":13,"./core":23,"./event":24}],30:[function(require,module,exports){
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
},{"samsam":32}],31:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
// transducers-js 0.4.175
// http://github.com/cognitect-labs/transducers-js
// 
// Copyright 2014-2015 Cognitect. All Rights Reserved.
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
goog.DISALLOW_TEST_ONLY_CODE = COMPILED && !goog.DEBUG;
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
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module = function(a) {
  if (!goog.isString(a) || !a || -1 == a.search(goog.VALID_MODULE_RE_)) {
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
  if (goog.DISALLOW_TEST_ONLY_CODE) {
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
    goog.ENABLE_DEBUG_LOADER && goog.IS_OLD_IE_ && goog.maybeProcessDeferredDep_(a);
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
goog.DEPENDENCIES_ENABLED && (goog.included_ = {}, goog.dependencies_ = {pathIsModule:{}, nameToPath:{}, requires:{}, visited:{}, written:{}, deferred:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return "undefined" != typeof a && "write" in a;
}, goog.findBasePath_ = function() {
  if (goog.isDef(goog.global.CLOSURE_BASE_PATH)) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH;
  } else {
    if (goog.inHtmlDocument_()) {
      for (var a = goog.global.document.getElementsByTagName("SCRIPT"), b = a.length - 1;0 <= b;--b) {
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
}, goog.IS_OLD_IE_ = !(goog.global.atob || !goog.global.document || !goog.global.document.all), goog.importModule_ = function(a) {
  goog.importScript_("", 'goog.retrieveAndExecModule_("' + a + '");') && (goog.dependencies_.written[a] = !0);
}, goog.queuedModules_ = [], goog.wrapModule_ = function(a, b) {
  return goog.LOAD_MODULE_USING_EVAL && goog.isDef(goog.global.JSON) ? "goog.loadModule(" + goog.global.JSON.stringify(b + "\n//# sourceURL=" + a + "\n") + ");" : 'goog.loadModule(function(exports) {"use strict";' + b + "\n;return exports});\n//# sourceURL=" + a + "\n";
}, goog.loadQueuedModules_ = function() {
  var a = goog.queuedModules_.length;
  if (0 < a) {
    var b = goog.queuedModules_;
    goog.queuedModules_ = [];
    for (var c = 0;c < a;c++) {
      goog.maybeProcessDeferredPath_(b[c]);
    }
  }
}, goog.maybeProcessDeferredDep_ = function(a) {
  goog.isDeferredModule_(a) && goog.allDepsAreAvailable_(a) && (a = goog.getPathFromDeps_(a), goog.maybeProcessDeferredPath_(goog.basePath + a));
}, goog.isDeferredModule_ = function(a) {
  return (a = goog.getPathFromDeps_(a)) && goog.dependencies_.pathIsModule[a] ? goog.basePath + a in goog.dependencies_.deferred : !1;
}, goog.allDepsAreAvailable_ = function(a) {
  if ((a = goog.getPathFromDeps_(a)) && a in goog.dependencies_.requires) {
    for (var b in goog.dependencies_.requires[a]) {
      if (!goog.isProvided_(b) && !goog.isDeferredModule_(b)) {
        return !1;
      }
    }
  }
  return !0;
}, goog.maybeProcessDeferredPath_ = function(a) {
  if (a in goog.dependencies_.deferred) {
    var b = goog.dependencies_.deferred[a];
    delete goog.dependencies_.deferred[a];
    goog.globalEval(b);
  }
}, goog.loadModule = function(a) {
  var b = goog.moduleLoaderState_;
  try {
    goog.moduleLoaderState_ = {moduleName:void 0, declareTestMethods:!1};
    var c;
    if (goog.isFunction(a)) {
      c = a.call(goog.global, {});
    } else {
      if (goog.isString(a)) {
        c = goog.loadModuleFromSource_.call(goog.global, a);
      } else {
        throw Error("Invalid module definition");
      }
    }
    var d = goog.moduleLoaderState_.moduleName;
    if (!goog.isString(d) || !d) {
      throw Error('Invalid module name "' + d + '"');
    }
    goog.moduleLoaderState_.declareLegacyNamespace ? goog.constructNamespace_(d, c) : goog.SEAL_MODULE_EXPORTS && Object.seal && Object.seal(c);
    goog.loadedModules_[d] = c;
    if (goog.moduleLoaderState_.declareTestMethods) {
      for (var e in c) {
        if (0 === e.indexOf("test", 0) || "tearDown" == e || "setUp" == e || "setUpPage" == e || "tearDownPage" == e) {
          goog.global[e] = c[e];
        }
      }
    }
  } finally {
    goog.moduleLoaderState_ = b;
  }
}, goog.loadModuleFromSource_ = function(a) {
  eval(a);
  return {};
}, goog.writeScriptTag_ = function(a, b) {
  if (goog.inHtmlDocument_()) {
    var c = goog.global.document;
    if ("complete" == c.readyState) {
      if (/\bdeps.js$/.test(a)) {
        return !1;
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    var d = goog.IS_OLD_IE_;
    void 0 === b ? d ? (d = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ", c.write('<script type="text/javascript" src="' + a + '"' + d + ">\x3c/script>")) : c.write('<script type="text/javascript" src="' + a + '">\x3c/script>') : c.write('<script type="text/javascript">' + b + "\x3c/script>");
    return !0;
  }
  return !1;
}, goog.lastNonModuleScriptIndex_ = 0, goog.onScriptLoad_ = function(a, b) {
  "complete" == a.readyState && goog.lastNonModuleScriptIndex_ == b && goog.loadQueuedModules_();
  return !0;
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
goog.normalizePath_ = function(a) {
  a = a.split("/");
  for (var b = 0;b < a.length;) {
    "." == a[b] ? a.splice(b, 1) : b && ".." == a[b] && a[b - 1] && ".." != a[b - 1] ? a.splice(--b, 2) : b++;
  }
  return a.join("/");
};
goog.retrieveAndExecModule_ = function(a) {
  if (!COMPILED) {
    var b = a;
    a = goog.normalizePath_(a);
    var c = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_, d = null, e = new goog.global.XMLHttpRequest;
    e.onload = function() {
      d = this.responseText;
    };
    e.open("get", a, !1);
    e.send();
    d = e.responseText;
    if (null != d) {
      e = goog.wrapModule_(a, d), goog.IS_OLD_IE_ ? (goog.dependencies_.deferred[b] = e, goog.queuedModules_.push(b)) : c(a, e);
    } else {
      throw Error("load of " + a + "failed");
    }
  }
};
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
  return !!a[goog.UID_PROPERTY_];
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
  return +new Date;
};
goog.globalEval = function(a) {
  if (goog.global.execScript) {
    goog.global.execScript(a, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
        goog.global.eval(a);
      } else {
        var b = goog.global.document, c = b.createElement("SCRIPT");
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
    for (var g = Array(arguments.length - 2), h = 2;h < arguments.length;h++) {
      g[h - 2] = arguments[h];
    }
    return b.prototype[c].apply(a, g);
  };
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !d) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (d.superClass_) {
    for (var e = Array(arguments.length - 1), f = 1;f < arguments.length;f++) {
      e[f - 1] = arguments[f];
    }
    return d.superClass_.constructor.apply(a, e);
  }
  e = Array(arguments.length - 2);
  for (f = 2;f < arguments.length;f++) {
    e[f - 2] = arguments[f];
  }
  for (var f = !1, g = a.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
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
var com = {cognitect:{}};
com.cognitect.transducers = {};
var TRANSDUCERS_DEV = !0, TRANSDUCERS_NODE_TARGET = !0, TRANSDUCERS_BROWSER_TARGET = !1, TRANSDUCERS_BROWSER_AMD_TARGET = !1;
com.cognitect.transducers.ITER_SYMBOL = "undefined" != typeof Symbol ? Symbol.iterator : "@@iterator";
com.cognitect.transducers.ITransformer = function() {
};
com.cognitect.transducers.ITransformer.prototype["@@transducer/init"] = function() {
};
com.cognitect.transducers.ITransformer.prototype["@@transducer/result"] = function(a) {
};
com.cognitect.transducers.ITransformer.prototype["@@transducer/step"] = function(a, b) {
};
com.cognitect.transducers.IReduced = function() {
};
com.cognitect.transducers.isString = function(a) {
  return "string" == typeof a;
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
  return a[com.cognitect.transducers.ITER_SYMBOL] || a.next;
};
com.cognitect.transducers.slice = function(a, b, c) {
  return null == c ? Array.prototype.slice.call(a, b) : Array.prototype.slice.call(a, b, c);
};
com.cognitect.transducers.complement = function(a) {
  return function(b) {
    return !a.apply(null, com.cognitect.transducers.slice(arguments, 0));
  };
};
com.cognitect.transducers.Wrap = function(a) {
  this.stepFn = a;
};
com.cognitect.transducers.Wrap.prototype["@@transducer/init"] = function() {
  throw Error("init not implemented");
};
com.cognitect.transducers.Wrap.prototype["@@transducer/result"] = function(a) {
  return a;
};
com.cognitect.transducers.Wrap.prototype["@@transducer/step"] = function(a, b) {
  return this.stepFn(a, b);
};
com.cognitect.transducers.wrap = function(a) {
  return "function" == typeof a ? new com.cognitect.transducers.Wrap(a) : a;
};
com.cognitect.transducers.Reduced = function(a) {
  this["@@transducer/reduced"] = !0;
  this["@@transducer/value"] = a;
};
com.cognitect.transducers.reduced = function(a) {
  return new com.cognitect.transducers.Reduced(a);
};
com.cognitect.transducers.isReduced = function(a) {
  return a instanceof com.cognitect.transducers.Reduced || a && a["@@transducer/reduced"];
};
com.cognitect.transducers.ensureReduced = function(a) {
  return com.cognitect.transducers.isReduced(a) ? a : com.cognitect.transducers.reduced(a);
};
com.cognitect.transducers.deref = function(a) {
  return a["@@transducer/value"];
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
com.cognitect.transducers.Map.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.Map.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.Map.prototype["@@transducer/step"] = function(a, b) {
  return this.xf["@@transducer/step"](a, this.f(b));
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
com.cognitect.transducers.Filter.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.Filter.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.Filter.prototype["@@transducer/step"] = function(a, b) {
  return this.pred(b) ? this.xf["@@transducer/step"](a, b) : a;
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
com.cognitect.transducers.Take.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.Take.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.Take.prototype["@@transducer/step"] = function(a, b) {
  a = 0 < this.n ? this.xf["@@transducer/step"](a, b) : com.cognitect.transducers.ensureReduced(a);
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
com.cognitect.transducers.TakeWhile.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.TakeWhile.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.TakeWhile.prototype["@@transducer/step"] = function(a, b) {
  return this.pred(b) ? this.xf["@@transducer/step"](a, b) : com.cognitect.transducers.reduced(a);
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
com.cognitect.transducers.TakeNth.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.TakeNth.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.TakeNth.prototype["@@transducer/step"] = function(a, b) {
  this.i++;
  return 0 == this.i % this.n ? this.xf["@@transducer/step"](a, b) : a;
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
com.cognitect.transducers.Drop.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.Drop.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.Drop.prototype["@@transducer/step"] = function(a, b) {
  return 0 < this.n ? (this.n--, a) : this.xf["@@transducer/step"](a, b);
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
com.cognitect.transducers.DropWhile.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.DropWhile.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.DropWhile.prototype["@@transducer/step"] = function(a, b) {
  if (this.drop && this.pred(b)) {
    return a;
  }
  this.drop && (this.drop = !1);
  return this.xf["@@transducer/step"](a, b);
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
com.cognitect.transducers.PartitionBy.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.PartitionBy.prototype["@@transducer/result"] = function(a) {
  0 < this.a.length && (a = com.cognitect.transducers.unreduced(this.xf["@@transducer/step"](a, this.a)), this.a = []);
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.PartitionBy.prototype["@@transducer/step"] = function(a, b) {
  var c = this.pval, d = this.f(b);
  this.pval = d;
  if (c == com.cognitect.transducers.NONE || c == d) {
    return this.a.push(b), a;
  }
  c = this.xf["@@transducer/step"](a, this.a);
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
com.cognitect.transducers.PartitionAll.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.PartitionAll.prototype["@@transducer/result"] = function(a) {
  0 < this.a.length && (a = com.cognitect.transducers.unreduced(this.xf["@@transducer/step"](a, this.a)), this.a = []);
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.PartitionAll.prototype["@@transducer/step"] = function(a, b) {
  this.a.push(b);
  if (this.n == this.a.length) {
    var c = this.a;
    this.a = [];
    return this.xf["@@transducer/step"](a, c);
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
com.cognitect.transducers.Keep.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.Keep.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.Keep.prototype["@@transducer/step"] = function(a, b) {
  return null == this.f(b) ? a : this.xf["@@transducer/step"](a, b);
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
com.cognitect.transducers.KeepIndexed.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.KeepIndexed.prototype["@@transducer/result"] = function(a) {
  return this.xf["@@transducer/result"](a);
};
com.cognitect.transducers.KeepIndexed.prototype["@@transducer/step"] = function(a, b) {
  this.i++;
  return null == this.f(this.i, b) ? a : this.xf["@@transducer/step"](a, b);
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
  return {"@@transducer/init":function() {
    return a["@@transducer/init"]();
  }, "@@transducer/result":function(a) {
    return a;
  }, "@@transducer/step":function(b, c) {
    var d = a["@@transducer/step"](b, c);
    return com.cognitect.transducers.isReduced(d) ? com.cognitect.transducers.reduced(d) : d;
  }};
};
com.cognitect.transducers.cat = function(a) {
  var b = com.cognitect.transducers.preservingReduced(a);
  return {"@@transducer/init":function() {
    return a["@@transducer/init"]();
  }, "@@transducer/result":function(b) {
    return a["@@transducer/result"](b);
  }, "@@transducer/step":function(a, d) {
    return com.cognitect.transducers.reduce(b, a, d);
  }};
};
com.cognitect.transducers.mapcat = function(a) {
  return com.cognitect.transducers.comp(com.cognitect.transducers.map(a), com.cognitect.transducers.cat);
};
com.cognitect.transducers.stringReduce = function(a, b, c) {
  for (var d = 0;d < c.length;d++) {
    if (b = a["@@transducer/step"](b, c.charAt(d)), com.cognitect.transducers.isReduced(b)) {
      b = com.cognitect.transducers.deref(b);
      break;
    }
  }
  return a["@@transducer/result"](b);
};
com.cognitect.transducers.arrayReduce = function(a, b, c) {
  for (var d = 0;d < c.length;d++) {
    if (b = a["@@transducer/step"](b, c[d]), com.cognitect.transducers.isReduced(b)) {
      b = com.cognitect.transducers.deref(b);
      break;
    }
  }
  return a["@@transducer/result"](b);
};
com.cognitect.transducers.objectReduce = function(a, b, c) {
  for (var d in c) {
    if (c.hasOwnProperty(d) && (b = a["@@transducer/step"](b, [d, c[d]]), com.cognitect.transducers.isReduced(b))) {
      b = com.cognitect.transducers.deref(b);
      break;
    }
  }
  return a["@@transducer/result"](b);
};
com.cognitect.transducers.iterableReduce = function(a, b, c) {
  c[com.cognitect.transducers.ITER_SYMBOL] && (c = c[com.cognitect.transducers.ITER_SYMBOL]());
  for (var d = c.next();!d.done;) {
    b = a["@@transducer/step"](b, d.value);
    if (com.cognitect.transducers.isReduced(b)) {
      b = com.cognitect.transducers.deref(b);
      break;
    }
    d = c.next();
  }
  return a["@@transducer/result"](b);
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
  if (3 == arguments.length) {
    d = c;
    if ("function" == typeof b) {
      throw Error("If given only three arguments f must satisfy the ITransformer interface.");
    }
    c = b["@@transducer/init"]();
  }
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
com.cognitect.transducers.Completing.prototype["@@transducer/init"] = function() {
  return this.xf["@@transducer/init"]();
};
com.cognitect.transducers.Completing.prototype["@@transducer/result"] = function(a) {
  return this.cf(a);
};
com.cognitect.transducers.Completing.prototype["@@transducer/step"] = function(a, b) {
  return this.xf["@@transducer/step"](a, b);
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
  return c["@@transducer/step"].bind(c);
};
com.cognitect.transducers.first = com.cognitect.transducers.wrap(function(a, b) {
  return com.cognitect.transducers.reduced(b);
});
TRANSDUCERS_BROWSER_TARGET && (goog.exportSymbol("transducers.reduced", com.cognitect.transducers.reduced), goog.exportSymbol("transducers.isReduced", com.cognitect.transducers.isReduced), goog.exportSymbol("transducers.comp", com.cognitect.transducers.comp), goog.exportSymbol("transducers.complement", com.cognitect.transducers.complement), goog.exportSymbol("transducers.identity", com.cognitect.transducers.identity), goog.exportSymbol("transducers.transduce", com.cognitect.transducers.transduce), 
goog.exportSymbol("transducers.reduce", com.cognitect.transducers.reduce), goog.exportSymbol("transducers.map", com.cognitect.transducers.map), goog.exportSymbol("transducers.Map", com.cognitect.transducers.Map), goog.exportSymbol("transducers.filter", com.cognitect.transducers.filter), goog.exportSymbol("transducers.Filter", com.cognitect.transducers.Filter), goog.exportSymbol("transducers.remove", com.cognitect.transducers.remove), goog.exportSymbol("transducers.Remove", com.cognitect.transducers.Remove), 
goog.exportSymbol("transducers.keep", com.cognitect.transducers.keep), goog.exportSymbol("transducers.Keep", com.cognitect.transducers.Keep), goog.exportSymbol("transducers.keepIndexed", com.cognitect.transducers.keepIndexed), goog.exportSymbol("transducers.KeepIndexed", com.cognitect.transducers.KeepIndexed), goog.exportSymbol("transducers.take", com.cognitect.transducers.take), goog.exportSymbol("transducers.Take", com.cognitect.transducers.Take), goog.exportSymbol("transducers.takeWhile", com.cognitect.transducers.takeWhile), 
goog.exportSymbol("transducers.TakeWhile", com.cognitect.transducers.TakeWhile), goog.exportSymbol("transducers.takeNth", com.cognitect.transducers.takeNth), goog.exportSymbol("transducers.TakeNth", com.cognitect.transducers.TakeNth), goog.exportSymbol("transducers.drop", com.cognitect.transducers.drop), goog.exportSymbol("transducers.Drop", com.cognitect.transducers.Drop), goog.exportSymbol("transducers.dropWhile", com.cognitect.transducers.dropWhile), goog.exportSymbol("transducers.DropWhile", 
com.cognitect.transducers.DropWhile), goog.exportSymbol("transducers.partitionBy", com.cognitect.transducers.partitionBy), goog.exportSymbol("transducers.PartitionBy", com.cognitect.transducers.PartitionBy), goog.exportSymbol("transducers.partitionAll", com.cognitect.transducers.partitionAll), goog.exportSymbol("transducers.PartitionAll", com.cognitect.transducers.PartitionAll), goog.exportSymbol("transducers.completing", com.cognitect.transducers.completing), goog.exportSymbol("transducers.Completing", 
com.cognitect.transducers.Completing), goog.exportSymbol("transducers.wrap", com.cognitect.transducers.wrap), goog.exportSymbol("transducers.Wrap", com.cognitect.transducers.Wrap), goog.exportSymbol("transducers.cat", com.cognitect.transducers.cat), goog.exportSymbol("transducers.mapcat", com.cognitect.transducers.mapcat), goog.exportSymbol("transducers.into", com.cognitect.transducers.into), goog.exportSymbol("transducers.toFn", com.cognitect.transducers.toFn), goog.exportSymbol("transducers.first", 
com.cognitect.transducers.first), goog.exportSymbol("transducers.ensureReduced", com.cognitect.transducers.ensureReduced), goog.exportSymbol("transducers.unreduced", com.cognitect.transducers.unreduced), goog.exportSymbol("transducers.deref", com.cognitect.transducers.deref));
TRANSDUCERS_NODE_TARGET && (module.exports = {reduced:com.cognitect.transducers.reduced, isReduced:com.cognitect.transducers.isReduced, comp:com.cognitect.transducers.comp, complement:com.cognitect.transducers.complement, identity:com.cognitect.transducers.identity, map:com.cognitect.transducers.map, Map:com.cognitect.transducers.Map, filter:com.cognitect.transducers.filter, Filter:com.cognitect.transducers.Filter, remove:com.cognitect.transducers.remove, Remove:com.cognitect.transducers.Remove, 
keep:com.cognitect.transducers.keep, Kemove:com.cognitect.transducers.Keep, keepIndexed:com.cognitect.transducers.keepIndexed, KeepIndexed:com.cognitect.transducers.KeepIndexed, take:com.cognitect.transducers.take, Take:com.cognitect.transducers.Take, takeWhile:com.cognitect.transducers.takeWhile, TakeWhile:com.cognitect.transducers.TakeWhile, takeNth:com.cognitect.transducers.takeNth, TakeNth:com.cognitect.transducers.TakeNth, drop:com.cognitect.transducers.drop, Drop:com.cognitect.transducers.Drop, 
dropWhile:com.cognitect.transducers.dropWhile, DropWhile:com.cognitect.transducers.DropWhile, partitionBy:com.cognitect.transducers.partitionBy, PartitionBy:com.cognitect.transducers.PartitionBy, partitionAll:com.cognitect.transducers.partitionAll, PartitionAll:com.cognitect.transducers.PartitionAll, completing:com.cognitect.transducers.completing, Completing:com.cognitect.transducers.Completing, wrap:com.cognitect.transducers.wrap, Wrap:com.cognitect.transducers.Wrap, cat:com.cognitect.transducers.cat, 
mapcat:com.cognitect.transducers.mapcat, transduce:com.cognitect.transducers.transduce, reduce:com.cognitect.transducers.reduce, into:com.cognitect.transducers.into, toFn:com.cognitect.transducers.toFn, first:com.cognitect.transducers.first, ensureReduced:com.cognitect.transducers.ensureReduced, unreduced:com.cognitect.transducers.unreduced, deref:com.cognitect.transducers.deref});


},{}],34:[function(require,module,exports){

// basic protocol helpers

var symbolExists = typeof Symbol !== 'undefined';

var protocols = {
  iterator: symbolExists ? Symbol.iterator : '@@iterator'
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
  this['@@transducer/reduced'] = true;
  this['@@transducer/value'] = value;
}

function isReduced(x) {
  return (x instanceof Reduced) || (x && x['@@transducer/reduced']);
}

function deref(x) {
  return x['@@transducer/value'];
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
      result = xform['@@transducer/step'](result, coll[index]);
      if(isReduced(result)) {
        result = deref(result);
        break;
      }
    }
    return xform['@@transducer/result'](result);
  }
  else if(isObject(coll) || fulfillsProtocol(coll, 'iterator')) {
    var result = init;
    var iter = iterator(coll);
    var val = iter.next();
    while(!val.done) {
      result = xform['@@transducer/step'](result, val.value);
      if(isReduced(result)) {
        result = deref(result);
        break;
      }
      val = iter.next();
    }
    return xform['@@transducer/result'](result);
  }
  throwProtocolError('iterate', coll);
}

function transduce(coll, xform, reducer, init) {
  xform = xform(reducer);
  if(init === undefined) {
    init = xform['@@transducer/init']();
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
  var t = {};
  t['@@transducer/init'] = function() {
    throw new Error('init value unavailable');
  };
  t['@@transducer/result'] = function(v) {
    return v;
  };
  t['@@transducer/step'] = f;
  return t;
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

Map.prototype['@@transducer/init'] = function() {
  return this.xform['@@transducer/init']();
};

Map.prototype['@@transducer/result'] = function(v) {
  return this.xform['@@transducer/result'](v);
};

Map.prototype['@@transducer/step'] = function(res, input) {
  return this.xform['@@transducer/step'](res, this.f(input));
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

Filter.prototype['@@transducer/init'] = function() {
  return this.xform['@@transducer/init']();
};

Filter.prototype['@@transducer/result'] = function(v) {
  return this.xform['@@transducer/result'](v);
};

Filter.prototype['@@transducer/step'] = function(res, input) {
  if(this.f(input)) {
    return this.xform['@@transducer/step'](res, input);
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

Dedupe.prototype['@@transducer/init'] = function() {
  return this.xform['@@transducer/init']();
};

Dedupe.prototype['@@transducer/result'] = function(v) {
  return this.xform['@@transducer/result'](v);
};

Dedupe.prototype['@@transducer/step'] = function(result, input) {
  if(input !== this.last) {
    this.last = input;
    return this.xform['@@transducer/step'](result, input);
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

TakeWhile.prototype['@@transducer/init'] = function() {
  return this.xform['@@transducer/init']();
};

TakeWhile.prototype['@@transducer/result'] = function(v) {
  return this.xform['@@transducer/result'](v);
};

TakeWhile.prototype['@@transducer/step'] = function(result, input) {
  if(this.f(input)) {
    return this.xform['@@transducer/step'](result, input);
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

Take.prototype['@@transducer/init'] = function() {
  return this.xform['@@transducer/init']();
};

Take.prototype['@@transducer/result'] = function(v) {
  return this.xform['@@transducer/result'](v);
};

Take.prototype['@@transducer/step'] = function(result, input) {
  if (this.i < this.n) {
    result = this.xform['@@transducer/step'](result, input);
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

Drop.prototype['@@transducer/init'] = function() {
  return this.xform['@@transducer/init']();
};

Drop.prototype['@@transducer/result'] = function(v) {
  return this.xform['@@transducer/result'](v);
};

Drop.prototype['@@transducer/step'] = function(result, input) {
  if(this.i++ < this.n) {
    return result;
  }
  return this.xform['@@transducer/step'](result, input);
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

DropWhile.prototype['@@transducer/init'] = function() {
  return this.xform['@@transducer/init']();
};

DropWhile.prototype['@@transducer/result'] = function(v) {
  return this.xform['@@transducer/result'](v);
};

DropWhile.prototype['@@transducer/step'] = function(result, input) {
  if(this.dropping) {
    if(this.f(input)) {
      return result;
    }
    else {
      this.dropping = false;
    }
  }
  return this.xform['@@transducer/step'](result, input);
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

Partition.prototype['@@transducer/init'] = function() {
  return this.xform['@@transducer/init']();
};

Partition.prototype['@@transducer/result'] = function(v) {
  if (this.i > 0) {
    return ensureUnreduced(this.xform['@@transducer/step'](v, this.part.slice(0, this.i)));
  }
  return this.xform['@@transducer/result'](v);
};

Partition.prototype['@@transducer/step'] = function(result, input) {
  this.part[this.i] = input;
  this.i += 1;
  if (this.i === this.n) {
    var out = this.part.slice(0, this.n);
    this.part = new Array(this.n);
    this.i = 0;
    return this.xform['@@transducer/step'](result, out);
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

PartitionBy.prototype['@@transducer/init'] = function() {
  return this.xform['@@transducer/init']();
};

PartitionBy.prototype['@@transducer/result'] = function(v) {
  var l = this.part.length;
  if (l > 0) {
    return ensureUnreduced(this.xform['@@transducer/step'](v, this.part.slice(0, l)));
  }
  return this.xform['@@transducer/result'](v);
};

PartitionBy.prototype['@@transducer/step'] = function(result, input) {
  var current = this.f(input);
  if (current === this.last || this.last === NOTHING) {
    this.part.push(input);
  } else {
    result = this.xform['@@transducer/step'](result, this.part);
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

function Interpose(sep, xform) {
  this.sep = sep;
  this.xform = xform;
  this.started = false;
}

Interpose.prototype['@@transducer/init'] = function() {
  return this.xform['@@transducer/init']();
};

Interpose.prototype['@@transducer/result'] = function(v) {
  return this.xform['@@transducer/result'](v);
};

Interpose.prototype['@@transducer/step'] = function(result, input) {
  if (this.started) {
    var withSep = this.xform['@@transducer/step'](result, this.sep);
    if (isReduced(withSep)) {
      return withSep;
    } else {
      return this.xform['@@transducer/step'](withSep, input);
    }
  } else {
    this.started = true;
    return this.xform['@@transducer/step'](result, input);
  }
};

/**
 * Returns a new collection containing elements of the given
 * collection, separated by the specified separator. Returns a
 * transducer if a collection is not provided.
 */
function interpose(coll, separator) {
  if (arguments.length === 1) {
    separator = coll;
    return function(xform) {
      return new Interpose(separator, xform);
    };
  }
  return seq(coll, interpose(separator));
}

function Repeat(n, xform) {
  this.xform = xform;
  this.n = n;
}

Repeat.prototype['@@transducer/init'] = function() {
  return this.xform['@@transducer/init']();
};

Repeat.prototype['@@transducer/result'] = function(v) {
  return this.xform['@@transducer/result'](v);
};

Repeat.prototype['@@transducer/step'] = function(result, input) {
  var n = this.n;
  var r = result;
  for (var i = 0; i < n; i++) {
    r = this.xform['@@transducer/step'](r, input);
    if (isReduced(r)) {
      break;
    }
  }
  return r;
};

/**
 * Returns a new collection containing elements of the given
 * collection, each repeated n times. Returns a transducer if a
 * collection is not provided.
 */
function repeat(coll, n) {
  if (arguments.length === 1) {
    n = coll;
    return function(xform) {
      return new Repeat(n, xform);
    };
  }
  return seq(coll, repeat(n));
}

function TakeNth(n, xform) {
  this.xform = xform;
  this.n = n;
  this.i = -1;
}

TakeNth.prototype['@@transducer/init'] = function() {
  return this.xform['@@transducer/init']();
};

TakeNth.prototype['@@transducer/result'] = function(v) {
  return this.xform['@@transducer/result'](v);
};

TakeNth.prototype['@@transducer/step'] = function(result, input) {
  this.i += 1;
  if (this.i % this.n === 0) {
    return this.xform['@@transducer/step'](result, input);
  }
  return result;
};

/**
 * Returns a new collection of every nth element of the given
 * collection. Returns a transducer if a collection is not provided.
 */
function takeNth(coll, nth) {
  if (arguments.length === 1) {
    nth = coll;
    return function(xform) {
      return new TakeNth(nth, xform);
    };
  }
  return seq(coll, takeNth(nth));
}

// pure transducers (cannot take collections)

function Cat(xform) {
  this.xform = xform;
}

Cat.prototype['@@transducer/init'] = function() {
  return this.xform['@@transducer/init']();
};

Cat.prototype['@@transducer/result'] = function(v) {
  return this.xform['@@transducer/result'](v);
};

Cat.prototype['@@transducer/step'] = function(result, input) {
  var xform = this.xform;
  var newxform = {};
  newxform['@@transducer/init'] = function() {
    return xform['@@transducer/init']();
  };
  newxform['@@transducer/result'] = function(v) {
    return v;
  };
  newxform['@@transducer/step'] = function(result, input) {
    var val = xform['@@transducer/step'](result, input);
    return isReduced(val) ? deref(val) : val;
  };

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

var arrayReducer = {};
arrayReducer['@@transducer/init'] = function() {
  return [];
};
arrayReducer['@@transducer/result'] = function(v) {
  return v;
};
arrayReducer['@@transducer/step'] = push;

var objReducer = {};
objReducer['@@transducer/init'] = function() {
  return {};
};
objReducer['@@transducer/result'] = function(v) {
  return v;
};
objReducer['@@transducer/step'] = merge;

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
  else if(coll['@@transducer/step']) {
    var init;
    if(coll['@@transducer/init']) {
      init = coll['@@transducer/init']();
    }
    else {
      init = new coll.constructor();
    }

    return transduce(coll, xform, coll, init);
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
  else if(to['@@transducer/step']) {
    return transduce(from,
                     xform,
                     to,
                     to);
  }
  throwProtocolError('into', to);
}

// laziness

var stepper = {};
stepper['@@transducer/result'] = function(v) {
  return isReduced(v) ? deref(v) : v;
};
stepper['@@transducer/step'] = function(lt, x) {
  lt.items.push(x);
  return lt.rest;
};

function Stepper(xform, iter) {
  this.xform = xform(stepper);
  this.iter = iter;
}

Stepper.prototype['@@transducer/step'] = function(lt) {
  var len = lt.items.length;
  while(lt.items.length === len) {
    var n = this.iter.next();
    if(n.done || isReduced(n.value)) {
      // finalize
      this.xform['@@transducer/result'](this);
      break;
    }

    // step
    this.xform['@@transducer/step'](lt, n.value);
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
  this['@@transducer/step']();

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

LazyTransformer.prototype['@@transducer/step'] = function() {
  if(!this.items.length) {
    this.stepper['@@transducer/step'](this);
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
  isReduced: isReduced,
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
  takeNth: takeNth,
  drop: drop,
  dropWhile: dropWhile,
  partition: partition,
  partitionBy: partitionBy,
  interpose: interpose,
  repeat: repeat,
  range: range,

  LazyTransformer: LazyTransformer
};

},{}],35:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

describe('beforeEnd', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().beforeEnd(function() {})).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.beforeEnd(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).beforeEnd(function() {
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
      return expect(a.beforeEnd(function() {
        return 42;
      })).toEmit([1, 2, 42, '<end>'], function() {
        return send(a, [1, 2, '<end>']);
      });
    });
    return it('errors should flow', function() {
      var a;
      a = stream();
      return expect(a.beforeEnd(function() {})).errorsToFlow(a);
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().beforeEnd(function() {})).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.beforeEnd(function() {})).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      expect(send(prop(), ['<end>']).beforeEnd(function() {
        return 42;
      })).toEmit([
        {
          current: 42
        }, '<end:current>'
      ]);
      return expect(send(prop(), [1, '<end>']).beforeEnd(function() {
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
      return expect(a.beforeEnd(function() {
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
      return expect(a.beforeEnd(function() {})).errorsToFlow(a);
    });
  });
});



},{"../test-helpers.coffee":107}],36:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir, deactivate = ref.deactivate, activate = ref.activate;

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
      expect(send(stream(), ['<end>']).bufferBy(stream())).toEmit([
        {
          current: []
        }, '<end:current>'
      ]);
      a = stream();
      b = stream();
      return expect(a.bufferBy(b)).toEmit([[], '<end>'], function() {
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
    it('should flush buffer on each value from secondary', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.bufferBy(b)).toEmit([[], [1, 2], [], [3]], function() {
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



},{"../test-helpers.coffee":107}],37:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir, deactivate = ref.deactivate, activate = ref.activate;

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
    it('errors should flow', function() {
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
    return it('should flush on change if {flushOnChange === true}', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.bufferWhileBy(b, {
        flushOnChange: true
      })).toEmit([[1, 2, 3]], function() {
        send(a, [1, 2]);
        send(b, [true]);
        send(a, [3]);
        return send(b, [false]);
      });
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



},{"../test-helpers.coffee":107}],38:[function(require,module,exports){
var Kefir, not3, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],39:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

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
    var a, b, bus, c, i, j, len, len1, obs, ref1, ref2, results;
    a = stream();
    b = prop();
    c = stream();
    bus = Kefir.bus().plug(a).plug(b).plug(c);
    bus.onEnd(function() {});
    ref1 = [a, b, c];
    for (i = 0, len = ref1.length; i < len; i++) {
      obs = ref1[i];
      expect(obs).toBeActive();
    }
    bus.end();
    ref2 = [a, b, c];
    results = [];
    for (j = 0, len1 = ref2.length; j < len1; j++) {
      obs = ref2[j];
      results.push(expect(obs).not.toBeActive());
    }
    return results;
  });
});



},{"../test-helpers.coffee":107}],40:[function(require,module,exports){
var Kefir, prop, ref, send, stream, streamWithCurrent;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

streamWithCurrent = function(event) {
  return Kefir.stream(function(emitter) {
    return emitter.emitEvent(event);
  });
};

describe('changes', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().changes()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.changes()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).changes()).toEmit(['<end:current>']);
    });
    it('test `streamWithCurrent` helper', function() {
      expect(streamWithCurrent({
        type: 'value',
        value: 1
      })).toEmit([
        {
          current: 1
        }
      ]);
      return expect(streamWithCurrent({
        type: 'error',
        value: 1
      })).toEmit([
        {
          currentError: 1
        }
      ]);
    });
    return it('should handle events and current', function() {
      var a;
      a = streamWithCurrent({
        type: 'value',
        value: 1
      });
      expect(a.changes()).toEmit([
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
      a = streamWithCurrent({
        type: 'error',
        value: 1
      });
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



},{"../test-helpers.coffee":107}],41:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream,
  slice = [].slice;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

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
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
  it('errors should flow', function() {
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
  it('should handle errors correctly', function() {
    var a, b, c;
    a = stream();
    b = stream();
    c = stream();
    return expect(Kefir.combine([a, b, c])).toEmit([
      {
        error: -1
      }, {
        error: -1
      }, {
        error: -1
      }, [3, 1, 2], {
        error: -2
      }, {
        error: -3
      }, {
        error: -3
      }, {
        error: -2
      }, [4, 6, 5]
    ], function() {
      send(a, [
        {
          error: -1
        }
      ]);
      send(b, [1]);
      send(c, [2]);
      send(a, [3]);
      send(b, [
        {
          error: -2
        }
      ]);
      send(c, [
        {
          error: -3
        }
      ]);
      send(a, [4]);
      send(c, [5]);
      return send(b, [6]);
    });
  });
  return describe('sampledBy functionality (3 arity combine)', function() {
    it('should return stream', function() {
      expect(Kefir.combine([], [])).toBeStream();
      return expect(Kefir.combine([stream(), prop()], [stream(), prop()])).toBeStream();
    });
    it('should be ended if empty array provided', function() {
      expect(Kefir.combine([stream(), prop()], [])).toEmit([]);
      return expect(Kefir.combine([], [stream(), prop()])).toEmit(['<end:current>']);
    });
    it('should be ended if array of ended observables provided', function() {
      var a, b, c;
      a = send(stream(), ['<end>']);
      b = send(prop(), ['<end>']);
      c = send(stream(), ['<end>']);
      return expect(Kefir.combine([a, b, c], [stream(), prop()])).toEmit(['<end:current>']);
    });
    it('should be ended and emmit current (once) if array of ended properties provided and each of them has current', function() {
      var a, b, c, s1;
      a = send(prop(), [1, '<end>']);
      b = send(prop(), [2, '<end>']);
      c = send(prop(), [3, '<end>']);
      s1 = Kefir.combine([a, b], [c]);
      expect(s1).toEmit([
        {
          current: [1, 2, 3]
        }, '<end:current>'
      ]);
      return expect(s1).toEmit(['<end:current>']);
    });
    it('should activate sources', function() {
      var a, b, c;
      a = stream();
      b = prop();
      c = stream();
      return expect(Kefir.combine([a, b], [c])).toActivate(a, b, c);
    });
    it('should handle events and current from observables', function() {
      var a, b, c, d;
      a = stream();
      b = send(prop(), [0]);
      c = stream();
      d = stream();
      return expect(Kefir.combine([c, d], [a, b])).toEmit([[2, 3, 1, 0], [5, 3, 1, 4], [6, 3, 1, 4], [6, 7, 1, 4], '<end>'], function() {
        send(a, [1]);
        send(c, [2]);
        send(d, [3]);
        send(b, [4, '<end>']);
        send(c, [5, 6, '<end>']);
        return send(d, [7, '<end>']);
      });
    });
    it('should accept optional combinator function', function() {
      var a, b, c, d, join;
      join = function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return args.join('+');
      };
      a = stream();
      b = send(prop(), [0]);
      c = stream();
      d = stream();
      return expect(Kefir.combine([c, d], [a, b], join)).toEmit(['2+3+1+0', '5+3+1+4', '6+3+1+4', '6+7+1+4', '<end>'], function() {
        send(a, [1]);
        send(c, [2]);
        send(d, [3]);
        send(b, [4, '<end>']);
        send(c, [5, 6, '<end>']);
        return send(d, [7, '<end>']);
      });
    });
    it('when activating second time and has 2+ properties in sources, should emit current value at most once', function() {
      var a, b, c, sb;
      a = send(prop(), [0]);
      b = send(prop(), [1]);
      c = send(prop(), [2]);
      sb = Kefir.combine([a, b], [c]);
      activate(sb);
      deactivate(sb);
      return expect(sb).toEmit([
        {
          current: [0, 1, 2]
        }
      ]);
    });
    it('errors should flow', function() {
      var a, b, c, d;
      a = stream();
      b = prop();
      c = stream();
      d = prop();
      expect(Kefir.combine([a, b], [c, d])).errorsToFlow(a);
      a = stream();
      b = prop();
      c = stream();
      d = prop();
      return expect(Kefir.combine([a, b], [c, d])).errorsToFlow(b);
    });
    return it('should work nice for emitating atomic updates', function() {
      var a, b, c;
      a = stream();
      b = a.map(function(x) {
        return x + 2;
      });
      c = a.map(function(x) {
        return x * 2;
      });
      return expect(Kefir.combine([b], [c])).toEmit([[3, 2], [4, 4], [5, 6]], function() {
        return send(a, [1, 2, 3]);
      });
    });
  });
});



},{"../test-helpers.coffee":107}],42:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],43:[function(require,module,exports){
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



},{"../../dist/kefir":1}],44:[function(require,module,exports){
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



},{"../../dist/kefir":1}],45:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],46:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],47:[function(require,module,exports){
var Kefir, minus, noop, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],48:[function(require,module,exports){
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



},{"../../dist/kefir":1}],49:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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
        {
          error: -1
        }
      ]);
      expect(a.endOnError()).toEmit([
        {
          currentError: -1
        }, '<end:current>'
      ]);
      a = send(prop(), [
        {
          error: -1
        }, '<end>'
      ]);
      expect(a.endOnError()).toEmit([
        {
          currentError: -1
        }, '<end:current>'
      ]);
      a = send(prop(), [1]);
      expect(a.endOnError()).toEmit([
        {
          current: 1
        }
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



},{"../test-helpers.coffee":107}],50:[function(require,module,exports){
var Kefir, handler, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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
      a = send(prop(), [1]);
      return expect(a.errorsToValues(handler)).toEmit([
        {
          current: 1
        }
      ]);
    });
  });
});



},{"../test-helpers.coffee":107}],51:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],52:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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
        {
          error: 5
        }
      ]);
      return expect(a.filterErrors(function(x) {
        return x > 3;
      })).toEmit([
        {
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
        {
          error: 0
        }
      ]);
      return expect(a.filterErrors(function(x) {
        return x > 2;
      })).toEmit([]);
    });
    return it('shoud use id as default predicate', function() {
      var a;
      a = send(prop(), [
        {
          error: 5
        }
      ]);
      expect(a.filterErrors()).toEmit([
        {
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
        {
          error: 0
        }
      ]);
      return expect(a.filterErrors()).toEmit([]);
    });
  });
});



},{"../test-helpers.coffee":107}],53:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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
      a = send(prop(), [5]);
      expect(a.filter(function(x) {
        return x > 2;
      })).toEmit([
        {
          current: 5
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
      a = send(prop(), [
        {
          error: 0
        }
      ]);
      return expect(a.filter(function(x) {
        return x > 2;
      })).toEmit([
        {
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
      a = send(prop(), [0]);
      expect(a.filter()).toEmit([
        4, {
          error: -2
        }, 5, 6, '<end>'
      ], function() {
        return send(a, [
          0, 4, {
            error: -2
          }, 5, 0, 6, '<end>'
        ]);
      });
      a = send(prop(), [1]);
      return expect(a.filter()).toEmit([
        {
          current: 1
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



},{"../test-helpers.coffee":107}],54:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],55:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

describe('flatMapErrors', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().flatMapErrors()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.flatMapErrors()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).flatMapErrors()).toEmit(['<end:current>']);
    });
    it('should handle events', function() {
      var a, b, c;
      a = stream();
      b = stream();
      c = send(prop(), [0]);
      return expect(a.flatMapErrors()).toEmit([1, 2, 0, 3, 4, '<end>'], function() {
        send(b, [0]);
        send(a, [
          {
            error: b
          }
        ]);
        send(b, [1, 2]);
        send(a, [
          {
            error: c
          }, '<end>'
        ]);
        send(b, [3, '<end>']);
        return send(c, [4, '<end>']);
      });
    });
    it('should activate sub-sources', function() {
      var a, b, c, map;
      a = stream();
      b = stream();
      c = send(prop(), [0]);
      map = a.flatMapErrors();
      activate(map);
      send(a, [
        {
          error: b
        }, {
          error: c
        }
      ]);
      deactivate(map);
      return expect(map).toActivate(b, c);
    });
    it('should accept optional map fn', function() {
      var a, b;
      a = stream();
      b = stream();
      return expect(a.flatMapErrors(function(x) {
        return x.obs;
      })).toEmit([1, 2, '<end>'], function() {
        send(b, [0]);
        send(a, [
          {
            error: {
              obs: b
            }
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
      m = a.flatMapErrors();
      activate(m);
      send(a, [
        {
          error: b
        }, {
          error: c
        }
      ]);
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
      return expect(a.flatMapErrors()).toEmit([1, 2], function() {
        return send(a, [
          {
            error: b
          }, {
            error: c
          }
        ]);
      });
    });
    it('should work nicely with Kefir.constant and Kefir.never', function() {
      var a;
      a = stream();
      return expect(a.valuesToErrors().flatMapErrors(function(x) {
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
    it('values should flow', function() {
      var a;
      a = stream();
      return expect(a.flatMapErrors()).toEmit([1, 2, 3], function() {
        return send(a, [1, 2, 3]);
      });
    });
    return it('should be possible to add same obs twice on activation', function() {
      var a, b;
      b = send(prop(), [1]);
      a = Kefir.stream(function(em) {
        em.error(b);
        return em.error(b);
      });
      return expect(a.flatMapErrors()).toEmit([
        {
          current: 1
        }, {
          current: 1
        }
      ]);
    });
  });
  return describe('property', function() {
    it('should be ended if source was ended (with current error)', function() {
      return expect(send(prop(), [
        {
          error: send(prop(), [0, '<end>'])
        }, '<end>'
      ]).flatMapErrors()).toEmit([
        {
          current: 0
        }, '<end:current>'
      ]);
    });
    it('should not costantly adding current value on each activation', function() {
      var a, b, map;
      a = send(prop(), [0]);
      b = send(prop(), [
        {
          error: a
        }
      ]);
      map = b.flatMapErrors();
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
      return expect(a.valuesToErrors().flatMapErrors()).toEmit([
        {
          current: 'b0'
        }, 'b0', 'b0', 'b0', 'b0', 'b1', 'b1', 'b1', 'b1', 'b1', 'c1', 'c1', 'c1', '<end>'
      ], function() {
        send(a, [b, c, b, c, c, b, b, '<end>']);
        send(b, ['b1', '<end>']);
        return send(c, ['c1', '<end>']);
      });
    });
    it('should correctly handle current error of source', function() {
      var a, b;
      a = send(prop(), [0]);
      b = send(prop(), [
        {
          error: a
        }
      ]);
      return expect(b.flatMapErrors()).toEmit([
        {
          current: 0
        }
      ]);
    });
    return it('values should flow', function() {
      var a;
      a = send(prop(), [0]);
      return expect(a.flatMapErrors()).toEmit([
        {
          current: 0
        }, 1, 2, 3
      ], function() {
        return send(a, [1, 2, 3]);
      });
    });
  });
});



},{"../test-helpers.coffee":107}],56:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],57:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],58:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

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
    it('should correctly handle current values of new sub sources', function() {
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
    it('limit = 0', function() {
      var a;
      a = stream();
      return expect(a.flatMapConcurLimit(null, 0)).toEmit(['<end:current>']);
    });
    it('limit = -1', function() {
      var a, b, c, d;
      a = stream();
      b = stream();
      c = stream();
      d = stream();
      return expect(a.flatMapConcurLimit(null, -1)).toEmit([1, 2, 3, 4, 5, 6, '<end>'], function() {
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
    return it('limit = -2', function() {
      var a, b, c, d;
      a = stream();
      b = stream();
      c = stream();
      d = stream();
      return expect(a.flatMapConcurLimit(null, -2)).toEmit([1, 2, 3, 4, 5, 6, '<end>'], function() {
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



},{"../test-helpers.coffee":107}],59:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

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
    it('errors should flow', function() {
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
    it('Bug "flatMap with take(1) doesn\'t unsubscribe from source"', function() {
      var a, b, subs, unsubs;
      subs = 0;
      unsubs = 0;
      a = Kefir.stream(function(emitter) {
        subs++;
        emitter.emit(1);
        return function() {
          return unsubs++;
        };
      });
      b = Kefir.constant(1).flatMap(function() {
        return a;
      }).take(1);
      b.onValue(function() {});
      expect(subs).toBe(1);
      return expect(unsubs).toBe(1);
    });
    return it('should be possible to add same obs twice on activation', function() {
      var a, b;
      b = send(prop(), [1]);
      a = Kefir.stream(function(em) {
        em.emit(b);
        return em.emit(b);
      });
      return expect(a.flatMap()).toEmit([
        {
          current: 1
        }, {
          current: 1
        }
      ]);
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



},{"../test-helpers.coffee":107}],60:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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
        var i, results;
        if (x > 1) {
          return (function() {
            results = [];
            for (var i = 1; 1 <= x ? i <= x : i >= x; 1 <= x ? i++ : i--){ results.push(i); }
            return results;
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
        var i, results;
        if (x > 1) {
          return (function() {
            results = [];
            for (var i = 1; 1 <= x ? i <= x : i >= x; 1 <= x ? i++ : i--){ results.push(i); }
            return results;
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
      expect(send(prop(), [1]).flatten(function(x) {
        var i, results;
        return (function() {
          results = [];
          for (var i = 1; 1 <= x ? i <= x : i >= x; 1 <= x ? i++ : i--){ results.push(i); }
          return results;
        }).apply(this);
      })).toEmit([
        {
          current: 1
        }
      ]);
      return expect(send(prop(), [
        {
          error: 0
        }
      ]).flatten(function() {})).toEmit([
        {
          currentError: 0
        }
      ]);
    });
    it('should handle multiple currents correctly', function() {
      return expect(send(prop(), [2]).flatten(function(x) {
        var i, results;
        return (function() {
          results = [];
          for (var i = 1; 1 <= x ? i <= x : i >= x; 1 <= x ? i++ : i--){ results.push(i); }
          return results;
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



},{"../test-helpers.coffee":107}],61:[function(require,module,exports){
var Kefir, activate, deactivate, ref;

ref = require('../test-helpers.coffee'), activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],62:[function(require,module,exports){
var Kefir, activate, deactivate, ref;

ref = require('../test-helpers.coffee'), activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

describe('fromEvents', function() {
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
    return expect(Kefir.fromEvents(domTarget(), 'foo')).toBeStream();
  });
  it('should not be ended', function() {
    return expect(Kefir.fromEvents(domTarget(), 'foo')).toEmit([]);
  });
  it('should subscribe/unsubscribe from target', function() {
    var a, target;
    target = domTarget();
    a = Kefir.fromEvents(target, 'foo');
    expect(target.fooListener).toBeUndefined();
    activate(a);
    expect(target.fooListener).toEqual(jasmine.any(Function));
    deactivate(a);
    expect(target.fooListener).toBeUndefined();
    target = onOffTarget();
    a = Kefir.fromEvents(target, 'foo');
    expect(target.fooListener).toBeUndefined();
    activate(a);
    expect(target.fooListener).toEqual(jasmine.any(Function));
    deactivate(a);
    expect(target.fooListener).toBeUndefined();
    target = nodeTarget();
    a = Kefir.fromEvents(target, 'foo');
    expect(target.fooListener).toBeUndefined();
    activate(a);
    expect(target.fooListener).toEqual(jasmine.any(Function));
    deactivate(a);
    return expect(target.fooListener).toBeUndefined();
  });
  it('should emit values', function() {
    var a, target;
    target = domTarget();
    a = Kefir.fromEvents(target, 'foo');
    expect(a).toEmit([1, 2, 3], function() {
      target.fooListener(1);
      target.fooListener(2);
      return target.fooListener(3);
    });
    target = nodeTarget();
    a = Kefir.fromEvents(target, 'foo');
    expect(a).toEmit([1, 2, 3], function() {
      target.fooListener(1);
      target.fooListener(2);
      return target.fooListener(3);
    });
    target = onOffTarget();
    a = Kefir.fromEvents(target, 'foo');
    return expect(a).toEmit([1, 2, 3], function() {
      target.fooListener(1);
      target.fooListener(2);
      return target.fooListener(3);
    });
  });
  return it('should accept optional transformer and call it properly', function() {
    var a, target;
    target = domTarget();
    a = Kefir.fromEvents(target, 'foo', function(a, b) {
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



},{"../test-helpers.coffee":107}],63:[function(require,module,exports){
var Kefir, activate, deactivate, ref;

ref = require('../test-helpers.coffee'), activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],64:[function(require,module,exports){
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



},{"../../dist/kefir":1}],65:[function(require,module,exports){
var Kefir, activate, deactivate, ref;

ref = require('../test-helpers.coffee'), activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],66:[function(require,module,exports){
var Kefir, activate, deactivate, noop, ref,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ref = require('../test-helpers.coffee'), activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

noop = function() {};

describe('fromSubUnsub', function() {
  var Target;
  Target = (function() {
    function Target() {
      this.unsub = bind(this.unsub, this);
      this.sub = bind(this.sub, this);
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



},{"../test-helpers.coffee":107}],67:[function(require,module,exports){
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



},{"../../dist/kefir":1}],68:[function(require,module,exports){
var Kefir, activate, deactivate, ref;

ref = require('../test-helpers.coffee'), activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

describe('Kefir.stream', function() {
  it('should return stream', function() {
    return expect(Kefir.stream(function() {})).toBeStream();
  });
  it('should not be ended', function() {
    return expect(Kefir.stream(function() {})).toEmit([]);
  });
  it('should emit values, errors, and end', function() {
    var a, emitter;
    emitter = null;
    a = Kefir.stream(function(em) {
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
    a = Kefir.stream(function() {
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
    expect(Kefir.stream(function(emitter) {
      emitter.end();
      return null;
    })).toEmit(['<end:current>']);
    return expect(Kefir.stream(function(emitter) {
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
    return expect(Kefir.stream(function(emitter) {
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
  it('should work with .take(1) and sync emit', function() {
    var a, log;
    log = [];
    a = Kefir.stream(function(emitter) {
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
  it('should not throw if not falsey but not a function returned', function() {
    return expect(Kefir.stream(function() {
      return true;
    })).toEmit([]);
  });
  it('emitter should return a boolean representing if anyone intrested in future events', function() {
    var a, emitter, f, lastX;
    emitter = null;
    a = Kefir.stream(function(em) {
      return emitter = em;
    });
    activate(a);
    expect(emitter.emit(1)).toBe(true);
    deactivate(a);
    expect(emitter.emit(1)).toBe(false);
    a = Kefir.stream(function(em) {
      expect(em.emit(1)).toBe(true);
      expect(em.emit(2)).toBe(false);
      return expect(em.emit(3)).toBe(false);
    });
    lastX = null;
    f = function(x) {
      lastX = x;
      if (x === 2) {
        return a.offValue(f);
      }
    };
    a.onValue(f);
    return expect(lastX).toBe(2);
  });
  return it('emitter should have methods `value` and `event`', function() {
    return expect(Kefir.stream(function(em) {
      em.value(1);
      return em.event({
        type: 'value',
        value: 2
      });
    })).toEmit([
      {
        current: 1
      }, {
        current: 2
      }
    ]);
  });
});



},{"../test-helpers.coffee":107}],69:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

describe('last', function() {
  describe('stream', function() {
    it('should return stream', function() {
      return expect(stream().last()).toBeStream();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = stream();
      return expect(a.last()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      return expect(send(stream(), ['<end>']).last()).toEmit(['<end:current>']);
    });
    return it('should handle events', function() {
      var a;
      a = stream();
      return expect(a.last()).toEmit([
        {
          error: 5
        }, {
          error: 6
        }, 3, '<end>'
      ], function() {
        return send(a, [
          1, {
            error: 5
          }, {
            error: 6
          }, 2, 3, '<end>'
        ]);
      });
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      return expect(prop().last()).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.last()).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      expect(send(prop(), ['<end>']).last()).toEmit(['<end:current>']);
      return expect(send(prop(), [1, '<end>']).last()).toEmit([
        {
          current: 1
        }, '<end:current>'
      ]);
    });
    return it('should handle events and current', function() {
      var a;
      a = send(prop(), [1]);
      expect(a.last()).toEmit([
        {
          error: 5
        }, 1, '<end>'
      ], function() {
        return send(a, [
          {
            error: 5
          }, '<end>'
        ]);
      });
      a = send(prop(), [
        {
          error: 0
        }
      ]);
      return expect(a.last()).toEmit([
        {
          currentError: 0
        }, {
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



},{"../test-helpers.coffee":107}],70:[function(require,module,exports){
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



},{"../../dist/kefir":1}],71:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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
      a = send(prop(), [1]);
      expect(a.mapErrors(function(x) {
        return x * 2;
      })).toEmit([
        {
          current: 1
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
      a = send(prop(), [
        {
          error: -1
        }
      ]);
      return expect(a.mapErrors(function(x) {
        return x * 2;
      })).toEmit([
        {
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



},{"../test-helpers.coffee":107}],72:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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
    it('should handle events', function() {
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
    return it('should work with default `fn`', function() {
      var a;
      a = stream();
      return expect(a.map()).toEmit([
        1, {
          error: 5
        }, 2, '<end>'
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
      a = send(prop(), [1]);
      expect(a.map(function(x) {
        return x * 2;
      })).toEmit([
        {
          current: 2
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
      a = send(prop(), [
        {
          error: 0
        }
      ]);
      return expect(a.map(function(x) {
        return x * 2;
      })).toEmit([
        {
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



},{"../test-helpers.coffee":107}],73:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],74:[function(require,module,exports){
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



},{"../../dist/kefir":1}],75:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],76:[function(require,module,exports){
var Kefir, activate, prop, ref, send;

ref = require('../test-helpers.coffee'), prop = ref.prop, send = ref.send, activate = ref.activate, Kefir = ref.Kefir;

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
    it('onEnd subscribers should be called with 0 arguments', function() {
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
    return it('can\'t have current value and error at same time', function() {
      var p;
      p = send(prop(), [0]);
      expect(p).toEmit([
        {
          current: 0
        }
      ]);
      send(p, [
        {
          error: 1
        }
      ]);
      expect(p).toEmit([
        {
          currentError: 1
        }
      ]);
      send(p, [2]);
      return expect(p).toEmit([
        {
          current: 2
        }
      ]);
    });
  });
});



},{"../test-helpers.coffee":107}],77:[function(require,module,exports){
var Kefir, minus, noop, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],78:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

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
      }, '<end:current>'
    ]);
  });
  return it('should work with @AgentME\'s setup', function() {
    var allSpawned, i, j, len, obs, results, step;
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
    results = [];
    for (j = 0, len = allSpawned.length; j < len; j++) {
      obs = allSpawned[j];
      results.push(expect(obs).not.toBeActive());
    }
    return results;
  });
});



},{"../test-helpers.coffee":107}],79:[function(require,module,exports){
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



},{"../../dist/kefir":1}],80:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream,
  slice = [].slice;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

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
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
  it('errors should flow', function() {
    var a, b, c, d;
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
  return it('should work nice for emitating atomic updates', function() {
    var a, b, c;
    a = stream();
    b = a.map(function(x) {
      return x + 2;
    });
    c = a.map(function(x) {
      return x * 2;
    });
    expect(Kefir.sampledBy([b], [c])).toEmit([[3, 2], [4, 4], [5, 6]], function() {
      return send(a, [1, 2, 3]);
    });
    a = stream();
    b = a.map(function(x) {
      return x + 2;
    });
    c = a.map(function(x) {
      return x * 2;
    });
    return expect(b.sampledBy(c, function(x, y) {
      return [x, y];
    })).toEmit([[3, 2], [4, 4], [5, 6]], function() {
      return send(a, [1, 2, 3]);
    });
  });
});



},{"../test-helpers.coffee":107}],81:[function(require,module,exports){
var Kefir, minus, noop, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],82:[function(require,module,exports){
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



},{"../../dist/kefir":1}],83:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],84:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],85:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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
        {
          error: -1
        }
      ]);
      expect(a.skipErrors()).toEmit([2, 3, '<end>'], function() {
        return send(a, [
          2, {
            error: -2
          }, 3, {
            error: -3
          }, '<end>'
        ]);
      });
      a = send(prop(), [1]);
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



},{"../test-helpers.coffee":107}],86:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir, activate = ref.activate, deactivate = ref.deactivate;

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



},{"../test-helpers.coffee":107}],87:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],88:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir, deactivate = ref.deactivate, activate = ref.activate;

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



},{"../test-helpers.coffee":107}],89:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],90:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],91:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],92:[function(require,module,exports){
var Kefir, activate, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, send = ref.send, activate = ref.activate, Kefir = ref.Kefir;

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
    it('should not call subscriber after unsubscribing (from another subscriber)', function() {
      var a, b, log, s;
      log = [];
      a = function() {
        return log.push('a');
      };
      b = function() {
        s.offValue(a);
        return log.push('unsub a');
      };
      s = stream();
      s.onValue(b);
      s.onValue(a);
      send(s, [1]);
      return expect(log).toEqual(['unsub a']);
    });
    return it('should not call subscribers after end (fired from another subscriber)', function() {
      var a, b, log, s;
      log = [];
      a = function() {
        return log.push('a');
      };
      b = function() {
        send(s, ['<end>']);
        return log.push('end fired');
      };
      s = stream();
      s.onValue(b);
      s.onValue(a);
      send(s, [1]);
      return expect(log).toEqual(['end fired']);
    });
  });
});



},{"../test-helpers.coffee":107}],93:[function(require,module,exports){
var Kefir, expectToBehaveAsMap, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

expectToBehaveAsMap = function(gen, mapFn, toObj) {
  var mapEv;
  if (toObj == null) {
    toObj = function(x) {
      return x;
    };
  }
  mapEv = function(events, mapFn) {
    var event, i, len, results;
    results = [];
    for (i = 0, len = events.length; i < len; i++) {
      event = events[i];
      if (event === '<end>') {
        results.push('<end>');
      } else if ((event != null ? event.current : void 0) != null) {
        results.push({
          current: mapFn(event.current)
        });
      } else {
        results.push(mapFn(event));
      }
    }
    return results;
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



},{"../test-helpers.coffee":107}],94:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],95:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],96:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],97:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],98:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],99:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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



},{"../test-helpers.coffee":107}],100:[function(require,module,exports){
(function (global){
var Promise1, Promise2, _global, originalGlobalPromise, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send;

Promise1 = function(cb) {
  var promise;
  promise = {
    type: 1,
    fulfilled: false,
    rejected: false
  };
  cb(function(x) {
    promise.fulfilled = true;
    return promise.result = x;
  }, function(x) {
    promise.rejected = true;
    return promise.result = x;
  });
  return promise;
};

Promise2 = function(cb) {
  var promise;
  promise = {
    type: 2,
    fulfilled: false,
    rejected: false
  };
  cb(function(x) {
    promise.fulfilled = true;
    return promise.result = x;
  }, function(x) {
    promise.rejected = true;
    return promise.result = x;
  });
  return promise;
};

_global = null;

if (typeof global !== 'undefined') {
  _global = global;
}

if (typeof self !== 'undefined') {
  _global = self;
}

originalGlobalPromise = _global.Promise;

describe('toPromise', function() {
  beforeEach(function() {
    return _global.Promise = Promise2;
  });
  afterEach(function() {
    return _global.Promise = originalGlobalPromise;
  });
  describe('stream', function() {
    it('should return a promise', function() {
      expect(stream().toPromise().type).toBe(2);
      return expect(stream().toPromise(Promise1).type).toBe(1);
    });
    it('should not fulfill/reject if obs ends without value', function() {
      var promise;
      promise = send(stream(), ['<end>']).toPromise();
      expect(promise.fulfilled || promise.rejected).toBe(false);
      promise = send(stream(), ['<end>']).toPromise(Promise1);
      return expect(promise.fulfilled || promise.rejected).toBe(false);
    });
    it('should fulfill with latest value on end', function() {
      var a, promise;
      a = stream();
      promise = a.toPromise();
      send(a, [
        1, {
          error: -1
        }, 2, '<end>'
      ]);
      expect(promise.fulfilled).toBe(true);
      expect(promise.result).toBe(2);
      a = stream();
      promise = a.toPromise(Promise1);
      send(a, [1, 2, '<end>']);
      expect(promise.fulfilled).toBe(true);
      return expect(promise.result).toBe(2);
    });
    it('should reject with latest error on end', function() {
      var a, promise;
      a = stream();
      promise = a.toPromise();
      send(a, [
        {
          error: -1
        }, 1, {
          error: -2
        }, '<end>'
      ]);
      expect(promise.rejected).toBe(true);
      expect(promise.result).toBe(-2);
      a = stream();
      promise = a.toPromise(Promise1);
      send(a, [
        {
          error: -1
        }, 1, {
          error: -2
        }, '<end>'
      ]);
      expect(promise.rejected).toBe(true);
      return expect(promise.result).toBe(-2);
    });
    return it('should throw when called without Promise constructor and there is no global promise', function() {
      var e, error;
      _global.Promise = void 0;
      error = null;
      try {
        stream().toPromise();
      } catch (_error) {
        e = _error;
        error = e;
      }
      return expect(error.message).toBe('There isn\'t default Promise, use shim or parameter');
    });
  });
  return describe('property', function() {
    it('should handle currents (resolved)', function() {
      var promise;
      promise = send(prop(), [1, '<end>']).toPromise();
      expect(promise.fulfilled).toBe(true);
      expect(promise.result).toBe(1);
      promise = send(prop(), [1, '<end>']).toPromise(Promise1);
      expect(promise.fulfilled).toBe(true);
      return expect(promise.result).toBe(1);
    });
    return it('should handle currents (rejected)', function() {
      var promise;
      promise = send(prop(), [
        {
          error: -1
        }, '<end>'
      ]).toPromise();
      expect(promise.rejected).toBe(true);
      expect(promise.result).toBe(-1);
      promise = send(prop(), [
        {
          error: -1
        }, '<end>'
      ]).toPromise(Promise1);
      expect(promise.rejected).toBe(true);
      return expect(promise.result).toBe(-1);
    });
  });
});



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../test-helpers.coffee":107}],101:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir, activate = ref.activate, deactivate = ref.deactivate;

describe('toProperty', function() {
  describe('stream', function() {
    it('should return property', function() {
      expect(stream().toProperty(function() {
        return 0;
      })).toBeProperty();
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
      return expect(send(stream(), ['<end>']).toProperty(function() {
        return 0;
      })).toEmit([
        {
          current: 0
        }, '<end:current>'
      ]);
    });
    it('should handle events', function() {
      var a, p;
      a = stream();
      p = a.toProperty(function() {
        return 0;
      });
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
        }, '<end:current>'
      ]);
    });
    it('should call callback on each activation', function() {
      var a, count, p;
      count = 0;
      a = stream();
      p = a.toProperty(function() {
        return count++;
      });
      activate(p);
      expect(count).toBe(1);
      deactivate(p);
      expect(count).toBe(1);
      activate(p);
      return expect(count).toBe(2);
    });
    it('should reset value by getting new from the callback on each activation', function() {
      var a, getCurrent, p;
      getCurrent = function(p) {
        var getter, result;
        result = null;
        getter = function(x) {
          return result = x;
        };
        p.onValue(getter);
        p.offValue(getter);
        return result;
      };
      a = stream();
      p = a.toProperty(function() {
        return 0;
      });
      expect(getCurrent(p)).toBe(0);
      activate(p);
      send(a, [1]);
      expect(getCurrent(p)).toBe(1);
      deactivate(p);
      return expect(getCurrent(p)).toBe(0);
    });
    return it('should throw when called with not a function', function() {
      var e, err;
      err = null;
      try {
        stream().toProperty(1);
      } catch (_error) {
        e = _error;
        err = e;
      }
      return expect(err.message).toBe('You should call toProperty() with a function or no arguments.');
    });
  });
  return describe('property', function() {
    it('should return property', function() {
      expect(prop().toProperty(function() {
        return 0;
      })).toBeProperty();
      return expect(prop().toProperty()).toBeProperty();
    });
    it('should activate/deactivate source', function() {
      var a;
      a = prop();
      return expect(a.toProperty(function() {
        return 0;
      })).toActivate(a);
    });
    it('should be ended if source was ended', function() {
      expect(send(prop(), ['<end>']).toProperty(function() {
        return 0;
      })).toEmit([
        {
          current: 0
        }, '<end:current>'
      ]);
      return expect(send(prop(), [1, '<end>']).toProperty(function() {
        return 0;
      })).toEmit([
        {
          current: 1
        }, '<end:current>'
      ]);
    });
    it('should handle events', function() {
      var a, b;
      a = send(prop(), [1]);
      b = a.toProperty(function() {
        return 0;
      });
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
          currentError: 3
        }, '<end:current>'
      ]);
      a = prop();
      b = a.toProperty(function() {
        return 0;
      });
      expect(b).toEmit([
        {
          current: 0
        }, 2, {
          error: 3
        }, 4, '<end>'
      ], function() {
        return send(a, [
          2, {
            error: 3
          }, 4, '<end>'
        ]);
      });
      return expect(b).toEmit([
        {
          current: 4
        }, '<end:current>'
      ]);
    });
    return it('if original property has no current, and .toProperty called with no arguments, then result should have no current', function() {
      return expect(prop().toProperty()).toEmit([]);
    });
  });
});



},{"../test-helpers.coffee":107}],102:[function(require,module,exports){
var Kefir, comp, noop, prop, ref, send, stream, testWithLib,
  slice = [].slice;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

comp = function() {
  var fns;
  fns = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  return function(x) {
    var f, i, len, ref1;
    ref1 = fns.slice(0).reverse();
    for (i = 0, len = ref1.length; i < len; i++) {
      f = ref1[i];
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
        a = send(prop(), [1]);
        expect(a.transduce(noop)).toEmit([
          {
            current: 1
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
        a = send(prop(), [
          {
            error: 0
          }
        ]);
        return expect(a.transduce(noop)).toEmit([
          {
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



},{"../test-helpers.coffee":107,"transducers-js":33,"transducers.js":34}],103:[function(require,module,exports){
var Kefir, handler, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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
        {
          error: -2
        }
      ]);
      return expect(a.valuesToErrors(handler)).toEmit([
        {
          currentError: -2
        }
      ]);
    });
  });
});



},{"../test-helpers.coffee":107}],104:[function(require,module,exports){
var Kefir, prop, ref, send, stream;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, Kefir = ref.Kefir;

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
      a = send(prop(), [1]);
      expect(a.withHandler(duplicate)).toEmit([
        {
          current: 1
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
      a = send(prop(), [
        {
          error: 0
        }
      ]);
      return expect(a.withHandler(duplicate)).toEmit([
        {
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
      a = send(prop(), [1]);
      expect(a.withHandler(emitEventMirror)).toEmit([
        {
          current: 1
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
      return expect(send(prop(), [
        {
          error: -1
        }
      ]).withHandler(emitEventMirror)).toEmit([
        {
          currentError: -1
        }
      ]);
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



},{"../test-helpers.coffee":107}],105:[function(require,module,exports){
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



},{"../../dist/kefir":1}],106:[function(require,module,exports){
var Kefir, activate, deactivate, prop, ref, send, stream,
  slice = [].slice;

ref = require('../test-helpers.coffee'), stream = ref.stream, prop = ref.prop, send = ref.send, activate = ref.activate, deactivate = ref.deactivate, Kefir = ref.Kefir;

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
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
    a = a0.toProperty(function() {
      return 1;
    });
    b0 = stream();
    b = b0.toProperty(function() {
      return 1;
    });
    c = Kefir.zip([a, b]);
    activate(c1 = c.take(2));
    send(b0, [1, 1]);
    send(a0, [1]);
    deactivate(c1);
    activate(c.take(1));
    return expect(b).not.toBeActive();
  });
});



},{"../test-helpers.coffee":107}],107:[function(require,module,exports){
var Kefir, _activateHelper, logItem, sinon,
  slice = [].slice;

Kefir = require("../dist/kefir");

sinon = require('sinon');

Kefir.DEPRECATION_WARNINGS = false;

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
  var event, i, len;
  for (i = 0, len = events.length; i < len; i++) {
    event = events[i];
    if (event === '<end>') {
      obs._emitEnd();
    }
    if (typeof event === 'object' && 'error' in event) {
      obs._emitError(event.error);
    } else {
      obs._emitValue(event);
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
      var log, ref, unwatch;
      ref = exports.watch(this.actual), log = ref.log, unwatch = ref.unwatch;
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
      var expectedLog, log, ref, unwatch;
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
      ref = exports.watch(this.actual), log = ref.log, unwatch = ref.unwatch;
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
      obss = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
        var condition, i, j, len, len1;
        if (correctResults[test] === true) {
          for (i = 0, len = conditions.length; i < len; i++) {
            condition = conditions[i];
            if (!condition) {
              tests[test] = false;
              return;
            }
          }
        } else {
          for (j = 0, len1 = conditions.length; j < len1; j++) {
            condition = conditions[j];
            if (condition) {
              return;
            }
          }
          return tests[test] = false;
        }
      };
      check("some activated at start", (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = obss.length; i < len; i++) {
          obs = obss[i];
          results.push(!obs._active);
        }
        return results;
      })());
      exports.activate(this.actual);
      check("some " + notNotStr + "activated", (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = obss.length; i < len; i++) {
          obs = obss[i];
          results.push(obs._active);
        }
        return results;
      })());
      exports.deactivate(this.actual);
      check("some " + notNotStr + "deactivated", (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = obss.length; i < len; i++) {
          obs = obss[i];
          results.push(!obs._active);
        }
        return results;
      })());
      exports.activate(this.actual);
      check("some " + notNotStr + "activated at second try", (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = obss.length; i < len; i++) {
          obs = obss[i];
          results.push(obs._active);
        }
        return results;
      })());
      exports.deactivate(this.actual);
      check("some " + notNotStr + "deactivated at second try", (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = obss.length; i < len; i++) {
          obs = obss[i];
          results.push(!obs._active);
        }
        return results;
      })());
      this.message = function() {
        var failedTest, name, obssNames;
        failedTest = ((function() {
          var results;
          results = [];
          for (name in tests) {
            if (tests[name] !== correctResults[name]) {
              results.push(name);
            }
          }
          return results;
        })()).join(', ');
        obssNames = ((function() {
          var i, len, results;
          results = [];
          for (i = 0, len = obss.length; i < len; i++) {
            obs = obss[i];
            results.push(obs.toString());
          }
          return results;
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



},{"../dist/kefir":1,"sinon":6}]},{},[35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106]);
