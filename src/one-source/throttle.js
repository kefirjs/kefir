const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, END} = require('../constants');
const now = require('../utils/now');


const mixin = {

  _init({wait, leading, trailing}) {
    this._wait = Math.max(0, wait);
    this._leading = leading;
    this._trailing = trailing;
    this._trailingValue = null;
    this._timeoutId = null;
    this._endLater = false;
    this._lastCallTime = 0;
    this._$trailingCall = () => this._trailingCall();
  },

  _free() {
    this._trailingValue = null;
    this._$trailingCall = null;
  },

  _handleValue(x, isCurrent) {
    if (isCurrent) {
      this._send(VALUE, x, isCurrent);
    } else {
      let curTime = now();
      if (this._lastCallTime === 0 && !this._leading) {
        this._lastCallTime = curTime;
      }
      let remaining = this._wait - (curTime - this._lastCallTime);
      if (remaining <= 0) {
        this._cancelTrailing();
        this._lastCallTime = curTime;
        this._send(VALUE, x);
      } else if (this._trailing) {
        this._cancelTrailing();
        this._trailingValue = x;
        this._timeoutId = setTimeout(this._$trailingCall, remaining);
      }
    }
  },

  _handleEnd(_, isCurrent) {
    if (isCurrent) {
      this._send(END, null, isCurrent);
    } else {
      if (this._timeoutId) {
        this._endLater = true;
      } else {
        this._send(END);
      }
    }
  },

  _cancelTrailing() {
    if (this._timeoutId !== null) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  },

  _trailingCall() {
    this._send(VALUE, this._trailingValue);
    this._timeoutId = null;
    this._trailingValue = null;
    this._lastCallTime = !this._leading ? 0 : now();
    if (this._endLater) {
      this._send(END);
    }
  }

};

exports.ThrottleStream = createStream('throttle', mixin);
exports.ThrottleProperty = createProperty('throttle', mixin);
