import withOneSource from './utils/with-one-source-helper';
import Stream from './stream';
import Property from './property';
import deprecated from './patterns/deprecated';
import {VALUE, ERROR, END, NOTHING} from './constants';
import {slide} from './utils/collections';


function id (x) {return x;}



// .flatten(fn)

withOneSource('flatten', {
  _init(args) {
    this._fn = args[0] ? args[0] : id;
  },
  _free() {
    this._fn = null;
  },
  _handleValue(x, isCurrent) {
    var xs = this._fn(x);
    for (var i = 0; i < xs.length; i++) {
      this._send(VALUE, xs[i], isCurrent);
    }
  }
});







// .transduce(transducer)

function xformForObs(obs) {
  return {
    '@@transducer/step'(res, input) {
      obs._send(VALUE, input, obs._forcedCurrent);
      return null;
    },
    '@@transducer/result'(res) {
      obs._send(END, null, obs._forcedCurrent);
      return null;
    }
  };
}

withOneSource('transduce', {
  _init(args) {
    this._xform = args[0](xformForObs(this));
  },
  _free() {
    this._xform = null;
  },
  _handleValue(x, isCurrent) {
    this._forcedCurrent = isCurrent;
    if (this._xform['@@transducer/step'](null, x) !== null) {
      this._xform['@@transducer/result'](null);
    }
    this._forcedCurrent = false;
  },
  _handleEnd(__, isCurrent) {
    this._forcedCurrent = isCurrent;
    this._xform['@@transducer/result'](null);
    this._forcedCurrent = false;
  }
});




// .last()

withOneSource('last', {
  _init() {
    this._lastValue = NOTHING;
  },
  _free() {
    this._lastValue = null;
  },
  _handleValue(x) {
    this._lastValue = x;
  },
  _handleEnd(__, isCurrent) {
    if (this._lastValue !== NOTHING) {
      this._send(VALUE, this._lastValue, isCurrent);
    }
    this._send(END, null, isCurrent);
  }
});







// .mapErrors(fn)

withOneSource('mapErrors', {
  _init(args) {
    this._fn = args[0] || id;
  },
  _free() {
    this._fn = null;
  },
  _handleError(x, isCurrent) {
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
  _init(args) {
    this._fn = args[0] || defaultErrorsToValuesHandler;
  },
  _free() {
    this._fn = null;
  },
  _handleError(x, isCurrent) {
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
  _init(args) {
    this._fn = args[0] || defaultValuesToErrorsHandler;
  },
  _free() {
    this._fn = null;
  },
  _handleValue(x, isCurrent) {
    var result = this._fn(x);
    var type = result.convert ? ERROR : VALUE;
    var newX = result.convert ? result.error : x;
    this._send(type, newX, isCurrent);
  }
});




// .filter(fn)

withOneSource('filter', {
  _init(args) {
    this._fn = args[0] || id;
  },
  _free() {
    this._fn = null;
  },
  _handleValue(x, isCurrent) {
    if (this._fn(x)) {
      this._send(VALUE, x, isCurrent);
    }
  }
});




// .filterErrors(fn)

withOneSource('filterErrors', {
  _init(args) {
    this._fn = args[0] || id;
  },
  _free() {
    this._fn = null;
  },
  _handleError(x, isCurrent) {
    if (this._fn(x)) {
      this._send(ERROR, x, isCurrent);
    }
  }
});




// .takeWhile(fn)

withOneSource('takeWhile', {
  _init(args) {
    this._fn = args[0] || id;
  },
  _free() {
    this._fn = null;
  },
  _handleValue(x, isCurrent) {
    if (this._fn(x)) {
      this._send(VALUE, x, isCurrent);
    } else {
      this._send(END, null, isCurrent);
    }
  }
});





// .take(n)

withOneSource('take', {
  _init(args) {
    this._n = args[0];
    if (this._n <= 0) {
      this._send(END);
    }
  },
  _handleValue(x, isCurrent) {
    this._n--;
    this._send(VALUE, x, isCurrent);
    if (this._n === 0) {
      this._send(END, null, isCurrent);
    }
  }
});





// .skip(n)

withOneSource('skip', {
  _init(args) {
    this._n = Math.max(0, args[0]);
  },
  _handleValue(x, isCurrent) {
    if (this._n === 0) {
      this._send(VALUE, x, isCurrent);
    } else {
      this._n--;
    }
  }
});




// .skipDuplicates([fn])

function strictEqual(a, b) {return a === b;}

withOneSource('skipDuplicates', {
  _init(args) {
    this._fn = args[0] || strictEqual;
    this._prev = NOTHING;
  },
  _free() {
    this._fn = null;
    this._prev = null;
  },
  _handleValue(x, isCurrent) {
    if (this._prev === NOTHING || !this._fn(this._prev, x)) {
      this._prev = x;
      this._send(VALUE, x, isCurrent);
    }
  }
});





// .skipWhile(fn)

withOneSource('skipWhile', {
  _init(args) {
    this._fn = args[0] || id;
    this._skip = true;
  },
  _free() {
    this._fn = null;
  },
  _handleValue(x, isCurrent) {
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

function defaultDiff(a, b) {return [a, b];}

withOneSource('diff', {
  _init(args) {
    this._fn = args[0] || defaultDiff;
    this._prev = args.length > 1 ? args[1] : NOTHING;
  },
  _free() {
    this._prev = null;
    this._fn = null;
  },
  _handleValue(x, isCurrent) {
    if (this._prev !== NOTHING) {
      this._send(VALUE, this._fn(this._prev, x), isCurrent);
    }
    this._prev = x;
  }
});





// .reduce(fn, seed)

withOneSource('reduce', {
  _init(args) {
    this._fn = args[0];
    this._result = args.length > 1 ? args[1] : NOTHING;
  },
  _free() {
    this._fn = null;
    this._result = null;
  },
  _handleValue(x) {
    this._result = (this._result === NOTHING) ? x : this._fn(this._result, x);
  },
  _handleEnd(__, isCurrent) {
    if (this._result !== NOTHING) {
      this._send(VALUE, this._result, isCurrent);
    }
    this._send(END, null, isCurrent);
  }
});

Stream.prototype.reduce = deprecated(
  '.reduce(fn, seed)',
  '.scan(fn, seed).last()',
  Stream.prototype.reduce
);

Property.prototype.reduce = deprecated(
  '.reduce(fn, seed)',
  '.scan(fn, seed).last()',
  Property.prototype.reduce
);



// .beforeEnd(fn)

withOneSource('beforeEnd', {
  _init(args) {
    this._fn = args[0];
  },
  _free() {
    this._fn = null;
  },
  _handleEnd(__, isCurrent) {
    this._send(VALUE, this._fn(), isCurrent);
    this._send(END, null, isCurrent);
  }
});




// .skipValue()

withOneSource('skipValues', {
  _handleValue() {}
});



// .skipError()

withOneSource('skipErrors', {
  _handleError() {}
});



// .skipEnd()

withOneSource('skipEnd', {
  _handleEnd() {}
});



// .endOnError()

withOneSource('endOnError', {
  _handleError(x, isCurrent) {
    this._send(ERROR, x, isCurrent);
    this._send(END, null, isCurrent);
  }
});



// .slidingWindow(max[, min])

withOneSource('slidingWindow', {
  _init(args) {
    this._max = args[0];
    this._min = args[1] || 0;
    this._buff = [];
  },
  _free() {
    this._buff = null;
  },
  _handleValue(x, isCurrent) {
    this._buff = slide(this._buff, x, this._max);
    if (this._buff.length >= this._min) {
      this._send(VALUE, this._buff, isCurrent);
    }
  }
});





// .delay()

withOneSource('delay', {
  _init(args) {
    this._wait = Math.max(0, args[0]);
    this._buff = [];
    var $ = this;
    this._$shiftBuff = function() {
      $._send(VALUE, $._buff.shift());
    };
  },
  _free() {
    this._buff = null;
    this._$shiftBuff = null;
  },
  _handleValue(x, isCurrent) {
    if (isCurrent) {
      this._send(VALUE, x, isCurrent);
    } else {
      this._buff.push(x);
      setTimeout(this._$shiftBuff, this._wait);
    }
  },
  _handleEnd(__, isCurrent) {
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



export default 'dummy';
