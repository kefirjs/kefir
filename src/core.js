var Kefir = {};



// Special values

var NOTHING = Kefir.NOTHING = ['<nothing>'];
var END = Kefir.END = ['<end>'];
var NO_MORE = Kefir.NO_MORE = ['<no more>'];

// Example:
//   stream.__sendAny(Kefir.bunch(1, 2, Kefir.END))
Kefir.BunchOfValues = function(values){
  this.values = values;
}
Kefir.bunch = function() {
  return new Kefir.BunchOfValues(firstArrOrToArr(arguments));
}

// Example:
//   stream.__sendAny(Kefir.error('network error'))
Kefir.Error = function(error) {
  this.error = error;
}

Kefir.error = function(error) {
  return new Kefir.Error(error);
}



// Observable

var Observable = Kefir.Observable = function Observable(onFirstIn, onLastOut){

  // __onFirstIn, __onLastOut can also be added to prototype of child classes
  if (isFn(onFirstIn)) {
    this.__onFirstIn = onFirstIn;
  }
  if (isFn(onLastOut)) {
    this.__onLastOut = onLastOut;
  }

  this.__subscribers = [];

}

inherit(Observable, Object, {

  __ClassName: 'Observable',

  toString: function(){
    return '[' + this.__ClassName + (this.__objName ? (' | ' + this.__objName) : '') + ']';
  },

  __onFirstIn: noop,
  __onLastOut: noop,

  __on: function(type /*,callback [, context [, arg1, arg2 ...]]*/){
    if (!this.isEnded()) {
      var firstIn = (
        (type === 'value' || type === 'error') &&
        !(this.__hasSubscribers('value') || this.__hasSubscribers('error'))
      );
      this.__subscribers.push(arguments);
      if (firstIn) {
        this.__onFirstIn();
      }
    } else if (type === 'end') {
      callFn(restArgs(arguments, 1));
    }
  },
  __off: function(type /*,callback [, context [, arg1, arg2 ...]]*/){
    if (!this.isEnded()) {
      for (var i = 0; i < this.__subscribers.length; i++) {
        if (isEqualArrays(this.__subscribers[i], arguments)) {
          this.__subscribers[i] = null;
        }
      }
      if (
        (type === 'value' || type === 'error') &&
        !(this.__hasSubscribers('value') || this.__hasSubscribers('error'))
      ) {
        this.__onLastOut();
      }
    }
  },
  __send: function(type /*[, arg1, arg2, ...]*/) {
    if (!this.isEnded()) {
      for (var i = 0; i < this.__subscribers.length; i++) {
        var subscriber = this.__subscribers[i];
        if (subscriber && subscriber[0] === type) {
          var result = callFn(restArgs(subscriber, 1), restArgs(arguments, 1));
          if (result === NO_MORE) {
            this.__off.apply(this, subscriber)
          }
        }
      }
      if (type === 'end') {
        this.__clear();
      }
    }
  },
  __hasSubscribers: function(type) {
    if (this.isEnded()) {
      return false;
    }
    for (var i = 0; i < this.__subscribers.length; i++) {
      if (this.__subscribers[i] && this.__subscribers[i][0] === type) {
        return true;
      }
    }
    return false;
  },
  __clear: function() {
    this.__onLastOut();
    if (own(this, '__onFirstIn')) {
      this.__onFirstIn = null;
    }
    if (own(this, '__onLastOut')) {
      this.__onLastOut = null;
    }
    this.__subscribers = null;
  },


  __sendValue: function(x){
    this.__send('value', x);
    return this;
  },
  __sendError: function(x){
    this.__send('error', x);
    return this;
  },
  __sendEnd: function(){
    this.__send('end');
    return this;
  },
  __sendAny: function(x){
    if (x === END) {
      this.__sendEnd();
    } else if (x instanceof Kefir.BunchOfValues) {
      for (var i = 0; i < x.values.length; i++) {
        this.__sendAny(x.values[i]);
      }
    } else if (x instanceof Kefir.Error) {
      this.__sendError(x.error);
    } else if (x !== NOTHING) {
      this.__sendValue(x);
    }
    return this;
  },


  onValue: function(){
    this.__on.apply(this, ['value'].concat(toArray(arguments)));
    return this;
  },
  offValue: function(){
    this.__off.apply(this, ['value'].concat(toArray(arguments)));
    return this;
  },
  onError: function(){
    this.__on.apply(this, ['error'].concat(toArray(arguments)));
    return this;
  },
  offError: function(){
    this.__off.apply(this, ['error'].concat(toArray(arguments)));
    return this;
  },
  onEnd: function(){
    this.__on.apply(this, ['end'].concat(toArray(arguments)));
    return this;
  },
  offEnd: function(){
    this.__off.apply(this, ['end'].concat(toArray(arguments)));
    return this;
  },

  // for Property
  onNewValue: function(){
    return this.onValue.apply(this, arguments);
  },

  isEnded: function() {
    return !this.__subscribers;
  }


})




// Stream

var Stream = Kefir.Stream = function Stream(){
  Observable.apply(this, arguments);
}

inherit(Stream, Observable, {
  __ClassName: 'Stream'
})




// Property

var Property = Kefir.Property = function Property(onFirstIn, onLastOut, initial){
  Observable.call(this, onFirstIn, onLastOut);
  this.__cached = (typeof initial !== 'undefined') ? initial : NOTHING;
}

inherit(Property, Observable, {

  __ClassName: 'Property',

  hasCached: function(){
    return this.__cached !== NOTHING;
  },
  getCached: function(){
    return this.__cached;
  },

  __sendValue: function(x) {
    if (!this.isEnded()){
      this.__cached = x;
    }
    Observable.prototype.__sendValue.call(this, x);
  },
  onNewValue: function(){
    this.__on.apply(this, ['value'].concat(toArray(arguments)));
    return this;
  },
  onValue: function() {
    if ( this.hasCached() ) {
      callFn(arguments, [this.__cached])
    }
    return this.onNewValue.apply(this, arguments);
  }

})



// Log

var logHelper = function(name, type, x) {
  console.log(text, type, x);
}

Observable.prototype.log = function(name) {
  if (!name) {
    name = this.toString();
  }
  this.onValue(logHelper, null, name, '<value>');
  this.onError(logHelper, null, name, '<error>');
  this.onEnd(logHelper, null, name, '<end>');
  return this;
}
