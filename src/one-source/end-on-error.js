const {createStream, createProperty} = require('../patterns/one-source');
const {ERROR, END} = require('../constants');

const mixin = {

  _handleError(x) {
    this._send(ERROR, x);
    this._send(END);
  }

};

const S = createStream('endOnError', mixin);
const P = createProperty('endOnError', mixin);


module.exports = function endOnError(obs) {
  return new (obs.ofSameType(S, P))(obs);
};
