const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, END} = require('../constants');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleValue(x) {
    if (this._fn(x)) {
      this._send(VALUE, x);
    } else {
      this._send(END);
    }
  }

};

const S = createStream('takeWhile', mixin);
const P = createProperty('takeWhile', mixin);


module.exports = function takeWhile(obs, fn) {
  return new (obs.ofSameType(S, P))(obs, {fn});
};
