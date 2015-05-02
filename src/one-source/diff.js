import {createStream, createProperty} from '../patterns/one-source';
import {VALUE, NOTHING} from '../constants';

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

export const DiffStream = createStream('diff', mixin);
export const DiffProperty = createProperty('diff', mixin);
