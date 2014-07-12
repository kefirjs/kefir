

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
