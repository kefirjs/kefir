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
    if (this._fn !== null && !this._fn(x)) {
      this._fn = null;
    }
    if (this._fn === null) {
      this._send(VALUE, x, isCurrent);
    }
  }

};

exports.SkipWhileStream = createStream('skipWhile', mixin);
exports.SkipWhileProperty = createProperty('skipWhile', mixin);
