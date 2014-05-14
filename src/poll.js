// FromPoll

var FromPollStream = Kefir.FromPollStream = inherit(function FromPollStream(interval, sourceFn){
  Stream.call(this);
  this.__interval = interval;
  this.__intervalId = null;
  var _this = this;
  this.__send = function(){  _this._send(sourceFn())  }
}, Stream, {

  __ClassName: 'FromPollStream',
  __objName: 'Kefir.fromPoll(interval, fn)',
  __onFirstIn: function(){
    this.__intervalId = setInterval(this.__send, this.__interval);
  },
  __onLastOut: function(){
    if (this.__intervalId !== null){
      clearInterval(this.__intervalId);
      this.__intervalId = null;
    }
  },
  __end: function(){
    Stream.prototype.__end.call(this);
    this.__send = null;
  }

});

Kefir.fromPoll = function(interval, fn){
  return withName('Kefir.fromPoll(interval, fn)', new FromPollStream(interval, fn));
}



// Interval

Kefir.interval = function(interval, x){
  return withName('Kefir.interval(interval, x)', new FromPollStream(interval, function(){  return x }));
}



// Sequentially

Kefir.sequentially = function(interval, xs){
  xs = xs.slice(0);
  return withName('Kefir.sequentially(interval, xs)', new FromPollStream(interval, function(){
    if (xs.length === 0){
      return Kefir.END;
    } else {
      return xs.shift();
    }
  }));
}



// Repeatedly

Kefir.repeatedly = function(interval, xs){
  var i = -1;
  return withName('Kefir.repeatedly(interval, xs)', new FromPollStream(interval, function(){
    return xs[++i % xs.length];
  }));
}
