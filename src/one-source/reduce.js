import {createStream, createProperty} from '../patterns/one-source';
import {VALUE, NOTHING, END} from '../constants';

const mixin = {

  _init({fn, seed}) {
    this._fn = fn;
    this._result = seed;
  },

  _free() {
    this._fn = null;
    this._result = null;
  },

  _handleValue(x) {
    this._result = (this._result === NOTHING) ? x : this._fn(this._result, x);
  },

  _handleEnd(_, isCurrent) {
    if (this._result !== NOTHING) {
      this._send(VALUE, this._result, isCurrent);
    }
    this._send(END, null, isCurrent);
  }

};

export const ReduceStream = createStream('reduce', mixin);
export const ReduceProperty = createProperty('reduce', mixin);
