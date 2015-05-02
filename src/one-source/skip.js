import {createStream, createProperty} from '../patterns/one-source';
import {VALUE} from '../constants';

const mixin = {

  _init({n}) {
    this._n = Math.max(0, n);
  },

  _handleValue(x, isCurrent) {
    if (this._n === 0) {
      this._send(VALUE, x, isCurrent);
    } else {
      this._n--;
    }
  }

};

export const SkipStream = createStream('skip', mixin);
export const SkipProperty = createProperty('skip', mixin);
