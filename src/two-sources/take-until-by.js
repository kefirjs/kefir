const {createStream, createProperty} = require('../patterns/two-sources');

const mixin = {

  _handleSecondaryValue() {
    this._emitEnd();
  }

};

const S = createStream('takeUntilBy', mixin);
const P = createProperty('takeUntilBy', mixin);


module.exports = function takeUntilBy(primary, secondary) {
  return new (primary._ofSameType(S, P))(primary, secondary);
};

