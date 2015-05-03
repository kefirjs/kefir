const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE} = require('../constants');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleValue(x, isCurrent) {
    if (this._fn(x)) {
      this._send(VALUE, x, isCurrent);
    }
  }

};

exports.FilterStream = createStream('filter', mixin);
exports.FilterProperty = createProperty('filter', mixin);
