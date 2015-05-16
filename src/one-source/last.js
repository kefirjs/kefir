const {createStream, createProperty} = require('../patterns/one-source');
const {NOTHING} = require('../constants');

const mixin = {

  _init() {
    this._lastValue = NOTHING;
  },

  _free() {
    this._lastValue = null;
  },

  _handleValue(x) {
    this._lastValue = x;
  },

  _handleEnd() {
    if (this._lastValue !== NOTHING) {
      this._emitValue(this._lastValue);
    }
    this._emitEnd();
  }

};

const S = createStream('last', mixin);
const P = createProperty('last', mixin);


module.exports = function last(obs) {
  return new (obs._ofSameType(S, P))(obs);
};
