const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {
  _handleError() {}
};

exports.SkipErrorsStream = createStream('skipErrors', mixin);
exports.SkipErrorsProperty = createProperty('skipErrors', mixin);
