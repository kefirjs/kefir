const {createStream, createProperty} = require('../patterns/one-source');
const {NOTHING} = require('../constants');

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
    const fn = this._fn;
    this._result = (this._result === NOTHING) ? x : fn(this._result, x);
  },

  _handleEnd() {
    if (this._result !== NOTHING) {
      this._emitValue(this._result);
    }
    this._emitEnd();
  }

};

const S = createStream('reduce', mixin);
const P = createProperty('reduce', mixin);


module.exports = function reduce(obs, fn, seed = NOTHING) {
  return new (obs._ofSameType(S, P))(obs, {fn, seed});
};
