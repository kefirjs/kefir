const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleError(x) {
    this._emitError(this._fn(x));
  }

};

const S = createStream('mapErrors', mixin);
const P = createProperty('mapErrors', mixin);


module.exports = function mapErrors(obs, fn) {
  return new (obs.ofSameType(S, P))(obs, {fn});
};
