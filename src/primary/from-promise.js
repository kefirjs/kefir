const stream = require('./stream');
const toProperty = require('../one-source/to-property');
const {isFn} = require('../utils/types');


module.exports = function fromPromise(promise) {

  let called = false;

  let result = stream(function(emitter) {
    if (!called) {
      let onValue = function(x) {
        emitter.emit(x);
        emitter.end();
      };
      let onError = function(x) {
        emitter.error(x);
        emitter.end();
      };
      let _promise = promise.then(onValue, onError);

      // prevent promise/A+ libraries like Q to swallow exceptions
      if (_promise && isFn(_promise.done)) {
        _promise.done();
      }

      called = true;
    }
  })

  return toProperty(result, null).setName('fromPromise');

};
