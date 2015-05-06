const Stream = require('../stream');


const neverS = new Stream();
neverS._emitEnd();
neverS._name = 'never';

module.exports = function never() {
  return neverS;
}
