// TODO
//
// Kefir.constant(x)
// Kefir.fromArray(values)
// Kefir.fromCallback(fn)



// Kefir.never()

var neverObj = new Stream();
neverObj.__sendEnd();
neverObj.__objName = 'Kefir.never()'
Kefir.never = function() {
  return neverObj;
}




// Kefir.once(x)

Kefir.OnceStream = function OnceStream(value){
  Stream.call(this);
  this.__value = value;
}

inherit(Kefir.OnceStream, Stream, {

  __ClassName: 'OnceStream',
  onValue: function(){
    if (!this.isEnded()) {
      callFn(arguments, [this.__value]);
      this.__value = null;
      this.__sendEnd();
    }
    return this;
  },
  onError: noop

})

Kefir.once = function(x) {
  return new Kefir.OnceStream(x);
}





// Kefir.fromBinder(fn)

Kefir.FromBinderStream = function FromBinderStream(subscribeFnMeta){
  Stream.call(this);
  this.__subscribeFnMeta = normFnMeta(subscribeFnMeta);
}

inherit(Kefir.FromBinderStream, Stream, {

  __ClassName: 'FromBinderStream',
  __onFirstIn: function(){
    var _this = this;
    this.__usubscriber = callFn(this.__subscribeFnMeta, [function(x){
      _this.__sendAny(x);
    }]);
  },
  __onLastOut: function(){
    if (isFn(this.__usubscriber)) {
      this.__usubscriber();
    }
    this.__usubscriber = null;
  },
  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__subscribeFnMeta = null;
  }

})

Kefir.fromBinder = function(/*subscribe[, context[, arg1, arg2...]]*/){
  return new Kefir.FromBinderStream(arguments);
}
