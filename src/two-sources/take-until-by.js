const {createStream, createProperty} = require('../patterns/two-sources');

const mixin = {

  _handleSecondaryValue(x) {
    this._emitEnd();
  }

};

const S = createStream('takeUntilBy', mixin);
const P = createProperty('takeUntilBy', mixin);


module.exports = function takeUntilBy(primary, secondary) {
  return new (primary.ofSameType(S, P))(primary, secondary);
};

