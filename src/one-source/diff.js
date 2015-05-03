const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, NOTHING} = require('../constants');

const mixin = {

  _init({fn, seed}) {
    this._fn = fn;
    this._prev = seed;
  },

  _free() {
    this._prev = null;
    this._fn = null;
  },

  _handleValue(x, isCurrent) {
    if (this._prev !== NOTHING) {
      this._send(VALUE, this._fn(this._prev, x), isCurrent);
    }
    this._prev = x;
  }

};

exports.DiffStream = createStream('diff', mixin);
exports.DiffProperty = createProperty('diff', mixin);
