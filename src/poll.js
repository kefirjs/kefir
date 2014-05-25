// FromPoll

var FromPollStream = Kefir.FromPollStream = function FromPollStream(interval, sourceFnMeta){
  Stream.call(this);
  this.__interval = interval;
  this.__intervalId = null;
  var _this = this;
  if (sourceFnMeta.length === 1) {
    sourceFnMeta = sourceFnMeta[0];
  }
  this.__bindedSend = function(){  _this.__sendAny(callFn(sourceFnMeta))  }
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

Kefir.fromPoll = function(interval/*, fn[, context[, arg1, arg2, ...]]*/){
  return new FromPollStream(interval, restArgs(arguments, 1));
}



// Interval

Kefir.interval = function(interval, x){
  return new FromPollStream(interval, [id, null, x]);
}



// Sequentially

var sequentiallyHelperFn = function(){
  if (this.xs.length === 0) {
    return END;
  }
  if (this.xs.length === 1){
    return Kefir.bunch(this.xs[0], END);
  }
  return this.xs.shift();
}

Kefir.sequentially = function(interval, xs){
  return new FromPollStream(interval, [sequentiallyHelperFn, {xs: xs.slice(0)}]);
}



// Repeatedly

var repeatedlyHelperFn = function(){
  this.i = (this.i + 1) % this.xs.length;
  return this.xs[this.i];
}

Kefir.repeatedly = function(interval, xs){
  return new FromPollStream(interval, [repeatedlyHelperFn, {i: -1, xs: xs}]);
}
