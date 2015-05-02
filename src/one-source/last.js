import {createStream, createProperty} from '../patterns/one-source';
import {VALUE, END, NOTHING} from '../constants';

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

export const LastStream = createStream('last', mixin);
export const LastProperty = createProperty('last', mixin);
