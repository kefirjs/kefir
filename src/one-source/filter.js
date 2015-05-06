const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleValue(x) {
    if (this._fn(x)) {
      this._emitValue(x);
    }
  }

};

const S = createStream('filter', mixin);
const P = createProperty('filter', mixin);


module.exports = function filter(obs, fn) {
  return new (obs.ofSameType(S, P))(obs, {fn});
};
