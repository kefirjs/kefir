const timeBased = require('../patterns/time-based');
const {VALUE, ERROR, END} = require('../constants');

const S = timeBased({

  _name: 'withInterval',

  _init({fn}) {
    this._fn = fn;
    this._emitter = {
      emit: (x) => this._send(VALUE, x),
      error: (x) => this._send(ERROR, x),
      end: () => this._send(END),
      emitEvent: (e) => this._send(e.type, e.value)
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


module.exports = function withInterval(wait, fn) {
  return new S(wait, {fn});
}
