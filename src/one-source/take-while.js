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
    } else {
      this._emitEnd();
    }
  }

};

const S = createStream('takeWhile', mixin);
const P = createProperty('takeWhile', mixin);


const id = x => x;

module.exports = function takeWhile(obs, fn = id) {
  return new (obs._ofSameType(S, P))(obs, {fn});
};
