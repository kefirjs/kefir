

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
  this._fns = [];
}

extend(Subscribers, {
  prepare: function(type, fn) {
    fn = Fn(fn, type === 'end' ? 0 : 1);
    fn.type = type;
    return fn;
  },
  callOne: function(fn, event) {
    if (fn.type === 'any') {
      fn.invoke(event);
    } else if (fn.type === event.type) {
      if (fn.type === 'value') {
        fn.invoke(event.value);
      } else {
        fn.invoke();
      }
    }
  },
  callOnce: function(type, fn, event) {
    this.callOne(this.prepare(type, fn), event);
  }
});

extend(Subscribers.prototype, {
  _find: function(type, fn) {
    fn = Fn(fn);
    for (var i = 0; i < this._fns.length; i++) {
      var curFn = this._fns[i];
      if (curFn.type === type && Fn.isEqual(curFn, fn)) {
        return i;
      }
    }
    return -1;
  },
  add: function(type, fn) {
    this._fns.push(Subscribers.prepare(type, fn));
  },
  remove: function(type, fn) {
    var i = this._find(type, fn);
    if (i !== -1) {
      this._fns.splice(i, 1);
    }
  },
  callAll: function(event) {
    switch (this._fns.length) {
      case 0: return;
      case 1: Subscribers.callOne(this._fns[0], event); return;
      default:
        var fns = cloneArray(this._fns);
        for (var i = 0; i < fns.length; i++) {
          Subscribers.callOne(fns[i], event);
        }
    }
  },
  isEmpty: function() {
    return this._fns.length === 0;
  }
});





// Events

function Event(type, value, current) {
  return {type: type, value: value, current: !!current};
}

var CURRENT_END = Event('end', undefined, true);





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
      if (type === 'end') {  this._clear()  }
    }
  },

  on: function(type, fn) {
    if (this._alive) {
      this._subscribers.add(type, fn);
      this._setActive(true);
    } else {
      Subscribers.callOnce(type, fn, CURRENT_END);
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
        this._subscribers.callAll(Event(type, x));
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
      Subscribers.callOnce(type, fn, Event('value', this._current, true));
    }
    if (!this._alive) {
      Subscribers.callOnce(type, fn, CURRENT_END);
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
