import {createStream, createProperty} from '../patterns/one-source';
import {VALUE} from '../constants';
import {slide} from '../utils/collections';

const mixin = {

  _init({min, max}) {
    this._max = max;
    this._min = min;
    this._buff = [];
  },

  _free() {
    this._buff = null;
  },

  _handleValue(x, isCurrent) {
    this._buff = slide(this._buff, x, this._max);
    if (this._buff.length >= this._min) {
      this._send(VALUE, this._buff, isCurrent);
    }
  }

};

export const SlidingWindowStream = createStream('slidingWindow', mixin);
export const SlidingWindowProperty = createProperty('slidingWindow', mixin);
