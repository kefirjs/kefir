const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, ERROR} = require('../constants');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleError(x, isCurrent) {
    const result = this._fn(x);
    if (result.convert) {
      this._send(VALUE, result.value, isCurrent);
    } else {
      this._send(ERROR, x, isCurrent);
    }
  }

};

exports.ErrorsToValuesStream = createStream('errorsToValues', mixin);
exports.ErrorsToValuesProperty = createProperty('errorsToValues', mixin);


