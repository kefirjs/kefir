

// Kefir.fromBinder(fn)

function FromBinderProperty(fn) {
  Property.call(this);
  this.__fn = new Callable(fn);
}

inherit(FromBinderProperty, Property, {

  __name: 'FromBinderProperty',

  __onActivation: function() {
    var _this = this;
    this.__unsubscribe = Callable.call(this.__fn, [
      function(type, x) {  _this.__send(type, x)  }
    ]);
  },
  __onDeactivation: function() {
    if (isFn(this.__unsubscribe)) {
      this.__unsubscribe();
    }
    this.__unsubscribe = null;
  },

  __clear: function() {
    Property.prototype.__clear.call(this);
    this.__fn = null;
  }

})

Kefir.fromBinder = function(fn) {
  return new FromBinderProperty(fn);
}








// // Kefir.never()

// var neverObj = new Stream();
// neverObj.__sendEnd();
// neverObj.__ClassName = 'NeverStream'
// Kefir.never = function() {  return neverObj  }




// // Kefir.once(x)

// function OnceStream(value) {
//   Stream.call(this);
//   this.__value = value;
// }

// inherit(OnceStream, Stream, {

//   __ClassName: 'OnceStream',
//   onValue: function() {
//     if (this.alive) {
//       Callable.call(arguments, [this.__value]);
//       this.__value = null;
//       this.__sendEnd();
//     }
//     return this;
//   },
//   onBoth: function() {
//     if (this.alive) {
//       Callable.call(arguments, ['value', this.__value]);
//       this.__value = null;
//       this.__sendEnd();
//     }
//     return this;
//   },
//   onError: noop

// })

// Kefir.once = function(x) {
//   return new OnceStream(x);
// }



// // Kefir.constant(x)
// // TODO: tests, docs

// function ConstantProperty(x) {
//   Property.call(this, x);
//   this.__sendEnd();
// }

// inherit(ConstantProperty, Property, {
//   __ClassName: 'ConstantProperty'
// })

// Kefir.constant = function(x) {
//   return new ConstantProperty(x);
// }







// // Kefir.fromBinder(fn)

// function FromBinderStream(subscribeFnMeta) {
//   Stream.call(this);
//   this.__subscribeFn = new Callable(subscribeFnMeta);
// }

// inherit(FromBinderStream, Stream, {

//   __ClassName: 'FromBinderStream',
//   __onFirstIn: function() {
//     var _this = this;
//     this.__unsubscribe = Callable.call(this.__subscribeFn, [function(x) {
//       _this.__sendAny(x);
//     }]);
//   },
//   __onLastOut: function() {
//     if (isFn(this.__unsubscribe)) {
//       this.__unsubscribe();
//     }
//     this.__unsubscribe = null;
//   },
//   __clear: function() {
//     Stream.prototype.__clear.call(this);
//     this.__subscribeFn = null;
//   }

// })

// Kefir.fromBinder = function(/*subscribe[, context[, arg1, arg2...]]*/) {
//   return new FromBinderStream(arguments);
// }
