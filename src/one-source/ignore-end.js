const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {
  _handleEnd() {}
};

const S = createStream('ignoreEnd', mixin);
const P = createProperty('ignoreEnd', mixin);


module.exports = function ignoreEnd(obs) {
  return new (obs._ofSameType(S, P))(obs);
};
