const {createStream, createProperty} = require('../patterns/one-source');
const {ERROR, END} = require('../constants');

const mixin = {

  _handleError(x, isCurrent) {
    this._send(ERROR, x, isCurrent);
    this._send(END, null, isCurrent);
  }

};

exports.EndOnErrorStream = createStream('endOnError', mixin);
exports.EndOnErrorProperty = createProperty('endOnError', mixin);
