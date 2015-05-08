const {createStream, createProperty} = require('../patterns/two-sources');
const {NOTHING} = require('../constants');


const mixin = {

  _handlePrimaryValue(x) {
    if (this._lastSecondary !== NOTHING && this._lastSecondary) {
      this._emitValue(x);
    }
  },

  _handleSecondaryEnd() {
    if (this._lastSecondary === NOTHING || !this._lastSecondary) {
      this._emitEnd();
    }
  }

};

const S = createStream('filterBy', mixin);
const P = createProperty('filterBy', mixin);


module.exports = function filterBy(primary, secondary) {
  return new (primary.ofSameType(S, P))(primary, secondary);
};

