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
  this.__active = false;
  this.__current = {value: NOTHING, error: NOTHING, end: NOTHING};
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
  },


  __send: function(type, x) {
    if (!this.has('end')) {
      this.__current[type] = x;
      this.__subscribers.call(type, [x]);
      if (type === 'end') {
        this.__clear();
      } else {
        this.__subscribers.call('both', [type, x]);
      }
    }
  },


  on: function(type, fnMeta) {
    if (!this.has('end')) {
      this.__subscribers.add(type, fnMeta);
      if (type !== 'end') {
        this.__setActive(true);
      }
    }
    return this;
  },
  off: function(type, fnMeta) {
    if (!this.has('end')) {
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
    return (type === 'end' || type === 'value' || type === 'error') && this.__current[type] !== NOTHING;
  },
  get: function(type, fallback) {
    if (this.has(type)) {
      return this.__current[type];
    } else {
      return fallback;
    }
  },


  isActive: function() {  return this.__active  },


  toString: function() {  return '[' + this.__name + ']'  }

});





// Log

Property.prototype.log = function(name) {
  if (name == null) {
    name = this.toString();
  }
  this.watch('both', function(type, x, isInitial) {
    console.log(name, '<' + type + (isInitial ? ':current' : '') + '>', x);
  });
  this.watch('end', function(_, isInitial) {
    console.log(name, '<end' + (isInitial ? ':current' : '') + '>');
  });
  return this;
}
