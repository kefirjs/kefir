const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE} = require('../constants');

const mixin = {

  _init({n}) {
    this._n = Math.max(0, n);
  },

  _handleValue(x, isCurrent) {
    if (this._n === 0) {
      this._send(VALUE, x, isCurrent);
    } else {
      this._n--;
    }
  }

};

exports.SkipStream = createStream('skip', mixin);
exports.SkipProperty = createProperty('skip', mixin);
