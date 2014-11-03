// Subscribers

function Subscribers() {
  this._fns = [];
}

extend(Subscribers, {
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
  callOnce: function(type, fnMeta, event) {
    if (type === 'any') {
      applyFnMeta(fnMeta, [event]);
    } else if (type === event.type) {
      if (type === 'value') {
        applyFnMeta(fnMeta, [event.value]);
      } else {
        applyFnMeta(fnMeta, []);
      }
    }
  }
});

extend(Subscribers.prototype, {
  add: function(type, fn) {
    fn = Fn(fn, type === 'end' ? 0 : 1);
    fn.type = type;
    this._fns = concat(this._fns, [fn]);
  },
  remove: function(type, fn) {
    fn = Fn(fn);
    this._fns = removeByPred(this._fns, function(x) {
      return x.type === type && Fn.isEqual(x, fn);
    });
  },
  callAll: function(event) {
    var fns = this._fns;
    for (var i = 0; i < fns.length; i++) {
      Subscribers.callOne(fns[i], event);
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

  onValue:  function(fn) {  return this.on('value', fn)   },
  onEnd:    function(fn) {  return this.on('end', fn)     },
  onAny:    function(fn) {  return this.on('any', fn)     },

  offValue: function(fn) {  return this.off('value', fn)  },
  offEnd:   function(fn) {  return this.off('end', fn)    },
  offAny:   function(fn) {  return this.off('any', fn)    }

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
