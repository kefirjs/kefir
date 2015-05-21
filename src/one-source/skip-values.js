const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {
  _handleValue() {}
};

const S = createStream('skipValues', mixin);
const P = createProperty('skipValues', mixin);


module.exports = function skipValues(obs) {
  return new (obs._ofSameType(S, P))(obs);
};
