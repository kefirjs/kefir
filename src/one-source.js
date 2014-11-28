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
      this._send(VALUE, args[0]);
    }
  }
}, {propertyMethod: null, streamMethod: produceProperty});




// .withDefault()

withOneSource('withDefault', {
  _init: function(args) {
    this._send(VALUE, args[0], true);
  }
}, {propertyMethod: produceProperty, streamMethod: produceProperty});




// .changes()

withOneSource('changes', {
  _handleValue: function(x, isCurrent) {
    if (!isCurrent) {
      this._send(VALUE, x);
    }
  }
}, {streamMethod: null, propertyMethod: produceStream});




// .withHandler()

withOneSource('withHandler', {
  _init: function(args) {
    this._handler = args[0];
    this._forcedCurrent = false;
    var $ = this;
    this._emitter = {
      emit: function(x) {  $._send(VALUE, x, $._forcedCurrent)  },
      error: function(e) {  $._send(ERROR, e, $._forcedCurrent)  },
      end: function() {  $._send(END, null, $._forcedCurrent)  }
    }
  },
  _free: function() {
    this._handler = null;
    this._emitter = null;
  },
  _handleAny: function(event) {
    this._forcedCurrent = event.current;
    try {
      this._handler(this._emitter, event);
    } catch(e) {
      this._send(ERROR, e, this._forcedCurrent)
    }
    this._forcedCurrent = false;
  }
});




// .flatten(fn)

withOneSource('flatten', {
  _init: function(args) {
    this._fn = args[0] ? args[0] : id;
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    var xs = [];
    try {
      xs = this._fn(x);
    } catch(e) {
      this._send(ERROR, e, isCurrent);
    }
    for (var i = 0; i < xs.length; i++) {
      this._send(VALUE, xs[i], isCurrent);
    }
  }
});







// .transduce(transducer)

function xformForObs(obs) {
  return {
    step: function(res, input) {
      obs._send(VALUE, input, obs._forcedCurrent);
      return null;
    },
    result: function(res) {
      obs._send(END, null, obs._forcedCurrent);
      return null;
    }
  };
}

withOneSource('transduce', {
  _init: function(args) {
    this._xform = args[0](xformForObs(this));
  },
  _free: function() {
    this._xform = null;
  },
  _handleValue: function(x, isCurrent) {
    this._forcedCurrent = isCurrent;
    try {
      if (this._xform.step(null, x) !== null) {
        this._xform.result(null);
      }
    } catch(e) {
      this._send(ERROR, e, isCurrent);
    }
    this._forcedCurrent = false;
  },
  _handleEnd: function(__, isCurrent) {
    this._forcedCurrent = isCurrent;
    this._xform.result(null);
    this._forcedCurrent = false;
  }
});





var withFnArgMixin = {
  _init: function(args) {  this._fn = args[0] || id  },
  _free: function() {  this._fn = null  }
};



// .map(fn)

withOneSource('map', extend({
  _handleValue: function(x, isCurrent) {
    try {
      this._send(VALUE, this._fn(x), isCurrent);
    } catch(e) {
      this._send(ERROR, e, isCurrent);
    }
  }
}, withFnArgMixin));





// .filter(fn)

withOneSource('filter', extend({
  _handleValue: function(x, isCurrent) {
    try {
      if (this._fn(x)) {
        this._send(VALUE, x, isCurrent);
      }
    } catch(e) {
      this._send(ERROR, e, isCurrent);
    }
  }
}, withFnArgMixin));





// .takeWhile(fn)

withOneSource('takeWhile', extend({
  _handleValue: function(x, isCurrent) {
    var flag = false; //end on error
    try {
      flag = this._fn(x);
    } catch(e) {
      this._send(ERROR, e, isCurrent);
    }
    if (flag) {
      this._send(VALUE, x, isCurrent);
    } else {
      this._send(END, null, isCurrent);
    }
  }
}, withFnArgMixin));





// .take(n)

withOneSource('take', {
  _init: function(args) {
    this._n = args[0];
    if (this._n <= 0) {
      this._send(END);
    }
  },
  _handleValue: function(x, isCurrent) {
    this._n--;
    this._send(VALUE, x, isCurrent);
    if (this._n === 0) {
      this._send(END, null, isCurrent);
    }
  }
});





// .skip(n)

withOneSource('skip', {
  _init: function(args) {
    this._n = Math.max(0, args[0]);
  },
  _handleValue: function(x, isCurrent) {
    if (this._n === 0) {
      this._send(VALUE, x, isCurrent);
    } else {
      this._n--;
    }
  }
});




// .skipDuplicates([fn])

withOneSource('skipDuplicates', {
  _init: function(args) {
    this._fn = args[0] || strictEqual;
    this._prev = NOTHING;
  },
  _free: function() {
    this._fn = null;
    this._prev = null;
  },
  _handleValue: function(x, isCurrent) {
    var eql = false; //not eql by default if error
    try {
      eql = this._fn(this._prev, x);
    } catch(e) {
      this._send(ERROR, e, isCurrent);
    }
    if (this._prev === NOTHING || !eql) {
      this._send(VALUE, x, isCurrent);
      this._prev = x;
    }
  }
});





// .skipWhile(fn)

withOneSource('skipWhile', {
  _init: function(args) {
    this._fn = args[0] || id;
    this._skip = true;
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    if (!this._skip) {
      this._send(VALUE, x, isCurrent);
      return;
    }
    var skip = true;
    try {
      skip = this._fn(x);
    } catch(e) {
      this._send(ERROR, e, isCurrent);
    }
    if (!skip) {
      this._skip = false;
      this._fn = null;
      this._send(VALUE, x, isCurrent);
    }
  }
});





// .diff(fn, seed)

withOneSource('diff', {
  _init: function(args) {
    this._fn = args[0] || defaultDiff;
    this._prev = args.length > 1 ? args[1] : NOTHING;
  },
  _free: function() {
    this._prev = null;
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    if (this._prev !== NOTHING) {
      try {
        this._send(VALUE, this._fn(this._prev, x), isCurrent);
      } catch(e) {
        this._send(ERROR, e, isCurrent);
      }
    }
    this._prev = x;
  }
});





// .scan(fn, seed)

withOneSource('scan', {
  _init: function(args) {
    this._fn = args[0];
    if (args.length > 1) {
      this._send(VALUE, args[1], true);
    }
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    try {
      if (this._current !== NOTHING) {
        x = this._fn(this._current, x);
      }
      this._send(VALUE, x, isCurrent);
    } catch(e) {
      this._send(ERROR, e, isCurrent);
    }
  }
}, {streamMethod: produceProperty});





// .reduce(fn, seed)

withOneSource('reduce', {
  _init: function(args) {
    this._fn = args[0];
    this._result = args.length > 1 ? args[1] : NOTHING;
  },
  _free: function() {
    this._fn = null;
    this._result = null;
  },
  _handleValue: function(x) {
    if (this._result === NOTHING) {
      this._result = x;
    } else {
      try {
        this._result = this._fn(this._result, x);
      } catch(e) {
        this._send(ERROR, e);
      }
    }

  },
  _handleEnd: function(__, isCurrent) {
    if (this._result !== NOTHING) {
      this._send(VALUE, this._result, isCurrent);
    }
    this._send(END, null, isCurrent);
  }
});




// .mapEnd(fn)

withOneSource('mapEnd', {
  _init: function(args) {
    this._fn = args[0];
  },
  _free: function() {
    this._fn = null;
  },
  _handleEnd: function(__, isCurrent) {
    try {
      this._send(VALUE, this._fn(), isCurrent);
    } catch(e) {
      this._send(ERROR, e, isCurrent);
    }
    this._send(END, null, isCurrent);
  }
});




// .skipEnd()

withOneSource('skipEnd', {
  _handleEnd: function(__, isCurrent) {}
});




// .slidingWindow(max[, min])

withOneSource('slidingWindow', {
  _init: function(args) {
    this._max = args[0];
    this._min = args[1] || 0;
    this._buff = [];
  },
  _free: function() {
    this._buff = null;
  },
  _handleValue: function(x, isCurrent) {
    this._buff = slide(this._buff, x, this._max);
    if (this._buff.length >= this._min) {
      this._send(VALUE, this._buff, isCurrent);
    }
  }
});




// .bufferWhile([predicate])

withOneSource('bufferWhile', {
  _init: function(args) {
    this._fn = args[0] || id;
    this._buff = [];
  },
  _free: function() {
    this._buff = null;
  },
  _flush: function(isCurrent) {
    this._send(VALUE, this._buff, isCurrent);
    this._buff = [];
  },
  _handleValue: function(x, isCurrent) {
    this._buff.push(x);
    var flag = true;
    try {
      flag = this._fn(x);
    } catch(e) {
      this._send(ERROR, e, isCurrent);
    }
    if (!flag) {
      this._flush(isCurrent);
    }
  },
  _handleEnd: function(x, isCurrent) {
    if (this._buff.length !== 0) {
      this._flush(isCurrent);
    }
    this._send(END, null, isCurrent);
  }
});





// .debounce(wait, {immediate})

withOneSource('debounce', {
  _init: function(args) {
    this._wait = Math.max(0, args[0]);
    this._immediate = get(args[1], 'immediate', false);
    this._lastAttempt = 0;
    this._timeoutId = null;
    this._laterValue = null;
    this._endLater = false;
    var $ = this;
    this._$later = function() {  $._later()  };
  },
  _free: function() {
    this._laterValue = null;
    this._$later = null;
  },
  _handleValue: function(x, isCurrent) {
    if (isCurrent) {
      this._send(VALUE, x, isCurrent);
    } else {
      this._lastAttempt = now();
      if (this._immediate && !this._timeoutId) {
        this._send(VALUE, x);
      }
      if (!this._timeoutId) {
        this._timeoutId = setTimeout(this._$later, this._wait);
      }
      if (!this._immediate) {
        this._laterValue = x;
      }
    }
  },
  _handleEnd: function(__, isCurrent) {
    if (isCurrent) {
      this._send(END, null, isCurrent);
    } else {
      if (this._timeoutId && !this._immediate) {
        this._endLater = true;
      } else {
        this._send(END);
      }
    }
  },
  _later: function() {
    var last = now() - this._lastAttempt;
    if (last < this._wait && last >= 0) {
      this._timeoutId = setTimeout(this._$later, this._wait - last);
    } else {
      this._timeoutId = null;
      if (!this._immediate) {
        this._send(VALUE, this._laterValue);
        this._laterValue = null;
      }
      if (this._endLater) {
        this._send(END);
      }
    }
  }
});





// .throttle(wait, {leading, trailing})

withOneSource('throttle', {
  _init: function(args) {
    this._wait = Math.max(0, args[0]);
    this._leading = get(args[1], 'leading', true);
    this._trailing = get(args[1], 'trailing', true);
    this._trailingValue = null;
    this._timeoutId = null;
    this._endLater = false;
    this._lastCallTime = 0;
    var $ = this;
    this._$trailingCall = function() {  $._trailingCall()  };
  },
  _free: function() {
    this._trailingValue = null;
    this._$trailingCall = null;
  },
  _handleValue: function(x, isCurrent) {
    if (isCurrent) {
      this._send(VALUE, x, isCurrent);
    } else {
      var curTime = now();
      if (this._lastCallTime === 0 && !this._leading) {
        this._lastCallTime = curTime;
      }
      var remaining = this._wait - (curTime - this._lastCallTime);
      if (remaining <= 0) {
        this._cancelTraling();
        this._lastCallTime = curTime;
        this._send(VALUE, x);
      } else if (this._trailing) {
        this._cancelTraling();
        this._trailingValue = x;
        this._timeoutId = setTimeout(this._$trailingCall, remaining);
      }
    }
  },
  _handleEnd: function(__, isCurrent) {
    if (isCurrent) {
      this._send(END, null, isCurrent);
    } else {
      if (this._timeoutId) {
        this._endLater = true;
      } else {
        this._send(END);
      }
    }
  },
  _cancelTraling: function() {
    if (this._timeoutId !== null) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  },
  _trailingCall: function() {
    this._send(VALUE, this._trailingValue);
    this._timeoutId = null;
    this._trailingValue = null;
    this._lastCallTime = !this._leading ? 0 : now();
    if (this._endLater) {
      this._send(END);
    }
  }
});





// .delay()

withOneSource('delay', {
  _init: function(args) {
    this._wait = Math.max(0, args[0]);
    this._buff = [];
    var $ = this;
    this._$shiftBuff = function() {  $._send(VALUE, $._buff.shift())  }
  },
  _free: function() {
    this._buff = null;
    this._$shiftBuff = null;
  },
  _handleValue: function(x, isCurrent) {
    if (isCurrent) {
      this._send(VALUE, x, isCurrent);
    } else {
      this._buff.push(x);
      setTimeout(this._$shiftBuff, this._wait);
    }
  },
  _handleEnd: function(__, isCurrent) {
    if (isCurrent) {
      this._send(END, null, isCurrent);
    } else {
      var $ = this;
      setTimeout(function() {  $._send(END)  }, this._wait);
    }
  }
});
