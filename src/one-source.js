

// .withHandler()

withOneSource('withHandler', {
  _init: function(args) {
    var _this = this;
    this._handler = new Fn(args[0]);
    this._bindedSend = function(type, x) {  _this._send(type, x)  }
  },
  _free: function() {
    this._handler = null;
    this._bindedSend = null;
  },
  _handleAny: function(type, x, current) {
    Fn.call(this._handler, [this._bindedSend, type, x, current]);
  }
});





// .skipCurrent()

withOneSource('skipCurrent', {
  _init: function(args) {
    this._type = args[0];
  },
  _handleValue: function(x, current) {
    if (!current || (this._type !== 'value' && this._type != null)) {
      this._send('value', x);
    }
  },
  _handleError: function(x, current) {
    if (!current || (this._type !== 'error' && this._type != null)) {
      this._send('error', x);
    }
  }
});





// .addCurrent()

withOneSource('addCurrent', {
  _init: function(args) {
    this._type = args[0];
    this._x = args[1];
  },
  _onActivationHook: function() {
    this._send(this._type, this._x);
  }
});






// .map(fn)

withOneSource('map', {
  _init: function(args) {
    this._fn = new Fn(args[0]);
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x) {
    this._send('value', Fn.call(this._fn, [x]));
  }
});





// .filter(fn)

withOneSource('filter', {
  _init: function(args) {
    this._fn = new Fn(args[0]);
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x) {
    if (Fn.call(this._fn, [x])) {
      this._send('value', x);
    }
  }
});




// .diff(seed, fn)

withOneSource('diff', {
  _init: function(args) {
    this._prev = args[0];
    this._fn = new Fn(rest(args, 1));
  },
  _free: function() {
    this._prev = null;
    this._fn = null;
  },
  _handleValue: function(x) {
    this._send('value', Fn.call(this._fn, [this._prev, x]));
    this._prev = x;
  }
});




// .takeWhile(fn)

withOneSource('takeWhile', {
  _init: function(args) {
    this._fn = new Fn(args[0]);
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x) {
    if (Fn.call(this._fn, [x])) {
      this._send('value', x);
    } else {
      this._send('end');
    }
  }
});





// .take(n)

withOneSource('take', {
  _init: function(args) {
    this._n = args[0];
    if (this._n <= 0) {
      this._send('end');
    }
  },
  _handleValue: function(x) {
    this._n--;
    this._send('value', x);
    if (this._n === 0) {
      this._send('end');
    }
  }
});





// .skip(n)

withOneSource('skip', {
  _init: function(args) {
    this._n = args[0];
  },
  _handleValue: function(x) {
    if (this._n <= 0) {
      this._send('value', x);
    } else {
      this._n--;
    }
  }
});




// .skipDuplicates([fn])

function strictlyEqual(a, b) {  return a === b  }

withOneSource('skipDuplicates', {
  _init: function(args) {
    if (args.length > 0) {
      this._fn = new Fn(args[0]);
    } else {
      this._fn = strictlyEqual;
    }
    this._prev = NOTHING;
  },
  _free: function() {
    this._fn = null;
    this._prev = null;
  },
  _handleValue: function(x) {
    if (this._prev === NOTHING || !Fn.call(this._fn, [this._prev, x])) {
      this._send('value', x);
    }
    this._prev = x;
  }
});





// .skipWhile(fn)

withOneSource('skipWhile', {
  _init: function(args) {
    this._fn = new Fn(args[0]);
    this._skip = true;
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x) {
    if (!this._skip) {
      this._send('value', x);
      return;
    }
    if (!Fn.call(this._fn, [x])) {
      this._skip = false;
      this._fn = null;
      this._send('value', x);
    }
  }
});





// .scan(seed, fn)

withOneSource('scan', {
  _init: function(args) {
    this._send('value', args[0]);
    this._fn = new Fn(rest(args, 1));
  },
  _free: function(){
    this._fn = null;
  },
  _handleValue: function(x) {
    this._send('value', Fn.call(this._fn, [this.get('value'), x]));
  }
});







// .reduce(seed, fn)

withOneSource('reduce', {
  _init: function(args) {
    this._result = args[0];
    this._fn = new Fn(rest(args, 1));
  },
  _free: function(){
    this._fn = null;
    this._result = null;
  },
  _handleValue: function(x) {
    this._result = Fn.call(this._fn, [this._result, x]);
  },
  _handleEnd: function() {
    this._send('value', this._result);
    this._send('end');
  }
});







// .throttle(wait, {leading, trailing})

withOneSource('throttle', {
  _init: function(args) {
    this._wait = args[0];
    this._leading = get(args[1], 'leading', true);
    this._trailing = get(args[1], 'trailing', true);
    this._trailingCallValue = null;
    this._trailingCallTimeoutId = null;
    this._endAfterTrailingCall = false;
    this._lastCallTime = 0;
    var _this = this;
    this._makeTrailingCallBinded = function() {  _this._makeTrailingCall()  };
  },
  _free: function() {
    this._trailingCallValue = null;
    this._makeTrailingCallBinded = null;
  },
  _handleValue: function(x, current) {
    if (current) {
      this._send('value', x);
      return;
    }
    var curTime = now();
    if (this._lastCallTime === 0 && !this._leading) {
      this._lastCallTime = curTime;
    }
    var remaining = this._wait - (curTime - this._lastCallTime);
    if (remaining <= 0) {
      this._cancelTralingCall();
      this._lastCallTime = curTime;
      this._send('value', x);
    } else if (this._trailing) {
      this._scheduleTralingCall(x, remaining);
    }
  },
  _handleEnd: function() {
    if (this._trailingCallTimeoutId) {
      this._endAfterTrailingCall = true;
    } else {
      this._send('end');
    }
  },
  _scheduleTralingCall: function(value, wait) {
    if (this._trailingCallTimeoutId) {
      this._cancelTralingCall();
    }
    this._trailingCallValue = value;
    this._trailingCallTimeoutId = setTimeout(this._makeTrailingCallBinded, wait);
  },
  _cancelTralingCall: function() {
    if (this._trailingCallTimeoutId !== null) {
      clearTimeout(this._trailingCallTimeoutId);
      this._trailingCallTimeoutId = null;
    }
  },
  _makeTrailingCall: function() {
    this._send('value', this._trailingCallValue);
    this._trailingCallTimeoutId = null;
    this._trailingCallValue = null;
    this._lastCallTime = !this._leading ? 0 : now();
    if (this._endAfterTrailingCall) {
      this._send('end');
    }
  }
});







// .delay()

withOneSource('delay', {
  _init: function(args) {
    this._wait = args[0];
  },
  _handleValue: function(x, current) {
    if (current) {
      this._send('value', x);
      return;
    }
    var _this = this;
    setTimeout(function() {  _this._send('value', x)  }, this._wait);
  },
  _handleEnd: function() {
    var _this = this;
    setTimeout(function() {  _this._send('end')  }, this._wait);
  }
});
