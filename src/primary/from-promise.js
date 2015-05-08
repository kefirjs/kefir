const stream = require('./stream');
const toProperty = require('../one-source/to-property');


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
      if (_promise && typeof _promise.done === 'function') {
        _promise.done();
      }

      called = true;
    }
  })

  return toProperty(result, null).setName('fromPromise');

};
