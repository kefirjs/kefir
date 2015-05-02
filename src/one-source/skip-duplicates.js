import {createStream, createProperty} from '../patterns/one-source';
import {VALUE, NOTHING} from '../constants';

const mixin = {

  _init({fn}) {
    this._fn = fn;
    this._prev = NOTHING;
  },

  _free() {
    this._fn = null;
    this._prev = null;
  },

  _handleValue(x, isCurrent) {
    if (this._prev === NOTHING || !this._fn(this._prev, x)) {
      this._prev = x;
      this._send(VALUE, x, isCurrent);
    }
  }

};

export const SkipDuplicatesStream = createStream('skipDuplicates', mixin);
export const SkipDuplicatesProperty = createProperty('skipDuplicates', mixin);
