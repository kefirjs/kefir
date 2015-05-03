const {createStream, createProperty} = require('../patterns/one-source');
const {ERROR} = require('../constants');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleError(x, isCurrent) {
    this._send(ERROR, this._fn(x), isCurrent);
  }

};

exports.MapErrorsStream = createStream('mapErrors', mixin);
exports.MapErrorsProperty = createProperty('mapErrors', mixin);
