const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {
  _handleValue() {}
};

exports.SkipValuesStream = createStream('skipValues', mixin);
exports.SkipValuesProperty = createProperty('skipValues', mixin);
