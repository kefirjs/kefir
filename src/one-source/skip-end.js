const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {
  _handleEnd() {}
};

exports.SkipEndStream = createStream('skipEnd', mixin);
exports.SkipEndProperty = createProperty('skipEnd', mixin);
