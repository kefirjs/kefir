const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, ERROR} = require('../constants');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleValue(x, isCurrent) {
    let result = this._fn(x);
    if (result.convert) {
      this._send(ERROR, result.error, isCurrent);
    } else {
      this._send(VALUE, x, isCurrent);
    }
  }

};

exports.ValuesToErrorsStream = createStream('valuesToErrors', mixin);
exports.ValuesToErrorsProperty = createProperty('valuesToErrors', mixin);
