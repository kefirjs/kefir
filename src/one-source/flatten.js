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
    const xs = this._fn(x);
    for (let i = 0; i < xs.length; i++) {
      this._send(VALUE, xs[i], isCurrent);
    }
  }

};

export const FlattenStream = createStream('flatten', mixin);
export const FlattenProperty = createProperty('flatten', mixin);
