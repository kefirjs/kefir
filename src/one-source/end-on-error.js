import {createStream, createProperty} from '../patterns/one-source';
import {ERROR, END} from '../constants';

const mixin = {

  _handleError(x, isCurrent) {
    this._send(ERROR, x, isCurrent);
    this._send(END, null, isCurrent);
  }

};

export const EndOnErrorStream = createStream('endOnError', mixin);
export const EndOnErrorProperty = createProperty('endOnError', mixin);
