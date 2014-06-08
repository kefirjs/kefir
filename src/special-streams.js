// TODO
//
// Kefir.constant(x)
// Kefir.fromArray(values)
// Kefir.fromCallback(fn)
// Kefir.fromNodeCallback(fn)
// Kefir.fromPromise(promise)



// Kefir.never()

var neverObj = new Stream();
neverObj.__sendEnd();
neverObj.__objName = 'Kefir.never()'
Kefir.never = function() {  return neverObj  }




// Kefir.once(x)

var OnceStream = function OnceStream(value) {
  Stream.call(this);
  this.__value = value;
}

inherit(OnceStream, Stream, {

  __ClassName: 'OnceStream',
  onValue: function() {
    if (this.alive) {
      Callable.call(arguments, [this.__value]);
      this.__value = null;
      this.__sendEnd();
    }
    return this;
  },
  onBoth: function() {
    if (this.alive) {
      Callable.call(arguments, ['value', this.__value]);
      this.__value = null;
      this.__sendEnd();
    }
    return this;
  },
  onError: noop

})

Kefir.once = function(x) {
  return new OnceStream(x);
}





// Kefir.fromBinder(fn)

var FromBinderStream = function FromBinderStream(subscribeFnMeta) {
  Stream.call(this);
  this.__subscribeFn = new Callable(subscribeFnMeta);
}

inherit(FromBinderStream, Stream, {

  __ClassName: 'FromBinderStream',
  __onFirstIn: function() {
    var _this = this;
    this.__unsubscribe = Callable.call(this.__subscribeFn, [function(x) {
      _this.__sendAny(x);
    }]);
  },
  __onLastOut: function() {
    if (isFn(this.__unsubscribe)) {
      this.__unsubscribe();
    }
    this.__unsubscribe = null;
  },
  __clear: function() {
    Stream.prototype.__clear.call(this);
    this.__subscribeFn = null;
  }

})

Kefir.fromBinder = function(/*subscribe[, context[, arg1, arg2...]]*/) {
  return new FromBinderStream(arguments);
}
