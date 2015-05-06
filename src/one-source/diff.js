const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, NOTHING} = require('../constants');

const mixin = {

  _init({fn, seed}) {
    this._fn = fn;
    this._prev = seed;
  },

  _free() {
    this._prev = null;
    this._fn = null;
  },

  _handleValue(x) {
    if (this._prev !== NOTHING) {
      this._send(VALUE, this._fn(this._prev, x));
    }
    this._prev = x;
  }

};

const S = createStream('diff', mixin);
const P = createProperty('diff', mixin);


module.exports = function diff(obs, fn, seed) {
  return new (obs.ofSameType(S, P))(obs, {fn, seed});
};
