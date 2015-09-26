const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {

  _init({n}) {
    this._n = n;
    if (n <= 0) {
      this._emitEnd();
    }
  },

  _handleError(x) {
    this._n--;
    this._emitError(x);
    if (this._n === 0) {
      this._emitEnd();
    }
  }

};

const S = createStream('takeErrors', mixin);
const P = createProperty('takeErrors', mixin);


module.exports = function takeErrors(obs, n) {
  return new (obs._ofSameType(S, P))(obs, {n});
};
