const {createStream, createProperty} = require('../patterns/one-source');
const {NOTHING} = require('../constants');

const mixin = {

  _init({fn}) {
    this._fn = fn;
    this._prev = NOTHING;
  },

  _free() {
    this._fn = null;
    this._prev = null;
  },

  _handleValue(x) {
    if (this._prev === NOTHING || !this._fn(this._prev, x)) {
      this._prev = x;
      this._emitValue(x);
    }
  }

};

const S = createStream('skipDuplicates', mixin);
const P = createProperty('skipDuplicates', mixin);


module.exports = function skipDuplicates(obs, fn) {
  return new (obs.ofSameType(S, P))(obs, {fn});
};
