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
    } else {
      this._emitEnd();
    }
  }

};

const S = createStream('takeWhile', mixin);
const P = createProperty('takeWhile', mixin);


module.exports = function takeWhile(obs, fn) {
  return new (obs.ofSameType(S, P))(obs, {fn});
};
