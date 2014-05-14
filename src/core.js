// Class method names convention
//
// __foo: can be used only inside class or child class
// _foo: can be used only inside Kefir
// foo: public API


var Kefir = {};

Kefir.END = ['<end>'];
Kefir.NO_MORE = ['<no more>'];

// Для withHandler
// Kefir.NOTHING = ['<nothing>']; // и для Property initial value
// var lastValueObj = {value: null}
// Kefir.lastValue = function(value) {
//   lastValueObj.value = value;
//   return lastValueObj;
// }
// Kefir.isLastValue = function(obj){
//   return obj === lastValueObj;
// }


// Callbacks

var Callbacks = Kefir.Callbacks = inherit(function Callbacks(){
  this.__subscribers = null;
  this.__contexts = null;
}, Object, {
  add: function(fn, context){
    if (this.__subscribers === null) {
      this.__subscribers = [];
      this.__contexts = [];
    }
    this.__subscribers.push(fn);
    this.__contexts.push(context);
  },
  remove: function(fn, context){
    if (this.isEmpty()) {return}
    for (var i = 0; i < this.__subscribers.length; i++) {
      if (this.__subscribers[i] === fn && this.__contexts[i] === context) {
        this.__subscribers[i] = null;
        this.__contexts[i] = null;
      }
    }
    if (isAllDead(this.__subscribers)){
      this.__subscribers = null;
      this.__contexts = null;
    }
  },
  isEmpty: function(){
    return this.__subscribers === null;
  },
  hasOne: function(){
    return !this.isEmpty() && this.__subscribers.length === 1;
  },
  send: function(x){
    if (this.isEmpty()) {return}
    for (var i = 0, l = this.__subscribers.length; i < l; i++) {
      var callback = this.__subscribers[i];
      var context = this.__contexts[i];
      if (isFn(callback)) {
        if(Kefir.NO_MORE === callback.call(context, x)) {
          this.remove(callback, context);
        }
      }
    }
  }
});



// Base Observable class

var Observable = Kefir.Observable = inherit(function Observable(onFirstIn, onLastOut){

  // __onFirstIn, __onLastOut can also be added to prototype of child classes
  if (isFn(onFirstIn)) {
    this.__onFirstIn = onFirstIn;
  }
  if (isFn(onLastOut)) {
    this.__onLastOut = onLastOut;
  }

  this.__subscribers = new Callbacks;
  this.__endSubscribers = new Callbacks;
}, Object, {

  __ClassName: 'Observable',
  _send: function(x) {
    if (!this.isEnded()) {
      if (x === Kefir.END) {
        this.__end();
      } else {
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
  on: function(callback, context) {
    if (!this.isEnded()) {
      this.__subscribers.add(callback, context);
      if (this.__subscribers.hasOne()) {
        this.__onFirstIn();
      }
    }
  },
  onChanges: function(callback, context){
    this.on(callback, context);
  },
  onValue: function(callback, context){
    this.on(callback, context);
  },
  off: function(callback, context) {
    if (!this.isEnded()) {
      this.__subscribers.remove(callback, context);
      if (this.__subscribers.isEmpty()) {
        this.__onLastOut();
      }
    }
  },
  onEnd: function(callback, context) {
    if (this.isEnded()) {
      callback.call(context);
    } else {
      this.__endSubscribers.add(callback, context);
    }
  },
  offEnd: function(callback, context) {
    if (!this.isEnded()){
      this.__endSubscribers.remove(callback, context);
    }
  },
  isEnded: function() {
    return this.__subscribers === null;
  },
  hasSubscribers: function(){
    return !this.isEnded() && !this.__subscribers.isEmpty();
  },
  __onFirstIn: noop,
  __onLastOut: noop,
  __sendEnd: function(){
    this._send(Kefir.END);
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

});




// Stream

var Stream = Kefir.Stream = inherit(function Stream(){
  Observable.apply(this, arguments);
}, Observable, {
  __ClassName: 'Stream'
});




// Property

var Property = Kefir.Property = inherit(function Property(onFirstIn, onLastOut, initial){
  Observable.call(this, onFirstIn, onLastOut);
  this.__hasCached = (typeof initial !== "undefined");
  this.__cached = initial;
}, Observable, {

  __ClassName: 'Property',
  onChanges: function(callback, context){
    Observable.prototype.on.call(this, callback, context);
  },
  on: function(callback, context) {
    if (this.__hasCached) {
      callback.call(context, this.__cached);
    }
    this.onChanges(callback, context);
  },
  _send: function(x) {
    if (!this.isEnded()){
      this.__hasCached = true;
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
    return this.__hasCached;
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
  this.onEnd(function(){  log(Kefir.END)  });
}
