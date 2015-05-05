const stream = require('./stream');

module.exports = function fromCallback(callbackConsumer) {

  let called = false;

  return stream(function(emitter) {

    if (!called) {
      callbackConsumer(function(x) {
        emitter.emit(x);
        emitter.end();
      });
      called = true;
    }

  }).setName('fromCallback');
};
