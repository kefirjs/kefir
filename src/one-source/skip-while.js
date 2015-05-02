import {createStream, createProperty} from '../patterns/one-source';
import {VALUE} from '../constants';

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleValue(x, isCurrent) {
    if (this._fn !== null && !this._fn(x)) {
      this._fn = null;
    }
    if (this._fn === null) {
      this._send(VALUE, x, isCurrent);
    }
  }

};

export const SkipWhileStream = createStream('skipWhile', mixin);
export const SkipWhileProperty = createProperty('skipWhile', mixin);
