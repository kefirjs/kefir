const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE} = require('../constants');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleValue(x, isCurrent) {
    this._send(VALUE, this._fn(x), isCurrent);
  }

};

const S = createStream('map', mixin);
const P = createProperty('map', mixin);

module.exports = function map(obs, fn) {
  return new (obs.ofSameType(S, P))(obs, {fn});
};
