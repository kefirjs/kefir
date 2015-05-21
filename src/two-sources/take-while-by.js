const {createStream, createProperty} = require('../patterns/two-sources');
const {NOTHING} = require('../constants');


const mixin = {

  _handlePrimaryValue(x) {
    if (this._lastSecondary !== NOTHING) {
      this._emitValue(x);
    }
  },

  _handleSecondaryValue(x) {
    this._lastSecondary = x;
    if (!this._lastSecondary) {
      this._emitEnd();
    }
  },

  _handleSecondaryEnd() {
    if (this._lastSecondary === NOTHING) {
      this._emitEnd();
    }
  }

};

const S = createStream('takeWhileBy', mixin);
const P = createProperty('takeWhileBy', mixin);


module.exports = function takeWhileBy(primary, secondary) {
  return new (primary._ofSameType(S, P))(primary, secondary);
};

