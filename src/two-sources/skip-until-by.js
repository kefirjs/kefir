const {createStream, createProperty} = require('../patterns/two-sources');
const {NOTHING} = require('../constants');


const mixin = {

  _handlePrimaryValue(x) {
    if (this._lastSecondary !== NOTHING) {
      this._emitValue(x);
    }
  },

  _handleSecondaryEnd() {
    if (this._lastSecondary === NOTHING) {
      this._emitEnd();
    }
  }

};

const S = createStream('skipUntilBy', mixin);
const P = createProperty('skipUntilBy', mixin);


module.exports = function skipUntilBy(primary, secondary) {
  return new (primary.ofSameType(S, P))(primary, secondary);
};

