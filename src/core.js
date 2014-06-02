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

  this.__subscribers = {};

}

inherit(Observable, Object, {

  __ClassName: 'Observable',

  toString: function(){
    return '[' + this.__ClassName + (this.__objName ? (' | ' + this.__objName) : '') + ']';
  },

  __onFirstIn: noop,
  __onLastOut: noop,

  __addSubscriber: function(type, fnMeta){
    if (!this.__subscribers[type]) {
      this.__subscribers[type] = [];
    }
    this.__subscribers[type].push(normFnMeta(fnMeta));
  },

  __removeSubscriber: function(type, fnMeta){
    fnMeta = normFnMeta(fnMeta);
    if (this.__subscribers[type]) {
      for (var i = 0; i < this.__subscribers[type].length; i++) {
        var subscriberFnMeta = this.__subscribers[type][i];
        if (subscriberFnMeta === fnMeta || isEqualArrays(subscriberFnMeta, fnMeta)) {
          this.__subscribers[type][i] = null;
          return;
        }
      }
    }
  },

  __isFirsOrLast: function(type) {
    return (type === 'value' || type === 'error') &&
      !this.__hasSubscribers('value') &&
      !this.__hasSubscribers('error');
  },
  __on: function(type, fnMeta){
    if (!this.isEnded()) {
      var firstIn = this.__isFirsOrLast(type);
      this.__addSubscriber(type, fnMeta);
      if (firstIn) {
        this.__onFirstIn();
      }
    } else if (type === 'end') {
      callFn(fnMeta);
    }
  },
  __off: function(type, fnMeta){
    if (!this.isEnded()) {
      this.__removeSubscriber(type, fnMeta);
      if (this.__isFirsOrLast(type)) {
        this.__onLastOut();
      }
    }
  },
  __send: function(type, x) {
    if (!this.isEnded()) {
      if (this.__subscribers[type]) {
        for (var i = 0, l = this.__subscribers[type].length; i < l; i++) {
          var fnMeta = this.__subscribers[type][i];
          if (fnMeta !== null) {
            var result = callFn(fnMeta, type === 'end' ? null : [x]);
            if (result === NO_MORE) {
              this.__off(type, fnMeta);
            }
          }
        }
      }
      if (type === 'end') {
        this.__clear();
      }
    }
  },
  __hasSubscribers: function(type) {
    if (this.isEnded() || !this.__subscribers[type]) {
      return false;
    }
    for (var i = 0; i < this.__subscribers[type].length; i++) {
      if (this.__subscribers[type][i] !== null) {
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
    if (x === NOTHING) {  return this  }
    if (x === END) {  this.__sendEnd(); return this  }
    if (x instanceof Kefir.Error) {  this.__sendError(x.error); return this  }
    if (x instanceof Kefir.BunchOfValues) {
      for (var i = 0; i < x.values.length; i++) {
        this.__sendAny(x.values[i]);
      }
      return this;
    }
    this.__sendValue(x);
    return this;
  },


  onValue: function(){
    this.__on('value', arguments);
    return this;
  },
  offValue: function(){
    this.__off('value', arguments);
    return this;
  },
  onError: function(){
    this.__on('error', arguments);
    return this;
  },
  offError: function(){
    this.__off('error', arguments);
    return this;
  },
  onEnd: function(){
    this.__on('end', arguments);
    return this;
  },
  offEnd: function(){
    this.__off('end', arguments);
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
  this.__cached = isUndefined(initial) ? NOTHING : initial;
}

inherit(Property, Observable, {

  __ClassName: 'Property',

  hasValue: function(){
    return this.__cached !== NOTHING;
  },
  getValue: function(){
    return this.__cached;
  },

  __sendValue: function(x) {
    if (!this.isEnded()){
      this.__cached = x;
    }
    Observable.prototype.__sendValue.call(this, x);
  },
  onNewValue: function(){
    this.__on('value', arguments);
    return this;
  },
  onValue: function() {
    if ( this.hasValue() ) {
      callFn(arguments, [this.__cached])
    }
    return this.onNewValue.apply(this, arguments);
  }

})



// Log

var logHelper = function(name, type, x) {
  console.log(name, type, x);
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
