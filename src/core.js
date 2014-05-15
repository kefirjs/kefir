// Class method names convention
//
// __foo: can be used only inside class or child class
// _foo: can be used only inside Kefir
// foo: public API


var Kefir = {};

var NOTHING = Kefir.NOTHING = ['<nothing>'];
var END = Kefir.END = ['<end>'];
var NO_MORE = Kefir.NO_MORE = ['<no more>'];


// BunchOfValues
//
// Example:
//   stream._send(Kefir.bunch(1, 2, Kefir.END))

Kefir.BunchOfValues = function(values){
  this.values = values;
}
Kefir.bunch = function() {
  return new Kefir.BunchOfValues(firstArrOrToArr(arguments));
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
  _send: function(x) {
    if (!this.isEnded()) {
      if (x === END) {
        this.__end();
      } else if (x instanceof Kefir.BunchOfValues) {
        for (var i = 0; i < x.values.length; i++) {
          this._send(x.values[i]);
        }
      } else if (x !== Kefir.NOTHING) {
        this.__deliver(x);
      }
    }
  },
  __deliver: function(x){
    // TODO: new on/off
    this.___send('value', x);
    if (!this.hasSubscribers()) {
      this.__onLastOut();
    }
  },


  // TODO: new on/off
  ___on: function(/*type ,callback [, context [, arg1, arg2 ...]]*/){
    this.__subscribers.push(arguments);
  },
  ___off: function(/*type ,callback [, context [, arg1, arg2 ...]]*/){
    for (var i = 0; i < this.__subscribers.length; i++) {
      if (isEqualArrays(this.__subscribers[i], arguments)) {
        this.__subscribers[i] = null;
      }
    }
  },
  ___send: function(type, x) {
    for (var i = 0; i < this.__subscribers.length; i++) {
      var subscriber = this.__subscribers[i];
      if (subscriber && subscriber[0] === type) {
        var result = callSubscriber(subscriber, x);
        if (result === NO_MORE) {
          this.___off.apply(this, subscriber)
        }
      }
    }
  },
  ___hasSubscribers: function(type) {
    for (var i = 0; i < this.__subscribers.length; i++) {
      if (this.__subscribers[i] && this.__subscribers[i][0] === type) {
        return true;
      }
    }
    return false;
  },


  on: function(/*callback [, context [, arg1, arg2 ...]]*/) {
    if (!this.isEnded()) {
      var willBeFirst = !this.hasSubscribers();
      // TODO: new on/off
      this.___on.apply(this, ['value'].concat(toArray(arguments)));
      if (willBeFirst) {
        this.__onFirstIn();
      }
    }
  },
  onChanges: function(){
    this.on.apply(this, arguments);
  },
  onValue: function(){
    this.on.apply(this, arguments);
  },
  off: function(/*callback [, context [, arg1, arg2 ...]]*/) {
    if (!this.isEnded()) {
      // TODO: new on/off
      this.___off.apply(this, ['value'].concat(toArray(arguments)));
      if (!this.hasSubscribers()) {
        this.__onLastOut();
      }
    }
  },
  onEnd: function(/*callback [, context [, arg1, arg2 ...]]*/) {
    if (this.isEnded()) {
      // TODO: new on/off
      callSubscriber(['end'].concat(toArray(arguments)));
    } else {
      // TODO: new on/off
      this.___on.apply(this, ['end'].concat(toArray(arguments)));
    }
  },
  offEnd: function(/*callback [, context [, arg1, arg2 ...]]*/) {
    if (!this.isEnded()){
      // TODO: new on/off
      this.___off.apply(this, ['end'].concat(toArray(arguments)));
    }
  },
  isEnded: function() {
    return !this.__subscribers;
  },
  hasSubscribers: function(){
    return !this.isEnded() && this.___hasSubscribers('value');
  },
  __onFirstIn: noop,
  __onLastOut: noop,
  __sendEnd: function(){
    this._send(END);
  },
  __end: function() {
    if (!this.isEnded()) {
      this.__onLastOut();
      this.___send('end');
      if (own(this, '__onFirstIn')) {
        this.__onFirstIn = null;
      }
      if (own(this, '__onLastOut')) {
        this.__onLastOut = null;
      }
      this.__subscribers = null;
    }
  },
  toString: function(){
    return '[' + this.__ClassName + (this.__objName ? (' | ' + this.__objName) : '') + ']';
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
  this.__cached = (typeof initial !== "undefined") ? initial : Kefir.NOTHING;
}

inherit(Property, Observable, {

  __ClassName: 'Property',
  onChanges: function(){
    Observable.prototype.on.apply(this, arguments);
  },
  on: function(/*callback [, context [, arg1, arg2 ...]]*/) {
    if ( this.hasCached() ) {
      // TODO: new on/off
      callSubscriber(['value'].concat(toArray(arguments)), this.__cached);
    }
    this.onChanges.apply(this, arguments);
  },
  _send: function(x) {
    if (!this.isEnded()){
      this.__cached = x;
    }
    Observable.prototype._send.call(this, x);
  },
  toProperty: function(initial){
    assert(
      typeof initial === "undefined",
      "can't convert Property to Property with new initial value"
    )
    return this;
  },
  hasCached: function(){
    return this.__cached !== Kefir.NOTHING;
  },
  getCached: function(){
    return this.__cached;
  }

})



// Log

Observable.prototype.log = function(text) {
  function log(value){
    if (text) {
      console.log(text, value);
    } else {
      console.log(value);
    }
  }
  this.on(log);
  this.onEnd(function(){  log(END)  });
}
