const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, END} = require('../constants');

const mixin = {

  _init({wait}) {
    this._wait = Math.max(0, wait);
    this._buff = [];
    this._$shiftBuff = () => this._send(VALUE, this._buff.shift());
  },

  _free() {
    this._buff = null;
    this._$shiftBuff = null;
  },

  _handleValue(x, isCurrent) {
    if (isCurrent) {
      this._send(VALUE, x, isCurrent);
    } else {
      this._buff.push(x);
      setTimeout(this._$shiftBuff, this._wait);
    }
  },

  _handleEnd(_, isCurrent) {
    if (isCurrent) {
      this._send(END, null, isCurrent);
    } else {
      setTimeout(() => this._send(END), this._wait);
    }
  }

};

exports.DelayStream = createStream('delay', mixin);
exports.DelayProperty = createProperty('delay', mixin);
