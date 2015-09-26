const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {
  _handleValue() {}
};

const S = createStream('ignoreValues', mixin);
const P = createProperty('ignoreValues', mixin);


module.exports = function ignoreValues(obs) {
  return new (obs._ofSameType(S, P))(obs);
};
