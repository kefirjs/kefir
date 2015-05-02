import {createStream, createProperty} from '../patterns/one-source';
import {VALUE, END} from '../constants';

const mixin = {

  _init({n}) {
    this._n = n;
    if (n <= 0) {
      this._send(END);
    }
  },

  _handleValue(x, isCurrent) {
    this._n--;
    this._send(VALUE, x, isCurrent);
    if (this._n === 0) {
      this._send(END, null, isCurrent);
    }
  }

};

export const TakeStream = createStream('take', mixin);
export const TakeProperty = createProperty('take', mixin);
