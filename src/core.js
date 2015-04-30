import {extend, inherit} from './utils/objects';
import {VALUE, ERROR, ANY, END} from './utils/other'
import {concat, removeByPred} from './utils/collections'


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
  add: function(type, fn) {
    this._items = concat(this._items, [{
      type: type,
      fn: fn
    }]);
    return this._items.length;
  },
  remove: function(type, fn) {
    this._items = removeByPred(this._items, function(fnData) {
      return fnData.type === type && fnData.fn === fn;
    });
    return this._items.length;
  },
  dispatch: function(event) {
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

const CURRENT_END = Event(END, undefined, true);





// Observable

export function Observable() {
  this._dispatcher = new Dispatcher();
  this._active = false;
  this._alive = true;
}

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
      this._dispatcher.dispatch(Event(type, x, isCurrent));
      if (type === END) {
        this._clear();
      }
    }
  },

  _on: function(type, fn) {
    if (this._alive) {
      this._dispatcher.add(type, fn);
      this._setActive(true);
    } else {
      callSubscriber(type, fn, CURRENT_END);
    }
    return this;
  },

  _off: function(type, fn) {
    if (this._alive) {
      var count = this._dispatcher.remove(type, fn);
      if (count === 0) {
        this._setActive(false);
      }
    }
    return this;
  },

  onValue: function(fn) {
    return this._on(VALUE, fn);
  },
  onError: function(fn) {
    return this._on(ERROR, fn);
  },
  onEnd: function(fn) {
    return this._on(END, fn);
  },
  onAny: function(fn) {
    return this._on(ANY, fn);
  },

  offValue: function(fn) {
    return this._off(VALUE, fn);
  },
  offError: function(fn) {
    return this._off(ERROR, fn);
  },
  offEnd: function(fn) {
    return this._off(END, fn);
  },
  offAny: function(fn) {
    return this._off(ANY, fn);
  }

});


// extend() can't handle `toString` in IE8
Observable.prototype.toString = function() {
  return '[' + this._name + ']';
};









// Stream

export function Stream() {
  Observable.call(this);
}

inherit(Stream, Observable, {

  _name: 'stream'

});







// Property

export function Property() {
  Observable.call(this);
  this._currentEvent = null;
}

inherit(Property, Observable, {

  _name: 'property',

  _send: function(type, x, isCurrent) {
    if (this._alive) {
      if (!isCurrent) {
        this._dispatcher.dispatch(Event(type, x));
      }
      if (type === VALUE || type === ERROR) {
        this._currentEvent = Event(type, x, true);
      }
      if (type === END) {
        this._clear();
      }
    }
  },

  _on: function(type, fn) {
    if (this._alive) {
      this._dispatcher.add(type, fn);
      this._setActive(true);
    }
    if (this._currentEvent !== null) {
      callSubscriber(type, fn, this._currentEvent);
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

  var handler = function(event) {
    var typeStr = '<' + event.type + (event.current ? ':current' : '') + '>';
    if (event.type === VALUE || event.type === ERROR) {
      console.log(name, typeStr, event.value);
    } else {
      console.log(name, typeStr);
    }
  };

  if (!this.__logHandlers) {
    this.__logHandlers = [];
  }
  this.__logHandlers.push({name: name, handler: handler});

  this.onAny(handler);
  return this;
};

Observable.prototype.offLog = function(name) {
  name = name || this.toString();

  if (this.__logHandlers) {
    var handlerIndex = findByPred(this.__logHandlers, function(obj) {
      return obj.name === name;
    });
    if (handlerIndex !== -1) {
      var handler = this.__logHandlers[handlerIndex].handler;
      this.__logHandlers.splice(handlerIndex, 1);
      this.offAny(handler);
    }
  }

  return this;
};
