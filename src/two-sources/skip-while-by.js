const {createStream, createProperty} = require('../patterns/two-sources');


const mixin = {

  _init() {
    this._hasFalseyFromSecondary = false;
  },

  _handlePrimaryValue(x) {
    if (this._hasFalseyFromSecondary) {
      this._emitValue(x);
    }
  },

  _handleSecondaryValue(x) {
    this._hasFalseyFromSecondary = this._hasFalseyFromSecondary || !x;
  },

  _handleSecondaryEnd() {
    if (!this._hasFalseyFromSecondary) {
      this._emitEnd();
    }
  }

};

const S = createStream('skipWhileBy', mixin);
const P = createProperty('skipWhileBy', mixin);


module.exports = function skipWhileBy(primary, secondary) {
  return new (primary._ofSameType(S, P))(primary, secondary);
};

