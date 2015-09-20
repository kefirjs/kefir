const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {
  _handleError() {}
};

const S = createStream('ignoreErrors', mixin);
const P = createProperty('ignoreErrors', mixin);


module.exports = function ignoreErrors(obs) {
  return new (obs._ofSameType(S, P))(obs);
};
