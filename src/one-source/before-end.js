const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, END} = require('../constants');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleEnd(_, isCurrent) {
    this._send(VALUE, this._fn(), isCurrent);
    this._send(END, null, isCurrent);
  }

};

const S = createStream('beforeEnd', mixin);
const P = createProperty('beforeEnd', mixin);

module.exports = function beforeEnd(obs, fn) {
  return new (obs.ofSameType(S, P))(obs, {fn});
};
