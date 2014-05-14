// TODO
//
// Kefir.constant(x)



// Never

var neverObj = new Stream();
neverObj._send(Kefir.END);
neverObj.__objName = 'Kefir.never()'
Kefir.never = function() {
  return neverObj;
}




// Once

Kefir.OnceStream = inherit(function OnceStream(value){
  Stream.call(this);
  this.__value = value;
}, Stream, {

  __ClassName: 'OnceStream',
  __objName: 'Kefir.once(x)',
  __onFirstIn: function(){
    this._send(this.__value);
    this.__value = null;
    this._send(Kefir.END);
  }

});

Kefir.once = function(x) {
  return new Kefir.OnceStream(x);
}





// fromBinder

Kefir.FromBinderStream = inherit(function FromBinderStream(subscribe){
  Stream.call(this);
  this.__subscribe = subscribe;
}, Stream, {

  __ClassName: 'FromBinderStream',
  __objName: 'Kefir.fromBinder(subscribe)',
  __onFirstIn: function(){
    var _this = this;
    this.__usubscriber = this.__subscribe(function(x){
      _this._send(x);
    });
  },
  __onLastOut: function(){
    if (isFn(this.__usubscriber)) {
      this.__usubscriber();
    }
    this.__usubscriber = null;
  },
  __end: function(){
    Stream.prototype.__end.call(this);
    this.__subscribe = null;
  }

})

Kefir.fromBinder = function(subscribe){
  return new Kefir.FromBinderStream(subscribe);
}
