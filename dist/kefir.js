/*! kefir - 0.1.12
 *  https://github.com/pozadi/kefir
 */
;(function(global){
  "use strict";

var NOTHING = ['<nothing>'];

function id(x) {return x}

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

function extend(/*target, mixin1, mixin2...*/) {
  var length = arguments.length
    , result, i, prop;
  if (length === 1) {
    return arguments[0];
  }
  result = arguments[0];
  for (i = 1; i < length; i++) {
    for (prop in arguments[i]) {
      if(own(arguments[i], prop)) {
        result[prop] = arguments[i][prop];
      }
    }
  }
  return result;
}

function inherit(Child, Parent/*[, mixin1, mixin2, ...]*/) {
  var length = arguments.length
    , i;
  Child.prototype = createObj(Parent.prototype);
  Child.prototype.constructor = Child;
  for (i = 2; i < length; i++) {
    extend(Child.prototype, arguments[i]);
  }
  return Child;
}

function agrsToArray(args) {
  if (args.length === 1 && isArray(args[0])) {
    return args[0];
  }
  return toArray(args);
}

function getFn(fn, context) {
  if (isFn(fn)) {
    return fn;
  } else {
    if (context == null || !isFn(context[fn])) {
      throw new Error('not a function: ' + fn + ' in ' + context);
    } else {
      return context[fn];
    }
  }
}

function call(fn, context, args) {
  if (context != null) {
    if (!args || args.length === 0) {
      return fn.call(context);
    } else {
      return fn.apply(context, args);
    }
  } else {
    if (!args || args.length === 0) {
      return fn();
    }
    switch (args.length) {
      case 1: return fn(args[0]);
      case 2: return fn(args[0], args[1]);
      case 3: return fn(args[0], args[1], args[2]);
    }
    return fn.apply(null, args);
  }
}

function concat(a, b) {
  var result = new Array(a.length + b.length)
    , j = 0
    , length, i;
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

function cloneArray(input) {
  var length = input.length
    , sliced = new Array(length)
    , i;
  for (i = 0; i < length; i++) {
    sliced[i] = input[i];
  }
  return sliced;
}

function rest(arr, start, onEmpty) {
  if (arr.length > start) {
    return Array.prototype.slice.call(arr, start);
  }
  return onEmpty;
}

function toArray(arrayLike) {
  if (isArray(arrayLike)) {
    return arrayLike;
  } else {
    return cloneArray(arrayLike);
  }
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

function isArray(xs) {
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

function withInterval(name, mixin) {

  function AnonymousProperty(wait, args) {
    Property.call(this);
    this._wait = wait;
    this._intervalId = null;
    var _this = this;
    this._bindedOnTick = function() {  _this._onTick()  }
    this._init(args);
  }

  inherit(AnonymousProperty, Property, {

    _name: name,

    _init: function(args) {},
    _free: function() {},

    _onTick: function() {},

    _onActivation: function() {
      this._intervalId = setInterval(this._bindedOnTick, this._wait);
    },
    _onDeactivation: function() {
      if (this._intervalId !== null) {
        clearInterval(this._intervalId);
        this._intervalId = null;
      }
    },

    _clear: function() {
      Property.prototype._clear.call(this);
      this._bindedOnTick = null;
      this._free();
    }

  }, mixin);

  Kefir[name] = function(wait) {
    return new AnonymousProperty(wait, rest(arguments, 1, []));
  }
}

function getValueAll(properties) {
  var result = new Array(properties.length);
  for (var i = 0; i < properties.length; i++) {
    if (properties[i].has('value')) {
      result[i] = properties[i].get('value');
    } else {
      return null;
    }
  }
  return result;
}



function withMultSource(name, mixin, noMethod) {

  function AnonymousProperty(args) {
    Property.call(this);
    this._multSubscriber = new MultSubscriber([this._handleAny, this])
    this._init(args);
  }

  inherit(AnonymousProperty, Property, {

    _name: name,

    _init: function(args) {},
    _free: function() {},
    _onActivationHook: function() {},
    _onPreActivationHook: function() {},
    _onDeactivationHook: function() {},

    _handleValue: function(x, isCurrent) {  this._send('value', x)  },
    _handleError: function(x, isCurrent) {  this._send('error', x)  },
    _handleEnd: function(x, isCurrent) {},

    _handleAny: function(type, x, isCurrent) {
      switch (type) {
        case 'value': this._handleValue(x, isCurrent); break;
        case 'error': this._handleError(x, isCurrent); break;
        case 'end': this._handleEnd(x, isCurrent); break;
      }
    },

    _onActivation: function() {
      this._onPreActivationHook();
      this._multSubscriber.start();
      this._onActivationHook();
    },
    _onDeactivation: function() {
      this._multSubscriber.stop();
      this._onDeactivationHook();
    },

    _clear: function() {
      Property.prototype._clear.call(this);
      this._multSubscriber.clear();
      this._multSubscriber = null;
      this._free();
    }

  }, mixin);

  if (!noMethod) {
    Kefir[name] = function() {
      return new AnonymousProperty(arguments);
    }
  }

  return AnonymousProperty;
}





function MultSubscriber(listener) {
  this.listener = new Fn(listener);
  this.properties = [];
  this.active = false;
}

extend(MultSubscriber.prototype, {

  start: function() {
    if (!this.active) {
      this.active = true;
      if (this.hasProperties()) {
        var properties = cloneArray(this.properties);
        for (var i = 0; i < properties.length; i++) {
          this.subToProp(properties[i]);
        }
      }
    }
  },
  stop: function() {
    if (this.active) {
      this.active = false;
      for (var i = 0; i < this.properties.length; i++) {
        this.unsubFromProp(this.properties[i]);
      }
    }
  },

  subToProp: function(property) {
    if (this.active) {
      property.watch('any', this.listener);
      property.watch('end', [this.remove, this, property]);
    }
  },
  unsubFromProp: function(property) {
    property.off('any', this.listener);
    property.off('end', [this.remove, this, property]);
  },

  addAll: function(properties) {
    for (var i = 0; i < properties.length; i++) {
      this.add(properties[i])
    }
  },
  add: function(property) {
    this.properties.push(property);
    this.subToProp(property);
  },
  remove: function(property) {
    for (var i = 0; i < this.properties.length; i++) {
      if (this.properties[i] === property) {
        this.properties.splice(i, 1);
        this.unsubFromProp(property);
        break;
      }
    }
    if (this.properties.length === 0 && this.onLastRemovedCb) {
      Fn.call(this.onLastRemovedCb);
    }
  },
  removeAll: function(){
    if (this.hasProperties()) {
      for (var i = 0; i < this.properties.length; i++) {
        this.unsubFromProp(this.properties[i]);
      }
      this.properties = [];
      if (this.onLastRemovedCb) {
        Fn.call(this.onLastRemovedCb);
      }
    }
  },

  onLastRemoved: function(fn) {
    this.onLastRemovedCb = new Fn(fn);
    if (!this.hasProperties()) {
      Fn.call(this.onLastRemovedCb);
    }
  },
  offLastRemoved: function() {
    this.onLastRemovedCb = null;
  },
  hasProperties: function() {
    return this.properties.length > 0;
  },

  clear: function() {
    this.active = false;
    this.offLastRemoved();
    this.removeAll();
  }

});

function withOneSource(name, mixin) {

  function AnonymousProperty(source, args) {
    Property.call(this);
    this._source = source;
    this._init(args);
  }

  inherit(AnonymousProperty, Property, {

    _name: name,

    _init: function(args) {},
    _free: function() {},

    _handleValue: function(x, isCurrent) {  this._send('value', x)  },
    _handleError: function(x, isCurrent) {  this._send('error', x)  },
    _handleEnd: function(x, isCurrent) {  this._send('end', x)  },
    _onActivationHook: function() {},
    _onDeactivationHook: function() {},

    _handleAny: function(type, x, isCurrent) {
      switch (type) {
        case 'value': this._handleValue(x, isCurrent); break;
        case 'error': this._handleError(x, isCurrent); break;
        case 'end': this._handleEnd(x, isCurrent); break;
      }
    },

    _onActivation: function() {
      this._source.watch('any', [this._handleAny, this]);
      this._onActivationHook();
    },
    _onDeactivation: function() {
      this._source.off('any', [this._handleAny, this]);
      this._onDeactivationHook();
    },

    _clear: function() {
      Property.prototype._clear.call(this);
      this._source = null;
      this._free();
    }

  }, mixin);

  Property.prototype[name] = function() {
    return new AnonymousProperty(this, arguments);
  }
}



var Kefir = {};





// Fn

function Fn(fnMeta) {
  if (isFn(fnMeta) || (fnMeta instanceof Fn)) {
    return fnMeta;
  }
  if (fnMeta && fnMeta.length) {
    if (fnMeta.length === 1) {
      if (isFn(fnMeta[0])) {
        return fnMeta[0];
      } else {
        throw new Error('can\'t convert to Fn ' + fnMeta);
      }
    }
    this.fn = getFn(fnMeta[0], fnMeta[1]);
    this.context = fnMeta[1];
    this.args = rest(fnMeta, 2, null);
  } else {
    throw new Error('can\'t convert to Fn ' + fnMeta);
  }
}
Kefir.Fn = Fn;

Fn.call = function(callable, args) {
  if (isFn(callable)) {
    return call(callable, null, args);
  } else if (callable instanceof Fn) {
    if (callable.args) {
      if (args) {
        args = concat(callable.args, args);
      } else {
        args = callable.args;
      }
    }
    return call(callable.fn, callable.context, args);
  } else {
    return Fn.call(new Fn(callable), args);
  }
}

Fn.isEqual = function(a, b) {
  if (a === b) {
    return true;
  }
  a = new Fn(a);
  b = new Fn(b);
  if (isFn(a) || isFn(b)) {
    return a === b;
  }
  return a.fn === b.fn &&
    a.context === b.context &&
    isEqualArrays(a.args, b.args);
}




// Subscribers

function Subscribers() {
  this.value = [];
  this.error = [];
  this.end = [];
  this.any = [];
  this.total = 0;
}

extend(Subscribers.prototype, {
  add: function(type, fn) {
    this[type].push(new Fn(fn));
    this.total++;
  },
  remove: function(type, fn) {
    var callable = new Fn(fn)
      , subs = this[type]
      , length = subs.length
      , i;
    for (i = 0; i < length; i++) {
      if (Fn.isEqual(subs[i], callable)) {
        subs.splice(i, 1);
        this.total--;
        return;
      }
    }
  },
  call: function(type, args) {
    var subs = this[type]
      , length = subs.length
      , i;
    if (length !== 0) {
      if (length === 1) {
        Fn.call(subs[0], args);
      } else {
        subs = cloneArray(subs);
        for (i = 0; i < length; i++) {
          Fn.call(subs[i], args);
        }
      }
    }
  },
  isEmpty: function() {
    return this.total === 0;
  }
});





// Property

function Property() {
  this._subscribers = new Subscribers();
  this._active = false;
  this._current = {value: NOTHING, error: NOTHING, end: NOTHING};
}
Kefir.Property = Property;


extend(Property.prototype, {

  _name: 'property',


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
    this._subscribers = null;
  },


  _send: function(type, x) {
    if (!this.has('end')) {
      this._current[type] = x;
      this._subscribers.call(type, [x, false]);
      this._subscribers.call('any', [type, x, false]);
      if (type === 'end') {
        this._clear();
      }
    }
  },


  on: function(type, fnMeta) {
    if (!this.has('end')) {
      this._setActive(true);
      if (!this.has('end')) {
        this._subscribers.add(type, fnMeta);
      }
    }
    return this;
  },
  off: function(type, fnMeta) {
    if (!this.has('end')) {
      this._subscribers.remove(type, fnMeta);
      if (this._subscribers.isEmpty()) {
        this._setActive(false);
      }
    }
    return this;
  },



  watch: function(type, fnMeta) {
    this.on(type, fnMeta);
    if (type === 'any') {
      if (this.has('value')) {
        Fn.call(fnMeta, ['value', this.get('value'), true]);
      }
      if (this.has('error')) {
        Fn.call(fnMeta, ['error', this.get('error'), true]);
      }
      if (this.has('end')) {
        Fn.call(fnMeta, ['end', this.get('end'), true]);
      }
    } else {
      if (this.has(type)) {
        Fn.call(fnMeta, [this.get(type), true]);
      }
    }
    return this;
  },
  has: function(type) {
    return (type === 'end' || type === 'value' || type === 'error') && this._current[type] !== NOTHING;
  },
  get: function(type, fallback) {
    if (this.has(type)) {
      return this._current[type];
    } else {
      return fallback;
    }
  },

  isActive: function() {  return this._active  },

  toString: function() {  return '[' + this._name + ']'  }

});





// Log

Property.prototype.log = function(name) {
  if (name == null) {
    name = this.toString();
  }
  this.watch('any', function(type, x, isCurrent) {
    console.log(name, '<' + type + (isCurrent ? ':current' : '') + '>', x);
  });
  return this;
}



// Kefir.withInterval()

withInterval('withInterval', {
  _init: function(args) {
    this._fn = new Fn(args[0]);
    var _this = this;
    this._bindedSend = function(type, x) {  _this._send(type, x)  }
  },
  _free: function() {
    this._fn = null;
    this._bindedSend = null;
  },
  _onTick: function() {
    Fn.call(this._fn, [this._bindedSend]);
  }
});





// Kefir.fromPoll()

withInterval('fromPoll', {
  _init: function(args) {
    this._fn = new Fn(args[0]);
  },
  _free: function() {
    this._fn = null;
  },
  _onTick: function() {
    this._send('value', Fn.call(this._fn));
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
    this._send('value', this._x);
  }
});




// Kefir.sequentially()

withInterval('sequentially', {
  _init: function(args) {
    this._xs = cloneArray(args[0]);
    if (this._xs.length === 0) {
      this._send('end')
    }
  },
  _free: function() {
    this._xs = null;
  },
  _onTick: function() {
    switch (this._xs.length) {
      case 0:
        this._send('end');
        break;
      case 1:
        this._send('value', this._xs[0]);
        this._send('end');
        break;
      default:
        this._send('value', this._xs.shift());
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
      this._send('value', this._xs[this._i]);
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
    this._send('value', this._x);
    this._send('end');
  }
});



// .merge()

withMultSource('merge', {
  _init: function(args) {
    var sources = agrsToArray(args);
    if (sources.length > 0) {
      this._multSubscriber.addAll(sources);
      this._multSubscriber.onLastRemoved([this._send, this, 'end']);
    } else {
      this._send('end');
    }
  }
});

Property.prototype.merge = function(other) {
  return Kefir.merge([this, other]);
}




// .combine()

withMultSource('combine', {
  _init: function(args) {
    this._sources = args[0];
    this._fn = args[1] ? new Fn(args[1]) : null;
    if (this._sources.length > 0) {
      this._multSubscriber.addAll(this._sources);
      this._multSubscriber.onLastRemoved([this._send, this, 'end']);
    } else {
      this._send('end');
    }
  },
  _free: function() {
    this._sources = null;
    this._fn = null;
  },
  _handleValue: function(x) {
    var xs = getValueAll(this._sources);
    if (xs !== null) {
      this._send('value', this._fn ? Fn.call(this._fn, xs) : xs);
    }
  }
});

Property.prototype.combine = function(other, fn) {
  return Kefir.combine([this, other], fn);
}








// .flatMap()

var FlatMapProperty = withMultSource('flatMap', {
  _init: function(args) {
    this._source = args[0];
    this._fn = args[1] ? new Fn(args[1]) : null;
  },
  _free: function() {
    this._source = null;
    this._fn = null;
  },
  _onActivationHook: function() {
    this._source.watch('any', [this._onAny, this]);
    if (!this.has('end')) {
      this._multSubscriber.onLastRemoved([this._endIfSourceEnded, this]);
    }
  },
  _onDeactivationHook: function() {
    this._source.off('any', [this._onAny, this]);
    this._multSubscriber.offLastRemoved();
  },
  _onValue: function(x) {
    this._multSubscriber.add(this._fn ? Fn.call(this._fn, [x]) : x);
  },
  _onError: function(e) {
    this._send('error', e);
  },
  _onAny: function(type, x) {
    switch (type) {
      case 'value': this._onValue(x); break;
      case 'error': this._onError(x); break;
      case 'end': this._endIfNoSubSources(); break;
    }
  },
  _endIfSourceEnded: function() {
    if (this._source.has('end')) {
      this._send('end');
    }
  },
  _endIfNoSubSources: function() {
    if (!this._multSubscriber.hasProperties()) {
      this._send('end');
    }
  }

}, false);

Property.prototype.flatMap = function(fn) {
  return new FlatMapProperty([this, fn]);
};






// .flatMapLatest()

function FlatMapLatestProperty() {
  FlatMapProperty.apply(this, arguments);
}

inherit(FlatMapLatestProperty, FlatMapProperty, {
  _name: 'flatMapLatest',
  _onValue: function(x) {
    this._multSubscriber.removeAll();
    FlatMapProperty.prototype._onValue.call(this, x);
  }
});

Property.prototype.flatMapLatest = function(fn) {
  return new FlatMapLatestProperty([this, fn]);
};






// .pool()

withMultSource('pool', {
  add: function(property) {
    this._multSubscriber.add(property);
  },
  remove: function(property) {
    this._multSubscriber.remove(property);
  }
});








// .sampledBy()

withMultSource('sampledBy', {
  _init: function(args) {
    var sources = args[0]
      , samplers = args[1];
    this._allSources = concat(sources, samplers);
    this._sourcesSubscriber = new MultSubscriber([this._passErrors, this]);
    this._sourcesSubscriber.addAll(sources);
    this._fn = args[2] ? new Fn(args[2]) : null;
    if (samplers.length > 0) {
      this._multSubscriber.addAll(samplers);
      this._multSubscriber.onLastRemoved([this._send, this, 'end']);
    } else {
      this._sourcesSubscriber.start();
      this._send('end');
    }
  },
  _passErrors: function(type, e) {
    if (type === 'error') {
      this._send(type, e);
    }
  },
  _free: function() {
    this._allSources = null;
    this._sourcesSubscriber.clear();
    this._sourcesSubscriber = null;
    this._fn = null;
  },
  _handleValue: function(x) {
    var xs = getValueAll(this._allSources);
    if (xs !== null) {
      this._send('value', this._fn ? Fn.call(this._fn, xs) : xs);
    }
  },
  _onPreActivationHook: function() {
    this._sourcesSubscriber.start();
  },
  _onDeactivationHook: function() {
    this._sourcesSubscriber.stop();
  }
});

Property.prototype.sampledBy = function(sampler, fn) {
  return Kefir.sampledBy([this], [sampler], fn || id);
}



// .withHandler()

withOneSource('withHandler', {
  _init: function(args) {
    var _this = this;
    this._handler = new Fn(args[0]);
    this._bindedSend = function(type, x) {  _this._send(type, x)  }
  },
  _free: function() {
    this._handler = null;
    this._bindedSend = null;
  },
  _handleAny: function(type, x, current) {
    Fn.call(this._handler, [this._bindedSend, type, x, current]);
  }
});





// .skipCurrent()

withOneSource('skipCurrent', {
  _init: function(args) {
    this._type = args[0];
  },
  _handleValue: function(x, current) {
    if (!current || (this._type !== 'value' && this._type != null)) {
      this._send('value', x);
    }
  },
  _handleError: function(x, current) {
    if (!current || (this._type !== 'error' && this._type != null)) {
      this._send('error', x);
    }
  }
});





// .addCurrent()

withOneSource('addCurrent', {
  _init: function(args) {
    this._type = args[0];
    this._x = args[1];
  },
  _onActivationHook: function() {
    this._send(this._type, this._x);
  }
});






// .map(fn)

withOneSource('map', {
  _init: function(args) {
    this._fn = new Fn(args[0]);
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x) {
    this._send('value', Fn.call(this._fn, [x]));
  }
});





// .filter(fn)

withOneSource('filter', {
  _init: function(args) {
    this._fn = new Fn(args[0]);
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x) {
    if (Fn.call(this._fn, [x])) {
      this._send('value', x);
    }
  }
});




// .diff(seed, fn)

withOneSource('diff', {
  _init: function(args) {
    this._prev = args[0];
    this._fn = new Fn(rest(args, 1));
  },
  _free: function() {
    this._prev = null;
    this._fn = null;
  },
  _handleValue: function(x) {
    this._send('value', Fn.call(this._fn, [this._prev, x]));
    this._prev = x;
  }
});




// .takeWhile(fn)

withOneSource('takeWhile', {
  _init: function(args) {
    this._fn = new Fn(args[0]);
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x) {
    if (Fn.call(this._fn, [x])) {
      this._send('value', x);
    } else {
      this._send('end');
    }
  }
});





// .take(n)

withOneSource('take', {
  _init: function(args) {
    this._n = args[0];
    if (this._n <= 0) {
      this._send('end');
    }
  },
  _handleValue: function(x) {
    this._n--;
    this._send('value', x);
    if (this._n === 0) {
      this._send('end');
    }
  }
});





// .skip(n)

withOneSource('skip', {
  _init: function(args) {
    this._n = args[0];
  },
  _handleValue: function(x) {
    if (this._n <= 0) {
      this._send('value', x);
    } else {
      this._n--;
    }
  }
});




// .skipDuplicates([fn])

function strictlyEqual(a, b) {  return a === b  }

withOneSource('skipDuplicates', {
  _init: function(args) {
    if (args.length > 0) {
      this._fn = new Fn(args[0]);
    } else {
      this._fn = strictlyEqual;
    }
    this._prev = NOTHING;
  },
  _free: function() {
    this._fn = null;
    this._prev = null;
  },
  _handleValue: function(x) {
    if (this._prev === NOTHING || !Fn.call(this._fn, [this._prev, x])) {
      this._send('value', x);
    }
    this._prev = x;
  }
});





// .skipWhile(fn)

withOneSource('skipWhile', {
  _init: function(args) {
    this._fn = new Fn(args[0]);
    this._skip = true;
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x) {
    if (!this._skip) {
      this._send('value', x);
      return;
    }
    if (!Fn.call(this._fn, [x])) {
      this._skip = false;
      this._fn = null;
      this._send('value', x);
    }
  }
});





// .scan(seed, fn)

withOneSource('scan', {
  _init: function(args) {
    this._send('value', args[0]);
    this._fn = new Fn(rest(args, 1));
  },
  _free: function(){
    this._fn = null;
  },
  _handleValue: function(x) {
    this._send('value', Fn.call(this._fn, [this.get('value'), x]));
  }
});







// .reduce(seed, fn)

withOneSource('reduce', {
  _init: function(args) {
    this._result = args[0];
    this._fn = new Fn(rest(args, 1));
  },
  _free: function(){
    this._fn = null;
    this._result = null;
  },
  _handleValue: function(x) {
    this._result = Fn.call(this._fn, [this._result, x]);
  },
  _handleEnd: function() {
    this._send('value', this._result);
    this._send('end');
  }
});







// .throttle(wait, {leading, trailing})

withOneSource('throttle', {
  _init: function(args) {
    this._wait = args[0];
    this._leading = get(args[1], 'leading', true);
    this._trailing = get(args[1], 'trailing', true);
    this._trailingCallValue = null;
    this._trailingCallTimeoutId = null;
    this._endAfterTrailingCall = false;
    this._lastCallTime = 0;
    var _this = this;
    this._makeTrailingCallBinded = function() {  _this._makeTrailingCall()  };
  },
  _free: function() {
    this._trailingCallValue = null;
    this._makeTrailingCallBinded = null;
  },
  _handleValue: function(x, current) {
    if (current) {
      this._send('value', x);
      return;
    }
    var curTime = now();
    if (this._lastCallTime === 0 && !this._leading) {
      this._lastCallTime = curTime;
    }
    var remaining = this._wait - (curTime - this._lastCallTime);
    if (remaining <= 0) {
      this._cancelTralingCall();
      this._lastCallTime = curTime;
      this._send('value', x);
    } else if (this._trailing) {
      this._scheduleTralingCall(x, remaining);
    }
  },
  _handleEnd: function() {
    if (this._trailingCallTimeoutId) {
      this._endAfterTrailingCall = true;
    } else {
      this._send('end');
    }
  },
  _scheduleTralingCall: function(value, wait) {
    if (this._trailingCallTimeoutId) {
      this._cancelTralingCall();
    }
    this._trailingCallValue = value;
    this._trailingCallTimeoutId = setTimeout(this._makeTrailingCallBinded, wait);
  },
  _cancelTralingCall: function() {
    if (this._trailingCallTimeoutId !== null) {
      clearTimeout(this._trailingCallTimeoutId);
      this._trailingCallTimeoutId = null;
    }
  },
  _makeTrailingCall: function() {
    this._send('value', this._trailingCallValue);
    this._trailingCallTimeoutId = null;
    this._trailingCallValue = null;
    this._lastCallTime = !this._leading ? 0 : now();
    if (this._endAfterTrailingCall) {
      this._send('end');
    }
  }
});







// .delay()

withOneSource('delay', {
  _init: function(args) {
    this._wait = args[0];
  },
  _handleValue: function(x, current) {
    if (current) {
      this._send('value', x);
      return;
    }
    var _this = this;
    setTimeout(function() {  _this._send('value', x)  }, this._wait);
  },
  _handleEnd: function() {
    var _this = this;
    setTimeout(function() {  _this._send('end')  }, this._wait);
  }
});



// Kefir.fromBinder(fn)

function FromBinderProperty(fn) {
  Property.call(this);
  this._fn = new Fn(fn);
}

inherit(FromBinderProperty, Property, {

  _name: 'fromBinder',

  _onActivation: function() {
    var _this = this;
    this._unsubscribe = Fn.call(this._fn, [
      function(type, x) {  _this._send(type, x)  }
    ]);
  },
  _onDeactivation: function() {
    if (isFn(this._unsubscribe)) {
      this._unsubscribe();
    }
    this._unsubscribe = null;
  },

  _clear: function() {
    Property.prototype._clear.call(this);
    this._fn = null;
  }

})

Kefir.fromBinder = function(fn) {
  return new FromBinderProperty(fn);
}






// Kefir.emitter()

function Emitter() {
  Property.call(this);
}

inherit(Emitter, Property, {
  _name: 'emitter',
  emit: function(type, x) {
    this._send(type, x);
  }
});

Kefir.emitter = function() {
  return new Emitter();
}







// Kefir.empty()

var emptyObj = new Property();
emptyObj._send('end');
emptyObj._name = 'empty';
Kefir.empty = function() {  return emptyObj  }





// Kefir.constant(x)

function ConstantProperty(x) {
  Property.call(this);
  this._send('value', x);
  this._send('end');
}

inherit(ConstantProperty, Property, {
  _name: 'constant'
})

Kefir.constant = function(x) {
  return new ConstantProperty(x);
}




// Kefir.constantError(x)

function ConstantErrorProperty(x) {
  Property.call(this);
  this._send('error', x);
  this._send('end');
}

inherit(ConstantErrorProperty, Property, {
  _name: 'constantError'
})

Kefir.constantError = function(x) {
  return new ConstantErrorProperty(x);
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