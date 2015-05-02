import {createStream, createProperty} from '../patterns/one-source';
import {VALUE, END} from '../constants';

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleValue(x, isCurrent) {
    if (this._fn(x)) {
      this._send(VALUE, x, isCurrent);
    } else {
      this._send(END, null, isCurrent);
    }
  }

};

export const TakeWhileStream = createStream('takeWhile', mixin);
export const TakeWhileProperty = createProperty('takeWhile', mixin);
