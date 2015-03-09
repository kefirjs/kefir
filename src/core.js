// Dispatcher

function callSubscriber(sType, sFn, event) {
  if (sType === ANY) {
    sFn(event);
  } else if (sType === event.type) {
    if (sType === VALUE || sType === ERROR) {
      sFn(event.value);
    } else {
      sFn();
    }
  }
}

function Dispatcher() {
  this._items = [];
}

extend(Dispatcher.prototype, {
  add: function(type, fn, _key) {
    this._items = concat(this._items, [{
      type: type,
      fn: fn,
      key: _key || null
    }]);
    return this._items.length;
  },
  remove: function(type, fn, _key) {
    var pred = isArray(_key) ?
      function(fnData) {return fnData.type === type && isEqualArrays(fnData.key, _key)} :
      function(fnData) {return fnData.type === type && fnData.fn === fn};
    this._items = removeByPred(this._items, pred);
    return this._items.length;
  },
  callAll: function(event) {
    var items = this._items;
    for (var i = 0; i < items.length; i++) {
      callSubscriber(items[i].type, items[i].fn, event);
    }
  }
});








// Events

function Event(type, value, current) {
  return {type: type, value: value, current: !!current};
}

var CURRENT_END = Event(END, undefined, true);





// Observable

function Observable() {
  this._dispatcher = new Dispatcher();
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
    this._dispatcher = null;
  },

  _send: function(type, x, isCurrent) {
    if (this._alive) {
      this._dispatcher.callAll(Event(type, x, isCurrent));
      if (type === END) {  this._clear()  }
    }
  },

  _on: function(type, fn, _key) {
    if (this._alive) {
      this._dispatcher.add(type, fn, _key);
      this._setActive(true);
    } else {
      callSubscriber(type, fn, CURRENT_END);
    }
    return this;
  },

  _off: function(type, fn, _key) {
    if (this._alive) {
      var count = this._dispatcher.remove(type, fn, _key);
      if (count === 0) {
        this._setActive(false);
      }
    }
    return this;
  },

  onValue:  function(fn, _key) {  return this._on(VALUE, fn, _key)   },
  onError:  function(fn, _key) {  return this._on(ERROR, fn, _key)   },
  onEnd:    function(fn, _key) {  return this._on(END, fn, _key)     },
  onAny:    function(fn, _key) {  return this._on(ANY, fn, _key)     },

  offValue: function(fn, _key) {  return this._off(VALUE, fn, _key)  },
  offError: function(fn, _key) {  return this._off(ERROR, fn, _key)  },
  offEnd:   function(fn, _key) {  return this._off(END, fn, _key)    },
  offAny:   function(fn, _key) {  return this._off(ANY, fn, _key)    }

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
  this._currentError = NOTHING;
}
Kefir.Property = Property;

inherit(Property, Observable, {

  _name: 'property',

  _send: function(type, x, isCurrent) {
    if (this._alive) {
      if (!isCurrent) {
        this._dispatcher.callAll(Event(type, x));
      }
      if (type === VALUE) {  this._current = x  }
      if (type === ERROR) {  this._currentError = x  }
      if (type === END) {  this._clear()  }
    }
  },

  _on: function(type, fn, _key) {
    if (this._alive) {
      this._dispatcher.add(type, fn, _key);
      this._setActive(true);
    }
    if (this._current !== NOTHING) {
      callSubscriber(type, fn, Event(VALUE, this._current, true));
    }
    if (this._currentError !== NOTHING) {
      callSubscriber(type, fn, Event(ERROR, this._currentError, true));
    }
    if (!this._alive) {
      callSubscriber(type, fn, CURRENT_END);
    }
    return this;
  }

});






// Log

Observable.prototype.log = function(name) {
  name = name || this.toString();
  this.onAny(function(event) {
    var typeStr = '<' + event.type + (event.current ? ':current' : '') + '>';
    if (event.type === VALUE || event.type === ERROR) {
      console.log(name, typeStr, event.value);
    } else {
      console.log(name, typeStr);
    }
  }, ['__logKey__', this, name]);
  return this;
}

Observable.prototype.offLog = function(name) {
  name = name || this.toString();
  this.offAny(null, ['__logKey__', this, name]);
  return this;
}
