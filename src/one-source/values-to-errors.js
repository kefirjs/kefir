const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, ERROR} = require('../constants');

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
      this._send(ERROR, result.error);
    } else {
      this._send(VALUE, x);
    }
  }

};

const S = createStream('valuesToErrors', mixin);
const P = createProperty('valuesToErrors', mixin);



module.exports = function valuesToErrors(obs, fn) {
  return new (obs.ofSameType(S, P))(obs, {fn});
};
