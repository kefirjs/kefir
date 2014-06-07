var Kefir = {};



// Special values

var NOTHING = Kefir.NOTHING = ['<nothing>'];
var END = Kefir.END = ['<end>'];
var NO_MORE = Kefir.NO_MORE = ['<no more>'];

var BunchOfValues = function(values) {
  this.values = values;
}
Kefir.bunch = function() {
  return new BunchOfValues(agrsToArray(arguments));
}

var KefirError = function(error) {
  this.error = error;
}
Kefir.error = function(error) {
  return new KefirError(error);
}




// Callable

function Callable(fnMeta) {
  if (isFn(fnMeta) || (fnMeta instanceof Callable)) {
    return fnMeta;
  }
  if (fnMeta && fnMeta.length !== null) {
    if (fnMeta.length === 0) {
      throw new Error('can\'t convert to Callable ' + fnMeta);
    }
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


function callFast(fn, context, args) {
  if (context != null) {
    if (!args || args.length === 0) {
      return fn.call(context);
    } else {
      return fn.apply(context, args);
    }
  } else {
    if (!args || args.length === 0) {
      return fn();
    } else if (args.length === 1) {
      return fn(args[0]);
    } else if (args.length === 2) {
      return fn(args[0], args[1]);
    } else if (args.length === 3) {
      return fn(args[0], args[1], args[2]);
    }
    return fn.apply(null, args);
  }
}

Callable.call = function(callable, args) {
  if (isFn(callable)) {
    return callFast(callable, null, args);
  } else if (callable instanceof Callable) {
    if (callable.args) {
      if (args) {
        args = callable.args.concat(toArray(args));
      } else {
        args = callable.args;
      }
    }
    return callFast(callable.fn, callable.context, args);
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







// Observable

var Observable = Kefir.Observable = function Observable(onFirstIn, onLastOut) {

  // __onFirstIn, __onLastOut can also be added to prototype of child classes
  if (isFn(onFirstIn)) {
    this.__onFirstIn = onFirstIn;
  }
  if (isFn(onLastOut)) {
    this.__onLastOut = onLastOut;
  }

  this.__subscribers = {};

  this.alive = true;
  this.active = false;

}

inherit(Observable, Object, {

  __ClassName: 'Observable',

  toString: function() {
    return '[' + this.__ClassName + (this.__objName ? (' | ' + this.__objName) : '') + ']';
  },

  __onFirstIn: noop,
  __onLastOut: noop,

  __addSubscriber: function(type, fnMeta) {
    if (!this.__subscribers[type]) {
      this.__subscribers[type] = [];
    }
    this.__subscribers[type].push(new Callable(fnMeta));
  },

  __removeSubscriber: function(type, fnMeta) {
    if (this.__subscribers[type]) {
      var callable = new Callable(fnMeta);
      for (var i = 0; i < this.__subscribers[type].length; i++) {
        if (Callable.isEqual(this.__subscribers[type][i], callable)) {
          this.__subscribers[type].splice(i, 1);
          return;
        }
      }
    }
  },

  __on: function(type, fnMeta) {
    if (this.alive) {
      this.__addSubscriber(type, fnMeta);
      if (!this.active && type !== 'end') {
        this.active = true;
        this.__onFirstIn();
      }
    } else if (type === 'end') {
      Callable.call(fnMeta);
    }
  },
  __off: function(type, fnMeta) {
    if (this.alive) {
      this.__removeSubscriber(type, fnMeta);
      if (this.active && type !== 'end' && !this.__hasSubscribers()) {
        this.active = false;
        this.__onLastOut();
      }
    }
  },
  __send: function(type, x) {
    var i, subscribers;
    if (this.alive) {
      if (type === 'end') {
        if (this.__subscribers.end) {
          subscribers = this.__subscribers.end.slice(0);
          for (i = 0; i < subscribers.length; i++) {
            Callable.call(subscribers[i]);
          }
        }
        this.__clear();
      } else if (this.active && this.__subscribers[type]) {
        subscribers = this.__subscribers[type].slice(0);
        for (i = 0; i < subscribers.length; i++) {
          if (Callable.call(subscribers[i], [x]) === NO_MORE) {
            this.__off(type, subscribers[i]);
          }
        }
      }
    }
  },
  __hasSubscribers: function() {
    return (this.__subscribers.value != null && this.__subscribers.value.length > 0) ||
      (this.__subscribers.error != null && this.__subscribers.error.length > 0);
  },
  __clear: function() {
    if (this.active) {
      this.active = false;
      this.__onLastOut();
    }
    if (own(this, '__onFirstIn')) {
      this.__onFirstIn = null;
    }
    if (own(this, '__onLastOut')) {
      this.__onLastOut = null;
    }
    this.__subscribers = null;
    this.alive = false;
  },


  __sendValue: function(x) {
    this.__send('value', x);
    return this;
  },
  __sendError: function(x) {
    this.__send('error', x);
    return this;
  },
  __sendEnd: function() {
    this.__send('end');
    return this;
  },
  __sendAny: function(x) {
    if (x === NOTHING) {  return this  }
    if (x === END) {  this.__sendEnd(); return this  }
    if (x instanceof KefirError) {  this.__sendError(x.error); return this  }
    if (x instanceof BunchOfValues) {
      for (var i = 0; i < x.values.length; i++) {
        this.__sendAny(x.values[i]);
      }
      return this;
    }
    this.__sendValue(x);
    return this;
  },


  onValue: function() {
    this.__on('value', arguments);
    return this;
  },
  offValue: function() {
    this.__off('value', arguments);
    return this;
  },
  onError: function() {
    this.__on('error', arguments);
    return this;
  },
  offError: function() {
    this.__off('error', arguments);
    return this;
  },
  onEnd: function() {
    this.__on('end', arguments);
    return this;
  },
  offEnd: function() {
    this.__off('end', arguments);
    return this;
  },

  // for Property
  onNewValue: function() {
    return this.onValue.apply(this, arguments);
  },

  isEnded: function() {
    return !this.alive;
  }


})




// Stream

var Stream = Kefir.Stream = function Stream() {
  Observable.apply(this, arguments);
}

inherit(Stream, Observable, {
  __ClassName: 'Stream'
})




// Property

var Property = Kefir.Property = function Property(onFirstIn, onLastOut, initial) {
  Observable.call(this, onFirstIn, onLastOut);
  this.__cached = isUndefined(initial) ? NOTHING : initial;
}

inherit(Property, Observable, {

  __ClassName: 'Property',

  hasValue: function() {
    return this.__cached !== NOTHING;
  },
  getValue: function() {
    return this.__cached;
  },

  __sendValue: function(x) {
    if (this.alive) {
      this.__cached = x;
    }
    Observable.prototype.__sendValue.call(this, x);
  },
  onNewValue: function() {
    this.__on('value', arguments);
    return this;
  },
  onValue: function() {
    if (this.hasValue()) {
      Callable.call(arguments, [this.__cached]);
    }
    return this.onNewValue.apply(this, arguments);
  }

})



// Log

var logHelper = function(name, type, x) {
  console.log(name, type, x);
}

Observable.prototype.log = function(name) {
  if (name == null) {
    name = this.toString();
  }
  this.onValue(logHelper, null, name, '<value>');
  this.onError(logHelper, null, name, '<error>');
  this.onEnd(logHelper, null, name, '<end>');
  return this;
}
