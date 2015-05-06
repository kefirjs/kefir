const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleError(x) {
    const result = this._fn(x);
    if (result.convert) {
      this._emitValue(result.value);
    } else {
      this._emitError(x);
    }
  }

};

const S = createStream('errorsToValues', mixin);
const P = createProperty('errorsToValues', mixin);


module.exports = function errorsToValues(obs, fn) {
  return new (obs.ofSameType(S, P))(obs, {fn});
};
