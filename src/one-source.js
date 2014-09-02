function produceStream(StreamClass, PropertyClass) {
  return function() {  return new StreamClass(this, arguments)  }
}
function produceProperty(StreamClass, PropertyClass) {
  return function() {  return new PropertyClass(this, arguments)  }
}


// .toProperty()

withOneSource('toProperty', {
  _init: function(args) {
    if (args.length > 0) {
      this._send('value', args[0]);
    }
  }
}, {propertyMethod: null, streamMethod: produceProperty});




// .changes()

withOneSource('changes', {
  _handleValue: function(x, isCurrent) {
    if (!isCurrent) {
      this._send('value', x);
    }
  }
}, {streamMethod: null, propertyMethod: produceStream});




// .withHandler()

withOneSource('withHandler', {
  _init: function(args) {
    this._handler = Fn(args[0], 2);
    this._forcedCurrent = false;
    var $ = this;
    this._$send = function(type, x) {  $._send(type, x, $._forcedCurrent)  }
  },
  _free: function() {
    this._handler = null;
    this._$send = null;
  },
  _handleAny: function(event) {
    this._forcedCurrent = event.current;
    this._handler.invoke(this._$send, event);
    this._forcedCurrent = false;
  }
});




var withFnArgMixin = {
  _init: function(args) {  this._fn = Fn(args[0], 1)  },
  _free: function() {  this._fn = null  }
};


// .map(fn)

withOneSource('map', extend({
  _handleValue: function(x, isCurrent) {
    this._send('value', this._fn.invoke(x), isCurrent);
  }
}, withFnArgMixin));





// .filter(fn)

withOneSource('filter', extend({
  _handleValue: function(x, isCurrent) {
    if (this._fn.invoke(x)) {
      this._send('value', x, isCurrent);
    }
  }
}, withFnArgMixin));





// .takeWhile(fn)

withOneSource('takeWhile', extend({
  _handleValue: function(x, isCurrent) {
    if (this._fn.invoke(x)) {
      this._send('value', x, isCurrent);
    } else {
      this._send('end', null, isCurrent);
    }
  }
}, withFnArgMixin));





// .take(n)

withOneSource('take', {
  _init: function(args) {
    this._n = args[0];
    if (this._n <= 0) {
      this._send('end');
    }
  },
  _handleValue: function(x, isCurrent) {
    this._n--;
    this._send('value', x, isCurrent);
    if (this._n === 0) {
      this._send('end');
    }
  }
});





// .skip(n)

withOneSource('skip', {
  _init: function(args) {
    this._n = args[0] < 0 ? 0 : args[0];
  },
  _handleValue: function(x, isCurrent) {
    if (this._n === 0) {
      this._send('value', x, isCurrent);
    } else {
      this._n--;
    }
  }
});




// .skipDuplicates([fn])

withOneSource('skipDuplicates', {
  _init: function(args) {
    this._fn = args[0] && Fn(args[0], 2);
    this._prev = NOTHING;
  },
  _free: function() {
    this._fn = null;
    this._prev = null;
  },
  _isEqual: function(a, b) {
    return this._fn ? this._fn.invoke(a, b) : a === b;
  },
  _handleValue: function(x, isCurrent) {
    if (this._prev === NOTHING || !this._isEqual(this._prev, x)) {
      this._send('value', x, isCurrent);
      this._prev = x;
    }
  }
});





// .skipWhile(fn)

withOneSource('skipWhile', {
  _init: function(args) {
    this._fn = Fn(args[0], 1);
    this._skip = true;
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    if (!this._skip) {
      this._send('value', x, isCurrent);
      return;
    }
    if (!this._fn.invoke(x)) {
      this._skip = false;
      this._fn = null;
      this._send('value', x, isCurrent);
    }
  }
});





// .diff(seed, fn)

withOneSource('diff', {
  _init: function(args) {
    this._prev = args[0];
    this._fn = Fn(args[1], 2);
  },
  _free: function() {
    this._prev = null;
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    this._send('value', this._fn.invoke(this._prev, x), isCurrent);
    this._prev = x;
  }
});





// .scan(seed, fn)

withOneSource('scan', {
  _init: function(args) {
    this._send('value', args[0], true);
    this._fn = Fn(args[1], 2);
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    this._send('value', this._fn.invoke(this._current, x), isCurrent);
  }
}, {streamMethod: produceProperty});





// .reduce(seed, fn)

withOneSource('reduce', {
  _init: function(args) {
    this._result = args[0];
    this._fn = Fn(args[1], 2);
  },
  _free: function(){
    this._fn = null;
    this._result = null;
  },
  _handleValue: function(x) {
    this._result = this._fn.invoke(this._result, x);
  },
  _handleEnd: function(__, isCurrent) {
    this._send('value', this._result, isCurrent);
    this._send('end', null, isCurrent);
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
    var $ = this;
    this._$makeTrailingCall = function() {  $._makeTrailingCall()  };
  },
  _free: function() {
    this._trailingCallValue = null;
    this._$makeTrailingCall = null;
  },
  _handleValue: function(x, isCurrent) {
    if (isCurrent) {
      this._send('value', x, isCurrent);
    } else {
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
    }
  },
  _handleEnd: function(__, isCurrent) {
    if (isCurrent) {
      this._send('end', null, isCurrent);
    } else {
      if (this._trailingCallTimeoutId) {
        this._endAfterTrailingCall = true;
      } else {
        this._send('end');
      }
    }
  },
  _scheduleTralingCall: function(value, wait) {
    if (this._trailingCallTimeoutId) {
      this._cancelTralingCall();
    }
    this._trailingCallValue = value;
    this._trailingCallTimeoutId = setTimeout(this._$makeTrailingCall, wait);
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
    this._buff = [];
    var $ = this;
    this._shiftBuff = function() {
      $._send('value', $._buff.shift());
    }
  },
  _free: function() {
    this._buff = null;
    this._shiftBuff = null;
  },
  _handleValue: function(x, isCurrent) {
    if (isCurrent) {
      this._send('value', x, isCurrent);
    } else {
      this._buff.push(x);
      setTimeout(this._shiftBuff, this._wait);
    }
  },
  _handleEnd: function(__, isCurrent) {
    if (isCurrent) {
      this._send('end', null, isCurrent);
    } else {
      var $ = this;
      setTimeout(function() {  $._send('end')  }, this._wait);
    }
  }
});
