import {createStream, createProperty} from '../patterns/one-source';
import {VALUE, END} from '../constants';

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleEnd(_, isCurrent) {
    this._send(VALUE, this._fn(), isCurrent);
    this._send(END, null, isCurrent);
  }

};

export const BeforeEndStream = createStream('beforeEnd', mixin);
export const BeforeEndProperty = createProperty('beforeEnd', mixin);
