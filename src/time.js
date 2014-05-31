// TODO
//
// observable.delay(wait)
// observable.throttle(wait, leading, trailing)
// observable.debounce(wait, immediate)
// http://underscorejs.org/#defer


Kefir.LaterStream = function LaterStream(wait, value) {
  Stream.call(this);
  this.__value = value;
  this.__wait = wait;
}

inherit(Kefir.LaterStream, Stream, {

  __ClassName: 'LaterStream',

  __onFirstIn: function(){
    var _this = this;
    setTimeout(function(){
      _this.__sendAny(_this.__value);
      _this.__sendEnd();
    }, this.__wait);
  },

  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__value = null;
    this.__wait = null;
  }

});

Kefir.later = function(wait, value) {
  return new Kefir.LaterStream(wait, value);
}
