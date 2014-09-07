

var Kefir = {};




// Fn

function _Fn(fnMeta, length) {
  this.context = (fnMeta[1] == null) ? null : fnMeta[1];
  this.fn = getFn(fnMeta[0], this.context);
  this.args = rest(fnMeta, 2, []);
  this.invoke = bind(this.fn, this.context, this.args, length);
}

_Fn.prototype.apply = function(args) {
  return apply(this.invoke, null, args);
}

_Fn.prototype.applyWithContext = function(context, args) {
  if (this.context === null) {
    if (this.args.length === 0) {
      return apply(this.fn, context, args);
    } else {
      return apply(this.fn, context, concat(this.args, args));
    }
  } else {
    return this.apply(args);
  }
}

function Fn(fnMeta, length) {
  if (fnMeta instanceof _Fn) {
    return fnMeta;
  } else {
    if (length == null) {
      length = 100;
    }
    if (isFn(fnMeta)) {
      return new _Fn([fnMeta], length);
    } else {
      if (isArrayLike(fnMeta)) {
        return new _Fn(fnMeta, length);
      } else {
        throw new Error('can\'t convert to Fn ' + fnMeta);
      }
    }
  }
}

Fn.isEqual = function(a, b) {
  if (a === b) {
    return true;
  }
  a = Fn(a, null, true);
  b = Fn(b, null, true);
  return a.fn === b.fn &&
    a.context === b.context &&
    isEqualArrays(a.args, b.args);
}

Kefir.Fn = Fn;





// Subscribers

function Subscribers() {
  this.value = [];
  this.end = [];
  this.any = [];
  this.total = 0;
}

extend(Subscribers.prototype, {
  add: function(type, fn) {
    var length = (type === 'end' ? 0 : 1);
    this[type].push(Fn(fn, length, true));
    this.total++;
  },
  remove: function(type, fn) {
    var subs = this[type]
      , length = subs.length
      , i;
    fn = Fn(fn);
    for (i = 0; i < length; i++) {
      if (Fn.isEqual(subs[i], fn)) {
        subs.splice(i, 1);
        this.total--;
        return;
      }
    }
  },
  call: function(type, x) {
    var subs = this[type]
      , length = subs.length
      , i;
    if (length !== 0) {
      if (length === 1) {
        if (type === 'end') {
          subs[0].invoke();
        } else {
          subs[0].invoke(x);
        }
      } else {
        subs = cloneArray(subs);
        for (i = 0; i < length; i++) {
          if (type === 'end') {
            subs[i].invoke();
          } else {
            subs[i].invoke(x);
          }
        }
      }
    }
  },
  isEmpty: function() {
    return this.total === 0;
  }
});





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
      this._subscribers.call(type, x);
      this._subscribers.call('any', {type: type, value: x, current: !!isCurrent});
      if (type === 'end') {  this._clear()  }
    }
  },

  _callWithCurrent: function(fnType, fn, valueType, value) {
    fn = Fn(fn);
    if (fnType === valueType) {
      if (fnType === 'value') {
        fn.invoke(value);
      } else {
        fn.invoke();
      }
    } else if (fnType === 'any') {
      fn.invoke({type: valueType, value: value, current: true});
    }
  },

  on: function(type, fn) {
    if (this._alive) {
      this._subscribers.add(type, fn);
      this._setActive(true);
    } else {
      this._callWithCurrent(type, fn, 'end');
    }
    return this;
  },

  off: function(type, fn) {
    if (this._alive) {
      this._subscribers.remove(type, fn);
      if (this._subscribers.isEmpty()) {
        this._setActive(false);
      }
    }
    return this;
  },

  onValue:  function(fn) {  this.on('value', fn)   },
  onEnd:    function(fn) {  this.on('end', fn)     },
  onAny:    function(fn) {  this.on('any', fn)     },

  offValue: function(fn) {  this.off('value', fn)  },
  offEnd:   function(fn) {  this.off('end', fn)    },
  offAny:   function(fn) {  this.off('any', fn)    }

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
        this._subscribers.call(type, x);
        this._subscribers.call('any', {type: type, value: x, current: false});
      }
      if (type === 'value') {  this._current = x  }
      if (type === 'end') {  this._clear()  }
    }
  },

  on: function(type, fn) {
    if (this._alive) {
      this._subscribers.add(type, fn);
      this._setActive(true);
    }
    if (this._current !== NOTHING) {
      this._callWithCurrent(type, fn, 'value', this._current);
    }
    if (!this._alive) {
      this._callWithCurrent(type, fn, 'end');
    }
    return this;
  }

});






// Log

function logCb(name, event) {
  var typeStr = '<' + event.type + (event.current ? ':current' : '') + '>';
  if (event.type === 'value') {
    console.log(name, typeStr, event.value);
  } else {
    console.log(name, typeStr);
  }
}

Observable.prototype.log = function(name) {
  this.onAny([logCb, null, name || this.toString()]);
  return this;
}

Observable.prototype.offLog = function(name) {
  this.offAny([logCb, null, name || this.toString()]);
  return this;
}
