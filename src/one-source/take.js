const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, END} = require('../constants');

const mixin = {

  _init({n}) {
    this._n = n;
    if (n <= 0) {
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

};

const S = createStream('take', mixin);
const P = createProperty('take', mixin);


module.exports = function takeWhile(obs, n) {
  return new (obs.ofSameType(S, P))(obs, {n});
};
