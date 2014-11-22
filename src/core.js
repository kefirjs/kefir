// Subscribers

function Subscribers() {
  this._items = [];
}

extend(Subscribers, {
  callOne: function(fnData, event) {
    if (fnData.type === ANY) {
      fnData.fn(event);
    } else if (fnData.type === event.type) {
      if (fnData.type === VALUE) {
        fnData.fn(event.value);
      } else {
        fnData.fn();
      }
    }
  },
  callOnce: function(type, fn, event) {
    if (type === ANY) {
      fn(event);
    } else if (type === event.type) {
      if (type === VALUE) {
        fn(event.value);
      } else {
        fn();
      }
    }
  }
});

extend(Subscribers.prototype, {
  add: function(type, fn, _key) {
    this._items = concat(this._items, [{
      type: type,
      fn: fn,
      key: _key || NOTHING
    }]);
  },
  remove: function(type, fn, _key) {
    this._items = removeByPred(this._items, function(fnData) {
      return fnData.type === type && (fnData.key === _key || fnData.fn === fn);
    });
  },
  callAll: function(event) {
    var items = this._items;
    for (var i = 0; i < items.length; i++) {
      Subscribers.callOne(items[i], event);
    }
  },
  isEmpty: function() {
    return this._items.length === 0;
  }
});





// Events

function Event(type, value, current) {
  return {type: type, value: value, current: !!current};
}

var CURRENT_END = Event(END, undefined, true);





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
      if (type === END) {  this._clear()  }
    }
  },

  on: function(type, fn, _key) {
    if (this._alive) {
      this._subscribers.add(type, fn, _key);
      this._setActive(true);
    } else {
      Subscribers.callOnce(type, fn, CURRENT_END);
    }
    return this;
  },

  off: function(type, fn, _key) {
    if (this._alive) {
      this._subscribers.remove(type, fn, _key);
      if (this._subscribers.isEmpty()) {
        this._setActive(false);
      }
    }
    return this;
  },

  onValue:  function(fn, _key) {  return this.on(VALUE, fn, _key)   },
  onEnd:    function(fn, _key) {  return this.on(END, fn, _key)     },
  onAny:    function(fn, _key) {  return this.on(ANY, fn, _key)     },

  offValue: function(fn, _key) {  return this.off(VALUE, fn, _key)  },
  offEnd:   function(fn, _key) {  return this.off(END, fn, _key)    },
  offAny:   function(fn, _key) {  return this.off(ANY, fn, _key)    }

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
      if (type === VALUE) {  this._current = x  }
      if (type === END) {  this._clear()  }
    }
  },

  on: function(type, fn, _key) {
    if (this._alive) {
      this._subscribers.add(type, fn, _key);
      this._setActive(true);
    }
    if (this._current !== NOTHING) {
      Subscribers.callOnce(type, fn, Event(VALUE, this._current, true));
    }
    if (!this._alive) {
      Subscribers.callOnce(type, fn, CURRENT_END);
    }
    return this;
  }

});






// Log

Observable.prototype.log = function(name) {
  name = name || this.toString();
  this.onAny(function(event) {
    var typeStr = '<' + event.type + (event.current ? ':current' : '') + '>';
    if (event.type === VALUE) {
      console.log(name, typeStr, event.value);
    } else {
      console.log(name, typeStr);
    }
  }, '__logKey__' + name);
  return this;
}

Observable.prototype.offLog = function(name) {
  name = name || this.toString();
  this.offAny(null, '__logKey__' + name);
  return this;
}
