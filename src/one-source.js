function produceStream(StreamClass, PropertyClass) {
  return function() {
    return new StreamClass(this, arguments);
  };
}
function produceProperty(StreamClass, PropertyClass) {
  return function() {
    return new PropertyClass(this, arguments);
  };
}



// .toProperty()

withOneSource('toProperty', {

  _init: function(args) {
    if (args[0] !== undefined) {
      if (isFn(args[0])) {
        this._getInitialCurrent = args[0];
      } else {
        throw new TypeError('The .toProperty method must be called with no args or with a function as an argument');
      }
    } else {
      this._getInitialCurrent = null;
    }
  },

  // redefining `_onActivation` from `withOneSource`
  _onActivation: function() {
    if (this._getInitialCurrent !== null) {
      var fn = this._getInitialCurrent;
      this._send(VALUE, fn(), true);
    }
    this._source.onAny(this._$handleAny); // copied from `withOneSource` impl of `_onActivation`
  }

}, {propertyMethod: produceProperty, streamMethod: produceProperty});





// .changes()

withOneSource('changes', {
  _handleValue: function(x, isCurrent) {
    if (!isCurrent) {
      this._send(VALUE, x);
    }
  },
  _handleError: function(x, isCurrent) {
    if (!isCurrent) {
      this._send(ERROR, x);
    }
  }
}, {
  streamMethod: produceStream,
  propertyMethod: produceStream
});




// .withHandler()

withOneSource('withHandler', {
  _init: function(args) {
    this._handler = args[0];
    this._forcedCurrent = false;
    var $ = this;
    this._emitter = {
      emit: function(x) {
        $._send(VALUE, x, $._forcedCurrent);
      },
      error: function(x) {
        $._send(ERROR, x, $._forcedCurrent);
      },
      end: function() {
        $._send(END, null, $._forcedCurrent);
      },
      emitEvent: function(e) {
        $._send(e.type, e.value, $._forcedCurrent);
      }
    };
  },
  _free: function() {
    this._handler = null;
    this._emitter = null;
  },
  _handleAny: function(event) {
    this._forcedCurrent = event.current;
    this._handler(this._emitter, event);
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
    var xs = this._fn(x);
    for (var i = 0; i < xs.length; i++) {
      this._send(VALUE, xs[i], isCurrent);
    }
  }
});







// .transduce(transducer)

function xformForObs(obs) {
  return {
    '@@transducer/step': function(res, input) {
      obs._send(VALUE, input, obs._forcedCurrent);
      return null;
    },
    '@@transducer/result': function(res) {
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
    if (this._xform['@@transducer/step'](null, x) !== null) {
      this._xform['@@transducer/result'](null);
    }
    this._forcedCurrent = false;
  },
  _handleEnd: function(__, isCurrent) {
    this._forcedCurrent = isCurrent;
    this._xform['@@transducer/result'](null);
    this._forcedCurrent = false;
  }
});








// .map(fn)

withOneSource('map', {
  _init: function(args) {
    this._fn = args[0] || id;
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    this._send(VALUE, this._fn(x), isCurrent);
  }
});




// .mapErrors(fn)

withOneSource('mapErrors', {
  _init: function(args) {
    this._fn = args[0] || id;
  },
  _free: function() {
    this._fn = null;
  },
  _handleError: function(x, isCurrent) {
    this._send(ERROR, this._fn(x), isCurrent);
  }
});



// .errorsToValues(fn)

function defaultErrorsToValuesHandler(x) {
  return {
    convert: true,
    value: x
  };
}

withOneSource('errorsToValues', {
  _init: function(args) {
    this._fn = args[0] || defaultErrorsToValuesHandler;
  },
  _free: function() {
    this._fn = null;
  },
  _handleError: function(x, isCurrent) {
    var result = this._fn(x);
    var type = result.convert ? VALUE : ERROR;
    var newX = result.convert ? result.value : x;
    this._send(type, newX, isCurrent);
  }
});



// .valuesToErrors(fn)

function defaultValuesToErrorsHandler(x) {
  return {
    convert: true,
    error: x
  };
}

withOneSource('valuesToErrors', {
  _init: function(args) {
    this._fn = args[0] || defaultValuesToErrorsHandler;
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    var result = this._fn(x);
    var type = result.convert ? ERROR : VALUE;
    var newX = result.convert ? result.error : x;
    this._send(type, newX, isCurrent);
  }
});




// .filter(fn)

withOneSource('filter', {
  _init: function(args) {
    this._fn = args[0] || id;
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    if (this._fn(x)) {
      this._send(VALUE, x, isCurrent);
    }
  }
});




// .filterErrors(fn)

withOneSource('filterErrors', {
  _init: function(args) {
    this._fn = args[0] || id;
  },
  _free: function() {
    this._fn = null;
  },
  _handleError: function(x, isCurrent) {
    if (this._fn(x)) {
      this._send(ERROR, x, isCurrent);
    }
  }
});




// .takeWhile(fn)

withOneSource('takeWhile', {
  _init: function(args) {
    this._fn = args[0] || id;
  },
  _free: function() {
    this._fn = null;
  },
  _handleValue: function(x, isCurrent) {
    if (this._fn(x)) {
      this._send(VALUE, x, isCurrent);
    } else {
      this._send(END, null, isCurrent);
    }
  }
});





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
    if (this._prev === NOTHING || !this._fn(this._prev, x)) {
      this._prev = x;
      this._send(VALUE, x, isCurrent);
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
    if (!this._fn(x)) {
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
      this._send(VALUE, this._fn(this._prev, x), isCurrent);
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
    if (this._currentEvent !== null && this._currentEvent.type !== ERROR) {
      x = this._fn(this._currentEvent.value, x);
    }
    this._send(VALUE, x, isCurrent);
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
    this._result = (this._result === NOTHING) ? x : this._fn(this._result, x);
  },
  _handleEnd: function(__, isCurrent) {
    if (this._result !== NOTHING) {
      this._send(VALUE, this._result, isCurrent);
    }
    this._send(END, null, isCurrent);
  }
});




// .beforeEnd(fn)

withOneSource('beforeEnd', {
  _init: function(args) {
    this._fn = args[0];
  },
  _free: function() {
    this._fn = null;
  },
  _handleEnd: function(__, isCurrent) {
    this._send(VALUE, this._fn(), isCurrent);
    this._send(END, null, isCurrent);
  }
});




// .skipValue()

withOneSource('skipValues', {
  _handleValue: function() {}
});



// .skipError()

withOneSource('skipErrors', {
  _handleError: function() {}
});



// .skipEnd()

withOneSource('skipEnd', {
  _handleEnd: function() {}
});



// .endOnError()

withOneSource('endOnError', {
  _handleError: function(x, isCurrent) {
    this._send(ERROR, x, isCurrent);
    this._send(END, null, isCurrent);
  }
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




// .bufferWhile([predicate], [options])

withOneSource('bufferWhile', {
  _init: function(args) {
    this._fn = args[0] || id;
    this._flushOnEnd = get(args[1], 'flushOnEnd', true);
    this._buff = [];
  },
  _free: function() {
    this._buff = null;
  },
  _flush: function(isCurrent) {
    if (this._buff !== null && this._buff.length !== 0) {
      this._send(VALUE, this._buff, isCurrent);
      this._buff = [];
    }
  },
  _handleValue: function(x, isCurrent) {
    this._buff.push(x);
    if (!this._fn(x)) {
      this._flush(isCurrent);
    }
  },
  _handleEnd: function(x, isCurrent) {
    if (this._flushOnEnd) {
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
    this._$later = function() {
      $._later();
    };
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
    this._$trailingCall = function() {
      $._trailingCall();
    };
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
    this._$shiftBuff = function() {
      $._send(VALUE, $._buff.shift());
    };
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
      setTimeout(function() {
        $._send(END);
      }, this._wait);
    }
  }
});
