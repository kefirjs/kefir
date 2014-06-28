var Kefir = {};





// Callable

function Callable(fnMeta) {
  if (isFn(fnMeta) || (fnMeta instanceof Callable)) {
    return fnMeta;
  }
  if (fnMeta && fnMeta.length) {
    if (fnMeta.length === 1) {
      if (isFn(fnMeta[0])) {
        return fnMeta[0];
      } else {
        throw new Error('can\'t convert to Callable ' + fnMeta);
      }
    }
    this.fn = getFn(fnMeta[0], fnMeta[1]);
    this.context = fnMeta[1];
    this.args = rest(fnMeta, 2, null);
  } else {
    throw new Error('can\'t convert to Callable ' + fnMeta);
  }
}

Callable.call = function(callable, args) {
  if (isFn(callable)) {
    return call(callable, null, args);
  } else if (callable instanceof Callable) {
    if (callable.args) {
      if (args) {
        args = concat(callable.args, args);
      } else {
        args = callable.args;
      }
    }
    return call(callable.fn, callable.context, args);
  } else {
    return Callable.call(new Callable(callable), args);
  }
}

Callable.isEqual = function(a, b) {
  if (a === b) {
    return true;
  }
  a = new Callable(a);
  b = new Callable(b);
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
    this[type].push(new Callable(fn));
  },
  remove: function(type, fn) {
    var callable = new Callable(fn)
      , subs = this[type]
      , length = subs.length
      , i;
    for (i = 0; i < length; i++) {
      if (Callable.isEqual(subs[i], callable)) {
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
        Callable.call(subs[0], args);
      } else {
        subs = cloneArray(subs);
        for (i = 0; i < length; i++) {
          Callable.call(subs[i], args);
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

  __name: 'Property',


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
      Callable.call(fnMeta);
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
        Callable.call(fnMeta, ['value', this.get('value'), true]);
      }
      if (this.has('error')) {
        Callable.call(fnMeta, ['error', this.get('error'), true]);
      }
    } else {
      if (this.has(type)) {
        Callable.call(fnMeta, [this.get(type), true]);
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
