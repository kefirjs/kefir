const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleValue(x) {
    const fn = this._fn;
    if (fn(x)) {
      this._emitValue(x);
    }
  }

};

const S = createStream('filter', mixin);
const P = createProperty('filter', mixin);


const id = x => x;

module.exports = function filter(obs, fn = id) {
  return new (obs.ofSameType(S, P))(obs, {fn});
};
