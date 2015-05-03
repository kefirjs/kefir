const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, ERROR} = require('../constants');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleError(x, isCurrent) {
    const result = this._fn(x);
    if (result.convert) {
      this._send(VALUE, result.value, isCurrent);
    } else {
      this._send(ERROR, x, isCurrent);
    }
  }

};

const S = createStream('errorsToValues', mixin);
const P = createProperty('errorsToValues', mixin);


module.exports = function errorsToValues(obs, fn) {
  return new (obs.ofSameType(S, P))(obs, {fn});
};
