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


const id = x => x;

module.exports = function map(obs, fn = id) {
  return new (obs.ofSameType(S, P))(obs, {fn});
};
