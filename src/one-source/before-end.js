const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, END} = require('../constants');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleEnd() {
    this._send(VALUE, this._fn());
    this._send(END);
  }

};

const S = createStream('beforeEnd', mixin);
const P = createProperty('beforeEnd', mixin);

module.exports = function beforeEnd(obs, fn) {
  return new (obs.ofSameType(S, P))(obs, {fn});
};
