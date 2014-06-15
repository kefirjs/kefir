// Kefir.later()

var LaterStream = function LaterStream(wait, value) {
  Stream.call(this);
  this.__value = value;
  this.__wait = wait;
}

inherit(LaterStream, Stream, {

  __ClassName: 'LaterStream',

  __onFirstIn: function() {
    var _this = this;
    setTimeout(function() {
      _this.__sendAny(_this.__value);
      _this.__sendEnd();
    }, this.__wait);
  },

  __clear: function() {
    Stream.prototype.__clear.call(this);
    this.__value = null;
    this.__wait = null;
  }

});

Kefir.later = function(wait, value) {
  return new LaterStream(wait, value);
}







// TODO: rewrite with createIntervalBasedStream() helper
//


// Kefir.fromPoll()

var FromPollStream = function FromPollStream(interval, sourceFn) {
  Stream.call(this);
  this.__interval = interval;
  this.__intervalId = null;
  var _this = this;
  sourceFn = new Callable(sourceFn);
  this.__bindedSend = function() {  _this.__sendAny(Callable.call(sourceFn))  }
}

inherit(FromPollStream, Stream, {

  __ClassName: 'FromPollStream',
  __onFirstIn: function() {
    this.__intervalId = setInterval(this.__bindedSend, this.__interval);
  },
  __onLastOut: function() {
    if (this.__intervalId !== null) {
      clearInterval(this.__intervalId);
      this.__intervalId = null;
    }
  },
  __clear: function() {
    Stream.prototype.__clear.call(this);
    this.__bindedSend = null;
  }

});

Kefir.fromPoll = function(interval/*, fn[, context[, arg1, arg2, ...]]*/) {
  return new FromPollStream(interval, rest(arguments, 1));
}



// Kefir.interval()

Kefir.interval = function(interval, x) {
  return new FromPollStream(interval, [id, null, x]);
}



// Kefir.sequentially()

var sequentiallyHelperFn = function() {
  if (this.xs.length === 0) {
    return END;
  }
  if (this.xs.length === 1) {
    return Kefir.bunch(this.xs[0], END);
  }
  return this.xs.shift();
}

Kefir.sequentially = function(interval, xs) {
  return new FromPollStream(interval, [sequentiallyHelperFn, {xs: xs.slice(0)}]);
}



// Kefir.repeatedly()

var repeatedlyHelperFn = function() {
  this.i = (this.i + 1) % this.xs.length;
  return this.xs[this.i];
}

Kefir.repeatedly = function(interval, xs) {
  return new FromPollStream(interval, [repeatedlyHelperFn, {i: -1, xs: xs}]);
}
