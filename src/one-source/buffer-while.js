const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, END} = require('../constants');

const mixin = {

  _init({fn, flushOnEnd}) {
    this._fn = fn;
    this._flushOnEnd = flushOnEnd;
    this._buff = [];
  },

  _free() {
    this._buff = null;
  },

  _flush(isCurrent) {
    if (this._buff !== null && this._buff.length !== 0) {
      this._send(VALUE, this._buff, isCurrent);
      this._buff = [];
    }
  },

  _handleValue(x, isCurrent) {
    this._buff.push(x);
    if (!this._fn(x)) {
      this._flush(isCurrent);
    }
  },

  _handleEnd(x, isCurrent) {
    if (this._flushOnEnd) {
      this._flush(isCurrent);
    }
    this._send(END, null, isCurrent);
  }

};

exports.BufferWhileStream = createStream('bufferWhile', mixin);
exports.BufferWhileProperty = createProperty('bufferWhile', mixin);
