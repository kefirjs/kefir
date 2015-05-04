const Stream = require('../stream');
const {END} = require('../constants');


const neverS = new Stream();
neverS._send(END);
neverS._name = 'never';

module.exports = function never() {
  return neverS;
}
