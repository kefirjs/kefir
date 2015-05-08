const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleValue(x) {
    const xs = this._fn(x);
    for (let i = 0; i < xs.length; i++) {
      this._emitValue(xs[i]);
    }
  }

};

const S = createStream('flatten', mixin);
const P = createProperty('flatten', mixin);


const id = x => x;

module.exports = function flatten(obs, fn = id) {
  return new (obs.ofSameType(S, P))(obs, {fn});
};
