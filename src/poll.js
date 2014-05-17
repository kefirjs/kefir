// FromPoll

var FromPollStream = Kefir.FromPollStream = function FromPollStream(interval, sourceFn){
  Stream.call(this);
  this.__interval = interval;
  this.__intervalId = null;
  var _this = this;
  this.__bindedSend = function(){  _this.__sendAny(sourceFn())  }
}

inherit(FromPollStream, Stream, {

  __ClassName: 'FromPollStream',
  __onFirstIn: function(){
    this.__intervalId = setInterval(this.__bindedSend, this.__interval);
  },
  __onLastOut: function(){
    if (this.__intervalId !== null){
      clearInterval(this.__intervalId);
      this.__intervalId = null;
    }
  },
  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__bindedSend = null;
  }

});

Kefir.fromPoll = function(interval, fn){
  return new FromPollStream(interval, fn);
}



// Interval

Kefir.interval = function(interval, x){
  return new FromPollStream(interval, function(){  return x });
}



// Sequentially

Kefir.sequentially = function(interval, xs){
  xs = xs.slice(0);
  return new FromPollStream(interval, function(){
    if (xs.length === 0) {
      return END;
    }
    if (xs.length === 1){
      return Kefir.bunch(xs[0], END);
    }
    return xs.shift();
  });
}



// Repeatedly

Kefir.repeatedly = function(interval, xs){
  var i = -1;
  return new FromPollStream(interval, function(){
    return xs[++i % xs.length];
  });
}
