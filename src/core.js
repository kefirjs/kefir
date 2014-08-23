

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

Fn.call = function(fn, args) {
  if (isFn(fn)) {
    return call(fn, null, args);
  } else if (fn instanceof Fn) {
    if (fn.args) {
      if (args) {
        args = concat(fn.args, args);
      } else {
        args = fn.args;
      }
    }
    return call(fn.fn, fn.context, args);
  } else {
    return Fn.call(new Fn(fn), args);
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
    var subs = this[type]
      , length = subs.length
      , i;
    fn = new Fn(fn);
    for (i = 0; i < length; i++) {
      if (Fn.isEqual(subs[i], fn)) {
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
      if (!(type === 'end' && isCurrent)) {
        this._subscribers.call(type, type === 'value' ? [x] : []);
        this._subscribers.call('any', [{type: type, value: x, current: !!isCurrent}]);
      }
      if (type === 'end') {  this._clear()  }
    }
  },

  _callWithCurrent: function(fnType, fn, valueType, value) {
    if (fnType === valueType) {
      Fn.call(fn, fnType === 'value' ? [value] : []);
    } else if (fnType === 'any') {
      Fn.call(fn, [{type: valueType, value: value, current: true}]);
    }
  },

  on: function(type, fn) {
    if (this._alive) {
      this._subscribers.add(type, fn);
      this._setActive(true);
    }
    if (!this._alive) {
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

  toString: function() {  return '[' + this._name + ']'  },

  onValue:  function(fn) {  this.on('value', fn)   },
  onEnd:    function(fn) {  this.on('end', fn)     },
  onAny:    function(fn) {  this.on('any', fn)     },

  offValue: function(fn) {  this.off('value', fn)  },
  offEnd:   function(fn) {  this.off('end', fn)    },
  offAny:   function(fn) {  this.off('any', fn)    }

});









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
        this._subscribers.call(type, type === 'value' ? [x] : []);
        this._subscribers.call('any', [{type: type, value: x, current: false}]);
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
  var typeStr = '<' + event.type + (event.isCurrent ? ':current' : '') + '>';
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
