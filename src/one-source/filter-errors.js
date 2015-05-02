import {createStream, createProperty} from '../patterns/one-source';
import {ERROR} from '../constants';

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleError(x, isCurrent) {
    if (this._fn(x)) {
      this._send(ERROR, x, isCurrent);
    }
  }

};

export const FilterErrorsStream = createStream('filterErrors', mixin);
export const FilterErrorsProperty = createProperty('filterErrors', mixin);
