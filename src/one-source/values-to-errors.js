import {createStream, createProperty} from '../patterns/one-source';
import {VALUE, ERROR} from '../constants';

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleValue(x, isCurrent) {
    var result = this._fn(x);
    if (result.convert) {
      this._send(ERROR, result.error, isCurrent);
    } else {
      this._send(VALUE, x, isCurrent);
    }
  }

};

export const ValuesToErrorsStream = createStream('valuesToErrors', mixin);
export const ValuesToErrorsProperty = createProperty('valuesToErrors', mixin);
