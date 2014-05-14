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



// Callbacks

var Callbacks = Kefir.Callbacks = function Callbacks(){}

inherit(Callbacks, Object, {

  add: function(/*callback [, context [, arg1, arg2 ...]]*/){
    if (!this.__subscribers) {
      this.__subscribers = [];
    }
    this.__subscribers.push(arguments);
  },
  remove: function(/*callback [, context [, arg1, arg2 ...]]*/){
    if (this.isEmpty()) {return}
    for (var i = 0; i < this.__subscribers.length; i++) {
      if (isEqualArrays(this.__subscribers[i], arguments)) {
        this.__subscribers[i] = null;
      }
    }
    if (isAllDead(this.__subscribers)){
      this.__subscribers = null;
    }
  },
  isEmpty: function(){
    return !this.__subscribers;
  },
  hasOne: function(){
    return !this.isEmpty() && this.__subscribers.length === 1;
  },
  send: function(x){
    if (this.isEmpty()) {return}
    for (var i = 0, l = this.__subscribers.length; i < l; i++) {
      if (this.__subscribers[i]) {
        if(NO_MORE === callFn(this.__subscribers[i], x)) {
          this.remove.apply(this, this.__subscribers[i]);
        }
      }
    }
  }

})





// Observable

var Observable = Kefir.Observable = function Observable(onFirstIn, onLastOut){

  // __onFirstIn, __onLastOut can also be added to prototype of child classes
  if (isFn(onFirstIn)) {
    this.__onFirstIn = onFirstIn;
  }
  if (isFn(onLastOut)) {
    this.__onLastOut = onLastOut;
  }

  this.__subscribers = new Callbacks;
  this.__endSubscribers = new Callbacks;

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
    if (!this.__subscribers.isEmpty()) {
      this.__subscribers.send(x);
      if (this.__subscribers.isEmpty()) {
        this.__onLastOut();
      }
    }
  },
  on: function(/*callback [, context [, arg1, arg2 ...]]*/) {
    if (!this.isEnded()) {
      this.__subscribers.add.apply(this.__subscribers, arguments);
      if (this.__subscribers.hasOne()) {
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
      this.__subscribers.remove.apply(this.__subscribers, arguments);
      if (this.__subscribers.isEmpty()) {
        this.__onLastOut();
      }
    }
  },
  onEnd: function(/*callback [, context [, arg1, arg2 ...]]*/) {
    if (this.isEnded()) {
      callFn(arguments);
    } else {
      this.__endSubscribers.add.apply(this.__endSubscribers, arguments);
    }
  },
  offEnd: function(/*callback [, context [, arg1, arg2 ...]]*/) {
    if (!this.isEnded()){
      this.__endSubscribers.remove.apply(this.__endSubscribers, arguments);
    }
  },
  isEnded: function() {
    return !this.__subscribers;
  },
  hasSubscribers: function(){
    return !this.isEnded() && !this.__subscribers.isEmpty();
  },
  __onFirstIn: noop,
  __onLastOut: noop,
  __sendEnd: function(){
    this._send(END);
  },
  __end: function() {
    if (!this.isEnded()) {
      this.__onLastOut();
      this.__endSubscribers.send();
      if (own(this, '__onFirstIn')) {
        this.__onFirstIn = null;
      }
      if (own(this, '__onLastOut')) {
        this.__onLastOut = null;
      }
      this.__subscribers = null;
      this.__endSubscribers = null;
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
      callFn(arguments, this.__cached);
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
