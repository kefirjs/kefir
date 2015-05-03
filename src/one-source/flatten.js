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
    const xs = this._fn(x);
    for (let i = 0; i < xs.length; i++) {
      this._send(VALUE, xs[i], isCurrent);
    }
  }

};

exports.FlattenStream = createStream('flatten', mixin);
exports.FlattenProperty = createProperty('flatten', mixin);
