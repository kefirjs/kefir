const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleValue(x) {
    this._emitValue(this._fn(x));
  }

};

const S = createStream('map', mixin);
const P = createProperty('map', mixin);

module.exports = function map(obs, fn) {
  return new (obs.ofSameType(S, P))(obs, {fn});
};
