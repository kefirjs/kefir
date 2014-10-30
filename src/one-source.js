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
    this._emitter = {
      emit: function(x) {  $._send('value', x, $._forcedCurrent)  },
      end: function() {  $._send('end', null, $._forcedCurrent)  }
    }
  },
  _free: function() {
    this._handler = null;
    this._emitter = null;
  },
  _handleAny: function(event) {
    this._forcedCurrent = event.current;
    this._handler.invoke(this._emitter, event);
    this._forcedCurrent = false;
  }
});




// .flatten(fn)

withOneSource('flatten', {
  _init: function(args) {
    this._fn = args[0] ? Fn(args[0], 1) : null;
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    var xs = this._fn === null ? x : this._fn.invoke(x);
    for (var i = 0; i < xs.length; i++) {
      this._send('value', xs[i], isCurrent);
    }
  }
});







// .transduce(transducer)

function xformForObs(obs) {
  return {
    init: function() {
      return null;
    },
    step: function(res, input) {
      obs._send('value', input, obs._forcedCurrent);
      return null;
    },
    result: function(res) {
      obs._send('end', null, obs._forcedCurrent);
      return null;
    }
  };
}

withOneSource('transduce', {
  _init: function(args) {
    this._xform = args[0](xformForObs(this));
    this._forcedCurrent = true;
    this._endIfReduced(this._xform.init());
    this._forcedCurrent = false;
  },
  _free: function() {
    this._xform = null;
  },
  _endIfReduced: function(obj) {
    if (obj !== null) {
      this._xform.result(null);
    }
  },
  _handleValue: function(x, isCurrent) {
    this._forcedCurrent = isCurrent;
    this._endIfReduced(this._xform.step(null, x));
    this._forcedCurrent = false;
  },
  _handleEnd: function(__, isCurrent) {
    this._forcedCurrent = isCurrent;
    this._xform.result(null);
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
    this._fn = args[0] ? Fn(args[0], 2) : null;
    this._prev = NOTHING;
  },
  _free: function() {
    this._fn = null;
    this._prev = null;
  },
  _isEqual: function(a, b) {
    return this._fn === null ? a === b : this._fn.invoke(a, b);
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
    this._fn = args[1] ? Fn(args[1], 2) : null;
  },
  _free: function() {
    this._prev = null;
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    var result = (this._fn === null) ?
      [this._prev, x] :
      this._fn.invoke(this._prev, x);
    this._send('value', result, isCurrent);
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
  _free: function() {
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




// .slidingWindow(max[, min])

withOneSource('slidingWindow', {
  _init: function(args) {
    this._max = args[0];
    this._min = args[1] || 0;
    this._cache = [];
  },
  _free: function() {
    this._cache = null;
  },
  _handleValue: function(x, isCurrent) {
    this._cache = slide(this._cache, x, this._max);
    if (this._cache.length >= this._min) {
      this._send('value', this._cache, isCurrent);
    }
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
      this._send('value', x, isCurrent);
    } else {
      this._lastAttempt = now();
      if (this._immediate && !this._timeoutId) {
        this._send('value', x);
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
      this._send('end', null, isCurrent);
    } else {
      if (this._timeoutId && !this._immediate) {
        this._endLater = true;
      } else {
        this._send('end');
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
        this._send('value', this._laterValue);
        this._laterValue = null;
      }
      if (this._endLater) {
        this._send('end');
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
      this._send('value', x, isCurrent);
    } else {
      var curTime = now();
      if (this._lastCallTime === 0 && !this._leading) {
        this._lastCallTime = curTime;
      }
      var remaining = this._wait - (curTime - this._lastCallTime);
      if (remaining <= 0) {
        this._cancelTraling();
        this._lastCallTime = curTime;
        this._send('value', x);
      } else if (this._trailing) {
        this._cancelTraling();
        this._trailingValue = x;
        this._timeoutId = setTimeout(this._$trailingCall, remaining);
      }
    }
  },
  _handleEnd: function(__, isCurrent) {
    if (isCurrent) {
      this._send('end', null, isCurrent);
    } else {
      if (this._timeoutId) {
        this._endLater = true;
      } else {
        this._send('end');
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
    this._send('value', this._trailingValue);
    this._timeoutId = null;
    this._trailingValue = null;
    this._lastCallTime = !this._leading ? 0 : now();
    if (this._endLater) {
      this._send('end');
    }
  }
});





// .delay()

withOneSource('delay', {
  _init: function(args) {
    this._wait = Math.max(0, args[0]);
    this._buff = [];
    var $ = this;
    this._$shiftBuff = function() {  $._send('value', $._buff.shift())  }
  },
  _free: function() {
    this._buff = null;
    this._$shiftBuff = null;
  },
  _handleValue: function(x, isCurrent) {
    if (isCurrent) {
      this._send('value', x, isCurrent);
    } else {
      this._buff.push(x);
      setTimeout(this._$shiftBuff, this._wait);
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
