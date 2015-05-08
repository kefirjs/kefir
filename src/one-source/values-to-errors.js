const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleValue(x) {
    let result = this._fn(x);
    if (result.convert) {
      this._emitError(result.error);
    } else {
      this._emitValue(x);
    }
  }

};

const S = createStream('valuesToErrors', mixin);
const P = createProperty('valuesToErrors', mixin);


const defFn = x => ({convert: true, error: x});

module.exports = function valuesToErrors(obs, fn = defFn) {
  return new (obs.ofSameType(S, P))(obs, {fn});
};
