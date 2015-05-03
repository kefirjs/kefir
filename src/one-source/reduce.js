const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, NOTHING, END} = require('../constants');

const mixin = {

  _init({fn, seed}) {
    this._fn = fn;
    this._result = seed;
  },

  _free() {
    this._fn = null;
    this._result = null;
  },

  _handleValue(x) {
    this._result = (this._result === NOTHING) ? x : this._fn(this._result, x);
  },

  _handleEnd(_, isCurrent) {
    if (this._result !== NOTHING) {
      this._send(VALUE, this._result, isCurrent);
    }
    this._send(END, null, isCurrent);
  }

};

const S = createStream('reduce', mixin);
const P = createProperty('reduce', mixin);


module.exports = function reduce(obs, fn, seed) {
  return new (obs.ofSameType(S, P))(obs, {fn, seed});
};
