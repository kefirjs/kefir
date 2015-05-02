import {createStream, createProperty} from '../patterns/one-source';
import {VALUE, ERROR} from '../constants';

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleError(x, isCurrent) {
    const result = this._fn(x);
    if (result.convert) {
      this._send(VALUE, result.value, isCurrent);
    } else {
      this._send(ERROR, x, isCurrent);
    }
  }

};

export const ErrorsToValuesStream = createStream('errorsToValues', mixin);
export const ErrorsToValuesProperty = createProperty('errorsToValues', mixin);


