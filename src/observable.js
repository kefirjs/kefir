import {extend} from './utils/objects';
import {VALUE, ERROR, ANY, END} from './constants';
import {Dispatcher, callSubscriber} from './dispatcher';
import _Event from './event';
const Event = _Event;



export default function Observable() {
  this._dispatcher = new Dispatcher();
  this._active = false;
  this._alive = true;
}

extend(Observable.prototype, {

  _name: 'observable',

  _onActivation() {},
  _onDeactivation() {},

  _setActive(active) {
    if (this._active !== active) {
      this._active = active;
      if (active) {
        this._onActivation();
      } else {
        this._onDeactivation();
      }
    }
  },

  _clear() {
    this._setActive(false);
    this._alive = false;
    this._dispatcher = null;
  },

  _send(type, x, isCurrent) {
    if (this._alive) {
      this._dispatcher.dispatch(Event(type, x, isCurrent));
      if (type === END) {
        this._clear();
      }
    }
  },

  _on(type, fn) {
    if (this._alive) {
      this._dispatcher.add(type, fn);
      this._setActive(true);
    } else {
      callSubscriber(type, fn, Event(END, undefined, true));
    }
    return this;
  },

  _off(type, fn) {
    if (this._alive) {
      var count = this._dispatcher.remove(type, fn);
      if (count === 0) {
        this._setActive(false);
      }
    }
    return this;
  },

  onValue(fn) {
    return this._on(VALUE, fn);
  },
  onError(fn) {
    return this._on(ERROR, fn);
  },
  onEnd(fn) {
    return this._on(END, fn);
  },
  onAny(fn) {
    return this._on(ANY, fn);
  },

  offValue(fn) {
    return this._off(VALUE, fn);
  },
  offError(fn) {
    return this._off(ERROR, fn);
  },
  offEnd(fn) {
    return this._off(END, fn);
  },
  offAny(fn) {
    return this._off(ANY, fn);
  },

  // A and B must be subclasses of Stream and Property (order doesn't matter)
  ofSameType(A, B) {
    return A.prototype.getType() === this.getType() ? A : B;
  }

});


// extend() can't handle `toString` in IE8
Observable.prototype.toString = function() {
  return '[' + this._name + ']';
};



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
