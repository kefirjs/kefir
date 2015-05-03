const {createStream, createProperty} = require('../patterns/one-source');
const {ERROR, END} = require('../constants');

const mixin = {

  _handleError(x, isCurrent) {
    this._send(ERROR, x, isCurrent);
    this._send(END, null, isCurrent);
  }

};

const S = createStream('endOnError', mixin);
const P = createProperty('endOnError', mixin);


module.exports = function endOnError(obs) {
  return new (obs.ofSameType(S, P))(obs);
};
