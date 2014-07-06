/*! kefir - 0.1.12
 *  https://github.com/pozadi/kefir
 */
(function(global){
  "use strict";

var NOTHING = ['<nothing>'];

function noop() {}

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
  this.both = [];
  this.end = [];
}

extend(Subscribers.prototype, {
  add: function(type, fn) {
    this[type].push(new Fn(fn));
  },
  remove: function(type, fn) {
    var callable = new Fn(fn)
      , subs = this[type]
      , length = subs.length
      , i;
    for (i = 0; i < length; i++) {
      if (Fn.isEqual(subs[i], callable)) {
        subs.splice(i, 1);
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
  hasValueOrError: function() {
    return this.value.length > 0 || this.error.length > 0 || this.both.length > 0;
  }
});





// Property

function Property() {
  this.__subscribers = new Subscribers();
  this.__ended = false;
  this.__active = false;
  this.__current = {value: NOTHING, error: NOTHING};
}
Kefir.Property = Property;


extend(Property.prototype, {

  __name: 'property',


  __onActivation: function() {},
  __onDeactivation: function() {},

  __setActive: function(active) {
    if (this.__active !== active) {
      this.__active = active;
      if (active) {
        this.__onActivation();
      } else {
        this.__onDeactivation();
      }
    }
  },


  __clear: function() {
    this.__setActive(false);
    this.__subscribers = null;
    this.__ended = true;
  },


  __send: function(type, x) {
    if (!this.__ended) {
      if (type === 'end') {
        this.__subscribers.call('end', []);
        this.__clear();
      } else {
        this.__current[type] = x;
        this.__subscribers.call(type, [x]);
        this.__subscribers.call('both', [type, x]);
      }
    }
  },


  on: function(type, fnMeta) {
    if (!this.__ended) {
      this.__subscribers.add(type, fnMeta);
      if (type !== 'end') {
        this.__setActive(true);
      }
    } else if (type === 'end') {
      Fn.call(fnMeta);
    }
    return this;
  },
  off: function(type, fnMeta) {
    if (!this.__ended) {
      this.__subscribers.remove(type, fnMeta);
      if (type !== 'end' && !this.__subscribers.hasValueOrError()) {
        this.__setActive(false);
      }
    }
    return this;
  },



  watch: function(type, fnMeta) {
    if (type === 'both') {
      if (this.has('value')) {
        Fn.call(fnMeta, ['value', this.get('value'), true]);
      }
      if (this.has('error')) {
        Fn.call(fnMeta, ['error', this.get('error'), true]);
      }
    } else {
      if (this.has(type)) {
        Fn.call(fnMeta, [this.get(type), true]);
      }
    }
    return this.on(type, fnMeta);
  },
  has: function(type) {
    if (type === 'value' || type === 'error') {
      return this.__current[type] !== NOTHING;
    } else {
      return false;
    }
  },
  get: function(type, fallback) {
    if (this.has(type)) {
      return this.__current[type];
    } else {
      return fallback;
    }
  },



  isEnded: function() {  return this.__ended  },
  isActive: function() {  return this.__active  },


  toString: function() {  return '[' + this.__name + ']'  }

});





// Log

Property.prototype.log = function(name) {
  if (name == null) {
    name = this.toString();
  }
  this.watch('both', function(type, x, isInitial) {
    console.log(name, '<' + type + (isInitial ? ':initial' : '') + '>', x);
  });
  this.on('end', function() {
    console.log(name, '<end>');
  });
  return this;
}



// Kefir.fromBinder(fn)

function FromBinderProperty(fn) {
  Property.call(this);
  this.__fn = new Fn(fn);
}

inherit(FromBinderProperty, Property, {

  __name: 'fromBinder',

  __onActivation: function() {
    var _this = this;
    this.__unsubscribe = Fn.call(this.__fn, [
      function(type, x) {  _this.__send(type, x)  }
    ]);
  },
  __onDeactivation: function() {
    if (isFn(this.__unsubscribe)) {
      this.__unsubscribe();
    }
    this.__unsubscribe = null;
  },

  __clear: function() {
    Property.prototype.__clear.call(this);
    this.__fn = null;
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
  __name: 'emitter',
  emit: function(type, x) {
    this.__send(type, x);
  }
});

Kefir.emitter = function() {
  return new Emitter();
}







// Kefir.empty()

var emptyObj = new Property();
emptyObj.__send('end');
emptyObj.__name = 'empty';
Kefir.empty = function() {  return emptyObj  }





// Kefir.constant(x)

function ConstantProperty(x) {
  Property.call(this);
  this.__send('value', x);
  this.__send('end');
}

inherit(ConstantProperty, Property, {
  __name: 'constant'
})

Kefir.constant = function(x) {
  return new ConstantProperty(x);
}




// Kefir.constantError(x)

function ConstantErrorProperty(x) {
  Property.call(this);
  this.__send('error', x);
  this.__send('end');
}

inherit(ConstantErrorProperty, Property, {
  __name: 'constantError'
})

Kefir.constantError = function(x) {
  return new ConstantErrorProperty(x);
}




// .withHandler()

withOneSource('withHandler', {
  __init: function(args) {
    var _this = this;
    this.__handler = new Fn(args[0]);
    this.__bindedSend = function(type, x) {  _this.__send(type, x)  }
  },
  __free: function() {
    this.__handler = null;
    this.__bindedSend = null;
  },
  __handleValue: function(x, initial) {
    Fn.call(this.__handler, [this.__bindedSend, 'value', x, initial]);
  },
  __handleError: function(e, initial) {
    Fn.call(this.__handler, [this.__bindedSend, 'error', e, initial]);
  },
  __handleEnd: function() {
    Fn.call(this.__handler, [this.__bindedSend, 'end']);
  }
});





// .removeCurrent()

withOneSource('removeCurrent', {
  __init: function(args) {
    this.__type = args[0] || 'both';
  },
  __handleValue: function(x, initial) {
    if (!initial || (this.__type !== 'value' && this.__type !== 'both')) {
      this.__send('value', x);
    }
  },
  __handleError: function(x, initial) {
    if (!initial || (this.__type !== 'error' && this.__type !== 'both')) {
      this.__send('error', x);
    }
  }
});





// .addCurrent()

withOneSource('addCurrent', {
  __init: function(args) {
    this.__type = args[0];
    this.__send(args[0], args[1])
  },
  __handleValue: function(x, initial) {
    if (!initial || (this.__type !== 'value')) {
      this.__send('value', x);
    }
  },
  __handleError: function(x, initial) {
    if (!initial || (this.__type !== 'error')) {
      this.__send('error', x);
    }
  }
});






// .map(fn)

withOneSource('map', {
  __init: function(args) {
    this.__fn = new Fn(args[0]);
  },
  __free: function() {
    this.__fn = null;
  },
  __handleValue: function(x) {
    this.__send('value', Fn.call(this.__fn, [x]));
  }
});





// .filter(fn)

withOneSource('filter', {
  __init: function(args) {
    this.__fn = new Fn(args[0]);
  },
  __free: function() {
    this.__fn = null;
  },
  __handleValue: function(x) {
    if (Fn.call(this.__fn, [x])) {
      this.__send('value', x);
    }
  }
});




// .diff(seed, fn)

withOneSource('diff', {
  __init: function(args) {
    this.__prev = args[0];
    this.__fn = new Fn(rest(args, 1));
  },
  __free: function() {
    this.__prev = null;
    this.__fn = null;
  },
  __handleValue: function(x) {
    this.__send('value', Fn.call(this.__fn, [this.__prev, x]));
    this.__prev = x;
  }
});




// .takeWhile(fn)

withOneSource('takeWhile', {
  __init: function(args) {
    this.__fn = new Fn(args[0]);
  },
  __free: function() {
    this.__fn = null;
  },
  __handleValue: function(x) {
    if (Fn.call(this.__fn, [x])) {
      this.__send('value', x);
    } else {
      this.__send('end');
    }
  }
});





// .take(n)

withOneSource('take', {
  __init: function(args) {
    this.__n = args[0];
    if (this.__n <= 0) {
      this.__send('end');
    }
  },
  __handleValue: function(x) {
    this.__n--;
    this.__send('value', x);
    if (this.__n === 0) {
      this.__send('end');
    }
  }
});





// .skip(n)

withOneSource('skip', {
  __init: function(args) {
    this.__n = args[0];
  },
  __handleValue: function(x) {
    if (this.__n <= 0) {
      this.__send('value', x);
    } else {
      this.__n--;
    }
  }
});




// .skipDuplicates([fn])

function strictlyEqual(a, b) {  return a === b  }

withOneSource('skipDuplicates', {
  __init: function(args) {
    if (args.length > 0) {
      this.__fn = new Fn(args[0]);
    } else {
      this.__fn = strictlyEqual;
    }
    this.__prev = NOTHING;
  },
  __free: function() {
    this.__fn = null;
    this.__prev = null;
  },
  __handleValue: function(x) {
    if (this.__prev === NOTHING || !Fn.call(this.__fn, [this.__prev, x])) {
      this.__send('value', x);
    }
    this.__prev = x;
  }
});





// .skipWhile(fn)

withOneSource('skipWhile', {
  __init: function(args) {
    this.__fn = new Fn(args[0]);
    this.__skip = true;
  },
  __free: function() {
    this.__fn = null;
  },
  __handleValue: function(x) {
    if (!this.__skip) {
      this.__send('value', x);
      return;
    }
    if (!Fn.call(this.__fn, [x])) {
      this.__skip = false;
      this.__fn = null;
      this.__send('value', x);
    }
  }
});





// .scan(seed, fn)

withOneSource('scan', {
  __init: function(args) {
    this.__send('value', args[0]);
    this.__fn = new Fn(rest(args, 1));
  },
  __free: function(){
    this.__fn = null;
  },
  __handleValue: function(x) {
    this.__send('value', Fn.call(this.__fn, [this.get('value'), x]));
  }
});







// .reduce(seed, fn)

withOneSource('reduce', {
  __init: function(args) {
    this.__result = args[0];
    this.__fn = new Fn(rest(args, 1));
  },
  __free: function(){
    this.__fn = null;
    this.__result = null;
  },
  __handleValue: function(x) {
    this.__result = Fn.call(this.__fn, [this.__result, x]);
  },
  __handleEnd: function() {
    this.__send('value', this.__result);
    this.__send('end');
  }
});







// .throttle(wait, {leading, trailing})

withOneSource('throttle', {
  __init: function(args) {
    this.__wait = args[0];
    this.__leading = get(args[1], 'leading', true);
    this.__trailing = get(args[1], 'trailing', true);
    this.__trailingCallValue = null;
    this.__trailingCallTimeoutId = null;
    this.__endAfterTrailingCall = false;
    this.__lastCallTime = 0;
    var _this = this;
    this.__makeTrailingCallBinded = function() {  _this.__makeTrailingCall()  };
  },
  __free: function() {
    this.__trailingCallValue = null;
    this.__makeTrailingCallBinded = null;
  },
  __handleValue: function(x, initial) {
    if (initial) {
      this.__send('value', x);
      return;
    }
    var curTime = now();
    if (this.__lastCallTime === 0 && !this.__leading) {
      this.__lastCallTime = curTime;
    }
    var remaining = this.__wait - (curTime - this.__lastCallTime);
    if (remaining <= 0) {
      this.__cancelTralingCall();
      this.__lastCallTime = curTime;
      this.__send('value', x);
    } else if (this.__trailing) {
      this.__scheduleTralingCall(x, remaining);
    }
  },
  __handleEnd: function() {
    if (this.__trailingCallTimeoutId) {
      this.__endAfterTrailingCall = true;
    } else {
      this.__send('end');
    }
  },
  __scheduleTralingCall: function(value, wait) {
    if (this.__trailingCallTimeoutId) {
      this.__cancelTralingCall();
    }
    this.__trailingCallValue = value;
    this.__trailingCallTimeoutId = setTimeout(this.__makeTrailingCallBinded, wait);
  },
  __cancelTralingCall: function() {
    if (this.__trailingCallTimeoutId !== null) {
      clearTimeout(this.__trailingCallTimeoutId);
      this.__trailingCallTimeoutId = null;
    }
  },
  __makeTrailingCall: function() {
    this.__send('value', this.__trailingCallValue);
    this.__trailingCallTimeoutId = null;
    this.__trailingCallValue = null;
    this.__lastCallTime = !this.__leading ? 0 : now();
    if (this.__endAfterTrailingCall) {
      this.__send('end');
    }
  }
});







// .delay()

withOneSource('delay', {
  __init: function(args) {
    this.__wait = args[0];
  },
  __handleValue: function(x, initial) {
    if (initial) {
      this.__send('value', x);
      return;
    }
    var _this = this;
    setTimeout(function() {  _this.__send('value', x)  }, this.__wait);
  },
  __handleEnd: function() {
    var _this = this;
    setTimeout(function() {  _this.__send('end')  }, this.__wait);
  }
});










/// Utils


function withOneSource(name, mixin) {

  function AnonymousProperty(source, args) {
    Property.call(this);
    this.__source = source;
    this.__init(args);
    if (!this.__ended) {
      this.__source.on('end', [this.__handleEnd, this]);
    }
    if (!this.__ended && this.__source.has('value')) {
      this.__handleValue(this.__source.get('value'), true);
    }
    if (!this.__ended && this.__source.has('error')) {
      this.__handleError(this.__source.get('error'), true);
    }
  }

  inherit(AnonymousProperty, Property, {

    __name: name,

    __init: function(args) {},
    __free: function() {},

    __handleValue: function(x, isInitial) {
      this.__send('value', x);
    },
    __handleError: function(e, isInitial) {
      this.__send('error', e);
    },
    __handleEnd: function() {
      this.__send('end');
    },

    __handleBoth: function(type, x) {
      if (type === 'value') {
        this.__handleValue(x);
      } else {
        this.__handleError(x);
      }
    },

    __onActivation: function() {
      this.__source.on('both', [this.__handleBoth, this]);
    },
    __onDeactivation: function() {
      this.__source.off('both', [this.__handleBoth, this]);
    },

    __clear: function() {
      Property.prototype.__clear.call(this);
      this.__source = null;
      this.__free();
    }

  }, mixin);

  Property.prototype[name] = function() {
    return new AnonymousProperty(this, arguments);
  }
}

// .merge()

withMultSource('merge', {
  __init: function(args) {
    var sources = agrsToArray(args);
    if (sources.length > 0) {
      this.__multSubscriber.addAll(sources);
      this.__multSubscriber.onLastRemoved([this.__send, this, 'end']);
    } else {
      this.__send('end');
    }
  }
});

Property.prototype.merge = function(other) {
  return Kefir.merge([this, other]);
}




// .combine()

withMultSource('combine', {
  __init: function(args) {
    this.__sources = args[0];
    this.__fn = args[1] ? new Fn(args[1]) : null;
    if (this.__sources.length > 0) {
      this.__multSubscriber.addAll(this.__sources);
      this.__multSubscriber.onLastRemoved([this.__send, this, 'end']);
    } else {
      this.__send('end');
    }
  },
  __free: function() {
    this.__sources = null;
    this.__fn = null;
  },
  __handleValue: function(x) {
    if (hasValueAll(this.__sources)) {
      if (this.__fn) {
        this.__send('value', Fn.call(this.__fn, getValueAll(this.__sources)));
      } else {
        this.__send('value', getValueAll(this.__sources));
      }
    }
  }
});

Property.prototype.combine = function(other, fn) {
  return Kefir.combine([this, other], fn);
}








// .flatMap()

var FlatMapProperty = withMultSource('flatMap', {
  __init: function(args) {
    this.__source = args[0];
    this.__fn = args[1] ? new Fn(args[1]) : null;
    this.__multSubscriber.onLastRemoved([this.__endIfSourceEnded, this]);
    this.__source.on('end', [this.__endIfNoSubSources, this]);
    if (this.__source.has('value')) {
      this.__onValue(this.__source.get('value'));
    }
    if (this.__source.has('error')) {
      this.__onError(this.__source.get('error'));
    }
  },
  __free: function() {
    this.__source = null;
    this.__fn = null;
  },
  __onActivationHook: function() {
    this.__source.on('both', [this.__onBoth, this])
  },
  __onDeactivationHook: function() {
    this.__source.off('both', [this.__onBoth, this])
  },
  __onValue: function(x) {
    if (this.__fn) {
      this.__multSubscriber.add(Fn.call(this.__fn, [x]));
    } else {
      this.__multSubscriber.add(x);
    }
  },
  __onError: function(e) {
    this.__send('error', e);
  },
  __onBoth: function(type, x) {
    if (type === 'value') {
      this.__onValue(x);
    } else {
      this.__onError(x);
    }
  },
  __endIfSourceEnded: function() {
    if (this.__source.isEnded()) {
      this.__send('end');
    }
  },
  __endIfNoSubSources: function() {
    if (!this.__multSubscriber.hasProperties()) {
      this.__send('end');
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
  __name: 'flatMapLatest',
  __onValue: function(x) {
    this.__multSubscriber.removeAll();
    FlatMapProperty.prototype.__onValue.call(this, x);
  }
});

Property.prototype.flatMapLatest = function(fn) {
  return new FlatMapLatestProperty([this, fn]);
};






// .pool()

withMultSource('pool', {
  add: function(property) {
    this.__multSubscriber.add(property);
  },
  remove: function(property) {
    this.__multSubscriber.remove(property);
  }
});








// .sampledBy()

withMultSource('sampledBy', {
  __init: function(args) {
    var sources = args[0]
      , samplers = args[1];
    this.__allSources = concat(sources, samplers);
    this.__sourcesSubscriber = new MultSubscriber([this.__passErrors, this]);
    this.__sourcesSubscriber.addAll(sources);
    this.__fn = args[2] ? new Fn(args[2]) : null;
    if (samplers.length > 0) {
      this.__multSubscriber.addAll(samplers);
      this.__multSubscriber.onLastRemoved([this.__send, this, 'end']);
    } else {
      this.__send('end');
    }
  },
  __passErrors: function(type, e) {
    if (type === 'error') {
      this.__send(type, e);
    }
  },
  __free: function() {
    this.__allSources = null;
    this.__sourcesSubscriber.clear();
    this.__sourcesSubscriber = null;
    this.__fn = null;
  },
  __handleValue: function(x) {
    if (hasValueAll(this.__allSources)) {
      if (this.__fn) {
        this.__send('value', Fn.call(this.__fn, getValueAll(this.__allSources)));
      } else {
        this.__send('value', getValueAll(this.__allSources));
      }
    }
  },
  __onActivationHook: function() {
    this.__sourcesSubscriber.start();
  },
  __onDeactivationHook: function() {
    this.__sourcesSubscriber.stop();
  }
});

Property.prototype.sampledBy = function(sampler, fn) {
  return Kefir.sampledBy([this], [sampler], fn || id);
}








/// Utils



function hasValueAll(properties) {
  for (var i = 0; i < properties.length; i++) {
    if (!properties[i].has('value')) {
      return false;
    }
  }
  return true;
}

function getValueAll(properties) {
  var result = new Array(properties.length);
  for (var i = 0; i < properties.length; i++) {
    result[i] = properties[i].get('value');
  }
  return result;
}



function withMultSource(name, mixin, noMethod) {

  function AnonymousProperty(args) {
    Property.call(this);
    this.__multSubscriber = new MultSubscriber([this.__handleBoth, this])
    this.__init(args);
  }

  inherit(AnonymousProperty, Property, {

    __name: name,

    __init: function(args) {},
    __free: function() {},
    __onActivationHook: function() {},
    __onDeactivationHook: function() {},

    __handleValue: function(x, isInitial) {
      this.__send('value', x);
    },
    __handleError: function(e, isInitial) {
      this.__send('error', e);
    },

    __handleBoth: function(type, x, isInitial) {
      if (type === 'value') {
        this.__handleValue(x, isInitial);
      } else {
        this.__handleError(x, isInitial);
      }
    },

    __onActivation: function() {
      this.__multSubscriber.start();
      this.__onActivationHook();
    },
    __onDeactivation: function() {
      this.__multSubscriber.stop();
      this.__onDeactivationHook();
    },

    __clear: function() {
      Property.prototype.__clear.call(this);
      this.__multSubscriber.clear();
      this.__multSubscriber = null;
      this.__free();
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
      for (var i = 0; i < this.properties.length; i++) {
        this.properties[i].on('both', this.listener);
      }
      this.active = true;
    }
  },
  stop: function() {
    if (this.active) {
      for (var i = 0; i < this.properties.length; i++) {
        this.properties[i].off('both', this.listener);
      }
      this.active = false;
    }
  },


  addAll: function(properties) {
    for (var i = 0; i < properties.length; i++) {
      this.add(properties[i])
    }
  },
  add: function(property) {
    this.properties.push(property);
    property.on('end', [this.remove, this, property]);
    if (property.has('value')) {
      Fn.call(this.listener, ['value', property.get('value'), true]);
    }
    if (property.has('error')) {
      Fn.call(this.listener, ['error', property.get('error'), true]);
    }
    if (this.active) {
      property.on('both', this.listener);
    }
  },
  remove: function(property) {
    for (var i = 0; i < this.properties.length; i++) {
      if (this.properties[i] === property) {
        this.properties.splice(i, 1);
        property.off('end', [this.remove, this, property]);
        if (this.active) {
          property.off('both', this.listener);
        }
        break;
      }
    }
    if (this.properties.length === 0 && this.onLastRemovedCb) {
      Fn.call(this.onLastRemovedCb);
    }
  },
  removeAll: function(){
    for (var i = 0; i < this.properties.length; i++) {
      this.properties[i].off('end', [this.remove, this, this.properties[i]]);
      if (this.active) {
        this.properties[i].off('both', this.listener);
      }
    }
    this.properties = [];
    if (this.onLastRemovedCb) {
      Fn.call(this.onLastRemovedCb);
    }
  },

  onLastRemoved: function(fn) {
    this.onLastRemovedCb = new Fn(fn);
  },
  offLastRemoved: function() {
    this.onLastRemovedCb = null;
  },
  hasProperties: function() {
    return this.properties.length > 0;
  },

  clear: function() {
    this.offLastRemoved();
    this.removeAll();
  }

});

// Kefir.withInterval()

withInterval('withInterval', {
  __init: function(args) {
    this.__fn = new Fn(args[0]);
    var _this = this;
    this.__bindedSend = function(type, x) {  _this.__send(type, x)  }
  },
  __free: function() {
    this.__fn = null;
    this.__bindedSend = null;
  },
  __onTick: function() {
    Fn.call(this.__fn, [this.__bindedSend]);
  }
});





// Kefir.fromPoll()

withInterval('fromPoll', {
  __init: function(args) {
    this.__fn = new Fn(args[0]);
  },
  __free: function() {
    this.__fn = null;
  },
  __onTick: function() {
    this.__send('value', Fn.call(this.__fn));
  }
});





// Kefir.interval()

withInterval('interval', {
  __init: function(args) {
    this.__x = args[0];
  },
  __free: function() {
    this.__x = null;
  },
  __onTick: function() {
    this.__send('value', this.__x);
  }
});




// Kefir.sequentially()

withInterval('sequentially', {
  __init: function(args) {
    this.__xs = cloneArray(args[0]);
    if (this.__xs.length === 0) {
      this.__send('end')
    }
  },
  __free: function() {
    this.__xs = null;
  },
  __onTick: function() {
    switch (this.__xs.length) {
      case 0:
        this.__send('end');
        break;
      case 1:
        this.__send('value', this.__xs[0]);
        this.__send('end');
        break;
      default:
        this.__send('value', this.__xs.shift());
    }
  }
});




// Kefir.repeatedly()

withInterval('repeatedly', {
  __init: function(args) {
    this.__xs = cloneArray(args[0]);
    this.__i = -1;
  },
  __onTick: function() {
    if (this.__xs.length > 0) {
      this.__i = (this.__i + 1) % this.__xs.length;
      this.__send('value', this.__xs[this.__i]);
    }
  }
});





// Kefir.later()

withInterval('later', {
  __init: function(args) {
    this.__x = args[0];
  },
  __free: function() {
    this.__x = null;
  },
  __onTick: function() {
    this.__send('value', this.__x);
    this.__send('end');
  }
});









/// Utils

function withInterval(name, mixin) {

  function AnonymousProperty(wait, args) {
    Property.call(this);
    this.__wait = wait;
    this.__intervalId = null;
    var _this = this;
    this.__bindedOnTick = function() {  _this.__onTick()  }
    this.__init(args);
  }

  inherit(AnonymousProperty, Property, {

    __name: name,

    __init: function(args) {},
    __free: function() {},

    __onTick: function() {},

    __onActivation: function() {
      this.__intervalId = setInterval(this.__bindedOnTick, this.__wait);
    },
    __onDeactivation: function() {
      if (this.__intervalId !== null) {
        clearInterval(this.__intervalId);
        this.__intervalId = null;
      }
    },

    __clear: function() {
      Property.prototype.__clear.call(this);
      this.__bindedOnTick = null;
      this.__free();
    }

  }, mixin);

  Kefir[name] = function(wait) {
    return new AnonymousProperty(wait, rest(arguments, 1, []));
  }
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