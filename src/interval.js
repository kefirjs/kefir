const withInterval = require('./utils/with-interval-helper');
const Kefir = require('./kefir');
const deprecated = require('./patterns/deprecated');
const {VALUE, ERROR, END} = require('./constants');
const {cloneArray} = require('./utils/collections');



// Kefir.withInterval()

withInterval('withInterval', {
  _init(args) {
    this._fn = args[0];
    var $ = this;
    this._emitter = {
      emit(x) {
        $._send(VALUE, x);
      },
      error(x) {
        $._send(ERROR, x);
      },
      end() {
        $._send(END);
      },
      emitEvent(e) {
        $._send(e.type, e.value);
      }
    };
  },
  _free() {
    this._fn = null;
    this._emitter = null;
  },
  _onTick() {
    this._fn(this._emitter);
  }
});





// Kefir.fromPoll()

withInterval('fromPoll', {
  _init(args) {
    this._fn = args[0];
  },
  _free() {
    this._fn = null;
  },
  _onTick() {
    this._send(VALUE, this._fn());
  }
});





// Kefir.interval()

withInterval('interval', {
  _init(args) {
    this._x = args[0];
  },
  _free() {
    this._x = null;
  },
  _onTick() {
    this._send(VALUE, this._x);
  }
});




// Kefir.sequentially()

withInterval('sequentially', {
  _init(args) {
    this._xs = cloneArray(args[0]);
    if (this._xs.length === 0) {
      this._send(END);
    }
  },
  _free() {
    this._xs = null;
  },
  _onTick() {
    switch (this._xs.length) {
      case 1:
        this._send(VALUE, this._xs[0]);
        this._send(END);
        break;
      default:
        this._send(VALUE, this._xs.shift());
    }
  }
});




// Kefir.repeatedly()

withInterval('repeatedly', {
  _init(args) {
    this._xs = cloneArray(args[0]);
    this._i = -1;
  },
  _onTick() {
    if (this._xs.length > 0) {
      this._i = (this._i + 1) % this._xs.length;
      this._send(VALUE, this._xs[this._i]);
    }
  }
});

Kefir.repeatedly = deprecated(
  'Kefir.repeatedly()',
  'Kefir.repeat(() => Kefir.sequentially(...)})',
  Kefir.repeatedly
);





// Kefir.later()

withInterval('later', {
  _init(args) {
    this._x = args[0];
  },
  _free() {
    this._x = null;
  },
  _onTick() {
    this._send(VALUE, this._x);
    this._send(END);
  }
});
