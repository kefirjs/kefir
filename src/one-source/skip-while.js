const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE} = require('../constants');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleValue(x, isCurrent) {
    if (this._fn !== null && !this._fn(x)) {
      this._fn = null;
    }
    if (this._fn === null) {
      this._send(VALUE, x, isCurrent);
    }
  }

};

const S = createStream('skipWhile', mixin);
const P = createProperty('skipWhile', mixin);


module.exports = function skipWhile(obs, fn) {
  return new (obs.ofSameType(S, P))(obs, {fn});
};
