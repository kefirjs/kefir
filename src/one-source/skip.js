const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE} = require('../constants');

const mixin = {

  _init({n}) {
    this._n = Math.max(0, n);
  },

  _handleValue(x, isCurrent) {
    if (this._n === 0) {
      this._send(VALUE, x, isCurrent);
    } else {
      this._n--;
    }
  }

};

const S = createStream('skip', mixin);
const P = createProperty('skip', mixin);


module.exports = function skip(obs, n) {
  return new (obs.ofSameType(S, P))(obs, {n});
};
