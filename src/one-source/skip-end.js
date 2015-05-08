const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {
  _handleEnd() {}
};

const S = createStream('skipEnd', mixin);
const P = createProperty('skipEnd', mixin);


module.exports = function skipEnd(obs) {
  return new (obs.ofSameType(S, P))(obs);
};
