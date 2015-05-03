const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, END, NOTHING} = require('../constants');

const mixin = {

  _init() {
    this._lastValue = NOTHING;
  },

  _free() {
    this._lastValue = null;
  },

  _handleValue(x) {
    this._lastValue = x;
  },

  _handleEnd(_, isCurrent) {
    if (this._lastValue !== NOTHING) {
      this._send(VALUE, this._lastValue, isCurrent);
    }
    this._send(END, null, isCurrent);
  }

};

exports.LastStream = createStream('last', mixin);
exports.LastProperty = createProperty('last', mixin);
