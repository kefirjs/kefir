const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {
  _handleError() {}
};

const S = createStream('skipErrors', mixin);
const P = createProperty('skipErrors', mixin);


module.exports = function skipErrors(obs) {
  return new (obs._ofSameType(S, P))(obs);
};
