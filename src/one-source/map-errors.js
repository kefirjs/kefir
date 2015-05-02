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
    this._send(ERROR, this._fn(x), isCurrent);
  }

};

export const MapErrorsStream = createStream('mapErrors', mixin);
export const MapErrorsProperty = createProperty('mapErrors', mixin);
